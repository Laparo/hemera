import { describe, it, expect, beforeEach, jest } from '@jest/globals';

const ORIGINAL_ENV = process.env;

// Deterministic random helper
const makeDeterministicRandom = (sequence: number[]) => {
  let i = 0;
  return () => sequence[i++ % sequence.length];
};

describe('Unit: Rollbar sampling logic', () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV } as NodeJS.ProcessEnv;
    delete process.env.ROLLBAR_SAMPLE_RATE_ALL;
    delete process.env.ROLLBAR_SAMPLE_RATE_INFO;
    delete process.env.ROLLBAR_SAMPLE_RATE_WARN;
    delete process.env.ROLLBAR_SAMPLE_RATE_ERROR;
    delete process.env.ROLLBAR_SAMPLE_RATE_CRITICAL;
    jest.resetModules();
  });

  it('samples non-errors at ~5% by default and errors at 100%', async () => {
    // Make Math.random deterministic across picks (two calls per pick):
    // For first INFO pick -> include: 0.01 (<0.05), 0.5 (<1)
    // For second INFO pick -> drop: 0.9 (>0.05), 0.5 (<1)
    const rnd = makeDeterministicRandom([0.01, 0.5, 0.9, 0.5]);
    const spy = jest.spyOn(Math, 'random').mockImplementation(rnd);

    const mod = await import('@/lib/monitoring/rollbar-official');

    const calls: any[] = [];
    (mod.serverInstance as any).info = (msg: any, payload: any) =>
      calls.push(['info', msg, payload]);
    (mod.serverInstance as any).error = (msg: any, payload: any) =>
      calls.push(['error', msg, payload]);

    // INFO: First pick should pass (0.01), second should drop (0.9)
    mod.reportError('I1', { requestId: 'r' }, mod.ErrorSeverity.INFO);
    mod.reportError('I2', { requestId: 'r' }, mod.ErrorSeverity.INFO);

    // ERROR: 100% pass
    mod.reportError('E1', { requestId: 'r' }, mod.ErrorSeverity.ERROR);
    mod.reportError('E2', { requestId: 'r' }, mod.ErrorSeverity.ERROR);

    // Expect 1 info (sampled in), 0 second info, and both errors
    const infoMsgs = calls.filter(c => c[0] === 'info').map(c => c[1]);
    const errorMsgs = calls.filter(c => c[0] === 'error').map(c => c[1]);

    expect(infoMsgs).toEqual(['I1']);
    expect(errorMsgs).toEqual(['E1', 'E2']);

    spy.mockRestore();
  });

  it('respects env overrides for sampling rates', async () => {
    process.env = {
      ...process.env,
      ROLLBAR_SAMPLE_RATE_ALL: '1',
      ROLLBAR_SAMPLE_RATE_INFO: '0',
      ROLLBAR_SAMPLE_RATE_ERROR: '0',
      ROLLBAR_SAMPLE_RATE_CRITICAL: '1',
    } as NodeJS.ProcessEnv;

    const rndSpy = jest.spyOn(Math, 'random').mockReturnValue(0.5);

    const mod = await import('@/lib/monitoring/rollbar-official');

    const calls: any[] = [];
    (mod.serverInstance as any).info = (msg: any, payload: any) =>
      calls.push(['info', msg, payload]);
    (mod.serverInstance as any).error = (msg: any, payload: any) =>
      calls.push(['error', msg, payload]);
    (mod.serverInstance as any).critical = (msg: any, payload: any) =>
      calls.push(['critical', msg, payload]);

    mod.reportError('I', { requestId: 'r' }, mod.ErrorSeverity.INFO); // dropped
    mod.reportError('E', { requestId: 'r' }, mod.ErrorSeverity.ERROR); // dropped
    mod.reportError('C', { requestId: 'r' }, mod.ErrorSeverity.CRITICAL); // pass

    const kinds = calls.map(c => c[0]);
    expect(kinds).toEqual(['critical']);

    rndSpy.mockRestore();
  });
});

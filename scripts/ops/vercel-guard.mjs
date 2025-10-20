#!/usr/bin/env node
/**
 * Vercel Guard
 * - Verifiziert projektweite Einstellungen gegen Team-Policy:
 *   1) Production Branch sollte "main" sein
 *   2) Keine letzten Deployments mit source = "git" (nur CLI‑Deploys erlaubt)
 *
 * Benötigte ENV:
 * - VERCEL_TOKEN        (GitHub Secret)
 * - VERCEL_ORG_ID       (GitHub Secret)
 * - VERCEL_PROJECT_ID   (GitHub Secret)
 */

const token = process.env.VERCEL_TOKEN;
const teamId = process.env.VERCEL_ORG_ID;
const projectId = process.env.VERCEL_PROJECT_ID;

if (!token || !teamId || !projectId) {
  console.error(
    '❌ vercel-guard: Missing required env (VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID)'
  );
  process.exit(2);
}

const API = 'https://api.vercel.com';

async function getJson(url) {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`HTTP ${res.status} for ${url}: ${body}`);
  }
  return res.json();
}

async function getProject() {
  // v9 projects endpoint
  const url = `${API}/v9/projects/${projectId}?teamId=${encodeURIComponent(teamId)}`;
  return getJson(url);
}

async function getRecentDeployments(limit = 20) {
  // v6 deployments endpoint supports projectId & teamId
  const url = `${API}/v6/deployments?projectId=${encodeURIComponent(projectId)}&teamId=${encodeURIComponent(
    teamId
  )}&limit=${limit}`;
  return getJson(url);
}

function pickProductionBranch(project) {
  // Try common shapes seen in Vercel API; be defensive
  const link = project.link || project.gitRepository || {};
  const branch =
    link.productionBranch ||
    project.productionBranch ||
    link.branch ||
    link.defaultBranch;
  return branch || null;
}

(async () => {
  try {
    console.log(
      '🔎 vercel-guard: Checking Vercel project and recent deployments…'
    );

    const project = await getProject();
    const deployments = await getRecentDeployments(25);

    let violations = [];

    // 1) Production branch policy
    const prodBranch = pickProductionBranch(project);
    if (prodBranch && prodBranch !== 'main') {
      violations.push(
        `Production branch is "${prodBranch}" but policy requires "main" (project: ${project.name || projectId})`
      );
    } else if (!prodBranch) {
      console.warn(
        '⚠️  Could not determine production branch from project; skipping branch check.'
      );
    } else {
      console.log(`✅ Production branch OK: ${prodBranch}`);
    }

    // 2) Disallow git-sourced deployments (we want CLI-only via GitHub Actions)
    const list = Array.isArray(deployments.deployments)
      ? deployments.deployments
      : deployments;
    const bySource = list.reduce((acc, d) => {
      const s = d.source || 'unknown';
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {});

    console.log('📦 Recent deployments by source:', bySource);

    if (bySource.git && bySource.git > 0) {
      violations.push(
        `Found ${bySource.git} recent deployment(s) with source = "git". Policy requires CLI-only deployments via GitHub Actions.`
      );
    }

    if (violations.length > 0) {
      console.error('\n❌ Vercel guard violations:');
      for (const v of violations) console.error(' - ' + v);
      process.exit(1);
    } else {
      console.log('\n✅ vercel-guard passed: No policy violations detected.');
      process.exit(0);
    }
  } catch (err) {
    console.error('❌ vercel-guard error:', err.message || err);
    process.exit(2);
  }
})();

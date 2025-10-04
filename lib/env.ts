export type Env = {
  NODE_ENV: 'development' | 'test' | 'production';
  NEXT_PUBLIC_APP_URL?: string;
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?: string;
  CLERK_SECRET_KEY?: string;
  DATABASE_URL?: string;
};

function getEnv(): Env {
  return {
    NODE_ENV: (process.env.NODE_ENV as Env['NODE_ENV']) || 'development',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
  };
}

export const env = getEnv();

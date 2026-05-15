import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  // Leave `outputFileTracingRoot` unset for Vercel builds to avoid
  // duplicate path issues during the build environment. If you have a
  // monorepo and need to set this, set it to the absolute monorepo root
  // path in your CI configuration instead of computing it here.
};

export default nextConfig;

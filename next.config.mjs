import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  // Point Next's outputFileTracingRoot to the repo workspace to silence
  // the "inferred workspace root" warning when multiple lockfiles exist.
  outputFileTracingRoot: resolve(__dirname, '..'),
};

export default nextConfig;

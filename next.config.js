/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['lucide-react'],
  typescript: {
    // ビルド時の型エラーを無視（一時的な対応）
    ignoreBuildErrors: true,
  },
  eslint: {
    // ビルド時のESLintエラーを無視（一時的な対応）
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
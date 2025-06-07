/** @type {import('next').NextConfig} */
const nextConfig = {
  // CDN 및 서브디렉토리 배포를 위한 설정
  // 환경변수로 제어 가능 (기본값은 빈 문자열로 현재 동작 유지)
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX || '',

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Railway 배포 최적화
  experimental: {
    // Railway 배포에 최적화된 설정만 유지 (문제 발생 설정 제거)
  },

  // [TRISID] Fast Refresh 최적화 - 폴링 활성화로 변경
  webpack: (config, { dev }) => {
    if (dev) {
      // Hot Reload 최적화 - 폴링 방식으로 변경하여 안정성 확보
      config.watchOptions = {
        poll: 1000, // 1초 간격으로 폴링 활성화
        ignored: [
          'node_modules/**',
          '.next/**',
          '.git/**',
          'public/uploads/**',
          'logs/**'
        ],
      };
    }
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
      {
        source: '/support/contact/:path*',
        destination: '/contact',
      },
      {
        source: '/support/contact',
        destination: '/contact',
      },
    ];
  },
  images: {
    unoptimized: true,
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH || '',
    NEXT_PUBLIC_ASSET_PREFIX: process.env.NEXT_PUBLIC_ASSET_PREFIX || '',
  },
  // 파일 서빙을 위한 설정
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          }
        ]
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/uploads/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  // 기본 설정만 유지
  env: {
    NEXT_TELEMETRY_DISABLED: '1'
  },
  // 웹팩 설정 제거 - Next.js 기본 설정 사용
};

module.exports = nextConfig;
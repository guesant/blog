import path from 'node:path';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const isProduction = process.env.NODE_ENV === 'production';

const tinaDevelopmentSources = isProduction
  ? ''
  : ' http://localhost:4001 http://127.0.0.1:4001 http://localhost:9000 http://127.0.0.1:9000 http://localhost:4100 http://127.0.0.1:4100';

const tinaDevelopmentConnections = isProduction
  ? ''
  : ' ws://localhost:4001 ws://127.0.0.1:4001 ws://localhost:9000 ws://127.0.0.1:9000';

const tinaDevelopmentFonts = isProduction
  ? ''
  : ' https://fonts.googleapis.com https://fonts.gstatic.com';

const frameAncestors = isProduction
  ? "'none'"
  : "'self' http://localhost:4001 http://127.0.0.1:4001 http://localhost:4100 http://127.0.0.1:4100";

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  `frame-ancestors ${frameAncestors}`,
  "form-action 'self'",
  `script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' ${isProduction ? '' : "'unsafe-eval' "}https://www.googletagmanager.com https://www.google-analytics.com${tinaDevelopmentSources}`,
  `script-src-elem 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com${tinaDevelopmentSources}`,
  `style-src 'self' 'unsafe-inline'${tinaDevelopmentFonts}`,
  `style-src-elem 'self' 'unsafe-inline'${tinaDevelopmentFonts}`,
  "img-src 'self' data: https:",
  `font-src 'self' data:${tinaDevelopmentFonts}`,
  `connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://*.google-analytics.com${tinaDevelopmentSources}${tinaDevelopmentConnections}`,
  "worker-src 'self' blob:",
  "manifest-src 'self'",
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  ...(process.env.NODE_ENV === 'production' ? [{ key: 'X-Frame-Options', value: 'DENY' }] : []),
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: isProduction ? [] : ['100.120.22.123'],
  transpilePackages: ['@portfolio/content'],
  output: 'standalone',
  outputFileTracingRoot: path.join(import.meta.dirname, '../..'),
  webpack(config) {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          '@': import.meta.dirname,
          ...(isProduction
            ? { '@portfolio/content/editing': '@portfolio/content/editing-static' }
            : {}),
        },
      },
    };
  },
  ...(isProduction
    ? {
        turbopack: {
          resolveAlias: {
            '@portfolio/content/editing': '@portfolio/content/editing-static',
          },
        },
      }
    : {}),
  typescript: {
    ignoreBuildErrors: true,
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
  async redirects() {
    return [
      { source: '/projetos', destination: '/projects', permanent: true },
      { source: '/projetos/:slug', destination: '/projects/:slug', permanent: true },
      {
        source: '/projetos/experimentos/:slug',
        destination: '/projects/experiments/:slug',
        permanent: true,
      },
      { source: '/escritos', destination: '/writing', permanent: true },
      { source: '/escritos/:slug', destination: '/writing/:slug', permanent: true },
      { source: '/sobre', destination: '/about', permanent: true },
      { source: '/contato', destination: '/contact', permanent: true },
      { source: '/curriculo', destination: '/resume', permanent: true },
      {
        source: '/achados/tipos/:tipo',
        destination: '/findings/types/:tipo',
        permanent: true,
      },
      { source: '/achados/:slug', destination: '/findings/:slug', permanent: true },
      { source: '/achados', destination: '/findings', permanent: true },
      { source: '/topicos/:slug', destination: '/topics/:slug', permanent: true },
      { source: '/topicos', destination: '/topics', permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);

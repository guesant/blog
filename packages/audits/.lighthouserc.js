const { readFileSync } = require('node:fs');
const path = require('node:path');
const { chromium } = require('@playwright/test');

const origin = 'http://localhost:3000';

const manifestPath = path.join(__dirname, '../start-app/scripts/ci/audited-routes.json');

function readRoutes() {
  try {
    return JSON.parse(readFileSync(manifestPath, 'utf8')).routes;
  } catch {
    throw new Error(
      `No route manifest at ${manifestPath}. Run "just build" first, ` +
        'since every audit target already depends on it.',
    );
  }
}

function toPortuguese(route) {
  return route === '/' ? '/pt-BR' : `/pt-BR${route}`;
}

const routes = readRoutes();

const url = [
  `${origin}/pt-BR`,
  ...routes.map((route, index) =>
    index % 2 === 0 ? `${origin}${route}` : `${origin}${toPortuguese(route)}`,
  ),
];

module.exports = {
  ci: {
    collect: {
      chromePath: process.env.CHROME_PATH ?? chromium.executablePath(),
      numberOfRuns: 3,
      startServerCommand: 'corepack pnpm --dir ../start-app start',
      startServerReadyPattern: 'Listening on',
      startServerReadyTimeout: 120000,
      url,
      settings: {
        chromeFlags: '--headless --no-sandbox --disable-dev-shm-usage',
        maxWaitForLoad: 90000,
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.7 }],
        'categories:accessibility': ['error', { minScore: 1 }],
        'categories:best-practices': ['error', { minScore: 1 }],
        'categories:seo': ['error', { minScore: 1 }],

        'resource-summary:script:size': ['error', { maxNumericValue: 460800 }],
        'resource-summary:total:size': ['error', { maxNumericValue: 753664 }],
        'resource-summary:font:size': ['error', { maxNumericValue: 163840 }],
        'resource-summary:third-party:size': ['error', { maxNumericValue: 51200 }],

        'http-status-code': 'error',
        'is-crawlable': 'error',
        canonical: 'error',
        hreflang: 'error',
        'robots-txt': 'error',
        'document-title': 'error',
        'meta-description': 'error',
        'link-text': 'error',
        'crawlable-anchors': 'error',
        viewport: 'error',
        'font-size': 'error',
        charset: 'error',

        'csp-xss': 'error',
        'errors-in-console': 'error',
        'inspector-issues': 'error',
        deprecations: 'error',
        'third-party-cookies': 'error',
        'geolocation-on-start': 'error',
        'notification-on-start': 'error',

        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'speed-index': ['error', { maxNumericValue: 3400 }],

        'duplicated-javascript': 'error',
        'modern-image-formats': 'error',
        'uses-responsive-images': 'error',
        'uses-text-compression': 'error',
        'uses-long-cache-ttl': 'error',

        'unused-css-rules': ['warn', { maxNumericValue: 20480 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'total-blocking-time': ['warn', { maxNumericValue: 200 }],
        interactive: ['warn', { maxNumericValue: 3800 }],
        'max-potential-fid': ['warn', { maxNumericValue: 130 }],
        'unused-javascript': ['warn', { maxNumericValue: 20480 }],
        'legacy-javascript': ['warn', { maxNumericValue: 0 }],
        'render-blocking-resources': ['warn', { maxNumericValue: 0 }],
        'bootup-time': ['warn', { maxNumericValue: 2000 }],
        'mainthread-work-breakdown': ['warn', { maxNumericValue: 2000 }],
        'total-byte-weight': ['warn', { maxNumericValue: 786432 }],
        'dom-size': ['warn', { maxNumericValue: 800 }],
      },
    },
  },
};

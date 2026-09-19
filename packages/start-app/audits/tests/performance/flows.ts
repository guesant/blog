import type { Page } from '@playwright/test';

export type PerformanceFlow = {
  name: string;
  purpose: string;
  viewport?: { width: number; height: number };
  prepare: (page: Page) => Promise<void>;
  interact: (page: Page) => Promise<void>;
};

async function nextFrame(page: Page): Promise<void> {
  await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())));
}

async function waitFrames(page: Page, count: number): Promise<void> {
  for (let frame = 0; frame < count; frame += 1) {
    await nextFrame(page);
  }
}

async function settle(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle');
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        requestIdleCallback(() => resolve(), { timeout: 2000 });
      }),
  );
}

async function openRoute(page: Page, path: string): Promise<void> {
  await page.goto(path);
  await settle(page);
}

async function assertCursorMoved(page: Page): Promise<void> {
  const transform = await page
    .locator('.contextual-cursor-dot')
    .evaluate((node: HTMLElement) => node.style.transform);

  if (!transform) {
    throw new Error(
      'The contextual cursor never moved, so this flow measured nothing. Check that the ' +
        'performance config still sets contextOptions.reducedMotion to no-preference.',
    );
  }
}

async function sweepPointer(page: Page): Promise<void> {
  const viewport = page.viewportSize() ?? { width: 1280, height: 720 };

  for (let sweep = 0; sweep < 4; sweep += 1) {
    await page.mouse.move(viewport.width * 0.2, viewport.height * 0.3, { steps: 24 });
    await page.mouse.move(viewport.width * 0.8, viewport.height * 0.7, { steps: 24 });
    await nextFrame(page);
  }

  await assertCursorMoved(page);
}

async function assertPageScrolled(page: Page): Promise<void> {
  const scrollY = await page.evaluate(() => window.scrollY);
  if (scrollY === 0) {
    throw new Error(
      'The page never scrolled, so no reveal was triggered and nothing was measured.',
    );
  }
}

async function scrollThroughReveals(page: Page): Promise<void> {
  for (let step = 0; step < 12; step += 1) {
    await page.mouse.wheel(0, 400);
    await nextFrame(page);
  }

  await assertPageScrolled(page);
}

async function navigateToAbout(page: Page): Promise<void> {
  await page.locator('header a[href="/pt-BR/about"]').first().click();
  await page.waitForURL('**/pt-BR/about');
  await page.locator('main h1').first().waitFor({ state: 'visible' });
  await waitFrames(page, 24);
}

async function toggleMobileDrawer(page: Page): Promise<void> {
  await page.locator('header .MuiIconButton-root').first().click();
  await page.locator('.MuiDrawer-paper').waitFor({ state: 'visible' });
  await waitFrames(page, 12);
}

export const performanceFlows: PerformanceFlow[] = [
  {
    name: 'cursor-pointer-move',
    purpose: 'Forced style and layout driven by the contextual cursor rAF loop.',
    prepare: (page) => openRoute(page, '/pt-BR/cases'),
    interact: sweepPointer,
  },
  {
    name: 'scroll-reveal',
    purpose: 'Concurrent motion whileInView reveals plus useScroll and MUI useScrollTrigger.',
    prepare: (page) => openRoute(page, '/pt-BR'),
    interact: scrollThroughReveals,
  },
  {
    name: 'client-navigation',
    purpose: 'Click latency and the page transition between two routes.',
    prepare: (page) => openRoute(page, '/pt-BR'),
    interact: navigateToAbout,
  },
  {
    name: 'mobile-drawer',
    purpose: 'MUI Drawer mount cost and Emotion runtime style injection.',
    viewport: { width: 390, height: 844 },
    prepare: (page) => openRoute(page, '/pt-BR'),
    interact: toggleMobileDrawer,
  },
];

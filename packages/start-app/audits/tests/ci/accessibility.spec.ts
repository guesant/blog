import AxeBuilder from '@axe-core/playwright';
import { expect, type Page, test } from '@playwright/test';
import { auditedRoutes } from './routes';

const requiredAxeTags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

const advisoryAxeTags = [
  'wcag2aaa',
  'best-practice',
  'experimental',
  'ACT',
  'EN-301-549',
  'TTv5',
  'section508',
];

type AxeViolation = Awaited<ReturnType<AxeBuilder['analyze']>>['violations'][number];

function isBlocking(violation: AxeViolation) {
  return (
    !violation.tags.includes('experimental') &&
    violation.tags.some((tag) => requiredAxeTags.includes(tag))
  );
}

function summarizeViolations(violations: AxeViolation[]) {
  return violations
    .map((violation) => `${violation.id} (${violation.nodes.length} nodes)`)
    .join(', ');
}

async function openAuditedRoute(page: Page, path: string) {
  await page.addInitScript(() => {
    window.localStorage.setItem('portfolio:analytics-consent:v1', 'denied');
  });
  const response = await page.goto(path, { waitUntil: 'networkidle' });
  expect(response?.status(), `HTTP status for ${path}`).toBeLessThan(400);
}

async function assertAxeAudit(page: Page, path: string) {
  await openAuditedRoute(page, path);
  const results = await new AxeBuilder({ page })
    .withTags([...requiredAxeTags, ...advisoryAxeTags])
    .analyze();

  const advisory = results.violations.filter((violation) => !isBlocking(violation));
  if (advisory.length > 0) {
    const summary = summarizeViolations(advisory);
    await test.info().attach(`axe-advisory${path.replaceAll('/', '_')}.json`, {
      body: JSON.stringify(advisory, null, 2),
      contentType: 'application/json',
    });
    test.info().annotations.push({ type: 'axe-advisory', description: `${path}: ${summary}` });
  }

  const blocking = results.violations.filter(isBlocking);
  expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
}

async function assertNamedLandmarksAndControls(page: Page) {
  await expect(page.getByRole('main')).toHaveCount(1);
  await expect(page.getByRole('banner')).toHaveCount(1);
  expect(await page.getByRole('navigation').count()).toBeGreaterThan(0);
  const elements = await page
    .locator(
      'a[href], button, input:not([type="hidden"]), select, textarea, [role="button"], [role="link"]',
    )
    .all();
  for (const element of elements) {
    if (await element.isVisible()) {
      await expect(element).toHaveAccessibleName(/\S/u);
    }
  }
}

async function assertHeadingHierarchy(page: Page) {
  const headings = await page.locator('h1, h2, h3, h4, h5, h6').evaluateAll((elements) =>
    elements
      .filter((element) => (element as HTMLElement).offsetParent !== null)
      .map((element) => ({
        level: Number(element.tagName.slice(1)),
        text: element.textContent?.trim() ?? '',
      })),
  );
  expect(
    headings.filter((heading) => heading.level === 1),
    JSON.stringify(headings),
  ).toHaveLength(1);
  expect(
    headings.every((heading) => heading.text.length > 0),
    JSON.stringify(headings),
  ).toBe(true);
  for (const [index, heading] of headings.entries()) {
    const previous = headings[index - 1];
    if (previous) {
      expect(heading.level).toBeLessThanOrEqual(previous.level + 1);
    }
  }
}

async function assertIdsAndAriaReferences(page: Page) {
  const idAudit = await page.locator('[id]').evaluateAll((elements) => {
    const ids = elements.map((element) => element.id);
    return {
      duplicates: ids.filter((id, index) => ids.indexOf(id) !== index),
      empty: ids.filter((id) => id.trim().length === 0),
    };
  });
  expect(idAudit.empty).toEqual([]);
  expect([...new Set(idAudit.duplicates)]).toEqual([]);
  const references = await page
    .locator('[aria-labelledby], [aria-describedby], [aria-controls], [aria-owns]')
    .evaluateAll((elements) =>
      elements.flatMap((element) =>
        ['aria-labelledby', 'aria-describedby', 'aria-controls', 'aria-owns'].flatMap((attribute) =>
          (element.getAttribute(attribute) ?? '')
            .split(/\s+/u)
            .filter(Boolean)
            .filter((id) => !document.getElementById(id))
            .map((id) => `${attribute}="${id}"`),
        ),
      ),
    );
  expect(references).toEqual([]);
}

type FocusState = {
  outlineStyle: string;
  outlineWidth: string;
  boxShadow: string;
  id: string;
};

function hasVisibleFocusIndicator(state: FocusState) {
  const width = Number.parseFloat(state.outlineWidth) || 0;
  const outlined = state.outlineStyle !== 'none' && width > 0;
  return outlined || state.boxShadow !== 'none';
}

function readFocusState(page: Page) {
  return page.evaluate(() => {
    const element = document.activeElement;
    if (!(element instanceof HTMLElement) || element === document.body) {
      return null;
    }
    const style = window.getComputedStyle(element);
    return {
      outlineStyle: style.outlineStyle,
      outlineWidth: style.outlineWidth,
      boxShadow: style.boxShadow,
      id: `${element.tagName}:${element.id}:${element.textContent?.trim() ?? ''}`.slice(0, 100),
    };
  });
}

async function waitForVisibleFocusIndicatorAfterTransitions(page: Page, description: string) {
  await expect
    .poll(async () => {
      const state = await readFocusState(page);
      return state !== null && hasVisibleFocusIndicator(state);
    }, description)
    .toBe(true);
  const state = await readFocusState(page);
  if (state === null) {
    throw new Error(description);
  }
  return state;
}

async function assertKeyboardNavigation(page: Page, path: string) {
  const visited = new Set<string>();
  for (let index = 0; index < 10; index += 1) {
    await page.keyboard.press('Tab');
    const state = await waitForVisibleFocusIndicatorAfterTransitions(
      page,
      `visible focus after Tab ${index + 1} on ${path}`,
    );
    visited.add(state.id);
  }
  expect(visited.size).toBeGreaterThan(1);
}

async function assertReflow(page: Page, path: string) {
  await page.setViewportSize({ width: 320, height: 640 });
  await openAuditedRoute(page, path);
  const overflow = await page.evaluate(() => {
    const root = document.documentElement;
    const offenders = [...document.querySelectorAll<HTMLElement>('body *')]
      .filter((element) => element.getBoundingClientRect().right > root.clientWidth + 1)
      .slice(0, 5)
      .map((element) => `${element.tagName}.${element.className}`.slice(0, 120));
    return { documentWidth: root.scrollWidth, viewportWidth: root.clientWidth, offenders };
  });
  expect(
    overflow.documentWidth,
    `horizontal scrolling at 320px on ${path}: ${overflow.offenders.join(' | ')}`,
  ).toBeLessThanOrEqual(overflow.viewportWidth + 1);
}

for (const route of auditedRoutes) {
  test(`${route.path} has no detectable WCAG A/AA violations`, async ({ page }) => {
    await assertAxeAudit(page, route.path);
  });

  test(`${route.path} exposes named landmarks, controls and a valid heading hierarchy`, async ({
    page,
  }) => {
    await openAuditedRoute(page, route.path);
    await assertNamedLandmarksAndControls(page);
    await assertHeadingHierarchy(page);
  });

  test(`${route.path} has unique IDs and resolvable ARIA references`, async ({ page }) => {
    await openAuditedRoute(page, route.path);
    await assertIdsAndAriaReferences(page);
  });

  test(`${route.path} supports sequential keyboard navigation`, async ({ page }) => {
    await openAuditedRoute(page, route.path);
    await assertKeyboardNavigation(page, route.path);
  });

  test(`${route.path} reflows at a 320px viewport`, async ({ page }) => {
    await assertReflow(page, route.path);
  });
}

test('skip link lets keyboard users jump straight to main content', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  const skipLink = page.getByRole('link', { name: 'Skip to content' });
  await page.keyboard.press('Tab');
  await expect(skipLink).toBeFocused();

  await page.keyboard.press('Enter');
  await expect(page.locator('#main-content')).toBeFocused();
});

for (const viewport of [768, 1024, 1440]) {
  test(`contact actions fit their container at ${viewport}px`, async ({ page }) => {
    await page.setViewportSize({ width: viewport, height: 900 });
    await page.goto('/en/contact', { waitUntil: 'networkidle' });

    const actions = page.getByTestId('contact-actions');
    const bounds = await actions.evaluate((container) => {
      const containerBounds = container.getBoundingClientRect();
      return {
        container: { left: containerBounds.left, right: containerBounds.right },
        links: [...container.querySelectorAll('a, button')].map((link) => {
          const element = link as HTMLElement;
          const bounds = element.getBoundingClientRect();
          return {
            bottom: bounds.bottom,
            clientHeight: element.clientHeight,
            clientWidth: element.clientWidth,
            left: bounds.left,
            right: bounds.right,
            scrollHeight: element.scrollHeight,
            scrollWidth: element.scrollWidth,
            top: bounds.top,
          };
        }),
      };
    });

    expect(bounds.links).toHaveLength(7);
    for (const button of bounds.links) {
      expect(button.left).toBeGreaterThanOrEqual(bounds.container.left - 0.5);
      expect(button.right).toBeLessThanOrEqual(bounds.container.right + 0.5);
      expect(button.scrollHeight).toBeLessThanOrEqual(button.clientHeight);
      expect(button.scrollWidth).toBeLessThanOrEqual(button.clientWidth);
      expect(button.bottom).toBeGreaterThan(button.top);
    }
  });
}

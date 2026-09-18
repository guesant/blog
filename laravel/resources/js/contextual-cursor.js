const interactiveSelector = [
  'a[href]',
  'button:not([disabled])',
  '[role="button"]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'summary',
  '[tabindex]:not([tabindex="-1"])',
  '[data-cursor-interactive]',
].join(',');

const nativeCursorSelector = [
  'input',
  'select',
  'textarea',
  '[contenteditable="true"]',
  '[data-native-cursor]',
].join(',');

const interpolate = (current, target, amount) => current + (target - current) * amount;

function getTargetRadius(element, width, height) {
  const rawRadius = getComputedStyle(element).borderTopLeftRadius;
  const parsedRadius = Number.parseFloat(rawRadius) || 0;
  const radius = rawRadius.endsWith('%')
    ? Math.min(width, height) * (parsedRadius / 100)
    : parsedRadius + 6;
  return Math.min(radius, width / 2, height / 2);
}

const isMousePointer = (event) => !event.pointerType || event.pointerType === 'mouse';

class CursorController {
  pointerX = -100;
  pointerY = -100;
  frameX = -100;
  frameY = -100;
  frameWidth = 34;
  frameHeight = 34;
  frameRadius = 17;
  hoveredElement = null;
  animationFrame = 0;

  constructor(dot, frame) {
    this.dot = dot;
    this.frame = frame;
  }

  setVisible(visible) {
    const opacity = visible ? '1' : '0';
    this.dot.style.opacity = opacity;
    this.frame.style.opacity = opacity;
  }

  updateTarget = (event) => {
    if (!isMousePointer(event)) return;

    this.pointerX = event.clientX;
    this.pointerY = event.clientY;

    const eventTarget = event.target instanceof Element ? event.target : null;
    if (eventTarget?.closest(nativeCursorSelector)) {
      this.hoveredElement = null;
      this.setVisible(false);
      return;
    }

    this.hoveredElement = eventTarget?.closest(interactiveSelector) ?? null;
    this.frame.dataset.active = String(Boolean(this.hoveredElement));
    this.setVisible(true);
  };

  hideCursor = () => this.setVisible(false);

  showCursor = () => this.setVisible(true);

  target() {
    if (!this.hoveredElement?.isConnected) {
      this.hoveredElement = null;
      this.frame.dataset.active = 'false';
      return { x: this.pointerX, y: this.pointerY, width: 34, height: 34, radius: 17 };
    }

    const rect = this.hoveredElement.getBoundingClientRect();
    const width = rect.width + 12;
    const height = rect.height + 12;
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      width,
      height,
      radius: getTargetRadius(this.hoveredElement, width, height),
    };
  }

  animate = () => {
    const target = this.target();
    this.frameX = interpolate(this.frameX, target.x, 0.2);
    this.frameY = interpolate(this.frameY, target.y, 0.2);
    this.frameWidth = interpolate(this.frameWidth, target.width, 0.18);
    this.frameHeight = interpolate(this.frameHeight, target.height, 0.18);
    this.frameRadius = interpolate(this.frameRadius, target.radius, 0.18);

    this.dot.style.transform = `translate3d(${this.pointerX}px, ${this.pointerY}px, 0) translate(-50%, -50%)`;
    this.frame.style.width = `${this.frameWidth}px`;
    this.frame.style.height = `${this.frameHeight}px`;
    this.frame.style.borderRadius = `${this.frameRadius}px`;
    this.frame.style.transform = `translate3d(${this.frameX}px, ${this.frameY}px, 0) translate(-50%, -50%)`;
    this.animationFrame = window.requestAnimationFrame(this.animate);
  };

  start() {
    document.body.classList.add('custom-cursor-enabled');
    window.addEventListener('pointermove', this.updateTarget, { passive: true });
    document.documentElement.addEventListener('mouseleave', this.hideCursor);
    document.documentElement.addEventListener('mouseenter', this.showCursor);
    this.animationFrame = window.requestAnimationFrame(this.animate);
  }
}

export function initContextualCursor() {
  const dot = document.querySelector('.contextual-cursor-dot');
  const frame = document.querySelector('.contextual-cursor-frame');
  if (!dot || !frame) return;

  const supportsCursor = window.matchMedia(
    '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
  );
  if (!supportsCursor.matches || window.self !== window.top) return;

  new CursorController(dot, frame).start();
}

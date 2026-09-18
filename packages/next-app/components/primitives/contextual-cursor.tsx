'use client';

import { type RefObject, useEffect, useRef } from 'react';

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

const devOverlaySelector = 'nextjs-portal, [data-nextjs-dialog-overlay]';

function isVisibleDevOverlay(element: Element) {
  if (element.hasAttribute('hidden') || element.getAttribute('aria-hidden') === 'true') {
    return false;
  }

  const styles = getComputedStyle(element);
  if (styles.display === 'none' || styles.visibility === 'hidden' || styles.opacity === '0') {
    return false;
  }

  const { width, height } = element.getBoundingClientRect();
  return width > 0 && height > 0;
}

function interpolate(current: number, target: number, amount: number) {
  return current + (target - current) * amount;
}

function getTargetRadius(element: HTMLElement, width: number, height: number) {
  const rawRadius = getComputedStyle(element).borderTopLeftRadius;
  const parsedRadius = Number.parseFloat(rawRadius) || 0;
  const radius = rawRadius.endsWith('%')
    ? Math.min(width, height) * (parsedRadius / 100)
    : parsedRadius + 6;

  return Math.min(radius, width / 2, height / 2);
}

function shouldIgnorePointerEvent(event: PointerEvent, devOverlayOpen: boolean) {
  if (devOverlayOpen) {
    return true;
  }

  const eventTarget = event.target instanceof Element ? event.target : null;
  return Boolean(
    eventTarget?.closest(devOverlaySelector) || eventTarget?.closest(nativeCursorSelector),
  );
}

function isMousePointer(event: PointerEvent) {
  return !event.pointerType || event.pointerType === 'mouse';
}

function getInteractiveElement(event: PointerEvent) {
  const eventTarget = event.target instanceof Element ? event.target : null;
  return eventTarget?.closest<HTMLElement>(interactiveSelector) ?? null;
}

type CursorTarget = {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
};

class CursorController {
  private pointerX = -100;
  private pointerY = -100;
  private frameX = -100;
  private frameY = -100;
  private frameWidth = 34;
  private frameHeight = 34;
  private frameRadius = 17;
  private hoveredElement: HTMLElement | null = null;
  private animationFrame = 0;
  private devOverlayOpen = false;
  private readonly overlayObserver: MutationObserver;

  constructor(
    private readonly dot: HTMLDivElement,
    private readonly frame: HTMLDivElement,
  ) {
    this.overlayObserver = new MutationObserver(this.syncDevOverlay);
  }

  private setVisible(visible: boolean) {
    const opacity = visible ? '1' : '0';
    this.dot.style.opacity = opacity;
    this.frame.style.opacity = opacity;
  }

  private readonly updateTarget = (event: PointerEvent) => {
    if (!isMousePointer(event)) {
      return;
    }

    this.pointerX = event.clientX;
    this.pointerY = event.clientY;
    if (shouldIgnorePointerEvent(event, this.devOverlayOpen)) {
      this.hoveredElement = null;
      this.setVisible(false);
      return;
    }

    this.hoveredElement = getInteractiveElement(event);
    this.frame.dataset.active = String(Boolean(this.hoveredElement));
    this.setVisible(true);
  };

  private readonly hideCursor = () => this.setVisible(false);

  private readonly showCursor = () => {
    if (!this.devOverlayOpen) {
      this.setVisible(true);
    }
  };

  private readonly syncDevOverlay = () => {
    this.devOverlayOpen = Array.from(document.querySelectorAll(devOverlaySelector)).some(
      isVisibleDevOverlay,
    );
    document.body.classList.toggle('custom-cursor-suspended', this.devOverlayOpen);
    if (this.devOverlayOpen) {
      this.hoveredElement = null;
      this.frame.dataset.active = 'false';
      this.setVisible(false);
      return;
    }
    this.setVisible(true);
  };

  private target(): CursorTarget {
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

  private readonly animate = () => {
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
    this.overlayObserver.observe(document.body, { childList: true, subtree: true });
    this.syncDevOverlay();
    this.animationFrame = window.requestAnimationFrame(this.animate);
  }

  stop() {
    document.body.classList.remove('custom-cursor-enabled');
    window.removeEventListener('pointermove', this.updateTarget);
    document.documentElement.removeEventListener('mouseleave', this.hideCursor);
    document.documentElement.removeEventListener('mouseenter', this.showCursor);
    this.overlayObserver.disconnect();
    document.body.classList.remove('custom-cursor-suspended');
    window.cancelAnimationFrame(this.animationFrame);
  }
}

function createCursorController(dot: HTMLDivElement | null, frame: HTMLDivElement | null) {
  if (!dot || !frame) {
    return null;
  }
  const supportsCursor = window.matchMedia(
    '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
  );
  if (!supportsCursor.matches || window.self !== window.top) {
    return null;
  }
  return new CursorController(dot, frame);
}

function useCursorController(
  dotRef: RefObject<HTMLDivElement | null>,
  frameRef: RefObject<HTMLDivElement | null>,
) {
  useEffect(() => {
    const controller = createCursorController(dotRef.current, frameRef.current);
    if (!controller) {
      return;
    }
    controller.start();
    return () => controller.stop();
  }, [dotRef, frameRef]);
}

export function ContextualCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  useCursorController(dotRef, frameRef);

  return (
    <>
      <div ref={frameRef} className="contextual-cursor contextual-cursor-frame" aria-hidden />
      <div ref={dotRef} className="contextual-cursor contextual-cursor-dot" aria-hidden />
    </>
  );
}

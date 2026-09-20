import type { CaseStudy } from '@portfolio/data/domain/types';

export type IllustrationAccent = { strong: string; line: string; bg: string };

export function getIllustrationAccent(visual: CaseStudy['visual']): IllustrationAccent {
  if (visual === 'architecture') {
    return { strong: '#456B91', line: '#A8BDD2', bg: 'rgba(69,107,145,.07)' };
  }
  if (visual === 'process') {
    return { strong: '#00897b', line: '#8fc9c2', bg: 'rgba(0,137,123,.06)' };
  }
  return { strong: '#1976d2', line: '#9db8d6', bg: 'rgba(25,118,210,.05)' };
}

export type CaseIllustrationProps = { visual: CaseStudy['visual']; compact?: boolean };

export type QueueRowProps = { index: number; accent: IllustrationAccent };

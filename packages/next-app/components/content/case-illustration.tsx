import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { CaseStudy } from '@portfolio/content/types';
import { useTranslations } from 'next-intl';
import { ScrollReveal } from '../primitives/scroll-reveal';
import { TechnicalGrid } from '../primitives/technical-grid';

type IllustrationAccent = { strong: string; line: string; bg: string };

function getIllustrationAccent(visual: CaseStudy['visual']): IllustrationAccent {
  if (visual === 'architecture') {
    return { strong: '#456B91', line: '#A8BDD2', bg: 'rgba(69,107,145,.07)' };
  }
  if (visual === 'process') {
    return { strong: '#00897b', line: '#8fc9c2', bg: 'rgba(0,137,123,.06)' };
  }
  return { strong: '#1976d2', line: '#9db8d6', bg: 'rgba(25,118,210,.05)' };
}

type CaseIllustrationProps = { visual: CaseStudy['visual']; compact?: boolean };

type QueueRowProps = { index: number; accent: IllustrationAccent };

function QueueRow(props: QueueRowProps) {
  const { index, accent } = props;
  const primary = index === 0;
  return (
    <g>
      <circle cx="66" cy={141 + index * 30} r="8" fill="none" stroke={accent.line} />
      <rect
        x="84"
        y={135 + index * 30}
        width={primary ? 130 : 96}
        height="5"
        rx="2.5"
        fill={primary ? accent.strong : accent.line}
        opacity={primary ? 0.85 : 0.5}
      />
    </g>
  );
}

export function CaseIllustration(props: CaseIllustrationProps) {
  const { visual, compact = false } = props;
  const t = useTranslations('Illustration');
  const accent = getIllustrationAccent(visual);
  return (
    <ScrollReveal>
      <Box
        sx={{
          position: 'relative',
          isolation: 'isolate',
          overflow: 'hidden',
          bgcolor: accent.bg,
          border: `1px solid ${accent.line}66`,
          borderRadius: '0.75rem',
          p: compact ? { xs: 1.5, md: 2 } : { xs: 2, md: 4 },
          aspectRatio: compact ? '16 / 9' : '4 / 3',
        }}
      >
        <TechnicalGrid variant="panel" />
        <svg
          viewBox="0 0 400 300"
          width="100%"
          height="100%"
          role="img"
          aria-label={t('caseAria')}
          style={{ display: 'block', position: 'relative', zIndex: 1 }}
        >
          {visual === 'queue' && (
            <>
              <rect
                x="30"
                y="32"
                width="340"
                height="236"
                rx="14"
                fill="#fff"
                stroke={accent.line}
              />
              <line x1="30" y1="72" x2="370" y2="72" stroke={accent.line} />
              <rect
                x="44"
                y="96"
                width="312"
                height="30"
                rx="6"
                fill={`${accent.strong}18`}
                stroke={accent.line}
              />
              {[0, 1, 2, 3].map((index) => (
                <QueueRow key={index} index={index} accent={accent} />
              ))}
            </>
          )}
          {visual === 'architecture' && (
            <>
              <line x1="200" y1="92" x2="200" y2="120" stroke={accent.line} strokeWidth="1.5" />
              <line x1="200" y1="184" x2="200" y2="206" stroke={accent.line} strokeWidth="1.5" />
              <rect
                x="120"
                y="48"
                width="160"
                height="44"
                rx="10"
                fill="#fff"
                stroke={accent.line}
              />
              <text x="200" y="75" fontSize="13" textAnchor="middle" fill={accent.strong}>
                {t('application')}
              </text>
              <rect
                x="96"
                y="120"
                width="208"
                height="64"
                rx="10"
                fill={`${accent.strong}18`}
                stroke={accent.line}
              />
              <text x="200" y="140" fontSize="12" textAnchor="middle" fill={accent.strong}>
                {t('api')}
              </text>
              <ellipse
                cx="200"
                cy="216"
                rx="52"
                ry="12"
                fill={`${accent.strong}18`}
                stroke={accent.line}
              />
              <path d="M148 216v36a52 12 0 0 0 104 0v-36" fill="none" stroke={accent.line} />
              <text x="200" y="238" fontSize="12" textAnchor="middle" fill={accent.strong}>
                {t('data')}
              </text>
            </>
          )}
          {visual === 'process' && (
            <>
              <line x1="70" y1="108" x2="300" y2="108" stroke={accent.line} strokeWidth="1.5" />
              {[0, 1, 2].map((i) => (
                <g key={i}>
                  <circle cx={70 + i * 88} cy="108" r="20" fill="#fff" stroke={accent.line} />
                  <text
                    x={70 + i * 88}
                    y="113"
                    fontSize="14"
                    textAnchor="middle"
                    fill={accent.strong}
                  >
                    {i + 1}
                  </text>
                </g>
              ))}
              <path d="M300 82h44l16 16v64h-60z" fill="#fff" stroke={accent.line} />
              <path d="M344 82v16h16" fill="none" stroke={accent.line} />
              <path d="m314 148 8 8 16-18" fill="none" stroke={accent.strong} strokeWidth="2.5" />
            </>
          )}
        </svg>
        <Typography
          variant="caption"
          sx={{
            position: 'absolute',
            zIndex: 1,
            right: '1rem',
            bottom: '0.75rem',
            color: 'text.disabled',
          }}
        >
          {t('conceptual')}
        </Typography>
      </Box>
    </ScrollReveal>
  );
}

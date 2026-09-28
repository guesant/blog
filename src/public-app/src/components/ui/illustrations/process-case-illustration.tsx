import type { IllustrationTranslator } from '@/i18n/compat-support';

type ProcessCaseIllustrationProps = {
  t: IllustrationTranslator;
};

export function ProcessCaseIllustration(props: ProcessCaseIllustrationProps) {
  const { t } = props;

  const line = '#8fc9c2';

  const strong = '#00897b';

  return (
    <svg
      viewBox="0 0 400 300"
      width="100%"
      height="100%"
      role="img"
      aria-label={t('caseAria')}
      style={{ display: 'block', flex: '0 0 auto', position: 'relative', zIndex: 1 }}
    >
      <line x1="70" y1="108" x2="300" y2="108" stroke={line} strokeWidth="1.5" />
      {[0, 1, 2].map((index) => (
        <g key={index}>
          <circle cx={70 + index * 88} cy="108" r="20" fill="#fff" stroke={line} />
          <text x={70 + index * 88} y="113" fontSize="14" textAnchor="middle" fill={strong}>
            {index + 1}
          </text>
        </g>
      ))}
      <path d="M300 82h44l16 16v64h-60z" fill="#fff" stroke={line} />
      <path d="M344 82v16h16" fill="none" stroke={line} />
      <path d="m314 148 8 8 16-18" fill="none" stroke={strong} strokeWidth="2.5" />
    </svg>
  );
}

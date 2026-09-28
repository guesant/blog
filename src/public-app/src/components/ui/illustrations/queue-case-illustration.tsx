import type { IllustrationTranslator } from '@/i18n/compat-support';

type QueueCaseIllustrationProps = {
  t: IllustrationTranslator;
};

export function QueueCaseIllustration(props: QueueCaseIllustrationProps) {
  const { t } = props;

  const line = '#9db8d6';

  const strong = '#1976d2';

  return (
    <svg
      viewBox="0 0 400 300"
      width="100%"
      height="100%"
      role="img"
      aria-label={t('caseAria')}
      style={{ display: 'block', flex: '0 0 auto', position: 'relative', zIndex: 1 }}
    >
      <rect x="30" y="32" width="340" height="236" rx="14" fill="#fff" stroke={line} />
      <line x1="30" y1="72" x2="370" y2="72" stroke={line} />
      <rect x="44" y="96" width="312" height="30" rx="6" fill={`${strong}18`} stroke={line} />
      {[0, 1, 2, 3].map((index) => {
        const primary = index === 0;

        return (
          <g key={index}>
            <circle cx="66" cy={141 + index * 30} r="8" fill="none" stroke={line} />
            <rect
              x="84"
              y={135 + index * 30}
              width={primary ? 130 : 96}
              height="5"
              rx="2.5"
              fill={primary ? strong : line}
              opacity={primary ? 0.85 : 0.5}
            />
          </g>
        );
      })}
    </svg>
  );
}

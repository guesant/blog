import type { IllustrationTranslator } from '@/i18n/compat-support';

type ArchitectureCaseIllustrationProps = {
  t: IllustrationTranslator;
};

export function ArchitectureCaseIllustration(props: ArchitectureCaseIllustrationProps) {
  const { t } = props;

  const line = '#A8BDD2';

  const strong = '#456B91';

  return (
    <svg
      viewBox="0 0 400 300"
      width="100%"
      height="100%"
      role="img"
      aria-label={t('caseAria')}
      style={{ display: 'block', flex: '0 0 auto', position: 'relative', zIndex: 1 }}
    >
      <line x1="200" y1="92" x2="200" y2="120" stroke={line} strokeWidth="1.5" />
      <rect x="120" y="48" width="160" height="44" rx="10" fill="#fff" stroke={line} />
      <text x="200" y="75" fontSize="13" textAnchor="middle" fill={strong}>
        {t('application')}
      </text>
      <line x1="200" y1="184" x2="200" y2="206" stroke={line} strokeWidth="1.5" />
      <rect x="96" y="120" width="208" height="64" rx="10" fill={`${strong}18`} stroke={line} />
      <text x="200" y="140" fontSize="12" textAnchor="middle" fill={strong}>
        {t('api')}
      </text>
      <ellipse cx="200" cy="216" rx="52" ry="12" fill={`${strong}18`} stroke={line} />
      <path d="M148 216v36a52 12 0 0 0 104 0v-36" fill="none" stroke={line} />
      <text x="200" y="238" fontSize="12" textAnchor="middle" fill={strong}>
        {t('data')}
      </text>
    </svg>
  );
}

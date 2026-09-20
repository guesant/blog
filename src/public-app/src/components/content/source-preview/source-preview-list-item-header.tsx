import { Chip } from '../../ui';
import { Icon } from '../../primitives/icon';
import { handleSourcePreviewKindClick } from './handle-source-preview-kind-click';
import type { SourcePreviewData, SourcePreviewTranslator } from './types';

type SourcePreviewListItemHeaderProps = {
  data: SourcePreviewData;
  onKindClick?: (data: SourcePreviewData) => void;
  t: SourcePreviewTranslator;
};

export function SourcePreviewListItemHeader(props: SourcePreviewListItemHeaderProps) {
  const providerLabels = { github: 'GitHub', youtube: 'YouTube', generic: 'Link' } as const;

  const provider = providerLabels[props.data.provider];

  const canClick = Boolean(props.onKindClick && props.data.filterType);

  return (
    <Chip
      icon={<Icon name={props.data.icon} size={12} />}
      label={`${provider} · ${props.t(`sourcePreview.kinds.${props.data.kind}`)}`}
      size="small"
      clickable={canClick}
      onClick={
        canClick
          ? handleSourcePreviewKindClick.bind(null, props.onKindClick, props.data)
          : undefined
      }
      visualVariant="sourcePreviewKind"
    />
  );
}

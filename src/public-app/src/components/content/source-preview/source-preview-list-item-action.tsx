import { Icon } from '../../primitives/icon';
import type { SourcePreviewData, SourcePreviewTranslator } from './types';
import { SourcePreviewOpenActionButton } from '../../ui/semantic/SourcePreviewOpenActionButton';

type SourcePreviewListItemActionProps = {
  data: SourcePreviewData;
  t: SourcePreviewTranslator;
};

export function SourcePreviewListItemAction(props: SourcePreviewListItemActionProps) {
  const providerLabels = { github: 'GitHub', youtube: 'YouTube', generic: 'Link' } as const;

  return (
    <SourcePreviewOpenActionButton
      component="a"
      href={props.data.url}
      target="_blank"
      rel="noopener noreferrer"

      size="small"
      variant="outlined"
      endIcon={<Icon name="external" size={14} />}
    >
      {props.t('sourcePreview.open', { provider: providerLabels[props.data.provider] })}
    </SourcePreviewOpenActionButton>
  );
}

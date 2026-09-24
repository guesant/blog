import { Button } from '../../ui';
import { Icon } from '../../primitives/icon';
import type { SourcePreviewData, SourcePreviewTranslator } from './types';

type SourcePreviewListItemActionProps = {
  data: SourcePreviewData;
  t: SourcePreviewTranslator;
};

export function SourcePreviewListItemAction(props: SourcePreviewListItemActionProps) {
  const providerLabels = { github: 'GitHub', youtube: 'YouTube', generic: 'Link' } as const;

  return (
    <Button
      component="a"
      href={props.data.url}
      target="_blank"
      rel="noopener noreferrer"
      siteVariant="action"
      size="small"
      variant="outlined"
      startIcon={<Icon name="external" size={14} />}
      visualVariant="sourcePreviewOpen"
    >
      {props.t('sourcePreview.open', { provider: providerLabels[props.data.provider] })}
    </Button>
  );
}

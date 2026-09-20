import { Box, Chip } from '../../ui';
import { Icon } from '../../primitives/icon';
import type { ExternalLink as ExternalLinkData } from '@portfolio/data/domain/types';
import { displaySourceLabel } from './display-source-label';
import { hostFromUrl } from './host-from-url';
import { linkIcon } from './link-icon';
import { ReferenceLinkLabel } from './reference-link-label';
import { ConditionalContent } from '../../primitives/conditional-content';

type ReferenceLinkContentProps = { link: ExternalLinkData; freeLabel: string };

export function ReferenceLinkContent(props: ReferenceLinkContentProps) {
  const label =
    [
      props.link.label,
      displaySourceLabel(props.link.url, props.link.platform),
      hostFromUrl(props.link.url),
    ].find((value): value is string => Boolean(value)) ?? hostFromUrl(props.link.url);

  return (
    <Box
      component="a"
      href={props.link.url}
      target="_blank"
      rel="noopener noreferrer"
      title={props.link.purpose || props.link.platform || undefined}
      visualVariant="referenceLinkContent"
    >
      <Icon name={linkIcon(props.link)} size={14} color="var(--site-primary)" />
      <ReferenceLinkLabel label={label} host={hostFromUrl(props.link.url)} />
      <ConditionalContent
        condition={Boolean(props.link.isFree)}
        content={<Chip label={props.freeLabel} size="small" visualVariant="referenceLinkContent" />}
      />
      <Icon name="north-east" size={12} color="var(--site-text-secondary)" />
    </Box>
  );
}

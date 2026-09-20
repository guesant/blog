import { Button } from '../ui';
import { Icon } from '../primitives/icon';
import { ConditionalContent } from '../primitives/conditional-content';
import type { Translator } from '@/i18n/compat-support';

type ContentActionsSecondaryProps = {
  externalUrl?: string;
  downloadUrl?: string;
  t: Translator;
};

export function ContentActionsSecondary(props: ContentActionsSecondaryProps) {
  return (
    <>
      <ConditionalContent condition={Boolean(props.externalUrl)}>
        <Button
          component="a"
          href={props.externalUrl ?? undefined}
          target="_blank"
          rel="noopener noreferrer"
          size="small"
        >
          {props.t('openSource')}
        </Button>
      </ConditionalContent>
      <ConditionalContent condition={Boolean(props.downloadUrl)}>
        <Button
          component="a"
          href={props.downloadUrl ?? undefined}
          size="small"
          startIcon={<Icon name="download" size={14} />}
        >
          {props.t('downloadFiles')}
        </Button>
      </ConditionalContent>
    </>
  );
}

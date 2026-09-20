import { Button } from '../ui';
import { Icon } from '../primitives/icon';
import { downloadFile } from './download-file';
import type { Translator } from '@/i18n/compat-support';

type ContentActionsPrimaryProps = {
  text: string;
  copy: (value: string, kind: 'text' | 'url') => void;
  url: string;
  filename: string;
  t: Translator;
  copied: string | null;
};

export function ContentActionsPrimary(props: ContentActionsPrimaryProps) {
  return (
    <>
      <Button
        variant="outlined"
        size="small"
        startIcon={<Icon name={props.copied === 'text' ? 'check' : 'copy'} size={14} />}
        onClick={() => void props.copy(props.text, 'text')}
      >
        {props.copied === 'text' ? props.t('copied') : props.t('copyText')}
      </Button>
      <Button
        variant="outlined"
        size="small"
        startIcon={<Icon name={props.copied === 'url' ? 'check' : 'external'} size={14} />}
        onClick={() => void props.copy(window.location.origin + props.url, 'url')}
      >
        {props.copied === 'url' ? props.t('copied') : props.t('copyUrl')}
      </Button>
      <Button
        variant="outlined"
        size="small"
        startIcon={<Icon name="download" size={14} />}
        onClick={() =>
          downloadFile(`${props.filename}.txt`, props.text, 'text/plain;charset=utf-8')
        }
      >
        {props.t('downloadText')}
      </Button>
    </>
  );
}

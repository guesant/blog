import { Button, Typography } from '../../../ui';
import { Stack } from '../../../ui';
import { ConditionalContent } from '../../../primitives/conditional-content';
import { GeneratedResults } from './generated-results';
import { RandomStringControls } from './random-string-controls';

type RandomStringFieldsProps = {
  length: number;
  count: number;
  enabled: Record<string, boolean>;
  results: string[];
  labels: (key: string) => string;
  onLengthChange: (value: number) => void;
  onCountChange: (value: number) => void;
  onEnabledChange: (name: string, checked: boolean) => void;
};

export function RandomStringFields(props: RandomStringFieldsProps) {
  const enabledCount = Object.values(props.enabled).filter(Boolean).length;

  return (
    <Stack spacing={3}>
      <RandomStringControls
        length={props.length}
        count={props.count}
        enabled={props.enabled}
        labels={props.labels}
        onLengthChange={props.onLengthChange}
        onCountChange={props.onCountChange}
        onEnabledChange={props.onEnabledChange}
      />
      <ConditionalContent
        condition={!enabledCount}
        content={<Typography color="error">{props.labels('noCharset')}</Typography>}
      />
      <Button type="submit" variant="contained" disabled={!enabledCount}>
        {props.labels('generate')}
      </Button>
      <GeneratedResults results={props.results} label={props.labels('results')} />
    </Stack>
  );
}

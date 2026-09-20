import { Button, Typography } from '../../ui';
import { Stack } from '../../ui';
import { ConditionalContent } from '../../primitives/conditional-content';
import { PasswordGeneratorOutput } from './password-generator-output';
import { PasswordGeneratorControls } from './password-generator-controls';

type PasswordGeneratorFieldsProps = {
  length: number;
  enabled: Record<string, boolean>;
  result: { value: string; bits: number };
  copied: boolean;
  labels: (key: string) => string;
  onLengthChange: (value: number) => void;
  onEnabledChange: (name: string, checked: boolean) => void;
  onCopy: () => void;
};

export function PasswordGeneratorFields(props: PasswordGeneratorFieldsProps) {
  const enabledCount = Object.values(props.enabled).filter(Boolean).length;

  return (
    <Stack spacing={3}>
      <PasswordGeneratorControls
        length={props.length}
        enabled={props.enabled}
        labels={props.labels}
        onLengthChange={props.onLengthChange}
        onEnabledChange={props.onEnabledChange}
      />
      <ConditionalContent
        condition={!enabledCount}
        content={<Typography color="error">{props.labels('noCharset')}</Typography>}
      />
      <Button type="submit" variant="contained" disabled={!enabledCount}>
        {props.labels('generate')}
      </Button>
      <PasswordGeneratorOutput
        value={props.result.value}
        bits={props.result.bits}
        labels={props.labels}
        copied={props.copied}
        onCopy={props.onCopy}
      />
    </Stack>
  );
}

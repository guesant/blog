import { Stack, TextField } from '../../../ui';
import { CharacterSetControls } from '../character-set-controls';
import { GeneratorLengthField } from '../generator-length-field';
import type { CharacterSet } from './types';

type RandomStringControlsProps = {
  length: number;
  count: number;
  enabled: Record<CharacterSet, boolean>;
  labels: (key: string) => string;
  onLengthChange: (value: number) => void;
  onCountChange: (value: number) => void;
  onEnabledChange: (name: string, checked: boolean) => void;
};

export function RandomStringControls(props: RandomStringControlsProps) {
  return (
    <Stack spacing={3}>
      <GeneratorLengthField
        id="random-string-length"
        label={props.labels('length')}
        value={props.length}
        minimum={1}
        maximum={64}
        onChange={props.onLengthChange}
      />
      <TextField
        label={props.labels('count')}
        type="number"
        value={props.count}
        onChange={(event) => props.onCountChange(Number(event.target.value))}
        slotProps={{ htmlInput: { min: 1, max: 50 } }}
      />
      <CharacterSetControls
        names={Object.keys(props.enabled)}
        enabled={props.enabled}
        label={props.labels}
        onChange={props.onEnabledChange}
      />
    </Stack>
  );
}

import type { ComponentProps } from 'react';
import { Paper } from '../../../ui';
import { RandomStringFields } from './random-string-fields';
import { submitRandomStringGenerator } from './submit-random-string-generator';

type RandomStringFormProps = ComponentProps<typeof RandomStringFields> & { onGenerate: () => void };

export function RandomStringForm(props: RandomStringFormProps) {
  return (
    <Paper
      component="form"
      onSubmit={submitRandomStringGenerator.bind(null, props.onGenerate)}
      visualVariant="randomStringForm"
    >
      <RandomStringFields {...props} />
    </Paper>
  );
}

import { Paper } from '../../ui';
import type { ComponentProps } from 'react';
import { PasswordGeneratorFields } from './password-generator-fields';
import { submitPasswordGenerator } from './submit-password-generator';

type PasswordGeneratorFormProps = ComponentProps<typeof PasswordGeneratorFields> & {
  onGenerate: () => void;
};

export function PasswordGeneratorForm(props: PasswordGeneratorFormProps) {
  return (
    <Paper
      component="form"
      onSubmit={submitPasswordGenerator.bind(null, props.onGenerate)}
      visualVariant="passwordGeneratorForm"
    >
      <PasswordGeneratorFields {...props} />
    </Paper>
  );
}

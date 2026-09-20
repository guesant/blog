import { Box, TextField } from '../../ui';
import { PasswordEntropy } from './password-entropy';

type PasswordResultProps = {
  value: string;
  bits: number;
  passwordLabel: string;
  entropyLabel: string;
  copyLabel: string;
  onCopy: () => void;
};

export function PasswordResult(props: PasswordResultProps) {
  return (
    <Box component="section" aria-live="polite">
      <TextField
        fullWidth
        label={props.passwordLabel}
        value={props.value}
        slotProps={{ input: { readOnly: true } }}
        visualVariant="passwordResult"
      />
      <PasswordEntropy {...props} />
    </Box>
  );
}

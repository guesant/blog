import { LinearProgress } from '../../ui';
import { Stack } from '../../ui';
import { PasswordResultActions } from './password-result-actions';

type PasswordEntropyProps = {
  value: string;
  bits: number;
  entropyLabel: string;
  copyLabel: string;
  onCopy: () => void;
};

export function PasswordEntropy(props: PasswordEntropyProps) {
  return (
    <Stack spacing={1.5} visualVariant="passwordEntropy">
      <LinearProgress
        variant="determinate"
        value={Math.min(100, (props.bits / 128) * 100)}
        aria-label={props.entropyLabel}
      />
      <PasswordResultActions {...props} />
    </Stack>
  );
}

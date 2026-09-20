import { Button, Typography } from '../../ui';
import { Icon } from '../../primitives/icon';
import { Stack } from '../../ui';

type PasswordResultActionsProps = {
  bits: number;
  entropyLabel: string;
  copyLabel: string;
  value: string;
  onCopy: () => void;
};

export function PasswordResultActions(props: PasswordResultActionsProps) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2}>
      <Typography variant="body2" color="text.secondary">
        {props.bits} {props.entropyLabel}
      </Typography>
      <Button
        type="button"
        variant="outlined"
        startIcon={<Icon name="copy" size={16} />}
        onClick={props.onCopy}
        disabled={!props.value}
      >
        {props.copyLabel}
      </Button>
    </Stack>
  );
}

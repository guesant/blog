import { Button } from '../../ui';

type LegacyRunButtonProps = { label: string };

export function LegacyRunButton(props: LegacyRunButtonProps) {
  return (
    <Button type="submit" variant="contained">
      {props.label}
    </Button>
  );
}

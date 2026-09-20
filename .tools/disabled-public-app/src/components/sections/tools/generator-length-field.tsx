import { Box, Slider, Typography } from '../../ui';

type GeneratorLengthFieldProps = {
  id: string;
  label: string;
  value: number;
  minimum: number;
  maximum: number;
  onChange: (value: number) => void;
};

export function GeneratorLengthField(props: GeneratorLengthFieldProps) {
  return (
    <Box>
      <Typography component="label" htmlFor={props.id} variant="body2" color="text.secondary">
        {props.label}: {props.value}
      </Typography>
      <Slider
        id={props.id}
        min={props.minimum}
        max={props.maximum}
        value={props.value}
        onChange={(_, value) => props.onChange(value as number)}
        aria-label={props.label}
      />
    </Box>
  );
}

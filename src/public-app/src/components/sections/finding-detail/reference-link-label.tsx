import { Box, Typography } from '../../ui';

type ReferenceLinkLabelProps = { label: string; host: string };

export function ReferenceLinkLabel(props: ReferenceLinkLabelProps) {
  return (
    <Box visualVariant="referenceLinkLabel">
      <Typography visualVariant="referenceLinkLabel">{props.label}</Typography>
      <Typography visualVariant="referenceLinkLabel2">{props.host}</Typography>
    </Box>
  );
}

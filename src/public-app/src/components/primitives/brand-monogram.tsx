import { Box } from '../ui';
import { monogramInitials } from './monogram-initials';

type BrandMonogramProps = {
  label: string;
  size?: number;
};

export function BrandMonogram(props: BrandMonogramProps) {
  const { label, size = 20 } = props;

  return (
    <Box aria-hidden visualVariant="brandMonogram" width={size} height={size}>
      {monogramInitials(label)}
    </Box>
  );
}

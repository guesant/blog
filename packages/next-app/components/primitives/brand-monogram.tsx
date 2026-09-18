import Box from '@mui/material/Box';

function monogramInitials(label: string): string {
  const alphanumeric = label.replace(/[^\p{L}\p{N}]/gu, '');
  return alphanumeric.slice(0, 2).toUpperCase();
}

type BrandMonogramProps = {
  label: string;
  size?: number;
};

export function BrandMonogram(brandMonogramProps: BrandMonogramProps) {
  const { label, size = 20 } = brandMonogramProps;

  return (
    <Box
      aria-hidden
      sx={{
        display: 'flex',
        flex: '0 0 auto',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: 0.75,
        border: 1,
        borderColor: 'divider',
        bgcolor: 'rgba(234,242,250,.5)',
        color: 'text.secondary',
        fontFamily: 'var(--font-mono)',
        fontSize: `${Math.round(size * 0.4)}px`,
        fontWeight: 500,
        letterSpacing: '-.02em',
        lineHeight: 1,
        userSelect: 'none',
      }}
    >
      {monogramInitials(label)}
    </Box>
  );
}

import { Box, CircularProgress } from '../../ui';

export function LoadingPage() {
  return (
    <Box visualVariant="statusPage" aria-busy="true">
      <CircularProgress aria-label="Loading" color="primary" />
    </Box>
  );
}

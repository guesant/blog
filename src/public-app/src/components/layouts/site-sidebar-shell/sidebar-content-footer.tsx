import { Box, Typography } from '../../ui';

type SidebarContentFooterProps = { copyright: string };

export function SidebarContentFooter(props: SidebarContentFooterProps) {
  return (
    <Box component="footer" visualVariant="sidebarContentFooter">
      <Typography variant="body2" color="inherit" visualVariant="sidebarContentFooter">
        {props.copyright}
      </Typography>
    </Box>
  );
}

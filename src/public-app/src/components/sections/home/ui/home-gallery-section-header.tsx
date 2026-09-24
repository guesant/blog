import { Button, Box, Typography } from '../../../ui';
import { NavLink } from '../../../primitives/nav-link';

type HomeGallerySectionHeaderProps = {
  title: string;
  action: string;
  href: string;
};

export function HomeGallerySectionHeader(props: HomeGallerySectionHeaderProps) {
  return (
    <Box
      component="header"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        mb: 3,
      }}
    >
      <Typography component="h2" variant="h2">
        {props.title}
      </Typography>
      <Button component={NavLink} href={props.href} variant="outlined">
        {props.action}
      </Button>
    </Box>
  );
}

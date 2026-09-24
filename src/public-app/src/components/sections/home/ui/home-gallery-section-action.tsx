import { ArrowForward, Box, Button } from '../../../ui';
import { NavLink } from '../../../primitives/nav-link';

type HomeGallerySectionActionProps = {
  action: string;
  href: string;
};

export function HomeGallerySectionAction(props: HomeGallerySectionActionProps) {
  return (
    <Box
      component="footer"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        pt: 'var(--site-space-3)',
        px: 'var(--site-action-px)',
      }}
    >
      <Button
        component={NavLink}
        href={props.href}
        siteVariant="action"
        sx={{
          maxWidth: '100%',
          minWidth: 0,
          paddingInline: 'var(--site-action-px)',
          whiteSpace: 'normal',
        }}
        endIcon={<ArrowForward />}
      >
        {props.action}
      </Button>
    </Box>
  );
}

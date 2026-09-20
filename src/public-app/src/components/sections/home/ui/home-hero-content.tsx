import type { ReactNode } from 'react';
import { Box } from '../../../ui';

type HomeHeroContentProps = {
  children: ReactNode;
};

export function HomeHeroContent(props: HomeHeroContentProps) {
  return (
    <Box
      sx={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        textAlign: 'center',
      }}
    >
      {props.children}
    </Box>
  );
}

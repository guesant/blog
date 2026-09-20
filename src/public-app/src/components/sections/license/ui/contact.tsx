import type { ReactNode } from 'react';
import { Box } from '../../../ui';

type LicenseContactProps = {
  children: ReactNode;
};

export function LicenseContact(props: LicenseContactProps) {
  return <Box visualVariant="licenseContact">{props.children}</Box>;
}

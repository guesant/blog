import type { ReactNode } from 'react';
import { LicenseContactFrame } from '../../../ui/semantic/LicenseContactFrame';

type LicenseContactProps = {
  children: ReactNode;
};

export function LicenseContact(props: LicenseContactProps) {
  return <LicenseContactFrame>{props.children}</LicenseContactFrame>;
}

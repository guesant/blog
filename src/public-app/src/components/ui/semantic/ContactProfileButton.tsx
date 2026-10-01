import type { ComponentProps } from 'react';
import { ContactActionButton } from './ContactActionButton';

type ContactProfileButtonProps = ComponentProps<typeof ContactActionButton>;

export function ContactProfileButton(props: ContactProfileButtonProps) {
  return <ContactActionButton {...props} />;
}

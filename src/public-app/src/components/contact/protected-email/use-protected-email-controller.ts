'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useEmailReveal } from './use-email-reveal';
import type { ProtectedEmailChallenge } from '@portfolio/data/domain/protected-email';

type UseProtectedEmailControllerProps = {
  challenge?: ProtectedEmailChallenge;
  available?: boolean;
};

export function useProtectedEmailController(props: UseProtectedEmailControllerProps) {
  const { state, email, reveal } = useEmailReveal({
    challenge: props.challenge,
    available: props.available,
  });

  const [open, setOpen] = useState(false);

  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (state === 'revealed' && !open) {
      linkRef.current?.focus();
    }
  }, [state, open]);

  const handleTrigger = useCallback(() => {
    setOpen(true);
    reveal();
  }, [reveal]);

  return { state, email, reveal, open, setOpen, linkRef, handleTrigger };
}

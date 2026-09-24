'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from '@/i18n/compat';
import { useEmailReveal } from './use-email-reveal';
import type { ProtectedEmailChallenge } from '@portfolio/data/domain/protected-email';

type UseProtectedEmailControllerProps = {
  challenge?: ProtectedEmailChallenge;
  available?: boolean;
};

export function useProtectedEmailController(props: UseProtectedEmailControllerProps) {
  const t = useTranslations('Common');

  const { state, email, reveal } = useEmailReveal({
    challenge: props.challenge,
    available: props.available,
  });

  const [open, setOpen] = useState(false);

  const linkRef = useRef<HTMLElement | null>(null);

  const setLinkRef = useCallback((element: HTMLElement | null) => {
    linkRef.current = element;
  }, []);

  useEffect(() => {
    if (state === 'revealed' && !open) {
      linkRef.current?.focus();
    }
  }, [state, open]);

  const handleTrigger = useCallback(() => {
    setOpen(true);
    reveal();
  }, [reveal]);

  return { state, email, reveal, open, setOpen, linkRef: setLinkRef, handleTrigger, t };
}

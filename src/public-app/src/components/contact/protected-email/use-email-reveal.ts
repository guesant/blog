import type { ProtectedEmailChallenge } from '@portfolio/data/domain/protected-email';
import { useCallback, useState } from 'react';
import { useEmailChallenge } from './use-email-challenge';
import { isStartable } from './is-startable';
import { requestEmailChallenge } from './request-email-challenge';
import { runReveal } from './run-reveal';
import { useMountedRef } from './use-mounted-ref';
import type { RevealState } from './types';
import { useSettleReveal } from './use-settle-reveal';

type UseEmailRevealProps = {
  challenge?: ProtectedEmailChallenge;
  available?: boolean;
};

export function useEmailReveal(props: UseEmailRevealProps) {
  const [state, setState] = useState<RevealState>('idle');

  const [email, setEmail] = useState('');

  const mounted = useMountedRef();

  const challengeMutation = useEmailChallenge();

  const settle = useSettleReveal({ mounted, setEmail, setState });

  const startable = isStartable(props.challenge, state, props.available);

  const reveal = useCallback(() => {
    if (!startable) {
      return;
    }

    setState('working');

    if (props.challenge) {
      runReveal(props.challenge, settle);
      return;
    }

    requestEmailChallenge({ mutation: challengeMutation, settle });
  }, [challengeMutation, props.challenge, settle, startable]);

  return { state, email, reveal };
}

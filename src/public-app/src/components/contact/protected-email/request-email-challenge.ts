import { emailChallengeValue } from '@portfolio/data/api/public-site-source-email-challenge';
import type { SettleReveal } from './types';
import { runReveal } from './run-reveal';
import type { useEmailChallenge } from './use-email-challenge';

type RequestEmailChallengeProps = {
  mutation: ReturnType<typeof useEmailChallenge>;
  settle: SettleReveal;
};

export function requestEmailChallenge(props: RequestEmailChallengeProps) {
  props.mutation
    .mutateAsync({})
    .then((value) => {
      const challenge = emailChallengeValue(value);

      if (challenge) {
        runReveal(challenge, props.settle);
        return;
      }

      props.settle('error', '');
    })
    .catch(() => props.settle('error', ''));
}

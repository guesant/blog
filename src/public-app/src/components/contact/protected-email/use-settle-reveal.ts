import { useCallback, type Dispatch, type MutableRefObject, type SetStateAction } from 'react';
import type { RevealState, SettleReveal } from './types';

type UseSettleRevealProps = {
  mounted: MutableRefObject<boolean>;
  setEmail: Dispatch<SetStateAction<string>>;
  setState: Dispatch<SetStateAction<RevealState>>;
};

export function useSettleReveal(props: UseSettleRevealProps) {
  return useCallback<SettleReveal>(
    (next, address) => {
      if (props.mounted.current) {
        props.setEmail(address);
        props.setState(next);
      }
    },
    [props.mounted, props.setEmail, props.setState],
  );
}

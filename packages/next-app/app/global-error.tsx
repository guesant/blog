'use client';

import { RootFallback } from './root-fallback';

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError(props: GlobalErrorProps) {
  return <RootFallback variant="error" reset={props.reset} />;
}

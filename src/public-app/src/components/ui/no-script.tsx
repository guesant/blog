import type { ReactNode } from 'react';

type NoScriptProps = { children: ReactNode };

export function NoScript(props: NoScriptProps) {
  return <noscript>{props.children}</noscript>;
}

import type { ReactNode } from 'react';
import type { ThemeState } from '@portfolio/data/config/theme';

type DocumentShellProps = {
  locale: string;
  themeState: ThemeState;
  head: ReactNode;
  body: ReactNode;
  scripts: ReactNode;
  themeBootstrapScript: string;
};

export function DocumentShell(props: DocumentShellProps) {
  return (
    <html
      lang={props.locale}
      suppressHydrationWarning
      data-theme={props.themeState.resolvedMode ?? undefined}
    >
      <head>
        {props.head}
        {/* nosemgrep: typescript.react.security.audit.react-dangerouslysetinnerhtml.react-dangerouslysetinnerhtml */}
        <script dangerouslySetInnerHTML={{ __html: props.themeBootstrapScript }} />
      </head>
      <body>
        {props.body}
        {props.scripts}
      </body>
    </html>
  );
}

import type { ReactNode } from 'react';

type DocumentShellProps = {
  locale: string;
  themeMode: 'system' | 'light' | 'dark';
  head: ReactNode;
  body: ReactNode;
  scripts: ReactNode;
  themeBootstrapScript: string;
};

export function DocumentShell(props: DocumentShellProps) {
  return (
    <html
      lang={props.locale}
      data-theme={props.themeMode === 'system' ? undefined : props.themeMode}
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

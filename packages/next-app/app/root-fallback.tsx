'use client';

import { issueReportUrl } from '../content/project';

type RootFallbackProps = {
  variant: 'error' | 'not-found';
  reset?: () => void;
};

export function RootFallback(props: RootFallbackProps) {
  const { variant, reset } = props;
  const isError = variant === 'error';

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F7F9FC',
          color: '#172033',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        <div style={{ maxWidth: '26rem', padding: '2rem', textAlign: 'center' }}>
          <p
            style={{
              margin: '0 0 0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontSize: '.75rem',
              fontWeight: 600,
              color: '#5D6978',
            }}
          >
            {isError ? 'Error' : '404'}
          </p>
          <h1 style={{ margin: '0 0 1rem', fontSize: '1.75rem', letterSpacing: '-0.02em' }}>
            {isError ? 'Something went wrong' : 'Page not found'}
          </h1>
          <p style={{ margin: '0 0 1.5rem', color: '#5D6978', lineHeight: 1.6 }}>
            {isError
              ? 'An unexpected error occurred while loading this site.'
              : "This page doesn't exist."}
          </p>
          {isError ? (
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={reset}
                style={{
                  background: '#173A63',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.6rem 1.25rem',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Try again
              </button>
              <a
                href={issueReportUrl}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  color: '#5D6978',
                  fontSize: '0.9rem',
                  textDecoration: 'underline',
                }}
              >
                Report issue
              </a>
            </div>
          ) : (
            <a
              href="/"
              style={{
                display: 'inline-block',
                background: '#173A63',
                color: '#FFFFFF',
                borderRadius: '8px',
                padding: '0.6rem 1.25rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Back home
            </a>
          )}
        </div>
      </body>
    </html>
  );
}

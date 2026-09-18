import { ImageResponse } from 'next/og';

export const runtime = 'edge';

const size = { width: 1200, height: 630 };

function queryParam(params: URLSearchParams, name: string, fallback: string, maxLength: number) {
  return (params.get(name)?.trim() || fallback).slice(0, maxLength);
}

export function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const site = queryParam(params, 'site', 'Portfolio', 80);
  const title = queryParam(params, 'title', site, 140);
  const description = queryParam(params, 'description', '', 280);

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '72px 80px',
        background: '#F7F9FC',
        color: '#172033',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: 999,
            background: '#1D5FA7',
          }}
        />
        <span style={{ color: '#5D6978', fontSize: 24, fontWeight: 700 }}>{site}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 1010 }}>
        <div
          style={{
            fontSize: title.length > 72 ? 52 : 62,
            fontWeight: 700,
            letterSpacing: '-1.8px',
            lineHeight: 1.08,
          }}
        >
          {title}
        </div>
        {description && (
          <div
            style={{
              marginTop: 28,
              maxWidth: 940,
              color: '#5D6978',
              fontSize: 25,
              lineHeight: 1.4,
            }}
          >
            {description}
          </div>
        )}
      </div>

      <div style={{ width: '100%', height: 2, background: '#D8E0E9' }} />
    </div>,
    {
      ...size,
      headers: {
        'Cache-Control': 'public, max-age=86400, s-maxage=31536000, immutable',
      },
    },
  );
}

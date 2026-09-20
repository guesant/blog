export type MetadataProxyContext = {
  handlerType: string;
  next: (...args: never[]) => MetadataProxyNextResult | Promise<MetadataProxyNextResult>;
  request: Request;
};

type MetadataProxyNextResult = {
  request: Request;
  pathname: string;
  context: unknown;
  response: Response;
};

export type MetadataProxyResult<T extends MetadataProxyContext> =
  Awaited<ReturnType<T['next']>> | Response;

export const metadataPaths = new Set([
  '/robots.txt',
  '/sitemap.xml',
  '/.well-known/webfinger',
  '/feed.xml',
  '/pt-BR/feed.xml',
  '/atom.xml',
  '/pt-BR/atom.xml',
  '/feed.json',
  '/pt-BR/feed.json',
  '/manifest.webmanifest',
]);

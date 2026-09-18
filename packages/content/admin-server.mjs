import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageDirectory = path.dirname(fileURLToPath(import.meta.url));
const rootDirectory = path.resolve(
  process.env.CMS_ADMIN_ROOT ?? path.join(packageDirectory, 'public'),
);
const host = process.env.CMS_ADMIN_HOST ?? '0.0.0.0';
const port = Number.parseInt(process.env.CMS_ADMIN_PORT ?? '4100', 10);

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
  '.wasm': 'application/wasm',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function requestPath(request) {
  const url = new URL(request.url ?? '/', 'http://localhost');
  return decodeURIComponent(url.pathname);
}

function fileForPath(requestPathname) {
  const relativePath =
    requestPathname === '/' || requestPathname === '/admin' || requestPathname === '/admin/'
      ? 'admin/index.html'
      : requestPathname.replace(/^\/+/, '');
  const filename = path.resolve(rootDirectory, relativePath);
  if (filename !== rootDirectory && !filename.startsWith(rootDirectory + path.sep)) {
    return undefined;
  }
  return filename;
}

function contentType(filename) {
  return contentTypes[path.extname(filename).toLowerCase()] ?? 'application/octet-stream';
}

async function serveFile(filename, request, response) {
  try {
    const body = await readFile(filename);
    response.writeHead(200, {
      'cache-control': 'no-cache',
      'content-type': contentType(filename),
    });
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      response.writeHead(404);
      response.end();
      return;
    }
    response.writeHead(500);
    response.end();
  }
}

const server = createServer(async (request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { allow: 'GET, HEAD' });
    response.end();
    return;
  }

  let filename;
  try {
    filename = fileForPath(requestPath(request));
  } catch {
    response.writeHead(400);
    response.end();
    return;
  }

  if (!filename) {
    response.writeHead(404);
    response.end();
    return;
  }

  await serveFile(filename, request, response);
});

server.listen(port, host);

function shutdown() {
  server.close(() => process.exit(0));
}

process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);

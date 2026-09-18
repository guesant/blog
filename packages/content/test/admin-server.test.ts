import assert from 'node:assert/strict';
import { once } from 'node:events';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import test from 'node:test';

type Response = { body: string; statusCode: number | undefined };

function request(port: number, pathname: string, method = 'GET'): Promise<Response> {
  return new Promise((resolve, reject) => {
    const request = http.request(
      { hostname: '127.0.0.1', method, path: pathname, port },
      (response) => {
        const chunks: Buffer[] = [];
        response.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
        response.on('end', () => {
          resolve({
            body: Buffer.concat(chunks).toString('utf8'),
            statusCode: response.statusCode,
          });
        });
      },
    );
    request.on('error', reject);
    request.end();
  });
}

async function waitForServer(port: number): Promise<Response> {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      return await request(port, '/admin/');
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 25));
    }
  }
  throw new Error('Admin server did not start');
}

test('serves Tina admin files independently from Next.js', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'portfolio-tina-admin-'));
  const adminDirectory = path.join(root, 'admin');
  const port = 4101;
  await mkdir(adminDirectory);
  await writeFile(path.join(adminDirectory, 'index.html'), '<!doctype html><title>Tina</title>');
  await writeFile(path.join(adminDirectory, 'app.js'), 'console.log("tina");');

  const child = spawn(process.execPath, [path.resolve('admin-server.mjs')], {
    env: {
      ...process.env,
      CMS_ADMIN_HOST: '127.0.0.1',
      CMS_ADMIN_PORT: String(port),
      CMS_ADMIN_ROOT: root,
    },
    stdio: 'ignore',
  });

  try {
    const index = await waitForServer(port);
    assert.equal(index.statusCode, 200);
    assert.match(index.body, /Tina/);

    const asset = await request(port, '/admin/app.js');
    assert.equal(asset.statusCode, 200);
    assert.match(asset.body, /console/);

    const traversal = await request(port, '/admin/%2e%2e/%2e%2e/package.json');
    assert.equal(traversal.statusCode, 404);

    const method = await request(port, '/admin/', 'POST');
    assert.equal(method.statusCode, 405);
  } finally {
    if (child.exitCode === null) {
      child.kill('SIGTERM');
      await once(child, 'exit');
    }
    await rm(root, { recursive: true, force: true });
  }
});

import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const packageLock = JSON.parse(readFileSync('package-lock.json', 'utf8'));
const composerLock = JSON.parse(readFileSync('composer.lock', 'utf8'));
const packages = [];

function idFor(purl) {
  return `SPDXRef-${createHash('sha256').update(purl).digest('hex').slice(0, 24)}`;
}

function addPackage({ name, version, purl, license = 'NOASSERTION', source = 'NOASSERTION' }) {
  if (!name || !version || packages.some((item) => item.externalRefs?.some((ref) => ref.referenceLocator === purl))) return;
  packages.push({
    SPDXID: idFor(purl),
    name,
    versionInfo: version,
    downloadLocation: source,
    filesAnalyzed: false,
    licenseConcluded: 'NOASSERTION',
    licenseDeclared: license,
    externalRefs: [{ referenceCategory: 'PACKAGE-MANAGER', referenceType: 'purl', referenceLocator: purl }],
  });
}

for (const [path, metadata] of Object.entries(packageLock.packages ?? {})) {
  if (!metadata.name || !metadata.version || path === '') continue;
  const encodedName = metadata.name.startsWith('@') ? metadata.name.replace('/', '%2f') : metadata.name;
  addPackage({
    name: metadata.name,
    version: metadata.version,
    purl: `pkg:npm/${encodedName}@${metadata.version}`,
    license: 'NOASSERTION',
    source: metadata.resolved ?? 'NOASSERTION',
  });
}

for (const metadata of [...(composerLock.packages ?? []), ...(composerLock['packages-dev'] ?? [])]) {
  if (!metadata.name || !metadata.version) continue;
  addPackage({
    name: metadata.name,
    version: metadata.version,
    purl: `pkg:composer/${metadata.name}@${metadata.version}`,
    license: metadata.license?.join(' OR ') ?? 'NOASSERTION',
    source: metadata.dist?.url ?? 'NOASSERTION',
  });
}

const document = {
  SPDXID: 'SPDXRef-DOCUMENT',
  spdxVersion: 'SPDX-2.3',
  dataLicense: 'CC0-1.0',
  name: 'portfolio-lockfile-dependencies',
  documentNamespace: `https://example.invalid/portfolio/sbom/${createHash('sha256').update(JSON.stringify(packages)).digest('hex')}`,
  creationInfo: {
    created: new Date(Number(process.env.SOURCE_DATE_EPOCH ?? Date.now() / 1000) * 1000).toISOString(),
    creators: ['Tool: scripts/generate-sbom.mjs'],
  },
  documentDescribes: packages.map(({ SPDXID }) => SPDXID),
  packages,
};

mkdirSync('sbom', { recursive: true });
writeFileSync('sbom/dependencies.spdx.json', `${JSON.stringify(document, null, 2)}\n`);
console.log(`Generated ${packages.length} lockfile packages at sbom/dependencies.spdx.json`);

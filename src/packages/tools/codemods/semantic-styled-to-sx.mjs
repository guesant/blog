import { createRequire } from 'node:module';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..');
const publicAppRoot = resolve(repositoryRoot, 'src/public-app');
const semanticRoot = resolve(publicAppRoot, 'src/components/ui/semantic');
const require = createRequire(resolve(publicAppRoot, 'package.json'));
const typescriptCandidates = [
  'typescript',
  ...readdirSync(resolve(publicAppRoot, 'node_modules/.pnpm'), { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith('typescript@'))
    .map((entry) =>
      resolve(publicAppRoot, 'node_modules/.pnpm', entry.name, 'node_modules/typescript'),
    ),
];
const ts = typescriptCandidates
  .map((candidate) => {
    try {
      return require(candidate);
    } catch {
      return null;
    }
  })
  .find((candidate) => candidate?.ScriptKind && candidate.ScriptTarget);

if (!ts) throw new Error('TypeScript compiler API is required');

function filesIn(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) return filesIn(path);
    return extname(path) === '.tsx' ? [path] : [];
  });
}

for (const path of filesIn(semanticRoot)) {
  const source = readFileSync(path, 'utf8');
  const sourceFile = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true);
  const imports = sourceFile.statements.filter(ts.isImportDeclaration);
  const baseImport = imports.find(
    (statement) =>
      statement.importClause?.namedBindings &&
      ts.isNamedImports(statement.importClause.namedBindings) &&
      statement.importClause.namedBindings.elements.some(
        (element) => element.name.text === 'BaseComponent',
      ),
  );
  if (!baseImport || baseImport.moduleSpecifier.text.endsWith('/primitives/icon')) continue;

  const declaration = sourceFile.statements.find((statement) => {
    if (!ts.isVariableStatement(statement)) return false;
    return statement.declarationList.declarations.some(
      (item) =>
        ts.isIdentifier(item.name) &&
        item.initializer &&
        ts.isCallExpression(item.initializer) &&
        ts.isCallExpression(item.initializer.expression) &&
        item.initializer.expression.expression.getText(sourceFile) === 'styled',
    );
  });
  if (!declaration || !ts.isVariableStatement(declaration)) continue;

  const variable = declaration.declarationList.declarations[0];
  if (!ts.isIdentifier(variable.name) || !ts.isCallExpression(variable.initializer)) continue;
  const styledCall = variable.initializer.expression;
  if (!ts.isCallExpression(styledCall)) continue;
  const name = variable.name.text;
  const styles = variable.initializer.arguments[0]?.getText(sourceFile);
  if (!styles) continue;

  writeFileSync(
    path,
    [
      "import type { ComponentProps } from 'react';",
      "import { createSemanticSxComponent } from '@/components/ui/sx';",
      baseImport.getText(sourceFile),
      '',
      `export const ${name} = createSemanticSxComponent<ComponentProps<typeof BaseComponent>>(`,
      '  BaseComponent,',
      `  ${styles},`,
      ');',
      '',
    ].join('\n'),
  );
}

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

function baseImport(sourceFile) {
  for (const statement of sourceFile.statements) {
    if (!ts.isImportDeclaration(statement) || !statement.importClause) continue;
    const bindings = statement.importClause.namedBindings;
    if (!bindings || !ts.isNamedImports(bindings)) continue;
    if (bindings.elements.some((element) => element.name.text === 'BaseComponent')) {
      return statement.getText(sourceFile);
    }
  }
  return null;
}

function componentStyles(sourceFile) {
  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    const declaration = statement.declarationList.declarations.find(
      (item) => ts.isIdentifier(item.name) && item.name.text === 'componentStyles',
    );
    if (declaration?.initializer) return declaration.initializer.getText(sourceFile);
  }
  return null;
}

function semanticFunction(sourceFile) {
  for (const statement of sourceFile.statements) {
    if (!ts.isFunctionDeclaration(statement) || !statement.name || !statement.body) continue;
    if (statement.body.statements.length !== 1) continue;
    const onlyStatement = statement.body.statements[0];
    if (!ts.isReturnStatement(onlyStatement) || !onlyStatement.expression) continue;
    const expression = onlyStatement.expression;
    if (!ts.isJsxElement(expression) && !ts.isJsxSelfClosingElement(expression)) continue;
    const opening = ts.isJsxElement(expression) ? expression.openingElement : expression;
    if (opening.tagName.getText(sourceFile) !== 'BaseComponent') continue;
    if (
      !opening.attributes.properties.some(
        (property) => ts.isJsxAttribute(property) && ['sx', 'style'].includes(property.name.text),
      )
    )
      continue;
    return statement.name.text;
  }
  return null;
}

for (const path of filesIn(semanticRoot)) {
  const source = readFileSync(path, 'utf8');
  const sourceFile = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true);
  const name = semanticFunction(sourceFile);
  const styles = componentStyles(sourceFile);
  const imported = baseImport(sourceFile);
  if (!name || !styles || !imported) continue;
  writeFileSync(
    path,
    [
      "import { styled } from '@mui/material/styles';",
      imported,
      '',
      `export const ${name} = styled(BaseComponent, { name: '${name}' })(${styles});`,
      '',
    ].join('\n'),
  );
}

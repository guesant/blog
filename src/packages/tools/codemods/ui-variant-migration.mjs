import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, extname, relative, resolve } from 'node:path';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..');
const publicAppRoot = resolve(repositoryRoot, 'src/public-app');
const sourceRoot = resolve(publicAppRoot, 'src');
const uiRoot = resolve(sourceRoot, 'components/ui');
const semanticRoot = resolve(uiRoot, 'semantic');
const require = createRequire(resolve(publicAppRoot, 'package.json'));
const compilerApiCandidates = [
  'typescript',
  ...readdirSync(resolve(publicAppRoot, 'node_modules/.pnpm'), { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith('typescript@'))
    .map((entry) =>
      resolve(publicAppRoot, 'node_modules/.pnpm', entry.name, 'node_modules/typescript'),
    ),
];
const ts = compilerApiCandidates
  .map((candidate) => {
    try {
      return require(candidate);
    } catch {
      return null;
    }
  })
  .find((candidate) => candidate?.ScriptKind && candidate.ScriptTarget);

if (!ts) {
  throw new Error(
    'The codemod requires a TypeScript compiler API package in the public-app node_modules.',
  );
}
const mode = process.argv.includes('--write')
  ? 'write'
  : process.argv.includes('--check')
    ? 'check'
    : 'report';

const primitiveDefinitions = {
  Box: { map: 'boxVariants', styleKind: 'sx', importPath: '@/components/ui/box' },
  Typography: {
    map: 'typographyVariants',
    styleKind: 'sx',
    importPath: '@/components/ui/typography',
  },
  Stack: { map: 'stackVariants', styleKind: 'sx', importPath: '@/components/ui/stack' },
  Button: { map: 'buttonVariants', styleKind: 'sx', importPath: '@/components/ui/button' },
  Link: { map: 'linkVariants', styleKind: 'sx', importPath: '@/components/ui/link' },
  NavLink: { map: 'linkVariants', styleKind: 'sx', importPath: '@/components/primitives/nav-link' },
  ExternalLink: {
    map: 'linkVariants',
    styleKind: 'sx',
    importPath: '@/components/primitives/external-link',
  },
  Chip: { map: 'chipVariants', styleKind: 'sx', importPath: '@/components/ui/chip' },
  Container: { map: 'containerVariants', styleKind: 'sx', importPath: '@/components/ui/container' },
  Divider: { map: 'dividerVariants', styleKind: 'sx', importPath: '@/components/ui/divider' },
  FormControl: {
    map: 'formControlVariants',
    styleKind: 'sx',
    importPath: '@/components/ui/form-control',
  },
  IconButton: {
    map: 'iconButtonVariants',
    styleKind: 'sx',
    importPath: '@/components/ui/icon-button',
  },
  Icon: {
    map: 'iconGlyphVariants',
    styleKind: 'style',
    importPath: '@/components/primitives/icon',
  },
  IconGlyph: {
    map: 'iconGlyphVariants',
    styleKind: 'style',
    importPath: '@/components/ui/icon-glyph',
  },
  MotionDiv: {
    map: 'motionDivVariants',
    styleKind: 'style',
    importPath: '@/components/ui/motion-div',
  },
  Pagination: {
    map: 'paginationVariants',
    styleKind: 'sx',
    importPath: '@/components/ui/pagination',
  },
  Paper: { map: 'paperVariants', styleKind: 'sx', importPath: '@/components/ui/paper' },
  Skeleton: { map: 'skeletonVariants', styleKind: 'sx', importPath: '@/components/ui/skeleton' },
  TechnicalGrid: {
    map: 'technicalGridVariants',
    styleKind: 'sx',
    importPath: '@/components/ui/technical-grid',
  },
  TextField: {
    map: 'textFieldVariants',
    styleKind: 'sx',
    importPath: '@/components/ui/text-field',
  },
  ToggleButtonGroup: {
    map: 'toggleButtonGroupVariants',
    styleKind: 'sx',
    importPath: '@/components/ui/toggle-button-group',
  },
  Breadcrumbs: {
    map: 'breadcrumbsVariants',
    styleKind: 'sx',
    importPath: '@/components/ui/breadcrumbs',
  },
  ArrowForward: {
    map: 'buttonVariants',
    styleKind: 'sx',
    importPath: '@/components/ui/arrow-forward',
  },
  PageLayout: {
    map: 'boxVariants',
    styleKind: 'sx',
    importPath: '@/components/layouts/page-layout',
  },
};

const siteButtonDefinition = {
  map: 'siteButtonVariants',
  styleKind: 'sx',
  importPath: '@/components/ui/button',
};

function walk(directory) {
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...walk(path));
    if (entry.isFile() && ['.ts', '.tsx'].includes(extname(path))) files.push(path);
  }
  return files;
}

function parseFile(filePath) {
  const text = readFileSync(filePath, 'utf8');
  return {
    path: filePath,
    text,
    sourceFile: ts.createSourceFile(filePath, text, ts.ScriptTarget.Latest, true),
    declarations: new Map(),
    imports: new Map(),
  };
}

const files = walk(sourceRoot);
const records = new Map(files.map((filePath) => [filePath, parseFile(filePath)]));

function resolveModule(fromPath, moduleName) {
  if (!moduleName.startsWith('.')) return null;
  const base = resolve(dirname(fromPath), moduleName);
  const candidates = [
    base,
    `${base}.ts`,
    `${base}.tsx`,
    resolve(base, 'index.ts'),
    resolve(base, 'index.tsx'),
  ];
  return candidates.find((candidate) => records.has(candidate)) ?? null;
}

for (const record of records.values()) {
  record.sourceFile.forEachChild((node) => {
    if (ts.isImportDeclaration(node)) {
      const moduleName = node.moduleSpecifier.text;
      const modulePath = resolveModule(record.path, moduleName);
      if (!modulePath || !node.importClause) return;
      if (node.importClause.name) {
        record.imports.set(node.importClause.name.text, { path: modulePath, name: 'default' });
      }
      const bindings = node.importClause.namedBindings;
      if (bindings && ts.isNamedImports(bindings)) {
        for (const element of bindings.elements) {
          record.imports.set(element.name.text, {
            path: modulePath,
            name: element.propertyName?.text ?? element.name.text,
          });
        }
      }
    }
    if (ts.isVariableStatement(node)) {
      for (const declaration of node.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name) && declaration.initializer) {
          record.declarations.set(declaration.name.text, declaration);
        }
      }
    }
  });
}

function resolveVariable(record, name) {
  const declaration = record.declarations.get(name);
  if (declaration) return { record, declaration };
  const imported = record.imports.get(name);
  if (!imported) return null;
  const importedRecord = records.get(imported.path);
  if (!importedRecord) return null;
  return resolveVariable(importedRecord, imported.name);
}

function expressionText(record, expression, stack = new Set()) {
  if (ts.isParenthesizedExpression(expression))
    return expressionText(record, expression.expression, stack);
  if (ts.isIdentifier(expression)) {
    const resolved = resolveVariable(record, expression.text);
    if (!resolved || stack.has(`${resolved.record.path}:${resolved.declaration.name.text}`)) {
      return expression.getText(record.sourceFile);
    }
    const nextStack = new Set(stack);
    nextStack.add(`${resolved.record.path}:${resolved.declaration.name.text}`);
    return expressionText(resolved.record, resolved.declaration.initializer, nextStack);
  }
  if (ts.isObjectLiteralExpression(expression)) return objectText(record, expression, stack);
  return expression.getText(record.sourceFile);
}

function propertyNameText(property, sourceFile) {
  return property.name?.getText(sourceFile) ?? '';
}

function objectText(record, expression, stack = new Set()) {
  const properties = [];
  for (const property of expression.properties) {
    if (ts.isSpreadAssignment(property)) {
      properties.push(`...${expressionText(record, property.expression, stack)}`);
      continue;
    }
    if (ts.isPropertyAssignment(property)) {
      properties.push(
        `${propertyNameText(property, record.sourceFile)}: ${expressionText(record, property.initializer, stack)}`,
      );
      continue;
    }
    properties.push(property.getText(record.sourceFile));
  }
  return `{ ${properties.join(', ')} }`;
}

function objectEntries(record, expression, stack = new Set()) {
  if (ts.isParenthesizedExpression(expression))
    return objectEntries(record, expression.expression, stack);
  if (ts.isIdentifier(expression)) {
    const resolved = resolveVariable(record, expression.text);
    if (!resolved || stack.has(`${resolved.record.path}:${resolved.declaration.name.text}`))
      return new Map();
    const nextStack = new Set(stack);
    nextStack.add(`${resolved.record.path}:${resolved.declaration.name.text}`);
    return objectEntries(resolved.record, resolved.declaration.initializer, nextStack);
  }
  if (!ts.isObjectLiteralExpression(expression)) return new Map();
  const entries = new Map();
  for (const property of expression.properties) {
    if (ts.isSpreadAssignment(property)) {
      for (const [key, value] of objectEntries(record, property.expression, stack))
        entries.set(key, value);
      continue;
    }
    if (!ts.isPropertyAssignment(property)) continue;
    const key = property.name?.getText(record.sourceFile).replace(/^['"]|['"]$/g, '');
    if (!key) continue;
    entries.set(key, expressionText(record, property.initializer, stack));
  }
  return entries;
}

function findMap(name) {
  for (const record of records.values()) {
    const resolved = resolveVariable(record, name);
    if (!resolved) continue;
    const entries = objectEntries(resolved.record, resolved.declaration.initializer);
    if (entries.size > 0 || name === 'toggleButtonGroupVariants') return entries;
  }
  return new Map();
}

const styleMaps = new Map();
for (const name of new Set(
  Object.values(primitiveDefinitions)
    .map((definition) => definition.map)
    .concat(siteButtonDefinition.map),
)) {
  styleMaps.set(name, findMap(name));
}

function pascal(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[^A-Za-z0-9]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((part) => `${part[0].toUpperCase()}${part.slice(1)}`)
    .join('');
}

function suffixFor(base, sourceFile) {
  if (base === 'Typography') return 'Text';
  if (base === 'Stack') return 'Stack';
  if (base === 'Button') return 'Button';
  if (base === 'Link' || base === 'NavLink' || base === 'ExternalLink') return 'Link';
  if (base === 'Icon' || base === 'IconGlyph') return 'Icon';
  if (base === 'IconButton') return 'IconButton';
  if (base === 'MotionDiv') return 'Motion';
  if (base === 'ArrowForward') return 'Arrow';
  if (base === 'Chip') return 'Chip';
  if (base === 'Paper') return 'Paper';
  if (base === 'Skeleton') return 'Skeleton';
  if (base === 'Container') return 'Container';
  if (base === 'Divider') return 'Divider';
  if (base === 'FormControl') return 'Control';
  if (base === 'Breadcrumbs') return 'Breadcrumbs';
  if (base === 'Pagination') return 'Pagination';
  if (base === 'TextField') return 'TextField';
  if (base === 'ToggleButtonGroup') return 'ToggleGroup';
  if (base === 'TechnicalGrid') return 'Grid';
  if (base === 'ExplorationTileGrid') return 'Grid';
  if (base === 'PageLayout') return 'Layout';
  if (sourceFile.endsWith('.tsx')) return 'Frame';
  return 'Component';
}

function componentName(base, variant, sourceFile) {
  return `${pascal(variant)}${suffixFor(base, sourceFile)}`;
}

const existingNames = new Set();
for (const record of records.values()) {
  record.sourceFile.forEachChild((node) => {
    if (ts.isImportDeclaration(node) && node.importClause) {
      if (node.importClause.name) existingNames.add(node.importClause.name.text);
      const bindings = node.importClause.namedBindings;
      if (bindings && ts.isNamedImports(bindings)) {
        for (const element of bindings.elements) existingNames.add(element.name.text);
      }
    }
    if (ts.isFunctionDeclaration(node) && node.name) existingNames.add(node.name.text);
    if (ts.isVariableStatement(node)) {
      for (const declaration of node.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name)) existingNames.add(declaration.name.text);
      }
    }
  });
}

function uniqueComponentName(base, variant, sourceFile) {
  const candidate = componentName(base, variant, sourceFile);
  if (!existingNames.has(candidate)) return candidate;
  let index = 2;
  while (existingNames.has(`${candidate}${index}`)) index += 1;
  return `${candidate}${index}`;
}

function definitionFor(base, siteVariant = false) {
  if (siteVariant) return siteButtonDefinition;
  return primitiveDefinitions[base] ?? null;
}

function baseForTag(tagName) {
  if (primitiveDefinitions[tagName]) return tagName;
  if (tagName === 'ExternalLink') return 'ExternalLink';
  if (tagName === 'NavLink') return 'NavLink';
  return null;
}

function mapForUsage(tagName, attributeName) {
  if (attributeName === 'siteVariant') {
    if (tagName !== 'Button') return null;
    return { base: 'Button', definition: siteButtonDefinition, siteVariant: true };
  }
  const base = baseForTag(tagName);
  if (!base) return null;
  const definition = definitionFor(base);
  return definition ? { base, definition, siteVariant: false } : null;
}

function jsxElements(sourceFile) {
  const nodes = [];
  function visit(node) {
    if (ts.isJsxElement(node)) nodes.push(node);
    if (ts.isJsxSelfClosingElement(node)) nodes.push(node);
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  return nodes;
}

function tagText(node, sourceFile) {
  return node.tagName.getText(sourceFile);
}

function literalAttribute(node, name) {
  return node.attributes.properties.find(
    (property) =>
      ts.isJsxAttribute(property) &&
      property.name.text === name &&
      property.initializer &&
      ts.isStringLiteral(property.initializer),
  );
}

function dynamicAttribute(node, name) {
  return node.attributes.properties.find(
    (property) =>
      ts.isJsxAttribute(property) && property.name.text === name && property.initializer,
  );
}

function editForAttribute(record, attribute) {
  return { start: attribute.getStart(record.sourceFile), end: attribute.getEnd(), text: '' };
}

const usages = [];
const dynamicUsages = [];
const generated = new Map();
const editsByFile = new Map();
const importsByFile = new Map();

for (const record of records.values()) {
  for (const node of jsxElements(record.sourceFile)) {
    const tagName = tagText(node.openingElement ?? node, record.sourceFile);
    const plans = [];
    for (const attributeName of ['visualVariant', 'siteVariant']) {
      const literal = literalAttribute(node.openingElement ?? node, attributeName);
      const dynamic = dynamicAttribute(node.openingElement ?? node, attributeName);
      if (!dynamic) continue;
      if (!literal) {
        dynamicUsages.push({
          file: relative(repositoryRoot, record.path),
          tagName,
          attributeName,
          text: dynamic.getText(record.sourceFile),
        });
        continue;
      }
      const variant = literal.initializer.text;
      const usageDefinition = mapForUsage(tagName, attributeName);
      if (!usageDefinition) continue;
      const styles = styleMaps.get(usageDefinition.definition.map)?.get(variant);
      if (!styles) {
        usages.push({
          file: relative(repositoryRoot, record.path),
          tagName,
          attributeName,
          variant,
          status: 'missing-style',
        });
        continue;
      }
      plans.push({ attributeName, literal, usageDefinition, styles, variant });
    }

    if (plans.length === 0) continue;
    const base = plans[0].usageDefinition.base;
    if (plans.some((plan) => plan.usageDefinition.base !== base)) continue;
    const variant = plans.map((plan) => plan.variant).join('-');
    const key = `${base}:${plans.map((plan) => `${plan.attributeName}:${plan.variant}`).join('|')}`;
    if (!generated.has(key)) {
      const styles =
        plans.length === 1
          ? plans[0].styles
          : `{ ${plans.map((plan) => `...${plan.styles}`).join(', ')} }`;
      generated.set(key, {
        name: uniqueComponentName(base, variant, record.path),
        base,
        variant,
        styles,
        styleKind: plans[0].usageDefinition.definition.styleKind,
        importPath: plans[0].usageDefinition.definition.importPath,
        siteVariant: plans.some((plan) => plan.usageDefinition.siteVariant),
      });
    }
    const component = generated.get(key);
    const opening = node.openingElement ?? node;
    const fileEdits = editsByFile.get(record.path) ?? [];
    fileEdits.push({
      start: opening.tagName.getStart(record.sourceFile),
      end: opening.tagName.getEnd(),
      text: component.name,
    });
    for (const plan of plans) fileEdits.push(editForAttribute(record, plan.literal));
    if (ts.isJsxElement(node)) {
      fileEdits.push({
        start: node.closingElement.tagName.getStart(record.sourceFile),
        end: node.closingElement.tagName.getEnd(),
        text: component.name,
      });
    }
    editsByFile.set(record.path, fileEdits);
    const fileImports = importsByFile.get(record.path) ?? new Set();
    fileImports.add(component.name);
    importsByFile.set(record.path, fileImports);
    for (const plan of plans) {
      usages.push({
        file: relative(repositoryRoot, record.path),
        tagName,
        attributeName: plan.attributeName,
        variant: plan.variant,
        component: component.name,
        status: 'planned',
      });
    }
  }
}

function componentSource(component) {
  return [
    "import { styled } from '@mui/material/styles';",
    `import { ${component.base === 'Button' && component.siteVariant ? 'Button' : component.base} as BaseComponent } from '${component.importPath}';`,
    '',
    `export const ${component.name} = styled(BaseComponent, { name: '${component.name}' })(${component.styles});`,
    '',
  ].join('\n');
}

function removeUnusedNamedImports(sourceFile, source) {
  const edits = [];
  for (const statement of sourceFile.statements) {
    if (!ts.isImportDeclaration(statement) || !statement.importClause) continue;
    const bindings = statement.importClause.namedBindings;
    if (!bindings || !ts.isNamedImports(bindings)) continue;
    const importText = statement.getText(sourceFile);
    const body = source.replace(importText, '');
    const unused = bindings.elements.filter((element) => {
      const name = element.name.text;
      return !body.split(/\b/).includes(name);
    });
    if (unused.length === 0) continue;
    const kept = bindings.elements.filter((element) => !unused.includes(element));
    if (kept.length === 0 && !statement.importClause.name) {
      edits.push({ start: statement.getStart(sourceFile), end: statement.getEnd(), text: '' });
      continue;
    }
    const defaultImport = statement.importClause.name?.getText(sourceFile);
    const namedImport =
      kept.length > 0 ? `{ ${kept.map((element) => element.getText(sourceFile)).join(', ')} }` : '';
    const importClause = [defaultImport, namedImport].filter(Boolean).join(', ');
    const typePrefix = statement.importClause.isTypeOnly ? 'type ' : '';
    edits.push({
      start: statement.getStart(sourceFile),
      end: statement.getEnd(),
      text: `import ${typePrefix}${importClause} from ${statement.moduleSpecifier.getText(sourceFile)};`,
    });
  }
  return applyEdits(source, edits);
}

function relativeImport(fromFile, componentNameValue) {
  const target = resolve(semanticRoot, `${componentNameValue}.tsx`);
  const path = relative(dirname(fromFile), target)
    .replace(/\\/g, '/')
    .replace(/\.tsx$/, '');
  return path.startsWith('.') ? path : `./${path}`;
}

function applyEdits(text, edits) {
  return edits
    .sort((left, right) => right.start - left.start)
    .reduce(
      (current, edit) => `${current.slice(0, edit.start)}${edit.text}${current.slice(edit.end)}`,
      text,
    );
}

const report = {
  mode,
  styleMaps: Object.fromEntries([...styleMaps].map(([name, entries]) => [name, entries.size])),
  plannedUsages: usages.filter((usage) => usage.status === 'planned').length,
  missingStyles: usages.filter((usage) => usage.status === 'missing-style'),
  dynamicUsages,
  generatedComponents: [...generated.values()].map(({ name, base, variant }) => ({
    name,
    base,
    variant,
  })),
};

if (mode === 'report') {
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  process.exit(0);
}

if (mode === 'check') {
  const violations = [
    ...report.missingStyles.map((usage) => ({ ...usage, status: 'missing-style' })),
    ...report.dynamicUsages.map((usage) => ({ ...usage, status: 'dynamic-variant' })),
  ];

  if (violations.length > 0) {
    process.stderr.write(`${JSON.stringify({ ...report, violations }, null, 2)}\n`);
    process.exit(1);
  }

  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  process.exit(0);
}

mkdirSync(semanticRoot, { recursive: true });
for (const component of generated.values()) {
  writeFileSync(resolve(semanticRoot, `${component.name}.tsx`), componentSource(component));
}

for (const [filePath, edits] of editsByFile) {
  const record = records.get(filePath);
  const imports = [...(importsByFile.get(filePath) ?? [])]
    .sort()
    .map((name) => `import { ${name} } from '${relativeImport(filePath, name)}';`)
    .join('\n');
  const updated = applyEdits(record.text, edits);
  const sourceFile = ts.createSourceFile(filePath, updated, ts.ScriptTarget.Latest, true);
  const importStatements = sourceFile.statements.filter(ts.isImportDeclaration);
  const insertionPoint = importStatements.length > 0 ? importStatements.at(-1).getEnd() : 0;
  const withImports = `${updated.slice(0, insertionPoint)}${imports ? `\n${imports}` : ''}${updated.slice(insertionPoint)}`;
  const finalSourceFile = ts.createSourceFile(filePath, withImports, ts.ScriptTarget.Latest, true);
  writeFileSync(filePath, removeUnusedNamedImports(finalSourceFile, withImports));
}

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);

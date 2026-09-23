import assert from 'node:assert/strict';
import test from 'node:test';
import babelParser from '@babel/eslint-parser';
import { Linter, RuleTester } from 'eslint';
import architecture from './architecture-plugin.mjs';

const languageOptions = {
  parser: babelParser,
  parserOptions: {
    requireConfigFile: false,
    babelOptions: { parserOpts: { plugins: ['typescript', 'jsx'] } },
  },
};

function verify(code, rule) {
  const linter = new Linter({ configType: 'flat' });
  return linter.verify(code, [
    {
      languageOptions,
      plugins: { architecture },
      rules: { [`architecture/${rule}`]: 'error' },
    },
  ]);
}

test('map-to-imported-component accepts an imported self-closing component', () => {
  const messages = verify(
    `import { Item } from './item'; const view = items.map((item) => <Item key={item.id} item={item} />);`,
    'map-to-imported-component',
  );
  assert.equal(messages.length, 0);
});

test('map-to-imported-component accepts a single return statement', () => {
  const messages = verify(
    `import Item from './item'; const view = items.map((item) => { return <Item item={item} />; });`,
    'map-to-imported-component',
  );
  assert.equal(messages.length, 0);
});

test('map-to-imported-component ignores data transformations', () => {
  const messages = verify(`const ids = items.map((item) => item.id);`, 'map-to-imported-component');
  assert.equal(messages.length, 0);
});

test('conditional-rendering-delegation accepts a delegated if branch', () => {
  const messages = verify(
    `import { HomeHeroTextTitle, HomeHeroTextBody } from './parts'; function Demo() { if (kind === 'title') { return <HomeHeroTextTitle {...props} />; } else { return <HomeHeroTextBody {...props} />; } }`,
    'conditional-rendering-delegation',
  );
  assert.equal(messages.length, 0);
});

test('conditional-rendering-delegation accepts a delegated logical branch', () => {
  const messages = verify(
    `import { HomeHeroTextBody } from './parts'; function Demo() { return visible && <HomeHeroTextBody {...props} />; }`,
    'conditional-rendering-delegation',
  );
  assert.equal(messages.length, 0);
});

test('conditional-rendering-delegation accepts an absent branch', () => {
  const messages = verify(
    `import { HomeHeroTextTitle } from './parts'; function Demo() { return kind === 'title' ? <HomeHeroTextTitle {...props} /> : null; }`,
    'conditional-rendering-delegation',
  );
  assert.equal(messages.length, 0);
});

test('conditional-rendering-delegation accepts a conditional prop value', () => {
  const messages = verify(
    `function Demo() { return <HomeHeroTextTitle tone={kind === 'title' ? 'primary' : 'secondary'} />; }`,
    'conditional-rendering-delegation',
  );
  assert.equal(messages.length, 0);
});

for (const [name, code, expectedCount] of [
  [
    'if branch with visual JSX',
    `function Demo() { if (kind === 'title') { return <Typography variant="h1">{props.children}</Typography>; } }`,
  ],
  [
    'ternary with visual JSX',
    `function Demo() { return kind === 'title' ? <Typography variant="h1">{props.children}</Typography> : <Typography>{props.children}</Typography>; }`,
    2,
  ],
  [
    'logical branch with children',
    `function Demo() { return visible && <HomeHeroTextBody {...props}><Text /></HomeHeroTextBody>; }`,
  ],
  [
    'logical branch with native JSX',
    `function Demo() { return visible && <div>{props.children}</div>; }`,
    1,
  ],
  [
    'switch branch with visual JSX',
    `function Demo() { switch (kind) { case 'title': return <Typography variant="h1">{props.children}</Typography>; default: return null; } }`,
    1,
  ],
  [
    'branch with multiple statements',
    `function Demo() { if (kind === 'title') { const tone = 'primary'; return <Typography tone={tone} />; } }`,
    1,
  ],
]) {
  test(`conditional-rendering-delegation rejects ${name}`, () => {
    const messages = verify(code, 'conditional-rendering-delegation');
    assert.equal(messages.length, expectedCount ?? 1);
    assert.equal(messages[0].messageId, 'inlineConditionalRender');
  });
}

for (const [name, code] of [
  ['local component', `const Item = () => null; items.map((item) => <Item item={item} />);`],
  ['native element', `items.map((item) => <div>{item.name}</div>);`],
  ['fragment', `import Item from './item'; items.map((item) => <><Item item={item} /></>);`],
  [
    'component children',
    `import Item from './item'; items.map((item) => <Item><span>{item.name}</span></Item>);`,
  ],
  [
    'conditional result',
    `import Item from './item'; items.map((item) => item.visible ? <Item item={item} /> : null);`,
  ],
  [
    'callback statements',
    `import Item from './item'; items.map((item) => { const id = item.id; return <Item id={id} />; });`,
  ],
]) {
  test(`map-to-imported-component rejects ${name}`, () => {
    const messages = verify(code, 'map-to-imported-component');
    assert.equal(messages.length, 1);
  });
}

test('no-mui-reexport rejects direct aliases', () => {
  const messages = verify(
    `import MuiButton from '@mui/material/Button'; export { MuiButton as Button };`,
    'no-mui-reexport',
  );
  assert.equal(messages.length, 1);
});

test('no-mui-reexport rejects exported alias variables', () => {
  const messages = verify(
    `import MuiButton from '@mui/material/Button'; export const Button = MuiButton;`,
    'no-mui-reexport',
  );
  assert.equal(messages.length, 1);
});

test('no-mui-reexport accepts functional wrappers', () => {
  const messages = verify(
    `import MuiButton from '@mui/material/Button'; export function Button(props) { return <MuiButton {...props} />; }`,
    'no-mui-reexport',
  );
  assert.equal(messages.length, 0);
});

test('no-explicit-any rejects any', () => {
  const messages = verify('const value: any = 1;', 'no-explicit-any');
  assert.equal(messages.length, 1);
});

test('no-unsafe-double-cast rejects unknown casts', () => {
  const messages = verify('const value = input as unknown as string;', 'no-unsafe-double-cast');
  assert.equal(messages.length, 1);
});

test('no-class-component rejects React class components', () => {
  const messages = verify(
    'class Card extends React.Component { render() { return null; } }',
    'no-class-component',
  );
  assert.equal(messages.length, 1);
});

test('no-generic-identifiers rejects vague bindings', () => {
  const messages = verify('const tmp = 1;', 'no-generic-identifiers');
  assert.equal(messages.length, 1);
});

test('no-unjustified-suppression rejects ts-ignore', () => {
  const messages = verify('// @ts-ignore\nconst value = 1;', 'no-unjustified-suppression');
  assert.equal(messages.length, 1);
});

test('no-unjustified-suppression accepts justified ts-expect-error', () => {
  const messages = verify(
    '// @ts-expect-error legacy declaration has no public type\nconst value = 1;',
    'no-unjustified-suppression',
  );
  assert.equal(messages.length, 0);
});

test('no-complex-inline-handler accepts a trivial expression handler', () => {
  const messages = verify('<Button onClick={() => setOpen(true)} />;', 'no-complex-inline-handler');
  assert.equal(messages.length, 0);
});

test('no-complex-inline-handler rejects control flow in an inline handler', () => {
  const messages = verify(
    '<Button onClick={() => { if (isReady) { submit(); } }} />;',
    'no-complex-inline-handler',
  );
  assert.equal(messages.length, 1);
});

for (const prop of ['sx', 'style', 'css']) {
  test(`no-visual-props-outside-ui rejects ${prop}`, () => {
    const messages = verify(`<Box ${prop}={{ color: 'red' }} />;`, 'no-visual-props-outside-ui');
    assert.equal(messages.length, 1);
    assert.equal(messages[0].messageId, 'visualProp');
  });
}

test('no-visual-props-outside-ui rejects nested visual props', () => {
  const messages = verify(
    `<Drawer slotProps={{ paper: { sx: { width: '20rem' } } }} />;`,
    'no-visual-props-outside-ui',
  );
  assert.equal(messages.length, 1);
  assert.equal(messages[0].messageId, 'visualProp');
});

test('one-function-per-file accepts one declared function and trivial callbacks', () => {
  const messages = verify(
    `function Page(props) { useEffect(() => load(props.id), [props.id]); return items.map((item) => item.id); }`,
    'one-function-per-file',
  );
  assert.equal(messages.length, 0);
});

test('one-function-per-file rejects multiple declared functions', () => {
  const messages = verify(
    `function Page(props) { return <Card value={props.value} />; } const Card = (props) => <Text>{props.value}</Text>;`,
    'one-function-per-file',
  );
  assert.equal(messages.length, 1);
});

test('component-props-contract accepts the named props pattern', () => {
  const messages = verify(
    `type UserCardProps = { value: string }; export const UserCard = (props: UserCardProps) => <Text>{props.value}</Text>;`,
    'component-props-contract',
  );
  assert.equal(messages.length, 0);
});

test('component-props-contract rejects destructured props', () => {
  const messages = verify(
    `type UserCardProps = { value: string }; export const UserCard = ({ value }: UserCardProps) => <Text>{value}</Text>;`,
    'component-props-contract',
  );
  assert.equal(messages.length, 1);
  assert.equal(messages[0].messageId, 'destructured');
});

test('component-props-contract rejects the wrong parameter and type names', () => {
  const messages = verify(
    `type Props = { value: string }; export const UserCard = (options: Props) => <Text>{options.value}</Text>;`,
    'component-props-contract',
  );
  assert.equal(messages.length, 2);
});

test('no-inline-object-type-in-parameters rejects inline parameter types', () => {
  const messages = verify(
    `function createUser(options: { name: string }) { return options.name; }`,
    'no-inline-object-type-in-parameters',
  );
  assert.equal(messages.length, 1);
});

test('no-inline-object-type-in-parameters rejects destructured inline types', () => {
  const messages = verify(
    `function createUser({ name }: { name: string }) { return name; }`,
    'no-inline-object-type-in-parameters',
  );
  assert.equal(messages.length, 1);
});

test('no-generic-props-type-name rejects generic props aliases', () => {
  const messages = verify(`type ComponentProps = { value: string };`, 'no-generic-props-type-name');
  assert.equal(messages.length, 1);
});

test('padding-around-type-statements requires spacing around type statements', () => {
  const messages = verify(
    `import { Item } from './item'; type ItemProps = { id: string }; const value = 1;`,
    'padding-around-type-statements',
  );
  assert.equal(messages.length, 2);
});

test('padding-around-type-statements accepts an import group and separated statements', () => {
  const messages = verify(
    `import { Item } from './item';\nimport type { ItemProps } from './types';\n\ntype LocalProps = { item: ItemProps };\n\nconst value = 1;`,
    'padding-around-type-statements',
  );
  assert.equal(messages.length, 0);
});

test('architecture rules pass their RuleTester contract', () => {
  const ruleTester = new RuleTester({
    languageOptions: {
      parser: babelParser,
      parserOptions: languageOptions.parserOptions,
    },
  });

  ruleTester.run('map-to-imported-component', architecture.rules['map-to-imported-component'], {
    valid: [
      `import Item from './item'; items.map((item) => <Item item={item} />);`,
      `const ids = items.map((item) => item.id);`,
    ],
    invalid: [
      {
        code: `import Item from './item'; items.map((item) => <Item><span /></Item>);`,
        errors: [{ messageId: 'invalidMap' }],
      },
    ],
  });

  ruleTester.run(
    'conditional-rendering-delegation',
    architecture.rules['conditional-rendering-delegation'],
    {
      valid: [
        `import { VisibleSection } from './parts'; function Demo() { if (visible) return <VisibleSection />; }`,
        `import { TitleSection, BodySection } from './parts'; function Demo() { return kind === 'title' ? <TitleSection /> : <BodySection />; }`,
        `import { VisibleSection } from './parts'; function Demo() { return visible && <VisibleSection />; }`,
      ],
      invalid: [
        {
          code: `function Demo() { if (visible) return <section><VisibleSection /></section>; }`,
          errors: [{ messageId: 'inlineConditionalRender' }],
        },
        {
          code: `function Demo() { return visible ? <TitleSection><Text /></TitleSection> : null; }`,
          errors: [{ messageId: 'inlineConditionalRender' }],
        },
      ],
    },
  );

  ruleTester.run('no-mui-reexport', architecture.rules['no-mui-reexport'], {
    valid: [
      `import MuiButton from '@mui/material/Button'; export function Button(props) { return <MuiButton {...props} />; }`,
    ],
    invalid: [
      {
        code: `import MuiButton from '@mui/material/Button'; export { MuiButton as Button };`,
        errors: [{ messageId: 'directExport' }],
      },
    ],
  });

  ruleTester.run('no-visual-props-outside-ui', architecture.rules['no-visual-props-outside-ui'], {
    valid: [`<Box />;`],
    invalid: [
      {
        code: `<Box sx={{ color: 'red' }} />;`,
        errors: [{ messageId: 'visualProp' }],
      },
      {
        code: `<Drawer slotProps={{ paper: { sx: { width: '20rem' } } }} />;`,
        errors: [{ messageId: 'visualProp' }],
      },
    ],
  });

  ruleTester.run('one-function-per-file', architecture.rules['one-function-per-file'], {
    valid: [
      `function Page(props) { useEffect(() => load(props.id), [props.id]); return <Text>{props.id}</Text>; }`,
    ],
    invalid: [
      {
        code: `function Page(props) { return <Text>{props.id}</Text>; } const load = () => null;`,
        errors: [{ messageId: 'multipleFunctions' }],
      },
    ],
  });

  ruleTester.run(
    'padding-around-type-statements',
    architecture.rules['padding-around-type-statements'],
    {
      valid: [`import Item from './item';\n\ntype ItemProps = { id: string };\n\nconst value = 1;`],
      invalid: [
        {
          code: `import Item from './item';\ntype ItemProps = { id: string };\nconst value = 1;`,
          output: `import Item from './item';\n\ntype ItemProps = { id: string };\n\nconst value = 1;`,
          errors: [{ messageId: 'expectedBlankLine' }, { messageId: 'expectedBlankLine' }],
        },
      ],
    },
  );

  ruleTester.run('component-props-contract', architecture.rules['component-props-contract'], {
    valid: [
      `type UserCardProps = { value: string }; export const UserCard = (props: UserCardProps) => <Text>{props.value}</Text>;`,
    ],
    invalid: [
      {
        code: `type UserCardProps = { value: string }; export const UserCard = ({ value }: UserCardProps) => <Text>{value}</Text>;`,
        errors: [{ messageId: 'destructured' }],
      },
    ],
  });

  ruleTester.run(
    'no-inline-object-type-in-parameters',
    architecture.rules['no-inline-object-type-in-parameters'],
    {
      valid: [`function createUser(options: CreateUserOptions) { return options.name; }`],
      invalid: [
        {
          code: `function createUser(options: { name: string }) { return options.name; }`,
          errors: [{ messageId: 'inlineType' }],
        },
        {
          code: `function createUser({ name }: { name: string }) { return name; }`,
          errors: [{ messageId: 'inlineType' }],
        },
      ],
    },
  );

  ruleTester.run('no-generic-props-type-name', architecture.rules['no-generic-props-type-name'], {
    valid: [`type UserCardProps = { value: string };`],
    invalid: [
      {
        code: `type Props = { value: string };`,
        errors: [{ messageId: 'genericName' }],
      },
    ],
  });
});

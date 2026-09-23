function isJsx(node) {
  return node?.type === 'JSXElement' || node?.type === 'JSXFragment';
}

function containsJsx(node, sourceCode) {
  if (!node) {
    return false;
  }
  if (isJsx(node)) {
    return true;
  }
  const keys = sourceCode.visitorKeys[node.type] ?? [];
  return keys.some((key) => {
    const value = node[key];
    return Array.isArray(value)
      ? value.some((child) => containsJsx(child, sourceCode))
      : containsJsx(value, sourceCode);
  });
}

function unwrapExpression(node) {
  let current = node;
  while (
    current &&
    [
      'ParenthesizedExpression',
      'TSAsExpression',
      'TSTypeAssertion',
      'TSNonNullExpression',
    ].includes(current.type)
  ) {
    current = current.expression;
  }
  return current;
}

function callbackExpression(callback) {
  if (callback.type === 'ArrowFunctionExpression' && callback.body.type !== 'BlockStatement') {
    return unwrapExpression(callback.body);
  }
  if (callback.body.type !== 'BlockStatement' || callback.body.body.length !== 1) {
    return undefined;
  }
  const statement = callback.body.body[0];
  return statement.type === 'ReturnStatement' ? unwrapExpression(statement.argument) : undefined;
}

function isMapCall(node) {
  return (
    node.callee.type === 'MemberExpression' &&
    !node.callee.computed &&
    node.callee.property.type === 'Identifier' &&
    node.callee.property.name === 'map'
  );
}

function isImportedSelfClosingComponent(expression, importedBindings) {
  if (expression?.type !== 'JSXElement') {
    return false;
  }
  const opening = expression.openingElement;
  return (
    opening.selfClosing &&
    opening.name.type === 'JSXIdentifier' &&
    /^[A-Z]/.test(opening.name.name) &&
    importedBindings.has(opening.name.name)
  );
}

const mapToImportedComponent = {
  meta: {
    type: 'suggestion',
    docs: { description: 'Require JSX maps to delegate to one imported component' },
    schema: [],
    messages: {
      invalidMap:
        'A JSX map must return exactly one self-closing component imported from another file.',
    },
  },
  create(context) {
    const sourceCode = context.sourceCode;
    const importedBindings = new Set();
    return {
      ImportDeclaration(node) {
        for (const specifier of node.specifiers) {
          importedBindings.add(specifier.local.name);
        }
      },
      CallExpression(node) {
        if (!isMapCall(node)) {
          return;
        }
        const callback = node.arguments[0];
        if (
          !callback ||
          !['ArrowFunctionExpression', 'FunctionExpression'].includes(callback.type) ||
          !containsJsx(callback.body, sourceCode)
        ) {
          return;
        }
        const expression = callbackExpression(callback);
        if (!isImportedSelfClosingComponent(expression, importedBindings)) {
          context.report({ node, messageId: 'invalidMap' });
        }
      },
    };
  },
};

function isRestrictedVisualModule(source) {
  return source.startsWith('@mui/') || source.startsWith('@emotion/');
}

function isTopLevelDeclaration(node) {
  let parent = node.parent;
  while (
    parent &&
    ['ExportNamedDeclaration', 'VariableDeclarator', 'VariableDeclaration'].includes(parent.type)
  ) {
    parent = parent.parent;
  }
  return parent?.type === 'Program';
}

function isProjectFunction(node) {
  if (!isTopLevelDeclaration(node)) {
    return false;
  }
  if (node.type === 'FunctionDeclaration' || node.id) {
    return true;
  }

  const parent = node.parent;
  return (
    (parent?.type === 'VariableDeclarator' && parent.init === node) ||
    (parent?.type === 'AssignmentExpression' && parent.right === node)
  );
}

function componentFunctionName(node) {
  if (node.type === 'FunctionDeclaration') {
    return node.id?.name;
  }
  const parent = node.parent;
  return parent?.type === 'VariableDeclarator' && parent.id.type === 'Identifier'
    ? parent.id.name
    : undefined;
}

function isReactComponentFunction(node, sourceCode) {
  const name = componentFunctionName(node);
  return Boolean(name && /^[A-Z]/.test(name) && containsJsx(node.body, sourceCode));
}

function parameterTypeName(parameter) {
  const annotation = parameter.typeAnnotation?.typeAnnotation;
  return annotation?.type === 'TSTypeReference' && annotation.typeName.type === 'Identifier'
    ? annotation.typeName.name
    : undefined;
}

const componentPropsContract = {
  meta: {
    type: 'problem',
    docs: { description: 'Require named props contracts and a props parameter for components' },
    schema: [],
    messages: {
      destructured: 'Component props must be received through a parameter named props.',
      parameterName: 'Component props parameters must be named props.',
      missingType: 'Component props must use a named <ComponentName>Props type.',
      wrongType: 'Component props must use the named <ComponentName>Props type.',
    },
  },
  create(context) {
    const sourceCode = context.sourceCode;
    return {
      FunctionDeclaration(node) {
        if (!isReactComponentFunction(node, sourceCode)) {
          return;
        }
        validateComponentProps(context, node, node.id.name);
      },
      FunctionExpression(node) {
        if (isReactComponentFunction(node, sourceCode)) {
          validateComponentProps(context, node, componentFunctionName(node));
        }
      },
      ArrowFunctionExpression(node) {
        if (isReactComponentFunction(node, sourceCode)) {
          validateComponentProps(context, node, componentFunctionName(node));
        }
      },
    };
  },
};

function validateComponentProps(context, node, componentName) {
  if (!componentName || node.params.length === 0) {
    return;
  }
  const parameter = node.params[0];
  if (parameter.type !== 'Identifier') {
    context.report({ node: parameter, messageId: 'destructured' });
    return;
  }
  if (parameter.name !== 'props') {
    context.report({ node: parameter, messageId: 'parameterName' });
  }
  const expectedType = `${componentName}Props`;
  const typeName = parameterTypeName(parameter);
  if (!typeName) {
    context.report({ node: parameter, messageId: 'missingType' });
    return;
  }
  if (typeName !== expectedType) {
    context.report({ node: parameter, messageId: 'wrongType' });
  }
}

const noInlineObjectTypeInParameters = {
  meta: {
    type: 'problem',
    docs: { description: 'Require named types for function parameters' },
    schema: [],
    messages: {
      inlineType: 'Function parameters must use a named type instead of an inline object type.',
    },
  },
  create(context) {
    return {
      ':function'(node) {
        for (const parameter of node.params) {
          if (parameter.typeAnnotation?.typeAnnotation?.type === 'TSTypeLiteral') {
            context.report({ node: parameter, messageId: 'inlineType' });
          }
        }
      },
    };
  },
};

const noGenericPropsTypeName = {
  meta: {
    type: 'problem',
    docs: { description: 'Require responsibility-specific props type names' },
    schema: [],
    messages: {
      genericName: 'Use a responsibility-specific props type name such as <ComponentName>Props.',
    },
  },
  create(context) {
    return {
      TSTypeAliasDeclaration(node) {
        if (['Props', 'ComponentProps', 'Tipagem'].includes(node.id.name)) {
          context.report({ node: node.id, messageId: 'genericName' });
        }
      },
      TSInterfaceDeclaration(node) {
        if (['Props', 'ComponentProps', 'Tipagem'].includes(node.id.name)) {
          context.report({ node: node.id, messageId: 'genericName' });
        }
      },
    };
  },
};

const noExplicitAny = {
  meta: {
    type: 'problem',
    docs: { description: 'Disallow explicit any types' },
    schema: [],
    messages: {
      explicitAny: 'Use an explicit type instead of any.',
    },
  },
  create(context) {
    return {
      TSAnyKeyword(node) {
        context.report({ node, messageId: 'explicitAny' });
      },
    };
  },
};

const noUnsafeDoubleCast = {
  meta: {
    type: 'problem',
    docs: { description: 'Disallow double casts through unknown' },
    schema: [],
    messages: {
      doubleCast: 'Do not cast through unknown; narrow the value explicitly.',
    },
  },
  create(context) {
    function isUnknownType(node) {
      return node?.typeAnnotation?.type === 'TSUnknownKeyword';
    }

    return {
      TSAsExpression(node) {
        if (node.expression.type === 'TSAsExpression' && isUnknownType(node.expression)) {
          context.report({ node, messageId: 'doubleCast' });
        }
      },
      TSTypeAssertion(node) {
        if (node.expression.type === 'TSAsExpression' && isUnknownType(node.expression)) {
          context.report({ node, messageId: 'doubleCast' });
        }
      },
    };
  },
};

const noClassComponent = {
  meta: {
    type: 'problem',
    docs: { description: 'Disallow React class components' },
    schema: [],
    messages: {
      classComponent: 'Use a function component instead of a React class component.',
    },
  },
  create(context) {
    function isReactComponentBase(node) {
      if (node?.type === 'Identifier') {
        return ['Component', 'PureComponent'].includes(node.name);
      }
      return (
        node?.type === 'MemberExpression' &&
        !node.computed &&
        node.object.type === 'Identifier' &&
        node.object.name === 'React' &&
        node.property.type === 'Identifier' &&
        ['Component', 'PureComponent'].includes(node.property.name)
      );
    }

    return {
      ClassDeclaration(node) {
        if (isReactComponentBase(node.superClass)) {
          context.report({ node, messageId: 'classComponent' });
        }
      },
      ClassExpression(node) {
        if (isReactComponentBase(node.superClass)) {
          context.report({ node, messageId: 'classComponent' });
        }
      },
    };
  },
};

const maxFunctionParameters = {
  meta: {
    type: 'problem',
    docs: { description: 'Limit implementation function parameters' },
    schema: [{ type: 'integer', minimum: 0 }],
    messages: {
      tooManyParameters: 'Functions may have at most {{maximum}} positional parameters.',
    },
  },
  create(context) {
    const maximum = context.options[0] ?? 3;

    function verify(node) {
      if (node.params.length > maximum) {
        context.report({
          node,
          messageId: 'tooManyParameters',
          data: { maximum },
        });
      }
    }

    return {
      FunctionDeclaration: verify,
      FunctionExpression: verify,
      ArrowFunctionExpression: verify,
    };
  },
};

const noGenericIdentifiers = {
  meta: {
    type: 'suggestion',
    docs: { description: 'Disallow vague binding names' },
    schema: [],
    messages: {
      genericIdentifier: 'Use a name that expresses the responsibility of this binding.',
    },
  },
  create(context) {
    const names = new Set(['foo', 'bar', 'baz', 'tmp', 'obj']);

    function reportIdentifier(node) {
      if (names.has(node.name)) {
        context.report({ node, messageId: 'genericIdentifier' });
      }
    }

    return {
      VariableDeclarator(node) {
        if (node.id.type === 'Identifier') {
          reportIdentifier(node.id);
        }
      },
      FunctionDeclaration(node) {
        if (node.id) {
          reportIdentifier(node.id);
        }
        for (const parameter of node.params) {
          if (parameter.type === 'Identifier') {
            reportIdentifier(parameter);
          }
        }
      },
      FunctionExpression(node) {
        for (const parameter of node.params) {
          if (parameter.type === 'Identifier') {
            reportIdentifier(parameter);
          }
        }
      },
      ArrowFunctionExpression(node) {
        for (const parameter of node.params) {
          if (parameter.type === 'Identifier') {
            reportIdentifier(parameter);
          }
        }
      },
    };
  },
};

const noUnjustifiedSuppression = {
  meta: {
    type: 'problem',
    docs: { description: 'Require justified and targeted tool suppressions' },
    schema: [],
    messages: {
      tsIgnore: 'Use @ts-expect-error with a justification instead of @ts-ignore.',
      tsNoCheck: 'Do not disable TypeScript checking for a file.',
      missingReason: 'Tool suppressions must include a justification after --.',
      multipleRules: 'A suppression must target exactly one rule.',
    },
  },
  create(context) {
    const sourceCode = context.sourceCode;

    function verifyToolComment(node, value) {
      if (/@ts-ignore\b/.test(value)) {
        context.report({ node, messageId: 'tsIgnore' });
      }
      if (/@ts-nocheck\b/.test(value)) {
        context.report({ node, messageId: 'tsNoCheck' });
      }
      if (/@ts-expect-error\b/.test(value) && !/@ts-expect-error\b.+/.test(value)) {
        context.report({ node, messageId: 'missingReason' });
      }
      if (/eslint-disable(?:-next-line)?\b/.test(value)) {
        const rules = value
          .replace(/^.*eslint-disable(?:-next-line)?\s*/, '')
          .split('--')[0]
          .split(',')
          .map((rule) => rule.trim())
          .filter(Boolean);
        if (rules.length !== 1) {
          context.report({ node, messageId: 'multipleRules' });
        }
        if (!/--\s*\S/.test(value)) {
          context.report({ node, messageId: 'missingReason' });
        }
      }
    }

    return {
      Program() {
        for (const comment of sourceCode.getAllComments()) {
          verifyToolComment(comment, comment.value);
        }
      },
    };
  },
};

function isTypeStatement(node) {
  return ['TSInterfaceDeclaration', 'TSTypeAliasDeclaration'].includes(node.type);
}

function getStatementListPosition(node) {
  const parent = node.parent;
  if (!parent || !Array.isArray(parent.body)) {
    return undefined;
  }
  const index = parent.body.indexOf(node);
  return index < 0 ? undefined : { statements: parent.body, index };
}

function hasBlankLineBetween(sourceCode, leftNode, rightNode) {
  let previousToken = sourceCode.getLastToken(leftNode);
  while (previousToken) {
    const nextToken = sourceCode.getTokenAfter(previousToken, { includeComments: true });
    if (!nextToken) {
      return false;
    }
    if (nextToken.loc.start.line - previousToken.loc.end.line >= 2) {
      return true;
    }
    if (nextToken.range[0] >= rightNode.range[0]) {
      return false;
    }
    previousToken = nextToken;
  }
  return false;
}

function insertBlankLineAfter(fixer, sourceCode, leftNode, rightNode) {
  let previousToken = sourceCode.getLastToken(leftNode);
  let insertionToken = previousToken;
  while (previousToken) {
    const nextToken = sourceCode.getTokenAfter(previousToken, { includeComments: true });
    if (!nextToken || nextToken.range[0] >= rightNode.range[0]) {
      break;
    }
    insertionToken = nextToken;
    previousToken = nextToken;
  }
  const padding = insertionToken.loc.end.line === rightNode.loc.start.line ? '\n\n' : '\n';
  return fixer.insertTextAfter(insertionToken, padding);
}

const paddingAroundTypeStatements = {
  meta: {
    type: 'layout',
    fixable: 'whitespace',
    docs: { description: 'Require blank lines around TypeScript type statements' },
    schema: [],
    messages: {
      expectedBlankLine: 'TypeScript type statements must be separated by blank lines.',
    },
  },
  create(context) {
    const sourceCode = context.sourceCode;
    return {
      TSTypeAliasDeclaration(node) {
        verifyTypeStatementPadding(context, sourceCode, node);
      },
      TSInterfaceDeclaration(node) {
        verifyTypeStatementPadding(context, sourceCode, node);
      },
    };
  },
};

function verifyTypeStatementPadding(context, sourceCode, node) {
  const position = getStatementListPosition(node);
  if (!position) {
    return;
  }
  const previous = position.statements[position.index - 1];
  const next = position.statements[position.index + 1];
  if (previous && !hasBlankLineBetween(sourceCode, previous, node)) {
    context.report({
      node,
      messageId: 'expectedBlankLine',
      fix: (fixer) => insertBlankLineAfter(fixer, sourceCode, previous, node),
    });
  }
  if (next && !isTypeStatement(next) && !hasBlankLineBetween(sourceCode, node, next)) {
    context.report({
      node,
      messageId: 'expectedBlankLine',
      fix: (fixer) => insertBlankLineAfter(fixer, sourceCode, node, next),
    });
  }
}

const oneFunctionPerFile = {
  meta: {
    type: 'problem',
    docs: { description: 'Limit implementation files to one project function' },
    schema: [],
    messages: {
      multipleFunctions:
        'Implementation files may declare only one project function; extract additional functions into their own files.',
    },
  },
  create(context) {
    let functionCount = 0;

    return {
      FunctionDeclaration() {
        functionCount += 1;
      },
      FunctionExpression(node) {
        if (isProjectFunction(node)) {
          functionCount += 1;
        }
      },
      ArrowFunctionExpression(node) {
        if (isProjectFunction(node)) {
          functionCount += 1;
        }
      },
      'Program:exit'(node) {
        if (functionCount > 1) {
          context.report({ node, messageId: 'multipleFunctions' });
        }
      },
    };
  },
};

const noMuiReexport = {
  meta: {
    type: 'problem',
    docs: { description: 'Disallow exporting MUI and Emotion bindings without a UI wrapper' },
    schema: [],
    messages: {
      directExport: 'UI modules must export functional wrappers, not MUI or Emotion bindings.',
    },
  },
  create(context) {
    const restrictedBindings = new Set();
    return {
      ImportDeclaration(node) {
        if (!isRestrictedVisualModule(node.source.value)) {
          return;
        }
        for (const specifier of node.specifiers) {
          restrictedBindings.add(specifier.local.name);
        }
      },
      ExportAllDeclaration(node) {
        if (isRestrictedVisualModule(node.source.value)) {
          context.report({ node, messageId: 'directExport' });
        }
      },
      ExportNamedDeclaration(node) {
        if (node.exportKind === 'type') {
          return;
        }
        if (node.source && isRestrictedVisualModule(node.source.value)) {
          context.report({ node, messageId: 'directExport' });
          return;
        }
        for (const specifier of node.specifiers) {
          if (restrictedBindings.has(specifier.local.name)) {
            context.report({ node: specifier, messageId: 'directExport' });
          }
        }
        if (node.declaration?.type !== 'VariableDeclaration') {
          return;
        }
        for (const declaration of node.declaration.declarations) {
          if (
            declaration.init?.type === 'Identifier' &&
            restrictedBindings.has(declaration.init.name)
          ) {
            context.report({ node: declaration, messageId: 'directExport' });
          }
        }
      },
      ExportDefaultDeclaration(node) {
        if (
          node.declaration.type === 'Identifier' &&
          restrictedBindings.has(node.declaration.name)
        ) {
          context.report({ node, messageId: 'directExport' });
        }
      },
    };
  },
};

function hasControlFlow(node, sourceCode) {
  if (!node) {
    return false;
  }
  if (
    [
      'ConditionalExpression',
      'DoWhileStatement',
      'ForInStatement',
      'ForOfStatement',
      'ForStatement',
      'IfStatement',
      'SwitchStatement',
      'TryStatement',
      'WhileStatement',
    ].includes(node.type)
  ) {
    return true;
  }
  const keys = sourceCode.visitorKeys[node.type] ?? [];
  return keys.some((key) => {
    const value = node[key];
    return Array.isArray(value)
      ? value.some((child) => hasControlFlow(child, sourceCode))
      : hasControlFlow(value, sourceCode);
  });
}

const noComplexInlineHandler = {
  meta: {
    type: 'suggestion',
    docs: { description: 'Keep inline JSX handlers trivial' },
    schema: [],
    messages: {
      complexHandler: 'Extract complex JSX handlers into a named function.',
    },
  },
  create(context) {
    const sourceCode = context.sourceCode;
    return {
      JSXAttribute(node) {
        if (node.name.type !== 'JSXIdentifier' || !/^on[A-Z]/.test(node.name.name)) {
          return;
        }
        const expression = node.value?.expression;
        if (
          !expression ||
          !['ArrowFunctionExpression', 'FunctionExpression'].includes(expression.type)
        ) {
          return;
        }
        if (
          expression.body.type === 'BlockStatement' &&
          (expression.body.body.length > 1 || hasControlFlow(expression.body, sourceCode))
        ) {
          context.report({ node, messageId: 'complexHandler' });
        }
      },
    };
  },
};

function unwrapConditionalBranch(node) {
  let current = node;
  while (
    current &&
    [
      'ParenthesizedExpression',
      'TSAsExpression',
      'TSTypeAssertion',
      'TSNonNullExpression',
    ].includes(current.type)
  ) {
    current = current.expression;
  }
  if (current?.type === 'ReturnStatement' || current?.type === 'ExpressionStatement') {
    return unwrapConditionalBranch(current.argument ?? current.expression);
  }
  if (current?.type === 'BlockStatement') {
    const statements = current.body.filter((statement) => statement.type !== 'EmptyStatement');
    if (statements.length === 1) {
      return unwrapConditionalBranch(statements[0]);
    }
    return current;
  }
  return current;
}

function isDelegatedConditionalComponent(node, importedBindings) {
  return (
    node?.type === 'JSXElement' &&
    node.openingElement.selfClosing &&
    node.openingElement.name.type === 'JSXIdentifier' &&
    /^[A-Z]/.test(node.openingElement.name.name) &&
    importedBindings.has(node.openingElement.name.name)
  );
}

function isInsideReactComponent(node, sourceCode) {
  let current = node.parent;
  while (current) {
    if (
      ['FunctionDeclaration', 'FunctionExpression', 'ArrowFunctionExpression'].includes(
        current.type,
      ) &&
      isReactComponentFunction(current, sourceCode)
    ) {
      return true;
    }
    current = current.parent;
  }
  return false;
}

function reportConditionalBranch(context, sourceCode, branch, owner, importedBindings) {
  if (!isInsideReactComponent(owner, sourceCode)) {
    return;
  }
  const expression = unwrapConditionalBranch(branch);
  if (!containsJsx(expression, sourceCode)) {
    return;
  }
  if (!isDelegatedConditionalComponent(expression, importedBindings)) {
    context.report({ node: expression ?? branch, messageId: 'inlineConditionalRender' });
  }
}

function switchCaseBranch(caseNode, sourceCode) {
  const statements = caseNode.consequent.filter((statement) => statement.type !== 'EmptyStatement');
  if (statements.length > 1 && statements.some((statement) => containsJsx(statement, sourceCode))) {
    return caseNode;
  }
  const returnStatement = caseNode.consequent.find(
    (statement) => statement.type === 'ReturnStatement',
  );
  if (returnStatement) {
    return returnStatement;
  }
  return caseNode.consequent.find((statement) => containsJsx(statement, sourceCode));
}

const conditionalRenderingDelegation = {
  meta: {
    type: 'problem',
    docs: { description: 'Require conditional JSX branches to delegate to components' },
    schema: [],
    messages: {
      inlineConditionalRender:
        'Conditional JSX branches must delegate to one self-closing component without implementing its visual tree.',
    },
  },
  create(context) {
    const sourceCode = context.sourceCode;
    const importedBindings = new Set();

    return {
      ImportDeclaration(node) {
        for (const specifier of node.specifiers) {
          importedBindings.add(specifier.local.name);
        }
      },
      IfStatement(node) {
        reportConditionalBranch(context, sourceCode, node.consequent, node, importedBindings);
        if (node.alternate) {
          reportConditionalBranch(context, sourceCode, node.alternate, node, importedBindings);
        }
      },
      SwitchCase(node) {
        const branch = switchCaseBranch(node, sourceCode);
        if (branch) {
          reportConditionalBranch(context, sourceCode, branch, node, importedBindings);
        }
      },
      ConditionalExpression(node) {
        reportConditionalBranch(context, sourceCode, node.consequent, node, importedBindings);
        reportConditionalBranch(context, sourceCode, node.alternate, node, importedBindings);
      },
      LogicalExpression(node) {
        if (node.operator === '&&' || node.operator === '||') {
          reportConditionalBranch(context, sourceCode, node.right, node, importedBindings);
        }
      },
    };
  },
};

const noVisualPropsOutsideUi = {
  meta: {
    type: 'problem',
    docs: { description: 'Keep visual implementation props inside the UI layer' },
    schema: [],
    messages: {
      visualProp:
        'The sx, style, and css props are only allowed inside UI layers; use a UI variant or component.',
    },
  },
  create(context) {
    function isVisualProperty(node) {
      if (
        node.key.type !== 'Identifier' ||
        !['sx', 'style', 'css'].includes(node.key.name) ||
        node.parent.type !== 'ObjectExpression'
      ) {
        return false;
      }
      if (
        node.parent.parent?.type === 'JSXExpressionContainer' &&
        node.parent.parent.parent?.type === 'JSXAttribute'
      ) {
        return false;
      }
      let parent = node.parent;
      while (parent) {
        if (parent.type === 'JSXExpressionContainer') {
          return true;
        }
        parent = parent.parent;
      }
      return false;
    }

    return {
      JSXAttribute(node) {
        if (node.name.type === 'JSXIdentifier' && ['sx', 'style', 'css'].includes(node.name.name)) {
          context.report({ node, messageId: 'visualProp' });
        }
      },
      Property(node) {
        if (isVisualProperty(node)) {
          context.report({ node, messageId: 'visualProp' });
        }
      },
    };
  },
};

export default {
  meta: { name: 'eslint-plugin-portfolio-architecture', version: '1.0.0' },
  rules: {
    'component-props-contract': componentPropsContract,
    'conditional-rendering-delegation': conditionalRenderingDelegation,
    'map-to-imported-component': mapToImportedComponent,
    'no-complex-inline-handler': noComplexInlineHandler,
    'no-class-component': noClassComponent,
    'no-explicit-any': noExplicitAny,
    'no-generic-props-type-name': noGenericPropsTypeName,
    'no-generic-identifiers': noGenericIdentifiers,
    'no-inline-object-type-in-parameters': noInlineObjectTypeInParameters,
    'max-function-parameters': maxFunctionParameters,
    'no-mui-reexport': noMuiReexport,
    'no-unsafe-double-cast': noUnsafeDoubleCast,
    'no-unjustified-suppression': noUnjustifiedSuppression,
    'no-visual-props-outside-ui': noVisualPropsOutsideUi,
    'one-function-per-file': oneFunctionPerFile,
    'padding-around-type-statements': paddingAroundTypeStatements,
  },
};

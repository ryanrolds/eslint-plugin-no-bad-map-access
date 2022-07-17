import {ESLintUtils} from '@typescript-eslint/utils';
import {badMapAccess} from "./bad_map_access";

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: '../tsconfig.json',
    tsconfigRootDir: __dirname,
  },
});

ruleTester.run('flag accessing of Map properties', badMapAccess, {
  valid: [
    {
      code: 'const m = new Map(); m.set("foo", 1);',
    },
    {
      code: 'const m = new Map(); const foo = m.get("foo");',
    },
    {
      code: 'const m = new Map(); const foo = m.has("foo");',
    },
    {
      code: 'const m = new Map(); const foo = m.delete("foo");',
    },
    {
      code: 'const m = new Map(); const foo = m.size;',
    }

  ],
  invalid: [
    {
      code: 'const m = new Map(); m["foo"] = 1;',
      errors: [{messageId: 'badMapAccess'}],
    },
    {
      code: 'const m = new Map(); const foot = m["foo"];',
      errors: [{messageId: 'badMapAccess'}],
    },
    {
      code: 'const m = new Map(); !!m["foo"];',
      errors: [{messageId: 'badMapAccess'}],
    },
    {
      code: 'const m = new Map(); delete m["foo"];',
      errors: [{messageId: 'badMapAccess'}],
    },
    {
      code: 'const m = new Map(); Object.keys(m).length',
      errors: [{messageId: 'badMapAccess'}],
    }
  ]
});

ruleTester.run('object methods', badMapAccess, {
  valid: [
    {
      code: `const m = new Map();
    const foo = m.keys();`,
    },
    {
      code: `const m = new Map();
    const foo = m.values();`,
    },
    {
      code: `const m = new Map();
      const foo = m.entities();`,
    }
  ],
  invalid: [
    {
      code: `const m = new Map();
    const foo = Object.keys(m);`,
      errors: [{messageId: 'badMapAccess'}],
    },
    {
      code: `const m = new Map();
      const foo = Object.values(m);`,
      errors: [{messageId: 'badMapAccess'}],
    },
    {
      code: `const m = new Map();
      const foo = Object.entities(m);`,
      errors: [{messageId: 'badMapAccess'}],
    }
  ]
});

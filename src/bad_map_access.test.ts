import {ESLintUtils} from '@typescript-eslint/utils';
import {noBadMapAccess} from "./bad_map_access";

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: '../tsconfig.json',
    tsconfigRootDir: __dirname,
  },
});

ruleTester.run('flag accessing of Map properties', noBadMapAccess, {
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

ruleTester.run('object and lodash methods', noBadMapAccess, {
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
    },
    {
      code: `const m = new Map();
        const foo = Array.from(m.entities());`,
    },
    {
      code: `const m = new Map();
        const foo = Array.from(m.values());`,
    },
    {
      code: `const m = new Map();
        const foo = Array.from(m.keys());`,
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
    },
    {
      code: `const m = new Map();
        const foo = _.keys(m);`,
      errors: [{messageId: 'badMapAccess'}],
    },
    {
      code: `const m = new Map();
        const foo = _.values(m);`,
      errors: [{messageId: 'badMapAccess'}],
    },
    {
      code: `const m = new Map();
        const foo = _.entities(m);`,
      errors: [{messageId: 'badMapAccess'}],
    },
    {
      code: `const m = new Map();
        const foo = Array.from(m);`,
      errors: [{messageId: 'badMapAccess'}],
    }
  ]
});

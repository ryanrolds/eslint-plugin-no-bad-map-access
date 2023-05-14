import {ESLintUtils} from '@typescript-eslint/utils';
import {noBadAccess} from './bad_access';

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: '../tsconfig.json',
    tsconfigRootDir: __dirname,
  },
});

ruleTester.run('flag accessing of Set properties', noBadAccess, {
  valid: [
    {
      code: 'const m = new Set(); m.add("foo");',
    },
    {
      code: 'const m = new Set(); const foo = m.get("foo");',
    },
    {
      code: 'const m = new Set(); const foo = m.has("foo");',
    },
    {
      code: 'const m = new Set(); const foo = m.delete("foo");',
    },
    {
      code: 'const m = new Set(); const foo = m.size;',
    },
    {
      code: `
        type Foo = Set<string>;; 
        const f = new Foo();
        const size = f.size;
      `,
    },
  ],
  invalid: [
    {
      code: 'const m = new Set(); m["foo"] = 1;',
      errors: [{messageId: 'badAccess'}],
    },
    {
      code: 'const m = new Set(); const foot = m["foo"];',
      errors: [{messageId: 'badAccess'}],
    },
    {
      code: 'const m = new Set(); !!m["foo"];',
      errors: [{messageId: 'badAccess'}],
    },
    {
      code: 'const m = new Set(); delete m["foo"];',
      errors: [{messageId: 'badAccess'}],
    },
    {
      code: 'const m = new Set(); Object.keys(m).length',
      errors: [{messageId: 'badAccess'}],
    },
    {
      code: `
        type Foo = Set<string, number>;
        function bar(foo: Foo): number {
          return foo["foo"];
        }   
      `,
      errors: [{messageId: 'badAccess'}],
    },
  ]
});

ruleTester.run('object and lodash methods', noBadAccess, {
  valid: [
    {
      code: `
        const m = new Set();
        const foo = m.keys();`,
    },
    {
      code: `
        const m = new Set();
        const foo = m.values();`,
    },
    {
      code: `
        const m = new Set();
        const foo = m.entries();`,
    },
    {
      code: `
        const m = new Set();
        const foo = Array.from(m.entries());`,
    },
    {
      code: `
        const m = new Set();
        const foo = Array.from(m.values());`,
    },
    {
      code: `
        const m = new Set();
        const foo = Array.from(m.keys());`,
    },
    {
      code: `
        const m = new Set();
        Array.from(m.entries())
      `,
    },
  ],
  invalid: [
    {
      code: `
        const m = new Set();
        const foo = Object.keys(m);
      `,
      errors: [{messageId: 'badAccess'}],
    },
    {
      code: `
        const m = new Set();
        const foo = Object.values(m);
      `,
      errors: [{messageId: 'badAccess'}],
    },
    {
      code: `
        const m = new Set();
        const foo = Object.entities(m);
      `,
      errors: [{messageId: 'badAccess'}],
    },
    {
      code: `
        const m = new Set();
        const foo = _.keys(m);
      `,
      errors: [{messageId: 'badAccess'}],
    },
    {
      code: `
        const m = new Set();
        const foo = _.values(m);
      `,
      errors: [{messageId: 'badAccess'}],
    },
    {
      code: `
        const m = new Set();
        const foo = _.entities(m);
      `,
      errors: [{messageId: 'badAccess'}],
    },
    {
      code: `
        const m = new Set();
        const foo = Array.from(m);
      `,
      errors: [{messageId: 'badAccess'}],
    },
    {
      code: `
        type Foo = Set<string>;
        function bar(foo: Foo): number[] {
          return Object.values(foo);
        }
      `,
      errors: [{messageId: 'badAccess'}],
    },
  ]
});

ruleTester.run('object as Set', noBadAccess, {
  valid: [
    {
      code: `const foo = {} as Record<string, number>;`,
    },
    {
      code: `
        type Foo = Record<string, number>;
        const foo = {} as Foo;
      `,
    },
  ],
  invalid: [
    {
      code: `const foo = {} as Set<string, number>;`,
      errors: [{messageId: 'badAccess'}],
    },
    {
      code: `
        type Foo = Set<string, number>;
        const foo = {} as Foo;
      `,
      errors: [{messageId: 'badAccess'}],
    },
  ]
});

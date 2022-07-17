import {ESLintUtils} from '@typescript-eslint/utils';
import {badMapAccess} from "./bad_map_access";

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: '../tsconfig.json',
    tsconfigRootDir: __dirname,
  },
});

ruleTester.run('map setting', badMapAccess, {
  valid: [{
    code: 'const m = new Map(); m.set("foo", 1);',
  }],
  invalid: [{
    code: 'const m = new Map(); m["foo"] = 1;',
    // we can use messageId from the rule object
    errors: [{messageId: 'badMapAccess'}],
  }]
});

ruleTester.run('map getting', badMapAccess, {
  valid: [{
    code: 'const m = new Map(); const foo = m.get("foo");',
  }],
  invalid: [{
    code: 'const m = new Map(); const foot = m["foo"];',
    // we can use messageId from the rule object
    errors: [{messageId: 'badMapAccess'}],
  }]
});
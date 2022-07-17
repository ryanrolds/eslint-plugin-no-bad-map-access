import {ESLintUtils} from '@typescript-eslint/utils';

const createRule = ESLintUtils.RuleCreator(
  name => `https://example.com/rule/${name}`,
);


const allowedMethods = ['set', 'get', 'has', 'delete', 'forEach', 'clear', 'size'];

// Type: RuleModule<"badMapAccess", ...>
export const badMapAccess = createRule({
  create(context) {
    return {
      'MemberExpression'(node) {
        // Do not report set/get
        if (node.property.type === 'Identifier' &&
          allowedMethods.indexOf(node.property.name) > -1) {
          return
        }

        const parserServices = ESLintUtils.getParserServices(context);
        const checker = parserServices.program.getTypeChecker();

        // get identifier type
        const objectNode = parserServices.esTreeNodeToTSNodeMap.get(node.object);
        const objectType = checker.getTypeAtLocation(objectNode);

        if (objectType.symbol?.escapedName === "Map") {
          context.report({
            messageId: 'badMapAccess',
            node: node,
          });
        }
      }
    };
  },
  name: 'bad-map-access',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Access Map via methods methods',
      recommended: 'error',
    },
    messages: {
      badMapAccess: 'Use Map methods instead of accessing properties',
    },
    schema: [],
  },
  defaultOptions: [],
});

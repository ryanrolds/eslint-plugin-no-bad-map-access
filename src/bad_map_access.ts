import {CallExpression, Identifier, MemberExpression} from '@typescript-eslint/types/dist/generated/ast-spec';
import {ESLintUtils} from '@typescript-eslint/utils';


const createRule = ESLintUtils.RuleCreator(
  name => `https://github.com/ryanrolds/eslint-plugin-no-bad-map-access#${name}`,
);

// Member access allowed on Map
const allowedMethods = ['set', 'get', 'has', 'delete', 'forEach', 'clear', 'size',
  'entities', 'keys', 'values'];

// Names of objects that are not allowed to have Map as first argument in CallExpression
const foriddenObjectNames = ['Object', '_', 'lodash', 'Array']

// Type: RuleModule<"noBadMapAccess", ...>
export const noBadMapAccess = createRule({
  create(context) {
    return {
      // Get MemberExpressions and check if Identifier being called is a Map
      // and that flag if a property is accessed or the mathod is not allowed
      MemberExpression(node) {
        // Do not check type if MemberExpression is accessing an allowed method
        if (node.property.type === 'Identifier' &&
          allowedMethods.indexOf(node.property.name) > -1) {
          return
        }

        // Get the TypeScript type checker
        const parserServices = ESLintUtils.getParserServices(context);
        const checker = parserServices.program.getTypeChecker();

        // Get identifier type
        const objectNode = parserServices.esTreeNodeToTSNodeMap.get(node.object);
        const objectType = checker.getTypeAtLocation(objectNode);

        // If Identifier is a map, then report invalid access
        if (objectType.symbol?.escapedName === "Map") {
          context.report({
            messageId: 'badMapAccess',
            node: node,
          });
        }
      },
      // Look for calls to disallowed objects and reports if first argument is a Map
      'CallExpression > MemberExpression > Identifier'(node: Identifier) {
        // If Identifier is not a disallowed Object name
        if (foriddenObjectNames.indexOf(node.name) === -1) {
          return;
        }

        // Type wonkiness at play that I should be better understood - sorry future Ryan
        const memberExpression = node.parent as MemberExpression;
        const callExpression = memberExpression.parent as CallExpression;

        // If no arguments, we are done
        if (callExpression.arguments.length === 0) {
          return;
        }

        // Get the TypeScript type checker
        const parserServices = ESLintUtils.getParserServices(context);
        const checker = parserServices.program.getTypeChecker();

        // Get TypeScript type of first argument
        // NOTE: Not flexible enough for general use, but works for my specific use case
        const objectNode = parserServices.esTreeNodeToTSNodeMap.get(callExpression.arguments[0]);
        const objectType = checker.getTypeAtLocation(objectNode);

        // If first argument is a map, then report invalid access
        if (objectType.symbol?.escapedName === "Map") {
          context.report({
            messageId: 'badMapAccess',
            node: node,
          });
        }
      }
    };
  },
  name: 'no-bad-map-access',
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

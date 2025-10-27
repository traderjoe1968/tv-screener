/**
 * Logical operators for complex queries (AND/OR)
 */

import { ExpressionDict, OperationDict, FilterOperationDict } from './models';

/**
 * AND operator - combines multiple filter conditions with AND logic
 * @param expressions - Filter expressions to combine
 * @returns OperationDict with AND logic
 */
export function And(
  ...expressions: Array<FilterOperationDict | OperationDict>
): OperationDict {
  const operands: Array<ExpressionDict | OperationDict> = expressions.map(
    (expr) => {
      // If it's already an OperationDict, return as-is
      if ('operation' in expr && typeof expr.operation === 'object' && expr.operation !== null && 'operator' in expr.operation) {
        return expr as OperationDict;
      }
      // Otherwise wrap it as an ExpressionDict
      return {
        expression: expr as FilterOperationDict,
      };
    }
  );

  return {
    operation: {
      operator: 'and',
      operands,
    },
  };
}

/**
 * OR operator - combines multiple filter conditions with OR logic
 * @param expressions - Filter expressions to combine
 * @returns OperationDict with OR logic
 */
export function Or(
  ...expressions: Array<FilterOperationDict | OperationDict>
): OperationDict {
  const operands: Array<ExpressionDict | OperationDict> = expressions.map(
    (expr) => {
      // If it's already an OperationDict, return as-is
      if ('operation' in expr && typeof expr.operation === 'object' && expr.operation !== null && 'operator' in expr.operation) {
        return expr as OperationDict;
      }
      // Otherwise wrap it as an ExpressionDict
      return {
        expression: expr as FilterOperationDict,
      };
    }
  );

  return {
    operation: {
      operator: 'or',
      operands,
    },
  };
}

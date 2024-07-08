import { util } from '@aws-appsync/utils';

/**
 * Updates the 'completed' attribute of an item in the DynamoDB table.
 * @param {import('@aws-appsync/utils').Context} ctx the context
 * @returns {import('@aws-appsync/utils').DynamoDBUpdateItemRequest} the request
 */
export function request(ctx) {
  return {
    operation: 'UpdateItem',
    key: util.dynamodb.toMapValues({ id: ctx.args.id }),
    update: {
      expression: 'SET #completed = :completed',
      expressionNames: {
        '#completed': 'completed',
      },
      expressionValues: util.dynamodb.toMapValues({
        ':completed': ctx.args.completed,
      }),
    },
    condition: {
      expression: 'attribute_exists(id)',
    },
  };
}

/**
 * Returns the updated item or throws an error if the operation failed.
 * @param {import('@aws-appsync/utils').Context} ctx the context
 * @returns {*} the updated item
 */
export function response(ctx) {
  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type);
  }
  return ctx.result;
}

import { AttributeValue, QueryCommandInput } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { Optional } from 'common/helpers';
import { Pagination } from './dynamo/dynamo-repository.service';

type FilterOperator = 'equals' | 'contains' | 'begins_with';

type BuildFilterParams = {
  command: Omit<QueryCommandInput, 'TableName'>;
  operator: FilterOperator;
  attributeName: string;
  attributeValue: string | number | boolean;
  nestedPath?: string;
};

type BuildUpdateParams = {
  UpdateExpression: string;
  ExpressionAttributeNames: Record<string, string>;
  ExpressionAttributeValues: Record<string, AttributeValue>;
};

abstract class ExtraRepositoryMethods {
  protected extractCurrentPage = (
    LastEvaluatedKey: Record<string, AttributeValue>,
  ): Optional<string> =>
    LastEvaluatedKey ? JSON.stringify(unmarshall(LastEvaluatedKey)) : undefined;

  protected applyPagination = ({ sort, limit, page }: Pagination) => ({
    Limit: limit || 10,
    ScanIndexForward: sort === 'ASC',
    ExclusiveStartKey: page ? marshall(JSON.parse(page)) : undefined,
  });

  protected buildFilter({
    command,
    operator,
    nestedPath,
    attributeName,
    attributeValue,
  }: BuildFilterParams) {
    command.FilterExpression = command.FilterExpression
      ? `${command.FilterExpression} AND`
      : '';

    const baseExpression = nestedPath
      ? `${nestedPath}.#${attributeName}`
      : `#${attributeName}`;

    const operators = {
      equals: ` ${baseExpression} = :${attributeName}`,
      contains: ` contains(${baseExpression}, :${attributeName})`,
      begins_with: ` begins_with(${baseExpression}, :${attributeName})`,
    };

    command.FilterExpression += operators[operator];
    command.ExpressionAttributeNames = command.ExpressionAttributeNames || {};
    command.ExpressionAttributeNames[`#${attributeName}`] = attributeName;

    const expressionAttributeValues = unmarshall(
      command.ExpressionAttributeValues ?? {},
    );

    command.ExpressionAttributeValues = marshall({
      ...expressionAttributeValues,
      [`:${attributeName}`]: attributeValue,
    });
  }

  protected buildAttributeNamesAndValues = (payload: Record<string, any>) => {
    const keys = Object.keys(payload);

    const ExpressionAttributeNames = keys.reduce(
      (acc, key) => ({
        ...acc,
        [`#${key}`]: key,
      }),
      {},
    );

    const ExpressionAttributeValues = keys.reduce(
      (acc, key) => ({
        ...acc,
        [`:${key}`]: payload[key],
      }),
      {},
    );

    return { ExpressionAttributeNames, ExpressionAttributeValues };
  };

  protected buildUpdate<T>({
    path,
    payload,
  }: {
    path?: string;
    payload: T extends Record<string, any> ? T : never;
  }): BuildUpdateParams {
    const keys = Object.keys(payload);

    const UpdateExpression = `SET ${keys
      .map((key) => `${path ? `${path}.` : ''}#${key} = :${key}`)
      .toString()}`;

    const { ExpressionAttributeNames, ExpressionAttributeValues } =
      this.buildAttributeNamesAndValues(payload);

    Object.assign(ExpressionAttributeNames, {
      ['#Updated']: 'Updated',
    });

    Object.assign(ExpressionAttributeValues, {
      [':Updated']: new Date().toISOString(),
    });

    return {
      UpdateExpression: `${UpdateExpression}, #Updated = :Updated`,
      ExpressionAttributeNames,
      ExpressionAttributeValues: marshall(ExpressionAttributeValues, {
        convertEmptyValues: true,
        removeUndefinedValues: true,
        convertClassInstanceToMap: true,
      }),
    };
  }
}

export { ExtraRepositoryMethods };

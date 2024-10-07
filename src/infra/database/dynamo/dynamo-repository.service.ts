import {
  AttributeValue,
  GetItemCommand,
  GetItemCommandInput,
  GetItemCommandOutput,
  paginateQuery,
  PutItemCommand,
  PutItemCommandInput,
  PutItemCommandOutput,
  QueryCommand,
  QueryCommandInput,
  QueryCommandOutput,
  ScanCommand,
  ScanCommandInput,
  ScanCommandOutput,
  UpdateItemCommand,
  UpdateItemCommandOutput,
  UpdateItemInput,
} from '@aws-sdk/client-dynamodb';
import { Injectable } from '@nestjs/common';
import { DynamoDBClientService } from './dynamo.service';

export type Pagination = {
  sort: 'ASC' | 'DESC';
  page?: string;
  limit: number;
};

export type DynamoCommand<T> = Omit<T, 'TableName'>;

@Injectable()
export class DynamoRepositoryService {
  constructor(
    private readonly client: DynamoDBClientService,
    private readonly TableName: string,
  ) {}

  public get instance() {
    return this.client;
  }

  public get tableName() {
    return this.TableName;
  }

  async queryPaginator(params: DynamoCommand<QueryCommandInput>): Promise<
    Omit<
      QueryCommandOutput & {
        Attempts: number;
      },
      '$metadata'
    >
  > {
    const paginator = paginateQuery(
      {
        client: this.client,
      },
      {
        ...params,
        TableName: this.TableName,
      },
    );

    const Items: Record<string, AttributeValue>[] = [];
    let Attempts = 0;

    for await (const page of paginator) {
      if (page.Items) Items.push(...page.Items);
      Attempts += 1;
    }

    return {
      Items,
      Count: Items.length,
      Attempts,
    };
  }

  async query(
    params: DynamoCommand<QueryCommandInput>,
  ): Promise<QueryCommandOutput> {
    return this.client.send(
      new QueryCommand({
        ...params,
        TableName: this.TableName,
      }),
    );
  }

  async find(
    params: DynamoCommand<GetItemCommandInput>,
  ): Promise<GetItemCommandOutput> {
    return this.client.send(
      new GetItemCommand({
        ...params,
        TableName: this.TableName,
      }),
    );
  }

  async create(
    params: DynamoCommand<PutItemCommandInput>,
  ): Promise<PutItemCommandOutput> {
    return this.client.send(
      new PutItemCommand({
        ...params,
        TableName: this.TableName,
      }),
    );
  }

  async update(
    params: DynamoCommand<UpdateItemInput>,
  ): Promise<UpdateItemCommandOutput> {
    return this.client.send(
      new UpdateItemCommand({
        ...params,
        TableName: this.TableName,
      }),
    );
  }

  async scan(
    params: DynamoCommand<ScanCommandInput>,
  ): Promise<ScanCommandOutput> {
    return this.client.send(
      new ScanCommand({
        ...params,
        TableName: this.TableName,
      }),
    );
  }
}

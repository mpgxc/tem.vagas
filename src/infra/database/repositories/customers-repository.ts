import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OptionalPromise } from 'common/helpers';
import { ProfileEntity } from 'domain/customer/profile';
import { DynamoRepositoryService } from '../dynamo/dynamo-repository.service';
import { ExtraRepositoryMethods } from '../helpers';

@Injectable()
export class CustomersRepository extends ExtraRepositoryMethods {
  constructor(
    private readonly config: ConfigService,
    private readonly client: DynamoRepositoryService,
  ) {
    super();
  }

  async create(o: ProfileEntity): Promise<void> {
    await this.client.create({
      Item: marshall(o),
    });
  }

  async findByEmail(email: string): OptionalPromise<ProfileEntity> {
    const { Items } = await this.client.query({
      IndexName: 'Email-index',
      KeyConditionExpression: `Email = :Email`,
      ExpressionAttributeValues: marshall({
        ':Email': email,
      }),
    });

    const [Item] = Items ?? [];

    return Item ? (unmarshall(Item) as ProfileEntity) : undefined;
  }
}

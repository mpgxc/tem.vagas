import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DynamoDBClientService
  extends DynamoDBClient
  implements OnModuleDestroy
{
  constructor(config: ConfigService) {
    super({
      region: config.getOrThrow<string>('AWS.AWS_REGION'),
      credentials: {
        accessKeyId: config.getOrThrow<string>('AWS.AWS_ACCESS_KEY_ID'),
        secretAccessKey: config.getOrThrow<string>('AWS.AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  onModuleInit() {
    return this;
  }

  onModuleDestroy() {
    this.destroy();
  }
}

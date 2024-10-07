import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthenticateUseCase } from 'usecases/authenticate';
import { RegisterCustomerProfileUseCase } from 'usecases/register-customer';
import { AccessTokenAuthGuard } from './auth/access-token-auth.guard';
import { AccessTokenStrategy } from './auth/access-token.strategy';
import { AuthenticateController } from './controllers/authenticate.controller';
import { CustomerProfileController } from './controllers/customer-profile.controller';
import { RegisterCustomerProfileController } from './controllers/register-customer.controller';
import { DynamoRepositoryService } from './database/dynamo/dynamo-repository.service';
import { DynamoDBClientService } from './database/dynamo/dynamo.service';
import { CustomersRepository } from './database/repositories/customers-repository';
import { configuration } from './environment';
import { HasherProvider } from './providers/hasher';
import { TokensProvider } from './providers/tokens.provider';
import { PrismaService } from './database/prisma.service';
import { LogxModule } from '@app/logx';

@Module({
  imports: [
    PassportModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    LogxModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      signOptions: {
        algorithm: 'RS256',
      },
    }),
  ],
  controllers: [
    CustomerProfileController,
    AuthenticateController,
    RegisterCustomerProfileController,
  ],
  providers: [
    AccessTokenStrategy,
    // RefreshTokenStrategy,
    /**
     * Providers
     */
    {
      provide: APP_GUARD,
      useClass: AccessTokenAuthGuard,
    },
    TokensProvider,
    HasherProvider,
    /**
     * UseCases
     */
    AuthenticateUseCase,
    RegisterCustomerProfileUseCase,
    /**
     * Repositories
     */
    CustomersRepository,
    /**
     * DynamoDB Services
     */
    DynamoDBClientService,
    {
      provide: DynamoRepositoryService,
      useFactory: (client: DynamoDBClientService, config: ConfigService) =>
        new DynamoRepositoryService(
          client,
          config.getOrThrow('AWS.AWS_DYNAMODB_TABLE'),
        ),
      inject: [DynamoDBClientService, ConfigService],
    },
    PrismaService,
  ],
})
export class InfraModule {}

import { LogxModule } from '@app/logx';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthenticateUseCase } from 'usecases/authenticate';
import { RegisterCustomerProfileUseCase } from 'usecases/register-customer';
import { AccessTokenAuthGuard } from './auth/access-token-auth.guard';
import { AccessTokenStrategy } from './auth/access-token.strategy';
import { RefreshTokenStrategy } from './auth/refresh-token.strategy';
import { AuthenticateController } from './controllers/authenticate.controller';
import { CustomerProfileController } from './controllers/customer-profile.controller';
import { RegisterCustomerProfileController } from './controllers/register-customer.controller';
import { PrismaService } from './database/prisma.service';
import { CustomersRepository } from './database/repositories/customers-repository';
import { configuration } from './environment';
import { HasherProvider } from './providers/hasher';
import { TokensProvider } from './providers/tokens.provider';

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
    RefreshTokenStrategy,
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
    PrismaService,
  ],
})
export class InfraModule {}

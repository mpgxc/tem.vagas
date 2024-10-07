import { LoggerInject, LoggerService } from '@app/logx';
import {
  BadRequestException,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Result } from 'common/helpers';
import { CustomersRepository } from 'infra/database/repositories/customers-repository';
import { HasherProvider } from 'infra/providers/hasher';
import { TokensProvider } from 'infra/providers/tokens.provider';

export class AuthenticateUseCase {
  constructor(
    @LoggerInject(AuthenticateUseCase.name)
    private readonly logger: LoggerService,
    private readonly tokens: TokensProvider,
    private readonly hasher: HasherProvider,
    private readonly repository: CustomersRepository,
  ) {}

  async handle({
    email,
    password,
  }: AuthenticateInput): Promise<AuthenticateOutput> {
    try {
      const profile = await this.repository.findByEmail(email);

      if (!profile) {
        return Result.Err(
          new BadRequestException({
            name: 'InalidCredentials',
            message: 'Cant authenticate account! Invalid credentials!',
          }),
        );
      }

      const passwordMatch = await this.hasher.isMatch(
        password,
        profile.Content.password,
      );

      if (!passwordMatch) {
        return Result.Err(
          new BadRequestException({
            name: 'InvalidCredentials',
            message: 'Cant authenticate account! Invalid credentials!',
          }),
        );
      }

      const [accessToken, refreshToken] = await Promise.all([
        this.tokens.buildAccessToken(
          {
            customerId: profile.Content.customerId,
            email: profile.Content.email,
            name: profile.Content.name,
          },
          {
            issuer: 'meus_cupons.authenticator',
            subject: profile.PK,
          },
        ),
        this.tokens.buildRefreshToken(
          {
            customerId: profile.Content.customerId,
            email: profile.Content.email,
            name: profile.Content.name,
          },
          {
            issuer: 'meus_cupons.authenticator',
            subject: profile.PK,
          },
        ),
      ]);

      return Result.Ok({
        accessToken,
        refreshToken,
      });
    } catch (error) {
      this.logger.error(
        `An unexpected error occurred - ${(error as Error).message}`,
      );

      return Result.Err(
        new InternalServerErrorException({
          name: 'UnexpectedError',
          message: `An unexpected error occurred - ${(error as Error).message}`,
        }),
      );
    }
  }
}

export type AuthenticateInput = {
  email: string;
  password: string;
};

export type AuthenticateOutput = Result<
  {
    accessToken: string;
    refreshToken: string;
  },
  HttpException
>;

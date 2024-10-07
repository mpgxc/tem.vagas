import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokensProvider {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async buildRefreshToken<T extends object>(
    payload: T,
    options: TokenOptions,
  ): Promise<string> {
    const expiresIn = `${this.config.get('JWT.JWT_REFRESH_EXPIRES_IN')}m`;

    return this.jwt.signAsync(payload, {
      privateKey: this.config.get('JWT.JWT_REFRESH_SECRET_KEY'),
      issuer: `refresh_token.${options.issuer}`,
      audience: 'RefreshToken',
      subject: options.subject,
      expiresIn,
      header: {
        typ: 'RJWT',
        alg: 'RS256',
      },
    });
  }

  async buildAccessToken<T extends object>(
    payload: T,
    options: TokenOptions,
  ): Promise<string> {
    const expiresIn = `${this.config.get('JWT.JWT_TOKEN_EXPIRES_IN')}m`;

    return this.jwt.signAsync(payload, {
      issuer: `access_token.${options.issuer}`,
      audience: 'AccessToken',
      expiresIn,
      privateKey: this.config.get('JWT.JWT_TOKEN_SECRET_KEY'),
      subject: options.subject,
      header: {
        typ: 'JWT',
        alg: 'RS256',
      },
    });
  }
}

export type TokenOptions = {
  issuer: string;
  subject: string;
};

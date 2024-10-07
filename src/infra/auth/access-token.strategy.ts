import { LoggerInject, LoggerService } from '@app/logx';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy) {
  constructor(
    @LoggerInject(AccessTokenStrategy.name)
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
  ) {
    super({
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT.JWT_TOKEN_SECRET_KEY'),
      algorithms: ['RS256'],
    });
  }

  async validate(payload: AccessTokenPayload) {
    /**
     * This method is called by Passport when it validates the token.
     */
    return payload;
  }
}

export type AccessTokenPayload = {
  customerId: string;
  email: string;
  name: string;
  iat: number;
  exp: number;
  aud: string;
  iss: string;
  sub: string;
};

export type CurrentCustomer = AccessTokenPayload;

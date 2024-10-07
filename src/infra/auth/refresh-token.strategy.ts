import { LoggerInject, LoggerService } from '@app/logx';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    @LoggerInject(RefreshTokenStrategy.name)
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
  ) {
    super({
      ignoreExpiration: false,
      passReqToCallback: true,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT.JWT_TOKEN_REFRESH_SECRET'),
      algorithms: ['RS256'],
    });
  }

  async validate(payload: any) {
    this.logger.log('payload', payload);

    return payload;
  }
}

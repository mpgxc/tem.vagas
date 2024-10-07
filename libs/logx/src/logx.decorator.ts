import { Inject, Logger } from '@nestjs/common';
import { LogxModule } from './logx.module';
import { getLoggerToken } from './logx.utils';

/**
 * Injects a `LoggerService`
 *
 * @param token Token which gets prepended before every log message
 */
export const LoggerInject = (token: string = '') => {
  const tokenAlreadyUsed =
    `LoggerInject('${token}') is already used. ` +
    `Please use another token or use LoggerInject('${token}_1') instead.`;

  if (LogxModule.tokensForLoggers.includes(token)) {
    Logger.error(tokenAlreadyUsed, 'LogxModule');

    throw new Error(tokenAlreadyUsed);
  }

  LogxModule.tokensForLoggers.push(token);

  return Inject(getLoggerToken(token));
};

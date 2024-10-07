import { DynamicModule, Provider } from '@nestjs/common';
import { createLoggerProviders } from './logx.provider';
import { LoggerService } from './logx.service';

type LoggerModuleOptions = {
  isGlobal?: boolean;
};

export class LogxModule {
  public static tokensForLoggers = new Array<string>();

  static forRoot(options?: LoggerModuleOptions): DynamicModule {
    const prefixedLoggerProviders: Provider<LoggerService>[] =
      createLoggerProviders(this.tokensForLoggers);

    return {
      module: LogxModule,
      providers: [LoggerService, ...prefixedLoggerProviders],
      exports: [LoggerService, ...prefixedLoggerProviders],
      global: Boolean(options?.isGlobal),
    };
  }
}

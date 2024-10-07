import { LoggerService } from '@app/logx';
import 'dotenv/config';
import { z } from 'zod';

const schema = {
  APP: z.object({
    APP_PORT: z.string().default('3003'),
    APP_HOST: z.string().default('0.0.0.0'),
    APP_COOKIE_SECRET: z.string(),
  }),
  JWT: z.object({
    JWT_REFRESH_EXPIRES_IN: z.string().default('30'),
    JWT_TOKEN_EXPIRES_IN: z.string().default('15'),
    JWT_TOKEN_SECRET_KEY: z
      .string()
      .transform((o) => Buffer.from(o, 'base64').toString()),
    JWT_TOKEN_PUBLIC_KEY: z
      .string()
      .transform((o) => Buffer.from(o, 'base64').toString()),
    JWT_REFRESH_SECRET_KEY: z
      .string()
      .transform((o) => Buffer.from(o, 'base64').toString()),
    JWT_REFRESH_PUBLIC_KEY: z
      .string()
      .transform((o) => Buffer.from(o, 'base64').toString()),
  }),
  AWS: z.object({
    AWS_REGION: z.string().default('us-east-1'),
    AWS_ACCESS_KEY_ID: z.string(),
    AWS_SECRET_ACCESS_KEY: z.string(),
    AWS_DYNAMODB_TABLE: z.string(),
  }),
};

type CombinedSchemaKey = keyof typeof schema;

type ConfigurationEnvs = {
  [key in CombinedSchemaKey]: z.infer<(typeof schema)[key]>;
};

const configuration = (): ConfigurationEnvs => {
  const logger = new LoggerService('Configuration Environment');

  return Object.keys(schema).reduce((acc, o) => {
    const validate = schema[o as CombinedSchemaKey].safeParse(process.env);

    if (!validate.success) {
      logger.error(
        "Configuration environment doesn't match",
        validate.error.message,
        'Configuration Environment',
      );

      process.exit(1);
    }

    return {
      ...acc,
      [o]: validate.data,
    };
  }, {} as ConfigurationEnvs);
};

export { configuration };

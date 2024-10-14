import { MailerModule as MailerModuleBase } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTestAccount } from 'nodemailer';

@Module({
  imports: [
    MailerModuleBase.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const mode = config.get('APP.NODE_ENV');

        if (mode === 'test') {
          return {
            transport: {
              jsonTransport: true,
            },
          };
        }

        if (mode === 'development') {
          const account = await createTestAccount();

          return {
            transport: {
              host: account.smtp.host,
              port: account.smtp.port,
              secure: account.smtp.secure,
              auth: {
                user: account.user,
                pass: account.pass,
              },
            },
            defaults: {
              from: '"No Reply" <mpgxc@tem.vagas.com>',
            },
          };
        }

        return {
          /**
           * @todo: Implement production transport
           */
          transport: {},
        };
      },
    }),
  ],
})
export class MailerModule {}

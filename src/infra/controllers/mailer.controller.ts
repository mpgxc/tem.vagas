import { LoggerService } from '@app/logx';
import { MailerService } from '@nestjs-modules/mailer';
import { Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { getTestMessageUrl } from 'nodemailer';
import { welcomeEmailRender } from '../../../emails/welcome';

@ApiBearerAuth()
@ApiTags('mailer')
@Controller('mailer')
export class MailerController {
  constructor(
    private readonly mailer: MailerService,
    private readonly logger: LoggerService,
  ) {}

  @ApiResponse({
    status: 200,
    description: 'Send email',
  })
  @Post('send')
  async handle(): Promise<void> {
    const email = 'mpgxc@gmail.com';

    const { html, text } = await welcomeEmailRender({
      username: 'John Doe',
    });

    const result = await this.mailer.sendMail({
      to: `Recipient <${email}>`,
      subject: 'Welcome to our platform!',
      text,
      html,
    });

    this.logger.debug(`Preview URL: ${getTestMessageUrl(result)}`);
  }
}

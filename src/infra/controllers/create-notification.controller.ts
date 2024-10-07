import { LoggerInject, LoggerService } from '@app/logx';
import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { notificationFactory } from 'domain/notification/notification';

@ApiTags('notifications')
@Controller('notifications')
export class CreateNotificationController {
  constructor(
    @LoggerInject(CreateNotificationController.name)
    private readonly logger: LoggerService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The notification has been successfully created.',
  })
  async handle(): Promise<void> {
    const notification = notificationFactory({
      title: 'Notification title',
      description: 'Notification description',
    });

    this.logger.log('Notification created', { notification });
  }
}

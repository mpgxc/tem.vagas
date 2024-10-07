import { LoggerInject, LoggerService } from '@app/logx';
import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  Notification,
  notificationFactory,
} from 'domain/notification/notification';

@ApiTags('notifications')
@Controller('notifications')
export class ListNotificationsController {
  constructor(
    @LoggerInject(ListNotificationsController.name)
    private readonly logger: LoggerService,
  ) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'The notifications has been successfully listed.',
  })
  async handle(): Promise<Notification[]> {
    const notification = notificationFactory({
      title: 'Notification title',
      description: 'Notification description',
    });

    this.logger.log('Notifications listed', { notifications: [notification] });

    return [notification];
  }
}

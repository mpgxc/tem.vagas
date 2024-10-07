import { LoggerInject, LoggerService } from '@app/logx';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'infra/auth/public.decorator';
import { AuthenticateUseCase } from 'usecases/authenticate';
import { AuthenticatePayload } from './validators/authenticate-payload';

@ApiTags('Auth')
@Controller('auth')
export class AuthenticateController {
  constructor(
    @LoggerInject(AuthenticateController.name)
    private readonly logger: LoggerService,
    private readonly usecase: AuthenticateUseCase,
  ) {}

  @Public()
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The user has been successfully authenticated.',
  })
  async handle(@Body() payload: AuthenticatePayload) {
    const output = await this.usecase.handle(payload.value);

    if (!output.isOk) {
      this.logger.error('Authentication failed', output.error);

      throw output.error;
    }

    this.logger.log('Authentication successful');

    return output.value;
  }
}

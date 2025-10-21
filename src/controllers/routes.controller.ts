import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/helpers/decorators/public.decorator';

@Controller()
export class RoutesController {
  @Public()
  @Get('healthcheck')
  healthcheck() {
    return 'OK';
  }
}

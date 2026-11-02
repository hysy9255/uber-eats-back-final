import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  health() {
    console.log('health is checked');
    return { ok: true };
  }
}

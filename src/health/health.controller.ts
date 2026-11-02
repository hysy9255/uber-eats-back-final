import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/ui/guards/auth.guard';

@Controller('health')
export class HealthController {
  @Get()
  @Public()
  health() {
    console.log('health is checked');
    return { ok: true };
  }
}

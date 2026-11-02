import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/auth/ui/guards/auth.guard';

@Controller('restaurants/:restaurantId/menu')
export class PublicMenuController {
  constructor() {}

  @Get()
  @Public()
  getMenu() {}
}

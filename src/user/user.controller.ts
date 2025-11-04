import { Controller, Get, Req } from '@nestjs/common';
import type { RequestWithUser } from '../auth/types';

@Controller('users')
export class UserController {
  @Get('profile')
  getProfile(@Req() req: RequestWithUser) {
    const user = req.user
      ? {
          id: req.user.sub,
          email: req.user.email,
        }
      : undefined;

    return {
      message: 'Access granted to protected route!',
      user,
    };
  }
}

import { Body, Controller, Post, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDTO } from './dto/singupdto';
import { ConfirmEmailDTO } from './dto/singupdto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { confirmEmailSchema } from './dto/singupdto';   
import { loginSchema } from './dto/singupdto';
import { LoginDTO } from './dto/singupdto';
import { UsePipes } from '@nestjs/common/decorators/core/use-pipes.decorator';
import { Get } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { Req } from '@nestjs/common/decorators/http/route-params.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { AuthRequest } from './types/types';
import { LoggerInterceptor } from 'src/interceptors/logger.interceptor';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signup(
    @Body(new ValidationPipe()) body: SignUpDTO,
  ): Promise<{ message: string; user: any }> {
    return this.authService.signup(body);
  }

  @UsePipes(new ZodValidationPipe(confirmEmailSchema))
  @Post('/resend-otp')
  resendOtp(@Body() resendOtp: ConfirmEmailDTO) {
    return this.authService.resendOtp(resendOtp);
  }

  @UsePipes(new ZodValidationPipe(loginSchema))
@Post('/login')
login(@Body() loginDto: LoginDTO) {
  return this.authService.confirmEmail(loginDto);
}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req);
  }

  @Post('me')
@UseGuards(AuthGuard)
@UseInterceptors(LoggerInterceptor)
async test(@Req() req: AuthRequest) {
  return req.user;
}
}

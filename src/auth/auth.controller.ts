import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDTO } from './dto/singupdto';
import { ConfirmEmailDTO } from './dto/singupdto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { confirmEmailSchema } from './dto/singupdto';   
import { loginSchema } from './dto/singupdto';
import { LoginDTO } from './dto/singupdto';
import { UsePipes } from '@nestjs/common/decorators/core/use-pipes.decorator';
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
}

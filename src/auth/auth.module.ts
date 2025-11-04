import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModel } from './DB/models/user.model';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [
    UserModel,
    JwtModule.register({
      secret: 'superSecretKey',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtModule,GoogleStrategy],
})
export class AuthModule {}

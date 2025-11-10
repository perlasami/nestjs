import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { JwtService } from '@nestjs/jwt';
import { UserModel } from 'src/auth/DB/models/user.model';

@Module({
  imports: [BrandModule, UserModel],
  providers: [BrandService,JwtService],
  controllers: [BrandController],
})
export class BrandModule {}

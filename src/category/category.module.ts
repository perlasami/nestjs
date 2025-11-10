import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { Category } from 'src/auth/DB/models/category.model';
import { BrandModel } from 'src/auth/DB/models/brand.model';
import { UserModel } from 'src/auth/DB/models/user.model';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [Category,BrandModel,UserModel],
  controllers: [CategoryController,JwtService],
  providers: [CategoryService],
})
export class CategoryModule {}

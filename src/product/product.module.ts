import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { UserModel } from 'src/auth/DB/models/user.model';
import { BrandModel } from 'src/auth/DB/models/brand.model';
import { Category } from 'src/auth/DB/models/category.model';
import { JwtService } from '@nestjs/jwt';
import { ProductModel } from 'src/auth/DB/models/product.model';

@Module({
  imports: [UserModel,BrandModel,Category,ProductModel],
  controllers: [ProductController,JwtService],
  providers: [ProductService],
})
export class ProductModule {}

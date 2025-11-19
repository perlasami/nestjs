import { Module } from "@nestjs/common";
import { CartController } from "./cart.controller";
import { CartService } from "./cart.service";
import { Cart, CartModel } from "src/auth/DB/models/cart.model";
import { UserModel } from "src/auth/DB/models/user.model";
import { ProductModel } from "src/auth/DB/models/product.model";

@Module({
  imports: [CartModel, UserModel, ProductModel],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}

import { Module } from "@nestjs/common";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { OrderModel } from "src/auth/DB/models/order.model";
import { UserModel } from "src/auth/DB/models/user.model";
import { CartModel } from "src/auth/DB/models/cart.model";
import { JwtService } from "@nestjs/jwt";

@Module({
  imports: [CartModel, OrderModel, UserModel],
  controllers: [OrderController],
  providers: [OrderService, JwtService],
})
export class OrderModule {}

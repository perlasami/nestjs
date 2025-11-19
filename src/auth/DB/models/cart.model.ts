import { User } from "./user.model";
import { Product } from "./product.model";
import { required } from "zod/mini";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { ICart } from "src/types/cart.type";
import { MongooseModule } from "@nestjs/mongoose";

@Schema({
  timestamps: true,
})
export class Cart implements ICart {
  @Prop({
    type: Types.ObjectId,
    required: true,
    unique: true,
    ref: User.name,
  })
  user: Types.ObjectId;

  @Prop({
    type: [
      {
        product: {
          type: Types.ObjectId,
          ref: Product.name,
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    default: [],
  })
  items: { product: Types.ObjectId; quantity: number }[];
}

const cartSchema = SchemaFactory.createForClass(Cart);
export const CartModel = MongooseModule.forFeature([
  {
    name: Cart.name,
    schema: cartSchema,
  },
]);

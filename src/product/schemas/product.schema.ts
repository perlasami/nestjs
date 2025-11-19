import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type ProductDocument = Product & Document;

@Schema()
export class ProductVariant {
  @Prop({ required: true })
  color: string;

  @Prop({ required: true })
  size: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  stock: number;
}
export const ProductVariantSchema =
  SchemaFactory.createForClass(ProductVariant);

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: Types.ObjectId, ref: "Category" })
  category: string;

  @Prop({ type: Types.ObjectId, ref: "Brand" })
  brand: string;

  @Prop({ type: [ProductVariantSchema], default: [] })
  variants: ProductVariant[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);

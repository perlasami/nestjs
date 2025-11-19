import { Brand } from "../../brands/schemas/brand.schema";
import { Product } from "../../products/schemas/product.schema";
import mongoose from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true })
  name: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.virtual("brands", {
  ref: "Brand",
  localField: "_id",
  foreignField: "category",
});

CategorySchema.set("toObject", { virtuals: true });
CategorySchema.set("toJSON", { virtuals: true });



CategorySchema.pre("findOneAndDelete", async function (next) {
  const categoryId = this.getQuery()["_id"];

  await mongoose.model(Brand.name).deleteMany({ category: categoryId });

  await mongoose.model(Product.name).deleteMany({ category: categoryId });

  next();
});

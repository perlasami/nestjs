import mongoose from "mongoose";
import { Product } from "../../products/schemas/product.schema";

@Schema({ timestamps: true })
export class Brand {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: "Category" })
  category: string;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);

BrandSchema.virtual("products", {
  ref: "Product",
  localField: "_id",
  foreignField: "brand",
});

BrandSchema.pre("findOneAndDelete", async function (next) {
  const brandId = this.getQuery()["_id"];

  await mongoose.model(Product.name).deleteMany({ brand: brandId });

  next();
});

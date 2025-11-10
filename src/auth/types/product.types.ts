import { HydratedDocument, Types } from 'mongoose';

export interface IProduct {
  description: string;
  createdBy: Types.ObjectId;
  images: string[];
  originalPrice: number;
  discount: number;
  salePrice: number;
  stock: number;
  soldItems: number;
  category: Types.ObjectId;
  brands: Types.ObjectId;
}

export type HydratedProduct = HydratedDocument<IProduct>;

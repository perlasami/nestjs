import { HydratedDocument, Types } from 'mongoose';

export interface ICategory {
  name: string;
  slug: string;
  createdBy: Types.ObjectId;
  image: string;
  brands: Array<Types.ObjectId>;
}

export type HydratedBrand = HydratedDocument<ICategory>;

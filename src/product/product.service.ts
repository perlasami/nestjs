import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Brand } from 'src/models/brand.model';
import { Category } from 'src/models/category.model';
import { Product } from 'src/models/product.model';
import { type IProduct } from 'src/types/product.type';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(Brand.name) private brandModel: Model<Brand>,
  ) {}

  async create(data: IProduct) {
    const brand = await this.brandModel.findOne({ _id: data.brand });
    if (!brand) {
      throw new Error('brand not found');
    }
    const category = await this.categoryModel.findOne({ _id: data.category });
    if (!category) {
      throw new Error('category not found');
    }
    data.salePrice=data.price - (data.price * data.discount) / 100;
    const product = await this.productModel.create(data);
    return data:product;
  }
}

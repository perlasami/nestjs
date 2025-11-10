import { Prop, Schema } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { User } from './user.model';
import { SchemaFactory } from '@nestjs/mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import slugify from 'slugify';
import { Category } from './category.model';
import { Brand } from './brand.model';

@Schema({
  timestamps: true,
})
export class Product {
  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  description: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: User.name,
  })
  createdBy: Types.ObjectId;

  @Prop({
    type: [String],
    required: true,
  })
  image: string[];
  @Prop({
    type: Number,
    required: true,
    })

  originalPrice: number;
  @Prop({
    type: Number,
    required: true,
    default: 0,
    })
  discountedPrice: number;
    @Prop({
    type: Number,
    required: true,
    })
    saleprice: string;
      @Prop({
    type: Number,
    required: true,
    default: 0,
    })
    stock: number;
      @Prop({
    type: Number,
    required: true,
    default: 0,
    })
    @Prop({
    type: String,
    required: true,
    })
    soldItem: number;
       @Prop({
    type: Number,
    required: true,
    })
    category:Types.ObjectId;
      @Prop({
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: Category.name,
      })
    brand:Types.ObjectId;
     @Prop({
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: Brand.name,
      })
}

const productschema = SchemaFactory.createForClass(Product);

productschema.pre('save', function (next) {
  this.slug = slugify(this.name, {
    lower: true,
  });
  next();
});

export const ProductModel = MongooseModule.forFeature([
  {
    name: Product.name,
    schema: productschema,
  },
]);

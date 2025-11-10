import { Prop, Schema } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { User } from './user.model';
import { SchemaFactory } from '@nestjs/mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import slugify from 'slugify';

@Schema({
  timestamps: true,
})
export class Category {
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
  slug: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: User.name,
  })
  createdBy: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
  })
  image: string;
  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Brand',
  })
  brands: Array<Types.ObjectId>;
}

const categoryschema = SchemaFactory.createForClass(Category);

categoryschema.pre('save', function (next) {
  this.slug = slugify(this.name, {
    lower: true,
  });
  next();
});

export const BrandModel = MongooseModule.forFeature([
  {
    name: Category.name,
    schema: categoryschema,
  },
]);

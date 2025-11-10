import { Model } from 'mongoose';
import { Brand } from 'src/models/brand.model';
import { Category } from 'src/models/category.model';
import { ICategory } from 'src/types/category.type';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(Brand.name) private brandModel: Model<Brand>,
  ) {}

  async create(data: ICategory) {
    const isExist = await this.categoryModel.findOne({ name: data.name });
    if (isExist) {
      throw new ConflictException('category already exist');
    }
    if (data.brands && data.brands.length) {
      const foundBrands = await this.brandModel.find({
        _id: { $in: data.brands },
      });
      if (foundBrands.length !== data.brands.length) {
        throw new NotFoundException('some brand not found');
      }
    }
    const category = await this.categoryModel.create(data);
    return category;
  }

  async update(categoryId: Types.ObjectId, data: ICategory) {
    const category = await this.categoryModel.findOne({
      _id: categoryId,
      createdBy: data.createdBy,
    });
    if (!category) {
      throw new NotFoundException('category not found');
    }
    if (data.brands && data.brands.length) {
      const foundBrands = await this.brandModel.find({
        _id: { $in: data.brands },
      });
      if (foundBrands.length !== data.brands.length) {
        throw new NotFoundException('some brand not found');
      }
    }
    if (data.brands?.length) {
      category.brands = data.brands;
    }
    if (data.name) {
      category.name = data.name;
    }
    if (data.image) {
      category.image = data.image;
    }
    await category.save();
    return category;
  }

  async findAll() {
    return await this.categoryModel.find().populate([
      {
        path: 'brands',
        select: 'name',
      },
    ]);
  }
}

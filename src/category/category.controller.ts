import {
  Body,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { type ICategory } from 'src/types/category.type';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOption } from 'src/common/utils/multer';
import { AuthGuard, type AuthRequest } from 'src/common/guards/auth.guard';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('create')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: multerOption('./src/uploads/categories'),
    }),
  )
  async create(
    @Req() req: AuthRequest,
    @Body() data: ICategory,
    @UploadedFile() image: Express.Multer.File,
  ) {
    data.image = image.path;
    data.createdBy = req.user._id;
    return { data: await this.categoryService.create(data) };
  }

  @Patch('update/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: multerOption('./src/uploads/categories'),
    }),
  )
  async update(
    @Req() req: AuthRequest,
    @Body() data: ICategory,
    @UploadedFile() image: Express.Multer.File,
    @Param('id') id: Types.ObjectId,
  ) {
    if (image) {
      data.image = image.path;
    }
    data.createdBy = req.user._id;
    return { data: await this.categoryService.update(id, data) };
  }

  @Get('all')
  async findAll() {
    return { data: await this.categoryService.findAll() };
  }
}

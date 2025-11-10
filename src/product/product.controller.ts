import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Req,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { type IProduct } from 'src/types/product.type';
import { AuthGuard, type AuthRequest } from 'src/common/guards/auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerOption } from 'src/common/utils/multer';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: multerOption('./src/uploads/products'),
    }),
  )
  create(
    @Req() req: AuthRequest,
    @Body() data: IProduct,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    data.images = images.map((image) => image.path);
    data.createdBy = req.user._id;
    console.log(data);
    return this.productService.create(data);
  }
}

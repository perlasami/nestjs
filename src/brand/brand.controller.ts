import { Controller } from '@nestjs/common';
import { BrandService } from './brand.service';
import { Body, Post, UseGuards, UseInterceptors, UploadedFile, Patch, Param, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { IBrand } from './interface/brand.interface';
import { Types } from 'mongoose';
import { AuthRequest } from 'src/auth/types/types';
import { multerOption } from 'src/auth/utils/multer';
import { find } from 'rxjs';
import { id } from 'zod/v4/locales';

@Controller('brand')
export class BrandController {
    constructor() { private readonly brandService: BrandService; }

@Post('create')
@UseGuards(AuthGuard)
@UseInterceptors(FileInterceptor('image', {
  storage: diskStorage({
    destination: "./uploads",
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    }
  })
}))
async createBrand(@Body() data: IBrand, @UploadedFile() image: Express.Multer.File) {
  console.log(Image);
  data.image = image.path;
  return await this.brandService.create(data);
}

@Patch('update/:id')
@UseGuards(AuthGuard)
@UseInterceptors(FileInterceptor('image', {
  storage: multerOption('./uploads/brands'),
}))
async updateBrand(
  @Req() req: AuthRequest,
  @Body() data: IBrand,
  @Param('id') brandId: Types.ObjectId,
  @UploadedFile() image: Express.Multer.File
) {
  data.image = image.path
  data.createdBy = req.user._id
  return await this.brandService.updateBrand(brandId, data)
}

@Get('get/:id')
async find(@Param('id') id: Types.ObjectId) {
  if (id) {
    return await this.brandService.findOne(id)
  }
  return await this.brandService.findAll()
}
}



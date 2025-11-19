import { Module, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { JwtMiddleware } from './auth/jwt-middleware';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { BrandModule } from './brand/brand.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/nest-auth'),
    AuthModule,
    UserModule,
    JwtModule.register({
      secret: 'superSecretKey',
      signOptions: { expiresIn: '1h' },
    }),
    BrandModule,
    CategoryModule,
    ProductModule,
    CartModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .exclude({
        path: '/auth/login',
        method: RequestMethod.POST,
      })
      .forRoutes('*');
  }
}

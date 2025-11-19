import { ConflictException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Cart } from "src/models/cart.model";
import { Order } from "src/models/order.model";
import { PaymentMethodEnum, OrderStatusEnum } from "src/types/order.type";
import { IProduct } from "src/types/product.type";

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
  ) {}

  async createOrder({
    userId,
    discount = 0,
    instructions,
    address,
    phone,
    paymentMethod = PaymentMethodEnum.CASH,
  }: {
    userId: Types.ObjectId;
    discount?: number;
    instructions?: string[];
    address: string;
    phone: string;
    paymentMethod?: PaymentMethodEnum;
  }) {
    const cart = await this.cartModel
      .findOne({ user: userId })
      .populate("items.product");

    if (!cart || cart.items.length === 0) {
      throw new ConflictException("cart is empty");
    }

    const subtotal = cart.items.reduce((totalPrice, item) => {
      return (
        totalPrice +
        (item.product as unknown as IProduct).salePrice * item.quantity
      );
    }, 0);
    const total = subtotal - (discount == 0 ? 0 : discount / 100) * subtotal;

    for (const item of cart.items) {
      await this.productModel.updateOne(item.product, {
        stock: {
          $inc: -item.quantity,
        },
      });
    }

    const order = await this.orderModel.create({
      address,
      discount,
      instructions,
      items: cart.items,
      paymentMethod,
      phone,
      subtotal,
      total,
      user: userId,
    });

    return {
      data: {
        order,
      },
    };

    const newOrder = await this.orderModel.create({
      user: userId,
      items: cart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      })),
      subtotal,
      discount,
      total,
      address,
      instructions,
      phone,
      paymentMethod,
      orderStatus: OrderStatusEnum.PENDING,
    });

    await this.cartModel.deleteOne({ user: userId });

    return newOrder;
  }
}

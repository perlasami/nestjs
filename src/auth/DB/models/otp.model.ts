import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export enum OtpTypeEnum {
  CONFIRM_EMAIL = 'CONFIRM_EMAIL',
  RESET_PASSWORD = 'RESET_PASSWORD',
}

@Schema({
  timestamps: true,
})
export class Otp {
  @Prop({
    type: String,
    required: true,
  })
  code: string;

  @Prop({
    type: Date,
    required: true,
  })
  expiredAt: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  })
  createdBy: Types.ObjectId;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    enum: OtpTypeEnum,
  }),
}

export const otpSchema = SchemaFactory.createForClass(Otp);
export type OtpDocument = HydratedDocument<Otp>;
export const OtpModel = MongooseModule.forFeature([
  { name: Otp.name, schema: otpSchema },
]);

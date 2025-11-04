import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { hash } from 'bcrypt';
import { Document } from 'mongoose';
import { HydratedDocument } from 'mongoose';
export enum ProviderEnum {
  SYSTEM = 'SYSTEM',
  GOOGLE = 'GOOGLE',
}

export enum GenderEnum {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum RoleEnum {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class User extends Document {
  @Prop({
    type: String,
    required: true,
    minlength: 2,
    maxlength: 20,
    trim: true,
  })
  firstName: string;

  @Prop({
    type: String,
    required: true,
    minlength: 2,
    maxlength: 20,
    trim: true,
  })
  lastName: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
  })
  email: string;

  @Prop({ type: Date })
  confirmEmail: Date;

  @Prop({ type: String })
  confirmEmailOTP: string;

  @Prop({
    type: String,
    required: function (this: User) {
      return this.provider === ProviderEnum.GOOGLE ? false : true;
    },
  })
  password: string;

  @Prop({
    type: String,
    enum: {
      values: Object.values(GenderEnum),
      message: '{VALUE} is not supported',
    },
    default: GenderEnum.MALE,
  })
  provider: ProviderEnum;

  @Prop({
    type: String,
    enum: GenderEnum,
  })
  gender: GenderEnum;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('username')
  .get(function (this: User) {
    return `${this.firstName} ${this.lastName}`;
  })
  .set(function (this: User, value: string) {
    const [firstName, lastName] = (value && value.split(' ')) || [];
    this.firstName = firstName;
    this.lastName = lastName;
  });

export const userSchema = SchemaFactory.createForClass(User);
UserSchema.pre<User>('save', async function (next) {
  if (this.isModified('password')) {
    const saltRounds = 10;
    this.password = await hash(this.password, saltRounds);
  }
  next();
});
export type UserDocument = HydratedDocument<User>;
export const UserModel = MongooseModule.forFeature([
  { name: User.name, schema: userSchema },
]);
// Register this schema in a Nest module (e.g. AuthModule) using MongooseModule.forFeature:
// MongooseModule.forFeature([{ name: User.name, schema: userSchema }])
// The model should not be created here in the model file; remove the incorrect export.

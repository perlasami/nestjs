import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignUpDTO } from './dto/singupdto';
import { User, UserDocument } from './DB/models/user.model';
import { emailEvent } from './utils/Email/emailEvents';
import { error } from 'console';
import { compare } from 'bcrypt';
import { Otp, OtpDocument, OtpTypeEnum } from './DB/models/otp.model';
import { ProviderEnum } from './DB/models/user.model';
import { randomUUID } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO } from './dto/singupdto';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Otp.name) private readonly otpModel: Model<OtpDocument>,
  ) {}

  async signup(
    signUpDTO: SignUpDTO,
  ): Promise<{ message: string; user: UserDocument }> {
    const { email } = signUpDTO;

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('User Already Exists');
    }

    const newUser = new this.userModel({
      firstName: signUpDTO.firstName,
      lastName: signUpDTO.lastName,
      email: signUpDTO.email,
      password: signUpDTO.password,
      confirmPassword: signUpDTO.confirmPassword,
      role: signUpDTO.role,
      gender: signUpDTO.gender,
      phone: signUpDTO.phone,
      DOB: signUpDTO.DOB,
      age: signUpDTO.age,
    });

    emailEvent.emit('sendEmail', {
      to: newUser.email,
      subject: 'Welcome to Our Platform',
      template: 'welcome',
      context: {
        name: newUser.firstName,
      },
    });

    const savedUser = await newUser.save();

    return {
      message: 'User Registered Successfully',
      user: savedUser,
    };
  }
    async confirmEmail(
    email: string,
    otp: string,
  ): Promise<{ message: string }> {
    const user = await this.userModel
      .findOne({
        email,
        confirmEmail: { $exists: false },
      })
      .populate([
        {
          path: 'otp',
          match: { type: OtpTypeEnum.CONFIRM_EMAIL },
        },
      ]);

    if (!user) throw new error('User Not Found');

    if (!user.otp?.length) throw new ConflictException('Otp Not Found');

    const isMatch = await compare(otp, user.otp[0].code);
    if (!isMatch) throw new error('Invalid Otp');

    await this.userModel.updateOne(
      { _id: user._id },
      { $set: { confirmEmail: new Date() }, $inc: { __v: 1 } },
    );

    await this.otpModel.deleteOne({ _id: user.otp[0]._id });

    return { message: 'User Confirmed Successfully' };
  }

  async login(loginDto: LoginDTO) {
  const { email, password } = loginDto;

  const user = await this.userModel.findOne({
    email,
    confirmEmail: { $exists: true },
    provider: ProviderEnum.SYSTEM,
  });

  if (!user) throw new error('User Not Found');
  if (!(await compare({ plaintext: password, hash: user.password })))
  // create accessToken, refreshToken
  const jti = randomUUID();
  const accessToken = await this.jwtService.sign(
    {
      id: user._id,
      email: user.email,
    },
    {
      secret: process.env.ACCESS_SECRET_KEY,
      expiresIn: Number(process.env.ACCESS_EXPIRES_IN as string),
      jti,
    }
  );

  }

   async googleLogin(req: any) {
    if (!req.user) {
      return { message: 'No user from Google' };
    }

    const { email, firstName, lastName, picture } = req.user;

    // Check if user exists
    let user = await this.userModel.findOne({ email });

    // Signup via Google if user doesn’t exist
    if (!user) {
      user = await this.userModel.create({
        firstName,
        lastName,
        email,
        provider: ProviderEnum.GOOGLE,
        confirmEmail: new Date(),
      });
    }

    // Create JWT token
    const token = this.jwtService.sign({ id: user._id, email: user.email });

    return {
      message: 'User logged in successfully with Google',
      user,
      accessToken: token,
    };
  }
}
}

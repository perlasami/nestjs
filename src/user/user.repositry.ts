import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  // Create a new user with password hashing
  async create(userData: Partial<User>): Promise<User> {
    // Ensure password is provided
    if (!userData.password) {
      throw new Error('Password is required');
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create a new user document
    const user = new this.userModel({
      ...userData,
      password: hashedPassword, // store hashed password only
    });

    // Save user to the database
    return user.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email });
  }
}

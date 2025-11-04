/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { z } from 'zod';
import { IsString, IsNumber } from 'class-validator';

export class SignUpDTO {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  confirmPassword: string;

  @IsString()
  role: string;

  @IsString()
  gender: string;

  @IsString()
  phone: string;

  @IsString()
  DOB: string;

  @IsNumber()
  age: number;
}

export const resendOtpSchema = z.strictObject({
  email: z.email(),
});

export type ResendDTO = z.infer<typeof resendOtpSchema>;

export const confirmEmailSchema = z.strictObject({
  email: z.email(),
  otp: z.string().regex(/^\d{6}$/),
});
export const loginSchema = z.strictObject({
  email: z.email(),
  password: z.string(),
});

export type LoginDTO = z.infer<typeof loginSchema>;
export type ConfirmEmailDTO = z.infer<typeof confirmEmailSchema>;

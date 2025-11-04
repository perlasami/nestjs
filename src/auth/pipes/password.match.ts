import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
interface SignUpDTO {
  password?: string;
  confirmPassword?: string;
  [key: string]: any;
}

@Injectable()
export class PasswordMatchPipe implements PipeTransform<unknown, unknown> {
  transform(value: SignUpDTO, metadata: ArgumentMetadata): unknown {
    console.log({ value, metadata });
    if (metadata.type === 'body') {
      const { password, confirmPassword } = value;
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
    }
    return value;
  }
}

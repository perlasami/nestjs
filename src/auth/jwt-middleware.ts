import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

// 1️⃣ Define a type for your decoded JWT payload
interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

// 2️⃣ Extend Express.Request to include `user`
declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload;
  }
}

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid token');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = this.jwtService.verify<JwtPayload>(token, {
        secret: 'SECRET_KEY_CHANGE_THIS',
      });

      // 3️⃣ Explicitly assign typed payload to req.user
      req.user = decoded;
      next();
    } catch {
      // 4️⃣ Removed unused variable; use `_` if you want to keep it
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}

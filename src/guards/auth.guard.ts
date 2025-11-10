import { Model } from 'mongoose';
import { Observable } from 'rxjs';
import { User } from 'src/models/user.model';
import { HydratedUser } from 'src/types/user.type';

export interface AuthRequest extends Request {
  user: HydratedUser;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: AuthRequest = context.switchToHttp().getRequest();
    const { authorization } = req.headers;
    console.log({ authorization });

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new BadRequestException('Invalid token');
    }

    const token = authorization.split(' ')[1];
    if (!token) {
      throw new BadRequestException('Invalid token');
    }

    const payload = await this.jwtService.verify(token, {
      secret: process.env.TOKEN_SECRET as string,
    });
    const user = await this.userModel.findById(payload._id);
    if (!user) {
      throw new BadRequestException('Invalid token');
    }

    req.user = user;
    return true;
  }
}
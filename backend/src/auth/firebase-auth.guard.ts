import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { FirebaseAuthService } from './firebase-auth.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(private firebaseAuthService: FirebaseAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token não fornecido');
    }

    try {
      const decodedToken =
        await this.firebaseAuthService.verifyToken(token);
      request['user'] = decodedToken;
      request['firebaseUid'] = decodedToken.uid;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Falha na autenticação';
      throw new UnauthorizedException(errorMessage);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

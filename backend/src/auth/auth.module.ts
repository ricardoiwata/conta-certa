import { Module } from '@nestjs/common';
import { FirebaseAuthService } from './firebase-auth.service';
import { FirebaseAuthGuard } from './firebase-auth.guard';

@Module({
  providers: [FirebaseAuthService, FirebaseAuthGuard],
  exports: [FirebaseAuthService, FirebaseAuthGuard],
})
export class AuthModule {}

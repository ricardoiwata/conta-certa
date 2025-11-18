import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { getFirebaseAuth } from '../config/firebase.config';

@Injectable()
export class FirebaseAuthService {
  private auth: admin.auth.Auth | null;

  constructor() {
    this.auth = getFirebaseAuth();
    if (!this.auth) {
      console.warn('⚠️  FirebaseAuthService: Firebase não está configurado');
      console.warn('   Verifique se firebase-credentials.json existe no diretório raiz do backend');
    } else {
      console.log('✓ FirebaseAuthService: Firebase configurado com sucesso!');
    }
  }

  async verifyToken(token: string): Promise<admin.auth.DecodedIdToken> {
    if (!this.auth) {
      throw new UnauthorizedException(
        'Firebase não está configurado. Configure firebase-credentials.json',
      );
    }

    try {
      const decodedToken = await this.auth.verifyIdToken(token);
      return decodedToken;
    } catch (error) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }

  async getUserByUid(uid: string): Promise<admin.auth.UserRecord> {
    if (!this.auth) {
      throw new UnauthorizedException(
        'Firebase não está configurado. Configure firebase-credentials.json',
      );
    }

    try {
      return await this.auth.getUser(uid);
    } catch (error) {
      throw new UnauthorizedException(`Usuário com UID ${uid} não encontrado`);
    }
  }

  async createUser(
    email: string,
    password: string,
    displayName?: string,
  ): Promise<admin.auth.UserRecord> {
    if (!this.auth) {
      throw new Error(
        'Firebase não está configurado. Configure firebase-credentials.json',
      );
    }

    try {
      return await this.auth.createUser({
        email,
        password,
        displayName,
      });
    } catch (error) {
      throw new Error(`Erro ao criar usuário: ${error instanceof Error ? error.message : error}`);
    }
  }

  async updateUser(
    uid: string,
    updates: {
      email?: string;
      displayName?: string;
      photoURL?: string;
    },
  ): Promise<admin.auth.UserRecord> {
    if (!this.auth) {
      throw new Error(
        'Firebase não está configurado. Configure firebase-credentials.json',
      );
    }

    try {
      return await this.auth.updateUser(uid, updates);
    } catch (error) {
      throw new Error(`Erro ao atualizar usuário: ${error instanceof Error ? error.message : error}`);
    }
  }

  async deleteUser(uid: string): Promise<void> {
    if (!this.auth) {
      throw new Error(
        'Firebase não está configurado. Configure firebase-credentials.json',
      );
    }

    try {
      await this.auth.deleteUser(uid);
    } catch (error) {
      throw new Error(`Erro ao deletar usuário: ${error instanceof Error ? error.message : error}`);
    }
  }
}

import * as admin from 'firebase-admin';
import * as path from 'path';
import * as fs from 'fs';

let firebaseApp: admin.app.App | null = null;

export function initializeFirebase(): admin.app.App | null {
  if (firebaseApp) {
    return firebaseApp;
  }

  try {
    let credentialsPath = process.env.FIREBASE_CREDENTIALS_PATH;
    
    if (!credentialsPath) {
      // Try multiple possible paths for flexibility (dev and production)
      const possiblePaths = [
        path.resolve(process.cwd(), 'firebase-credentials.json'),
        path.resolve(__dirname, '../../firebase-credentials.json'),
        path.resolve(__dirname, '../../../firebase-credentials.json'),
      ];
      
      credentialsPath = possiblePaths.find(p => fs.existsSync(p)) || possiblePaths[0];
    }

    console.log(`[Firebase Config] Working directory: ${process.cwd()}`);
    console.log(`[Firebase Config] Looking for credentials at: ${credentialsPath}`);
    console.log(`[Firebase Config] File exists: ${fs.existsSync(credentialsPath)}`);

    if (!fs.existsSync(credentialsPath)) {
      console.warn('⚠️  firebase-credentials.json not found');
      console.warn(`Expected path: ${credentialsPath}`);
      console.warn('Make sure firebase-credentials.json is in the backend root directory.');
      console.warn('Firebase disabled. Token-based authentication will not work.');
      return null;
    }

    console.log('✓ firebase-credentials.json encontrado!');
    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf-8'));

    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(credentials),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });

    console.log('✓ Firebase inicializado com sucesso!');
    return firebaseApp;
  } catch (error) {
    console.error('❌ Erro ao inicializar Firebase:', error instanceof Error ? error.message : error);
    if (error instanceof Error) {
      console.error('Stack:', error.stack);
    }
    console.warn('Firebase desabilitado. A autenticação por token não funcionará.');
    return null;
  }
}

export function getFirebaseApp(): admin.app.App | null {
  // Se ainda não inicializou (null), inicializa agora
  if (!firebaseApp) {
    return initializeFirebase();
  }
  return firebaseApp;
}

export function getFirebaseAuth(): admin.auth.Auth | null {
  const app = getFirebaseApp();
  if (!app) {
    return null;
  }
  return app.auth();
}

import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApps, initializeApp } from "firebase/app";
import {
  //@ts-ignore
  getReactNativePersistence,
  initializeAuth,
  getAuth,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_MEASUREMENT_ID,
};

declare global {
  var firebaseApp: ReturnType<typeof initializeApp> | undefined;
  var firebaseAuth: ReturnType<typeof initializeAuth> | undefined;
}

const app = (() => {
  if (globalThis.firebaseApp) {
    return globalThis.firebaseApp;
  }

  const existingApps = getApps();
  const resolvedApp =
    existingApps.length > 0 ? existingApps[0] : initializeApp(firebaseConfig);
  globalThis.firebaseApp = resolvedApp;
  return resolvedApp;
})();

const auth = (() => {
  if (globalThis.firebaseAuth) {
    return globalThis.firebaseAuth;
  }

  try {
    const initializedAuth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
    globalThis.firebaseAuth = initializedAuth;
    return initializedAuth;
  } catch (error) {
    const existingAuth = getAuth(app);
    globalThis.firebaseAuth = existingAuth;
    return existingAuth;
  }
})();

export { app, auth };

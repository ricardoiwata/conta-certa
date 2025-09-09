import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import {
    //@ts-ignore
    getReactNativePersistence,
    initializeAuth
} from 'firebase/auth';

import {
    API_KEY,
    APP_ID,
    AUTH_DOMAIN,
    MEASUREMENT_ID,
    MESSAGING_SENDER_ID,
    PROJECT_ID,
    STORAGE_BUCKET,
} from 'react-native-dotenv';

const firebaseConfig = {
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: MESSAGING_SENDER_ID,
    appId: APP_ID,
    measurementId: MEASUREMENT_ID,
};


export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});



import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import {
    //@ts-ignore
    getReactNativePersistence,
    initializeAuth
} from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyC3XfuMuAJwfZkWvUurDNQ0hc2QC113p4E",
    authDomain: "conta-certa-fbc0d.firebaseapp.com",
    projectId: "conta-certa-fbc0d",
    storageBucket: "conta-certa-fbc0d.firebasestorage.app",
    messagingSenderId: "185577603360",
    appId: "1:185577603360:web:a9f8e6c5fd5cf2411fd745",
    measurementId: "G-H80E0TYJR4"
};

export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});



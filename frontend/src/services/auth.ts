import { auth } from '@/auth/firebase';
import {
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
} from 'firebase/auth';


export async function signUpEmail(email: string, password: string, displayName?: string) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
        await updateProfile(cred.user, { displayName });
    }
    return cred.user;
}


export async function signInEmail(email: string, password: string) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
}


export async function resetPassword(email: string) {
    await sendPasswordResetEmail(auth, email);
}


export async function signOutUser() {
    await signOut(auth);
}
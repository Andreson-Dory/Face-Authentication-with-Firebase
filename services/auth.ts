import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { auth } from "./firebase";

export function generatePassword(): string {
  return Math.random().toString(36).slice(-10) + "Aa1!";
}

export async function registerUser(
  email: string,
  password: string,
): Promise<User> {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  return cred.user; // has .uid
}

/**
 * Standard email/password sign-in.
 * Called internally after a successful face match (see authFlows.ts),
 * not directly from the Login screen.
 */
export async function loginUser(
  email: string,
  password: string,
): Promise<User> {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

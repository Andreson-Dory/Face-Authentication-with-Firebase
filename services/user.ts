import { SaveUserInput, UserDoc } from "@/constants/types";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Saves a user document to Firestore under users/{uid}.
 *
 * NOTE on `password`: Firebase Auth already owns the real credential.
 * We only store it here (optionally) so the face-login flow can
 * silently re-authenticate the user after a face match, without
 * asking them to type anything. This is a known MVP shortcut, not
 * production-grade security — fine for a class project demo.
 */
export async function saveUser(input: SaveUserInput): Promise<void> {
  const { uid, name, email, imageURL, password } = input;

  const data: UserDoc = {
    uid,
    name,
    email,
    imageURL,
    createdAt: new Date().toISOString(),
    ...(password ? { password } : {}),
  };

  await setDoc(doc(db, "users", uid), data);
}

export async function getUser(uid: string): Promise<UserDoc | null> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  return snap.data() as UserDoc;
}

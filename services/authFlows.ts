//
// These are the ONLY functions Person 1's screens should need to call.
// Everything else (Firebase Auth, Cloudinary upload, Firestore, Face API)
// is wired together in here, matching the plan's "frontend only calls
// helper functions" rule.

import { RegisterFlowInput, UserDoc } from "@/constants/types";
import { generatePassword, loginUser, logoutUser, registerUser } from "./auth";
import { loginFace, registerFace } from "./faceApi";
import { uploadImage } from "./storage";
import { getUser, saveUser } from "./user";

/**
 * Full registration flow:
 * name + email + selfie -> Firebase Auth + Cloudinary + Firestore + Face API
 */
export async function registerFlow(
  input: RegisterFlowInput,
): Promise<Omit<UserDoc, "createdAt" | "password">> {
  const { name, email, imageUri } = input;
  const password = generatePassword();

  const authUser = await registerUser(email, password);
  const imageURL = await uploadImage(imageUri, authUser.uid);

  await saveUser({
    uid: authUser.uid,
    name,
    email,
    imageURL,
    password, // stored so faceLoginFlow can silently sign back in
  });

  const faceResult = await registerFace(imageUri, authUser.uid);
  if (!faceResult.success) {
    throw new Error("Face registration failed. Please retake your selfie.");
  }

  return { uid: authUser.uid, name, email, imageURL };
}

/**
 * Full login flow:
 * selfie -> Face API match -> look up user -> re-authenticate with Firebase
 */
export async function faceLoginFlow(imageUri: string): Promise<UserDoc> {
  const faceResult = await loginFace(imageUri);
  if (!faceResult.success || !faceResult.userId) {
    throw new Error("Face not recognized. Try again or register first.");
  }

  const userDoc = await getUser(faceResult.userId);
  if (!userDoc) {
    throw new Error("User record not found.");
  }

  // Re-establish a real Firebase Auth session using the stored credential.
  if (!userDoc.password) {
    throw new Error("Stored credential missing for this user.");
  }
  await loginUser(userDoc.email, userDoc.password);

  return userDoc;
}

export async function logout(): Promise<void> {
  await logoutUser();
}

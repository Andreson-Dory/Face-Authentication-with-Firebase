import { FaceApiResult } from "@/constants/types";

const FACE_API_BASE_URL = process.env.EXPO_PUBLIC_FACE_API;
const MOCK_MODE = true;

export async function registerFace(
  imageUri: string,
  userId: string,
): Promise<FaceApiResult> {
  if (MOCK_MODE) {
    console.log("[MOCK] registerFace called for", userId);
    return { success: true };
  }

  const formData = new FormData();
  formData.append("image", {
    uri: imageUri,
    name: "selfie.jpg",
    type: "image/jpeg",
  } as unknown as Blob);
  formData.append("userId", userId);

  const res = await fetch(`${FACE_API_BASE_URL}/register-face`, {
    method: "POST",
    body: formData,
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.json() as Promise<FaceApiResult>;
}

export async function loginFace(imageUri: string): Promise<FaceApiResult> {
  if (MOCK_MODE) {
    console.log("[MOCK] loginFace called");
    // Pretend it matched a fixed test user during development
    return { success: true, userId: "TEST_UID_123" };
  }

  const formData = new FormData();
  formData.append("image", {
    uri: imageUri,
    name: "selfie.jpg",
    type: "image/jpeg",
  } as unknown as Blob);

  const res = await fetch(`${FACE_API_BASE_URL}/login-face`, {
    method: "POST",
    body: formData,
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.json() as Promise<FaceApiResult>;
}

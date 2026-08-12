const CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUD_NAME;
const UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUD_UPLOAD_PRESET_NAME;
const CLOUD_API = process.env.EXPO_PUBLIC_APP_CLOUDINARY;

interface CloudinaryResponse {
  secure_url: string;
  error?: { message: string };
}

/**
 * Uploads a local image (from expo-camera / expo-image-picker) to
 * Cloudinary and returns its public URL.
 *
 * @param uri - local file uri, e.g. from ImagePicker result.assets[0].uri
 * @param uid - the user's uid, just used to name the file for readability
 * @returns public image URL
 */

export async function uploadImage(uri: string, uid: string): Promise<string> {
  const formData = new FormData();
  // React Native's FormData accepts this file-object shape at runtime,
  // even though the DOM lib types don't officially describe it.
  formData.append("file", {
    uri,
    type: "image/jpeg",
    name: `${uid}.jpg`,
  } as unknown as Blob);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("public_id", `profileImages/${uid}`);

  const res = await fetch(`${CLOUD_API}${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData,
    headers: { "Content-Type": "multipart/form-data" },
  });

  const data: CloudinaryResponse = await res.json();

  if (!res.ok) {
    throw new Error(data.error?.message || "Image upload failed");
  }

  return data.secure_url; // this is what you save in Firestore as imageURL
}

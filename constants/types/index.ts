export interface UserDoc {
  uid: string;
  name: string;
  email: string;
  imageURL: string;
  password?: string; // see note in user.ts about why this exists
  createdAt: string;
}

export interface SaveUserInput {
  uid: string;
  name: string;
  email: string;
  imageURL: string;
  password?: string;
}

export interface RegisterFlowInput {
  name: string;
  email: string;
  imageUri: string;
}

export interface FaceApiResult {
  success: boolean;
  userId?: string;
}

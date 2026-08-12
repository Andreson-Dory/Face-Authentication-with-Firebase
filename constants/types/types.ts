// Types partagés entre les écrans (Personne 1) et les services
// Firebase / API de reconnaissance faciale (Personne 2 / Personne 3).

export interface UserDoc {
  uid: string;
  name: string;
  email: string;
  imageURL: string;
  createdAt: string;
  password?: string; // stocké côté Firestore pour le re-login silencieux après match facial (voir user.ts)
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

// Pile de navigation : les 3 écrans de Personne 1.
export type RootStackParamList = {
  Register: undefined;
  Login: undefined;
  Profile: undefined;
};

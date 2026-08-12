import React, { createContext, useContext, useState, ReactNode } from "react";
import { UserDoc } from "@/constants/types";

// Simple contexte en mémoire (pas de persistance disque) pour partager
// l'utilisateur courant entre RegisterScreen -> ProfileScreen -> LoginScreen.
// C'est volontairement minimal : pas besoin de Redux/Zustand pour ce projet.

interface AuthContextValue {
  user: UserDoc | null;
  setUser: (user: UserDoc | null) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserDoc | null>(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return ctx;
}

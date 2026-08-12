import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/constants/types";
import { registerFlow } from "@/services/authFlows";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/Button";
import Input from "@/components/Input";
import CameraPreview from "@/components/CameraPreview";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

// Regex simple, suffisante pour une validation côté client dans ce projet.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterScreen({ navigation }: Props) {
  const { setUser } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; image?: string }>({});

  const validate = (): boolean => {
    const nextErrors: typeof errors = {};
    if (!name.trim()) nextErrors.name = "Le nom est requis.";
    if (!email.trim()) nextErrors.email = "L'e-mail est requis.";
    else if (!EMAIL_REGEX.test(email.trim())) nextErrors.email = "E-mail invalide.";
    if (!imageUri) nextErrors.image = "Un selfie est requis.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate() || !imageUri) return;

    setLoading(true);
    try {
      const user = await registerFlow({ name: name.trim(), email: email.trim(), imageUri });
      setUser({ ...user, createdAt: new Date().toISOString() });
      navigation.reset({ index: 0, routes: [{ name: "Profile" }] });
    } catch (err) {
      Alert.alert(
        "Échec de l'inscription",
        err instanceof Error ? err.message : "Une erreur est survenue.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.flex}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Créer un compte</Text>
        <Text style={styles.subtitle}>
          Ton visage servira à te reconnecter, pas besoin de mot de passe.
        </Text>

        <CameraPreview imageUri={imageUri} onCapture={setImageUri} />
        {errors.image ? <Text style={styles.imageError}>{errors.image}</Text> : null}

        <Input
          label="Nom complet"
          placeholder="Jean Dupont"
          value={name}
          onChangeText={setName}
          error={errors.name}
        />
        <Input
          label="E-mail"
          placeholder="jean.dupont@email.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          error={errors.email}
        />

        <Button title="S'inscrire" onPress={handleRegister} loading={loading} />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Déjà un compte ?</Text>
          <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
            {" "}Se connecter
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#fff" },
  container: { padding: 24, flexGrow: 1, justifyContent: "center" },
  title: { fontSize: 26, fontWeight: "700", color: "#111827", marginBottom: 6 },
  subtitle: { fontSize: 14, color: "#6B7280", marginBottom: 24 },
  imageError: { color: "#DC2626", fontSize: 12, textAlign: "center", marginTop: -12, marginBottom: 12 },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 20 },
  footerText: { color: "#6B7280" },
  link: { color: "#4F46E5", fontWeight: "600" },
});

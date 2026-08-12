import React, { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/constants/types";
import { faceLoginFlow } from "@/services/authFlows";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/Button";
import CameraPreview from "@/components/CameraPreview";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

// Flux : Prendre un selfie -> Frontend -> API de reconnaissance faciale
// -> Correspondance ? (OUI) -> Connexion Firebase -> Profil
export default function LoginScreen({ navigation }: Props) {
  const { setUser } = useAuth();

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!imageUri) {
      Alert.alert("Selfie requis", "Prends un selfie pour te connecter.");
      return;
    }

    setLoading(true);
    try {
      const user = await faceLoginFlow(imageUri);
      setUser(user);
      navigation.reset({ index: 0, routes: [{ name: "Profile" }] });
    } catch (err) {
      Alert.alert(
        "Connexion impossible",
        err instanceof Error ? err.message : "Visage non reconnu.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Se connecter</Text>
      <Text style={styles.subtitle}>Prends un selfie pour t'identifier.</Text>

      <CameraPreview
        imageUri={imageUri}
        onCapture={setImageUri}
        label="Prendre un selfie pour se connecter"
      />

      <Button title="Connexion" onPress={handleLogin} loading={loading} />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Pas encore de compte ?</Text>
        <Text style={styles.link} onPress={() => navigation.navigate("Register")}>
          {" "}S'inscrire
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 24, justifyContent: "center" },
  title: { fontSize: 26, fontWeight: "700", color: "#111827", marginBottom: 6, textAlign: "center" },
  subtitle: { fontSize: 14, color: "#6B7280", marginBottom: 24, textAlign: "center" },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 20 },
  footerText: { color: "#6B7280" },
  link: { color: "#4F46E5", fontWeight: "600" },
});

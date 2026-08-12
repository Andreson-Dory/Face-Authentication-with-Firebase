import React, { useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/constants/types";
import { logout } from "@/services/authFlows";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/Button";

type Props = NativeStackScreenProps<RootStackParamList, "Profile">;

export default function ProfileScreen({ navigation }: Props) {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      setUser(null);
      navigation.reset({ index: 0, routes: [{ name: "Login" }] });
    } catch (err) {
      Alert.alert(
        "Erreur",
        err instanceof Error ? err.message : "Impossible de se déconnecter.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    // Cas limite : écran atteint sans utilisateur en mémoire (ex: app relancée).
    return (
      <View style={styles.container}>
        <Text style={styles.subtitle}>Aucun utilisateur connecté.</Text>
        <Button title="Aller à la connexion" onPress={() => navigation.reset({ index: 0, routes: [{ name: "Login" }] })} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: user.imageURL }} style={styles.avatar} />
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>

      <Button
        title="Se déconnecter"
        onPress={handleLogout}
        loading={loading}
        variant="secondary"
        style={styles.logoutButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 24, alignItems: "center", justifyContent: "center" },
  avatar: { width: 140, height: 140, borderRadius: 70, marginBottom: 20, backgroundColor: "#F1F1F6" },
  name: { fontSize: 22, fontWeight: "700", color: "#111827" },
  email: { fontSize: 15, color: "#6B7280", marginBottom: 32 },
  subtitle: { fontSize: 14, color: "#6B7280", marginBottom: 20 },
  logoutButton: { marginTop: 12, width: "100%" },
});

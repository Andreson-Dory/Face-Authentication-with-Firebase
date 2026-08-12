import React from "react";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as ImagePicker from "expo-image-picker";

interface CameraPreviewProps {
  imageUri: string | null;
  onCapture: (uri: string) => void;
  label?: string;
}

/**
 * Ouvre la caméra frontale, laisse l'utilisateur prendre un selfie,
 * et affiche un aperçu circulaire de la photo prise.
 * Utilisé sur RegisterScreen (inscription) et LoginScreen (connexion faciale).
 */
export default function CameraPreview({
  imageUri,
  onCapture,
  label = "Prendre un selfie",
}: CameraPreviewProps) {
  const takeSelfie = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Autorisation requise",
        "L'accès à la caméra est nécessaire pour prendre un selfie.",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      cameraType: ImagePicker.CameraType.front,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      onCapture(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity onPress={takeSelfie} style={styles.circle} activeOpacity={0.8}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <Text style={styles.placeholder}>📷</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={takeSelfie}>
        <Text style={styles.label}>
          {imageUri ? "Reprendre le selfie" : label}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    marginBottom: 20,
  },
  circle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#F1F1F6",
    borderWidth: 1,
    borderColor: "#E0E0EA",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    fontSize: 36,
  },
  label: {
    color: "#4F46E5",
    fontSize: 14,
    fontWeight: "600",
  },
});

// frontend/app/(tabs)/features/group-purchasing/installer/PostDeal.jsx

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  ActivityIndicator,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useAppContext } from "../../../../../context/AppContext";
import { installerService } from "../../../../../services/group-purchasing/installerService";
import { cloudinaryService } from "../../../../../services/group-purchasing/cloudinaryService";
import { SHADOWS } from "../../../../utils/group-purchasing/shadows";

// Icons
import { ArrowLeft, Upload, Check, X } from "lucide-react-native";

// Categories
const CATEGORIES = [
  { id: "panels", label: "Solar Panels", emoji: "☀️" },
  { id: "batteries", label: "Batteries", emoji: "🔋" },
  { id: "inverters", label: "Inverters", emoji: "⚡" },
  { id: "installation", label: "Installation", emoji: "🔧" },
];

export default function PostDealScreen() {
  const router = useRouter();
  const { currentUser } = useAppContext();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("panels");
  const [regularPrice, setRegularPrice] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [neededNeighbors, setNeededNeighbors] = useState("5");
  const [deadlineDays, setDeadlineDays] = useState("14");

  // ✅ Image upload state
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const [loading, setLoading] = useState(false);

  // ============================================================
  // Helper: Alert for web + mobile
  // ============================================================
  const showAlert = (title, message) => {
    if (Platform.OS === "web") {
      alert(`${title}\n\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  // ============================================================
  // ✅ PICK IMAGE AND UPLOAD TO CLOUDINARY
  // ============================================================
  const pickImage = async () => {
    try {
      // Request permission on mobile
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          showAlert("Permission Denied", "Please allow access to your photos.");
          return;
        }
      }

      // Launch picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (result.canceled) return;

      const asset = result.assets[0];
      console.log("📸 Image picked:", asset.uri);

      // Upload to Cloudinary
      setUploading(true);
      const uploadResult = await cloudinaryService.uploadImage(asset);

      setImageUrl(uploadResult.url);
      console.log("✅ Image uploaded:", uploadResult.url);

      showAlert("✅ Uploaded", "Image uploaded successfully!");
    } catch (error) {
      console.error("❌ Image pick/upload error:", error);
      showAlert("Error", "Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // ============================================================
  // ✅ REMOVE IMAGE
  // ============================================================
  const removeImage = () => {
    setImageUrl("");
  };

  // ============================================================
  // VALIDATION
  // ============================================================
  const validate = () => {
    if (!title.trim()) return "Please enter a deal title";
    if (!description.trim()) return "Please enter a description";
    if (!regularPrice || isNaN(regularPrice))
      return "Please enter a valid regular price";
    if (!discountedPrice || isNaN(discountedPrice))
      return "Please enter a valid discounted price";
    if (Number(discountedPrice) >= Number(regularPrice))
      return "Discounted price must be less than regular price";
    if (!neededNeighbors || Number(neededNeighbors) < 2)
      return "Minimum neighbors must be at least 2";
    if (!deadlineDays || Number(deadlineDays) < 1)
      return "Deadline must be at least 1 day";
    if (!imageUrl.trim()) return "Please upload a deal image";
    return null;
  };

  // ============================================================
  // POST DEAL
  // ============================================================
  const handlePostDeal = async () => {
    const error = validate();
    if (error) {
      showAlert("Validation Error", error);
      return;
    }

    try {
      setLoading(true);

      await installerService.createDeal({
        installerId: currentUser.id,
        title: title.trim(),
        description: description.trim(),
        imageUrl: imageUrl.trim(),
        regularPrice: Number(regularPrice),
        discountedPrice: Number(discountedPrice),
        neededNeighbors: Number(neededNeighbors),
        deadlineDays: Number(deadlineDays),
        category,
      });

      showAlert("✅ Success", "Your deal has been posted successfully!");
      router.replace("/(tabs)/features/group-purchasing/installer/MyDeals");
    } catch (error) {
      console.error("❌ Error posting deal:", error);
      showAlert("Error", error.message || "Failed to post deal.");
    } finally {
      setLoading(false);
    }
  };

  const savings =
    regularPrice && discountedPrice
      ? Math.round(
          ((Number(regularPrice) - Number(discountedPrice)) /
            Number(regularPrice)) *
            100,
        )
      : 0;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={22} color="#1E293B" strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post New Deal</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <View style={styles.field}>
          <Text style={styles.label}>Deal Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 5kW Solar System + Installation"
            value={title}
            onChangeText={setTitle}
            editable={!loading}
          />
        </View>

        {/* Description */}
        <View style={styles.field}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe what's included in this deal..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            editable={!loading}
          />
        </View>

        {/* Category */}
        <View style={styles.field}>
          <Text style={styles.label}>Category *</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryOption,
                  category === cat.id && styles.categoryOptionActive,
                ]}
                onPress={() => setCategory(cat.id)}
                activeOpacity={0.7}
                disabled={loading}
              >
                <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                <Text
                  style={[
                    styles.categoryLabel,
                    category === cat.id && styles.categoryLabelActive,
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Prices */}
        <View style={styles.row}>
          <View style={[styles.field, styles.halfField]}>
            <Text style={styles.label}>Regular Price (LKR) *</Text>
            <TextInput
              style={styles.input}
              placeholder="7000"
              value={regularPrice}
              onChangeText={setRegularPrice}
              keyboardType="numeric"
              editable={!loading}
            />
          </View>
          <View style={[styles.field, styles.halfField]}>
            <Text style={styles.label}>Group Price (LKR) *</Text>
            <TextInput
              style={styles.input}
              placeholder="5000"
              value={discountedPrice}
              onChangeText={setDiscountedPrice}
              keyboardType="numeric"
              editable={!loading}
            />
          </View>
        </View>

        {/* Savings Display */}
        {savings > 0 && (
          <View style={styles.savingsBanner}>
            <Text style={styles.savingsText}>
              🎉 Neighbors save {savings}% (
              {Number(regularPrice) - Number(discountedPrice)} LKR)
            </Text>
          </View>
        )}

        {/* Neighbors & Deadline */}
        <View style={styles.row}>
          <View style={[styles.field, styles.halfField]}>
            <Text style={styles.label}>Min Neighbors *</Text>
            <TextInput
              style={styles.input}
              placeholder="5"
              value={neededNeighbors}
              onChangeText={setNeededNeighbors}
              keyboardType="numeric"
              editable={!loading}
            />
          </View>
          <View style={[styles.field, styles.halfField]}>
            <Text style={styles.label}>Deadline (days) *</Text>
            <TextInput
              style={styles.input}
              placeholder="14"
              value={deadlineDays}
              onChangeText={setDeadlineDays}
              keyboardType="numeric"
              editable={!loading}
            />
          </View>
        </View>

        {/* ✅ IMAGE UPLOAD SECTION */}
        <View style={styles.field}>
          <Text style={styles.label}>Deal Image *</Text>

          {imageUrl ? (
            // Image uploaded - show preview with remove button
            <View style={styles.imagePreviewContainer}>
              <Image
                source={{ uri: imageUrl }}
                style={styles.imagePreview}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={removeImage}
                disabled={loading || uploading}
              >
                <X size={18} color="#FFFFFF" strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
          ) : (
            // No image - show upload button
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={pickImage}
              disabled={uploading || loading}
              activeOpacity={0.7}
            >
              {uploading ? (
                <>
                  <ActivityIndicator color="#1A5C4A" size="small" />
                  <Text style={styles.uploadButtonText}>Uploading...</Text>
                </>
              ) : (
                <>
                  <Upload size={32} color="#1A5C4A" strokeWidth={2} />
                  <Text style={styles.uploadButtonText}>Upload Deal Image</Text>
                  <Text style={styles.uploadButtonHint}>
                    JPG, PNG • Max 5MB
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            (loading || uploading) && styles.submitButtonDisabled,
          ]}
          onPress={handlePostDeal}
          disabled={loading || uploading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <>
              <Check size={20} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={styles.submitButtonText}>Publish Deal</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Nunito_700Bold",
    color: "#1E293B",
  },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40, gap: 18 },
  field: { gap: 8 },
  halfField: { flex: 1 },
  row: { flexDirection: "row", gap: 12 },
  label: {
    fontSize: 13,
    fontFamily: "Nunito_600SemiBold",
    color: "#1E293B",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    fontFamily: "Nunito_400Regular",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  textArea: {
    minHeight: 100,
    paddingTop: 14,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  categoryOption: {
    flexBasis: "48%",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#F1F5F9",
  },
  categoryOptionActive: {
    borderColor: "#1A5C4A",
    backgroundColor: "#F0FDF4",
  },
  categoryEmoji: { fontSize: 18 },
  categoryLabel: {
    fontSize: 13,
    fontFamily: "Nunito_600SemiBold",
    color: "#64748B",
  },
  categoryLabelActive: { color: "#1A5C4A" },
  savingsBanner: {
    backgroundColor: "#F0FDF4",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#10B981",
  },
  savingsText: {
    fontSize: 13,
    fontFamily: "Nunito_700Bold",
    color: "#10B981",
    textAlign: "center",
  },

  // ✅ Upload button styles
  uploadButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0FDF4",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#1A5C4A",
    borderRadius: 12,
    paddingVertical: 32,
    paddingHorizontal: 20,
    gap: 8,
  },
  uploadButtonText: {
    fontSize: 14,
    fontFamily: "Nunito_700Bold",
    color: "#1A5C4A",
    marginTop: 4,
  },
  uploadButtonHint: {
    fontSize: 11,
    fontFamily: "Nunito_400Regular",
    color: "#94A3B8",
  },

  // ✅ Image preview styles
  imagePreviewContainer: {
    position: "relative",
    width: "100%",
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#F1F5F9",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
  },
  removeImageButton: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(239, 68, 68, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    ...SHADOWS.light,
  },

  // Submit button
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1A5C4A",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 8,
    ...SHADOWS.button,
  },
  submitButtonDisabled: { backgroundColor: "#94A3B8" },
  submitButtonText: {
    fontSize: 16,
    fontFamily: "Nunito_700Bold",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
});

// frontend/app/auth/signup.js

import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const handleSignup = async () => {
    // Validate required fields
    if (!email || !password || !name) {
      if (Platform.OS === "web") {
        alert("Please fill in all required fields");
      } else {
        Alert.alert("Error", "Please fill in all required fields");
      }
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      if (Platform.OS === "web") {
        alert("Please enter a valid email address");
      } else {
        Alert.alert("Error", "Please enter a valid email address");
      }
      return;
    }

    // Validate password length
    if (password.length < 6) {
      if (Platform.OS === "web") {
        alert("Password must be at least 6 characters");
      } else {
        Alert.alert("Error", "Password must be at least 6 characters");
      }
      return;
    }

    setLoading(true);
    try {
      // ✅ Pass phone number in userData
      await signUp(email, password, {
        name,
        phone,
        email,
      });

      // ✅ Navigate to login after successful signup
      if (Platform.OS === "web") {
        alert("✅ Account created! Please Login with your email address.");
        // ✅ Navigate to login page
        router.push("/auth/login");
      } else {
        Alert.alert(
          "Success!",
          "Account created! Please Login with your email address.",
          [
            {
              text: "OK",
              onPress: () => router.push("/auth/login"),
            },
          ],
        );
      }
    } catch (error) {
      console.error("Signup error:", error);
      if (Platform.OS === "web") {
        alert(error.message || "Signup failed. Please try again.");
      } else {
        Alert.alert("Signup Failed", error.message || "Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>☀️ SunCoop</Text>
        <Text style={styles.subtitle}>Join the Community!</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Full Name *"
          value={name}
          onChangeText={setName}
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Email *"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Password (min 6 characters) *"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSignup}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Creating account..." : "Sign Up"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/auth/login")}
          style={styles.linkButton}
          disabled={loading}
        >
          <Text style={styles.linkText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  contentContainer: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 40,
    justifyContent: "center",
    flexGrow: 1,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: "700",
    color: "#1A5C4A",
    fontFamily: "Nunito_700Bold",
  },
  subtitle: {
    fontSize: 18,
    color: "#64748B",
    marginTop: 8,
    fontFamily: "Nunito_400Regular",
  },
  form: {
    gap: 14,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    fontFamily: "Nunito_400Regular",
  },
  button: {
    backgroundColor: "#1A5C4A",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: "#94A3B8",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Nunito_600SemiBold",
  },
  linkButton: {
    alignItems: "center",
    marginTop: 12,
  },
  linkText: {
    color: "#1A5C4A",
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
  },
});

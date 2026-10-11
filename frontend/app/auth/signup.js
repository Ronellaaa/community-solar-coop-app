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

  // ✅ NEW: Account type toggle
  const [accountType, setAccountType] = useState("community");

  // ✅ NEW: Installer-specific fields
  const [companyName, setCompanyName] = useState("");
  const [yearsInBusiness, setYearsInBusiness] = useState("0-5");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const { signUp } = useAuth();
  const router = useRouter();

  const isInstaller = accountType === "installer";

  const handleSignup = async () => {
    // ✅ Validate based on account type
    if (isInstaller) {
      if (!email || !password || !companyName) {
        if (Platform.OS === "web") {
          alert("Please fill in all required fields");
        } else {
          Alert.alert("Error", "Please fill in all required fields");
        }
        return;
      }
      if (!agreedToTerms) {
        if (Platform.OS === "web") {
          alert("Please agree to the Terms & Conditions");
        } else {
          Alert.alert("Error", "Please agree to the Terms & Conditions");
        }
        return;
      }
    } else {
      if (!email || !password || !name) {
        if (Platform.OS === "web") {
          alert("Please fill in all required fields");
        } else {
          Alert.alert("Error", "Please fill in all required fields");
        }
        return;
      }
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
      // ✅ Build userData based on account type
      const userData = isInstaller
        ? {
            name: companyName,
            email,
            phone,
            userType: "installer",
            companyName,
            yearsInBusiness,
          }
        : {
            name,
            email,
            phone,
            userType: "community",
          };

      await signUp(email, password, userData);

      // ✅ Success message
      const successMessage = isInstaller
        ? "✅ Installer account created! Please check your email to confirm. Your account will be reviewed for approval."
        : "✅ Account created! Please Login with your email address.";

      if (Platform.OS === "web") {
        alert(successMessage);
        router.push("/auth/login");
      } else {
        Alert.alert("Success!", successMessage, [
          {
            text: "OK",
            onPress: () => router.push("/auth/login"),
          },
        ]);
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

      {/* ✅ Account Type Radio Toggle */}
      <View style={styles.accountTypeContainer}>
        <Text style={styles.accountTypeLabel}>I am a:</Text>
        <View style={styles.radioGroup}>
          {/* Community Member */}
          <TouchableOpacity
            style={[
              styles.radioOption,
              accountType === "community" && styles.radioOptionActive,
            ]}
            onPress={() => setAccountType("community")}
            activeOpacity={0.7}
            disabled={loading}
          >
            <View
              style={[
                styles.radioCircle,
                accountType === "community" && styles.radioCircleActive,
              ]}
            >
              {accountType === "community" && <View style={styles.radioDot} />}
            </View>
            <Text
              style={[
                styles.radioText,
                accountType === "community" && styles.radioTextActive,
              ]}
            >
              👥 Community
            </Text>
          </TouchableOpacity>

          {/* Installer */}
          <TouchableOpacity
            style={[
              styles.radioOption,
              accountType === "installer" && styles.radioOptionActive,
            ]}
            onPress={() => setAccountType("installer")}
            activeOpacity={0.7}
            disabled={loading}
          >
            <View
              style={[
                styles.radioCircle,
                accountType === "installer" && styles.radioCircleActive,
              ]}
            >
              {accountType === "installer" && <View style={styles.radioDot} />}
            </View>
            <Text
              style={[
                styles.radioText,
                accountType === "installer" && styles.radioTextActive,
              ]}
            >
              🔧 Installer
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.form}>
        {isInstaller ? (
          <>
            {/* ✅ Installer Fields */}
            <TextInput
              style={styles.input}
              placeholder="Company Name *"
              value={companyName}
              onChangeText={setCompanyName}
              editable={!loading}
            />

            <TextInput
              style={styles.input}
              placeholder="Business Email *"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
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

            <TextInput
              style={styles.input}
              placeholder="Company Phone Number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              editable={!loading}
            />

            {/* Years in Business */}
            <View style={styles.dropdownContainer}>
              <Text style={styles.dropdownLabel}>Years in Business</Text>
              <View style={styles.dropdownOptions}>
                {["0-5", "5-10", "10-20", "20+"].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.dropdownOption,
                      yearsInBusiness === option && styles.dropdownOptionActive,
                    ]}
                    onPress={() => setYearsInBusiness(option)}
                    disabled={loading}
                  >
                    <Text
                      style={[
                        styles.dropdownOptionText,
                        yearsInBusiness === option &&
                          styles.dropdownOptionTextActive,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Terms & Conditions Checkbox */}
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setAgreedToTerms(!agreedToTerms)}
              activeOpacity={0.7}
              disabled={loading}
            >
              <View
                style={[
                  styles.checkbox,
                  agreedToTerms && styles.checkboxActive,
                ]}
              >
                {agreedToTerms && <Text style={styles.checkboxTick}>✓</Text>}
              </View>
              <Text style={styles.checkboxText}>
                I agree to the{" "}
                <Text style={styles.checkboxLink}>Terms & Conditions</Text>
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* ✅ Community Member Fields */}
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
          </>
        )}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSignup}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading
              ? "Creating account..."
              : isInstaller
                ? "Sign Up as Installer"
                : "Sign Up"}
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
    marginBottom: 24,
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

  // ✅ Account Type Selector
  accountTypeContainer: {
    marginBottom: 20,
  },
  accountTypeLabel: {
    fontSize: 14,
    fontFamily: "Nunito_600SemiBold",
    color: "#1E293B",
    marginBottom: 10,
  },
  radioGroup: {
    flexDirection: "row",
    gap: 12,
  },
  radioOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 8,
  },
  radioOptionActive: {
    borderColor: "#1A5C4A",
    backgroundColor: "#F0FDF4",
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#94A3B8",
    justifyContent: "center",
    alignItems: "center",
  },
  radioCircleActive: {
    borderColor: "#1A5C4A",
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#1A5C4A",
  },
  radioText: {
    fontSize: 13,
    fontFamily: "Nunito_600SemiBold",
    color: "#64748B",
    flex: 1,
  },
  radioTextActive: {
    color: "#1A5C4A",
  },

  // Form
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

  // Years in Business Dropdown
  dropdownContainer: {
    gap: 8,
  },
  dropdownLabel: {
    fontSize: 13,
    fontFamily: "Nunito_600SemiBold",
    color: "#64748B",
  },
  dropdownOptions: {
    flexDirection: "row",
    gap: 8,
  },
  dropdownOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  dropdownOptionActive: {
    borderColor: "#1A5C4A",
    backgroundColor: "#F0FDF4",
  },
  dropdownOptionText: {
    fontSize: 12,
    fontFamily: "Nunito_600SemiBold",
    color: "#64748B",
  },
  dropdownOptionTextActive: {
    color: "#1A5C4A",
  },

  // Terms Checkbox
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 4,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxActive: {
    backgroundColor: "#1A5C4A",
    borderColor: "#1A5C4A",
  },
  checkboxTick: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  checkboxText: {
    fontSize: 13,
    fontFamily: "Nunito_400Regular",
    color: "#64748B",
    flex: 1,
  },
  checkboxLink: {
    color: "#1A5C4A",
    fontFamily: "Nunito_600SemiBold",
  },

  // Button
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

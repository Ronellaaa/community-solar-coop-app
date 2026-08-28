import { router } from "expo-router";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.energyButton}
        onPress={() => router.push("/energy-monitoring")}
      >
        <Text style={styles.energyButtonText}>Energy Monitoring</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },

  energyButton: {
    backgroundColor: "#173D24",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
  },

  energyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});

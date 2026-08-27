import { StyleSheet, Text, View } from "react-native";

export default function CampaignsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Campaigns</Text>
      <Text style={styles.subtitle}>
        Campaign details will show up here after sign-in.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#F8FAFC",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A5C4A",
  },
  subtitle: {
    marginTop: 12,
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    color: "#64748B",
  },
});

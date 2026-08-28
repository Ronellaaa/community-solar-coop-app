import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function ProjectCard({
  title,
  location,
  image,
  funded,
  target,
  onPress,
}) {
  return (
    <View style={styles.card}>
      <View style={styles.topSection}>
        <Image source={image} style={styles.image} />

        <View style={styles.info}>
          <Text style={styles.title}>{title}</Text>

          <Text style={styles.location}>
            📍 {location}
          </Text>

          <Text style={styles.funded}>
            {funded}% funded
          </Text>
        </View>
      </View>

      <View style={styles.progressBackground}>
        <View
          style={[
            styles.progressFill,
            { width: `${funded}%` },
          ]}
        />
      </View>

      <View style={styles.bottomSection}>
        <View>
          <Text style={styles.target}>
            Rs. {target}
          </Text>

          <Text style={styles.targetLabel}>
            Target Amount
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={onPress}
        >
          <Text style={styles.buttonText}>
            View Project
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#e4e4e4",
  },

  topSection: {
    flexDirection: "row",
  },

  image: {
    width: 105,
    height: 78,
    borderRadius: 10,
  },

  info: {
    flex: 1,
    marginLeft: 12,
  },

  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
  },

  location: {
    fontSize: 11,
    color: "#666",
    marginTop: 5,
  },

  funded: {
    color: "#168b35",
    fontWeight: "600",
    marginTop: 7,
  },

  progressBackground: {
    height: 5,
    backgroundColor: "#dddddd",
    borderRadius: 5,
    marginTop: 12,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#24953c",
    borderRadius: 5,
  },

  bottomSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
  },

  target: {
    fontSize: 13,
    fontWeight: "700",
  },

  targetLabel: {
    fontSize: 10,
    color: "#777",
    marginTop: 2,
  },

  button: {
    backgroundColor: "#258c36",
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 18,
  },

  buttonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
});
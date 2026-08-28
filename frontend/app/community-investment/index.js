import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import ProjectCard from "../../components/solar-investment/ProjectCard";
import BottomNav from "../../components/solar-investment/BottomNav";
import { supabase } from "../../services/supabase";

export default function CommunityProjectsScreen() {
  const router = useRouter();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("solar_projects")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.log("Supabase error:", error);
        return;
      }

      setProjects(data || []);
    } catch (error) {
      console.log("Error loading projects:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Ionicons name="menu-outline" size={28} color="#111" />

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>
              Community Projects
            </Text>

            <Text style={styles.headerSubtitle}>
              Invest in shared solar. Power our community.
            </Text>
          </View>

          <Ionicons
            name="notifications-outline"
            size={24}
            color="#111"
          />
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#238636" />
            <Text style={styles.loadingText}>
              Loading projects...
            </Text>
          </View>
        ) : (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                title={project.title}
                location={project.location}
                funded={Math.round(
                  (Number(project.raised_amount) /
                    Number(project.target_amount)) *
                    100
                )}
                target={Number(
                  project.target_amount
                ).toLocaleString()}
                image={require("../../assets/images/greenfield-school.jpeg")}
                onPress={() =>
                  router.push({
                    pathname:
                      "/community-investment/project-details",
                    params: {
                      id: project.id,
                    },
                  })
                }
              />
            ))}

            {projects.length === 0 && (
              <Text style={styles.emptyText}>
                No solar projects available.
              </Text>
            )}
          </ScrollView>
        )}

        <BottomNav active="projects" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f7f8f6",
  },

  container: {
    flex: 1,
    backgroundColor: "#f7f8f6",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 14,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
  },

  headerCenter: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 10,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },

  headerSubtitle: {
    fontSize: 10,
    color: "#777",
    marginTop: 3,
    textAlign: "center",
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    padding: 14,
    paddingBottom: 20,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 10,
    color: "#666",
  },

  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#777",
  },
});
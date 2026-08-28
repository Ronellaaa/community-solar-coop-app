// components/group-purchase/LeadCampaignModal.jsx

import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AlertCircle, CheckCircle2, Crown, X } from "lucide-react-native";
import { SHADOWS } from "../../app/utils/group-purchasing";

export const LeadCampaignModal = ({
  visible,
  dealTitle,
  isCreating,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.modalCloseButton} onPress={onCancel}>
            <X size={24} color="#94A3B8" strokeWidth={2} />
          </TouchableOpacity>

          <View style={styles.modalIcon}>
            <Crown size={48} color="#1A5C4A" strokeWidth={2} />
          </View>

          <Text style={styles.modalTitle}>Lead This Campaign</Text>
          <Text style={styles.modalSubtitle}>
            You are about to become the organizer for:
          </Text>
          <Text style={styles.modalDealTitle}>{dealTitle}</Text>

          <View style={styles.modalDivider} />

          <Text style={styles.modalResponsibilityTitle}>
            Your responsibilities:
          </Text>
          <View style={styles.responsibilityItem}>
            <CheckCircle2 size={18} color="#10B981" strokeWidth={2.5} />
            <Text style={styles.responsibilityText}>
              Collect payments from neighbors
            </Text>
          </View>
          <View style={styles.responsibilityItem}>
            <CheckCircle2 size={18} color="#10B981" strokeWidth={2.5} />
            <Text style={styles.responsibilityText}>
              Coordinate with the installer
            </Text>
          </View>
          <View style={styles.responsibilityItem}>
            <CheckCircle2 size={18} color="#10B981" strokeWidth={2.5} />
            <Text style={styles.responsibilityText}>
              Manage group communication
            </Text>
          </View>

          <View style={styles.modalDivider} />

          <View style={styles.modalWarning}>
            <AlertCircle size={16} color="#F59E0B" strokeWidth={2} />
            <Text style={styles.modalWarningText}>
              You will be the first member of this campaign
            </Text>
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={onCancel}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modalConfirmButton,
                isCreating && styles.modalConfirmDisabled,
              ]}
              onPress={onConfirm}
              disabled={isCreating}
            >
              <Text style={styles.modalConfirmText}>
                {isCreating ? "Creating..." : "Yes, Lead This Campaign"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    ...SHADOWS.card,
  },
  modalCloseButton: {
    position: "absolute",
    top: 12,
    right: 12,
    padding: 4,
  },
  modalIcon: {
    alignItems: "center",
    marginBottom: 12,
    marginTop: 4,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    fontFamily: "Nunito_700Bold",
    color: "#1E293B",
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
    color: "#64748B",
    textAlign: "center",
    marginTop: 4,
  },
  modalDealTitle: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Nunito_600SemiBold",
    color: "#1A5C4A",
    textAlign: "center",
    marginTop: 4,
  },
  modalDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 16,
  },
  modalResponsibilityTitle: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Nunito_600SemiBold",
    color: "#1E293B",
    marginBottom: 8,
  },
  responsibilityItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 6,
  },
  responsibilityText: {
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
    color: "#475569",
  },
  modalWarning: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FEF3C7",
    padding: 12,
    borderRadius: 12,
  },
  modalWarningText: {
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
    color: "#F59E0B",
    flex: 1,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
  },
  modalCancelText: {
    fontSize: 16,
    fontFamily: "Nunito_600SemiBold",
    color: "#64748B",
  },
  modalConfirmButton: {
    flex: 2,
    backgroundColor: "#1A5C4A",
    paddingVertical: 12,
    borderRadius: 100,
    alignItems: "center",
  },
  modalConfirmDisabled: {
    backgroundColor: "#94A3B8",
  },
  modalConfirmText: {
    fontSize: 16,
    fontFamily: "Nunito_600SemiBold",
    color: "#FFFFFF",
  },
});

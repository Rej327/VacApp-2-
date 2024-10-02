import { View, StyleSheet, Modal, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import CustomCard from "../CustomCard";
import { ThemedText } from "../ThemedText";
import { Ionicons } from "@expo/vector-icons";

// Define the type for a milestone
interface Vaccine {
  name: string; // Vaccine name
  taken: boolean; // Indicates if the vaccine is taken
}

interface Milestone {
  age: string;
  vaccines: string; // Display status in 'X/Y' format
  details: Vaccine[]; // Array of vaccine details
}

// Define the milestones array with the Milestone type
const milestones: Milestone[] = [
  {
    age: "At Birth",
    vaccines: "2/2",
    details: [
      { name: "Hepatitis B (HBV)", taken: true },
      { name: "BCG", taken: true },
    ],
  },
  {
    age: "1 Month",
    vaccines: "1/1",
    details: [{ name: "Hepatitis B (HBV)", taken: true }],
  },
  {
    age: "2 Months",
    vaccines: "3/3",
    details: [
      { name: "DTaP", taken: true },
      { name: "IPV", taken: true },
      { name: "Hib", taken: true },
    ],
  },
  {
    age: "4 Months",
    vaccines: "3/3",
    details: [
      { name: "DTaP", taken: true },
      { name: "IPV", taken: true },
      { name: "Hib", taken: true },
    ],
  },
  {
    age: "6 Months",
    vaccines: "1/2",
    details: [
      { name: "DTaP", taken: false },
      { name: "IPV", taken: true },
    ],
  },
  {
    age: "9 Months",
    vaccines: "1/1",
    details: [{ name: "Measles", taken: true }],
  },
  {
    age: "12 Months",
    vaccines: "2/2",
    details: [
      { name: "MMR", taken: true },
      { name: "Varicella", taken: true },
    ],
  },
];

export default function Milestones() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null); // Use the Milestone type

  const handlePress = (milestone: Milestone) => { // Specify type for milestone
    setSelectedMilestone(milestone);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedMilestone(null);
  };

  return (
    <>
      <CustomCard>
        <ThemedText type="cardHeader" className="mb-2 font-bold">
          Milestones
        </ThemedText>
        <View>
          {milestones.map((milestone, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handlePress(milestone)}
              className={`flex flex-row justify-between py-4 ${
                index === milestones.length - 1 ? '' : 'border-b-[1px] border-[#d6d6d6]'
              }`}
            >
              <ThemedText type="default" className="font-bold">{milestone.age}</ThemedText>
              <ThemedText>{milestone.vaccines}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </CustomCard>

      {/* Modal for Vaccine Details */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ThemedText type="cardHeader" className="font-bold">
              Vaccine Details for {selectedMilestone?.age}
            </ThemedText>
            <View style={styles.vaccineDetails}>
              {selectedMilestone?.details.map((vaccine, index) => (
                <View key={index} style={styles.vaccineItem}>
                  {vaccine.taken ? (
                    <Ionicons name="checkmark-circle" size={20} color="green" />
                  ) : (
                    <Ionicons name="close-circle" size={20} color="red" />
                  )}
                  <ThemedText style={styles.vaccineText}>{vaccine.name}</ThemedText>
                </View>
              ))}
            </View>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <ThemedText style={styles.closeButtonText}>Close</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  vaccineDetails: {
    marginVertical: 10,
    width: "100%",
  },
  vaccineItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  vaccineText: {
    marginLeft: 10,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#86b3bc",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
  },
});

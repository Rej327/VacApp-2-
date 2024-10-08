import { View, Text, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import CustomBody from "@/components/body/CustomBody";
import { reminder } from "@/assets";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/db/firebaseConfig";
import CustomCard from "@/components/CustomCard";
import { Ionicons } from "@expo/vector-icons";
import { Timestamp } from "firebase/firestore"; // Import Timestamp if using Firestore dates

type MilestoneList = {
  ageInMonths: number;
  expectedDate: Timestamp | Date; // Allow Firestore Timestamp or JS Date
  vaccine: string;
  description: string;
  received: boolean;
};

type Milestones = {
  babyId: string;
  milestone: MilestoneList[];
};

export default function Reminder() {
  const [milestones, setMilestones] = useState<MilestoneList[]>([]);
  const [selectedBabyId, setSelectedBabyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Loading state

  const fetchBabyId = async () => {
    try {
      const babyId = await AsyncStorage.getItem("selectedBabyId");
      if (babyId) {
        setSelectedBabyId(babyId);
        fetchMilestones(babyId);
      }
    } catch (error) {
      console.error("Error fetching baby ID from storage: ", error);
    }
  };

  const fetchMilestones = async (babyId: string) => {
    setLoading(true); // Start loading spinner
    const milestonesRef = query(
      collection(db, "milestones"),
      where("babyId", "==", babyId)
    );

    try {
      const querySnapshot = await getDocs(milestonesRef);
      const fetchedMilestones: MilestoneList[] = [];

      querySnapshot.docs.forEach((doc) => {
        const milestoneData = doc.data();
        if (milestoneData.milestone) {
          fetchedMilestones.push(...milestoneData.milestone);
        }
      });

      setMilestones(fetchedMilestones);
    } catch (error) {
      console.error("Error fetching milestones: ", error);
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  useEffect(() => {
    fetchBabyId();
  }, [selectedBabyId]);

  // Group milestones by ageInMonths
  const groupedMilestones = milestones.reduce((acc, milestone) => {
    const age = milestone.ageInMonths;
    if (!acc[age]) {
      acc[age] = [];
    }
    acc[age].push(milestone);
    return acc;
  }, {} as Record<number, MilestoneList[]>);

  // Helper function to format date
  const formatDate = (date: Timestamp | Date) => {
    const jsDate = date instanceof Timestamp ? date.toDate() : date;
    return jsDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <CustomBody
      backRoute="/online/(auth)/home"
      title="Reminders"
      headerImage={reminder}
      headerImageStyle="absolute w-full h-56 -top-5 mx-auto"
      fileName="Baby Health Tips.pdf"
      url="https://drive.google.com/uc?export=download&id=1qBQb_IPfNDtu7SX8Q1yoF1YJLO96tlmD"
    >
      {loading ? (
        <View className="flex items-center justify-center">
          <ActivityIndicator size="large" color="#456B72" />
        </View>
      ) : (
        Object.entries(groupedMilestones).map(([age, vaccines]) => (
          <CustomCard key={age}>
            <ThemedText type="cardHeader">{`Age: ${age} months`}</ThemedText>
            {vaccines.map((vaccine, index) => (
              <View key={index} style={{ marginBottom: 10 }}>
                <ThemedText type="subtitle">{vaccine.vaccine}</ThemedText>
                <Text>{vaccine.description}</Text>
                <Text>{`Expected Date: ${formatDate(vaccine.expectedDate)}`}</Text>
                {vaccine.received ? (
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color="green"
                  />
                ) : (
                  <Ionicons name="close-circle" size={20} color="red" />
                )}
              </View>
            ))}
          </CustomCard>
        ))
      )}
    </CustomBody>
  );
}

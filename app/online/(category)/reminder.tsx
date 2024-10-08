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
			fileName=""
			url=""
		>
			{loading ? (
				<View className="flex items-center justify-center">
					<ActivityIndicator size="large" color="#456B72" />
				</View>
			) : (
				Object.entries(groupedMilestones).map(([age, vaccines]) => (
					<CustomCard key={age}>
						<ThemedText
							type="cardHeader"
							className="border-b-[1px] pb-3 border-[#d6d6d6]"
						>
							{age === "0" ? "At Birth" : `${age} month's`}
						</ThemedText>
						{vaccines.map((vaccine, index) => (
							<View
								key={index}
								className={`mx-2 mt-2  ${
									index !== vaccines.length - 1
										? "border-b-[1px] border-[#d6d6d6] pb-2"
										: ""
								}`}
							>
								<ThemedText type="default">
									<ThemedText
										type="default"
										className="font-bold"
									>
										Vaccine:{" "}
									</ThemedText>
									{vaccine.vaccine}
								</ThemedText>
								<View className="flex flex-row justify-between">
									<ThemedText type="default">
										<ThemedText
											type="default"
											className="font-bold"
										>
											Expected Date:{" "}
										</ThemedText>
										{formatDate(vaccine.expectedDate)}
									</ThemedText>
									{vaccine.received ? (
										<Ionicons
											name="checkmark-circle"
											size={20}
											color="green"
										/>
									) : (
										<Ionicons
											name="close-circle"
											size={20}
											color="red"
										/>
									)}
								</View>
							</View>
						))}
					</CustomCard>
				))
			)}
		</CustomBody>
	);
}

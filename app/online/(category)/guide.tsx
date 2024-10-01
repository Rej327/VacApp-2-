import {
	View,
	Image,
	ScrollView,
	ActivityIndicator,
	Modal,
	TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import CustomBody from "@/components/body/CustomBody";
import { guide, healthTips } from "@/assets";
import { Collapsible } from "@/components/Collapsible";
import { ThemedText } from "@/components/ThemedText";
import {
	healthTipsData,
	vaccinationTips,
	vaccinationGuide,
} from "@/assets/data/data";
import { Link } from "expo-router";

// Define a type for health tips data
interface HealthTip {
	category: string;
	icon: string;
	tips: string[];
}

// Define a type for vaccination guide data
interface Vaccination {
	ageRange: string;
	vaccines: {
		name: string;
		doses: string;
		details: string;
	}[];
}

export default function Guide() {
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState<HealthTip[]>([]);
	const [modalVisible, setModalVisible] = useState(false);
	const [selectedVaccination, setSelectedVaccination] =
		useState<Vaccination | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setData(healthTipsData);
			} catch (error) {
				console.error("Error fetching data:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const handleAgeRangePress = (vaccination: Vaccination) => {
		setSelectedVaccination(vaccination);
		setModalVisible(true);
	};

	const closeModal = () => {
		setModalVisible(false);
		setSelectedVaccination(null);
	};

	return (
		<CustomBody
			backRoute="/online/(auth)/home"
			title="Guide"
			fileName="Baby Vaccination Guide.pdf"
			url="https://drive.google.com/uc?export=download&id=13MPmCqXxWlWIpp94IOD9iKt2P9emzghg"
		>
			{loading ? (
				<View className="flex -mt-10 items-center justify-center h-full">
					<ActivityIndicator size="large" color="#456B72" />
				</View>
			) : (
				<>
					<Image
						source={guide}
						className="absolute w-80 h-60 mx-auto left-[10%]"
					/>
					<ScrollView
						showsVerticalScrollIndicator={false}
						className="bg-[#f5f4f7] mt-60 h-auto rounded-t-2xl px-4"
					>
						<ScrollView
							horizontal={true}
							showsHorizontalScrollIndicator={false}
							snapToInterval={320}
							decelerationRate="fast"
							pagingEnabled={true}
							className="mt-4"
						>
							{vaccinationTips.map((tips, index) => (
								<View
									key={index}
									className="bg-white p-4 rounded-xl w-80 mr-4 h-auto"
								>
									<Link href="https://www.unilab.com.ph/health-tips/child-vaccination-guide">
										<ThemedText type="link">
											Children's Health
										</ThemedText>
									</Link>
									<ThemedText
										type="cardHeader"
										className="mt-2"
									>
										{tips.title}
									</ThemedText>
									<ThemedText
										type="default"
										className="text-justify mt-2"
									>
										{tips.content}
									</ThemedText>
								</View>
							))}
						</ScrollView>
						{/* Add the vaccination guide here */}
						<View className="mt-4">
							<ThemedText type="header" className="mb-2">
								Childhood Immunization Guide
							</ThemedText>
							<View className="rounded-xl overflow-hidden">
								{vaccinationGuide.map((vaccination, index) => (
									<TouchableOpacity
										key={index}
										onPress={() =>
											handleAgeRangePress(vaccination)
										}
									>
										<View className="bg-white p-4 border-b-[1px] border-[#d6d6d6]">
											<ThemedText type="cardHeader">
												{vaccination.ageRange}
											</ThemedText>
										</View>
									</TouchableOpacity>
								))}
							</View>
						</View>
					</ScrollView>

					{/* Modal for vaccination details */}
					<Modal
						visible={modalVisible}
						animationType="slide"
						transparent={true}
					>
						<View className="flex-1 justify-center items-center bg-black/50">
							<View className="bg-white rounded-lg p-4 w-4/5">
								{selectedVaccination && (
									<>
										<ThemedText type="cardHeader">
											{selectedVaccination.ageRange}
										</ThemedText>
										{selectedVaccination.vaccines.map(
											(vaccine, index) => (
												<View
													key={index}
													className="mb-2"
												>
													<ThemedText
														type="default"
														className="font-bold"
													>
														{vaccine.name}
													</ThemedText>
													<ThemedText type="default">
														{vaccine.doses}
													</ThemedText>
													<ThemedText type="default">
														{vaccine.details}
													</ThemedText>
												</View>
											)
										)}
									</>
								)}
								<TouchableOpacity
									onPress={closeModal}
									className="mt-4 bg-[#456B72] rounded-lg p-2"
								>
									<ThemedText
										type="default"
										className="text-white text-center"
									>
										Close
									</ThemedText>
								</TouchableOpacity>
							</View>
						</View>
					</Modal>
				</>
			)}
		</CustomBody>
	);
}

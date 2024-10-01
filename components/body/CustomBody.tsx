import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import React, { ReactNode } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { circleBg } from "@/assets";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

interface CustomBodyProps {
	children: ReactNode;
	title: string;
	backRoute: string;
	url: string;
	fileName: string;
}

const CustomBody: React.FC<CustomBodyProps> = ({
	children,
	title,
	backRoute,
	url,
	fileName,
}) => {
	const router = useRouter();

	const handleBackPress = () => {
		router.push(backRoute); // Navigate to the route passed as a prop
	};

	// Function to download PDF from Google Drive or other sources
	const downloadPdf = async () => {
		try {
			// Get file download path in the device
			const fileUri = FileSystem.documentDirectory + fileName;

			// Download file
			const { uri } = await FileSystem.downloadAsync(url, fileUri);

			// Check if the file can be opened or shared
			if (await Sharing.isAvailableAsync()) {
				await Sharing.shareAsync(uri);
			} else {
				Alert.alert("Downloaded", "File downloaded but sharing is unavailable.");
			}
		} catch (error) {
			console.error("Error downloading file", error);
			Alert.alert("Error", "There was an error downloading the file.");
		}
	};


	return (
    <View className="relative bg-[#86b3bc] h-full">
      {/* Back Button */}
			<View className="absolute z-10 top-2 flex flex-row justify-between w-full px-2">
				<TouchableOpacity onPress={handleBackPress}>
					<View className="flex flex-row items-center gap-2">
						<Ionicons name="arrow-back" size={24} color="#456B72" />
						<ThemedText type="navigation">{title}</ThemedText>
					</View>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => downloadPdf()}>
					<View className="flex flex-row items-center gap-2">
						<Ionicons
							name="cloud-download"
							size={24}
							color="#456B72"
						/>
						<ThemedText>Download</ThemedText>
					</View>
				</TouchableOpacity>
			</View>
			

      {/* Background Graphics */}
      <Image source={circleBg} className="absolute top-0 -right-10 h-52 w-52" />
      <Image source={circleBg} className="absolute top-40 -left-5 h-32 w-32" />
      <Image source={circleBg} className="absolute top-56 right-0 h-20 w-20" />
      <Image source={circleBg} className="absolute top-72 -left-5 h-44 w-44" />

      {/* Screen Content */}
      <View className="mt-10">{children}</View>
    </View>
  );
};

export default CustomBody;

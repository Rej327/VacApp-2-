import React from "react";
import { Stack } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router"; // Import useRouter for navigation

const CategoryLayout = () => {
	const router = useRouter(); // Get the router

	const handleBackPress = () => {
		router.push('/online/(auth)/home'); // Navigate to the Home screen
	};

	return (
		<Stack
			screenOptions={{
				headerStyle: {
					backgroundColor: "#87b2bd",
				},
				headerTintColor: "#456B72", // Set header text color to white
				headerBackTitle: "Back",
				headerShown: true, // Show the header for navigation
				headerLeft: () => (
					<TouchableOpacity onPress={handleBackPress} className="mr-2">
						<Ionicons name="arrow-back" size={24} color="#456B72"/>
					</TouchableOpacity>
				),
				statusBarColor: "#87b2bd"
			}}
		>
			<Stack.Screen
				name="guide" // Route for the Guide page
				options={{ title: "Guide" }}
			/>
			<Stack.Screen
				name="health" // Route for the Health page
				options={{ title: "Health" }}
			/>
			<Stack.Screen
				name="appointment" // Route for the Appointment page
				options={{ title: "Appointments" }}
			/>
			<Stack.Screen
				name="reminder" // Route for the Reminders page
				options={{ title: "Reminders" }}
			/>
		</Stack>
	);
};

export default CategoryLayout;

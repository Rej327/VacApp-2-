import { View, Text, Pressable } from "react-native";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@clerk/clerk-expo"; // Import Clerk's useAuth hook
import { useRouter } from "expo-router"; // Import router for navigation

export default function Logout() {
	const { signOut } = useAuth(); // Get the signOut method from Clerk
	const router = useRouter(); // Use router for navigation after logout

	const handleLogout = async () => {
		try {
			// Sign out the user via Clerk
			await signOut();
			// Optionally clear local storage if needed
			await AsyncStorage.removeItem("userData");
			console.log("User signed out and data cleared");

			// Redirect to the login page after sign-out
			router.replace("/login");
		} catch (error) {
			console.error("Failed to log out or clear user data:", error);
		}
	};

	return (
		<Pressable
			className="w-auto flex items-center justify-center bg-red-700 p-2"
			onPress={handleLogout}
		>
			<Text className="text-white">Logout</Text>
		</Pressable>
	);
}

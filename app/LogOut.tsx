import { View, Text, Pressable } from "react-native";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@clerk/clerk-expo"; // Import Clerk's useAuth hook
import { useRouter } from "expo-router"; // Import router for navigation
import { Ionicons } from "@expo/vector-icons";

export default function Logout() {
	const { signOut } = useAuth(); // Get the signOut method from Clerk
	const router = useRouter(); // Use router for navigation after logout

	const handleLogout = async () => {
		try {
			// Sign out the user via Clerk
			await signOut();
			// Optionally clear local storage if needed
			await AsyncStorage.removeItem("userData");
			await AsyncStorage.removeItem("babies");
			console.log("User signed out and data cleared");

			// Redirect to the login page after sign-out
			router.replace("/online/(public)/main");
		} catch (error) {
			console.error("Failed to log out or clear user data:", error);
		}
	};

	return (
		<Pressable onPress={handleLogout} style={{ marginRight: 10 }}>
			<Ionicons name="log-out-outline" size={24} color={"#fff"} />
		</Pressable>
	);
}

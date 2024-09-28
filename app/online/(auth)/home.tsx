import {
	View,
	Text,
	StatusBar,
	ScrollView,
	RefreshControl,
	Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "@clerk/clerk-expo";
import { vaccine } from "@/assets";

interface UserData {
	email: string;
	id: string;
	firstName: string;
	lastName: string;
}

const Home = () => {
	const { user } = useUser();
	const [storedUserData, setStoredUserData] = useState<UserData | null>(null);
	const [refreshing, setRefreshing] = useState(false);

	const saveUserDataToLocalStorage = async () => {
		if (user) {
			try {
				const userData: UserData = {
					email: user.emailAddresses?.[0]?.emailAddress || "",
					id: user.id,
					firstName: user.firstName || "",
					lastName: user.lastName || "",
				};

				await AsyncStorage.setItem(
					"userData",
					JSON.stringify(userData)
				);
			} catch (error) {
				console.error(
					"Failed to save user data to local storage:",
					error
				);
			}
		}
	};

	const retrieveUserDataFromLocalStorage = async () => {
		try {
			const retrievedData = await AsyncStorage.getItem("userData");
			if (retrievedData !== null) {
				setStoredUserData(JSON.parse(retrievedData) as UserData);
			}
		} catch (error) {
			console.error(
				"Failed to retrieve user data from local storage:",
				error
			);
		}
	};

	useEffect(() => {
		saveUserDataToLocalStorage();
		retrieveUserDataFromLocalStorage();
	}, [user]);

	const onRefresh = async () => {
		setRefreshing(true);
		await AsyncStorage.removeItem("userData"); // Clear existing data
		await saveUserDataToLocalStorage(); // Resave user data
		await retrieveUserDataFromLocalStorage(); // Reload user data
		setRefreshing(false);
	};

	return (
		<ScrollView
			refreshControl={
				<RefreshControl
					refreshing={refreshing}
					onRefresh={onRefresh}
					colors={["#456B72"]}
				/>
			}
			style={{ backgroundColor: "#fefffe" }}
		>
			<View className="flex flex-1 items-center justify-center">
				<Image
					source={vaccine}
					className="w-auto h-[200px] object-contain"
				/>
				{storedUserData ? (
					<>
						<Text>Welcome, {storedUserData.email} 🎉</Text>
						<Text>ID: {storedUserData.id}</Text>
						<Text>First Name: {storedUserData.firstName}</Text>
						<Text>Last Name: {storedUserData.lastName}</Text>
					</>
				) : (
					<Text>Loading user data...</Text>
				)}
			</View>
		</ScrollView>
	);
};

export default Home;

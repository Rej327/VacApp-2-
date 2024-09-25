import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "@clerk/clerk-expo";

interface UserData {
	email: string;
	id: string;
	firstName: string;
	lastName: string;
}

const OfflineHome = () => {
	const [storedUserData, setStoredUserData] = useState<UserData | null>(null);

	useEffect(() => {
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

		retrieveUserDataFromLocalStorage();
	}, []);

	return (
		<View
			style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
		>
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
	);
};

export default OfflineHome;

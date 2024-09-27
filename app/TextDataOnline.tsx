import { View, Text } from "react-native";
import React from "react";
import { useUser } from "@clerk/clerk-expo";

const TestDataOnline = () => {
	const { user } = useUser(); // Get user data directly from Clerk

	return (
		<View
			style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
		>
			{user ? (
				<>
					<Text>
						Welcome, {user.emailAddresses?.[0]?.emailAddress || ""}{" "}
						🎉
					</Text>
					<Text>ID: {user.id}</Text>
					<Text>First Name: {user.firstName || ""}</Text>
					<Text>Last Name: {user.lastName || ""}</Text>
				</>
			) : (
				<Text>Loading user data...</Text>
			)}
		</View>
	);
};

export default TestDataOnline;

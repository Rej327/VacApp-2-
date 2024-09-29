import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants"; // Import to access Expo's extra configuration

const InitialLayout = () => {
	const { isLoaded, isSignedIn } = useAuth();
	const segments = useSegments();
	const router = useRouter();

	useEffect(() => {
		const redirectUser = () => {
			if (!isLoaded) return; // Wait until Clerk is loaded

			if (isSignedIn) {
				router.replace("/online/(auth)/home");
			} else {
				router.replace("/online/(public)/main");
			}
		};

		redirectUser();
	}, [isSignedIn, isLoaded]);

	if (!isLoaded) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Text>Loading...</Text>
			</View>
		);
	}

	return <Slot />;
};

const tokenCache = {
	async getToken(key: string): Promise<string | null> {
		try {
			return await SecureStore.getItemAsync(key);
		} catch (err) {
			console.error("Error retrieving token:", err);
			return null;
		}
	},
	async saveToken(key: string, value: string): Promise<void> {
		try {
			await SecureStore.setItemAsync(key, value);
		} catch (err) {
			console.error("Error saving token:", err);
		}
	},
};

const RootLayout = () => {
	
	const CLERK_PUBLISHABLE_KEY =
		Constants?.expoConfig?.extra?.clerkPublishableKey || "Fallback_Key";

	return (
		<ClerkProvider
			publishableKey={CLERK_PUBLISHABLE_KEY}
			tokenCache={tokenCache}
		>
			<InitialLayout />
		</ClerkProvider>
	);
};

export default RootLayout;

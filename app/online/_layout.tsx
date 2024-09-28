import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";
import * as SecureStore from "expo-secure-store";

const CLERK_PUBLISHABLE_KEY =
	"pk_test_YWRhcHRlZC1vc3ByZXktMjAuY2xlcmsuYWNjb3VudHMuZGV2JA";

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

	// Show loading message if Clerk is not yet loaded
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

	return <Slot />; // Slot will render the appropriate layout based on routing
};

const tokenCache = {
	async getToken(key: string): Promise<string | null> {
		// Specify the parameter type and return type
		try {
			return await SecureStore.getItemAsync(key);
		} catch (err) {
			console.error("Error retrieving token:", err);
			return null;
		}
	},
	async saveToken(key: string, value: string): Promise<void> {
		// Specify the parameter types and return type
		try {
			await SecureStore.setItemAsync(key, value);
		} catch (err) {
			console.error("Error saving token:", err);
		}
	},
};

const RootLayout = () => {
	return (
		<ClerkProvider
			publishableKey={CLERK_PUBLISHABLE_KEY!}
			tokenCache={tokenCache}
		>
			<InitialLayout />
		</ClerkProvider>
	);
};

export default RootLayout;

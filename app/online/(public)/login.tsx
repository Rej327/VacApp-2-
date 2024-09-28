import Logout from "@/app/LogOut";
import TestDataOnline from "@/app/TextDataOnline";
import { babyIcon, botField, topField } from "@/assets";
import CustomHeadFoot from "@/components/CustomHeadFoot";
import CustomInput from "@/components/CustomInput";
import StyledButton from "@/components/StyledButton";
import { ThemedText } from "@/components/ThemedText";
// import TopBg from "@/components/TopBg";
import { useSignIn } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import React, { useState } from "react";
import {
	View,
	StyleSheet,
	TextInput,
	Button,
	Pressable,
	Text,
	Alert,
	Image,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";

const Login = () => {
	const { signIn, setActive, isLoaded } = useSignIn();

	const [emailAddress, setEmailAddress] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	const onSignInPress = async () => {
		if (!isLoaded) {
			return;
		}
		setLoading(true);
		try {
			const completeSignIn = await signIn.create({
				identifier: emailAddress,
				password,
			});

			// This indicates the user is signed in
			await setActive({ session: completeSignIn.createdSessionId });
		} catch (err: any) {
			alert(err.errors[0].message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<CustomHeadFoot />
			<View style={styles.container}>
				<Spinner visible={loading} />

				<View style={{ alignItems: "center" }}>
					<Image
						source={babyIcon}
						style={{ width: 75, height: 75 }}
					/>
				</View>
				<View>
					<ThemedText type="title" className="my-4">
						Sign in
					</ThemedText>
					<CustomInput
						label="Email or Username"
						placeholder="Enter your email or username"
						value={emailAddress}
						onChangeText={setEmailAddress}
					/>
					<CustomInput
						label="Password"
						placeholder="Enter your password"
						value={password}
						onChangeText={setPassword}
						secureTextEntry={true} // Optional for password field
					/>
				</View>
				<StyledButton
					onPress={onSignInPress}
					title="Login"
					borderRadius={12}
				/>
				<View className="flex flex-row-reverse w-full justify-between">
					<Link href="/online/(public)/reset" asChild>
						<Pressable style={styles.button}>
							<ThemedText type="link">
								Forgot password?
							</ThemedText>
						</Pressable>
					</Link>
					<Link href="/online/(public)/main" asChild>
						<Pressable style={styles.button}>
							<ThemedText type="link">Back</ThemedText>
						</Pressable>
					</Link>
				</View>
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		padding: 20,
	},
	button: {
		margin: 8,
		alignItems: "center",
	},
});

export default Login;

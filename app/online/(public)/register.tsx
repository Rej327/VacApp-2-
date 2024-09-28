import {
	Button,
	TextInput,
	View,
	StyleSheet,
	Image,
	Pressable,
} from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import Spinner from "react-native-loading-spinner-overlay";
import { useState } from "react";
import { Link, Stack } from "expo-router";
import CustomInput from "@/components/CustomInput";
import { ThemedText } from "@/components/ThemedText";
import CustomHeadFoot from "@/components/CustomHeadFoot";
import { babyIcon } from "@/assets";
import StyledButton from "@/components/StyledButton";

const Register = () => {
	const { isLoaded, signUp, setActive } = useSignUp();

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [username, setUsername] = useState("");
	const [emailAddress, setEmailAddress] = useState("");
	const [password, setPassword] = useState("");
	const [pendingVerification, setPendingVerification] = useState(false);
	const [code, setCode] = useState("");
	const [loading, setLoading] = useState(false);

	// Create the user and send the verification email
	const onSignUpPress = async () => {
		if (!isLoaded) {
			return;
		}
		setLoading(true);

		try {
			// Create the user on Clerk with firstName, lastName, and username
			await signUp.create({
				firstName,
				lastName,
				username,
				emailAddress,
				password,
			});

			// Send verification Email
			await signUp.prepareEmailAddressVerification({
				strategy: "email_code",
			});

			// Change the UI to verify the email address
			setPendingVerification(true);
		} catch (err: any) {
			alert(err.errors[0].message);
		} finally {
			setLoading(false);
		}
	};

	// Verify the email address
	const onPressVerify = async () => {
		if (!isLoaded) {
			return;
		}
		setLoading(true);

		try {
			const completeSignUp = await signUp.attemptEmailAddressVerification(
				{
					code,
				}
			);

			await setActive({ session: completeSignUp.createdSessionId });
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
				<Stack.Screen
					options={{ headerBackVisible: !pendingVerification }}
				/>
				<Spinner visible={loading} />

				{!pendingVerification && (
					<>
						<View style={{ alignItems: "center" }}>
							<Image
								source={babyIcon}
								style={{ width: 75, height: 75 }}
							/>
						</View>
						<ThemedText type="title" className="my-4">
							Register
						</ThemedText>
						<View className="flex flex-row justify-between">
							<View className="w-[48%]">
								<CustomInput
									label="First Name"
									placeholder="Enter your first name"
									value={firstName}
									onChangeText={setFirstName}
								/>
							</View>
							<View className="w-[48%]">
								<CustomInput
									label="Last Name"
									placeholder="Enter your last name"
									value={lastName}
									onChangeText={setLastName}
								/>
							</View>
						</View>
						<CustomInput
							label="Username"
							placeholder="Enter your username"
							value={username}
							onChangeText={setUsername}
						/>
						<CustomInput
							label="Email address"
							placeholder="Enter your email address"
							value={emailAddress}
							onChangeText={setEmailAddress}
						/>
						<CustomInput
							label="Password"
							placeholder="Enter your password"
							value={password}
							onChangeText={setPassword}
							secureTextEntry
						/>

						<StyledButton
							onPress={onSignUpPress}
							title="Sign up"
							borderRadius={12}
						/>

						<View className="flex flex-row-reverse w-full justify-between">
							<Link href="/online/(public)/login" asChild>
								<Pressable>
									<ThemedText type="link">
										Already have an account?
									</ThemedText>
								</Pressable>
							</Link>
							<Link href="/online/(public)/main" asChild>
								<Pressable>
									<ThemedText type="link">Back</ThemedText>
								</Pressable>
							</Link>
						</View>
					</>
				)}

				{pendingVerification && (
					<>
						<View>
							<View style={{ alignItems: "center" }}>
								<Image
									source={babyIcon}
									style={{ width: 75, height: 75 }}
								/>
							</View>
							<ThemedText
								className="text-center my-4"
								type="subtitle"
							>
								Verify your email address
							</ThemedText>
							<CustomInput
								value={code}
								placeholder="Enter verification code"
								onChangeText={setCode}
							/>
						</View>
						<StyledButton
							onPress={onPressVerify}
							title="Submit"
							borderRadius={12}
						/>
						<Link href="/online/(public)/main" asChild>
							<Pressable>
								<ThemedText className="text-center" type="link">
									Cancel
								</ThemedText>
							</Pressable>
						</Link>
					</>
				)}
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
	inputField: {
		marginVertical: 4,
		height: 50,
		borderWidth: 1,
		borderColor: "#6c47ff",
		borderRadius: 4,
		padding: 10,
		backgroundColor: "#fff",
	},
	button: {
		margin: 8,
		alignItems: "center",
	},
});

export default Register;

import { View, Text, TextInput } from "react-native";
import React, { useState } from "react";
import CustomCard from "../CustomCard";
import { ThemedText } from "../ThemedText";
import { useUser } from "@clerk/clerk-expo";
import StyledButton from "../StyledButton";
import Toast from "react-native-toast-message";

export default function ProfileInformation() {
	const { user } = useUser();
	const [firstName, setFirstName] = useState(user?.firstName ?? "");
	const [lastName, setLastName] = useState(user?.lastName ?? "");
	const [username, setUsername] = useState(user?.username ?? "");

	const onSaveUser = async () => {
		try {
			const result = await user?.update({
				firstName: firstName,
				lastName: lastName,
				username: username,
			});
			Toast.show({
				type: "success",
				text1: "Success",
				text2: "Update profile successfully!",
				position: "top",
			});
			console.log(
				"🚀 ~ file: profile.tsx:16 ~ onSaveUser ~ result:",
				result
			);
		} catch (e) {
			Toast.show({
				type: "error",
				text1: "Error",
				text2: "Failed to update profile!",
				position: "top",
			});
			console.log(
				"🚀 ~ file: profile.tsx:18 ~ onSaveUser ~ e",
				JSON.stringify(e)
			);
		}
	};
	return (
		<CustomCard>
			<ThemedText type="cardHeader" className="mb-2">
				Profile Information
			</ThemedText>
			<View className="flex justify-between">
				<ThemedText type="default" className="font-bold">
					User ID:
				</ThemedText>
				<TextInput
					value={user?.id}
					className=" border-[#d6d6d6] my-1 h-10 w-auto p-2 rounded-xl bg-[#ebebeb]"
				/>
				<ThemedText type="default" className="font-bold">
					Username:
				</ThemedText>
				<TextInput
					placeholder="Last Name"
					onChangeText={setUsername}
					value={username}
					className=" border-[#d6d6d6] my-1 h-10 w-auto p-2 rounded-xl bg-[#ebebeb] mb-2"
				/>
			</View>
			<View className="flex flex-row justify-between">
				<View className="w-[49%]">
					<ThemedText type="default" className="font-bold">
						First name:
					</ThemedText>
					<TextInput
						onChangeText={setFirstName}
						value={firstName}
						placeholder="First name"
						className=" border-[#d6d6d6] my-1 h-10 w-auto  p-2 rounded-xl bg-[#ebebeb]"
					/>
				</View>
				<View className="w-[49%]">
					<ThemedText type="default" className="font-bold">
						Last name:
					</ThemedText>
					<TextInput
						placeholder="Last Name"
						value={lastName}
						onChangeText={setLastName}
						className=" border-[#d6d6d6] my-1 h-10 w-auto p-2 rounded-xl bg-[#ebebeb] mb-2"
					/>
				</View>
			</View>
			<StyledButton
				title="Update User"
				onPress={onSaveUser}
				paddingVertical={10}
				fontSize={14}
				borderRadius={12}
				customWeight="500"
			/>
		</CustomCard>
	);
}

import { View, Text, Pressable, Image } from "react-native";
import React from "react";
import { Link } from "expo-router";
import StyledButton from "@/components/StyledButton";
import { babyIcon } from "@/assets"; // Adjusted to match the barrel export

export default function Main() {
	return (
		<View className="flex gap-2 my-auto justify-center items-center">
			<View className="mb-2 flex flex-col justify-center items-center">
				<Image source={babyIcon} style={{ width: 100, height: 100 }} />
        <Text className="text-lg text-[#456B72]">Know More, Care Better!</Text>
			</View>
			<Link href="/online/(public)/login" asChild>
				<StyledButton
					onPress={() => console.log("Go to Login")}
					title="Login"
					textColor="white"
					width="50%"
				/>
			</Link>
			<Link href="/online/(public)/register" asChild>
				<StyledButton
					onPress={() => console.log("Go To Register")}
					title="Register"
					bgColor="#DAE9EA"
					textColor="#456B72"
					width="50%"
				/>
			</Link>
		</View>
	);
}

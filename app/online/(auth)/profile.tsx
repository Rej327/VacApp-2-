import { View, Image, RefreshControl } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { ThemedText } from "@/components/ThemedText";
import { ScrollView } from "react-native-gesture-handler";
import CustomCard from "@/components/CustomCard";
import ProfileInformation from "@/components/profile/ProfileInformation";
import MyBaby from "@/components/profile/MyBaby";
import Notification from "@/components/profile/Notification";
import Milestones from "@/components/profile/Milestones";
import Logout from "@/app/LogOut";
import FirebaseTest from "@/components/profile/FirebaseTest";
import { useState } from "react";
const Profile = () => {
	const [refreshing, setRefreshing] = useState(false);
	const { user } = useUser();

	const onRefresh = async () => {
		setRefreshing(true);

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
			keyboardDismissMode="on-drag"
		>
			<View className="bg-[#86b3bc] w-auto h-10" />

			{user && (
				<Image
					source={{ uri: user?.imageUrl }} // Use Clerk's profile image URL
					className="relative mx-auto border-2 -mt-6 mb-4 w-12 h-12 rounded-full"
				/>
			)}
			<ProfileInformation />
			<MyBaby />
			<Notification />
			<Milestones />
			<Logout />
		</ScrollView>
	);
};

export default Profile;

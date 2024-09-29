import {
	View,
	Text,
	StatusBar,
	ScrollView,
	RefreshControl,
	Image,
	StyleSheet,
	Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "@clerk/clerk-expo";
import {
	appointmentIcon,
	babyIcon,
	circleIcon,
	guideIcon,
	healthIcon,
	hearthIcon,
	nonagonIcon,
	reminderIcon,
	starIcon,
	vaccine,
} from "@/assets";
import { ThemedText } from "@/components/ThemedText";
import CategoryCard from "@/components/CategoryCard";
import { Link } from "expo-router";

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
		>
			<View className="flex gap-2 p-2">
				<View style={styles.imageContainer}>
					<Image
						source={vaccine}
						style={styles.image}
						resizeMode="cover"
					/>
				</View>

				<View>
					<ThemedText type="header">Category</ThemedText>
					<View className="flex flex-row flex-wrap justify-center">
						<CategoryCard
							link="/online/(category)/health"
							icon={healthIcon}
							title="HEALTH TIPS"
							backgroundColor="#5ad5fa66"
							shapeIcon={hearthIcon}
							shapePosition={{ top: 0, left: 0 }} // Example position
						/>
						<CategoryCard
							link="/online/(category)/guide"
							icon={guideIcon}
							title="GUIDE"
							backgroundColor="#5a92fa66"
							shapeIcon={nonagonIcon}
							shapePosition={{ bottom: 0, left: 0 }} // Example position
						/>
						<CategoryCard
							link="/online/(category)/reminder"
							icon={reminderIcon}
							title="REMINDERS"
							backgroundColor="#ecff8253"
							shapeIcon={starIcon}
							shapePosition={{ top: 2, right: 0 }} // Example position
						/>
						<CategoryCard
							link="/online/(category)/appointment"
							icon={appointmentIcon}
							title="APPOINTMENT"
							backgroundColor="#82ffc555"
							shapeIcon={circleIcon}
							shapePosition={{ bottom: 10, right: 10 }} // Example position
						/>
					</View>
				</View>
			</View>
		</ScrollView>
	);
};

export default Home;

const styles = StyleSheet.create({
	imageContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	image: {
		width: "100%", // Takes up full width of the container
		height: 200, // Specify height to control the image size
		borderRadius: 10,
	},
});

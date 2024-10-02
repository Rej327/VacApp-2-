import React, { useEffect, useState } from "react";
import {
	View,
	ScrollView,
	Button,
	Modal,
	TextInput,
	StyleSheet,
	TouchableOpacity,
	Platform,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import CustomCard from "@/components/CustomCard";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StyledButton from "../StyledButton";

// Define the interface for Baby
interface Baby {
	firstName: string;
	lastName: string;
	birthday: string;
}

const MyBaby = () => {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [birthday, setBirthday] = useState("");
	const [babies, setBabies] = useState<Baby[]>([]);
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [date, setDate] = useState(new Date());
	const [selectedBaby, setSelectedBaby] = useState<Baby | null>(null);
	const [showDropdown, setShowDropdown] = useState(false);

	// Load babies from AsyncStorage when the component mounts
	useEffect(() => {
		const loadBabies = async () => {
			const storedBabies = await AsyncStorage.getItem("babies");
			if (storedBabies) {
				setBabies(JSON.parse(storedBabies));
			}
		};
		loadBabies();
	}, []);

	// Save babies to AsyncStorage whenever the babies array changes
	useEffect(() => {
		const saveBabies = async () => {
			await AsyncStorage.setItem("babies", JSON.stringify(babies));
		};
		saveBabies();
	}, [babies]);

	const handleAddBaby = () => {
		const newBaby: Baby = { firstName, lastName, birthday };
		setBabies((prevBabies) => [...prevBabies, newBaby]);
		setFirstName("");
		setLastName("");
		setBirthday("");
		setIsModalVisible(false);
	};

	const handleDateChange = (event: any, selectedDate?: Date) => {
		const currentDate = selectedDate || date;
		setShowDatePicker(Platform.OS === "ios");
		setDate(currentDate);
		setBirthday(currentDate.toLocaleDateString("en-US")); // Format the date as MM/DD/YYYY
	};

	const handleSelectBaby = (baby: Baby) => {
		setSelectedBaby(baby);
		setShowDropdown(false); // Close dropdown after selection
	};

	// Corrected the babyInfo function to return JSX
	const babyInfo = (baby: Baby) => {
		return (
			<View style={styles.babyInfoContainer}>
				<ThemedText type="default">
					{baby.firstName} {baby.lastName}
				</ThemedText>
				<ThemedText type="default">{baby.birthday}</ThemedText>
			</View>
		);
	};

	return (
		<ScrollView>
			{/* Check if there are babies */}
			{babies.length > 0 ? (
				<CustomCard className="my-2">
					<ThemedText type="cardHeader" className="mb-2">
						My Baby
					</ThemedText>
					<ThemedText type="default" className="font-bold">
						Select Baby:
					</ThemedText>
					<TouchableOpacity
						onPress={() => setShowDropdown(!showDropdown)} // Toggle dropdown
						style={styles.input}
					>
						<View className="flex flex-row justify-between">
							{selectedBaby
								? babyInfo(selectedBaby) // Pass the selected baby to babyInfo
								: <ThemedText type="default" className="font-bold">Choose Baby</ThemedText>}
						</View>
					</TouchableOpacity>
					{showDropdown && (
						<View style={styles.dropdown}>
							{babies.map((baby, index) => (
								<TouchableOpacity
									key={index}
									onPress={() => handleSelectBaby(baby)}
									style={styles.dropdownItem}
								>
									<ThemedText type="default">
										{baby.firstName} {baby.lastName}
									</ThemedText>
									<ThemedText type="default">
										{baby.birthday}
									</ThemedText>
								</TouchableOpacity>
							))}
						</View>
					)}
					<StyledButton
						title="Add Baby"
						onPress={() => setIsModalVisible(true)}
						paddingVertical={10}
						fontSize={14}
						borderRadius={12}
						customWeight="500"
					/>
				</CustomCard>
			) : (
				<CustomCard>
					<ThemedText type="cardHeader" className="mb-2">
						My Baby
					</ThemedText>
					<ThemedText type="header" className="text-center">
						No babies added yet!
					</ThemedText>
					<ThemedText type="default" className="text-center mb-2">
						Please add a baby to use all features of the application.
					</ThemedText>
					<StyledButton
						title="Add Baby"
						onPress={() => setIsModalVisible(true)}
						paddingVertical={10}
						fontSize={14}
						borderRadius={12}
						customWeight="500"
					/>
				</CustomCard>
			)}

			{/* Add Baby Modal */}
			<Modal
				visible={isModalVisible}
				animationType="slide"
				transparent={true}
				onRequestClose={() => setIsModalVisible(false)}
			>
				<View style={styles.modalContainer}>
					<View style={styles.modalContent}>
						<ThemedText type="header" style={styles.modalHeader}>
							Add Baby
						</ThemedText>

						<TextInput
							placeholder="First Name"
							value={firstName}
							onChangeText={setFirstName}
							style={styles.input}
						/>
						<TextInput
							placeholder="Last Name"
							value={lastName}
							onChangeText={setLastName}
							style={styles.input}
						/>

						{/* Birthday Input Field */}
						<TouchableOpacity
							onPress={() => setShowDatePicker(true)}
							style={styles.input}
						>
							<ThemedText type="default">
								{birthday || "Select Birthday"}
							</ThemedText>
						</TouchableOpacity>

						{/* DateTimePicker */}
						{showDatePicker && (
							<DateTimePicker
								value={date}
								mode="date"
								display="default"
								onChange={handleDateChange}
							/>
						)}

						<View style={styles.buttonContainer}>
							<Button
								title="Add Baby"
								onPress={handleAddBaby}
								color="#456B72"
							/>
							<Button
								title="Cancel"
								onPress={() => setIsModalVisible(false)}
								color="#d6d6d6"
							/>
						</View>
					</View>
				</View>
			</Modal>
		</ScrollView>
	);
};

export default MyBaby;

const styles = StyleSheet.create({
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalContent: {
		width: "80%",
		padding: 20,
		backgroundColor: "white",
		borderRadius: 10,
	},
	modalHeader: {
		marginBottom: 20,
		textAlign: "center",
	},
	input: {
		borderColor: "#d6d6d6",
		borderWidth: 1,
		marginBottom: 10,
		padding: 10,
		borderRadius: 8,
		backgroundColor: "#ebebeb",
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 10,
	},
	babyInfoContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
	},
	dropdown: {
		borderWidth: 1,
		borderColor: "#d6d6d6",
		backgroundColor: "#fff",
		borderRadius: 8,
		marginBottom: 10,
	},
	dropdownItem: {
		display: 'flex',
		justifyContent: 'space-between',
		flexDirection: 'row',
		padding: 10,
    width: "100%"
	},
});

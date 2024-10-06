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
import StyledButton from "../StyledButton";
import { db } from "@/db/firebaseConfig"; // Import Firestore config
import { collection, addDoc, getDocs, query, where } from "firebase/firestore"; // Import Firestore functions
import { useUser } from "@clerk/clerk-expo";
import Toast from "react-native-toast-message"; // Ensure you have this installed
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define the interface for Baby
interface Baby {
	firstName: string;
	lastName: string;
	birthday: Date;
}

interface SelectedBaby {
	id: string;
	firstName: string;
	lastName: string;
	birthday: Date;
}

const MyBaby = () => {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [birthday, setBirthday] = useState<Date | null>(null);
	const [babies, setBabies] = useState<SelectedBaby[]>([]);
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [date, setDate] = useState(new Date());
	const [selectedBaby, setSelectedBaby] = useState<SelectedBaby | null>(null);
	const [showDropdown, setShowDropdown] = useState(false);
	const { user } = useUser();

	// Load babies from Firestore when the component mounts
	const loadBabies = async () => {
		if (!user?.id) {
			console.log("User ID is not available.");
			return; // Early return if user ID is not present
		}

		try {
			const babiesQuery = query(
				collection(db, "babies"),
				where("parentId", "==", user.id)
			);
			const querySnapshot = await getDocs(babiesQuery);
			const babiesData = querySnapshot.docs.map((doc) => {
				const data = doc.data();
				return {
					id: doc.id,
					firstName: data.firstName,
					lastName: data.lastName,
					// Convert birthday from Firestore Timestamp to Date
					birthday:
						data.birthday instanceof Date
							? data.birthday
							: data.birthday.toDate(), // Assuming birthday is stored as a Firestore Timestamp
				} as SelectedBaby; // Cast to Baby type
			});

			setBabies(babiesData);
		} catch (error) {
			console.error("Error fetching babies from Firestore: ", error);
		}
	};

	useEffect(() => {
		loadBabies();
	}, [user]); // Add user as a dependency to refetch babies when the user changes

	// Function to add baby to Firestore
	const addBabyToFirestore = async (newBaby: Baby) => {
		try {
			// Add baby to Firestore
			const docRef = await addDoc(collection(db, "babies"), {
				parentId: user?.id,
				firstName: newBaby.firstName,
				lastName: newBaby.lastName,
				birthday: newBaby.birthday,
			});

			console.log("Baby added to Firestore!");
			loadBabies();
			// Generate the vaccination milestones for the baby
			await addMilestoneToFirestore(docRef.id, newBaby);

			Toast.show({
				type: "success",
				text1: "Success",
				text2: "Baby and milestones added successfully! 👶",
				position: "top",
			});
		} catch (error) {
			console.error("Error adding baby to Firestore: ", error);
			Toast.show({
				type: "error",
				text1: "Error",
				text2: "Failed to add baby! ❌",
				position: "top",
			});
		}
	};

	// Function to add vaccination milestones to Firestore
	const addMilestoneToFirestore = async (babyId: string, newBaby: Baby) => {
		const vaccineSchedule = [
			{ vaccine: "BCG", ageInMonths: 0, received: false },
			{
				vaccine: "Hepatitis B (1st dose)",
				ageInMonths: 0,
				received: false,
			},
			{
				vaccine: "Hepatitis B (2nd dose)",
				ageInMonths: 1,
				received: false,
			},
			{
				vaccine: "Pentavalent Vaccine (1st dose)",
				ageInMonths: 2,
				received: false,
			},
			{
				vaccine: "Oral Polio Vaccine (1st dose)",
				ageInMonths: 2,
				received: false,
			},
			{
				vaccine: "Pneumococcal Conjugate Vaccine (1st dose)",
				ageInMonths: 2,
				received: false,
			},
			{
				vaccine: "Pentavalent Vaccine (2nd dose)",
				ageInMonths: 4,
				received: false,
			},
			{
				vaccine: "Oral Polio Vaccine (2nd dose)",
				ageInMonths: 4,
				received: false,
			},
			{
				vaccine: "Pneumococcal Conjugate Vaccine (2nd dose)",
				ageInMonths: 4,
				received: false,
			},
			{
				vaccine: "Pentavalent Vaccine (3rd dose)",
				ageInMonths: 6,
				received: false,
			},
			{
				vaccine: "Oral Polio Vaccine (3rd dose)",
				ageInMonths: 6,
				received: false,
			},
			{
				vaccine: "Inactivated Polio Vaccine",
				ageInMonths: 6,
				received: false,
			},
			{
				vaccine: "Pneumococcal Conjugate Vaccine (3rd dose)",
				ageInMonths: 6,
				received: false,
			},
			{
				vaccine: "Measles-Rubella (1st dose)",
				ageInMonths: 9,
				received: false,
			},
			{
				vaccine: "Japanese Encephalitis (1st dose)",
				ageInMonths: 9,
				received: false,
			},
			{
				vaccine: "Measles-Rubella (2nd dose)",
				ageInMonths: 12,
				received: false,
			},
		];

		const babyBirthday = new Date(newBaby.birthday);

		// Calculate the expected date of each vaccination based on baby's birthday
		const milestones = vaccineSchedule.map((vaccine) => {
			const expectedDate = new Date(babyBirthday);
			expectedDate.setMonth(
				babyBirthday.getMonth() + vaccine.ageInMonths
			); // Handles month overflow

			return {
				vaccine: vaccine.vaccine,
				ageInMonths: vaccine.ageInMonths,
				expectedDate: expectedDate.toISOString(), // Store as a date string
				received: vaccine.received,
			};
		});

		try {
			await addDoc(collection(db, "milestones"), {
				babyId: babyId,
				parentId: user?.id,
				firstName: newBaby.firstName,
				lastName: newBaby.lastName,
				milestone: milestones,
			});
			console.log("Milestones added to Firestore!");
		} catch (error) {
			console.error("Error adding milestones to Firestore: ", error);
		}
	};

	// Handle adding a baby (only to Firestore)
	const handleAddBaby = () => {
		// Check if all fields are filled
		if (!firstName || !lastName || !birthday) {
			// Show an error toast if any field is empty
			Toast.show({
				type: "error",
				text1: "Missing Information",
				text2: "Please fill out all fields before adding a baby!",
				position: "top",
			});
			console.log("Failed to add baby in Firestore!");
			loadBabies();
			setIsModalVisible(false);
			return; // Stop the function here if any field is empty
		}

		const newBaby: Baby = { firstName, lastName, birthday }; // Use the Date object for birthday

		// Add baby to Firestore
		addBabyToFirestore(newBaby);

		// Reset form fields
		setFirstName("");
		setLastName("");
		setBirthday(null); // Reset birthday to null
		setIsModalVisible(false);
	};

	const handleDateChange = (event: any, selectedDate?: Date) => {
		const currentDate = selectedDate || date;
		setShowDatePicker(Platform.OS === "ios");
		setDate(currentDate);
		setBirthday(currentDate); // Store the Date object directly
	};

	const handleSelectBaby = async (baby: SelectedBaby) => {
		try {
			setSelectedBaby(baby);
			setShowDropdown(false); // Close dropdown after selection

			// Retrieve the currently saved baby ID from local storage
			const existingBabyId = await AsyncStorage.getItem("selectedBabyId");

			// Check if an ID already exists
			if (existingBabyId) {
				console.log(
					`Existing baby ID found: ${existingBabyId}. Replacing it with new ID: ${baby.id}`
				);
			} else {
				console.log(
					`No existing baby ID found. Saving new ID: ${baby.id}`
				);
			}

			// Save the selected baby's ID to local storage, replacing any existing ID
			await AsyncStorage.setItem("selectedBabyId", baby.id);

			console.log(`Saved selected baby ID: ${baby.id}`);
		} catch (error) {
			console.error(
				"Error saving selected baby ID to local storage: ",
				error
			);
		}
	};

	// Corrected the babyInfo function to return JSX
	const babyInfo = (baby: Baby) => {
		return (
			<View style={styles.babyInfoContainer}>
				<ThemedText type="default">
					{baby.firstName} {baby.lastName}
				</ThemedText>
				<ThemedText type="default">
					{baby.birthday.toLocaleDateString("en-US")}
				</ThemedText>
			</View>
		);
	};

	return (
		<ScrollView>
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
							{selectedBaby ? (
								babyInfo(selectedBaby) // Display the selected baby's info
							) : (
								<ThemedText
									type="default"
									className="font-bold"
								>
									Choose Baby
								</ThemedText>
							)}
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
										{baby.birthday.toLocaleDateString(
											"en-US"
										)}
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
						Please add a baby to use all features of the
						application.
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

						<TouchableOpacity
							onPress={() => setShowDatePicker(true)}
							style={styles.input}
						>
							<ThemedText type="default">
								{birthday
									? birthday.toLocaleDateString("en-US")
									: "Select Birthday"}
							</ThemedText>
						</TouchableOpacity>

						{showDatePicker && (
							<DateTimePicker
								value={date}
								mode="date"
								display="default"
								onChange={handleDateChange}
							/>
						)}

						<View style={styles.buttonContainer}>
							<StyledButton
								title="Submit"
								onPress={handleAddBaby}
								customWeight="500"
								fontSize={12}
								borderRadius={5}
							/>
							<StyledButton
								title="Cancel"
								onPress={() => setIsModalVisible(false)}
								bgColor="#d6d6d6"
								customWeight="500"
								fontSize={12}
								borderRadius={5}
								textColor="#456B72"
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
		display: "flex",
		justifyContent: "space-between",
		flexDirection: "row",
		padding: 10,
		width: "100%",
	},
});

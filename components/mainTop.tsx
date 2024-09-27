import { mainTop } from "@/assets";
import React from "react";
import { View, Image, StyleSheet } from "react-native";

const CustomHeader = () => {
	return (
		<View style={styles.header}>
			<Image
				source={mainTop} // Replace with your image path
				alt="header image"
				style={styles.image}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	header: {
		height: 100, // Adjust height as needed
		justifyContent: "center",
		alignItems: "center",
	},
	image: {
		width: "100%",
		height: "100%",
		resizeMode: "cover", // or 'contain' based on your design
	},
});

export default CustomHeader;

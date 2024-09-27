import { View, Text, Pressable, StyleSheet } from "react-native";
import React from "react";

type ButtonProps = {
	title: string;
	onPress: () => void;
	style?: object;
	bgColor?: string; 
	width?: string;
	textColor?: string;
	borderRadius?: number;
};

const StyledButton: React.FC<ButtonProps> = ({
	title,
	onPress,
	style,
	bgColor = "#456B72", 
	textColor = "#fff",
	width = '',
	borderRadius = 20
}) => {
	return (
		<Pressable
			onPress={onPress}
			style={[styles.button, { backgroundColor: bgColor, width: width, borderRadius: borderRadius }, style]}
		>
			<Text style={[styles.text, { color: textColor }]}>{title}</Text>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	button: {
		fontWeight: 'bold',
		paddingVertical: 10,
		paddingHorizontal: 20,
		alignItems: "center",
		borderColor: '#456B72',
		borderWidth: 1
	},
	text: {},
});

export default StyledButton;

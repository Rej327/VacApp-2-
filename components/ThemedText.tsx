import { Text, type TextProps, StyleSheet } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTextProps = TextProps & {
	type?:
		| "default"
		| "title"
		| "cardHeader"
		| "subtitle"
		| "link"
		| "close"
		| "header"
		| "cardTitle"
		| "navigation";
};

export function ThemedText({
	style,
	type = "default",
	...rest
}: ThemedTextProps) {
	return (
		<Text
			style={[
				type === "default" ? styles.default : undefined,
				type === "title" ? styles.title : undefined,
				type === "cardHeader" ? styles.cardHeader : undefined,
				type === "subtitle" ? styles.subtitle : undefined,
				type === "link" ? styles.link : undefined,
				type === "close" ? styles.close : undefined,
				type === "header" ? styles.header : undefined,
				type === "cardTitle" ? styles.cardTitle : undefined,
				type === "navigation" ? styles.navigation : undefined,
				style,
			]}
			{...rest}
		/>
	);
}

const styles = StyleSheet.create({
	default: {
		fontSize: 14
		,
		lineHeight: 24,
		fontFamily: "Roboto",
	},
	cardHeader: {
		fontSize: 16,
		lineHeight: 24,
		fontWeight: "bold",
		color: "#2B2B2B",
		fontFamily: "RobotoBold",
	},
	title: {
		fontSize: 26,
		fontWeight: "bold",
		lineHeight: 32,
		color: "#456B72",
	},
	subtitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#456B72",
	},
	link: {
		fontSize: 14,
		color: "#456B72",
		fontStyle: "italic",
	},
	close: {
		lineHeight: 30,
		fontSize: 14,
		color: "#456B72",
	},
	header: {
		textAlign: "left",
		lineHeight: 30,
		fontSize: 18,
		letterSpacing: 1,
		fontWeight: "500",
		color: "#111d1f",
		marginVertical: 5,
	},
	cardTitle: {
		textAlign: "left",
		lineHeight: 30,
		fontSize: 15,
		// fontWeight: "bold",
		color: "#2B2B2B",
		marginVertical: 5,
		fontFamily: "Oswald",
	},
	navigation: {
		textAlign: "left",
		fontSize: 18,
		fontWeight: "500",
		color: "#373938",
	},
});

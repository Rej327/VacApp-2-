import { Text, type TextProps, StyleSheet } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTextProps = TextProps & {
	type?:
		| "default"
		| "title"
		| "defaultSemiBold"
		| "subtitle"
		| "link"
		| "close"
		| "header"
		| "cardTitle";
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
				type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
				type === "subtitle" ? styles.subtitle : undefined,
				type === "link" ? styles.link : undefined,
				type === "close" ? styles.close : undefined,
				type === "header" ? styles.header : undefined,
				type === "cardTitle" ? styles.cardTitle : undefined,
				style,
			]}
			{...rest}
		/>
	);
}

const styles = StyleSheet.create({
	default: {
		fontSize: 16,
		lineHeight: 24,
	},
	defaultSemiBold: {
		fontSize: 16,
		lineHeight: 24,
		fontWeight: "600",
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
		lineHeight: 30,
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
		fontWeight: "600",
		color: "#2B2B2B",
		marginVertical: 5,
		fontFamily: "Oswald",
	},
});

import { View, Text, Pressable, StyleSheet } from "react-native";
import React from "react";

type ButtonProps = {
  title: string;
  onPress: () => void;
  style?: object;
  bgColor?: string; 
  width?: string;
  textColor?: string;
  fontSize?: number;
  borderRadius?: number;
  customWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900'; 
};

const StyledButton: React.FC<ButtonProps> = ({
  title,
  onPress,
  style,
  bgColor = "#456B72", 
  textColor = "#fff",
  customWeight = '700',
  width = '',
  fontSize = 17,
  borderRadius = 20
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, { backgroundColor: bgColor, width: width, borderRadius: borderRadius }, style]}
    >
      <Text style={[styles.text, { color: textColor, fontSize: fontSize, fontWeight: customWeight }]}>{title}</Text>
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

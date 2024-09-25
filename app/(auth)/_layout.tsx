import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Alert, Pressable } from "react-native";
import { useAuth } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";

interface UserData {
  email: string;
  id: string;
  firstName: string;
  lastName: string;
}

export const LogoutButton = () => {
  const [storedUserData, setStoredUserData] = useState<UserData | null>(null);
  const { signOut } = useAuth();

  const clearUserData = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      setStoredUserData(null);
    } catch (error) {
      console.error('Failed to clear user data from local storage:', error);
    }
  };

  const doLogout = async () => {
    try {
      clearUserData()
      signOut();
    } catch (error) {
      console.error("Failed to clear local storage during logout:", error);
    }
  };

  return (
    <Pressable onPress={doLogout} style={{ marginRight: 10 }}>
      <Ionicons name="log-out-outline" size={24} color={"#fff"} />
    </Pressable>
  );
};

const TabsPage = () => {
  const { isSignedIn } = useAuth();

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: "#6c47ff",
        },
        headerTintColor: "#fff",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerTitle: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
          tabBarLabel: "Home",
        }}
        redirect={!isSignedIn}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerTitle: "My Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
          tabBarLabel: "My Profile",
          headerRight: () => <LogoutButton />,
        }}
        redirect={!isSignedIn}
      />
    </Tabs>
  );
};

export default TabsPage;

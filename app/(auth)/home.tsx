import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '@clerk/clerk-expo';

interface UserData {
  email: string;
  id: string;
  firstName: string;
  lastName: string;
}

const Home = () => {
  const { user } = useUser();
  const [storedUserData, setStoredUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const saveUserDataToLocalStorage = async () => {
      if (user) {
        try {
          const userData: UserData = {
            email: user.emailAddresses?.[0]?.emailAddress || '', // Default to empty string if undefined
            id: user.id,
            firstName: user.firstName || '', // Default to empty string if undefined
            lastName: user.lastName || '', // Default to empty string if undefined
          };

          // Save user information to local storage
          await AsyncStorage.setItem('userData', JSON.stringify(userData));
        } catch (error) {
          console.error('Failed to save user data to local storage:', error);
        }
      }
    };

    const retrieveUserDataFromLocalStorage = async () => {
      try {
        const retrievedData = await AsyncStorage.getItem('userData');
        if (retrievedData !== null) {
          setStoredUserData(JSON.parse(retrievedData) as UserData);
        }
      } catch (error) {
        console.error('Failed to retrieve user data from local storage:', error);
      }
    };

    saveUserDataToLocalStorage();
    retrieveUserDataFromLocalStorage();
  }, [user]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {storedUserData ? (
        <>
          <Text>Welcome, {storedUserData.email} 🎉</Text>
          <Text>ID: {storedUserData.id}</Text>
          <Text>First Name: {storedUserData.firstName}</Text>
          <Text>Last Name: {storedUserData.lastName}</Text>
        </>
      ) : (
        <Text>Loading user data...</Text>
      )}
    </View>
  );
};

export default Home;

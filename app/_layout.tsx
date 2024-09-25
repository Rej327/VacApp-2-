import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

const CLERK_PUBLISHABLE_KEY = 'pk_test_YWRhcHRlZC1vc3ByZXktMjAuY2xlcmsuYWNjb3VudHMuZGV2JA';

const InitialLayout = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const checkUserData = async () => {
      const userData = await SecureStore.getItemAsync('userData'); 
      return userData !== null;
    };

    const redirectUser = async () => {
      if (!isLoaded) return;

      const hasUserData = await checkUserData();
      const inTabsGroup = segments[0] === '(auth)';

      console.log('User changed: ', isSignedIn);

      if (hasUserData) {
        router.replace('/home');
      } else if (isSignedIn && !inTabsGroup) {
        router.replace('/home');
      } else if (!isSignedIn) {
        router.replace('/login');
      }
    };

    redirectUser();
  }, [isSignedIn, isLoaded]);

  return <Slot />;
};

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

const RootLayout = () => {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
      <InitialLayout />
    </ClerkProvider>
  );
};

export default RootLayout;

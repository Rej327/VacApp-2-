import { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";
import { useRouter, Slot, usePathname } from "expo-router"; // Import useRouter

const RootLayout = () => {
  const [isOffline, setIsOffline] = useState(false);
  const router = useRouter(); // Initialize router
  const path = usePathname(); // Get the current path

  useEffect(() => {
    const checkNetworkStatus = async () => {
      try {
        const netInfoState = await NetInfo.fetch();
        const isConnected = netInfoState.isConnected;

        setIsOffline(!isConnected);

        console.log("My Path", path);

        // Use router.replace based on network status
        if (isConnected) {
          router.replace("/online");
        } else {
          router.replace("/offline");
        }
      } catch (error) {
        console.error("Error checking network status:", error); // Handle any errors
      }
    };

    // Initial check
    checkNetworkStatus();

    // Subscribe to network changes
    const unsubscribe = NetInfo.addEventListener((state) => {
      try {
        const isConnected = state.isConnected;
        setIsOffline(!isConnected);

        if (isConnected) {
          router.replace("/online");
        } else {
          router.replace("/offline");
        }
      } catch (error) {
        console.error("Error in network event listener:", error); // Handle any errors
      }
    });

    // Clean up network listener on unmount
    return () => unsubscribe();
  }, [isOffline]); // Add 'path' to dependencies

  return <Slot />; // Slot will render the appropriate layout from online or offline folders
};

export default RootLayout;

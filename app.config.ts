import 'dotenv/config'; // This will load the .env file

export default {
  expo: {
    name: "VacApp",
    slug: "VacApp",
    icon: "./assets/icon/babyIcon.png", // Add your icon path here
    // Other Expo config
    extra: {
      clerkPublishableKey: process.env.EXPO_CLERK_PUBLISHABLE_KEY,
    },
  },
};

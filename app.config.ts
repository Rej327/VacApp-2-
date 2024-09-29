import 'dotenv/config'; // This will load the .env file

export default {
  expo: {
    name: "VacApp",
    slug: "VacApp",
    // Other Expo config
    extra: {
      clerkPublishableKey: process.env.EXPO_CLERK_PUBLISHABLE_KEY,
    },
  },
};

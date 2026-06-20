import { Redirect } from "expo-router";

// TEMP: auth disabled — land straight on the home feed as a guest.
// To re-enable auth, change the href to "/(onboarding)" and restore the
// session check in _layout.tsx.
export default function Index() {
  return <Redirect href="/(tabs)" />;
}

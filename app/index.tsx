import { Redirect } from "expo-router";

// Open straight on the home feed. (To re-enable first-run onboarding, redirect to
// "/(onboarding)/slides" for new users — see git history for the flag-based version.)
export default function Index() {
  return <Redirect href="/(tabs)" />;
}

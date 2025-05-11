import "~/global.css";
import { Stack, usePathname } from "expo-router";
import {View} from "react-native"
import BottomNavigator from "../navigation/BottomNavigator";
import { WorkoutProvider } from '../contexts/WorkoutContext';

export default function RootLayout() {
  const pathname = usePathname();

  // Hide Bottom Navigator on specific screens
  const shouldHideBottomNav = pathname.startsWith("/workout/") || pathname.startsWith("/exercise/"); // Hide on dynamic workout pages

  return (
    <WorkoutProvider>
    <>
      {/* Stack Navigator */}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ title: "Home" }} />
        <Stack.Screen name="(tabs)/routines" />
        <Stack.Screen name="(tabs)/library" />
        <Stack.Screen name="(tabs)/workout" />
        <Stack.Screen name="(tabs)/dietplan" />
        <Stack.Screen name="(tabs)/account" />
        <Stack.Screen name="workout/[id]" />
        <Stack.Screen name="exercise/[id]"/>
      </Stack>

      {/* Show Bottom Navigator only on main screens */}
        {!shouldHideBottomNav && <BottomNavigator />}
    </>
    </WorkoutProvider>
  );
}

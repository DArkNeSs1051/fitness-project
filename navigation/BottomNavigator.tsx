import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";

const BottomNavigator: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname(); // Get current active route

  // Function to handle tab press
  const handleTabPress = (tabName: string) => {
    router.push(`/${tabName.toLowerCase()}`); // Navigate to tab
  };

  // Tabs data
  const tabs = [
    { name: "Routines", icon: "calendar" },
    { name: "Library", icon: "body" },
    { name: "Workout", icon: "barbell" },
    { name: "DietPlan", icon: "nutrition" },
    { name: "Account", icon: "person" },
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 0 }} // Important: flex: 0, so it doesn't occupy full screen
    >
      <SafeAreaView className="bg-[#84BDEA] items-center pb-4">
        <View style={styles.container}>
          {tabs.map((tab, index) => {
            const isActive = pathname === `/${tab.name.toLowerCase()}`; // Check if tab is active
            const isFirst = index === 0; // First tab (Routines)
            const isLast = index === tabs.length - 1; // Last tab (Account)

            return (
              <TouchableOpacity
                key={tab.name}
                className={`flex-1 items-center py-3 ${isActive
                    ? isFirst
                      ? "bg-[#5FA3D6] rounded-l-xl" // Only round left for Routines
                      : isLast
                        ? "bg-[#5FA3D6] rounded-r-xl" // Only round right for Account
                        : "bg-[#5FA3D6]" // Middle tabs have no rounded edges
                    : ""
                  }`}
                onPress={() => handleTabPress(tab.name)}
              >
                <Ionicons
                  name={tab.icon}
                  size={24}
                  color={isActive ? "#42779F" : "white"}
                />
                <Text className={`text-xs mt-1 ${isActive ? "text-[#42779F]" : "text-white"}`}>
                  {tab.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 5,
    marginVertical: 5,
    flexDirection: "row",
    backgroundColor: "#42779F",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    width: 350,
  },
});

export default BottomNavigator;

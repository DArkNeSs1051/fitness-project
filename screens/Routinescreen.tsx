import React, { useState, useMemo } from "react";
import {
  View, Text, TouchableOpacity, LayoutAnimation,
  UIManager, Platform, Dimensions
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HorizontalCalendar from "../components/HorizontalCalendar/HorizontalCalendar";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { Calendar } from "react-native-calendars";
import { GestureHandlerRootView, PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useSharedValue, useAnimatedStyle, useAnimatedGestureHandler,
  withTiming, runOnJS
} from "react-native-reanimated";

const { height } = Dimensions.get("window");

// Item height for calculations
const ITEM_HEIGHT = 45;

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const RoutineScreen = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [showFullCalendar, setShowFullCalendar] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draggingId, setDraggingId] = useState(null);

  const workoutDays = {
    "2025-03-05": { marked: true, dotColor: "#42779F" },
    "2025-03-07": { marked: true, dotColor: "#42779F" },
    "2025-03-09": { marked: true, dotColor: "#42779F" },
  };

  const [workouts, setWorkouts] = useState({
    "2025-03-05": [
      { id: "1", exercise: "Push-up", target: "Chest", reps: 10, sets: 4, rest: "1:30" },
      { id: "2", exercise: "Dumbbell Bench Press", target: "Chest", reps: 8, sets: 4, rest: "1:30" },
    ],
    "2025-03-07": [
      { id: "3", exercise: "Squat", target: "Legs", reps: 12, sets: 4, rest: "1:00" },
    ],
    "2025-03-09": [
      { id: "4", exercise: "Pull-up", target: "Back", reps: 8, sets: 3, rest: "1:30" },
    ],
  });

  const currentWorkoutList = useMemo(() => workouts[selectedDate] || [], [selectedDate, workouts]);

  // Function to handle reordering
  const reorderItems = (fromIndex, toPosition) => {
    if (!currentWorkoutList.length) return;
    
    const currentList = [...currentWorkoutList];
    
    if (fromIndex < 0) return;
    
    // Calculate the target index based on position
    const toIndex = Math.max(0, Math.min(Math.floor(toPosition / ITEM_HEIGHT), currentList.length - 1));
    
    if (fromIndex === toIndex) return;
    
    // Move the item
    const item = currentList.splice(fromIndex, 1)[0];
    currentList.splice(toIndex, 0, item);
    
    // Update workouts state with the new order
    setWorkouts(prev => ({
      ...prev,
      [selectedDate]: currentList
    }));
    
    // Apply layout animation for smooth transitions
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  // Render a draggable item
  const DraggableItem = ({ item, index }) => {
    const translateY = useSharedValue(0);
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);
    const zIndex = useSharedValue(1);
    
    const pan = useAnimatedGestureHandler({
      onStart: (_, ctx) => {
        ctx.startY = translateY.value;
        runOnJS(setDraggingId)(item.id);
        scale.value = withTiming(1.05);
        opacity.value = withTiming(0.8);
        zIndex.value = 10;
      },
      onActive: (event, ctx) => {
        translateY.value = ctx.startY + event.translationY;
      },
      onEnd: () => {
        // Calculate final position and update the list order
        const finalPosition = index * ITEM_HEIGHT + translateY.value;
        runOnJS(reorderItems)(index, finalPosition);
        
        // Reset animation values
        translateY.value = withTiming(0);
        scale.value = withTiming(1);
        opacity.value = withTiming(1);
        zIndex.value = 1;
        runOnJS(setDraggingId)(null);
      },
    });

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [
          { translateY: translateY.value },
          { scale: scale.value }
        ],
        opacity: opacity.value,
        zIndex: zIndex.value,
      };
    });

    return (
      <PanGestureHandler enabled={isEditing} onGestureEvent={pan}>
        <Animated.View style={[animatedStyle]} className="flex-row items-center pt-2">
          {isEditing && (
            <Ionicons
              name="menu-outline"
              size={20}
              color="white"
              style={{ marginRight: 8 }}
            />
          )}
          <Text className="text-white flex-1">{item.exercise}</Text>
          <Text className="text-white flex-1">{item.target}</Text>
          <Text className="text-white flex-[0.6] text-center">{item.reps}</Text>
          <Text className="text-white flex-[0.6] text-center">{item.sets}</Text>
          <Text className="text-white flex-[0.6] text-center">{item.rest}</Text>
          {isEditing && (
            <View className="w-12 flex-row ml-2">
              <TouchableOpacity className="mr-2">
                <Ionicons name="pencil" size={20} color="#84BDEA" />
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons name="trash" size={20} color="#E63946" />
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </PanGestureHandler>
    );
  };

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaView className="flex-1 bg-[#84BDEA]">
        <View className="p-4 flex-row justify-between items-center">
          <Text className="text-3xl font-bold text-[#142939]">Routine</Text>
          <TouchableOpacity onPress={() => setShowFullCalendar(!showFullCalendar)}>
            <Ionicons name="calendar" size={28} color="#142939" />
          </TouchableOpacity>
        </View>

        <View className="relative mx-4">
          {showFullCalendar && (
            <View className="absolute z-10 w-full bg-white shadow-lg rounded-lg p-2" style={{ top: 50 }}>
              <Calendar
                markedDates={workoutDays}
                onDayPress={(day) => {
                  setSelectedDate(day.dateString);
                  setShowFullCalendar(false);
                }}
              />
            </View>
          )}
          <HorizontalCalendar
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            workoutDays={workoutDays}
          />
        </View>

        <View className="mx-4 mt-4 bg-[#42779F] rounded-lg p-4 shadow-md">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-white text-xl font-bold">Workout</Text>
            <TouchableOpacity className="flex-row items-center" onPress={() => setIsEditing(!isEditing)}>
              <Ionicons name="create-outline" size={20} color="white" />
              <Text className="text-white ml-1">{isEditing ? "Done" : "Edit"}</Text>
            </TouchableOpacity>
          </View>

          {currentWorkoutList.length > 0 ? (
            <View className="bg-[#315D80] rounded-lg p-3">
              <View className="flex-row items-center pb-2 border-b border-gray-400">
                {isEditing && <View style={{ width: 20 }} />}
                <Text className="text-white font-bold flex-1">Exercise</Text>
                <Text className="text-white font-bold flex-1">Target</Text>
                <Text className="text-white font-bold flex-[0.6] text-center">Rep</Text>
                <Text className="text-white font-bold flex-[0.6] text-center">Set</Text>
                <Text className="text-white font-bold flex-[0.6] text-center">Rest</Text>
                {isEditing && <View style={{ width: 50 }} />}
              </View>

              {currentWorkoutList.map((item, index) => (
                <DraggableItem key={item.id} item={item} index={index} />
              ))}
            </View>
          ) : (
            <Text className="text-white text-center mt-3">No workout scheduled</Text>
          )}

          {isEditing && (
            <TouchableOpacity className="mt-4 bg-[#84BDEA] rounded-lg p-3 flex-row justify-center items-center">
              <Ionicons name="add-circle-outline" size={24} color="white" />
              <Text className="text-white ml-2 text-lg font-bold">Add Exercise</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default RoutineScreen;
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
} from "react-native";
import Modal from "react-native-modal";

const { height } = Dimensions.get("window");

export interface Exercise {
  id: string;
  exercise: string;
  target: string;
  reps: number;
  sets: number;
  rest: string;
}

interface AddExerciseModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectExercise: (exercise: Exercise) => void;
  availableExercises?: Exercise[]; // Optional prop to allow dynamic data
}

const defaultExercises: Exercise[] = [
  { id: "e1", exercise: "Plank", target: "Core", reps: 30, sets: 3, rest: "0:30" },
  { id: "e2", exercise: "Burpee", target: "Full Body", reps: 15, sets: 3, rest: "1:00" },
  { id: "e3", exercise: "Dumbbell Row", target: "Back", reps: 10, sets: 4, rest: "1:30" },
];

const AddExerciseModal: React.FC<AddExerciseModalProps> = ({
  isVisible,
  onClose,
  onSelectExercise,
  availableExercises = defaultExercises,
}) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={styles.modalContainer}
    >
      <View style={styles.modalContent}>
        <Text style={styles.title}>Select an Exercise</Text>
        <FlatList
          data={availableExercises}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.exerciseItem}
              onPress={() => onSelectExercise(item)}
            >
              <Text style={styles.exerciseName}>{item.exercise}</Text>
              <Text style={styles.exerciseDetails}>
                {item.target} | {item.reps} reps · {item.sets} sets · {item.rest} rest
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.6,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#000",
  },
  exerciseItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  exerciseDetails: {
    fontSize: 14,
    color: "#555",
  },
});

export default AddExerciseModal;

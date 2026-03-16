import { View, Text } from "react-native";
import { useTimer } from "../features/timer/context/TimerContext";
import { formatTime } from "@/features/timer/utils/formatTime";
import BaseButton from "@/ui/Buttons/BaseButton";
import { SafeAreaView } from 'react-native-safe-area-context';


export default function HomeScreen() {
  const { state, startTimer, pauseTimer, resetTimer } = useTimer();

  return (
    <SafeAreaView>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
          gap: 12,
        }}
      >
        <Text>Timer app is running</Text>
        <Text>Mode: {state.mode}</Text>
        <Text>Running: {state.isRunning ? "Yes" : "No"}</Text>
        <Text>Custom Minutes: {state.customMinutes}</Text>
        <Text>Time Left: {formatTime(state.timeLeft)}</Text>

        <View style={{ width: "30%", gap: 10, marginTop: 12 }}>
          <BaseButton onPress={startTimer}>Start</BaseButton>
          <BaseButton onPress={pauseTimer}>Pause</BaseButton>
          <BaseButton onPress={resetTimer}>Reset</BaseButton>
        </View>
      </View>
    </SafeAreaView>
  );
}
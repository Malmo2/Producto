import { formatTime } from "@/features/timer/utils/formatTime";
import BaseButton from "@/ui/Buttons/BaseButton";
import { Text, View } from "react-native";
import TimerDisplay from '../features/timer/components/TimerDisplay';
import { useTimer } from "../features/timer/context/TimerContext";


export default function HomeScreen() {
  const { state, startTimer, pauseTimer, resetTimer } = useTimer();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        gap: 12,
      }}
    >

      <TimerDisplay
        timeLeft={state.timeLeft}
        isRunning={state.isRunning}
        totalTime={(Number(state.customMinutes) || 0) * 60}
      />


      <Text>Timer app is running</Text>
      <Text>Mode: {state.mode}</Text>
      <Text>Running: {state.isRunning ? "Yes" : "No"}</Text>
      <Text>Custom Minutes: {state.customMinutes}</Text>
      <Text>Time Left: {formatTime(state.timeLeft)}</Text>

      <View style={{ width: "30%", gap: 10, marginTop: 12 }}>
        <BaseButton title="Start" onPress={startTimer}>Start</BaseButton>
        <BaseButton title="Pause" onPress={pauseTimer}>Pause</BaseButton>
        <BaseButton title="Reset" onPress={resetTimer}>Reset</BaseButton>
      </View>
    </View>
  );
}
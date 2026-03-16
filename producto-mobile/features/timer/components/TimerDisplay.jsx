import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { formatTime } from '../utils/formatTime';

export default function TimerDisplay({ timeLeft, totalTime, isRunning }) {
    const radius = 70;
    const circumference = 2 * Math.PI * radius;

    const percentage = totalTime > 0 ? timeLeft / totalTime : 0;
    const offset = circumference - percentage * circumference;

    return (
        <View style={styles.container}>
            <Svg width={160} height={160} viewBox="0 0 160 160">
                {/* Background ring */}
                <Circle
                    cx="80"
                    cy="80"
                    r={radius}
                    stroke="#d9d9d9"
                    strokeWidth={10}
                    fill="none"
                />

                {/* Progress ring */}
                <Circle
                    cx="80"
                    cy="80"
                    r={radius}
                    stroke="#4A90E2"
                    strokeWidth={10}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={isNaN(offset) ? 0 : offset}
                    strokeLinecap="round"
                    rotation="-90"
                    origin="80, 80"
                />
            </Svg>

            <View style={styles.textOverlay}>
                <Text style={styles.timeText}>{formatTime(timeLeft)}</Text>
                <Text style={styles.statusText}>
                    {isRunning ? 'FOCUSING' : 'PAUSED'}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 160,
        height: 160,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    textOverlay: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    timeText: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    statusText: {
        marginTop: 6,
        fontSize: 14,
        letterSpacing: 1,
    },
});
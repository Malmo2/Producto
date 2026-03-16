import React, { ReactNode } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';


type ButtonProps = {
    title?: string;
    onPress: () => void;
    children?: ReactNode;
};

export default function BaseButton({ title, onPress, children }: ButtonProps) {
    return (
        <Pressable style={styles.button} onPress={onPress}>
            <Text>{title}</Text>
            <Text style={styles.text}>{children}</Text>
        </Pressable>
    );
}
const styles = StyleSheet.create({
    button: {
        backgroundColor: "black",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: "center",
    },
    text: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
});
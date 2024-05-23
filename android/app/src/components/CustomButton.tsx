/* eslint-disable prettier/prettier */
// CustomButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

type CustomButtonProps = {
    title: string;
    onPress: () => void;
    backgroundColor: string;
    marginBottom?: number;
    paddingHorizontal?: number;
    paddingVertical?: number;
};

const CustomButton: React.FC<CustomButtonProps> = ({
    title,
    onPress,
    backgroundColor,
    marginBottom = 16,
    paddingHorizontal = 50,
    paddingVertical = 12,
}) => {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                { backgroundColor, marginBottom, paddingHorizontal, paddingVertical },
            ]}
            onPress={onPress}
        >
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 8,
        marginTop: 16,
    },
    buttonText: {
        color: '#000000',
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
    },
});

export default CustomButton;


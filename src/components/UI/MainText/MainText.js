import React from 'react';
import { Text, StyleSheet } from 'react-native';

const mainText = props => (
    <Text style={styles.mainText}>{props.children}</Text>
);

const styles = StyleSheet.create({
    mainText: {
        color: "white",
        backgroundColor: "purple",
        padding: 18,
        margin: 15
    }
});

export default mainText;
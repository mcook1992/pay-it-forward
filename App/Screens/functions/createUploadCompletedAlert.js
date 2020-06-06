import React, { useState } from "react";
import { View, StyleSheet, Button, Alert } from "react-native";

export default function createUploadCompletedAlert(
  navigationFunction1,
  navigationFunction2
) {
  Alert.alert(
    "Message Sent!",
    "Thanks for sharing the love!",
    [
      {
        text: "Go to home page",
        onPress: () => navigationFunction1(),
      },
      {
        text: "Send another message",
        onPress: () => navigationFunction2(),
      },
    ],
    { cancelable: false }
  );
}

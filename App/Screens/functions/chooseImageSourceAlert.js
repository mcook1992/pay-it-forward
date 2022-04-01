import React, { useState } from "react";
import { View, StyleSheet, Button, Alert } from "react-native";

export default function createUploadCompletedAlert(
  photoFunction1,
  photoFunction2
) {
  Alert.alert(
    "Message Sent!",
    "Thanks for sharing the love!",
    [
      {
        text: "Add picture from phone",
        onPress: () => photoFunction1(),
      },
      {
        text: "Add picture from program",
        onPress: () => photoFunction2(),
      },
      {
          text: "Cancel"
      }
    ],
    { cancelable: true }
  );
}

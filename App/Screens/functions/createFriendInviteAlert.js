import React, { useState } from "react";
import { View, StyleSheet, Button, Alert } from "react-native";
import * as SMS from "expo-sms";
import createUploadCompletedAlert from "./createUploadCompletedAlert";

export default async function createFriendInviteAlert(
  filteredPhoneNumber,
  navigatinFunction1,
  navigationFunction2
) {
  const isAvailable = await SMS.isAvailableAsync();
  if (isAvailable) {
    Alert.alert(
      "Invite a friend",
      "Thanks for writing this compliment. The number you sent doesn't currently have an account. Would you like to invite them to see your message?",
      [
        {
          text: "Invite friends",
          onPress: async () => {
            const { result } = await SMS.sendSMSAsync(
              [filteredPhoneNumber],
              "Hi there! I sent you a compliment on the ShareTheLove app. You can read it by downloading the free app."
            );

            if (result == "sent" || "unknown") {
              createUploadCompletedAlert(
                navigatinFunction1,
                navigationFunction2
              );
            } else {
              Alert.alert(
                "Error",
                "We're sorry. There was an error sending your message. Pleae check your network connection and try again",
                [
                  {
                    text: "Return to home page",
                    onPress: () => navigationFunction1(),
                  },
                  {
                    text: "Send another message",
                    onPress: () => navigationFunction2(),
                  },
                ],
                { cancelable: true }
              );
            }
          },
        },
        {
          text: "No thanks",
          onPress: () => navigationFunction2(),
        },
      ],
      { cancelable: false }
    );
    // do your SMS stuff here
  } else {
    Alert.alert(
      "Error",
      "We're sorry, but for some reason texting does not work with this device. Feel free to reach out to our help center or try again later"
    );
  }
}

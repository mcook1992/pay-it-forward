import React, { useState } from "react";

import { FlatList, Text, View, Button, TextInput, Picker } from "react-native";
import { f, database, auth, storage } from "./config/config";

export default function reportMessage(props) {
  const [selectedValue, setSelectedValue] = useState("Offensive language");
  const [additionalReason, setAdditionalReason] = useState(
    "No additional reason given"
  );

  //   const styles = StyleSheet.create({
  //     container: {
  //       flex: 1,
  //       paddingTop: 40,
  //       alignItems: "center",
  //     },
  //   });

  return (
    <View style={{ flex: 1 }}>
      <Text>Tell us a little more about what was wrong wit this message</Text>
      <Picker
        selectedValue={selectedValue}
        style={{ height: 50, width: 150, padding: 50 }}
        onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
      >
        <Picker.Item label="Offensive language" value="Offensive language" />
        <Picker.Item label="Unknown sender" value="Unknown sender" />
        <Picker.Item label="Unreadable message" value="Unreadable messag" />
        <Picker.Item label="Other" value="Other" />
      </Picker>
      <View style={{ margin: 20 }}>
        <Text>Add any additional information</Text>
        <TextInput
          value={additionalReason}
          style={{ height: 30, width: 50 }}
          onChangeText={(text) => {
            setAdditionalReason(text);
          }}
        ></TextInput>
      </View>
      <Button
        title="Report Message"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
        onPress={() => {
          var that = this;
          f.database()
            .ref("Messages/" + props.route.params.id)
            .update({ flagged: true, flaggedReason: additionalReason })
            .then(function (snapshot) {
              //   console.log(snapshot.val());
              props.navigation.navigate("Feed");
            });
        }}
      />
    </View>
  );
}

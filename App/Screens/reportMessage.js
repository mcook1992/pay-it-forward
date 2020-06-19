import React, { useState } from "react";

import { FlatList, Text, View, Button, TextInput, Picker } from "react-native";
import { f, database, auth, storage } from "./config/config";

export default function reportMessage(props) {
  const [selectedValue, setSelectedValue] = useState("Offensive language");
  const [additionalReason, setAdditionalReason] = useState(null);

  //   const styles = StyleSheet.create({
  //     container: {
  //       flex: 1,
  //       paddingTop: 40,
  //       alignItems: "center",
  //     },
  //   });

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <View
        style={{
          padding: 20,

          borderRadius: 10,
          borderColor: "blue",
        }}
      >
        <Text>
          Tell us a little more about what was wrong with this message
        </Text>

        <Picker
          selectedValue={selectedValue}
          style={{ width: 300 }}
          onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
        >
          <Picker.Item label="Offensive language" value="Offensive language" />
          <Picker.Item label="Unknown sender" value="Unknown sender" />
          <Picker.Item label="Unreadable message" value="Unreadable messag" />
          <Picker.Item label="Other" value="Other" />
        </Picker>
      </View>
      <View
        style={{
          borderRadius: 10,
          borderColor: "blue",
          padding: 20,
        }}
      >
        <Text>Add any additional information we should know?</Text>
        <TextInput
          value={additionalReason}
          placeholder="Enter any additional info here"
          style={{ height: 100, width: 200, padding: 20 }}
          onChangeText={(text) => {
            setAdditionalReason(text);
          }}
        ></TextInput>
      </View>
      <View style={{ height: 50, borderRadius: 10, borderColor: "blue" }}>
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
        <Button
          title="Back"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
          onPress={() => {
            props.navigation.goBack();
          }}
        />
      </View>
    </View>
  );
}

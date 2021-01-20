import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { f, database, auth, storage } from "../Screens/config/config";

const editProfile = (props) => {
  const [name, setName] = useState(props.route.params.name);

const updateName = (uid) => {
        f.database()
          .ref("Users/" + uid)
          .update({ name: name }, function (error) {
            if (error) {
              console.log("Oh no, an error updating unread status");
            } else {
              console.log("Great work, successfully updated status");
            }
          });
      };



  return (
    <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            height: 70,
            paddingTop: 30,
            backgroundColor: "white",
            borderColor: "lightgrey",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottomWidth: 0.5,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              props.navigation.goBack();
            }}
          >
            <Text style={{ paddingLeft: 10 }}>Back</Text>
          </TouchableOpacity>
          <Text>Edit Profile</Text>
          <Text style={{ width: 40 }}></Text>
        </View>
      <TextInput
      defaultValue={name}
      onChangeText={(text) => 
        setName(text)}
      >

      </TextInput>
      <Button
        onPress={() => updateName(props.route.params.uid)}
        title="Update Name"
      />
    </View>
  );
};

export default editProfile

// React Native Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
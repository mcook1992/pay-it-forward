import React from "react";
import { Flatlist, Stylesheet, Text, View, Image } from "react-native";

class Profile extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          height: 70,
          paddingTop: 30,
          backgroundColor: "white",
          borderColor: "lightgrey",
          borderBottomWidth: 0.5,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Text>Profile</Text>
      </View>
    );
  }
}

export default Profile;

import React from "react";
import { Flatlist, Stylesheet, text, View, Image } from "react-native";

class Upload extends React.Component {
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
        <Text>Feed</Text>
      </View>
    );
  }
}

export default Upload;

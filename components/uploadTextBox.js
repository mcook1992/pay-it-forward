import React from "react";
import {
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  FlatList,
  Stylesheet,
  Text,
  View,
  Image,
  Button,
  Alert,
} from "react-native";

import { Dropdown } from "react-native-material-dropdown";
// import { ImagePicker } from "expo";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
//importing fonts
import * as Font from "expo-font";
import { AppLoading } from "expo";

class UploadTextBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontColor: "black",
      fontSize: "12px",
      fontFamily: null,
      backgroundColor: "orange",
      defaultText: this.props.defaultText,
      messageText: "",
      fontDataLoaded: false,
      // parentPostID: this.props.route.params.parentPostId
    };

    // alert(this.state.postID);
    // console.log();
  }

  fetchFonts = () => {
    return Font.loadAsync({
      "roboto-bold": require("../assets/fonts/Roboto-Bold.ttf"),
      "roboto-italic": require("../assets/fonts/Roboto-Italic.ttf"),
      "roboto-regular": require("../assets/fonts/Roboto-Regular.ttf"),
    });
  };

  render() {
    return (
      <View>
        {this.state.fontDataLoaded == false ? (
          <AppLoading
            startAsync={this.fetchFonts}
            onFinish={() => {
              this.setState({ fontDataLoaded: true });
            }}
          />
        ) : (
          <TextInput
            style={{
              height: 150,
              width: 300,
              backgroundColor: this.state.backgroundColor,
              fontFamily: "roboto-bold",
              color: this.state.fontColor,
              borderColor: "black",
              borderWidth: 3,
              textAlignVertical: "top",
              margin: 20,
            }}
            onChangeText={(text) => {
              this.setState({ messageText: text });

              this.props.changeStateFunction(
                text,
                this.state.backgroundColor,
                this.state.fontColor,
                this.state.fontSize
              );
            }}
            defaultValue={this.state.defaultText}
          ></TextInput>
        )}
      </View>
    );
  }
}
export default UploadTextBox;

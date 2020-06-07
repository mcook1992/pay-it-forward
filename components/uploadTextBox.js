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
      fontSize: 18,
      fontFamily: null,
      backgroundColor: "orange",
      defaultText: this.props.defaultText,
      messageText: "",
      fontDataLoaded: false,
      fontOptions: [{ value: "roboto-bold" }, { value: "architectsDaughter" }],
      colorOptions: [
        { value: "transparent" },
        { value: "white" },
        { value: "black" },
        { value: "red" },
        { value: "blue" },
        { value: "green" },
        { value: "yellow" },
      ],
      sizeOptions: [
        { value: 12 },
        { value: 14 },
        { value: 16 },
        { value: 18 },
        { value: 20 },
        { value: 22 },
        { value: 24 },
        { value: 26 },
        { value: 28 },
        { value: 30 },
        { value: 32 },
        { value: 34 },
        { value: 36 },
        { value: 38 },
      ],
      // parentPostID: this.props.route.params.parentPostId
    };

    // alert(this.state.postID);
    // console.log();
  }

  changeUploadState = () => {
    this.props.changeStateFunction(
      this.state.messageText,
      this.state.backgroundColor,
      this.state.fontColor,
      this.state.fontSize,
      this.state.fontFamily
    );
  };

  //   fetchFonts = () => {
  //     return Font.loadAsync({
  //       "roboto-bold": require("../assets/fonts/Roboto-Bold.ttf"),
  //       "roboto-italic": require("../assets/fonts/Roboto-Italic.ttf"),
  //       "roboto-regular": require("../assets/fonts/Roboto-Regular.ttf"),
  //       architectsDaughter: require("../assets/fonts/ArchitectsDaughter-Regular.ttf"),
  //       dancingScript: require("../assets/fonts/DancingScript-VariableFont_wght.ttf"),
  //       indieFlower: require("../assets/fonts/IndieFlower-Regular.ttf"),
  //     });
  //   };

  render() {
    return (
      <View>
        <View>
          <TextInput
            style={{
              height: 150,
              width: 300,
              backgroundColor: this.state.backgroundColor,
              fontFamily: this.state.fontFamily,
              color: this.state.fontColor,
              fontSize: this.state.fontSize,
              borderColor: "black",
              borderWidth: 3,
              textAlignVertical: "top",
              margin: 20,
            }}
            onChangeText={(text) => {
              this.setState({ messageText: text });
              this.changeUploadState();
            }}
            defaultValue={this.state.defaultText}
          ></TextInput>

          <Dropdown
            style={{ width: 10 }}
            label="Choose a background color"
            data={this.state.colorOptions}
            onChangeText={(value) => {
              this.setState({
                backgroundColor: value,
              });
              this.changeUploadState();
              // console.log(this.state.messageType);
            }}
          />
          <Dropdown
            style={{ width: 40 }}
            label="Cnoose a font"
            data={this.state.fontOptions}
            onChangeText={(value) => {
              this.setState({
                fontFamily: value,
              });
              this.changeUploadState();
              // console.log(this.state.messageType);
            }}
          />
          <Dropdown
            style={{ width: 40 }}
            label="Cnoose a font color"
            data={this.state.colorOptions}
            onChangeText={(value) => {
              this.setState({
                fontColor: value,
              });
              this.changeUploadState();
              // console.log(this.state.messageType);
            }}
          />
          <Dropdown
            style={{ width: 40 }}
            label="Cnoose a font size"
            data={this.state.sizeOptions}
            onChangeText={(value) => {
              this.setState({
                fontSize: value,
              });
              this.changeUploadState();
              // console.log(this.state.messageType);
            }}
          />
        </View>
      </View>
    );
  }
}
export default UploadTextBox;

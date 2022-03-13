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

import { Dropdown } from "react-native-material-dropdown-v2";
// import { ImagePicker } from "expo";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
//importing fonts
import * as Font from "expo-font";
import  AppLoading  from "expo-app-loading";

class UploadTextBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontColor: this.props.fontColor,
      fontSize: this.props.fontSize,

      fontFamily: this.props.fontFamily,
      backgroundColor: this.props.backgroundColor,
      defaultText: this.props.defaultText,
      messageText: this.props.defaultText,
      addStyling: false,
      fontOptions: [{ value: "roboto-bold" }, { value: "architectsDaughter" }],
      colorOptions: [
        { value: "transparent" },
        { value: "white" },
        { value: "black" },
        { value: "red" },
        { value: "lightpink" },
        { value: "pink" },
        { value: "aquamarine" },
        { value: "azure" },
        { value: "lavender" },
        { value: "lightcyan" },
        { value: "yellow" },
        { value: "gold" },
        { value: "plum" },
        { value: "silver" },
        { value: "green" },
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
    //have to adjust message text so that it is rewritten with new formatting applied by each drop down
    var messageText = this.state.messageText;
    this.setState({ messageText: messageText });

    this.props.changeStateFunction(
      this.state.messageText,
      this.state.backgroundColor,
      this.state.fontColor,
      this.state.fontSize,
      this.state.fontFamily
    );
    console.log(
      this.state.backgroundColor,
      this.state.fontColor,
      this.state.fontSize,
      this.state.fontFamily,
      this.state.messageText
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
              height: 300,
              width: 300,
              backgroundColor: this.state.backgroundColor,
              fontFamily: this.state.fontFamily,
              color: this.state.fontColor,
              fontSize: this.state.fontSize,
              borderColor: "black",
              borderWidth: 3,
              textAlignVertical: "top",
              margin: 20,
              padding: 15,
            }}
            multiline={true}
            value={this.state.messageText}
            placeholder="You are awesome!"
            onChangeText={(text) => {
              this.setState({ messageText: text });
            }}
            onEndEditing={this.changeUploadState}
            defaultValue={this.state.defaultText}
          ></TextInput>
          {this.state.addStyling == false ? (
            <Button
              title="Style My Message"
              color="#841584"
              accessibilityLabel="Learn more about this purple button"
              onPress={() => {
                console.log("Button Pressed");
                this.setState({ addStyling: true });
              }}
            />
          ) : (
            <View>
              <Dropdown
                
                label="Choose a background"
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

              <Button
                title="Done Styling"
                color="#841584"
                accessibilityLabel="Learn more about this purple button"
                onPress={() => {
                  console.log("Button Pressed");
                  this.setState({ addStyling: false });
                }}
              />
            </View>
          )}
        </View>
      </View>
    );
  }
}
export default UploadTextBox;

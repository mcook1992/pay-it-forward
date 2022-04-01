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
      imageSelectedURI: this.props.imageSelectedURI,
      addStyling: false,
      fontOptions: [{ value: "roboto-bold" }, { value: "architectsDaughter" }, {value: "System"}],
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

  componentDidMount = () => {
    // console.log(this.props)

   //dealing with weird edge case that appears sometimes and making sure that, if anything comes in undefined, the system doesn't break

  //  console.log(this.state)

    // this.setState({
    //   fontColor: this.props.fontColor,
    //   fontSize: this.props.fontSize,
    //   fontFamily: this.props.fontFamily,
    //   backgroundColor: this.props.backgroundColor,
    //   defaultText: this.props.defaultText,
    //   messageText: this.props.defaultText,

    // })
  }

  changeUploadState = () => {
    console.log("in the change upload state function")
    //have to adjust message text so that it is rewritten with new formatting applied by each drop down
    var messageText = this.state.messageText;
    this.setState({ messageText: messageText });

    this.props.changeStateFunction(
      this.state.messageText,
      this.state.backgroundColor,
      this.state.fontColor,
      this.state.fontSize,
      this.state.fontFamily,
    );
    // console.log(
    //   this.state.backgroundColor,
    //   this.state.fontColor,
    //   this.state.fontSize,
    //   this.state.fontFamily,
    //   this.state.messageText
    // );
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
              height: 200,
              width: 300,
              backgroundColor: this.state.backgroundColor,
              fontFamily: this.state.fontFamily,
              color: this.state.fontColor,
              fontSize: this.state.fontSize,
              borderColor: "black",
              borderWidth: 3,
              textAlignVertical: "top",
              textAlign: "center",
              margin: 20,
              marginBottom: 10,
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

            {this.props.imageSelectedURI != "" &&
                <View>
                  <View style={{alignItems: "center"}}>
                        <Image
                          source={{ uri: this.props.imageSelectedURI }}
                          style={{minWidth: 300, minHeight: 200, marginBottom: 20, resizeMode: "cover" }}
                        />
                      </View>
                </View>
              }
          {this.state.addStyling == false ? (
            
            
            <TouchableOpacity
              onPress={() => {
                console.log("Button Pressed");
                this.setState({ addStyling: true });
              }}
              style={{
                marginHorizontal: 40,
                paddingVertical: 15,
                paddingHorizontal: 15,
                backgroundColor: "#ccccff",
                borderRadius: 20,
                borderColor: "grey",
                borderWidth: 1.5,
                alignSelf: "center",
                alignItems: "center"
              }}
            >

              
              <Text>Style My Message</Text>

            </TouchableOpacity>

            // <Button
            //   title="Style My Message"
            //   style={{
            //     alignItems: 'center',
            //     justifyContent: 'center',
            //     paddingVertical: 12,
            //     paddingHorizontal: 32,
            //     borderRadius: 4,
            //     elevation: 3,
            //     backgroundColor: 'black'}}
            //   color="#841584"
            //   accessibilityLabel="Learn more about this purple button"
            //   onPress={() => {
            //     console.log("Button Pressed");
            //     this.setState({ addStyling: true });
            //   }}
            // />
            
          ) : (
            <View>
              <Dropdown
                
                label="Choose a background color"
                style={{height: 50, fontSize: 20, margin: 10}}
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
                style={{height: 50, fontSize: 20, margin: 10}}
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
                style={{height: 50, fontSize: 20, margin: 10}}
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
                style={{height: 50, fontSize: 20, margin: 10, marginBottom: 20}}
                data={this.state.sizeOptions}
                onChangeText={(value) => {
                  this.setState({
                    fontSize: value,
                  });
                  this.changeUploadState();
                  // console.log(this.state.messageType);
                }}
              />

            <TouchableOpacity
              onPress={() => {
                this.setState({ addStyling: false });
              }}
              style={{
                marginHorizontal: 40,
                paddingVertical: 15,
                paddingHorizontal: 15,
                backgroundColor: "#ccccff",
                borderRadius: 20,
                borderColor: "grey",
                borderWidth: 1.5,
                alignSelf: "center",
                alignItems: "center",
                
              }}
            >
              <Text>Done Styling</Text>

            </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  }
}

export default UploadTextBox;

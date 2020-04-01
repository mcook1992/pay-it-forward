import React from "react";
import {
  TouchableOpacity,
  TextInput,
  Flatlist,
  Stylesheet,
  Text,
  View,
  Image,
  Button
} from "react-native";
import { f, database, auth, storage } from "../Screens/config/config";
import { Dropdown } from "react-native-material-dropdown";

class Upload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      messageTypeMenuOptions: [
        {
          value: "Compliment"
        },
        {
          value: "Gratitude"
        },
        {
          value: "Positive Message"
        },
        { value: "Apology" }
      ],
      messageType: "Compliment"
      // parentPostID: this.props.route.params.parentPostId
    };
  }

  componentDidMount = () => {
    var that = this;
    f.auth().onAuthStateChanged(function(user) {
      if (user) {
        that.setState({
          isLoggedIn: true
        });
      }
    });
  };

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
        <View
          style={{
            height: 70,
            paddingTop: 30,
            backgroundColor: "white",
            borderColor: "lightgrey",
            justifyContent: "center",
            alignItems: "center",
            borderBottomWidth: 0.5
          }}
        >
          <Text>Upload</Text>
        </View>
        {this.state.isLoggedIn == true ? (
          <View>
            <View>
              <Dropdown
                style={{ width: 40 }}
                label="Cnoose a message type"
                data={this.state.messageTypeMenuOptions}
                onChangeText={value => {
                  this.setState({
                    messageType: value
                  });
                  console.log(this.state.messageType);
                }}
              />
            </View>

            <View style={{ flex: 1, alignItems: "center" }}>
              <View>
                <Text>Enter message below</Text>
                <TextInput
                  style={{
                    height: 300,
                    width: 300,
                    backgroundColor: "white",
                    borderColor: "black",
                    borderWidth: 3,
                    padding: 20,
                    margin: 20
                  }}
                ></TextInput>
              </View>
              <Button
                title="Upload media from your phone"
                color="#841584"
                accessibilityLabel="Learn more about this purple button"
              />
              <Button
                title="Use media from our program"
                color="#841584"
                accessibilityLabel="Learn more about this purple button"
              />
            </View>
          </View>
        ) : (
          <Text>You're not logged in!</Text>
        )}
      </View>
    );
  }
}

export default Upload;

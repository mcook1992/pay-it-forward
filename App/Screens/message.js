import React from "react";
import {
  TouchableOpacity,
  Flatlist,
  Stylesheet,
  Text,
  View,
  Image,
} from "react-native";
import { f, database, auth, storage } from "../Screens/config/config";

class Message extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: true,
      fontSize: 18,
      fontFamily: "System",
      fontColor: "black",
      backgroundColor: "white",

      // parentPostID: this.props.route.params.parentPostId
    };
  }

  componentDidMount = () => {
    var that = this;
    console.log("Message text is " + this.props.route.params.message.text);
  };

  checkParams = () => {
    var that = this;
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
        }}
      >
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
              this.props.navigation.goBack();
            }}
          >
            <Text style={{ paddingLeft: 10 }}>Back</Text>
          </TouchableOpacity>
          <Text>Message</Text>
          <Text style={{ width: 40 }}></Text>
        </View>
        {this.state.loaded == true ? (
          <View
            style={{
              paddingTop: 30,
              paddingBottom: 30,
              backgroundColor: "white",
              borderColor: "lightgrey",
              borderBottomWidth: 0.5,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text>You have a message from </Text>

            <TouchableOpacity>
              <Text
                onPress={() => {
                  this.props.navigation.push("UserProfile", {
                    user: this.props.route.params.message.sender,
                  });
                }}
              >
                {this.props.route.params.message.name}
              </Text>
            </TouchableOpacity>
            <View
              style={{
                backgroundColor: this.props.route.params.message
                  .backgroundColor,
                width: 300,
                minHeight: 300,
                padding: 20,
                margin: 20,
              }}
            >
              <Text
                style={{
                  color: this.props.route.params.message.textColor,
                  fontFamily: this.props.route.params.message.fontFamily,
                  fontSize: this.props.route.params.message.fontSize,
                }}
              >
                {this.props.route.params.message.text}
              </Text>
            </View>
            <TouchableOpacity
              style={{
                marginTop: 10,
                marginHorizontal: 40,
                paddingVertical: 20,
                paddingHorizontal: 20,
                backgroundColor: "orange",
                borderRadius: 20,
                borderColor: "grey",
                borderWidth: 1.5,
              }}
              onPress={() =>
                this.props.navigation.navigate("Upload", {
                  message: {
                    id: this.props.route.params.message.id,
                    parentMessages: this.props.route.params.message
                      .parentMessages,
                    prefilledMessage: {
                      messageText: "Thank you for your message!",
                      messageType: "Thank you reply",
                    },
                  },
                  selectedContact: {
                    contactInfo: this.props.route.params.message.sender,
                  },
                })
              }
            >
              <Text style={{ textAlign: "center" }}>Send a thank you</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                marginTop: 10,
                marginHorizontal: 40,
                paddingVertical: 20,
                paddingHorizontal: 20,
                backgroundColor: "orange",
                borderRadius: 20,
                borderColor: "grey",
                borderWidth: 1.5,
              }}
              onPress={() =>
                this.props.navigation.navigate("FriendsList", {
                  message: this.props.route.params.message,
                })
              }
            >
              <Text style={{ textAlign: "center" }}>Pay it forward</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text>You're not logged in!</Text>
        )}
      </View>
    );
  }
}

export default Message;

import React from "react";
import {
  TouchableOpacity,
  Flatlist,
  Stylesheet,
  Text,
  View,
  Image
} from "react-native";
import { f, database, auth, storage } from "../Screens/config/config";

class Message extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: true
      // parentPostID: this.props.route.params.parentPostId
    };
  }

  componentDidMount = () => {
    var that = this;
  };

  checkParams = () => {
    var that = this;
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
        {this.state.loaded == true ? (
          <View>
            <Text>Message</Text>
            <Text>{this.props.route.params.message.id}</Text>
            <TouchableOpacity>
              <Text
                onPress={() =>
                  this.props.navigation.navigate("UserProfile", {
                    user: this.props.route.params.message.sender
                  })
                }
              >
                {this.props.route.params.message.sender.username}
              </Text>
            </TouchableOpacity>
            <Text>{this.props.route.params.message.text}</Text>
          </View>
        ) : (
          <Text>You're not logged in!</Text>
        )}
      </View>
    );
  }
}

export default Message;

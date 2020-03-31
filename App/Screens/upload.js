import React from "react";
import {
  TouchableOpacity,
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
      menuOptions: [
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
      ]
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
        {this.state.isLoggedIn == true ? (
          <View>
            <View>
              <Dropdown
                style={{ width: 40 }}
                label="Cnoose a message type"
                data={this.state.menuOptions}
              />
            </View>

            <View style={{ flex: 1, alignItems: "center" }}>
              <Text style={{ fontSize: 20, paddingBottom: 20 }}>Upload </Text>

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

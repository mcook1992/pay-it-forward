import React from "react";
import {
  TouchableOpacity,
  Flatlist,
  Stylesheet,
  Text,
  View,
  Image,
  Button,
} from "react-native";
import { f, database, auth, storage } from "./config/config";

class basicHomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
    };
  }

  componentDidMount = () => {
    var that = this;
    f.auth().onAuthStateChanged(function (user) {
      if (user) {
        that.setState({
          isLoggedIn: true,
          userID: user.uid,
        });

        database
          .ref("Users")
          .child(user.uid)
          .once("value")
          .then(function (snapshot) {
            if (snapshot.val()) {
              var newUser = snapshot.val();
              that.setState({
                userFirstName: newUser.firstName,
              });
            }
          });
      }
    });
  };

  render() {
    return (
      <View>
        <Text>Welcome {this.state.userFirstName}</Text>
        <TouchableOpacity
          style={{
            marginTop: 10,
            marginHorizontal: 40,
            paddingVertical: 20,
            backgroundColor: "orange",
            borderRadius: 20,
            borderColor: "grey",
            borderWidth: 1.5,
          }}
          onPress={() =>
            this.props.navigation.navigate("FriendsList", {
              recipient: this.state.user,
            })
          }
        >
          <Text style={{ textAlign: "center" }}>Send a message!</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            marginTop: 10,
            marginHorizontal: 40,
            paddingVertical: 20,
            backgroundColor: "orange",
            borderRadius: 20,
            borderColor: "grey",
            borderWidth: 1.5,
          }}
          onPress={() =>
            this.props.navigation.navigate("Upload", {
              recipient: this.state.user,
            })
          }
        >
          <Text style={{ textAlign: "center" }}>Browse!</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default basicHomePage;

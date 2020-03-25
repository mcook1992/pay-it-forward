import React from "react";
import { Flatlist, Stylesheet, Text, View, Image } from "react-native";
import { f, database, auth, storage } from "../Screens/config/config";

class Comments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false
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
          <Text>Upload </Text>
        ) : (
          <Text>You're not logged in!</Text>
        )}
      </View>
    );
  }
}

export default Comments;

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

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.route.params.user,
      loading: false,
    };
  }

  componentDidMount = () => {
    var that = this;
    this.getUserInfo();
  };

  checkPararms = () => {
    var params = this.props.route.params.user;
    if (params) {
      this.setState({ user: this.props.route.params.user });
    } else {
      alert("No user info passing through!");
    }
  };

  getUserInfo = () => {
    var that = this;
    database
      .ref("Users")
      .child(this.state.user) //in the future, will be messageObj.sender --but for testing, have to do the one user who does exist
      .once("value")
      .then(function (snapshot) {
        if (snapshot.val()) {
          var userData = snapshot.val();
          that.setState({
            username: userData.username,
            userAvatar: userData.avatar,
          });
        }
      });
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          // height: 70,
          // paddingTop: 30,
          // backgroundColor: "white",
          // borderColor: "lightgrey",
          // borderBottomWidth: 0.5,
          // justifyContent: "center",
          // alignItems: "center"
        }}
      >
        {this.state.loading == false ? (
          <View style={{ flex: 1 }}>
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

              <Text>Profile</Text>
              <Text style={{ width: 40 }}></Text>
            </View>
            <View
              style={{
                justifyContent: "space-evently",
                alignItems: "center",
                flexDirection: "row",
                paddingVertical: 10,
              }}
            >
              <Image
                source={{ url: this.state.userAvatar }}
                style={{
                  marginLeft: 10,
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                }}
              />
              <View style={{ marginLeft: 30 }}>
                <Text>Name</Text>
                <Text>{this.state.user.username} </Text>
              </View>
            </View>
            <View style={{ paddingBottom: 20, borderBottomWidth: 1 }}>
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
                <Text style={{ textAlign: "center" }}>Send a message!</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>Other stuff</Text>
            </View>
          </View>
        ) : (
          <Text>You're not logged in</Text>
        )}
      </View>
    );
  }
}

export default UserProfile;

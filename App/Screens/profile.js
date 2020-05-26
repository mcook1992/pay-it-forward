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
import UserAuth from "../../components/userAuth";

class Profile extends React.Component {
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
        });
      } else {
        that.setState({ isLoggedIn: false });
      }
    });
  };

  render() {
    if (this.state.isLoggedIn != true) {
      return (
        <View style={{ flex: 1 }}>
          <Text>You are not logged in.</Text>
          <UserAuth />
        </View>
      );
    } else {
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
          {this.state.isLoggedIn == true ? (
            <View style={{ flex: 1 }}>
              <View
                style={{
                  height: 70,
                  paddingTop: 30,
                  backgroundColor: "white",
                  borderColor: "lightgrey",
                  justifyContent: "center",
                  alignItems: "center",
                  borderBottomWidth: 0.5,
                }}
              >
                <Text>Profile</Text>
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
                  source={{ url: "http://i.pravatar.cc/300" }}
                  style={{
                    marginLeft: 10,
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                  }}
                />
                <View style={{ marginLeft: 30 }}>
                  <Text>Name</Text>
                  <Text>Username</Text>
                </View>
              </View>
              <View style={{ paddingBottom: 20, borderBottomWidth: 1 }}>
                <TouchableOpacity
                  style={{
                    marginTop: 10,
                    marginHorizontal: 40,
                    paddingVertical: 15,
                    borderRadius: 20,
                    borderColor: "grey",
                    borderWidth: 1.5,
                  }}
                  onPress={() => {
                    console.log("Logout pressed");
                    f.auth()
                      .signOut()
                      .then(function (snapshot) {
                        console.log("Logout successful");
                      });
                  }}
                >
                  <Text style={{ textAlign: "center" }}>Logout</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    marginTop: 10,
                    marginHorizontal: 40,
                    paddingVertical: 15,
                    borderRadius: 20,
                    borderColor: "grey",
                    borderWidth: 1.5,
                  }}
                >
                  <Text style={{ textAlign: "center" }}>Update Profile</Text>
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
                      parentPostId: "blahblahblah",
                    })
                  }
                >
                  <Text style={{ textAlign: "center" }}>Upload New</Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>Other Stuff Here</Text>
              </View>
            </View>
          ) : (
            <Text>You're not logged in</Text>
          )}
        </View>
      );
    }
  }
}

export default Profile;

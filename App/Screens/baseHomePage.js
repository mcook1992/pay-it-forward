import React from "react";
import {
  TouchableOpacity,
  FlatList,
  Stylesheet,
  Text,
  View,
  Image,
  Button,
} from "react-native";
import { f, database, auth, storage } from "./config/config";
import UserAuth from "../../components/userAuth";

class basicHomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      currentTotalPoints: 0,
      currentSpreadPoints: 0,
      newMessageNumber: 0,
      promptData: [{ text: "hello!" }, { text: "hi there!" }],
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
              that.getPrompts();
              var newUser = snapshot.val();
              var oldMessageNumber = newUser.oldMessageNumber;
              var currentMessageNumber = newUser.postsReceived.length;
              var newMessageNumber = currentMessageNumber - oldMessageNumber;
              that.setState({
                userFirstName: newUser.name,
                newMessageNumber: newMessageNumber,
                currentTotalPoints: newUser.currentPoints,
                currentSpreadPoints: newUser.spreadPoints,
              });
              console.log(that.state);
            }
          });
      } else {
        that.setState({ isLoggedIn: false });
      }
    });
  };

  getPrompts = async () => {
    var that = this;
    database
      .ref("Prompts")
      .child("todaysPrompts")
      .once("value")
      .then(function (snapshot) {
        if (snapshot.val()) {
          console.log("We haz prompts!");
          that.setState({ promptData: snapshot.val() });
        } else {
          console.log("Couldn't find le prompts");
        }
      });
  };

  render() {
    if (this.state.isLoggedIn != true) {
      return (
        <View style={{ flex: 1 }}>
          
          <UserAuth/>
        </View>
      );
    } else {
      return (
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
            <Text>Pay It Forward</Text>
          </View>

          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              padding: 15
            }}>

            <Text
              style={{ fontSize: 20 }}
            >
              Welcome, {this.state.userFirstName}!
            </Text>

          </View>

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
                recipient: this.state.user, //revisit this tktk--should "recipient" actually be sender?
              })
            }
          >
            <Text style={{ textAlign: "center" }}>Send a message!</Text>
          </TouchableOpacity>

          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              padding: 15
            }}>

            <Text
              style={{ fontSize: 20 }}
            >
              Need some inspiration?
            </Text>

            <Text

              style={{ paddingTop: 20, paddingLeft: 20, paddingRight: 20, justifyContent: "center", alignItems: "center", textAlign: "center" }}>
              Check out the sample messages below, and then click to send it to a friend
            </Text>

          </View>

          {/* TKTKTK The FlatList of Prompts */}

          <View
            style={{ paddingLeft: "10%", paddingRight: "10%" }}
          >
            <FlatList
              data={this.state.promptData}
              keyExtractor={(item, index) => index.toString()}
              style={{ backgroundColor: "#eee" }}
              renderItem={({ item, index }) => (
                <View
                  style={{
                    borderBottomWidth: 3,
                    borderBottomColor: "lightgrey",
                    // flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    height: 50,
                  }}
                  key={index}
                >
                  {/* <Image
                    source={{
                      url: item.senderAvatar,
                    }}
                    style={{
                      resizeMode: "cover",
                      width: "10%",
                      height: 40,
                      margin: 5,
                    }}
                  /> */}

                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate("FriendsList", {
                        message: {
                          prefilledMessage: { messageText: item.text },
                        },
                      });
                    }}
                    style={{ justifyContent: "center", alignItems: "center", alignText: "center" }}
                  >
                    <Text
                      style={{
                        alignItems: "center", paddingTop: 15
                      }}
                    >
                      {item.text}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>

          <View
            style={{ alignItems: "center", justifyContent: "center", paddingTop: 30, paddingBottom: 15, }}
          >
            <Text style={{ fontSize: 20 }}>Need some more inspiration?</Text>

          </View>



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
              this.props.navigation.navigate("PromptDisplayPage")
            }
          >
            <Text style={{ textAlign: "center" }}>See our full list of prompts!</Text>
          </TouchableOpacity>







        </View>
      );
    }
  }
}


export default basicHomePage;

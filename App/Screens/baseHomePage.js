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
import userAuth from "../../components/userAuth";

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
          <Text>You are not logged in.</Text>
          {/* Login form */}
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
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
                recipient: this.state.user, //revisit this tktk--should "recipient" actually be sender?
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
            <Text style={{ textAlign: "center" }}>Browse!!</Text>
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
              this.props.navigation.navigate("FriendsList", {
                recipient: this.state.user,
                message: { prefilledMessage: { messageText: "I love you" } },
              })
            }
          >
            <Text style={{ textAlign: "center" }}>
              Send this particular message with text "I love you"
            </Text>
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
              this.props.navigation.navigate("FriendsList", {
                recipient: this.state.user,
                message: {
                  prefilledMessage: {
                    imageURI: "https://i.pravatar.cc/150?img=7",
                  },
                },
              })
            }
          >
            <Text style={{ textAlign: "center" }}>
              Send this particular message with an image URI
            </Text>
          </TouchableOpacity>

          <Text>New message number here {this.state.newMessageNumber}</Text>

          {this.state.currentSpreadPoints > 1 ? (
            <View>
              <Text>
                Your positive messages have spread to{" "}
                {this.state.currentSpreadPoints} more people
              </Text>
              <Text>Click here to see more about what this number means</Text>
            </View>
          ) : (
            <Text>Click here to see more about what this number means</Text>
          )}
          <View>
            <Text>Need some inspiration?</Text>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("PromptDisplayPage")
              }
            >
              <Text>Check out today's prompts</Text>
            </TouchableOpacity>

            <View>
              <FlatList
                data={this.state.promptData}
                keyExtractor={(item, index) => index.toString()}
                style={{ backgroundColor: "#eee" }}
                renderItem={({ item, index }) => (
                  <View
                    style={{
                      borderBottomWidth: 5,
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
                    >
                      <Text
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          alignSelf: "center",
                        }}
                      >
                        {item.text}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>

            {/* tktkt */}
          </View>
        </View>
      );
    }
  }
}

export default basicHomePage;

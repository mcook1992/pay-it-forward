import React from "react";
import {
  TouchableOpacity,
  FlatList,
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
      list_of_posts: [],
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
        that.loadFeed()
      } else {
        that.setState({ isLoggedIn: false });
      }
    });
  };



  //main functions for loading sent posts (a lot of tihs is repetitive, eventually should weed out)
  loadFeed = () => {
   
    this.setState({
      refresh: true,
      loading: false,
      list_of_notifications: [],
    });
    var that = this;
    console.log(that.state.userID)

   

    database
      .ref("Users/" + that.state.userID)
      .child("postsSent")
      .once("value")
      .then(function (snapshot) {
        console.log("made it to the then function on prof page");
        if (snapshot.val()) {
          console.log("We have a snapshot from posts sent");
          var messagesReceivedArray = snapshot.val();
          // console.log("The snapshot.val() is " + data[message]);
          //make sure to add in bit about finding users once it's actually based on id--need to do another snapshot and look up users by id, then use that snapshot to get the username
          var notificationsList = that.state.list_of_notifications;

          //get an array of the things they've received and and for each of them, add them to the flatlist

          messagesReceivedArray.forEach((element) => {
            database
              .ref("Messages/" + element.id)
              .once("value")
              .then(function (message) {
                if (message.val() && !message.val().flagged) {
                  var messageObj = message.val();
                  that.add2Flatlist(notificationsList, messageObj, element.id);
                }
              });
          });

          // for (var message in data) {
          //   that.addToFlatlist(notificationsList, data, message);
          // }
        } else {
          that.setState({ loading: false, refresh: false });
        }
      })
      .catch((error) => console.log(error));
  };

  add2Flatlist = (notificationsList, messageObj, messageID) => {
    var that = this;
    console.log("the new message object is " + messageObj);
    database
      .ref("Users")
      .child(messageObj.sender)
      .once("value")
      .then(function (snapshot2) {
        if (snapshot2.val()) {
          var userData = snapshot2.val();
          // console.log(
          //   "this data should pop up twice because the user should be searched twice " +
          //     userData
          // );

          notificationsList.push({
            id: messageID,
            sender: messageObj.sender,
            type: messageObj.type,
            timeSent: that.timeConverter(messageObj["timeSent"]),
            text: messageObj.text,
            backgroundColor: messageObj.backgroundColor,
            textColor: messageObj.textColor,
            unread: messageObj.unread,
            fontFamily: messageObj.fontFamily,
            fontSize: messageObj.fontSize,
            spreadPoints: messageObj["spreadPoints"].toString(),
            parentMessages: messageObj.parentMessages,
            senderAvatar: userData.avatar,
            senderName: userData.username,
            name: userData.name,
          });
          // console.log(message + " and the message type is " + messageObj.type);

          that.setState({
            list_of_notifications: notificationsList,
            refresh: false,
            loading: true,
          });
        }
      })
      .catch((error) => console.log(error));
  };

  //time converter functions (these are duplicates and should be weeded out)

  pluralCheck = (s) => {
    if (s == 1) {
      return " ago";
    } else {
      return "s ago";
    }
  };

  timeConverter = (timestamp) => {
    var a = new Date(timestamp);
    var seconds = Math.floor((new Date() - a) / 1000);

    var interval = Math.floor(seconds / 31557600);
    if (interval > 1) {
      return interval + " year" + this.pluralCheck(interval);
    }

    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + " month" + this.pluralCheck(interval);
    }

    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + " day" + this.pluralCheck(interval);
    }

    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + " hour" + this.pluralCheck(interval);
    }

    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + " minute" + this.pluralCheck(interval);
    }
    interval = Math.floor(seconds);

    return interval + " second" + this.pluralCheck(interval);
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
                {this.state.list_of_notifications ? (
                  <FlatList
                    refreshing={this.state.refresh}
                    onRefresh={this.loadNew}
                    data={this.state.list_of_notifications}
                    keyExtractor={(item, index) => index.toString()}
                    style={{ flex: 1, backgroundColor: "#eee" }}
                    renderItem={({ item, index }) => (
                      <View
                        style={{
                          borderBottomWidth: 5,
                          borderBottomColor: "lightgrey",
                          // flex: 1,
                          // justifyContent: "center",
                          // alignItems: "center",
                          flexDirection: "row",
                          flexWrap: "wrap",
                          height: 100,
                        }}
                        key={index}
                      >
                        <Image
                          source={{
                            url: item.senderAvatar,
                          }}
                          style={{
                            resizeMode: "cover",
                            width: "10%",
                            height: 40,
                            margin: 5,
                          }}
                        />

                        <TouchableOpacity
                          onPress={() =>
                            this.props.navigation.push("Message", {
                              messageID: item.id,
                              message: item,
                            })
                          }
                        >
                          <Text
                            style={{
                              justifyContent: "center",
                              alignItems: "center",
                              alignSelf: "center",
                              fontWeight: item.unread,
                            }}
                          >
                            You sent a {item.type} to somebody
                          </Text>
                        </TouchableOpacity>
                        <Text>{item.timeSent}</Text>
                        <Text> Fire emoji{item.spreadPoints}</Text>
                      </View>
                    )}
                  />
                ) : (
                  <View>
                    <Text>You haven't sent any messages yet</Text>
                  </View>
                )}
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

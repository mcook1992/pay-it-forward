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
import { f, database, auth, storage } from "../Screens/config/config";
import userAuth from "../../components/userAuth";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Avatar, Accessory } from 'react-native-elements'


import * as Permissions from "expo-permissions";

class Feed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      list_of_notifications: [],
      refresh: false,
      loading: true,
    };
  }

  storePushTokenOnFirebase = async (pushToken) => {
    var that = this;

    database.ref("Users").child(that.state.userID).update({
      pushToken: pushToken,
    });
  };

  showPushToken = async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
      alert(finalStatus);
      if (existingStatus !== "granted") {
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      const token = await Notifications.getExpoPushTokenAsync();
      alert(token.data);
      this.setState({ expoPushToken: token });
      this.storePushTokenOnFirebase(token.data);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.createChannelAndroidAsync("default", {
        name: "default",
        sound: true,
        priority: "max",
        vibrate: [0, 250, 250, 250],
      });
    }
  };

  componentDidMount = () => {
    var that = this;
    f.auth().onAuthStateChanged(function (user) {
      if (user) {
        that.setState({
          isLoggedIn: true,
          userID: user.uid,
        });
        that.showPushToken();
        that.loadFeed();
      } else {
        that.setState({ isLoggedIn: false });
      }
    });
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
            senderName: userData.name,
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

  loadFeed = () => {
    this.setState({
      refresh: true,
      loading: false,
      list_of_notifications: [],
    });

    var that = this;

    database
      .ref("Users/" + that.state.userID)
      .child("postsReceived")
      .once("value")
      .then(function (snapshot) {
        console.log("made it to the then function");
        if (snapshot.val()) {
          console.log("We have a snapshot from posts recieved");
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

  loadNew = () => {
    this.loadFeed();

    // this.setState({
    //   refresh: true
    // });
    // //go to database
    // this.setState({
    //   list_of_notifications: [8, 7, 6, 5, 4],
    //   refresh: false
    // });
  };

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
        <View style={{ flex: 1, backgroundColor: "orange" }}>
          <Text>You are not logged in.</Text>
        </View>
      );
    } else {
      return (
        <View
          style={{
            flex: 1,
          }}
        >
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
            <Text>Feed</Text>
            <Button
              title="test button"
              color="#841584"
              accessibilityLabel="Learn more about this purple button"
              onPress={() => {
                this.showPushToken();
              }}
            />
          </View>
          {this.state.list_of_notifications.length > 0 ? (
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
                {item.senderAvatar != "blank" ? (
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
                        ) : (
                          <Avatar size="small" rounded title={item.senderName.charAt(0)}/>
                        )} 

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
                      {item.senderName} just sent you a {item.type}
                    </Text>
                  </TouchableOpacity>
                  <Text>{item.timeSent}</Text>
                  <Text> Fire emoji{item.spreadPoints}</Text>
                </View>
              )}
            />
          ) : (
            <View>
              <Text>No messages to display at this time</Text>
            </View>
          )}
        </View>
      );
    }
  }
}

export default Feed;

///OLD

// addToFlatlist = (notificationsList, data, message) => {
//   var that = this;
//   var messageObj = data[message];

//   console.log("the new message object is " + message);
//   database
//     .ref("Users")
//     .child(messageObj.sender)
//     .once("value")
//     .then(function (snapshot2) {
//       if (snapshot2.val()) {
//         var userData = snapshot2.val();
//         // console.log(
//         //   "this data should pop up twice because the user should be searched twice " +
//         //     userData
//         // );

//         notificationsList.push({
//           id: message,
//           sender: messageObj.sender,
//           type: messageObj.type,
//           timeSent: that.timeConverter(messageObj["timeSent"]),
//           text: messageObj.text,
//           spreadPoints: messageObj["spreadPoints"].toString(),
//           parentMessages: messageObj.parentMessages,
//           senderAvatar: userData.avatar,
//           senderName: userData.username,
//         });
//         // console.log(message + " and the message type is " + messageObj.type);

//         that.setState({
//           list_of_notifications: notificationsList,
//           refresh: false,
//           loading: true,
//         });
//       }
//     })
//     .catch((error) => console.log(error));
// };

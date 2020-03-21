import React from "react";
import { FlatList, Stylesheet, Text, View, Image } from "react-native";
import { f, database, auth, storage } from "../Screens/config/config";

class Feed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list_of_notifications: [],
      refresh: false,
      loading: true
    };
  }

  componentDidMount = () => {
    this.loadFeed();
  };

  addToFlatlist = (notificationsList, data, message) => {
    var that = this;
    var messageObj = data[message];
    console.log("the new message object is " + message);
    database
      .ref("Users")
      .child("sample-user-id") //in the future, will be messageObj.sender --but for testing, have to do the one user who does exist
      .once("value")
      .then(function(snapshot2) {
        if (snapshot2.val()) {
          var userData = snapshot2.val();
          // console.log(
          //   "this data should pop up twice because the user should be searched twice " +
          //     userData
          // );

          console.log(
            "the new message spread-points is " + messageObj["spreadPoints"]
          );
          notificationsList.push({
            id: message,
            sender: messageObj.sender,
            type: messageObj.type,
            timeSent: that.timeConverter(messageObj["time-sent"]),
            text: messageObj.text,
            spreadPoints: messageObj["spread-points"],
            senderAvatar: userData.avatar,
            senderName: userData.username
          });
          console.log(message + " and the message type is " + messageObj.type);

          that.setState({
            list_of_notifications: notificationsList,
            refresh: false,
            loading: true
          });
        }
      })
      .catch(error => console.log(error));
  };

  loadFeed = () => {
    this.setState({
      refresh: true,
      loading: false,
      list_of_notifications: []
    });

    var that = this;

    database
      .ref("Messages")
      .orderByChild("time-sent")
      .once("value")
      .then(function(snapshot) {
        if (snapshot.val()) {
          data = snapshot.val();
          // console.log("The snapshot.val() is " + data[message]);
          //make sure to add in bit about finding users once it's actually based on id--need to do another snapshot and look up users by id, then use that snapshot to get the username
          var notificationsList = that.state.list_of_notifications;

          for (var message in data) {
            that.addToFlatlist(notificationsList, data, message);
          }
        }
      })
      .catch(error => console.log(error));
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

  pluralCheck = s => {
    if (s == 1) {
      return " ago";
    } else {
      return "s ago";
    }
  };

  timeConverter = timestamp => {
    var a = new Date(timestamp * 1000);
    var seconds = Math.floor((new Date() - a) / 1000);

    var interval = Math.floor(seconds / 3153600);
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

    return Math.floor(seconds) + " second" + this.pluralCheck(seconds);
  };

  render() {
    return (
      <View
        style={{
          flex: 1
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
            borderBottomWidth: 0.5
          }}
        >
          <Text>Feed</Text>
        </View>
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
                height: 100
              }}
              key={index}
            >
              <Image
                source={{
                  url: item.senderAvatar
                }}
                style={{
                  resizeMode: "cover",
                  width: "10%",
                  height: 40,
                  margin: 5
                }}
              />
              <Text
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  alignSelf: "center"
                }}
              >
                {item.senderName} just sent you a {item.type}
              </Text>

              <Text>{item.timeSent}</Text>

              <Text style={{ display: "block" }}>{item.spreadPoints}</Text>
            </View>
          )}
        />
      </View>
    );
  }
}

export default Feed;

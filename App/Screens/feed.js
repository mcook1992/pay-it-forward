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
          //make sure to add in bit about finding users once it's actually based on id--need to do another snapshot and look up users by id, then use that snapshot to get the username
          var notificationsList = that.state.list_of_notifications;

          for (var message in data) {
            var messageObj = data[message];
            console.log(messageObj);
            database
              .ref("Users")
              .child("sample-user-id") //in the future, will be messageObj.sender --but for testing, have to do the one user who does exist
              .once("value")
              .then(function(snapshot) {
                if (snapshot.val()) {
                  var userData = snapshot.val();
                  console.log(userData);
                  notificationsList.push({
                    id: message,
                    sender: messageObj.sender,
                    type: messageObj.type,
                    text: messageObj.text,
                    senderAvatar: userData.avatar
                  });
                  that.setState({
                    list_of_notifications: notificationsList,
                    refresh: false,
                    loading: true
                  });
                }
              });
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
                flexWrap: "wrap"
              }}
              key={index}
            >
              <Image
                source={{
                  url:
                    "https://source.unsplash.com/random/500x" +
                    Math.floor(Math.random() * 800 + 500)
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
                Testername just sent you a compliment
              </Text>
            </View>
          )}
        />
      </View>
    );
  }
}

export default Feed;

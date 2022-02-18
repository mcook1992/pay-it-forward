import React from "react";
import {
  TouchableOpacity,
  FlatList,
  Stylesheet,
  Text,
  View,
  Image,
  Button
} from "react-native";
import { f, database, auth, storage } from "../Screens/config/config";
import UserAuth from "../../components/userAuth";
import { Avatar, Accessory } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'
import MenuPage from "./menu"
import { AntDesign } from '@expo/vector-icons'
import menuPage from "./menu"
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers
} from 'react-native-popup-menu'

const { SlideInMenu } = renderers;


class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      list_of_posts: [],
      name: "TestingName",
      profileImage: "https://firebasestorage.googleapis.com/v0/b/pay-it-forward-b148c.appspot.com/o/stockImages%2Fblank-profile-picture-973460_1280.png?alt=media&token=6d2357d4-18da-419b-9067-9d60191e4d51"
    };

    this.loadProfileImage = this.loadProfileImage.bind(this)
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
        that.loadProfileImage()
        
        database
          .ref("Users")
          .child(user.uid)
          .once("value")
          .then(function (snapshot) {
            if (snapshot.val()) {
              var newUser = snapshot.val();
              var oldMessageNumber = newUser.oldMessageNumber;
              var currentMessageNumber = newUser.postsReceived.length;
              var newMessageNumber = currentMessageNumber - oldMessageNumber;
              that.setState({
                name: newUser.name,
                newMessageNumber: newMessageNumber,
                currentTotalPoints: newUser.currentPoints,
                currentSpreadPoints: newUser.spreadPoints,
              })
            }
          })
      } else {
        that.setState({ isLoggedIn: false });
      }
    });
  };

  loadProfileImage = () => {
    var that = this
    database.ref("Users/" + that.state.userID)
      .child("avatar")
      .once("value").then(function(snapshot){
        if(snapshot.val()) {
          that.setState({
            profileImage: snapshot.val()
          })
        }
      })
  }

  //creating menu icon

  // menu_icon = (  
  //   <Icon name="bars" size={25} color="#fb3742" onPress={()=>{
  //     this.props.navigation.navigate("menuPage")
  //     console.log("Menu Icon Clicked")}} />  
  //  );  


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
            //adjusted so that it shows the real name and not just user name
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

  //IMAGE EDITING

  _checkPermissions = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ camera: status });

    const { statusRoll } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    this.setState({ cameraRoll: statusRoll });

    const { contactsStatus } = await Permissions.askAsync(Permissions.CONTACTS);
    this.setState({ contactsStatus: contactsStatus });
  };

  findNewImage = async () => {
    this._checkPermissions();

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "Images",
      allowsEditing: true,
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      console.log("upload an image");
      this.setState({
        imageSelectedFromDevice: true,
        imageSelectedURI: result.uri,
      });
      // this.uploadImage(result.uri);
    } else {
      console.log("cancelled");
    }
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
                
{/* tktktk */}
                <TouchableOpacity
                onPress={()=> {
                  console.log("Pressed")
                  this.props.navigation.navigate("menuPage")
                }}
                >
                 <AntDesign name="bars" size={24} color="black" />
                </TouchableOpacity>
                <Text>Profile REAL</Text>

              </View>

              <View
                style={{
                  justifyContent: "space-evently",
                  alignItems: "center",
                  flexDirection: "row",
                  paddingVertical: 10,
                }}
              >
                {this.state.profileImage == "blank" ? (
                // <Image
                //   source={{ url: this.state.profileImage }}
                //   style={{
                //     marginLeft: 10,
                //     width: 100,
                //     height: 100,
                //     borderRadius: 50,
                //   }}
                // />
                <Avatar size="xlarge" rounded title="MS" />
                ) : (
                  <Image
                  source={{ url: this.state.profileImage }}
                  style={{
                    marginLeft: 10,
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                  }}
                />

                )}
                
                <View style={{ marginLeft: 30 }}>
                  <Text> Welcome, {this.state.name}!</Text>
                  
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
                  onPress={() =>
                    this.props.navigation.navigate(
                      "editProfile", { name: this.state.name, uid: this.state.userID }//tktktk
                    )
                  }
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
                <View> 
                  <Text>Your sent messages!</Text>

                </View>
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
                <View> 
                {/* <Button
                      title="Edit Profile"
                      onPress={() =>
                        this.props.navigation.navigate(
                          "editProfile", { name: this.state.name, uid: this.state.userID }//tktktk
                        )
                      }
                      color="#841584"
                      accessibilityLabel="Learn more about this purple button"
                    /> */}
                </View>
              </View>
            </View>
          ) : (
            <Text>You're not in</Text>
          )}
        </View>
      );
    }
  }
}

export default Profile;

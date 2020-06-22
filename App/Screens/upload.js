import React from "react";
import {
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  FlatList,
  Stylesheet,
  ScrollView,
  Text,
  View,
  Image,
  Button,
  Alert,
} from "react-native";
import { f, database, auth, storage } from "../Screens/config/config";
import { Dropdown } from "react-native-material-dropdown";
// import { ImagePicker } from "expo";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
//importing fonts
import * as Font from "expo-font";
import { AppLoading } from "expo";
// import Contacts from "react-native-contacts";
import * as Contacts from "expo-contacts";
import BootstrapStyleSheet from "react-native-bootstrap-styles";
import getUserPhoneNumberPrefix from "../Screens/functions/getUserPhoneNumberPrefix";
import filterPhoneNumberForUpload from "../Screens/functions/filterPhoneNumberForUpload";
import createUploadCompletedAlert from "./functions/createUploadCompletedAlert";
import createFriendInviteAlert from "./functions/createFriendInviteAlert";
import UploadTextBox from "../../components/uploadTextBox";

class Upload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      //info about the message
      messageText: "",
      imageSelectedFromDevice: false,
      imageSelectedFromProgram: false,
      imageSelectedURI: "",
      defaultText: "",
      //info about image and post uploading
      pictureUploadingProgress: 0,
      postUploadingProgress: 0,
      parentMessages: [],
      childMessages: [],
      postLoading: false,
      imageLoading: false,
      postUploaded: false,
      recipient: [],
      userID: "",
      recipientChosen: false,
      contacts: [],
      postID: "",
      prefix: "",
      showFriendList: false,
      textColor: "black",
      backgroundColor: "blue",
      fontFamily: "System",
      fontSize: 12,
      messageTypeMenuOptions: [
        {
          value: "Compliment",
        },
        {
          value: "Gratitude",
        },
        {
          value: "Positive Message",
        },
        { value: "Apology" },
      ],
      messageType: "Compliment",
      // parentPostID: this.props.route.params.parentPostId
    };

    this.setPrefix = this.setPrefix.bind(this);
    this.selectMediaData = this.selectMediaData.bind(this);
    this.setMessageTextFunction = this.setMessageTextFunction.bind(this);

    // alert(this.state.postID);
    // console.log();
  }

  //functions for navigating from "complete" alert
  navigationFunction1 = () => {
    this.props.navigation.navigate("Home");
  };

  navigationFunction2 = () => {
    this.props.navigation.navigate("FriendsList");
  };

  //function for connecting the text box to the rest of the message
  setMessageTextFunction = (
    text,
    backgroundColor,
    textColor,
    textSize,
    fontFamily
  ) => {
    this.setState({
      messageText: text,
      backgroundColor: backgroundColor,
      fontSize: textSize,
      textColor: textColor,
      fontFamily: fontFamily,
    });
    console.log(this.state.messageText);
  };

  componentDidMount = () => {
    var that = this;
    var postID = this.uniqueID();

    //make sure user still logged in
    f.auth().onAuthStateChanged(function (user) {
      if (user) {
        //register the contact they selected
        var recipientData = that.props.route.params.selectedContact;
        //set up the phone number prefix sso that we can effectively reach out to other phone numbers in their contact list
        that.setPhoneNumberPrefix(user.uid);

        console.log(recipientData);

        //set the state based on the information we've been passed

        //why this set up?TKTKTK
        that.setState(
          {
            isLoggedIn: true,
          },
          function () {
            console.log(user.uid);
            that.setState({
              isLoggedIn: true,
              userID: user.uid,
              postID: postID,
              recipientChosen: true,
              recipient: recipientData,
            });
          }
        );
      }
    });
    //if this is based on another message like pay it forward or thank you
    if (this.props.route.params.message) {
      var newArray = [];
      newArray.push({ id: this.props.route.params.message.id });
      console.log("Making new array " + newArray);

      if (this.props.route.params.message.parentMessages) {
        console.log(
          "Setting pay it forward/thank you info " +
            this.props.route.params.message.parentMessages[0].id
        );
        this.props.route.params.message.parentMessages.forEach((element) => {
          console.log("Going through parent elements " + element.id);
          newArray.push({ id: element.id });
        });
      }

      this.setState({
        parentMessages: newArray,
        payItForward: true,
      });
      //if there is a prefilled message
      if (this.props.route.params.message.prefilledMessage) {
        console.log("There is a prefilled message");
        //if the prefilled message has media attached
        if (this.props.route.params.message.prefilledMessage.imageURI) {
          console.log(
            "Prefilled message image URI is ... " +
              this.props.route.params.message.prefilledMessage.imageURI
          );
          this.setState({
            imageSelectedURI: this.props.route.params.message.prefilledMessage
              .imageURI,
            imageSelectedFromProgram: true,
          });
        }
        //if the prefilled message has message text attached tktk
        if (this.props.route.params.message.prefilledMessage.messageText) {
          console.log("there is prefilled text on the pre message");
          this.setState({
            defaultText: this.props.route.params.message.prefilledMessage
              .messageText,
          });
        }

        if (this.props.route.params.message.prefilledMessage.messageType) {
          this.setState({
            messageType: this.props.route.params.message.prefilledMessage
              .messageType,
          });
        }
      }
    }
  };

  //passing this function to the get phone number Prefix function so that the state gets set in this component. This is a sloppy way to do it, but I was encountering bugs in other attempts
  setPrefix = (prefix) => {
    this.setState({ prefix: prefix });
    console.log(this.state.prefix + " is the prefix");
  };

  // function for getting the phone number prefix set up so we can effectively reach out to the user's other contacts

  setPhoneNumberPrefix = async (uid) => {
    getUserPhoneNumberPrefix(uid, this.setPrefix);
  };

  _checkPermissions = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ camera: status });

    const { statusRoll } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    this.setState({ cameraRoll: statusRoll });

    const { contactsStatus } = await Permissions.askAsync(Permissions.CONTACTS);
    this.setState({ contactsStatus: contactsStatus });
  };

  s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };

  uniqueID = () => {
    return (
      this.s4() +
      this.s4() +
      "-" +
      this.s4() +
      this.s4() +
      "-" +
      this.s4() +
      this.s4() +
      "-" +
      this.s4() +
      this.s4() +
      "-" +
      this.s4() +
      this.s4() +
      "-" +
      this.s4() +
      this.s4() +
      "-"
    );
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

  uploadNewPost = async () => {
    if (this.state.imageSelectedFromDevice == true) {
      this.uploadImage(this.state.imageSelectedURI);
    } else if (this.state.imageSelectedFromProgram == true) {
      //slight confusing function name. This just uploads a post with a pre-used image from the program, NOT a phone image
      this.uploadNewPostWithPhoneImage(this.state.imageSelectedURI);
    } else {
      this.uploadNewPostWithPhoneImage("No image selected");
    }
  };

  //uplading an image to Firebase

  uploadImage = async (uri) => {
    // var returnValue = "error";
    this.setState({ imageLoading: true });
    console.log("Upload image called");
    var that = this;
    var userID = f.auth().currentUser.uid;
    var postID = this.state.postID;

    var re = /(?:\.([^.]+))?$/;
    var ext = re.exec(uri)[1];
    this.setState({ currentMediaType: ext });

    const response = await fetch(uri);
    const blob = await response.blob();
    var filePath = postID + "." + that.state.currentMediaType;

    //accessing firebase storage
    var imageUploadTask = storage
      .ref("user/" + userID + "/img")
      .child(filePath)
      .put(blob);

    imageUploadTask.on(
      "state_changed",
      function (snapshot) {
        var progress = (
          (snapshot.bytesTransferred / snapshot.totalBytes) *
          100
        ).toFixed(0);
        that.setState({
          progress: progress,
        });
        console.log("Progress is " + progress + "% complete");
      },
      function (error) {
        console.log("Error! -- " + error);
      },
      function () {
        that.setState({
          pictureUploadingProgress: 100,
          imageLoading: false,
        });
        //taking the download URL and creating a new post with that
        imageUploadTask.snapshot.ref
          .getDownloadURL()
          .then(function (downloadURL) {
            // alert(downloadURL);
            that.uploadNewPostWithPhoneImage(downloadURL);
          });
      }
    );
  };

  //finding a user

  findUserByUsername = () => {
    var that = this;
    this.setState({ postLoading: true });

    //if the message is a thank you and we already know the exact user we're sending to

    if (this.state.messageType == "Thank you reply") {
      this.setState({ recipientID: this.state.recipient.contactInfo });
      this.uploadNewPost();
    } else {
      //find the user based on username
      f.database()
        .ref("/Users/")
        .orderByChild("username")
        .equalTo(that.state.recipient.contactInfo)
        .once("value")
        .then(function (snapshot) {
          //if the username exists
          if (snapshot.val()) {
            console.log("username exists!");

            var userData = snapshot.val();
            for (var key in userData) {
              console.log(
                "user found by username exists! and the key is... " + key
              );
              that.setState({ recipientID: key });
              console.log("the recipient ID is ... " + that.state.recipientID);
              //set state here so that the recipient is different
              that.uploadNewPost();
            }
          } else {
            //if it's not a username, then find user based on a phone number
            console.log("username doesn't exist! Checking phone numbers");
            that.dealWithPhoneNumber(that.state.recipient.contactInfo);
          }
        });
    }
  };

  dealWithPhoneNumber = (phoneNumberString) => {
    //making ssure the phone number has the proper formatting
    var filteredPhoneNumber = filterPhoneNumberForUpload(
      phoneNumberString,
      this.state.prefix
    );
    if (filteredPhoneNumber) {
      console.log(
        "the filtered phone number for upload is... " + filteredPhoneNumber
      );
      this.checkForUserByPhoneNumber(filteredPhoneNumber);
      var newRecipientObject = {
        name: this.state.recipient.name,
        contactInfo: filteredPhoneNumber,
      };
      this.setState({ recipient: newRecipientObject });
    } else {
      Alert.alert("Not a phone number");
      this.setState({ postLodaing: false });
      return;
    }
  };

  checkForUserByPhoneNumber = async (filteredPhoneNumberString) => {
    var that = this;
    console.log(
      "In the checkforUserByPhoneNumber function and the string is " +
        filteredPhoneNumberString
    );

    f.database()
      .ref("/Users/")
      .orderByChild("phone")
      .equalTo(filteredPhoneNumberString)
      .once("value")
      .then(function (snapshot) {
        console.log("snapshot is" + snapshot.val());
        //if the username exists
        if (snapshot.val()) {
          var userData = snapshot.val();
          for (var key in userData) {
            console.log(
              "user found by phone number exists! and the key is... " + key
            );
            that.setState({ recipientID: key });
            // console.log("the recipient ID is ... " + that.state.recipientID);
            //set state here so that the recipient is different
            that.uploadNewPost();
            //add friend to friendslist
            that.addContactToFriendsList();
          }
        } else {
          console.log(" no user with this phone Number exists!");

          if (filteredPhoneNumberString.length > 11) {
            console.log("This is a real phone number! Send to Twilio");
            that.uploadNewPost();
            createFriendInviteAlert(
              filteredPhoneNumberString,
              that.navigationFunction1,
              that.navigationFunction2
            );
          } else {
            that.setState({ postLodaing: false });
            console.log(
              "Unfortunately, we can't support this phone number. We can only support phone numbers in the US, with the proper area code"
            );
            Alert.alert("Cannot send! Invalid phonenumber");
          }
        }
      });
  };

  uploadNewPostWithPhoneImage = (photoDownloadURL) => {
    var that = this;
    var date = new Date();
    var timestamp = date.getTime();
    //if the recipient matches an existing user account
    if (this.state.recipientID) {
      console.log("We're in the recipientID part of uploading a post");
      f.database()
        .ref("Messages/" + that.state.postID)
        .set({
          type: that.state.messageType,
          text: that.state.messageText,
          sender: that.state.userID,
          recipient: that.state.recipient.contactInfo,
          imageURL: photoDownloadURL,
          parentMessages: that.state.parentMessages,
          timeSent: timestamp,
          spreadPoints: 1,
          fontFamily: this.state.fontFamily,
          fontSize: this.state.fontSize,
          textColor: this.state.textColor,
          backgroundColor: this.state.backgroundColor,
        });
      //adding the message to that recipients "postsReceived" array
      this.addingPostsToPostsReceived();
    } else {
      f.database()
        .ref("Messages/" + that.state.postID)
        .set({
          type: that.state.messageType,
          text: that.state.messageText,
          sender: that.state.userID,
          recipient: that.state.recipient.contactInfo,
          imageURL: photoDownloadURL,
          parentMessages: that.state.parentMessages,
          timeSent: timestamp,
          spreadPoints: 1,
          fontFamily: this.state.fontFamily,
          fontSize: this.state.fontSize,
          textColor: this.state.textColor,
          backgroundColor: this.state.backgroundColor,
        });
    }
    this.addingPointsToParentMessages();
    this.addingPostsToPostsSent();
    createUploadCompletedAlert(
      this.navigationFunction1,
      this.navigationFunction2
    );
  };

  addingPostsToPostsSent = async () => {
    console.log("in adding posts sent function");
    var that = this;
    f.database()
      .ref("Users/" + that.state.userID)
      .once("value")
      .then(function (user) {
        console.log("user posts sent thing happening ... " + user.val());
        var newPostsSentArray = [];
        //if the user already has some sent posts

        if (user.val().postsSent) {
          newPostsSentArray = user.val().postsSent;
        }

        newPostsSentArray.push({ id: that.state.postID });

        f.database()
          .ref("Users/" + that.state.userID)
          .update({ postsSent: newPostsSentArray });
      });

    //tktktk
  };

  addingPostsToPostsReceived = async () => {
    console.log("in the adding posts to received function");
    var that = this;
    if (that.state.recipientID) {
      console.log("In the adding posts to received function with a recip ID");
      f.database()
        .ref("Users/" + that.state.recipientID)
        .once("value")
        .then(function (user) {
          var newPostsReceivedArray = [];
          //if the user has already received a post...otherwise, don't bother

          if (user.val().postsReceived) {
            newPostsReceivedArray = user.val().postsReceived;
          }

          newPostsReceivedArray.push({ id: that.state.postID });

          f.database()
            .ref("Users/" + that.state.recipientID)
            .update({ postsReceived: newPostsReceivedArray });
        });
    }
    //tktktk
  };

  //adding friends to friendlist if they have another account

  addContactToFriendsList = async () => {
    var that = this;

    //find the new friend by their id

    f.database()
      .ref("Users/" + that.state.recipientID)
      .once("value")
      .then(function (newFriend) {
        if (newFriend.val()) {
          var friendObject = newFriend.val();
          var newElement = {
            name: friendObject.name,
            username: friendObject.username,
            id: that.state.recipientID,
          };
          //find current user by id
          f.database()
            .ref("Users/" + that.state.userID)
            .once("value")
            .then(function (user) {
              if (user.val()) {
                var newUserFriendsArray = [];
                if (user.val().friendsList) {
                  newUserFriendsArray = user.val().friendsList;
                }
                newUserFriendsArray.push(newElement);
                //add the new recipient to new user's friends list
                f.database()
                  .ref("Users/" + that.state.userID)
                  .update({ friendsList: newUserFriendsArray });
              }
            });
        }
      });
  };

  //adding spread points

  addingPointsToParentMessages = async () => {
    var that = this;
    if (that.state.parentMessages) {
      //for each parent message, add points to the users total
      this.state.parentMessages.forEach((element) => {
        console.log(
          "In the adding points function " + this.state.parentMessages
        );
        console.log(element);
        f.database()
          .ref("Messages/" + element.id)
          .once("value")
          .then(function (message) {
            // console.log(message.val());
            var messageObject = message.val();
            console.log(messageObject.spreadPoints);
            var newSpreadPoints = messageObject.spreadPoints + 1;
            //updating child messages as well
            that.addChildMessages();

            //updating indvidual message spreadpoint and child messages
            f.database()
              .ref("Messages/" + element.id)
              .update({
                spreadPoints: newSpreadPoints,
              });
            //updating the users overall spreadpoints (who sent og message)
            f.database()
              .ref("Users/" + messageObject.sender)
              .once("value")
              .then(function (user) {
                var newUser = user.val();
                console.log(
                  "The new user is " + newUser + " " + newUser.currentPoints
                );
                //setting old points to current pointss
                var oldPoints = newUser.currentPoints;
                var currentPoints = newUser.currentPoints + 1;
                var newSpreadPoints = newUser.spreadPoints + 1;
                f.database()
                  .ref("Users/" + messageObject.sender)
                  .update({
                    oldPoints: oldPoints,
                    currentPoints: currentPoints,
                    spreadPoints: newSpreadPoints,
                  });
              });
          });
      });
    }
  };

  //function used to set state if user picks media from the program
  selectMediaData = async (url) => {
    this.setState({
      imageSelectedFromProgram: true,
      imageSelectedURI: url,
    });
  };

  //making sure this message is registered as a child message of previous messages

  addChildMessages = async () => {
    var that = this;
    if (that.state.parentMessages) {
      f.database()
        .ref("Messages/" + that.props.route.params.message.id)
        .once("value")
        .then(function (message) {
          var newChildMessageArray = [];
          if (message.val()) {
            console.log("We're adding a child to a parent message");
            var messageObject = message.val();
            if (messageObject.childMessages) {
              newChildMessageArray = messageObject.childMessages;
            }
            newChildMessageArray.push(that.state.postID);
            f.database()
              .ref("Messages/" + that.props.route.params.message.id)
              .update({
                childMessages: newChildMessageArray,
              });
          }
        });
    }

    //updating indvidual message spreadpoint and child messages
  };
  // tktktk

  render() {
    return (
      <View
        style={{
          flex: 1,
          height: 70,

          backgroundColor: "white",
          borderColor: "lightgrey",
          borderBottomWidth: 0.5,
          justifyContent: "center",
          alignItems: "center",
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
            margin: 20,
          }}
        >
          <Text style={{ fontSize: 14 }}>Send a Message</Text>
        </View>
        {this.state.isLoggedIn == true ? (
          <ScrollView style={{ padding: 0, margin: 0 }}>
            <View>
              <View style={{ flex: 1, alignItems: "center" }}>
                <View>
                  <View>
                    <Text>Recipient: {this.state.recipient.name}</Text>
                    <TouchableOpacity
                      onPress={() => this.props.navigation.goBack()}
                    >
                      <Text>Change Recipient</Text>
                    </TouchableOpacity>
                  </View>

                  <Text>Enter message below</Text>

                  <UploadTextBox
                    changeStateFunction={this.setMessageTextFunction}
                    defaultText={this.state.defaultText}
                  />
                </View>
                {this.state.imageSelectedFromDevice == false &&
                this.state.imageSelectedFromProgram == false ? (
                  <View>
                    <Button
                      title="Upload media from your phone"
                      color="#841584"
                      accessibilityLabel="Learn more about this purple button"
                      onPress={this.findNewImage}
                    />
                    <Button
                      title="Use media from our program"
                      onPress={() =>
                        this.props.navigation.navigate(
                          "ChooseImagesFromPrograms",
                          {
                            saveImageData: this.selectMediaData.bind(this),
                          }
                        )
                      }
                      color="#841584"
                      accessibilityLabel="Learn more about this purple button"
                    />
                    <Button
                      title="Send message!"
                      color="#841584"
                      accessibilityLabel="Learn more about this purple button"
                      onPress={this.findUserByUsername}
                    />
                  </View>
                ) : (
                  <View>
                    <Text>Image Selected</Text>

                    {this.imageSelectedURI != "" ? (
                      <View>
                        <Image
                          source={{ uri: this.state.imageSelectedURI }}
                          style={{ width: 100, height: 100, marginTop: 20 }}
                        />

                        <TouchableOpacity
                          onPress={() =>
                            this.setState({
                              imageSelectedFromDevice: false,
                              imageSelectedFromProgram: false,
                              imageSelectedURI: "",
                            })
                          }
                        >
                          <Text>Remove or Change Image</Text>
                        </TouchableOpacity>

                        {this.state.postLodaing == true ? (
                          <ActivityIndicator size="small" color="blue" />
                        ) : (
                          <Button
                            title="Send message!"
                            color="#841584"
                            accessibilityLabel="Learn more about this purple button"
                            onPress={this.findUserByUsername}
                          />
                        )}
                      </View>
                    ) : (
                      <Image source={{ url: "http://i.pravatar.cc/300" }} />
                    )}
                  </View>
                )}
              </View>
            </View>
          </ScrollView>
        ) : (
          <Text>You're not logged in!</Text>
        )}
      </View>
    );
  }
}

export default Upload;

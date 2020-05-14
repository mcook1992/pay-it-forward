import React from "react";
import {
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  FlatList,
  Stylesheet,
  Text,
  View,
  Image,
  Button,
} from "react-native";
import { f, database, auth, storage } from "../Screens/config/config";
import { Dropdown } from "react-native-material-dropdown";
// import { ImagePicker } from "expo";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
// import Contacts from "react-native-contacts";
import * as Contacts from "expo-contacts";
import BootstrapStyleSheet from "react-native-bootstrap-styles";
//ttt

class Upload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      messageText: "",
      imageSelectedFromDevice: false,
      imageSelectedFromProgram: false,
      imageSelectedURI: "",
      defaultText: "",
      pictureUploadingProgress: 0,
      postUploadingProgress: 0,
      parentMessages: [],
      childMessages: [],
      postLodaing: false,
      postUploaded: false,
      recipient: [],
      userID: "",
      recipientChosen: false,
      contacts: [],
      postID: "",
      showFriendList: false,
      friendsData: ["test-user-2", "test-user-1"],
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

    this.returnData = this.returnData.bind(this);

    // alert(this.state.postID);
    // console.log();
  }

  componentDidMount = () => {
    var that = this;
    var postID = this.uniqueID();
    //make sure user still logged in
    f.auth().onAuthStateChanged(function (user) {
      if (user) {
        //register the contact they selected
        var recipientData = that.props.route.params.selectedContact;
        // console.log(recipientData);

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
        //if the prefilled message has message text attached
        if (this.props.route.params.message.prefilledMessage.messageText) {
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
    // this._checkContactPermissions();
    // Contacts.getAll((err, contacts) => {
    //   if (err === "denied") {
    //     // error
    //   } else {
    //     console.log("The contacts are ... " + contacts);
    //   }
    // });
  };

  returnData = (recipientInfo) => {
    // var newVar = this.state.recipient;
    // newArray.push(recipientInfo);

    this.setState(
      { recipient: recipientInfo, recipientChosen: true },
      function () {
        console.log(
          "The new state recipient info is... " + this.state.recipient
        );
      }
    );
  };

  onSubmitMessage = (e) => {
    e.preventDefault();
    console.log(
      "current state is " +
        this.state.messageText +
        " and " +
        this.state.recipient.contactInfo
    );
  };

  //image/media related functions:

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
    //tktktk
    if (this.state.imageSelectedFromDevice == true) {
      this.uploadImage(this.state.imageSelectedURI);

      // console.log(response);
    } else if (this.state.imageSelectedFromProgram == true) {
      this.uploadNewPostWithPhoneImage(this.state.imageSelectedURI);
    } else {
      this.uploadNewPostWithPhoneImage("No image selected");
    }
  };

  uploadImage = async (uri) => {
    // var returnValue = "error";
    this.setState({ postLodaing: true });
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
          postLodaing: false,
        });
        imageUploadTask.snapshot.ref
          .getDownloadURL()
          .then(function (downloadURL) {
            // alert(downloadURL);
            that.uploadNewPostWithPhoneImage(downloadURL);
          });
      }
    );

    // var snapshot = ref.put(blob).on("state_changed", (snapshot) => {
    //   console.log("Progress", snapshot.bytesTransferred, snapshot.totalBytes);
    // });
  };

  //tktktk

  findUserByUsername = () => {
    var that = this;

    //if the message is a thank you

    if (this.state.messageType == "Thank you reply") {
      this.setState({ recipientID: this.state.recipient.contactInfo });
      this.uploadNewPost();
    } else {
      f.database()
        .ref("/Users/")
        .orderByChild("username")
        .equalTo(that.state.recipient.contactInfo)
        .once("value")
        .then(function (snapshot) {
          // for (const property in snapshot) {
          //   console.log(`${property}: ${snapshot[property]}`);
          // }
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
            console.log("username doesn't exist! Checking phone numbers");
            that.dealWithPhoneNumber(that.state.recipient.contactInfo);
          }
        });
    }
  };

  dealWithPhoneNumber = (phoneNumberString) => {
    var newPhoneNumberArray = [];
    var counter = 0;
    console.log(
      "We'rein the deal with phone number function and the string is " +
        phoneNumberString
    );

    for (var i = 0; i < phoneNumberString.length; i++) {
      var element = phoneNumberString.charAt(i);
      console.log(element);
      var isItNotANumber = isNaN(element);
      if (isItNotANumber == false) {
        console.log("We're in the if loop");

        //dealing with adding array of strings together
        if (counter == 0) {
          newPhoneNumberArray[0] = element;
          counter++;
        } else {
          newPhoneNumberArray[0] = newPhoneNumberArray[0] + element;
          counter++;
          console.log(
            newPhoneNumberArray + " is the array and the counter is " + counter
          );
          if (counter == phoneNumberString.length) {
            this.checkForUserByPhoneNumber(newPhoneNumberArray[0]);
          }
        }
      } else {
        alert("Not a phone number");
        return;
      }
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
            that.addContactToFriendsList();
          }

          //add friend to friendslist
        } else {
          console.log(
            " no user with this phone Number existsuser doesn't exist!"
          );

          if (filteredPhoneNumberString.length == 10) {
            console.log(
              "This is a real phone number! Send to Twilio with a 1 added in front!"
            );
            that.uploadNewPost();
            //this.SendToTwilio
          } else if (filteredPhoneNumberString.length == 11) {
            console.log(
              "This is a real phone number with country code. Send to Twilio with no additions"
            );
            that.uploadNewPost();
          } else {
            console.log(
              "Unfortunately, we can't support this phone number. We can only support phone numbers in the US, with the proper area code"
            );
            alert("Cannot send! Invalid phonenumber");
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
        });
      //tktktktktk
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
        });
    }
    this.addingPointsToParentMessages();
    this.addingPostsToPostsSent();
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
                f.database()
                  .ref("Users/" + messageObject.sender)
                  .update({
                    oldPoints: oldPoints,
                    currentPoints: currentPoints,
                  });
              });
          });
      });
    }
  };

  selectMediaData = async (url) => {
    this.setState({
      imageSelectedFromProgram: true,
      imageSelectedURI: url,
    });
  };

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
          paddingTop: 30,
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
          <Text style={{ fontSize: 14 }}>Upload</Text>
        </View>
        {this.state.isLoggedIn == true ? (
          <View>
            <Text>Send your message below</Text>
            <View>
              <Dropdown
                style={{ width: 40 }}
                label="Cnoose a message type"
                data={this.state.messageTypeMenuOptions}
                onChangeText={(value) => {
                  this.setState({
                    messageType: value,
                  });
                  // console.log(this.state.messageType);
                }}
              />
            </View>

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
                <TextInput
                  style={{
                    height: 150,
                    width: 300,
                    backgroundColor: "white",
                    borderColor: "black",
                    borderWidth: 3,
                    textAlignVertical: "top",
                    margin: 20,
                  }}
                  onChangeText={(text) => {
                    this.setState({ messageText: text });
                    console.log(this.state.messageText);
                  }}
                  defaultValue={this.state.defaultText}
                ></TextInput>
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
                    onPress={this.uploadNewPost}
                  />
                  <Button
                    title="Test button!"
                    color="#841584"
                    accessibilityLabel="Learn more about this purple button"
                    onPress={this.findUserByUsername}
                  />
                  <Button
                    title="Back!"
                    color="#841584"
                    accessibilityLabel="Learn more about this purple button"
                    onPress={() => this.props.navigation.goBack()}
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
        ) : (
          <Text>You're not logged in!</Text>
        )}
      </View>
    );
  }
}

export default Upload;

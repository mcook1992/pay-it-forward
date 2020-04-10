import React from "react";
import {
  TouchableOpacity,
  TextInput,
  Flatlist,
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

class Upload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      messageText: "",
      imageSelected: false,
      imageSelectedURI: "",
      imageLodaing: false,
      postUploaded: false,
      recipient: [],
      recipientChosen: false,
      contacts: [],
      postID: this.uniqueID(),
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
    // alert(this.state.postID);
    console.log();
  }

  componentDidMount = () => {
    var that = this;
    f.auth().onAuthStateChanged(function (user) {
      if (user) {
        that.setState(
          {
            isLoggedIn: true,
          },
          function () {
            console.log(user.uid);
          }
        );
      }
    });
    this._checkContactPermissions();
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
        this.state.recipient
    );
  };

  //image/media related functions:

  _checkContactPermissions = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === "granted") {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Emails],
      });

      if (data.length > 0) {
        const contact = data[0];
        console.log(contact);
        this.setState({ contacts: data });
      }
    }

    // const { contactsStatus } = await Permissions.askAsync(Permissions.CONTACTS);
    // this.setState({ contactsStatus: contactsStatus });
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
        imageSelected: true,
        imageSelectedURI: result.uri,
      });
      // this.uploadImage(result.uri);
    } else {
      console.log("cancelled");
    }
  };

  uploadImage = async (uri) => {
    var that = this;
    var userID = f.auth().currentUser.uid;
    var postID = this.state.postID;

    var re = /(?:\.([^.]+))?$/;
    var ext = re.exec(uri)[1];
    this.setState({ currentMediaType: ext });

    const response = await fetch(uri);
    const blob = await response.blob();
    var filePath = postID + "." + that.state.currentMediaType;

    const ref = storage.ref("user/" + userID + "/img").child(filePath);

    var snapshot = ref.put(blob).on("state_changed", (snapshot) => {
      console.log("Progress", snapshot.bytesTransferred, snapshot.totalBytes);
    });
  };

  selectMediaData = async (url) => {
    this.setState({
      imageSelected: true,
      imageSelectedURI: url,
    });
  };

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
                  console.log(this.state.messageType);
                }}
              />
            </View>

            <View style={{ flex: 1, alignItems: "center" }}>
              <View>
                {this.state.recipientChosen == true ? (
                  <View>
                    <Text>Recipient: {this.state.recipient.contactName}</Text>
                    <TouchableOpacity
                      onPress={() =>
                        this.setState({ recipientChosen: false, recipient: "" })
                      }
                    >
                      <Text>Change Recipient</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View>
                    <Text>Enter recipient below or</Text>
                    <TouchableOpacity
                      onPress={() => {
                        console.log(
                          "The current contact are ... " + this.state.contacts
                        );
                        this.props.navigation.navigate("Contacts", {
                          returnData: this.returnData.bind(this),
                          contacts: this.state.contacts,
                        });
                      }}
                    >
                      <Text>Add contacts from your phone</Text>
                    </TouchableOpacity>
                    <TextInput
                      style={{
                        height: 30,
                        width: 300,
                        backgroundColor: "white",
                        borderColor: "black",
                        borderWidth: 1,
                        margin: 20,
                        textAlignVertical: "top",
                      }}
                      onChangeText={(text) => {
                        this.setState({ recipient: text });
                        console.log(this.state.recipient);
                      }}
                    ></TextInput>
                  </View>
                )}
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
                  }}
                ></TextInput>
              </View>
              {this.state.imageSelected == false ? (
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
                    onPress={this.onSubmitMessage}
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
                            imageSelected: false,
                            imageSelectedURI: "",
                          })
                        }
                      >
                        <Text>Remove or Change Image</Text>
                      </TouchableOpacity>
                      <Button
                        title="Send message!"
                        color="#841584"
                        accessibilityLabel="Learn more about this purple button"
                        onPress={this.onSubmitMessage}
                      />
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

import React, { Component } from "react";
import { View, Text, FlatList, ActivityIndicator, Button } from "react-native";
import { ListItem, SearchBar } from "react-native-elements";
import { f, database, auth, storage } from "../Screens/config/config";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as Contacts from "expo-contacts";
import * as Permissions from "expo-permissions";

class friendContactUpload extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: [],
      error: null,
      // recipientSelected: "none",
    };

    this.arrayholder = [];
  }

  componentDidMount() {
    this._checkContactPermissions();
    var that = this;
    var arrayOfFriends = [];
    f.auth().onAuthStateChanged(function (user) {
      if (user) {
        var userID = user.uid;
        console.log("We're in comp did Mount and have a user");
        database
          .ref("Users")
          .child(userID)
          .child("friendsList")
          .once("value")
          .then(function (snapshot) {
            if (snapshot) {
              console.log("The snapshot value is " + snapshot.val());
              var object = snapshot.val();
              for (var key in object) {
                console.log(key);
                var newValue = object[key];
                arrayOfFriends.push(newValue);
              }
              that.setState({ data: arrayOfFriends });
              that.arrayholder = arrayOfFriends;
              console.log("the new state is  " + that.state.data);
            }
          });
      }
    });

    // this.makeRemoteRequest();
  }

  _checkContactPermissions = async () => {
    this.setState({ loading: true });
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === "granted") {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Emails],
      });

      if (data.length > 0) {
        // const contact = data[0];
        // console.log(contact);
        var dataFromContacts = this.sortData(data);
        console.log(dataFromContacts[0].contactInfo);
        //after this, combine two arrays
        this.setState({ loading: false });
      }
    }
  };

  sortData = (paramData) => {
    var sortedArray = [];

    console.log("We are sorting data");

    paramData.forEach((element) => {
      var newElement = {};
      newElement.name = element.firstName + " " + element.lastName;

      console.log("We have an empty element");
      console.log(element.phoneNumbers);

      if (element.phoneNumbers.length == 1) {
        console.log("The element is  " + element);

        newElement.contactInfo = element.phoneNumbers[0].digits;
      } else if (element.phoneNumbers.length > 1) {
        console.log("element.phoneNumbers.length is greater than 1");

        element.phoneNumbers.forEach((numberArray) => {
          if (
            numberArray.label == "mobile" ||
            numberArray.label == "main" ||
            numberArray.label == "iPhone"
          ) {
            //this code is repetitive--extract later

            newElement.contactInfo = numberArray.digits;
          }
        });
      } else {
        newElement.contactInfo = "no phone number available";
      }
      sortedArray.push(newElement);
    });

    return sortedArray;
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "86%",
          backgroundColor: "#CED0CE",
          marginLeft: "14%",
        }}
      />
    );
  };

  searchFilterFunction = (text) => {
    console.log("we're in the search filter function");

    this.setState({
      value: text,
    });

    const newData = this.arrayholder.filter((item) => {
      //tktk fix array so that it matches new structure of data
      //set up data array so that there is a name and a "contact info"
      //set up this function so that it takes name and contact info
      console.log("They array holder item is " + item);
      const itemData = item.toUpperCase();
      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      data: newData,
    });
  };

  renderHeader = () => {
    return (
      <SearchBar
        placeholder="Type Here..."
        lightTheme
        round
        onChangeText={(text) => this.searchFilterFunction(text)}
        autoCorrect={false}
        value={this.state.value}
      />
    );
  };

  render() {
    if (this.state.loading) {
      return (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            height: 70,
            paddingTop: 30,
            backgroundColor: "white",
            borderColor: "lightgrey",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottomWidth: 0.5,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.goBack();
            }}
          >
            <Text style={{ paddingLeft: 10 }}>Back</Text>
          </TouchableOpacity>

          <Text>Choose a recipient</Text>
          <Text style={{ width: 40 }}></Text>
        </View>
        <FlatList
          data={this.state.data}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate("Upload", {
                  selectedContact: { name: item, contactInfo: item },
                });
              }}
            >
              <ListItem
                // leftAvatar={{ source: { uri: item.picture.thumbnail } }}
                title={item}
                subtitle={item}
              />
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={this.renderSeparator}
          ListHeaderComponent={this.renderHeader}
        />
      </View>
    );
  }
}

export default friendContactUpload;

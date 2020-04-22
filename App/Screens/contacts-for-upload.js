import React, { Component } from "react";
import { View, Text, FlatList, ActivityIndicator, Button } from "react-native";
import { ListItem, SearchBar } from "react-native-elements";
import { f, database, auth, storage } from "../Screens/config/config";
import { TouchableOpacity } from "react-native-gesture-handler";

class Contacts_for_Upload extends React.Component {
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
    this.makeRemoteRequest();
  }

  sortData = (paramData) => {
    var sortedArray = [];

    console.log("We are sorting data");

    paramData.forEach((element) => {
      var newElement = {};

      console.log("We have an empty element");
      console.log(element.phoneNumbers);

      if (element.phoneNumbers.length == 1) {
        console.log("The element is  " + element);
        newElement.name = {
          first: element.firstName,
          last: element.lastName,
        };
        newElement.email = element.phoneNumbers[0].number;
      } else if (element.phoneNumbers.length > 1) {
        console.log("element.phoneNumbers.length is greater than 1");
        // newElement.name = {
        //   first: element.firstName,
        //   last: element.lastName,
        // };
        // newElement.email = element.phoneNumbers[0].number;

        //ADD Code below back in tktk--it was working fine!
        element.phoneNumbers.forEach((numberArray) => {
          if (
            numberArray.label == "mobile" ||
            numberArray.label == "work" ||
            numberArray.label == "home"
          ) {
            //this code is repetitive--extract later
            newElement.name = {
              first: element.firstName,
              last: element.lastName,
            };
            newElement.email = numberArray.number;
          }
        });
      } else {
        newElement.name = {
          first: element.firstName,
          last: element.lastName,
        };
        newElement.email = "no phone number available";
      }
      sortedArray.push(newElement);
    });

    // console.log("The new sorted array is ");
    // console.log(sortedArray[0]);
    // console.log(sortedArray[1]);
    // console.log(sortedArray[2]);
    // console.log(sortedArray[3]);
    // console.log("the new test array is ");
    // console.log(this.state.testData[0]);

    return sortedArray;

    // this.setState({ data: sortedArray, loading: false });
  };

  makeRemoteRequest = () => {
    this.setState({ loading: true });

    var paramData = this.props.route.params.contacts;
    var sortedArray = this.sortData(paramData);

    // var testData = {
    //   name: { first: "Mercer", last: "Cook" },
    //   email: "test@email.com",
    // };

    this.arrayholder = sortedArray;

    this.setState({ data: sortedArray, loading: false });

    // const url = `https://randomuser.me/api/?&results=20`;
    // this.setState({ loading: true });

    // fetch(url)
    //   .then((res) => res.json())
    //   .then((res) => {
    //     this.setState({
    //       data: res.results,
    //       error: res.error || null,
    //       loading: false,
    //     });
    //     this.arrayholder = res.results;

    //     console.log("the array value is ");
    //     console.log(this.arrayholder[0]);
    //   })
    //   .catch((error) => {
    //     this.setState({ error, loading: false });
    //   });
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
    this.setState({
      value: text,
    });

    const newData = this.arrayholder.filter((item) => {
      const itemData = ` ${item.name.first.toUpperCase()} ${item.name.last.toUpperCase()}`;
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
        <FlatList
          data={this.state.data}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                var recipientObject = {
                  contactInfo: item.email,
                  contactName: item.name.first + " " + item.name.last,
                };
                this.setState(
                  {
                    recipientSelected: recipientObject,
                  },
                  function () {
                    this.props.route.params.returnData(
                      this.state.recipientSelected
                    );
                    this.props.navigation.goBack();
                  }
                );
              }}
            >
              <ListItem
                // leftAvatar={{ source: { uri: item.picture.thumbnail } }}
                title={`${item.name.first} ${item.name.last}`}
                subtitle={item.email}
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

export default Contacts_for_Upload;

// {
/* <Button
          title="Go back"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
          onPress={this.returnToPreviousScreen}
        /> */
// }

// returnToPreviousScreen = () => {
//   this.props.route.params.returnData(this.state.selectedRecipient);
//   this.props.navigation.goBack();
// };

//   constructor(props) {
//     super(props);

//     this.state = {
//       loading: false,
//       testData: [
//         { name: { first: "test", last: "testy" }, phoneNumber: "555-5555" },
//       ],
//       data: [
//         {
//           firstName: "Hank",

//           lastName: "Zakroff",

//           phoneNumbers: [
//             {
//               countryCode: "us",
//               digits: "5557664823",
//               id: "337A78CC-C90A-46AF-8D4B-6CC43251AD1A",
//               label: "mobile",
//               number: "(555) 766-4823",
//             },
//             {
//               countryCode: "us",
//               digits: "7075551854",
//               id: "E998F7A3-CC3C-4CF1-BC21-A53682BC7C7A",
//               label: "other",
//               number: "(707) 555-1854",
//             },
//           ],
//         },
//       ],

//       selectedRecipient: "none",
//       newData: "nothing here yet",
//       error: null,
//     };

//     this.arrayholder = [];
//     this.sortData = this.sortData.bind(this);
//   }

//   componentDidMount() {
//     var that = this;
//     // this.makeRemoteRequest();
//     // this.setState({
//     //   newData: this.props.route.params.contacts,
//     // });
//     // console.log(
//     //   "The new contacts list is ..." + this.props.route.params.contacts
//     // );
//     // this.setState(
//     //   {
//     //     data: this.props.route.params.contacts,
//     //   },
//     that.sortData();
//     // );
//   }

//   //tktk sort data
//   sortData = () => {
//     var sortedArray = [];
//     this.setState({ loading: true });

//     console.log("We are sorting data");

//     this.state.data.forEach((element) => {
//       var newElement = {};

//       console.log("We have an empty element");
//       console.log(element.phoneNumbers);

//       if (element.phoneNumbers.length == 1) {
//         console.log("The element is  " + element);
//         newElement.name = {
//           first: element.firstName,
//           last: element.lastName,
//         };
//         newElement.phoneNumber = element.phoneNumbers[0];
//       } else if (element.phoneNumbers.length > 1) {
//         console.log("element.phoneNumbers.length is greater than 1");
//         element.phoneNumbers.forEach((numberArray) => {
//           if (numberArray.label == "mobile") {
//             //this code is repetitive--extract later
//             newElement.name = {
//               first: element.firstName,
//               last: element.lastName,
//             };
//             newElement.phoneNumber = numberArray.number;
//           }
//         });
//       } else {
//         newElement.name = {
//           first: element.firstName,
//           last: element.lastName,
//         };
//         newElement.phoneNumber = "no phone number available";
//       }
//       sortedArray.push(newElement);
//     });

//     // console.log("The new sorted array is ");
//     // console.log(sortedArray[0]);
//     // console.log("the new test array is ");
//     // console.log(this.state.testData[0]);

//     this.setState({ data: sortedArray, loading: false });
//   };

//   makeRemoteRequest = () => {
//     const url = `https://randomuser.me/api/?&results=20`;
//     this.setState({ loading: true });

//     //Using test data
//     // fetch(url)
//     //   .then((res) => res.json())
//     //   .then((res) => {
//     //     this.setState({
//     //       data: res.results,
//     //       error: res.error || null,
//     //       loading: false,
//     //     });
//     //     this.arrayholder = res.results;
//     //   })
//     //   .catch((error) => {
//     //     this.setState({ error, loading: false });
//     //   });
//   };

//   renderSeparator = () => {
//     return (
//       <View
//         style={{
//           height: 1,
//           width: "86%",
//           backgroundColor: "#CED0CE",
//           marginLeft: "14%",
//         }}
//       />
//     );
//   };

//   searchFilterFunction = (text) => {
//     this.setState({
//       value: text,
//     });

//     const newData = this.data.filter((item) => {
//       const itemData = `${item.name.first.toUpperCase()} ${item.name.last.toUpperCase()}`;
//       const textData = text.toUpperCase();

//       return itemData.indexOf(textData) > -1;
//     });
//     this.setState({
//       data: newData,
//     });
//   };

//   renderHeader = () => {
//     return (
//       <SearchBar
//         placeholder="Type Here..."
//         lightTheme
//         round
//         onChangeText={(text) => this.searchFilterFunction(text)}
//         autoCorrect={false}
//         value={this.state.value}
//       />
//     );
//   };
//   returnToPreviousScreen = () => {
//     this.props.route.params.returnData(this.state.selectedRecipient);
//     this.props.navigation.goBack();
//   };

//   render() {
//     if (this.state.loading) {
//       return (
//         <View
//           style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
//         >
//           <ActivityIndicator />
//         </View>
//       );
//     }
//     return (
//       <View style={{ flex: 1 }}>

//         <Button
//           title="Console log state"
//           color="#841584"
//           accessibilityLabel="Learn more about this purple button"
//           onPress={() => console.log(this.state.newData)}
//         />
//         <FlatList
//           data={this.state.data}
//           renderItem={({ item }) => (
//             <ListItem
//               // leftAvatar={{ source: { uri: item.picture.thumbnail } }}
//               title={`${item.name.first} ${item.name.last}`}
//               subtitle={item.phoneNumber}
//             />
//           )}
//           keyExtractor={(item, index) => index.toString()}
//           ItemSeparatorComponent={this.renderSeparator}
//           ListHeaderComponent={this.renderHeader}
//         />
//       </View>
//     );
//   }
// }

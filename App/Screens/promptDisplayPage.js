import React, { useState, useEffect } from "react";
import { f, database, auth, storage } from "./config/config";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  SectionList,
} from "react-native";
import Constants from "expo-constants";
import getCompletePromptData from "../Screens/functions/prompts";
import { TouchableOpacity } from "react-native-gesture-handler";

var initialPromptData = [
  {
    title: "Compliments",
    data: [
      "You're an amazing listener",
      "You're awesome",
      "You always make me smile",
    ],
  },
  {
    title: "Gratitudes",
    data: [
      "Thanks for always listening to me",
      "Thanks for being a great friend",
      "Thanks for your help during a hard time",
    ],
  },
  {
    title: "Thoughtful Messages",
    data: [
      "I'm thinking of you",
      "I hope today brings you joy",
      "Can't wait until we next see each other",
    ],
  },
  {
    title: "Messages of Love",
    data: [
      "Just wanted to say I'm grateful to have you in my life",
      "I'm so lucky to know you",
      "I love you",
    ],
  },
];

var DATA = [
  {
    title: "Main dishes",
    data: ["Pizza", "Burger", "Risotto"],
  },
  {
    title: "Sides",
    data: ["French Fries", "Onion Rings", "Fried Shrimps"],
  },
  {
    title: "Drinks",
    data: ["Water", "Coke", "Beer"],
  },
  {
    title: "Desserts",
    data: ["Cheese Cake", "Ice Cream"],
  },
];

const Item = ({ title }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
    marginHorizontal: 16,
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
  },
  header: {
    fontSize: 32,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
  },
});

class promptDisplayPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      promptData: DATA,
    };
  }

  componentDidMount = () => {
    this.loadData();
  };

  loadData = async () => {
    var that = this;
    console.log("In this load data");
    this.setState({ refreshing: true });
    f.database()
      .ref("Prompts/todaysPrompts")
      .once("value")
      .then(function (snapshot) {
        if (snapshot.val()) {
          console.log("We haz prompts!");
          var todaysPromptsArray = [];
          snapshot.val().forEach((element) => {
            // console.log(element);
            todaysPromptsArray.push(element.text);
            console.log(todaysPromptsArray);
          });

          var newPromptsObject = {
            title: "Today's Prompts",
            data: todaysPromptsArray,
          };

          initialPromptData.unshift(newPromptsObject);
          console.log("newpromptData");
          console.log(initialPromptData);

          that.setState({ promptData: initialPromptData, refreshing: false });
        } else {
          console.log("Couldn't find le prompts");
        }
      });

    // const newData = await getCompletePromptData();
    // console.log("newData =");
    // console.log(newData);
    // if (newData) {
    //   this.setState({ promptData: newData, refreshing: false });
    //   console.log(newData);
    // }
  };
  render() {
    if (this.state.refreshing) {
      return (
        <View style={{ flex: 1 }}>
          <Text>Lading</Text>
        </View>
      );
    } else {
      return (
        <SafeAreaView style={styles.container}>
          <SectionList
            sections={this.state.promptData}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  console.log("Pressed");
                  this.props.navigation.navigate("FriendsList", {
                    recipient: this.state.user,
                    message: {
                      prefilledMessage: { messageText: item },
                    },
                  });
                }}
              >
                <Item title={item} />
              </TouchableOpacity>
            )}
            renderSectionHeader={({ section: { title } }) => (
              <View>
                <Text style={styles.header}>{title}</Text>
              </View>
            )}
          />
        </SafeAreaView>
      );
    }
  }
}

export default promptDisplayPage;

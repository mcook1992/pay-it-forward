import React, { useState, useEffect } from "react";
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
    console.log("In this load data");
    this.setState({ loading: true });
    const newData = await getCompletePromptData();
    if (newData) {
      this.setState({ promptData: newData, loading: false });
      console.log(newData);
    }
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
            renderItem={({ item }) => <Item title={item} />}
            renderSectionHeader={({ section: { title } }) => (
              <TouchableOpacity
                onPress={() => {
                  console.log(this.state.promptData);
                }}
              >
                <Text style={styles.header}>{title}</Text>
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>
      );
    }
  }
}

export default promptDisplayPage;

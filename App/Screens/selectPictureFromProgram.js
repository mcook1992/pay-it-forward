import React, { Component } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Button,
  Image,
} from "react-native";
import { ListItem, SearchBar } from "react-native-elements";
import { f, database, auth, storage } from "../Screens/config/config";
import { TouchableOpacity } from "react-native-gesture-handler";

class ChooseImagesFromPrograms extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      photoArray: [
        "https://i.pravatar.cc/150?img=3",
        "https://i.pravatar.cc/150?img=23",
        "https://i.pravatar.cc/150?img=22",
        "https://i.pravatar.cc/150?img=21",
      ],
      // parentPostID: this.props.route.params.parentPostId
    };
  }

  componentDidMount = () => {
    var that = this;
    f.auth().onAuthStateChanged(function (user) {
      if (user) {
        that.setState({
          isLoggedIn: true,
        });
      }
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
        {this.state.isLoggedIn == true ? (
          <View>
            <Text>Upload </Text>
            <FlatList
              //   refreshing={this.state.refresh}
              //   onRefresh={this.loadNew}
              data={this.state.photoArray}
              keyExtractor={(item, index) => index.toString()}
              style={{ flex: 1, backgroundColor: "#eee" }}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => {
                    this.props.route.params.saveImageData(item);
                    this.props.navigation.goBack();
                  }}
                >
                  <Image
                    source={{
                      url: item,
                    }}
                    style={{
                      resizeMode: "cover",
                      width: 250,
                      height: 250,
                      margin: 40,
                    }}
                  />
                </TouchableOpacity>
              )}
            />
          </View>
        ) : (
          <Text>You're not logged in!</Text>
        )}
      </View>
    );
  }
}

export default ChooseImagesFromPrograms;

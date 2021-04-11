// import React from "react";
// import { StyleSheet, Text, View } from "react-native";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import Feed from "./App/Screens/feed";
// // import Profile from "./App/Screens/profile";
// // import Upload from "./App/Screens/upload";
// import { NavigationContainer } from "@react-navigation/native";
// import { createStackNavigator } from "@react-navigation/stack";
// import { MyTabs } from "./components/navTabs";
// import { MaterialCommunityIcons } from "react-native-vector-icons";
// // const MainStack = createBottomTabNavigator({
//   feed: { screen: Feed },
//   profile: { screen: Profile },
//   upload: { screen: Upload }
// });

// const Stack = createStackNavigator();

// const BottomStack = createBottomTabNavigator();

import * as React from "react";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
//tkttk

import { Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import Feed from "./App/Screens/feed";
import Profile from "./App/Screens/profile";
import Upload from "../pay-it-forward/App/Screens/upload";
import UserProfile from "../pay-it-forward/App/Screens/userProfile";
import Contacts_for_Upload from "./App/Screens/contacts-for-upload";
// import Message from "../pay-it-forward/App/Screens/message";
import Comments from "./App/Screens/comments";
import {
  f,
  database,
  auth,
  storage,
} from "../pay-it-forward/App/Screens/config/config";

import Message from "./App/Screens/message";
import ChooseImagesFromPrograms from "./App/Screens/selectPictureFromProgram";
import friendContactUpload from "./App/Screens/friendsListContacts";
import basicHomePage from "./App/Screens/baseHomePage";
import reportMessage from "./App/Screens/reportMessage";
import * as Font from "expo-font";
import  AppLoading  from "expo-app-loading";
import promptDisplayPage from "./App/Screens/promptDisplayPage";
import editProfile from "./App/Screens/editProfile"
import menuPage from "./App/Screens/menu"
import { MenuProvider } from 'react-native-popup-menu'
import giftPage from "./App/Screens/gifts"

function NotificationPage() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Notifications</Text>
    </View>
  );
}

// const fetchFonts = () => {
//   return Font.loadAsync({
//     "roboto-bold": require("./assets/fonts/Roboto-Bold.ttf"),
//     "roboto-italic": require("./assets/fonts/Roboto-Italic.ttf"),
//     "roboto-regular": require("./assets/fonts/Roboto-Regular.ttf"),
//     architectsDaughter: require("./assets/fonts/ArchitectsDaughter-Regular.ttf"),
//     dancingScript: require("./assets/fonts/DancingScript-VariableFont_wght.ttf"),
//     indieFlower: require("./assets/fonts/IndieFlower-Regular.ttf"),
//   });
// };

const Tab = createBottomTabNavigator();

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="Home" component={MyTabs} />
      <Stack.Screen name="UserProfile" component={UserProfile} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Message" component={Message} />
      <Stack.Screen name="Contacts" component={Contacts_for_Upload} />
      <Stack.Screen name="FriendsList" component={friendContactUpload} />
      <Stack.Screen
        name="ChooseImagesFromPrograms"
        component={ChooseImagesFromPrograms}
      />
      <Stack.Screen name="PromptDisplayPage" component={promptDisplayPage} />
      <Stack.Screen name="basicHomePage" component={basicHomePage} />
      <Stack.Screen name="reportMessage" component={reportMessage} />
      <Stack.Screen name="Upload" component={Upload} />
      <Stack.Screen name="editProfile" component={editProfile} />
      <Stack.Screen name="menuPage" component={menuPage} />
      <Stack.Screen name="Feed" component={Feed} />
      <Stack.Screen name="giftPage" component={giftPage} />

    </Stack.Navigator>
  );
}

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Feed"
      tabBarOptions={{
        activeTintColor: "#e91e63",
      }}
    >
      <Tab.Screen
        name="Feed"
        component={Feed}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Gifts"
        component={giftPage} //change back to notifs tktktk
        options={{
          tabBarLabel: "Updates",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="bell" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="basicHomePage"
        component={basicHomePage}
        options={{
          tabBarLabel: "HomePage",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="email-open-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// export default function App() {
//   return (
//     <NavigationContainer>
//       <MyTabs />
//     </NavigationContainer>
//   );
// }

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontDataLoaded: false,
    };
    // this.registerForPushNotificationsAsync();
  }

  //notifications

  registerForPushNotificationsAsync = async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
      alert(finalStatus);
      if (existingStatus !== "granted") {
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      const token = await Notifications.getExpoPushTokenAsync();
      alert(token.data);
      this.setState({ expoPushToken: token });
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.createChannelAndroidAsync("default", {
        name: "default",
        sound: true,
        priority: "max",
        vibrate: [0, 250, 250, 250],
      });
    }
  };

  //fonts

  fetchFonts = () => {
    return Font.loadAsync({
      "roboto-bold": require("./assets/fonts/Roboto-Bold.ttf"),
      "roboto-italic": require("./assets/fonts/Roboto-Italic.ttf"),
      "roboto-regular": require("./assets/fonts/Roboto-Regular.ttf"),
      architectsDaughter: require("./assets/fonts/ArchitectsDaughter-Regular.ttf"),
      dancingScript: require("./assets/fonts/DancingScript-VariableFont_wght.ttf"),
      indieFlower: require("./assets/fonts/IndieFlower-Regular.ttf"),
    });
  };

  login = async () => {
    try {
      let user = await auth.signInWithEmailAndPassword(
        "testuser1@testing.com",
        "fakepassword"
      );
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    if (this.state.fontDataLoaded == false) {
      return (
        <AppLoading
          startAsync={this.fetchFonts}
          onFinish={() => {
            this.setState({ fontDataLoaded: true });
          }}
          onError={console.warn}
        />
      );
    } else {
      return (
        
        <NavigationContainer>
          <MenuProvider>
          <MyStack />
          </MenuProvider>
        </NavigationContainer>
        
      );
    }
  }
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center"
//   }
// });

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
import { FlatList, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import Feed from "./App/Screens/feed";
import Profile from "./App/Screens/profile";
import Upload from "../pay-it-forward/App/Screens/upload";
import UserProfile from "./App/Screens/userProfile";
import Contacts_for_Upload from "./App/Screens/contacts-for-upload";
// import Message from "../pay-it-forward/App/Screens/message";
import Comments from "./App/Screens/comments";
import {
  f,
  database,
  auth,
  storage
} from "../pay-it-forward/App/Screens/config/config";
import Message from "./App/Screens/message";

// function Feed() {
//   return (
//     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//       <Text>Feed!</Text>
//     </View>
//   );
// }

// function Profile() {
//   return (
//     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//       <Text>Profile!</Text>
//     </View>
//   );
// }

function Notifications() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Notifications!</Text>
    </View>
  );
}
// function UserProfile() {
//   return (
//     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//       <Text>User Profile</Text>
//     </View>
//   );
// }

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
    </Stack.Navigator>
  );
}

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Feed"
      tabBarOptions={{
        activeTintColor: "#e91e63"
      }}
    >
      <Tab.Screen
        name="Feed"
        component={Feed}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          )
        }}
      />
      <Tab.Screen
        name="Uddates"
        component={Notifications}
        options={{
          tabBarLabel: "Updates",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="bell" color={color} size={size} />
          )
        }}
      />
      <Tab.Screen
        name="Upload"
        component={Upload}
        options={{
          tabBarLabel: "Upload",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="email-open-outline"
              color={color}
              size={size}
            />
          )
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          )
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
    this.login();
  }

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
    return (
      <NavigationContainer>
        <MyStack />
      </NavigationContainer>
    );
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

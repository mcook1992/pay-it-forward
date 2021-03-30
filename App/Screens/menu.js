import React, { useState } from 'react';
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
  } from "react-native"
  import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    renderers
  } from 'react-native-popup-menu'
  



  const menuPage = (props) => {
    const [count, setCount] = useState(0);
  
    return (
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
       <Text>Menu Page</Text>
       <TouchableOpacity
       onPress={()=>{
         props.navigation.navigate("Feed")
       }}
       >
         <Text>Feed</Text>
       </TouchableOpacity>
       </View>
      
    );
  };

  export default menuPage
import React, { useState } from "react";

import { FlatList, Text, View, Button, TextInput, Picker } from "react-native";
import { f, database, auth, storage } from "./config/config";
import * as WebBrowser from 'expo-web-browser';


function viewGift(props) {
    return ( 
        <View>
    <Text>You just received a gift!</Text>
    <Text> The gift is:</Text>
    <Text>{props.route.params.gift.text}</Text>
    <Text>To ues your gift, go to the following link</Text>
    <Button
                  title={props.route.params.gift.websiteName}
                  onPress={() => WebBrowser.openBrowserAsync(props.route.params.gift.websiteLink)}
                  
                />
    <Text>Instructions</Text>
    <Text>{props.route.params.gift.instructions}</Text>
    <Text>{props.route.params.gift.code}</Text>
    {/* <Text>{props.link}</Text>
    <Text>{props.instructions}</Text> */}
    
    </View>
        )
  }

  export default viewGift
import React, { useState } from "react";

import { FlatList, Text, View, Button, TextInput, StyleSheet } from "react-native";
import { f, database, auth, storage } from "./config/config";
import * as WebBrowser from 'expo-web-browser';


function viewGift(props) {
    return ( 
        <View
        style={{flex: 1}}
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
            }}
          >
            <Text>You just received a gift</Text>
           
          </View>
          <View
          style={{
              padding: 25,
            paddingTop: 30,
            paddingBottom: 30,
            backgroundColor: "white",
            borderColor: "lightgrey",
            borderBottomWidth: 0.5,
            justifyContent: "center",
            alignItems: "center",
          }}
          >
    <Text style={styles.bigBlue}>You just received a gift!</Text>
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
    </View>
    {/* <Text>{props.link}</Text>
    <Text>{props.instructions}</Text> */}
    
    </View>
        )
  }

  const styles = StyleSheet.create({
    container: {
      marginTop: 50,
    },
    bigBlue: {
      color: 'blue',
      fontWeight: 'bold',
      fontSize: 30,
      padding: 20
    },
    red: {
      color: 'red',
    },
  });

  export default viewGift
import * as React from "react"
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


function menuPage(props) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
       <TouchableOpacity onPress={() => props.navigation.goBack()}>
       <Text>Back</Text>
       </TouchableOpacity>
        <Text>Menu Page!</Text>
      </View>
    );
  }

  export default menuPage
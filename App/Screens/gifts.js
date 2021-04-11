import React, { useState } from 'react';
import {
    TouchableOpacity,
    Text,
    Image,
    View,
    SafeAreaView,
    SectionList,
    StyleSheet,
    ScrollView,
    Button,
    Alert,
  } from "react-native"
  import Constants from "expo-constants";
  import * as WebBrowser from 'expo-web-browser';
  import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    renderers
  } from 'react-native-popup-menu'
  
  

  

  const giftPage = (props) => {
    const [count, setCount] = useState(0);


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


    var testPictureData = [
      {
        title: "Main dishes",
        data: [{messageText: "pizza", websiteLink: "https://mercercook.com", imageURI: "https://firebasestorage.googleapis.com/v0/b/pay-it-forward-b148c.appspot.com/o/prefilledImages%2FallPrompts%2FTop-50-Funniest-Memes-Collection-meme-awesome.jpg?alt=media&token=c8bec5f2-60aa-4002-97ba-46b8ef0651b8"}],
      },
      {
        title: "Side dishes",
        data: [{messageText: "pizza", imageURI: "https://firebasestorage.googleapis.com/v0/b/pay-it-forward-b148c.appspot.com/o/prefilledImages%2FallPrompts%2FTop-50-Funniest-Memes-Collection-meme-awesome.jpg?alt=media&token=c8bec5f2-60aa-4002-97ba-46b8ef0651b8"}],
      },
      {
        title: "Funky dishes",
        data: [{messageText:"you're amazing", backgroundColor: "red", textColor: "white", fontFamily: "architectsDaughter"}]
      }
    ];
  
    return (

    <SafeAreaView style={styles.container}>
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
       <Text>Gifts page!</Text>
       <TouchableOpacity
       onPress={()=>{
         props.navigation.navigate("Feed")
       }}
       >
         <Text>First gift option</Text>
       </TouchableOpacity>
        </View>


        <SectionList
            sections={testPictureData}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }) => (
              <View>
              <TouchableOpacity
                onPress={() => {
                  console.log("Pressed");
                  //making the prefilled message to pass along to other screens
                  const newMessage = {} 
                 
                  // this.props.navigation.navigate("FriendsList", {
                  //   recipient: this.state.user,
                  //   message: 
                  //   {
                  //    prefilledMessage: item
                  //   },
                  // });

                  
                }}
              >
                {item.imageURI ? ( <Image style={{height: 100, width: 100}} source={{ uri: item.imageURI}} />):(<Text style={{color: item.textColor, fontSize: 20, backgroundColor: item.backgroundColor, height: 100, width: 100, fontFamily: item.fontFamily, padding: 10, alignContent: "center" }}>{item.text}</Text>)} 
                {/* tktktk--add in the if statement and make sure its image if it's not just see the text ALSO make sure even normal texts are nice looking */}
                {/* <Item title={item.text} /> */}
                {/* {console.log(item.text, item.image)} */}
                
               
                
              </TouchableOpacity>
              <Button
                  title="Open URL with Expo.WebBrowser"
                  onPress={() => WebBrowser.openBrowserAsync(item.websiteLink)}
                  
                />
              </View>
              
            )}
            renderSectionHeader={({ section: { title } }) => (
              <View>
                <Text style={styles.header}>{title}</Text>
              </View>
            )}
          />


</SafeAreaView>
      
    );
  };

  export default giftPage
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
  import { f, database, auth, storage } from "./config/config";
  import * as WebBrowser from 'expo-web-browser';
  import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    renderers
  } from 'react-native-popup-menu'
  
  
 const loadData = async () => {
    var todaysGiftsArray = []
    console.log("In the load data");
    f.database()
      .ref("Gifts/TodaysGifts")
      .once("value")
      .then(function (snapshot) {
        if (snapshot.val()) {
          console.log("We haz gifts!");
          var todaysGifts = [];
          snapshot.val().forEach((element) => {
            // console.log(element);
            todaysGiftsArray.push(element);
            // console.log(todaysPromptsArray);
          });

          var newGiftsObject = {
            title: "Today's Gifts",
            data: todaysGiftsArray
          };

          var dataArray = testPictureData

          dataArray.unshift(newGiftsObject);
          console.log("newgiftData");
          console.log(dataArray);

          return dataArray
        } else {
          console.log("Couldn't find le gifts");
        }
      });

   
  };

  var testPictureData = [
    {
      title: "Main dishes",
      data: [{messageText: "pizza", text: "test1", websiteLink: "https://mercercook.com", imageURI: "https://firebasestorage.googleapis.com/v0/b/pay-it-forward-b148c.appspot.com/o/prefilledImages%2FallPrompts%2FTop-50-Funniest-Memes-Collection-meme-awesome.jpg?alt=media&token=c8bec5f2-60aa-4002-97ba-46b8ef0651b8"}],
    },
    {
      title: "Side dishes",
      data: [{messageText: "pizza", text: "test2", imageURI: "https://firebasestorage.googleapis.com/v0/b/pay-it-forward-b148c.appspot.com/o/prefilledImages%2FallPrompts%2FTop-50-Funniest-Memes-Collection-meme-awesome.jpg?alt=media&token=c8bec5f2-60aa-4002-97ba-46b8ef0651b8"}],
    },
    {
      title: "Funky dishes",
      data: [{messageText:"you're amazing", text: "test3", backgroundColor: "red", textColor: "white", fontFamily: "architectsDaughter"}]
    }
  ];


  

  const giftPage = (props) => {
   
    var [data, setData] = useState(null)
    var[selectGift, setSelectGift] = useState(undefined)
   

    console.log("the params are" )
    console.log(props.route.params )

   
   //de)termining whether we're coming from a message page or not
   

    //tktktk

    
    React.useEffect(()=>{
    
    var todaysGiftsArray = []
    console.log("In the load data");
    f.database()
      .ref("Gifts/TodaysGifts")
      .once("value")
      .then(function (snapshot) {
        if (snapshot.val()) {
          console.log("We haz gifts!");
          var todaysGifts = [];
          snapshot.val().forEach((element) => {
            console.log(element);
            todaysGiftsArray.push(element);
            // console.log(todaysPromptsArray);
          });

          var newGiftsObject = {
            title: "Today's Gifts",
            data: todaysGiftsArray
          };

          var dataArray = testPictureData

          dataArray.unshift(newGiftsObject);
          console.log("newgiftData");
          // console.log(dataArray)

          

          setData(dataArray)
          
        } else {
          console.log("Couldn't find le gifts");
        }

      })


    }, [])

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
            sections={data}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }) => (
              <View>
              <TouchableOpacity
                onPress={() => {
                  console.log("Pressed");
                  //making the prefilled message to pass along to other screens
                  const newMessage = {} 
          

                  
                }}
              >
                {item.imageURI ? ( <Image style={{height: 100, width: 100}} source={{ uri: item.imageURI}} />):(<Text style={{color: item.textColor, fontSize: 20, backgroundColor: item.backgroundColor, height: 100, width: 100, fontFamily: item.fontFamily, padding: 10, alignContent: "center" }}>{item.text}</Text>)} 
                {/* tktktk--add in the if statement and make sure its image if it's not just see the text ALSO make sure even normal texts are nice looking */}
                {/* <Item title={item.text} /> */}
                {/* {console.log(item.text, item.image)} */}
                
               
                
              </TouchableOpacity>
              <Button
                  title={item.text}
                  onPress={() => WebBrowser.openBrowserAsync(item.websiteLink)}
                  
                />
                 <Button
                  title="Go to friendslist"
                  onPress={() => {
                  
                    if (props.route.params){
                      
                      props.route.params.selectGift(item)
                      props.navigation.goBack()
                      //tktktk
                    }
                    else {

            
                      props.navigation.navigate("FriendsList", {
                    
                        gift: item
                      });
                     }

                     

                }}
                  
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
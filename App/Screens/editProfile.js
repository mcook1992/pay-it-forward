import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { f, database, auth, storage } from "../Screens/config/config";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";

const editProfile = (props) => {
  const [name, setName] = useState(props.route.params.name);
  const userID = props.route.params.uid
  const [imageURI, setImageURI] = useState(null)
  const [imageSelectedFromDevice, setImageSelectedFromDevice] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [imageUploadingProgress, setImageUploadingProgress] = useState(null)
  const [currentMediaType, setCurrentMediaType] = useState(null)

  const updateName = (uid) => {
    f.database()
    .ref("Users/" + uid)
    .update({ name: name }, function (error) {
        if (error) {
              console.log("Oh no, an error updating unread status");
        } else {
              console.log("Great work, successfully updated status");
        }
    });
  };


      //Dealing with permissions:

  const _checkPermissions = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ camera: status });
    
        const { statusRoll } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        this.setState({ cameraRoll: statusRoll });
    
        const { contactsStatus } = await Permissions.askAsync(Permissions.CONTACTS);
        this.setState({ contactsStatus: contactsStatus });
      };

     // Dealing with images
     
  const findNewImage = async () => {
      _checkPermissions();
  
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "Images",
        allowsEditing: true,
        quality: 1,
      });
  
      console.log(result);
  
      if (!result.cancelled) {
        console.log("upload an image");
        setImageSelectedFromDevice(true)
        setImageURI(result.uri)
        
       
        uploadImage(result.uri);
      } else {
        console.log("cancelled");
      }
    };

  const uploadImage = async (uri) => {
      // var returnValue = "error";
      
    setImageUploading(true)
    console.log("Upload image called");
    
  
      var re = /(?:\.([^.]+))?$/;
      var ext = re.exec(uri)[1];
    
    setCurrentMediaType("ext")
  
      const response = await fetch(uri);
      const blob = await response.blob();
      var filePath = userID + ".profileImage." + currentMediaType;//tktktk
  
      //accessing firebase storage
      var imageUploadTask = storage
        .ref("user/" + userID + "/img/profileImage")
        .child(filePath)
        .put(blob);
  
      imageUploadTask.on(
        "state_changed",
        function (snapshot) {
          var progress = (
            (snapshot.bytesTransferred / snapshot.totalBytes) *
            100
          ).toFixed(0);
         setImageUploadingProgress(progress)
          console.log("Progress is " + progress + "% complete");
        },
        function (error) {
          console.log("Error! -- " + error);
        },
        function () {
          setImageUploadingProgress(100)
          setImageUploading(false)
          
          //taking the download URL and creating a new post with that
          imageUploadTask.snapshot.ref
            .getDownloadURL()
            .then(function (downloadURL) {
             console.log(downloadURL + " your image uploaded!")
             f.database()
            .ref("Users/" + userID)
            .update({ avatar: downloadURL });
            });
        }
      );
    };
     
     //Done dealing with images



  return (
    <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            height: 70,
            paddingTop: 30,
            backgroundColor: "white",
            borderColor: "lightgrey",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottomWidth: 0.5,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              props.navigation.goBack();
            }}
          >
            <Text style={{ paddingLeft: 10 }}>Back</Text>
          </TouchableOpacity>
          <Text>Edit Profile</Text>
          <Text style={{ width: 40 }}></Text>
        </View>
      <TextInput
      defaultValue={name}
      onChangeText={(text) => 
        setName(text)}
      >

      </TextInput>
      <Button
        onPress={() => updateName(props.route.params.uid)}
        title="Update Name"
      />
       <Button
        onPress={() => findNewImage()}
        title="Update Image"
      />
    </View>
  );
};

export default editProfile

// React Native Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
import React from "react";
import {
  Flatlist,
  Stylesheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ImageBackground
} from "react-native";
import { f, database, auth, storage } from "../App/Screens/config/config";
import { TextInput } from "react-native-gesture-handler";
import LoginForm from "../components/loginForm";
import SignUpForm from "../components/signUpForm";
import SignInTest from "../components/testSignIn";
import TestLogIn from "../components/testLogIn";

class UserAuth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authStep: 0,
      username: "",
      email: "",
      phoneNumber: "",
      password: "",
      moveScreen: false,
      // parentPostID: this.props.route.params.parentPostId
    };
  }

  componentDidMount = () => {};

  login = async () => {
    try {
      let user = await auth.signInWithEmailAndPassword(
        this.state.email,
        this.state.password
      );
    } catch (error) {
      console.log(error);
      alert(
        "There was an error when logging in. Please make sure you are using the correct email and password"
      );
    }
  };

  signUp = async (email, passcode) => {};

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
        <ImageBackground style={{height: "100%", width: "100%", justifyContent: "center"}} source={require("../assets/sarah.jpg")} resizeMode="cover"> 
          
          
        <TouchableOpacity onPress={() => this.setState({ authStep: 0 })}>
         
        </TouchableOpacity>
        {/* If they're not logged in, give them option to login or sign up */}
        {this.state.authStep == 0 ? (
          <View>
            {/* <Text>userAuth</Text> */}
            <Text style={{fontSize: 30, padding: 10, textAlign: "center"}}>Welcome to PayItForward!</Text>
         
            
            <TouchableOpacity style={{
              marginTop: 10,
              marginHorizontal: 40,
              paddingVertical: 20,
              backgroundColor: "orange",
              borderRadius: 20,
              borderColor: "grey",
              borderWidth: 1.5,
            }} 
            onPress={() => this.setState({ authStep: 1 })}>
              <Text style={{textAlign: "center", fontSize: 20}}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{
              marginTop: 10,
              marginHorizontal: 40,
              paddingVertical: 20,
              backgroundColor: "orange",
              borderRadius: 20,
              borderColor: "grey",
              borderWidth: 1.5,
            }} 
            onPress={() => this.setState({ authStep: 2 })}>
              <Text style={{textAlign: "center", fontSize: 20}}>LogIn</Text>
            </TouchableOpacity>
          </View>
        ) : // If they click login
        this.state.authStep == 1 ? (
          // <SignInTest />
          <View>
          <TestLogIn />
          </View>
        ) : (
          // <LoginForm />
          // If they click sign up
          <View>
            <SignUpForm />
          </View>
        )}
        </ImageBackground>
      </View>
    );
  }
}

export default UserAuth;

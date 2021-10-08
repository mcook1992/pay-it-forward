import React from "react";
import {
  Flatlist,
  Stylesheet,
  Text,
  View,
  Image,
  TouchableOpacity,
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
        <TouchableOpacity onPress={() => this.setState({ authStep: 0 })}>
         
        </TouchableOpacity>
        {/* If they're not logged in, give them option to login or sign up */}
        {this.state.authStep == 0 ? (
          <View>
            
            <TouchableOpacity onPress={() => this.setState({ authStep: 1 })}>
              <Text>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.setState({ authStep: 2 })}>
              <Text>LogIn</Text>
            </TouchableOpacity>
          </View>
        ) : // If they click login
        this.state.authStep == 1 ? (
          // <SignInTest />
          <TestLogIn />
        ) : (
          // <LoginForm />
          // If they click sign up
          <View>
            <SignUpForm />
          </View>
        )}
      </View>
    );
  }
}

export default UserAuth;

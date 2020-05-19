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

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      moveScreen: false,
      loading: false,
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
        <View>
          <Text>Auth step 1</Text>
          <TextInput
            placeholder="enter email address or username"
            onChangeText={(text) => this.setState({ email: text })}
          ></TextInput>
          <TextInput
            placeholder="password"
            onChangeText={(text) => this.setState({ password: text })}
          ></TextInput>
          <TouchableOpacity onPress={this.login}>
            <Text>Log In!</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default LoginForm;

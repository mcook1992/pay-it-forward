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
    }
  };

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
        {/* If they're not logged in, give them option to login or sign up */}
        {this.state.authStep == 0 ? (
          <View>
            <Text>Ternary operator equals zero</Text>
            <TouchableOpacity onPress={() => this.setState({ authStep: 1 })}>
              <Text>Log in</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.setState({ authStep: 2 })}>
              <Text>Sign Up</Text>
            </TouchableOpacity>
          </View>
        ) : // If they click login
        this.state.authStep == 1 ? (
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
        ) : (
          // If they click sign up
          <View>
            <Text>Auth step 2</Text>
          </View>
        )}
      </View>
    );
  }
}

export default UserAuth;

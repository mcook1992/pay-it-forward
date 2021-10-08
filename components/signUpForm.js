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

class SignUpForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      username: "",
      password: "",
      moveScreen: false,
      loading: false,
      // parentPostID: this.props.route.params.parentPostId
    };
  }

  componentDidMount = () => {};

  signIn = async () => {
    var that = this;
    this.setState({ loading: true });
    f.auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(function (snapshot) {
        if (snapshot.val()) {
          console.log(snapshot.val());
          that.setState({ loading: false });
        }
      })
      .catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode + " " + errorMessage);
      });
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
        <View>
          <Text>Log In Page!</Text>
          <TextInput
            placeholder="enter email address"
            onChangeText={(text) => this.setState({ email: text })}
          ></TextInput>
          <TextInput
            placeholder="password"
            onChangeText={(text) => this.setState({ password: text })}
          ></TextInput>
          <TouchableOpacity onPress={this.signIn}>
            <Text>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default SignUpForm;

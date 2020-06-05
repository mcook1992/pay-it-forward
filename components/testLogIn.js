import * as React from "react";
import {
  Text,
  View,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import * as firebase from "firebase";
import { f, database, auth, storage } from "../App/Screens/config/config";
import filterPhoneNumber from "../App/Screens/functions/filterPhoneNumber";

class TestLogIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
      phoneNumber: "",
      verificationID: "",
      message: undefined,
      firebaseConfig: f.app().options,
      recaptchaVerifier: React.createRef(),
      authStep: 0,
    };

    // const firebaseConfig = f.apps.length ? f.app().options : undefined;
    // const recaptchaVerifier = React.createRef();
  }

  componentDidMount = () => {
    Alert.alert(
      "Please read",
      "This login requires having a verification code sent to your phone for security reasons. Standard rates apply"
    );
  };

  validateEmailAddress = () => {
    console.log("Validating email address!");
  };

  render() {
    if (this.state.authStep == 0) {
      return (
        <View style={{ padding: 20, marginTop: 50 }}>
          <Text style={{ marginTop: 20 }}>Enter a username</Text>
          <TextInput
            style={{ marginVertical: 10, fontSize: 17 }}
            placeholder="type a username here"
            autoFocus
            value={this.state.username}
            onEndEditing={this.validateEmailAddress}
            onChangeText={(newUserName) => {
              this.setState({ username: newUserName });
            }}
          />
          <Text style={{ marginTop: 20 }}>Enter an email address</Text>
          <TextInput
            style={{ marginVertical: 10, fontSize: 17 }}
            placeholder="type a username here"
            autoFocus
            textContentType="emailAddress"
            value={this.state.email}
            onEndEditing={this.validateEmailAddress}
            onChangeText={(newEmail) => {
              this.setState({ email: newEmail });
            }}
          />
          <Text style={{ marginTop: 20 }}>Enter a password</Text>
          <TextInput
            style={{ marginVertical: 10, fontSize: 17 }}
            placeholder="+Type a password here"
            autoFocus
            secureTextEntry={true}
            textContentType="password"
            value={this.state.password}
            onEndEditing={this.validateEmailAddress}
            onChangeText={(newPassword) => {
              this.setState({ password: newPassword });
            }}
          />

          <Button title="Next" onPress={() => this.setState({ authStep: 1 })} />
        </View>
      );
    } else {
      return (
        <View style={{ padding: 20, marginTop: 50 }}>
          <FirebaseRecaptchaVerifierModal
            ref={this.state.recaptchaVerifier}
            firebaseConfig={this.state.firebaseConfig}
          />

          <Button title="Back" onPress={() => this.setState({ authStep: 0 })} />

          <Text style={{ marginTop: 20 }}>Enter phone number</Text>
          <TextInput
            style={{ marginVertical: 10, fontSize: 17 }}
            placeholder="+1 999 999 9999"
            id="phone-number-input"
            autoFocus
            autoCompleteType="tel"
            keyboardType="phone-pad"
            textContentType="telephoneNumber"
            value={this.state.phoneNumber}
            onChangeText={(newPhoneNumber) => {
              this.setState({ phoneNumber: newPhoneNumber });
            }}
          />
          <Button
            title="Send Verification Code"
            disabled={
              !this.state.phoneNumber ||
              !this.state.email ||
              !this.state.username ||
              !this.state.password
            }
            onPress={async () => {
              //filter the phone number to the correct format
              var filteredPhoneNumber = filterPhoneNumber(
                this.state.phoneNumber
              );

              if (filteredPhoneNumber) {
                console.log(
                  "We have a filtered phone number ... " + filteredPhoneNumber
                );

                // The FirebaseRecaptchaVerifierModal ref implements the
                // FirebaseAuthApplicationVerifier interface and can be
                // passed directly to `verifyPhoneNumber`.
                try {
                  const phoneProvider = new f.auth.PhoneAuthProvider();
                  const verificationId = await phoneProvider.verifyPhoneNumber(
                    filteredPhoneNumber,
                    this.state.recaptchaVerifier.current
                  );
                  this.setState({ verificationID: verificationId });
                  Alert.alert(
                    "Verification Code sent!",
                    "Please check your phone, then input the verification code"
                  );
                } catch (err) {
                  console.log("Recap didn't work " + err);
                  Alert.alert("Error", `Error: ${err.message}`);
                  this.setState({ phoneNumber: "" });
                }
              } else {
                //if there was a problem with the phone number, clear the screen so user can re-enter number
                console.log("No filtered phone number");
                this.setState({ phoneNumber: "" });
              }
            }}
          />
          <Text style={{ marginTop: 20 }}>Enter Verification code</Text>
          <TextInput
            style={{ marginVertical: 10, fontSize: 17 }}
            editable={!!this.state.verificationID}
            placeholder="123456"
            onChangeText={(text) => {
              this.setState({ verificationCode: text });
            }}
          />
          <Button
            title="Confirm Verification Code"
            disabled={!this.state.verificationID}
            onPress={async () => {
              var that = this;
              try {
                const credential = f.auth.PhoneAuthProvider.credential(
                  this.state.verificationID,
                  this.state.verificationCode
                );
                await f.auth().signInWithCredential(credential);

                //once we've signed in with the phone number, link the email address as well, creating an account where they can sign in with email but phone number is verified.

                var emailCredential = f.auth.EmailAuthProvider.credential(
                  that.state.email,
                  that.state.password
                );
                auth.currentUser
                  .linkWithCredential(emailCredential)
                  .then(function (usercred) {
                    if (usercred) {
                      var user = usercred.user;
                      console.log("Account linking success", user);
                      f.database()
                        .ref("Users/" + user.uid)
                        .set({
                          username: that.state.username,
                          email: that.state.email,
                          phoneNumber: that.state.phoneNumber,
                        });
                    } else {
                      console.log("Problem linking accounts");
                    }
                  })
                  .catch(function (error) {
                    console.log("Account linking error", error);
                  });

                Alert.alert("Success", "Phone authentication successful 👍");
              } catch (err) {
                Alert.alert("Error", `Error: ${err.message}`);
              }
            }}
          />
        </View>
      );
    }
  }
}

export default TestLogIn;

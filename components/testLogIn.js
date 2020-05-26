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
      phoneNumber: "",
      verificationID: "",
      message: undefined,
      firebaseConfig: f.app().options,
      recaptchaVerifier: React.createRef(),
    };

    // const firebaseConfig = f.apps.length ? f.app().options : undefined;
    // const recaptchaVerifier = React.createRef();
  }

  componentDidMount = () => {};

  render() {
    return (
      <View style={{ padding: 20, marginTop: 50 }}>
        <FirebaseRecaptchaVerifierModal
          ref={this.state.recaptchaVerifier}
          firebaseConfig={this.state.firebaseConfig}
        />
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
          disabled={!this.state.phoneNumber}
          onPress={async () => {
            //filter the phone number to the correct format
            var filteredPhoneNumber = filterPhoneNumber(this.state.phoneNumber);

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
            try {
              const credential = f.auth.PhoneAuthProvider.credential(
                this.state.verificationID,
                this.state.verificationCode
              );
              await f.auth().signInWithCredential(credential);

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

export default TestLogIn;

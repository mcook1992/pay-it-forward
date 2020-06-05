import { Alert } from "react-native";
import { f, database, auth, storage } from "../../Screens/config/config";

export default async function getUserPhoneNumberPrefix(
  userID,
  setComponentState
) {
  console.log(
    "The UID in the get phone number prefix function is... " + userID
  );
  f.database()
    .ref("/Users/" + userID)
    .once("value")
    .then(function (snapshot) {
      //if user exists
      if (snapshot.val()) {
        var userData = snapshot.val();
        var phoneNumber = userData.phoneNumber;
        //for now, set the phone number to the first four digits
        var prefix =
          phoneNumber.charAt(0) +
          phoneNumber.charAt(1) +
          phoneNumber.charAt(2) +
          phoneNumber.charAt(3) +
          phoneNumber.charAt(4);

        console.log("The prefix be ..." + prefix);
        setComponentState(prefix);
        // return prefix;
      } else {
        //can get rid of this
        console.log("user doesn't exist! Checking phone numbers");
        return false;
      }
    });
}

import { Alert } from "react-native";

export default function filterPhoneNumberForUpload(phoneNumber, numberPrefix) {
  var isAValidNumber;
  var filteredPhoneNumber = phoneNumber;

  console.log(
    "In the filter phone for upload, the prefix is ... " + numberPrefix
  );

  if (!phoneNumber) {
    Alert.alert("Error", "There was a problem with his phone number");
    return false;
  }

  for (var i = 0; i < phoneNumber.length; i++) {
    //use case for the first digit, which can equal a digit or the + sign
    if (i == 0) {
      if (
        isNaN(phoneNumber.charAt(i)) == true &&
        phoneNumber.charAt(i) != "+"
      ) {
        isAValidNumber = false;
        Alert.alert(
          "Invalid phone number",
          "The number associated with this contact is invalid. Please enter a complete, numeric phone number"
        );
        return false;
      }
    } else if (isNaN(phoneNumber.charAt(i)) == true) {
      isAValidNumber = false;
      Alert.alert(
        "Invalid phone number",
        "The number associated with this contact is invalid. Please enter a complete, numeric phone number"
      );
      return false;
    }
    //if the number meets all the criteria for a valid number
    if (i == phoneNumber.length - 1 && isAValidNumber != false) {
      isAValidNumber = true;
      console.log("We have a real number");
    }
  }

  if (isAValidNumber == true) {
    console.log("We have a valid number");
    if (phoneNumber.length == 7) {
      //if the number is just seven digits, we take the senders country code and area code and apply it to the recipient phone number
      console.log("adding an area and country code");
      filteredPhoneNumber = numberPrefix + phoneNumber;
    }

    if (phoneNumber.length == 10) {
      console.log("adding a country code");
      filteredPhoneNumber = "+" + numberPrefix.charAt(1) + phoneNumber;
    }

    if (phoneNumber.length > 10 && phoneNumber[0] != "+") {
      console.log("adding a plus sign");
      filteredPhoneNumber = "+" + phoneNumber;
    }
    console.log(filteredPhoneNumber);
    return filteredPhoneNumber;
  }
}

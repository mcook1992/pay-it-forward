import { Alert } from "react-native";

export default function filterPhoneNumber(phoneNumber) {
  var isAValidNumber;
  var filteredPhoneNumber = phoneNumber;

  if (!phoneNumber) {
    Alert.alert(
      "Please enter a phone number",
      "For security reasons, you must enter a phone number in order to use this application"
    );
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
          "Please only include a plus sign followed by your complete phone number. E.G. +15555555555"
        );
        return false;
      }
    } else if (isNaN(phoneNumber.charAt(i)) == true) {
      isAValidNumber = false;
      Alert.alert(
        "Invalid phone number",
        "Please only include a plus sign followed by your complete phone number. E.G. +15555555555"
      );
      return false;
    }
    if (i == phoneNumber.length - 1 && isAValidNumber != false) {
      isAValidNumber = true;
      console.log("We have a real number");
    }
  }

  if (isAValidNumber == true) {
    console.log("We have a valid number");
    if (phoneNumber.length < 11) {
      console.log("val less than eleven");
      Alert.alert(
        "Invalid phone number",
        "You must input a complete phone number with an an area code and country caller code. For example +15555555555"
      );
      return false;
    }

    if (phoneNumber.length > 10 && phoneNumber[0] != "+") {
      console.log("adding a plus sign");
      filteredPhoneNumber = "+" + phoneNumber;
      return filteredPhoneNumber;
    }
    console.log(filteredPhoneNumber);
    return filteredPhoneNumber;
  }
}

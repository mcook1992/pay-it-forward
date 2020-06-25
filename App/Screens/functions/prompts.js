import { f, database, auth, storage } from "../config/config";

export default async function getCompletePromptData() {
  var newPromptsObject;
  var todaysPromptsArray = [];
  var promptData = [
    {
      title: "Compliments",
      data: [
        "You're an amazing listener",
        "You're awesome",
        "You always make me smile",
      ],
    },
    {
      title: "Gratitudes",
      data: [
        "Thanks for always listening to me",
        "Thanks for being a great friend",
        "Thanks for your help during a hard time",
      ],
    },
    {
      title: "Thoughtful Messages",
      data: [
        "I'm thinking of you",
        "I hope today brings you joy",
        "Can't wait until we next see each other",
      ],
    },
    {
      title: "Messages of Love",
      data: [
        "Just wanted to say I'm grateful to have you in my life",
        "I'm so lucky to know you",
        "I love you",
      ],
    },
  ];

  database
    .ref("Prompts")
    .child("todaysPrompts")
    .once("value")
    .then(function (snapshot) {
      if (snapshot.val()) {
        console.log("We haz prompts!");
        snapshot.val().forEach((element) => {
          // console.log(element);
          todaysPromptsArray.push(element.text);
          console.log(todaysPromptsArray);
        });

        newPromptsObject = {
          title: "Today's Prompts",
          data: todaysPromptsArray,
        };
        promptData.unshift(newPromptsObject);

        return promptData;
      } else {
        console.log("Couldn't find le prompts");
        return promptData;
      }
    });

  return promptData;
}

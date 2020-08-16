export default async function (expoToken) {
  fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: expoToken,
      title: "You have a new message!",
      body: "Open the app to see who's sending love your way",
    }),
  });
}

const { Vonage } = require("@vonage/server-sdk");

const vonage = new Vonage({
  apiKey: "ff70c5ad",
  apiSecret: "40FpQ2falknqsUIb",
});

const from = "XO";
const to = "263774797392";
const text = "Message from XO";

async function sendSMS() {
  await vonage.sms
    .send({ to, from, text })
    .then((resp) => {
      console.log("Message sent successfully");
      console.log(resp);
    })
    .catch((err) => {
      console.log("There was an error sending the messages.");
      console.error(err);
    });
}

sendSMS();
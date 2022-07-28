import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config({ path: 'variables.env' });

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);


const sendSMS = (msg) => {
  client.messages
    .create({
      body: msg,
      messagingServiceSid: process.env.TWILIO_MSGSERVICE_SID, 
      to: process.env.TWILIO_MSG_TO
    })
    .then(message => console.log(`Message sent: ${message.sid}`))
    .done();
}

export default sendSMS;
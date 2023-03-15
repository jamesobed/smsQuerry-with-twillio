import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID as string;
const authToken = process.env.TWILIO_AUTH_TOKEN as string;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER as string;
const client = twilio(accountSid, authToken);

export function sendSms(phoneNumber: string, message: string): void {
  client.messages
    .create({
      body: message,
      from: twilioNumber,
      to: '+234' + phoneNumber.slice(1, phoneNumber.length),
    })
    .then((message) => console.log(`Sent message with SID: ${message.sid}`))
    .catch((error) => console.error(error));
}

import 'dotenv/config';

import { createTransport, getTestMessageUrl } from 'nodemailer';

const connection = {
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USER, // generated ethereal user
    pass: process.env.MAIL_PASS, // generated ethereal password
  },
};

const transporter = createTransport({
  host: connection.host,
  post: connection.port,
  secure: connection.secure,
  auth: connection.auth,
});

function createMail(text: string): string {
  return `
    <div style="
      border: black 1px solid;
      padding: 20px;
      font-family: sans-serif
      line-height:2
      font-size: 20px;
    ">
      <p>Hello there!</p>
      <p>${text}</p>
    </div>
  `;
}

interface Envelope {
  from: string;
  to?: string[] | null;
}
interface MailResponse {
  accepted?: string[] | null;
  rejected?: null[] | null;
  envelopeTime: number;
  messageTime: number;
  messageSize: number;
  response: string;
  envelope: Envelope;
  messageId: string;
}

export async function sendPasswordResetToken(
  resetToken: string,
  to: string
): Promise<void> {
  const info = (await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to, // list of receivers
    subject: 'Password Reset Token', // Subject line
    html: createMail(`
      Your Password Reset Token is here!
      <a href="${process.env.FRONTEND_URL}/reset?token=${resetToken}">Click here to reset</a>
    `),
  })) as MailResponse;

  // Preview only available when sending through an Ethereal account
  if (process.env.MAIL_USER.includes('ethereal.email')) {
    console.log('Preview URL: %s', getTestMessageUrl(info));
  }
}

import nodemailer from 'nodemailer';

export const sendEmail = async (to: string, html: string): Promise<void> => {
  // # Testing purposes only
  // const testAccount = await nodemailer.createTestAccount();
  // console.log('testAccount', testAccount);

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: 'mn2qojnwz6j5vinz@ethereal.email',
      pass: 'nNzfcrFHPEnuMSyKWN'
    }
  });

  const info = await transporter.sendMail({
    from: '"Fred Foo" <foo@example.com>',
    to,
    subject: 'Change Password',
    html
  });

  console.log('Message sent: %s', info.messageId);
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
};

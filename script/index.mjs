import nodemailer from 'nodemailer';

// Email configuration
export const emailConfig = {
  host: 'mail.quaval.ca',
  port: 465,
  secure: true,
  auth: {
    user: 'onlinesales@quaval.ca',
    pass: 'Ge90krrb@bb'
  }
};

// Create reusable transporter
export const transporter = nodemailer.createTransport(emailConfig);

// Verify transporter connection
export const verifyTransporter = async () => {
  try {
    await transporter.verify();
    console.log('Email transporter is ready to send messages');
    return true;
  } catch (error) {
    console.error('Email transporter verification failed:', error);
    return false;
  }
}; 

async function sendTestEmail() {
  try {
    const mailOptions = {
      from: 'Quaval Bearings <onlinesales@quaval.ca>',
      to: '101mahm0udsaad@gmail.com',
      subject: 'Test Email from Quaval Bearings',
      html: `
        <h1>Test Email</h1>
        <p>This is a test email from Quaval Bearings.</p>
        <p>If you're receiving this, the email service is working correctly!</p>
        <hr>
        <p style="color: #666; font-size: 12px;">Sent at: ${new Date().toLocaleString()}</p>
      `,
      text: 'This is a test email from Quaval Bearings. If you\'re receiving this, the email service is working correctly!'
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Preview URL:', info.preview);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}

// Run the test
sendTestEmail(); 
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

console.log('📧 [CONFIG] Email configuration loaded:', {
  host: emailConfig.host,
  port: emailConfig.port,
  secure: emailConfig.secure,
  user: emailConfig.auth.user
});

// Create reusable transporter
export const transporter = nodemailer.createTransport(emailConfig);

console.log('📧 [CONFIG] Nodemailer transporter created');

// Verify transporter connection
export const verifyTransporter = async () => {
  try {
    console.log('📧 [CONFIG] Verifying email transporter connection...');
    await transporter.verify();
    console.log('✅ [CONFIG] Email transporter is ready to send messages');
    return true;
  } catch (error) {
    console.error('❌ [CONFIG] Email transporter verification failed:', error);
    console.error('❌ [CONFIG] Connection details:', {
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      user: emailConfig.auth.user
    });
    return false;
  }
}; 
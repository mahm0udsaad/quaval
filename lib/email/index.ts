export * from './config';
export * from './service';

// Convenience export for the email service instance
import { EmailService } from './service';
export const emailService = EmailService.getInstance(); 
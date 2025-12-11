import { format } from 'date-fns';

export const EmailService = {
  /**
   * Simulates sending a registration confirmation email.
   * In a real application, this would call a backend API endpoint.
   */
  sendRegistrationSuccess: async (
    studentName: string,
    studentEmail: string,
    eventName: string,
    eventDate: string,
    eventVenue: string
  ): Promise<void> => {
    // Simulate network latency for an email service provider (e.g., SendGrid, AWS SES)
    await new Promise(resolve => setTimeout(resolve, 1000));

    const dateFormatted = format(new Date(eventDate), 'PPP p');
    
    // Construct the email body
    const emailContent = `
      ------------------------------------------------------------------
      [MOCK EMAIL SERVER] Message queued for delivery
      ------------------------------------------------------------------
      To:      ${studentName} <${studentEmail}>
      Subject: ✅ Registration Confirmed: ${eventName}
      ------------------------------------------------------------------
      
      Dear ${studentName},

      We are thrilled to confirm your registration for "${eventName}"!

      🗓️  Event Details:
      Date:  ${dateFormatted}
      📍  Venue: ${eventVenue}

      Please show this email at the entrance for admission.
      
      If you have any questions, please reply to this email.

      Best regards,
      The EventHub Team
      
      ------------------------------------------------------------------
    `;

    // Log to console to simulate the sent email
    console.log(emailContent);
    console.log(`[EmailService] ✉️ Email successfully sent to ${studentEmail}`);
  }
};
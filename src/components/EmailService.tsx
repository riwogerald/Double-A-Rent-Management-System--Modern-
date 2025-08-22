import React from 'react';

interface EmailTemplate {
  subject: string;
  body: string;
  recipients: string[];
}

export const generatePaymentReminderEmail = (tenant: any, property: any, daysOverdue: number): EmailTemplate => {
  const urgency = daysOverdue > 30 ? 'URGENT' : daysOverdue > 7 ? 'IMPORTANT' : 'REMINDER';
  
  return {
    subject: `${urgency}: Rent Payment Reminder - ${property.property_details}`,
    body: `
Dear ${tenant.name},

This is a ${urgency.toLowerCase()} reminder regarding your rent payment for ${property.property_details}.

Payment Details:
- Monthly Rent: ${property.rent_amount ? `$${property.rent_amount.toLocaleString()}` : 'N/A'}
- Days Overdue: ${daysOverdue}
- Outstanding Amount: ${property.outstanding_amount ? `$${property.outstanding_amount.toLocaleString()}` : 'N/A'}

${daysOverdue > 30 
  ? 'Your account is significantly overdue. Please contact us immediately to arrange payment and avoid further action.'
  : daysOverdue > 7
  ? 'Please arrange payment as soon as possible to avoid late fees and maintain your good standing.'
  : 'This is a friendly reminder that your rent payment is due. Please make payment at your earliest convenience.'
}

Payment Methods:
- Bank Transfer: [Bank Details]
- Mobile Money: [Mobile Money Details]
- Cash: Visit our office during business hours

If you have already made this payment, please disregard this notice and contact us with your payment confirmation.

For any questions or to arrange a payment plan, please contact us:
- Phone: +254 700 123 456
- Email: payments@doublearms.com

Thank you for your prompt attention to this matter.

Best regards,
Double A Rent Management Team
    `,
    recipients: [tenant.email].filter(Boolean)
  };
};

export const generateWelcomeEmail = (tenant: any, property: any): EmailTemplate => {
  return {
    subject: `Welcome to ${property.estate_name || 'Your New Home'}!`,
    body: `
Dear ${tenant.name},

Welcome to Double A Rent Management! We're delighted to have you as our new tenant.

Your Tenancy Details:
- Property: ${property.property_details}
- Monthly Rent: ${property.rent_amount ? `$${property.rent_amount.toLocaleString()}` : 'N/A'}
- Move-in Date: ${tenant.move_in_date || 'N/A'}
- Lease Start: ${tenant.lease_start || 'N/A'}

Important Information:
- Rent is due on the 1st of each month
- Late payments incur a 0.5% daily penalty
- Emergency contact: +254 700 123 456
- Office hours: Monday-Friday 8AM-5PM

Payment Methods:
- Bank Transfer: [Bank Details]
- Mobile Money: [Mobile Money Details]
- Cash: Visit our office

We're here to ensure you have a comfortable living experience. Please don't hesitate to contact us with any questions or concerns.

Welcome home!

Best regards,
Double A Rent Management Team
    `,
    recipients: [tenant.email].filter(Boolean)
  };
};

export const generateMaintenanceNotification = (tenant: any, property: any, maintenanceDetails: string): EmailTemplate => {
  return {
    subject: `Maintenance Notification - ${property.property_details}`,
    body: `
Dear ${tenant.name},

We wanted to inform you about upcoming maintenance work at your property: ${property.property_details}.

Maintenance Details:
${maintenanceDetails}

We will coordinate with you to schedule this work at a convenient time. Our maintenance team will:
- Provide 24-hour advance notice
- Complete work efficiently and professionally
- Clean up after completion
- Ensure minimal disruption to your routine

If you have any questions or concerns about this maintenance work, please contact us immediately.

Contact Information:
- Phone: +254 700 123 456
- Email: maintenance@doublearms.com
- Emergency: +254 700 123 457

Thank you for your cooperation.

Best regards,
Double A Rent Management Team
    `,
    recipients: [tenant.email].filter(Boolean)
  };
};

export const sendBulkEmails = async (templates: EmailTemplate[]): Promise<void> => {
  // In a real application, this would integrate with an email service like SendGrid, Mailgun, etc.
  console.log('Sending bulk emails:', templates);
  
  // For now, we'll create mailto links for each email
  templates.forEach((template, index) => {
    setTimeout(() => {
      const mailtoLink = `mailto:${template.recipients.join(',')}?subject=${encodeURIComponent(template.subject)}&body=${encodeURIComponent(template.body)}`;
      window.open(mailtoLink);
    }, index * 1000); // Stagger emails by 1 second
  });
};

interface EmailServiceProps {
  onSendEmails: (templates: EmailTemplate[]) => void;
}

const EmailService: React.FC<EmailServiceProps> = ({ onSendEmails }) => {
  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 className="font-medium text-blue-900 mb-2">Email Service</h3>
      <p className="text-sm text-blue-700 mb-3">
        Email functionality is ready for integration with your preferred email service provider.
      </p>
      <div className="text-xs text-blue-600">
        <p>Supported templates:</p>
        <ul className="list-disc list-inside mt-1">
          <li>Payment reminders</li>
          <li>Welcome messages</li>
          <li>Maintenance notifications</li>
          <li>Custom bulk emails</li>
        </ul>
      </div>
    </div>
  );
};

export default EmailService;
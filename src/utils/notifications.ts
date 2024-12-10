import nodemailer from 'nodemailer';
import { Assessment } from '../types/assessment';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
  port: parseInt(process.env.SMTP_PORT || '2525'),
  auth: {
    user: process.env.SMTP_USER || 'default_user',
    pass: process.env.SMTP_PASS || 'default_pass',
  },
});

export async function sendAssessmentNotification(
  assessment: Assessment,
  type: 'created' | 'approved' | 'denied'
) {
  const templates = {
    created: {
      subject: `New Assessment Created - ${assessment.id}`,
      text: `A new motor risk assessment has been created for ${assessment.vehicleModel} (${assessment.vehicleYear}).`,
    },
    approved: {
      subject: `Assessment Approved - ${assessment.id}`,
      text: `The motor risk assessment for ${assessment.vehicleModel} (${assessment.vehicleYear}) has been approved.`,
    },
    denied: {
      subject: `Assessment Denied - ${assessment.id}`,
      text: `The motor risk assessment for ${assessment.vehicleModel} (${assessment.vehicleYear}) has been denied.`,
    },
  };

  const template = templates[type];

  try {
    await transporter.sendMail({
      from: process.env.MAIL_FROM || 'noreply@example.com',
      to: process.env.MAIL_TO || 'admin@example.com',
      subject: template.subject,
      text: template.text,
    });
  } catch (error) {
    console.error('Failed to send email notification:', error);
  }
}
import nodemailer from 'nodemailer'

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })
}

// Email templates
const emailTemplates = {
  emailVerification: (data) => ({
    subject: 'Verify Your Email - EduJobs Connect',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #3b82f6, #22c55e); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">EduJobs Connect</h1>
        </div>
        
        <div style="padding: 40px 30px; background: #ffffff;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">Welcome, ${data.name}!</h2>
          
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
            Thank you for registering with EduJobs Connect. To complete your registration and start exploring 
            university opportunities and job vacancies, please verify your email address.
          </p>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="${data.verificationUrl}" 
               style="background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; 
                      border-radius: 8px; font-weight: bold; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            If you didn't create an account with EduJobs Connect, please ignore this email.
          </p>
          
          <p style="color: #6b7280; font-size: 14px;">
            This verification link will expire in 24 hours for security reasons.
          </p>
        </div>
        
        <div style="background: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px; margin: 0;">
            © 2024 EduJobs Connect. All rights reserved.<br>
            Kigali, Rwanda
          </p>
        </div>
      </div>
    `
  }),

  passwordReset: (data) => ({
    subject: 'Password Reset - EduJobs Connect',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #3b82f6, #22c55e); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">EduJobs Connect</h1>
        </div>
        
        <div style="padding: 40px 30px; background: #ffffff;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">Password Reset Request</h2>
          
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Hello ${data.name},
          </p>
          
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
            We received a request to reset your password for your EduJobs Connect account. 
            Click the button below to create a new password.
          </p>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="${data.resetUrl}" 
               style="background: #ef4444; color: white; padding: 15px 30px; text-decoration: none; 
                      border-radius: 8px; font-weight: bold; display: inline-block;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            If you didn't request a password reset, please ignore this email. Your password will remain unchanged.
          </p>
          
          <p style="color: #6b7280; font-size: 14px;">
            This reset link will expire in 10 minutes for security reasons.
          </p>
        </div>
        
        <div style="background: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px; margin: 0;">
            © 2024 EduJobs Connect. All rights reserved.<br>
            Kigali, Rwanda
          </p>
        </div>
      </div>
    `
  }),

  consultationConfirmation: (data) => ({
    subject: 'Consultation Request Received - EduJobs Connect',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #3b82f6, #22c55e); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">EduJobs Connect</h1>
        </div>
        
        <div style="padding: 40px 30px; background: #ffffff;">
          <h2 style="color: #1f2937; margin-bottom: 20px;">Consultation Request Received</h2>
          
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Hello ${data.name},
          </p>
          
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
            We have received your consultation request for <strong>${data.serviceType}</strong>. 
            Our expert team will review your request and get back to you within 24 hours.
          </p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0;">Request Details:</h3>
            <p style="color: #4b5563; margin: 5px 0;"><strong>Service:</strong> ${data.serviceType}</p>
            <p style="color: #4b5563; margin: 5px 0;"><strong>Subject:</strong> ${data.subject}</p>
            <p style="color: #4b5563; margin: 5px 0;"><strong>Request ID:</strong> ${data.requestId}</p>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            If you have any urgent questions, please contact us at +250 788 123 456.
          </p>
        </div>
        
        <div style="background: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px; margin: 0;">
            © 2024 EduJobs Connect. All rights reserved.<br>
            Kigali, Rwanda
          </p>
        </div>
      </div>
    `
  })
}

// Send email function
export const sendEmail = async ({ to, subject, template, data, html, text }) => {
  try {
    const transporter = createTransporter()

    let emailContent = {}

    if (template && emailTemplates[template]) {
      emailContent = emailTemplates[template](data)
    } else if (html || text) {
      emailContent = { subject, html, text }
    } else {
      throw new Error('No email content provided')
    }

    const mailOptions = {
      from: `"EduJobs Connect" <${process.env.EMAIL_USER}>`,
      to,
      subject: emailContent.subject || subject,
      html: emailContent.html,
      text: emailContent.text
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent successfully:', info.messageId)
    return info
  } catch (error) {
    console.error('Email sending failed:', error)
    throw error
  }
}

// Send bulk emails
export const sendBulkEmail = async (recipients, { subject, template, data, html, text }) => {
  try {
    const promises = recipients.map(recipient => 
      sendEmail({ 
        to: recipient, 
        subject, 
        template, 
        data: { ...data, email: recipient }, 
        html, 
        text 
      })
    )

    const results = await Promise.allSettled(promises)
    
    const successful = results.filter(result => result.status === 'fulfilled').length
    const failed = results.filter(result => result.status === 'rejected').length

    console.log(`Bulk email results: ${successful} successful, ${failed} failed`)
    
    return { successful, failed, results }
  } catch (error) {
    console.error('Bulk email sending failed:', error)
    throw error
  }
}

import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Create a transporter using nodemailer
const transporter = nodemailer.createTransport({
  host: "smtpout.secureserver.net",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function POST(req: NextRequest) {
  try {
    const { name, email, message, project } = await req.json();

    // Validate the input
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get current date and time
    const currentDate = new Date().toLocaleString("en-US", {
      timeZone: "UTC",
      dateStyle: "full",
      timeStyle: "long",
    });

    // Email options with professional HTML template styled for Gryffindors
    const mailOptions = {
      from: {
        name: "Gryffindors Web3 Solutions",
        address: process.env.EMAIL_USER as string,
      },
      to: {
        name: "Gryffindors Support Team",
        address: process.env.EMAIL_USER as string,
      },
      subject: `New Project Inquiry: ${project || "General"} from ${name}`,
      text: `
        Web3 Project Inquiry
        Date: ${currentDate}
        
        From:
        Name: ${name}
        Email: ${email}
        Project Type: ${project || "Not specified"}
        
        Message:
        ${message}
        
        Best regards,
        Gryffindors Web3 Solutions
      `,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: 'DM Sans', Arial, sans-serif;
              line-height: 1.6;
              color: #333333;
              margin: 0;
              padding: 0;
              background-color: #fbf2f1;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #841a1c;
              color: white;
              padding: 30px 20px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .logo {
              margin-bottom: 15px;
              font-size: 28px;
              font-weight: bold;
              letter-spacing: 1px;
            }
            .content {
              background-color: white;
              padding: 30px;
              border-radius: 0 0 5px 5px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .info-block {
              margin-bottom: 25px;
              padding: 20px;
              background-color: #f9f5f5;
              border-left: 4px solid #841a1c;
              border-radius: 0 5px 5px 0;
            }
            .project-type {
              display: inline-block;
              background-color: #841a1c;
              color: white;
              padding: 5px 10px;
              border-radius: 3px;
              font-size: 14px;
              margin-top: 5px;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              color: #666;
              font-size: 12px;
              padding-top: 20px;
              border-top: 1px solid #eee;
            }
            h2, h3 {
              color: #841a1c;
            }
            a {
              color: #841a1c;
              text-decoration: none;
            }
            a:hover {
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">GRYFFINDORS</div>
              <h2 style="margin: 0;">New Web3 Project Inquiry</h2>
              <p style="margin: 10px 0 0;">Received on ${currentDate}</p>
            </div>
            <div class="content">
              <div class="info-block">
                <h3 style="margin-top: 0;">Contact Information</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                <p><strong>Project Type:</strong> ${
                  project
                    ? `<span class="project-type">${project}</span>`
                    : "Not specified"
                }</p>
              </div>
              
              <div class="info-block">
                <h3 style="margin-top: 0;">Message</h3>
                <p style="white-space: pre-wrap;">${message}</p>
              </div>
              
              <div style="background-color: #f9f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                <p style="margin: 0; color: #841a1c; font-weight: bold;">Action Required:</p>
                <p style="margin: 10px 0 0;">Please respond to this inquiry within 24 hours to discuss project details and next steps.</p>
              </div>
              
              <div class="footer">
                <p>This is an automated message from your website's contact form.</p>
                <div style="margin: 15px 0;">
                  <a href="https://gryffindors.com" style="margin: 0 10px; color: #841a1c;">Website</a> | 
                  <a href="https://twitter.com/gryffindors" style="margin: 0 10px; color: #841a1c;">Twitter</a> | 
                  <a href="https://linkedin.com/company/gryffindors" style="margin: 0 10px; color: #841a1c;">LinkedIn</a>
                </div>
                <p>© ${new Date().getFullYear()} Gryffindors Web3 Solutions. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // Send an auto-response to the person who filled out the form
    const autoResponseMailOptions = {
      from: {
        name: "Gryffindors Web3 Solutions",
        address: process.env.EMAIL_USER as string,
      },
      to: {
        name: name,
        address: email,
      },
      subject: `Thank You for Contacting Gryffindors Web3 Solutions`,
      text: `
        Dear ${name},
        
        Thank you for reaching out to Gryffindors Web3 Solutions. We've received your inquiry about ${
          project || "your project"
        }.
        
        Our team will review your message and get back to you within 24-48 hours.
        
        For urgent matters, please call us at +1-234-567-8901.
        
        Best regards,
        The Gryffindors Team
      `,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: 'DM Sans', Arial, sans-serif;
              line-height: 1.6;
              color: #333333;
              margin: 0;
              padding: 0;
              background-color: #fbf2f1;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #841a1c;
              color: white;
              padding: 30px 20px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .logo {
              margin-bottom: 15px;
              font-size: 28px;
              font-weight: bold;
              letter-spacing: 1px;
            }
            .content {
              background-color: white;
              padding: 30px;
              border-radius: 0 0 5px 5px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .message {
              margin-bottom: 25px;
              line-height: 1.8;
            }
            .cta-button {
              display: inline-block;
              background-color: #841a1c;
              color: white !important;
              padding: 12px 25px;
              border-radius: 5px;
              text-decoration: none;
              font-weight: bold;
              margin: 15px 0;
            }
            .services {
              margin: 30px 0;
              padding: 20px;
              background-color: #f9f5f5;
              border-radius: 5px;
            }
            .services-list {
              display: flex;
              justify-content: space-between;
              gap: 20px;
              width: 100%;
              margin-top: 15px;
            }
            .service-tag {
              background-color: #f1e2e2;
              color: #841a1c;
              padding: 5px 12px;
              border-radius: 20px;
              font-size: 14px;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              color: #666;
              font-size: 12px;
              padding-top: 20px;
              border-top: 1px solid #eee;
            }
            h2, h3 {
              color: #841a1c;
            }
            a {
              color: #841a1c;
              text-decoration: none;
            }
            a:hover {
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">GRYFFINDORS</div>
              <h2 style="margin: 0;">Thank You for Reaching Out</h2>
            </div>
            <div class="content">
              <div class="message">
                <p>Dear ${name},</p>
                
                <p>Thank you for contacting Gryffindors Web3 Solutions. We've received your inquiry${
                  project ? ` about <strong>${project}</strong>` : ""
                } and appreciate your interest in our services.</p>
                
                <p>Our team will review your message and get back to you within 24-48 hours with a personalized response.</p>
                
                <p>In the meantime, feel free to explore our website to learn more about our work and expertise in the Web3 space.</p>
              </div>
              
              <div style="text-align: center;">
                <a href="https://gryffindors.com/portfolio" class="cta-button">View Our Portfolio</a>
              </div>
              
              <div class="services">
                <h3 style="margin-top: 0;">Our Services</h3>
                <p>We specialize in a wide range of Web3 development services:</p>
                
                <div class="services-list">
                  <span class="service-tag">Smart Contracts</span>
                  <span class="service-tag">dApp Development</span>
                  <span class="service-tag">DeFi Solutions</span>
                  <span class="service-tag">GameFi Development</span>
                </div>
              </div>
              
              <p style="margin-top: 30px;">For urgent matters, please call us at <strong>+918072105077</strong>.</p>
              
              <p>Best regards,<br>The Gryffindors Team</p>
              
              <div class="footer">
                <div style="margin: 15px 0;">
                  <a href="https://gryffindors.com" style="margin: 0 10px; color: #841a1c;">Website</a> | 
                  <a href="https://twitter.com/gryffindors" style="margin: 0 10px; color: #841a1c;">Twitter</a> | 
                  <a href="https://linkedin.com/company/gryffindors" style="margin: 0 10px; color: #841a1c;">LinkedIn</a>
                </div>
                <p>© ${new Date().getFullYear()} Gryffindors Web3 Solutions. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // Send both emails
    await Promise.all([
      transporter.sendMail(mailOptions),
      transporter.sendMail(autoResponseMailOptions),
    ]);

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

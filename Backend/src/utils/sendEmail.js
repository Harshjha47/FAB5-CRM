const nodemailer = require("nodemailer");
const emailjs = require('@emailjs/nodejs');


const SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY;
const PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY;

const sendTransactionEmail = async (type, customer, employee) => {
  try {
    let subject = "";
    let htmlContent = "";

    if (type === "DISCONNECTION") {
      subject = `Disconnection Notification`;
      htmlContent = `
        <p>Dear Sir/Madam,</p>
        <p>Greetings from FAB5 Network !!</p>
        <br/>
        <br/>
        <p>This is to acknowledge that we have received your Disconnection Service Request ${customer.circuitId} submitted through our CRM. If you wish to cancel or extend your disconnection request, kindly do that at least five days before the disconnection date.</p>
        <p>For any queries or further assistance, please feel free to write to us on crm@fab5network.com</p>
        <br/>
        <br/>
        <p>Sincerely</p>
        <p>Customer Relationship Manager</p>
        <p>FAB5 Network</p>
      `;
    } else if (type === "RETENTION") {
      subject = `Service Continuation Notification`;
      htmlContent = `
        <p>Dear Sir/Madam,</p>
        <p>Greetings from FAB5 Network !!</p>
        <br/>
        <br/>
        <p>In accordance with your request to cancel the Disconnection Service Request ${customer.circuitId} raised earlier, we're pleased to inform you that the link will remain operational and the billing will proceed as usual.</p>
        <p>For any queries or further assistance, please feel free to write to us on crm@fab5network.com</p>
        <br/>
        <p>We value your association with us and are looking forward to serving you in the future.</p>
        <br/>
        <br/>
        <p>Sincerely</p>
        <p>Customer Relationship Manager</p>
        <p>FAB5 Network</p>
      `;
    }

    const templateParams = {
      subject: subject,           
      html_content: htmlContent,  
      to_email: employee.email,   
      cc_email: process.env.OWNER_EMAIL 
    };

    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      {
        publicKey: PUBLIC_KEY,
        privateKey: PRIVATE_KEY,
      }
    );

    console.log(`✅ ${type} email sent for ${customer.circuitId}`);
  } catch (error) {
    console.error("Email Service Error:", error);
  }
};

const sendEmail = async (email, otp) => {
  try {
    const htmlContent = `
          <h2>Verification code</h2>
          <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-left: 5px solid #007bff;">
            <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #333;">
              ${otp}
            </span>
          </div>
      `;

    const templateParams = {
      subject: "Your Verification Code (OTP)",
      html_content: htmlContent,
      to_email: email
    };

    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      {
        publicKey: PUBLIC_KEY,
        privateKey: PRIVATE_KEY,
      }
    );

    return true;
  } catch (error) {
    console.error("Error sending OTP:", error);
    return false;
  }
};

module.exports = { sendEmail, sendTransactionEmail };


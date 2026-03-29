const emailjs = require("@emailjs/nodejs");
const AppError = require("../utils/AppError");
const logger = require("../utils/logger");

const EMAIL_CONFIG = {
  serviceId: process.env.EMAILJS_SERVICE_ID,
  templateId: process.env.EMAILJS_TEMPLATE_ID,
  publicKey: process.env.EMAILJS_PUBLIC_KEY,
  privateKey: process.env.EMAILJS_PRIVATE_KEY,
};

const COMPANY_NAME = process.env.COMPPANY_NAME || "FAB5 Network";
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL;
const CRM_EMAIL = process.env.CRM_EMAIL;

const missingKeys = Object.entries(EMAIL_CONFIG)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingKeys.length > 0) {
  throw new Error(
    `EmailJS config missing: ${missingKeys.join(", ")} are required`
  );
}

const sendViaEmailJS = async (subject, htmlContent, to, cc, bcc) => {
  const templateParams = {
    subject,
    htmlContent,
    to_email: Array.isArray(to) ? to.join(",") : to,
    cc_email: Array.isArray(cc) ? cc.join(",") : cc,
    bcc_email: Array.isArray(bcc) ? bcc.join(",") : bcc,
  };
  await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, {
    publicKey: PUBLIC_KEY,
    privateKey: PRIVATE_KEY,
  });
};

const sendTransactionEmail = async (type, customer, employee) => {
  let subject = "";
  let htmlContent = "";

  if (type === "DISCONNECTION") {
    subject = "Disconnection Notification";
    htmlContent = `
      <p>Dear Sir/Madam,</p>
      <p>Greetings from ${COMPANY_NAME}!!</p>
      <p>This is to acknowledge that we have received your Disconnection Request for the 
        <strong>Opportunity ID:${connection.opportunityId}</strong> submitted through the CRM.
        If you wish to cancel or extend your disconnection request, kindly do so at least 
        five days before the disconnection date.
      </p>
      <br/>
      <p>Sincerely,</p>
      <p>Customer Relationship Manager<br/>${COMPANY_NAME}</p>
    `;
  } else if (type === "RETENTION") {
    subject = "Service Continuation Notification";
    htmlContent = `
      <p>Dear Sir/Madam,</p>
      <p>Greetings from ${COMPANY_NAME}!!</p>
      <p>In accordance with your request to cancel the Disconnection of 
        <strong>Opportunity ID: ${connection.opportunityId}</strong>, we are pleased to inform you that the link 
        will remain operational and billing will proceed as usual.
      </p>
      <p>We value your association with us and look forward to serving you.</p>
      <br/>
      <p>Sincerely,</p>
      <p>Customer Relationship Manager<br/>${COMPANY_NAME}</p>
    `;
  } else if (type === "EXTENSION") {
    subject = "Disconnection Extension Notification";
    htmlContent = `
      <p>Dear Sir/Madam,</p>
      <p>Greetings from ${COMPANY_NAME}!!</p>
      <p>
        This is to acknowledge that we have received service extension of the disconnection request
        for the <strong>Opportunity ID: ${connection.opportunityId}</strong>, submitted through the CRM. If you wish to cancel or further extend
        your disconnection request, kindly do so at least five days before the final disconnection date.
      </p>
      <br/>
      <p>Earlier disconnection date: ${connection.disconnectionDate} </p>
      <p>Current disconnection date: ${connection.disconnectionDate} </p>
      <br/> 	
      <p>Sincerely,</p>
      <p>Customer Relationship Manager<br/>${COMPANY_NAME}</p>
    `
  } else {
    throw new AppError(`Unknown email type: ${type}`, 400);
  }

  try{
    await sendViaEmailJS({
      subject,
      html_content: htmlContent,
      to_email: employee.email,
      cc_email: process.env.CRM_EMAIL,
    });
    logger.info(`✅ ${type} email sent`, { type, to:employee.email });
  }catch(error){
    logger.error("Failed to send transaction email", {
      type,
      error: error.message,
    });
    throw new AppError("Failed to send transaction email", 500);
  }
};

const sendEmail = async (email, otp) => {
  const htmlContent = `
    <h2>Verification Code</h2>
    <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-left: 5px solid #007bff;">
      <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #333;">
        ${otp}
      </span>
    </div>
    <p>This code expires in 10 minutes. Do not share it with anyone.</p>
  `;
  try {
    await sendViaEmailJS({
      subject: "Your Verification Code (OTP)",
      html_content: htmlContent,
      to_email: email,
    })

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


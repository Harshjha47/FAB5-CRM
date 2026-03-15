const emailjs = require("@emailjs/nodejs");
const AppError = require("../utils/AppError");
const logger = require("../utils/logger");

const SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY;
const PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY;
const COMPANY_NAME = process.env.COMPPANY_NAME || "FAB5 Network";
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || process.env.OWNER_EMAIL;

if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY || !PRIVATE_KEY) {
  throw new Error("EmailJS config missing: EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY, EMAILJS_PRIVATE_KEY are required");
}

const sendViaEmailJS = async (templateParams) => {
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
      <p>This is to acknowledge that we have received your Disconnection Service Request 
        <strong>${customer.circuitId}</strong> submitted through our CRM.
        If you wish to cancel or extend your disconnection request, kindly do so at least 
        five days before the disconnection date.
      </p>
      <p>For any queries, please write to us at 
        <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>.
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
      <p>In accordance with your request to cancel the Disconnection Service Request 
        <strong>${customer.circuitId}</strong>, we are pleased to inform you that the link 
        will remain operational and billing will proceed as usual.
      </p>
      <p>For any queries, please write to us at 
        <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>.
      </p>
      <p>We value your association with us and look forward to serving you.</p>
      <br/>
      <p>Sincerely,</p>
      <p>Customer Relationship Manager<br/>${COMPANY_NAME}</p>
    `;
  } else {
    throw new AppError(`Unknown email type: ${type}`, 400);
  }

  try{
    await sendViaEmailJS({
      subject,
      html_content: htmlContent,
      to_email: employee.email,
      cc_email: process.env.OWNER_EMAIL,
    });
    logger.info(`✅ ${type} email sent`, { type, circuitId: customer.circuitId, to:employee.email });
  }catch(error){
    logger.error("Failed to send transaction email", {
      type,
      circuitId: customer.circuitId,
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


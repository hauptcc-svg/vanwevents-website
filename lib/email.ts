import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export interface EnquiryData {
  fullName: string;
  email: string;
  phone: string;
  cruiseInterest: string;
  cabinPreference: string;
  partySize: string;
  message: string;
}

export async function sendEnquiryEmails(data: EnquiryData) {
  const contactEmail = process.env.CONTACT_EMAIL ?? "bookings@vanwevents.co.za";

  const [businessEmail, customerEmail] = await Promise.all([
    resend.emails.send({
      from: "VanWEvents <noreply@vanwevents.co.za>",
      to: [contactEmail],
      subject: `New Cruise Enquiry – ${data.fullName} (${data.cruiseInterest})`,
      html: buildBusinessEmailHtml(data),
    }),
    resend.emails.send({
      from: "VanWEvents <noreply@vanwevents.co.za>",
      to: [data.email],
      subject: "Your cruise enquiry has been received – VanWEvents",
      html: buildCustomerEmailHtml(data),
    }),
  ]);

  return { businessEmail, customerEmail };
}

function buildBusinessEmailHtml(data: EnquiryData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { font-family: Arial, sans-serif; background: #001A4D; color: #ffffff; margin: 0; padding: 20px; }
    .card { background: #003087; border-radius: 8px; padding: 32px; max-width: 600px; margin: 0 auto; }
    .title { color: #C9A84C; font-size: 22px; font-weight: bold; margin-bottom: 24px; }
    .label { color: #C9A84C; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-top: 16px; margin-bottom: 4px; }
    .value { color: #ffffff; font-size: 15px; padding: 8px 12px; background: rgba(255,255,255,0.07); border-radius: 4px; }
    .footer { margin-top: 24px; color: rgba(255,255,255,0.5); font-size: 12px; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="title">🚢 New Cruise Enquiry</div>
    <div class="label">Full Name</div><div class="value">${data.fullName}</div>
    <div class="label">Email</div><div class="value">${data.email}</div>
    <div class="label">Phone</div><div class="value">${data.phone}</div>
    <div class="label">Cruise Interest</div><div class="value">${data.cruiseInterest}</div>
    <div class="label">Cabin Preference</div><div class="value">${data.cabinPreference}</div>
    <div class="label">Party Size</div><div class="value">${data.partySize} guests</div>
    <div class="label">Message</div><div class="value">${data.message || "No additional message provided."}</div>
    <div class="footer">VanWEvents – Premium MSC Cruise Booking · vanwevents.co.za</div>
  </div>
</body>
</html>`;
}

function buildCustomerEmailHtml(data: EnquiryData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { font-family: Arial, sans-serif; background: #001A4D; color: #ffffff; margin: 0; padding: 20px; }
    .card { background: #003087; border-radius: 8px; padding: 40px; max-width: 600px; margin: 0 auto; }
    .logo { color: #C9A84C; font-size: 24px; font-weight: bold; letter-spacing: 2px; margin-bottom: 8px; }
    .rule { width: 60px; height: 2px; background: linear-gradient(90deg, #A8873A, #E8C96A); margin-bottom: 28px; }
    .heading { font-size: 20px; font-weight: 600; margin-bottom: 16px; }
    .body { color: rgba(255,255,255,0.8); line-height: 1.7; margin-bottom: 24px; }
    .highlight { color: #C9A84C; font-weight: 600; }
    .cta { display: inline-block; padding: 12px 28px; background: linear-gradient(135deg, #A8873A, #E8C96A); color: #001A4D; font-weight: bold; font-size: 13px; letter-spacing: 1px; text-transform: uppercase; text-decoration: none; border-radius: 2px; }
    .footer { margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(201,168,76,0.2); color: rgba(255,255,255,0.4); font-size: 12px; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">VANWEVENTS</div>
    <div class="rule"></div>
    <div class="heading">Thank you, ${data.fullName.split(" ")[0]}. Your enquiry is with us.</div>
    <div class="body">
      We've received your enquiry for the <span class="highlight">${data.cruiseInterest}</span> and will be in touch within <span class="highlight">24 hours</span> with personalised pricing and availability.<br/><br/>
      Our team will reach you on <span class="highlight">${data.phone}</span> or reply to this email.
    </div>
    <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? "https://vanwevents.co.za"}" class="cta">Explore More Cruises</a>
    <div class="footer">
      VanWEvents · Authorised MSC Cruises Reseller<br/>
      vanwevents.co.za · bookings@vanwevents.co.za · +27 60 506 2333
    </div>
  </div>
</body>
</html>`;
}

# Resend Email Integration Guide

## 🎯 What This Does

Once integrated, your landing page forms will:
1. **Newsletter Signup**: Send subscriber data to your CRM + confirmation email to subscriber
2. **Contact Form**: Send inquiries to bookings@vanwevents.co.za + confirmation to visitor
3. **Email Confirmation**: Automatic responses to form submitters

---

## 🔑 Step 1: Get Your Resend API Key

1. Go to https://resend.com
2. Sign up or log in
3. Navigate to **API Keys** section
4. Click "Create API Key"
5. Name it: `MSC Cruise Landing`
6. Copy the key (starts with `re_...`)
7. **Keep this safe** - never share it publicly

---

## 🚀 Step 2: Create Vercel Environment Variables

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add new variable:
   - **Name**: `RESEND_API_KEY`
   - **Value**: Paste your Resend API key
   - **Environments**: Select all (Production, Preview, Development)
4. Click "Save"

---

## 💾 Step 3: Create the Backend Function

Create a new file in your project: `api/send-email.js`

```javascript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, name, phone, interest, message, formType } = req.body;

  try {
    if (formType === 'newsletter') {
      // Send newsletter confirmation
      await resend.emails.send({
        from: 'noreply@vanwevents.co.za',
        to: email,
        subject: 'Welcome to VanWEvents - Your MSC Cruise Journey Starts Here!',
        html: `
          <h2>Hi ${name},</h2>
          <p>Thank you for signing up! We're excited to keep you updated about our exclusive MSC cruise offerings.</p>
          <p><strong>Your Interest Level:</strong> ${interest}</p>
          <p>We'll reach out to you at <strong>${phone}</strong> with exclusive early booking offers and updates.</p>
          <p>Expect to hear from us within 24 hours!</p>
          <p>Warm regards,<br>VanWEvents Team</p>
        `,
      });

      // Send admin notification
      await resend.emails.send({
        from: 'noreply@vanwevents.co.za',
        to: 'bookings@vanwevents.co.za',
        subject: `New Newsletter Signup - ${name}`,
        html: `
          <h2>New Newsletter Subscriber</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Interest Level:</strong> ${interest}</p>
          <p>Contact them within 24 hours for best conversion!</p>
        `,
      });

      return res.status(200).json({ success: true, message: 'Newsletter signup sent' });
    }

    if (formType === 'contact') {
      // Send contact confirmation to user
      await resend.emails.send({
        from: 'noreply@vanwevents.co.za',
        to: email,
        subject: 'We received your message - VanWEvents',
        html: `
          <h2>Hi ${name},</h2>
          <p>Thank you for reaching out! We've received your message and will get back to you shortly.</p>
          <p><strong>Your Message:</strong></p>
          <p>${message}</p>
          <p>We'll contact you at <strong>${phone}</strong> within 24 business hours.</p>
          <p>Warm regards,<br>VanWEvents Team</p>
        `,
      });

      // Send contact inquiry to admin
      await resend.emails.send({
        from: 'noreply@vanwevents.co.za',
        to: 'bookings@vanwevents.co.za',
        subject: `New Inquiry from ${name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
          <p>Reply to: <strong>${email}</strong></p>
        `,
      });

      return res.status(200).json({ success: true, message: 'Contact form sent' });
    }

    return res.status(400).json({ error: 'Invalid form type' });
  } catch (error) {
    console.error('Email error:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
```

---

## 🔌 Step 4: Update Landing Page Forms

Find the form submission handlers in your HTML and update them:

**Newsletter Form:**
```javascript
const handleNewsletterSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newsletter,
        formType: 'newsletter'
      })
    });
    
    if (response.ok) {
      setNewsletterSubmitted(true);
      setTimeout(() => {
        setNewsletter({ email: '', name: '', phone: '', interest: '' });
        setNewsletterSubmitted(false);
      }, 3000);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

**Contact Form:**
```javascript
const handleContactSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...contact,
        formType: 'contact'
      })
    });
    
    if (response.ok) {
      setContactSubmitted(true);
      setTimeout(() => {
        setContact({ email: '', name: '', phone: '', message: '' });
        setContactSubmitted(false);
      }, 3000);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

---

## ✅ Step 5: Test Email Sending

1. Deploy your updated code to Vercel
2. Visit your live website
3. Fill out and submit the newsletter form
4. Check your inbox for confirmation email
5. Check bookings@vanwevents.co.za for admin notification

---

## 📊 Resend Dashboard Features

Once emails are sending:

1. **Email Analytics**: Track open rates, click rates, bounces
2. **Audience**: See all subscribers and their engagement
3. **Logs**: Debug any failed emails
4. **Templates**: Create reusable email templates for campaigns

---

## 🔒 Security Best Practices

✅ **DO:**
- Keep API key in environment variables only
- Use HTTPS for all form submissions
- Validate all form data on backend
- Set up DKIM/SPF for email authentication

❌ **DON'T:**
- Never expose API key in frontend code
- Never hardcode secrets in version control
- Don't send unsolicited emails (require opt-in)
- Don't store unencrypted form data

---

## 📧 Email Template Customization

The default emails include:
- **Subject line**: Clear and relevant
- **Personalization**: Uses subscriber's name
- **Call-to-action**: Next steps for subscriber
- **Branding**: Can be customized with your logo

---

## 🚨 Troubleshooting

| Issue | Solution |
|-------|----------|
| Emails not sending | Check RESEND_API_KEY is set in Vercel env vars |
| Emails going to spam | Add SPF/DKIM records to vanwevents.co.za |
| High bounce rate | Verify email addresses are correct |
| Slow email delivery | Normal - Resend processes within seconds |

---

## 💡 Pro Tips

1. **Segment by Interest**: Use the "Interest Level" data to send targeted offers
2. **Automate Follow-ups**: Set up automated email sequences for different interest levels
3. **Track Conversions**: Add UTM parameters to links in emails
4. **A/B Testing**: Test different subject lines to improve open rates
5. **Compliance**: Always include unsubscribe link (Resend handles this)

---

Ready to integrate? Let's do it! 🚀
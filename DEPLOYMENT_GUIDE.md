# VanWEvents MSC Cruise Landing Page - Deployment Guide

## 📋 What You Have

✅ **landing-page.html** - Complete, self-contained landing page with:
- Bold & vibrant hero section
- Cruise details and experience sections
- Pricing display ("Starting from R8,999")
- Newsletter signup form (Email, Name, Phone, Interest Level)
- FAQ section with 5 cruise FAQs
- Contact form
- Social media links (placeholders for Instagram, Facebook, TikTok)
- Fully responsive design (mobile, tablet, desktop)

---

## 🚀 Quick Deployment to Vercel

### Step 1: Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub, GitLab, Bitbucket, or email
3. Follow the onboarding steps

### Step 2: Deploy the Landing Page
**Option A: Using Vercel Web Interface (Easiest)**
1. In Vercel dashboard, click "Add New Project"
2. Click "Import Project"
3. Paste this git repo URL: `https://github.com/YOUR_USERNAME/msc-cruise-landing`
4. Click "Import"
5. Keep default settings and click "Deploy"

**Option B: Using Vercel CLI (Fastest)**
```bash
npm install -g vercel
cd /path/to/msc-cruise-landing
vercel
```
Then follow the CLI prompts.

**Option C: Direct HTML Upload (Simplest)**
1. Rename `landing-page.html` to `index.html`
2. Create a folder called `public` and place `index.html` inside
3. Push to GitHub or use Vercel's drag-and-drop deployment
4. Vercel will automatically detect and deploy

### Step 3: Connect Your Domain (vanwevents.co.za)
1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Click "Add Domain"
4. Enter `vanwevents.co.za`
5. Choose your domain registrar from the list
6. Follow the DNS configuration instructions
7. Vercel will verify and activate the domain (usually 5-48 hours)

---

## 📧 Email Integration with Resend (NEXT STEP)

The landing page currently shows form validation but doesn't send emails yet. To make the forms functional:

### What You'll Need:
1. **Resend API Key** (from your Resend dashboard at https://resend.com)
2. **Backend/Function Handler** (Node.js or Python script)

### Implementation:
We'll create a serverless function (Vercel Edge Function or Lambda) that:
- Accepts form submissions from the landing page
- Uses Resend API to send emails to bookings@vanwevents.co.za
- Logs all signups for your CRM

**This will be set up once you:**
1. Create a Resend account at https://resend.com
2. Verify your email domain (vanwevents.co.za)
3. Get your API key
4. Provide it to us for integration

---

## 🎨 Customization Guide

### Update Social Media Links
Find this section in `landing-page.html`:
```html
<a href="https://instagram.com" className="text-2xl hover:text-orange-600 transition">📱 Instagram</a>
<a href="https://facebook.com" className="text-2xl hover:text-orange-600 transition">f Facebook</a>
<a href="https://tiktok.com" className="text-2xl hover:text-orange-600 transition">🎵 TikTok</a>
```

Replace with your actual social media URLs:
```html
<a href="https://instagram.com/yourhandle" className="text-2xl hover:text-orange-600 transition">📱 Instagram</a>
<a href="https://facebook.com/yourpage" className="text-2xl hover:text-orange-600 transition">f Facebook</a>
<a href="https://tiktok.com/@yourhandle" className="text-2xl hover:text-orange-600 transition">🎵 TikTok</a>
```

### Update Pricing
Find this section:
```html
<h3 className="text-5xl font-bold mb-4">R 8,999</h3>
<p className="text-lg mb-8">per person in Inside Cabin</p>
```

Replace with your actual pricing once approved by payment gateway.

### Replace Placeholder Images
The page uses placeholder images from `placeholder.com`. Once you have MSC assets:

1. Download cruise ship images from MSC press area
2. Upload them to an image hosting service (Vercel automatically hosts images)
3. Replace these URLs in the HTML:
   - `https://via.placeholder.com/500x400/FF6B35/ffffff?text=MSC+Cruise`
   - `https://via.placeholder.com/500x400/F7931E/ffffff?text=Onboard+Experience`

### Add Your Promotional Video
Find the hero section (search for "MSC Cruise" in the HTML) and add:
```html
<video width="100%" height="auto" autoplay muted loop className="w-full h-full object-cover">
    <source src="/videos/your-promo-video.mp4" type="video/mp4">
</video>
```

### Update FAQ Answers
Find the `faqs` array in the React component (around line 90 in the script tag) and update with your specific cruise details.

---

## 📱 Testing Before Going Live

### Test on Different Devices:
1. **Desktop**: Full width, all sections visible
2. **Tablet**: Two-column layouts adapt to single column
3. **Mobile**: Responsive navigation, stacked sections
4. **Forms**: Try submitting newsletter and contact forms (they'll show success message)

### Key Testing Points:
- ✅ All links navigate correctly
- ✅ Forms show validation messages
- ✅ Social media links work (once updated)
- ✅ Images load properly
- ✅ Mobile menu toggles on small screens
- ✅ Color contrast is readable
- ✅ Videos play (once added)

---

## 🔐 Security Checklist

Before going live:
- [ ] SSL/TLS enabled (Vercel handles this automatically)
- [ ] Email sending configured with Resend
- [ ] Payment gateway credentials never shared in code
- [ ] Contact form data securely transmitted
- [ ] GDPR/Privacy policy linked (add to footer once created)
- [ ] Newsletter opt-in uses double-opt-in (Resend setting)

---

## 📊 Next Phase: Booking System

Once payment gateway is approved, we'll add:
1. Cabin selection and booking flow
2. Payment processing with PayFast/Yoco
3. Booking confirmation emails
4. Admin dashboard to manage bookings
5. Customer dashboard to view bookings

---

## 💡 Pro Tips

1. **Backup Your HTML**: Always keep a backup of the landing page before making changes
2. **Test Form Submissions**: Before launching, test that form validation works
3. **Monitor Analytics**: Once live, add Google Analytics to track visitor behavior
4. **Mobile First**: Always test mobile version first - 70%+ of cruise bookings come from mobile
5. **Keep Copy Fresh**: Update testimonials, featured experiences quarterly

---

## 📞 Support

If you need to:
- **Update content**: Edit the HTML file directly (search for the section you want to change)
- **Add new sections**: Copy an existing section and modify
- **Change colors**: Search for `#FF6B35` (orange) or `#F7931E` (gold) and replace with your brand colors
- **Troubleshoot**: Check browser console (F12) for any errors

---

## 🎯 Next Steps

1. ✅ Landing page built and ready
2. ⏳ Set up Vercel account and deploy
3. ⏳ Connect vanwevents.co.za domain
4. ⏳ Set up Resend for email handling
5. ⏳ Update social media links with your handles
6. ⏳ Replace placeholder images with MSC assets
7. ⏳ Add your promotional video
8. ⏳ Test on all devices
9. ⏳ Go live!

Ready? Let's get this live! 🚀
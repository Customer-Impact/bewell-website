# BeWell - Breathwork & Ice Bath Website

A modern, responsive website for Terry's breathwork and ice bath wellness business.

## 🌐 Live Demo

*Add your live URL here after deployment*

## 📁 Project Structure

```
├── index.html          # Homepage
├── events.html         # Events listing page
├── event-detail.html   # Individual event page
├── admin.html          # Admin dashboard
├── styles.css          # Main stylesheet
├── events.css          # Events page styles
├── admin.css           # Admin dashboard styles
├── script.js           # Main JavaScript
├── events.js           # Events page logic
├── event-detail.js     # Event detail & booking logic
├── admin.js            # Admin backend logic
├── events.json         # Sample events data
└── .github/workflows/  # GitHub Actions deployment
```

## 🚀 Quick Deployment Options

### Option 1: GitHub Pages (Free)

1. **Create a GitHub repository**
   - Go to github.com and create a new public repository
   - Name it something like `bewell-website`

2. **Upload your files**
   - Download all files from this project
   - Upload them to your GitHub repository

3. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: main → / (root)
   - Click Save

4. **Wait 2-3 minutes**
   - Your site will be live at: `https://yourusername.github.io/bewell-website`

### Option 2: Netlify (Free with Drag & Drop)

1. Go to [netlify.com](https://netlify.com) and sign up
2. Drag and drop the entire project folder onto the Netlify dashboard
3. Get an instant live URL (e.g., `random-name.netlify.app`)
4. Optional: Connect your custom domain

### Option 3: Vercel (Free)

1. Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. Import your GitHub repository
3. Deploy instantly with automatic updates on every push

## 🔐 Admin Access

The admin dashboard is located at `/admin.html`

**Default Password:** `admin123`

> ⚠️ **Important:** Change this password in production by editing `admin.js`

## ✨ Features

### Public Pages
- **Homepage** - Hero section, services, benefits, testimonials, contact form
- **Events** - Browse upcoming workshops and sessions
- **Event Details** - Full event info with booking system
- **Contact Form** - Send inquiries directly

### Admin Dashboard
- Create/Edit/Delete events
- Upload event images
- View all bookings
- Analytics overview

## 📝 Managing Events

### Via Admin Panel (Recommended)
1. Go to `/admin.html`
2. Login with password
3. Click "Create New Event"
4. Fill in event details
5. Upload an image or paste image URL
6. Save

### Via JSON File
Edit `events.json` directly:

```json
{
  "events": [
    {
      "id": "evt_001",
      "title": "Event Title",
      "description": "Full description...",
      "shortDescription": "Brief summary...",
      "date": "2026-03-22",
      "time": "09:00",
      "duration": "3 hours",
      "location": "Venue Address",
      "price": 99,
      "currency": "$",
      "capacity": 20,
      "spotsLeft": 15,
      "image": "https://example.com/image.jpg",
      "featured": true,
      "status": "active",
      "tags": ["workshop", "breathwork"]
    }
  ]
}
```

## 🎨 Customization

### Colors
Edit CSS variables in `styles.css`:

```css
:root {
  --primary-color: #0d7377;    /* Main brand color */
  --secondary-color: #32e0c4;  /* Accent color */
  --accent-color: #ff6b6b;     /* Highlight/alert color */
  /* ... */
}
```

### Content
- Update Terry's bio in `index.html`
- Modify services in the Services section
- Add real testimonials
- Update contact information

### Images
Replace placeholder images with real photos:
- Event photos should be ~800x400px
- Terry's photo in the About section
- Hero background (optional)

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## ⚡ Performance Tips

1. **Compress images** before uploading (use TinyPNG or similar)
2. **Use a CDN** for images (Cloudinary, Imgur, etc.)
3. **Enable caching** on your hosting platform
4. **Use a custom domain** for professional appearance

## 🔒 Security Notes

This is a static site with client-side storage (localStorage). For production:

1. **Change the admin password** in `admin.js`
2. **Add proper authentication** for admin access
3. **Use a real backend** for storing events and bookings
4. **Add form validation** and spam protection
5. **Use HTTPS** (all recommended hosts provide this)

## 📧 Contact Form Setup

The contact form currently shows a success modal. To make it functional:

### Option A: Netlify Forms (Easiest)
Add `netlify` attribute to the form:
```html
<form name="contact" netlify>
```

### Option B: Formspree
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

### Option C: EmailJS
Integrate EmailJS for direct email sending without backend.

## 📄 License

This project is created for Terry's BeWell business.

---

Made with ❤️ for wellness and transformation.

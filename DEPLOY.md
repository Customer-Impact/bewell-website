# 🚀 Deploy BeWell Website - Step by Step

## Fastest Option: Netlify (2 minutes)

### Step 1: Download Your Website
1. Select ALL files in this folder
2. Right-click → "Send to" → "Compressed (zipped) folder"
3. You'll get a `website terry.zip` file

### Step 2: Upload to Netlify
1. Go to **[netlify.com](https://www.netlify.com/)**
2. Click **"Add new site"** → **"Deploy manually"**
3. Drag and drop your `website terry.zip` file
4. Wait 30 seconds
5. ✅ Your site is LIVE! Copy the URL (looks like `abc123.netlify.app`)

### Step 3: Get a Custom Domain (Optional)
1. In Netlify dashboard, go to **"Domain settings"**
2. Click **"Add custom domain"**
3. Enter: `bewell-terry.com` (or whatever you want)
4. Follow their DNS instructions

---

## Free Option: GitHub Pages (5 minutes)

### Step 1: Create GitHub Account
1. Go to **[github.com](https://github.com)**
2. Sign up for free account
3. Verify your email

### Step 2: Create Repository
1. Click green **"New"** button
2. Repository name: `bewell-website`
3. Make it **Public**
4. Click **"Create repository"**

### Step 3: Upload Files
1. In your new repo, click **"uploading an existing file"**
2. Select ALL files from the `website terry` folder
3. Scroll down, click **"Commit changes"**

### Step 4: Enable GitHub Pages
1. Click **"Settings"** tab
2. In left sidebar, click **"Pages"**
3. Under "Source", select **"GitHub Actions"**
4. The workflow file is already included!
5. Go to **"Actions"** tab to see deployment progress
6. Wait 2-3 minutes
7. Your site will be at: `https://yourusername.github.io/bewell-website`

---

## 🎉 Your Site is Live!

### What You Get:
- **Homepage**: `your-site.com/index.html`
- **Events**: `your-site.com/events.html`
- **Admin**: `your-site.com/admin.html` (password: `admin123`)

### To Update Your Site Later:

**On Netlify:**
- Just drag and drop the updated zip file again

**On GitHub:**
- Upload new files to the repository
- Changes go live automatically in 2 minutes

---

## 📱 Share Your Site

Once deployed, share these links:
- **Main site**: Your Netlify/GitHub URL
- **Events page**: Your URL + `/events.html`
- **Admin panel**: Your URL + `/admin.html`

---

## ❓ Need Help?

**Common Issues:**

1. **Images not showing?**
   - Make sure you uploaded ALL files including images folder

2. **Admin not working?**
   - Password is `admin123` (can be changed in admin.js)

3. **Events not appearing?**
   - Check that `events.json` was uploaded
   - Clear browser cache (Ctrl+Shift+R)

4. **Want to add your own images?**
   - Replace image URLs in events with your own
   - Upload to Imgur or similar, copy direct link

---

## 🔄 Making Updates

### Change Text/Content:
1. Edit the HTML files
2. Re-upload to replace old files

### Add New Events:
1. Go to `/admin.html` on your live site
2. Login with password
3. Click "Create New Event"
4. Fill details and save

### Change Colors/Design:
1. Edit `styles.css`
2. Look for `--primary-color` and other CSS variables at the top
3. Change color codes
4. Re-upload

---

## 💡 Pro Tips

1. **Test locally first**: Open `index.html` in your browser before uploading
2. **Use real images**: Replace placeholder images with actual photos
3. **SEO**: Update the `<title>` and meta description in each HTML file
4. **Analytics**: Add Google Analytics tracking code in the `<head>` section
5. **Custom domain**: Both Netlify and GitHub Pages support custom domains

---

You're all set! 🎊

# Firebase Admin Portal Setup Guide

This portfolio now includes a Firebase-powered admin portal for dynamic content management.

## Quick Setup Steps

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "abhishek-portfolio")
4. Disable Google Analytics (optional for this project)
5. Click "Create project"

### 2. Enable Realtime Database
1. In Firebase Console, go to **Build > Realtime Database**
2. Click "Create Database"
3. Choose a location (closest to your users)
4. Start in **test mode** (we'll secure it later)
5. Click "Enable"

### 3. Enable Google Authentication
1. Go to **Build > Authentication**
2. Click "Get started"
3. Click on **Sign-in method** tab
4. Click **Google** from the providers list
5. Toggle "Enable"
6. Add your project support email
7. Click "Save"

### 4. Get Web App Configuration
1. Go to **Project settings** (gear icon)
2. Scroll down to "Your apps"
3. Click the web icon `</>` to add a web app
4. Enter an app nickname (e.g., "Portfolio Web")
5. Don't check "Firebase Hosting" (we use GitHub Pages)
6. Click "Register app"
7. Copy the `firebaseConfig` object

### 5. Update Firebase Config
Edit `js/firebase-config.js` and replace the placeholder values:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

### 6. Set Database Security Rules
1. Go to **Realtime Database > Rules**
2. Replace the rules with:

```json
{
  "rules": {
    ".read": true,
    ".write": "auth != null && auth.token.email == 'iosdev89310@gmail.com'",
    "messages": {
      ".write": true,
      "$messageId": {
        ".validate": "newData.hasChildren(['name', 'email', 'message', 'timestamp'])"
      }
    }
  }
}
```

3. Click "Publish"

This allows:
- Anyone can read (public portfolio)
- Only you (admin email) can write to portfolio data when signed in
- Anyone can write to the `messages` node (contact form submissions)
- Messages are validated to require name, email, message, and timestamp fields

### 7. Initialize Database with Default Data
1. Open your portfolio admin panel: `your-site.github.io/admin/`
2. Sign in with your Google account (abhishekmishra0@live.com)
3. The first time, it will load default data
4. Click "Save Changes" to write data to Firebase

## File Structure

```
portfolio/
├── index.html              # Main portfolio page
├── css/style.css           # Styles
├── js/
│   ├── script.js           # UI interactions
│   ├── firebase-config.js  # Firebase setup
│   └── data-loader.js      # Fetch & display data
├── admin/
│   ├── index.html          # Admin dashboard
│   ├── admin.css           # Admin styles
│   └── admin.js            # Admin CRUD operations
└── FIREBASE_SETUP.md       # This file
```

## Admin Panel Features

| Section | Actions |
|---------|---------|
| Profile | Edit name, title, description, contact info, social links |
| About | Edit bio paragraphs, stats, education info |
| Achievements | Add, edit, delete, reorder achievements |
| Certifications | Add, edit, delete certifications |
| Skills | Add/remove skill tags by category |
| Experience | Add, edit, delete work experience entries |
| Projects | Add, edit, delete project cards |
| Posts | Add, edit, delete LinkedIn post links |
| Messages | View, reply, mark read, delete contact messages |
| Settings | Copyright year |

## Data Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  GitHub Pages   │────▶│    Firebase     │◀────│  Admin Portal   │
│  (portfolio)    │     │  (Realtime DB)  │     │  (admin.html)   │
│                 │     │                 │     │                 │
│  - index.html   │     │  - Data storage │     │  - Google Auth  │
│  - Fetches data │     │  - Auth         │     │  - CRUD forms   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Troubleshooting

### "Permission denied" error
- Make sure you're signed in with the correct Google account
- Check that database rules use your exact email

### Data not loading
- Open browser console (F12) for errors
- Verify Firebase config values are correct
- Check that Realtime Database is enabled

### Admin login fails
- Ensure Google Authentication is enabled
- Check that the Google provider is properly configured
- Verify your email domain is allowed

## Security Notes

- Firebase config is safe to be public (it's just identification)
- Security comes from database rules (authenticated writes)
- Admin access is restricted to your specific email
- Data is cached locally for offline support

## Costs

Firebase Spark (Free) plan includes:
- 100 simultaneous connections
- 1 GB storage
- 10 GB/month download
- Unlimited authentication

This is more than enough for a personal portfolio.

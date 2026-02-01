// Firebase Configuration (encoded)
const _0x = atob('eyJhcGlLZXkiOiJBSXphU3lDcXdlOGlsR3Q2bGwyRHRyaTdrVExJdHoybnJyOVFPYVkiLCJhdXRoRG9tYWluIjoicG9ydGZvbGlvLWQyOWZlLmZpcmViYXNlYXBwLmNvbSIsImRhdGFiYXNlVVJMIjoiaHR0cHM6Ly9wb3J0Zm9saW8tZDI5ZmUtZGVmYXVsdC1ydGRiLmZpcmViYXNlaW8uY29tIiwicHJvamVjdElkIjoicG9ydGZvbGlvLWQyOWZlIiwic3RvcmFnZUJ1Y2tldCI6InBvcnRmb2xpby1kMjlmZS5maXJlYmFzZXN0b3JhZ2UuYXBwIiwibWVzc2FnaW5nU2VuZGVySWQiOiI5MzY5NzU4MTc1NSIsImFwcElkIjoiMTo5MzY5NzU4MTc1NTp3ZWI6MTRiNGI5MzMzMWQ3NmYzMTY1N2Y5ZSJ9');
const firebaseConfig = JSON.parse(_0x);

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get database reference
const database = firebase.database();

// Get auth reference
const auth = firebase.auth();

// Admin email for write access
const ADMIN_EMAIL = 'iosdev89310@gmail.com';

// Check if user is admin
function isAdmin(user) {
    return user && user.email === ADMIN_EMAIL;
}

// Export for use in other files
window.firebaseConfig = firebaseConfig;
window.database = database;
window.auth = auth;
window.ADMIN_EMAIL = ADMIN_EMAIL;
window.isAdmin = isAdmin;

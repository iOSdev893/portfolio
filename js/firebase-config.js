// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCqwe8ilGt6ll2Dtri7kTLItz2nrr9QOaY",
    authDomain: "portfolio-d29fe.firebaseapp.com",
    databaseURL: "https://portfolio-d29fe-default-rtdb.firebaseio.com",
    projectId: "portfolio-d29fe",
    storageBucket: "portfolio-d29fe.firebasestorage.app",
    messagingSenderId: "93697581755",
    appId: "1:93697581755:web:14b4b93331d76f31657f9e"
};

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

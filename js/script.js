// Mobile Navigation Toggle
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.05)';
    }

    lastScroll = currentScroll;
});

// Active navigation link on scroll
const sections = document.querySelectorAll('section[id]');

function highlightNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
}

window.addEventListener('scroll', highlightNavLink);

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form submission handler with Firebase
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const submitBtn = document.getElementById('contact-submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !message) {
            alert('Please fill in all fields.');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            return;
        }

        const messageData = {
            name: name,
            email: email,
            message: message,
            timestamp: new Date().toISOString(),
            read: false
        };

        database.ref('messages').push(messageData)
            .then(() => {
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                try { if (window.trackEvent) trackEvent('contact_form_submit'); } catch(e) {}
                alert('Thank you! Your message has been sent successfully.');
            })
            .catch((error) => {
                console.error('Error sending message:', error);
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                alert('Oops! Something went wrong. Please try again or email directly.');
            });
    });
}

// Intersection Observer for animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.skill-category, .timeline-item, .project-card, .info-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Add animation class styles
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// Typing effect for hero title (optional enhancement)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// Theme Configuration
const themes = {
    neon: {
        name: 'neon',
        icon: 'fa-moon',  // Show moon to indicate "switch to professional/light"
        profileImage: 'images/profile.png'
    },
    professional: {
        name: 'professional',
        icon: 'fa-sun',   // Show sun to indicate "switch to neon/dark"
        profileImage: 'images/profile-pro.png'
    }
};

// Initialize theme from localStorage or default to neon
function initTheme() {
    const savedTheme = localStorage.getItem('portfolio-theme') || 'neon';
    applyTheme(savedTheme, false);
}

// Apply theme
function applyTheme(themeName, animate = true) {
    const theme = themes[themeName];
    const profileImage = document.getElementById('profile-image');
    const themeIcon = document.getElementById('theme-icon');
    const html = document.documentElement;

    if (themeName === 'professional') {
        html.setAttribute('data-theme', 'professional');
    } else {
        html.removeAttribute('data-theme');
    }

    // Update profile image with animation
    if (profileImage) {
        if (animate) {
            profileImage.style.opacity = '0';
            profileImage.style.transform = 'scale(0.8) rotate(-10deg)';
            setTimeout(() => {
                profileImage.src = theme.profileImage;
                profileImage.style.opacity = '1';
                profileImage.style.transform = 'scale(1) rotate(0deg)';
            }, 300);
        } else {
            profileImage.src = theme.profileImage;
        }
    }

    // Update toggle icon (show icon for current theme)
    if (themeIcon) {
        themeIcon.className = `fas ${theme.icon}`;
    }

    // Save preference
    localStorage.setItem('portfolio-theme', themeName);

    // Track theme change
    if (animate && window.trackEvent) {
        trackEvent('theme_change', { theme: themeName });
    }
}

// Toggle theme
function toggleTheme() {
    const currentTheme = localStorage.getItem('portfolio-theme') || 'neon';
    const newTheme = currentTheme === 'neon' ? 'professional' : 'neon';
    applyTheme(newTheme, true);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    initTheme();

    // Theme toggle button
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Highlight current nav link
    highlightNavLink();

    // Add loaded class to body for initial animations
    document.body.classList.add('loaded');

    // Double-tap on logo to open admin panel
    const navLogo = document.querySelector('.nav-logo');
    if (navLogo) {
        navLogo.addEventListener('dblclick', (e) => {
            e.preventDefault();
            window.location.href = 'admin/';
        });
    }

    // Track resume download
    const resumeBtn = document.querySelector('a[download]');
    if (resumeBtn) {
        resumeBtn.addEventListener('click', () => {
            if (window.trackEvent) trackEvent('resume_download');
        });
    }

    // Track social link clicks
    document.querySelectorAll('.hero-social a, .footer-social a').forEach(link => {
        link.addEventListener('click', () => {
            const platform = link.getAttribute('aria-label') || 'unknown';
            if (window.trackEvent) trackEvent('social_click', { platform });
        });
    });

    // Contact form tracking is handled in the Firebase submission handler above
});

// Console greeting
console.log(`
%c Abhishek K. Mishra - Portfolio
%c Senior iOS Developer | Swift | SwiftUI | Clean Architecture

Looking for iOS development expertise? Let's connect!
Email: abhishekmishra0@live.com
LinkedIn: linkedin.com/in/mishraji89
GitHub: github.com/Abhishek89310
`,
'background: linear-gradient(135deg, #007AFF, #5856D6); color: white; padding: 10px 20px; font-size: 16px; font-weight: bold; border-radius: 5px;',
'color: #007AFF; font-size: 12px; padding: 5px 0;'
);

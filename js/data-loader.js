// Data Loader - Fetches data from Firebase and populates HTML
(function() {
    'use strict';

    // Default data (fallback if Firebase fails)
    const defaultData = {
        profile: {
            name: "Abhishek K. Mishra",
            title: "Senior iOS Developer",
            greeting: "Hello, I'm",
            description: "6+ years of experience crafting elegant iOS applications with Swift, Clean Architecture, and modern development practices.",
            email: "abhishekmishra0@live.com",
            phone: "+91 8931000201",
            linkedin: "https://linkedin.com/in/mishraji89",
            github: "https://github.com/Abhishek89310",
            resumeUrl: "resume/Abhishek_Mishra_Resume.pdf"
        },
        about: {
            bio1: "I'm a passionate <strong>Senior iOS Developer</strong> with over 6 years of hands-on experience building high-quality mobile applications. My expertise spans across <strong>Banking, Aviation, Healthcare, and Crowdfunding</strong> domains.",
            bio2: "I specialize in delivering end-to-end solutions using <strong>Swift, SwiftUI, Clean Architecture, and XCTest</strong>. I'm skilled in Agile methodologies and have a proven track record of independent project execution and team leadership.",
            yearsExperience: "6+",
            projectsDelivered: "8+",
            industryDomains: "6"
        },
        education: {
            degree: "B.Tech in Information Technology",
            institution: "B.B.D.N.I.T.M, Lucknow",
            years: "2015 - 2019",
            grade: "1st Division"
        },
        achievements: [
            { id: 1, text: "Honorary Prize at GT Hackathon 2025 (Nagarro)" },
            { id: 2, text: "Runner Up at Agility Quiz (Nagarro)" },
            { id: 3, text: "Best Mobile App Developer Award (Singsys)" },
            { id: 4, text: "Best WFH Setup Award (Singsys)" }
        ],
        certifications: [
            { id: 1, text: "Infosys Certified iOS Swift Developer" },
            { id: 2, text: "Infosys Certified Associate Mobile Developer" }
        ],
        skills: {
            languages: ["Swift", "Objective-C"],
            frameworks: ["Xcode", "SwiftUI", "UIKit", "Core Data", "Combine", "3rd-Party Libraries"],
            architecture: ["Clean Architecture", "MVVM", "MVC", "XCTest", "Unit Testing"],
            devops: ["Git", "GitHub Actions", "CI/CD", "Agile", "Jira"]
        },
        experience: [
            {
                id: 1,
                title: "Senior Engineer",
                company: "Nagarro",
                location: "Gurgaon, WFH",
                startDate: "Oct 2023",
                endDate: "Present",
                details: [
                    "Developed and maintained UI components, API frameworks, and reusable modules for Aviation domain project with scalable architecture",
                    "Implemented XCTest cases to improve code coverage, integrated GitHub Actions for CI/CD",
                    "Handled push notifications, app updates, Core Data integration, and data compression for optimized performance",
                    "Delivered 2-3 key modules with high-quality, bug-free output",
                    "Demonstrated strong leadership and collaboration skills with team members and stakeholders"
                ]
            },
            {
                id: 2,
                title: "Technology Analyst",
                company: "Infosys",
                location: "Jaipur",
                startDate: "Mar 2022",
                endDate: "Oct 2023",
                details: [
                    "Contributed to Open Banking project for a leading UK bank, collaborating with cross-functional teams",
                    "Designed, developed, and enhanced iOS applications improving digital banking experience",
                    "Managed and resolved assigned tickets ensuring timely delivery and efficient debugging",
                    "Completed multiple Infosys certifications in iOS development"
                ]
            },
            {
                id: 3,
                title: "Software Developer",
                company: "Evolko",
                location: "Lucknow",
                startDate: "Apr 2021",
                endDate: "Feb 2022",
                details: [
                    "Implemented new enhancements across multiple iOS applications",
                    "Developed scalable code using MVVM architecture pattern",
                    "Delivered key features including pool functionality in Evolko Doctor app",
                    "Served as primary point of contact for Evolko Patient app"
                ]
            },
            {
                id: 4,
                title: "iOS Developer",
                company: "Singsys",
                location: "Lucknow",
                startDate: "Aug 2019",
                endDate: "Apr 2021",
                details: [
                    "Served as developer and POC on multiple iOS development projects, delivering high-quality products",
                    "Developed custom applications for iPhone using Swift, Xcode, Interface Builder, and Instruments",
                    "Provided expert guidance to team on best software development practices and techniques",
                    "Collaborated in agile team with stand-ups, sprint planning, and code reviews",
                    "Received Best Mobile App Developer and Best WFH Setup awards"
                ]
            }
        ],
        projects: [
            {
                id: 1,
                name: "SkyBrief Pro",
                icon: "fas fa-plane",
                domain: "Aviation Domain",
                description: "Enterprise aviation app used by major airline pilots for digital flight briefing, operations support, and real-time updates.",
                technologies: ["Swift", "Core Data", "Push Notifications"]
            },
            {
                id: 2,
                name: "HSBC Banking App",
                icon: "fas fa-university",
                domain: "Banking Domain",
                description: "Banking domain application with Aadhaar and address-related modules, improving onboarding and compliance workflows.",
                technologies: ["Swift", "Open Banking", "Security"]
            },
            {
                id: 3,
                name: "Evolko Healthcare",
                icon: "fas fa-heartbeat",
                domain: "Healthcare Domain",
                description: "Doctor-patient application enabling prescription sharing, chat, video calls, and digital prescriptions (RX).",
                technologies: ["Swift", "MVVM", "Video Calling"]
            },
            {
                id: 4,
                name: "GreaActive",
                icon: "fas fa-hand-holding-usd",
                domain: "Crowdfunding Domain",
                description: "Crowdfunding platform enabling users to create campaigns, raise funds, and support causes they believe in.",
                technologies: ["Swift", "UIKit", "Payment Gateway"]
            },
            {
                id: 5,
                name: "Elephant Buy & Sell",
                icon: "fas fa-store",
                domain: "E-Commerce Domain",
                description: "Singapore-based marketplace app for buying and selling products with secure transactions and user ratings.",
                technologies: ["Swift", "REST API", "Payment Gateway"]
            },
            {
                id: 6,
                name: "Zapkad",
                icon: "fas fa-address-card",
                domain: "Digital Business Card",
                description: "Singapore-based digital business card platform with QR sharing, NFC support, OCR scanning, and enterprise card management.",
                technologies: ["Swift", "NFC", "QR Code"]
            }
        ],
        posts: [
            {
                id: 1,
                title: "StateObject vs ObservedObject",
                icon: "fas fa-eye",
                description: "When to use @StateObject vs @ObservedObject in SwiftUI - avoiding unexpected view reloads and bugs.",
                url: "https://www.linkedin.com/posts/mishraji89_swiftui-iosdev-swift-activity-7408743350054531072-e4ZZ",
                tags: ["SwiftUI", "iOS"]
            },
            {
                id: 2,
                title: "SwiftUI Property Wrappers",
                icon: "fas fa-cubes",
                description: "Understanding @Published, @StateObject, and @ObservedObject - what changed, who persists, who observes.",
                url: "https://www.linkedin.com/posts/mishraji89_swiftui-tip-activity-7407519793211158528-3mdv",
                tags: ["SwiftUI", "Swift"]
            },
            {
                id: 3,
                title: "Core Data Concurrency",
                icon: "fas fa-database",
                description: "performAndWait vs perform - choosing the right method for UI-critical vs background operations.",
                url: "https://www.linkedin.com/posts/mishraji89_swiftui-coredata-concurrency-activity-7414003494212431872-0yXm",
                tags: ["Core Data", "Concurrency"]
            },
            {
                id: 4,
                title: "Swift 6: @retroactive",
                icon: "fas fa-at",
                description: "How to use Swift 6's @retroactive attribute for protocol conformance with external types.",
                url: "https://www.linkedin.com/posts/mishraji89_swift-swiftui-iosdev-activity-7413167371449991168-zUU5",
                tags: ["Swift 6", "Tips"]
            }
        ],
        settings: {
            copyrightYear: "2026",
            formspreeEndpoint: "https://formspree.io/f/xwpkgjkr"
        }
    };

    // Cache key for localStorage
    const CACHE_KEY = 'portfolio_data_cache';
    const CACHE_EXPIRY = 1000 * 60 * 30; // 30 minutes

    // Get cached data
    function getCachedData() {
        try {
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached) {
                const { data, timestamp } = JSON.parse(cached);
                if (Date.now() - timestamp < CACHE_EXPIRY) {
                    return data;
                }
            }
        } catch (e) {
            console.warn('Error reading cache:', e);
        }
        return null;
    }

    // Set cached data
    function setCachedData(data) {
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({
                data: data,
                timestamp: Date.now()
            }));
        } catch (e) {
            console.warn('Error setting cache:', e);
        }
    }

    // Show loading state
    function showLoading() {
        document.body.classList.add('loading-data');
    }

    // Hide loading state
    function hideLoading() {
        document.body.classList.remove('loading-data');
    }

    // Populate profile section
    function populateProfile(profile) {
        if (!profile) return;

        // Hero greeting
        const heroGreeting = document.querySelector('.hero-greeting');
        if (heroGreeting) heroGreeting.textContent = profile.greeting || "Hello, I'm";

        // Hero name
        const heroName = document.querySelector('.hero-name');
        if (heroName) heroName.textContent = profile.name || "Abhishek K. Mishra";

        // Hero title
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) heroTitle.textContent = profile.title || "Senior iOS Developer";

        // Hero description
        const heroDesc = document.querySelector('.hero-description');
        if (heroDesc) heroDesc.textContent = profile.description || "";

        // Resume link
        const resumeLink = document.querySelector('.hero-buttons a[download]');
        if (resumeLink && profile.resumeUrl) {
            resumeLink.href = profile.resumeUrl;
        }

        // Social links
        const linkedinLinks = document.querySelectorAll('a[href*="linkedin"]');
        linkedinLinks.forEach(link => {
            if (profile.linkedin) link.href = profile.linkedin;
        });

        const githubLinks = document.querySelectorAll('a[href*="github"]');
        githubLinks.forEach(link => {
            if (profile.github) link.href = profile.github;
        });

        const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
        emailLinks.forEach(link => {
            if (profile.email) link.href = `mailto:${profile.email}`;
        });

        // Contact email display
        const contactEmailDisplay = document.querySelector('.contact-item a[href^="mailto:"]');
        if (contactEmailDisplay && profile.email) {
            contactEmailDisplay.textContent = profile.email;
        }

        // Phone link
        const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
        phoneLinks.forEach(link => {
            if (profile.phone) {
                link.href = `tel:${profile.phone.replace(/\s/g, '')}`;
                link.textContent = profile.phone;
            }
        });
    }

    // Populate about section
    function populateAbout(about, education) {
        if (!about) return;

        // Bio paragraphs
        const aboutParagraphs = document.querySelectorAll('.about-text p');
        if (aboutParagraphs[0] && about.bio1) aboutParagraphs[0].innerHTML = about.bio1;
        if (aboutParagraphs[1] && about.bio2) aboutParagraphs[1].innerHTML = about.bio2;

        // Stats
        const stats = document.querySelectorAll('.stat');
        if (stats[0]) {
            const num = stats[0].querySelector('.stat-number');
            if (num && about.yearsExperience) num.textContent = about.yearsExperience;
        }
        if (stats[1]) {
            const num = stats[1].querySelector('.stat-number');
            if (num && about.projectsDelivered) num.textContent = about.projectsDelivered;
        }
        if (stats[2]) {
            const num = stats[2].querySelector('.stat-number');
            if (num && about.industryDomains) num.textContent = about.industryDomains;
        }

        // Education
        if (education) {
            const eduCard = document.querySelector('.info-card:first-child');
            if (eduCard) {
                const eduContent = eduCard.querySelectorAll('p');
                if (eduContent[0]) eduContent[0].innerHTML = `<strong>${education.degree}</strong>`;
                if (eduContent[1]) eduContent[1].textContent = education.institution;
                if (eduContent[2]) eduContent[2].textContent = `${education.years} | ${education.grade}`;
            }
        }
    }

    // Populate achievements
    function populateAchievements(achievements) {
        if (!achievements || !Array.isArray(achievements)) return;

        const achievementsList = document.querySelector('.info-card:nth-child(2) ul');
        if (achievementsList) {
            achievementsList.innerHTML = achievements.map(a => `<li>${a.text}</li>`).join('');
        }
    }

    // Populate certifications
    function populateCertifications(certifications) {
        if (!certifications || !Array.isArray(certifications)) return;

        const certList = document.querySelector('.info-card:nth-child(3) ul');
        if (certList) {
            certList.innerHTML = certifications.map(c => `<li>${c.text}</li>`).join('');
        }
    }

    // Populate skills
    function populateSkills(skills) {
        if (!skills) return;

        const skillCategories = document.querySelectorAll('.skill-category');

        // Languages
        if (skillCategories[0] && skills.languages) {
            const tagsContainer = skillCategories[0].querySelector('.skill-tags');
            if (tagsContainer) {
                tagsContainer.innerHTML = skills.languages.map(s => `<span class="skill-tag">${s}</span>`).join('');
            }
        }

        // Frameworks
        if (skillCategories[1] && skills.frameworks) {
            const tagsContainer = skillCategories[1].querySelector('.skill-tags');
            if (tagsContainer) {
                tagsContainer.innerHTML = skills.frameworks.map(s => `<span class="skill-tag">${s}</span>`).join('');
            }
        }

        // Architecture
        if (skillCategories[2] && skills.architecture) {
            const tagsContainer = skillCategories[2].querySelector('.skill-tags');
            if (tagsContainer) {
                tagsContainer.innerHTML = skills.architecture.map(s => `<span class="skill-tag">${s}</span>`).join('');
            }
        }

        // DevOps
        if (skillCategories[3] && skills.devops) {
            const tagsContainer = skillCategories[3].querySelector('.skill-tags');
            if (tagsContainer) {
                tagsContainer.innerHTML = skills.devops.map(s => `<span class="skill-tag">${s}</span>`).join('');
            }
        }
    }

    // Populate experience
    function populateExperience(experience) {
        if (!experience || !Array.isArray(experience)) return;

        const timeline = document.querySelector('.timeline');
        if (!timeline) return;

        timeline.innerHTML = experience.map(exp => `
            <div class="timeline-item">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                    <div class="timeline-header">
                        <h3>${exp.title}</h3>
                        <span class="company">${exp.company}</span>
                        <span class="location">${exp.location}</span>
                        <span class="date">${exp.startDate} - ${exp.endDate}</span>
                    </div>
                    <ul class="timeline-details">
                        ${exp.details.map(d => `<li>${d}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `).join('');

        // Re-observe for animations
        observeElements();
    }

    // Populate projects
    function populateProjects(projects) {
        if (!projects || !Array.isArray(projects)) return;

        const projectsGrid = document.querySelector('.projects-grid');
        if (!projectsGrid) return;

        projectsGrid.innerHTML = projects.map(proj => `
            <div class="project-card">
                <div class="project-icon">
                    <i class="${proj.icon}"></i>
                </div>
                <h3>${proj.name}</h3>
                <p class="project-domain">${proj.domain}</p>
                <p>${proj.description}</p>
                <div class="project-tech">
                    ${proj.technologies.map(t => `<span>${t}</span>`).join('')}
                </div>
            </div>
        `).join('');

        // Re-observe for animations
        observeElements();
    }

    // Populate posts
    function populatePosts(posts) {
        if (!posts || !Array.isArray(posts)) return;

        const postsGrid = document.querySelector('.posts-grid');
        if (!postsGrid) return;

        postsGrid.innerHTML = posts.map(post => `
            <a href="${post.url}" target="_blank" rel="noopener noreferrer" class="post-card">
                <div class="post-icon">
                    <i class="${post.icon}"></i>
                </div>
                <h3>${post.title}</h3>
                <p>${post.description}</p>
                <div class="post-tags">
                    ${post.tags.map(t => `<span>${t}</span>`).join('')}
                </div>
            </a>
        `).join('');
    }

    // Populate settings
    function populateSettings(settings) {
        if (!settings) return;

        // Copyright year
        const footerCopyright = document.querySelector('.footer p');
        if (footerCopyright && settings.copyrightYear) {
            footerCopyright.innerHTML = `&copy; ${settings.copyrightYear} Abhishek K. Mishra. All rights reserved.`;
        }

        // Formspree endpoint
        const contactForm = document.getElementById('contact-form');
        if (contactForm && settings.formspreeEndpoint) {
            contactForm.action = settings.formspreeEndpoint;
        }
    }

    // Observe elements for animation
    function observeElements() {
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

        document.querySelectorAll('.skill-category, .timeline-item, .project-card, .info-card').forEach(el => {
            if (!el.classList.contains('animate-in')) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(el);
            }
        });
    }

    // Populate all sections with data
    function populateAllSections(data) {
        populateProfile(data.profile);
        populateAbout(data.about, data.education);
        populateAchievements(data.achievements);
        populateCertifications(data.certifications);
        populateSkills(data.skills);
        populateExperience(data.experience);
        populateProjects(data.projects);
        populatePosts(data.posts);
        populateSettings(data.settings);
    }

    // Fetch data from Firebase
    function fetchFromFirebase() {
        return new Promise((resolve, reject) => {
            // Check if Firebase is available
            if (typeof firebase === 'undefined' || !firebase.database) {
                reject(new Error('Firebase not available'));
                return;
            }

            const dbRef = firebase.database().ref('/');

            dbRef.once('value')
                .then(snapshot => {
                    const data = snapshot.val();
                    if (data) {
                        resolve(data);
                    } else {
                        reject(new Error('No data in Firebase'));
                    }
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    // Initialize data loading
    function initDataLoader() {
        showLoading();

        // Try to get cached data first for instant display
        const cachedData = getCachedData();
        if (cachedData) {
            console.log('Using cached data');
            populateAllSections(cachedData);
        }

        // Then try Firebase
        fetchFromFirebase()
            .then(data => {
                console.log('Data loaded from Firebase');
                populateAllSections(data);
                setCachedData(data);
                hideLoading();
            })
            .catch(error => {
                console.warn('Firebase fetch failed, using fallback:', error.message);

                // Use default data if no cache and Firebase fails
                if (!cachedData) {
                    populateAllSections(defaultData);
                }
                hideLoading();
            });
    }

    // Real-time updates listener (optional - for live preview)
    function enableRealtimeUpdates() {
        if (typeof firebase === 'undefined' || !firebase.database) return;

        const dbRef = firebase.database().ref('/');
        dbRef.on('value', snapshot => {
            const data = snapshot.val();
            if (data) {
                populateAllSections(data);
                setCachedData(data);
            }
        });
    }

    // Export functions
    window.DataLoader = {
        init: initDataLoader,
        enableRealtimeUpdates: enableRealtimeUpdates,
        populateAllSections: populateAllSections,
        defaultData: defaultData
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDataLoader);
    } else {
        initDataLoader();
    }
})();

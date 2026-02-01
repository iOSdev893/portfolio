// Admin Portal JavaScript
(function() {
    'use strict';

    // State
    let currentUser = null;
    let portfolioData = {};
    let hasUnsavedChanges = false;

    // DOM Elements
    const loginScreen = document.getElementById('login-screen');
    const adminDashboard = document.getElementById('admin-dashboard');
    const googleSignInBtn = document.getElementById('google-signin-btn');
    const signOutBtn = document.getElementById('signout-btn');
    const userEmailDisplay = document.getElementById('user-email');
    const loginError = document.getElementById('login-error');
    const saveBtn = document.getElementById('save-btn');
    const sectionTitle = document.getElementById('section-title');
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');
    const modal = document.getElementById('edit-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const toastContainer = document.getElementById('toast-container');

    // Section titles mapping
    const sectionTitles = {
        profile: 'Profile Settings',
        about: 'About Section',
        achievements: 'Achievements',
        certifications: 'Certifications',
        skills: 'Technical Skills',
        experience: 'Work Experience',
        projects: 'Featured Projects',
        posts: 'Featured Posts',
        settings: 'Site Settings'
    };

    // Initialize
    function init() {
        setupAuthStateListener();
        setupEventListeners();
    }

    // Auth State Listener
    function setupAuthStateListener() {
        auth.onAuthStateChanged(user => {
            if (user) {
                if (isAdmin(user)) {
                    currentUser = user;
                    showDashboard();
                    loadData();
                } else {
                    showError('Access denied. Only the admin can access this portal.');
                    auth.signOut();
                }
            } else {
                currentUser = null;
                showLoginScreen();
            }
        });
    }

    // Event Listeners
    function setupEventListeners() {
        // Google Sign In
        googleSignInBtn.addEventListener('click', handleGoogleSignIn);

        // Sign Out
        signOutBtn.addEventListener('click', handleSignOut);

        // Navigation
        navItems.forEach(item => {
            item.addEventListener('click', e => {
                e.preventDefault();
                const section = item.dataset.section;
                switchSection(section);
            });
        });

        // Save Button
        saveBtn.addEventListener('click', saveAllData);

        // Modal Close
        modal.querySelector('.modal-close').addEventListener('click', closeModal);
        modal.querySelector('.btn-cancel').addEventListener('click', closeModal);
        modal.addEventListener('click', e => {
            if (e.target === modal) closeModal();
        });

        // Add buttons
        document.querySelectorAll('.btn-add').forEach(btn => {
            btn.addEventListener('click', () => handleAddItem(btn.dataset.type));
        });

        // Skills tag inputs
        setupTagInputs();

        // Export/Import
        document.getElementById('export-data-btn').addEventListener('click', exportData);
        document.getElementById('import-data-btn').addEventListener('click', () => {
            document.getElementById('import-file').click();
        });
        document.getElementById('import-file').addEventListener('change', handleImport);


        // Track changes
        document.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', () => {
                hasUnsavedChanges = true;
                updateSaveButton();
            });
        });

        // Warn on unsaved changes
        window.addEventListener('beforeunload', e => {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = '';
            }
        });
    }

    // Google Sign In
    function handleGoogleSignIn() {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider).catch(error => {
            showError(error.message);
        });
    }

    // Sign Out
    function handleSignOut() {
        if (hasUnsavedChanges) {
            if (!confirm('You have unsaved changes. Are you sure you want to sign out?')) {
                return;
            }
        }
        auth.signOut();
    }

    // Show/Hide Screens
    function showLoginScreen() {
        loginScreen.classList.remove('hidden');
        adminDashboard.classList.add('hidden');
    }

    function showDashboard() {
        loginScreen.classList.add('hidden');
        adminDashboard.classList.remove('hidden');
        userEmailDisplay.textContent = currentUser.email;
    }

    function showError(message) {
        loginError.textContent = message;
        loginError.classList.remove('hidden');
    }

    // Section Navigation
    function switchSection(section) {
        navItems.forEach(item => {
            item.classList.toggle('active', item.dataset.section === section);
        });

        contentSections.forEach(s => {
            s.classList.toggle('active', s.id === `section-${section}`);
        });

        sectionTitle.textContent = sectionTitles[section] || 'Settings';
    }

    // Load Data from Firebase
    function loadData() {
        database.ref('/').once('value')
            .then(snapshot => {
                portfolioData = snapshot.val() || getDefaultData();
                populateAllForms();
                showToast('Data loaded successfully', 'success');
            })
            .catch(error => {
                console.error('Error loading data:', error);
                portfolioData = getDefaultData();
                populateAllForms();
                showToast('Using default data', 'warning');
            });
    }

    // Get Default Data
    function getDefaultData() {
        return {
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
    }

    // Populate All Forms
    function populateAllForms() {
        populateProfileForm();
        populateAboutForm();
        populateAchievementsList();
        populateCertificationsList();
        populateSkillsTags();
        populateExperienceList();
        populateProjectsList();
        populatePostsList();
        populateSettingsForm();
        hasUnsavedChanges = false;
        updateSaveButton();
    }

    // Profile Form
    function populateProfileForm() {
        const p = portfolioData.profile || {};
        document.getElementById('profile-name').value = p.name || '';
        document.getElementById('profile-title').value = p.title || '';
        document.getElementById('profile-greeting').value = p.greeting || '';
        document.getElementById('profile-description').value = p.description || '';
        document.getElementById('profile-email').value = p.email || '';
        document.getElementById('profile-phone').value = p.phone || '';
        document.getElementById('profile-linkedin').value = p.linkedin || '';
        document.getElementById('profile-github').value = p.github || '';
        document.getElementById('profile-resume').value = p.resumeUrl || '';
    }

    // About Form
    function populateAboutForm() {
        const a = portfolioData.about || {};
        const e = portfolioData.education || {};
        document.getElementById('about-bio1').value = a.bio1 || '';
        document.getElementById('about-bio2').value = a.bio2 || '';
        document.getElementById('about-years').value = a.yearsExperience || '';
        document.getElementById('about-projects').value = a.projectsDelivered || '';
        document.getElementById('about-domains').value = a.industryDomains || '';
        document.getElementById('edu-degree').value = e.degree || '';
        document.getElementById('edu-institution').value = e.institution || '';
        document.getElementById('edu-years').value = e.years || '';
        document.getElementById('edu-grade').value = e.grade || '';
    }

    // Achievements List
    function populateAchievementsList() {
        const list = document.getElementById('achievements-list');
        const achievements = portfolioData.achievements || [];
        list.innerHTML = achievements.map((a, i) => createSimpleListItem(a, i, 'achievement')).join('');
        setupListItemEvents(list, 'achievement');
    }

    // Certifications List
    function populateCertificationsList() {
        const list = document.getElementById('certifications-list');
        const certs = portfolioData.certifications || [];
        list.innerHTML = certs.map((c, i) => createSimpleListItem(c, i, 'certification')).join('');
        setupListItemEvents(list, 'certification');
    }

    // Create Simple List Item (achievement/certification)
    function createSimpleListItem(item, index, type) {
        return `
            <div class="list-item" data-index="${index}" data-type="${type}">
                <div class="drag-handle"><i class="fas fa-grip-vertical"></i></div>
                <div class="item-content">
                    <div class="item-title">${item.text || 'Untitled'}</div>
                </div>
                <div class="item-actions">
                    <button class="btn-icon edit" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon delete" title="Delete"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
    }

    // Skills Tags
    function populateSkillsTags() {
        const skills = portfolioData.skills || {};
        renderTags('skills-languages', skills.languages || [], 'languages');
        renderTags('skills-frameworks', skills.frameworks || [], 'frameworks');
        renderTags('skills-architecture', skills.architecture || [], 'architecture');
        renderTags('skills-devops', skills.devops || [], 'devops');
    }

    function renderTags(containerId, tags, category) {
        const container = document.getElementById(containerId);
        container.innerHTML = tags.map(tag => `
            <span class="tag" data-category="${category}">
                ${tag}
                <i class="fas fa-times remove-tag" data-tag="${tag}"></i>
            </span>
        `).join('');

        // Setup remove handlers
        container.querySelectorAll('.remove-tag').forEach(btn => {
            btn.addEventListener('click', () => {
                removeTag(category, btn.dataset.tag);
            });
        });
    }

    function removeTag(category, tag) {
        if (!portfolioData.skills) portfolioData.skills = {};
        if (!portfolioData.skills[category]) portfolioData.skills[category] = [];
        portfolioData.skills[category] = portfolioData.skills[category].filter(t => t !== tag);
        populateSkillsTags();
        hasUnsavedChanges = true;
        updateSaveButton();
    }

    function setupTagInputs() {
        const inputs = {
            'add-language': 'languages',
            'add-framework': 'frameworks',
            'add-architecture': 'architecture',
            'add-devops': 'devops'
        };

        Object.entries(inputs).forEach(([inputId, category]) => {
            const input = document.getElementById(inputId);
            input.addEventListener('keydown', e => {
                if (e.key === 'Enter' && input.value.trim()) {
                    e.preventDefault();
                    addTag(category, input.value.trim());
                    input.value = '';
                }
            });
        });
    }

    function addTag(category, tag) {
        if (!portfolioData.skills) portfolioData.skills = {};
        if (!portfolioData.skills[category]) portfolioData.skills[category] = [];
        if (!portfolioData.skills[category].includes(tag)) {
            portfolioData.skills[category].push(tag);
            populateSkillsTags();
            hasUnsavedChanges = true;
            updateSaveButton();
        }
    }

    // Experience List
    function populateExperienceList() {
        const list = document.getElementById('experience-list');
        const experience = portfolioData.experience || [];
        list.innerHTML = experience.map((exp, i) => `
            <div class="list-item" data-index="${i}" data-type="experience">
                <div class="drag-handle"><i class="fas fa-grip-vertical"></i></div>
                <div class="item-content">
                    <div class="item-title">${exp.title || 'Untitled'} at ${exp.company || 'Company'}</div>
                    <div class="item-subtitle">${exp.startDate || ''} - ${exp.endDate || 'Present'} | ${exp.location || ''}</div>
                </div>
                <div class="item-actions">
                    <button class="btn-icon edit" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon delete" title="Delete"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `).join('');
        setupListItemEvents(list, 'experience');
    }

    // Projects List
    function populateProjectsList() {
        const list = document.getElementById('projects-list');
        const projects = portfolioData.projects || [];
        list.innerHTML = projects.map((proj, i) => `
            <div class="list-item" data-index="${i}" data-type="project">
                <div class="drag-handle"><i class="fas fa-grip-vertical"></i></div>
                <div class="item-content">
                    <div class="item-title"><i class="${proj.icon || 'fas fa-folder'}"></i> ${proj.name || 'Untitled'}</div>
                    <div class="item-subtitle">${proj.domain || 'Domain'}</div>
                </div>
                <div class="item-actions">
                    <button class="btn-icon edit" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon delete" title="Delete"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `).join('');
        setupListItemEvents(list, 'project');
    }

    // Posts List
    function populatePostsList() {
        const list = document.getElementById('posts-list');
        const posts = portfolioData.posts || [];
        list.innerHTML = posts.map((post, i) => `
            <div class="list-item" data-index="${i}" data-type="post">
                <div class="drag-handle"><i class="fas fa-grip-vertical"></i></div>
                <div class="item-content">
                    <div class="item-title"><i class="${post.icon || 'fas fa-pen'}"></i> ${post.title || 'Untitled'}</div>
                    <div class="item-subtitle">${(post.tags || []).join(', ')}</div>
                </div>
                <div class="item-actions">
                    <button class="btn-icon edit" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon delete" title="Delete"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `).join('');
        setupListItemEvents(list, 'post');
    }

    // Settings Form
    function populateSettingsForm() {
        const s = portfolioData.settings || {};
        document.getElementById('settings-copyright').value = s.copyrightYear || '';
        document.getElementById('settings-formspree').value = s.formspreeEndpoint || '';
    }

    // Setup List Item Events
    function setupListItemEvents(list, type) {
        list.querySelectorAll('.btn-icon.edit').forEach(btn => {
            btn.addEventListener('click', () => {
                const item = btn.closest('.list-item');
                const index = parseInt(item.dataset.index);
                editItem(type, index);
            });
        });

        list.querySelectorAll('.btn-icon.delete').forEach(btn => {
            btn.addEventListener('click', () => {
                const item = btn.closest('.list-item');
                const index = parseInt(item.dataset.index);
                deleteItem(type, index);
            });
        });

        // Drag and drop
        setupDragAndDrop(list, type);
    }

    // Drag and Drop
    function setupDragAndDrop(list, type) {
        let draggedItem = null;

        list.querySelectorAll('.list-item').forEach(item => {
            item.setAttribute('draggable', true);

            item.addEventListener('dragstart', e => {
                draggedItem = item;
                item.classList.add('dragging');
            });

            item.addEventListener('dragend', () => {
                item.classList.remove('dragging');
                draggedItem = null;
                updateOrderFromDOM(list, type);
            });

            item.addEventListener('dragover', e => {
                e.preventDefault();
                const afterElement = getDragAfterElement(list, e.clientY);
                if (afterElement == null) {
                    list.appendChild(draggedItem);
                } else {
                    list.insertBefore(draggedItem, afterElement);
                }
            });
        });
    }

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.list-item:not(.dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    function updateOrderFromDOM(list, type) {
        const items = list.querySelectorAll('.list-item');
        const newOrder = [];
        const dataKey = getDataKeyForType(type);
        const originalData = portfolioData[dataKey] || [];

        items.forEach(item => {
            const index = parseInt(item.dataset.index);
            if (originalData[index]) {
                newOrder.push(originalData[index]);
            }
        });

        portfolioData[dataKey] = newOrder;
        hasUnsavedChanges = true;
        updateSaveButton();

        // Re-render to update indices
        switch(type) {
            case 'achievement': populateAchievementsList(); break;
            case 'certification': populateCertificationsList(); break;
            case 'experience': populateExperienceList(); break;
            case 'project': populateProjectsList(); break;
            case 'post': populatePostsList(); break;
        }
    }

    function getDataKeyForType(type) {
        const mapping = {
            achievement: 'achievements',
            certification: 'certifications',
            experience: 'experience',
            project: 'projects',
            post: 'posts'
        };
        return mapping[type] || type;
    }

    // Add Item
    function handleAddItem(type) {
        const dataKey = getDataKeyForType(type);
        if (!portfolioData[dataKey]) portfolioData[dataKey] = [];

        let newItem;
        switch(type) {
            case 'achievement':
            case 'certification':
                newItem = { id: Date.now(), text: '' };
                break;
            case 'experience':
                newItem = {
                    id: Date.now(),
                    title: '',
                    company: '',
                    location: '',
                    startDate: '',
                    endDate: 'Present',
                    details: []
                };
                break;
            case 'project':
                newItem = {
                    id: Date.now(),
                    name: '',
                    icon: 'fas fa-folder',
                    domain: '',
                    description: '',
                    technologies: []
                };
                break;
            case 'post':
                newItem = {
                    id: Date.now(),
                    title: '',
                    icon: 'fas fa-pen',
                    description: '',
                    url: '',
                    tags: []
                };
                break;
        }

        portfolioData[dataKey].push(newItem);
        editItem(type, portfolioData[dataKey].length - 1);
    }

    // Edit Item
    function editItem(type, index) {
        const dataKey = getDataKeyForType(type);
        const item = portfolioData[dataKey][index];
        if (!item) return;

        let formHtml = '';
        switch(type) {
            case 'achievement':
            case 'certification':
                formHtml = `
                    <div class="form-group">
                        <label>Text</label>
                        <input type="text" id="edit-text" value="${item.text || ''}">
                    </div>
                `;
                modalTitle.textContent = `Edit ${type.charAt(0).toUpperCase() + type.slice(1)}`;
                break;

            case 'experience':
                formHtml = `
                    <div class="form-group">
                        <label>Job Title</label>
                        <input type="text" id="edit-title" value="${item.title || ''}">
                    </div>
                    <div class="form-group">
                        <label>Company</label>
                        <input type="text" id="edit-company" value="${item.company || ''}">
                    </div>
                    <div class="form-group">
                        <label>Location</label>
                        <input type="text" id="edit-location" value="${item.location || ''}">
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Start Date</label>
                            <input type="text" id="edit-startDate" value="${item.startDate || ''}" placeholder="e.g., Oct 2023">
                        </div>
                        <div class="form-group">
                            <label>End Date</label>
                            <input type="text" id="edit-endDate" value="${item.endDate || ''}" placeholder="e.g., Present">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Details/Responsibilities</label>
                        <div class="details-list" id="edit-details">
                            ${(item.details || []).map((d, i) => `
                                <div class="detail-item">
                                    <input type="text" value="${d}" class="detail-input">
                                    <button class="btn-icon delete remove-detail" type="button"><i class="fas fa-times"></i></button>
                                </div>
                            `).join('')}
                        </div>
                        <button type="button" class="btn-add-detail" id="add-detail-btn">
                            <i class="fas fa-plus"></i> Add Detail
                        </button>
                    </div>
                `;
                modalTitle.textContent = 'Edit Experience';
                break;

            case 'project':
                formHtml = `
                    <div class="form-group">
                        <label>Project Name</label>
                        <input type="text" id="edit-name" value="${item.name || ''}">
                    </div>
                    <div class="form-group">
                        <label>Icon Class (Font Awesome)</label>
                        <input type="text" id="edit-icon" value="${item.icon || 'fas fa-folder'}" placeholder="e.g., fas fa-plane">
                    </div>
                    <div class="form-group">
                        <label>Domain</label>
                        <input type="text" id="edit-domain" value="${item.domain || ''}" placeholder="e.g., Aviation Domain">
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea id="edit-description" rows="3">${item.description || ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label>Technologies (comma-separated)</label>
                        <input type="text" id="edit-technologies" value="${(item.technologies || []).join(', ')}">
                    </div>
                `;
                modalTitle.textContent = 'Edit Project';
                break;

            case 'post':
                formHtml = `
                    <div class="form-group">
                        <label>Post Title</label>
                        <input type="text" id="edit-title" value="${item.title || ''}">
                    </div>
                    <div class="form-group">
                        <label>Icon Class (Font Awesome)</label>
                        <input type="text" id="edit-icon" value="${item.icon || 'fas fa-pen'}" placeholder="e.g., fas fa-eye">
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea id="edit-description" rows="3">${item.description || ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label>URL</label>
                        <input type="url" id="edit-url" value="${item.url || ''}" placeholder="https://linkedin.com/posts/...">
                    </div>
                    <div class="form-group">
                        <label>Tags (comma-separated)</label>
                        <input type="text" id="edit-tags" value="${(item.tags || []).join(', ')}">
                    </div>
                `;
                modalTitle.textContent = 'Edit Post';
                break;
        }

        modalBody.innerHTML = formHtml;
        openModal();

        // Setup detail handlers for experience
        if (type === 'experience') {
            setupDetailHandlers();
        }

        // Save handler
        modal.querySelector('.btn-confirm').onclick = () => {
            saveEditedItem(type, index);
        };
    }

    function setupDetailHandlers() {
        const addBtn = document.getElementById('add-detail-btn');
        const detailsList = document.getElementById('edit-details');

        addBtn.addEventListener('click', () => {
            const div = document.createElement('div');
            div.className = 'detail-item';
            div.innerHTML = `
                <input type="text" value="" class="detail-input">
                <button class="btn-icon delete remove-detail" type="button"><i class="fas fa-times"></i></button>
            `;
            detailsList.appendChild(div);
            div.querySelector('input').focus();
            div.querySelector('.remove-detail').addEventListener('click', () => div.remove());
        });

        detailsList.querySelectorAll('.remove-detail').forEach(btn => {
            btn.addEventListener('click', () => btn.closest('.detail-item').remove());
        });
    }

    function saveEditedItem(type, index) {
        const dataKey = getDataKeyForType(type);
        const item = portfolioData[dataKey][index];

        switch(type) {
            case 'achievement':
            case 'certification':
                item.text = document.getElementById('edit-text').value;
                break;

            case 'experience':
                item.title = document.getElementById('edit-title').value;
                item.company = document.getElementById('edit-company').value;
                item.location = document.getElementById('edit-location').value;
                item.startDate = document.getElementById('edit-startDate').value;
                item.endDate = document.getElementById('edit-endDate').value;
                item.details = [...document.querySelectorAll('.detail-input')].map(i => i.value).filter(v => v.trim());
                break;

            case 'project':
                item.name = document.getElementById('edit-name').value;
                item.icon = document.getElementById('edit-icon').value;
                item.domain = document.getElementById('edit-domain').value;
                item.description = document.getElementById('edit-description').value;
                item.technologies = document.getElementById('edit-technologies').value.split(',').map(t => t.trim()).filter(t => t);
                break;

            case 'post':
                item.title = document.getElementById('edit-title').value;
                item.icon = document.getElementById('edit-icon').value;
                item.description = document.getElementById('edit-description').value;
                item.url = document.getElementById('edit-url').value;
                item.tags = document.getElementById('edit-tags').value.split(',').map(t => t.trim()).filter(t => t);
                break;
        }

        hasUnsavedChanges = true;
        updateSaveButton();
        closeModal();

        // Re-render list
        switch(type) {
            case 'achievement': populateAchievementsList(); break;
            case 'certification': populateCertificationsList(); break;
            case 'experience': populateExperienceList(); break;
            case 'project': populateProjectsList(); break;
            case 'post': populatePostsList(); break;
        }

        showToast('Item updated', 'success');
    }

    // Delete Item
    function deleteItem(type, index) {
        if (!confirm('Are you sure you want to delete this item?')) return;

        const dataKey = getDataKeyForType(type);
        portfolioData[dataKey].splice(index, 1);
        hasUnsavedChanges = true;
        updateSaveButton();

        // Re-render list
        switch(type) {
            case 'achievement': populateAchievementsList(); break;
            case 'certification': populateCertificationsList(); break;
            case 'experience': populateExperienceList(); break;
            case 'project': populateProjectsList(); break;
            case 'post': populatePostsList(); break;
        }

        showToast('Item deleted', 'success');
    }

    // Modal Functions
    function openModal() {
        modal.classList.remove('hidden');
    }

    function closeModal() {
        modal.classList.add('hidden');
    }

    // Collect Form Data
    function collectFormData() {
        // Profile
        portfolioData.profile = {
            name: document.getElementById('profile-name').value,
            title: document.getElementById('profile-title').value,
            greeting: document.getElementById('profile-greeting').value,
            description: document.getElementById('profile-description').value,
            email: document.getElementById('profile-email').value,
            phone: document.getElementById('profile-phone').value,
            linkedin: document.getElementById('profile-linkedin').value,
            github: document.getElementById('profile-github').value,
            resumeUrl: document.getElementById('profile-resume').value
        };

        // About
        portfolioData.about = {
            bio1: document.getElementById('about-bio1').value,
            bio2: document.getElementById('about-bio2').value,
            yearsExperience: document.getElementById('about-years').value,
            projectsDelivered: document.getElementById('about-projects').value,
            industryDomains: document.getElementById('about-domains').value
        };

        // Education
        portfolioData.education = {
            degree: document.getElementById('edu-degree').value,
            institution: document.getElementById('edu-institution').value,
            years: document.getElementById('edu-years').value,
            grade: document.getElementById('edu-grade').value
        };

        // Settings
        portfolioData.settings = {
            copyrightYear: document.getElementById('settings-copyright').value,
            formspreeEndpoint: document.getElementById('settings-formspree').value
        };
    }

    // Save All Data
    function saveAllData() {
        collectFormData();
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

        database.ref('/').set(portfolioData)
            .then(() => {
                hasUnsavedChanges = false;
                updateSaveButton();
                showToast('Changes saved successfully!', 'success');
            })
            .catch(error => {
                console.error('Save error:', error);
                showToast('Error saving changes: ' + error.message, 'error');
                saveBtn.disabled = false;
                saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
            });
    }

    // Update Save Button
    function updateSaveButton() {
        if (hasUnsavedChanges) {
            saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes *';
            saveBtn.disabled = false;
        } else {
            saveBtn.innerHTML = '<i class="fas fa-save"></i> Saved';
            saveBtn.disabled = false;
        }
    }

    // Export Data
    function exportData() {
        collectFormData();
        const dataStr = JSON.stringify(portfolioData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `portfolio-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Data exported successfully', 'success');
    }

    // Import Data
    function handleImport(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                const importedData = JSON.parse(event.target.result);
                if (confirm('This will replace all current data. Continue?')) {
                    portfolioData = importedData;
                    populateAllForms();
                    hasUnsavedChanges = true;
                    updateSaveButton();
                    showToast('Data imported. Click Save to apply changes.', 'success');
                }
            } catch (error) {
                showToast('Invalid JSON file', 'error');
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    }

    // Toast Notifications
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        let icon = 'fa-info-circle';
        if (type === 'success') icon = 'fa-check-circle';
        if (type === 'error') icon = 'fa-exclamation-circle';
        if (type === 'warning') icon = 'fa-exclamation-triangle';

        toast.innerHTML = `
            <i class="fas ${icon} toast-icon"></i>
            <span class="toast-message">${message}</span>
        `;

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'toastIn 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Initialize on load
    init();
})();

/**
 * GSAP Animations for 3D Portfolio
 */

class PortfolioAnimations {
    constructor() {
        this.isInitialized = false;
        this.currentSection = 'home';
        this.animationTimeline = null;
        this.scrollTriggers = [];
        
        this.init();
    }
    
    init() {
        // Set up simplified GSAP defaults
        this.setupPageLoadAnimations();
        this.setupSectionAnimations();
        this.setupInteractiveAnimations();
        this.setupScrollAnimations();
        
        this.isInitialized = true;
    }
    
    setupPageLoadAnimations() {
        // Create master timeline for page load
        const tl = gsap.timeline();
        
        // Hide loading screen after everything is ready
        tl.to('#loading-screen', { display: 'flex' })
          .to('.section', { opacity: 0, y: 50 })
          .to('.title-line', { y: 100, opacity: 0 })
          .to('.hero-subtitle', { y: 30, opacity: 0 })
          .to('.hero-buttons', { y: 30, opacity: 0 })
          .to('#main-nav', { y: -100, opacity: 0 });
        
        this.pageLoadTimeline = tl;
    }
    
    startPageLoadAnimations() {
        if (!this.pageLoadTimeline) return;
        
        const tl = gsap.timeline();
        
        // Animate loading progress
        tl.to('.loading-progress', {
            width: '100%',
            duration: 2
        })
        // Fade out loading screen
        .to('#loading-screen', {
            opacity: 0,
            duration: 0.8,
            onComplete: () => {
                document.getElementById('loading-screen').style.display = 'none';
            }
        })
        // Animate navigation
        .fromTo('#main-nav', {
            y: -100,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            duration: 1
        })
        // Animate home section
        .to('#home', {
            opacity: 1,
            y: 0,
            duration: 1
        })
        // Animate hero title lines
        .to('.title-line', {
            y: 0,
            opacity: 1,
            duration: 1.2
        })
        // Animate subtitle and buttons
        .to('.hero-subtitle', {
            y: 0,
            opacity: 1,
            duration: 0.8
        })
        .to('.hero-buttons', {
            y: 0,
            opacity: 1,
            duration: 0.8
        });
    }
    
    setupSectionAnimations() {
        // About section animations
        this.createScrollTrigger('#about .intro-text', {
            y: 50,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power2.out"
        });
        
        this.createScrollTrigger('#about .about-content p', {
            y: 30,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out"
        });
        
        this.createScrollTrigger('.stat-item', {
            scale: 0.8,
            opacity: 0
        }, {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.7)"
        });
        
        // Skills section animations
        this.createScrollTrigger('.skill-category', {
            y: 50,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out"
        });
        
        // Animate skill progress bars
        this.createScrollTrigger('.progress-bar', {
            width: '0%'
        }, {
            width: (index, target) => target.getAttribute('data-progress') + '%',
            duration: 1.5,
            stagger: 0.1,
            ease: "power2.out"
        });
        
        // Projects section animations
        this.createScrollTrigger('.project-item', {
            y: 80,
            opacity: 0,
            rotationY: 15
        }, {
            y: 0,
            opacity: 1,
            rotationY: 0,
            duration: 1,
            stagger: 0.2,
            ease: "back.out(1.7)"
        });
        
        // Timeline animations
        this.createScrollTrigger('.timeline-item', {
            x: (index) => index % 2 === 0 ? -100 : 100,
            opacity: 0
        }, {
            x: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.3,
            ease: "power2.out"
        });
        
        // Contact section animations
        this.createScrollTrigger('.contact-info', {
            x: -50,
            opacity: 0
        }, {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: "power2.out"
        });
        
        this.createScrollTrigger('.contact-form', {
            x: 50,
            opacity: 0
        }, {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: "power2.out"
        });
        
        this.createScrollTrigger('.form-group', {
            y: 30,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out"
        });
    }
    
    createScrollTrigger(selector, fromVars, toVars) {
        const elements = document.querySelectorAll(selector);
        
        elements.forEach(element => {
            // Simple intersection observer for scroll animations
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        gsap.fromTo(entry.target, fromVars, toVars);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });
            
            observer.observe(element);
        });
    }
    
    setupInteractiveAnimations() {
        // Button hover animations
        this.animateButtons();
        
        // Navigation link animations
        this.animateNavigation();
        
        // Project item hover animations
        this.animateProjectItems();
        
        // Social link animations
        this.animateSocialLinks();
        
        // Form interactions
        this.animateFormElements();
    }
    
    animateButtons() {
        const buttons = gsap.utils.toArray('.btn-primary, .btn-secondary');
        
        buttons.forEach(button => {
            const hoverTl = gsap.timeline({ paused: true });
            
            hoverTl.to(button, {
                scale: 1.05,
                duration: 0.3,
                ease: "back.out(1.7)"
            })
            .to(button, {
                boxShadow: "0 15px 35px rgba(0, 102, 255, 0.4)",
                duration: 0.3,
                ease: "power2.out"
            }, 0);
            
            button.addEventListener('mouseenter', () => hoverTl.play());
            button.addEventListener('mouseleave', () => hoverTl.reverse());
            
            // Click animation
            button.addEventListener('click', (e) => {
                gsap.to(button, {
                    scale: 0.95,
                    duration: 0.1,
                    ease: "power2.out",
                    yoyo: true,
                    repeat: 1
                });
                
                // Ripple effect
                this.createRippleEffect(e, button);
            });
        });
    }
    
    createRippleEffect(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.3)';
        ripple.style.pointerEvents = 'none';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.width = ripple.style.height = '0px';
        
        element.appendChild(ripple);
        
        gsap.to(ripple, {
            width: size + 'px',
            height: size + 'px',
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
            onComplete: () => ripple.remove()
        });
    }
    
    animateNavigation() {
        const navLinks = gsap.utils.toArray('.nav-links a');
        
        navLinks.forEach(link => {
            const underline = link.querySelector('::after');
            
            link.addEventListener('mouseenter', () => {
                gsap.to(link, {
                    color: '#00d4ff',
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
            
            link.addEventListener('mouseleave', () => {
                if (!link.classList.contains('active')) {
                    gsap.to(link, {
                        color: '#b3b3b3',
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
            });
        });
    }
    
    animateProjectItems() {
        const projects = gsap.utils.toArray('.project-item');
        
        projects.forEach(project => {
            const overlay = project.querySelector('.project-overlay');
            const hoverTl = gsap.timeline({ paused: true });
            
            hoverTl.to(project, {
                y: -10,
                rotationY: 5,
                scale: 1.02,
                duration: 0.4,
                ease: "power2.out"
            })
            .to(overlay, {
                opacity: 1,
                duration: 0.3,
                ease: "power2.out"
            }, 0)
            .fromTo(overlay.children, {
                y: 20,
                opacity: 0
            }, {
                y: 0,
                opacity: 1,
                duration: 0.4,
                stagger: 0.1,
                ease: "back.out(1.7)"
            }, 0.1);
            
            project.addEventListener('mouseenter', () => hoverTl.play());
            project.addEventListener('mouseleave', () => hoverTl.reverse());
        });
    }
    
    animateSocialLinks() {
        const socialLinks = gsap.utils.toArray('.social-link');
        
        socialLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                gsap.to(link, {
                    y: -5,
                    scale: 1.1,
                    color: '#00d4ff',
                    borderColor: '#00d4ff',
                    duration: 0.3,
                    ease: "back.out(1.7)"
                });
            });
            
            link.addEventListener('mouseleave', () => {
                gsap.to(link, {
                    y: 0,
                    scale: 1,
                    color: '#b3b3b3',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });
    }
    
    animateFormElements() {
        const formInputs = gsap.utils.toArray('.form-group input, .form-group textarea');
        
        formInputs.forEach(input => {
            input.addEventListener('focus', () => {
                gsap.to(input, {
                    scale: 1.02,
                    borderColor: '#00d4ff',
                    boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)',
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
            
            input.addEventListener('blur', () => {
                gsap.to(input, {
                    scale: 1,
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    boxShadow: 'none',
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });
    }
    
    setupScrollAnimations() {
        // Smooth scrolling for navigation
        const navLinks = gsap.utils.toArray('.nav-links a[data-section]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSection = link.getAttribute('data-section');
                this.scrollToSection(targetSection);
            });
        });
        
        // Hero buttons scroll
        const heroButtons = gsap.utils.toArray('.hero-buttons button[data-section]');
        heroButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const targetSection = button.getAttribute('data-section');
                this.scrollToSection(targetSection);
            });
        });
        
        // Scroll indicator dots
        const scrollDots = gsap.utils.toArray('.scroll-dot');
        scrollDots.forEach(dot => {
            dot.addEventListener('click', () => {
                const targetSection = dot.getAttribute('data-section');
                this.scrollToSection(targetSection);
            });
        });
        
        // Update active section on scroll
        this.setupSectionDetection();
    }
    
    scrollToSection(sectionId) {
        const targetElement = document.getElementById(sectionId);
        if (!targetElement) return;
        
        // Update current section
        this.currentSection = sectionId;
        
        // Smooth scroll to section
        gsap.to(window, {
            duration: 1.5,
            scrollTo: {
                y: targetElement,
                offsetY: 0
            },
            ease: "power2.inOut",
            onComplete: () => {
                this.onSectionChange(sectionId);
            }
        });
        
        // Update navigation states
        this.updateNavigationStates(sectionId);
    }
    
    updateNavigationStates(activeSection) {
        // Update nav links
        const navLinks = gsap.utils.toArray('.nav-links a');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === activeSection) {
                link.classList.add('active');
            }
        });
        
        // Update scroll dots
        const scrollDots = gsap.utils.toArray('.scroll-dot');
        scrollDots.forEach(dot => {
            dot.classList.remove('active');
            if (dot.getAttribute('data-section') === activeSection) {
                dot.classList.add('active');
            }
        });
        
        // Update sections
        const sections = gsap.utils.toArray('.section');
        sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === activeSection) {
                section.classList.add('active');
            }
        });
    }
    
    setupSectionDetection() {
        const sections = gsap.utils.toArray('.section');
        
        sections.forEach(section => {
            ScrollTrigger.create({
                trigger: section,
                start: "top center",
                end: "bottom center",
                onEnter: () => this.onSectionEnter(section.id),
                onEnterBack: () => this.onSectionEnter(section.id)
            });
        });
    }
    
    onSectionEnter(sectionId) {
        if (this.currentSection !== sectionId) {
            this.currentSection = sectionId;
            this.updateNavigationStates(sectionId);
            this.onSectionChange(sectionId);
        }
    }
    
    onSectionChange(sectionId) {
        // Notify Three.js scene of section change
        if (window.portfolioScene && window.portfolioScene.onSectionChange) {
            window.portfolioScene.onSectionChange(sectionId);
        }
        
        // Section-specific animations
        this.triggerSectionAnimations(sectionId);
    }
    
    triggerSectionAnimations(sectionId) {
        switch (sectionId) {
            case 'home':
                this.animateHomeSection();
                break;
            case 'about':
                this.animateAboutSection();
                break;
            case 'skills':
                this.animateSkillsSection();
                break;
            case 'projects':
                this.animateProjectsSection();
                break;
            case 'experience':
                this.animateExperienceSection();
                break;
            case 'contact':
                this.animateContactSection();
                break;
        }
    }
    
    animateHomeSection() {
        // Floating animation for hero elements
        gsap.to('.hero-title', {
            y: "random(-5, 5)",
            duration: "random(3, 5)",
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true
        });
    }
    
    animateAboutSection() {
        // Counter animation for stats
        const statNumbers = gsap.utils.toArray('.stat-number');
        statNumbers.forEach(stat => {
            const finalValue = parseInt(stat.textContent);
            gsap.fromTo(stat, {
                textContent: 0
            }, {
                textContent: finalValue,
                duration: 2,
                ease: "power2.out",
                snap: { textContent: 1 },
                scrollTrigger: {
                    trigger: stat,
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            });
        });
    }
    
    animateSkillsSection() {
        // Skill bar animations with delay
        const skillBars = gsap.utils.toArray('.skill-item');
        skillBars.forEach((skill, index) => {
            const progressBar = skill.querySelector('.progress-bar');
            const progress = progressBar.getAttribute('data-progress');
            
            gsap.to(progressBar, {
                width: progress + '%',
                duration: 1.5,
                delay: index * 0.1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: skill,
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            });
        });
    }
    
    animateProjectsSection() {
        // Staggered project animations
        const projects = gsap.utils.toArray('.project-item');
        gsap.fromTo(projects, {
            rotationY: 15,
            opacity: 0,
            scale: 0.8
        }, {
            rotationY: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            stagger: 0.2,
            ease: "back.out(1.7)",
            scrollTrigger: {
                trigger: '.projects-grid',
                start: "top 80%",
                toggleActions: "play none none none"
            }
        });
    }
    
    animateExperienceSection() {
        // Timeline reveal animation
        const timelineItems = gsap.utils.toArray('.timeline-item');
        timelineItems.forEach((item, index) => {
            gsap.fromTo(item, {
                x: index % 2 === 0 ? -100 : 100,
                opacity: 0
            }, {
                x: 0,
                opacity: 1,
                duration: 1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: item,
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            });
        });
    }
    
    animateContactSection() {
        // Form reveal animation
        const formGroups = gsap.utils.toArray('.form-group');
        gsap.fromTo(formGroups, {
            y: 50,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
                trigger: '.contact-form',
                start: "top 80%",
                toggleActions: "play none none none"
            }
        });
    }
    
    // Public method to start animations
    start() {
        this.startPageLoadAnimations();
    }
    
    // Public method to clean up
    destroy() {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        this.scrollTriggers = [];
    }
}

// Make PortfolioAnimations available globally
window.PortfolioAnimations = PortfolioAnimations;
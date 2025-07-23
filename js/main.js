/**
 * Main JavaScript file for 3D Portfolio
 */

class Portfolio {
    constructor() {
        this.isLoaded = false;
        this.scene = null;
        this.animations = null;
        this.pointerTracker = null;
        this.performanceMonitor = null;
        
        // Configuration
        this.config = {
            loadingDuration: 2000,
            enablePointerTracking: true,
            enablePerformanceMonitoring: true,
            enableKeyboardNavigation: true
        };
        
        this.init();
    }
    
    init() {
        // Check for required dependencies
        if (!this.checkDependencies()) {
            console.error('Missing required dependencies');
            this.handleFallback();
            return;
        }
        
        // Initialize core systems
        this.initializeCore();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Start loading process
        this.startLoading();
    }
    
    checkDependencies() {
        const required = ['THREE', 'gsap', 'Utils'];
        const missing = required.filter(dep => typeof window[dep] === 'undefined');
        
        if (missing.length > 0) {
            console.warn('Missing dependencies:', missing);
            return false;
        }
        
        return true;
    }
    
    handleFallback() {
        // Remove loading screen and show basic content
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
        
        // Show all sections
        const sections = Utils.$$('.section');
        sections.forEach(section => {
            section.style.opacity = '1';
            section.style.transform = 'none';
        });
        
        // Show navigation
        const nav = Utils.$('#main-nav');
        if (nav) {
            nav.style.transform = 'none';
            nav.style.opacity = '1';
        }
        
        console.log('Portfolio loaded in fallback mode');
    }
    
    initializeCore() {
        // Initialize performance monitoring
        if (this.config.enablePerformanceMonitoring) {
            this.performanceMonitor = new Utils.PerformanceMonitor();
            this.performanceMonitor.onUpdate((fps) => {
                this.handlePerformanceUpdate(fps);
            });
        }
        
        // Initialize pointer tracking
        if (this.config.enablePointerTracking) {
            this.pointerTracker = new Utils.PointerTracker();
        }
        
        // Initialize custom cursor
        this.initializeCustomCursor();
        
        // Initialize mobile optimizations
        if (Utils.device.isMobile()) {
            this.applyMobileOptimizations();
        }
        
        // Initialize accessibility features
        this.initializeAccessibility();
    }
    
    initializeCustomCursor() {
        if (Utils.device.isTouchDevice()) return;
        
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 20px;
            height: 20px;
            background: #00d4ff;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            mix-blend-mode: difference;
            transition: transform 0.1s ease;
            transform: translate(-50%, -50%);
        `;
        document.body.appendChild(cursor);
        
        // Track cursor movement
        Utils.on(document, 'mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        
        // Cursor hover effects
        const interactiveElements = Utils.$$('a, button, .project-item, .skill-item, .scroll-dot');
        interactiveElements.forEach(element => {
            Utils.on(element, 'mouseenter', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursor.style.background = '#9333ea';
            });
            
            Utils.on(element, 'mouseleave', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                cursor.style.background = '#00d4ff';
            });
        });
    }
    
    applyMobileOptimizations() {
        // Reduce particle count for mobile
        document.documentElement.style.setProperty('--particle-count', '300');
        
        // Simplify animations
        document.documentElement.style.setProperty('--animation-duration', '0.5s');
        
        // Optimize touch interactions
        const touchElements = Utils.$$('.project-item, .skill-item, .btn-primary, .btn-secondary');
        touchElements.forEach(element => {
            element.style.minHeight = '44px';
            element.style.minWidth = '44px';
        });
        
        // Prevent zoom on form inputs
        const inputs = Utils.$$('input, textarea');
        inputs.forEach(input => {
            input.style.fontSize = '16px';
        });
    }
    
    initializeAccessibility() {
        // Add skip navigation link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'sr-only';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: #000;
            color: #fff;
            padding: 8px;
            text-decoration: none;
            z-index: 1000;
        `;
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Add ARIA labels
        this.addAriaLabels();
        
        // Keyboard navigation
        if (this.config.enableKeyboardNavigation) {
            this.setupKeyboardNavigation();
        }
        
        // Respect reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.disableAnimations();
        }
    }
    
    addAriaLabels() {
        // Navigation
        const nav = Utils.$('#main-nav');
        if (nav) nav.setAttribute('aria-label', 'Main navigation');
        
        // Sections
        const sections = Utils.$$('.section');
        sections.forEach(section => {
            const title = section.querySelector('h2, h1');
            if (title) {
                section.setAttribute('aria-labelledby', title.id || title.textContent.toLowerCase().replace(/\s+/g, '-'));
            }
        });
        
        // Interactive elements
        const scrollDots = Utils.$$('.scroll-dot');
        scrollDots.forEach((dot, index) => {
            const section = dot.getAttribute('data-section');
            dot.setAttribute('aria-label', `Navigate to ${section} section`);
            dot.setAttribute('role', 'button');
            dot.setAttribute('tabindex', '0');
        });
    }
    
    setupKeyboardNavigation() {
        // Arrow key navigation for sections
        Utils.on(document, 'keydown', (e) => {
            if (e.altKey || e.ctrlKey || e.metaKey) return;
            
            const sections = ['home', 'about', 'skills', 'projects', 'experience', 'contact'];
            const currentIndex = sections.indexOf(this.getCurrentSection());
            
            switch (e.key) {
                case 'ArrowDown':
                case 'PageDown':
                    e.preventDefault();
                    const nextIndex = Math.min(currentIndex + 1, sections.length - 1);
                    this.navigateToSection(sections[nextIndex]);
                    break;
                    
                case 'ArrowUp':
                case 'PageUp':
                    e.preventDefault();
                    const prevIndex = Math.max(currentIndex - 1, 0);
                    this.navigateToSection(sections[prevIndex]);
                    break;
                    
                case 'Home':
                    e.preventDefault();
                    this.navigateToSection('home');
                    break;
                    
                case 'End':
                    e.preventDefault();
                    this.navigateToSection('contact');
                    break;
            }
        });
        
        // Enter/Space for interactive elements
        const interactiveElements = Utils.$$('.scroll-dot, .btn-primary, .btn-secondary');
        interactiveElements.forEach(element => {
            Utils.on(element, 'keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    element.click();
                }
            });
        });
    }
    
    disableAnimations() {
        document.documentElement.style.setProperty('--transition-fast', '0s');
        document.documentElement.style.setProperty('--transition-medium', '0s');
        document.documentElement.style.setProperty('--transition-slow', '0s');
        
        // Disable GSAP animations
        if (typeof gsap !== 'undefined') {
            gsap.globalTimeline.clear();
            gsap.set('*', { clearProps: 'all' });
        }
    }
    
    setupEventListeners() {
        // Window events
        Utils.on(window, 'load', () => this.handleWindowLoad());
        Utils.on(window, 'resize', Utils.debounce(() => this.handleResize(), 250));
        Utils.on(window, 'orientationchange', () => this.handleOrientationChange());
        
        // Performance events
        Utils.on(document, 'visibilitychange', () => this.handleVisibilityChange());
        
        // Navigation events
        this.setupNavigationEvents();
        
        // Form events
        this.setupFormEvents();
        
        // Error handling
        Utils.on(window, 'error', (e) => this.handleError(e));
        Utils.on(window, 'unhandledrejection', (e) => this.handleError(e));
    }
    
    setupNavigationEvents() {
        // Mobile menu toggle
        const navToggle = Utils.$('.nav-toggle');
        const navLinks = Utils.$('.nav-links');
        
        if (navToggle && navLinks) {
            Utils.on(navToggle, 'click', () => {
                Utils.toggleClass(navToggle, 'active');
                Utils.toggleClass(navLinks, 'active');
            });
            
            // Close menu when clicking on a link
            const links = Utils.$$('.nav-links a');
            links.forEach(link => {
                Utils.on(link, 'click', () => {
                    Utils.removeClass(navToggle, 'active');
                    Utils.removeClass(navLinks, 'active');
                });
            });
        }
        
        // Smooth scrolling for anchor links
        const anchorLinks = Utils.$$('a[href^="#"]');
        anchorLinks.forEach(link => {
            Utils.on(link, 'click', (e) => {
                const href = link.getAttribute('href');
                if (href.length > 1) {
                    e.preventDefault();
                    const target = Utils.$(href);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });
    }
    
    setupFormEvents() {
        const contactForm = Utils.$('.contact-form');
        if (contactForm) {
            Utils.on(contactForm, 'submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit(contactForm);
            });
        }
        
        // Form validation
        const inputs = Utils.$$('.form-group input, .form-group textarea');
        inputs.forEach(input => {
            Utils.on(input, 'blur', () => this.validateInput(input));
            Utils.on(input, 'input', () => this.clearValidationError(input));
        });
    }
    
    handleFormSubmit(form) {
        // Validate form
        const inputs = form.querySelectorAll('input, textarea');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateInput(input)) {
                isValid = false;
            }
        });
        
        if (!isValid) return;
        
        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Simulate form submission (replace with actual implementation)
        setTimeout(() => {
            this.showFormSuccess();
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            form.reset();
        }, 2000);
    }
    
    validateInput(input) {
        const value = input.value.trim();
        const type = input.type;
        const required = input.hasAttribute('required');
        
        this.clearValidationError(input);
        
        if (required && !value) {
            this.showValidationError(input, 'This field is required');
            return false;
        }
        
        if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showValidationError(input, 'Please enter a valid email address');
                return false;
            }
        }
        
        return true;
    }
    
    showValidationError(input, message) {
        const group = input.closest('.form-group');
        let errorElement = group.querySelector('.error-message');
        
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'error-message';
            errorElement.style.cssText = `
                color: #ff4444;
                font-size: 0.8rem;
                margin-top: 0.5rem;
                display: block;
            `;
            group.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        input.style.borderColor = '#ff4444';
    }
    
    clearValidationError(input) {
        const group = input.closest('.form-group');
        const errorElement = group.querySelector('.error-message');
        
        if (errorElement) {
            errorElement.remove();
        }
        
        input.style.borderColor = '';
    }
    
    showFormSuccess() {
        // Create success message
        const successMessage = document.createElement('div');
        successMessage.className = 'form-success';
        successMessage.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(45deg, #0066ff, #00d4ff);
            color: white;
            padding: 2rem;
            border-radius: 15px;
            text-align: center;
            z-index: 1000;
            backdrop-filter: blur(10px);
        `;
        successMessage.innerHTML = `
            <h3>Message Sent!</h3>
            <p>Thank you for your message. I'll get back to you soon.</p>
        `;
        
        document.body.appendChild(successMessage);
        
        // Animate in
        gsap.fromTo(successMessage, {
            scale: 0,
            opacity: 0
        }, {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: "back.out(1.7)"
        });
        
        // Remove after delay
        setTimeout(() => {
            gsap.to(successMessage, {
                scale: 0,
                opacity: 0,
                duration: 0.3,
                ease: "power2.in",
                onComplete: () => successMessage.remove()
            });
        }, 3000);
    }
    
    startLoading() {
        // Show loading screen
        const loadingScreen = Utils.$('#loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'flex';
        }
        
        // Simulate loading process
        this.loadAssets().then(() => {
            this.initializeScene();
            this.initializeAnimations();
            this.completeLoading();
        }).catch((error) => {
            console.error('Loading failed:', error);
            this.handleFallback();
        });
    }
    
    loadAssets() {
        return new Promise((resolve) => {
            // Simulate asset loading
            const progress = Utils.$('.loading-progress');
            let currentProgress = 0;
            
            const updateProgress = () => {
                currentProgress += Math.random() * 20;
                if (currentProgress >= 100) {
                    currentProgress = 100;
                    if (progress) progress.style.width = '100%';
                    setTimeout(resolve, 500);
                } else {
                    if (progress) progress.style.width = currentProgress + '%';
                    setTimeout(updateProgress, 100 + Math.random() * 200);
                }
            };
            
            updateProgress();
        });
    }
    
    initializeScene() {
        try {
            this.scene = new ThreeScene();
            window.portfolioScene = this.scene;
        } catch (error) {
            console.error('Failed to initialize 3D scene:', error);
        }
    }
    
    initializeAnimations() {
        try {
            this.animations = new PortfolioAnimations();
            window.portfolioAnimations = this.animations;
        } catch (error) {
            console.error('Failed to initialize animations:', error);
        }
    }
    
    completeLoading() {
        this.isLoaded = true;
        
        // Start animations
        if (this.animations) {
            this.animations.start();
        } else {
            // Fallback: just hide loading screen
            setTimeout(() => {
                const loadingScreen = Utils.$('#loading-screen');
                if (loadingScreen) {
                    loadingScreen.style.display = 'none';
                }
            }, 1000);
        }
        
        console.log('Portfolio loaded successfully');
    }
    
    handleWindowLoad() {
        // Additional initialization after window load
        if (this.isLoaded) {
            this.optimizeInitialView();
        }
    }
    
    optimizeInitialView() {
        // Preload critical images
        const criticalImages = [
            // Add any critical image URLs here
        ];
        
        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }
    
    handleResize() {
        if (this.scene) {
            this.scene.handleResize();
        }
        
        // Update viewport-based calculations
        if (this.pointerTracker) {
            this.pointerTracker.updateViewport();
        }
    }
    
    handleOrientationChange() {
        setTimeout(() => {
            this.handleResize();
        }, 100);
    }
    
    handleVisibilityChange() {
        if (document.hidden) {
            // Pause animations when tab is not visible
            if (this.scene && this.scene.renderer) {
                this.scene.renderer.setAnimationLoop(null);
            }
        } else {
            // Resume animations when tab becomes visible
            if (this.scene && this.scene.animate) {
                this.scene.animate();
            }
        }
    }
    
    handlePerformanceUpdate(fps) {
        // Adjust quality based on performance
        if (fps < 30) {
            this.reduceQuality();
        } else if (fps > 50) {
            this.improveQuality();
        }
    }
    
    reduceQuality() {
        if (this.scene) {
            this.scene.reduceQuality();
        }
    }
    
    improveQuality() {
        // Implement quality improvements if needed
    }
    
    getCurrentSection() {
        const sections = Utils.$$('.section');
        for (let section of sections) {
            if (Utils.isInViewport(section, 0.5)) {
                return section.id;
            }
        }
        return 'home';
    }
    
    navigateToSection(sectionId) {
        if (this.animations && this.animations.scrollToSection) {
            this.animations.scrollToSection(sectionId);
        } else {
            // Fallback navigation
            const section = Utils.$('#' + sectionId);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }
    
    handleError(error) {
        console.error('Portfolio error:', error);
        
        // Implement error recovery strategies
        if (!this.isLoaded) {
            this.handleFallback();
        }
    }
    
    // Public API
    getScene() {
        return this.scene;
    }
    
    getAnimations() {
        return this.animations;
    }
    
    destroy() {
        if (this.scene) {
            this.scene.dispose();
        }
        
        if (this.animations) {
            this.animations.destroy();
        }
        
        // Remove event listeners
        // (This would be more comprehensive in a real application)
    }
}

// Initialize portfolio when DOM is ready
if (document.readyState === 'loading') {
    Utils.on(document, 'DOMContentLoaded', () => {
        window.portfolio = new Portfolio();
    });
} else {
    window.portfolio = new Portfolio();
}
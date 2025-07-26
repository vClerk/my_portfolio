// Portfolio Website JavaScript
// Modern, accessible, and performant interactions

class PortfolioApp {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.setupThemeToggle();
    this.setupSmoothScrolling();
    this.setupNavigationHighlight();
    this.setupMobileMenu();
    this.setupContactForm();
    this.setupAnimations();
    this.setupSkillBars();
    this.initializeTheme();
  }

  // Event Listeners Setup
  setupEventListeners() {
    // Throttled scroll event for performance
    let scrollTimer = null;
    window.addEventListener('scroll', () => {
      if (scrollTimer !== null) return;
      scrollTimer = setTimeout(() => {
        this.handleScroll();
        scrollTimer = null;
      }, 16); // ~60fps
    });

    // Resize event for responsive handling
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      if (resizeTimer !== null) return;
      resizeTimer = setTimeout(() => {
        this.handleResize();
        resizeTimer = null;
      }, 250);
    });

    // Intersection Observer for animations
    this.setupIntersectionObserver();
  }

  // Theme Toggle Functionality
  setupThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = themeToggle.querySelector('i');

    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      this.setTheme(newTheme);
      this.animateThemeTransition(themeIcon, newTheme);
    });

    // Listen for system theme changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
          this.setTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  }

  setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    const themeIcon = document.querySelector('.theme-toggle i');
    themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }

  animateThemeTransition(icon, newTheme) {
    icon.style.transform = 'rotate(180deg) scale(0)';
    
    setTimeout(() => {
      icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
      icon.style.transform = 'rotate(0deg) scale(1)';
    }, 150);
  }

  initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const theme = savedTheme || systemTheme;
    
    this.setTheme(theme);
  }

  // Smooth Scrolling Navigation
  setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link, .footer-links a');
    
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        if (href.startsWith('#')) {
          e.preventDefault();
          const targetId = href.substring(1);
          const targetElement = document.getElementById(targetId);
          
          if (targetElement) {
            this.smoothScrollTo(targetElement);
            this.closeMobileMenu();
          }
        }
      });
    });

    // Hero CTA buttons
    const ctaButtons = document.querySelectorAll('.hero-actions .btn');
    ctaButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const href = button.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const targetElement = document.querySelector(href);
          if (targetElement) {
            this.smoothScrollTo(targetElement);
          }
        }
      });
    });

    // Scroll indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
      scrollIndicator.addEventListener('click', () => {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
          this.smoothScrollTo(aboutSection);
        }
      });
    }
  }

  smoothScrollTo(element) {
    const navHeight = document.querySelector('.navbar').offsetHeight;
    const targetPosition = element.offsetTop - navHeight - 20;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }

  // Navigation Highlight
  setupNavigationHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    this.observeSections(sections, navLinks);
  }

  observeSections(sections, navLinks) {
    const options = {
      threshold: 0.2,
      rootMargin: '-80px 0px -80px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentSection = entry.target.getAttribute('id');
          
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }, options);

    sections.forEach(section => observer.observe(section));
  }

  // Mobile Menu
  setupMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle && navMenu) {
      mobileToggle.addEventListener('click', () => {
        this.toggleMobileMenu();
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar')) {
          this.closeMobileMenu();
        }
      });

      // Close menu on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.closeMobileMenu();
        }
      });
    }
  }

  toggleMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    const isOpen = navMenu.classList.contains('active');
    
    if (isOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  openMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    navMenu.classList.add('active');
    mobileToggle.classList.add('active');
    mobileToggle.setAttribute('aria-expanded', 'true');
    
    // Animate hamburger lines
    const lines = mobileToggle.querySelectorAll('.hamburger-line');
    lines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    lines[1].style.opacity = '0';
    lines[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
  }

  closeMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    navMenu.classList.remove('active');
    mobileToggle.classList.remove('active');
    mobileToggle.setAttribute('aria-expanded', 'false');
    
    // Reset hamburger lines
    const lines = mobileToggle.querySelectorAll('.hamburger-line');
    lines[0].style.transform = 'none';
    lines[1].style.opacity = '1';
    lines[2].style.transform = 'none';
  }

  // Contact Form
  setupContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const inputs = form.querySelectorAll('input, textarea');
    const submitBtn = form.querySelector('.submit-btn');

    // Real-time validation
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearFieldError(input));
    });

    // Form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmission(form, submitBtn);
    });
  }

  validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    const formGroup = field.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message');
    
    let isValid = true;
    let errorMessage = '';

    // Required field validation
    if (!value) {
      isValid = false;
      errorMessage = `${this.getFieldLabel(fieldName)} is required.`;
    } else {
      // Field-specific validation
      switch (fieldName) {
        case 'email':
          if (!this.isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address.';
          }
          break;
        case 'name':
          if (value.length < 2) {
            isValid = false;
            errorMessage = 'Name must be at least 2 characters long.';
          }
          break;
        case 'subject':
          if (value.length < 5) {
            isValid = false;
            errorMessage = 'Subject must be at least 5 characters long.';
          }
          break;
        case 'message':
          if (value.length < 10) {
            isValid = false;
            errorMessage = 'Message must be at least 10 characters long.';
          }
          break;
      }
    }

    // Update UI
    if (isValid) {
      formGroup.classList.remove('error');
      errorElement.textContent = '';
    } else {
      formGroup.classList.add('error');
      errorElement.textContent = errorMessage;
    }

    return isValid;
  }

  clearFieldError(field) {
    const formGroup = field.closest('.form-group');
    if (field.value.trim()) {
      formGroup.classList.remove('error');
      formGroup.querySelector('.error-message').textContent = '';
    }
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  getFieldLabel(fieldName) {
    const labels = {
      name: 'Full Name',
      email: 'Email Address',
      subject: 'Subject',
      message: 'Message'
    };
    return labels[fieldName] || fieldName;
  }

  async handleFormSubmission(form, submitBtn) {
    const inputs = form.querySelectorAll('input, textarea');
    let isFormValid = true;

    // Validate all fields
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isFormValid = false;
      }
    });

    if (!isFormValid) {
      this.showFormMessage('Please correct the errors above.', 'error');
      return;
    }

    // Show loading state
    this.setFormLoading(submitBtn, true);

    try {
      // Simulate form submission (replace with actual submission logic)
      await this.simulateFormSubmission(new FormData(form));
      
      this.showFormMessage('Thank you! Your message has been sent successfully.', 'success');
      form.reset();
      
      // Clear any existing errors
      inputs.forEach(input => {
        const formGroup = input.closest('.form-group');
        formGroup.classList.remove('error');
        formGroup.querySelector('.error-message').textContent = '';
      });
      
    } catch (error) {
      this.showFormMessage('Sorry, there was an error sending your message. Please try again.', 'error');
    } finally {
      this.setFormLoading(submitBtn, false);
    }
  }

  setFormLoading(submitBtn, isLoading) {
    if (isLoading) {
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;
    } else {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  }

  async simulateFormSubmission(formData) {
    // Simulate network delay
    return new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });
  }

  showFormMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    // Create new message
    const messageElement = document.createElement('div');
    messageElement.className = `form-message ${type}`;
    messageElement.textContent = message;
    
    // Style the message
    messageElement.style.cssText = `
      padding: 1rem;
      margin-top: 1rem;
      border-radius: 0.5rem;
      font-weight: 500;
      ${type === 'success' 
        ? 'background: #dcfce7; color: #166534; border: 1px solid #bbf7d0;' 
        : 'background: #fef2f2; color: #dc2626; border: 1px solid #fecaca;'
      }
    `;

    // Insert message after form
    const form = document.getElementById('contactForm');
    form.parentNode.insertBefore(messageElement, form.nextSibling);

    // Remove message after 5 seconds
    setTimeout(() => {
      if (messageElement.parentNode) {
        messageElement.remove();
      }
    }, 5000);
  }

  // Animations
  setupAnimations() {
    // Animation on scroll
    this.setupIntersectionObserver();
  }

  setupIntersectionObserver() {
    const animatedElements = document.querySelectorAll(
      '.hero-content, .about-content, .skills-category, .project-card, .timeline-item, .contact-content'
    );

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          
          // Trigger skill bar animations
          if (entry.target.classList.contains('skills-category')) {
            this.animateSkillBars(entry.target);
          }
        }
      });
    }, observerOptions);

    animatedElements.forEach(element => {
      observer.observe(element);
    });
  }

  // Skill Bars Animation
  setupSkillBars() {
    // Initial setup - skill bars start at 0 width
    const skillBars = document.querySelectorAll('.skill-bar');
    skillBars.forEach(bar => {
      bar.style.width = '0%';
    });
  }

  animateSkillBars(skillsCategory) {
    const skillBars = skillsCategory.querySelectorAll('.skill-bar');
    
    skillBars.forEach((bar, index) => {
      const targetWidth = bar.getAttribute('data-level') + '%';
      
      setTimeout(() => {
        bar.style.width = targetWidth;
      }, index * 100); // Stagger the animations
    });
  }

  // Scroll Handling
  handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Update navbar background opacity
    this.updateNavbarScroll(scrollTop);
    
    // Update scroll indicator visibility
    this.updateScrollIndicator(scrollTop);
  }

  updateNavbarScroll(scrollTop) {
    const navbar = document.querySelector('.navbar');
    
    if (scrollTop > 100) {
      navbar.style.background = document.documentElement.getAttribute('data-theme') === 'dark'
        ? 'rgba(15, 23, 42, 0.98)'
        : 'rgba(255, 255, 255, 0.98)';
      navbar.style.borderBottomColor = 'var(--border-color)';
    } else {
      navbar.style.background = document.documentElement.getAttribute('data-theme') === 'dark'
        ? 'rgba(15, 23, 42, 0.95)'
        : 'rgba(255, 255, 255, 0.95)';
    }
  }

  updateScrollIndicator(scrollTop) {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
      scrollIndicator.style.opacity = scrollTop < 200 ? '1' : '0';
    }
  }

  // Resize Handling
  handleResize() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768) {
      this.closeMobileMenu();
    }
  }

  // Utility Methods
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Performance monitoring
  measurePerformance() {
    if ('performance' in window) {
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0];
        const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
        
        console.log(`Page load time: ${loadTime}ms`);
        
        // You could send this data to analytics
        // this.sendAnalytics('page_load_time', loadTime);
      });
    }
  }

  // Accessibility helpers
  setupAccessibility() {
    // Skip link functionality
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(skipLink.getAttribute('href'));
        if (target) {
          target.focus();
          target.scrollIntoView();
        }
      });
    }

    // Keyboard navigation for custom elements
    this.setupKeyboardNavigation();
  }

  setupKeyboardNavigation() {
    // Custom keyboard handlers for interactive elements
    const interactiveElements = document.querySelectorAll('.project-card, .skill-item');
    
    interactiveElements.forEach(element => {
      element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const link = element.querySelector('a');
          if (link) {
            link.click();
          }
        }
      });
    });
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PortfolioApp();
});

// Add CSS for mobile menu (injected via JavaScript to keep CSS file clean)
const mobileMenuStyles = `
  @media (max-width: 768px) {
    .nav-menu {
      position: fixed;
      top: 4rem;
      left: 0;
      right: 0;
      background: var(--card-background);
      border-bottom: 1px solid var(--border-color);
      box-shadow: var(--shadow-large);
      transform: translateY(-100%);
      transition: transform 0.3s ease;
      padding: var(--space-lg) var(--space-md);
      flex-direction: column;
      gap: var(--space-md);
      z-index: 999;
    }
    
    .nav-menu.active {
      display: flex;
      transform: translateY(0);
    }
    
    .nav-link {
      padding: var(--space-sm) 0;
      border-bottom: 1px solid var(--border-color);
    }
    
    .nav-link:last-child {
      border-bottom: none;
    }
  }
`;

// Inject mobile menu styles
const styleSheet = document.createElement('style');
styleSheet.textContent = mobileMenuStyles;
document.head.appendChild(styleSheet);

// Add skip link for accessibility
const skipLink = document.createElement('a');
skipLink.href = '#main';
skipLink.className = 'skip-link';
skipLink.textContent = 'Skip to main content';
skipLink.style.cssText = `
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--primary-color);
  color: white;
  padding: 8px;
  text-decoration: none;
  z-index: 10000;
  border-radius: 4px;
  transition: top 0.3s;
`;

skipLink.addEventListener('focus', () => {
  skipLink.style.top = '6px';
});

skipLink.addEventListener('blur', () => {
  skipLink.style.top = '-40px';
});

document.body.insertBefore(skipLink, document.body.firstChild);

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Uncomment to register service worker
    // navigator.serviceWorker.register('/sw.js')
    //   .then(registration => console.log('SW registered: ', registration))
    //   .catch(registrationError => console.log('SW registration failed: ', registrationError));
  });
}
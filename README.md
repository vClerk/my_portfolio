# 3D Animated Portfolio Website

A modern, interactive 3D animated portfolio website built with Three.js, GSAP, and cutting-edge web technologies. This portfolio creates an immersive experience that showcases projects, skills, and experience through stunning 3D visuals and smooth animations.

![Portfolio Preview](assets/images/preview.png)

## 🌟 Features

### 🎨 Visual Design
- **Modern Dark Theme** with accent colors (blues, purples, cyans)
- **3D Landing Scene** with animated geometric shapes and particles
- **Interactive Elements** that respond to mouse/touch input
- **Smooth Animations** powered by GSAP
- **Responsive Design** for all devices
- **Performance Optimizations** for smooth 60fps experience

### 🚀 Interactive Sections
- **Home**: 3D hero section with floating animations
- **About**: Animated statistics and personal introduction
- **Skills**: Interactive 3D skill visualization with progress bars
- **Projects**: 3D project showcase with hover effects
- **Experience**: Animated timeline with 3D elements
- **Contact**: Interactive contact form with 3D background

### 🛠 Technical Features
- **Three.js** for 3D graphics and WebGL rendering
- **GSAP** for smooth animations and transitions
- **Performance Monitoring** with automatic quality adjustment
- **Mobile Optimizations** for touch devices
- **Accessibility Features** including keyboard navigation
- **Progressive Enhancement** with graceful fallbacks

## 🚀 Quick Start

### Prerequisites
- Modern web browser with WebGL support
- Web server (for local development)

### Installation

1. **Clone or download** this repository
2. **Serve the files** using a local web server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js http-server
npx http-server

# Using PHP
php -S localhost:8000
```

3. **Open your browser** and navigate to `http://localhost:8000`

## 📁 Project Structure

```
portfolio/
├── index.html              # Main HTML file
├── css/
│   ├── style.css           # Main styles with dark theme
│   └── responsive.css      # Responsive design rules
├── js/
│   ├── main.js            # Main application logic
│   ├── scene.js           # Three.js 3D scene management
│   ├── animations.js      # GSAP animation systems
│   └── utils.js          # Utility functions
├── assets/
│   ├── images/           # Image assets
│   └── models/          # 3D model files (if any)
└── README.md           # This file
```

## 🎨 Customization Guide

### 1. Personal Information

**Update the content in `index.html`:**

```html
<!-- Hero Section -->
<h1 class="hero-title">
    <span class="title-line">Your Name</span>
    <span class="title-line">Your Title</span>
    <span class="title-line">Portfolio</span>
</h1>

<!-- About Section -->
<p class="intro-text">
    Your introduction text here...
</p>
```

### 2. Skills & Technologies

**Modify the skills in `index.html`:**

```html
<div class="skill-item" data-skill="your-skill">
    <div class="skill-icon">Skill Name</div>
    <div class="skill-progress">
        <div class="progress-bar" data-progress="85"></div>
    </div>
</div>
```

### 3. Projects

**Update project information:**

```html
<div class="project-item" data-project="1">
    <div class="project-image">
        <div class="project-overlay">
            <h3>Your Project Name</h3>
            <p>Project description</p>
            <div class="project-tech">
                <span>Technology 1</span>
                <span>Technology 2</span>
            </div>
            <div class="project-links">
                <a href="your-demo-url" class="project-link">View Demo</a>
                <a href="your-repo-url" class="project-link">Source Code</a>
            </div>
        </div>
    </div>
</div>
```

### 4. Experience Timeline

**Add your work experience:**

```html
<div class="timeline-item" data-year="2023">
    <div class="timeline-content">
        <h3>Your Job Title</h3>
        <h4>Company Name</h4>
        <p>Job description and achievements...</p>
        <div class="timeline-skills">
            <span>Skill 1</span>
            <span>Skill 2</span>
        </div>
    </div>
</div>
```

### 5. Contact Information

**Update contact details:**

```html
<div class="contact-item">
    <span class="contact-icon">📧</span>
    <span>your.email@domain.com</span>
</div>
```

### 6. Color Scheme

**Modify colors in `css/style.css`:**

```css
:root {
    --primary-color: #0066ff;      /* Main brand color */
    --secondary-color: #6b73ff;    /* Secondary brand color */
    --accent-color: #00d4ff;       /* Accent color */
    --purple-accent: #9333ea;      /* Purple accent */
    /* Add your custom colors */
}
```

### 7. 3D Scene Customization

**Modify 3D elements in `js/scene.js`:**

```javascript
// Change particle count
const particleCount = 1000; // Adjust based on performance needs

// Modify geometric shapes
const shapeConfigs = [
    { type: 'torus', position: [-15, 5, -10], scale: 2 },
    // Add your custom shapes
];

// Change colors
const colorPalette = [
    new THREE.Color(0x0066ff),
    new THREE.Color(0x00d4ff),
    // Add your custom colors
];
```

## 🔧 Configuration Options

### Performance Settings

Adjust performance settings in `js/main.js`:

```javascript
this.config = {
    loadingDuration: 2000,           // Loading screen duration
    enablePointerTracking: true,     // Mouse/touch tracking
    enablePerformanceMonitoring: true, // Auto quality adjustment
    enableKeyboardNavigation: true   // Keyboard navigation
};
```

### Animation Settings

Modify animation parameters in `js/animations.js`:

```javascript
gsap.defaults({
    duration: 1,          // Default animation duration
    ease: "power2.out"    // Default easing function
});
```

## 📱 Mobile Optimization

The portfolio includes several mobile optimizations:

- **Reduced particle count** for better performance
- **Touch-friendly interactions** with appropriate hit targets
- **Responsive layouts** that adapt to screen size
- **Performance monitoring** with automatic quality reduction
- **Optimized loading** for slower connections

## ♿ Accessibility Features

- **Keyboard navigation** support (Arrow keys, Page Up/Down, Home, End)
- **Screen reader** compatibility with proper ARIA labels
- **High contrast** mode support
- **Reduced motion** respect for users who prefer minimal animations
- **Focus indicators** for all interactive elements
- **Skip navigation** link for screen readers

## 🎯 Browser Support

### Fully Supported
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Partially Supported (Fallback Mode)
- Internet Explorer 11 (basic functionality only)
- Older mobile browsers

## 🚀 Deployment

### GitHub Pages

1. Push your code to a GitHub repository
2. Go to Settings → Pages
3. Select your branch (usually `main`)
4. Your site will be available at `https://username.github.io/repository-name`

### Netlify

1. Drag and drop your project folder to [Netlify](https://netlify.com)
2. Your site will be automatically deployed

### Vercel

1. Connect your GitHub repository to [Vercel](https://vercel.com)
2. Deploy with zero configuration

## 🔧 Development

### Local Development Server

```bash
# Install a simple HTTP server
npm install -g http-server

# Serve the project
http-server -p 8000

# Or use Python
python -m http.server 8000
```

### Performance Tips

1. **Optimize images** - Use WebP format for better compression
2. **Minimize dependencies** - Only load what you need
3. **Use CDN** - Load Three.js and GSAP from CDN for better caching
4. **Enable compression** - Use gzip compression on your server
5. **Monitor performance** - The built-in performance monitor helps optimize automatically

## 🎨 Design Credits

- **Color Palette**: Modern dark theme with cyber-punk inspired accents
- **Typography**: Orbitron (headings) and Exo 2 (body text) from Google Fonts
- **3D Elements**: Custom geometric shapes and particle systems
- **Animations**: Smooth GSAP-powered transitions and interactions

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📞 Support

If you have any questions or need help customizing the portfolio:

1. Check the [Issues](https://github.com/yourusername/portfolio/issues) page
2. Create a new issue with detailed information
3. Contact the developer through the portfolio's contact form

## 🌟 Showcase

If you use this portfolio template, I'd love to see your customization! Feel free to share your version by opening an issue with the "showcase" label.

---

**Made with ❤️ using Three.js, GSAP, and modern web technologies**
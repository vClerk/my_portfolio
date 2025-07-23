/**
 * Lightweight Three.js Alternative for Portfolio
 * A minimal WebGL implementation for basic 3D functionality
 */

class SimpleThree {
    constructor(container) {
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.canvas.style.display = 'block';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.container.appendChild(this.canvas);
        
        this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
        if (!this.gl) {
            console.warn('WebGL not supported, falling back to 2D canvas');
            return this.create2DFallback();
        }
        
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        
        this.particles = [];
        this.shapes = [];
        this.mouse = { x: 0, y: 0 };
        this.time = 0;
        
        this.init();
        this.createParticles();
        this.createShapes();
        this.setupEvents();
        this.animate();
    }
    
    create2DFallback() {
        // Create 2D canvas fallback
        this.canvas.getContext('2d');
        this.is2D = true;
        this.createAnimatedBackground();
        return this;
    }
    
    createAnimatedBackground() {
        const ctx = this.canvas.getContext('2d');
        const particles = [];
        
        // Create particles for 2D fallback
        for (let i = 0; i < 100; i++) {
            particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 3 + 1,
                color: `hsl(${200 + Math.random() * 60}, 80%, 60%)`
            });
        }
        
        const animate2D = () => {
            ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
            ctx.fillRect(0, 0, this.width, this.height);
            
            particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                if (particle.x < 0 || particle.x > this.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > this.height) particle.vy *= -1;
                
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.fill();
            });
            
            requestAnimationFrame(animate2D);
        };
        
        animate2D();
    }
    
    init() {
        this.gl.viewport(0, 0, this.width, this.height);
        this.gl.clearColor(0.04, 0.04, 0.04, 1.0);
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    }
    
    createParticles() {
        for (let i = 0; i < 200; i++) {
            this.particles.push({
                x: (Math.random() - 0.5) * 4,
                y: (Math.random() - 0.5) * 4,
                z: (Math.random() - 0.5) * 4,
                vx: (Math.random() - 0.5) * 0.02,
                vy: (Math.random() - 0.5) * 0.02,
                vz: (Math.random() - 0.5) * 0.02,
                size: Math.random() * 0.02 + 0.01,
                color: [
                    0.0 + Math.random() * 0.4,
                    0.4 + Math.random() * 0.4,
                    1.0,
                    0.8
                ]
            });
        }
    }
    
    createShapes() {
        // Create simple geometric shapes
        const shapeTypes = ['cube', 'pyramid', 'octahedron'];
        for (let i = 0; i < 5; i++) {
            this.shapes.push({
                type: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
                x: (Math.random() - 0.5) * 6,
                y: (Math.random() - 0.5) * 6,
                z: (Math.random() - 0.5) * 6,
                rotX: 0,
                rotY: 0,
                rotZ: 0,
                rotSpeedX: (Math.random() - 0.5) * 0.02,
                rotSpeedY: (Math.random() - 0.5) * 0.02,
                rotSpeedZ: (Math.random() - 0.5) * 0.02,
                scale: 0.2 + Math.random() * 0.3,
                color: [
                    Math.random(),
                    0.5 + Math.random() * 0.5,
                    1.0,
                    0.7
                ]
            });
        }
    }
    
    setupEvents() {
        window.addEventListener('resize', () => this.handleResize());
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        window.addEventListener('touchmove', (e) => this.handleTouchMove(e));
    }
    
    handleResize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        
        if (this.gl) {
            this.gl.viewport(0, 0, this.width, this.height);
        }
    }
    
    handleMouseMove(e) {
        this.mouse.x = (e.clientX / this.width) * 2 - 1;
        this.mouse.y = -(e.clientY / this.height) * 2 + 1;
    }
    
    handleTouchMove(e) {
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            this.mouse.x = (touch.clientX / this.width) * 2 - 1;
            this.mouse.y = -(touch.clientY / this.height) * 2 + 1;
        }
    }
    
    animate() {
        if (this.is2D) return;
        
        this.time += 0.016;
        
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        
        // Update and render particles
        this.updateParticles();
        this.renderParticles();
        
        // Update and render shapes
        this.updateShapes();
        this.renderShapes();
        
        requestAnimationFrame(() => this.animate());
    }
    
    updateParticles() {
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.z += particle.vz;
            
            // Wrap around screen bounds
            if (particle.x > 2) particle.x = -2;
            if (particle.x < -2) particle.x = 2;
            if (particle.y > 2) particle.y = -2;
            if (particle.y < -2) particle.y = 2;
            if (particle.z > 2) particle.z = -2;
            if (particle.z < -2) particle.z = 2;
            
            // Mouse interaction
            const distX = particle.x - this.mouse.x;
            const distY = particle.y - this.mouse.y;
            const distance = Math.sqrt(distX * distX + distY * distY);
            
            if (distance < 0.5) {
                particle.vx += distX * 0.001;
                particle.vy += distY * 0.001;
            }
        });
    }
    
    updateShapes() {
        this.shapes.forEach(shape => {
            shape.rotX += shape.rotSpeedX;
            shape.rotY += shape.rotSpeedY;
            shape.rotZ += shape.rotSpeedZ;
            
            // Floating motion
            shape.y += Math.sin(this.time + shape.x) * 0.001;
            
            // Mouse interaction
            const distX = shape.x - this.mouse.x * 2;
            const distY = shape.y - this.mouse.y * 2;
            const distance = Math.sqrt(distX * distX + distY * distY);
            
            if (distance < 1) {
                shape.x += distX * 0.01;
                shape.y += distY * 0.01;
            }
        });
    }
    
    renderParticles() {
        // Simple particle rendering using points
        this.particles.forEach(particle => {
            const x = (particle.x / 2) * this.width / 2 + this.width / 2;
            const y = (-particle.y / 2) * this.height / 2 + this.height / 2;
            
            this.gl.enable(this.gl.SCISSOR_TEST);
            this.gl.scissor(x - 2, y - 2, 4, 4);
            this.gl.clearColor(...particle.color);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT);
            this.gl.disable(this.gl.SCISSOR_TEST);
        });
    }
    
    renderShapes() {
        // Simple shape rendering using colored rectangles
        this.shapes.forEach(shape => {
            const x = (shape.x / 3) * this.width / 2 + this.width / 2;
            const y = (-shape.y / 3) * this.height / 2 + this.height / 2;
            const size = shape.scale * 20;
            
            this.gl.enable(this.gl.SCISSOR_TEST);
            this.gl.scissor(x - size/2, y - size/2, size, size);
            this.gl.clearColor(...shape.color);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT);
            this.gl.disable(this.gl.SCISSOR_TEST);
        });
    }
    
    onSectionChange(section) {
        // Camera transitions for different sections
        const transitions = {
            home: { x: 0, y: 0, z: 0 },
            about: { x: -0.5, y: 0.2, z: 0 },
            skills: { x: 0.5, y: -0.2, z: 0 },
            projects: { x: 0, y: 0.5, z: 0 },
            experience: { x: -0.8, y: 0, z: 0 },
            contact: { x: 0, y: -0.3, z: 0.5 }
        };
        
        // Smooth transition animation would go here
        console.log(`Transitioning to ${section} section`);
    }
}

// Simple GSAP alternative
class SimpleGSAP {
    static to(target, options) {
        const element = typeof target === 'string' ? document.querySelector(target) : target;
        if (!element && !Array.isArray(target)) return;
        
        const elements = Array.isArray(target) ? target : [element];
        const duration = (options.duration || 1) * 1000;
        const delay = (options.delay || 0) * 1000;
        
        setTimeout(() => {
            elements.forEach(el => {
                if (!el) return;
                
                const transition = `all ${duration}ms ${options.ease || 'ease'}`;
                el.style.transition = transition;
                
                Object.keys(options).forEach(prop => {
                    if (prop === 'duration' || prop === 'delay' || prop === 'ease' || prop === 'onComplete') return;
                    
                    if (prop === 'opacity' || prop === 'scale') {
                        el.style[prop] = options[prop];
                    } else if (prop === 'x' || prop === 'y' || prop === 'z') {
                        const currentTransform = el.style.transform || '';
                        const regex = new RegExp(`translate${prop.toUpperCase()}\\([^)]*\\)`, 'g');
                        const newTransform = currentTransform.replace(regex, '') + ` translate${prop.toUpperCase()}(${options[prop]}px)`;
                        el.style.transform = newTransform;
                    } else {
                        el.style[prop] = options[prop];
                    }
                });
                
                if (options.onComplete) {
                    setTimeout(options.onComplete, duration);
                }
            });
        }, delay);
    }
    
    static fromTo(target, fromOptions, toOptions) {
        this.to(target, fromOptions);
        setTimeout(() => {
            this.to(target, toOptions);
        }, 50);
    }
    
    static timeline() {
        return new SimpleTimeline();
    }
}

class SimpleTimeline {
    constructor() {
        this.animations = [];
    }
    
    to(target, options) {
        this.animations.push({ target, options, type: 'to' });
        return this;
    }
    
    fromTo(target, fromOptions, toOptions) {
        this.animations.push({ target, fromOptions, toOptions, type: 'fromTo' });
        return this;
    }
    
    play() {
        let delay = 0;
        this.animations.forEach(anim => {
            if (anim.type === 'to') {
                anim.options.delay = delay;
                SimpleGSAP.to(anim.target, anim.options);
            } else if (anim.type === 'fromTo') {
                anim.toOptions.delay = delay;
                SimpleGSAP.fromTo(anim.target, anim.fromOptions, anim.toOptions);
            }
            delay += (anim.options?.duration || anim.toOptions?.duration || 1);
        });
        return this;
    }
}

// Make available globally
window.SimpleThree = SimpleThree;
window.gsap = SimpleGSAP;
window.THREE = {
    // Minimal THREE.js compatibility
    Color: function(color) {
        this.r = ((color >> 16) & 255) / 255;
        this.g = ((color >> 8) & 255) / 255;
        this.b = (color & 255) / 255;
        return this;
    },
    Vector2: function(x = 0, y = 0) {
        this.x = x;
        this.y = y;
        this.lerp = function(target, factor) {
            this.x += (target.x - this.x) * factor;
            this.y += (target.y - this.y) * factor;
        };
        return this;
    },
    Vector3: function(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.copy = function(v) {
            this.x = v.x;
            this.y = v.y;
            this.z = v.z;
        };
        this.distanceTo = function(v) {
            const dx = this.x - v.x;
            const dy = this.y - v.y;
            const dz = this.z - v.z;
            return Math.sqrt(dx * dx + dy * dy + dz * dz);
        };
        return this;
    },
    Clock: function() {
        this.startTime = performance.now();
        this.getElapsedTime = () => (performance.now() - this.startTime) / 1000;
        return this;
    }
};
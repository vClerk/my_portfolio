/**
 * Utility Functions for 3D Portfolio
 */

// ====================================
// GENERAL UTILITIES
// ====================================

/**
 * Debounce function to limit the rate of function execution
 */
function debounce(func, wait) {
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

/**
 * Throttle function to limit the rate of function execution
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Check if element is in viewport
 */
function isInViewport(element, threshold = 0.1) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    
    return (
        rect.top <= windowHeight * (1 - threshold) &&
        rect.bottom >= windowHeight * threshold &&
        rect.left <= windowWidth * (1 - threshold) &&
        rect.right >= windowWidth * threshold
    );
}

/**
 * Linear interpolation
 */
function lerp(start, end, factor) {
    return start + (end - start) * factor;
}

/**
 * Map a value from one range to another
 */
function map(value, start1, stop1, start2, stop2) {
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}

/**
 * Clamp a value between min and max
 */
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

/**
 * Get random number between min and max
 */
function random(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Get random integer between min and max (inclusive)
 */
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Convert degrees to radians
 */
function degToRad(degrees) {
    return degrees * (Math.PI / 180);
}

/**
 * Convert radians to degrees
 */
function radToDeg(radians) {
    return radians * (180 / Math.PI);
}

/**
 * Easing functions
 */
const easing = {
    easeInQuad: t => t * t,
    easeOutQuad: t => t * (2 - t),
    easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeInCubic: t => t * t * t,
    easeOutCubic: t => (--t) * t * t + 1,
    easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    easeInQuart: t => t * t * t * t,
    easeOutQuart: t => 1 - (--t) * t * t * t,
    easeInOutQuart: t => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t
};

// ====================================
// DOM UTILITIES
// ====================================

/**
 * Query selector with optional context
 */
function $(selector, context = document) {
    return context.querySelector(selector);
}

/**
 * Query selector all with optional context
 */
function $$(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
}

/**
 * Add event listener with options
 */
function on(element, event, handler, options = {}) {
    if (typeof element === 'string') {
        element = $(element);
    }
    if (element) {
        element.addEventListener(event, handler, options);
    }
}

/**
 * Remove event listener
 */
function off(element, event, handler) {
    if (typeof element === 'string') {
        element = $(element);
    }
    if (element) {
        element.removeEventListener(event, handler);
    }
}

/**
 * Add class to element
 */
function addClass(element, className) {
    if (typeof element === 'string') {
        element = $(element);
    }
    if (element) {
        element.classList.add(className);
    }
}

/**
 * Remove class from element
 */
function removeClass(element, className) {
    if (typeof element === 'string') {
        element = $(element);
    }
    if (element) {
        element.classList.remove(className);
    }
}

/**
 * Toggle class on element
 */
function toggleClass(element, className) {
    if (typeof element === 'string') {
        element = $(element);
    }
    if (element) {
        element.classList.toggle(className);
    }
}

/**
 * Check if element has class
 */
function hasClass(element, className) {
    if (typeof element === 'string') {
        element = $(element);
    }
    return element ? element.classList.contains(className) : false;
}

// ====================================
// DEVICE DETECTION
// ====================================

/**
 * Device and browser detection utilities
 */
const device = {
    isMobile: () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    isTablet: () => /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/i.test(navigator.userAgent),
    isDesktop: () => !device.isMobile() && !device.isTablet(),
    isTouchDevice: () => 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    isRetina: () => window.devicePixelRatio > 1,
    getViewportSize: () => ({
        width: window.innerWidth || document.documentElement.clientWidth,
        height: window.innerHeight || document.documentElement.clientHeight
    }),
    getOrientation: () => window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
};

// ====================================
// PERFORMANCE UTILITIES
// ====================================

/**
 * Request animation frame with fallback
 */
const raf = window.requestAnimationFrame || 
           window.webkitRequestAnimationFrame || 
           window.mozRequestAnimationFrame || 
           function(callback) { return setTimeout(callback, 1000 / 60); };

/**
 * Cancel animation frame with fallback
 */
const caf = window.cancelAnimationFrame || 
           window.webkitCancelAnimationFrame || 
           window.mozCancelAnimationFrame || 
           function(id) { clearTimeout(id); };

/**
 * Performance monitor
 */
class PerformanceMonitor {
    constructor() {
        this.fps = 0;
        this.frames = 0;
        this.startTime = performance.now();
        this.lastTime = this.startTime;
        this.callbacks = [];
    }
    
    update() {
        this.frames++;
        const currentTime = performance.now();
        
        if (currentTime - this.lastTime >= 1000) {
            this.fps = Math.round((this.frames * 1000) / (currentTime - this.lastTime));
            this.frames = 0;
            this.lastTime = currentTime;
            
            // Call callbacks with current FPS
            this.callbacks.forEach(callback => callback(this.fps));
        }
    }
    
    onUpdate(callback) {
        this.callbacks.push(callback);
    }
    
    getFPS() {
        return this.fps;
    }
}

// ====================================
// 3D UTILITIES
// ====================================

/**
 * Vector3 utilities
 */
const Vector3Utils = {
    distance: (a, b) => {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dz = a.z - b.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    },
    
    lerp: (a, b, factor) => ({
        x: lerp(a.x, b.x, factor),
        y: lerp(a.y, b.y, factor),
        z: lerp(a.z, b.z, factor)
    }),
    
    normalize: (v) => {
        const length = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
        return length > 0 ? {
            x: v.x / length,
            y: v.y / length,
            z: v.z / length
        } : { x: 0, y: 0, z: 0 };
    }
};

/**
 * Mouse/Touch position tracker
 */
class PointerTracker {
    constructor() {
        this.position = { x: 0, y: 0 };
        this.normalizedPosition = { x: 0, y: 0 };
        this.velocity = { x: 0, y: 0 };
        this.previousPosition = { x: 0, y: 0 };
        this.isPressed = false;
        
        this.bindEvents();
    }
    
    bindEvents() {
        // Mouse events
        on(document, 'mousemove', (e) => this.updatePosition(e.clientX, e.clientY));
        on(document, 'mousedown', () => this.isPressed = true);
        on(document, 'mouseup', () => this.isPressed = false);
        
        // Touch events
        on(document, 'touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.updatePosition(touch.clientX, touch.clientY);
        }, { passive: false });
        
        on(document, 'touchstart', () => this.isPressed = true);
        on(document, 'touchend', () => this.isPressed = false);
    }
    
    updatePosition(x, y) {
        this.previousPosition.x = this.position.x;
        this.previousPosition.y = this.position.y;
        
        this.position.x = x;
        this.position.y = y;
        
        // Calculate velocity
        this.velocity.x = this.position.x - this.previousPosition.x;
        this.velocity.y = this.position.y - this.previousPosition.y;
        
        // Normalize position (-1 to 1)
        const viewport = device.getViewportSize();
        this.normalizedPosition.x = (x / viewport.width) * 2 - 1;
        this.normalizedPosition.y = -(y / viewport.height) * 2 + 1;
    }
    
    getPosition() {
        return this.position;
    }
    
    getNormalizedPosition() {
        return this.normalizedPosition;
    }
    
    getVelocity() {
        return this.velocity;
    }
}

// ====================================
// LOADING UTILITIES
// ====================================

/**
 * Asset loader with progress tracking
 */
class AssetLoader {
    constructor() {
        this.loadedAssets = 0;
        this.totalAssets = 0;
        this.assets = new Map();
        this.callbacks = {
            progress: [],
            complete: []
        };
    }
    
    load(assets) {
        this.totalAssets = assets.length;
        this.loadedAssets = 0;
        
        return Promise.all(assets.map(asset => this.loadAsset(asset)));
    }
    
    loadAsset(asset) {
        return new Promise((resolve, reject) => {
            switch (asset.type) {
                case 'image':
                    this.loadImage(asset, resolve, reject);
                    break;
                case 'audio':
                    this.loadAudio(asset, resolve, reject);
                    break;
                case 'json':
                    this.loadJSON(asset, resolve, reject);
                    break;
                default:
                    reject(new Error(`Unknown asset type: ${asset.type}`));
            }
        });
    }
    
    loadImage(asset, resolve, reject) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            this.assets.set(asset.name, img);
            this.onAssetLoaded();
            resolve(img);
        };
        img.onerror = reject;
        img.src = asset.url;
    }
    
    loadAudio(asset, resolve, reject) {
        const audio = new Audio();
        audio.crossOrigin = 'anonymous';
        audio.oncanplaythrough = () => {
            this.assets.set(asset.name, audio);
            this.onAssetLoaded();
            resolve(audio);
        };
        audio.onerror = reject;
        audio.src = asset.url;
    }
    
    loadJSON(asset, resolve, reject) {
        fetch(asset.url)
            .then(response => response.json())
            .then(data => {
                this.assets.set(asset.name, data);
                this.onAssetLoaded();
                resolve(data);
            })
            .catch(reject);
    }
    
    onAssetLoaded() {
        this.loadedAssets++;
        const progress = this.loadedAssets / this.totalAssets;
        
        this.callbacks.progress.forEach(callback => callback(progress));
        
        if (this.loadedAssets === this.totalAssets) {
            this.callbacks.complete.forEach(callback => callback());
        }
    }
    
    onProgress(callback) {
        this.callbacks.progress.push(callback);
    }
    
    onComplete(callback) {
        this.callbacks.complete.push(callback);
    }
    
    getAsset(name) {
        return this.assets.get(name);
    }
}

// ====================================
// ANIMATION UTILITIES
// ====================================

/**
 * Custom animation class for precise control
 */
class Animation {
    constructor(options = {}) {
        this.duration = options.duration || 1000;
        this.easing = options.easing || easing.easeOutQuad;
        this.onUpdate = options.onUpdate || (() => {});
        this.onComplete = options.onComplete || (() => {});
        
        this.startTime = null;
        this.isRunning = false;
        this.animationId = null;
    }
    
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.startTime = performance.now();
        this.animate();
    }
    
    stop() {
        this.isRunning = false;
        if (this.animationId) {
            caf(this.animationId);
        }
    }
    
    animate() {
        if (!this.isRunning) return;
        
        const currentTime = performance.now();
        const elapsed = currentTime - this.startTime;
        const progress = Math.min(elapsed / this.duration, 1);
        const easedProgress = this.easing(progress);
        
        this.onUpdate(easedProgress, progress);
        
        if (progress < 1) {
            this.animationId = raf(() => this.animate());
        } else {
            this.isRunning = false;
            this.onComplete();
        }
    }
}

// ====================================
// COLOR UTILITIES
// ====================================

/**
 * Color conversion and manipulation utilities
 */
const ColorUtils = {
    hexToRgb: (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },
    
    rgbToHex: (r, g, b) => {
        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    },
    
    hslToRgb: (h, s, l) => {
        h /= 360;
        s /= 100;
        l /= 100;
        
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        
        let r, g, b;
        
        if (s === 0) {
            r = g = b = l;
        } else {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }
};

// ====================================
// EXPORTS
// ====================================

// Make utilities available globally
window.Utils = {
    debounce,
    throttle,
    isInViewport,
    lerp,
    map,
    clamp,
    random,
    randomInt,
    degToRad,
    radToDeg,
    easing,
    $,
    $$,
    on,
    off,
    addClass,
    removeClass,
    toggleClass,
    hasClass,
    device,
    raf,
    caf,
    PerformanceMonitor,
    Vector3Utils,
    PointerTracker,
    AssetLoader,
    Animation,
    ColorUtils
};
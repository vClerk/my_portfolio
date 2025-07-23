/**
 * Three.js Scene Management for 3D Portfolio
 */

class ThreeScene {
    constructor() {
        this.container = document.getElementById('three-scene');
        
        // Use SimpleThree for basic 3D functionality
        this.simpleThree = new SimpleThree(this.container);
        
        // Performance monitoring
        this.performanceMonitor = new Utils.PerformanceMonitor();
        this.qualityLevel = this.getQualityLevel();
        
        // Mouse tracking
        this.mouse = new THREE.Vector2();
        this.mouseTarget = new THREE.Vector2();
        
        this.setupEventListeners();
        this.animate();
    }
    
    getQualityLevel() {
        const isMobile = Utils.device.isMobile();
        return isMobile ? 1 : 2; // Simplified quality levels
    }
    
    setupEventListeners() {
        // Mouse movement
        Utils.on(document, 'mousemove', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });
        
        // Touch movement
        Utils.on(document, 'touchmove', (event) => {
            if (event.touches.length > 0) {
                const touch = event.touches[0];
                this.mouse.x = (touch.clientX / window.innerWidth) * 2 - 1;
                this.mouse.y = -(touch.clientY / window.innerHeight) * 2 + 1;
            }
        });
        
        // Window resize
        Utils.on(window, 'resize', Utils.debounce(() => this.handleResize(), 250));
        
        // Performance monitoring
        this.performanceMonitor.onUpdate((fps) => {
            if (fps < 30 && this.qualityLevel > 1) {
                this.reduceQuality();
            }
        });
    }
    
    handleResize() {
        if (this.simpleThree) {
            this.simpleThree.handleResize();
        }
    }
    
    reduceQuality() {
        if (this.qualityLevel > 1) {
            this.qualityLevel--;
            console.log('Reduced quality level to:', this.qualityLevel);
        }
    }
    
    updateCamera(section) {
        if (this.simpleThree) {
            this.simpleThree.onSectionChange(section);
        }
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        this.performanceMonitor.update();
        
        // Update mouse target with smoothing
        this.mouseTarget.lerp(this.mouse, 0.05);
    }
    
    // Public methods for external control
    onSectionChange(section) {
        this.updateCamera(section);
    }
    
    dispose() {
        // Clean up resources
        console.log('Disposing 3D scene');
    }
}

// Make ThreeScene available globally
window.ThreeScene = ThreeScene;
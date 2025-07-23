/**
 * Three.js Scene Management for 3D Portfolio
 */

class ThreeScene {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.canvas = null;
        
        // Scene objects
        this.particles = null;
        this.geometricShapes = [];
        this.lights = {};
        
        // Animation properties
        this.clock = new THREE.Clock();
        this.mouse = new THREE.Vector2();
        this.mouseTarget = new THREE.Vector2();
        this.cameraTarget = new THREE.Vector3();
        
        // Performance settings
        this.performanceMonitor = new Utils.PerformanceMonitor();
        this.qualityLevel = this.getQualityLevel();
        
        // Raycaster for interactions
        this.raycaster = new THREE.Raycaster();
        this.interactiveObjects = [];
        
        this.init();
        this.createScene();
        this.createLights();
        this.createParticles();
        this.createGeometricShapes();
        this.setupEventListeners();
        this.animate();
    }
    
    init() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x0a0a0a, 50, 200);
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 0, 30);
        this.cameraTarget.copy(this.camera.position);
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: this.qualityLevel > 1,
            alpha: true,
            powerPreference: "high-performance"
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = this.qualityLevel > 1;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        
        // Append to DOM
        const container = document.getElementById('three-scene');
        container.appendChild(this.renderer.domElement);
        this.canvas = this.renderer.domElement;
    }
    
    getQualityLevel() {
        const gpu = this.getGPUTier();
        const isMobile = Utils.device.isMobile();
        
        if (isMobile) return 1; // Low quality for mobile
        if (gpu < 2) return 1;  // Low quality for weak GPUs
        if (gpu < 4) return 2;  // Medium quality
        return 3; // High quality
    }
    
    getGPUTier() {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl) return 1;
        
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
            const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            if (renderer.includes('NVIDIA') && renderer.includes('RTX')) return 5;
            if (renderer.includes('NVIDIA') && renderer.includes('GTX')) return 4;
            if (renderer.includes('AMD') && renderer.includes('RX')) return 4;
            if (renderer.includes('Intel')) return 2;
        }
        
        return 3; // Default tier
    }
    
    createScene() {
        // Create background gradient
        const geometry = new THREE.SphereGeometry(100, 32, 32);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color1: { value: new THREE.Color(0x0a0a0a) },
                color2: { value: new THREE.Color(0x1a1a2e) },
                color3: { value: new THREE.Color(0x16213e) }
            },
            vertexShader: `
                varying vec3 vPosition;
                void main() {
                    vPosition = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 color1;
                uniform vec3 color2;
                uniform vec3 color3;
                varying vec3 vPosition;
                
                void main() {
                    vec3 color = mix(color1, color2, (vPosition.y + 1.0) * 0.5);
                    color = mix(color, color3, sin(time * 0.5 + vPosition.x * 0.1) * 0.3 + 0.3);
                    gl_FragColor = vec4(color, 1.0);
                }
            `,
            side: THREE.BackSide
        });
        
        const backgroundSphere = new THREE.Mesh(geometry, material);
        this.scene.add(backgroundSphere);
        this.backgroundSphere = backgroundSphere;
    }
    
    createLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(ambientLight);
        this.lights.ambient = ambientLight;
        
        // Main directional light
        const directionalLight = new THREE.DirectionalLight(0x0066ff, 1);
        directionalLight.position.set(10, 10, 5);
        if (this.qualityLevel > 1) {
            directionalLight.castShadow = true;
            directionalLight.shadow.mapSize.width = 2048;
            directionalLight.shadow.mapSize.height = 2048;
        }
        this.scene.add(directionalLight);
        this.lights.directional = directionalLight;
        
        // Accent lights
        const light1 = new THREE.PointLight(0x00d4ff, 0.5, 50);
        light1.position.set(-20, 0, 10);
        this.scene.add(light1);
        this.lights.accent1 = light1;
        
        const light2 = new THREE.PointLight(0x9333ea, 0.5, 50);
        light2.position.set(20, 0, -10);
        this.scene.add(light2);
        this.lights.accent2 = light2;
        
        // Rim light
        const rimLight = new THREE.DirectionalLight(0x00d4ff, 0.3);
        rimLight.position.set(-5, -5, -5);
        this.scene.add(rimLight);
        this.lights.rim = rimLight;
    }
    
    createParticles() {
        const particleCount = this.qualityLevel === 1 ? 500 : this.qualityLevel === 2 ? 1000 : 1500;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        const velocities = new Float32Array(particleCount * 3);
        
        const colorPalette = [
            new THREE.Color(0x0066ff),
            new THREE.Color(0x00d4ff),
            new THREE.Color(0x9333ea),
            new THREE.Color(0x6b73ff)
        ];
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Positions
            positions[i3] = (Math.random() - 0.5) * 100;
            positions[i3 + 1] = (Math.random() - 0.5) * 100;
            positions[i3 + 2] = (Math.random() - 0.5) * 100;
            
            // Colors
            const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
            
            // Sizes
            sizes[i] = Math.random() * 3 + 1;
            
            // Velocities
            velocities[i3] = (Math.random() - 0.5) * 0.02;
            velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
            velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
        
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                pixelRatio: { value: this.renderer.getPixelRatio() }
            },
            vertexShader: `
                attribute float size;
                attribute vec3 velocity;
                uniform float time;
                uniform float pixelRatio;
                varying vec3 vColor;
                
                void main() {
                    vColor = color;
                    
                    vec3 pos = position;
                    pos += velocity * time;
                    
                    // Wrap particles around the scene
                    pos.x = mod(pos.x + 50.0, 100.0) - 50.0;
                    pos.y = mod(pos.y + 50.0, 100.0) - 50.0;
                    pos.z = mod(pos.z + 50.0, 100.0) - 50.0;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_Position = projectionMatrix * mvPosition;
                    gl_PointSize = size * pixelRatio * (100.0 / -mvPosition.z);
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                
                void main() {
                    float distance = length(gl_PointCoord - vec2(0.5));
                    if (distance > 0.5) discard;
                    
                    float alpha = 1.0 - smoothstep(0.0, 0.5, distance);
                    gl_FragColor = vec4(vColor, alpha * 0.8);
                }
            `,
            transparent: true,
            vertexColors: true,
            blending: THREE.AdditiveBlending
        });
        
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }
    
    createGeometricShapes() {
        const shapeConfigs = [
            { type: 'torus', position: [-15, 5, -10], scale: 2 },
            { type: 'octahedron', position: [15, -5, -15], scale: 3 },
            { type: 'dodecahedron', position: [-10, -10, 5], scale: 2.5 },
            { type: 'icosahedron', position: [12, 8, 10], scale: 2 },
            { type: 'tetrahedron', position: [-20, 0, -5], scale: 3 }
        ];
        
        shapeConfigs.forEach((config, index) => {
            const shape = this.createGeometricShape(config.type, config.scale);
            shape.position.set(...config.position);
            shape.userData = { 
                originalPosition: new THREE.Vector3(...config.position),
                rotationSpeed: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.02,
                    (Math.random() - 0.5) * 0.02,
                    (Math.random() - 0.5) * 0.02
                ),
                floatPhase: Math.random() * Math.PI * 2,
                index
            };
            
            this.geometricShapes.push(shape);
            this.interactiveObjects.push(shape);
            this.scene.add(shape);
        });
    }
    
    createGeometricShape(type, scale = 1) {
        let geometry;
        
        switch (type) {
            case 'torus':
                geometry = new THREE.TorusGeometry(1, 0.4, 16, 100);
                break;
            case 'octahedron':
                geometry = new THREE.OctahedronGeometry(1);
                break;
            case 'dodecahedron':
                geometry = new THREE.DodecahedronGeometry(1);
                break;
            case 'icosahedron':
                geometry = new THREE.IcosahedronGeometry(1);
                break;
            case 'tetrahedron':
                geometry = new THREE.TetrahedronGeometry(1);
                break;
            default:
                geometry = new THREE.BoxGeometry(1, 1, 1);
        }
        
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0x0066ff) },
                opacity: { value: 0.7 }
            },
            vertexShader: `
                uniform float time;
                varying vec3 vPosition;
                varying vec3 vNormal;
                
                void main() {
                    vPosition = position;
                    vNormal = normal;
                    
                    vec3 pos = position;
                    pos += normal * sin(time + position.x * 2.0) * 0.1;
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 color;
                uniform float opacity;
                varying vec3 vPosition;
                varying vec3 vNormal;
                
                void main() {
                    vec3 viewDirection = normalize(cameraPosition - vPosition);
                    float fresnel = 1.0 - dot(viewDirection, vNormal);
                    
                    vec3 finalColor = color + fresnel * 0.5;
                    finalColor += sin(time + vPosition.x * 5.0) * 0.1;
                    
                    gl_FragColor = vec4(finalColor, opacity * (0.5 + fresnel * 0.5));
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.scale.setScalar(scale);
        
        if (this.qualityLevel > 1) {
            mesh.castShadow = true;
            mesh.receiveShadow = true;
        }
        
        return mesh;
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
        
        // Click/touch interactions
        Utils.on(this.canvas, 'click', (event) => this.handleInteraction(event));
        Utils.on(this.canvas, 'touchend', (event) => this.handleInteraction(event));
        
        // Window resize
        Utils.on(window, 'resize', Utils.debounce(() => this.handleResize(), 250));
        
        // Performance monitoring
        this.performanceMonitor.onUpdate((fps) => {
            if (fps < 30 && this.qualityLevel > 1) {
                this.reduceQuality();
            }
        });
    }
    
    handleInteraction(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = ((event.clientX || event.changedTouches[0].clientX) - rect.left) / rect.width * 2 - 1;
        const y = -((event.clientY || event.changedTouches[0].clientY) - rect.top) / rect.height * 2 + 1;
        
        this.raycaster.setFromCamera({ x, y }, this.camera);
        const intersects = this.raycaster.intersectObjects(this.interactiveObjects);
        
        if (intersects.length > 0) {
            const object = intersects[0].object;
            this.animateShapeInteraction(object);
        }
    }
    
    animateShapeInteraction(shape) {
        // Create interaction effect
        gsap.to(shape.scale, {
            x: shape.scale.x * 1.5,
            y: shape.scale.y * 1.5,
            z: shape.scale.z * 1.5,
            duration: 0.3,
            ease: "back.out(1.7)",
            yoyo: true,
            repeat: 1
        });
        
        gsap.to(shape.material.uniforms.opacity, {
            value: 1,
            duration: 0.3,
            ease: "power2.out",
            yoyo: true,
            repeat: 1
        });
        
        // Add particles at interaction point
        this.createInteractionParticles(shape.position);
    }
    
    createInteractionParticles(position) {
        const particleCount = 20;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            positions[i3] = position.x;
            positions[i3 + 1] = position.y;
            positions[i3 + 2] = position.z;
            
            velocities[i3] = (Math.random() - 0.5) * 0.5;
            velocities[i3 + 1] = (Math.random() - 0.5) * 0.5;
            velocities[i3 + 2] = (Math.random() - 0.5) * 0.5;
            
            const color = new THREE.Color(0x00d4ff);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 3,
            vertexColors: true,
            transparent: true,
            opacity: 1
        });
        
        const particles = new THREE.Points(geometry, material);
        this.scene.add(particles);
        
        // Animate particles
        gsap.to(material, {
            opacity: 0,
            duration: 2,
            ease: "power2.out",
            onComplete: () => {
                this.scene.remove(particles);
                geometry.dispose();
                material.dispose();
            }
        });
        
        const animateParticles = () => {
            const positions = particles.geometry.attributes.position.array;
            const velocities = particles.geometry.attributes.velocity.array;
            
            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                positions[i3] += velocities[i3];
                positions[i3 + 1] += velocities[i3 + 1];
                positions[i3 + 2] += velocities[i3 + 2];
                
                velocities[i3] *= 0.98;
                velocities[i3 + 1] *= 0.98;
                velocities[i3 + 2] *= 0.98;
            }
            
            particles.geometry.attributes.position.needsUpdate = true;
        };
        
        gsap.ticker.add(animateParticles);
        setTimeout(() => gsap.ticker.remove(animateParticles), 2000);
    }
    
    handleResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
    
    reduceQuality() {
        if (this.qualityLevel > 1) {
            this.qualityLevel--;
            this.renderer.setPixelRatio(1);
            
            if (this.qualityLevel === 1) {
                this.renderer.shadowMap.enabled = false;
                this.geometricShapes.forEach(shape => {
                    shape.castShadow = false;
                    shape.receiveShadow = false;
                });
            }
        }
    }
    
    updateCamera(section) {
        let targetPosition = new THREE.Vector3(0, 0, 30);
        let targetLookAt = new THREE.Vector3(0, 0, 0);
        
        switch (section) {
            case 'home':
                targetPosition.set(0, 0, 30);
                targetLookAt.set(0, 0, 0);
                break;
            case 'about':
                targetPosition.set(-10, 5, 25);
                targetLookAt.set(-5, 0, 0);
                break;
            case 'skills':
                targetPosition.set(10, -5, 25);
                targetLookAt.set(5, 0, 0);
                break;
            case 'projects':
                targetPosition.set(0, 10, 20);
                targetLookAt.set(0, 5, 0);
                break;
            case 'experience':
                targetPosition.set(-15, 0, 25);
                targetLookAt.set(-10, 0, 0);
                break;
            case 'contact':
                targetPosition.set(0, -5, 35);
                targetLookAt.set(0, 0, 0);
                break;
        }
        
        gsap.to(this.camera.position, {
            x: targetPosition.x,
            y: targetPosition.y,
            z: targetPosition.z,
            duration: 2,
            ease: "power2.inOut"
        });
        
        gsap.to(this.cameraTarget, {
            x: targetLookAt.x,
            y: targetLookAt.y,
            z: targetLookAt.z,
            duration: 2,
            ease: "power2.inOut"
        });
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const elapsedTime = this.clock.getElapsedTime();
        this.performanceMonitor.update();
        
        // Update mouse target with smoothing
        this.mouseTarget.lerp(this.mouse, 0.05);
        
        // Update camera
        this.camera.position.x += (this.mouseTarget.x * 2 - this.camera.position.x) * 0.02;
        this.camera.position.y += (-this.mouseTarget.y * 2 - this.camera.position.y) * 0.02;
        this.camera.lookAt(this.cameraTarget);
        
        // Update particles
        if (this.particles) {
            this.particles.material.uniforms.time.value = elapsedTime;
            this.particles.rotation.y += 0.001;
        }
        
        // Update background
        if (this.backgroundSphere) {
            this.backgroundSphere.material.uniforms.time.value = elapsedTime;
        }
        
        // Update geometric shapes
        this.geometricShapes.forEach((shape, index) => {
            // Rotation
            shape.rotation.x += shape.userData.rotationSpeed.x;
            shape.rotation.y += shape.userData.rotationSpeed.y;
            shape.rotation.z += shape.userData.rotationSpeed.z;
            
            // Floating animation
            const floatY = Math.sin(elapsedTime + shape.userData.floatPhase) * 2;
            shape.position.y = shape.userData.originalPosition.y + floatY;
            
            // Mouse interaction
            const distance = shape.position.distanceTo(this.camera.position);
            const mouseInfluence = 1 / (distance * 0.1);
            shape.position.x += (this.mouseTarget.x * mouseInfluence - shape.position.x + shape.userData.originalPosition.x) * 0.01;
            shape.position.z += (this.mouseTarget.y * mouseInfluence - shape.position.z + shape.userData.originalPosition.z) * 0.01;
            
            // Update shader uniforms
            if (shape.material.uniforms) {
                shape.material.uniforms.time.value = elapsedTime;
            }
        });
        
        // Update lights
        this.lights.accent1.position.x = Math.sin(elapsedTime * 0.5) * 25;
        this.lights.accent1.position.z = Math.cos(elapsedTime * 0.5) * 25;
        
        this.lights.accent2.position.x = Math.cos(elapsedTime * 0.3) * 30;
        this.lights.accent2.position.z = Math.sin(elapsedTime * 0.3) * 30;
        
        this.renderer.render(this.scene, this.camera);
    }
    
    // Public methods for external control
    onSectionChange(section) {
        this.updateCamera(section);
    }
    
    dispose() {
        // Clean up resources
        this.scene.traverse((object) => {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
                if (object.material.dispose) object.material.dispose();
                if (object.material.map) object.material.map.dispose();
            }
        });
        
        this.renderer.dispose();
    }
}

// Make ThreeScene available globally
window.ThreeScene = ThreeScene;
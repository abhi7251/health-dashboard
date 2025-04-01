function loadGLBModel(containerId, modelPath, scaleFactor = 1, brightness = 1) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error("Container not found:", containerId);
        return;
    }

    // Initialize scene, renderer, and camera
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
  
    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6*brightness);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6*brightness);
    directionalLight.position.set(5, 5, 5);
    scene.add(ambientLight, directionalLight);

    // Initialize OrbitControls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2;
    controls.enableZoom = false; // Disable zooming
    controls.enablePan = false;  // Disable translation (panning)

    let model;
    let rotationAngle = 0;
    let rotationDirection = 1;
    const maxRotation = Math.PI / 4;
    const rotationSpeed = 0.01;
    let isMouseOver = false;

    // Load the GLB model
    new THREE.GLTFLoader().load(
        modelPath,
        (gltf) => {
            model = gltf.scene;
    
            // Compute bounding box
            const bbox = new THREE.Box3().setFromObject(model);
            const center = bbox.getCenter(new THREE.Vector3());
            const size = bbox.getSize(new THREE.Vector3());
    
            // Center the model
            model.position.sub(center);
    
    
            camera.position.set(0, 0, (1/scaleFactor) * 5);
            camera.lookAt(center);
      
    
            scene.add(model);
        },
        null,
        (error) => console.error("Error loading model:", error)
    );
    
    // Handle mouse events
    container.addEventListener("mouseenter", () => (isMouseOver = true));
    container.addEventListener("mouseleave", () => (isMouseOver = false));

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        if (model && !isMouseOver) {
            rotationAngle += rotationSpeed * rotationDirection;
            if (Math.abs(rotationAngle) >= maxRotation) rotationDirection *= -1;
            model.rotation.y = rotationAngle;
        }
        renderer.render(scene, camera);
    }
    animate();
}

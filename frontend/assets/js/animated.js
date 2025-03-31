function loadGLBModel(containerId, modelPath, scaleFactor = 1) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error("Container not found:", containerId);
        return;
    }

    // Initialize scene, renderer, and camera
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    camera.position.set(0, 2, 5);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(ambientLight, directionalLight);

    // Initialize OrbitControls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI / 2;
    controls.enableRotate = true;

    let model;
    const rotationSpeed = 0.002;
    let isMouseOver = false;

    // Load the GLB model
    const loader = new THREE.GLTFLoader();
    loader.load(
        modelPath,
        (gltf) => {
            model = gltf.scene;

            // Compute the bounding box of the model
            const bbox = new THREE.Box3().setFromObject(model);
            const center = bbox.getCenter(new THREE.Vector3());

            // Reposition the model to center it
            model.position.sub(center);

            // Apply the user-defined scale factor
            model.scale.multiplyScalar(scaleFactor);

            scene.add(model);
            camera.lookAt(model.position);
        },
        (xhr) => console.log(`Loading: ${(xhr.loaded / xhr.total) * 100}%`),
        (error) => console.error("Error loading model:", error)
    );

    // Handle mouse enter/leave events
    container.addEventListener("mouseenter", () => isMouseOver = true);
    container.addEventListener("mouseleave", () => isMouseOver = false);

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        if (model && !isMouseOver) {
            model.rotation.y += rotationSpeed;
        }
        renderer.render(scene, camera);
    }
    animate();
}
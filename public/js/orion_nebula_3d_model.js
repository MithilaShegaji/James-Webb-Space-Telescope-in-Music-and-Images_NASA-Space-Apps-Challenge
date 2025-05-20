// Initialize scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set camera position
camera.position.set(0, 2, 5); // Move camera back to see the model clearly

// Add ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Lower intensity to avoid over-exposure
scene.add(ambientLight);

// Add directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Focused light
directionalLight.position.set(5, 5, 5).normalize();
scene.add(directionalLight);

// Load the GLB model
const loader = new THREE.GLTFLoader();
const modelPath = '/src/3d_model/Nebula.glb'; // Ensure this path is correct
let model; // Declare model variable outside of the loader

loader.load(modelPath, function (gltf) {
    model = gltf.scene; // Assign model here
    model.scale.set(2, 2, 2); // Adjust scale to make model larger
    model.position.set(0, 0, 0); // Center the model in the scene
    scene.add(model);

    // Display the message when the model is loaded
    const messageDiv = document.getElementById('message');
    messageDiv.innerHTML = "NASA's Webb Reveals Distorted Galaxy Forming Cosmic";
    messageDiv.style.display = 'block'; // Show the message
}, undefined, function (error) {
    console.error('An error happened while loading the model:', error);
});

// Initialize OrbitControls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI / 2; // Limit the vertical rotation

// Render loop
function animate() {
    requestAnimationFrame(animate);
    
    // Update controls
    controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
    
    renderer.render(scene, camera);
}
animate();

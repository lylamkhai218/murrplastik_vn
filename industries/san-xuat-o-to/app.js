// Three.js 3D STL Viewer Implementation for R-Tec Liner
let scene, camera, renderer, controls;
let modelMesh;
let autoRotate = true;
const container = document.getElementById('threejs-container');

function init3DViewer() {
    if (!container) return;

    // Create Scene
    scene = new THREE.Scene();
    
    // Create Camera
    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 1, 1000);
    camera.position.set(0, 80, 220);

    // Create Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Add OrbitControls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.1;
    controls.minDistance = 50;
    controls.maxDistance = 500;

    // Add Lights (Optimized Industrial Lighting)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight1.position.set(100, 200, 150);
    dirLight1.castShadow = true;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xd51e29, 0.75); // Red accent glow light
    dirLight2.position.set(-100, 100, -100);
    scene.add(dirLight2);

    const cameraLight = new THREE.DirectionalLight(0xffffff, 0.6);
    cameraLight.position.set(0, 50, 150);
    scene.add(cameraLight);

    // Load STL Model
    const loader = new THREE.STLLoader();
    
    loader.load('./R-Tec_Liner_550mm.stl', 
        function (geometry) {
            const material = new THREE.MeshStandardMaterial({
                color: 0x9ca3af, // Steel grey
                metalness: 0.45,
                roughness: 0.35,
                flatShading: false
            });

            geometry.computeVertexNormals();
            geometry.center();

            modelMesh = new THREE.Mesh(geometry, material);
            modelMesh.castShadow = true;
            modelMesh.receiveShadow = true;

            geometry.computeBoundingSphere();
            const sphere = geometry.boundingSphere;
            const radius = sphere.radius;
            
            modelMesh.rotation.x = -Math.PI / 2;
            modelMesh.rotation.z = Math.PI / 4;
            scene.add(modelMesh);

            camera.position.set(radius * 2.2, radius * 1.8, radius * 2.6);
            controls.target.set(0, 0, 0);
            controls.update();

            const spinner = document.getElementById('loading-spinner');
            if (spinner) {
                spinner.style.opacity = '0';
                setTimeout(() => {
                    spinner.style.display = 'none';
                }, 500);
            }
        },
        function (xhr) {
            if (xhr.lengthComputable) {
                const percent = Math.round((xhr.loaded / xhr.total) * 100);
                const loadingText = document.querySelector('.loading-text');
                if (loadingText) {
                    loadingText.innerText = `Đang tải mô hình 3D R-Tec Liner: ${percent}%`;
                }
            }
        },
        function (error) {
            console.error('Lỗi khi tải STL:', error);
            const loadingText = document.querySelector('.loading-text');
            if (loadingText) {
                loadingText.innerText = 'Lỗi tải mô hình 3D. Vui lòng thử lại.';
            }
        }
    );

    function animate() {
        requestAnimationFrame(animate);
        if (modelMesh && autoRotate) {
            modelMesh.rotation.z += 0.003;
        }
        controls.update();
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    if (!camera || !renderer || !container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

// Controls Listeners
document.getElementById('reset-view-btn')?.addEventListener('click', () => {
    if (!camera || !controls || !modelMesh) return;
    modelMesh.geometry.computeBoundingSphere();
    const radius = modelMesh.geometry.boundingSphere.radius;
    camera.position.set(radius * 2.2, radius * 1.8, radius * 2.6);
    controls.target.set(0, 0, 0);
    controls.update();
});

const autoRotateBtn = document.getElementById('autorotate-btn');
autoRotateBtn?.addEventListener('click', () => {
    autoRotate = !autoRotate;
    if (autoRotate) {
        autoRotateBtn.innerHTML = '<i class="fa-solid fa-rotate"></i> Tự động xoay: Bật';
    } else {
        autoRotateBtn.innerHTML = '<i class="fa-solid fa-rotate"></i> Tự động xoay: Tắt';
    }
});

// Lightbox Handler
const lightbox = document.getElementById('lightbox-modal');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');

function setupLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item img, .construction-gallery-item img, .gallery-thumb');
    galleryItems.forEach(img => {
        img.addEventListener('click', () => {
            if (!lightbox || !lightboxImg) return;
            lightboxImg.src = img.src;
            lightboxCaption.innerText = img.alt || "Murrplastik Automotive";
            lightbox.style.display = 'flex';
        });
    });

    document.querySelector('.close-lightbox')?.addEventListener('click', () => {
        if (lightbox) lightbox.style.display = 'none';
    });

    lightbox?.addEventListener('click', (e) => {
        if (e.target === lightbox) lightbox.style.display = 'none';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    init3DViewer();
    setupLightbox();
});

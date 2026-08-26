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

// =====================================================
// Image Comparison Slider (Phase 2 Axis 6 Rotary Unit)
// =====================================================
function initImageComparisonSlider() {
    const container = document.getElementById('axis6-comparison-slider');
    const drawImg = document.getElementById('comparison-draw-img');
    const divider = document.getElementById('comparison-divider');
    const handle = document.getElementById('comparison-handle');

    if (!container || !drawImg || !divider || !handle) return;

    let isDragging = false;
    let targetPercent = 50;
    let rafId = null;

    function render() {
        drawImg.style.clipPath = `polygon(0 0, ${targetPercent}% 0, ${targetPercent}% 100%, 0 100%)`;
        divider.style.left = `${targetPercent}%`;
        rafId = null;
    }

    function updateSlider(clientX) {
        const rect = container.getBoundingClientRect();
        let x = clientX - rect.left;
        
        // Clamp position between 0% and 100%
        if (x < 0) x = 0;
        if (x > rect.width) x = rect.width;
        
        targetPercent = (x / rect.width) * 100;

        if (!rafId) {
            rafId = requestAnimationFrame(render);
        }
    }

    // Mouse Events
    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        updateSlider(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        updateSlider(e.clientX);
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Touch Events for Mobile
    container.addEventListener('touchstart', (e) => {
        isDragging = true;
        if (e.touches.length > 0) {
            updateSlider(e.touches[0].clientX);
        }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        if (e.touches.length > 0) {
            updateSlider(e.touches[0].clientX);
        }
    }, { passive: true });

    window.addEventListener('touchend', () => {
        isDragging = false;
    });
}

// =====================================================
// ScrollSpy: Dynamic Nav Menu Underline Highlighting
// =====================================================
function initScrollSpy() {
    const navLinks = document.querySelectorAll('.nav-menu .nav-link');
    const sections = [];

    navLinks.forEach(link => {
        const targetId = link.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
            const section = document.querySelector(targetId);
            if (section) {
                sections.push({ id: targetId, section: section, link: link });
            }
        }
    });

    if (sections.length === 0) return;

    function onScroll() {
        const scrollPosition = window.scrollY + 120; // Offset for sticky header

        let currentActive = null;

        for (let i = 0; i < sections.length; i++) {
            const { section, link } = sections[i];
            const top = section.offsetTop;
            const height = section.offsetHeight;

            if (scrollPosition >= top && scrollPosition < top + height) {
                currentActive = link;
                break;
            }
        }

        // If at the very bottom of the page, highlight the last item (FAQ)
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
            currentActive = sections[sections.length - 1].link;
        }

        navLinks.forEach(link => {
            if (link === currentActive) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Initial check
}

// =====================================================
// FAQ Accordion Handler
// =====================================================
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems || faqItems.length === 0) return;

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        if (!questionBtn || !answer) return;

        questionBtn.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            // Close all other open items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('open')) {
                    otherItem.classList.remove('open');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    if (otherAnswer) otherAnswer.style.maxHeight = null;
                }
            });

            // Toggle current item
            if (isOpen) {
                item.classList.remove('open');
                answer.style.maxHeight = null;
            } else {
                item.classList.add('open');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
}

// =====================================================
// Lightbox Modal Handler
// =====================================================
const lightbox = document.getElementById('lightbox-modal');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');

function setupLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item img, .construction-gallery-item img, .gallery-thumb');
    galleryItems.forEach(img => {
        img.addEventListener('click', () => {
            if (!lightbox || !lightboxImg) return;
            lightboxImg.src = img.src;
            lightboxCaption.innerText = img.alt || "Murrplastik Automotive Solution";
            lightbox.style.display = 'flex';
        });
    });

    document.querySelector('.close-lightbox')?.addEventListener('click', () => {
        if (lightbox) lightbox.style.display = 'none';
    });

    lightbox?.addEventListener('click', (e) => {
        if (e.target === lightbox) lightbox.style.display = 'none';
    });

    // Close lightbox on Escape key press (thói quen người dùng)
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27) {
            if (lightbox && lightbox.style.display !== 'none') {
                lightbox.style.display = 'none';
            }
        }
    });
}

// Initialize all features on DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
    init3DViewer();
    initImageComparisonSlider();
    initScrollSpy();
    initFaqAccordion();
    setupLightbox();
});

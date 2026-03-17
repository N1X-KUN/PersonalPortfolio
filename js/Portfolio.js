gsap.registerPlugin(ScrollTrigger);

// --- 1. Magnetic Gallery Effect ---
const gallery = document.querySelector('.magnetic-gallery');
const images = document.querySelectorAll('.mag-img');

if (gallery) {
    gallery.addEventListener('mousemove', (e) => {
        const rect = gallery.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distX = e.clientX - centerX;
        const distY = e.clientY - centerY;

        // Spread updated to 280 to match CSS
        gsap.to('.img1', { x: -280 + distX * 0.1, y: distY * 0.1, duration: 0.5 });
        gsap.to('.img2', { x: distX * 0.15, y: distY * 0.15, duration: 0.5 });
        gsap.to('.img3', { x: 280 + distX * 0.1, y: distY * 0.1, duration: 0.5 });
    });

    // Snap back to wider positions
    gallery.addEventListener('mouseleave', () => {
        gsap.to('.img1', { x: -280, y: 0, duration: 0.8, ease: "power3.out" });
        gsap.to('.img2', { x: 0, y: 0, duration: 0.8, ease: "power3.out" });
        gsap.to('.img3', { x: 280, y: 0, duration: 0.8, ease: "power3.out" });
    });
}

// --- 2. Parallax Floating Shapes ---
// Adds a subtle float effect to the background shapes when scrolling
gsap.to(".shape-1", {
    y: 150,
    ease: "none",
    scrollTrigger: { trigger: "body", start: "top top", end: "bottom top", scrub: true }
});
gsap.to(".shape-2", {
    y: -200,
    ease: "none",
    scrollTrigger: { trigger: "body", start: "top top", end: "bottom top", scrub: true }
});

// --- 3. Slanted Zoom-Through 'A' Animation ---
gsap.to(".word-wrapper", {
    scale: 80, 
    ease: "power2.inOut",
    scrollTrigger: {
        trigger: ".zoom-container",
        start: "top top",
        end: "+=2500", 
        pin: true,
        scrub: 1
    }
});

// --- 4. Hover Videos ---
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    const video = card.querySelector('.card-video');
    
    card.addEventListener('mouseenter', () => {
        if (video) video.play();
    });
    
    card.addEventListener('mouseleave', () => {
        if (video) {
            video.pause();
            video.currentTime = 0; 
        }
    });
});
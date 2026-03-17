gsap.registerPlugin(ScrollTrigger);

// --- 1. NEW DETACHED Magnetic Gallery Effect ---
// detach pulls: apply separate move math to each image based on its unique wrapper
const images = document.querySelectorAll('.mag-img');

images.forEach(img => {
    img.addEventListener('mousemove', (e) => {
        //detach directional follow: calculate move from image center
        const rect = img.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distX = e.clientX - centerX;
        const distY = e.clientY - centerY;

        // separate move math based on detached starting position spread
        // stronger relative pull for center image
        const pull = img.closest('.wrap2') ? 0.3 : 0.15; 
        
        gsap.to(img, { 
            x: distX * pull, 
            y: distY * pull, 
            duration: 0.3 
        });
    });

    // detach snap back: only the hovered image snaps back
    img.addEventListener('mouseleave', () => {
        gsap.to(img, { x: 0, y: 0, duration: 0.7, ease: "power3.out" });
    });
});

// --- 2. Parallax Subtle Flow Effects ---
// subtle float drifts for different connecting designs from header
gsap.to(".genix-container", {
    y: 100, // drift up subtly
    ease: "none",
    scrollTrigger: { trigger: "body", start: "top top", end: "bottom top", scrub: true }
});
gsap.to(".magnteic-gallery", {
    y: -150, // drift down subtly
    ease: "none",
    scrollTrigger: { trigger: "body", start: "top top", end: "bottom top", scrub: true }
});

// --- 3. Slanted Zoom-Through 'A' Animation ---
gsap.to(".word-wrapper", {
    scale: 80, // Massive scale for the "tunnel fall-through" effect
    ease: "power2.inOut",
    scrollTrigger: {
        trigger: ".zoom-container",
        start: "top top",
        end: "+=2500", // Makes the scrolling journey longer and smoother
        pin: true,
        scrub: 1
    }
});

// --- 4. Shake Letters Effect (Cartoonic Interactivity) ---
// Each letter shakes individually when the mouse hovers over it
const shakeLetters = document.querySelectorAll('.shake-letter');

shakeLetters.forEach(letter => {
    letter.addEventListener('mouseenter', () => {
        // Rapid random GSAP animation to simulate a violent shake
        gsap.fromTo(letter, 
            { x: -10, y: -10 }, 
            { 
                x: 10, y: 10, 
                duration: 0.05, 
                yoyo: true, 
                repeat: 5, 
                clearProps: "all" 
            }
        );
    });
});

// --- 5. Hover Videos ---
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
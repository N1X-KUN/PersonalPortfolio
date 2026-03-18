gsap.registerPlugin(ScrollTrigger);

// --- 1. SMOOTH BACKGROUND COLOR MORPH (Agence Foudre style) ---
// Morphs body base from off-white to yellow as you scroll down
gsap.to("body", {
    backgroundColor: "#FFD700", 
    scrollTrigger: {
        trigger: ".zoom-container",
        start: "top 60%", 
        end: "top 20%",
        scrub: true
    }
});

// simultaneous morph of the SVG mask rect from off-white to yellow 
gsap.to("#mask-rect", {
    fill: "#FFD700",
    scrollTrigger: {
        trigger: ".zoom-container",
        start: "top 60%",
        end: "top 20%",
        scrub: true
    }
});

// --- 2. TRUE DETACHED Magnetic Images (Independent follow) ---
const images = document.querySelectorAll('.mag-img');

images.forEach(img => {
    img.addEventListener('mousemove', (e) => {
        const rect = img.getBoundingClientRect();
        // detach pulls math based on individual image centers 
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // detach pulls based on which wrapper holds the image focus 
        const pull = img.closest('.wrap2') ? 0.3 : 0.15; 
        
        gsap.to(img, { 
            x: x * pull, 
            y: y * pull, 
            duration: 0.3 
        });
    });

    // detach snap back: image returns to its specific wrapper starting position 
    img.addEventListener('mouseleave', () => {
        gsap.to(img, { x: 0, y: 0, duration: 0.7, ease: "power3.out" });
    });
});

// --- 3. Parallax Subtle Flow Drift (Connectdesigns in header) ---
gsap.to(".genix-container", {
    y: 100, // drift subtly higher 
    ease: "none",
    scrollTrigger: { trigger: "body", start: "top top", end: "bottom top", scrub: true }
});

// --- 4. Slanted Zoom-Through 'A' Animation ---
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

// --- 5. Shake Letters Effect ---
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

// --- 6. Hover Videos ---
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

// --- 7. Piano Up Animation for GENIX letters --- 
// because magnetic-gallery has pointer-events: none the empty space allows aiming behind images 
const genixLetters = document.querySelectorAll('.bg-text span');

genixLetters.forEach(letter => {
    letter.addEventListener('mouseenter', () => {
        // specific aim behind images: letter rises higher than others (y: -25)
        gsap.to(letter, { 
            y: -25, 
            duration: 0.3, 
            ease: "power2.out" 
        });
    });

    letter.addEventListener('mouseleave', () => {
        // letter returns to default level (y: 0)
        gsap.to(letter, { 
            y: 0, 
            duration: 0.3, 
            ease: "power2.in" 
        });
    });
});
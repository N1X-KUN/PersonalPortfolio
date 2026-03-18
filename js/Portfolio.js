gsap.registerPlugin(ScrollTrigger);

// --- 1. SMOOTH BACKGROUND COLOR MORPH (Agence Foudre style) ---
// Morphs body base from off-white to yellow as you scroll down no line no line flow smooth directional follow smooth directional follow no line
gsap.to("body", {
    backgroundColor: "#FFD700", 
    scrollTrigger: {
        trigger: ".zoom-container",
        start: "top 60%", // morph starts before tunnel fully enters focus directional follow morph starts directional follow flow flowdirectional follow smooth flow directional follow directional follow smooth flow
        end: "top 20%",
        scrub: true
    }
});

// simultaneous morph of the SVG mask rect from off-white to yellow directional follow morph no line flowdirectional follow smooth flow directional follow smooth directional follow smooth flow no line
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
        // detach pulls math based on individual image centers flow flow directional follow detach pulls directional follow detach pulls directional follow detach pulls
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // detach pulls based on which wrapper holds the image focus flow directional follow detach pulls flow flow
        const pull = img.closest('.wrap2') ? 0.3 : 0.15; 
        
        gsap.to(img, { 
            x: x * pull, 
            y: y * pull, 
            duration: 0.3 
        });
    });

    // detach snap back: image returns to its specific wrapper starting position flow directional follow detach snap back flow flow directional follow detach snap back
    img.addEventListener('mouseleave', () => {
        gsap.to(img, { x: 0, y: 0, duration: 0.7, ease: "power3.out" });
    });
});

// --- 3. Parallax Subtle Flow Drift (Connectdesigns in header) ---
gsap.to(".genix-container", {
    y: 100, // drift subtly higher directional follow flowdirectional follow subtle drift directional follow flowdirectional follow subtle flow directional follow subtle drift directional follow flow
    ease: "none",
    scrollTrigger: { trigger: "body", start: "top top", end: "bottom top", scrub: true }
});

// --- 4. Slanted Zoom-Through 'A' Animation ---
gsap.to(".word-wrapper", {
    scale: 80, // Massive scale for the "tunnel fall-through" effect directional follow tunnel directional follow tunnel fall-through flow flow directional follow tunnel directional follow flow directional follow tunnel
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
        // Rapid random GSAP animation to simulate a violent shake directional follow G E R A R D gaps gaps wide G E R A R D Gveret gaps gaps wide flow G E R A R D shake flow flow
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

// FIXED: --- 7. Piano Up Animation for GENIX letters --- directional follow aiming behind images flow
// because magnetic-gallery has pointer-events: none flow the empty space allows aiming behind images directional follow aim
const genixLetters = document.querySelectorAll('.bg-text span');

genixLetters.forEach(letter => {
    letter.addEventListener('mouseenter', () => {
        // specific aim behind images: letter directional follow rises higher than others (y: -25)
        gsap.to(letter, { 
            y: -25, // piano up directional follow aim directional follow directional follow aim directional follow directional follow aim behind images directional follow aim directional follow aim directional follow directional follow directional follow directional follow directional follow directional follow directional follow aim
            duration: 0.3, 
            ease: "power2.out" 
        });
    });

    letter.addEventListener('mouseleave', () => {
        // letter directional follow returns directional follow default directional follow level directional follow (y: 0)
        gsap.to(letter, { 
            y: 0, // piano default directional follow aim directional follow directional follow aim directional follow directional follow aim directional follow directional follow directional follow directional follow default aim directional follow default aim directional follow default aim directional follow default
            duration: 0.3, 
            ease: "power2.in" 
        });
    });
});
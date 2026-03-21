gsap.registerPlugin(ScrollTrigger);

// ==========================================
// GLOBAL & HOVER EFFECTS (Runs instantly)
// ==========================================

// --- Magnetic Images ---
const images = document.querySelectorAll('.mag-img');
images.forEach(img => {
    img.addEventListener('mousemove', (e) => {
        const rect = img.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const pull = img.closest('.wrap2') ? 0.3 : 0.15; 
        gsap.to(img, { x: x * pull, y: y * pull, duration: 0.3 });
    });
    img.addEventListener('mouseleave', () => {
        gsap.to(img, { x: 0, y: 0, duration: 0.7, ease: "power3.out" });
    });
});

// --- Shake Letters ---
const shakeLetters = document.querySelectorAll('.shake-letter');
shakeLetters.forEach(letter => {
    letter.addEventListener('mouseenter', () => {
        gsap.fromTo(letter, 
            { x: -10, y: -10 }, 
            { x: 10, y: 10, duration: 0.05, yoyo: true, repeat: 5, clearProps: "all" }
        );
    });
});

// --- Hover Videos ---
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    const video = card.querySelector('.card-video');
    card.addEventListener('mouseenter', () => { if (video) video.play(); });
    card.addEventListener('mouseleave', () => { if (video) { video.pause(); video.currentTime = 0; } });
});

// --- Piano Up Animation for GENIX letters --- 
const genixLetters = document.querySelectorAll('.bg-text span');
genixLetters.forEach(letter => {
    letter.addEventListener('mouseenter', () => {
        gsap.to(letter, { y: -25, duration: 0.3, ease: "power2.out" });
    });
    letter.addEventListener('mouseleave', () => {
        gsap.to(letter, { y: 0, duration: 0.3, ease: "power2.in" });
    });
});


// ==========================================
// PAGE 2: FOUDRE SHUFFLE (Calculated First)
// ==========================================

gsap.set("#acc-1 .acc-title", { color: "#0A192F", webkitTextStroke: "0px" });
gsap.set("#acc-1 .acc-content", { height: "auto", opacity: 1 });

const aboutTl = gsap.timeline({
    scrollTrigger: {
        trigger: ".pinned-hero-about",
        pin: true,
        start: "top top",
        end: "+=5000", 
        scrub: 1.5 
    }
});

// ACTION 1: SCROLL TO PAGE 2 & TURN BG YELLOW
aboutTl.to(".page1-content", { y: "-100vh", duration: 1, ease: "power2.inOut" }, 0) 
       .to(".page2-content", { y: "0", duration: 1, ease: "power2.inOut" }, 0)      
       .to("body", { backgroundColor: "#FFD700", duration: 1 }, 0) 
       .to(".wrap1", { x: -40, y: 0, rotation: -5, scale: 0.9, zIndex: 1, duration: 1, ease: "power2.inOut" }, 0) 
       .to(".wrap3", { x: 40, y: 0, rotation: 5, scale: 0.9, zIndex: 1, duration: 1, ease: "power2.inOut" }, 0)  
       .to(".wrap2", { x: 0, y: 0, rotation: 0, scale: 1.05, zIndex: 5, duration: 1, ease: "power2.inOut" }, 0); 

aboutTl.to({}, {duration: 0.2}); 

// ACTION 2: SHUFFLE TO HOBBIES & TURN BG BLACK
aboutTl.add("shuffle1_out")
       .to("body", { backgroundColor: "#0A192F", duration: 1 }, "shuffle1_out") 
       .to(".foudre-sub-text", { color: "#FFFFFF", duration: 1 }, "shuffle1_out") 
       .to(".foudre-main-title", { webkitTextStroke: "2px #FFFFFF", duration: 1 }, "shuffle1_out") 
       .to(".wrap2", { x: 250, y: -40, rotation: 15, duration: 0.8, ease: "power2.inOut" }, "shuffle1_out") 
       .to(".wrap1", { x: -250, y: 30, rotation: -15, duration: 0.8, ease: "power2.inOut" }, "shuffle1_out")
       .to("#acc-1 .acc-title", { color: "transparent", webkitTextStroke: "2px #ffffff", duration: 0.8 }, "shuffle1_out")
       .to("#acc-1 .acc-content", { height: 0, opacity: 0, duration: 0.8 }, "shuffle1_out")
       .set(".wrap2", { zIndex: 1 })
       .set(".wrap1", { zIndex: 5 })
       .add("shuffle1_in")
       .to(".wrap2", { x: 40, y: 0, rotation: 5, scale: 0.9, duration: 0.8, ease: "power2.inOut" }, "shuffle1_in")
       .to(".wrap1", { x: 0, y: 0, rotation: 0, scale: 1.05, duration: 0.8, ease: "power2.inOut" }, "shuffle1_in")
       .to("#acc-2 .acc-title", { color: "#FFFFFF", webkitTextStroke: "0px", duration: 0.8 }, "shuffle1_in")
       .to("#acc-2 .acc-content p", { color: "#FFFFFF", duration: 0.8 }, "shuffle1_in")
       .to("#acc-2 .acc-content", { height: "auto", opacity: 1, duration: 0.8 }, "shuffle1_in");

aboutTl.to({}, {duration: 0.2}); 

// ACTION 3: SHUFFLE TO SKILLS & TURN BG OFF-WHITE
aboutTl.add("shuffle2_out")
       .to("body", { backgroundColor: "#f4f4f4", duration: 1 }, "shuffle2_out") 
       .to(".foudre-sub-text", { color: "#0A192F", duration: 1 }, "shuffle2_out") 
       .to(".foudre-main-title", { webkitTextStroke: "2px #0A192F", duration: 1 }, "shuffle2_out") 
       .to(".acc-title", { webkitTextStroke: "2px #0A192F", duration: 1 }, "shuffle2_out") 
       .to(".wrap1", { x: 250, y: -40, rotation: 15, duration: 0.8, ease: "power2.inOut" }, "shuffle2_out") 
       .to(".wrap3", { x: -250, y: 30, rotation: -15, duration: 0.8, ease: "power2.inOut" }, "shuffle2_out")
       .to("#acc-2 .acc-title", { color: "transparent", webkitTextStroke: "2px #0A192F", duration: 0.8 }, "shuffle2_out")
       .to("#acc-2 .acc-content", { height: 0, opacity: 0, duration: 0.8 }, "shuffle2_out")
       .set(".wrap1", { zIndex: 1 })
       .set(".wrap3", { zIndex: 5 })
       .add("shuffle2_in")
       .to(".wrap1", { x: -40, y: 0, rotation: -5, scale: 0.9, duration: 0.8, ease: "power2.inOut" }, "shuffle2_in")
       .to(".wrap3", { x: 0, y: 0, rotation: 0, scale: 1.05, duration: 0.8, ease: "power2.inOut" }, "shuffle2_in")
       .to("#acc-3 .acc-title", { color: "#0A192F", webkitTextStroke: "0px", duration: 0.8 }, "shuffle2_in")
       .to("#acc-3 .acc-content p", { color: "#0A192F", duration: 0.8 }, "shuffle2_in")
       .to("#acc-3 .acc-content", { height: "auto", opacity: 1, duration: 0.8 }, "shuffle2_in");

aboutTl.to({}, {duration: 0.2});


// ==========================================
// PAGE 3: GERARD ZOOM (Calculated Last!)
// ==========================================

// Smooth background color morph back to Yellow
gsap.to("body", {
    backgroundColor: "#FFD700", 
    scrollTrigger: {
        trigger: ".zoom-container",
        start: "top 60%", 
        end: "top 20%",
        scrub: true
    }
});

// Simultaneous morph of the SVG mask rect
gsap.to("#mask-rect", {
    fill: "#FFD700",
    scrollTrigger: {
        trigger: ".zoom-container",
        start: "top 60%",
        end: "top 20%",
        scrub: true
    }
});

// Slanted Zoom-Through Animation
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

// ==========================================
// PAGE 4: EDGE STUDIO SLIDER & ZOOM SYNC
// ==========================================

// 1. Sync Reveal perfectly with the GERARD Zoom
// We tie a timeline directly to the 2500px zoom container.
const revealTl = gsap.timeline({
    scrollTrigger: {
        trigger: ".zoom-container",
        start: "top top",
        end: "+=2500", // Maps perfectly to the GERARD zoom
        scrub: true
    }
});

// Wait in the background for 80% of the zoom, then fade up on top of the yellow!
revealTl.to({}, { duration: 0.8 }) 
        .to(".content-section", { autoAlpha: 1, scale: 1, pointerEvents: "auto", duration: 0.2 });


// 2. Carousel Slider, Hover Sync, & Click Logic
const track = document.getElementById('track');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const numbers = document.querySelectorAll('.num');
const cards = document.querySelectorAll('.edge-card');

// Calculate exact scroll amount (Card width + gap)
const getScrollAmount = () => cards[0].offsetWidth + parseFloat(window.getComputedStyle(track).gap);

// Button Arrow Scrolling
btnNext.addEventListener('click', () => { track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' }); });
btnPrev.addEventListener('click', () => { track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' }); });

// Click numbers to scroll directly to a specific card
numbers.forEach((num, index) => {
    num.addEventListener('click', () => {
        track.scrollTo({ left: index * getScrollAmount(), behavior: 'smooth' });
    });
});

// Hover over a card to immediately highlight the corresponding number below it
cards.forEach((card, index) => {
    card.addEventListener('mouseenter', () => {
        numbers.forEach(n => n.classList.remove('active'));
        if(numbers[index]) numbers[index].classList.add('active');
    });
});

// HORIZONTAL MOUSE WHEEL SCROLL FIX
track.addEventListener('wheel', (e) => {
    if (e.deltaY !== 0) {
        // Stop page from jittering vertically while scrolling horizontal
        e.preventDefault(); 
        track.scrollLeft += e.deltaY;
    }
}, { passive: false });

// ==========================================
// PAGE 5: FOOTER UNRAVEL, SCATTER, & FALL
// ==========================================

// 1. Scatter and Float the Emojis (The Bodyguards)
const emojis = gsap.utils.toArray('.float-emoji');

// Define safe zones around the edge of the box so they don't hide behind the text
const safeZones = [
    { left: 10, top: 20 }, // 1. Top Far Left
    { left: 30, top: 10 }, // 2. Top Mid Left (Above the G)
    { left: 70, top: 10 }, // 3. Top Mid Right (Above the X)
    { left: 90, top: 20 }, // 4. Top Far Right
    { left: 8,  top: 50 }, // 5. Middle Far Left
    { left: 92, top: 50 }, // 6. Middle Far Right
    { left: 15, top: 80 }, // 7. Bottom Far Left
    { left: 35, top: 85 }, // 8. Bottom Mid Left (Under the E/N)
    { left: 65, top: 85 }, // 9. Bottom Mid Right (Under the I)
    { left: 85, top: 80 }  // 10. Bottom Far Right
];

emojis.forEach((emoji, index) => {
    // Assign each emoji to its own locked zone
    let zone = safeZones[index % safeZones.length];

    // Set initial position exactly at the safe zone
    gsap.set(emoji, {
        left: zone.left + "%", 
        top: zone.top + "%",
        xPercent: -50, 
        yPercent: -50,
        rotation: gsap.utils.random(-30, 30)
    });
    
    // Constrained floating animation so their paths never cross
    gsap.to(emoji, {
        y: gsap.utils.random(-15, 15), 
        x: gsap.utils.random(-15, 15), 
        rotation: "+=" + gsap.utils.random(-20, 20),
        duration: gsap.utils.random(2.5, 4),
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
    });
});

// 2. The Master Scrub Timeline (with GENIX Fall)
const footerTl = gsap.timeline({
    scrollTrigger: {
        trigger: ".footer-scroll-trigger",
        start: "top top", 
        end: "bottom bottom", 
        scrub: 1.5 
    }
});

footerTl.set(".page5-container", { visibility: "visible" })
        .to(".content-section", { autoAlpha: 0, duration: 0.2 }) 
        .add("unravel")
        .to(".blind-up", { y: "-100vh", duration: 1, ease: "power2.inOut" }, "unravel")
        .to(".blind-down", { y: "100vh", duration: 1, ease: "power2.inOut" }, "unravel")
        .to({}, { duration: 0.5 })
        .add("footerUp")
        .to(".footer-video-bg", { filter: "blur(12px) brightness(0.4)", duration: 1 }, "footerUp")
        .to(".navy-footer-box", { opacity: 1, scale: 1, duration: 1, ease: "power2.out" }, "footerUp")
        
        // 3. The GENIX Falling Animation (Chaotic Random Drop!)
        .from(".giant-genix-outline span", { 
            y: -250,                                
            scale: 1.2,                             
            opacity: 0,                             
            rotation: () => gsap.utils.random(-25, 25), 
            duration: 1.2,
            stagger: {
                each: 0.15,      
                from: "random"   
            },
            ease: "back.out(1.5)"                   
        }, "footerUp+=0.1");
gsap.registerPlugin(ScrollTrigger);

// ==========================================
// BACKGROUND MUSIC LOGIC
// ==========================================
const bgMusic = document.getElementById('bg-music');
const musicToggleBtn = document.getElementById('music-toggle');
let isMusicPlaying = false;

const MUSIC_VOLUME = 0.25;
const setMusicVolumeHalf = () => {
    bgMusic.volume = MUSIC_VOLUME;
};
setMusicVolumeHalf();
bgMusic.addEventListener('loadedmetadata', setMusicVolumeHalf);
bgMusic.addEventListener('play', setMusicVolumeHalf);

// Browsers block autoplay. This waits for the user's VERY FIRST click anywhere on the page to start the music.
const startMusicOnInteraction = () => {
    if (!isMusicPlaying) {
        setMusicVolumeHalf();
        bgMusic.play();
        isMusicPlaying = true;
        musicToggleBtn.innerHTML = "🔊 MUTE MUSIC";
        // Remove this listener so it doesn't keep firing
        document.removeEventListener('click', startMusicOnInteraction);
    }
};
document.addEventListener('click', startMusicOnInteraction);

// Mute/Unmute Logic for the Hamburger Menu Button
musicToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Stops this click from triggering other events
    
    if (bgMusic.muted) {
        bgMusic.muted = false;
        musicToggleBtn.innerHTML = "🔊 MUTE MUSIC";
        musicToggleBtn.style.backgroundColor = "transparent";
        musicToggleBtn.style.color = "#FFD700";
    } else {
        bgMusic.muted = true;
        musicToggleBtn.innerHTML = "🔇 PLAY MUSIC";
        // Make it solid yellow when muted so it's visually obvious
        musicToggleBtn.style.backgroundColor = "#FFD700";
        musicToggleBtn.style.color = "#0A192F";
    }
});

// ==========================================
// 1. INITIAL LOADING SCREEN ANIMATION
// ==========================================
// Freeze scrolling while loading
document.body.style.overflow = "hidden";

const loaderTl = gsap.timeline({
    onComplete: () => {
        document.body.style.overflow = "auto"; // Re-enable scrolling
        gsap.set(".loader-wrapper", { display: "none" }); // Remove from DOM to prevent clicking issues
    }
});

loaderTl.from(".loader-text", { opacity: 0, scale: 0.8, duration: 1, ease: "power2.out" }) // Fade in text
        .to(".loader-text", { opacity: 0, y: -20, duration: 0.5, delay: 0.5 }) // Fade out text
        .to(".panel-top", { y: "-100vh", duration: 1, ease: "power2.inOut" }, "split") // Slide top piece up
        .to(".panel-bottom", { y: "100vh", duration: 1, ease: "power2.inOut" }, "split"); // Slide bottom piece down

// ==========================================
// 2. HAMBURGER MENU & NAVIGATION LOGIC
// ==========================================
const burgerBtn = document.getElementById('burger-btn');
const menuOverlay = document.getElementById('menu-overlay');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle Menu Open/Close
burgerBtn.addEventListener('click', () => {
    burgerBtn.classList.toggle('open');
    menuOverlay.classList.toggle('open');
});

// Custom Smooth Scrolling for GSAP Pinned Sections
// Custom Smooth Scrolling for GSAP Pinned Sections
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault(); 
        
        // Close the menu
        burgerBtn.classList.remove('open');
        menuOverlay.classList.remove('open');

        // OPTIMIZATION: Force Page 4 to drop its invisible wall instantly so it doesn't block the scroll jump!
        gsap.set(".content-section", { pointerEvents: "none" });

        const target = link.getAttribute('data-target');
        let scrollY = 0;

        if (target === "home") {
            scrollY = 0;
        } else if (target === "about") {
            const st = aboutTl.scrollTrigger;
            scrollY = st ? st.start + (st.end - st.start) * 0.92 : 1100;
        } else if (target === "work") {
            const st = revealTl.scrollTrigger;
            scrollY = st ? st.end - 40 : 4000;
        } else if (target === "contact") {
            scrollY = document.body.scrollHeight; 
        }

        // Execute the smooth scroll
        window.scrollTo({
            top: scrollY,
            behavior: 'smooth'
        });
    });
});

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

// ==========================================
// PAGE 2: ABOUT (one scroll in, hover to shuffle)
// ==========================================

gsap.set("#acc-1 .acc-title", { color: "#0A192F", webkitTextStroke: "0px" });
gsap.set("#acc-1 .acc-content", { height: "auto", opacity: 1 });

let lastAboutPanel = "acc-1";
let aboutGalleryActive = false;

const aboutLayouts = {
    "acc-1": {
        wrap1: { x: -40, y: 10, rotation: -8, scale: 0.9, zIndex: 1 },
        wrap2: { x: 0, y: -12, rotation: 0, scale: 1.08, zIndex: 5 },
        wrap3: { x: 40, y: 10, rotation: 8, scale: 0.9, zIndex: 2 }
    },
    "acc-2": {
        wrap1: { x: 0, y: -12, rotation: 0, scale: 1.08, zIndex: 5 },
        wrap2: { x: 48, y: 12, rotation: 10, scale: 0.9, zIndex: 2 },
        wrap3: { x: -48, y: 12, rotation: -10, scale: 0.9, zIndex: 1 }
    },
    "acc-3": {
        wrap1: { x: -48, y: 12, rotation: -10, scale: 0.9, zIndex: 1 },
        wrap2: { x: 48, y: 12, rotation: 10, scale: 0.9, zIndex: 2 },
        wrap3: { x: 0, y: -12, rotation: 0, scale: 1.08, zIndex: 5 }
    }
};

const restoreHomeGallery = () => {
    gsap.to(".wrap1", { x: -180, y: 0, rotation: -12, scale: 1, zIndex: 1, duration: 0.7, ease: "power2.inOut" });
    gsap.to(".wrap2", { x: 0, y: 0, rotation: 0, scale: 1, zIndex: 5, duration: 0.7, ease: "power2.inOut" });
    gsap.to(".wrap3", { x: 180, y: 0, rotation: 12, scale: 1, zIndex: 2, duration: 0.7, ease: "power2.inOut" });
    gsap.to("body", { "--about-a": "#f4f4f4", "--about-b": "#f4f4f4", duration: 0.7, ease: "power2.inOut" });
};

const aboutThemes = {
    "acc-1": {
        a: "#FFD700",
        b: "#FFD700",
        titleFill: "#0A192F",
        inactiveStroke: "2px #ffffff",
        content: "#0A192F",
        foudreStroke: "2px #0A192F",
        foudreSub: "#0A192F"
    },
    "acc-2": {
        a: "#0A192F",
        b: "#FFD700",
        titleFill: "#FFFFFF",
        inactiveStroke: "2px #ffffff",
        content: "#FFFFFF",
        foudreStroke: "2px #FFFFFF",
        foudreSub: "#FFFFFF"
    },
    "acc-3": {
        a: "#f4f4f4",
        b: "#FFD700",
        titleFill: "#0A192F",
        inactiveStroke: "2px #0A192F",
        content: "#0A192F",
        foudreStroke: "2px #0A192F",
        foudreSub: "#0A192F"
    }
};

const applyGerardTheme = (panelId, duration = 0.7) => {
    const personality = panelId === "acc-1";
    const gerardBg = personality ? "#0A192F" : "#FFD700";
    const text = personality ? "#FFD700" : "#0A192F";
    const ease = "power2.inOut";

    gsap.to("body", { "--gerard-bg": gerardBg, "--gerard-fade": gerardBg, duration, ease });
    gsap.to(".gerard-wordmark", { color: text, duration, ease });
    gsap.to(".gerard-tagline", { color: text, duration, ease });
    gsap.to(".gerard-cta", { color: text, borderColor: text, duration, ease });
};

const applyAboutPanel = (panelId, animate = true) => {
    lastAboutPanel = panelId;
    const duration = animate ? 0.7 : 0;
    const ease = "power2.inOut";
    const layout = aboutLayouts[panelId];
    const theme = aboutThemes[panelId];

    gsap.to("body", { "--about-a": theme.a, "--about-b": theme.b, duration, ease });
    gsap.to(".foudre-main-title", { webkitTextStroke: theme.foudreStroke, duration, ease });
    gsap.to(".foudre-sub-text", { color: theme.foudreSub, duration, ease });
    applyGerardTheme(panelId, duration);

    ["acc-1", "acc-2", "acc-3"].forEach((id) => {
        const active = id === panelId;
        gsap.to(`#${id} .acc-title`, {
            color: active ? theme.titleFill : "transparent",
            webkitTextStroke: active ? "0px" : theme.inactiveStroke,
            duration,
            ease
        });
        gsap.to(`#${id} .acc-content`, {
            height: active ? "auto" : 0,
            opacity: active ? 1 : 0,
            duration,
            ease
        });
        gsap.to(`#${id} .acc-content p`, {
            color: theme.content,
            duration,
            ease
        });
    });

    gsap.to(".wrap1", { ...layout.wrap1, duration, ease });
    gsap.to(".wrap2", { ...layout.wrap2, duration, ease });
    gsap.to(".wrap3", { ...layout.wrap3, duration, ease });
};

const aboutTl = gsap.timeline({
    scrollTrigger: {
        trigger: ".pinned-hero-about",
        pin: true,
        start: "top top",
        end: "+=1400",
        scrub: 1.5,
        onUpdate: (self) => {
            if (self.progress > 0.62) {
                if (!aboutGalleryActive) {
                    aboutGalleryActive = true;
                    applyAboutPanel(lastAboutPanel, true);
                }
            } else if (aboutGalleryActive) {
                aboutGalleryActive = false;
                restoreHomeGallery();
            }
        },
        onEnterBack: () => {
            aboutGalleryActive = true;
            applyAboutPanel(lastAboutPanel, true);
        }
    }
});

aboutTl.to(".page1-content", { y: "-100vh", duration: 1, ease: "power2.inOut" }, 0)
       .to(".page2-content", { y: "0", duration: 1, ease: "power2.inOut" }, 0);

["acc-1", "acc-2", "acc-3"].forEach((id) => {
    const item = document.getElementById(id);
    item.addEventListener("mouseenter", () => {
        applyAboutPanel(id, true);
    });
});


// ==========================================
// PAGE 3: GERARD TITLE
// Pin duration stays +=2500 so Page 4 still reveals on the same scroll.
// Scale-80 zoom and mask fill were removed with the old GERARD cutout.
// ==========================================

gsap.to("body", {
    scrollTrigger: {
        trigger: ".zoom-container",
        start: "top 70%",
        end: "top 25%",
        scrub: true,
        onUpdate: () => applyGerardTheme(lastAboutPanel, 0.2)
    }
});

ScrollTrigger.create({
    trigger: ".zoom-container",
    start: "top top",
    end: "+=2500",
    pin: true,
    scrub: 1
});

// ==========================================
// PAGE 4: EDGE STUDIO SLIDER
// ==========================================

const revealTl = gsap.timeline({
    scrollTrigger: {
        trigger: ".zoom-container",
        start: "top top",
        end: "+=2500", 
        scrub: true
    }
});

revealTl.to({}, { duration: 0.8 }) 
        .to(".content-section", { autoAlpha: 1, scale: 1, pointerEvents: "auto", duration: 0.2 });

const track = document.getElementById('track');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const numbers = document.querySelectorAll('.num');
const cards = document.querySelectorAll('.edge-card');

const getScrollAmount = () => cards[0].offsetWidth + parseFloat(window.getComputedStyle(track).gap);

btnNext.addEventListener('click', () => { track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' }); });
btnPrev.addEventListener('click', () => { track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' }); });

numbers.forEach((num, index) => {
    num.addEventListener('click', () => {
        track.scrollTo({ left: index * getScrollAmount(), behavior: 'smooth' });
    });
});

cards.forEach((card, index) => {
    card.addEventListener('mouseenter', () => {
        numbers.forEach(n => n.classList.remove('active'));
        if(numbers[index]) numbers[index].classList.add('active');
    });
});

// Horizontal scroll breakout so you don't get stuck
track.addEventListener('wheel', (e) => {
    const isAtLeftEdge = track.scrollLeft <= 2;
    const isAtRightEdge = Math.ceil(track.scrollLeft + track.clientWidth) >= (track.scrollWidth - 2);

    if (e.deltaY < 0 && isAtLeftEdge) return; 
    if (e.deltaY > 0 && isAtRightEdge) return;

    e.preventDefault(); 
    track.scrollLeft += e.deltaY;
}, { passive: false });

// ==========================================
// PAGE 5: FOOTER UNRAVEL, SCATTER, & FALL
// ==========================================

const emojis = gsap.utils.toArray('.float-emoji');

const safeZones = [
    { left: 10, top: 20 }, { left: 30, top: 10 }, { left: 70, top: 10 }, { left: 90, top: 20 },
    { left: 8,  top: 50 }, { left: 92, top: 50 }, { left: 15, top: 80 }, { left: 35, top: 85 },
    { left: 65, top: 85 }, { left: 85, top: 80 }
];

emojis.forEach((emoji, index) => {
    let zone = safeZones[index % safeZones.length];
    gsap.set(emoji, {
        left: zone.left + "%", top: zone.top + "%",
        xPercent: -50, yPercent: -50,
        rotation: gsap.utils.random(-30, 30)
    });
    
    gsap.to(emoji, {
        y: gsap.utils.random(-15, 15), x: gsap.utils.random(-15, 15), 
        rotation: "+=" + gsap.utils.random(-20, 20),
        duration: gsap.utils.random(2.5, 4),
        yoyo: true, repeat: -1, ease: "sine.inOut"
    });
});

// THE KILL SWITCH: Notice the onEnter and onLeaveBack commands here.
const footerTl = gsap.timeline({
    scrollTrigger: {
        trigger: ".footer-scroll-trigger",
        start: "top top", 
        end: "bottom bottom", 
        scrub: 1.5,
        onEnter: () => gsap.set(".page5-container", { autoAlpha: 1 }),      // Turns ON when scrolling down
        onLeaveBack: () => gsap.set(".page5-container", { autoAlpha: 0 }) // KILL SWITCH: Forces it OFF when scrolling up
    }
});

// The set() is gone from here, animations remain exactly the same.
footerTl.add("unravel")
        .to(".blind-up", { y: "-100vh", duration: 1, ease: "power2.inOut" }, "unravel")
        .to(".blind-down", { y: "100vh", duration: 1, ease: "power2.inOut" }, "unravel")
        .to({}, { duration: 0.5 })
        .add("footerUp")
        .to(".footer-video-bg", { filter: "blur(12px) brightness(0.4)", duration: 1 }, "footerUp")
        .to(".navy-footer-box", { opacity: 1, scale: 1, duration: 1, ease: "power2.out" }, "footerUp")
        .from(".giant-genix-outline span", { 
            y: -250,                                
            scale: 1.2,                             
            opacity: 0,                             
            rotation: () => gsap.utils.random(-25, 25), 
            duration: 1.2,
            stagger: { each: 0.15, from: "random" },
            ease: "back.out(1.5)"                   
        }, "footerUp+=0.1");

// ==========================================
// MOBILE WARNING & FLOATING EMOJI LOGIC
// ==========================================
let emojisAnimated = false; // Flag to prevent re-running the animation

function handleMobileLockout() {
    const warningOverlay = document.getElementById('mobile-warning-overlay');

    // Check if the screen is mobile/tablet width
    if (window.innerWidth <= 1024) {
        warningOverlay.style.display = 'flex';

        // Animate the emojis ONLY if they haven't been animated yet
        if (!emojisAnimated) {
            const emojisM = gsap.utils.toArray('.emoji-m');
            
            // STRICT SAFE ZONES: Corners, far edges, top, and bottom. Away from the center!
            const mobileSafeZones = [
                { left: 15, top: 12 }, { left: 85, top: 12 }, // Top Corners
                { left: 35, top: 8 },  { left: 65, top: 8 },  // Top Middle
                { left: 15, top: 88 }, { left: 85, top: 88 }, // Bottom Corners
                { left: 35, top: 92 }, { left: 65, top: 92 }, // Bottom Middle
                { left: 8, top: 50 },  { left: 92, top: 50 }  // Left & Right Edges
            ];

            emojisM.forEach((emoji, index) => {
                let zone = mobileSafeZones[index % mobileSafeZones.length];
                
                // Snap them to their safe zones
                gsap.set(emoji, {
                    opacity: 1,
                    left: zone.left + "%",
                    top: zone.top + "%",
                    xPercent: -50,
                    yPercent: -50,
                    scale: gsap.utils.random(0.8, 1.2),
                    rotation: gsap.utils.random(-45, 45)
                });

                // Tighter float animation so they don't wander into the yellow box
                gsap.to(emoji, {
                    x: gsap.utils.random(-15, 15),
                    y: gsap.utils.random(-15, 15),
                    rotation: "+=" + gsap.utils.random(-30, 30),
                    duration: gsap.utils.random(15, 25),
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut"
                });
            });
            emojisAnimated = true; 
        }

        // Ensure background music continues
        const bgMusic = document.getElementById('bg-music');
        if (bgMusic && bgMusic.paused && !bgMusic.ended) {
            document.addEventListener('click', () => { bgMusic.volume = MUSIC_VOLUME; bgMusic.play(); isMusicPlaying = true; }, { once: true });
        }

    } else {
        warningOverlay.style.display = 'none';
        
        const bgMusic = document.getElementById('bg-music');
        if (bgMusic && bgMusic.paused && !bgMusic.ended) {
             document.addEventListener('click', () => { bgMusic.volume = MUSIC_VOLUME; bgMusic.play(); isMusicPlaying = true; }, { once: true });
        }
    }
}

// -------------------------------------------------------------
// UNIFIED TRIGGERS
// -------------------------------------------------------------
loaderTl.call(handleMobileLockout);
window.addEventListener('resize', handleMobileLockout); 
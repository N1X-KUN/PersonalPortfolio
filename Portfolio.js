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
    gsap.to("body", { backgroundColor: "#f4f4f4", duration: 0.7, ease: "power2.inOut" });
};

const aboutThemes = {
    "acc-1": {
        bg: "#FFD700",
        titleFill: "#0A192F",
        inactiveStroke: "2px #ffffff",
        content: "#0A192F",
        foudreStroke: "2px #0A192F",
        foudreSub: "#0A192F"
    },
    "acc-2": {
        bg: "#0A192F",
        titleFill: "#FFFFFF",
        inactiveStroke: "2px #ffffff",
        content: "#FFFFFF",
        foudreStroke: "2px #FFFFFF",
        foudreSub: "#FFFFFF"
    },
    "acc-3": {
        bg: "#f4f4f4",
        titleFill: "#0A192F",
        inactiveStroke: "2px #0A192F",
        content: "#0A192F",
        foudreStroke: "2px #0A192F",
        foudreSub: "#0A192F"
    }
};

const gerardPageColor = (panelId) => (panelId === "acc-1" ? "#0A192F" : "#FFD700");

let aboutGerardColorTween;

const rebuildAboutGerardColorScroll = () => {
    if (aboutGerardColorTween) {
        if (aboutGerardColorTween.scrollTrigger) aboutGerardColorTween.scrollTrigger.kill();
        aboutGerardColorTween.kill();
    }
    
    // We only want the body color to animate back to the Gerard page default IF it's not currently locked by the White Project Page
    const currentThemeBg = aboutThemes[lastAboutPanel].bg;
    const targetGerardBg = gerardPageColor(lastAboutPanel);
    
    aboutGerardColorTween = gsap.fromTo("body",
        { backgroundColor: currentThemeBg },
        {
            backgroundColor: targetGerardBg,
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
                trigger: ".zoom-container",
                start: "top 80%",
                end: "top top",
                scrub: 1,
                // Only allow this color scrub if we haven't hit the white project page yet
                onUpdate: (self) => {
                    const whiteContainer = document.querySelector('.project-page-container');
                    if (whiteContainer && gsap.getProperty(whiteContainer, "opacity") === 0) {
                         gsap.set("body", { backgroundColor: gsap.utils.interpolate(currentThemeBg, targetGerardBg, self.progress) });
                    }
                }
            }
        }
    );
};

const applyGerardTheme = (panelId, duration = 0.7) => {
    const personality = panelId === "acc-1";
    const gerardBg = gerardPageColor(panelId);
    const text = personality ? "#FFD700" : "#0A192F";
    const ease = "power2.inOut";

    gsap.to("body", { "--gerard-fade": gerardBg, duration, ease });
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

    gsap.to("body", { backgroundColor: theme.bg, duration, ease });
    gsap.to(".foudre-main-title", { webkitTextStroke: theme.foudreStroke, duration, ease });
    gsap.to(".foudre-sub-text", { color: theme.foudreSub, duration, ease });
    applyGerardTheme(panelId, duration);
    rebuildAboutGerardColorScroll();

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
// PAGE 3 → PAGE 4: GLITCH TRANSITION
// ==========================================

rebuildAboutGerardColorScroll();

const gerardPinDistance = 1400;
const clipRoot = document.getElementById("caseRevealClip");
const outlineRoot = document.querySelector(".glitch-outlines");
const ns = "http://www.w3.org/2000/svg";
const revealRects = [];

for (let i = 0; i < 28; i++) {
    const rect = document.createElementNS(ns, "rect");
    const w = gsap.utils.random(0.08, 0.34);
    const h = gsap.utils.random(0.08, 0.38);
    const x = gsap.utils.random(0, 1 - w);
    rect.setAttribute("x", String(x));
    rect.setAttribute("width", String(w));
    rect.setAttribute("height", String(h));
    rect.setAttribute("y", "1.2");
    clipRoot.appendChild(rect);

    const outline = document.createElementNS(ns, "rect");
    outline.setAttribute("x", String(x));
    outline.setAttribute("width", String(w));
    outline.setAttribute("height", String(h));
    outline.setAttribute("y", "1.2");
    outlineRoot.appendChild(outline);

    revealRects.push({
        el: rect,
        outline,
        targetY: gsap.utils.random(0, Math.max(0.02, 1 - h)),
        startAt: gsap.utils.random(0, 0.42)
    });
}

const coverRect = document.createElementNS(ns, "rect");
coverRect.setAttribute("x", "0");
coverRect.setAttribute("width", "1");
coverRect.setAttribute("height", "1");
coverRect.setAttribute("y", "1.15");
clipRoot.appendChild(coverRect);

const revealTl = gsap.timeline({
    scrollTrigger: {
        trigger: ".zoom-container",
        start: "top top",
        end: `+=${gerardPinDistance}`,
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
            gsap.set(".project-page-container", {
                pointerEvents: self.progress > 0.72 ? "auto" : "none"
            });
            // EXACT ORIGINAL GLITCH OUTLINE LOGIC RESTORED
            gsap.set(outlineRoot, {
                opacity: self.progress > 0.03 && self.progress < 0.78 ? 1 : 0
            });
        }
    }
});

revealRects.forEach(({ el, outline, targetY, startAt }) => {
    revealTl.fromTo(el, { attr: { y: 1.25 } }, { attr: { y: targetY }, duration: 0.5, ease: "none" }, startAt);
    revealTl.fromTo(outline, { attr: { y: 1.25 } }, { attr: { y: targetY }, duration: 0.5, ease: "none" }, startAt);
});

revealTl.fromTo(coverRect, { attr: { y: 1.12 } }, { attr: { y: 0 }, duration: 0.35, ease: "none" }, 0.58);

// ==========================================
// PAGE 4: PROJECT PAGE HOVER LOGIC (3D Tilt)
// ==========================================

const projectItems = document.querySelectorAll('.project-item');
const hoverContainer = document.querySelector('.hover-media-container');
const hoverVideo = document.querySelector('.hover-video');
const hoverImage = document.querySelector('.hover-image');

// Center perfectly on cursor & set 3D perspective
gsap.set(hoverContainer, { xPercent: -50, yPercent: -50, transformPerspective: 1000 });

document.addEventListener('mousemove', (e) => {
    if(hoverContainer.classList.contains('active')) {
        const xPos = (e.clientX / window.innerWidth) - 0.5;
        const yPos = (e.clientY / window.innerHeight) - 0.5;

        gsap.to(hoverContainer, {
            x: e.clientX,
            y: e.clientY,
            rotationY: xPos * 40, 
            rotationX: -yPos * 40, 
            duration: 0.6,
            ease: "power3.out"
        });
    }
});

projectItems.forEach(item => {
    item.addEventListener('mouseenter', (e) => {
        const mediaSrc = item.getAttribute('data-media');
        const mediaType = item.getAttribute('data-type');
        
        const xPos = (e.clientX / window.innerWidth) - 0.5;
        const yPos = (e.clientY / window.innerHeight) - 0.5;

        gsap.set(hoverContainer, { 
            x: e.clientX, 
            y: e.clientY,
            rotationY: xPos * 40,
            rotationX: -yPos * 40,
            scale: 0.7 
        });

        if (mediaType === 'video') {
            hoverVideo.src = mediaSrc;
            hoverVideo.classList.add('show');
            hoverImage.classList.remove('show');
            hoverVideo.play();
        } else {
            hoverImage.src = mediaSrc;
            hoverImage.classList.add('show');
            hoverVideo.classList.remove('show');
            hoverVideo.pause();
        }
        
        hoverContainer.classList.add('active');
        gsap.to(hoverContainer, { scale: 1, duration: 0.5, ease: "back.out(1.5)" });
    });

    item.addEventListener('mouseleave', () => {
        hoverContainer.classList.remove('active');
        gsap.to(hoverContainer, { scale: 0.7, duration: 0.4, ease: "power2.in" });
        setTimeout(() => {
            if(!hoverContainer.classList.contains('active')) hoverVideo.pause();
        }, 400);
    });
});

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

// ==========================================
// MODAL POP-UP LOGIC
// ==========================================

const modalCS = document.getElementById('modal-customer-service');
const triggerCS = document.getElementById('trigger-cs');
const closeBtns = document.querySelectorAll('.modal-close-btn');

// 1. Open the Modal when clicking "Customer Services"
if (triggerCS && modalCS) {
    // Add the event listener, but pass 'e' (the event) to handle the exact click target
    triggerCS.addEventListener('click', (e) => {
        // Prevent any default link behavior or bubbling issues
        e.preventDefault();
        
        modalCS.classList.add('active');
        document.body.style.overflow = "hidden"; // Freeze background scrolling
        
        // Force the 3D media box to vanish instantly
        gsap.set('.hover-media-container', { opacity: 0, display: "none" });
    });
} else {
    console.error("Modal or Trigger ID not found! Check your HTML.");
}

// Function to smoothly close the modal
const closeModal = () => {
    if (modalCS.classList.contains('active')) {
        modalCS.classList.remove('active');
        document.body.style.overflow = "auto"; // Unfreeze background
        
        // Clear both opacity AND display so the 3D media box works again!
        gsap.set('.hover-media-container', { clearProps: "opacity,display" });
    }
};

// 2. Close when clicking the 'X' button
closeBtns.forEach(btn => {
    btn.addEventListener('click', closeModal);
});

// 3. Close when pressing 'Escape'
document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") {
        closeModal();
    }
});

// ==========================================
// AUTO-HANDWRITING BACKGROUND ANIMATION
// ==========================================
const hwNotes = gsap.utils.toArray('.hw-note');
let hwQueueTimer = null;
let currentNoteIndex = 0;
let activeZones = [];

// 5 strictly separated zones so words NEVER spawn close to each other
const outerSafeZones = [
    { topMin: 10, topMax: 15, leftMin: 6,  leftMax: 14, tiltMin: -12, tiltMax: -5 }, // 1. Top-Left
    { topMin: 10, topMax: 15, leftMin: 75, leftMax: 83, tiltMin: 5,   tiltMax: 12 }, // 2. Top-Right
    { topMin: 48, topMax: 55, leftMin: 83, leftMax: 88, tiltMin: 6,   tiltMax: 12 }, // 3. Far-Right Middle
    { topMin: 89, topMax: 92, leftMin: 7,  leftMax: 16, tiltMin: -2,  tiltMax: 2  }, // 4. Bottom-Left (Straight landscape)
    { topMin: 90, topMax: 93, leftMin: 42, leftMax: 54, tiltMin: -1,  tiltMax: 1  }  // 5. Bottom-Center Red Box (Straight landscape)
];

// 1. Split each phrase into individual letter spans
hwNotes.forEach(note => {
    const text = note.textContent;
    note.innerHTML = '';
    text.split('').forEach(char => {
        const span = document.createElement('span');
        span.className = 'hw-char';
        span.innerHTML = char === ' ' ? '&nbsp;' : char;
        note.appendChild(span);
    });
});

// Helper: Write a single note in its own separated zone, then wiggle on standby
const spawnNextHandwritingNote = () => {
    if (currentNoteIndex >= hwNotes.length) return;

    const note = hwNotes[currentNoteIndex];
    const zone = activeZones[currentNoteIndex];
    const chars = note.querySelectorAll('.hw-char');

    // Pick random coordinates & zone-specific tilt (keeps bottom ones straight landscape!)
    const randomTop = gsap.utils.random(zone.topMin, zone.topMax);
    const randomLeft = gsap.utils.random(zone.leftMin, zone.leftMax);
    const randomTilt = gsap.utils.random(zone.tiltMin, zone.tiltMax);

    gsap.set(note, {
        top: `${randomTop}%`,
        left: `${randomLeft}%`,
        rotation: randomTilt
    });

    gsap.killTweensOf(chars);

    // Step A: Write out letter-by-letter
    gsap.fromTo(chars,
        { opacity: 0, y: 6, scale: 0.8 },
        {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.1,
            stagger: 0.045,
            ease: "power1.out",
            onComplete: () => {
                // Step B: Standby "Alive" Wiggle after writing finishes
                chars.forEach((char, i) => {
                    gsap.to(char, {
                        y: () => gsap.utils.random(-2.5, 2.5),
                        x: () => gsap.utils.random(-1.2, 1.2),
                        rotation: () => gsap.utils.random(-5, 5),
                        duration: gsap.utils.random(0.45, 0.75),
                        repeat: -1,
                        yoyo: true,
                        ease: "sine.inOut",
                        delay: i * 0.03
                    });
                });
            }
        }
    );

    currentNoteIndex++;

    // Queue the next phrase to write out after the current one finishes
    if (currentNoteIndex < hwNotes.length) {
        const writeDuration = (chars.length * 45) + 450;
        hwQueueTimer = setTimeout(spawnNextHandwritingNote, writeDuration);
    }
};

// 2. Trigger one-by-one when hovering the 3 project items
const projectListWrapper = document.querySelector('.project-list-wrapper');

projectItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        // If starting fresh from idle, shuffle phrases and zones and start with 1 word
        if (currentNoteIndex === 0) {
            gsap.utils.shuffle(hwNotes);
            activeZones = gsap.utils.shuffle([...outerSafeZones]);
            spawnNextHandwritingNote();
        } else if (currentNoteIndex < hwNotes.length) {
            // Moving to the next topic immediately triggers the next word
            clearTimeout(hwQueueTimer);
            spawnNextHandwritingNote();
        }
    });
});

// 3. Fade out and reset when mouse leaves the project list completely
if (projectListWrapper) {
    projectListWrapper.addEventListener('mouseleave', () => {
        clearTimeout(hwQueueTimer);
        currentNoteIndex = 0;
        const allChars = document.querySelectorAll('.hw-char');
        gsap.killTweensOf(allChars);
        gsap.to(allChars, {
            opacity: 0,
            duration: 0.25,
            ease: "power1.in"
        });
    });
}
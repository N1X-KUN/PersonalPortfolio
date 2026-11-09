gsap.registerPlugin(ScrollTrigger);

// ==========================================
// 0. EXACT TRANSPARENT "GX" FAVICON GENERATOR
// ==========================================
const generateExactGXFavicon = async () => {
    if (document.fonts && document.fonts.ready) {
        await document.fonts.ready; // Wait for 'Luckiest Guy' Google Font to load
    }
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, 256, 256); // 100% Transparent Background
    ctx.save();
    ctx.translate(128, 142);
    ctx.transform(1, 0, -0.22, 1, 0, 0); // Matches skewX(-12deg) from .gx-only-letters

    // Scaled to 148px inside a 256x256 square so the G and X are NEVER clipped on the edges!
    ctx.font = '148px "Luckiest Guy", cursive';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round';
    ctx.miterLimit = 2;

    // 1. Hard Navy Drop Shadow
    ctx.fillStyle = '#0A192F';
    ctx.fillText('GX', 8, 8);

    // 2. Thick Yellow Outline (#FFD700)
    ctx.lineWidth = 26;
    ctx.strokeStyle = '#FFD700';
    ctx.strokeText('GX', 0, 0);

    // 3. Navy Blue Inner Fill (#0A192F)
    ctx.fillStyle = '#0A192F';
    ctx.fillText('GX', 0, 0);
    ctx.restore();

    const dataUrl = canvas.toDataURL('image/png');
    let fav = document.getElementById('dynamic-favicon') || document.querySelector("link[rel*='icon']");
    if (!fav) {
        fav = document.createElement('link');
        fav.rel = 'icon';
        document.head.appendChild(fav);
    }
    fav.type = 'image/png';
    fav.href = dataUrl;

    // Optional helper: Type downloadGXLogo() in your browser F12 console anytime to save the transparent PNG file!
    window.downloadGXLogo = () => {
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = 'GX-Logo.png';
        a.click();
    };
};
generateExactGXFavicon();

// ==========================================
// BACKGROUND MUSIC LOGIC (Locked at 5% Volume)
// ==========================================
const bgMusic = document.getElementById("bg-music");
const musicToggleBtn = document.getElementById('music-toggle');
let isMusicPlaying = false;

const MUSIC_VOLUME = 0.05; // 5% volume on both Desktop and Mobile
const setMusicVolume = () => {
    if (bgMusic) bgMusic.volume = MUSIC_VOLUME;
};
setMusicVolume();
if (bgMusic) {
    bgMusic.addEventListener('loadedmetadata', setMusicVolume);
    bgMusic.addEventListener('play', setMusicVolume);
}

const startMusicOnInteraction = () => {
    if (!isMusicPlaying && bgMusic) {
        setMusicVolume();
        bgMusic.play().catch(() => {});
        isMusicPlaying = true;
        if (musicToggleBtn) musicToggleBtn.innerHTML = "🔊 MUTE MUSIC";
        document.removeEventListener('click', startMusicOnInteraction);
        document.removeEventListener('touchstart', startMusicOnInteraction);
    }
};
document.addEventListener('click', startMusicOnInteraction);
document.addEventListener('touchstart', startMusicOnInteraction, { passive: true });

if (musicToggleBtn && bgMusic) {
    musicToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (bgMusic.muted) {
            bgMusic.muted = false;
            musicToggleBtn.innerHTML = "🔊 MUTE MUSIC";
            musicToggleBtn.style.backgroundColor = "transparent";
            musicToggleBtn.style.color = "#FFD700";
        } else {
            bgMusic.muted = true;
            musicToggleBtn.innerHTML = "🔇 PLAY MUSIC";
            musicToggleBtn.style.backgroundColor = "#FFD700";
            musicToggleBtn.style.color = "#0A192F";
        }
    });
}

// ==========================================
// 1. INITIAL LOADING SCREEN ANIMATION (2.5s Desktop / 5s Mobile with Dancing GIF)
// ==========================================
document.body.style.overflow = "hidden";

const isMobileStartup = window.innerWidth <= 1024;
const loaderHoldSeconds = isMobileStartup ? 3.0 : 0.5; // 5s total on mobile, 2.5s total on desktop

const loaderTl = gsap.timeline({
    onComplete: () => {
        // Keep overflow locked on mobile so it stays a strict single-screen experience
        document.body.style.overflow = window.innerWidth <= 1024 ? "hidden" : "auto";
        gsap.set(".loader-wrapper", { display: "none" });
    }
});

loaderTl.from(".loader-center-stack", { opacity: 0, scale: 0.85, duration: 0.7, ease: "power2.out" })
        .to("#loader-progress-bar", { width: "100%", duration: loaderHoldSeconds, ease: "none" })
        .to(".loader-center-stack", { opacity: 0, y: -20, duration: 0.35 })
        .to(".panel-top", { y: "-100vh", duration: 0.95, ease: "power2.inOut" }, "split")
        .to(".panel-bottom", { y: "100vh", duration: 0.95, ease: "power2.inOut" }, "split");

// ==========================================
// 2. HEADER, HOVER SUB-NAV, [GX] LOGO & WORD CHANGER
// ==========================================
const siteHeader = document.getElementById('site-header');
const burgerBtn = document.getElementById('burger-btn');
const menuOverlay = document.getElementById('menu-overlay');
const gxBrandLink = document.getElementById('gx-brand-link');
const navProjectsWrap = document.getElementById('nav-projects-wrap');
const navProjectsBtn = document.getElementById('nav-projects-btn');
const projectsSubnavBar = document.getElementById('projects-subnav-bar');
const topNavLinks = document.querySelectorAll('.top-nav-item[data-nav]');
const subnavCards = document.querySelectorAll('.subnav-card[data-open-modal]');

let subnavCloseTimer = null;

const openProjectsSubnav = () => {
    if (window.scrollY > 120) return; // Only active on Homepage
    clearTimeout(subnavCloseTimer);
    if (projectsSubnavBar) projectsSubnavBar.classList.add('open');
    if (navProjectsBtn) navProjectsBtn.classList.add('active');
    if (siteHeader) siteHeader.classList.add('subnav-active');
};

const closeProjectsSubnav = () => {
    clearTimeout(subnavCloseTimer);
    if (projectsSubnavBar) projectsSubnavBar.classList.remove('open');
    if (navProjectsBtn) navProjectsBtn.classList.remove('active');
    if (siteHeader) siteHeader.classList.remove('subnav-active');
};

const scheduleCloseProjectsSubnav = () => {
    clearTimeout(subnavCloseTimer);
    subnavCloseTimer = setTimeout(closeProjectsSubnav, 140);
};

// 1. Automatic Hover Open/Close for "Projects" Sub-Nav Bar
if (navProjectsWrap && projectsSubnavBar) {
    navProjectsWrap.addEventListener('mouseenter', openProjectsSubnav);
    navProjectsWrap.addEventListener('mouseleave', scheduleCloseProjectsSubnav);
    projectsSubnavBar.addEventListener('mouseenter', openProjectsSubnav);
    projectsSubnavBar.addEventListener('mouseleave', scheduleCloseProjectsSubnav);
}

// 2. Hide Nav Bar When Scrolling Past Homepage (Burger, GX & Get In Touch Keep Following)
const updateHeaderOnScroll = () => {
    if (!siteHeader) return;
    if (window.scrollY > 120) {
        siteHeader.classList.add('scrolled-past-home');
        closeProjectsSubnav();
    } else {
        siteHeader.classList.remove('scrolled-past-home');
    }
};
window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });
updateHeaderOnScroll();

// 3. Burger Button (Opens Socials & Audio Overlay)
if (burgerBtn && menuOverlay) {
    burgerBtn.addEventListener('click', () => {
        burgerBtn.classList.toggle('open');
        menuOverlay.classList.toggle('open');
        closeProjectsSubnav();
    });
}

// 4. [GX] Click -> Scroll to Top Homepage (or Reload if already at Top)
if (gxBrandLink) {
    gxBrandLink.addEventListener('click', (e) => {
        e.preventDefault();
        closeProjectsSubnav();
        if (window.scrollY < 40) {
            window.location.reload();
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}

// 5. Top Nav Links: "About Me" -> Gerard Page | "Contact Me" -> Contact Footer
topNavLinks.forEach(link => {
    link.addEventListener('mouseenter', closeProjectsSubnav);
    link.addEventListener('click', (e) => {
        e.preventDefault();
        closeProjectsSubnav();
        if (burgerBtn) burgerBtn.classList.remove('open');
        if (menuOverlay) menuOverlay.classList.remove('open');

        const navTarget = link.getAttribute('data-nav');
        let scrollY = 0;

        if (navTarget === "gerard") {
            const st = revealTl.scrollTrigger;
            scrollY = st ? st.start : 2400;
        } else if (navTarget === "contact") {
            scrollY = document.body.scrollHeight;
        }

        window.scrollTo({ top: scrollY, behavior: 'smooth' });
    });
});

// 6. Sub-Nav Cards -> Auto-Scroll to Personal Projects & Open Specific Pop-Up Modal
subnavCards.forEach(card => {
    card.addEventListener('click', () => {
        const modalType = card.getAttribute('data-open-modal');
        closeProjectsSubnav();

        const st = revealTl.scrollTrigger;
        const targetScrollY = st ? st.end - 40 : 4000;

        window.scrollTo({ top: targetScrollY, behavior: 'smooth' });

        setTimeout(() => {
            if (modalType === 'video' && typeof modalVE !== 'undefined') {
                exitVeSplitState();
                openModal(modalVE);
            } else if (modalType === 'web' && typeof modalWeb !== 'undefined') {
                openModal(modalWeb);
            } else if (modalType === 'cs' && typeof modalCS !== 'undefined') {
                openModal(modalCS);
            }
        }, 650);
    });
});

// 7. Subtitle Random Changing Word ("Games - Experience - Service - Website - Development - Programming - Apps - Designs")
const heroWordEl = document.getElementById('hero-changing-word');
const heroWordsList = [
    "GAMES",
    "EXPERIENCE",
    "SERVICE",
    "WEBSITE",
    "DEVELOPMENT",
    "PROGRAMMING",
    "APPS",
    "DESIGNS"
];
let currentHeroWordIdx = 0;

if (heroWordEl) {
    setInterval(() => {
        let nextIdx = Math.floor(Math.random() * heroWordsList.length);
        if (nextIdx === currentHeroWordIdx) {
            nextIdx = (nextIdx + 1) % heroWordsList.length;
        }
        currentHeroWordIdx = nextIdx;

        gsap.to(heroWordEl, {
            y: -14,
            opacity: 0,
            duration: 0.2,
            ease: "power2.in",
            onComplete: () => {
                heroWordEl.textContent = heroWordsList[currentHeroWordIdx];
                gsap.fromTo(heroWordEl,
                    { y: 14, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.26, ease: "back.out(1.6)" }
                );
            }
        });
    }, 2200);
}

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

// ==========================================
// Tilted Background Carousel Engine for Page 1 (True Infinite Loop)
// ==========================================
const homeCarouselCards = gsap.utils.toArray('.magnetic-gallery .img-wrapper');
const CAROUSEL_TILT_DEG = 8;
const CAROUSEL_TILT_RAD = CAROUSEL_TILT_DEG * (Math.PI / 180);

const CAROUSEL_STEP = 320; 
const CAROUSEL_TOTAL = CAROUSEL_STEP * homeCarouselCards.length;
let carouselScrollOffset = 0;
let isHomeCarouselLooping = true;

const getHomeCarouselSlot = (index) => {
    // Pure mathematical wrapping prevents any sudden snapping or blank stops
    const rawDist = (index * CAROUSEL_STEP) - carouselScrollOffset;
    const wrappedDist = gsap.utils.wrap(-CAROUSEL_TOTAL / 2, CAROUSEL_TOTAL / 2, rawDist);

    const xBase = window.innerWidth * 0.24; // Inside the gap between MY CREATIONS and 4
    const yPos = wrappedDist * Math.cos(CAROUSEL_TILT_RAD);

    const focalY = -window.innerHeight * 0.06;
    const distFromFocal = yPos - focalY;

    const cardEl = homeCarouselCards[index];
    const widthNormalize = (cardEl && cardEl.classList.contains('wrap2')) ? (260 / 300) : 1;
    const maxScale = 0.78 * widthNormalize;

    let scale = maxScale;
    let opacity = 1;

    if (distFromFocal > 0) {
        const bottomProg = gsap.utils.clamp(0, 1, distFromFocal / (window.innerHeight * 0.58));
        scale = gsap.utils.interpolate(maxScale, maxScale * 0.55, bottomProg);
        opacity = gsap.utils.interpolate(1, 0, Math.pow(bottomProg, 1.25));
    } else {
        const topProg = gsap.utils.clamp(0, 1, Math.abs(distFromFocal) / (window.innerHeight * 0.48));
        scale = gsap.utils.interpolate(maxScale, maxScale * 0.78, topProg);
        opacity = gsap.utils.interpolate(1, 0, Math.pow(topProg, 1.35));
    }

    return {
        x: xBase - wrappedDist * Math.sin(CAROUSEL_TILT_RAD),
        y: yPos,
        rotation: CAROUSEL_TILT_DEG,
        scale,
        opacity: Math.max(0, opacity),
        zIndex: Math.round((1 - Math.min(1, Math.abs(distFromFocal) / 600)) * 5)
    };
};

// Continuous seamless upward loop (Immune to tab-switching & scroll interruptions)
gsap.ticker.add(() => {
    if (!isHomeCarouselLooping || aboutGalleryActive) return;

    // Clamped deltaRatio guarantees smooth speed and NEVER explodes after switching tabs
    const safeRatio = Math.min(gsap.ticker.deltaRatio(60) || 1, 2.5);
    carouselScrollOffset = (carouselScrollOffset + 0.75 * safeRatio) % CAROUSEL_TOTAL;

    // Safety guard against NaN
    if (isNaN(carouselScrollOffset)) carouselScrollOffset = 0;

    homeCarouselCards.forEach((card, i) => {
        const slot = getHomeCarouselSlot(i);
        gsap.set(card, {
            x: slot.x,
            y: slot.y,
            rotation: slot.rotation,
            scale: slot.scale,
            autoAlpha: slot.opacity,
            zIndex: slot.zIndex
        });
    });
});

const restoreHomeGallery = () => {
    gsap.killTweensOf(homeCarouselCards);
    gsap.killTweensOf(".wrap-extra");
    gsap.to("body", { backgroundColor: "#f4f4f4", duration: 0.7, ease: "power2.inOut" });

    // Resume looping immediately so cards never freeze or vanish on scroll-back
    isHomeCarouselLooping = true;

    homeCarouselCards.forEach((card, i) => {
        const slot = getHomeCarouselSlot(i);
        gsap.to(card, {
            x: slot.x,
            y: slot.y,
            rotation: slot.rotation,
            scale: slot.scale,
            autoAlpha: slot.opacity,
            zIndex: slot.zIndex,
            duration: 0.55,
            ease: "power2.out",
            overwrite: "auto"
        });
    });
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
    isHomeCarouselLooping = false;
    // Fade out buffer cards with a gentle scale-down
    gsap.to(".wrap-extra", { autoAlpha: 0, scale: 0.7, duration: 0.5, ease: "power2.inOut" });
    lastAboutPanel = panelId;
    const duration = animate ? 0.85 : 0; // Slightly longer duration for a luxurious, fluid glide
    const ease = "power3.out"; // Smooth deceleration curve so cards land organically without stiffness
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

    // Organic Card Glide Transition: Smoothly interpolates position, rotation, and scale from the carousel stream
    gsap.to(".wrap1", { 
        x: layout.wrap1.x, 
        y: layout.wrap1.y, 
        rotation: layout.wrap1.rotation, 
        scale: layout.wrap1.scale, 
        zIndex: layout.wrap1.zIndex, 
        autoAlpha: 1, 
        overwrite: "auto", 
        duration, 
        ease 
    });
    gsap.to(".wrap2", { 
        x: layout.wrap2.x, 
        y: layout.wrap2.y, 
        rotation: layout.wrap2.rotation, 
        scale: layout.wrap2.scale, 
        zIndex: layout.wrap2.zIndex, 
        autoAlpha: 1, 
        overwrite: "auto", 
        duration, 
        ease 
    });
    gsap.to(".wrap3", { 
        x: layout.wrap3.x, 
        y: layout.wrap3.y, 
        rotation: layout.wrap3.rotation, 
        scale: layout.wrap3.scale, 
        zIndex: layout.wrap3.zIndex, 
        autoAlpha: 1, 
        overwrite: "auto", 
        duration, 
        ease 
    });
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

/* <--- MANUAL TWEAK: Lower 650 (e.g. 500) to make the glitch transition even faster, or raise to 850 */
const gerardPinDistance = 650;
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
        scrub: 0.6,
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
// PAGE 4: PROJECT PAGE HOVER LOGIC (3D Tilt + Subtext Overlap)
// ==========================================

const projectItems = document.querySelectorAll('.project-item');
const projectDescs = document.querySelectorAll('.project-desc');
const hoverContainer = document.querySelector('.hover-media-container');
const hoverVideo = document.querySelector('.hover-video');
const hoverImage = document.querySelector('.hover-image');

// Helper: Check if the floating media box is physically behind any of the 3 subtexts
const updateSubtextOverlapColor = () => {
    if (!hoverContainer || !hoverContainer.classList.contains('active')) {
        projectDescs.forEach(desc => desc.classList.remove('media-behind'));
        return;
    }
    const mediaRect = hoverContainer.getBoundingClientRect();
    projectDescs.forEach(desc => {
        const descRect = desc.getBoundingClientRect();
        const isOverlapping = !(
            mediaRect.right < descRect.left ||
            mediaRect.left > descRect.right ||
            mediaRect.bottom < descRect.top ||
            mediaRect.top > descRect.bottom
        );
        desc.classList.toggle('media-behind', isOverlapping);
    });
};

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
            ease: "power3.out",
            onUpdate: updateSubtextOverlapColor
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
        updateSubtextOverlapColor();
        gsap.to(hoverContainer, {
            scale: 1,
            duration: 0.5,
            ease: "back.out(1.5)",
            onUpdate: updateSubtextOverlapColor
        });
    });

    item.addEventListener('mouseleave', () => {
        hoverContainer.classList.remove('active');
        projectDescs.forEach(desc => desc.classList.remove('media-behind'));
        gsap.to(hoverContainer, { scale: 0.7, duration: 0.4, ease: "power2.in" });
        setTimeout(() => {
            if(!hoverContainer.classList.contains('active')) hoverVideo.pause();
        }, 400);
    });
});

// ==========================================
// PAGE 5: STAGGERED HORIZONTAL CINEMATIC SWEEPS & BACKGROUND AUDIO LEVELLING
// ==========================================

const footerTl = gsap.timeline({
    scrollTrigger: {
        trigger: ".footer-scroll-trigger",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2,
        onEnter: () => {
            gsap.set(".page5-container", { autoAlpha: 1 });
            // Drop target music levels if scrolling down on larger devices
            if (window.innerWidth > 768 && bgMusic) {
                gsap.to(bgMusic, { volume: 0.08, duration: 1 });
            }
        },
        onLeaveBack: () => {
            gsap.set(".page5-container", { autoAlpha: 0 });
            if (window.innerWidth > 768 && bgMusic) {
                gsap.to(bgMusic, { volume: 0.22, duration: 1 });
            }
        }
    }
});

// Overlapping slide sweep stagger based on Horizontal panel sweeps
footerTl.add("unravel")
        .to(".blind-left", { x: "-100vw", duration: 1.2, stagger: 0.15, ease: "power2.inOut" }, "unravel")
        .to(".blind-right", { x: "100vw", duration: 1.2, stagger: 0.15, ease: "power2.inOut" }, "unravel")
        .add("stageIn", "-=0.3")
        .from(".contact-left-col > *", {
            x: -30,
            opacity: 0,
            stagger: 0.12,
            duration: 0.75,
            ease: "power2.out"
        }, "stageIn")
        .from(".contact-dispatch-card", {
            x: 40,
            scale: 0.97,
            opacity: 0,
            duration: 0.8,
            ease: "back.out(1.2)"
        }, "stageIn+=0.1");

// Click-to-Copy Clipboard Engine for Discord ID & Gmail (Works in both Contact Page & Burger Menu)
const copyTriggerBtns = document.querySelectorAll('.copy-trigger-btn');

copyTriggerBtns.forEach(btn => {
    const revealSpan = btn.querySelector('.copy-reveal-label');
    const originalRevealText = revealSpan ? revealSpan.textContent : '';

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const textToCopy = btn.getAttribute('data-copy');
        if (!textToCopy) return;

        const showCopiedFeedback = () => {
            btn.classList.add('copied-flash');
            if (revealSpan) {
                revealSpan.textContent = `COPIED: ${textToCopy} ✓`;
            }
            setTimeout(() => {
                btn.classList.remove('copied-flash');
                if (revealSpan) {
                    revealSpan.textContent = originalRevealText;
                }
            }, 1800);
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(textToCopy).then(showCopiedFeedback).catch(() => {
                const tempInput = document.createElement('input');
                tempInput.value = textToCopy;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
                showCopiedFeedback();
            });
        } else {
            const tempInput = document.createElement('input');
            tempInput.value = textToCopy;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            showCopiedFeedback();
        }
    });
});

// ==========================================
// MOBILE TAP-TO-OPEN WHATSAPP QR HANDLER
// ==========================================
const whatsappWrapper = document.getElementById('whatsapp-wrapper');
const getInTouchBtn = document.getElementById('get-in-touch-btn');

if (getInTouchBtn && whatsappWrapper) {
    getInTouchBtn.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024) {
            // On mobile, tapping GET IN TOUCH toggles the QR code popup
            e.preventDefault();
            e.stopPropagation();
            whatsappWrapper.classList.toggle('mobile-qr-open');
        }
    });

    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024 && !whatsappWrapper.contains(e.target)) {
            whatsappWrapper.classList.remove('mobile-qr-open');
        }
    });
}

// ==========================================
// MODAL POP-UP LOGIC (All 3 Modals + 2-Step ESC + Audio Ducking)
// ==========================================

const modalCS = document.getElementById('modal-customer-service');
const triggerCS = document.getElementById('trigger-cs');

const modalWeb = document.getElementById('modal-web-dev');
const triggerWeb = document.getElementById('trigger-web');

const modalVE = document.getElementById('modal-video-editor');
const triggerVE = document.getElementById('trigger-video');
const veLayout = document.getElementById('ve-modal-layout');
const veEscLabel = document.getElementById('ve-esc-label');

const allModals = document.querySelectorAll('.project-modal');
const closeBtns = document.querySelectorAll('.modal-close-btn');

// Background Music Auto-Pause & Smooth Resume Helpers
const pauseBgMusicForVideo = () => {
    if (bgMusic && isMusicPlaying && !bgMusic.muted) {
        gsap.killTweensOf(bgMusic);
        gsap.to(bgMusic, {
            volume: 0,
            duration: 0.35,
            ease: "power1.out",
            onComplete: () => {
                bgMusic.pause();
            }
        });
    }
};

const resumeBgMusicAfterVideo = () => {
    if (bgMusic && isMusicPlaying && !bgMusic.muted) {
        gsap.killTweensOf(bgMusic);
        if (bgMusic.paused) {
            bgMusic.volume = 0;
            bgMusic.play().catch(() => {});
        }
        gsap.to(bgMusic, {
            volume: MUSIC_VOLUME,
            duration: 1.4,
            ease: "sine.inOut"
        });
    }
};

// Video Projects Data (Numbering Removed)
// Default audio level for all video players (45%)
const DEFAULT_VIDEO_VOLUME = 0.45;

// Video Projects Data (Add isReel: true to any 9:16 portrait Reel video!)
const videoProjectsData = [
    {
        tag: "Rotoscope Animatic",
        title: "Lost in Paradise (JJK Ending Animatic)",
        desc: "Self drawn 2D rotoscope animatic for Year End Class Video in Highschool. Used FlipaClip and CapCut Editor.",
        videoSrc: "assets/videos/AnimationExe1.mp4",
        thumbSrc: "assets/images/Animatic1.jpg"
    },
    {
        tag: "Website Prototyping",
        title: "Old Website Prototype Before This Portfolio",
        desc: "Just wanted to show my old website prototype before this portfolio. This was for school project.",
        videoSrc: "assets/videos/Old Website.mp4",
        thumbSrc: "assets/images/Oldwebsite.jpg"
    },
    {
        tag: "School Project Promotion",
        title: "Welcome to Metaverse [PROMO]",
        desc: "Promotional motion piece crafted for a school project to test our knowledge in video editing.",
        videoSrc: "assets/videos/Welcome to Metavers.mp4",
        thumbSrc: "assets/images/Promo.jpg"
    },
    {
        tag: "Short Animatic Meme",
        title: "RPG Meme But its my friends",
        desc: "Short animatic meme commissioned by my friends. I used CapCut Editor and FlipaClip to make this.",
        videoSrc: "assets/videos/AnimationExe2.mp4",
        thumbSrc: "assets/images/Animatic2.jpg"
    },
    {
        tag: "An App Review",
        title: "How and What is Discord?",
        desc: "Tasked with creating an engaging YouTube content where we review any app of our choice. Used CapCut to edit everything.",
        videoSrc: "assets/videos/App Review A2.mp4",
        thumbSrc: "assets/images/Appreview.jpg"
    },
    {
        tag: "Game.exe - Literally a game content",
        title: "Forgotten Strinova Clips Compilation...",
        desc: "Game Themed content solely for fun and to test my editing skills with many memes and references for entertainment.",
        videoSrc: "assets/videos/GameExe1.mp4",
        thumbSrc: "assets/images/Gameexe1.jpg"
    },
    {
        tag: "Team Web Development Project",
        title: "Meet the Team behind Anak Essentials",
        desc: "Eye catching introduction for a video explanation, the school has asked us to create a video of our progression as we develop a website for our client.",
        videoSrc: "assets/videos/AnakEssentials.mp4",
        thumbSrc: "assets/images/Webdev1.jpg"
    },
    {
        tag: "Mini Vlog Content",
        title: "Repeat It - Class Activity",
        desc: "Edited for fun, this is a short psychology activity that I enhanced a bit with some little edits to create a vlog content.",
        videoSrc: "assets/videos/VlogExe1.mp4",
        thumbSrc: "assets/images/Vlog1.jpg"
    },
    {
        tag: "Random Editing Skit Experiment",
        title: "Forgot the Mic wasn't muted.",
        desc: "Was experimenting with different editing techniques using jpg images to recreate a story with characters in CapCut.",
        videoSrc: "assets/videos/RandomExe1.mp4",
        thumbSrc: "assets/images/Random1.jpg"
    },
    {
        tag: "Game Development Project",
        title: "Chuwayo - Trickal Fan Game",
        desc: "Team development project and this one is simply a showcase of our game beta.",
        videoSrc: "assets/videos/Chuwayo Guide Download.mp4",
        thumbSrc: "assets/images/Gamedev2.jpg"
    },
    {
        tag: "Social Media Content",
        title: "Team Behind Chuwayo - Trickal Fan Game",
        desc: "A Reel content to introduce our team behind the game development project.",
        videoSrc: "assets/videos/PromotionExe1.mp4",
        thumbSrc: "assets/images/Advertisment.jpg",
        isReel: true
    },
    {
        tag: "Short Vlog Reel Content",
        title: "Should He Open It or Keep it Sealed?",
        desc: "Mini Vlog in a reel content format.",
        videoSrc: "assets/videos/VlogExe2.mp4",
        thumbSrc: "assets/images/Vlog2.jpg",
        isReel: true
    }
];

const veTrack = document.getElementById('ve-roulette-track');
const veNavyList = document.getElementById('ve-navy-list');
const veCol1 = document.getElementById('ve-col-1');
const veCol2 = document.getElementById('ve-col-2');
const veCol3 = document.getElementById('ve-col-3');

let veMarqueeTween = null;
let veColTweens = [];
const allNavyBoxes = [];
let activeFocusedBox = null;

// Helper to wire hover preview & click on any carousel card (Lazy-loads video on hover so browser never hits decoder limit!)
const bindCarouselCardEvents = (card, realIndex, pauseTweensFn, resumeTweensFn) => {
    const previewVid = card.querySelector('.ve-card-video');

    card.addEventListener('mouseenter', () => {
        pauseTweensFn();
        card.classList.add('is-previewing');
        previewVid.muted = true;

        const playRandomScene = () => {
            if (previewVid.duration) {
                previewVid.currentTime = gsap.utils.random(0.4, Math.max(1, previewVid.duration * 0.75));
            }
            previewVid.play().catch(() => {});
        };

        if (previewVid.readyState >= 1) {
            playRandomScene();
        } else {
            previewVid.addEventListener('loadedmetadata', playRandomScene, { once: true });
            previewVid.load();
        }
    });

    card.addEventListener('mouseleave', () => {
        card.classList.remove('is-previewing');
        previewVid.pause();
        resumeTweensFn();
    });

    card.addEventListener('click', (e) => {
        e.stopPropagation();
        enterVeSplitState(realIndex);
    });
};

if (veTrack && veNavyList) {
    // 1. Build State 1 Horizontal Roulette Cards
    const fullCarouselList = [...videoProjectsData, ...videoProjectsData];

    fullCarouselList.forEach((item, idx) => {
        const realIndex = idx % videoProjectsData.length;
        const card = document.createElement('div');
        card.className = `ve-roulette-card${item.isReel ? ' is-reel-card' : ''}`;
        card.innerHTML = `
            <video class="ve-card-video" src="${encodeURI(item.videoSrc)}" muted loop playsinline preload="none"></video>
            <img class="ve-card-thumb" src="${encodeURI(item.thumbSrc)}" alt="${item.title}">
            ${item.isReel ? '<span class="ve-reel-pill">REEL 9:16</span>' : ''}
            <span class="ve-card-badge">${item.title}</span>
        `;

        bindCarouselCardEvents(
            card,
            realIndex,
            () => { if (veMarqueeTween) gsap.to(veMarqueeTween, { timeScale: 0, duration: 0.5, ease: "power2.out" }); },
            () => { if (veMarqueeTween) gsap.to(veMarqueeTween, { timeScale: 1, duration: 0.7, ease: "power2.inOut" }); }
        );

        veTrack.appendChild(card);
    });

    veMarqueeTween = gsap.to(veTrack, {
        xPercent: -50,
        duration: 38,
        ease: "none",
        repeat: -1
    });

    // 2. Build State 2 3-Column Angled Roulette (Partitioned into 3 unique groups so the same video never appears across multiple columns!)
    const colBuckets = [[], [], []];
    videoProjectsData.forEach((item, realIndex) => {
        colBuckets[realIndex % 3].push({ item, realIndex });
    });

    const angledColumns = [
        { el: veCol1, dir: "up",   bucket: colBuckets[0], duration: 24 },
        { el: veCol2, dir: "down", bucket: colBuckets[1], duration: 28 },
        { el: veCol3, dir: "up",   bucket: colBuckets[2], duration: 26 }
    ];

    angledColumns.forEach(({ el, dir, bucket, duration }) => {
        if (!el || bucket.length === 0) return;
        // Duplicate the unique bucket once for seamless -50% vertical looping
        const colItems = [...bucket, ...bucket];

        colItems.forEach(({ item, realIndex }) => {
            const card = document.createElement('div');
            card.className = `ve-angled-card${item.isReel ? ' is-reel-card' : ''}`;
            card.innerHTML = `
                <video class="ve-card-video" src="${encodeURI(item.videoSrc)}" muted loop playsinline preload="none"></video>
                <img class="ve-card-thumb" src="${encodeURI(item.thumbSrc)}" alt="${item.title}">
                ${item.isReel ? '<span class="ve-reel-pill">REEL</span>' : ''}
                <span class="ve-card-badge">${item.title}</span>
            `;

            bindCarouselCardEvents(
                card,
                realIndex,
                () => veColTweens.forEach(t => gsap.to(t, { timeScale: 0, duration: 0.45, ease: "power2.out" })),
                () => veColTweens.forEach(t => gsap.to(t, { timeScale: 1, duration: 0.65, ease: "power2.inOut" }))
            );

            el.appendChild(card);
        });

        const tween = gsap.fromTo(el,
            { yPercent: dir === "down" ? -50 : 0 },
            {
                yPercent: dir === "down" ? 0 : -50,
                duration: duration,
                ease: "none",
                repeat: -1
            }
        );
        veColTweens.push(tween);
    });

    // 3. Build Right-Side Player Cards (Automatically uses 9:16 vertical layout when item.isReel is true)
    videoProjectsData.forEach((item, index) => {
        const box = document.createElement('article');
        box.className = `ve-navy-box${item.isReel ? ' is-reel-box' : ''}`;
        box.setAttribute('data-original-index', index);
        box.innerHTML = `
            <div class="ve-player-stage">
                <video class="ve-main-video" src="${encodeURI(item.videoSrc)}" playsinline preload="metadata"></video>
                <img class="ve-main-thumb" src="${encodeURI(item.thumbSrc)}" alt="${item.title}">
                <button type="button" class="ve-center-play-btn" title="Play Video">&#9654;</button>
                <div class="ve-controls-bar">
                    <button type="button" class="ve-ctrl-btn ve-play-toggle" title="Play/Pause (Space)">&#9654;</button>
                    <input type="range" class="ve-progress-slider" min="0" max="100" value="0" step="0.1">
                    <div class="ve-volume-wrap">
                        <button type="button" class="ve-ctrl-btn ve-mute-toggle" title="Mute/Unmute">&#128266;</button>
                        <input type="range" class="ve-volume-slider" min="0" max="1" value="${DEFAULT_VIDEO_VOLUME}" step="0.05">
                    </div>
                    <button type="button" class="ve-ctrl-btn ve-fullscreen-btn" title="Fullscreen">&#x26F6;</button>
                </div>
            </div>
            <div class="ve-navy-info">
                <span class="ve-box-tag">${item.tag}</span>
                <h3 class="ve-box-title">${item.title}</h3>
                <p class="ve-box-desc">${item.desc}</p>
            </div>
        `;

        veNavyList.appendChild(box);
        allNavyBoxes.push(box);
    });
}

// Helper: Check if any video in State 2 is currently playing
const isAnyModalVideoPlaying = () => {
    return allNavyBoxes.some(box => {
        const vid = box.querySelector('.ve-main-video');
        return vid && !vid.paused;
    });
};

// Helper: Stop & Reset a specific Navy Box back to 0:00 + thumbnail
const resetNavyBoxVideo = (box) => {
    const vid = box.querySelector('.ve-main-video');
    const playToggle = box.querySelector('.ve-play-toggle');
    const prog = box.querySelector('.ve-progress-slider');
    if (vid) {
        vid.pause();
        vid.currentTime = 0;
    }
    box.classList.remove('is-playing');
    if (playToggle) playToggle.innerHTML = '&#9654;';
    if (prog) prog.value = 0;
};

// Helper: Toggle Play/Pause on a specific Navy Box
const toggleNavyBoxPlay = (box) => {
    const vid = box.querySelector('.ve-main-video');
    const playToggle = box.querySelector('.ve-play-toggle');

    activeFocusedBox = box;
    allNavyBoxes.forEach(b => b.classList.remove('active-box'));
    box.classList.add('active-box');

    if (vid.paused) {
        allNavyBoxes.forEach(otherBox => {
            if (otherBox !== box) {
                resetNavyBoxVideo(otherBox);
            }
        });

        pauseBgMusicForVideo();

        box.classList.add('is-playing');
        playToggle.innerHTML = '&#10074;&#10074;';

        if (vid.readyState === 0) {
            vid.load();
        }
        vid.play().then(() => {
            // Ensure audio ducking stays locked while video is actively playing
            if (vid.paused) resumeBgMusicAfterVideo();
        }).catch((err) => {
            console.warn("Video play error:", vid.src, err);
            resumeBgMusicAfterVideo();
        });
    } else {
        vid.pause();
        box.classList.remove('is-playing');
        playToggle.innerHTML = '&#9654;';

        if (!isAnyModalVideoPlaying()) {
            resumeBgMusicAfterVideo();
        }
    }
};

// Robust Fullscreen Change Handler: Always checks if any modal video is still playing before deciding to resume background music
document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
        // Short delay to let browser settle state
        setTimeout(() => {
            if (!isAnyModalVideoPlaying()) {
                resumeBgMusicAfterVideo();
            }
        }, 100);
    }
});

allNavyBoxes.forEach((box) => {
    const vid = box.querySelector('.ve-main-video');
    const centerPlayBtn = box.querySelector('.ve-center-play-btn');
    const playToggle = box.querySelector('.ve-play-toggle');
    const progressSlider = box.querySelector('.ve-progress-slider');
    const muteToggle = box.querySelector('.ve-mute-toggle');
    const volumeSlider = box.querySelector('.ve-volume-slider');
    const fullscreenBtn = box.querySelector('.ve-fullscreen-btn');
    const playerStage = box.querySelector('.ve-player-stage');

    // Lock default audio level to 45% (0.45)
    vid.volume = DEFAULT_VIDEO_VOLUME;

    centerPlayBtn.addEventListener('click', () => toggleNavyBoxPlay(box));
    playToggle.addEventListener('click', () => toggleNavyBoxPlay(box));
    vid.addEventListener('click', () => toggleNavyBoxPlay(box));

    vid.addEventListener('timeupdate', () => {
        if (vid.duration) {
            progressSlider.value = (vid.currentTime / vid.duration) * 100;
        }
    });

    progressSlider.addEventListener('input', () => {
        if (vid.duration) {
            vid.currentTime = (progressSlider.value / 100) * vid.duration;
        }
    });

    vid.addEventListener('ended', () => {
        resetNavyBoxVideo(box);
        if (!isAnyModalVideoPlaying()) {
            resumeBgMusicAfterVideo();
        }
    });

    volumeSlider.addEventListener('input', () => {
        vid.volume = parseFloat(volumeSlider.value);
        vid.muted = vid.volume === 0;
        muteToggle.innerHTML = vid.muted ? '&#128263;' : '&#128266;';
    });

    muteToggle.addEventListener('click', () => {
        vid.muted = !vid.muted;
        muteToggle.innerHTML = vid.muted ? '&#128263;' : '&#128266;';
    });

    fullscreenBtn.addEventListener('click', () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else if (playerStage.requestFullscreen) {
            playerStage.requestFullscreen();
        } else if (vid.webkitEnterFullscreen) {
            vid.webkitEnterFullscreen();
        }
    });
});

// Enter State 2: Smart Reorder with Side-by-Side 2-Reel Grid Support ([landscape], [reel][reel])
const enterVeSplitState = (targetIndex) => {
    if (!veLayout || !modalVE || !veNavyList) return;

    allNavyBoxes.forEach(box => resetNavyBoxVideo(box));
    resumeBgMusicAfterVideo();

    veNavyList.innerHTML = '';

    const total = allNavyBoxes.length;
    let i = 0;

    while (i < total) {
        const currentIdx = (targetIndex + i) % total;
        const currentBox = allNavyBoxes[currentIdx];
        const currentItem = videoProjectsData[currentIdx];

        // Check if current and next are both reels -> group into side-by-side [reel][reel] row!
        if (i + 1 < total) {
            const nextIdx = (targetIndex + i + 1) % total;
            const nextBox = allNavyBoxes[nextIdx];
            const nextItem = videoProjectsData[nextIdx];

            if (currentItem.isReel && nextItem.isReel) {
                const gridRow = document.createElement('div');
                gridRow.className = 've-reel-grid-row';
                
                currentBox.classList.toggle('active-box', i === 0);
                nextBox.classList.toggle('active-box', false);

                gridRow.appendChild(currentBox);
                gridRow.appendChild(nextBox);
                veNavyList.appendChild(gridRow);
                i += 2;
                continue;
            }
        }

        currentBox.classList.toggle('active-box', i === 0);
        veNavyList.appendChild(currentBox);
        i++;
    }

    activeFocusedBox = allNavyBoxes[targetIndex];

    veLayout.classList.add('split-active');
    modalVE.classList.add('split-scroll-enabled');
    if (veEscLabel) veEscLabel.textContent = "ESC (BACK)";

    modalVE.scrollTo({ top: 0, behavior: 'smooth' });
};

const exitVeSplitState = () => {
    if (!veLayout || !modalVE || !veNavyList) return;
    allNavyBoxes.forEach(box => resetNavyBoxVideo(box));
    resumeBgMusicAfterVideo();

    // Restore original flat order in DOM
    veNavyList.innerHTML = '';
    allNavyBoxes.forEach(box => veNavyList.appendChild(box));

    veLayout.classList.remove('split-active');
    modalVE.classList.remove('split-scroll-enabled');
    if (veEscLabel) veEscLabel.textContent = "ESC";
    modalVE.scrollTo({ top: 0, behavior: 'smooth' });
};

const openModal = (modalEl) => {
    if (!modalEl) return;
    modalEl.classList.add('active');
    document.body.classList.add('modal-open'); // Hides [GX] Header & Get In Touch while in pop-up
    document.body.style.overflow = "hidden";
    gsap.set('.hover-media-container', { opacity: 0, display: "none" });
};

const handleEscapeOrClose = () => {
    if (modalVE && modalVE.classList.contains('active') && veLayout && veLayout.classList.contains('split-active')) {
        exitVeSplitState();
        return;
    }

    allNavyBoxes.forEach(box => resetNavyBoxVideo(box));
    resumeBgMusicAfterVideo();
    allModals.forEach(modal => modal.classList.remove('active'));
    document.body.classList.remove('modal-open'); // Restores [GX] Header & Get In Touch
    document.body.style.overflow = "auto";
    gsap.set('.hover-media-container', { clearProps: "opacity,display" });
};

if (triggerVE && modalVE) {
    triggerVE.addEventListener('click', (e) => {
        e.preventDefault();
        exitVeSplitState();
        openModal(modalVE);
    });
}

if (triggerWeb && modalWeb) {
    triggerWeb.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(modalWeb);
    });
}

if (triggerCS && modalCS) {
    triggerCS.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(modalCS);
    });
}

closeBtns.forEach(btn => {
    btn.addEventListener('click', handleEscapeOrClose);
});

document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") {
        handleEscapeOrClose();
    } else if (e.code === "Space" && modalVE && modalVE.classList.contains('active') && veLayout && veLayout.classList.contains('split-active')) {
        e.preventDefault();
        if (activeFocusedBox) {
            toggleNavyBoxPlay(activeFocusedBox);
        }
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
    { topMin: 90, topMax: 93, leftMin: 42, leftMax: 54, tiltMin: -1,  tiltMax: 1  }  // 5. Bottom-Center (Straight landscape)
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

    const randomTop = gsap.utils.random(zone.topMin, zone.topMax);
    const randomLeft = gsap.utils.random(zone.leftMin, zone.leftMax);
    const randomTilt = gsap.utils.random(zone.tiltMin, zone.tiltMax);

    gsap.set(note, {
        top: `${randomTop}%`,
        left: `${randomLeft}%`,
        rotation: randomTilt
    });

    gsap.killTweensOf(chars);

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

    if (currentNoteIndex < hwNotes.length) {
        const writeDuration = (chars.length * 45) + 450;
        hwQueueTimer = setTimeout(spawnNextHandwritingNote, writeDuration);
    }
};

const projectListWrapper = document.querySelector('.project-list-wrapper');

projectItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        if (currentNoteIndex === 0) {
            gsap.utils.shuffle(hwNotes);
            activeZones = gsap.utils.shuffle([...outerSafeZones]);
            spawnNextHandwritingNote();
        } else if (currentNoteIndex < hwNotes.length) {
            clearTimeout(hwQueueTimer);
            spawnNextHandwritingNote();
        }
    });
});

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
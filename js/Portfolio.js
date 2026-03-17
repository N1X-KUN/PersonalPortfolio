gsap.registerPlugin(ScrollTrigger);

// The Zoom-Through Animation
gsap.to(".zoom-text", {
    scale: 100, // Scales the text up 100x so you fall through the letter "A" or "D"
    ease: "power2.inOut",
    scrollTrigger: {
        trigger: ".hero-container",
        start: "top top", // Starts when the top of the hero hits the top of the viewport
        end: "+=2000", // Pins the section for 2000 pixels of scrolling
        pin: true, // Locks the screen in place while the animation happens
        scrub: 1 // Ties the animation strictly to the scrollbar
    }
});

// Play videos only on hover
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    const video = card.querySelector('.card-video');
    
    card.addEventListener('mouseenter', () => {
        if (video) video.play();
    });
    
    card.addEventListener('mouseleave', () => {
        if (video) {
            video.pause();
            video.currentTime = 0; // Rewind video
        }
    });
});


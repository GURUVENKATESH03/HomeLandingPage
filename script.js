// =========================================
// STATE BAR CLOCK
// =========================================
function updateClock() {
    const clockElement = document.getElementById('clock');
    const date = new Date();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    clockElement.textContent = `${hours}:${minutes}:${seconds}`;
}
setInterval(updateClock, 1000);
updateClock();

// =========================================
// HERO BOOT SEQUENCE
// =========================================
const bootLines = [
    { text: "Starting PortfolioApplication...", delay: 300, class: "" },
    { text: "Loading profile: backend-engineer", delay: 200, class: "" },
    { text: "Tomcat initialized with port(s): 8080 (http)", delay: 400, class: "" },
    { text: "Mounted: about, experience, projects, contact", delay: 300, class: "" },
    { text: "Started PortfolioApplication in 0.834 seconds (process running)", delay: 400, class: "success" }
];

const bootSequence = document.getElementById('boot-sequence');
const heroContent = document.getElementById('hero-content');

// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
    // If reduced motion, bypass animation immediately
    bootSequence.style.display = 'none';
    heroContent.classList.add('visible');
    heroContent.setAttribute('aria-hidden', 'false');
} else {
    // Run typing sequence
    let lineIndex = 0;
    
    async function runBootSequence() {
        while (lineIndex < bootLines.length) {
            const line = bootLines[lineIndex];
            const lineDiv = document.createElement('div');
            lineDiv.className = `boot-line ${line.class}`;
            bootSequence.appendChild(lineDiv);
            
            // Type out characters
            for (let i = 0; i <= line.text.length; i++) {
                lineDiv.textContent = line.text.substring(0, i);
                await new Promise(resolve => setTimeout(resolve, 15)); // Typing speed
            }
            
            await new Promise(resolve => setTimeout(resolve, line.delay));
            lineIndex++;
        }
        
        // Reveal hero content after logs finish
        await new Promise(resolve => setTimeout(resolve, 300));
        bootSequence.style.transition = "opacity 0.5s ease";
        bootSequence.style.opacity = "0";
        
        setTimeout(() => {
            bootSequence.style.display = 'none';
            heroContent.classList.add('visible');
            heroContent.setAttribute('aria-hidden', 'false');
        }, 500);
    }
    
    // Start sequence on load
    window.addEventListener('load', runBootSequence);
}

// =========================================
// SCROLL FADE-IN ANIMATIONS
// =========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Stop observing once visible
            
            // Update status bar section indicator
            const sectionId = entry.target.id;
            const statusSection = document.getElementById('current-section');
            if (statusSection && sectionId) {
                statusSection.textContent = `section: ${sectionId}`;
            }
        }
    });
}, observerOptions);

// Observe all elements with fade-in class
document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// =========================================
// SMOOTH SCROLL FOR ANCHORS
// =========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            targetElement.scrollIntoView({
                behavior: prefersReducedMotion ? 'auto' : 'smooth',
                block: 'start'
            });
        }
    });
});

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
// GREETING
// =========================================
const greetingElement = document.getElementById('greeting');
const hour = new Date().getHours();
if (hour < 12) {
    greetingElement.textContent = 'Good Morning, Guru';
} else if (hour < 18) {
    greetingElement.textContent = 'Good Afternoon, Guru';
} else {
    greetingElement.textContent = 'Good Evening, Guru';
}

// =========================================
// HERO BOOT SEQUENCE
// =========================================
const bootLines = [
    { text: "Starting DashboardApplication...", delay: 300, class: "" },
    { text: "Loading profile: user='guru'", delay: 200, class: "" },
    { text: "Initializing widgets...", delay: 400, class: "" },
    { text: "Mounted: search, quick-links, feed", delay: 300, class: "" },
    { text: "Started DashboardApplication in 0.812 seconds", delay: 400, class: "success" }
];

const bootSequence = document.getElementById('boot-sequence');
const dashboardContent = document.getElementById('dashboard-content');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
    bootSequence.style.display = 'none';
    dashboardContent.classList.add('visible');
    dashboardContent.setAttribute('aria-hidden', 'false');
} else {
    let lineIndex = 0;
    
    async function runBootSequence() {
        while (lineIndex < bootLines.length) {
            const line = bootLines[lineIndex];
            const lineDiv = document.createElement('div');
            lineDiv.className = `boot-line ${line.class}`;
            bootSequence.appendChild(lineDiv);
            
            for (let i = 0; i <= line.text.length; i++) {
                lineDiv.textContent = line.text.substring(0, i);
                await new Promise(resolve => setTimeout(resolve, 15));
            }
            
            await new Promise(resolve => setTimeout(resolve, line.delay));
            lineIndex++;
        }
        
        await new Promise(resolve => setTimeout(resolve, 300));
        bootSequence.style.transition = "opacity 0.5s ease";
        bootSequence.style.opacity = "0";
        
        setTimeout(() => {
            bootSequence.style.display = 'none';
            dashboardContent.classList.add('visible');
            dashboardContent.setAttribute('aria-hidden', 'false');
            document.getElementById('search-input').focus();
        }, 500);
    }
    
    window.addEventListener('load', runBootSequence);
}

// =========================================
// NEWS TABS LOGIC
// =========================================
const tabs = document.querySelectorAll('[data-tab-target]');
const tabContents = document.querySelectorAll('[data-tab-content]');
const footer = document.getElementById('news-footer');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = document.querySelector(tab.dataset.tabTarget);
        const isSavedTab = tab.dataset.tabTarget === '#saved-news';
        
        // Handle Saved Tab expansion
        if (isSavedTab) {
            footer.style.position = 'static';
            document.body.style.overflow = 'auto';
            document.body.style.height = 'auto';
        } else {
            footer.style.position = 'fixed';
            document.body.style.overflow = 'hidden';
            document.body.style.height = '100%';
        }
        
        // Toggle active classes
        tabContents.forEach(tc => tc.classList.remove('active'));
        tabs.forEach(t => t.classList.remove('active'));
        
        tab.classList.add('active');
        target.classList.add('active');
    });
});

// =========================================
// NEWS FETCHING LOGIC
// =========================================
const apiKey = "pub_a4dafebff4ae43c69d38ecdd1f87f71c"; // Replace with your real API key

function createNewsItem(article) {
    const newsItem = document.createElement("div");
    newsItem.className = "news-item";

    const link = document.createElement("a");
    link.href = article.link;
    link.target = "_blank";
    link.textContent = article.title;

    const dot = document.createElement("span");
    dot.className = "separator";
    dot.textContent = "•";

    newsItem.appendChild(link);
    newsItem.appendChild(dot);

    return newsItem;
}

function fetchNews(category, containerId, keyword = '') {
    const url = `https://newsdata.io/api/1/latest?apikey=${apiKey}&category=${category}&country=in,us,gb&language=en,ta${keyword ? `&q=${encodeURIComponent(keyword)}` : ''}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById(containerId);
            if (!container) return console.error(`Container "${containerId}" not found`);

            container.innerHTML = ''; // Clear loading/previous

            const articles = data.results || [];
            if (articles.length === 0) {
                container.innerHTML = '<span class="news-item"><a>No articles found.</a></span>';
                return;
            }
            
            // Duplicate articles for seamless infinite scroll effect
            articles.forEach(article => container.appendChild(createNewsItem(article)));
            articles.forEach(article => container.appendChild(createNewsItem(article)));
            
        })
        .catch(error => {
            console.error(`Failed to fetch ${category} news:`, error);
            const container = document.getElementById(containerId);
            if(container) container.innerHTML = '<span class="news-item"><a>Error loading feed.</a></span>';
        });
}

function tech() { fetchNews('technology', 'tech-news-ticker'); }
function business() { fetchNews('business', 'business-news-ticker'); }
function sports() { fetchNews('sports', 'sports-news-ticker'); }
function Javarelated() { fetchNews('technology', 'java-news-ticker', 'java programming'); }

function getNews() {
    tech(); sports(); Javarelated(); business();
}

// Auto-load news on startup
window.addEventListener('load', getNews);

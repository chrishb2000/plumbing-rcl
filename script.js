// ===================================
// Language Switcher
// ===================================
let currentLang = 'en';

function setLanguage(lang) {
    currentLang = lang;
    
    // Update language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
    
    // Update all translatable elements
    document.querySelectorAll('[data-en][data-es]').forEach(element => {
        const text = element.getAttribute(`data-${lang}`);
        if (text) {
            // Preserve HTML for elements that might have it
            if (element.innerHTML.includes('<')) {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = element.innerHTML;
                const newText = element.getAttribute(`data-${lang}`);
                if (newText) {
                    // For elements with child nodes, be careful
                    element.childNodes.forEach(node => {
                        if (node.nodeType === 3 && node.textContent.trim()) {
                            node.textContent = newText;
                        }
                    });
                }
            } else {
                element.textContent = text;
            }
        }
    });
    
    // Update title
    const titleElement = document.querySelector('title');
    if (titleElement && titleElement.getAttribute(`data-${lang}`)) {
        titleElement.textContent = titleElement.getAttribute(`data-${lang}`);
    }
    
    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && metaDesc.getAttribute(`data-${lang}`)) {
        metaDesc.setAttribute('content', metaDesc.getAttribute(`data-${lang}`));
    }
    
    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords && metaKeywords.getAttribute(`data-${lang}`)) {
        metaKeywords.setAttribute('content', metaKeywords.getAttribute(`data-${lang}`));
    }
    
    // Save preference
    localStorage.setItem('preferredLanguage', lang);
}

// Initialize language from localStorage or default to English
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('preferredLanguage') || 'en';
    setLanguage(savedLang);
    
    // Language button event listeners
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            setLanguage(btn.dataset.lang);
        });
    });
});

// ===================================
// Carousel/Slider
// ===================================
let currentSlide = 0;
let slideInterval;
let slideProgressInterval;
const slides = document.querySelectorAll('.carousel-slide');
const track = document.getElementById('carousel-track');
const indicatorsContainer = document.getElementById('carousel-indicators');
const progressBar = document.getElementById('carousel-progress');

function initCarousel() {
    if (slides.length === 0) return;
    
    // Create indicators
    slides.forEach((_, index) => {
        const indicator = document.createElement('button');
        indicator.setAttribute('aria-label', `Go to slide ${index + 1}`);
        if (index === 0) indicator.classList.add('active');
        indicator.addEventListener('click', () => goToSlide(index));
        indicatorsContainer.appendChild(indicator);
    });
    
    // Start auto-play
    startAutoPlay();
}

function updateIndicators() {
    const indicators = indicatorsContainer.querySelectorAll('button');
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
    
    // Update slides opacity for fade effect
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
    });
}

function goToSlide(index) {
    currentSlide = index;
    
    // Fade transition
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
    });
    slides[currentSlide].classList.add('active');
    
    // Slide transition
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    updateIndicators();
    resetAutoPlay();
    resetProgress();
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    goToSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    goToSlide(currentSlide);
}

function startAutoPlay() {
    slideInterval = setInterval(nextSlide, 6000);
    startProgress();
}

function startProgress() {
    if (progressBar) {
        progressBar.style.animation = 'none';
        progressBar.offsetHeight; // Trigger reflow
        progressBar.style.animation = 'progress 6s linear infinite';
    }
}

function resetProgress() {
    if (progressBar) {
        progressBar.style.animation = 'none';
        progressBar.offsetHeight; // Trigger reflow
        progressBar.style.animation = 'progress 6s linear infinite';
    }
}

function resetAutoPlay() {
    clearInterval(slideInterval);
    startAutoPlay();
}

// Pause on hover
const carousel = document.querySelector('.carousel');
if (carousel) {
    carousel.addEventListener('mouseenter', () => clearInterval(slideInterval));
    carousel.addEventListener('mouseleave', startAutoPlay);
}

// Carousel buttons
document.getElementById('carousel-prev')?.addEventListener('click', prevSlide);
document.getElementById('carousel-next')?.addEventListener('click', nextSlide);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
});

// Touch support for mobile
let touchStartX = 0;
let touchEndX = 0;

if (track) {
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            nextSlide();
        } else {
            prevSlide();
        }
    }
}

// ===================================
// Navigation
// ===================================
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

// Scroll effect for navbar
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
navToggle?.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// ===================================
// Scroll to Top Button
// ===================================
const scrollTopBtn = document.getElementById('scroll-top');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollTopBtn?.classList.add('visible');
    } else {
        scrollTopBtn?.classList.remove('visible');
    }
});

scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===================================
// Smooth Scroll for Anchor Links
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ===================================
// Current Year in Footer
// ===================================
const yearElement = document.getElementById('current-year');
if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

// ===================================
// Intersection Observer for Animations
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.service-card, .testimonial-card, .portfolio-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ===================================
// Initialize on DOM Ready
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    initCarousel();
});

// ===================================
// Portfolio Modal
// ===================================
const modal = document.getElementById('portfolio-modal');
const modalImage = document.getElementById('modal-image');
const modalCaption = document.getElementById('modal-caption');
const modalClose = document.getElementById('modal-close');
const modalPrev = document.getElementById('modal-prev');
const modalNext = document.getElementById('modal-next');
let portfolioItems = [];
let currentPortfolioIndex = 0;

// Initialize portfolio items
document.querySelectorAll('.portfolio-item').forEach((item, index) => {
    portfolioItems.push({
        image: item.dataset.image,
        caption: item.dataset.caption
    });
    
    item.addEventListener('click', () => openModal(index));
});

function openModal(index) {
    currentPortfolioIndex = index;
    updateModalContent();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function updateModalContent() {
    const item = portfolioItems[currentPortfolioIndex];
    modalImage.src = item.image;
    modalImage.alt = item.caption;
    modalCaption.textContent = item.caption;
}

function showPrevImage() {
    currentPortfolioIndex = (currentPortfolioIndex - 1 + portfolioItems.length) % portfolioItems.length;
    updateModalContent();
}

function showNextImage() {
    currentPortfolioIndex = (currentPortfolioIndex + 1) % portfolioItems.length;
    updateModalContent();
}

// Modal event listeners
modalClose?.addEventListener('click', closeModal);
modalPrev?.addEventListener('click', showPrevImage);
modalNext?.addEventListener('click', showNextImage);

// Close on backdrop click
modal?.querySelector('.modal-backdrop')?.addEventListener('click', closeModal);

// Keyboard navigation for modal
document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') showPrevImage();
    if (e.key === 'ArrowRight') showNextImage();
});

// ===================================
// Preload critical images
// ===================================
function preloadImages() {
    const imagesToPreload = [
        'images/logotipo.webp',
        'images/plumbing-service-main.webp',
        'images/plumbing-repair-expert.webp',
        'images/heating-installation-pro.webp'
    ];
    
    imagesToPreload.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

preloadImages();

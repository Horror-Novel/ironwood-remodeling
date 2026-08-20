document.addEventListener('DOMContentLoaded', () => {

    // 1. Intersection Observer for scroll animations
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    const counters = document.querySelectorAll('.counter');
    let hasCounted = false;

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const countUp = (el) => {
        const target = parseFloat(el.getAttribute('data-target'));
        const isFloat = el.getAttribute('data-target').includes('.');
        const duration = 2000;
        const frames = 60;
        const step = target / (duration / (1000 / frames));
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                el.innerText = isFloat ? current.toFixed(1) : Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                el.innerText = isFloat ? target.toFixed(1) : target;
            }
        };
        updateCounter();
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // If it's the trust bar section, run counter animation
                if (entry.target.querySelector('.counter') && !hasCounted) {
                    hasCounted = true;
                    counters.forEach(counter => countUp(counter));
                }
                
                // Optional: Stop observing once revealed
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // 2. Sticky Header style change on scroll
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('py-0');
            header.classList.remove('py-2');
        } else {
            header.classList.add('py-2');
            header.classList.remove('py-0');
        }
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    let menuOpen = false;

    const toggleMenu = () => {
        menuOpen = !menuOpen;
        if (menuOpen) {
            mobileMenu.classList.remove('opacity-0', 'pointer-events-none');
            document.body.style.overflow = 'hidden';
            mobileMenuBtn.innerHTML = '<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"></path></svg>';
        } else {
            mobileMenu.classList.add('opacity-0', 'pointer-events-none');
            document.body.style.overflow = 'auto';
            mobileMenuBtn.innerHTML = '<svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16"></path></svg>';
        }
    };

    mobileMenuBtn.addEventListener('click', toggleMenu);
    mobileLinks.forEach(link => link.addEventListener('click', () => {
        if (menuOpen) toggleMenu();
    }));

    // 3. Product Gallery Filter
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active state from all
            filterBtns.forEach(b => {
                b.classList.remove('active', 'text-brand-accent', 'border-brand-accent');
                b.classList.add('text-gray-500', 'border-transparent');
            });
            // Add active state to clicked
            btn.classList.add('active', 'text-brand-accent', 'border-brand-accent');
            btn.classList.remove('text-gray-500');

            const filterValue = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.classList.remove('hidden');
                    // Reset animation for reveal
                    item.classList.remove('active');
                    setTimeout(() => item.classList.add('active'), 50);
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    // 4. Lightbox functionality
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const imgSrc = item.querySelector('img').src;
            // Remove crop params for higher res if possible, or just use current
            const highResSrc = imgSrc.replace('&w=800', '&w=1600');
            lightboxImg.src = highResSrc;
            lightbox.classList.remove('opacity-0', 'pointer-events-none');
            document.body.style.overflow = 'hidden';
        });
    });

    const closeLightbox = () => {
        lightbox.classList.add('opacity-0', 'pointer-events-none');
        document.body.style.overflow = 'auto';
        setTimeout(() => lightboxImg.src = '', 300);
    };

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Handle Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !lightbox.classList.contains('opacity-0')) {
            closeLightbox();
        }
    });

    // 5. Contact Form Submission Handling
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Simple visual feedback for submission
        const originalText = submitBtn.innerText;
        submitBtn.innerText = 'Request Sent!';
        submitBtn.classList.remove('bg-brand-accent', 'text-brand-dark');
        submitBtn.classList.add('bg-green-600', 'text-white', 'border-transparent');
        
        setTimeout(() => {
            submitBtn.innerText = originalText;
            submitBtn.classList.add('bg-brand-accent', 'text-brand-dark');
            submitBtn.classList.remove('bg-green-600', 'text-white', 'border-transparent');
            contactForm.reset();
        }, 3000);
    });
});

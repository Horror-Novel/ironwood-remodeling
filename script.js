document.addEventListener('DOMContentLoaded', () => {
    
    // --- Sticky Header ---
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Mobile Menu (Basic Toggle) ---
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            const isDisplayed = navLinks.style.display === 'flex';
            navLinks.style.display = isDisplayed ? 'none' : 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.backgroundColor = 'var(--color-bg)';
            navLinks.style.padding = '2rem';
            navLinks.style.gap = '1.5rem';
            if (!isDisplayed) {
                // Ensure header gets background
                header.classList.add('scrolled');
            }
        });
    }

    // --- Fade-in on Scroll ---
    const fadeElements = document.querySelectorAll('.fade-in');
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    fadeElements.forEach(el => fadeObserver.observe(el));

    // --- Stats Counter ---
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasCounted = false;

    const countUp = (el) => {
        const target = parseFloat(el.getAttribute('data-target'));
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
        
        let current = 0;
        const duration = 2000; // ms
        const steps = 60;
        const increment = target / steps;
        const stepTime = Math.abs(Math.floor(duration / steps));
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                el.innerText = prefix + target.toFixed(decimals) + suffix;
                clearInterval(timer);
            } else {
                el.innerText = prefix + current.toFixed(decimals) + suffix;
            }
        }, stepTime);
    };

    const statsSection = document.querySelector('.stats-grid');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !hasCounted) {
                hasCounted = true;
                statNumbers.forEach(num => countUp(num));
            }
        }, { threshold: 0.5 });
        statsObserver.observe(statsSection);
    }

    // --- Before/After Slider ---
    const baContainer = document.getElementById('ba-container');
    const baBefore = document.getElementById('ba-before');
    const baSlider = document.getElementById('ba-slider');

    if (baContainer && baBefore && baSlider) {
        let isDragging = false;

        const moveSlider = (x) => {
            const rect = baContainer.getBoundingClientRect();
            let position = ((x - rect.left) / rect.width) * 100;
            // Clamp between 0 and 100
            position = Math.max(0, Math.min(position, 100));
            baBefore.style.clipPath = `polygon(0 0, ${position}% 0, ${position}% 100%, 0 100%)`;
            baSlider.style.left = `${position}%`;
        };

        baSlider.addEventListener('mousedown', () => isDragging = true);
        window.addEventListener('mouseup', () => isDragging = false);
        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            moveSlider(e.clientX);
        });

        // Touch support
        baSlider.addEventListener('touchstart', () => isDragging = true);
        window.addEventListener('touchend', () => isDragging = false);
        window.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            moveSlider(e.touches[0].clientX);
        });
    }

    // --- Portfolio Filtering ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active to clicked
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    // small timeout for animation
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300); // match transition duration
                }
            });
        });
    });

    // --- Portfolio Lightbox ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');

    if (lightbox && lightboxImg && lightboxClose) {
        portfolioItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                if (img) {
                    // Get high-res version of the image
                    let src = img.getAttribute('src');
                    src = src.replace('w=800', 'w=1600');
                    lightboxImg.setAttribute('src', src);
                    lightbox.classList.add('active');
                    document.body.style.overflow = 'hidden'; // Prevent scrolling
                }
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
            setTimeout(() => {
                lightboxImg.setAttribute('src', '');
            }, 300);
        };

        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        
        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }

});

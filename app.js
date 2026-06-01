document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Custom Morphing Cursor
    initCustomCursor();

    // 2. Initialize Neural Connection Canvas Background
    initNeuralCanvas();

    // 3. Initialize Navigation Highlight & Mobile Menu Toggle
    initNavigation();

    // 4. Initialize 3D Rotating Carousel
    initCarousel();

    // 5. Initialize Project Filters
    initProjectFilters();

    // 6. Initialize Magnetic Hover CTA
    initMagneticButton();

    // 7. Initialize Scroll-Triggered Stats Counter
    initMetricsObserver();

    // 8. Initialize Email Clipboard & Confetti Blast
    initCopyEmail();

    // 9. Initialize Theme Switcher (Dark Default)
    initThemeToggle();

    // 10. Initialize Web3Forms Contact Form Handler
    initContactForm();

    // 11. Initialize Blueprint Download loader bar delays
    initBlueprintDownload();

    // 12. Initialize Project Specifications Drawer
    initDrawer();
});

/* ==========================================================================
   1. Custom Morphing Cursor Easing
   ========================================================================== */
function initCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    if (!cursor) return;

    let mouseX = -100, mouseY = -100;
    let cursorX = -100, cursorY = -100;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Outer circle follows with sub-pixel easing
    function renderCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * 0.15;
        cursorY += dy * 0.15;
        
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
        
        requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Event delegation for cursor morphing states on interactive elements
    document.addEventListener('mouseover', (e) => {
        const target = e.target.closest('a, button, .contact-item, .theme-toggle, .menu-toggle, .dot, .carousel-arrow');
        if (target) {
            cursor.classList.add('cursor-hover');
        }
        
        const card = e.target.closest('.carousel-card');
        if (card) {
            cursor.classList.add('cursor-drag');
        }
    });

    document.addEventListener('mouseout', (e) => {
        const target = e.target.closest('a, button, .contact-item, .theme-toggle, .menu-toggle, .dot, .carousel-arrow');
        if (target) {
            cursor.classList.remove('cursor-hover');
        }
        
        const card = e.target.closest('.carousel-card');
        if (card) {
            cursor.classList.remove('cursor-drag');
        }
    });

    // Hide custom cursor when mouse leaves viewport
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
    });
}

/* ==========================================================================
   2. Neural Connection Particle Canvas Background
   ========================================================================== */
function initNeuralCanvas() {
    const canvas = document.getElementById('neural-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
        width = (canvas.width = window.innerWidth);
        height = (canvas.height = window.innerHeight);
    });

    const particles = [];
    const maxParticles = width < 768 ? 35 : 85;
    const connectionDist = 110;
    const mouse = { x: null, y: null, radius: 180 };
    const emgTraces = [];

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Expose trigger function globally so navigation clicks can invoke it
    window.triggerEMGWave = function(clickX, clickY) {
        // Spawn neural nodes at click point
        for (let i = 0; i < 6; i++) {
            particles.push(new Particle(clickX, clickY, true));
            if (particles.length > maxParticles + 20) {
                particles.shift();
            }
        }

        // Spawn EMG sweep waveform trace
        emgTraces.push({
            clickX: clickX,
            clickY: clickY,
            age: 0,
            maxAge: 85, // duration in frames (~1.4s)
            speed: 18 // horizontal wave propagation speed (pixels per frame)
        });

        // Limit maximum concurrent waves to prevent clutter
        if (emgTraces.length > 5) {
            emgTraces.shift();
        }
    };

    // Click background / body to trigger neural impulse burst & EMG sweep wave
    window.addEventListener('click', (e) => {
        // Ignore clicks on active/interactive elements
        if (e.target.closest('a, button, input, textarea, .hero-floating-card, .drawer-content, .navbar')) return;

        const clickX = e.clientX;
        const clickY = e.clientY;
        window.triggerEMGWave(clickX, clickY);
    });


    class Particle {
        constructor(x, y, isImpulse = false) {
            this.x = x || Math.random() * width;
            this.y = y || Math.random() * height;
            this.size = Math.random() * 1.5 + (isImpulse ? 2.5 : 1);
            
            const baseSpeed = isImpulse ? 3 : 0.45;
            this.vx = (Math.random() - 0.5) * baseSpeed;
            this.vy = (Math.random() - 0.5) * baseSpeed;
            this.alpha = isImpulse ? 1.0 : 0.15 + Math.random() * 0.4;
            this.life = isImpulse ? 80 : null; // frames count down
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce on boundary limits
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            if (this.life !== null) {
                this.life--;
                this.alpha = this.life / 80;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            
            const isLight = document.body.classList.contains('light-theme');
            if (this.life !== null) {
                ctx.fillStyle = isLight 
                    ? `rgba(0, 102, 255, ${this.alpha})` 
                    : `rgba(57, 255, 20, ${this.alpha})`; // impulse bursts
            } else {
                ctx.fillStyle = isLight 
                    ? `rgba(0, 102, 255, ${this.alpha * 0.7})` 
                    : `rgba(0, 229, 255, ${this.alpha})`;
            }
            ctx.fill();
        }
    }

    // Spawn base neural nodes
    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        const isLight = document.body.classList.contains('light-theme');

        // Filter expired impulse bursts
        for (let i = particles.length - 1; i >= 0; i--) {
            if (particles[i].life !== null && particles[i].life <= 0) {
                particles.splice(i, 1);
            }
        }

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Compute local proximity links
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDist) {
                    let alpha = (1 - dist / connectionDist) * 0.15;
                    
                    // Boost opacity if hover cursor highlights connection
                    if (mouse.x && mouse.y) {
                        const mdx1 = particles[i].x - mouse.x;
                        const mdy1 = particles[i].y - mouse.y;
                        const mdist1 = Math.sqrt(mdx1 * mdx1 + mdy1 * mdy1);

                        const mdx2 = particles[j].x - mouse.x;
                        const mdy2 = particles[j].y - mouse.y;
                        const mdist2 = Math.sqrt(mdx2 * mdx2 + mdy2 * mdy2);

                        if (mdist1 < mouse.radius && mdist2 < mouse.radius) {
                            alpha += (1 - (mdist1 + mdist2) / (mouse.radius * 2)) * 0.22;
                        }
                    }

                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    
                    const strokeGrad = ctx.createLinearGradient(
                        particles[i].x, particles[i].y, 
                        particles[j].x, particles[j].y
                    );
                    
                    if (isLight) {
                        strokeGrad.addColorStop(0, `rgba(0, 102, 255, ${alpha * 0.7})`);
                        strokeGrad.addColorStop(1, `rgba(0, 179, 0, ${alpha * 0.7})`);
                    } else {
                        strokeGrad.addColorStop(0, `rgba(0, 229, 255, ${alpha})`);
                        strokeGrad.addColorStop(1, `rgba(57, 255, 20, ${alpha})`);
                    }
                    
                    ctx.strokeStyle = strokeGrad;
                    ctx.lineWidth = isLight ? 0.6 : 0.8;
                    ctx.stroke();
                }
            }
        }

        // Draw EMG traces
        for (let t = emgTraces.length - 1; t >= 0; t--) {
            const trace = emgTraces[t];
            trace.age++;

            if (trace.age >= trace.maxAge) {
                emgTraces.splice(t, 1);
                continue;
            }

            const opacity = 1 - trace.age / trace.maxAge;
            ctx.beginPath();

            for (let x = 0; x < width; x += 4) {
                const dist = Math.abs(x - trace.clickX);
                const timeOfPass = dist / trace.speed;
                const timeSincePass = trace.age - timeOfPass;

                let yOffset = 0;
                if (timeSincePass > 0) {
                    const decay = Math.exp(-timeSincePass / 10);
                    const spatialDecay = Math.exp(-dist / 220);
                    // High frequency EMG jitter/noise
                    const noise = (Math.sin(x * 0.16) * 0.45 + Math.sin(x * 0.45) * 0.4 + (Math.random() - 0.5) * 0.25);
                    yOffset = noise * 105 * decay * spatialDecay;
                }

                if (x === 0) {
                    ctx.moveTo(x, trace.clickY + yOffset);
                } else {
                    ctx.lineTo(x, trace.clickY + yOffset);
                }
            }

            ctx.strokeStyle = isLight 
                ? `rgba(0, 102, 255, ${opacity * 0.35})` 
                : `rgba(57, 255, 20, ${opacity * 0.45})`;
            ctx.lineWidth = isLight ? 1.0 : 1.2;
            ctx.stroke();
        }

        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
}

/* ==========================================================================
   3. Navigation Highlights & Menu Toggle
   ========================================================================== */
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section');
    const menuToggle = document.getElementById('menu-toggle');
    const navList = document.getElementById('nav-list');

    if (menuToggle && navList) {
        menuToggle.addEventListener('click', () => {
            navList.classList.toggle('active');
            menuToggle.classList.toggle('active');
            
            // Turn hamburger menu bars into an X layout
            const spans = menuToggle.querySelectorAll('span');
            if (menuToggle.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 6deg)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -6deg)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close menu panel when clicking links and trigger EMG wave
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                navList.classList.remove('active');
                menuToggle.classList.remove('active');
                const spans = menuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';

                // Trigger EMG wave at the clicked position (or fallback to middle-top)
                if (typeof window.triggerEMGWave === 'function') {
                    window.triggerEMGWave(e.clientX || window.innerWidth / 2, e.clientY || 80);
                }
            });
        });

        // Trigger EMG wave for logo click as well
        const logoLink = document.querySelector('.logo');
        if (logoLink) {
            logoLink.addEventListener('click', (e) => {
                if (typeof window.triggerEMGWave === 'function') {
                    window.triggerEMGWave(e.clientX || window.innerWidth / 2, e.clientY || 80);
                }
            });
        }
    }


    // Scroll Observer to highlight active section in Navbar
    window.addEventListener('scroll', () => {
        let currentSection = '';
        const scrollOffset = window.scrollY + 160;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            if (scrollOffset >= top && scrollOffset < top + height) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });
}

/* ==========================================================================
   4. 3D Project Carousel (Rotating Panels)
   ========================================================================== */
function initCarousel() {
    const container = document.getElementById('carousel-container');
    const track = document.getElementById('carousel-track');
    if (!container || !track) return;

    const cards = track.querySelectorAll('.carousel-card');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');

    // Bind Mac-style Window Control Actions (Close, Minimize, Maximize)
    const closeBtn = document.getElementById('sandbox-close');
    const minimizeBtn = document.getElementById('sandbox-minimize');
    const maximizeBtn = document.getElementById('sandbox-maximize');
    const sandboxWindow = container.closest('.sandbox-window');

    if (closeBtn && sandboxWindow) {
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            sandboxWindow.classList.add('inactive');
        });
    }

    const inactiveOverlay = document.getElementById('console-inactive-overlay');
    if (inactiveOverlay && sandboxWindow) {
        inactiveOverlay.addEventListener('click', (e) => {
            e.preventDefault();
            sandboxWindow.classList.remove('inactive');
            updateCarousel();
        });
    }

    if (maximizeBtn && sandboxWindow) {
        maximizeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            sandboxWindow.classList.toggle('decked-view');
            updateCarousel();
        });
    }

    let isSuspended = false;
    if (minimizeBtn && sandboxWindow) {
        minimizeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            sandboxWindow.classList.toggle('minimized');
            if (sandboxWindow.classList.contains('minimized')) {
                isSuspended = true;
            } else {
                isSuspended = false;
                setTimeout(() => {
                    updateCarousel();
                }, 410); // Wait for CSS height transition to finish
            }
        });
    }

    // Geometry parameters
    const cardCount = cards.length;
    const anglePerCard = 360 / cardCount; // 72 degrees

    function getRadius() {
        const w = window.innerWidth;
        if (w <= 480) return 140;
        if (w <= 768) return 190;
        return 270;
    }

    let radius = getRadius();
    let currentRotation = 0; // rotation angle of the track

    // State tracking variables
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let rotationOnStart = 0;
    let dragStartTime = 0;
    let velocityX = 0;

    function setTrackTransition(enable) {
        if (enable) {
            track.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        } else {
            track.style.transition = 'none';
        }
    }

    function updateCarousel() {
        if (isSuspended) return;
        if (sandboxWindow && sandboxWindow.classList.contains('inactive')) return;

        if (sandboxWindow && sandboxWindow.classList.contains('decked-view')) {
            track.style.transform = '';
            cards.forEach((card) => {
                card.classList.add('active');
                card.style.opacity = '1';
                card.style.transform = '';
            });
            return;
        }
        
        // Rotate the track: we use translateZ(-radius) first to move the rotation point
        // then rotateY(currentRotation) to spin the track
        track.style.transform = `translateZ(-${radius}px) rotateY(${currentRotation}deg)`;

        cards.forEach((card) => {
            const index = parseInt(card.getAttribute('data-index'));
            // Calculate card angle relative to the center view (active front position)
            // Track rotation is currentRotation. Card's own rotation is index * anglePerCard.
            // Net angle to user is (index * anglePerCard + currentRotation)
            let angle = (index * anglePerCard + currentRotation) % 360;
            if (angle > 180) angle -= 360;
            if (angle < -180) angle += 360;

            const isFront = Math.abs(angle) < 10;

            if (isFront) {
                card.classList.add('active');
                card.style.opacity = '1';
            } else {
                card.classList.remove('active');
                // Calculate opacity based on angle
                const relativeOpacity = Math.max(0.15, 1 - Math.abs(angle) / 110);
                card.style.opacity = relativeOpacity;
            }

            // Position each card at its corresponding angle around the circle, translated outwards by R
            card.style.transform = `rotateY(${index * anglePerCard}deg) translateZ(${radius}px)`;
        });
    }

    function rotateToCard(index) {
        setTrackTransition(true);
        // Find target angle
        const targetAngle = -index * anglePerCard;
        // Adjust currentRotation so we spin the shortest distance
        const diff = ((targetAngle - currentRotation) % 360);
        let adjustedDiff = diff;
        if (diff > 180) adjustedDiff -= 360;
        if (diff < -180) adjustedDiff += 360;

        currentRotation += adjustedDiff;
        updateCarousel();
    }

    // Navigation Arrow Actions
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (sandboxWindow && (sandboxWindow.classList.contains('decked-view') || sandboxWindow.classList.contains('inactive'))) return;
            setTrackTransition(true);
            currentRotation += anglePerCard;
            // Snap to nearest 72-deg increment
            currentRotation = Math.round(currentRotation / anglePerCard) * anglePerCard;
            updateCarousel();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (sandboxWindow && (sandboxWindow.classList.contains('decked-view') || sandboxWindow.classList.contains('inactive'))) return;
            setTrackTransition(true);
            currentRotation -= anglePerCard;
            // Snap to nearest 72-deg increment
            currentRotation = Math.round(currentRotation / anglePerCard) * anglePerCard;
            updateCarousel();
        });
    }

    // Mouse & Touch Dragging Actions
    const startDrag = (clientX, clientY) => {
        if (isSuspended) return;
        if (sandboxWindow && sandboxWindow.classList.contains('inactive')) return;
        isDragging = true;
        startX = clientX;
        startY = clientY;
        lastX = clientX;
        rotationOnStart = currentRotation;
        velocityX = 0;
        dragStartTime = Date.now();

        if (sandboxWindow && sandboxWindow.classList.contains('decked-view')) {
            return; // drag is inactive, but click should still work on cards
        }

        setTrackTransition(false);
        container.style.cursor = 'grabbing';
    };

    const handleMove = (clientX, clientY) => {
        if (!isDragging) return;
        if (sandboxWindow && sandboxWindow.classList.contains('decked-view')) return;

        const dx = clientX - startX;
        const containerWidth = container.clientWidth || 800;
        // Drag sensitivity: dragging across full width rotates 240 degrees
        const sensitivity = 240 / containerWidth;
        currentRotation = rotationOnStart + dx * sensitivity;

        // Track velocity
        velocityX = clientX - lastX;
        lastX = clientX;

        updateCarousel();
    };

    const handleRelease = (e) => {
        if (!isDragging) return;
        isDragging = false;
        container.style.cursor = '';

        if (sandboxWindow && sandboxWindow.classList.contains('inactive')) return;

        setTrackTransition(true);

        // Check if it was a quick click vs a drag
        let endX = 0, endY = 0;
        if (e.type === 'mouseup' || e.type === 'mouseleave') {
            endX = e.clientX;
            endY = e.clientY;
        } else if (e.type === 'touchend' && e.changedTouches && e.changedTouches.length > 0) {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
        }

        const dist = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
        const duration = Date.now() - dragStartTime;

        if (dist < 8 && duration < 300) {
            // Click occurred!
            const cardEl = e.target.closest('.carousel-card');
            if (cardEl) {
                const index = parseInt(cardEl.getAttribute('data-index'));
                const isDecked = sandboxWindow && sandboxWindow.classList.contains('decked-view');
                const isActive = isDecked || cardEl.classList.contains('active');

                if (!isActive) {
                    rotateToCard(index);
                } else {
                    // Clicked the active card (or any card in decked view): smooth scroll to detailed specifications
                    const targetId = cardEl.getAttribute('data-target');
                    if (targetId) {
                        const dest = document.querySelector(targetId);
                        if (dest) {
                            dest.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            // Highlight project card temporarily
                            dest.style.borderColor = 'var(--accent-secondary)';
                            dest.style.boxShadow = 'var(--shadow-glow-green)';
                            dest.style.transition = 'border-color 0.3s, box-shadow 0.3s';
                            setTimeout(() => {
                                dest.style.borderColor = '';
                                dest.style.boxShadow = '';
                            }, 2000);
                        }
                    }
                }
            }
        } else {
            if (sandboxWindow && sandboxWindow.classList.contains('decked-view')) return;

            // It was a drag: apply velocity inertia throw
            if (Math.abs(velocityX) > 1.5) {
                currentRotation += velocityX * 2.5;
            }
            // Snap to nearest card
            currentRotation = Math.round(currentRotation / anglePerCard) * anglePerCard;
            updateCarousel();
        }
    };

    container.addEventListener('mousedown', (e) => {
        if (e.target.closest('a, button, .carousel-arrow')) return;
        e.preventDefault();
        startDrag(e.clientX, e.clientY);
    });

    container.addEventListener('touchstart', (e) => {
        if (e.target.closest('a, button, .carousel-arrow')) return;
        startDrag(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    window.addEventListener('mousemove', (e) => {
        if (isDragging) handleMove(e.clientX, e.clientY);
    });

    window.addEventListener('touchmove', (e) => {
        if (isDragging) handleMove(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    window.addEventListener('mouseup', handleRelease);
    window.addEventListener('touchend', handleRelease);
    window.addEventListener('mouseleave', handleRelease);

    window.addEventListener('resize', () => {
        radius = getRadius();
        updateCarousel();
    });

    // Initialize layout positions
    updateCarousel();
}

/* ==========================================================================
   5. Category Filter Tabs for Projects Grid
   ========================================================================== */
function initProjectFilters() {
    const filterContainer = document.getElementById('project-filters');
    if (!filterContainer) return;

    const buttons = filterContainer.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.project-card');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-filter');

            cards.forEach(card => {
                if (category === 'all' || card.getAttribute('data-category') === category) {
                    card.style.display = 'block';
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transition = 'opacity 0.3s ease';
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/* ==========================================================================
   6. Magnetic Button Hover Attraction
   ========================================================================== */
function initMagneticButton() {
    const btn = document.getElementById('explore-work-cta');
    if (!btn) return;

    window.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const btnCenterX = rect.left + rect.width / 2;
        const btnCenterY = rect.top + rect.height / 2;

        const dx = e.clientX - btnCenterX;
        const dy = e.clientY - btnCenterY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const magnetRadius = 120;
        if (dist < magnetRadius) {
            // Eased force pull
            const pull = (magnetRadius - dist) / magnetRadius; // 0 to 1
            const pushX = dx * pull * 0.3;
            const pushY = dy * pull * 0.3;

            btn.style.transform = `translate3d(${pushX}px, ${pushY}px, 0) scale(1.03)`;
        } else {
            // Reset position
            btn.style.transform = 'translate3d(0, 0, 0) scale(1)';
        }
    });
}

/* ==========================================================================
   7. Scroll-Triggered Stats Counter
   ========================================================================== */
function initMetricsObserver() {
    const statsSection = document.getElementById('stats');
    if (!statsSection) return;

    const statNumbers = statsSection.querySelectorAll('.stat-number');
    if (!statNumbers.length) return;

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statNumbers.forEach(numEl => {
                    const isText = numEl.getAttribute('data-is-text') === 'true';
                    if (!isText) {
                        const target = parseFloat(numEl.getAttribute('data-target'));
                        const decimals = parseInt(numEl.getAttribute('data-decimals')) || 0;
                        runCounter(numEl, target, decimals);
                    }
                });
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    statsObserver.observe(statsSection);

    function runCounter(element, target, decimals) {
        let current = 0;
        const duration = 1800; // ms
        const startTime = performance.now();

        function step(now) {
            const elapsed = now - startTime;
            const progress = Math.min(1, elapsed / duration);
            
            // Quad easeOut function for premium feel
            const easeOutQuad = progress * (2 - progress);
            current = easeOutQuad * target;
            
            if (decimals === 2) {
                element.textContent = current.toFixed(2);
            } else if (decimals === 1) {
                element.textContent = current.toFixed(1) + '%';
            } else {
                element.textContent = Math.floor(current);
            }

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                if (decimals === 2) {
                    element.textContent = target.toFixed(2);
                } else if (decimals === 1) {
                    element.textContent = target.toFixed(1) + '%';
                } else {
                    element.textContent = target;
                }
            }
        }
        requestAnimationFrame(step);
    }
}

/* ==========================================================================
   8. Email Clipboard Copy & Confetti Emitter
   ========================================================================== */
function initCopyEmail() {
    const copyBtn = document.getElementById('copy-email-btn');
    const alertMsg = document.getElementById('copy-success-msg');
    if (!copyBtn) return;

    copyBtn.addEventListener('click', () => {
        const emailAddress = "reshma2001biju@gmail.com";
        
        navigator.clipboard.writeText(emailAddress).then(() => {
            if (alertMsg) {
                alertMsg.classList.add('active');
                setTimeout(() => alertMsg.classList.remove('active'), 2000);
            }

            // Trigger beautiful particle blast
            spawnConfetti(copyBtn);
        }).catch(err => {
            console.error("Clipboard copy failed: ", err);
        });
    });

    function spawnConfetti(anchor) {
        const rect = anchor.getBoundingClientRect();
        const originX = rect.left + rect.width / 2;
        const originY = rect.top + rect.height / 2;

        const colors = ['#00F2FE', '#39FF14', '#BD00FF', '#FF6B00', '#FFFFFF'];
        const particlesCount = 40;

        for (let i = 0; i < particlesCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-particle';

            // Randomize shapes, sizes, and colors
            const size = Math.random() * 8 + 5;
            const shape = Math.random() > 0.5 ? '50%' : '0%'; // round or squared
            const color = colors[Math.floor(Math.random() * colors.length)];

            // Trajectory physics values
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 120 + 30;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance + 100; // drop down over duration

            const rot = Math.random() * 720 - 360;
            const duration = Math.random() * 0.8 + 0.6;

            // Set style variables mapped to CSS Keyframes
            confetti.style.setProperty('--size', `${size}px`);
            confetti.style.setProperty('--shape', shape);
            confetti.style.setProperty('--color', color);
            confetti.style.setProperty('--tx', `${tx}px`);
            confetti.style.setProperty('--ty', `${ty}px`);
            confetti.style.setProperty('--rot', `${rot}deg`);
            confetti.style.setProperty('--duration', `${duration}s`);

            // Anchor placement
            confetti.style.left = `${originX}px`;
            confetti.style.top = `${originY}px`;

            document.body.appendChild(confetti);

            // Automatic clean up
            setTimeout(() => confetti.remove(), duration * 1000);
        }
    }
}

/* ==========================================================================
   9. Theme Toggling (Dark Default & Persistent)
   ========================================================================== */
function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        localStorage.setItem('reshma-theme', isLight ? 'light' : 'dark');
    });

    // Check localStorage preference on load
    const userPref = localStorage.getItem('reshma-theme');
    if (userPref === 'light') {
        document.body.classList.add('light-theme');
    }
}

/* ==========================================================================
   10. Web3Forms Contact Form Submission
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const statusMsg = document.getElementById('form-status');
    const accessKey = "d2348461-1817-42cf-a997-372a581c9717";

    if (!form || !statusMsg) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('form-name').value.trim();
        const email = document.getElementById('form-email').value.trim();
        const message = document.getElementById('form-message').value.trim();

        if (!name || !email || !message) {
            statusMsg.textContent = "Please fill in all fields.";
            statusMsg.className = "form-status error";
            return;
        }

        statusMsg.textContent = "Sending message...";
        statusMsg.className = "form-status";
        statusMsg.style.display = "block";

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: JSON.stringify({
                    access_key: accessKey,
                    name: name,
                    email: email,
                    message: message,
                    subject: `Portfolio Signal from ${name}`
                })
            });

            const result = await response.json();

            if (response.status === 200 && result.success) {
                statusMsg.textContent = "Message sent successfully! I will get back to you soon.";
                statusMsg.className = "form-status success";
                form.reset();
            } else {
                statusMsg.textContent = result.message || "Something went wrong. Please try again.";
                statusMsg.className = "form-status error";
            }
        } catch (err) {
            console.error(err);
            statusMsg.textContent = "Failed to send message. Please check your network connection.";
            statusMsg.className = "form-status error";
        }
    });
}

/* ==========================================================================
   11. Calibration Download Progress Logic
   ========================================================================== */
function initBlueprintDownload() {
    const btn = document.getElementById('download-blueprint-btn');
    if (!btn) return;
    
    const btnText = btn.querySelector('.btn-text');
    const barFill = btn.querySelector('.loader-bar-fill');
    
    btn.addEventListener('click', () => {
        if (btn.classList.contains('loading')) return;
        
        btn.classList.add('loading');
        btn.setAttribute('disabled', 'true');
        
        const phases = [
            { text: "Preparing CV... 32%", duration: 600, width: 32 },
            { text: "Verifying File... 67%", duration: 600, width: 67 },
            { text: "Completed! 100%", duration: 400, width: 100 }
        ];
        
        let currentPhase = 0;
        
        function runPhase() {
            if (currentPhase >= phases.length) {
                setTimeout(() => {
                    const link = document.createElement('a');
                    link.href = 'assets/reshma_cv.pdf?v=' + Date.now();
                    link.download = 'Reshma_Katharin_Biju_CV.pdf';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    
                    // Reset button states
                    btn.classList.remove('loading');
                    btn.removeAttribute('disabled');
                    btnText.textContent = "Download Resume";
                    barFill.style.width = '0%';
                }, 300);
                return;
            }
            
            const phase = phases[currentPhase];
            btnText.textContent = phase.text;
            barFill.style.width = `${phase.width}%`;
            
            currentPhase++;
            setTimeout(runPhase, phase.duration);
        }
        
        runPhase();
    });
}

/* ==========================================================================
   12. Project Specifications sliding drawer (Sliding Tab)
   ========================================================================== */
function initDrawer() {
    const drawer = document.getElementById('project-drawer');
    const closeBtn = document.getElementById('drawer-close');
    const backdrop = document.getElementById('drawer-backdrop');

    if (!drawer) return;

    const openDrawer = () => {
        drawer.classList.add('visible');
        document.body.style.overflow = 'hidden'; // Lock background scroll
        
        // Remove dragging cursor indicators
        const cursor = document.getElementById('custom-cursor');
        if (cursor) {
            cursor.classList.remove('cursor-drag');
            cursor.classList.add('cursor-hover');
        }
    };

    const closeDrawer = () => {
        drawer.classList.remove('visible');
        document.body.style.overflow = ''; // Unlock background scroll
        
        const cursor = document.getElementById('custom-cursor');
        if (cursor) {
            cursor.classList.remove('cursor-hover');
        }
    };

    // Expose openDrawer globally in case it is needed elsewhere
    window.openProjectDrawer = openDrawer;

    if (closeBtn) {
        closeBtn.addEventListener('click', closeDrawer);
    }

    if (backdrop) {
        backdrop.addEventListener('click', closeDrawer);
    }

    // Close on Escape key press
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && drawer.classList.contains('visible')) {
            closeDrawer();
        }
    });
}


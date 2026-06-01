document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Neural Network Canvas Background
    initNeuralCanvas();

    // 2. Navigation active link tracking & Mobile Navbar toggle
    initNavigation();

    // 3. Project Filter Tabs Logic
    initProjectFilters();

    // 4. Scroll Reveal Animations (Intersection Observer)
    initScrollReveal();

    // 5. Interactive Contact Form Handler
    initContactForm();

    // 6. Initialize Resume Cache-Busted Download
    initResumeDownload();
});

// Canvas Interactive Particles System (Neural Network simulation)
function initNeuralCanvas() {
    const canvas = document.getElementById('neural-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Track window resize
    window.addEventListener('resize', () => {
        width = (canvas.width = window.innerWidth);
        height = (canvas.height = window.innerHeight);
    });

    const particles = [];
    const maxParticles = width < 768 ? 40 : 100;
    const connectionDist = 120;
    const mouse = { x: null, y: null, radius: 180 };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Handle mouse click to spawn particles (representing signals)
    window.addEventListener('click', (e) => {
        if (mouse.x && mouse.y) {
            for (let i = 0; i < 5; i++) {
                particles.push(new Particle(mouse.x, mouse.y, true));
                if (particles.length > maxParticles + 15) {
                    particles.shift();
                }
            }
        }
    });

    class Particle {
        constructor(x, y, isClickSpawned = false) {
            this.x = x || Math.random() * width;
            this.y = y || Math.random() * height;
            this.size = Math.random() * 2 + (isClickSpawned ? 2.5 : 1);
            
            // Speeds
            const baseSpeed = isClickSpawned ? 2 : 0.4;
            this.vx = (Math.random() - 0.5) * baseSpeed;
            this.vy = (Math.random() - 0.5) * baseSpeed;
            this.alpha = isClickSpawned ? 1 : 0.15 + Math.random() * 0.45;
            this.life = isClickSpawned ? 100 : null; // life counter for clicked particles
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce on boundaries
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            if (this.life !== null) {
                this.life--;
                this.alpha = this.life / 100;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            // Cyan or Green colors depending on properties
            if (this.life !== null) {
                ctx.fillStyle = `rgba(0, 255, 135, ${this.alpha})`;
            } else {
                ctx.fillStyle = `rgba(0, 242, 254, ${this.alpha})`;
            }
            ctx.fill();
        }
    }

    // Initialize particles
    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Filter out dead click-spawned particles
        for (let i = particles.length - 1; i >= 0; i--) {
            if (particles[i].life !== null && particles[i].life <= 0) {
                particles.splice(i, 1);
            }
        }

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDist) {
                    let alpha = (1 - dist / connectionDist) * 0.15;
                    
                    // Boost opacity if mouse is close (interactive glow)
                    if (mouse.x && mouse.y) {
                        const mdx1 = particles[i].x - mouse.x;
                        const mdy1 = particles[i].y - mouse.y;
                        const mdist1 = Math.sqrt(mdx1 * mdx1 + mdy1 * mdy1);

                        const mdx2 = particles[j].x - mouse.x;
                        const mdy2 = particles[j].y - mouse.y;
                        const mdist2 = Math.sqrt(mdx2 * mdx2 + mdy2 * mdy2);

                        if (mdist1 < mouse.radius && mdist2 < mouse.radius) {
                            alpha += (1 - (mdist1 + mdist2) / (mouse.radius * 2)) * 0.25;
                        }
                    }

                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    
                    // Gradient connection
                    const strokeGrad = ctx.createLinearGradient(
                        particles[i].x, particles[i].y, 
                        particles[j].x, particles[j].y
                    );
                    strokeGrad.addColorStop(0, `rgba(0, 242, 254, ${alpha})`);
                    strokeGrad.addColorStop(1, `rgba(0, 255, 135, ${alpha})`);
                    
                    ctx.strokeStyle = strokeGrad;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
}

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section');
    const menuToggle = document.getElementById('menu-toggle');
    const navList = document.getElementById('nav-list');

    // Menu toggle for mobile responsive navbar
    if (menuToggle && navList) {
        menuToggle.addEventListener('click', () => {
            navList.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        // Close menu on click of nav link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navList.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
    }

    // Scroll active link highlight
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active classes
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (category === 'all' || cardCategory === category) {
                    card.style.display = 'flex';
                    // Trigger fade in animation
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    // Delay hiding to allow transition to run
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

function initScrollReveal() {
    const elementsToReveal = document.querySelectorAll('.timeline-content, .project-card, .skill-card, .honor-item, .contact-card, .contact-form, .pitch-column');
    
    // Set initial transition styles via JS to keep CSS clean
    elementsToReveal.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1), transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)';
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                // Unobserve once shown
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    elementsToReveal.forEach(el => {
        revealObserver.observe(el);
    });
}

function initContactForm() {
    const form = document.getElementById('contact-form');
    const statusMessage = document.getElementById('form-status');

    // CONFIGURATION: Set your Web3Forms access key here to receive real emails.
    // Get your free key instantly at https://web3forms.com
    const WEB3FORMS_ACCESS_KEY = "d2348461-1817-42cf-a997-372a581c9717"; 

    if (!form || !statusMessage) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('form-name').value.trim();
        const email = document.getElementById('form-email').value.trim();
        const message = document.getElementById('form-message').value.trim();

        if (!name || !email || !message) {
            statusMessage.textContent = 'Please fill out all fields.';
            statusMessage.className = 'form-status error';
            return;
        }

        statusMessage.textContent = 'Sending message...';
        statusMessage.className = 'form-status';

        // Check if Web3Forms key has been set
        if (WEB3FORMS_ACCESS_KEY === "YOUR_ACCESS_KEY_HERE" || WEB3FORMS_ACCESS_KEY === "") {
            // Simulated submission (Demo Mode)
            setTimeout(() => {
                statusMessage.innerHTML = '<strong>[Demo Mode]</strong> Message simulated successfully! To receive real emails, add your free key from <a href="https://web3forms.com" target="_blank" style="color: var(--accent-cyan); text-decoration: underline;">web3forms.com</a> inside <code>app.js</code>.';
                statusMessage.className = 'form-status success';
                form.reset();
            }, 1200);
            return;
        }

        // Real Submission using Web3Forms API
        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: JSON.stringify({
                    access_key: WEB3FORMS_ACCESS_KEY,
                    name: name,
                    email: email,
                    message: message,
                    subject: `New Portfolio Message from ${name}`
                })
            });

            const json = await response.json();

            if (response.status === 200 && json.success) {
                statusMessage.textContent = 'Thank you! Your message has been sent successfully. Reshma will get back to you shortly.';
                statusMessage.className = 'form-status success';
                form.reset();
            } else {
                statusMessage.textContent = json.message || 'Something went wrong. Please try again.';
                statusMessage.className = 'form-status error';
            }
        } catch (error) {
            console.error(error);
            statusMessage.textContent = 'Network error. Please check your internet connection and try again.';
            statusMessage.className = 'form-status error';
        }
    });
}

// Prevents browser and CDN caching of resume PDF by applying a dynamic timestamp query parameter on download
function initResumeDownload() {
    const btn = document.getElementById('download-resume-btn');
    if (!btn) return;

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const link = document.createElement('a');
        link.href = 'reshma_cv.pdf?v=' + Date.now();
        link.download = 'Reshma_Katharin_Biju_CV.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}

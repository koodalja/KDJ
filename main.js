document.addEventListener('DOMContentLoaded', () => {
    // --- 1. HEADER SCROLL EFFECT ---
    const header = document.querySelector('header');
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    // --- 2. MOBILE MENU TOGGLE ---
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('nav');
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            nav.classList.toggle('active');
        });

        // Close menu when clicking a link
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                nav.classList.remove('active');
            });
        });
    }

    // --- 3. SCROLL REVEAL ANIMATIONS (Intersection Observer) ---
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Once it is revealed, we can stop observing it
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- 4. JEJU WEATHER & TIME WIDGET (For Index Page) ---
    const timeElement = document.getElementById('jeju-time');
    const dateElement = document.getElementById('jeju-date');
    const weatherTemp = document.getElementById('weather-temp');
    const weatherStatus = document.getElementById('weather-status');

    if (timeElement || dateElement || weatherTemp || weatherStatus) {
        // Update Time
        const updateJejuTime = () => {
            const now = new Date();
            // Jeju is in KST (UTC+9)
            // Since the system locale is already Korean/KST (based on user metadata), we can just format locally
            const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
            const dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' };

            if (timeElement) timeElement.textContent = now.toLocaleTimeString('ko-KR', timeOptions);
            if (dateElement) dateElement.textContent = now.toLocaleDateString('ko-KR', dateOptions);
        };

        updateJejuTime();
        setInterval(updateJejuTime, 1000);

        // Fetch/Simulate weather
        const weatherDescriptions = ['맑음', '구름 조금', '선선함', '고요함'];
        const temp = 22.4;
        const randomDesc = weatherDescriptions[Math.floor(Math.random() * weatherDescriptions.length)];

        if (weatherTemp) weatherTemp.textContent = `${temp.toFixed(1)}°C`;
        if (weatherStatus) weatherStatus.textContent = `제주 丕家 : ${randomDesc}`;
    }

    // --- 5. PROMO CARD (FLOATING) ---
    const promoBanner = document.getElementById('promo-banner');
    const closeBannerBtn = document.getElementById('close-banner-btn');
    if (promoBanner && closeBannerBtn) {
        if (sessionStorage.getItem('piga_banner_closed') === 'true') {
            promoBanner.style.display = 'none';
        } else {
            promoBanner.style.display = 'flex';
            // Trigger CSS transition after a short delay for premium feel
            setTimeout(() => {
                promoBanner.classList.add('show');
            }, 800);
        }
        closeBannerBtn.addEventListener('click', () => {
            promoBanner.classList.remove('show');
            // Wait for CSS transitions (0.6s) to complete before setting display to none
            setTimeout(() => {
                promoBanner.style.display = 'none';
            }, 600);
            sessionStorage.setItem('piga_banner_closed', 'true');
        });
    }

    // --- 6. SIGN UP MODAL ---
    const signupTrigger = document.getElementById('signup-trigger');
    const signupModal = document.getElementById('signup-modal');
    const signupClose = document.getElementById('signup-close');
    const signupForm = document.getElementById('signup-form');

    if (signupTrigger && signupModal && signupClose) {
        signupTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            signupModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        const closeModal = () => {
            signupModal.classList.remove('active');
            document.body.style.overflow = '';
        };

        signupClose.addEventListener('click', closeModal);
        signupModal.addEventListener('click', (e) => {
            if (e.target === signupModal) {
                closeModal();
            }
        });

        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('signup-name').value;
                const pwd = document.getElementById('signup-password').value;
                const pwdConfirm = document.getElementById('signup-password-confirm').value;

                if (pwd !== pwdConfirm) {
                    alert(localStorage.getItem('piga_lang') === 'en' ? 'Passwords do not match.' : '비밀번호가 일치하지 않습니다.');
                    return;
                }

                alert(localStorage.getItem('piga_lang') === 'en' ? `Welcome, ${name}! Membership signup successful.` : `반갑습니다, ${name}님! 회원가입이 성공적으로 완료되었습니다.`);
                signupForm.reset();
                closeModal();
            });
        }
    }
});

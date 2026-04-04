/* ============================================================
   RETRO MONO PORTFOLIO — script.js
   ============================================================ */

/* ── 1. MOBILE NAV ─────────────────────────────────────────── */
(function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
})();

/* ── 2. SCROLL REVEAL ──────────────────────────────────────── */
(function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal, .stagger');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => observer.observe(el));
})();

/* ── 3. TYPED HEADLINE EFFECT ──────────────────────────────── */
(function initTyped() {
  const target = document.getElementById('typed-role');
  if (!target) return;

  const roles = [
    'Hardware Engineer',
    'RISC-V Designer',
    'AI Researcher',
    'ML Engineer',
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const current = roles[roleIndex];

    if (!deleting) {
      charIndex++;
      target.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, 1800);
        return;
      }
    } else {
      charIndex--;
      target.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(tick, deleting ? 50 : 90);
  }

  tick();
})();

/* ── 4. SMOOTH ACTIVE NAV HIGHLIGHT ───────────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.style.background = '';
          link.style.color = '';
          if (link.getAttribute('href') === `#${id}`) {
            link.style.background = 'var(--color-ink)';
            link.style.color = 'var(--color-surface)';
          }
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

  sections.forEach(sec => observer.observe(sec));
})();

/* ── 5. STAT COUNTER ANIMATION ─────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1000;
      const startTime = performance.now();

      function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

/* ── 6. TERMINAL ANIMATION ─────────────────────────────────── */
(function initTerminal() {
  const body = document.getElementById('terminal-body');
  if (!body) return;

  const script = [
    { type: 'cmd',    text: 'whoami' },
    { type: 'output', text: 'Ansh Verma · ECE Student · VIT Chennai' },
    { type: 'cmd',    text: 'cat about.txt' },
    { type: 'output', text: 'Building at the intersection of computer' },
    { type: 'output', text: 'architecture, hardware design, and ML.' },
    { type: 'output', text: 'RISC-V silicon → GNNs at gate-level.' },
    { type: 'cmd',    text: 'cat contact.txt' },
    { type: 'output', text: 'Email    → 07anshverma@gmail.com' },
    { type: 'output', text: 'GitHub   → github.com/ansh07verma' },
    { type: 'output', text: 'LinkedIn → linkedin.com/in/ansh07verma' },
    { type: 'cmd',    text: './status.sh' },
    { type: 'output', text: '[●] Open to internships · Summer 2026' },
    { type: 'output', text: '[○] CGPA 8.12/10.00 · VIT Chennai' },
    { type: 'output', text: '[○] Chennai, India' },
  ];

  let started = false;

  // Start after short delay so fonts load first
  setTimeout(() => {
    if (!started) { started = true; runScript(0); }
  }, 700);

  function runScript(i) {
    if (i >= script.length) {
      const cur = document.createElement('span');
      cur.className = 't-cursor';
      body.appendChild(cur);
      return;
    }
    const entry = script[i];
    const line = document.createElement('div');
    line.className = 't-line';

    if (entry.type === 'cmd') {
      const prompt = document.createElement('span');
      prompt.className = 't-prompt';
      prompt.textContent = '>';
      const cmd = document.createElement('span');
      cmd.className = 't-cmd';
      line.appendChild(prompt);
      line.appendChild(cmd);
      body.appendChild(line);
      typeWord(cmd, entry.text, () => {
        body.scrollTop = body.scrollHeight;
        setTimeout(() => runScript(i + 1), 180);
      });
    } else {
      const out = document.createElement('span');
      out.className = 't-out';
      out.textContent = entry.text;
      line.appendChild(out);
      body.appendChild(line);
      body.scrollTop = body.scrollHeight;
      setTimeout(() => runScript(i + 1), 60);
    }
  }

  function typeWord(el, text, cb) {
    let n = 0;
    (function tick() {
      el.textContent = text.slice(0, ++n);
      if (n < text.length) setTimeout(tick, 55);
      else cb();
    })();
  }
})();


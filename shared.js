// ── NAV & FOOTER INJECTION ───────────────────────
(function () {
  // Inject nav
  const navPlaceholder = document.getElementById('nav-placeholder');
  if (navPlaceholder) {
    fetch('/nav.html')
      .then(r => r.text())
      .then(html => {
        navPlaceholder.outerHTML = html;
        // Set active nav link after injection
        const page = document.body.dataset.page;
        const activeKey = page === 'nightshift' ? 'games' : page;
        document.querySelectorAll('.nav-links a').forEach(a => {
          if (a.dataset.page === activeKey) a.classList.add('active');
        });
      });
  }

  // Inject footer
  const footerPlaceholder = document.getElementById('footer-placeholder');
  if (footerPlaceholder) {
    fetch('/footer.html')
      .then(r => r.text())
      .then(html => { footerPlaceholder.outerHTML = html; });
  }
})();

// ── PAGE TRANSITIONS ─────────────────────────────
(function () {
  // Inject the transition overlay
  const overlay = document.createElement('div');
  overlay.className = 'page-transition';
  document.body.appendChild(overlay);

  // On page load — sweep out to reveal the page
  overlay.classList.add('leaving');
  overlay.addEventListener('animationend', () => {
    overlay.classList.remove('leaving');
  }, { once: true });

  // Intercept all internal link clicks
  document.addEventListener('click', function (e) {
    const link = e.target.closest('a[href]');
    if (!link) return;

    const href = link.getAttribute('href');
    // Skip external, hash-only, mailto, tel links
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http')) return;
    // Skip target="_blank"
    if (link.target === '_blank') return;

    e.preventDefault();

    // Sweep in, then navigate
    overlay.classList.add('entering');
    overlay.addEventListener('animationend', () => {
      window.location.href = href;
    }, { once: true });
  });
})();

// ── MOBILE NAV ───────────────────────────────────
function toggleMobileNav() {
  document.getElementById('mobile-nav').classList.toggle('open');
  document.querySelector('.nav-burger').classList.toggle('open');
}

// ── TOAST ─────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg || 'Coming soon!';
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3500);
}

// ── FORM ──────────────────────────────────────────
function sendForm() {
  showToast("Message sent. We'll be in touch soon!");
}

// ── FADE-IN ON SCROLL ─────────────────────────────
function initFadeIns() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        e.target.querySelectorAll('.fade-in').forEach((c, i) => {
          setTimeout(() => c.classList.add('visible'), i * 80);
        });
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));
}

// ── NAV SCROLL EFFECT ─────────────────────────────
window.addEventListener('scroll', () => {
  const nav = document.getElementById('main-nav');
  if (nav) nav.style.background = window.scrollY > 20 ? 'rgba(8,8,8,0.97)' : 'rgba(8,8,8,0.85)';
});

// ── ACTIVE NAV LINK ───────────────────────────────
(function () {
  const page = document.body.dataset.page;
  // nightshift is under Games
  const activeKey = page === 'nightshift' ? 'games' : page;
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.dataset.page === activeKey) a.classList.add('active');
  });
})();

initFadeIns();
// ── SCROLL TO TOP ─────────────────────────────────
(function () {
  const btn = document.createElement('button');
  btn.className = 'scroll-top';
  btn.setAttribute('aria-label', 'Scroll to top');
  btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 14 14" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M7 1L1 8h4v5h4V8h4L7 1z"/></svg>';
  btn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  document.body.appendChild(btn);
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  });
})();

// ── COOKIE CONSENT ────────────────────────────────
(function () {
  if (localStorage.getItem('pw-cookie-consent')) return;

  const banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.innerHTML = `
    <div class="cookie-banner-text">
      We use cookies to improve your experience on this site. By continuing to browse you agree to our use of cookies.
      <a href="/pages/privacy.html">Privacy Policy</a>
    </div>
    <div class="cookie-banner-actions">
      <button class="cookie-btn cookie-btn-decline" id="cookie-decline">Decline</button>
      <button class="cookie-btn cookie-btn-accept" id="cookie-accept">Accept</button>
    </div>
  `;
  document.body.appendChild(banner);

  // Animate in after a short delay
  setTimeout(() => banner.classList.add('visible'), 800);

  document.getElementById('cookie-accept').onclick = () => {
    localStorage.setItem('pw-cookie-consent', 'accepted');
    banner.classList.remove('visible');
    setTimeout(() => banner.remove(), 400);
  };

  document.getElementById('cookie-decline').onclick = () => {
    localStorage.setItem('pw-cookie-consent', 'declined');
    banner.classList.remove('visible');
    setTimeout(() => banner.remove(), 400);
  };
})();
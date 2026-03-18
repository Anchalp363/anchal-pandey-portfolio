'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ════════════════════════════
     LOADER — Platform pill sequence
  ════════════════════════════ */
  const loader  = document.getElementById('loader');
  const ldBar   = document.getElementById('ldBar');
  const ldPct   = document.getElementById('ldPct');
  const pills   = document.querySelectorAll('.ld-pill');
  let loaderDone = false;

  const PLATFORMS = ['Shopify','WordPress','WooCommerce','Webflow','Squarespace','Wix'];

  // Progress steps: [target %, delay ms]
  const STEPS = [
    [10, 100], [24, 350], [40, 600],
    [58, 850], [72, 1100], [86, 1400], [100, 1700],
  ];

  // Animate progress bar
  STEPS.forEach(([pct, delay]) => {
    setTimeout(() => {
      if (ldBar)  ldBar.style.width = pct + '%';
      if (ldPct)  ldPct.textContent = pct + '%';
    }, delay);
  });

  // Show pills one by one, highlighting current
  pills.forEach((pill, i) => {
    setTimeout(() => {
      pill.classList.add('show');
      // remove active from all, add to current
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
    }, 300 + i * 270);
  });
  // After last pill, leave them all lit
  setTimeout(() => {
    pills.forEach(p => { p.classList.add('show'); p.classList.remove('active'); });
  }, 300 + pills.length * 270 + 200);

  function dismissLoader() {
    if (loaderDone) return;
    loaderDone = true;
    setTimeout(() => {
      loader.classList.add('hidden');
      revealHeroItems();
    }, 300);
  }

  window.addEventListener('load', () => setTimeout(dismissLoader, 2100));
  setTimeout(dismissLoader, 3600);

  function revealHeroItems() {
    document.querySelectorAll('.hero-text .reveal')
      .forEach((el, i) => setTimeout(() => el.classList.add('in'), i * 110 + 60));
    setTimeout(() => document.querySelector('.hero-image')?.classList.add('in'), 450);
  }

  /* ════════════════════════════
     PARTICLE CANVAS
  ════════════════════════════ */
  const canvas = document.getElementById('particleCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', () => { resize(); initParticles(); }, { passive: true });

    function initParticles() {
      const count = Math.min(Math.floor((W * H) / 18000), 80);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 1.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
        a: Math.random() * 0.45 + 0.1,
      }));
    }
    initParticles();

    (function draw() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(96,165,250,${p.a})`;
        ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      });
      requestAnimationFrame(draw);
    })();
  }

  /* ════════════════════════════
     CURSOR
  ════════════════════════════ */
  const cursor = document.getElementById('cursor');
  if (cursor && !('ontouchstart' in window)) {
    let cx = 0, cy = 0, tx = 0, ty = 0;
    document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
    (function moveCursor() {
      cx += (tx - cx) * 0.15; cy += (ty - cy) * 0.15;
      cursor.style.left = cx + 'px'; cursor.style.top = cy + 'px';
      requestAnimationFrame(moveCursor);
    })();
    const hoverEls = 'a,button,.proj-card,.feat-card,.contact-link,.tech-chip,.proj-tab,.tl-proj-link,.tech-cloud span';
    document.querySelectorAll(hoverEls).forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('big'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('big'));
    });
  } else if (cursor) {
    cursor.style.display = 'none'; // hide cursor on touch devices
  }

  /* ════════════════════════════
     STICKY NAV
  ════════════════════════════ */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  /* ════════════════════════════
     ACTIVE NAV LINK
  ════════════════════════════ */
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const secObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        document.querySelector(`.nav-link[href="#${e.target.id}"]`)?.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => secObs.observe(s));

  /* ════════════════════════════
     MOBILE MENU
  ════════════════════════════ */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobClose   = document.getElementById('mobClose');
  let mobOpen = false;

  function openMob()  { mobOpen = true;  mobileMenu.classList.add('open');    document.body.style.overflow = 'hidden'; setHbg(true); }
  function closeMob() { mobOpen = false; mobileMenu.classList.remove('open'); document.body.style.overflow = '';       setHbg(false); }
  function setHbg(open) {
    const sp = hamburger.querySelectorAll('span');
    if (open) { sp[0].style.transform='rotate(45deg) translate(4px,4px)'; sp[1].style.opacity='0'; sp[2].style.transform='rotate(-45deg) translate(4px,-4px)'; }
    else { sp.forEach(s => { s.style.transform=''; s.style.opacity=''; }); }
  }
  hamburger.addEventListener('click', () => mobOpen ? closeMob() : openMob());
  mobClose?.addEventListener('click', closeMob);
  document.querySelectorAll('.mob-link, .mob-resume').forEach(a => a.addEventListener('click', closeMob));

  /* ════════════════════════════
     SMOOTH SCROLL (all anchors)
  ════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const tgt = document.querySelector(id);
      if (!tgt) return;
      e.preventDefault();
      closeMob();
      window.scrollTo({ top: tgt.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    });
  });

  /* ════════════════════════════
     SCROLL REVEAL
  ════════════════════════════ */
  const revObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); revObs.unobserve(e.target); } });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal, .reveal-right').forEach(el => revObs.observe(el));

  /* ════════════════════════════
     METRIC COUNTERS
  ════════════════════════════ */
  function countUp(el, target, dur = 1400) {
    let n = 0;
    const step = target / (dur / 16);
    const t = setInterval(() => {
      n += step;
      if (n >= target) { el.textContent = target; clearInterval(t); }
      else el.textContent = Math.floor(n);
    }, 16);
  }
  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.metric-num').forEach(el => countUp(el, +el.dataset.count));
        e.target.classList.add('counted');
      }
    });
  }, { threshold: 0.5 }).observe(document.querySelector('.metrics-grid') || document.body);

  /* ════════════════════════════
     SKILL BARS
  ════════════════════════════ */
  const skObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.sb-fill').forEach(f => {
          setTimeout(() => f.style.width = (f.dataset.w || 0) + '%', 150);
        });
        skObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.25 });
  document.querySelectorAll('.skill-group').forEach(g => skObs.observe(g));

  /* ════════════════════════════
     PROJECT TABS + FILTERING
     Tasks 3 & 4
  ════════════════════════════ */
  const projTabs   = document.querySelectorAll('.proj-tab');
  const projPanels = document.querySelectorAll('.proj-panel');
  const projEmpty  = document.getElementById('projEmpty');
  const projEmptyReset = document.getElementById('projEmptyReset');

  // Map hero chip data-filter → tab panel IDs
  const filterToTab = {
    shopify:     'shopify',
    wordpress:   'wordpress',
    woocommerce: 'woocommerce',
    webflow:     'webflow',
    liquid:      'shopify',
    api:         'shopify',
    gempages:    'gempages',
    replo:       'gempages',
    pagefly:     'gempages',
    squarespace: 'squarespace',
    wix:         'wix',
  };

  function activateTab(tabId) {
    // Update tab buttons
    projTabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tabId));

    // Hide ALL panels — remove both class AND any inline style
    projPanels.forEach(p => {
      p.classList.remove('active');
      p.style.display = '';
    });

    if (projEmpty) projEmpty.style.display = 'none';

    // Show only the target panel
    const activePanel = document.getElementById('panel-' + tabId);
    const hasContent  = activePanel && activePanel.querySelectorAll('.proj-card').length > 0;

    if (!activePanel || !hasContent) {
      if (projEmpty) projEmpty.style.display = 'flex';
      return;
    }

    activePanel.classList.add('active');

    // Re-trigger scroll reveal on cards in this panel
    activePanel.querySelectorAll('.reveal, .reveal-right').forEach(el => {
      el.classList.remove('in');
      setTimeout(() => revObs.observe(el), 20);
    });
  }

  // Tab click: activate + scroll
  projTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      activateTab(tab.dataset.tab);
      // Smooth scroll to projects section
      const projSec = document.getElementById('projects');
      if (projSec) {
        setTimeout(() => {
          window.scrollTo({ top: projSec.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
        }, 50);
      }
    });
  });

  // Hero tech chips: filter + scroll to projects
  document.querySelectorAll('.tech-chip[data-filter]').forEach(chip => {
    chip.addEventListener('click', e => {
      e.preventDefault();
      const filter = chip.dataset.filter;
      const tabId  = filterToTab[filter] || 'shopify';

      // Visual active state on chip
      document.querySelectorAll('.tech-chip').forEach(c => c.classList.remove('active-chip'));
      chip.classList.add('active-chip');

      activateTab(tabId);

      // Scroll to projects
      const projSec = document.getElementById('projects');
      if (projSec) {
        setTimeout(() => {
          window.scrollTo({ top: projSec.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
        }, 50);
      }

      // Remove chip active state after 2s
      setTimeout(() => chip.classList.remove('active-chip'), 2000);
    });
  });

  // Empty state reset
  projEmptyReset?.addEventListener('click', () => {
    activateTab('shopify');
    if (projEmpty) projEmpty.style.display = 'none';
  });

  /* ════════════════════════════
     TASK 5: EMAIL BUTTON
  ════════════════════════════ */
  const emailBtn = document.getElementById('emailDirectBtn');
  if (emailBtn) {
    // Primary method: native anchor tag handles it automatically
    // Fallback: JS handler for browsers that block href mailto
    emailBtn.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('mailto:')) {
        // Don't prevent default — let the browser handle it natively
        // Only use window.location as fallback if the click didn't open mail
        setTimeout(() => {
          try { window.location.href = href; } catch(_) {}
        }, 100);
      }
    });
  }

  /* ════════════════════════════
     TASK 8: UX INTERACTIONS
  ════════════════════════════ */

  // Feat card icon bounce
  document.querySelectorAll('.feat-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      const ico = card.querySelector('.feat-icon');
      if (!ico) return;
      ico.style.transition = 'transform .35s cubic-bezier(0.34,1.56,0.64,1)';
      ico.style.transform  = 'scale(1.4) rotate(-8deg)';
      setTimeout(() => { ico.style.transform = 'scale(1)'; }, 380);
    });
  });

  // Project card 3D tilt (disabled on mobile for performance)
  if (window.innerWidth > 768) {
    document.querySelectorAll('.proj-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - .5;
        const y = (e.clientY - r.top)  / r.height - .5;
        card.style.transform = `translateY(-6px) rotateX(${-y*4}deg) rotateY(${x*4}deg)`;
        card.style.transition = 'transform .08s ease';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform  = '';
        card.style.transition = 'transform .35s cubic-bezier(0.22,1,0.36,1), box-shadow .3s, border-color .2s';
      });
    });
  }

  // Parallax on hero glow (subtle)
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const g = document.querySelector('.hbg-gradient');
    if (g) g.style.transform = `translateY(${y * .06}px)`;
  }, { passive: true });

  /* ════════════════════════════
     RESUME — open in new tab
  ════════════════════════════ */
  document.querySelectorAll('a[href$=".pdf"], a[download]').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (!href.includes('.pdf')) return;
    link.removeAttribute('download');
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener');
  });

  /* ════════════════════════════
     ZOOM MODAL
  ════════════════════════════ */
  const zOverlay   = document.getElementById('zoomOverlay');
  const zClose     = document.getElementById('zoomClose');
  const zSubmit    = document.getElementById('zoomSubmit');
  const zForm      = document.getElementById('zoomForm');
  const zSuccess   = document.getElementById('zoomSuccess');
  const zSuccClose = document.getElementById('zoomSuccessClose');

  function openZoom() {
    if (!zOverlay) return;
    zOverlay.classList.add('open');
    zOverlay.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';
    // Set min date to tomorrow
    const d = new Date(); d.setDate(d.getDate() + 1);
    const zDate = document.getElementById('zDate');
    if (zDate) { zDate.min = d.toISOString().split('T')[0]; zDate.value = ''; }
    // Reset state
    if (zForm)    { zForm.style.display    = ''; }
    if (zSuccess) { zSuccess.style.display = 'none'; }
    zSubmit && (zSubmit.disabled = false, zSubmit.textContent = 'Confirm Booking →');
    ['zName','zEmail','zMsg'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  }

  function closeZoom() {
    if (!zOverlay) return;
    zOverlay.classList.remove('open');
    zOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('#openZoom').forEach(b => b.addEventListener('click', openZoom));
  zClose?.addEventListener('click', closeZoom);
  zSuccClose?.addEventListener('click', closeZoom);
  zOverlay?.addEventListener('click', e => { if (e.target === zOverlay) closeZoom(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeZoom(); });

  zSubmit?.addEventListener('click', async () => {
    const name  = document.getElementById('zName')?.value.trim()  || '';
    const email = document.getElementById('zEmail')?.value.trim() || '';
    const date  = document.getElementById('zDate')?.value          || '';
    const time  = document.getElementById('zTime')?.value          || '';
    const msg   = document.getElementById('zMsg')?.value.trim()   || '';

    function showErr(m) {
      document.querySelector('.zoom-err')?.remove();
      const p = Object.assign(document.createElement('p'), {
        className: 'zoom-err',
        textContent: m,
      });
      p.style.cssText = 'color:#f87171;font-size:.8rem;padding:8px 12px;background:rgba(248,113,113,.1);border:1px solid rgba(248,113,113,.25);border-radius:8px;margin:0;';
      zSubmit.insertAdjacentElement('beforebegin', p);
      setTimeout(() => p.remove(), 4000);
    }

    if (!name)  { showErr('Please enter your name.');         return; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showErr('Please enter a valid email address.'); return; }
    if (!date)  { showErr('Please select a preferred date.'); return; }

    zSubmit.disabled = true;
    zSubmit.textContent = '⏳ Sending...';

    let sent = false;

    // Try Formspree (replace ID with your own from formspree.io — free tier)
    try {
      const res = await fetch('https://formspree.io/f/xpwqgvnz', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, date, time, message: msg || 'General enquiry', _subject: `Zoom Call — ${name}`, _replyto: email }),
      });
      if (res.ok) sent = true;
    } catch(_) {}

    // Mailto fallback (opens email client via hidden iframe, no page navigation)
    if (!sent) {
      const sub  = encodeURIComponent(`Zoom Call Booking — ${name}`);
      const body = encodeURIComponent(`Hi Anchal,\n\nName: ${name}\nEmail: ${email}\nDate: ${date}\nTime: ${time}\n\nTopic: ${msg || 'General enquiry'}\n\nPlease send me the Zoom link.\n\nThank you!`);
      const href = `mailto:anchalp4363@gmail.com?subject=${sub}&body=${body}`;
      try {
        const iframe = document.createElement('iframe');
        iframe.style.cssText = 'display:none;position:absolute;width:0;height:0;';
        document.body.appendChild(iframe);
        iframe.contentWindow.location.href = href;
        setTimeout(() => { try { document.body.removeChild(iframe); } catch(_){} }, 3000);
      } catch(_) {
        window.open(href, '_blank', 'noopener,noreferrer');
      }
      sent = true;
    }

    setTimeout(() => {
      if (zForm)    zForm.style.display    = 'none';
      if (zSuccess) zSuccess.style.display = 'block';
      const ec = document.getElementById('zEmailConfirm');
      if (ec) ec.textContent = email;
      zSubmit.disabled = false;
      zSubmit.textContent = 'Confirm Booking →';
    }, 600);
  });

});

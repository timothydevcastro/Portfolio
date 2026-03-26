import React, { useEffect, useRef } from 'react';
import './ContactDevFinal.css';

const ContactDevFinal: React.FC = () => {
  const wrapperRef  = useRef<HTMLDivElement>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const headingRef  = useRef<HTMLHeadingElement>(null);
  const sectionRef  = useRef<HTMLElement>(null);
  const tickerRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper  = wrapperRef.current;
    const canvas   = canvasRef.current;
    const heading  = headingRef.current;
    const section  = sectionRef.current;
    const ticker   = tickerRef.current;
    if (!wrapper || !canvas || !heading || !section || !ticker) return;

    // (Scroll progress bar is now global in App.tsx)

    // ── REVEAL ──
    const revealObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); }
        else { e.target.classList.remove('visible'); }
      });
    }, { threshold: 0.08 });
    wrapper.querySelectorAll('.ct-reveal').forEach(el => revealObs.observe(el));

    // ── MATRIX RAIN ──
    const ctx = canvas.getContext('2d')!;
    const chars = '01{}[]=>()</>;:const let return import export function async await'.split('');
    let cols: number, drops: number[];
    let matrixInterval: ReturnType<typeof setInterval>;

    function resizeMatrix() {
      canvas!.width  = window.innerWidth;
      canvas!.height = window.innerHeight;
      cols  = Math.floor(canvas!.width / 22);
      drops = Array(cols).fill(0).map(() => Math.random() * -canvas!.height / 14);
    }
    resizeMatrix();
    const onResize = () => resizeMatrix();
    window.addEventListener('resize', onResize);

    matrixInterval = setInterval(() => {
      ctx.fillStyle = 'rgba(247,250,247,0.06)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#16a34a';
      ctx.font = '13px JetBrains Mono, monospace';
      drops.forEach((y, i) => {
        const ch = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(ch, i * 22, y * 14);
        if (y * 14 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 0.4;
      });
    }, 55);

    // ── TYPEWRITER HEADING ──
    function typeWriter() {
      const lines = ['Open to', 'opportunities'];
      const isGreen = [false, true];
      let li = 0, ci = 0;

      function tick() {
        const line = lines[li];
        ci++;
        let built = '';
        for (let i = 0; i <= li; i++) {
          const text = i < li ? lines[i] : lines[i].slice(0, i === li ? ci : lines[i].length);
          const cls = isGreen[i] ? 'green' : '';
          built += `<span class="${cls}">${text}</span>`;
          if (i < li) built += '<br>';
        }
        heading!.innerHTML = built + '<span class="tw-cursor"></span>';
        if (ci < line.length) {
          setTimeout(tick, 75);
        } else if (li < lines.length - 1) {
          li++; ci = 0;
          setTimeout(() => { heading!.innerHTML += '<br>'; setTimeout(tick, 120); }, 300);
        }
      }
      setTimeout(tick, 600);
    }

    // ── COMPILE-IN ROWS ──
    function compileRows() {
      const rows = wrapper!.querySelectorAll('.contact-row');
      rows.forEach((row, idx) => {
        const el = row as HTMLElement;
        const val = el.dataset.value || '';
        const sub = el.dataset.sub   || '';
        const valEl = el.querySelector('.row-value') as HTMLElement;
        const subEl = el.querySelector('.row-sub')   as HTMLElement;

        setTimeout(() => {
          el.classList.add('compiled');
          let i = 0;
          const typeVal = setInterval(() => {
            valEl.textContent = val.slice(0, i) + (i < val.length ? '_' : '');
            i++;
            if (i > val.length) { valEl.textContent = val; clearInterval(typeVal); }
          }, 28);
          setTimeout(() => { subEl.textContent = sub; }, val.length * 28 + 100);
        }, 400 + idx * 180);
      });
    }

    let sectionTriggered = false;
    const sectionObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          if (!sectionTriggered) {
            sectionTriggered = true;
            typeWriter();
            compileRows();
          }
        } else {
          // Reset so animations replay on next visit
          sectionTriggered = false;
          if (heading) heading.innerHTML = '<span class="tw-cursor"></span>';
          wrapper!.querySelectorAll('.contact-row').forEach(row => {
            const el = row as HTMLElement;
            el.classList.remove('compiled');
            const valEl = el.querySelector('.row-value') as HTMLElement;
            const subEl = el.querySelector('.row-sub') as HTMLElement;
            if (valEl) valEl.textContent = '';
            if (subEl) subEl.textContent = '';
          });
        }
      });
    }, { threshold: 0.1 });
    sectionObs.observe(section);

    return () => {
      window.removeEventListener('resize', onResize);
      clearInterval(matrixInterval);
      revealObs.disconnect();
      sectionObs.disconnect();
    };
  }, []);

  return (
    <div className="contact-wrapper" ref={wrapperRef} id="contact">
      <canvas id="contact-matrix-canvas" ref={canvasRef}></canvas>

      <section className="ct-section" ref={sectionRef}>

        {/* LEFT */}
        <div className="ct-left ct-reveal">
          <div className="ct-section-tag">// Contact</div>
          <h1 className="ct-heading" ref={headingRef}><span className="tw-cursor"></span></h1>
          <div className="ct-avail-badge">
            <div className="radar-wrap">
              <div className="radar-ring"></div>
              <div className="radar-ring radar-ring2"></div>
              <div className="radar-dot"></div>
            </div>
            Open to internship opportunities
          </div>
          <p className="ct-left-body">I'm open to internships, collaborations, and opportunities where I can learn, contribute, and build purposeful systems that create real impact.</p>
          <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
            <a href="mailto:timothydecastro.dev@gmail.com" className="ct-btn-primary">
              Start a conversation <span className="arr">→</span>
            </a>
            <a href="#" className="ct-btn-ghost">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="12" y1="18" x2="12" y2="12"/>
                <polyline points="9 15 12 18 15 15"/>
              </svg>
              Download Resume <span className="arr">↓</span>
            </a>
          </div>
        </div>

        {/* RIGHT */}
        <div className="ct-right ct-reveal">

          <a href="mailto:timothydecastro.dev@gmail.com" className="contact-row" data-label="EMAIL" data-value="timothydecastro.dev@gmail.com" data-sub="Best for internship and project inquiries">
            <div className="row-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/>
              </svg>
            </div>
            <div className="row-body">
              <div className="row-top"><span className="row-label">EMAIL</span><div className="row-divider"></div><span className="row-value"></span></div>
              <span className="row-sub"></span>
            </div>
            <span className="row-arrow">→</span>
          </a>

          <a href="https://github.com/timothydevcastro" target="_blank" rel="noreferrer" className="contact-row" data-label="GITHUB" data-value="timothydevcastro" data-sub="View code and projects">
            <div className="row-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 00-.9-2.4c3-.3 6.2-1.5 6.2-6.8a5.3 5.3 0 00-1.4-3.7 5 5 0 00-.1-3.6s-1.2-.4-3.8 1.4a13 13 0 00-7 0C6.4 1.7 5.2 2.1 5.2 2.1a5 5 0 00-.1 3.6A5.3 5.3 0 003.7 9.1c0 5.3 3.2 6.5 6.2 6.8a3.4 3.4 0 00-.9 2.4V22"/>
              </svg>
            </div>
            <div className="row-body">
              <div className="row-top"><span className="row-label">GITHUB</span><div className="row-divider"></div><span className="row-value"></span></div>
              <span className="row-sub"></span>
            </div>
            <span className="row-arrow">→</span>
          </a>

          <a href="https://linkedin.com/in/timothydevcastro" target="_blank" rel="noreferrer" className="contact-row" data-label="LINKEDIN" data-value="timothydevcastro" data-sub="Professional connections">
            <div className="row-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/>
                <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
              </svg>
            </div>
            <div className="row-body">
              <div className="row-top"><span className="row-label">LINKEDIN</span><div className="row-divider"></div><span className="row-value"></span></div>
              <span className="row-sub"></span>
            </div>
            <span className="row-arrow">→</span>
          </a>

          <a href="#" className="contact-row" data-label="RESUME / CV" data-value="Download Resume" data-sub="Education, experience, and achievements">
            <div className="row-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="12" y1="18" x2="12" y2="12"/>
                <polyline points="9 15 12 18 15 15"/>
              </svg>
            </div>
            <div className="row-body">
              <div className="row-top"><span className="row-label">RESUME / CV</span><div className="row-divider"></div><span className="row-value"></span></div>
              <span className="row-sub"></span>
            </div>
            <span className="row-arrow">↓</span>
          </a>

          <div className="contact-row static" data-label="LOCATION" data-value="Imus, Cavite · Philippines" data-sub="Open to remote or on-site opportunities">
            <div className="row-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div className="row-body">
              <div className="row-top"><span className="row-label">LOCATION</span><div className="row-divider"></div><span className="row-value"></span></div>
              <span className="row-sub"></span>
            </div>
          </div>

        </div>
      </section>

      {/* TICKER */}
      <div className="ticker-strip ct-reveal" ref={tickerRef}>
        <div className="ticker-track">
          <span className="ticker-item"><span className="slash">//</span> seeking internship opportunities in software development</span>
          <span className="ticker-item ticker-sep">◆</span>
          <span className="ticker-item">open to fullstack, AI/ML, and mobile development roles</span>
          <span className="ticker-item ticker-sep">◆</span>
          <span className="ticker-item"><span className="slash">//</span> based in Philippines · remote friendly</span>
          <span className="ticker-item ticker-sep">◆</span>
          <span className="ticker-item">timothydecastro.dev@gmail.com</span>
          <span className="ticker-item ticker-sep">◆</span>
          <span className="ticker-item"><span className="slash">//</span> seeking internship opportunities in software development</span>
          <span className="ticker-item ticker-sep">◆</span>
          <span className="ticker-item">open to fullstack, AI/ML, and mobile development roles</span>
          <span className="ticker-item ticker-sep">◆</span>
          <span className="ticker-item"><span className="slash">//</span> based in Philippines · remote friendly</span>
          <span className="ticker-item ticker-sep">◆</span>
          <span className="ticker-item">timothydecastro.dev@gmail.com</span>
          <span className="ticker-item ticker-sep">◆</span>
        </div>
      </div>
    </div>
  );
};

export default ContactDevFinal;

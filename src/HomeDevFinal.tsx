import React, { useEffect, useRef } from 'react';
import './HomeDevFinal.css';
import homeImage from './assets/home_image.png';
import ResumePDF from './assets/De_Castro_Resume.pdf';

const HomeDevFinal: React.FC = () => {
  const rightRef = useRef<HTMLDivElement>(null);
  const pillsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const rightEl = rightRef.current;
    if (!rightEl) return;

    function getRightBounds() {
      if (!rightEl) return { w: 0, h: 0 };
      const r = rightEl.getBoundingClientRect();
      return { w: r.width, h: r.height };
    }

    function randomBetween(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const timeouts: ReturnType<typeof setTimeout>[] = [];

    // Each pill gets its own independent fade in/out cycle in a dedicated vertical zone
    function animatePill(pill: HTMLDivElement, index: number) {
      const { w, h } = getRightBounds();

      // Divide the right panel into 5 vertical zones to prevent stacking
      const totalPills = 5;
      const zoneHeight = h / totalPills;
      
      const pillW = 160;
      const pillH = 44;
      
      const yMin = index * zoneHeight;
      // padding inside the zone so it doesn't clip the edges
      const yMax = Math.max(yMin + 10, yMin + zoneHeight - pillH);

      // Pick random X anywhere, random Y within its dedicated zone
      const x = randomBetween(0, Math.max(w - pillW, 20));
      const y = randomBetween(yMin, yMax);

      // Place it
      pill.style.left = x + 'px';
      pill.style.top = y + 'px';

      // Fade in
      pill.style.opacity = '1';
      pill.style.transform = 'translateY(0px)';

      // Stay visible for longer (4.5 to 7 seconds)
      const stayDuration = randomBetween(4500, 7000);

      const t1 = setTimeout(() => {
        pill.style.opacity = '0';
        pill.style.transform = 'translateY(-8px)';

        // Wait before reappearing (1.5 to 3.5 seconds)
        const waitDuration = randomBetween(1500, 3500);
        const t2 = setTimeout(() => animatePill(pill, index), waitDuration);
        timeouts.push(t2);
      }, stayDuration);
      timeouts.push(t1);
    }

    // Stagger the initial start of each pill
    pillsRef.current.forEach((pill, i) => {
      if (!pill) return;
      const t = setTimeout(() => animatePill(pill, i), i * 800 + 400);
      timeouts.push(t);
    });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="home-wrapper" id="home">
      <div className="glow"></div>

      {/* STAGE */}
      <div className="stage">
        {/* LEFT */}
        <div className="home-left">
          <div className="section-tag">// Intro</div>

          <h1 className="name">Timothy<br />De Castro</h1>

          <div className="role-line">
            <span className="kw">role</span>
            <span style={{ color: "var(--muted)" }}>: </span>
            <span className="str">"CS Student @ Intelligent Systems"</span>
          </div>

          <p className="bio">Building end-to-end systems that turn ideas into working solutions, combining full-stack development with applied AI.</p>

          <div className="actions">
            <button className="btn-primary" onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>View Projects</button>
            <a href={ResumePDF} target="_blank" rel="noopener noreferrer" className="btn-ghost">Resume <span className="btn-arrow">↗</span></a>
            <div className="popup-container">
              <button className="btn-ghost">Connect() <span className="btn-arrow">→</span></button>
              <div className="popup-menu">
                <a href="https://github.com/timothydevcastro" target="_blank" rel="noopener noreferrer" className="popup-link">
                  <svg className="popup-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
                  GitHub
                </a>
                <a href="https://www.linkedin.com/in/timothydevcastro/" target="_blank" rel="noopener noreferrer" className="popup-link">
                  <svg className="popup-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

          {/* terminal info card */}
          <div className="info-card">
            <div className="info-card-bar">
              <div className="dot r"></div><div className="dot y"></div><div className="dot g"></div>
              <span className="bar-title">dev.config.json</span>
            </div>
            <div className="info-card-body">
              <div className="info-row">
                <span className="info-key">status</span>
                <span className="info-sep">:</span>
                <span className="info-val"><span className="pulse"></span>open_to_work</span>
              </div>
              <div className="info-row">
                <span className="info-key">location</span>
                <span className="info-sep">:</span>
                <span className="info-val blue">"Cavite, PH"</span>
              </div>
              <div className="info-row">
                <span className="info-key">focus</span>
                <span className="info-sep">:</span>
                <span className="info-val">"AI + Full-Stack"</span>
              </div>
              <div className="info-row">
                <span className="info-key">coffee</span>
                <span className="info-sep">:</span>
                <span className="info-val blue">required <span style={{ color: "var(--muted)" }}>// always</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER AVATAR */}
        <div className="center">
          <img src={homeImage} alt="Timothy" className="avatar-img" />
        </div>

        {/* RIGHT PILLS */}
        <div className="home-right" ref={rightRef}>
          <div className="pill" ref={(el) => { if (el) pillsRef.current[0] = el; }}>
            <div className="pill-dot"></div>
            LEADER MINDSET
          </div>
          <div className="pill" ref={(el) => { if (el) pillsRef.current[1] = el; }}>
            <div className="pill-dot"></div>
            PYTHON LOVER
          </div>
          <div className="pill" ref={(el) => { if (el) pillsRef.current[2] = el; }}>
            <div className="pill-dot"></div>
            INNOVATIVE
          </div>
          <div className="pill" ref={(el) => { if (el) pillsRef.current[3] = el; }}>
            <div className="pill-dot"></div>
            FAST LEARNER
          </div>
          <div className="pill" ref={(el) => { if (el) pillsRef.current[4] = el; }}>
            <div className="pill-dot"></div>
            PURPOSE DRIVEN
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeDevFinal;

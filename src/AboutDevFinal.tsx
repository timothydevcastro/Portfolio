import React, { useEffect, useRef } from 'react';
import './AboutDevFinal.css';

const AboutDevFinal: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ── SCROLL REVEAL ──
    const reveals = container.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
        } else {
          e.target.classList.remove('visible');
        }
      });
    }, { threshold: 0.15 });
    reveals.forEach(el => observer.observe(el));

    // ── COUNT UP NUMBERS ──
    function countUp(el: HTMLElement) {
      const target = parseInt(el.dataset.target || '0', 10);
      const duration = 1200;
      const steps = 40;
      const increment = target / steps;
      let current = 0;
      el.textContent = '0';
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          el.textContent = target + '+';
          clearInterval(timer);
        } else {
          el.textContent = Math.floor(current).toString();
        }
      }, duration / steps);
    }

    const statNums = container.querySelectorAll('.stat-num') as NodeListOf<HTMLElement>;
    let statsVisible = false;

    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && !statsVisible) {
          statsVisible = true;
          // Trigger once, no re-looping!
          statNums.forEach((el, i) => setTimeout(() => countUp(el as HTMLElement), i * 150));
        }
      });
    }, { threshold: 0.5 });
    statNums.forEach(el => statsObserver.observe(el));

    return () => {
      observer.disconnect();
      statsObserver.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="about-wrapper" id="about">
      <div className="glow-orb"></div>

      <section className="about-section">
        {/* LEFT / TOP NARRATIVE */}
        <div className="about-left">
          <div className="section-tag reveal">// About</div>

          <h1 className="heading reveal">
            Building systems<br />
            <span className="green">with purpose.</span>
          </h1>

          <div className="bio-container reveal">
            <p className="bio-editorial">
              I'm a software developer specializing in <span className="highlight">Intelligent Systems</span>. 
              I build end-to-end solutions that turn ideas into working software, seamlessly combining full-stack development with applied AI.
            </p>
            <p className="bio-editorial">
              I care deeply about creating practical tools that reduce manual work, improve workflows, and produce real-world, measurable impact for the people who use them.
            </p>
          </div>

          <div className="stats-row reveal">
            <div className="stat">
              <span className="stat-num" data-target="4">0</span>
              <span className="stat-label">Projects</span>
            </div>
            <div className="stat">
              <span className="stat-num" data-target="4">0</span>
              <span className="stat-label">Years exp.</span>
            </div>
            <div className="stat">
              <span className="stat-num" data-target="16">0</span>
              <span className="stat-label">Tech stack</span>
            </div>
          </div>
        </div>

        {/* RIGHT / CHARACTERISTICS */}
        <div className="about-right">
          <div className="traits-grid">
            <div className="trait-card reveal" style={{ transitionDelay: '0.1s' }}>
              <div className="trait-icon">💡</div>
              <h3 className="trait-title">Innovative Problem Solver</h3>
              <p className="trait-desc">Taking unclear ideas and transforming them into working systems, iterating until they are reliable.</p>
            </div>
            
            <div className="trait-card reveal" style={{ transitionDelay: '0.2s' }}>
              <div className="trait-icon">⚡</div>
              <h3 className="trait-title">Fast Learner</h3>
              <p className="trait-desc">Adapting quickly to new tools, languages, and frameworks by learning directly through building.</p>
            </div>
            
            <div className="trait-card reveal" style={{ transitionDelay: '0.3s' }}>
              <div className="trait-icon">⚙️</div>
              <h3 className="trait-title">Quality-Minded</h3>
              <p className="trait-desc">Prioritizing clean project structure, readable codebases, and robust system behavior.</p>
            </div>

            <div className="trait-card reveal" style={{ transitionDelay: '0.4s' }}>
              <div className="trait-icon">🤝</div>
              <h3 className="trait-title">Collaborative</h3>
              <p className="trait-desc">Communicating progress, aligning early with teams, and contributing consistently to shared goals.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutDevFinal;

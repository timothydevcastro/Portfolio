import React, { useEffect, useRef } from 'react';
import './ProjectsDevFinal.css';
import KuCognitionImg from './assets/KuCognition_Image.jpg';
import SupplySenseImg from './assets/Suppliesense_Image.jpg';
import DutyTrackerImg from './assets/DutyTracker_Image.jpg';

interface ProjectDef {
  colors: string[];
  shape: 'organic' | 'grid' | 'lines';
}

const PROJECTS: ProjectDef[] = [
  { colors: ['#16a34a', '#4ade80', '#7c3aed', '#a78bfa'], shape: 'organic' },
  { colors: ['#1d4ed8', '#60a5fa', '#16a34a', '#34d399'], shape: 'grid'    },
  { colors: ['#d97706', '#fbbf24', '#16a34a', '#4ade80'], shape: 'lines'   },
];

function drawPattern(canvas: HTMLCanvasElement, project: ProjectDef) {
  const W = canvas.offsetWidth  || canvas.parentElement!.offsetWidth;
  const H = canvas.offsetHeight || canvas.parentElement!.offsetHeight;
  canvas.width  = W * devicePixelRatio;
  canvas.height = H * devicePixelRatio;
  const ctx = canvas.getContext('2d')!;
  ctx.scale(devicePixelRatio, devicePixelRatio);
  const { colors, shape } = project;
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, colors[0] + '18');
  bg.addColorStop(1, colors[1] + '10');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  if (shape === 'organic') {
    for (let i = 0; i < 12; i++) {
      const x = (Math.sin(i * 1.3) * 0.5 + 0.5) * W;
      const y = (Math.cos(i * 0.9) * 0.5 + 0.5) * H;
      const r = 20 + i * 14;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.strokeStyle = colors[i % colors.length] + '30';
      ctx.lineWidth = 1; ctx.stroke();
    }
    const grd = ctx.createRadialGradient(W*.5,H*.5,0,W*.5,H*.5,H*.6);
    grd.addColorStop(0, colors[0]+'22'); grd.addColorStop(1,'transparent');
    ctx.fillStyle = grd; ctx.fillRect(0,0,W,H);
    for (let i=0;i<30;i++){
      const x=Math.random()*W, y=Math.random()*H;
      ctx.beginPath(); ctx.arc(x,y,1.5,0,Math.PI*2);
      ctx.fillStyle=colors[i%colors.length]+'55'; ctx.fill();
    }
  }
  if (shape === 'grid') {
    const step=28;
    ctx.strokeStyle=colors[0]+'20'; ctx.lineWidth=0.8;
    for(let x=0;x<=W;x+=step){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for(let y=0;y<=H;y+=step){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
    for(let i=0;i<18;i++){
      const col=i%Math.floor(W/step), row=i%Math.floor(H/step);
      ctx.fillStyle=colors[i%colors.length]+'14';
      ctx.fillRect(col*step+1,row*step+1,step-2,step-2);
    }
    ctx.beginPath(); ctx.moveTo(W*.3,0); ctx.lineTo(W,H*.7);
    ctx.strokeStyle=colors[1]+'30'; ctx.lineWidth=1.5; ctx.stroke();
  }
  if (shape === 'lines') {
    for(let i=0;i<16;i++){
      const y=(i/16)*H+8;
      const len=(0.3+Math.sin(i*.7)*.4)*W;
      const x0=(Math.cos(i*1.1)*.2+.1)*W;
      ctx.beginPath(); ctx.moveTo(x0,y); ctx.lineTo(x0+len,y);
      ctx.strokeStyle=colors[i%colors.length]+(i%3===0?'40':'20');
      ctx.lineWidth=i%4===0?1.5:.8; ctx.stroke();
    }
    ctx.beginPath(); ctx.arc(W*.8,H*.5,H*.35,-Math.PI*.5,Math.PI*.3);
    ctx.strokeStyle=colors[0]+'35'; ctx.lineWidth=2; ctx.stroke();
  }
}

const ProjectsDevFinal: React.FC = () => {
  const wrapperRef   = useRef<HTMLDivElement>(null);
  const headerRowRef = useRef<HTMLDivElement>(null);
  const canvasRefs   = [
    useRef<HTMLCanvasElement>(null),
    useRef<HTMLCanvasElement>(null),
    useRef<HTMLCanvasElement>(null),
  ];
  const cardRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  useEffect(() => {
    const headerRow = headerRowRef.current;
    if (!headerRow) return;

    // header reveal
    const headerObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
        else e.target.classList.remove('visible');
      });
    }, { threshold: 0.1 });
    headerObs.observe(headerRow);

    // card reveal + canvas draw — UNOBSERVE after first reveal so accordion resize
    // can't accidentally remove the `visible` class
    const patternObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const card = e.target as HTMLElement;
          card.classList.add('visible');
          const idx = parseInt(card.dataset.project || '0', 10);
          const cv = canvasRefs[idx].current;
          if (cv) setTimeout(() => drawPattern(cv, PROJECTS[idx]), 80);
          patternObs.unobserve(card); // fire once only
        }
      });
    }, { threshold: 0.05 });
    cardRefs.forEach(ref => { if (ref.current) patternObs.observe(ref.current); });

    // resize — redraw canvases
    const onResize = () => {
      canvasRefs.forEach((ref, idx) => {
        if (ref.current) drawPattern(ref.current, PROJECTS[idx]);
      });
    };
    window.addEventListener('resize', onResize);

    // ── ACCORDION via pure DOM (no React state = no re-render = no flicker) ──
    const btns = (wrapperRef.current ?? document).querySelectorAll<HTMLButtonElement>('.proj-expand-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const card     = btn.closest<HTMLElement>('.proj-card')!;
        const panel    = card.querySelector<HTMLElement>('.proj-accordion')!;
        const isOpen   = panel.classList.contains('open');

        // collapse all other cards first
        (wrapperRef.current ?? document).querySelectorAll<HTMLElement>('.proj-accordion.open').forEach(p => {
          p.classList.remove('open');
          const b = p.closest('.proj-card')?.querySelector<HTMLButtonElement>('.proj-expand-btn');
          if (b) b.textContent = '+ View Details';
        });

        // toggle this one
        if (!isOpen) {
          panel.classList.add('open');
          btn.textContent = '− Hide Details';
        }
      });
    });

    return () => {
      window.removeEventListener('resize', onResize);
      headerObs.disconnect();
      patternObs.disconnect();
    };
  }, []);

  return (
    <div className="projects-wrapper" ref={wrapperRef} id="projects">
      <section className="proj-section">
        <div className="proj-header-row reveal" ref={headerRowRef}>
          <div>
            <div className="proj-section-tag">// Projects</div>
            <h1 className="proj-heading">Featured <span className="green">work</span></h1>
          </div>
          <a href="#" className="proj-see-all">SEE_ALL_PROJECTS() <span className="proj-see-all-arrow">→</span></a>
        </div>

        <div className="projects-grid">

          {/* 01 KuCognition — FEATURED */}
          <div className="proj-card featured reveal" data-project="0" ref={cardRefs[0]}>
            <div className="proj-card-visual">
              <canvas ref={canvasRefs[0]}></canvas>
              <img src={KuCognitionImg} alt="KuCognition" className="proj-card-img" />
              <span className="proj-card-num">01</span>
              <span className="proj-card-status status-live">● Live</span>
            </div>
            <div className="proj-card-body">
              <div className="proj-card-title">KuCognition</div>
              <div className="proj-impact-line">Classifies 8 nail conditions from ~16,000 images</div>
              <p className="proj-card-summary">An end-to-end mobile app that identifies early visual indicators of systemic diseases through nail image analysis — powered by a CNN trained on 16,000 clinical images.</p>
              <div className="proj-accordion">
                <ul className="proj-detail-list">
                  <li><strong>Deep Learning Core:</strong> EfficientNet-B3 CNN trained on ~16,000 clinically labeled nail images.</li>
                  <li><strong>8-Class Detection:</strong> Clubbing, Beau's Lines, Terry's Nails, Koilonychia, Leukonychia, Onycholysis, and Melanonychia.</li>
                  <li><strong>Conversational AI (KuBot):</strong> NLP-powered chat assistant that explains medical findings in plain, accessible language.</li>
                  <li><strong>Full-Stack Architecture:</strong> Flutter mobile interface, FastAPI inference server, Firebase and Supabase for data.</li>
                </ul>
                <p className="proj-disclaimer">* Designed as an assistive tool for research and health-risk awareness — not a medical diagnostic tool.</p>
                <div className="proj-accordion-links">
                  <a href="https://www.youtube.com/watch?v=OhrWbONUQqk" target="_blank" rel="noreferrer" className="proj-drawer-link primary">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                    Watch Demo
                  </a>
                </div>
              </div>
              <button className="proj-expand-btn">+ View Details</button>
            </div>
            <div className="proj-card-tags">
              <span className="proj-tag">Flutter</span><span className="proj-tag">FastAPI</span>
              <span className="proj-tag">TensorFlow</span><span className="proj-tag">Keras</span>
              <span className="proj-tag">Firebase</span><span className="proj-tag">Supabase</span>
              <span className="proj-tag">NLP</span>
            </div>
          </div>

          {/* 02 SupplySense */}
          <div className="proj-card reveal" data-project="1" ref={cardRefs[1]}>
            <div className="proj-card-visual">
              <canvas ref={canvasRefs[1]}></canvas>
              <img src={SupplySenseImg} alt="SupplySense" className="proj-card-img" />
              <span className="proj-card-num">02</span>
              <span className="proj-card-status status-live">● Live</span>
            </div>
            <div className="proj-card-body">
              <div className="proj-card-title">SupplySense</div>
              <div className="proj-impact-line">Smart reorder logic with role-based access &amp; audit trail</div>
              <p className="proj-card-summary">Full-stack inventory management and reorder planning platform designed for small businesses.</p>
              <div className="proj-accordion">
                <ul className="proj-detail-list">
                  <li><strong>Role-Based Auth:</strong> Secure JWT authentication across Manager and Viewer roles with scoped permissions.</li>
                  <li><strong>Smart ROP Engine:</strong> Calculates reorder points based on lead time, safety stock, and average demand.</li>
                  <li><strong>Audit Trail:</strong> Full history of all stock adjustments and reorder events.</li>
                  <li><strong>Reporting:</strong> Automated CSV export for inventory and reorder reports.</li>
                </ul>
                <div className="proj-accordion-links">
                  <a href="https://suppliesense-frontend.onrender.com/" target="_blank" rel="noreferrer" className="proj-drawer-link primary">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                    View Site
                  </a>
                  <a href="https://github.com/timothydevcastro/suppliesense" target="_blank" rel="noreferrer" className="proj-drawer-link secondary">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 00-.9-2.4c3-.3 6.2-1.5 6.2-6.8a5.3 5.3 0 00-1.4-3.7 5 5 0 00-.1-3.6s-1.2-.4-3.8 1.4a13 13 0 00-7 0C6.4 1.7 5.2 2.1 5.2 2.1a5 5 0 00-.1 3.6A5.3 5.3 0 003.7 9.1c0 5.3 3.2 6.5 6.2 6.8a3.4 3.4 0 00-.9 2.4V22"></path></svg>
                    Source
                  </a>
                </div>
              </div>
              <button className="proj-expand-btn">+ View Details</button>
            </div>
            <div className="proj-card-tags">
              <span className="proj-tag">Next.js</span><span className="proj-tag">React</span>
              <span className="proj-tag">TypeScript</span><span className="proj-tag">FastAPI</span>
              <span className="proj-tag">PostgreSQL</span><span className="proj-tag">JWT</span>
              <span className="proj-tag">Tailwind CSS</span>
            </div>
          </div>

          {/* 03 Duty Hours Tracker */}
          <div className="proj-card reveal" data-project="2" ref={cardRefs[2]}>
            <div className="proj-card-visual">
              <canvas ref={canvasRefs[2]}></canvas>
              <img src={DutyTrackerImg} alt="Duty Hours Tracker" className="proj-card-img" />
              <span className="proj-card-num">03</span>
              <span className="proj-card-status status-live">● Live</span>
            </div>
            <div className="proj-card-body">
              <div className="proj-card-title">Duty Hours Tracker</div>
              <div className="proj-impact-line">Replaces manual spreadsheet tracking for DLSU-D scholars</div>
              <p className="proj-card-summary">Lightweight, zero-infrastructure web app for Financial Aid Scholars of DLSU–Dasmariñas to log and track required duty hours.</p>
              <div className="proj-accordion">
                <ul className="proj-detail-list">
                  <li><strong>Client-Side Storage:</strong> Runs entirely on localStorage — no backend needed.</li>
                  <li><strong>Rule-Based Validation:</strong> Configurable duty schedule validation and automatic hour computation.</li>
                  <li><strong>Event Tracking:</strong> Credit tracking for different event types with printable CSV export.</li>
                </ul>
                <div className="proj-accordion-links">
                  <a href="https://timothydevcastro.github.io/scholar-duty-tracker/" target="_blank" rel="noreferrer" className="proj-drawer-link primary">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                    View Site
                  </a>
                  <a href="https://github.com/timothydevcastro/scholar-duty-tracker" target="_blank" rel="noreferrer" className="proj-drawer-link secondary">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 00-.9-2.4c3-.3 6.2-1.5 6.2-6.8a5.3 5.3 0 00-1.4-3.7 5 5 0 00-.1-3.6s-1.2-.4-3.8 1.4a13 13 0 00-7 0C6.4 1.7 5.2 2.1 5.2 2.1a5 5 0 00-.1 3.6A5.3 5.3 0 003.7 9.1c0 5.3 3.2 6.5 6.2 6.8a3.4 3.4 0 00-.9 2.4V22"></path></svg>
                    Source
                  </a>
                </div>
              </div>
              <button className="proj-expand-btn">+ View Details</button>
            </div>
            <div className="proj-card-tags">
              <span className="proj-tag">HTML5</span><span className="proj-tag">CSS3</span>
              <span className="proj-tag">JavaScript</span><span className="proj-tag">GitHub Pages</span>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default ProjectsDevFinal;

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

  // base gradient bg
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
      const col = colors[i % colors.length];
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.strokeStyle = col + '30';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    const grd = ctx.createRadialGradient(W * 0.5, H * 0.5, 0, W * 0.5, H * 0.5, H * 0.6);
    grd.addColorStop(0, colors[0] + '22');
    grd.addColorStop(1, 'transparent');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * W, y = Math.random() * H;
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = colors[i % colors.length] + '55';
      ctx.fill();
    }
  }

  if (shape === 'grid') {
    const step = 28;
    ctx.strokeStyle = colors[0] + '20';
    ctx.lineWidth = 0.8;
    for (let x = 0; x <= W; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y <= H; y += step) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
    for (let i = 0; i < 18; i++) {
      const col = i % Math.floor(W / step);
      const row = i % Math.floor(H / step);
      ctx.fillStyle = colors[i % colors.length] + '14';
      ctx.fillRect(col * step + 1, row * step + 1, step - 2, step - 2);
    }
    ctx.beginPath();
    ctx.moveTo(W * 0.3, 0); ctx.lineTo(W, H * 0.7);
    ctx.strokeStyle = colors[1] + '30';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  if (shape === 'lines') {
    for (let i = 0; i < 16; i++) {
      const y = (i / 16) * H + 8;
      const len = (0.3 + Math.sin(i * 0.7) * 0.4) * W;
      const x0  = (Math.cos(i * 1.1) * 0.2 + 0.1) * W;
      ctx.beginPath();
      ctx.moveTo(x0, y); ctx.lineTo(x0 + len, y);
      ctx.strokeStyle = colors[i % colors.length] + (i % 3 === 0 ? '40' : '20');
      ctx.lineWidth = i % 4 === 0 ? 1.5 : 0.8;
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(W * 0.8, H * 0.5, H * 0.35, -Math.PI * 0.5, Math.PI * 0.3);
    ctx.strokeStyle = colors[0] + '35';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

const ProjectsDevFinal: React.FC = () => {
  const wrapperRef     = useRef<HTMLDivElement>(null);
  const headerRowRef   = useRef<HTMLDivElement>(null);
  const canvasRefs     = [
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

    // (Scroll progress bar is now global in App.tsx)

    // reveal header row
    const headerObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); }
        else { e.target.classList.remove('visible'); }
      });
    }, { threshold: 0.1 });
    headerObs.observe(headerRow);

    // reveal cards + draw canvases
    const patternObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const card = e.target as HTMLElement;
          card.classList.add('visible');
          const idx = parseInt(card.dataset.project || '0', 10);
          const cv = canvasRefs[idx].current;
          if (cv) setTimeout(() => drawPattern(cv, PROJECTS[idx]), 80);
        } else {
          e.target.classList.remove('visible');
        }
      });
    }, { threshold: 0.1 });

    cardRefs.forEach(ref => { if (ref.current) patternObs.observe(ref.current); });

    // resize — redraw canvases
    const onResize = () => {
      canvasRefs.forEach((ref, idx) => {
        if (ref.current) drawPattern(ref.current, PROJECTS[idx]);
      });
    };
    window.addEventListener('resize', onResize);

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
              <div className="proj-card-desc" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <p>An end-to-end mobile application designed to identify early visual indicators of potential systemic and cardiovascular diseases through nail image analysis.</p>
                <ul style={{ listStyleType: 'disc', paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <li><strong>Deep Learning Core:</strong> Trained a robust Convolutional Neural Network (EfficientNet-B3 architecture) on approximately 16,000 clinically labeled nail images.</li>
                  <li><strong>8-Class Detection:</strong> Accurately identifies conditions like Clubbing, Beau's Lines, Terry's Nails, Koilonychia, Leukonychia, Onycholysis, and Melanonychia.</li>
                  <li><strong>Conversational AI (KuBot):</strong> Integrated an NLP-powered chat assistant to actively guide users through the scanning process and quickly explain medical findings in plain, accessible language.</li>
                  <li><strong>Full-Stack Architecture:</strong> Built the mobile interface in Flutter, the model inference REST API in FastAPI, and managed user data and storage via Firebase and Supabase.</li>
                </ul>
                <p style={{ marginTop: '6px', fontSize: '10.5px', opacity: 0.7, fontStyle: 'italic' }}>
                  * Designed as an assistive tool for research and health-risk awareness—not a medical diagnostic tool.
                </p>
              </div>
            </div>
            <div className="proj-card-tags">
              <span className="proj-tag">Flutter</span><span className="proj-tag">FastAPI</span>
              <span className="proj-tag">TensorFlow</span><span className="proj-tag">Keras</span>
              <span className="proj-tag">Firebase</span><span className="proj-tag">Supabase</span>
              <span className="proj-tag">NLP</span>
            </div>
            <div className="proj-card-drawer">
              <div className="proj-drawer-challenge">
                <strong>The challenge</strong>
                Training a robust CNN on ~16,000 nail images to classify 8 conditions accurately, then making it accessible on mobile with a conversational interface that explains medical findings in plain language.
              </div>
              <div className="proj-drawer-links">
                <a href="https://www.youtube.com/watch?v=OhrWbONUQqk" target="_blank" rel="noreferrer" className="proj-drawer-link primary">Watch Demo ▶</a>
              </div>
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
              <div className="proj-impact-line">Smart reorder logic with role-based access & audit trail</div>
              <p className="proj-card-desc">Full-stack inventory management and reorder planning platform designed for small businesses.</p>
            </div>
            <div className="proj-card-tags">
              <span className="proj-tag">Next.js</span><span className="proj-tag">React</span>
              <span className="proj-tag">TypeScript</span><span className="proj-tag">FastAPI</span>
              <span className="proj-tag">PostgreSQL</span><span className="proj-tag">JWT</span>
              <span className="proj-tag">Tailwind CSS</span>
            </div>
            <div className="proj-card-drawer">
              <div className="proj-drawer-challenge" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <strong>Features & Details</strong>
                <p>Designed a scalable permission model across Manager and Viewer roles with secure JWT authentication. Engineered smart reorder point (ROP) calculations based on lead time, safety stock, and average demand, integrated with real-time stock adjustments, full audit trails, and automated CSV export reporting.</p>
              </div>
              <div className="proj-drawer-links">
                <a href="https://suppliesense-frontend.onrender.com/" target="_blank" rel="noreferrer" className="proj-drawer-link primary">View Site →</a>
                <div className="proj-link-div"></div>
                <a href="https://github.com/timothydevcastro/suppliesense" target="_blank" rel="noreferrer" className="proj-drawer-link secondary">View Source →</a>
              </div>
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
              <p className="proj-card-desc">Web-based duty hours tracking system built for Financial Aid Scholars of DLSU–Dasmariñas.</p>
            </div>
            <div className="proj-card-tags">
              <span className="proj-tag">HTML5</span><span className="proj-tag">CSS3</span>
              <span className="proj-tag">JavaScript</span><span className="proj-tag">GitHub Pages</span>
            </div>
            <div className="proj-card-drawer">
              <div className="proj-drawer-challenge" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <strong>Features & Details</strong>
                <p>Replaces a fragile spreadsheet workflow entirely with a lightweight, zero-infrastructure web app that runs strictly client-side via localStorage API. Built with configurable rule-based validation for duty schedules, automatic hour computation, event credit tracking, and printable CSV record export.</p>
              </div>
              <div className="proj-drawer-links">
                <a href="https://timothydevcastro.github.io/scholar-duty-tracker/" target="_blank" rel="noreferrer" className="proj-drawer-link primary">View Site →</a>
                <div className="proj-link-div"></div>
                <a href="https://github.com/timothydevcastro/scholar-duty-tracker" target="_blank" rel="noreferrer" className="proj-drawer-link secondary">View Source →</a>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default ProjectsDevFinal;

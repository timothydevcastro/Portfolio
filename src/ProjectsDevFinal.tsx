import React, { useEffect, useRef } from 'react';
import './ProjectsDevFinal.css';
import KuCognitionImg from './assets/images/mockup_kucognition.png';
import SupplySenseImg from './assets/images/mockup_supply.png';
import DutyTrackerImg from './assets/images/mockup_dutytracker.png';
import ScanArchiveImg from './assets/images/mockup_scanarchive.png';
import AlumniPortalImg from './assets/images/mockup_alumniportal.png';
import ThesisImg from './assets/images/mockup_thesis.png';

interface ProjectDef {
  colors: string[];
  shape: 'organic' | 'grid' | 'lines';
}

const PROJECTS: ProjectDef[] = [
  { colors: ['#16a34a', '#4ade80', '#7c3aed', '#a78bfa'], shape: 'organic' },
  { colors: ['#1d4ed8', '#60a5fa', '#16a34a', '#34d399'], shape: 'grid'    },
  { colors: ['#d97706', '#fbbf24', '#16a34a', '#4ade80'], shape: 'lines'   },
  { colors: ['#c026d3', '#f472b6', '#3b82f6', '#2dd4bf'], shape: 'organic' },
  { colors: ['#0f172a', '#475569', '#3b82f6', '#38bdf8'], shape: 'lines'   },
  { colors: ['#059669', '#10b981', '#6366f1', '#818cf8'], shape: 'grid'    },
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
    useRef<HTMLCanvasElement>(null),
    useRef<HTMLCanvasElement>(null),
    useRef<HTMLCanvasElement>(null),
  ];
  const cardRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
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
    const onBtnClick = (e: Event) => {
      const btn = e.currentTarget as HTMLButtonElement;
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
    };
    
    btns.forEach(btn => btn.addEventListener('click', onBtnClick));

    return () => {
      window.removeEventListener('resize', onResize);
      headerObs.disconnect();
      patternObs.disconnect();
      btns.forEach(btn => btn.removeEventListener('click', onBtnClick));
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
                  <li><strong>8-Class Detection:</strong> Acral Lentiginous Melanoma, Beau's Lines, Bluish Nail, Clubbing, Healthy Nail, Koilonychia, Onychogryphosis, and Pitting.</li>
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
          
          {/* 02 CICS Alumni Management System — FEATURED */}
          <div className="proj-card featured reveal" data-project="1" ref={cardRefs[1]}>
            <div className="proj-card-visual">
              <canvas ref={canvasRefs[1]}></canvas>
              <img src={AlumniPortalImg} alt="CICS Alumni Management System" className="proj-card-img" />
              <span className="proj-card-num">02</span>
              <span className="proj-card-status status-live">● Serviced</span>
            </div>
            <div className="proj-card-body">
              <div className="proj-card-title">CICS Alumni Management System</div>
              <div className="proj-impact-line">Official management system for DLSU-D CICS Department</div>
              <p className="proj-card-summary">A robust, full-stack application engineered to manage and track the professional trajectories of alumni from the College of Information and Computing Sciences.</p>
              <div className="proj-accordion">
                <ul className="proj-detail-list">
                  <li><strong>Departmental Service:</strong> Custom-built specifically for the CICS department at DLSU-D for real-time record auditing.</li>
                  <li><strong>Google Cloud Integration:</strong> Implemented a high-performance API bridge using Google Apps Script to synchronize data with secure departmental spreadsheets.</li>
                  <li><strong>Administrative Portal:</strong> Developed a protected dashboard for faculty featuring batch filtering, course tracking (IT/CS), and employment auditing.</li>
                  <li><strong>Next.js 14 Architecture:</strong> Utilized App Router and Server Components for secure, high-speed data fetching.</li>
                </ul>
                <p className="proj-disclaimer">* Deployment links and source code are restricted due to data confidentiality and departmental security protocols.</p>
              </div>
              <button className="proj-expand-btn">+ View Details</button>
            </div>
            <div className="proj-card-tags">
              <span className="proj-tag">Next.js 14</span><span className="proj-tag">TypeScript</span>
              <span className="proj-tag">Tailwind CSS</span><span className="proj-tag">Google Apps Script</span>
              <span className="proj-tag">Shadcn UI</span>
            </div>
          </div>

          {/* 03 SWAFO Violation Management System — FEATURED */}
          <div className="proj-card featured reveal" data-project="2" ref={cardRefs[2]}>
            <div className="proj-card-visual">
              <canvas ref={canvasRefs[2]}></canvas>
              <img src={ThesisImg} alt="SWAFO Violation Management System" className="proj-card-img" />
              <span className="proj-card-num">03</span>
              <span className="proj-card-status status-wip">◐ CS Thesis</span>
            </div>
            <div className="proj-card-body">
              <div className="proj-card-title">SWAFO Violation Management & AI Analytics</div>
              <div className="proj-impact-line">Algorithmic behavioral monitoring and case escalation for DLSU-D</div>
              <p className="proj-card-summary">A two-module computer science thesis modernizing student discipline. It integrates an AI-based uniform compliance detection pipeline with a highly intelligent, full-stack violation management web portal.</p>
              <div className="proj-accordion">
                <ul className="proj-detail-list">
                  <li><strong>Hybrid Semantic Retrieval:</strong> Built an in-memory vector space engine using Gemini embeddings and Cosine Similarity to map natural language incidents to the 82-rule university handbook, cutting search latency by ~90%.</li>
                  <li><strong>Deterministic Escalation Algorithm:</strong> Developed state-based logic that tracks offense frequency and auto-executes complex, multi-tiered disciplinary escalations per institutional policy.</li>
                  <li><strong>Duplicate Case Detection:</strong> Engineered a temporal thresholding and exact-match algorithm that triggers an interactive human-in-the-loop override to prevent database inflation.</li>
                  <li><strong>Temporal Analytics Aggregation:</strong> Implemented sliding-window time-series aggregation to rank compliance hotspots and drive real-time visualization dashboards.</li>
                </ul>
              </div>
              <button className="proj-expand-btn">+ View Details</button>
            </div>
            <div className="proj-card-tags">
              <span className="proj-tag">React 19</span><span className="proj-tag">Django REST</span>
              <span className="proj-tag">PostgreSQL</span><span className="proj-tag">Gemini Embeddings</span>
              <span className="proj-tag">Computer Vision</span>
            </div>
          </div>

          {/* 04 SupplySense */}
          <div className="proj-card reveal" data-project="3" ref={cardRefs[3]}>
            <div className="proj-card-visual">
              <canvas ref={canvasRefs[3]}></canvas>
              <img src={SupplySenseImg} alt="SupplySense" className="proj-card-img" />
              <span className="proj-card-num">04</span>
              <span className="proj-card-status status-live">● Live</span>
            </div>
            <div className="proj-card-body">
              <div className="proj-card-title">SupplySense</div>
              <div className="proj-impact-line">Smart reorder logic &amp; audit trail</div>
              <p className="proj-card-summary">Full-stack inventory management and reorder planning platform designed for small businesses.</p>
              <div className="proj-accordion">
                <ul className="proj-detail-list">
                  <li><strong>Role-Based Auth:</strong> Secure JWT authentication across Manager and Viewer roles with scoped permissions.</li>
                  <li><strong>Smart ROP Engine:</strong> Calculates reorder points based on lead time, safety stock, and demand.</li>
                  <li><strong>Audit Trail:</strong> Full history of all stock adjustments and reorder events.</li>
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
              <span className="proj-tag">FastAPI</span><span className="proj-tag">PostgreSQL</span>
            </div>
          </div>

          {/* 05 Duty Hours Tracker */}
          <div className="proj-card reveal" data-project="4" ref={cardRefs[4]}>
            <div className="proj-card-visual">
              <canvas ref={canvasRefs[4]}></canvas>
              <img src={DutyTrackerImg} alt="Duty Hours Tracker" className="proj-card-img" />
              <span className="proj-card-num">05</span>
              <span className="proj-card-status status-live">● Live</span>
            </div>
            <div className="proj-card-body">
              <div className="proj-card-title">Duty Hours Tracker</div>
              <div className="proj-impact-line">Replaces manual spreadsheet tracking</div>
              <p className="proj-card-summary">Lightweight, zero-infrastructure web app for Financial Aid Scholars of DLSU-D to log and track required duty hours.</p>
              <div className="proj-accordion">
                <ul className="proj-detail-list">
                  <li><strong>Client-Side Storage:</strong> Runs entirely on localStorage — no backend needed.</li>
                  <li><strong>Rule-Based Validation:</strong> Configurable duty schedule validation and automatic hour computation.</li>
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
              <span className="proj-tag">JavaScript</span>
            </div>
          </div>

          {/* 06 SCAN_ARCHIVE PRO */}
          <div className="proj-card reveal" data-project="5" ref={cardRefs[5]}>
            <div className="proj-card-visual">
              <canvas ref={canvasRefs[5]}></canvas>
              <img src={ScanArchiveImg} alt="SCAN_ARCHIVE PRO" className="proj-card-img" />
              <span className="proj-card-num">06</span>
              <span className="proj-card-status status-live">● Live</span>
            </div>
            <div className="proj-card-body">
              <div className="proj-card-title">SCAN_ARCHIVE PRO</div>
              <div className="proj-impact-line">Sub-second multi-cloud AI object scanner</div>
              <p className="proj-card-summary">A high-fidelity AI object scanner designed to deliver streamlined trivia metadata via Groq LLMs and FLUX imagery. Built with bulletproof fail-safe routing and IndexedDB persistence.</p>
              <div className="proj-accordion">
                <ul className="proj-detail-list">
                  <li><strong>Multi-Cloud Intelligence:</strong> Orchestrated Groq (Llama-3.3) for NLP and Hugging Face (FLUX) for synthesis.</li>
                  <li><strong>Fail-Safe Architecture:</strong> Local simulation fallbacks ensure 100% uptime despite cloud rate-limits.</li>
                  <li><strong>Persisted Sessions:</strong> Utilizes browser-based IndexedDB for keeping scan histories across reloads.</li>
                </ul>
                <div className="proj-accordion-links">
                  <a href="https://scan-archive.vercel.app/" target="_blank" rel="noreferrer" className="proj-drawer-link primary">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                    View Site
                  </a>
                  <a href="https://github.com/timothydevcastro/SCAN_ARCHIVE" target="_blank" rel="noreferrer" className="proj-drawer-link secondary">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 00-.9-2.4c3-.3 6.2-1.5 6.2-6.8a5.3 5.3 0 00-1.4-3.7 5 5 0 00-.1-3.6s-1.2-.4-3.8 1.4a13 13 0 00-7 0C6.4 1.7 5.2 2.1 5.2 2.1a5 5 0 00-.1 3.6A5.3 5.3 0 003.7 9.1c0 5.3 3.2 6.5 6.2 6.8a3.4 3.4 0 00-.9 2.4V22"></path></svg>
                    Source
                  </a>
                </div>
              </div>
              <button className="proj-expand-btn">+ View Details</button>
            </div>
            <div className="proj-card-tags">
              <span className="proj-tag">React</span><span className="proj-tag">Tailwind CSS</span>
              <span className="proj-tag">Groq API</span><span className="proj-tag">IndexedDB</span>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default ProjectsDevFinal;

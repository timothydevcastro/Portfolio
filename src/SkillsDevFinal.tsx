import React, { useEffect, useRef } from 'react';
import './SkillsDevFinal.css';

const CATS = [
  { id: 'fe', label: 'Frontend',   color: '#2563eb', icon: '🖥', angle: -90 },
  { id: 'be', label: 'Backend',    color: '#7c3aed', icon: '⚙',  angle: 0   },
  { id: 'db', label: 'Data/Cloud', color: '#d97706', icon: '🗄',  angle: 90  },
  { id: 'ai', label: 'AI / ML',    color: '#16a34a', icon: '🤖', angle: 180 },
];

const SKILLS = [
  { id: 'flutter',  label: 'Flutter',      cat: 'fe', desc: 'Cross-platform mobile' },
  { id: 'nextjs',   label: 'Next.js',      cat: 'fe', desc: 'React fullstack framework' },
  { id: 'html',     label: 'HTML',         cat: 'fe', desc: 'Markup & structure' },
  { id: 'css',      label: 'CSS',          cat: 'fe', desc: 'Styling & layout' },
  { id: 'js',       label: 'JavaScript',   cat: 'fe', desc: 'Interactive web logic' },
  { id: 'fastapi',  label: 'FastAPI',      cat: 'be', desc: 'Python async API server' },
  { id: 'rest',     label: 'REST APIs',    cat: 'be', desc: 'HTTP API design' },
  { id: 'jwt',      label: 'JWT',          cat: 'be', desc: 'Token-based auth' },
  { id: 'postgres', label: 'PostgreSQL',   cat: 'db', desc: 'Relational database' },
  { id: 'firebase', label: 'Firebase',     cat: 'db', desc: 'Google BaaS' },
  { id: 'supabase', label: 'Supabase',     cat: 'db', desc: 'Open-source Firebase alt' },
  { id: 'mysql',    label: 'MySQL',        cat: 'db', desc: 'Relational database' },
  { id: 'pytorch',  label: 'PyTorch',      cat: 'ai', desc: 'Deep learning framework' },
  { id: 'cv',       label: 'Comp. Vision', cat: 'ai', desc: 'Image & video analysis' },
  { id: 'nlp',      label: 'NLP',          cat: 'ai', desc: 'Language processing' },
  { id: 'sklearn',  label: 'scikit-learn', cat: 'ai', desc: 'Classical ML toolkit' },
];

const CROSS: [string, string][] = [
  ['nextjs','fastapi'],['fastapi','postgres'],['fastapi','supabase'],
  ['jwt','rest'],['pytorch','cv'],['pytorch','nlp'],['flutter','firebase'],
  ['nextjs','supabase'],['sklearn','nlp'],['postgres','mysql'],['rest','fastapi'],
];

function catColor(catId: string) {
  return CATS.find(c => c.id === catId)?.color || '#16a34a';
}

const SkillsDevFinal: React.FC = () => {
  const wrapperRef  = useRef<HTMLDivElement>(null);
  const gcRef       = useRef<HTMLDivElement>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const tooltipRef  = useRef<HTMLDivElement>(null);
  const ttNameRef   = useRef<HTMLDivElement>(null);
  const ttCatRef    = useRef<HTMLDivElement>(null);
  const headerRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const gc     = gcRef.current;
    const canvas = canvasRef.current;
    const tip    = tooltipRef.current;
    const header = headerRef.current;
    if (!gc || !canvas || !tip || !header) return;

    let W = 0, H = 0;
    const positions: Record<string, { x: number; y: number }> = {};
    const nodeEls: Record<string, HTMLDivElement> = {};
    let hoveredSkill: string | null = null;
    let initialized = false;

    // (Scroll progress bar is now global in App.tsx)

    function layout() {
      W = gc!.offsetWidth; H = gc!.offsetHeight;
      const cx = W / 2, cy = H / 2;
      const hubR  = Math.min(W, H) * 0.22;
      const leafR = Math.min(W, H) * 0.155;
      positions['hub'] = { x: cx, y: cy };
      CATS.forEach(cat => {
        const rad = cat.angle * Math.PI / 180;
        const cx2 = cx + Math.cos(rad) * hubR;
        const cy2 = cy + Math.sin(rad) * hubR;
        positions[cat.id] = { x: cx2, y: cy2 };
        const catSkills = SKILLS.filter(s => s.cat === cat.id);
        const count = catSkills.length;
        const perpRad = rad + Math.PI / 2;
        const spreadStep = leafR * 0.72;
        const totalSpread = (count - 1) * spreadStep;
        catSkills.forEach((skill, i) => {
          const offset = i * spreadStep - totalSpread / 2;
          positions[skill.id] = {
            x: cx2 + Math.cos(perpRad) * offset + Math.cos(rad) * leafR * 0.85,
            y: cy2 + Math.sin(perpRad) * offset + Math.sin(rad) * leafR * 0.85,
          };
        });
      });
    }

    function drawEdges() {
      canvas!.width  = W * devicePixelRatio;
      canvas!.height = H * devicePixelRatio;
      const ctx = canvas!.getContext('2d')!;
      ctx.scale(devicePixelRatio, devicePixelRatio);
      ctx.clearRect(0, 0, W, H);

      function line(ax: number, ay: number, bx: number, by: number,
                    color: string, alpha: number, width: number, dashed: boolean) {
        ctx.beginPath();
        ctx.moveTo(ax, ay); ctx.lineTo(bx, by);
        ctx.strokeStyle = color + Math.round(alpha * 255).toString(16).padStart(2, '0');
        ctx.lineWidth = width;
        ctx.setLineDash(dashed ? [4, 7] : []);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      const h = positions['hub'];
      CATS.forEach(cat => {
        const p = positions[cat.id];
        const isHov = hoveredSkill != null && SKILLS.find(s => s.id === hoveredSkill)?.cat === cat.id;
        line(h.x, h.y, p.x, p.y, cat.color, isHov ? 0.65 : 0.28, isHov ? 2 : 1.2, false);
      });
      SKILLS.forEach(skill => {
        const cp  = positions[skill.cat];
        const sp2 = positions[skill.id];
        const col = catColor(skill.cat);
        const isHov  = hoveredSkill === skill.id;
        const isConn = hoveredSkill != null && CROSS.some(([a, b]) =>
          (a === hoveredSkill && b === skill.id) || (b === hoveredSkill && a === skill.id));
        line(cp.x, cp.y, sp2.x, sp2.y, col,
          isHov ? 0.85 : isConn ? 0.6 : 0.38,
          isHov ? 2.0  : isConn ? 1.5 : 1.2, !isHov && !isConn);
      });
      CROSS.forEach(([a, b]) => {
        const pa = positions[a], pb = positions[b];
        if (!pa || !pb) return;
        const isHov = hoveredSkill === a || hoveredSkill === b;
        const colA  = catColor(SKILLS.find(s => s.id === a)?.cat || '');
        line(pa.x, pa.y, pb.x, pb.y, colA, isHov ? 0.55 : 0.0, isHov ? 1.4 : 0.8, false);
      });
    }

    function updateNodeStates() {
      const connected = hoveredSkill
        ? CROSS.filter(([a, b]) => a === hoveredSkill || b === hoveredSkill)
               .flatMap(([a, b]) => [a, b])
               .filter(id => id !== hoveredSkill)
        : [];
      Object.entries(nodeEls).forEach(([id, el]) => {
        el.classList.remove('hovered', 'connected', 'dimmed');
        if (!hoveredSkill) return;
        if (id === hoveredSkill)         el.classList.add('hovered');
        else if (connected.includes(id)) el.classList.add('connected');
        else                             el.classList.add('dimmed');
      });
    }

    function buildNodes() {
      gc!.querySelectorAll('.snode').forEach(e => e.remove());

      const hub = document.createElement('div');
      hub.className = 'snode hub';
      hub.dataset.id = 'hub';
      hub.style.left = positions['hub'].x + 'px';
      hub.style.top  = positions['hub'].y + 'px';
      hub.innerHTML  = `<div class="snode-circle"><span class="hub-initials">TRDC</span></div><div class="snode-label">Timothy De Castro</div>`;
      gc!.appendChild(hub);

      CATS.forEach(cat => {
        const el = document.createElement('div');
        el.className  = 'snode cat-node';
        el.dataset.id = cat.id;
        el.style.color = cat.color;
        el.style.left  = positions[cat.id].x + 'px';
        el.style.top   = positions[cat.id].y + 'px';
        el.innerHTML   = `<div class="snode-circle"><span class="cat-icon">${cat.icon}</span></div><div class="snode-label">${cat.label}</div>`;
        gc!.appendChild(el);
      });

      SKILLS.forEach(skill => {
        const el = document.createElement('div') as HTMLDivElement;
        el.className  = 'snode skill-node';
        el.style.color = catColor(skill.cat);
        el.style.left  = positions[skill.id].x + 'px';
        el.style.top   = positions[skill.id].y + 'px';
        el.dataset.id  = skill.id;
        el.innerHTML   = `<div class="snode-circle"></div><div class="snode-label">${skill.label}</div>`;
        gc!.appendChild(el);
        nodeEls[skill.id] = el;

        el.addEventListener('mouseenter', () => {
          hoveredSkill = skill.id;
          drawEdges(); updateNodeStates();
          if (ttNameRef.current) ttNameRef.current.textContent = skill.label;
          if (ttCatRef.current)  ttCatRef.current.textContent  =
            (CATS.find(c => c.id === skill.cat)?.label || '') + ' · ' + skill.desc;
          const r  = el.getBoundingClientRect();
          const gr = gc!.getBoundingClientRect();
          tip!.style.left      = (r.left - gr.left + r.width / 2) + 'px';
          tip!.style.top       = (r.top  - gr.top  - 46) + 'px';
          tip!.style.transform = 'translateX(-50%)';
          tip!.classList.add('show');
        });
        el.addEventListener('mouseleave', () => {
          hoveredSkill = null;
          drawEdges(); updateNodeStates();
          tip!.classList.remove('show');
        });
      });
    }

    function init() {
      if (initialized) return;
      initialized = true;
      layout(); drawEdges(); buildNodes();
    }

    // reveal — header (one-way: once visible, stays visible so it doesn't
    // fade out when the user scrolls down into the graph on mobile)
    const headerObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          // Small delay so browser paints opacity:0 first,
          // ensuring the CSS transition has something to animate from.
          setTimeout(() => {
            e.target.classList.add('visible');
            wrapperRef.current?.querySelectorAll('.sum-card').forEach((c, i) => {
              setTimeout(() => c.classList.add('visible'), 200 + i * 120);
            });
          }, 80);
          headerObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.05 });
    headerObs.observe(header);

    // reveal — graph
    const gcObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          init();
        } else {
          e.target.classList.remove('visible');
        }
      });
    }, { threshold: 0.15 });
    gcObs.observe(gc);

    // resize
    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        layout(); drawEdges();
        gc!.querySelectorAll('.snode').forEach((el: Element) => {
          const id = (el as HTMLElement).dataset.id;
          if (!id || !positions[id]) return;
          (el as HTMLElement).style.left = positions[id].x + 'px';
          (el as HTMLElement).style.top  = positions[id].y + 'px';
        });
      }, 120);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      headerObs.disconnect();
      gcObs.disconnect();
    };
  }, []);

  return (
    <div className="skills-wrapper" ref={wrapperRef} id="skills">

      <section className="skills-section">
        <div className="skills-header" ref={headerRef}>
          <div className="skills-section-tag">// Skills</div>
          <h1 className="skills-heading">The tools I <span className="green">build with</span></h1>
          <p className="skills-subline">Hover any node on the map to explore connections — or scan the summary for a quick read.</p>
        </div>

        <div className="skills-section-body">
          <div className="summary">
            <div className="sum-card">
              <div className="sum-header">
                <div className="sum-dot"></div>
                <span className="sum-cat">Frontend</span>
                <span className="sum-count">5 skills</span>
              </div>
              <div className="sum-tags">
                <span className="sum-tag">Flutter</span>
                <span className="sum-tag">Next.js</span>
                <span className="sum-tag">HTML</span>
                <span className="sum-tag">CSS</span>
                <span className="sum-tag">JavaScript</span>
              </div>
            </div>

            <div className="sum-card">
              <div className="sum-header">
                <div className="sum-dot"></div>
                <span className="sum-cat">Backend</span>
                <span className="sum-count">3 skills</span>
              </div>
              <div className="sum-tags">
                <span className="sum-tag">FastAPI</span>
                <span className="sum-tag">REST APIs</span>
                <span className="sum-tag">JWT</span>
              </div>
            </div>

            <div className="sum-card">
              <div className="sum-header">
                <div className="sum-dot"></div>
                <span className="sum-cat">Data / Cloud</span>
                <span className="sum-count">4 skills</span>
              </div>
              <div className="sum-tags">
                <span className="sum-tag">PostgreSQL</span>
                <span className="sum-tag">Firebase</span>
                <span className="sum-tag">Supabase</span>
                <span className="sum-tag">MySQL</span>
              </div>
            </div>

            <div className="sum-card">
              <div className="sum-header">
                <div className="sum-dot"></div>
                <span className="sum-cat">AI / ML</span>
                <span className="sum-count">4 skills</span>
              </div>
              <div className="sum-tags">
                <span className="sum-tag">PyTorch</span>
                <span className="sum-tag">Computer Vision</span>
                <span className="sum-tag">NLP</span>
                <span className="sum-tag">scikit-learn</span>
              </div>
            </div>
          </div>

          <div className="graph-container" ref={gcRef}>
            <canvas id="skillmap" ref={canvasRef}></canvas>
            <div className="tooltip" ref={tooltipRef}>
              <div className="tt-name" ref={ttNameRef}></div>
              <div className="tt-cat" ref={ttCatRef}></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SkillsDevFinal;

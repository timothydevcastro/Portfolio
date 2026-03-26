import React, { useEffect, useRef } from 'react';
import './AboutDevFinal.css';

const AboutDevFinal: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ── CURSOR STAGGER — only one blinks at a time, cycles through ──
    const cursors = container.querySelectorAll('.type-cursor') as NodeListOf<HTMLElement>;
    let activeCursor = 0;
    let cursorTimeout: ReturnType<typeof setTimeout>;
    cursors.forEach(c => c.style.opacity = '0');

    function cycleCursor() {
      cursors.forEach(c => {
        c.style.animation = 'none';
        c.style.opacity = '0';
      });
      if (cursors.length > 0) {
        const cur = cursors[activeCursor % cursors.length];
        cur.style.opacity = '1';
        cur.style.animation = 'blink 1s step-end infinite';
        activeCursor++;
      }
      cursorTimeout = setTimeout(cycleCursor, 2200);
    }
    cursorTimeout = setTimeout(cycleCursor, 800);

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
    function countUp(el: HTMLElement, onDone?: () => void) {
      const target = parseInt(el.dataset.target || '0', 10);
      const duration = 1000;
      const steps = 40;
      const increment = target / steps;
      let current = 0;
      el.textContent = '0';
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          el.textContent = target + '+';
          clearInterval(timer);
          if (onDone) onDone();
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
          statNums.forEach((el, i) => setTimeout(() => countUp(el as HTMLElement), i * 200));
        }
      });
    }, { threshold: 0.5 });
    statNums.forEach(el => statsObserver.observe(el));

    // Re-animate numbers every 6 seconds
    const intervalTimer = setInterval(() => {
      if (statsVisible) {
        statNums.forEach((el, i) => {
          setTimeout(() => {
            el.style.transform = 'translateY(-6px)';
            el.style.opacity = '0.3';
            el.style.transition = 'all 0.3s ease';
            setTimeout(() => {
              el.style.transform = 'translateY(0)';
              el.style.opacity = '1';
              countUp(el as HTMLElement);
            }, 300 + i * 100);
          }, i * 150);
        });
      }
    }, 6000);

    // (Scroll progress bar is now global in App.tsx)

    // ── TYPING EFFECT ──
    const snippets = [
      {
        id: 'typed1',
        lines: [
          [{ type:'kw', text:'const' }, { type:'plain', text:' architecture =' }],
          [{ type:'plain', text:'  ' }, { type:'str', text:'"optimized"' }, { type:'plain', text:';' }]
        ]
      },
      {
        id: 'typed2',
        lines: [
          [{ type:'kw', text:'def' }, { type:'plain', text:' ' }, { type:'fn', text:'impact' }, { type:'plain', text:'(code):' }],
          [{ type:'plain', text:'  ' }, { type:'kw', text:'return' }, { type:'plain', text:' ' }, { type:'str', text:'"value"' }]
        ]
      },
      {
        id: 'typed3',
        lines: [
          [{ type:'fn', text:'solve' }, { type:'plain', text:'(challenge)' }],
          [{ type:'plain', text:'  => ' }, { type:'val', text:'solution' }, { type:'plain', text:';' }]
        ]
      },
      {
        id: 'typed4',
        lines: [
          [{ type:'plain', text:'{ ' }, { type:'str', text:'"mode"' }, { type:'plain', text:':' }],
          [{ type:'plain', text:'  ' }, { type:'str', text:'"learning"' }, { type:'plain', text:' }' }]
        ]
      }
    ];

    function renderTyped(el: HTMLElement, snippetDef: any, charIndex: number) {
      const allChars: {ch: string, type: string}[] = [];
      snippetDef.lines.forEach((line: any, li: number) => {
        line.forEach((seg: any) => {
          seg.text.split('').forEach((ch: string) => allChars.push({ ch, type: seg.type }));
        });
        if (li < snippetDef.lines.length - 1) allChars.push({ ch: '\n', type: 'plain' });
      });

      let html = '';
      let i = 0;
      while (i < charIndex && i < allChars.length) {
        const { ch, type } = allChars[i];
        if (ch === '\n') { html += '<br>'; }
        else if (type === 'plain') { html += ch === ' ' ? '&nbsp;' : ch; }
        else { html += `<span class="${type}">${ch === ' ' ? '&nbsp;' : ch}</span>`; }
        i++;
      }
      el.innerHTML = html;
      return allChars.length;
    }

    function typeSnippet(snippetDef: any, delay: number) {
      if (!snippetDef) return;
      const el = container!.querySelector('#' + snippetDef.id) as HTMLElement;
      if (!el) return;
      let charIndex = 0;
      let total = 0;
      setTimeout(() => {
        const timer = setInterval(() => {
          total = renderTyped(el, snippetDef, charIndex);
          charIndex++;
          if (charIndex > total) clearInterval(timer);
        }, 38);
      }, delay);
    }

    // Trigger typing when cards enter viewport
    const typedHistory = new Set<number>();
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const card = e.target;
          const cardsArray = Array.from(container!.querySelectorAll('.code-card'));
          const idx = cardsArray.indexOf(card);
          if (snippets[idx] && !typedHistory.has(idx)) {
            typedHistory.add(idx);
            typeSnippet(snippets[idx], idx * 300);
          }
        } else {
          // Reset the typed output so it replays next time
          const card = e.target as HTMLElement;
          const cardsArray = Array.from(container!.querySelectorAll('.code-card'));
          const idx = cardsArray.indexOf(card);
          typedHistory.delete(idx);
          const typed = card.querySelector('.typed-output') as HTMLElement;
          if (typed) typed.innerHTML = '';
        }
      });
    }, { threshold: 0.4 });
    container!.querySelectorAll('.code-card').forEach((c) => cardObserver.observe(c));

    // ── CARD HOVER TILT ──
    const cards = container.querySelectorAll('.code-card') as NodeListOf<HTMLElement>;
    const handleMouseMove = (e: MouseEvent) => {
      const card = e.currentTarget as HTMLElement;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `translateY(-4px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
      card.style.transition = 'border-color .25s, box-shadow .25s';
    };
    const handleMouseLeave = (e: Event) => {
      const card = e.currentTarget as HTMLElement;
      card.style.transform = '';
      card.style.transition = 'opacity .6s ease, transform .6s ease, border-color .25s, box-shadow .25s';
    };

    cards.forEach(card => {
      card.addEventListener('mousemove', handleMouseMove as any);
      card.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      clearTimeout(cursorTimeout);
      clearInterval(intervalTimer);
      observer.disconnect();
      statsObserver.disconnect();
      cardObserver.disconnect();
      cards.forEach(card => {
        card.removeEventListener('mousemove', handleMouseMove as any);
        card.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  return (
    <div ref={containerRef} className="about-wrapper" id="about">
      <div className="glow-orb"></div>

      <section className="about-section">
        {/* LEFT */}
        <div className="about-left">
          <div className="section-tag reveal">// About</div>

          <h1 className="heading reveal">
            Building systems<br />
            <span className="green">with purpose</span>
          </h1>

          <div className="bio-block reveal">
            <div className="bio-comment">// who i am</div>
            <p className="bio-text">
              I'm a software developer who enjoys building systems that solve real problems and make everyday life more efficient. What drives me is the opportunity to create useful, structured solutions that help people, improve workflows, and bring meaningful impact through technology.
            </p>
          </div>

          <div className="stats-row reveal">
            <div className="stat">
              <span className="stat-num" data-target="12">0</span>
              <span className="stat-label">Projects</span>
            </div>
            <div className="stat">
              <span className="stat-num" data-target="3">0</span>
              <span className="stat-label">Years exp.</span>
            </div>
            <div className="stat">
              <span className="stat-num" data-target="5">0</span>
              <span className="stat-label">Tech stack</span>
            </div>
          </div>
        </div>

        {/* RIGHT CARDS */}
        <div className="about-right">
          <div className="code-card reveal">
            <div className="card-bar">
              <div className="dot r"></div><div className="dot y"></div><div className="dot g"></div>
              <span className="card-filename">SYSTEMS_THINKING.TS</span>
            </div>
            <div className="card-body">
              <div className="card-title">Systems Thinking</div>
              <div className="code-snippet" id="snippet1" data-typed="0">
                <span className="typed-output" id="typed1"></span><span className="type-cursor" id="cur1"></span>
              </div>
              <p className="card-desc">Designing structured solutions that simplify complex processes and improve how people work.</p>
            </div>
          </div>

          <div className="code-card reveal">
            <div className="card-bar">
              <div className="dot r"></div><div className="dot y"></div><div className="dot g"></div>
              <span className="card-filename">PURPOSE_DRIVEN.PY</span>
            </div>
            <div className="card-body">
              <div className="card-title">Purpose-Driven</div>
              <div className="code-snippet" id="snippet2" data-typed="0">
                <span className="typed-output" id="typed2"></span><span className="type-cursor" id="cur2"></span>
              </div>
              <p className="card-desc">Building software with the goal of helping people, supporting communities, and creating practical impact.</p>
            </div>
          </div>

          <div className="code-card reveal">
            <div className="card-bar">
              <div className="dot r"></div><div className="dot y"></div><div className="dot g"></div>
              <span className="card-filename">PROBLEM_SOLVING.JS</span>
            </div>
            <div className="card-body">
              <div className="card-title">Problem Solving</div>
              <div className="code-snippet" id="snippet3" data-typed="0">
                <span className="typed-output" id="typed3"></span><span className="type-cursor" id="cur3"></span>
              </div>
              <p className="card-desc">Turning real-world challenges into useful, efficient, and user-friendly systems.</p>
            </div>
          </div>

          <div className="code-card reveal">
            <div className="card-bar">
              <div className="dot r"></div><div className="dot y"></div><div className="dot g"></div>
              <span className="card-filename">GROWTH.JSON</span>
            </div>
            <div className="card-body">
              <div className="card-title">Continuous Growth</div>
              <div className="code-snippet" id="snippet4" data-typed="0">
                <span className="typed-output" id="typed4"></span><span className="type-cursor" id="cur4"></span>
              </div>
              <p className="card-desc">Always learning through building, refining ideas, and improving through real experience.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutDevFinal;

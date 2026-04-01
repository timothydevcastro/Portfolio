import React, { useEffect, useRef } from 'react';
import './EducationDevFinal.css';

const EducationDevFinal: React.FC = () => {
  const wrapperRef  = useRef<HTMLDivElement>(null);
  const leadRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const lead    = leadRef.current;
    if (!wrapper || !lead) return;

    // (Scroll progress bar is now global in App.tsx)

    // generic reveal observer (.reveal)
    const revealObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); }
        else { e.target.classList.remove('visible'); }
      });
    }, { threshold: 0.08 });
    wrapper.querySelectorAll('.edu-reveal').forEach(el => revealObs.observe(el));

    // per-column reveal-item stagger
    wrapper.querySelectorAll('.edu-col').forEach(col => {
      new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.querySelectorAll('.edu-reveal-item').forEach((item, i) => {
              setTimeout(() => item.classList.add('visible'), 100 + i * 80);
            });
          } else {
            e.target.querySelectorAll('.edu-reveal-item').forEach(item => item.classList.remove('visible'));
          }
        });
      }, { threshold: 0.08 }).observe(col);
    });

    // leadership cards stagger
    const leadObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.edu-reveal-lead').forEach((card, i) => {
            setTimeout(() => card.classList.add('visible'), 80 + i * 120);
          });
        } else {
          e.target.querySelectorAll('.edu-reveal-lead').forEach(card => card.classList.remove('visible'));
        }
      });
    }, { threshold: 0.1 });
    leadObs.observe(lead);

    return () => {
      revealObs.disconnect();
      leadObs.disconnect();
    };
  }, []);

  const CheckIcon = () => (
    <svg viewBox="0 0 12 12" fill="none">
      <rect x="1" y="1" width="10" height="10" rx="2" stroke="#16a34a" strokeWidth="1.2"/>
      <path d="M3.5 6l2 2 3-3" stroke="#16a34a" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );

  return (
    <div className="edu-wrapper" ref={wrapperRef} id="education">

      <section className="edu-section">

        {/* LEFT: EDUCATION */}
        <div className="edu-col edu-reveal">
          <div className="edu-col-heading"><span className="slash">// </span>Education</div>

          <div className="edu-content-block edu-reveal">
            
            <div className="edu-school-row">
              <div>
                <div className="edu-school-name">De La Salle University –<br/>Dasmariñas</div>
                <div className="edu-school-degree">B.S. Computer Science (Intelligent Systems)</div>
              </div>
              <div className="edu-school-period">2023 –<br/>Present</div>
            </div>

            <div className="edu-year-entry edu-reveal-item">
              <div className="edu-year-text"><span className="edu-year-label">1st Year: </span><span className="edu-year-detail">Top 4 (University-wide); Top 1 in CICS</span></div>
              <div className="edu-year-gpa">GPA: <span>3.97</span></div>
            </div>

            <div className="edu-year-entry edu-reveal-item">
              <div className="edu-year-text"><span className="edu-year-label">2nd Year: </span><span className="edu-year-detail">Top 3 in CICS</span></div>
              <div className="edu-year-gpa">GPA: <span>3.98</span></div>
            </div>

            <div className="edu-pill-row">
              <div className="edu-pill edu-reveal-item">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{flexShrink:0}}>
                  <circle cx="7" cy="5" r="3.2" stroke="#16a34a" strokeWidth="1.3"/>
                  <path d="M3 13c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="#16a34a" strokeWidth="1.3" strokeLinecap="round"/>
                  <path d="M7 8v2M5.5 12h3" stroke="#16a34a" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
                Student Assistant Scholar — Language &amp; Literature / Graduate Studies
              </div>
              <div className="edu-pill edu-reveal-item">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{flexShrink:0}}>
                  <path d="M7 1.5l1.5 3 3.3.5-2.4 2.3.6 3.2L7 9l-3 1.5.6-3.2L2.2 5l3.3-.5L7 1.5z" stroke="#16a34a" strokeWidth="1.2" strokeLinejoin="round"/>
                </svg>
                SIKAPTala 2025 — National Quiz Bee · 4th Place
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT: CERTIFICATIONS */}
        <div className="edu-col edu-reveal">
          <div className="edu-col-heading"><span className="slash">// </span>Certifications</div>

          <div className="edu-content-block edu-reveal">
            
            <div className="edu-cert-list">
              {[
                'CS50P (Harvard University / edX)',
                'Google AI Essentials (Google)',
                'Intro to GenAI (Google Cloud Training)',
                'TOEIC – English Proficiency',
                'Technology for Teaching & Learning (UPOU)',
                'Teaching & Learning with Modern ICTs (UPOU)',
                'E-Commerce Essentials (UPOU)',
              ].map(name => (
                <div className="edu-cert-row edu-reveal-item" key={name}>
                  <div className="edu-cert-indicator"><CheckIcon /></div>
                  <span className="edu-cert-name">{name}</span>
                </div>
              ))}
            </div>

            <div className="edu-cert-footer edu-reveal-item">
              <span className="edu-footer-note">// <span>ALL CREDENTIALS VERIFIED BY 2024</span></span>
              <a href="#" className="edu-view-btn">View_Certificates()</a>
            </div>

          </div>
        </div>

        {/* LEADERSHIP */}
        <div className="edu-leadership edu-reveal" style={{gridColumn:'1/-1'}} ref={leadRef}>
          <div className="edu-leadership-heading"><span className="slash">// </span>Leadership &amp; Organizations</div>

          <div className="edu-org-list">
            <div className="edu-org-card edu-reveal-lead">
              <div className="edu-org-top">
                <div className="edu-org-name">University Student Government</div>
                <span className="edu-org-period">2025 – Present</span>
              </div>
              <div className="edu-org-role">DSWD Staff</div>
              <div className="edu-org-desc">Representing student concerns and supporting welfare initiatives under the Dept. of Social and Welfare Development.</div>
            </div>

            <div className="edu-org-card edu-reveal-lead">
              <div className="edu-org-top">
                <div className="edu-org-name">Circle of Student Assistants</div>
                <span className="edu-org-period">2024 – Present</span>
              </div>
              <div className="edu-org-role">Junior Officer for Spiritual Activities</div>
              <div className="edu-org-desc">Organizing spirituality-focused activities including seminars, fellowship sessions, and worship events for scholars.</div>
            </div>

            <div className="edu-org-card edu-reveal-lead">
              <div className="edu-org-top">
                <div className="edu-org-name">CS &amp; Computer Studies Student Gov.</div>
                <span className="edu-org-period">2023</span>
              </div>
              <div className="edu-org-role">Data Management Committee Member</div>
              <div className="edu-org-desc">Handled data gathering, processing, record-keeping, and event registration forms for the college.</div>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
};

export default EducationDevFinal;

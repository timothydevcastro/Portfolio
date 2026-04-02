import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Navbar from './Navbar';
import HomeDevFinal from './HomeDevFinal';
import AboutDevFinal from './AboutDevFinal';
import SkillsDevFinal from './SkillsDevFinal';
import ProjectsDevFinal from './ProjectsDevFinal';
import EducationDevFinal from './EducationDevFinal';
import ContactDevFinal from './ContactDevFinal';

type Section = 'Home' | 'About' | 'Skills' | 'Projects' | 'Education' | 'Contact';
type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>('Home');
  const [theme, setTheme] = useState<Theme>('light');
  const progressRef = useRef<HTMLDivElement>(null);
  const backTopRef = useRef<HTMLButtonElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // ── Theme initialization ──
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const sysPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme ? savedTheme : (sysPrefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);

    const sections = ['home', 'about', 'skills', 'projects', 'education', 'contact'];

    // ── Scroll-spy for active nav link ──
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          const sectionName = id.charAt(0).toUpperCase() + id.slice(1) as Section;
          setActiveSection(sectionName);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    // ── Global scroll progress bar + back-to-top ──
    const onScroll = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      if (docH > 0 && progressRef.current) {
        progressRef.current.style.width = (window.scrollY / docH * 100) + '%';
      }
      if (backTopRef.current) {
        if (window.scrollY > window.innerHeight * 0.6) {
          backTopRef.current.classList.add('visible');
        } else {
          backTopRef.current.classList.remove('visible');
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });


    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  };

  return (
    <>
      <Navbar active={activeSection} theme={theme} toggleTheme={toggleTheme} />
      <div className="global-scroll-progress" ref={progressRef}></div>
      <HomeDevFinal />
      <AboutDevFinal />
      <SkillsDevFinal />
      <ProjectsDevFinal />
      <EducationDevFinal />
      <ContactDevFinal />
      <button
        className="back-to-top"
        ref={backTopRef}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
      >
        ↑
      </button>

      {/* Fixed Home Ticker — only visible when on Home section */}
      <div className={`home-ticker-fixed${activeSection === 'Home' ? ' ticker-visible' : ''}`} ref={tickerRef}>
        <div className="ticker-track">
          <span className="ticker-item">building with <span>purpose</span></span>
          <span className="ticker-item">◆</span>
          <span className="ticker-item">open to <span>collaboration</span></span>
          <span className="ticker-item">◆</span>
          <span className="ticker-item">intelligent systems · <span>ai + fullstack</span></span>
          <span className="ticker-item">◆</span>
          <span className="ticker-item">cs student <span>@ dlsu-d</span></span>
          <span className="ticker-item">◆</span>
          <span className="ticker-item">cavite, <span>ph</span></span>
          <span className="ticker-item">◆</span>
          {/* Duplicate for seamless loop */}
          <span className="ticker-item">building with <span>purpose</span></span>
          <span className="ticker-item">◆</span>
          <span className="ticker-item">open to <span>collaboration</span></span>
          <span className="ticker-item">◆</span>
          <span className="ticker-item">intelligent systems · <span>ai + fullstack</span></span>
          <span className="ticker-item">◆</span>
          <span className="ticker-item">cs student <span>@ dlsu-d</span></span>
          <span className="ticker-item">◆</span>
          <span className="ticker-item">cavite, <span>ph</span></span>
          <span className="ticker-item">◆</span>
        </div>
      </div>
    </>
  );
};

export default App;

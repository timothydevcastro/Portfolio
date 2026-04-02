import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css';

interface NavbarProps {
  active: 'Home' | 'About' | 'Skills' | 'Projects' | 'Education' | 'Contact';
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const NAV_LINKS = ['Home', 'About', 'Skills', 'Projects', 'Education'] as const;

const Navbar: React.FC<NavbarProps> = ({ active, theme, toggleTheme }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lineStyle, setLineStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const navRef = useRef<HTMLElement>(null);
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, link: string) => {
    e.preventDefault();
    setMenuOpen(false);
    document.getElementById(link.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    setMenuOpen(false);
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Close menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  // Fade-in glass background on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on mount in case already scrolled
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Liquid Underline
  useEffect(() => {
    const activeIndex = NAV_LINKS.indexOf(active as any);
    if (activeIndex !== -1 && linksRef.current[activeIndex]) {
      const el = linksRef.current[activeIndex];
      setLineStyle({
        left: el?.offsetLeft || 0,
        width: el?.offsetWidth || 0,
        opacity: 1
      });
    } else {
      setLineStyle((prev) => ({ ...prev, opacity: 0 }));
    }
  }, [active, menuOpen]);

  return (
    <nav className={`shared-nav${menuOpen ? ' open' : ''}${isScrolled ? ' scrolled' : ''}`} ref={navRef}>
      <div className="nav-logo">
        <span className="nav-logo-arrow">&gt;</span>TRDC
      </div>
      <ul className="nav-links">
        <div className="nav-active-bg" style={{ left: lineStyle.left, width: lineStyle.width, opacity: lineStyle.opacity }}></div>
        {NAV_LINKS.map((link, index) => (
          <li key={link}>
            <a
              href={`#${link.toLowerCase()}`}
              ref={(el) => { linksRef.current[index] = el; }}
              className={active === link ? 'active' : ''}
              onClick={(e) => handleNavClick(e, link)}
            >
              {link}
            </a>
          </li>
        ))}
        <li className="nav-cta-mobile">
          <div className="nav-controls-mobile">
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle dark mode">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button className="nav-cta" onClick={scrollToContact}>Let's Talk()</button>
          </div>
        </li>
      </ul>
      <div className="nav-controls-desktop">
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle dark mode">
          {theme === 'dark' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          )}
        </button>
        <button className="nav-cta nav-cta-desktop" onClick={scrollToContact}>Let's Talk()</button>
      </div>
      <button className="hamburger" aria-label="Menu" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span><span></span><span></span>
      </button>
    </nav>
  );
};

export default Navbar;

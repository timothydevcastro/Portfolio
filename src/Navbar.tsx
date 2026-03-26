import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css';

interface NavbarProps {
  active: 'Home' | 'About' | 'Skills' | 'Projects' | 'Education' | 'Contact';
}

const NAV_LINKS = ['Home', 'About', 'Skills', 'Projects', 'Education'] as const;

const Navbar: React.FC<NavbarProps> = ({ active }) => {
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
        <li className="nav-cta-mobile"><button className="nav-cta" onClick={scrollToContact}>Let's Talk()</button></li>
      </ul>
      <button className="nav-cta nav-cta-desktop" onClick={scrollToContact}>Let's Talk()</button>
      <button className="hamburger" aria-label="Menu" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span><span></span><span></span>
      </button>
    </nav>
  );
};

export default Navbar;

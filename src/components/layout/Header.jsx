import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AlertOctagon, Search, Globe, Sun, Moon, ChevronDown, Check } from 'lucide-react';
import gsap from 'gsap';

export function Header({
  activeMode,
  setActiveMode,
  selectedLanguage,
  setSelectedLanguage,
  theme,
  onToggleTheme,
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  // Animation Refs
  const navRef = useRef(null);
  const logoRef = useRef(null);
  const tabsRef = useRef(null);
  const controlsRef = useRef(null);
  const langDropdownRef = useRef(null);

  // Segmented Pill Indicator Refs
  const segmentedContainerRef = useRef(null);
  const indicatorRef = useRef(null);
  const analyzeBtnRef = useRef(null);
  const incidentBtnRef = useRef(null);

  // 1. Initial Page Load Entrance Animation (GSAP)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      tl.fromTo(
        navRef.current,
        { y: -14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45 }
      )
        .fromTo(
          logoRef.current,
          { x: -10, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.35 },
          '-=0.25'
        )
        .fromTo(
          tabsRef.current,
          { scale: 0.95, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.35 },
          '-=0.2'
        )
        .fromTo(
          controlsRef.current,
          { x: 10, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.35 },
          '-=0.25'
        );
    });

    return () => ctx.revert();
  }, []);

  // 2. Performant Scroll Response with RAF
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 16);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 3. Fluid Sliding Indicator for Mode Switcher
  const updateIndicator = useCallback(() => {
    const activeBtn = activeMode === 'analyze' ? analyzeBtnRef.current : incidentBtnRef.current;
    const container = segmentedContainerRef.current;
    const indicator = indicatorRef.current;

    if (!activeBtn || !container || !indicator) return;

    const containerRect = container.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();

    const targetX = btnRect.left - containerRect.left;
    const targetWidth = btnRect.width;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      gsap.set(indicator, { x: targetX, width: targetWidth });
    } else {
      gsap.to(indicator, {
        x: targetX,
        width: targetWidth,
        duration: 0.32,
        ease: 'power2.out',
      });
    }
  }, [activeMode]);

  useEffect(() => {
    updateIndicator();

    // Re-calculate on window resize or font load
    window.addEventListener('resize', updateIndicator);
    const timeout = setTimeout(updateIndicator, 50);

    return () => {
      window.removeEventListener('resize', updateIndicator);
      clearTimeout(timeout);
    };
  }, [updateIndicator]);

  // 4. Click outside to close Language dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setIsLangOpen(false);
      }
    };

    if (isLangOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isLangOpen]);

  // Close dropdown on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isLangOpen) {
        setIsLangOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLangOpen]);

  const languages = [
    { code: 'English', label: 'English', native: 'English' },
    { code: 'Hinglish', label: 'Hinglish', native: 'Hinglish (Hindi+Eng)' },
    { code: 'Hindi', label: 'Hindi', native: 'हिंदी' },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50 pt-2.5 sm:pt-4 px-2 sm:px-6 pointer-events-none transition-all duration-300">
      <div
        ref={navRef}
        className={`pointer-events-auto max-w-7xl mx-auto rounded-2xl sm:rounded-3xl glass-panel glass-specular glass-refraction ${
          isScrolled
            ? 'glass-panel-scrolled py-2 sm:py-2.5 px-3 sm:px-6 -translate-y-0.5'
            : 'py-2.5 sm:py-3.5 px-3.5 sm:px-7'
        }`}
      >
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo & Product Identity */}
          <div ref={logoRef} className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <div
              className="group relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#0b101d] border border-indigo-500/25 dark:border-indigo-400/30 shadow-sm cursor-pointer transition-all duration-300 hover:shadow-indigo-500/20 hover:scale-[1.04] hover:brightness-110 overflow-hidden"
              title="VeriFi — Evidence-Driven Financial Safety Agent"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none z-10" />
              <img
                src="/verifi-icon.png"
                alt="VeriFi"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3"
              />
            </div>

            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white leading-none">
                  VeriFi
                </span>
                <span className="hidden xs:inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-slate-100/80 dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10">
                  Bharat Agentic 2026
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block font-medium mt-0.5">
                Evidence-Driven Financial Safety Agent
              </p>
            </div>
          </div>

          {/* Center Mode Switcher Tabs with Fluid Sliding Pill Indicator */}
          <div
            ref={tabsRef}
            className="flex items-center justify-center"
          >
            <nav
              ref={segmentedContainerRef}
              className="relative flex items-center p-1 rounded-xl bg-slate-200/60 dark:bg-[#0b1220]/80 border border-slate-200/90 dark:border-white/10 backdrop-blur-md shadow-inner"
              role="tablist"
              aria-label="Investigation Mode"
            >
              {/* Sliding Active Pill Indicator */}
              <div
                ref={indicatorRef}
                className={`absolute top-1 bottom-1 rounded-lg transition-colors duration-250 pointer-events-none ${
                  activeMode === 'analyze'
                    ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-[0_2px_8px_-1px_rgba(0,0,0,0.12),0_1px_2px_0_rgba(0,0,0,0.06)] dark:shadow-[0_0_16px_rgba(99,102,241,0.35),0_2px_8px_rgba(0,0,0,0.4)] border border-slate-200/80 dark:border-indigo-400/30'
                    : 'bg-red-600 text-white shadow-[0_0_16px_rgba(239,68,68,0.4),0_2px_8px_rgba(0,0,0,0.3)] border border-red-400/40'
                }`}
                style={{ width: 0, left: 0 }}
              />

              {/* Mode 1: Analyze Threat */}
              <button
                ref={analyzeBtnRef}
                type="button"
                role="tab"
                aria-selected={activeMode === 'analyze'}
                onClick={() => setActiveMode('analyze')}
                className={`relative z-10 group flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  activeMode === 'analyze'
                    ? 'text-slate-900 dark:text-white font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:-translate-y-0.5'
                }`}
              >
                <Search
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeMode === 'analyze'
                      ? 'text-indigo-600 dark:text-indigo-200'
                      : 'text-slate-500 group-hover:scale-105'
                  }`}
                />
                <span className="whitespace-nowrap">Analyze Threat</span>
              </button>

              {/* Mode 2: Incident Response */}
              <button
                ref={incidentBtnRef}
                type="button"
                role="tab"
                aria-selected={activeMode === 'incident'}
                onClick={() => setActiveMode('incident')}
                className={`relative z-10 group flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  activeMode === 'incident'
                    ? 'text-white font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:-translate-y-0.5'
                }`}
              >
                <AlertOctagon
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeMode === 'incident'
                      ? 'text-white animate-pulse-subtle'
                      : 'text-red-500 group-hover:scale-105'
                  }`}
                />
                <span className="whitespace-nowrap">Incident Response</span>
              </button>
            </nav>
          </div>

          {/* Right Side: Language & Theme Controls */}
          <div ref={controlsRef} className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Custom Floating Glass Language Dropdown */}
            <div ref={langDropdownRef} className="relative block">
              <button
                type="button"
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1.5 p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-200/50 dark:hover:bg-white/10 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer shadow-sm"
                aria-label={`Select language (currently ${selectedLanguage})`}
                aria-expanded={isLangOpen}
                aria-haspopup="listbox"
              >
                <Globe className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                <span className="font-semibold hidden sm:inline">{selectedLanguage}</span>
                <ChevronDown
                  className={`w-3 h-3 text-slate-400 transition-transform duration-200 hidden sm:block ${
                    isLangOpen ? 'rotate-180 text-indigo-500' : ''
                  }`}
                />
              </button>

              {/* Accessible hidden select for form integration / automated tools */}
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="sr-only"
                tabIndex={-1}
                aria-hidden="true"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.label}
                  </option>
                ))}
              </select>

              {/* Glass Dropdown Popover */}
              {isLangOpen && (
                <div
                  role="listbox"
                  className="absolute right-0 top-full mt-2 w-44 rounded-xl glass-panel glass-specular p-1.5 z-50 shadow-xl border border-slate-200/90 dark:border-white/15 animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-white/5 mb-1">
                    Interface Language
                  </div>
                  {languages.map((lang) => {
                    const isSelected = selectedLanguage === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          setSelectedLanguage(lang.code);
                          setIsLangOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors text-left cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 font-bold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-white/5'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span>{lang.native}</span>
                          <span className="text-[10px] text-slate-400">{lang.label}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Dark / Light Mode Capsule Toggle */}
            <button
              type="button"
              onClick={onToggleTheme}
              className="relative p-2 sm:p-2.5 rounded-xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-200/50 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer shadow-sm group active:scale-95 overflow-hidden"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <div className="relative w-4 h-4 flex items-center justify-center">
                <Sun
                  className={`w-4 h-4 text-amber-500 absolute transition-all duration-300 transform ${
                    theme === 'dark'
                      ? 'scale-100 rotate-0 opacity-100'
                      : 'scale-0 -rotate-90 opacity-0'
                  }`}
                />
                <Moon
                  className={`w-4 h-4 text-slate-700 dark:text-slate-200 absolute transition-all duration-300 transform ${
                    theme === 'dark'
                      ? 'scale-0 rotate-90 opacity-0'
                      : 'scale-100 rotate-0 opacity-100'
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

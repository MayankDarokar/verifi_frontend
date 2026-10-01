/**
 * VeriFi Theme Management (Dark / Light)
 * Persists to localStorage and handles system preferences.
 */

export function getInitialTheme() {
  if (typeof window === 'undefined') return 'dark';
  
  const saved = localStorage.getItem('verifi_theme');
  if (saved === 'dark' || saved === 'light') {
    return saved;
  }
  
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  
  return 'dark';
}

export function applyTheme(theme) {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
    root.style.colorScheme = 'dark';
  } else {
    root.classList.remove('dark');
    root.style.colorScheme = 'light';
  }
  
  localStorage.setItem('verifi_theme', theme);
}

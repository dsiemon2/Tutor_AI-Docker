// Accessibility Service - WCAG 2.1 AA Compliance Utilities
import { prisma } from '../config/database';

// ============================================
// TYPES
// ============================================

export interface AccessibilitySettings {
  textSize: 'small' | 'normal' | 'large' | 'x-large';
  highContrast: boolean;
  dyslexiaFont: boolean;
  reducedMotion: boolean;
  focusHighlight: boolean;
  screenReaderMode: boolean;
  keyboardNav: boolean;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  lineSpacing: 'normal' | 'wide' | 'extra-wide';
  cursorSize: 'normal' | 'large';
  autoplayMedia: boolean;
}

export const DEFAULT_ACCESSIBILITY_SETTINGS: AccessibilitySettings = {
  textSize: 'normal',
  highContrast: false,
  dyslexiaFont: false,
  reducedMotion: false,
  focusHighlight: true,
  screenReaderMode: false,
  keyboardNav: true,
  colorBlindMode: 'none',
  lineSpacing: 'normal',
  cursorSize: 'normal',
  autoplayMedia: true
};

// ============================================
// WCAG CONTRAST CALCULATIONS
// ============================================

/**
 * Calculate relative luminance of a color
 * WCAG 2.1 formula
 */
export function getRelativeLuminance(hex: string): number {
  // Remove # if present
  hex = hex.replace('#', '');

  // Parse RGB values
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;

  // Apply gamma correction
  const rLinear = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const gLinear = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const bLinear = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

  // Calculate luminance
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Calculate contrast ratio between two colors
 * WCAG 2.1 requires 4.5:1 for normal text, 3:1 for large text (AA)
 */
export function getContrastRatio(color1: string, color2: string): number {
  const l1 = getRelativeLuminance(color1);
  const l2 = getRelativeLuminance(color2);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG AA standards
 */
export function meetsWcagAA(color1: string, color2: string, isLargeText: boolean = false): boolean {
  const ratio = getContrastRatio(color1, color2);
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Check if contrast ratio meets WCAG AAA standards
 */
export function meetsWcagAAA(color1: string, color2: string, isLargeText: boolean = false): boolean {
  const ratio = getContrastRatio(color1, color2);
  return isLargeText ? ratio >= 4.5 : ratio >= 7;
}

/**
 * Suggest a compliant alternative color
 */
export function suggestCompliantColor(foreground: string, background: string, targetRatio: number = 4.5): string {
  const ratio = getContrastRatio(foreground, background);

  if (ratio >= targetRatio) {
    return foreground;
  }

  // Determine if we should go lighter or darker
  const bgLuminance = getRelativeLuminance(background);
  const shouldDarken = bgLuminance > 0.5;

  // Parse foreground color
  let hex = foreground.replace('#', '');
  let r = parseInt(hex.substr(0, 2), 16);
  let g = parseInt(hex.substr(2, 2), 16);
  let b = parseInt(hex.substr(4, 2), 16);

  // Adjust color until contrast is met
  const step = shouldDarken ? -5 : 5;

  for (let i = 0; i < 60; i++) {
    r = Math.max(0, Math.min(255, r + step));
    g = Math.max(0, Math.min(255, g + step));
    b = Math.max(0, Math.min(255, b + step));

    const newColor = '#' + r.toString(16).padStart(2, '0') +
                           g.toString(16).padStart(2, '0') +
                           b.toString(16).padStart(2, '0');

    if (getContrastRatio(newColor, background) >= targetRatio) {
      return newColor;
    }
  }

  // Fallback to black or white
  return shouldDarken ? '#000000' : '#ffffff';
}

// ============================================
// USER SETTINGS MANAGEMENT
// ============================================

export async function getAccessibilitySettings(userId: string): Promise<AccessibilitySettings> {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    return DEFAULT_ACCESSIBILITY_SETTINGS;
  }

  // Cast to any for flexibility with optional fields
  const u = user as Record<string, unknown>;

  return {
    textSize: (u.textSize as AccessibilitySettings['textSize']) || 'normal',
    highContrast: (u.highContrast as boolean) ?? false,
    dyslexiaFont: (u.dyslexiaFont as boolean) ?? false,
    reducedMotion: (u.reducedMotion as boolean) ?? false,
    focusHighlight: (u.focusHighlight as boolean) ?? true,
    screenReaderMode: (u.screenReaderMode as boolean) ?? false,
    keyboardNav: (u.keyboardNav as boolean) ?? true,
    colorBlindMode: (u.colorBlindMode as AccessibilitySettings['colorBlindMode']) || 'none',
    lineSpacing: (u.lineSpacing as AccessibilitySettings['lineSpacing']) || 'normal',
    cursorSize: (u.cursorSize as AccessibilitySettings['cursorSize']) || 'normal',
    autoplayMedia: (u.autoplayMedia as boolean) ?? true
  };
}

export async function updateAccessibilitySettings(
  userId: string,
  settings: Partial<AccessibilitySettings>
): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: settings
  });
}

// ============================================
// CSS CLASS GENERATION
// ============================================

export function generateAccessibilityClasses(settings: AccessibilitySettings): string[] {
  const classes: string[] = [];

  // Text size
  if (settings.textSize !== 'normal') {
    classes.push(`text-size-${settings.textSize}`);
  }

  // High contrast
  if (settings.highContrast) {
    classes.push('high-contrast');
  }

  // Dyslexia font
  if (settings.dyslexiaFont) {
    classes.push('dyslexia-font');
  }

  // Reduced motion
  if (settings.reducedMotion) {
    classes.push('reduced-motion');
  }

  // Focus highlight
  if (settings.focusHighlight) {
    classes.push('focus-highlight');
  }

  // Screen reader mode
  if (settings.screenReaderMode) {
    classes.push('screen-reader-mode');
  }

  // Color blind mode
  if (settings.colorBlindMode !== 'none') {
    classes.push(`color-blind-${settings.colorBlindMode}`);
  }

  // Line spacing
  if (settings.lineSpacing !== 'normal') {
    classes.push(`line-spacing-${settings.lineSpacing}`);
  }

  // Cursor size
  if (settings.cursorSize !== 'normal') {
    classes.push(`cursor-${settings.cursorSize}`);
  }

  return classes;
}

export function generateAccessibilityCSS(settings: AccessibilitySettings): string {
  const styles: string[] = [];

  // Text size multipliers
  const sizeMap: Record<string, number> = {
    'small': 0.85,
    'normal': 1,
    'large': 1.15,
    'x-large': 1.3
  };

  const sizeMultiplier = sizeMap[settings.textSize] || 1;

  if (sizeMultiplier !== 1) {
    styles.push(`html { font-size: ${sizeMultiplier * 100}% !important; }`);
  }

  // Line spacing
  if (settings.lineSpacing === 'wide') {
    styles.push('body { line-height: 1.8 !important; }');
    styles.push('p, li { margin-bottom: 1em !important; }');
  } else if (settings.lineSpacing === 'extra-wide') {
    styles.push('body { line-height: 2.2 !important; }');
    styles.push('p, li { margin-bottom: 1.5em !important; }');
  }

  // Dyslexia font
  if (settings.dyslexiaFont) {
    styles.push(`
      @font-face {
        font-family: 'OpenDyslexic';
        src: url('https://cdn.jsdelivr.net/npm/open-dyslexic@1.0.3/woff/OpenDyslexic-Regular.woff') format('woff');
        font-weight: normal;
        font-style: normal;
      }
      body, p, h1, h2, h3, h4, h5, h6, input, button, select, textarea {
        font-family: 'OpenDyslexic', sans-serif !important;
      }
    `);
  }

  // High contrast mode
  if (settings.highContrast) {
    styles.push(`
      body {
        background-color: #000 !important;
        color: #fff !important;
      }
      .card, .modal-content, .dropdown-menu {
        background-color: #1a1a1a !important;
        border-color: #fff !important;
        color: #fff !important;
      }
      .sidebar, .top-navbar {
        background: #000 !important;
        border-color: #fff !important;
      }
      a { color: #ffff00 !important; }
      a:hover { color: #00ffff !important; }
      .btn-primary {
        background-color: #ffff00 !important;
        color: #000 !important;
        border-color: #ffff00 !important;
      }
      .btn-outline-primary {
        border-color: #ffff00 !important;
        color: #ffff00 !important;
      }
      .form-control, .form-select {
        background-color: #000 !important;
        color: #fff !important;
        border-color: #fff !important;
      }
      .text-muted { color: #ccc !important; }
    `);
  }

  // Reduced motion
  if (settings.reducedMotion) {
    styles.push(`
      *, *::before, *::after {
        animation-duration: 0.001ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.001ms !important;
      }
    `);
  }

  // Enhanced focus
  if (settings.focusHighlight) {
    styles.push(`
      :focus {
        outline: 3px solid #ffcc00 !important;
        outline-offset: 2px !important;
      }
      :focus:not(:focus-visible) {
        outline: none !important;
      }
      :focus-visible {
        outline: 3px solid #ffcc00 !important;
        outline-offset: 2px !important;
      }
    `);
  }

  // Large cursor
  if (settings.cursorSize === 'large') {
    styles.push(`
      html, body, a, button, input, select, textarea {
        cursor: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><path d="M12 0 L48 24 L24 24 L24 48 L12 0" fill="%23000" stroke="%23fff" stroke-width="2"/></svg>') 12 0, auto !important;
      }
    `);
  }

  // Color blind modes
  if (settings.colorBlindMode !== 'none') {
    const filters: Record<string, string> = {
      'protanopia': 'url(#protanopia-filter)',
      'deuteranopia': 'url(#deuteranopia-filter)',
      'tritanopia': 'url(#tritanopia-filter)'
    };
    if (filters[settings.colorBlindMode]) {
      // This would require SVG filters to be added to the page
      styles.push(`body { filter: ${filters[settings.colorBlindMode]}; }`);
    }
  }

  return styles.join('\n');
}

// ============================================
// ARIA HELPERS
// ============================================

/**
 * Generate unique ID for ARIA references
 */
export function generateAriaId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate skip link HTML
 */
export function generateSkipLinks(): string {
  return `
    <nav class="skip-links" aria-label="Skip navigation">
      <a href="#main-content" class="skip-link">Skip to main content</a>
      <a href="#main-nav" class="skip-link">Skip to navigation</a>
      <a href="#search" class="skip-link">Skip to search</a>
    </nav>
  `;
}

/**
 * Generate screen reader announcement HTML
 */
export function generateAriaLiveRegion(): string {
  return `
    <div id="aria-live-announcements" role="region" aria-live="polite" aria-atomic="true" class="visually-hidden"></div>
    <div id="aria-live-alerts" role="alert" aria-live="assertive" aria-atomic="true" class="visually-hidden"></div>
  `;
}

// ============================================
// KEYBOARD NAVIGATION HELPERS
// ============================================

/**
 * Generate keyboard navigation JavaScript
 */
export function generateKeyboardNavScript(): string {
  return `
    // Keyboard navigation enhancements
    (function() {
      // Skip link visibility on focus
      document.querySelectorAll('.skip-link').forEach(link => {
        link.addEventListener('focus', function() {
          this.style.left = '0';
          this.style.top = '0';
        });
        link.addEventListener('blur', function() {
          this.style.left = '-10000px';
          this.style.top = 'auto';
        });
      });

      // Escape key to close modals/dropdowns
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
          // Close any open Bootstrap modals
          const openModal = document.querySelector('.modal.show');
          if (openModal) {
            const modalInstance = bootstrap.Modal.getInstance(openModal);
            if (modalInstance) modalInstance.hide();
          }
          // Close any open dropdowns
          document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
            const dropdown = bootstrap.Dropdown.getInstance(menu.previousElementSibling);
            if (dropdown) dropdown.hide();
          });
        }
      });

      // Arrow key navigation for menus
      document.querySelectorAll('[role="menu"], [role="menubar"]').forEach(menu => {
        const items = menu.querySelectorAll('[role="menuitem"]');

        menu.addEventListener('keydown', function(e) {
          const currentIndex = Array.from(items).indexOf(document.activeElement);

          if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            e.preventDefault();
            const nextIndex = (currentIndex + 1) % items.length;
            items[nextIndex].focus();
          } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            e.preventDefault();
            const prevIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
            items[prevIndex].focus();
          } else if (e.key === 'Home') {
            e.preventDefault();
            items[0].focus();
          } else if (e.key === 'End') {
            e.preventDefault();
            items[items.length - 1].focus();
          }
        });
      });

      // Focus trap for modals
      document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('keydown', function(e) {
          if (e.key !== 'Tab') return;

          const focusable = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          const first = focusable[0];
          const last = focusable[focusable.length - 1];

          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        });
      });

      // Screen reader announcements
      window.announceToScreenReader = function(message, priority = 'polite') {
        const regionId = priority === 'assertive' ? 'aria-live-alerts' : 'aria-live-announcements';
        const region = document.getElementById(regionId);
        if (region) {
          region.textContent = '';
          setTimeout(() => { region.textContent = message; }, 100);
        }
      };
    })();
  `;
}

// ============================================
// VALIDATION & AUDIT
// ============================================

export interface AccessibilityIssue {
  element: string;
  issue: string;
  severity: 'error' | 'warning' | 'info';
  wcag: string;
  fix: string;
}

/**
 * Common accessibility issues to check (client-side would need this)
 */
export function getAccessibilityChecklist(): Array<{
  id: string;
  name: string;
  wcag: string;
  level: 'A' | 'AA' | 'AAA';
}> {
  return [
    { id: 'alt-text', name: 'Images have alt text', wcag: '1.1.1', level: 'A' },
    { id: 'color-contrast', name: 'Text has sufficient color contrast', wcag: '1.4.3', level: 'AA' },
    { id: 'resize-text', name: 'Text can be resized to 200%', wcag: '1.4.4', level: 'AA' },
    { id: 'keyboard-access', name: 'All functionality available via keyboard', wcag: '2.1.1', level: 'A' },
    { id: 'no-keyboard-trap', name: 'No keyboard traps', wcag: '2.1.2', level: 'A' },
    { id: 'skip-links', name: 'Skip navigation links present', wcag: '2.4.1', level: 'A' },
    { id: 'page-titled', name: 'Pages have descriptive titles', wcag: '2.4.2', level: 'A' },
    { id: 'focus-visible', name: 'Focus is visible', wcag: '2.4.7', level: 'AA' },
    { id: 'headings-labels', name: 'Headings and labels are descriptive', wcag: '2.4.6', level: 'AA' },
    { id: 'error-identification', name: 'Errors are clearly identified', wcag: '3.3.1', level: 'A' },
    { id: 'labels-or-instructions', name: 'Form inputs have labels', wcag: '3.3.2', level: 'A' },
    { id: 'parsing', name: 'HTML is valid', wcag: '4.1.1', level: 'A' },
    { id: 'name-role-value', name: 'Custom controls have name/role/value', wcag: '4.1.2', level: 'A' },
    { id: 'status-messages', name: 'Status messages announced to AT', wcag: '4.1.3', level: 'AA' }
  ];
}

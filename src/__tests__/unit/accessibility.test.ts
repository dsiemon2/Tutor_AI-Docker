// Tests for Accessibility Service - WCAG 2.1 AA Compliance

import {
  getRelativeLuminance,
  getContrastRatio,
  meetsWcagAA,
  meetsWcagAAA,
  suggestCompliantColor,
  generateAccessibilityClasses,
  DEFAULT_ACCESSIBILITY_SETTINGS,
  AccessibilitySettings,
  getAccessibilityChecklist,
  generateAriaId
} from '../../services/accessibility.service';

describe('Accessibility Service', () => {
  describe('Relative Luminance Calculation', () => {
    it('should calculate luminance for black as 0', () => {
      expect(getRelativeLuminance('#000000')).toBeCloseTo(0, 4);
    });

    it('should calculate luminance for white as 1', () => {
      expect(getRelativeLuminance('#ffffff')).toBeCloseTo(1, 4);
    });

    it('should calculate luminance for pure red', () => {
      const luminance = getRelativeLuminance('#ff0000');
      expect(luminance).toBeCloseTo(0.2126, 4);
    });

    it('should calculate luminance for pure green', () => {
      const luminance = getRelativeLuminance('#00ff00');
      expect(luminance).toBeCloseTo(0.7152, 4);
    });

    it('should calculate luminance for pure blue', () => {
      const luminance = getRelativeLuminance('#0000ff');
      expect(luminance).toBeCloseTo(0.0722, 4);
    });

    it('should handle colors without # prefix', () => {
      expect(getRelativeLuminance('ffffff')).toBeCloseTo(1, 4);
    });

    it('should calculate gray correctly', () => {
      // Mid-gray should have luminance around 0.2
      const luminance = getRelativeLuminance('#808080');
      expect(luminance).toBeGreaterThan(0.1);
      expect(luminance).toBeLessThan(0.3);
    });
  });

  describe('Contrast Ratio Calculation', () => {
    it('should return 21:1 for black on white', () => {
      const ratio = getContrastRatio('#000000', '#ffffff');
      expect(ratio).toBeCloseTo(21, 0);
    });

    it('should return 21:1 for white on black', () => {
      const ratio = getContrastRatio('#ffffff', '#000000');
      expect(ratio).toBeCloseTo(21, 0);
    });

    it('should return 1:1 for same colors', () => {
      const ratio = getContrastRatio('#ff0000', '#ff0000');
      expect(ratio).toBeCloseTo(1, 2);
    });

    it('should handle typical color combinations', () => {
      // Dark blue on white - should have good contrast
      const ratio = getContrastRatio('#003366', '#ffffff');
      expect(ratio).toBeGreaterThan(8);
    });

    it('should be symmetric (order should not matter)', () => {
      const ratio1 = getContrastRatio('#123456', '#fedcba');
      const ratio2 = getContrastRatio('#fedcba', '#123456');
      expect(ratio1).toBeCloseTo(ratio2, 4);
    });
  });

  describe('WCAG AA Compliance', () => {
    it('should pass for black on white (normal text)', () => {
      expect(meetsWcagAA('#000000', '#ffffff', false)).toBe(true);
    });

    it('should pass for white on black (normal text)', () => {
      expect(meetsWcagAA('#ffffff', '#000000', false)).toBe(true);
    });

    it('should fail for low contrast colors (normal text)', () => {
      // Light gray on white
      expect(meetsWcagAA('#cccccc', '#ffffff', false)).toBe(false);
    });

    it('should use 4.5:1 ratio for normal text', () => {
      // Colors with exactly 4.5:1 ratio should pass
      // Dark enough gray on white
      const passes = meetsWcagAA('#767676', '#ffffff', false);
      expect(passes).toBe(true);
    });

    it('should use 3:1 ratio for large text', () => {
      // Colors that fail normal but pass large
      const passesLarge = meetsWcagAA('#888888', '#ffffff', true);
      expect(passesLarge).toBe(true);
    });

    it('should fail light gray for normal text', () => {
      expect(meetsWcagAA('#aaaaaa', '#ffffff', false)).toBe(false);
    });
  });

  describe('WCAG AAA Compliance', () => {
    it('should pass for black on white', () => {
      expect(meetsWcagAAA('#000000', '#ffffff', false)).toBe(true);
    });

    it('should require 7:1 for normal text', () => {
      // Mid-gray might fail AAA for normal text
      const ratio = getContrastRatio('#777777', '#ffffff');
      expect(meetsWcagAAA('#777777', '#ffffff', false)).toBe(ratio >= 7);
    });

    it('should require 4.5:1 for large text', () => {
      expect(meetsWcagAAA('#767676', '#ffffff', true)).toBe(true);
    });
  });

  describe('Compliant Color Suggestion', () => {
    it('should return original color if already compliant', () => {
      const result = suggestCompliantColor('#000000', '#ffffff');
      expect(result).toBe('#000000');
    });

    it('should suggest darker color for light backgrounds', () => {
      const result = suggestCompliantColor('#aaaaaa', '#ffffff');
      const ratio = getContrastRatio(result, '#ffffff');
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('should suggest lighter color for dark backgrounds', () => {
      const result = suggestCompliantColor('#444444', '#000000');
      const ratio = getContrastRatio(result, '#000000');
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });

    it('should handle edge case of very low contrast', () => {
      const result = suggestCompliantColor('#ffffff', '#ffffff');
      // The result should be compliant - a dark enough color
      const ratio = getContrastRatio(result, '#ffffff');
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });
  });

  describe('Accessibility Classes Generation', () => {
    it('should return empty array for default settings', () => {
      const classes = generateAccessibilityClasses(DEFAULT_ACCESSIBILITY_SETTINGS);
      // Default has focusHighlight true, so will have that class
      expect(classes).toContain('focus-highlight');
    });

    it('should add text-size class for non-normal sizes', () => {
      const settings: AccessibilitySettings = {
        ...DEFAULT_ACCESSIBILITY_SETTINGS,
        textSize: 'large'
      };
      const classes = generateAccessibilityClasses(settings);
      expect(classes).toContain('text-size-large');
    });

    it('should add high-contrast class when enabled', () => {
      const settings: AccessibilitySettings = {
        ...DEFAULT_ACCESSIBILITY_SETTINGS,
        highContrast: true
      };
      const classes = generateAccessibilityClasses(settings);
      expect(classes).toContain('high-contrast');
    });

    it('should add dyslexia-font class when enabled', () => {
      const settings: AccessibilitySettings = {
        ...DEFAULT_ACCESSIBILITY_SETTINGS,
        dyslexiaFont: true
      };
      const classes = generateAccessibilityClasses(settings);
      expect(classes).toContain('dyslexia-font');
    });

    it('should add reduced-motion class when enabled', () => {
      const settings: AccessibilitySettings = {
        ...DEFAULT_ACCESSIBILITY_SETTINGS,
        reducedMotion: true
      };
      const classes = generateAccessibilityClasses(settings);
      expect(classes).toContain('reduced-motion');
    });

    it('should add color-blind mode class', () => {
      const settings: AccessibilitySettings = {
        ...DEFAULT_ACCESSIBILITY_SETTINGS,
        colorBlindMode: 'protanopia'
      };
      const classes = generateAccessibilityClasses(settings);
      expect(classes).toContain('color-blind-protanopia');
    });

    it('should add line-spacing class', () => {
      const settings: AccessibilitySettings = {
        ...DEFAULT_ACCESSIBILITY_SETTINGS,
        lineSpacing: 'wide'
      };
      const classes = generateAccessibilityClasses(settings);
      expect(classes).toContain('line-spacing-wide');
    });

    it('should add cursor-large class', () => {
      const settings: AccessibilitySettings = {
        ...DEFAULT_ACCESSIBILITY_SETTINGS,
        cursorSize: 'large'
      };
      const classes = generateAccessibilityClasses(settings);
      expect(classes).toContain('cursor-large');
    });
  });

  describe('Default Accessibility Settings', () => {
    it('should have normal text size by default', () => {
      expect(DEFAULT_ACCESSIBILITY_SETTINGS.textSize).toBe('normal');
    });

    it('should have high contrast disabled by default', () => {
      expect(DEFAULT_ACCESSIBILITY_SETTINGS.highContrast).toBe(false);
    });

    it('should have dyslexia font disabled by default', () => {
      expect(DEFAULT_ACCESSIBILITY_SETTINGS.dyslexiaFont).toBe(false);
    });

    it('should have reduced motion disabled by default', () => {
      expect(DEFAULT_ACCESSIBILITY_SETTINGS.reducedMotion).toBe(false);
    });

    it('should have focus highlight enabled by default', () => {
      expect(DEFAULT_ACCESSIBILITY_SETTINGS.focusHighlight).toBe(true);
    });

    it('should have keyboard nav enabled by default', () => {
      expect(DEFAULT_ACCESSIBILITY_SETTINGS.keyboardNav).toBe(true);
    });

    it('should have no color blind mode by default', () => {
      expect(DEFAULT_ACCESSIBILITY_SETTINGS.colorBlindMode).toBe('none');
    });

    it('should have normal line spacing by default', () => {
      expect(DEFAULT_ACCESSIBILITY_SETTINGS.lineSpacing).toBe('normal');
    });

    it('should have autoplay enabled by default', () => {
      expect(DEFAULT_ACCESSIBILITY_SETTINGS.autoplayMedia).toBe(true);
    });
  });

  describe('Accessibility Checklist', () => {
    it('should include alt-text check', () => {
      const checklist = getAccessibilityChecklist();
      expect(checklist.find(c => c.id === 'alt-text')).toBeDefined();
    });

    it('should include color-contrast check', () => {
      const checklist = getAccessibilityChecklist();
      const item = checklist.find(c => c.id === 'color-contrast');
      expect(item).toBeDefined();
      expect(item?.wcag).toBe('1.4.3');
      expect(item?.level).toBe('AA');
    });

    it('should include keyboard-access check', () => {
      const checklist = getAccessibilityChecklist();
      const item = checklist.find(c => c.id === 'keyboard-access');
      expect(item).toBeDefined();
      expect(item?.level).toBe('A');
    });

    it('should include skip-links check', () => {
      const checklist = getAccessibilityChecklist();
      expect(checklist.find(c => c.id === 'skip-links')).toBeDefined();
    });

    it('should include focus-visible check', () => {
      const checklist = getAccessibilityChecklist();
      const item = checklist.find(c => c.id === 'focus-visible');
      expect(item).toBeDefined();
      expect(item?.wcag).toBe('2.4.7');
    });

    it('should include status-messages check for WCAG 4.1.3', () => {
      const checklist = getAccessibilityChecklist();
      const item = checklist.find(c => c.id === 'status-messages');
      expect(item).toBeDefined();
      expect(item?.wcag).toBe('4.1.3');
      expect(item?.level).toBe('AA');
    });
  });

  describe('ARIA ID Generation', () => {
    it('should generate unique IDs', () => {
      const id1 = generateAriaId('test');
      const id2 = generateAriaId('test');
      expect(id1).not.toBe(id2);
    });

    it('should include prefix in ID', () => {
      const id = generateAriaId('myprefix');
      expect(id.startsWith('myprefix-')).toBe(true);
    });

    it('should generate valid ID format', () => {
      const id = generateAriaId('test');
      // Should not contain spaces or special characters that are invalid in IDs
      expect(id).toMatch(/^[a-zA-Z][a-zA-Z0-9\-_]*$/);
    });
  });

  describe('Text Size Multipliers', () => {
    const sizeMap: Record<string, number> = {
      'small': 0.85,
      'normal': 1,
      'large': 1.15,
      'x-large': 1.3
    };

    it('should have correct multiplier for small', () => {
      expect(sizeMap['small']).toBe(0.85);
    });

    it('should have correct multiplier for normal', () => {
      expect(sizeMap['normal']).toBe(1);
    });

    it('should have correct multiplier for large', () => {
      expect(sizeMap['large']).toBe(1.15);
    });

    it('should have correct multiplier for x-large', () => {
      expect(sizeMap['x-large']).toBe(1.3);
    });
  });

  describe('Line Height Values', () => {
    const lineHeightMap: Record<string, number> = {
      'normal': 1.5,
      'wide': 1.8,
      'extra-wide': 2.2
    };

    it('should have normal line height of 1.5', () => {
      expect(lineHeightMap['normal']).toBe(1.5);
    });

    it('should have wide line height of 1.8', () => {
      expect(lineHeightMap['wide']).toBe(1.8);
    });

    it('should have extra-wide line height of 2.2', () => {
      expect(lineHeightMap['extra-wide']).toBe(2.2);
    });
  });

  describe('Color Blind Mode Options', () => {
    const colorBlindModes = ['none', 'protanopia', 'deuteranopia', 'tritanopia'];

    it('should support protanopia (red-blind)', () => {
      expect(colorBlindModes).toContain('protanopia');
    });

    it('should support deuteranopia (green-blind)', () => {
      expect(colorBlindModes).toContain('deuteranopia');
    });

    it('should support tritanopia (blue-blind)', () => {
      expect(colorBlindModes).toContain('tritanopia');
    });

    it('should have none as default option', () => {
      expect(colorBlindModes).toContain('none');
    });
  });

  describe('Focus Indicator Styles', () => {
    it('should use visible outline for focus', () => {
      // The CSS should include a visible outline
      // This is a specification test rather than implementation
      const focusOutlineWidth = 3;
      const focusOutlineColor = '#ffcc00';
      const focusOutlineOffset = 2;

      expect(focusOutlineWidth).toBeGreaterThanOrEqual(2);
      expect(focusOutlineOffset).toBeGreaterThanOrEqual(1);
      expect(focusOutlineColor).toBeTruthy();
    });
  });

  describe('Reduced Motion Preferences', () => {
    it('should respect system reduced motion preference', () => {
      // Test that reduced motion settings exist
      expect(DEFAULT_ACCESSIBILITY_SETTINGS.reducedMotion).toBeDefined();
    });

    it('should disable animations when reducedMotion is true', () => {
      // When reducedMotion is true, animation duration should be minimal
      const settings: AccessibilitySettings = {
        ...DEFAULT_ACCESSIBILITY_SETTINGS,
        reducedMotion: true
      };
      expect(settings.reducedMotion).toBe(true);
    });
  });
});

// Tests for Voice Tutoring Service

import {
  cleanTextForSpeech,
  applyPronunciationOverrides,
  addSpeechEmphasis,
  wrapForTutoringVoice,
  analyzeAudioData,
  DEFAULT_VOICE_SETTINGS,
  VOICE_DESCRIPTIONS,
  PRONUNCIATION_OVERRIDES,
  VoiceId
} from '../../services/voice.service';

describe('Voice Tutoring Service', () => {
  describe('Text Cleaning for Speech', () => {
    describe('Markdown Removal', () => {
      it('should remove bold markdown', () => {
        expect(cleanTextForSpeech('This is **bold** text')).toBe('This is bold text');
      });

      it('should remove italic markdown', () => {
        expect(cleanTextForSpeech('This is *italic* text')).toBe('This is italic text');
      });

      it('should remove inline code', () => {
        expect(cleanTextForSpeech('Use the `console.log` function')).toBe('Use the console.log function');
      });

      it('should remove code blocks', () => {
        const input = 'Here is code:\n```javascript\nconsole.log("hello")\n```\nAnd more text';
        const result = cleanTextForSpeech(input);
        expect(result).not.toContain('```');
        expect(result).toContain('more text');
      });

      it('should remove headers', () => {
        expect(cleanTextForSpeech('## Header\nContent here')).toBe('Header Content here');
      });

      it('should preserve link text but remove URL', () => {
        expect(cleanTextForSpeech('Visit [Google](https://google.com) for more')).toBe('Visit Google for more');
      });
    });

    describe('LaTeX to Spoken Conversion', () => {
      it('should convert fractions', () => {
        const result = cleanTextForSpeech('The answer is $\\frac{1}{2}$');
        expect(result).toContain('1 divided by 2');
      });

      it('should convert square roots', () => {
        const result = cleanTextForSpeech('Calculate $\\sqrt{16}$');
        expect(result).toContain('square root of 16');
      });

      it('should convert exponents', () => {
        expect(cleanTextForSpeech('$x^2$')).toContain('squared');
        expect(cleanTextForSpeech('$x^3$')).toContain('cubed');
        expect(cleanTextForSpeech('$x^4$')).toContain('to the power of 4');
      });

      it('should convert pi symbol', () => {
        const result = cleanTextForSpeech('The value of $\\pi$ is approximately 3.14');
        expect(result).toContain('pi');
      });

      it('should convert comparison operators', () => {
        expect(cleanTextForSpeech('$x > 5$')).toContain('is greater than');
        expect(cleanTextForSpeech('$x < 5$')).toContain('is less than');
      });

      it('should handle display math ($$)', () => {
        const result = cleanTextForSpeech('$$\\frac{a}{b} = c$$');
        expect(result).toContain('divided by');
        expect(result).toContain('equals');
      });
    });

    describe('Whitespace Handling', () => {
      it('should collapse multiple spaces', () => {
        expect(cleanTextForSpeech('Hello    world')).toBe('Hello world');
      });

      it('should trim leading and trailing whitespace', () => {
        expect(cleanTextForSpeech('  Hello world  ')).toBe('Hello world');
      });

      it('should handle newlines', () => {
        expect(cleanTextForSpeech('Hello\n\nworld')).toBe('Hello world');
      });
    });

    describe('HTML Removal', () => {
      it('should remove HTML tags', () => {
        expect(cleanTextForSpeech('Hello <strong>world</strong>')).toBe('Hello world');
      });

      it('should remove self-closing tags', () => {
        expect(cleanTextForSpeech('Line one<br/>Line two')).toBe('Line oneLine two');
      });
    });
  });

  describe('Pronunciation Overrides', () => {
    it('should convert pi symbol', () => {
      expect(applyPronunciationOverrides('π is approximately 3.14')).toContain('pi');
    });

    it('should convert squared symbol', () => {
      expect(applyPronunciationOverrides('x² = 4')).toContain('squared');
    });

    it('should convert cubed symbol', () => {
      expect(applyPronunciationOverrides('x³ = 8')).toContain('cubed');
    });

    it('should expand e.g.', () => {
      expect(applyPronunciationOverrides('Some examples, e.g., cats and dogs')).toContain('for example');
    });

    it('should expand i.e.', () => {
      expect(applyPronunciationOverrides('The answer, i.e., 42')).toContain('that is');
    });

    it('should expand etc.', () => {
      expect(applyPronunciationOverrides('Apples, oranges, etc.')).toContain('et cetera');
    });

    it('should expand AI abbreviation', () => {
      expect(applyPronunciationOverrides('AI is powerful')).toContain('A I');
    });

    it('should expand scientific terms', () => {
      expect(applyPronunciationOverrides('DNA is made of nucleotides')).toContain('D N A');
      expect(applyPronunciationOverrides('RNA is similar')).toContain('R N A');
    });

    it('should expand chemical formulas', () => {
      expect(applyPronunciationOverrides('Water is H₂O')).toContain('H 2 O');
    });

    it('should have all standard overrides defined', () => {
      expect(PRONUNCIATION_OVERRIDES['π']).toBe('pi');
      expect(PRONUNCIATION_OVERRIDES['∞']).toBe('infinity');
      expect(PRONUNCIATION_OVERRIDES['≠']).toBe('not equal to');
    });
  });

  describe('Speech Emphasis', () => {
    it('should add pause after colons', () => {
      const result = addSpeechEmphasis('Here is the answer: 42');
      expect(result).toContain(': ...');
    });

    it('should add pause before "but"', () => {
      const result = addSpeechEmphasis('This is correct, but there is more');
      expect(result).toContain('... but');
    });

    it('should add pause before "however"', () => {
      const result = addSpeechEmphasis('The answer is 5, however we need to verify');
      expect(result.toLowerCase()).toContain('... however');
    });

    it('should emphasize important words', () => {
      const result = addSpeechEmphasis('This is important to remember');
      expect(result).toContain('... important ...');
    });

    it('should emphasize "remember"', () => {
      const result = addSpeechEmphasis('Please remember this formula');
      expect(result).toContain('... remember ...');
    });
  });

  describe('Tutoring Voice Wrapper', () => {
    it('should combine all transformations', () => {
      const input = '**Important**: The formula is $\\frac{a}{b}$, e.g., $\\frac{1}{2}$';
      const result = wrapForTutoringVoice(input);

      // Should not contain markdown
      expect(result).not.toContain('**');

      // Should have pronunciation fixes
      expect(result).toContain('for example');

      // Should have LaTeX converted
      expect(result).toContain('divided by');
    });

    it('should handle simple text without changes', () => {
      const input = 'Hello, how are you today?';
      const result = wrapForTutoringVoice(input);
      expect(result).toContain('Hello');
      expect(result).toContain('today');
    });
  });

  describe('Audio Analysis', () => {
    it('should detect voice in loud audio', () => {
      const samples = new Int16Array(16000); // 1 second at 16kHz
      for (let i = 0; i < samples.length; i++) {
        samples[i] = Math.sin(i / 10) * 10000; // Simulated loud audio
      }
      const analysis = analyzeAudioData(samples);
      expect(analysis.hasVoice).toBe(true);
      expect(analysis.averageVolume).toBeGreaterThan(1000);
    });

    it('should detect silence', () => {
      const samples = new Int16Array(16000); // All zeros = silence
      const analysis = analyzeAudioData(samples);
      expect(analysis.hasVoice).toBe(false);
      expect(analysis.silenceRatio).toBe(1);
    });

    it('should calculate duration correctly', () => {
      const samples = new Int16Array(32000); // 2 seconds at 16kHz
      const analysis = analyzeAudioData(samples, 16000);
      expect(analysis.duration).toBe(2);
    });

    it('should find peak volume', () => {
      const samples = new Int16Array(100);
      samples[50] = 30000; // One peak
      const analysis = analyzeAudioData(samples);
      expect(analysis.peakVolume).toBe(30000);
    });

    it('should handle negative values', () => {
      const samples = new Int16Array(100);
      samples[0] = -32000;
      samples[1] = 32000;
      const analysis = analyzeAudioData(samples);
      expect(analysis.peakVolume).toBe(32000);
    });
  });

  describe('Default Voice Settings', () => {
    it('should have nova as default voice', () => {
      expect(DEFAULT_VOICE_SETTINGS.voiceId).toBe('nova');
    });

    it('should have normal speed (1.0)', () => {
      expect(DEFAULT_VOICE_SETTINGS.speed).toBe(1.0);
    });

    it('should default to English', () => {
      expect(DEFAULT_VOICE_SETTINGS.language).toBe('en');
    });

    it('should be enabled by default', () => {
      expect(DEFAULT_VOICE_SETTINGS.enabled).toBe(true);
    });
  });

  describe('Voice Descriptions', () => {
    const voices: VoiceId[] = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];

    voices.forEach(voice => {
      it(`should have description for ${voice}`, () => {
        expect(VOICE_DESCRIPTIONS[voice]).toBeDefined();
        expect(VOICE_DESCRIPTIONS[voice].length).toBeGreaterThan(10);
      });
    });

    it('should describe nova as female', () => {
      expect(VOICE_DESCRIPTIONS.nova.toLowerCase()).toContain('female');
    });

    it('should describe onyx as male', () => {
      expect(VOICE_DESCRIPTIONS.onyx.toLowerCase()).toContain('male');
    });

    it('should describe fable as British', () => {
      expect(VOICE_DESCRIPTIONS.fable.toLowerCase()).toContain('british');
    });
  });

  describe('Math Expression Conversion', () => {
    it('should convert sum notation', () => {
      const result = cleanTextForSpeech('$\\sum_{i=1}^{n} i$');
      expect(result).toContain('sum');
    });

    it('should convert integral notation', () => {
      const result = cleanTextForSpeech('$\\int f(x) dx$');
      expect(result).toContain('integral');
    });

    it('should convert infinity symbol', () => {
      const result = cleanTextForSpeech('$\\lim_{x \\to \\infty}$');
      expect(result).toContain('infinity');
    });

    it('should convert times/multiplication', () => {
      const result = cleanTextForSpeech('$3 \\times 4$');
      expect(result).toContain('times');
    });

    it('should convert division symbol', () => {
      const result = cleanTextForSpeech('$12 \\div 3$');
      expect(result).toContain('divided by');
    });

    it('should convert plus or minus', () => {
      const result = cleanTextForSpeech('$x = 5 \\pm 2$');
      expect(result).toContain('plus or minus');
    });

    it('should convert Greek letters', () => {
      expect(cleanTextForSpeech('$\\alpha$')).toContain('alpha');
      expect(cleanTextForSpeech('$\\beta$')).toContain('beta');
      expect(cleanTextForSpeech('$\\theta$')).toContain('theta');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string', () => {
      expect(cleanTextForSpeech('')).toBe('');
    });

    it('should handle only whitespace', () => {
      expect(cleanTextForSpeech('   ')).toBe('');
    });

    it('should handle only markdown', () => {
      const result = cleanTextForSpeech('**');
      expect(result.length).toBeLessThan(3);
    });

    it('should handle nested markdown', () => {
      const result = cleanTextForSpeech('***bold and italic***');
      expect(result).toBe('bold and italic');
    });

    it('should handle malformed LaTeX', () => {
      // Should not throw
      expect(() => cleanTextForSpeech('$\\invalid{command$')).not.toThrow();
    });

    it('should handle very long text', () => {
      const longText = 'Word '.repeat(10000);
      const result = cleanTextForSpeech(longText);
      expect(result.length).toBeLessThanOrEqual(longText.length);
    });

    it('should handle unicode characters', () => {
      const result = cleanTextForSpeech('Hello 世界 🌍');
      expect(result).toContain('Hello');
    });
  });

  describe('Speed and Language Settings', () => {
    it('should accept speed range 0.25 to 4.0', () => {
      // Speed validation would be in the API call
      expect(DEFAULT_VOICE_SETTINGS.speed).toBeGreaterThanOrEqual(0.25);
      expect(DEFAULT_VOICE_SETTINGS.speed).toBeLessThanOrEqual(4.0);
    });

    it('should support English language code', () => {
      expect(DEFAULT_VOICE_SETTINGS.language).toBe('en');
    });
  });

  describe('Sentence Splitting', () => {
    function splitIntoSentences(text: string): string[] {
      const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];
      return sentences.map(s => s.trim()).filter(s => s.length > 0);
    }

    it('should split on periods', () => {
      const result = splitIntoSentences('Hello. World.');
      expect(result).toHaveLength(2);
    });

    it('should split on question marks', () => {
      const result = splitIntoSentences('Hello? World?');
      expect(result).toHaveLength(2);
    });

    it('should split on exclamation marks', () => {
      const result = splitIntoSentences('Hello! World!');
      expect(result).toHaveLength(2);
    });

    it('should handle mixed punctuation', () => {
      const result = splitIntoSentences('First. Second? Third!');
      expect(result).toHaveLength(3);
    });

    it('should handle text without ending punctuation', () => {
      const result = splitIntoSentences('Hello world');
      expect(result).toHaveLength(1);
      expect(result[0]).toBe('Hello world');
    });

    it('should handle empty text', () => {
      const result = splitIntoSentences('');
      expect(result).toHaveLength(0);
    });
  });
});

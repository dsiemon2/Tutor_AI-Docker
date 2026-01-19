// Algebra II Lesson Content
// Comprehensive educational content for Algebra II (grades 10-11)

import { LessonContent } from '../lessonContentTypes';

export const algebraIIContent: Record<string, LessonContent> = {
  'complex-numbers': {
    intro: {
      title: 'Complex Numbers',
      description: 'Learn about imaginary and complex numbers',
      content: `# Complex Numbers

## The Imaginary Unit
$$i = \\sqrt{-1}$$
$$i^2 = -1$$

This allows us to take square roots of negative numbers!
$$\\sqrt{-9} = \\sqrt{9} \\cdot \\sqrt{-1} = 3i$$

## Powers of i
| Power | Value |
|-------|-------|
| i¹ | i |
| i² | -1 |
| i³ | -i |
| i⁴ | 1 |
| i⁵ | i (cycle repeats) |

## Complex Numbers
A **complex number** has form:
$$a + bi$$
- **a** = real part
- **b** = imaginary part

**Examples:**
- 3 + 2i (a=3, b=2)
- -1 - 4i (a=-1, b=-4)
- 5i (a=0, b=5)

## Equality
Two complex numbers are equal if both parts match.
a + bi = c + di means a = c AND b = d`,
      objectives: ['Define imaginary unit', 'Simplify powers of i', 'Identify parts of complex numbers']
    },
    practice: {
      title: 'Complex Numbers Practice',
      description: 'Practice with complex numbers',
      content: `# Complex Numbers Practice

## Simplify Square Roots
1. √-25 = ___
2. √-49 = ___
3. √-12 = ___

## Powers of i
1. i⁷ = ___
2. i¹⁰ = ___
3. i²³ = ___

## Adding Complex Numbers
(a+bi) + (c+di) = (a+c) + (b+d)i

1. (3+2i) + (1+4i) = ___
2. (5-3i) + (-2+i) = ___
3. (4+i) - (2-3i) = ___

## Multiplying
1. 3i · 4i = ___
2. (2+i)(3-2i) = ___
3. (1+i)² = ___

## Answers
Roots: 5i, 7i, 2i√3
Powers: -i, -1, -i
Add: 4+6i, 3-2i, 2+4i
Multiply: -12, 8-i, 2i`,
      objectives: ['Simplify radicals', 'Calculate powers of i', 'Perform operations']
    },
    mastery: {
      title: 'Complex Numbers Mastery',
      description: 'Master complex number operations',
      content: `# Complex Numbers Mastery

## Complex Conjugate
The conjugate of a+bi is a-bi.

$$(3+2i)(3-2i) = 9 - 4i^2 = 9 + 4 = 13$$

## Dividing Complex Numbers
Multiply by conjugate of denominator:
$$\\frac{2+i}{3-i} = \\frac{(2+i)(3+i)}{(3-i)(3+i)} = \\frac{5+5i}{10} = \\frac{1+i}{2}$$

## Absolute Value (Modulus)
$$|a+bi| = \\sqrt{a^2 + b^2}$$
$$|3+4i| = \\sqrt{9+16} = 5$$

## Practice
1. Find conjugate of 4-3i: ___
2. Divide: (1+2i)/(2-i)
3. Find |5-12i|: ___

## Complex Plane
Plot complex numbers like coordinates:
- Real axis = x-axis
- Imaginary axis = y-axis
- 3+2i is point (3, 2)

## Answers
1. 4+3i
2. 0+i = i
3. 13`,
      objectives: ['Use conjugates', 'Divide complex numbers', 'Graph on complex plane']
    }
  },

  'polynomial-functions': {
    intro: {
      title: 'Polynomial Functions',
      description: 'Explore polynomial functions and their graphs',
      content: `# Polynomial Functions

## Definition
$$f(x) = a_nx^n + a_{n-1}x^{n-1} + ... + a_1x + a_0$$

- **Degree:** Highest power of x
- **Leading coefficient:** Coefficient of highest power
- **Constant term:** a₀

## End Behavior
Based on degree (n) and leading coefficient (aₙ):

| Degree | aₙ > 0 | aₙ < 0 |
|--------|--------|--------|
| Even | ↑↑ | ↓↓ |
| Odd | ↓↑ | ↑↓ |

## Zeros and Factors
If (x-r) is a factor, then r is a zero.
$$f(x) = (x-2)(x+3) \\Rightarrow \\text{zeros: } 2, -3$$

## Multiplicity
If $(x-r)^k$ is a factor:
- **Odd k:** Graph crosses x-axis
- **Even k:** Graph touches x-axis

## Example
$f(x) = x^3 - 4x$
$= x(x^2 - 4)$
$= x(x+2)(x-2)$
Zeros: 0, -2, 2`,
      objectives: ['Identify polynomial characteristics', 'Determine end behavior', 'Find zeros']
    },
    practice: {
      title: 'Polynomial Functions Practice',
      description: 'Practice analyzing polynomials',
      content: `# Polynomial Functions Practice

## Identify Degree and Leading Coefficient
1. f(x) = 3x⁴ - 2x² + 1
2. g(x) = -x⁵ + 4x³
3. h(x) = 2 - 3x + x²

## End Behavior
Describe the ends:
1. f(x) = x³ + 2x
2. g(x) = -2x⁴ + x²
3. h(x) = -x⁵ + 3

## Find Zeros
1. f(x) = x² - 9
2. g(x) = x³ - 4x
3. h(x) = (x+1)(x-2)²

## From Zeros to Polynomial
Write polynomial with zeros:
1. x = 2, x = -3
2. x = 0, x = 1, x = -1

## Answers
Degree/LC: (4,3), (5,-1), (2,1)
End: ↓↑, ↓↓, ↑↓
Zeros: ±3; 0,±2; -1,2
Polynomials: (x-2)(x+3), x(x-1)(x+1)`,
      objectives: ['Analyze polynomials', 'Determine end behavior', 'Connect zeros and factors']
    },
    mastery: {
      title: 'Polynomial Functions Mastery',
      description: 'Master polynomial analysis',
      content: `# Polynomial Functions Mastery

## Rational Root Theorem
Possible rational roots of $a_nx^n + ... + a_0$ are:
$$\\pm \\frac{\\text{factors of } a_0}{\\text{factors of } a_n}$$

## Synthetic Division
Fast way to divide by (x - c).

**Example:** $(x^3 + 2x^2 - 5x + 2) ÷ (x - 1)$

## Factor Theorem
If f(c) = 0, then (x-c) is a factor.

## Fundamental Theorem of Algebra
Degree n polynomial has exactly n zeros (counting multiplicity and complex).

## Practice
1. Find possible rational roots: x³ + 2x² - 5x - 6
2. Use synthetic division: (x³ - 6x² + 11x - 6) ÷ (x - 1)
3. Given f(x) = x³ - 3x² - 4x + 12, verify x=2 is a zero and factor completely.

## Answers
1. ±1, ±2, ±3, ±6
2. x² - 5x + 6 = (x-2)(x-3)
3. f(2) = 0, f(x) = (x-2)(x+2)(x-3)`,
      objectives: ['Apply rational root theorem', 'Use synthetic division', 'Factor higher degree polynomials']
    }
  },

  'rational-expressions': {
    intro: {
      title: 'Rational Expressions',
      description: 'Learn to work with rational expressions',
      content: `# Rational Expressions

## Definition
A rational expression is a fraction with polynomials:
$$\\frac{P(x)}{Q(x)}$$

## Domain Restrictions
The denominator cannot equal zero!

$$\\frac{x+1}{x-3}$$
Domain: all real x except x = 3

## Simplifying
Factor and cancel common factors.
$$\\frac{x^2-4}{x+2} = \\frac{(x+2)(x-2)}{x+2} = x-2$$
(x ≠ -2)

## Multiplying
$$\\frac{A}{B} \\cdot \\frac{C}{D} = \\frac{AC}{BD}$$

Factor first, then cancel.

## Dividing
Multiply by reciprocal:
$$\\frac{A}{B} ÷ \\frac{C}{D} = \\frac{A}{B} \\cdot \\frac{D}{C}$$`,
      objectives: ['Define rational expressions', 'Find domain restrictions', 'Simplify expressions']
    },
    practice: {
      title: 'Rational Expressions Practice',
      description: 'Practice with rational expressions',
      content: `# Rational Expressions Practice

## Find Restrictions
1. (x+5)/(x-2): x ≠ ___
2. (3x)/(x²-9): x ≠ ___
3. (x+1)/(x²+5x+6): x ≠ ___

## Simplify
1. (x²-9)/(x+3)
2. (x²+4x)/(x²+x-12)
3. (2x²-8)/(x²-4)

## Multiply
1. (x/3) · (6/x²)
2. ((x+2)/(x-1)) · ((x-1)/(x+2)²)

## Divide
1. (x²/4) ÷ (x/8)
2. ((x+1)/(x-2)) ÷ ((x+1)/(x+3))

## Answers
Restrictions: 2; ±3; -2,-3
Simplify: x-3; x/(x-3); 2
Multiply: 2/x; 1/(x+2)
Divide: 2x; (x+3)/(x-2)`,
      objectives: ['Identify restrictions', 'Simplify expressions', 'Perform operations']
    },
    mastery: {
      title: 'Rational Expressions Mastery',
      description: 'Master complex rational expressions',
      content: `# Rational Expressions Mastery

## Adding/Subtracting
Need common denominator!
$$\\frac{2}{x} + \\frac{3}{x+1} = \\frac{2(x+1) + 3x}{x(x+1)} = \\frac{5x+2}{x(x+1)}$$

## Complex Fractions
$$\\frac{\\frac{1}{x} + 1}{\\frac{1}{x} - 1}$$

Multiply top and bottom by LCD (x):
$$= \\frac{1 + x}{1 - x}$$

## Practice
1. Add: 3/(x-1) + 2/(x+2)
2. Subtract: x/(x+3) - 2/(x-1)
3. Simplify: (1 + 1/x)/(1 - 1/x)

## Solving Rational Equations
$$\\frac{2}{x} + 3 = \\frac{5}{x}$$
Multiply by x: 2 + 3x = 5
x = 1

Always check for extraneous solutions!

## Answers
1. (5x+4)/((x-1)(x+2))
2. (x²-5x-6)/((x+3)(x-1))
3. (x+1)/(x-1)`,
      objectives: ['Add and subtract rationals', 'Simplify complex fractions', 'Solve rational equations']
    }
  },

  'exponential-functions': {
    intro: {
      title: 'Exponential Functions',
      description: 'Explore exponential growth and decay',
      content: `# Exponential Functions

## Definition
$$f(x) = a \\cdot b^x$$
- **a** = initial value
- **b** = base (growth/decay factor)
- **x** = exponent (often time)

## Growth vs Decay
- **Growth:** b > 1 (increasing)
- **Decay:** 0 < b < 1 (decreasing)

## Properties of y = bˣ
- Domain: All real numbers
- Range: y > 0
- y-intercept: (0, 1)
- Horizontal asymptote: y = 0

## Growth/Decay Models
$$A = P(1 + r)^t$$ (growth)
$$A = P(1 - r)^t$$ (decay)

## Natural Base e
$$e \\approx 2.71828...$$
$$f(x) = e^x$$ (natural exponential)

## Compound Interest
$$A = P(1 + \\frac{r}{n})^{nt}$$
Continuous: $A = Pe^{rt}$`,
      objectives: ['Define exponential functions', 'Distinguish growth from decay', 'Apply to real situations']
    },
    practice: {
      title: 'Exponential Functions Practice',
      description: 'Practice with exponential functions',
      content: `# Exponential Functions Practice

## Growth or Decay?
1. f(x) = 2ˣ: ___
2. g(x) = (0.5)ˣ: ___
3. h(x) = 3·(1.05)ˣ: ___

## Evaluate
1. f(x) = 2ˣ, find f(3): ___
2. g(x) = 100(0.9)ˣ, find g(2): ___
3. h(x) = 5·eˣ, find h(0): ___

## Applications
1. Population starts at 1000, grows 5% per year.
   Write the model: P(t) = ___
   Population after 3 years: ___

2. Car worth $20,000 loses 15% value yearly.
   Write the model: V(t) = ___
   Value after 4 years: ___

## Compound Interest
$5000 at 6% compounded quarterly for 2 years.
A = ___

## Answers
Type: growth, decay, growth
Evaluate: 8, 81, 5
Population: 1000(1.05)ᵗ, ≈1158
Car: 20000(0.85)ᵗ, ≈$10,437
Interest: ≈$5,634`,
      objectives: ['Identify function type', 'Evaluate functions', 'Model real situations']
    },
    mastery: {
      title: 'Exponential Functions Mastery',
      description: 'Master exponential applications',
      content: `# Exponential Functions Mastery

## Half-Life Formula
$$A = A_0(\\frac{1}{2})^{t/h}$$
- h = half-life
- t = time elapsed

## Doubling Time
$$A = A_0 \\cdot 2^{t/d}$$
- d = doubling time

## Practice
1. A substance has half-life 5 years. Starting with 100g, how much remains after 15 years?

2. Bacteria double every 3 hours. Starting with 500, how many after 12 hours?

## Solving Exponential Equations
If bases match: $2^x = 2^5 \\Rightarrow x = 5$

If bases don't match, use logarithms:
$3^x = 20$
$x = \\log_3(20) \\approx 2.73$

## Transformations
$y = a \\cdot b^{x-h} + k$
- Vertical stretch by a
- Shift right h units
- Shift up k units

## Answers
1. 100(1/2)³ = 12.5g
2. 500·2⁴ = 8000 bacteria`,
      objectives: ['Apply half-life/doubling', 'Solve exponential equations', 'Transform functions']
    }
  },

  'logarithms': {
    intro: {
      title: 'Logarithms',
      description: 'Learn about logarithmic functions',
      content: `# Logarithms

## Definition
$$\\log_b(x) = y \\Leftrightarrow b^y = x$$
"Log base b of x equals y"

**Example:**
$\\log_2(8) = 3$ because $2^3 = 8$

## Common Logarithms
- $\\log(x) = \\log_{10}(x)$
- $\\ln(x) = \\log_e(x)$ (natural log)

## Basic Properties
| Property | Example |
|----------|---------|
| $\\log_b(1) = 0$ | $\\log_5(1) = 0$ |
| $\\log_b(b) = 1$ | $\\log_3(3) = 1$ |
| $\\log_b(b^x) = x$ | $\\log_2(2^5) = 5$ |
| $b^{\\log_b(x)} = x$ | $10^{\\log(5)} = 5$ |

## Inverse Functions
$y = b^x$ and $y = \\log_b(x)$ are inverses.

## Domain and Range
For $y = \\log_b(x)$:
- Domain: x > 0
- Range: All real numbers`,
      objectives: ['Define logarithms', 'Convert between forms', 'Understand basic properties']
    },
    practice: {
      title: 'Logarithms Practice',
      description: 'Practice with logarithms',
      content: `# Logarithms Practice

## Convert to Exponential Form
1. log₂(16) = 4 → ___
2. log₃(81) = 4 → ___
3. ln(e) = 1 → ___

## Convert to Logarithmic Form
1. 5² = 25 → ___
2. 10³ = 1000 → ___
3. e⁰ = 1 → ___

## Evaluate
1. log₂(32) = ___
2. log₃(27) = ___
3. log(100) = ___
4. ln(e⁴) = ___

## Find x
1. log₂(x) = 5
2. logₓ(49) = 2
3. log₅(125) = x

## Answers
Exponential: 2⁴=16, 3⁴=81, e¹=e
Logarithmic: log₅(25)=2, log(1000)=3, ln(1)=0
Evaluate: 5, 3, 2, 4
Find x: 32, 7, 3`,
      objectives: ['Convert forms', 'Evaluate logarithms', 'Solve basic log equations']
    },
    mastery: {
      title: 'Logarithms Mastery',
      description: 'Master logarithm properties and applications',
      content: `# Logarithms Mastery

## Product Rule
$$\\log_b(MN) = \\log_b(M) + \\log_b(N)$$

## Quotient Rule
$$\\log_b(\\frac{M}{N}) = \\log_b(M) - \\log_b(N)$$

## Power Rule
$$\\log_b(M^p) = p \\cdot \\log_b(M)$$

## Change of Base
$$\\log_b(x) = \\frac{\\log(x)}{\\log(b)} = \\frac{\\ln(x)}{\\ln(b)}$$

## Practice - Expand
1. log(xy²) = ___
2. ln(x/y³) = ___
3. log₂(x³√y) = ___

## Practice - Condense
1. log(x) + 2log(y) = ___
2. 3ln(x) - ln(y) = ___

## Solve
1. log(x) + log(x-3) = 1
2. 2ˣ = 10

## Answers
Expand: log(x)+2log(y), ln(x)-3ln(y), 3log₂(x)+½log₂(y)
Condense: log(xy²), ln(x³/y)
Solve: x=5, x=log₂(10)≈3.32`,
      objectives: ['Apply log properties', 'Expand and condense', 'Solve logarithmic equations']
    }
  },

  'sequences-series': {
    intro: {
      title: 'Sequences and Series',
      description: 'Learn about arithmetic and geometric patterns',
      content: `# Sequences and Series

## Sequence vs Series
- **Sequence:** Ordered list of numbers
- **Series:** Sum of sequence terms

## Arithmetic Sequences
Constant difference between terms.
$$a_n = a_1 + (n-1)d$$
- a₁ = first term
- d = common difference

**Example:** 2, 5, 8, 11, ...
d = 3, aₙ = 2 + (n-1)3 = 3n - 1

## Geometric Sequences
Constant ratio between terms.
$$a_n = a_1 \\cdot r^{n-1}$$
- r = common ratio

**Example:** 3, 6, 12, 24, ...
r = 2, aₙ = 3 · 2ⁿ⁻¹

## Arithmetic Series Sum
$$S_n = \\frac{n(a_1 + a_n)}{2}$$

## Geometric Series Sum
$$S_n = \\frac{a_1(1-r^n)}{1-r}$$`,
      objectives: ['Distinguish arithmetic from geometric', 'Find nth term', 'Calculate series sums']
    },
    practice: {
      title: 'Sequences and Series Practice',
      description: 'Practice with sequences and series',
      content: `# Sequences and Series Practice

## Arithmetic or Geometric?
1. 4, 7, 10, 13, ...: ___
2. 2, 6, 18, 54, ...: ___
3. 100, 50, 25, 12.5, ...: ___

## Find the Pattern
1. 5, 9, 13, 17, ... Find d: ___, a₁₀: ___
2. 3, 12, 48, ... Find r: ___, a₆: ___

## Write the Formula
1. Arithmetic: a₁ = 2, d = 5. aₙ = ___
2. Geometric: a₁ = 4, r = 3. aₙ = ___

## Find the Sum
1. Arithmetic: First 10 terms of 2, 5, 8, 11, ...
2. Geometric: First 5 terms of 1, 2, 4, 8, ...

## Answers
Type: Arith, Geo, Geo
Pattern: d=4, a₁₀=41; r=4, a₆=3072
Formula: 5n-3; 4·3ⁿ⁻¹
Sums: 155; 31`,
      objectives: ['Identify sequence types', 'Find terms', 'Calculate sums']
    },
    mastery: {
      title: 'Sequences and Series Mastery',
      description: 'Master advanced sequence concepts',
      content: `# Sequences and Series Mastery

## Infinite Geometric Series
If |r| < 1, the sum converges:
$$S_\\infty = \\frac{a_1}{1-r}$$

**Example:** 1 + ½ + ¼ + ⅛ + ...
$$S = \\frac{1}{1-0.5} = 2$$

## Sigma Notation
$$\\sum_{n=1}^{5} 2n = 2+4+6+8+10 = 30$$

## Practice
1. Find sum: 8 + 4 + 2 + 1 + ½ + ...
2. Write in sigma: 1 + 4 + 9 + 16 + 25
3. Evaluate: Σ(3n-1) from n=1 to 4

## Recursive Formulas
Define each term from previous:
$$a_1 = 2, a_n = a_{n-1} + 3$$
Gives: 2, 5, 8, 11, ...

## Fibonacci Sequence
$$F_1 = 1, F_2 = 1, F_n = F_{n-1} + F_{n-2}$$
1, 1, 2, 3, 5, 8, 13, 21, ...

## Answers
1. S = 8/(1-0.5) = 16
2. Σn² from n=1 to 5
3. 2+5+8+11 = 26`,
      objectives: ['Find infinite sums', 'Use sigma notation', 'Work with recursive formulas']
    }
  }
};

export default algebraIIContent;

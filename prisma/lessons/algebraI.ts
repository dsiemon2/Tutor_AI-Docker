// Algebra I Lesson Content
// Comprehensive educational content for Algebra I (grades 8-9)

import { LessonContent } from '../lessonContentTypes';

export const algebraIContent: Record<string, LessonContent> = {
  'variables-expressions': {
    intro: {
      title: 'Variables and Expressions',
      description: 'Learn about variables and algebraic expressions',
      content: `# Variables and Expressions

## What is a Variable?
A **variable** is a letter that represents an unknown number.
- Common variables: x, y, z, n, a, b
- Example: In x + 5 = 12, x is the variable

## What is an Expression?
An **algebraic expression** combines numbers, variables, and operations.

### Parts of an Expression
$$3x + 7$$
- **Coefficient:** 3 (number multiplied by variable)
- **Variable:** x
- **Constant:** 7 (number without variable)
- **Term:** Parts separated by + or - (3x and 7 are terms)

## Writing Expressions
| Words | Expression |
|-------|------------|
| 5 more than x | x + 5 |
| 3 less than y | y - 3 |
| twice a number n | 2n |
| a number divided by 4 | n ÷ 4 or n/4 |

## Evaluating Expressions
To evaluate, substitute the value for the variable.

**Example:** Evaluate 2x + 3 when x = 4
$$2(4) + 3 = 8 + 3 = 11$$`,
      objectives: ['Define variables and expressions', 'Identify parts of expressions', 'Evaluate expressions']
    },
    practice: {
      title: 'Variables and Expressions Practice',
      description: 'Practice working with algebraic expressions',
      content: `# Variables Practice

## Identify the Parts
For 5x - 9:
- Coefficient: ___
- Variable: ___
- Constant: ___

## Write as Expressions
1. Seven more than a number n: ___
2. A number y decreased by 4: ___
3. Triple a number x: ___
4. A number divided by 6: ___
5. Five less than twice a number: ___

## Evaluate
Find the value when x = 3:
1. x + 8 = ___
2. 2x - 1 = ___
3. 4x + 5 = ___
4. x² = ___
5. 3x - 7 = ___

## Like Terms
Circle the like terms:
3x, 5y, 2x, 7, 8x, 4

## Answers
Parts: 5, x, -9
Expressions: n+7, y-4, 3x, n/6, 2n-5
Evaluate: 11, 5, 17, 9, 2
Like terms: 3x, 2x, 8x`,
      objectives: ['Identify expression components', 'Translate words to expressions', 'Evaluate given values']
    },
    mastery: {
      title: 'Variables and Expressions Mastery',
      description: 'Master algebraic expressions',
      content: `# Expressions Mastery

## Combining Like Terms
$$3x + 5x = 8x$$
$$4y - 2y + 3 = 2y + 3$$
$$2x + 3y + 5x - y = 7x + 2y$$

## Simplify
1. 6x + 2x - 3x = ___
2. 4a + 7 - 2a + 3 = ___
3. 3m + 2n - m + 5n = ___

## Distributive Property
$$a(b + c) = ab + ac$$

**Example:** 3(x + 4) = 3x + 12

Simplify:
1. 2(x + 5) = ___
2. 4(y - 3) = ___
3. -2(3x + 1) = ___

## Real-World Problems
Write and evaluate:
The cost of a movie ticket is $12 plus $5 for popcorn per person. Write an expression for p people and find the cost for 4 people.

Expression: ___
Cost for 4: ___

## Answers
Simplify: 5x, 2a+10, 2m+7n
Distributive: 2x+10, 4y-12, -6x-2
Real-world: 12p + 5p = 17p (or 17p), $68`,
      objectives: ['Combine like terms', 'Apply distributive property', 'Model real situations']
    }
  },

  'linear-equations': {
    intro: {
      title: 'Linear Equations',
      description: 'Learn to solve linear equations',
      content: `# Linear Equations

## What is a Linear Equation?
A **linear equation** has variables with power of 1.
$$ax + b = c$$

## Solving One-Step Equations
**Goal:** Get the variable alone!

### Addition/Subtraction
$$x + 5 = 12$$
$$x + 5 - 5 = 12 - 5$$
$$x = 7$$

### Multiplication/Division
$$3x = 15$$
$$\\frac{3x}{3} = \\frac{15}{3}$$
$$x = 5$$

## Solving Two-Step Equations
$$2x + 3 = 11$$

Step 1: Subtract 3
$$2x = 8$$

Step 2: Divide by 2
$$x = 4$$

## Checking Solutions
Substitute back into original:
$$2(4) + 3 = 8 + 3 = 11$$ ✓

## The Golden Rule
Whatever you do to one side, do to the other!`,
      objectives: ['Understand linear equations', 'Solve one and two-step equations', 'Check solutions']
    },
    practice: {
      title: 'Linear Equations Practice',
      description: 'Practice solving equations',
      content: `# Equations Practice

## One-Step Equations
Solve:
1. x + 7 = 15
2. y - 4 = 9
3. 5m = 35
4. n/3 = 6
5. x - 12 = 20

## Two-Step Equations
Solve:
1. 2x + 5 = 13
2. 3y - 7 = 14
3. 4x + 9 = 25
4. 5n - 3 = 22
5. 2x + 8 = 20

## Check Your Work
Solve and check: 3x - 4 = 11
x = ___
Check: 3(___) - 4 = ___

## Word Problems
A number doubled plus 6 equals 18. What is the number?
Equation: ___
Solution: ___

## Answers
One-step: 8, 13, 7, 18, 32
Two-step: 4, 7, 4, 5, 6
Check: x=5, 3(5)-4=11 ✓
Word: 2x+6=18, x=6`,
      objectives: ['Solve various equation types', 'Verify solutions', 'Write equations from words']
    },
    mastery: {
      title: 'Linear Equations Mastery',
      description: 'Master linear equations',
      content: `# Equations Mastery

## Variables on Both Sides
$$5x + 3 = 2x + 12$$

Step 1: Get variables on one side
$$5x - 2x + 3 = 12$$
$$3x + 3 = 12$$

Step 2: Solve
$$3x = 9$$
$$x = 3$$

## Practice
1. 4x + 2 = x + 11
2. 6y - 5 = 2y + 7
3. 3n + 8 = n + 16

## Equations with Parentheses
$$2(x + 4) = 14$$
$$2x + 8 = 14$$
$$2x = 6$$
$$x = 3$$

Solve:
1. 3(x - 2) = 12
2. 4(y + 1) = 20
3. 2(3x - 5) = 8

## Special Cases
- **No solution:** 2x + 3 = 2x + 5 (contradiction)
- **Infinite solutions:** 2x + 4 = 2(x + 2) (identity)

## Answers
Both sides: 3, 3, 4
Parentheses: 6, 4, 3`,
      objectives: ['Solve complex equations', 'Handle special cases', 'Apply equation solving']
    }
  },

  'inequalities': {
    intro: {
      title: 'Inequalities',
      description: 'Learn to solve and graph inequalities',
      content: `# Inequalities

## Inequality Symbols
| Symbol | Meaning |
|--------|---------|
| < | Less than |
| > | Greater than |
| ≤ | Less than or equal to |
| ≥ | Greater than or equal to |
| ≠ | Not equal to |

## Writing Inequalities
- x > 5: "x is greater than 5"
- y ≤ 3: "y is at most 3"
- n ≥ 10: "n is at least 10"

## Graphing on a Number Line
- **Open circle (○):** < or > (not included)
- **Closed circle (●):** ≤ or ≥ (included)

x > 3: ○───────→
x ≤ 2: ←───────●

## Solving Inequalities
Same as equations, BUT flip the sign when multiplying/dividing by negative!

$$x + 4 > 7$$
$$x > 3$$

$$-2x ≤ 6$$
$$x ≥ -3$$ (sign flipped!)`,
      objectives: ['Understand inequality symbols', 'Graph inequalities', 'Solve inequalities']
    },
    practice: {
      title: 'Inequalities Practice',
      description: 'Practice solving inequalities',
      content: `# Inequalities Practice

## Write the Inequality
1. x is at least 5: ___
2. y is less than 10: ___
3. n is no more than 7: ___
4. a is greater than -2: ___

## Solve and Graph
1. x + 3 > 8
2. y - 5 ≤ 2
3. 2x < 10
4. n/4 ≥ 3

## Flip the Sign?
Solve (watch for negatives!):
1. -3x > 12
2. -y ≤ 5
3. x/-2 > 4

## True or False
If x > 5, is x = 6 a solution? ___
If y ≤ 3, is y = 3 a solution? ___
If n < -2, is n = -1 a solution? ___

## Answers
Write: x≥5, y<10, n≤7, a>-2
Solve: x>5, y≤7, x<5, n≥12
Flip: x<-4, y≥-5, x<-8
T/F: True, True, False`,
      objectives: ['Write inequalities from words', 'Solve and graph', 'Check solutions']
    },
    mastery: {
      title: 'Inequalities Mastery',
      description: 'Master inequality concepts',
      content: `# Inequalities Mastery

## Multi-Step Inequalities
$$3x + 5 > 14$$
$$3x > 9$$
$$x > 3$$

$$4 - 2x ≤ 10$$
$$-2x ≤ 6$$
$$x ≥ -3$$ (flipped!)

## Compound Inequalities
**AND:** Both must be true
$$2 < x < 5$$ (x is between 2 and 5)

**OR:** At least one true
$$x < -1$$ OR $$x > 4$$

## Practice
1. 5x - 3 ≤ 17
2. 2(x + 1) > 8
3. -4x + 7 < 3
4. Solve: -2 ≤ x + 3 < 7

## Real-World
You need at least $50 for a concert. You have $20 and earn $6/hour.
Write and solve an inequality for hours (h) needed.

Inequality: ___
Solution: ___

## Answers
1. x≤4
2. x>3
3. x>1
4. -5≤x<4
Real: 20+6h≥50, h≥5`,
      objectives: ['Solve complex inequalities', 'Work with compound inequalities', 'Apply to real situations']
    }
  },

  'graphing-linear': {
    intro: {
      title: 'Graphing Linear Equations',
      description: 'Learn to graph lines on the coordinate plane',
      content: `# Graphing Linear Equations

## The Coordinate Plane
- **x-axis:** Horizontal
- **y-axis:** Vertical
- **Origin:** (0, 0)
- **Quadrants:** I, II, III, IV

## Plotting Points
Point (x, y): Go x units right/left, y units up/down
- (3, 2): Right 3, Up 2
- (-2, 4): Left 2, Up 4

## Slope-Intercept Form
$$y = mx + b$$
- **m** = slope (steepness)
- **b** = y-intercept (where line crosses y-axis)

## Finding Slope
$$m = \\frac{rise}{run} = \\frac{y_2 - y_1}{x_2 - x_1}$$

Between (1, 2) and (3, 6):
$$m = \\frac{6-2}{3-1} = \\frac{4}{2} = 2$$

## Graphing a Line
For y = 2x + 1:
1. Plot y-intercept (0, 1)
2. Use slope: up 2, right 1
3. Plot second point (1, 3)
4. Draw line through points`,
      objectives: ['Plot points', 'Find slope', 'Graph using slope-intercept form']
    },
    practice: {
      title: 'Graphing Practice',
      description: 'Practice graphing lines',
      content: `# Graphing Practice

## Identify Slope and Y-Intercept
1. y = 3x + 2: m = ___, b = ___
2. y = -2x + 5: m = ___, b = ___
3. y = x - 4: m = ___, b = ___
4. y = -½x + 1: m = ___, b = ___

## Find the Slope
Between the points:
1. (0, 0) and (2, 4): m = ___
2. (1, 3) and (4, 9): m = ___
3. (2, 5) and (4, 1): m = ___

## Make a Table
For y = 2x - 1, complete:
| x | y |
|---|---|
| 0 | ___ |
| 1 | ___ |
| 2 | ___ |

## Match the Line
Which equation passes through (0, 3)?
a) y = 2x + 3
b) y = x + 1
c) y = 3x

## Answers
Slope/intercept: (3,2), (-2,5), (1,-4), (-½,1)
Slopes: 2, 2, -2
Table: -1, 1, 3
Match: a`,
      objectives: ['Identify slope and intercept', 'Calculate slope', 'Create tables of values']
    },
    mastery: {
      title: 'Graphing Mastery',
      description: 'Master linear graphing',
      content: `# Graphing Mastery

## Standard Form
$$Ax + By = C$$

To graph: Find intercepts!
- x-intercept: Set y = 0, solve for x
- y-intercept: Set x = 0, solve for y

**Example:** 2x + 3y = 6
- x-int: (3, 0)
- y-int: (0, 2)

## Horizontal & Vertical Lines
- **y = 3:** Horizontal line through (0, 3)
- **x = -2:** Vertical line through (-2, 0)

## Parallel & Perpendicular
- **Parallel:** Same slope (m₁ = m₂)
- **Perpendicular:** Negative reciprocal slopes (m₁ · m₂ = -1)

## Practice
1. Find intercepts: 4x + 2y = 8
2. Write equation of line through (0, 4) with m = -3
3. Is y = 2x + 1 parallel to y = 2x - 5?
4. Write equation perpendicular to y = 2x with same y-int (0)

## Answers
1. x-int (2,0), y-int (0,4)
2. y = -3x + 4
3. Yes (same slope)
4. y = -½x`,
      objectives: ['Graph standard form', 'Identify parallel/perpendicular', 'Write equations']
    }
  },

  'systems-equations': {
    intro: {
      title: 'Systems of Equations',
      description: 'Learn to solve systems of equations',
      content: `# Systems of Equations

## What is a System?
Two or more equations with the same variables.

$$x + y = 5$$
$$x - y = 1$$

The **solution** is values that work in BOTH equations.

## Solving by Graphing
Graph both lines - the intersection is the solution!

## Solving by Substitution
1. Solve one equation for a variable
2. Substitute into the other equation
3. Solve and back-substitute

**Example:**
$$y = x + 2$$
$$2x + y = 8$$

Substitute: 2x + (x + 2) = 8
$$3x + 2 = 8$$
$$x = 2$$

Then: y = 2 + 2 = 4
**Solution:** (2, 4)

## Checking
x + y = 5: 2 + 4 = 6 ✗
Wait - let me recheck the original!`,
      objectives: ['Define systems of equations', 'Solve by graphing', 'Solve by substitution']
    },
    practice: {
      title: 'Systems Practice',
      description: 'Practice solving systems',
      content: `# Systems Practice

## Substitution Method
Solve:
1. y = x + 1
   x + y = 7

2. y = 2x
   x + y = 9

3. x = y - 3
   2x + y = 9

## Is It a Solution?
Is (2, 3) a solution to:
x + y = 5 ___
2x - y = 1 ___
Both? ___

## Set Up the System
Two numbers: sum is 12, difference is 4.
Let x = larger, y = smaller.
Equation 1: ___
Equation 2: ___
Solution: x = ___, y = ___

## Answers
1. x=3, y=4
2. x=3, y=6
3. x=2, y=5
Solution check: Yes, Yes, Yes
System: x+y=12, x-y=4, x=8, y=4`,
      objectives: ['Apply substitution method', 'Verify solutions', 'Set up word problems']
    },
    mastery: {
      title: 'Systems Mastery',
      description: 'Master systems of equations',
      content: `# Systems Mastery

## Elimination Method
Add/subtract to eliminate a variable.

$$2x + y = 7$$
$$x - y = 2$$

Add equations:
$$3x = 9$$
$$x = 3$$

Substitute: 3 - y = 2, so y = 1
**Solution:** (3, 1)

## Practice
1. x + y = 6
   x - y = 2

2. 2x + 3y = 12
   2x - 3y = 0

3. 3x + 2y = 11
   x + 2y = 5

## Special Cases
- **No solution:** Parallel lines (never intersect)
- **Infinite solutions:** Same line

## Application
Movie tickets: Adult $10, Child $6
Total 5 tickets cost $38.
How many of each?

a + c = 5
10a + 6c = 38

## Answers
1. x=4, y=2
2. x=3, y=2
3. x=3, y=1
Application: 2 adults, 3 children`,
      objectives: ['Use elimination method', 'Recognize special cases', 'Solve applications']
    }
  },

  'polynomials': {
    intro: {
      title: 'Polynomials',
      description: 'Learn about polynomial expressions',
      content: `# Polynomials

## What is a Polynomial?
A polynomial is a sum of terms with:
- Variables with whole number exponents
- Real number coefficients

**Examples:**
- $3x^2 + 2x - 5$ (trinomial - 3 terms)
- $4x - 7$ (binomial - 2 terms)
- $5x^3$ (monomial - 1 term)

## Degree of a Polynomial
The **degree** is the highest exponent.

| Polynomial | Degree | Name |
|------------|--------|------|
| 5 | 0 | Constant |
| 3x + 1 | 1 | Linear |
| x² + 2x | 2 | Quadratic |
| x³ - x | 3 | Cubic |

## Adding Polynomials
Combine like terms!
$$(3x^2 + 2x) + (x^2 - 5x) = 4x^2 - 3x$$

## Subtracting Polynomials
Distribute the negative, then combine.
$$(3x^2 + 2x) - (x^2 - 5x)$$
$$= 3x^2 + 2x - x^2 + 5x$$
$$= 2x^2 + 7x$$`,
      objectives: ['Identify polynomials', 'Find degree', 'Add and subtract polynomials']
    },
    practice: {
      title: 'Polynomials Practice',
      description: 'Practice polynomial operations',
      content: `# Polynomials Practice

## Classify
Name each polynomial:
1. 5x³ - 2x + 1: ___
2. 7x²: ___
3. x - 9: ___

## Find the Degree
1. 4x² + 3x - 7: ___
2. 5x⁴ - x² + 2: ___
3. 8: ___

## Add
1. (2x² + 3x) + (x² - x)
2. (4x³ - 2x + 1) + (x³ + 5x - 3)
3. (x² + 2x + 1) + (3x² - x + 4)

## Subtract
1. (5x² + 2x) - (2x² + x)
2. (3x³ - x + 4) - (x³ + 2x - 1)
3. (4x² - 3x + 2) - (x² + x - 5)

## Answers
Classify: trinomial, monomial, binomial
Degree: 2, 4, 0
Add: 3x²+2x, 5x³+3x-2, 4x²+x+5
Subtract: 3x²+x, 2x³-3x+5, 3x²-4x+7`,
      objectives: ['Classify polynomials', 'Determine degree', 'Perform operations']
    },
    mastery: {
      title: 'Polynomials Mastery',
      description: 'Master polynomial operations',
      content: `# Polynomials Mastery

## Multiplying Monomials
$$3x^2 \\cdot 4x^3 = 12x^5$$

## Multiplying by Monomial
$$2x(3x^2 + 4x - 1) = 6x^3 + 8x^2 - 2x$$

## FOIL Method (Binomials)
$$(x + 3)(x + 2)$$
- **F**irst: x · x = x²
- **O**uter: x · 2 = 2x
- **I**nner: 3 · x = 3x
- **L**ast: 3 · 2 = 6
$$= x^2 + 5x + 6$$

## Practice
1. (x + 4)(x + 5)
2. (x - 2)(x + 3)
3. (2x + 1)(x - 4)
4. (x + 3)²

## Special Products
- $(a+b)^2 = a^2 + 2ab + b^2$
- $(a-b)^2 = a^2 - 2ab + b^2$
- $(a+b)(a-b) = a^2 - b^2$

## Answers
1. x²+9x+20
2. x²+x-6
3. 2x²-7x-4
4. x²+6x+9`,
      objectives: ['Multiply polynomials', 'Apply FOIL', 'Use special products']
    }
  },

  'factoring': {
    intro: {
      title: 'Factoring',
      description: 'Learn to factor polynomial expressions',
      content: `# Factoring

## What is Factoring?
Factoring is the reverse of multiplying - breaking apart into factors.

$$6 = 2 \\times 3$$
$$x^2 + 5x + 6 = (x + 2)(x + 3)$$

## Greatest Common Factor (GCF)
Always look for GCF first!

$$6x^2 + 9x = 3x(2x + 3)$$

## Factoring x² + bx + c
Find two numbers that:
- Multiply to c
- Add to b

**Example:** $x^2 + 7x + 12$
- Need: multiply to 12, add to 7
- Numbers: 3 and 4
- Answer: $(x + 3)(x + 4)$

## Check by FOIL
$(x + 3)(x + 4) = x^2 + 4x + 3x + 12 = x^2 + 7x + 12$ ✓`,
      objectives: ['Understand factoring', 'Find GCF', 'Factor trinomials']
    },
    practice: {
      title: 'Factoring Practice',
      description: 'Practice factoring polynomials',
      content: `# Factoring Practice

## Factor Out GCF
1. 4x + 8 = ___
2. 3x² + 6x = ___
3. 10x³ - 5x² = ___

## Factor x² + bx + c
Find the numbers:
1. x² + 5x + 6
   Multiply to ___, add to ___
   Factor: ___

2. x² + 8x + 15
3. x² + 7x + 10
4. x² - 5x + 6

## With Negatives
1. x² - 7x + 12
2. x² + 2x - 15
3. x² - x - 12

## Check Your Work
Factor x² + 9x + 20, then verify by FOIL.

## Answers
GCF: 4(x+2), 3x(x+2), 5x²(2x-1)
Trinomials: (x+2)(x+3), (x+3)(x+5), (x+2)(x+5), (x-2)(x-3)
Negatives: (x-3)(x-4), (x+5)(x-3), (x-4)(x+3)
Check: (x+4)(x+5)`,
      objectives: ['Factor out GCF', 'Factor trinomials', 'Handle negative coefficients']
    },
    mastery: {
      title: 'Factoring Mastery',
      description: 'Master advanced factoring',
      content: `# Factoring Mastery

## Factoring ax² + bx + c (a ≠ 1)
**AC Method:**
1. Multiply a · c
2. Find factors that add to b
3. Rewrite and factor by grouping

**Example:** $2x^2 + 7x + 3$
- a·c = 6
- Need factors of 6 that add to 7: 1 and 6
- Rewrite: $2x^2 + x + 6x + 3$
- Group: $x(2x+1) + 3(2x+1)$
- Factor: $(2x+1)(x+3)$

## Special Factoring
- **Difference of squares:** $a^2 - b^2 = (a+b)(a-b)$
- **Perfect square:** $a^2 + 2ab + b^2 = (a+b)^2$

## Practice
1. 3x² + 10x + 3
2. 2x² + 5x - 3
3. x² - 16 (diff. of squares)
4. x² + 10x + 25 (perfect square)

## Factor Completely
$2x^3 - 8x = 2x(x^2 - 4) = 2x(x+2)(x-2)$

## Answers
1. (3x+1)(x+3)
2. (2x-1)(x+3)
3. (x+4)(x-4)
4. (x+5)²`,
      objectives: ['Factor when a≠1', 'Use special patterns', 'Factor completely']
    }
  },

  'quadratic-equations': {
    intro: {
      title: 'Quadratic Equations',
      description: 'Learn to solve quadratic equations',
      content: `# Quadratic Equations

## Standard Form
$$ax^2 + bx + c = 0$$

## Solving by Factoring
If you can factor, set each factor = 0.

**Example:** $x^2 + 5x + 6 = 0$
$$(x + 2)(x + 3) = 0$$
$$x + 2 = 0 \\text{ or } x + 3 = 0$$
$$x = -2 \\text{ or } x = -3$$

## Zero Product Property
If ab = 0, then a = 0 or b = 0.

## The Quadratic Formula
$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$

**Example:** $x^2 + 3x - 4 = 0$
a = 1, b = 3, c = -4
$$x = \\frac{-3 \\pm \\sqrt{9 + 16}}{2} = \\frac{-3 \\pm 5}{2}$$
$$x = 1 \\text{ or } x = -4$$`,
      objectives: ['Identify quadratic equations', 'Solve by factoring', 'Apply quadratic formula']
    },
    practice: {
      title: 'Quadratic Equations Practice',
      description: 'Practice solving quadratics',
      content: `# Quadratic Practice

## Solve by Factoring
1. x² + 4x + 3 = 0
2. x² - 5x + 6 = 0
3. x² - 9 = 0
4. x² + 6x + 9 = 0

## Use Quadratic Formula
1. x² + 2x - 8 = 0
2. x² - 4x + 1 = 0
3. 2x² + 5x - 3 = 0

## Set Up and Solve
The product of two consecutive integers is 56. Find them.
Let x = first integer, x+1 = second
Equation: x(x+1) = 56
Solve: ___

## Answers
Factoring: x=-1,-3; x=2,3; x=±3; x=-3
Formula: x=2,-4; x=2±√3; x=½,-3
Consecutive: 7 and 8 (or -8 and -7)`,
      objectives: ['Solve by factoring', 'Apply quadratic formula', 'Model word problems']
    },
    mastery: {
      title: 'Quadratic Equations Mastery',
      description: 'Master quadratic solutions',
      content: `# Quadratic Mastery

## The Discriminant
$$D = b^2 - 4ac$$
- D > 0: Two real solutions
- D = 0: One real solution
- D < 0: No real solutions

## Completing the Square
$x^2 + 6x = 7$
$x^2 + 6x + 9 = 7 + 9$
$(x + 3)^2 = 16$
$x + 3 = ±4$
$x = 1$ or $x = -7$

## Practice
1. Find discriminant: x² + 4x + 5 = 0
   How many solutions? ___

2. Complete the square: x² - 8x = 9

3. A ball's height: h = -16t² + 32t + 48
   When does it hit ground (h=0)?

## Vertex Form
$$y = a(x - h)^2 + k$$
Vertex at (h, k)

## Answers
1. D = 16-20 = -4, no real solutions
2. x² - 8x + 16 = 25, (x-4)² = 25, x = 9 or -1
3. t = 3 seconds`,
      objectives: ['Use discriminant', 'Complete the square', 'Apply to real problems']
    }
  }
};

export default algebraIContent;

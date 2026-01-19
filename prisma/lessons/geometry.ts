// Geometry Lesson Content
// Comprehensive educational content for Geometry (grades 9-10)

import { LessonContent } from '../lessonContentTypes';

export const geometryContent: Record<string, LessonContent> = {
  'points-lines-planes': {
    intro: {
      title: 'Points, Lines, and Planes',
      description: 'Learn the basic building blocks of geometry',
      content: `# Points, Lines, and Planes

## Points
A **point** is an exact location in space.
- Has no size (0 dimensions)
- Named with capital letters: Point A

## Lines
A **line** extends infinitely in both directions.
- Has length but no width (1 dimension)
- Named by two points: Line AB or ↔AB

## Line Segments
A **segment** has two endpoints.
- Part of a line
- Named by endpoints: Segment AB or ̅A̅B̅

## Rays
A **ray** has one endpoint and extends infinitely.
- Named by endpoint first: Ray AB or →AB

## Planes
A **plane** is a flat surface extending infinitely.
- Has length and width (2 dimensions)
- Named by three non-collinear points: Plane ABC

## Key Terms
- **Collinear:** Points on the same line
- **Coplanar:** Points on the same plane
- **Intersection:** Where figures meet`,
      objectives: ['Define points, lines, and planes', 'Identify rays and segments', 'Understand collinear and coplanar']
    },
    practice: {
      title: 'Points, Lines, Planes Practice',
      description: 'Practice identifying geometric figures',
      content: `# Practice: Basic Geometry

## Identify Each
1. Has no size: ___
2. Extends infinitely in both directions: ___
3. Has two endpoints: ___
4. Has one endpoint: ___

## True or False
1. A line has endpoints: ___
2. Three collinear points define a plane: ___
3. Two lines can intersect at more than one point: ___
4. A plane has no thickness: ___

## Name the Figure
Use points A, B, C:
1. Line through A and B: ___
2. Segment from A to C: ___
3. Ray starting at B through C: ___

## Collinear or Not?
Determine if points are collinear:
1. Points on a ruler edge: ___
2. Corner points of a triangle: ___
3. Points along a straight road: ___

## Answers
Identify: point, line, segment, ray
T/F: F, F, F, T
Name: ↔AB, ̅A̅C̅, →BC
Collinear: Yes, No, Yes`,
      objectives: ['Distinguish between figures', 'Apply correct notation', 'Identify collinear points']
    },
    mastery: {
      title: 'Points, Lines, Planes Mastery',
      description: 'Master fundamental concepts',
      content: `# Mastery: Foundations

## Postulates
**Through any two points:** Exactly one line
**Through any three non-collinear points:** Exactly one plane
**If two planes intersect:** They intersect in a line

## Distance Formula
$$d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}$$

**Example:** Distance from (1, 2) to (4, 6)
$$d = \\sqrt{(4-1)^2 + (6-2)^2} = \\sqrt{9+16} = 5$$

## Midpoint Formula
$$M = (\\frac{x_1+x_2}{2}, \\frac{y_1+y_2}{2})$$

## Practice
1. Find distance: (0, 0) to (3, 4)
2. Find midpoint: (2, 6) and (8, 10)
3. How many lines through 3 collinear points?

## Segment Addition
If B is between A and C: AB + BC = AC

If AB = 5 and BC = 7, find AC: ___

## Answers
1. d = 5
2. M = (5, 8)
3. One line
4. AC = 12`,
      objectives: ['Apply postulates', 'Calculate distance and midpoint', 'Use segment addition']
    }
  },

  'angles': {
    intro: {
      title: 'Angles and Their Measures',
      description: 'Learn about angles and angle relationships',
      content: `# Angles

## What is an Angle?
An **angle** is formed by two rays with a common endpoint (vertex).

## Angle Notation
- ∠ABC (vertex at B)
- ∠B (single letter when clear)
- m∠ABC = 45° (measure is 45 degrees)

## Angle Types
| Type | Measure |
|------|---------|
| Acute | 0° < x < 90° |
| Right | x = 90° |
| Obtuse | 90° < x < 180° |
| Straight | x = 180° |
| Reflex | 180° < x < 360° |

## Angle Relationships
**Complementary:** Sum = 90°
**Supplementary:** Sum = 180°

## Adjacent Angles
Share a vertex and one side, no overlap.

## Vertical Angles
Formed by intersecting lines.
- Opposite each other
- Always congruent!`,
      objectives: ['Classify angles by measure', 'Identify angle relationships', 'Use angle notation']
    },
    practice: {
      title: 'Angles Practice',
      description: 'Practice with angle concepts',
      content: `# Angles Practice

## Classify the Angle
1. 35°: ___
2. 90°: ___
3. 145°: ___
4. 180°: ___

## Find the Complement
1. 30°: ___
2. 45°: ___
3. 72°: ___

## Find the Supplement
1. 60°: ___
2. 90°: ___
3. 135°: ___

## Angle Problems
1. Two complementary angles: one is 3 times the other. Find both.
2. Two supplementary angles: one is 40° more than the other. Find both.

## Vertical Angles
If two lines intersect and one angle is 70°, find the other three angles.

## Answers
Classify: acute, right, obtuse, straight
Complement: 60°, 45°, 18°
Supplement: 120°, 90°, 45°
Problems: 22.5° and 67.5°; 70° and 110°
Vertical: 70°, 110°, 70°, 110°`,
      objectives: ['Classify angles', 'Find complementary/supplementary', 'Solve angle problems']
    },
    mastery: {
      title: 'Angles Mastery',
      description: 'Master angle concepts',
      content: `# Angles Mastery

## Angle Bisector
Divides angle into two equal parts.
If BD bisects ∠ABC and m∠ABC = 80°,
then m∠ABD = m∠DBC = 40°

## Linear Pair
Adjacent angles forming a straight line.
Always supplementary!

## Angle Addition Postulate
If C is in interior of ∠ABD:
m∠ABC + m∠CBD = m∠ABD

## Practice
1. ∠ABC = 120°, ∠ABD = 45°. Find ∠DBC.
2. Ray BD bisects ∠ABC. If ∠ABD = 35°, find ∠ABC.
3. ∠1 and ∠2 form a linear pair. ∠1 = (2x+10)°, ∠2 = (3x)°. Find x and both angles.

## Perpendicular Lines
Intersect at 90° angles.
Symbol: ⊥
AB ⊥ CD means they are perpendicular.

## Answers
1. 75°
2. 70°
3. x = 34, ∠1 = 78°, ∠2 = 102°`,
      objectives: ['Use angle bisectors', 'Apply linear pairs', 'Solve complex problems']
    }
  },

  'parallel-perpendicular': {
    intro: {
      title: 'Parallel and Perpendicular Lines',
      description: 'Learn about special line relationships',
      content: `# Parallel and Perpendicular Lines

## Parallel Lines
Lines in the same plane that never intersect.
Symbol: ∥ (AB ∥ CD)

## Perpendicular Lines
Lines that intersect at 90°.
Symbol: ⊥ (AB ⊥ CD)

## Transversal
A line that intersects two or more lines.

## Angle Pairs (with parallel lines)
**Corresponding:** Same position, congruent
**Alternate Interior:** Inside, opposite sides, congruent
**Alternate Exterior:** Outside, opposite sides, congruent
**Same-Side Interior:** Same side, supplementary

## The Key Theorem
If lines are parallel, then:
- Corresponding angles are ≅
- Alternate interior angles are ≅
- Alternate exterior angles are ≅
- Same-side interior angles are supplementary

The **converse** is also true!`,
      objectives: ['Define parallel and perpendicular', 'Identify angle pairs', 'Apply parallel line theorems']
    },
    practice: {
      title: 'Parallel Lines Practice',
      description: 'Practice with parallel line concepts',
      content: `# Parallel Lines Practice

## Identify Angle Pairs
Given parallel lines cut by transversal:
1. ∠1 and ∠5: ___
2. ∠3 and ∠6: ___
3. ∠4 and ∠5: ___
4. ∠3 and ∠5: ___

## Find Angle Measures
Lines m ∥ n, transversal t.
If ∠1 = 65°, find:
1. ∠5 (corresponding): ___
2. ∠4 (alternate interior): ___
3. ∠3 (same-side interior): ___

## Are Lines Parallel?
Given angle measures, determine if lines are parallel:
1. Corresponding ∠s: 70° and 70°: ___
2. Alternate interior ∠s: 85° and 95°: ___
3. Same-side interior ∠s: 110° and 70°: ___

## Solve for x
m ∥ n, transversal cuts both.
Corresponding angles: (3x + 10)° and (5x - 20)°
Find x: ___

## Answers
Pairs: corresponding, alt int, same-side int, alt int
Measures: 65°, 65°, 115°
Parallel: Yes, No, Yes
x = 15`,
      objectives: ['Name angle pairs', 'Calculate angle measures', 'Determine parallel lines']
    },
    mastery: {
      title: 'Parallel Lines Mastery',
      description: 'Master parallel line proofs',
      content: `# Parallel Lines Mastery

## Slopes and Parallel/Perpendicular

**Parallel lines:** Same slope
$$m_1 = m_2$$

**Perpendicular lines:** Negative reciprocal slopes
$$m_1 \\cdot m_2 = -1$$

## Practice
1. Line 1: y = 2x + 3. Find slope of parallel line: ___
2. Line 1: y = 3x - 1. Find slope of perpendicular line: ___
3. Are y = 4x + 1 and y = 4x - 5 parallel? ___

## Write Equations
1. Parallel to y = 2x + 1 through (0, 5): ___
2. Perpendicular to y = 3x through (0, 2): ___

## Two-Column Proof Structure
Given: a ∥ b, transversal c
Prove: ∠1 ≅ ∠5

| Statement | Reason |
|-----------|--------|
| a ∥ b | Given |
| ∠1 ≅ ∠5 | Corresponding ∠s |

## Answers
1. m = 2
2. m = -1/3
3. Yes
Equations: y = 2x + 5, y = -x/3 + 2`,
      objectives: ['Connect slopes to parallel/perpendicular', 'Write parallel/perpendicular equations', 'Begin proofs']
    }
  },

  'triangles': {
    intro: {
      title: 'Triangles',
      description: 'Learn about triangle properties',
      content: `# Triangles

## Definition
A triangle is a polygon with 3 sides and 3 angles.

## Classifying by Sides
| Type | Property |
|------|----------|
| Scalene | No equal sides |
| Isosceles | At least 2 equal sides |
| Equilateral | All 3 sides equal |

## Classifying by Angles
| Type | Property |
|------|----------|
| Acute | All angles < 90° |
| Right | One angle = 90° |
| Obtuse | One angle > 90° |
| Equiangular | All angles = 60° |

## Triangle Sum Theorem
The sum of angles in a triangle = 180°
$$m∠A + m∠B + m∠C = 180°$$

## Exterior Angle Theorem
An exterior angle equals the sum of the two remote interior angles.

## Triangle Inequality
The sum of any two sides must be greater than the third side.
a + b > c
a + c > b
b + c > a`,
      objectives: ['Classify triangles', 'Apply triangle sum theorem', 'Use triangle inequality']
    },
    practice: {
      title: 'Triangles Practice',
      description: 'Practice with triangle concepts',
      content: `# Triangles Practice

## Classify by Sides
1. Sides: 3, 4, 5: ___
2. Sides: 5, 5, 5: ___
3. Sides: 6, 6, 8: ___

## Classify by Angles
1. Angles: 60°, 60°, 60°: ___
2. Angles: 30°, 60°, 90°: ___
3. Angles: 40°, 50°, 90°: ___

## Find the Missing Angle
1. ∠A = 40°, ∠B = 75°, ∠C = ___
2. ∠A = 90°, ∠B = 35°, ∠C = ___
3. ∠A = 60°, ∠B = 60°, ∠C = ___

## Exterior Angle
If remote interior angles are 45° and 65°, find the exterior angle: ___

## Triangle Inequality
Can these form a triangle?
1. 3, 4, 8: ___
2. 5, 6, 10: ___
3. 7, 7, 7: ___

## Answers
Sides: scalene, equilateral, isosceles
Angles: equiangular/acute, right, right
Missing: 65°, 55°, 60°
Exterior: 110°
Inequality: No, Yes, Yes`,
      objectives: ['Classify triangles both ways', 'Find missing angles', 'Apply triangle inequality']
    },
    mastery: {
      title: 'Triangles Mastery',
      description: 'Master triangle properties',
      content: `# Triangles Mastery

## Isosceles Triangle Theorem
If two sides are congruent, the angles opposite them are congruent.

**Converse:** If two angles are congruent, the sides opposite them are congruent.

## Practice
1. Isosceles triangle with vertex angle 40°. Find base angles.
2. Isosceles triangle with base angle 70°. Find vertex angle.

## Equilateral Triangles
- All sides congruent
- All angles = 60°
- Also equiangular

## Midsegment Theorem
A midsegment connects midpoints of two sides.
- Parallel to third side
- Half the length of third side

## Perimeter and Area
$$P = a + b + c$$
$$A = \\frac{1}{2}bh$$

**Heron's Formula:**
$$A = \\sqrt{s(s-a)(s-b)(s-c)}$$
where s = (a+b+c)/2

## Practice
Find area: base = 10, height = 6: ___

## Answers
1. Base angles = 70° each
2. Vertex = 40°
Area: 30 square units`,
      objectives: ['Apply isosceles theorems', 'Use midsegment theorem', 'Calculate area']
    }
  },

  'triangle-congruence': {
    intro: {
      title: 'Triangle Congruence',
      description: 'Learn when triangles are congruent',
      content: `# Triangle Congruence

## Congruent Triangles
Triangles are **congruent** if all corresponding parts match.
- All 3 sides congruent
- All 3 angles congruent

## CPCTC
**C**orresponding **P**arts of **C**ongruent **T**riangles are **C**ongruent

## Congruence Postulates

### SSS (Side-Side-Side)
All three sides congruent.

### SAS (Side-Angle-Side)
Two sides and the included angle congruent.

### ASA (Angle-Side-Angle)
Two angles and the included side congruent.

### AAS (Angle-Angle-Side)
Two angles and a non-included side congruent.

### HL (Hypotenuse-Leg)
For right triangles only:
Hypotenuse and one leg congruent.

## NOT Valid
- AAA (proves similarity, not congruence)
- SSA (ambiguous case)`,
      objectives: ['Define congruent triangles', 'Identify congruence postulates', 'Apply CPCTC']
    },
    practice: {
      title: 'Congruence Practice',
      description: 'Practice identifying congruence',
      content: `# Congruence Practice

## Name the Postulate
Which postulate proves congruence?
1. Three pairs of sides congruent: ___
2. Two angles and included side: ___
3. Two sides and included angle: ___
4. Right triangles with hypotenuse and leg: ___

## Can You Prove Congruence?
State postulate or "not possible":
1. AB = DE, BC = EF, AC = DF: ___
2. ∠A = ∠D, ∠B = ∠E, ∠C = ∠F: ___
3. AB = DE, ∠A = ∠D, AC = DF: ___
4. ∠A = ∠D, AB = DE, ∠B = ∠E: ___

## Using CPCTC
Given △ABC ≅ △DEF:
If AB = 5, find DE: ___
If ∠C = 45°, find ∠F: ___

## Mark the Diagram
What additional info makes triangles congruent by SAS?
Given: AB = DE, BC = EF
Need: ___

## Answers
Postulates: SSS, ASA, SAS, HL
Prove: SSS, not possible (AAA), SAS, ASA
CPCTC: DE=5, ∠F=45°
Need: ∠B ≅ ∠E (included angle)`,
      objectives: ['Identify congruence postulates', 'Determine if congruence can be proven', 'Apply CPCTC']
    },
    mastery: {
      title: 'Congruence Mastery',
      description: 'Master congruence proofs',
      content: `# Congruence Mastery

## Writing Proofs
Two-column proof structure:
| Statement | Reason |
|-----------|--------|
| Given info | Given |
| ... | Postulate/Theorem |
| △ABC ≅ △DEF | SSS/SAS/ASA/AAS/HL |

## Common Reasons
- Given
- Definition of midpoint
- Definition of bisector
- Reflexive property (AB = AB)
- Vertical angles are congruent
- SSS, SAS, ASA, AAS, HL

## Practice Proof
Given: AB = CB, D is midpoint of AC
Prove: △ABD ≅ △CBD

| Statement | Reason |
|-----------|--------|
| AB = CB | Given |
| D is midpoint of AC | Given |
| AD = CD | Def. of midpoint |
| BD = BD | Reflexive |
| △ABD ≅ △CBD | SSS |

## Using Congruence
After proving triangles congruent, use CPCTC to show other parts are congruent.`,
      objectives: ['Write two-column proofs', 'Use congruence to prove other statements', 'Apply logical reasoning']
    }
  },

  'triangle-similarity': {
    intro: {
      title: 'Similar Triangles',
      description: 'Learn about triangle similarity',
      content: `# Similar Triangles

## Similar vs Congruent
- **Congruent:** Same shape AND size
- **Similar:** Same shape, different size

## Properties of Similar Triangles
- Corresponding angles are congruent
- Corresponding sides are proportional

$$\\frac{AB}{DE} = \\frac{BC}{EF} = \\frac{AC}{DF}$$

## Similarity Postulates

### AA (Angle-Angle)
If two angles are congruent, triangles are similar.

### SSS Similarity
All three pairs of sides are proportional.

### SAS Similarity
Two pairs of sides proportional AND included angles congruent.

## Scale Factor
The ratio of corresponding sides.
If △ABC ~ △DEF with scale factor 2:
- DE = 2·AB
- EF = 2·BC
- DF = 2·AC`,
      objectives: ['Define similar triangles', 'Apply similarity postulates', 'Use scale factor']
    },
    practice: {
      title: 'Similarity Practice',
      description: 'Practice with similar triangles',
      content: `# Similarity Practice

## Are They Similar?
1. Angles: 40°,60°,80° and 40°,60°,80°: ___
2. Sides: 3,4,5 and 6,8,10: ___
3. Sides: 2,3,4 and 4,5,6: ___

## Find Missing Side
△ABC ~ △DEF, scale factor 3
1. AB = 4, find DE: ___
2. EF = 15, find BC: ___

## Set Up Proportion
△ABC ~ △DEF
AB = 6, BC = 8, DE = 9
Find EF: ___

## Real-World Application
A 6-foot person casts a 4-foot shadow.
A tree casts a 20-foot shadow.
How tall is the tree?

Set up: 6/4 = x/20
Tree height: ___

## Answers
Similar: Yes (AA), Yes (SSS), No
Missing: DE=12, BC=5
Proportion: EF=12
Tree: 30 feet`,
      objectives: ['Identify similar triangles', 'Find missing measurements', 'Apply to real situations']
    },
    mastery: {
      title: 'Similarity Mastery',
      description: 'Master similarity applications',
      content: `# Similarity Mastery

## Triangle Proportionality Theorem
If a line is parallel to one side of a triangle and intersects the other two sides, it divides them proportionally.

## Side-Splitter Theorem
$$\\frac{AD}{DB} = \\frac{AE}{EC}$$

## Angle Bisector Theorem
An angle bisector divides the opposite side in the ratio of the adjacent sides.
$$\\frac{BD}{DC} = \\frac{AB}{AC}$$

## Practice
1. In △ABC, DE ∥ BC where D is on AB and E is on AC.
   AD = 4, DB = 6, AE = 5. Find EC.

2. In △ABC, angle bisector from A meets BC at D.
   AB = 8, AC = 12, BC = 10. Find BD.

## Geometric Mean
In a right triangle with altitude to hypotenuse:
$$h^2 = xy$$
where h is altitude, x and y are segments of hypotenuse.

## Answers
1. EC = 7.5
2. BD = 4`,
      objectives: ['Apply proportionality theorems', 'Use angle bisector theorem', 'Understand geometric mean']
    }
  },

  'right-triangles': {
    intro: {
      title: 'Right Triangles and Trigonometry',
      description: 'Learn the Pythagorean Theorem and basic trigonometry',
      content: `# Right Triangles

## Pythagorean Theorem
For a right triangle with legs a, b and hypotenuse c:
$$a^2 + b^2 = c^2$$

## Special Right Triangles

### 45-45-90 Triangle
Sides in ratio: 1 : 1 : √2
If leg = x, then hypotenuse = x√2

### 30-60-90 Triangle
Sides in ratio: 1 : √3 : 2
- Short leg (opposite 30°) = x
- Long leg (opposite 60°) = x√3
- Hypotenuse = 2x

## Trigonometric Ratios
**SOH-CAH-TOA**
$$\\sin(\\theta) = \\frac{opposite}{hypotenuse}$$
$$\\cos(\\theta) = \\frac{adjacent}{hypotenuse}$$
$$\\tan(\\theta) = \\frac{opposite}{adjacent}$$`,
      objectives: ['Apply Pythagorean Theorem', 'Use special right triangles', 'Define trig ratios']
    },
    practice: {
      title: 'Right Triangles Practice',
      description: 'Practice with right triangles',
      content: `# Right Triangles Practice

## Pythagorean Theorem
Find the missing side:
1. a = 3, b = 4, c = ___
2. a = 5, c = 13, b = ___
3. a = 8, b = 15, c = ___

## Special Triangles
1. 45-45-90 with leg = 5. Hypotenuse = ___
2. 30-60-90 with short leg = 4. Long leg = ___, Hypotenuse = ___

## Trig Ratios
In right △ABC with right angle at C:
AB = 13, BC = 5, AC = 12

Find:
1. sin(A) = ___
2. cos(A) = ___
3. tan(A) = ___

## Solve the Triangle
Right triangle with angle 30° and hypotenuse 10.
Find both legs.

## Answers
Pythag: 5, 12, 17
Special: 5√2; 4√3, 8
Trig: 5/13, 12/13, 5/12
Solve: short=5, long=5√3`,
      objectives: ['Calculate missing sides', 'Apply special triangles', 'Find trig ratios']
    },
    mastery: {
      title: 'Right Triangles Mastery',
      description: 'Master right triangle applications',
      content: `# Right Triangles Mastery

## Inverse Trig Functions
Find angle when you know the ratio:
$$\\theta = \\sin^{-1}(\\frac{opp}{hyp})$$
$$\\theta = \\cos^{-1}(\\frac{adj}{hyp})$$
$$\\theta = \\tan^{-1}(\\frac{opp}{adj})$$

## Practice
1. Find angle: sin(θ) = 0.5, θ = ___
2. Find angle: tan(θ) = 1, θ = ___

## Applications
**Angle of Elevation:** Looking up from horizontal
**Angle of Depression:** Looking down from horizontal

## Word Problem
A ladder leans against a wall, making a 70° angle with the ground. The ladder is 20 feet long. How high up the wall does it reach?

sin(70°) = h/20
h = 20 · sin(70°) ≈ ___

## Pythagorean Triples
Common sets: 3-4-5, 5-12-13, 8-15-17, 7-24-25

## Answers
1. 30°
2. 45°
Wall: ≈18.8 feet`,
      objectives: ['Use inverse trig functions', 'Solve real-world problems', 'Recognize Pythagorean triples']
    }
  },

  'quadrilaterals': {
    intro: {
      title: 'Quadrilaterals',
      description: 'Learn about four-sided polygons',
      content: `# Quadrilaterals

## Definition
A quadrilateral has 4 sides and 4 angles.
Sum of interior angles = 360°

## Types of Quadrilaterals

### Parallelogram
- Opposite sides parallel and congruent
- Opposite angles congruent
- Diagonals bisect each other

### Rectangle
- Parallelogram with 4 right angles
- Diagonals are congruent

### Rhombus
- Parallelogram with 4 congruent sides
- Diagonals are perpendicular
- Diagonals bisect angles

### Square
- Rectangle + Rhombus
- 4 right angles AND 4 congruent sides

### Trapezoid
- Exactly one pair of parallel sides
- Parallel sides are bases

### Kite
- Two pairs of consecutive congruent sides
- Diagonals are perpendicular`,
      objectives: ['Classify quadrilaterals', 'Know properties of each type', 'Understand hierarchy']
    },
    practice: {
      title: 'Quadrilaterals Practice',
      description: 'Practice with quadrilaterals',
      content: `# Quadrilaterals Practice

## Classify
1. 4 right angles, sides not all equal: ___
2. 4 congruent sides, angles not right: ___
3. One pair of parallel sides: ___
4. All properties of rectangle and rhombus: ___

## Find Missing Angle
Quadrilateral angles: 90°, 85°, 100°, ___

## Parallelogram Properties
ABCD is a parallelogram.
1. If AB = 8, then CD = ___
2. If ∠A = 70°, then ∠C = ___, ∠B = ___

## True or False
1. All squares are rectangles: ___
2. All rhombuses are squares: ___
3. All rectangles are parallelograms: ___

## Diagonals
In rectangle ABCD, diagonals AC = 10.
Length of BD = ___

## Answers
Classify: rectangle, rhombus, trapezoid, square
Missing: 85°
Parallelogram: 8; 70°, 110°
T/F: T, F, T
Diagonals: 10`,
      objectives: ['Identify quadrilateral types', 'Apply properties', 'Work with diagonals']
    },
    mastery: {
      title: 'Quadrilaterals Mastery',
      description: 'Master quadrilateral properties',
      content: `# Quadrilaterals Mastery

## Quadrilateral Hierarchy
Square ⊂ Rectangle ⊂ Parallelogram
Square ⊂ Rhombus ⊂ Parallelogram

## Coordinate Geometry
To prove quadrilateral type:
- **Parallelogram:** Both pairs of opposite sides parallel (equal slopes)
- **Rectangle:** Parallelogram + perpendicular sides
- **Rhombus:** Parallelogram + all sides equal
- **Square:** Rectangle + Rhombus

## Area Formulas
| Shape | Area |
|-------|------|
| Parallelogram | bh |
| Rectangle | lw |
| Rhombus | ½d₁d₂ |
| Trapezoid | ½(b₁+b₂)h |

## Practice
1. Parallelogram: base 8, height 5. Area = ___
2. Trapezoid: bases 6 and 10, height 4. Area = ___
3. Rhombus: diagonals 6 and 8. Area = ___

## Answers
1. 40 sq units
2. 32 sq units
3. 24 sq units`,
      objectives: ['Understand hierarchy', 'Prove types using coordinates', 'Calculate areas']
    }
  },

  'circles': {
    intro: {
      title: 'Circles',
      description: 'Learn about circle properties',
      content: `# Circles

## Basic Terms
- **Center:** Fixed point equidistant from all points on circle
- **Radius:** Distance from center to circle
- **Diameter:** Distance across circle through center (d = 2r)
- **Chord:** Segment with both endpoints on circle
- **Secant:** Line that intersects circle at two points
- **Tangent:** Line that touches circle at exactly one point

## Circumference and Area
$$C = 2\\pi r = \\pi d$$
$$A = \\pi r^2$$

## Central Angle
Vertex at center; measure = arc measure

## Inscribed Angle
Vertex on circle; measure = ½ arc measure

## Tangent Properties
- Tangent ⊥ radius at point of tangency
- Two tangents from external point are congruent`,
      objectives: ['Define circle terms', 'Calculate circumference and area', 'Understand angle relationships']
    },
    practice: {
      title: 'Circles Practice',
      description: 'Practice circle concepts',
      content: `# Circles Practice

## Find Circumference and Area
1. r = 5: C = ___, A = ___
2. d = 12: C = ___, A = ___

## Central vs Inscribed
1. Central angle = 80°. Arc = ___
2. Inscribed angle = 35°. Arc = ___
3. Arc = 120°. Inscribed angle = ___

## Identify
1. Line touching circle once: ___
2. Segment through center: ___
3. Segment with endpoints on circle: ___

## Tangent Problems
Two tangents from point P to circle.
One tangent segment = 8.
Other tangent segment = ___

## Arc Length
Arc length = (θ/360) × 2πr
r = 10, θ = 90°. Arc length = ___

## Answers
C&A: 10π, 25π; 12π, 36π
Angles: 80°, 70°, 60°
Identify: tangent, diameter, chord
Tangent: 8
Arc: 5π`,
      objectives: ['Calculate measurements', 'Find angle measures', 'Apply tangent properties']
    },
    mastery: {
      title: 'Circles Mastery',
      description: 'Master circle theorems',
      content: `# Circles Mastery

## Inscribed Angle Theorems
- Angles inscribed in same arc are congruent
- Inscribed angle in semicircle = 90°
- Opposite angles of inscribed quadrilateral are supplementary

## Chord Theorems
- Congruent chords have congruent arcs
- Chord ⊥ bisector passes through center
- Intersecting chords: a·b = c·d

## Secant-Tangent Relationships
- Two secants: (whole₁)(outside₁) = (whole₂)(outside₂)
- Tangent-secant: (tangent)² = (whole)(outside)

## Equation of Circle
$$(x-h)^2 + (y-k)^2 = r^2$$
Center: (h, k), Radius: r

## Practice
1. Circle with center (3, -2), radius 5. Equation: ___
2. (x-1)² + (y+4)² = 16. Center: ___, radius: ___

## Answers
1. (x-3)² + (y+2)² = 25
2. Center (1,-4), r = 4`,
      objectives: ['Apply circle theorems', 'Use coordinate geometry', 'Write circle equations']
    }
  },

  'area-perimeter': {
    intro: {
      title: 'Area and Perimeter',
      description: 'Calculate area and perimeter of various shapes',
      content: `# Area and Perimeter

## Perimeter
The distance around a shape.
Add all sides!

## Area Formulas

### Rectangle
$$A = lw$$

### Triangle
$$A = \\frac{1}{2}bh$$

### Parallelogram
$$A = bh$$

### Trapezoid
$$A = \\frac{1}{2}(b_1 + b_2)h$$

### Circle
$$A = \\pi r^2$$

### Regular Polygon
$$A = \\frac{1}{2}ap$$
a = apothem, p = perimeter

## Composite Figures
Break into simpler shapes, find each area, add together.`,
      objectives: ['Apply area formulas', 'Calculate perimeter', 'Handle composite figures']
    },
    practice: {
      title: 'Area and Perimeter Practice',
      description: 'Practice calculating measurements',
      content: `# Area & Perimeter Practice

## Find Perimeter
1. Rectangle: l = 8, w = 5. P = ___
2. Triangle: sides 3, 4, 5. P = ___
3. Square: s = 7. P = ___

## Find Area
1. Rectangle: l = 10, w = 6. A = ___
2. Triangle: b = 8, h = 5. A = ___
3. Circle: r = 4. A = ___

## Trapezoid
Bases 6 and 10, height 4.
A = ___

## Composite Figure
L-shaped room:
- Large rectangle: 10 × 8
- Small rectangle cut out: 4 × 3
Total area = ___

## Word Problem
Carpet costs $3 per square foot.
Room is 12 ft × 15 ft.
Total cost = ___

## Answers
Perimeter: 26, 12, 28
Area: 60, 20, 16π
Trapezoid: 32
Composite: 80 - 12 = 68
Cost: $540`,
      objectives: ['Calculate perimeter', 'Find various areas', 'Solve practical problems']
    },
    mastery: {
      title: 'Area and Perimeter Mastery',
      description: 'Master complex area problems',
      content: `# Area Mastery

## Shaded Region Problems
Find area of outer shape minus inner shape.

**Example:** Circle r = 10 inside square s = 20
Shaded = Square - Circle
= 400 - 100π ≈ 85.8

## Regular Polygons
$$A = \\frac{1}{2}ap$$
- a = apothem (perpendicular from center to side)
- p = perimeter

## Heron's Formula (any triangle)
$$A = \\sqrt{s(s-a)(s-b)(s-c)}$$
where s = (a+b+c)/2

## Practice
1. Triangle with sides 5, 6, 7. Find area.
2. Semicircle with diameter 10. Find area.
3. Square with circle removed (s = 8, circle touches all sides). Find shaded area.

## Sector Area
$$A = \\frac{\\theta}{360} \\cdot \\pi r^2$$

## Answers
1. s = 9, A = √(9·4·3·2) = 6√6 ≈ 14.7
2. (π·25)/2 = 12.5π ≈ 39.3
3. 64 - 16π ≈ 13.7`,
      objectives: ['Find shaded regions', 'Use Heron\'s formula', 'Calculate sector area']
    }
  },

  'volume-surface-area': {
    intro: {
      title: 'Volume and Surface Area',
      description: 'Calculate 3D measurements',
      content: `# Volume and Surface Area

## Volume
The space inside a 3D figure (cubic units).

## Surface Area
Total area of all faces (square units).

## Prisms
$$V = Bh$$ (B = base area)
$$SA = 2B + Ph$$ (P = perimeter of base)

## Cylinders
$$V = \\pi r^2 h$$
$$SA = 2\\pi r^2 + 2\\pi rh$$

## Pyramids
$$V = \\frac{1}{3}Bh$$
$$SA = B + \\frac{1}{2}Pl$$ (l = slant height)

## Cones
$$V = \\frac{1}{3}\\pi r^2 h$$
$$SA = \\pi r^2 + \\pi rl$$

## Spheres
$$V = \\frac{4}{3}\\pi r^3$$
$$SA = 4\\pi r^2$$`,
      objectives: ['Calculate volume of 3D shapes', 'Find surface area', 'Apply appropriate formulas']
    },
    practice: {
      title: 'Volume and Surface Area Practice',
      description: 'Practice 3D calculations',
      content: `# Volume & SA Practice

## Prisms
Rectangular prism: l = 5, w = 4, h = 3
1. Volume = ___
2. Surface Area = ___

## Cylinders
r = 3, h = 7
1. Volume = ___
2. Surface Area = ___

## Pyramids
Square pyramid: base edge 6, height 4
1. Volume = ___

## Cones
r = 5, h = 12, slant height = 13
1. Volume = ___
2. Lateral SA = ___

## Spheres
r = 6
1. Volume = ___
2. Surface Area = ___

## Answers
Prism: V=60, SA=94
Cylinder: V=63π, SA=60π
Pyramid: V=48
Cone: V=100π, LSA=65π
Sphere: V=288π, SA=144π`,
      objectives: ['Find prism/cylinder measurements', 'Calculate pyramid/cone values', 'Work with spheres']
    },
    mastery: {
      title: 'Volume and SA Mastery',
      description: 'Master 3D geometry',
      content: `# 3D Geometry Mastery

## Composite Solids
Break into simpler shapes, find each volume/SA.

**Example:** Cylinder topped with hemisphere
Total V = V_cylinder + V_hemisphere
= πr²h + (2/3)πr³

## Cavalieri's Principle
Solids with equal cross-sectional areas at every height have equal volumes.

## Practice
1. Cone inside cylinder (same r and h).
   What fraction of cylinder is the cone?

2. Hemisphere on top of cylinder (both r = 4, cylinder h = 6).
   Total volume = ___

3. Cube with sphere inside (cube s = 10).
   Empty space = ___

## Scale Factor
If linear dimensions scale by k:
- Area scales by k²
- Volume scales by k³

## Answers
1. 1/3
2. 96π + (128π/3) = (416π)/3
3. 1000 - (500π/3) ≈ 476.4`,
      objectives: ['Handle composite solids', 'Apply Cavalieri\'s principle', 'Understand scaling']
    }
  },

  'geometric-proofs': {
    intro: {
      title: 'Geometric Proofs',
      description: 'Learn to write formal geometric proofs',
      content: `# Geometric Proofs

## What is a Proof?
A logical argument using definitions, postulates, and theorems to show a statement is true.

## Two-Column Proof
| Statement | Reason |
|-----------|--------|
| What we know/conclude | Why we can say it |

## Common Reasons
- Given
- Definition of ___
- Property of equality/congruence
- Postulate (name it)
- Theorem (name it)
- CPCTC

## Properties
**Reflexive:** AB = AB
**Symmetric:** If AB = CD, then CD = AB
**Transitive:** If AB = CD and CD = EF, then AB = EF

## Proof Structure
1. State the Given
2. State what to Prove
3. Write statements leading logically to conclusion
4. Justify each statement`,
      objectives: ['Understand proof structure', 'Know common reasons', 'Apply properties']
    },
    practice: {
      title: 'Proofs Practice',
      description: 'Practice writing proofs',
      content: `# Proofs Practice

## Fill in Reasons
Given: AB = CD
Prove: AC = BD (where B is between A and C, and C is between B and D)

| Statement | Reason |
|-----------|--------|
| AB = CD | ___ |
| BC = BC | ___ |
| AB + BC = CD + BC | ___ |
| AB + BC = AC | ___ |
| CD + BC = BD | ___ |
| AC = BD | ___ |

## Complete the Proof
Given: ∠1 and ∠2 are supplementary; ∠2 and ∠3 are supplementary
Prove: ∠1 ≅ ∠3

| Statement | Reason |
|-----------|--------|
| ∠1 and ∠2 are supp. | Given |
| ∠2 and ∠3 are supp. | Given |
| m∠1 + m∠2 = 180° | ___ |
| m∠2 + m∠3 = 180° | ___ |
| m∠1 + m∠2 = m∠2 + m∠3 | ___ |
| m∠1 = m∠3 | ___ |
| ∠1 ≅ ∠3 | ___ |

## Answers
First: Given, Reflexive, Add. Prop., Segment Add., Segment Add., Substitution
Second: Def. supp., Def. supp., Trans., Subtraction, Def. congruence`,
      objectives: ['Justify statements', 'Complete proofs', 'Apply properties correctly']
    },
    mastery: {
      title: 'Proofs Mastery',
      description: 'Master geometric reasoning',
      content: `# Proofs Mastery

## Proof Strategies
1. **Work forward:** Start from given
2. **Work backward:** What leads to prove statement?
3. **Meet in the middle:** Both directions

## Triangle Congruence Proof
Given: AB ≅ CB, AD ≅ CD
Prove: △ABD ≅ △CBD

| Statement | Reason |
|-----------|--------|
| AB ≅ CB | Given |
| AD ≅ CD | Given |
| BD ≅ BD | Reflexive |
| △ABD ≅ △CBD | SSS |

## Using CPCTC
After proving triangles congruent, use CPCTC to prove corresponding parts are congruent.

## Indirect Proof
1. Assume the opposite of what you want to prove
2. Show this leads to a contradiction
3. Conclude the original statement must be true

## Practice
Write a proof:
Given: M is midpoint of AB; M is midpoint of CD
Prove: AC ≅ BD

Think about: What triangles can you prove congruent?`,
      objectives: ['Write complete proofs', 'Use CPCTC effectively', 'Understand indirect proof']
    }
  }
};

export default geometryContent;

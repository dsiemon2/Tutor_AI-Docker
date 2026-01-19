// Math Grades 3-5 Lesson Content
// Comprehensive educational content for upper elementary mathematics

import { LessonContent } from '../lessonContentTypes';

export const mathGrades35Content: Record<string, LessonContent> = {
  // ==========================================
  // THIRD GRADE MATH
  // ==========================================
  'multiplication-facts': {
    intro: {
      title: 'Multiplication Facts',
      description: 'Learn multiplication facts through 10',
      content: `# Multiplication Facts

## What is Multiplication?
Multiplication is repeated addition!
4 × 3 = 4 + 4 + 4 = 12
"4 groups of 3" or "4 times 3"

## Multiplication Table (1-10)
|×|1|2|3|4|5|6|7|8|9|10|
|-|-|-|-|-|-|-|-|-|-|--|
|1|1|2|3|4|5|6|7|8|9|10|
|2|2|4|6|8|10|12|14|16|18|20|
|3|3|6|9|12|15|18|21|24|27|30|
|4|4|8|12|16|20|24|28|32|36|40|
|5|5|10|15|20|25|30|35|40|45|50|

## Multiplication Strategies
- **Skip counting**: 5, 10, 15, 20...
- **Doubles**: 6×2=12, so 6×4=24
- **Break apart**: 7×6 = (7×5)+(7×1) = 35+7 = 42

## Properties
- **Commutative**: 3×4 = 4×3
- **Identity**: 5×1 = 5
- **Zero**: 8×0 = 0`,
      objectives: ['Recall multiplication facts', 'Use multiplication strategies', 'Apply properties']
    },
    practice: {
      title: 'Multiplication Facts Practice',
      description: 'Practice multiplication facts',
      content: `# Multiplication Practice

## Speed Drill
3 × 4 = ___    5 × 6 = ___
7 × 8 = ___    9 × 3 = ___
6 × 7 = ___    4 × 9 = ___

## Missing Factors
___ × 5 = 35    6 × ___ = 48
___ × 8 = 72    7 × ___ = 56

## Word Problems
Each box has 6 crayons.
There are 8 boxes.
How many crayons? ___

## Arrays
Draw an array for 4 × 5:

## Answers
Drill: 12, 30, 56, 27, 42, 36
Missing: 7, 8, 9, 8
Crayons: 48`,
      objectives: ['Recall facts fluently', 'Find missing factors', 'Solve word problems']
    },
    mastery: {
      title: 'Multiplication Facts Master',
      description: 'Master all multiplication facts',
      content: `# Multiplication Master! ✖️

## Rapid Fire (30 seconds!)
8×7=__ 9×6=__ 7×4=__
6×8=__ 9×9=__ 8×5=__

## Fact Families
Complete: 6, 7, 42
6 × 7 = 42
7 × 6 = ___
42 ÷ 6 = ___
42 ÷ 7 = ___

## Problem Solving
A classroom has 5 rows of desks.
Each row has 7 desks.
3 desks are empty.
How many students? ___

## Challenge
Find all factor pairs for 36:
___ × ___ = 36

## Answers
Rapid: 56, 54, 28, 48, 81, 40
Family: 42, 7, 6
Students: 32
Pairs: 1×36, 2×18, 3×12, 4×9, 6×6`,
      objectives: ['Instant recall', 'Connect to division', 'Multi-step problems']
    }
  },

  'division-facts': {
    intro: {
      title: 'Division Facts',
      description: 'Learn division as the opposite of multiplication',
      content: `# Division Facts

## What is Division?
Division splits things into equal groups.
12 ÷ 3 = 4 means "12 split into 3 groups = 4 in each"

## Division and Multiplication
They're related!
If 4 × 3 = 12, then:
- 12 ÷ 3 = 4
- 12 ÷ 4 = 3

## Division Vocabulary
- **Dividend**: Number being divided (12)
- **Divisor**: Number dividing by (3)
- **Quotient**: The answer (4)
- 12 ÷ 3 = 4

## Division Rules
- Any number ÷ 1 = itself (8 ÷ 1 = 8)
- Any number ÷ itself = 1 (8 ÷ 8 = 1)
- 0 ÷ any number = 0 (0 ÷ 5 = 0)
- Cannot divide by 0!

## Think Multiplication!
48 ÷ 6 = ?
Think: 6 × ___ = 48
6 × 8 = 48, so 48 ÷ 6 = 8`,
      objectives: ['Understand division', 'Connect to multiplication', 'Recall division facts']
    },
    practice: {
      title: 'Division Facts Practice',
      description: 'Practice division facts',
      content: `# Division Practice

## Basic Facts
24 ÷ 6 = ___    45 ÷ 9 = ___
36 ÷ 4 = ___    56 ÷ 8 = ___
27 ÷ 3 = ___    63 ÷ 7 = ___

## Think Multiplication
32 ÷ 8 = ___ because 8 × ___ = 32
42 ÷ 6 = ___ because 6 × ___ = 42

## Word Problems
24 cookies shared equally among 6 friends.
How many does each get? ___

## Missing Numbers
___ ÷ 7 = 8
54 ÷ ___ = 6
___ ÷ 9 = 4

## Answers
Basic: 4, 5, 9, 7, 9, 9
Think: 4, 7
Cookies: 4
Missing: 56, 9, 36`,
      objectives: ['Divide fluently', 'Use multiplication to divide', 'Solve division problems']
    },
    mastery: {
      title: 'Division Facts Master',
      description: 'Master division facts',
      content: `# Division Master! ➗

## Speed Round
72÷8=__ 81÷9=__ 64÷8=__
49÷7=__ 54÷6=__ 48÷6=__

## Fact Families
Write the fact family for 7, 9, 63:
_______________
_______________
_______________
_______________

## Multi-Step
There are 72 students.
They form teams of 9.
Each team needs 4 balls.
How many balls needed? ___

## Remainders Preview
What is 25 ÷ 4?
___ remainder ___

## Answers
Speed: 9, 9, 8, 7, 9, 8
Teams: 8 teams × 4 = 32 balls
Remainder: 6 r 1`,
      objectives: ['Instant recall', 'Understand fact families', 'Preview remainders']
    }
  },

  'fractions-intro': {
    intro: {
      title: 'Introduction to Fractions',
      description: 'Learn what fractions are and how to use them',
      content: `# Introduction to Fractions

## What is a Fraction?
A fraction shows PART of a whole.

## Parts of a Fraction
$$\\frac{numerator}{denominator}$$

- **Numerator** (top): Parts you have
- **Denominator** (bottom): Total equal parts

## Examples
$$\\frac{1}{2}$$ = 1 out of 2 parts (half)
$$\\frac{3}{4}$$ = 3 out of 4 parts
$$\\frac{2}{3}$$ = 2 out of 3 parts

## Visual Fractions
A pizza cut into 4 slices:
[🍕][🍕][🍕][⬜]
3 slices eaten = $$\\frac{3}{4}$$

## Unit Fractions
Fractions with 1 on top:
$$\\frac{1}{2}$$, $$\\frac{1}{3}$$, $$\\frac{1}{4}$$, $$\\frac{1}{5}$$

## Fraction of a Set
6 apples, 2 are red:
$$\\frac{2}{6}$$ are red`,
      objectives: ['Understand fractions', 'Identify numerator and denominator', 'Represent fractions visually']
    },
    practice: {
      title: 'Fractions Practice',
      description: 'Practice with fractions',
      content: `# Fractions Practice

## Name the Fraction
[■][■][□][□] = ___
[●][●][●][○][○] = ___

## Parts of Fractions
In $$\\frac{3}{5}$$:
Numerator = ___
Denominator = ___

## Draw the Fraction
Draw $$\\frac{2}{4}$$ of a rectangle:

## Word Problems
A cake is cut into 8 pieces.
Sam eats 3 pieces.
What fraction did Sam eat? ___

## Match
$$\\frac{1}{2}$$ → one half / one third
$$\\frac{1}{4}$$ → one fourth / one half
$$\\frac{3}{4}$$ → two thirds / three fourths

## Answers
Name: 2/4 (or 1/2), 3/5
Parts: 3, 5
Sam: 3/8`,
      objectives: ['Write fractions', 'Identify parts', 'Apply to real situations']
    },
    mastery: {
      title: 'Fractions Expert',
      description: 'Master basic fractions',
      content: `# Fractions Expert! 🥧

## Compare Fractions
Use < > or =
$$\\frac{1}{2}$$ ___ $$\\frac{1}{4}$$
$$\\frac{2}{3}$$ ___ $$\\frac{2}{6}$$
$$\\frac{3}{4}$$ ___ $$\\frac{6}{8}$$

## Fractions on Number Line
Place on number line 0 to 1:
$$\\frac{1}{4}$$, $$\\frac{1}{2}$$, $$\\frac{3}{4}$$

## Equivalent Fractions
$$\\frac{1}{2}$$ = $$\\frac{?}{4}$$ = $$\\frac{?}{6}$$

## Problem Solving
12 students in class.
$$\\frac{1}{4}$$ are wearing red.
How many in red? ___

## Answers
Compare: >, >, =
Equivalent: 2/4, 3/6
Red: 3 students`,
      objectives: ['Compare fractions', 'Find equivalent fractions', 'Calculate fractions of numbers']
    }
  },

  'area-perimeter-intro': {
    intro: {
      title: 'Area and Perimeter',
      description: 'Learn to find area and perimeter of shapes',
      content: `# Area and Perimeter

## What is Perimeter?
Perimeter is the distance AROUND a shape.
Add up all the sides!

Rectangle: P = 2l + 2w
Square: P = 4s

## What is Area?
Area is the space INSIDE a shape.
Measured in square units.

Rectangle: A = length × width
Square: A = side × side

## Example: Rectangle
Length = 5 cm, Width = 3 cm

Perimeter = 5 + 3 + 5 + 3 = 16 cm
Area = 5 × 3 = 15 square cm

## Counting Squares
[■][■][■]
[■][■][■]
Area = 6 square units

## Units
- Perimeter: cm, m, ft, in
- Area: sq cm, sq m, sq ft, sq in`,
      objectives: ['Calculate perimeter', 'Calculate area', 'Understand the difference']
    },
    practice: {
      title: 'Area and Perimeter Practice',
      description: 'Practice finding area and perimeter',
      content: `# Area & Perimeter Practice

## Find the Perimeter
Square: side = 6 cm
P = ___

Rectangle: l = 8 m, w = 4 m
P = ___

## Find the Area
Square: side = 5 in
A = ___

Rectangle: l = 7 cm, w = 3 cm
A = ___

## Count the Area
[■][■][■][■]
[■][■][■][■]
[■][■][■][■]
A = ___ square units

## Word Problem
A garden is 9 feet long and 6 feet wide.
Perimeter = ___ feet
Area = ___ square feet

## Answers
Perimeters: 24 cm, 24 m
Areas: 25 sq in, 21 sq cm
Count: 12 square units
Garden: P=30 ft, A=54 sq ft`,
      objectives: ['Calculate perimeter and area', 'Use formulas', 'Solve word problems']
    },
    mastery: {
      title: 'Area and Perimeter Master',
      description: 'Master area and perimeter',
      content: `# Area & Perimeter Master! 📐

## Challenge Problems
A square has perimeter 20 cm.
What is its area? ___

A rectangle has area 24 sq m.
Width is 4 m. Length = ___

## Compare
Rectangle A: 6 × 4
Rectangle B: 8 × 3
Same area? ___
Same perimeter? ___

## Design Challenge
Draw a rectangle with:
- Perimeter = 16 units
- What are possible dimensions?

## Real World
You want to fence a yard 12m × 8m.
Fence costs $5 per meter.
Total cost? ___

## Answers
Square: side=5, A=25 sq cm
Rectangle: l=6 m
Compare: Yes (24), No (20 vs 22)
Fence: P=40m, Cost=$200`,
      objectives: ['Work backwards', 'Compare shapes', 'Apply to real problems']
    }
  },

  'word-problems-3': {
    intro: {
      title: 'Two-Step Word Problems',
      description: 'Solve word problems with multiple steps',
      content: `# Two-Step Word Problems

## What are Two-Step Problems?
Problems that need TWO operations to solve.

## Example Problem
Maya has 24 stickers.
She gives 6 to her brother.
Then she divides the rest equally among 3 friends.
How many does each friend get?

**Step 1**: 24 - 6 = 18 (stickers left)
**Step 2**: 18 ÷ 3 = 6 (each friend gets)

## Problem-Solving Steps
1. **Read** carefully
2. **Identify** what you need to find
3. **Plan** the steps
4. **Solve** step by step
5. **Check** your answer

## Key Words
- Add: total, sum, altogether, in all
- Subtract: left, remaining, difference
- Multiply: each, per, times, groups
- Divide: share, split, equal groups`,
      objectives: ['Identify multi-step problems', 'Plan solution steps', 'Solve systematically']
    },
    practice: {
      title: 'Two-Step Problems Practice',
      description: 'Practice multi-step problems',
      content: `# Two-Step Practice

## Problem 1
Sam has $50.
He buys 3 books for $8 each.
How much money is left?

Step 1: ___
Step 2: ___
Answer: ___

## Problem 2
A baker makes 48 muffins.
She puts 6 in each box.
She sells 5 boxes.
How many muffins are left?

Step 1: ___
Step 2: ___
Answer: ___

## Problem 3
There are 4 rows of chairs.
Each row has 7 chairs.
9 more chairs are added.
Total chairs: ___

## Answers
1: 3×8=24, 50-24=26, $26 left
2: 48÷6=8 boxes, 8-5=3 boxes, 3×6=18 muffins
3: 4×7=28, 28+9=37 chairs`,
      objectives: ['Break down problems', 'Show work clearly', 'Verify answers']
    },
    mastery: {
      title: 'Two-Step Master',
      description: 'Master complex word problems',
      content: `# Two-Step Master! 🧩

## Complex Problem
A school has 6 classrooms.
Each classroom has 24 students.
Half of all students buy lunch.
How many buy lunch? ___

## Write Your Own
Create a two-step problem using:
- Multiplication
- Subtraction

## Choose the Steps
Problem: 35 apples, 7 bags, 3 apples eaten
What operations?
A) Add then divide
B) Divide then subtract
C) Subtract then divide

## Challenge
Maria reads 15 pages per day.
After 5 days, she has 25 pages left.
How many pages in the book? ___

## Answers
School: 6×24=144, 144÷2=72 students
Choose: B
Book: 15×5=75, 75+25=100 pages`,
      objectives: ['Solve complex problems', 'Create problems', 'Work backwards']
    }
  },

  'telling-time-minutes': {
    intro: {
      title: 'Telling Time (Minutes)',
      description: 'Tell time to the minute',
      content: `# Telling Time to the Minute

## Clock Review
- Short hand = HOUR
- Long hand = MINUTES
- 60 minutes = 1 hour

## Reading Minutes
Each number = 5 minutes
- 12 = :00
- 1 = :05
- 2 = :10
- 3 = :15 (quarter past)
- 6 = :30 (half past)
- 9 = :45 (quarter to)

## Counting Minutes
Count by 5s, then by 1s
Long hand at 7 and 2 small marks:
7 × 5 = 35, plus 2 = 37 minutes

## Digital vs. Analog
Analog: 🕐 (clock with hands)
Digital: 3:47 (numbers only)

## A.M. and P.M.
- A.M. = midnight to noon
- P.M. = noon to midnight

## Elapsed Time
From 2:15 to 2:45 = 30 minutes`,
      objectives: ['Read time to the minute', 'Convert between formats', 'Calculate elapsed time']
    },
    practice: {
      title: 'Time Practice',
      description: 'Practice telling time',
      content: `# Time Practice

## What Time Is It?
Hour hand near 4, minute hand at 7
Time: ___:___

Hour hand near 9, minute hand at 11
Time: ___:___

## Write Digital Time
"Twenty-three minutes after six"
___:___

"Quarter to eight"
___:___

## Elapsed Time
Start: 3:20, End: 3:55
How many minutes? ___

Start: 10:15, End: 11:00
How many minutes? ___

## AM or PM?
Eating breakfast: ___
Going to bed: ___
Lunch at school: ___

## Answers
Times: 4:35, 9:55
Digital: 6:23, 7:45
Elapsed: 35 min, 45 min
AM/PM: AM, PM, PM (or AM if before noon)`,
      objectives: ['Read clocks accurately', 'Write times correctly', 'Calculate time differences']
    },
    mastery: {
      title: 'Time Master',
      description: 'Master telling time',
      content: `# Time Master! ⏰

## Time Challenge
School starts at 8:15 AM.
It's 7:48 AM now.
How many minutes until school? ___

## Schedule Problem
Movie starts: 2:30 PM
Movie length: 1 hour 45 minutes
What time does it end? ___

## Backwards
It's 4:30 PM now.
Soccer started 2 hours 15 minutes ago.
What time did soccer start? ___

## Time Zones
It's 3:00 PM in New York.
Los Angeles is 3 hours behind.
What time in LA? ___

## Answers
Until school: 27 minutes
Movie ends: 4:15 PM
Soccer: 2:15 PM
LA: 12:00 PM (noon)`,
      objectives: ['Solve time word problems', 'Calculate end times', 'Understand time zones']
    }
  },

  // ==========================================
  // FOURTH GRADE MATH
  // ==========================================
  'multi-digit-multiplication': {
    intro: {
      title: 'Multi-Digit Multiplication',
      description: 'Multiply numbers with two or more digits',
      content: `# Multi-Digit Multiplication

## Multiplying by 10, 100, 1000
Just add zeros!
45 × 10 = 450
45 × 100 = 4,500
45 × 1,000 = 45,000

## Two-Digit × One-Digit
34 × 6 = ?
Break it apart:
30 × 6 = 180
4 × 6 = 24
180 + 24 = 204

## Standard Algorithm
   34
×   6
-----
  204

## Two-Digit × Two-Digit
23 × 14 = ?
   23
×  14
-----
   92  (23 × 4)
+ 230  (23 × 10)
-----
  322

## Area Model
23 × 14
|  | 20 | 3 |
|10|200|30 |
| 4| 80|12 |
200+30+80+12 = 322`,
      objectives: ['Multiply multi-digit numbers', 'Use the standard algorithm', 'Check with estimation']
    },
    practice: {
      title: 'Multi-Digit Multiplication Practice',
      description: 'Practice multi-digit multiplication',
      content: `# Multiplication Practice

## Multiply by 10, 100
67 × 10 = ___
45 × 100 = ___
238 × 10 = ___

## Two-Digit × One-Digit
48 × 7 = ___
63 × 5 = ___
86 × 4 = ___

## Two-Digit × Two-Digit
25 × 12 = ___
34 × 21 = ___
43 × 15 = ___

## Word Problem
A theater has 24 rows.
Each row has 16 seats.
Total seats? ___

## Answers
By 10/100: 670, 4500, 2380
2×1: 336, 315, 344
2×2: 300, 714, 645
Theater: 384 seats`,
      objectives: ['Multiply accurately', 'Apply to real problems']
    },
    mastery: {
      title: 'Multi-Digit Master',
      description: 'Master multi-digit multiplication',
      content: `# Multi-Digit Master! ✖️

## Three-Digit × One-Digit
456 × 7 = ___
283 × 9 = ___

## Larger Products
56 × 34 = ___
78 × 45 = ___

## Estimation First
Estimate, then calculate:
48 × 32
Estimate: 50 × 30 = ___
Actual: ___

## Problem Solving
A school orders 48 boxes of pencils.
Each box has 24 pencils.
Pencils per classroom if there are 32 classrooms? ___

## Answers
3×1: 3192, 2547
Larger: 1904, 3510
Estimate: 1500, Actual: 1536
Pencils: 48×24=1152, 1152÷32=36`,
      objectives: ['Multiply large numbers', 'Estimate products', 'Multi-step multiplication']
    }
  },

  'long-division': {
    intro: {
      title: 'Long Division',
      description: 'Divide larger numbers using long division',
      content: `# Long Division

## Steps: Divide, Multiply, Subtract, Bring Down
D-M-S-B!

## Example: 84 ÷ 4
      21
    ----
4 | 84
    8    (4×2=8)
   --
    04   (8-8=0, bring down 4)
     4   (4×1=4)
    --
     0

Answer: 21

## With Remainders
      23 R2
    ----
3 | 71
    6
   --
   11
    9
   --
    2

71 ÷ 3 = 23 R2

## Checking Division
Quotient × Divisor + Remainder = Dividend
23 × 3 + 2 = 69 + 2 = 71 ✓`,
      objectives: ['Perform long division', 'Handle remainders', 'Check answers']
    },
    practice: {
      title: 'Long Division Practice',
      description: 'Practice long division',
      content: `# Long Division Practice

## No Remainders
96 ÷ 4 = ___
78 ÷ 6 = ___
85 ÷ 5 = ___

## With Remainders
67 ÷ 4 = ___ R___
89 ÷ 7 = ___ R___
95 ÷ 8 = ___ R___

## Check Your Work
52 ÷ 4 = 13
Check: 13 × 4 = ___

## Word Problem
156 stickers shared among 6 kids.
Each gets ___ stickers.

## Answers
No R: 24, 13, 17
With R: 16 R3, 12 R5, 11 R7
Check: 52
Stickers: 26`,
      objectives: ['Divide accurately', 'Work with remainders', 'Verify answers']
    },
    mastery: {
      title: 'Long Division Master',
      description: 'Master long division',
      content: `# Long Division Master! ➗

## Larger Numbers
456 ÷ 8 = ___
729 ÷ 9 = ___
684 ÷ 6 = ___

## Two-Digit Divisors
168 ÷ 12 = ___
294 ÷ 14 = ___

## Problem Solving
A farmer has 945 eggs.
She puts 30 eggs in each crate.
How many crates? How many left over?
___ crates, ___ left

## Interpreting Remainders
432 students need buses.
Each bus holds 45 students.
How many buses needed? ___
(Think: Can you have part of a bus?)

## Answers
Larger: 57, 81, 114
Two-digit: 14, 21
Farmer: 31 crates, 15 left
Buses: 10 (must round up!)`,
      objectives: ['Divide large numbers', 'Interpret remainders in context']
    }
  },

  'fractions-equivalent': {
    intro: {
      title: 'Equivalent Fractions',
      description: 'Learn to find and recognize equivalent fractions',
      content: `# Equivalent Fractions

## What are Equivalent Fractions?
Different fractions that show the SAME amount.
$$\\frac{1}{2} = \\frac{2}{4} = \\frac{3}{6} = \\frac{4}{8}$$

## Making Equivalent Fractions
Multiply top and bottom by the SAME number!
$$\\frac{1}{3} = \\frac{1×2}{3×2} = \\frac{2}{6}$$
$$\\frac{2}{5} = \\frac{2×3}{5×3} = \\frac{6}{15}$$

## Simplifying Fractions
Divide top and bottom by the SAME number!
$$\\frac{4}{8} = \\frac{4÷4}{8÷4} = \\frac{1}{2}$$
$$\\frac{6}{9} = \\frac{6÷3}{9÷3} = \\frac{2}{3}$$

## Finding the GCF
Greatest Common Factor helps simplify.
$$\\frac{12}{18}$$: GCF of 12 and 18 is 6
$$\\frac{12÷6}{18÷6} = \\frac{2}{3}$$`,
      objectives: ['Create equivalent fractions', 'Simplify fractions', 'Recognize equivalence']
    },
    practice: {
      title: 'Equivalent Fractions Practice',
      description: 'Practice with equivalent fractions',
      content: `# Equivalent Fractions Practice

## Find Equivalent Fractions
$$\\frac{1}{4} = \\frac{?}{8}$$
$$\\frac{2}{3} = \\frac{?}{9}$$
$$\\frac{3}{5} = \\frac{6}{?}$$

## Simplify
$$\\frac{4}{6} = $$___
$$\\frac{8}{12} = $$___
$$\\frac{10}{15} = $$___

## Are They Equal?
$$\\frac{2}{4}$$ and $$\\frac{3}{6}$$ ___
$$\\frac{1}{3}$$ and $$\\frac{2}{5}$$ ___
$$\\frac{4}{8}$$ and $$\\frac{6}{12}$$ ___

## Visual Check
Shade to show $$\\frac{2}{3} = \\frac{4}{6}$$

## Answers
Equivalent: 2, 6, 10
Simplify: 2/3, 2/3, 2/3
Equal: Yes, No, Yes`,
      objectives: ['Find equivalent fractions', 'Simplify fractions', 'Compare fractions']
    },
    mastery: {
      title: 'Equivalent Fractions Master',
      description: 'Master equivalent fractions',
      content: `# Equivalent Fractions Master! 🎯

## Complete the Pattern
$$\\frac{1}{2} = \\frac{2}{4} = \\frac{3}{?} = \\frac{?}{8} = \\frac{5}{?}$$

## Simplify Completely
$$\\frac{24}{36} = $$___
$$\\frac{18}{27} = $$___
$$\\frac{45}{60} = $$___

## Find the Missing Value
$$\\frac{?}{20} = \\frac{3}{5}$$
$$\\frac{7}{?} = \\frac{21}{27}$$

## Problem Solving
Jim ate $$\\frac{4}{8}$$ of a pizza.
Sarah ate $$\\frac{2}{4}$$ of an identical pizza.
Who ate more? ___

## Answers
Pattern: 6, 4, 10
Simplify: 2/3, 2/3, 3/4
Missing: 12, 9
Pizza: Same amount!`,
      objectives: ['Work with fraction patterns', 'Fully simplify', 'Apply to comparisons']
    }
  },

  'fractions-add-sub': {
    intro: {
      title: 'Adding & Subtracting Fractions',
      description: 'Add and subtract fractions with like and unlike denominators',
      content: `# Adding & Subtracting Fractions

## Same Denominators (Easy!)
Just add/subtract the numerators!
$$\\frac{2}{5} + \\frac{1}{5} = \\frac{3}{5}$$
$$\\frac{7}{8} - \\frac{3}{8} = \\frac{4}{8} = \\frac{1}{2}$$

## Different Denominators
Need a COMMON DENOMINATOR first!

## Steps
1. Find LCD (Least Common Denominator)
2. Convert fractions
3. Add or subtract numerators
4. Simplify if needed

## Example
$$\\frac{1}{2} + \\frac{1}{3}$$
LCD of 2 and 3 = 6
$$\\frac{1}{2} = \\frac{3}{6}$$
$$\\frac{1}{3} = \\frac{2}{6}$$
$$\\frac{3}{6} + \\frac{2}{6} = \\frac{5}{6}$$

## Mixed Numbers
$$2\\frac{1}{4} + 1\\frac{2}{4} = 3\\frac{3}{4}$$`,
      objectives: ['Add fractions', 'Subtract fractions', 'Find common denominators']
    },
    practice: {
      title: 'Fraction Operations Practice',
      description: 'Practice adding and subtracting fractions',
      content: `# Fraction Operations Practice

## Same Denominators
$$\\frac{3}{7} + \\frac{2}{7} = $$___
$$\\frac{5}{6} - \\frac{2}{6} = $$___
$$\\frac{4}{9} + \\frac{3}{9} = $$___

## Different Denominators
$$\\frac{1}{2} + \\frac{1}{4} = $$___
$$\\frac{2}{3} - \\frac{1}{6} = $$___
$$\\frac{3}{4} + \\frac{1}{2} = $$___

## Mixed Numbers
$$1\\frac{2}{5} + 2\\frac{1}{5} = $$___
$$3\\frac{3}{4} - 1\\frac{1}{4} = $$___

## Word Problem
Ana ate $$\\frac{1}{4}$$ of a pie.
Ben ate $$\\frac{2}{4}$$.
What fraction eaten? ___

## Answers
Same: 5/7, 3/6=1/2, 7/9
Different: 3/4, 3/6=1/2, 5/4=1 1/4
Mixed: 3 3/5, 2 2/4=2 1/2
Pie: 3/4`,
      objectives: ['Add and subtract fractions', 'Work with mixed numbers']
    },
    mastery: {
      title: 'Fraction Operations Master',
      description: 'Master fraction operations',
      content: `# Fraction Operations Master! ➕➖

## Challenge Problems
$$\\frac{2}{3} + \\frac{3}{4} = $$___
$$\\frac{5}{6} - \\frac{2}{9} = $$___

## Mixed Number Challenge
$$3\\frac{2}{5} + 2\\frac{4}{5} = $$___
$$5\\frac{1}{3} - 2\\frac{2}{3} = $$___

## Problem Solving
Sarah walked $$\\frac{3}{4}$$ mile to school.
Then $$\\frac{1}{2}$$ mile to the library.
Total miles? ___

Tom had $$2\\frac{1}{2}$$ cups of flour.
Used $$1\\frac{3}{4}$$ cups.
How much left? ___

## Answers
Challenge: 17/12=1 5/12, 11/18
Mixed: 6 1/5, 2 2/3
Sarah: 1 1/4 miles
Tom: 3/4 cup`,
      objectives: ['Handle complex operations', 'Solve word problems with fractions']
    }
  },

  'decimals-intro': {
    intro: {
      title: 'Introduction to Decimals',
      description: 'Understand decimals and their relationship to fractions',
      content: `# Introduction to Decimals

## What is a Decimal?
A decimal is another way to write fractions!
The decimal point separates wholes from parts.

## Place Values
3.47
- 3 = ones
- 4 = tenths (1/10)
- 7 = hundredths (1/100)

## Decimals and Fractions
0.1 = $$\\frac{1}{10}$$ (one tenth)
0.01 = $$\\frac{1}{100}$$ (one hundredth)
0.5 = $$\\frac{5}{10}$$ = $$\\frac{1}{2}$$
0.25 = $$\\frac{25}{100}$$ = $$\\frac{1}{4}$$

## Reading Decimals
0.7 = "seven tenths"
0.45 = "forty-five hundredths"
2.3 = "two and three tenths"

## Comparing Decimals
Line up decimal points!
0.5 > 0.35 (5 tenths > 3 tenths)`,
      objectives: ['Understand place value', 'Convert between decimals and fractions', 'Compare decimals']
    },
    practice: {
      title: 'Decimals Practice',
      description: 'Practice with decimals',
      content: `# Decimals Practice

## Place Value
In 4.28:
4 is in the ___ place
2 is in the ___ place
8 is in the ___ place

## Convert to Decimals
$$\\frac{3}{10}$$ = ___
$$\\frac{47}{100}$$ = ___
$$\\frac{1}{4}$$ = ___

## Convert to Fractions
0.9 = ___
0.25 = ___
0.08 = ___

## Compare (< > =)
0.4 ___ 0.04
0.70 ___ 0.7
0.35 ___ 0.4

## Answers
Place: ones, tenths, hundredths
To decimals: 0.3, 0.47, 0.25
To fractions: 9/10, 25/100=1/4, 8/100
Compare: >, =, <`,
      objectives: ['Identify place values', 'Convert between forms', 'Compare decimals']
    },
    mastery: {
      title: 'Decimals Expert',
      description: 'Master decimal concepts',
      content: `# Decimals Expert! 🔢

## Order Decimals
Order from least to greatest:
0.4, 0.04, 0.44, 0.404
___

## Money Decimals
$3.47 = ___ dollars and ___ cents
25 cents = $___
3 quarters = $___

## Add Decimals
2.5 + 1.3 = ___
0.45 + 0.27 = ___
3.8 + 0.25 = ___

## Word Problem
Gas costs $3.89 per gallon.
About how much for 10 gallons?
Estimate: ___
Exact: ___

## Answers
Order: 0.04, 0.4, 0.404, 0.44
Money: 3, 47, 0.25, 0.75
Add: 3.8, 0.72, 4.05
Gas: ~$40, $38.90`,
      objectives: ['Order decimals', 'Work with money', 'Add decimals']
    }
  },

  'angles-measuring': {
    intro: {
      title: 'Measuring Angles',
      description: 'Learn to measure and classify angles',
      content: `# Measuring Angles

## What is an Angle?
An angle is formed when two rays meet at a point.
The point is called the VERTEX.

## Measuring with a Protractor
1. Place center on vertex
2. Align base line with one ray
3. Read where other ray crosses

## Types of Angles
- **Right angle**: Exactly 90°
- **Acute angle**: Less than 90°
- **Obtuse angle**: More than 90°, less than 180°
- **Straight angle**: Exactly 180°

## Angle Addition
If two angles share a side:
∠ABC + ∠CBD = ∠ABD

## Real World Angles
- Corner of paper = 90°
- Clock at 3:00 = 90°
- Pizza slice = usually 30-45°`,
      objectives: ['Use a protractor', 'Classify angles', 'Measure and draw angles']
    },
    practice: {
      title: 'Angles Practice',
      description: 'Practice measuring angles',
      content: `# Angles Practice

## Classify the Angle
45° is ___ (acute/obtuse)
90° is ___ (right/straight)
120° is ___ (acute/obtuse)
180° is ___ (right/straight)

## Estimate Then Measure
Estimate: ___ Actual: ___
(Use protractor for actual)

## Angle Addition
∠A = 35°, ∠B = 55°
∠A + ∠B = ___

If ∠XYZ = 90° and ∠XYA = 40°
∠AYZ = ___

## Draw the Angle
Draw a 60° angle:
Draw a 135° angle:

## Answers
Classify: acute, right, obtuse, straight
Addition: 90°, 50°`,
      objectives: ['Classify angles correctly', 'Add angles', 'Draw angles']
    },
    mastery: {
      title: 'Angles Master',
      description: 'Master angle measurement',
      content: `# Angles Master! 📐

## Find Missing Angles
Angles on a line = 180°
If one angle is 65°, the other is ___

Angles in a right angle = 90°
If one angle is 28°, the other is ___

## Triangle Angles
Angles in a triangle = 180°
Two angles are 60° and 70°.
Third angle = ___

## Clock Angles
What angle at 6:00? ___
What angle at 9:00? ___

## Problem Solving
A ramp makes a 15° angle.
Building code requires less than 20°.
Is it okay? ___

## Answers
Line: 115°
Right: 62°
Triangle: 50°
Clock: 180°, 90°
Ramp: Yes`,
      objectives: ['Find missing angles', 'Apply angle relationships']
    }
  },

  // ==========================================
  // FIFTH GRADE MATH
  // ==========================================
  'fractions-multiply': {
    intro: {
      title: 'Multiplying Fractions',
      description: 'Learn to multiply fractions and mixed numbers',
      content: `# Multiplying Fractions

## Multiplying Two Fractions
Multiply numerators, multiply denominators!
$$\\frac{2}{3} × \\frac{4}{5} = \\frac{2×4}{3×5} = \\frac{8}{15}$$

## Multiplying by Whole Numbers
$$4 × \\frac{2}{3} = \\frac{4}{1} × \\frac{2}{3} = \\frac{8}{3} = 2\\frac{2}{3}$$

## Cross-Simplify First!
$$\\frac{2}{3} × \\frac{9}{4}$$
Simplify 2 and 4 (÷2): $$\\frac{1}{3} × \\frac{9}{2}$$
Simplify 3 and 9 (÷3): $$\\frac{1}{1} × \\frac{3}{2} = \\frac{3}{2}$$

## Mixed Numbers
Convert to improper fractions first!
$$2\\frac{1}{2} × 1\\frac{1}{3}$$
$$= \\frac{5}{2} × \\frac{4}{3} = \\frac{20}{6} = 3\\frac{2}{6} = 3\\frac{1}{3}$$

## "Of" Means Multiply
$$\\frac{1}{2}$$ of 8 = $$\\frac{1}{2} × 8 = 4$$`,
      objectives: ['Multiply fractions', 'Simplify before multiplying', 'Multiply mixed numbers']
    },
    practice: {
      title: 'Multiplying Fractions Practice',
      description: 'Practice fraction multiplication',
      content: `# Multiplying Fractions Practice

## Basic Multiplication
$$\\frac{1}{2} × \\frac{3}{4} = $$___
$$\\frac{2}{5} × \\frac{1}{3} = $$___
$$\\frac{3}{4} × \\frac{2}{3} = $$___

## With Whole Numbers
$$5 × \\frac{2}{3} = $$___
$$\\frac{3}{4} × 8 = $$___

## Mixed Numbers
$$1\\frac{1}{2} × \\frac{2}{3} = $$___
$$2\\frac{1}{4} × 1\\frac{1}{3} = $$___

## Word Problem
A recipe needs $$\\frac{3}{4}$$ cup of sugar.
You're making half the recipe.
How much sugar? ___

## Answers
Basic: 3/8, 2/15, 6/12=1/2
Whole: 10/3=3 1/3, 6
Mixed: 1, 3
Sugar: 3/8 cup`,
      objectives: ['Multiply fractions accurately', 'Apply to word problems']
    },
    mastery: {
      title: 'Multiplying Fractions Master',
      description: 'Master fraction multiplication',
      content: `# Multiplying Fractions Master! ✖️

## Cross-Simplify
$$\\frac{4}{9} × \\frac{3}{8} = $$___
$$\\frac{5}{6} × \\frac{9}{10} = $$___

## Complex Mixed Numbers
$$3\\frac{1}{3} × 2\\frac{1}{4} = $$___

## Problem Solving
A garden is $$6\\frac{1}{2}$$ feet by $$4\\frac{2}{3}$$ feet.
What is the area? ___

A painter finished $$\\frac{2}{3}$$ of a room.
Then painted $$\\frac{1}{2}$$ of what remained.
What fraction is now painted? ___

## Answers
Cross-simplify: 1/6, 3/4
Complex: 7 1/2
Garden: 30 1/3 sq ft
Painter: 2/3 + 1/6 = 5/6`,
      objectives: ['Simplify efficiently', 'Solve complex problems']
    }
  },

  'fractions-divide': {
    intro: {
      title: 'Dividing Fractions',
      description: 'Learn to divide fractions using reciprocals',
      content: `# Dividing Fractions

## The Rule: Keep, Change, Flip!
To divide fractions:
1. **Keep** the first fraction
2. **Change** ÷ to ×
3. **Flip** the second fraction (reciprocal)

## Example
$$\\frac{2}{3} ÷ \\frac{4}{5}$$
= $$\\frac{2}{3} × \\frac{5}{4}$$
= $$\\frac{10}{12} = \\frac{5}{6}$$

## Dividing by Whole Numbers
$$\\frac{3}{4} ÷ 2$$
= $$\\frac{3}{4} ÷ \\frac{2}{1}$$
= $$\\frac{3}{4} × \\frac{1}{2}$$
= $$\\frac{3}{8}$$

## What is a Reciprocal?
Flip the fraction!
- Reciprocal of $$\\frac{2}{3}$$ is $$\\frac{3}{2}$$
- Reciprocal of 5 is $$\\frac{1}{5}$$

## Why It Works
"How many $$\\frac{1}{2}$$s in 3?"
3 ÷ $$\\frac{1}{2}$$ = 3 × 2 = 6`,
      objectives: ['Find reciprocals', 'Divide fractions', 'Understand division meaning']
    },
    practice: {
      title: 'Dividing Fractions Practice',
      description: 'Practice dividing fractions',
      content: `# Dividing Fractions Practice

## Find the Reciprocal
$$\\frac{3}{5}$$ → ___
$$\\frac{7}{2}$$ → ___
4 → ___

## Divide
$$\\frac{1}{2} ÷ \\frac{1}{4} = $$___
$$\\frac{3}{4} ÷ \\frac{1}{2} = $$___
$$\\frac{2}{3} ÷ \\frac{4}{5} = $$___

## Divide by Whole Numbers
$$\\frac{4}{5} ÷ 2 = $$___
$$\\frac{2}{3} ÷ 4 = $$___

## Word Problem
You have $$\\frac{3}{4}$$ pound of nuts.
Each serving is $$\\frac{1}{8}$$ pound.
How many servings? ___

## Answers
Reciprocals: 5/3, 2/7, 1/4
Divide: 2, 3/2=1 1/2, 10/12=5/6
By whole: 2/5, 1/6
Servings: 6`,
      objectives: ['Find reciprocals', 'Divide fractions', 'Solve division problems']
    },
    mastery: {
      title: 'Dividing Fractions Master',
      description: 'Master fraction division',
      content: `# Dividing Fractions Master! ➗

## Mixed Numbers
$$2\\frac{1}{2} ÷ \\frac{1}{4} = $$___
$$3\\frac{1}{3} ÷ 1\\frac{2}{3} = $$___

## Complex Problems
$$\\frac{3}{4} ÷ \\frac{1}{2} × \\frac{2}{3} = $$___

## Real World
A rope is $$4\\frac{1}{2}$$ feet long.
It's cut into $$\\frac{3}{4}$$ foot pieces.
How many pieces? ___

How many $$\\frac{1}{3}$$ cup servings
in $$2\\frac{2}{3}$$ cups of rice? ___

## Answers
Mixed: 10, 2
Complex: 1
Rope: 6 pieces
Rice: 8 servings`,
      objectives: ['Divide mixed numbers', 'Solve multi-step problems']
    }
  },

  'decimals-operations': {
    intro: {
      title: 'Decimal Operations',
      description: 'Add, subtract, multiply, and divide decimals',
      content: `# Decimal Operations

## Adding & Subtracting
Line up the decimal points!
  3.45
+ 2.30
------
  5.75

## Multiplying Decimals
1. Multiply as whole numbers
2. Count decimal places in both numbers
3. Put that many decimal places in answer

2.5 × 0.4 = ?
25 × 4 = 100
2.5 (1 place) × 0.4 (1 place) = 2 places
Answer: 1.00 = 1

## Dividing Decimals
Move decimal to make divisor a whole number!
7.2 ÷ 0.3 = 72 ÷ 3 = 24

## With Money
$4.56 + $2.35 = $6.91
$10.00 - $3.75 = $6.25
$2.50 × 4 = $10.00`,
      objectives: ['Add and subtract decimals', 'Multiply decimals', 'Divide decimals']
    },
    practice: {
      title: 'Decimal Operations Practice',
      description: 'Practice all decimal operations',
      content: `# Decimal Operations Practice

## Add and Subtract
4.56 + 3.28 = ___
7.8 - 2.35 = ___
12.5 + 0.75 = ___

## Multiply
0.6 × 0.4 = ___
2.5 × 3 = ___
1.2 × 0.5 = ___

## Divide
4.8 ÷ 0.6 = ___
7.5 ÷ 2.5 = ___
9 ÷ 0.3 = ___

## Word Problem
Movie ticket: $8.50
Popcorn: $4.75
Total with $20? Change: ___

## Answers
Add/Sub: 7.84, 5.45, 13.25
Multiply: 0.24, 7.5, 0.6
Divide: 8, 3, 30
Change: $6.75`,
      objectives: ['Perform all operations', 'Handle money calculations']
    },
    mastery: {
      title: 'Decimal Operations Master',
      description: 'Master all decimal operations',
      content: `# Decimal Operations Master! 🔢

## Mixed Operations
(3.5 + 2.5) × 0.4 = ___
8.4 ÷ 0.7 - 2.5 = ___

## Multi-Step Problem
Gas: 12.5 gallons at $3.40/gallon
Total: ___
Pay with $50, change: ___

## Challenge
0.125 × 0.08 = ___
0.0036 ÷ 0.04 = ___

## Estimation
Estimate: 4.87 × 2.13
4.87 ≈ 5, 2.13 ≈ 2
Estimate: ___
Actual: ___

## Answers
Mixed: 2.4, 9.5
Gas: $42.50, $7.50
Challenge: 0.01, 0.09
Estimate: 10, Actual: 10.3731`,
      objectives: ['Combine operations', 'Solve complex problems', 'Estimate with decimals']
    }
  },

  'volume-intro': {
    intro: {
      title: 'Volume of 3D Shapes',
      description: 'Calculate volume of rectangular prisms',
      content: `# Volume of 3D Shapes

## What is Volume?
Volume is the space INSIDE a 3D shape.
Measured in CUBIC units.

## Volume of Rectangular Prism
V = length × width × height
V = l × w × h

## Example
A box: l=5cm, w=3cm, h=2cm
V = 5 × 3 × 2 = 30 cubic cm

## Counting Cubes
Count unit cubes to find volume.
Each small cube = 1 cubic unit.

## Volume Units
- Cubic centimeters (cm³)
- Cubic meters (m³)
- Cubic inches (in³)
- Cubic feet (ft³)

## Related Formulas
If you know two dimensions and volume:
l = V ÷ (w × h)`,
      objectives: ['Understand volume', 'Calculate volume of rectangular prisms', 'Use cubic units']
    },
    practice: {
      title: 'Volume Practice',
      description: 'Practice calculating volume',
      content: `# Volume Practice

## Calculate Volume
l=4, w=3, h=2
V = ___

l=6, w=5, h=4
V = ___

l=10, w=2, h=3
V = ___

## Find Missing Dimension
V=24, l=4, w=2, h=?
h = ___

V=60, l=5, h=3, w=?
w = ___

## Word Problems
A fish tank is 20in × 10in × 12in.
Volume = ___ cubic inches

## Answers
Volume: 24, 120, 60 cubic units
Missing: 3, 4
Fish tank: 2400 cubic inches`,
      objectives: ['Calculate volume', 'Find missing dimensions', 'Solve word problems']
    },
    mastery: {
      title: 'Volume Master',
      description: 'Master volume calculations',
      content: `# Volume Master! 📦

## Composite Shapes
Two boxes joined:
Box A: 3×3×3
Box B: 2×2×4
Total volume: ___

## Volume and Capacity
1 cubic cm = 1 mL
A container is 10cm × 8cm × 5cm.
How many mL can it hold? ___

## Problem Solving
A pool is 25m × 10m × 2m.
Volume in cubic meters: ___
If water costs $0.01 per cubic meter,
filling cost: ___

## Challenge
Volume is 72 cubic units.
Find 3 possible dimensions:
___

## Answers
Composite: 27 + 16 = 43
Container: 400 mL
Pool: 500 m³, $5.00
Possible: 8×9×1, 6×6×2, 4×3×6, etc.`,
      objectives: ['Handle composite shapes', 'Connect to capacity', 'Solve complex problems']
    }
  },

  'coordinate-plane-intro': {
    intro: {
      title: 'Coordinate Plane',
      description: 'Learn to plot and read points on a coordinate plane',
      content: `# The Coordinate Plane

## What is a Coordinate Plane?
A grid with two number lines:
- **x-axis**: horizontal (left-right)
- **y-axis**: vertical (up-down)
- **Origin**: where they cross (0,0)

## Ordered Pairs
A point is written as (x, y)
- First number: go left/right
- Second number: go up/down

## Plotting Points
Point (3, 4):
1. Start at origin
2. Go right 3
3. Go up 4
4. Plot the point!

## Reading Points
Find coordinates:
1. How far right/left? → x
2. How far up/down? → y
3. Write (x, y)

## Quadrant I
Fifth grade focuses on positive coordinates (Quadrant I).`,
      objectives: ['Understand the coordinate plane', 'Plot ordered pairs', 'Read coordinates']
    },
    practice: {
      title: 'Coordinate Plane Practice',
      description: 'Practice with coordinates',
      content: `# Coordinate Plane Practice

## Plot These Points
A: (2, 5)
B: (4, 1)
C: (0, 3)
D: (6, 6)

## Read the Coordinates
Point E is at ___
Point F is at ___
(From your graph)

## Distance
How far apart are:
(1, 3) and (1, 7)? ___
(2, 4) and (6, 4)? ___

## Shape Corners
Plot a rectangle with corners:
(1, 1), (1, 4), (5, 4), (5, 1)
What are the dimensions? ___

## Word Problem
A map uses coordinates.
Library is at (3, 5).
School is at (3, 2).
How many blocks apart? ___

## Answers
Distance: 4 units, 4 units
Rectangle: 4 × 3
Blocks: 3`,
      objectives: ['Plot accurately', 'Read coordinates', 'Find distances']
    },
    mastery: {
      title: 'Coordinate Plane Master',
      description: 'Master coordinate plane skills',
      content: `# Coordinate Plane Master! 📍

## Shapes on the Plane
Plot and connect:
(0, 0), (4, 0), (4, 3), (0, 3)
Shape formed: ___
Perimeter: ___
Area: ___

## Patterns
Plot: (1,1), (2,2), (3,3), (4,4)
What pattern do you see? ___
What's the next point? ___

## Treasure Map
Start at (2, 3).
Go right 4, up 2.
New location: ___

Go left 3, down 1.
Final location: ___

## Challenge
Triangle corners: (1,1), (5,1), (3,4)
Is it isosceles? ___

## Answers
Shape: rectangle, P=14, A=12
Pattern: diagonal line, (5,5)
Map: (6,5), then (3,4)`,
      objectives: ['Create shapes', 'Recognize patterns', 'Navigate with coordinates']
    }
  },

  'order-operations': {
    intro: {
      title: 'Order of Operations',
      description: 'Learn PEMDAS for solving expressions',
      content: `# Order of Operations

## PEMDAS
The order we solve math problems:
1. **P**arentheses ( )
2. **E**xponents
3. **M**ultiplication & **D**ivision (left to right)
4. **A**ddition & **S**ubtraction (left to right)

## Memory Helper
**P**lease **E**xcuse **M**y **D**ear **A**unt **S**ally

## Examples
3 + 4 × 2 = ?
= 3 + 8 (multiply first!)
= 11

(3 + 4) × 2 = ?
= 7 × 2 (parentheses first!)
= 14

## More Examples
24 ÷ 6 + 2 = 4 + 2 = 6
24 ÷ (6 + 2) = 24 ÷ 8 = 3

## With Exponents
2 + 3² = 2 + 9 = 11
(2 + 3)² = 5² = 25`,
      objectives: ['Know PEMDAS order', 'Solve expressions correctly', 'Use parentheses']
    },
    practice: {
      title: 'Order of Operations Practice',
      description: 'Practice PEMDAS',
      content: `# PEMDAS Practice

## Solve Step by Step
5 + 3 × 4 = ___
18 - 6 ÷ 2 = ___
(4 + 5) × 3 = ___

## With Exponents
2³ + 4 = ___
5 × 2² = ___
(1 + 2)² × 2 = ___

## Which First?
12 ÷ 3 + 1
Do you divide or add first? ___

## Insert Parentheses
Make true:
3 + 4 × 2 = 14
( ) goes where? ___

8 - 2 × 3 = 18
( ) goes where? ___

## Answers
Step by step: 17, 15, 27
Exponents: 12, 20, 18
First: divide
Parentheses: (3+4)×2, (8-2)×3`,
      objectives: ['Follow PEMDAS', 'Work with exponents', 'Use parentheses strategically']
    },
    mastery: {
      title: 'Order of Operations Master',
      description: 'Master complex expressions',
      content: `# Order of Operations Master! 🧮

## Complex Expressions
3 × (4 + 2) - 8 ÷ 2 = ___
5² - 3 × (6 - 2) = ___
(8 + 4) ÷ 2 + 3² = ___

## Multi-Step
[(3 + 5) × 2] ÷ 4 = ___
4 × [10 - (2 + 3)] = ___

## Create Expression
Use 2, 3, 4 and any operations.
Make an expression that equals:
10: ___
6: ___
24: ___

## Challenge
Make this true by adding parentheses:
2 + 3 × 4 + 5 = 25
Answer: ___

## Answers
Complex: 14, 13, 15
Multi-step: 4, 20
Challenge: 2 + 3 × (4 + 5) or (2 + 3) × (4 + 5)`,
      objectives: ['Solve complex expressions', 'Work with brackets', 'Create expressions']
    }
  }
};

export default mathGrades35Content;

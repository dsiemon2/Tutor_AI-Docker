// Lesson Content Generator
// Generates rich educational content for all topics

import { LessonContent } from './lessonContentTypes';
import mathK5Content from './lessons/mathK5';
import mathGrades35Content from './lessons/mathGrades35';
import algebraIContent from './lessons/algebraI';
import algebraIIContent from './lessons/algebraII';
import geometryContent from './lessons/geometry';
import scienceK5Content from './lessons/scienceK5';
import scienceGrades35Content from './lessons/scienceGrades35';
import biologyContent from './lessons/biology';
import chemistryContent from './lessons/chemistry';
import physicsContent from './lessons/physics';
import earlyChildhoodContentFile from './lessons/earlyChildhood';
import computerScienceContentFile from './lessons/computerScience';
import elaK5ContentFile from './lessons/elaK5';
import socialStudiesK5ContentFile from './lessons/socialStudiesK5';
import elaGrades35Content from './lessons/elaGrades35';
import socialStudiesGrades35Content from './lessons/socialStudiesGrades35';
import usHistoryContent from './lessons/usHistory';
import vocationalContent from './lessons/vocational';
import artsMusicContent from './lessons/artsMusic';
import peHealthContent from './lessons/peHealth';

// Grade-appropriate language helpers
function getGradeLanguage(grade: number): { complexity: string; examples: string } {
  if (grade <= 0) return { complexity: 'very simple words, short sentences', examples: 'everyday objects, colors, shapes' };
  if (grade <= 2) return { complexity: 'simple sentences, basic vocabulary', examples: 'familiar objects, simple stories' };
  if (grade <= 5) return { complexity: 'clear explanations, concrete examples', examples: 'real-world scenarios' };
  if (grade <= 8) return { complexity: 'detailed explanations, some technical terms', examples: 'practical applications' };
  return { complexity: 'advanced vocabulary, complex concepts', examples: 'real-world and theoretical applications' };
}

// ============================================
// MATHEMATICS CONTENT
// ============================================
export const mathContent: Record<string, LessonContent> = {
  'counting': {
    intro: {
      title: 'Introduction to Counting',
      description: 'Learn to count objects from 1 to 10',
      content: `# Learning to Count

## What is Counting?
Counting helps us know **how many** things we have!

## Let's Count Together!
🍎 One apple
🍎🍎 Two apples
🍎🍎🍎 Three apples

## Counting with Your Fingers
Hold up your fingers as we count:
1️⃣ One - hold up 1 finger
2️⃣ Two - hold up 2 fingers
3️⃣ Three - hold up 3 fingers
4️⃣ Four - hold up 4 fingers
5️⃣ Five - hold up 5 fingers (one whole hand!)

## Practice Activity
Count the stars: ⭐⭐⭐⭐
How many stars do you see? (Answer: 4)

## Song: "One, Two, Buckle My Shoe"
One, two, buckle my shoe
Three, four, shut the door
Five, six, pick up sticks
Seven, eight, lay them straight
Nine, ten, a big fat hen!`,
      objectives: ['Count objects from 1 to 10', 'Match numbers to quantities', 'Use fingers to show numbers']
    },
    practice: {
      title: 'Counting Practice',
      description: 'Practice counting objects in different groups',
      content: `# Counting Practice

## Warm-Up
Let's count together! Touch each item as you count.

## Activity 1: Count the Animals
🐱🐱🐱 How many cats? ___
🐕🐕🐕🐕🐕 How many dogs? ___
🐰🐰 How many bunnies? ___

## Activity 2: Count and Circle
Circle the group that has 5:
- Group A: 🌟🌟🌟
- Group B: 🌟🌟🌟🌟🌟
- Group C: 🌟🌟🌟🌟

## Activity 3: Draw and Count
Draw 3 circles: ○ ○ ○
Draw 6 squares: □ □ □ □ □ □

## Activity 4: Fill in the Missing Number
1, 2, ___, 4, 5
3, 4, 5, ___, 7
6, ___, 8, 9, 10

## Check Your Work
Answers: Cats=3, Dogs=5, Bunnies=2, Group B has 5`,
      objectives: ['Count groups of objects accurately', 'Identify the correct quantity', 'Write missing numbers in sequence']
    },
    mastery: {
      title: 'Counting Champion',
      description: 'Show your counting skills with fun challenges',
      content: `# Counting Champion Challenge

## Challenge 1: Count Backwards!
Can you count from 10 to 1?
10, 9, 8, 7, 6, 5, 4, 3, 2, 1... BLAST OFF! 🚀

## Challenge 2: Count by 2s
2, 4, 6, 8, 10!
Color every second square: ⬜🟦⬜🟦⬜🟦⬜🟦⬜🟦

## Challenge 3: Real World Counting
- Count the windows in your room
- Count your toys
- Count the people in your family

## Challenge 4: Story Problems
Mom has 3 cookies. Dad gives her 2 more cookies.
How many cookies does Mom have now?
3 + 2 = ___

## You're a Counting Champion! 🏆
You can now:
✅ Count to 10 and beyond
✅ Count backwards
✅ Count objects in the real world`,
      objectives: ['Count backwards from 10', 'Skip count by 2s', 'Apply counting to simple word problems']
    }
  },

  'addition_subtraction_basic': {
    intro: {
      title: 'Introduction to Addition and Subtraction',
      description: 'Learn what it means to add and subtract',
      content: `# Addition and Subtraction

## What is Addition?
Addition means putting things **together** to find out how many in all.
We use the **plus sign (+)** for addition.

### Example:
🍎🍎 + 🍎 = 🍎🍎🍎
2 + 1 = 3
"Two apples plus one apple equals three apples"

## What is Subtraction?
Subtraction means **taking away** to find out how many are left.
We use the **minus sign (-)** for subtraction.

### Example:
🍎🍎🍎 - 🍎 = 🍎🍎
3 - 1 = 2
"Three apples minus one apple equals two apples"

## Key Words
**Addition words:** add, plus, in all, together, total, sum
**Subtraction words:** subtract, minus, take away, left, difference

## Using Your Fingers
- For 3 + 2: Hold up 3 fingers, then 2 more. Count all fingers = 5!
- For 5 - 2: Hold up 5 fingers, put down 2. Count what's left = 3!`,
      objectives: ['Understand addition as combining groups', 'Understand subtraction as taking away', 'Recognize + and - symbols']
    },
    practice: {
      title: 'Addition and Subtraction Practice',
      description: 'Solve addition and subtraction problems',
      content: `# Practice Time!

## Addition Practice
Solve these problems:

1. 2 + 3 = ___
2. 4 + 1 = ___
3. 3 + 3 = ___
4. 5 + 2 = ___
5. 1 + 6 = ___

## Subtraction Practice
Solve these problems:

1. 5 - 2 = ___
2. 4 - 1 = ___
3. 6 - 3 = ___
4. 7 - 4 = ___
5. 8 - 5 = ___

## Picture Problems
🐟🐟🐟 + 🐟🐟 = ___ fish

🦋🦋🦋🦋🦋 - 🦋🦋 = ___ butterflies

## Word Problems
1. Sam has 4 crayons. He gets 2 more. How many crayons does Sam have now?
   4 + 2 = ___

2. Mia has 6 stickers. She gives 3 to her friend. How many stickers does Mia have left?
   6 - 3 = ___

## Answers
Addition: 5, 5, 6, 7, 7
Subtraction: 3, 3, 3, 3, 3
Pictures: 5 fish, 3 butterflies
Word Problems: 6 crayons, 3 stickers`,
      objectives: ['Add numbers within 10', 'Subtract numbers within 10', 'Solve simple word problems']
    },
    mastery: {
      title: 'Addition and Subtraction Master',
      description: 'Challenge yourself with harder problems',
      content: `# Mastery Challenge

## Fact Families
A fact family uses the same numbers:
2 + 3 = 5
3 + 2 = 5
5 - 3 = 2
5 - 2 = 3

Write the fact family for 4, 5, 9:
___ + ___ = ___
___ + ___ = ___
___ - ___ = ___
___ - ___ = ___

## Missing Numbers
Find the missing number:

1. 3 + ___ = 7
2. ___ + 4 = 9
3. 8 - ___ = 5
4. ___ - 3 = 4

## Story Problem Challenge
There were 8 birds on a tree.
Some birds flew away.
Now there are 5 birds.
How many birds flew away?

8 - ___ = 5

## Mental Math Race
Solve as fast as you can:
5 + 4 = ___
9 - 6 = ___
7 + 2 = ___
10 - 4 = ___

## You're a Math Master! 🌟
You can add and subtract like a pro!`,
      objectives: ['Understand fact families', 'Find missing numbers in equations', 'Solve multi-step word problems']
    }
  },

  'linear_equations': {
    intro: {
      title: 'Introduction to Linear Equations',
      description: 'Learn what linear equations are and how to recognize them',
      content: `# Introduction to Linear Equations

## What is a Linear Equation?
A **linear equation** is an equation where the highest power of the variable is 1.

### Examples of Linear Equations:
- $x + 5 = 12$
- $2x - 3 = 7$
- $3x + 2y = 6$

### NOT Linear Equations:
- $x^2 + 5 = 12$ (has $x^2$)
- $\\frac{1}{x} = 5$ (x is in denominator)

## Parts of a Linear Equation

$$2x + 5 = 11$$

- **Variable:** $x$ (what we're solving for)
- **Coefficient:** 2 (number multiplied by the variable)
- **Constant:** 5, 11 (numbers without variables)
- **Equal sign:** Shows both sides have the same value

## Why "Linear"?
When you graph a linear equation, it makes a **straight line**!

\`\`\`mermaid
graph LR
    A[Linear Equation] --> B[Straight Line Graph]
    A --> C[Variable to power of 1]
    A --> D[No x², x³, etc.]
\`\`\`

## Real-World Examples
- If you earn $15 per hour, your pay equation is: $p = 15h$
- If a taxi charges $3 base + $2 per mile: $c = 2m + 3$`,
      objectives: ['Define what a linear equation is', 'Identify the parts of a linear equation', 'Distinguish linear from non-linear equations']
    },
    practice: {
      title: 'Solving Linear Equations',
      description: 'Practice solving one and two-step linear equations',
      content: `# Solving Linear Equations

## The Golden Rule
Whatever you do to one side, you must do to the other side!

## One-Step Equations

### Addition/Subtraction
**Solve:** $x + 7 = 12$

Step 1: Subtract 7 from both sides
$$x + 7 - 7 = 12 - 7$$
$$x = 5$$

Step 2: Check: $5 + 7 = 12$ ✓

### Multiplication/Division
**Solve:** $3x = 15$

Step 1: Divide both sides by 3
$$\\frac{3x}{3} = \\frac{15}{3}$$
$$x = 5$$

Step 2: Check: $3(5) = 15$ ✓

## Two-Step Equations

**Solve:** $2x + 5 = 13$

Step 1: Subtract 5 from both sides
$$2x + 5 - 5 = 13 - 5$$
$$2x = 8$$

Step 2: Divide both sides by 2
$$\\frac{2x}{2} = \\frac{8}{2}$$
$$x = 4$$

Step 3: Check: $2(4) + 5 = 8 + 5 = 13$ ✓

## Practice Problems
Solve for x:

1. $x + 9 = 14$
2. $x - 6 = 8$
3. $4x = 28$
4. $\\frac{x}{5} = 3$
5. $3x + 7 = 22$
6. $5x - 8 = 17$

## Answers
1. x = 5
2. x = 14
3. x = 7
4. x = 15
5. x = 5
6. x = 5`,
      objectives: ['Solve one-step linear equations', 'Solve two-step linear equations', 'Check solutions by substitution']
    },
    mastery: {
      title: 'Mastering Linear Equations',
      description: 'Tackle complex equations and real-world applications',
      content: `# Mastering Linear Equations

## Variables on Both Sides

**Solve:** $5x + 3 = 2x + 15$

Step 1: Get variables on one side (subtract 2x)
$$5x - 2x + 3 = 2x - 2x + 15$$
$$3x + 3 = 15$$

Step 2: Subtract 3
$$3x = 12$$

Step 3: Divide by 3
$$x = 4$$

Step 4: Check: $5(4) + 3 = 23$ and $2(4) + 15 = 23$ ✓

## Equations with Parentheses

**Solve:** $3(x + 4) = 21$

Step 1: Distribute
$$3x + 12 = 21$$

Step 2: Subtract 12
$$3x = 9$$

Step 3: Divide by 3
$$x = 3$$

## Word Problem Applications

**Problem:** A phone plan costs $25 per month plus $0.10 per text. If the bill was $35, how many texts were sent?

Set up equation: $25 + 0.10t = 35$

Solve:
$$0.10t = 10$$
$$t = 100 \\text{ texts}$$

## Challenge Problems

1. $4(2x - 3) = 20$
2. $6x + 5 = 3x + 20$
3. $\\frac{x + 5}{2} = 8$

## Answers
1. x = 4
2. x = 5
3. x = 11`,
      objectives: ['Solve equations with variables on both sides', 'Solve equations with parentheses', 'Apply linear equations to word problems']
    }
  },

  'quadratic_equations': {
    intro: {
      title: 'Introduction to Quadratic Equations',
      description: 'Understand the form and properties of quadratic equations',
      content: `# Introduction to Quadratic Equations

## What is a Quadratic Equation?
A **quadratic equation** has the variable raised to the second power ($x^2$).

### Standard Form:
$$ax^2 + bx + c = 0$$

Where:
- $a$ = coefficient of $x^2$ (cannot be 0)
- $b$ = coefficient of $x$
- $c$ = constant term

### Examples:
- $x^2 + 5x + 6 = 0$ (a=1, b=5, c=6)
- $2x^2 - 3x - 5 = 0$ (a=2, b=-3, c=-5)
- $x^2 - 9 = 0$ (a=1, b=0, c=-9)

## The Parabola
When graphed, a quadratic equation forms a **parabola** (U-shape).

Key features:
- **Vertex:** The highest or lowest point
- **Axis of symmetry:** Line through the vertex
- **Opens up** if $a > 0$
- **Opens down** if $a < 0$

## Why Quadratics Matter
- Projectile motion (throwing a ball)
- Area problems
- Profit/revenue calculations
- Architecture and design`,
      objectives: ['Identify the standard form of a quadratic equation', 'Recognize the coefficients a, b, and c', 'Understand the shape of a parabola']
    },
    practice: {
      title: 'Solving Quadratic Equations',
      description: 'Learn multiple methods to solve quadratics',
      content: `# Solving Quadratic Equations

## Method 1: Factoring

**Solve:** $x^2 + 5x + 6 = 0$

Step 1: Find two numbers that multiply to 6 and add to 5
- Numbers: 2 and 3 (2×3=6, 2+3=5)

Step 2: Factor
$$(x + 2)(x + 3) = 0$$

Step 3: Set each factor to zero
$$x + 2 = 0 \\Rightarrow x = -2$$
$$x + 3 = 0 \\Rightarrow x = -3$$

**Solutions:** $x = -2$ or $x = -3$

## Method 2: Quadratic Formula

$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$

**Solve:** $2x^2 + 5x - 3 = 0$

$a = 2$, $b = 5$, $c = -3$

$$x = \\frac{-5 \\pm \\sqrt{25 + 24}}{4} = \\frac{-5 \\pm 7}{4}$$

$$x = \\frac{2}{4} = 0.5 \\text{ or } x = \\frac{-12}{4} = -3$$

## Practice Problems
Solve by factoring:
1. $x^2 + 7x + 12 = 0$
2. $x^2 - 5x + 6 = 0$
3. $x^2 - 9 = 0$

## Answers
1. x = -3 or x = -4
2. x = 2 or x = 3
3. x = 3 or x = -3`,
      objectives: ['Solve quadratics by factoring', 'Apply the quadratic formula', 'Find both solutions to a quadratic']
    },
    mastery: {
      title: 'Mastering Quadratic Equations',
      description: 'Apply quadratics to complex problems',
      content: `# Mastering Quadratic Equations

## The Discriminant
The **discriminant** tells us about the solutions:
$$D = b^2 - 4ac$$

- $D > 0$: Two real solutions
- $D = 0$: One real solution
- $D < 0$: No real solutions (complex numbers)

## Completing the Square

**Solve:** $x^2 + 6x + 5 = 0$

Step 1: Move constant
$$x^2 + 6x = -5$$

Step 2: Add $(\\frac{b}{2})^2 = 9$ to both sides
$$x^2 + 6x + 9 = 4$$

Step 3: Factor left side
$$(x + 3)^2 = 4$$

Step 4: Take square root
$$x + 3 = \\pm 2$$
$$x = -1 \\text{ or } x = -5$$

## Word Problem: Projectile Motion

A ball is thrown upward with height:
$$h = -16t^2 + 48t + 4$$

When does it hit the ground? (h = 0)
$$-16t^2 + 48t + 4 = 0$$
$$t = \\frac{-48 \\pm \\sqrt{2304 + 256}}{-32} = 3.08 \\text{ seconds}$$

## Challenge
Find the vertex of $y = x^2 - 4x + 1$

Vertex: $x = -\\frac{b}{2a} = 2$
$y = (2)^2 - 4(2) + 1 = -3$
**Vertex: (2, -3)**`,
      objectives: ['Use the discriminant to analyze solutions', 'Solve by completing the square', 'Apply quadratics to real-world problems']
    }
  }
};

// ============================================
// SCIENCE CONTENT
// ============================================
export const scienceContent: Record<string, LessonContent> = {
  'plants_animals': {
    intro: {
      title: 'Introduction to Plants and Animals',
      description: 'Learn about living things around us',
      content: `# Plants and Animals

## What Are Living Things?
Living things are called **organisms**. They:
- Grow and change
- Need food and water
- Can reproduce (make more of themselves)

## Plants 🌱
Plants are living things that:
- Make their own food using sunlight
- Have roots, stems, and leaves
- Cannot move from place to place
- Give us oxygen to breathe

### Parts of a Plant
- **Roots:** Get water from soil
- **Stem:** Carries water up the plant
- **Leaves:** Make food from sunlight
- **Flower:** Makes seeds

## Animals 🐾
Animals are living things that:
- Cannot make their own food
- Must eat plants or other animals
- Can move from place to place
- Breathe oxygen

### Types of Animals
- **Mammals:** Have fur, drink mother's milk (dogs, cats, humans)
- **Birds:** Have feathers, lay eggs
- **Fish:** Live in water, have scales
- **Insects:** Have 6 legs (ants, butterflies)`,
      objectives: ['Identify characteristics of living things', 'Name parts of a plant', 'Classify different types of animals']
    },
    practice: {
      title: 'Exploring Plants and Animals',
      description: 'Practice identifying and classifying living things',
      content: `# Practice: Plants and Animals

## Activity 1: Plant Parts
Label the parts of the plant:
1. The part underground that drinks water: ________
2. The tall part that holds up the plant: ________
3. The green parts that make food: ________
4. The colorful part that makes seeds: ________

## Activity 2: Animal Classification
Sort these animals into groups:

**Animals:** Dog, Eagle, Goldfish, Ant, Cat, Penguin, Shark, Butterfly

| Mammals | Birds | Fish | Insects |
|---------|-------|------|---------|
|         |       |      |         |

## Activity 3: Living or Non-Living?
Circle the living things:
- Rock
- Tree
- Car
- Butterfly
- Water
- Flower
- Stuffed animal
- Bird

## Activity 4: Draw and Label
Draw your favorite animal and label:
- What does it eat?
- Where does it live?
- How does it move?

## Answers
1. roots, stem, leaves, flower
2. Mammals: Dog, Cat | Birds: Eagle, Penguin | Fish: Goldfish, Shark | Insects: Ant, Butterfly
3. Living: Tree, Butterfly, Flower, Bird`,
      objectives: ['Label plant parts correctly', 'Sort animals into classification groups', 'Distinguish living from non-living things']
    },
    mastery: {
      title: 'Plants and Animals Expert',
      description: 'Apply your knowledge to real-world situations',
      content: `# Mastery: Plants and Animals

## Life Cycles

### Plant Life Cycle
Seed → Sprout → Young Plant → Adult Plant → Flowers → Seeds

### Butterfly Life Cycle
Egg → Caterpillar → Chrysalis → Butterfly

## Food Chains
Plants and animals depend on each other!

**Example Food Chain:**
Sun → Grass → Rabbit → Fox

- Grass uses sunlight to make food
- Rabbit eats the grass
- Fox eats the rabbit

## Habitats
A **habitat** is where an animal lives.

| Animal | Habitat |
|--------|---------|
| Fish | Ocean, lakes |
| Bird | Trees, sky |
| Bear | Forest |
| Camel | Desert |

## Challenge Questions

1. Why do plants need sunlight?
2. What would happen if all the plants disappeared?
3. How are mammals different from birds?

## Science Project
Grow your own plant!
1. Put soil in a cup
2. Plant a seed
3. Add water
4. Place in sunlight
5. Watch it grow and record what you see!`,
      objectives: ['Describe life cycles of plants and animals', 'Explain how food chains work', 'Understand the concept of habitats']
    }
  },

  'cell_structure': {
    intro: {
      title: 'Introduction to Cell Structure',
      description: 'Explore the building blocks of life',
      content: `# Cell Structure

## What is a Cell?
A **cell** is the smallest unit of life. All living things are made of cells!

- Some organisms have just ONE cell (bacteria)
- Humans have about 37 TRILLION cells!

## Cell Theory
1. All living things are made of cells
2. Cells are the basic unit of life
3. All cells come from existing cells

## Parts of a Cell (Organelles)

### The Cell Membrane
- Outer boundary of the cell
- Controls what enters and exits
- Like a security guard at a door

### The Nucleus
- "Control center" of the cell
- Contains DNA (genetic instructions)
- Like the brain of the cell

### Cytoplasm
- Jelly-like fluid filling the cell
- Where chemical reactions happen
- Holds organelles in place

### Mitochondria
- "Powerhouse" of the cell
- Produces energy (ATP)
- Like a power plant

### Ribosomes
- Make proteins
- Found throughout the cell
- Like tiny factories`,
      objectives: ['Define what a cell is', 'State the three parts of cell theory', 'Identify major cell organelles and their functions']
    },
    practice: {
      title: 'Cell Structure Practice',
      description: 'Identify and describe cell parts',
      content: `# Cell Structure Practice

## Organelle Matching
Match each organelle to its function:

| Organelle | Function |
|-----------|----------|
| 1. Nucleus | A. Produces energy |
| 2. Cell Membrane | B. Contains DNA |
| 3. Mitochondria | C. Makes proteins |
| 4. Ribosomes | D. Controls entry/exit |
| 5. Cytoplasm | E. Holds organelles |

## Fill in the Blanks

1. The __________ is called the "powerhouse" of the cell.
2. DNA is found in the __________.
3. The __________ acts like a security guard for the cell.
4. __________ make proteins in the cell.
5. The jelly-like substance in cells is called __________.

## Plant vs Animal Cells

**Plant cells have these EXTRA parts:**
- Cell Wall (rigid outer layer)
- Chloroplasts (for photosynthesis)
- Large Central Vacuole (stores water)

Label which cell is which:
- Cell with cell wall: __________
- Cell without chloroplasts: __________

## Diagram Practice
Draw a simple cell and label:
- Cell membrane
- Nucleus
- Cytoplasm
- Mitochondria

## Answers
Matching: 1-B, 2-D, 3-A, 4-C, 5-E
Blanks: mitochondria, nucleus, cell membrane, Ribosomes, cytoplasm
Cells: Plant cell has wall, Animal cell lacks chloroplasts`,
      objectives: ['Match organelles to their functions', 'Compare plant and animal cells', 'Draw and label a basic cell diagram']
    },
    mastery: {
      title: 'Cell Structure Mastery',
      description: 'Deep dive into cell biology',
      content: `# Cell Structure Mastery

## Detailed Organelle Functions

### Endoplasmic Reticulum (ER)
- **Rough ER:** Has ribosomes, makes proteins
- **Smooth ER:** Makes lipids, detoxifies

### Golgi Apparatus
- "Shipping center" of the cell
- Packages and sends proteins

### Lysosomes
- "Cleanup crew"
- Breaks down waste and old organelles

### Vacuoles
- Storage containers
- Plant cells: Large central vacuole
- Animal cells: Small vacuoles

## Cell Transport

### Passive Transport (No energy needed)
- **Diffusion:** Molecules move from high to low concentration
- **Osmosis:** Water moves through membrane

### Active Transport (Energy required)
- Moves molecules against concentration gradient
- Uses ATP energy

## Microscope Skills

**Magnification = Eyepiece × Objective**

Example: 10× eyepiece × 40× objective = 400× magnification

## Challenge: Cell Analogy
Create an analogy comparing a cell to a city:
- Nucleus = City Hall (control center)
- Mitochondria = Power Plant
- Cell Membrane = City Walls
- Ribosomes = Factories

## Research Question
How do cancer cells differ from normal cells?`,
      objectives: ['Describe all major organelles in detail', 'Explain passive and active transport', 'Calculate microscope magnification']
    }
  },

  'photosynthesis': {
    intro: {
      title: 'Introduction to Photosynthesis',
      description: 'Learn how plants make their own food',
      content: `# Photosynthesis

## What is Photosynthesis?
**Photosynthesis** is the process plants use to make food from sunlight.

Photo = Light
Synthesis = Making

## The Equation

$$6CO_2 + 6H_2O + Light \\rightarrow C_6H_{12}O_6 + 6O_2$$

In words:
**Carbon Dioxide + Water + Sunlight → Glucose + Oxygen**

## What Plants Need
1. **Sunlight** - Energy source
2. **Water** (H₂O) - From roots
3. **Carbon Dioxide** (CO₂) - From air through leaves

## What Plants Make
1. **Glucose** (C₆H₁₂O₆) - Sugar for food
2. **Oxygen** (O₂) - Released into air

## Where It Happens
Photosynthesis occurs in **chloroplasts** - special organelles in plant cells.
Chloroplasts contain **chlorophyll** - the green pigment that captures light.

\`\`\`mermaid
flowchart LR
    A[Sunlight] --> D[Chloroplast]
    B[Water] --> D
    C[CO2] --> D
    D --> E[Glucose]
    D --> F[Oxygen]
\`\`\``,
      objectives: ['Define photosynthesis', 'Write the photosynthesis equation', 'Identify inputs and outputs of photosynthesis']
    },
    practice: {
      title: 'Photosynthesis Practice',
      description: 'Apply your knowledge of photosynthesis',
      content: `# Photosynthesis Practice

## Label the Equation
Fill in the blanks:

___ + ___ + Sunlight → ___ + ___

## True or False
1. Plants make food at night. ___
2. Oxygen is a product of photosynthesis. ___
3. Photosynthesis happens in mitochondria. ___
4. Plants need carbon dioxide for photosynthesis. ___
5. Chlorophyll is blue. ___

## Diagram Questions
Look at a leaf diagram and answer:
1. Where does water enter the plant?
2. Where does CO₂ enter the leaf?
3. What organelle contains chlorophyll?

## Word Problems

1. A plant is placed in a dark room for a week. What happens to photosynthesis? Why?

2. Why do plants look green?

3. How do plants and animals depend on each other?

## Experiment Design
Design an experiment to test: "Do plants need light for photosynthesis?"
- What would you change? (variable)
- What would you keep the same? (controls)
- What would you measure?

## Answers
Equation: CO₂ + H₂O + Sunlight → Glucose + O₂
T/F: 1-F, 2-T, 3-F, 4-T, 5-F
Diagram: 1-Roots, 2-Stomata, 3-Chloroplast`,
      objectives: ['Complete the photosynthesis equation', 'Explain the role of each component', 'Design a photosynthesis experiment']
    },
    mastery: {
      title: 'Photosynthesis Mastery',
      description: 'Advanced concepts in photosynthesis',
      content: `# Photosynthesis Mastery

## Two Stages of Photosynthesis

### Light-Dependent Reactions
- Occur in **thylakoid membrane**
- Require sunlight
- Split water molecules
- Produce ATP and NADPH
- Release oxygen

### Light-Independent Reactions (Calvin Cycle)
- Occur in **stroma**
- Don't directly need light
- Use ATP and NADPH
- Fix CO₂ into glucose

## Factors Affecting Photosynthesis

| Factor | Effect |
|--------|--------|
| Light intensity | More light = faster rate (to a point) |
| CO₂ concentration | More CO₂ = faster rate (to a point) |
| Temperature | Optimal around 25-30°C |
| Water availability | Needed for reactions |

## Limiting Factors
The rate of photosynthesis is limited by whichever factor is in shortest supply.

## Global Importance
- Plants produce most of Earth's oxygen
- Plants remove CO₂ (greenhouse gas)
- Base of most food chains
- Fossil fuels = ancient photosynthesis

## Challenge Problems

1. Calculate: If a plant produces 180g of glucose, how many grams of CO₂ did it use?
   (Hint: Use the balanced equation)

2. Explain why deforestation affects global climate.

3. How could we increase crop yields using knowledge of photosynthesis?

## Answer to #1
$6CO_2 = 6 \\times 44g = 264g$ for every $180g$ glucose`,
      objectives: ['Describe the two stages of photosynthesis', 'Analyze factors that affect photosynthesis rate', 'Connect photosynthesis to global environmental issues']
    }
  }
};

// ============================================
// ELA CONTENT
// ============================================
export const elaContent: Record<string, LessonContent> = {
  'phonics': {
    intro: {
      title: 'Introduction to Phonics',
      description: 'Learn letter sounds and how to read',
      content: `# Learning Letter Sounds

## What is Phonics?
Phonics helps us learn that letters make sounds. When we put sounds together, we can read words!

## Vowels
The vowels are: **A, E, I, O, U**
Each vowel makes a short sound and a long sound.

### Short Vowel Sounds
- **A** = "ah" (cat, hat, map)
- **E** = "eh" (bed, red, pet)
- **I** = "ih" (sit, pig, fin)
- **O** = "oh" (hot, dog, top)
- **U** = "uh" (cup, bug, sun)

## Consonants
All other letters are consonants. Let's learn their sounds!

- **B** = "buh" (ball, bed)
- **C** = "kuh" (cat, cup)
- **D** = "duh" (dog, dad)
- **M** = "mmm" (mom, map)
- **S** = "sss" (sun, sit)

## Putting Sounds Together
C + A + T = CAT!
Let's sound it out: "kuh" + "ah" + "tuh" = CAT

## Practice Words
- mat
- sat
- hat
- bat`,
      objectives: ['Identify vowels and consonants', 'Make short vowel sounds', 'Blend sounds to read simple words']
    },
    practice: {
      title: 'Phonics Practice',
      description: 'Practice reading and sounding out words',
      content: `# Phonics Practice

## Sound It Out
Read each word by saying each sound:
1. c-a-t = ___
2. d-o-g = ___
3. s-u-n = ___
4. p-i-g = ___
5. r-e-d = ___

## Rhyming Words
Words that rhyme have the same ending sound!
Cat rhymes with: hat, bat, sat, mat

Find words that rhyme with:
- dog: ___, ___, ___
- fun: ___, ___, ___
- bed: ___, ___, ___

## Beginning Sounds
What sound does each word start with?
- **B**all starts with ___
- **S**un starts with ___
- **M**om starts with ___

## Word Families
The -at family: cat, hat, bat, sat, mat, rat
The -og family: dog, log, fog, hog, jog

Make words with -un: s___, r___, b___, f___

## Read the Sentence
The cat sat on the mat.

## Answers
Sound it out: cat, dog, sun, pig, red
Rhyming: dog-log-fog, fun-sun-run, bed-red-fed
Beginning: /b/, /s/, /m/
-un words: sun, run, bun, fun`,
      objectives: ['Sound out CVC words', 'Identify rhyming words', 'Recognize word families']
    },
    mastery: {
      title: 'Phonics Master',
      description: 'Read longer words and sentences',
      content: `# Phonics Master

## Consonant Blends
Two consonants together make a blend!
- **BL**: black, blue, blow
- **CR**: crab, cry, crib
- **ST**: stop, star, step
- **TR**: tree, trip, truck

## Digraphs
Two letters that make ONE sound:
- **CH**: chip, chop, cheese
- **SH**: ship, shop, shell
- **TH**: this, that, the
- **WH**: what, when, where

## Long Vowel Sounds
When a word has magic E, the vowel says its name!
- cap → cape (long A)
- kit → kite (long I)
- hop → hope (long O)
- cub → cube (long U)

## Read the Story
Sam had a cat.
The cat was on the mat.
The cat ran to Sam.
Sam was glad!

## Challenge Words
Read these longer words:
- jumping
- faster
- happy
- basket

## Write a Sentence
Use these words to write a sentence:
dog, big, ran, the`,
      objectives: ['Read words with consonant blends', 'Identify digraphs', 'Read sentences fluently']
    }
  },

  'reading_comprehension': {
    intro: {
      title: 'Introduction to Reading Comprehension',
      description: 'Learn how to understand what you read',
      content: `# Understanding What You Read

## What is Reading Comprehension?
Reading comprehension means understanding and remembering what you read.

## Good Readers:
1. Think about what they're reading
2. Ask questions
3. Make pictures in their mind
4. Connect to what they already know

## Key Questions to Ask
- **Who** is the story about?
- **What** happened?
- **Where** did it happen?
- **When** did it happen?
- **Why** did it happen?
- **How** did it happen?

## Main Idea
The **main idea** is what the story is mostly about.

## Details
**Details** are small pieces of information that tell us more about the main idea.

## Example
*The dog ran in the park. He chased a ball. He was very happy.*

- **Main Idea:** The dog played in the park
- **Details:** He ran, chased a ball, was happy`,
      objectives: ['Define reading comprehension', 'Ask who, what, where, when, why, how questions', 'Identify main idea and details']
    },
    practice: {
      title: 'Reading Comprehension Practice',
      description: 'Practice understanding texts',
      content: `# Comprehension Practice

## Read the Passage

**The Birthday Party**

Today is Mia's birthday. She is turning seven years old. Her mom made a chocolate cake. Mia's friends came to her house. They played games and ate cake. Mia got many presents. It was the best day ever!

## Answer the Questions

1. Who is having a birthday?
2. How old is she turning?
3. What kind of cake did her mom make?
4. Where was the party?
5. What did they do at the party?

## True or False
1. Mia is turning eight. ___
2. The cake was chocolate. ___
3. The party was at school. ___
4. Mia had a good day. ___

## Main Idea
What is this story mostly about?
a) Making a cake
b) Mia's birthday party
c) Playing games

## Make a Connection
Have you ever had a birthday party? How was it similar to Mia's party?

## Answers
1. Mia 2. Seven 3. Chocolate 4. Her house 5. Played games and ate cake
T/F: 1-F, 2-T, 3-F, 4-T
Main Idea: b`,
      objectives: ['Answer comprehension questions', 'Distinguish true from false statements', 'Make personal connections to text']
    },
    mastery: {
      title: 'Comprehension Champion',
      description: 'Advanced reading strategies',
      content: `# Advanced Comprehension

## Making Inferences
An **inference** is when you figure something out that isn't directly stated.

*Sara looked out the window and frowned. She put away her swimsuit.*

Inference: It's probably raining, so Sara can't go swimming.

## Cause and Effect
- **Cause:** Why something happened
- **Effect:** What happened

*The cat knocked over the vase. It broke into pieces.*
- Cause: Cat knocked over vase
- Effect: Vase broke

## Compare and Contrast
- **Compare:** How things are alike
- **Contrast:** How things are different

## Summarizing
A **summary** tells the most important parts in your own words.

## Practice Passage
Read and answer:

*Tom wanted to buy a new bike. He did chores every day. He washed dishes and cleaned his room. After three months, he had enough money. Tom was so excited when he finally bought his blue bike!*

1. What did Tom want?
2. What caused Tom to have enough money?
3. How did Tom feel at the end?
4. Write a one-sentence summary.

## Answers
1. A new bike 2. He did chores for three months 3. Excited
4. Tom did chores for three months to save money and buy a bike.`,
      objectives: ['Make inferences from text', 'Identify cause and effect', 'Summarize passages']
    }
  }
};

// ============================================
// EARLY CHILDHOOD CONTENT
// ============================================
export const earlyChildhoodContent: Record<string, LessonContent> = {
  'colors_shapes': {
    intro: {
      title: 'Learning Colors and Shapes',
      description: 'Discover the world of colors and shapes',
      content: `# Colors and Shapes

## Colors All Around! 🌈

### Primary Colors
🔴 **Red** - like apples and firetrucks
🟡 **Yellow** - like the sun and bananas
🔵 **Blue** - like the sky and water

### Other Colors
🟢 **Green** - like grass and frogs
🟠 **Orange** - like oranges and pumpkins
🟣 **Purple** - like grapes and flowers

## Shapes All Around!

### Circle ⭕
- Round like a ball
- Has no corners
- Like the sun, cookies, wheels

### Square ⬜
- Has 4 equal sides
- Has 4 corners
- Like blocks, windows, crackers

### Triangle 🔺
- Has 3 sides
- Has 3 corners
- Like pizza slices, rooftops

### Rectangle
- Has 4 sides (2 long, 2 short)
- Has 4 corners
- Like doors, books, phones

## Song: "Colors Song"
Red and yellow, green and blue,
Purple, orange, pink too!
Colors everywhere we see,
Colors are for you and me!`,
      objectives: ['Name basic colors', 'Identify circles, squares, and triangles', 'Find colors and shapes in the environment']
    },
    practice: {
      title: 'Colors and Shapes Fun',
      description: 'Practice finding and matching colors and shapes',
      content: `# Colors and Shapes Practice

## Color Matching
Draw a line from the word to the color:
- Red → 🔴
- Blue → 🔵
- Yellow → 🟡
- Green → 🟢

## Shape Hunt
Look around your room! Find something that is:
- Round (circle): ___________
- Square: ___________
- A rectangle: ___________

## What Color Is It?
🍎 Apple is ___________
🌻 Sun is ___________
🌊 Water is ___________
🥕 Carrot is ___________

## Shape Sorting
Sort these items by shape:
ball, book, clock, door, pizza slice, block

| Circle | Square | Rectangle | Triangle |
|--------|--------|-----------|----------|
|        |        |           |          |

## Coloring Activity
Color the shapes:
- Color the circle RED
- Color the square BLUE
- Color the triangle YELLOW

## Answers
Color: red, yellow, blue, orange
Sorting: Circle-ball/clock, Square-block, Rectangle-book/door, Triangle-pizza slice`,
      objectives: ['Match colors to objects', 'Sort objects by shape', 'Follow coloring instructions']
    },
    mastery: {
      title: 'Colors and Shapes Expert',
      description: 'Explore more colors and shapes',
      content: `# More Colors and Shapes!

## Mixing Colors
What happens when we mix colors?
- Red + Yellow = **Orange**
- Blue + Yellow = **Green**
- Red + Blue = **Purple**

## More Shapes

### Oval
- Like a stretched circle
- Examples: eggs, lemons

### Diamond (Rhombus)
- Like a tilted square
- Examples: kites, playing cards

### Star ⭐
- Has points!
- Examples: stars in sky, decorations

### Heart ❤️
- The love shape!
- Examples: valentines, decorations

## Pattern Fun
What comes next?
🔴🔵🔴🔵🔴___

⭕⬜⭕⬜⭕___

## Shape Art
Can you draw a:
- House using shapes? (square + triangle)
- Face using shapes? (circle + triangles)
- Robot using shapes?

## Color Words
Practice writing:
- R-E-D
- B-L-U-E
- G-R-E-E-N

## Answers
Patterns: blue circle, square`,
      objectives: ['Understand color mixing', 'Identify additional shapes', 'Continue simple patterns']
    }
  },

  'numbers_counting': {
    intro: {
      title: 'Learning Numbers',
      description: 'Count from 1 to 10',
      content: `# Numbers 1 to 10

## Let's Learn Numbers!

### 1 - One
☝️ One finger, one nose, one sun!

### 2 - Two
✌️ Two eyes, two hands, two feet!

### 3 - Three
🖐️ Three little pigs!

### 4 - Four
Four legs on a dog!

### 5 - Five
🖐️ Five fingers on one hand!

### 6 - Six
Six sides on a cube!

### 7 - Seven
Seven days in a week!

### 8 - Eight
🕷️ Eight legs on a spider!

### 9 - Nine
Nine is almost ten!

### 10 - Ten
🙌 Ten fingers on both hands!

## Counting Song
1, 2, 3, 4, 5,
Once I caught a fish alive!
6, 7, 8, 9, 10,
Then I let it go again!`,
      objectives: ['Recognize numbers 1-10', 'Count objects up to 10', 'Connect numbers to quantities']
    },
    practice: {
      title: 'Counting Practice',
      description: 'Practice counting and number recognition',
      content: `# Counting Practice

## Count and Write
How many are there? Write the number.

⭐⭐⭐ = ___
🍎🍎🍎🍎🍎 = ___
🐟🐟 = ___
🌸🌸🌸🌸 = ___

## Match Numbers
Draw a line:
3 → 🍎🍎🍎
5 → 🌟🌟🌟🌟🌟
2 → 🐱🐱
4 → 🌈🌈🌈🌈

## What Comes Next?
1, 2, 3, ___
4, 5, ___, 7
7, 8, ___, 10

## Circle the Right Number
Circle 4: 2 4 6
Circle 7: 5 7 9
Circle 3: 1 3 5

## Draw the Right Amount
Draw 3 circles:
Draw 5 stars:
Draw 2 hearts:

## Answers
Count: 3, 5, 2, 4
Next: 4, 6, 9`,
      objectives: ['Count objects and write numbers', 'Match numbers to quantities', 'Fill in missing numbers in sequence']
    },
    mastery: {
      title: 'Numbers Champion',
      description: 'Count higher and learn more',
      content: `# Numbers Champion

## Counting to 20
11 - eleven
12 - twelve
13 - thirteen
14 - fourteen
15 - fifteen
16 - sixteen
17 - seventeen
18 - eighteen
19 - nineteen
20 - twenty!

## Count Backwards
10, 9, 8, 7, 6, 5, 4, 3, 2, 1... BLAST OFF! 🚀

## More or Less?
Which is more?
3 🍎🍎🍎 or 5 🍎🍎🍎🍎🍎

Circle the group with MORE.

## Number Words
1 = one
2 = two
3 = three
4 = four
5 = five

Match:
four → ___
two → ___
five → ___

## Challenge
Count by 2s: 2, 4, 6, ___, ___
Count by 5s: 5, 10, ___, ___

## Answers
More: 5
Match: 4, 2, 5
By 2s: 8, 10
By 5s: 15, 20`,
      objectives: ['Count to 20', 'Count backwards from 10', 'Compare quantities']
    }
  }
};

// ============================================
// CONTENT GENERATOR FUNCTION
// ============================================
export function generateLessonContent(
  topicCode: string,
  topicName: string,
  categoryCode: string,
  gradeLevel: number
): LessonContent {
  // Check for pre-built content first - merge all content sources
  const allContent = {
    ...mathContent,
    ...scienceContent,
    ...elaContent,
    ...earlyChildhoodContent,
    ...mathK5Content,
    ...mathGrades35Content,
    ...algebraIContent,
    ...algebraIIContent,
    ...geometryContent,
    ...scienceK5Content,
    ...scienceGrades35Content,
    ...biologyContent,
    ...chemistryContent,
    ...physicsContent,
    ...earlyChildhoodContentFile,
    ...computerScienceContentFile,
    ...elaK5ContentFile,
    ...socialStudiesK5ContentFile,
    ...elaGrades35Content,
    ...socialStudiesGrades35Content,
    ...usHistoryContent,
    ...vocationalContent,
    ...artsMusicContent,
    ...peHealthContent
  };

  if (allContent[topicCode]) {
    return allContent[topicCode];
  }

  // Generate content based on category and grade
  const lang = getGradeLanguage(gradeLevel);

  return {
    intro: {
      title: `Introduction to ${topicName}`,
      description: `Learn the fundamentals of ${topicName.toLowerCase()}`,
      content: generateIntroContent(topicName, categoryCode, gradeLevel, lang),
      objectives: [
        `Define and explain ${topicName.toLowerCase()}`,
        `Identify key concepts related to ${topicName.toLowerCase()}`,
        `Connect ${topicName.toLowerCase()} to prior knowledge`
      ]
    },
    practice: {
      title: `${topicName} Practice`,
      description: `Apply your knowledge of ${topicName.toLowerCase()} through guided practice`,
      content: generatePracticeContent(topicName, categoryCode, gradeLevel, lang),
      objectives: [
        `Apply concepts of ${topicName.toLowerCase()}`,
        `Solve problems involving ${topicName.toLowerCase()}`,
        `Check and verify your work`
      ]
    },
    mastery: {
      title: `Mastering ${topicName}`,
      description: `Challenge yourself with advanced ${topicName.toLowerCase()} concepts`,
      content: generateMasteryContent(topicName, categoryCode, gradeLevel, lang),
      objectives: [
        `Demonstrate mastery of ${topicName.toLowerCase()}`,
        `Apply ${topicName.toLowerCase()} to real-world situations`,
        `Solve complex problems independently`
      ]
    }
  };
}

function generateIntroContent(topic: string, category: string, grade: number, lang: { complexity: string; examples: string }): string {
  const categoryIntros: Record<string, string> = {
    'math': `# Introduction to ${topic}

## What is ${topic}?
${topic} is an important math concept that helps us solve problems.

## Why Learn ${topic}?
Understanding ${topic} helps you:
- Solve real-world problems
- Build skills for more advanced math
- Think logically and critically

## Key Vocabulary
Make sure you understand these important words as we learn about ${topic}.

## Getting Started
Let's begin by exploring the basics of ${topic}. We'll use ${lang.examples} to help us understand.

## Remember
- Take your time
- Ask questions if confused
- Practice makes perfect!`,

    'science': `# Introduction to ${topic}

## What is ${topic}?
${topic} is a fascinating science topic that helps us understand the world around us.

## Scientific Thinking
As we learn about ${topic}, we will:
- Make observations
- Ask questions
- Find evidence
- Draw conclusions

## Key Concepts
Understanding ${topic} requires learning about several important ideas.

## Real-World Connections
${topic} is all around us! Look for examples in ${lang.examples}.

## Science Safety
Always follow safety rules when doing science activities.`,

    'ela': `# Introduction to ${topic}

## What is ${topic}?
${topic} is an important part of reading and writing that helps us communicate better.

## Why is ${topic} Important?
Learning ${topic} helps you:
- Become a better reader
- Express your ideas clearly
- Understand others better

## Key Skills
We'll practice several skills as we learn about ${topic}.

## Tips for Success
- Read carefully
- Think about what you read
- Practice every day`,

    'history': `# Introduction to ${topic}

## What is ${topic}?
${topic} is an important part of history that helps us understand how we got to where we are today.

## Why Study ${topic}?
Learning about ${topic} helps us:
- Understand the past
- Make sense of the present
- Prepare for the future

## Key Events and People
We'll learn about important events and people related to ${topic}.

## Thinking Like a Historian
- Ask questions about the past
- Look for evidence
- Consider different perspectives`,

    'vocational': `# Introduction to ${topic}

## What is ${topic}?
${topic} is a valuable skill that can lead to rewarding career opportunities.

## Industry Overview
Understanding ${topic} is essential in many trades and professions.

## Safety First
Before we begin, always remember:
- Follow all safety procedures
- Wear appropriate protective equipment
- Ask questions if unsure

## Skills You'll Learn
This lesson will introduce fundamental concepts and techniques in ${topic}.`
  };

  return categoryIntros[category] || categoryIntros['science'];
}

function generatePracticeContent(topic: string, category: string, grade: number, lang: { complexity: string; examples: string }): string {
  return `# ${topic} Practice

## Warm-Up Review
Before we practice, let's review what we learned about ${topic}.

## Guided Practice
Work through these examples step by step.

### Example 1
[Practice problem with step-by-step solution]

### Example 2
[Another practice problem with guidance]

## Independent Practice
Now try these on your own!

### Problem Set
1. [Practice problem 1]
2. [Practice problem 2]
3. [Practice problem 3]
4. [Practice problem 4]
5. [Practice problem 5]

## Check Your Understanding
- Did you get the right answers?
- Which problems were easy? Which were hard?
- What questions do you still have?

## Self-Assessment
Rate your understanding:
- ⭐ Still learning
- ⭐⭐ Getting better
- ⭐⭐⭐ Got it!`;
}

function generateMasteryContent(topic: string, category: string, grade: number, lang: { complexity: string; examples: string }): string {
  return `# Mastering ${topic}

## Review of Key Concepts
You've learned a lot about ${topic}! Let's put it all together.

## Challenge Problems
These problems will test your deep understanding of ${topic}.

### Challenge 1
[Advanced problem requiring multiple steps]

### Challenge 2
[Problem connecting to other concepts]

### Challenge 3
[Real-world application problem]

## Real-World Applications
See how ${topic} is used in everyday life and careers.

## Extension Activities
Ready for more? Try these advanced challenges:
- Research project idea
- Creative application
- Connection to other subjects

## Reflection Questions
1. What was the most important thing you learned?
2. How can you use ${topic} in your life?
3. What questions do you still have?

## Congratulations!
You've worked hard to master ${topic}. Keep practicing to maintain your skills!`;
}

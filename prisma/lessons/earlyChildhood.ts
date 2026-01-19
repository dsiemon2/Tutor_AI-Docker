// Early Childhood Lesson Content
// Comprehensive educational content for preschool and pre-K

import { LessonContent } from '../lessonContentTypes';

export const earlyChildhoodContent: Record<string, LessonContent> = {
  // ==========================================
  // COLORS & SHAPES
  // ==========================================
  'ec-colors-primary': {
    intro: {
      title: 'Primary Colors',
      description: 'Learn red, blue, and yellow',
      content: `# Primary Colors

## What are Primary Colors?
The 3 main colors are:
🔴 **RED** - like apples and fire trucks
🔵 **BLUE** - like the sky and blueberries
🟡 **YELLOW** - like the sun and bananas

## Red Things
- 🍎 Apples
- 🚒 Fire trucks
- ❤️ Hearts
- 🍓 Strawberries

## Blue Things
- 🌊 Ocean
- 🫐 Blueberries
- 👖 Jeans
- 🦋 Some butterflies

## Yellow Things
- ☀️ Sun
- 🍌 Bananas
- 🐥 Baby chicks
- 🌻 Sunflowers

## Song: Colors Song
🎵 Red, blue, yellow too,
These colors are for me and you!
Look around and you will see,
Colors everywhere for you and me! 🎵`,
      objectives: ['Name the three primary colors', 'Find red, blue, and yellow things', 'Say color names']
    },
    practice: {
      title: 'Primary Colors Practice',
      description: 'Practice finding colors',
      content: `# Color Practice

## Point to the Color
Find something RED in your room!
Find something BLUE!
Find something YELLOW!

## Color Match
🔴 This is ___
🔵 This is ___
🟡 This is ___

## What Color?
Apples are ___
The sky is ___
The sun is ___
Bananas are ___

## Coloring Time
Color the apple RED 🍎
Color the sun YELLOW ☀️
Color the water BLUE 💧

## Answers
Colors: red, blue, yellow
Apple: red, Sky: blue, Sun: yellow, Bananas: yellow`,
      objectives: ['Identify primary colors', 'Match colors to objects']
    },
    mastery: {
      title: 'Primary Colors Champion',
      description: 'Show your color knowledge',
      content: `# Color Champion! 🌈

## Color Hunt
Find 3 red things: ___, ___, ___
Find 3 blue things: ___, ___, ___
Find 3 yellow things: ___, ___, ___

## Which Doesn't Belong?
Circle the one that's NOT red:
🍎 🍌 🍓 ❤️

## My Favorite Color
My favorite primary color is ___
I like it because ___

## Color Song
Sing the colors song!
Can you make up your own color verse?

## Great Job! 🌟
You know your primary colors!`,
      objectives: ['Find colors independently', 'Express color preferences']
    }
  },

  'ec-colors-secondary': {
    intro: {
      title: 'Secondary Colors',
      description: 'Learn orange, green, and purple',
      content: `# Secondary Colors

## What are Secondary Colors?
When you MIX primary colors, you get NEW colors!

🔴 + 🟡 = 🟠 **ORANGE**
🔵 + 🟡 = 🟢 **GREEN**
🔴 + 🔵 = 🟣 **PURPLE**

## Orange Things
- 🍊 Oranges
- 🥕 Carrots
- 🎃 Pumpkins

## Green Things
- 🌿 Grass
- 🥒 Cucumbers
- 🐸 Frogs
- 🌲 Trees

## Purple Things
- 🍇 Grapes
- 🍆 Eggplant
- 💜 Hearts
- Some flowers

## Color Mixing Fun!
Red + Yellow = Orange (like sunset!)
Blue + Yellow = Green (like leaves!)
Red + Blue = Purple (like grapes!)`,
      objectives: ['Name secondary colors', 'Understand color mixing', 'Find secondary colors']
    },
    practice: {
      title: 'Secondary Colors Practice',
      description: 'Practice with new colors',
      content: `# Secondary Colors Practice

## Mix and Match
Red + Yellow = ___
Blue + Yellow = ___
Red + Blue = ___

## What Color Is It?
🟠 This is ___
🟢 This is ___
🟣 This is ___

## Color Objects
Grass is ___
Oranges are ___
Grapes are ___

## Find the Color
Find something ORANGE!
Find something GREEN!
Find something PURPLE!

## Answers
Mix: orange, green, purple
Colors: orange, green, purple
Grass: green, Oranges: orange, Grapes: purple`,
      objectives: ['Recall color mixing', 'Identify secondary colors']
    },
    mastery: {
      title: 'Secondary Colors Expert',
      description: 'Master all six colors',
      content: `# Color Expert! 🎨

## All Six Colors
Name all 6 colors:
Primary: ___, ___, ___
Secondary: ___, ___, ___

## Color Riddles
I'm made from red and yellow.
Carrots are my color. What am I? ___

I'm the color of grass and trees.
Blue and yellow make me. What am I? ___

## Color Sort
Put these in groups:
apple, grass, grape, sun, orange, blueberry

Red: ___
Orange: ___
Yellow: ___
Green: ___
Blue: ___
Purple: ___

## Answers
Primary: red, blue, yellow
Secondary: orange, green, purple
Riddles: orange, green`,
      objectives: ['Name all colors', 'Solve color riddles']
    }
  },

  'ec-shapes-circle-square': {
    intro: {
      title: 'Circles and Squares',
      description: 'Learn about circles and squares',
      content: `# Circles and Squares

## Circle ⭕
A circle is ROUND!
- No corners
- Goes around and around
- Like a ball!

### Circle Things
- 🍪 Cookies
- ⚽ Balls
- 🕐 Clocks
- 🍕 Pizza
- Wheels 🛞

## Square ⬜
A square has:
- 4 sides (all the SAME!)
- 4 corners
- Looks like a box!

### Square Things
- 🪟 Windows
- 🧱 Blocks
- 📦 Boxes
- Crackers
- Tiles

## Trace with Your Finger
Circle: Start anywhere, go around! ⭕
Square: Go across, down, across, up! ⬜`,
      objectives: ['Identify circles and squares', 'Find circles and squares around you', 'Trace shapes']
    },
    practice: {
      title: 'Circles and Squares Practice',
      description: 'Practice with shapes',
      content: `# Shape Practice

## Name the Shape
⭕ This is a ___
⬜ This is a ___

## Circle or Square?
A ball → ___
A window → ___
A pizza → ___
A cracker → ___

## Count the Sides
A circle has ___ sides
A square has ___ sides

## Shape Hunt
Find a circle in your room: ___
Find a square in your room: ___

## Draw It!
Draw a circle:

Draw a square:

## Answers
Names: circle, square
Ball: circle, Window: square, Pizza: circle, Cracker: square
Sides: 0, 4`,
      objectives: ['Name shapes', 'Match objects to shapes', 'Draw shapes']
    },
    mastery: {
      title: 'Circles and Squares Expert',
      description: 'Master these shapes',
      content: `# Shape Expert! ⭐

## Shape Sort
Put each in the right group:
cookie, box, ball, block, pizza, cracker

Circles: ___
Squares: ___

## What's Different?
How is a circle different from a square?
Circle has ___ corners
Square has ___ corners

## Shape Picture
Use circles and squares to draw:
- A snowman (circles!)
- A robot (squares and circles!)

## Shape Song
🎵 A circle goes round,
A square has four sides,
Shapes are all around,
Let's go for a ride! 🎵

## Answers
Circles: cookie, ball, pizza
Squares: box, block, cracker
Corners: 0, 4`,
      objectives: ['Sort shapes', 'Compare shapes', 'Create with shapes']
    }
  },

  'ec-shapes-triangle-rectangle': {
    intro: {
      title: 'Triangles and Rectangles',
      description: 'Learn about triangles and rectangles',
      content: `# Triangles and Rectangles

## Triangle 🔺
A triangle has:
- 3 sides
- 3 corners (points)
- Looks like a mountain!

### Triangle Things
- 🍕 Pizza slices
- ⚠️ Yield signs
- 🏔️ Mountains
- Rooftops

## Rectangle ▭
A rectangle has:
- 4 sides
- 2 long sides, 2 short sides
- 4 corners
- Like a door!

### Rectangle Things
- 📱 Phones
- 📺 TV screens
- 🚪 Doors
- 📚 Books
- Paper

## Remember
- Triangle = 3 sides (Tri means three!)
- Rectangle = 4 sides (2 long, 2 short)`,
      objectives: ['Identify triangles and rectangles', 'Count sides and corners', 'Find shapes in real life']
    },
    practice: {
      title: 'Triangles and Rectangles Practice',
      description: 'Practice new shapes',
      content: `# Shape Practice

## Name the Shape
🔺 This is a ___
▭ This is a ___

## Count!
A triangle has ___ sides
A triangle has ___ corners
A rectangle has ___ sides
A rectangle has ___ corners

## What Shape?
A door → ___
A pizza slice → ___
A book → ___
A yield sign → ___

## Shape Hunt
Find a triangle: ___
Find a rectangle: ___

## Answers
Names: triangle, rectangle
Triangle: 3 sides, 3 corners
Rectangle: 4 sides, 4 corners
Door: rectangle, Pizza: triangle, Book: rectangle, Sign: triangle`,
      objectives: ['Name shapes', 'Count sides and corners']
    },
    mastery: {
      title: 'All Shapes Expert',
      description: 'Know all four shapes',
      content: `# Shape Master! 🏆

## All Four Shapes
| Shape | Sides | Corners |
|-------|-------|---------|
| Circle | ___ | ___ |
| Square | ___ | ___ |
| Triangle | ___ | ___ |
| Rectangle | ___ | ___ |

## Shape Riddles
I have 3 sides and 3 corners.
What shape am I? ___

I am round with no corners.
What shape am I? ___

I have 4 equal sides.
What shape am I? ___

## Build a House!
Use shapes to draw a house:
- Square for the house
- Triangle for the roof
- Rectangle for the door
- Circle for the doorknob

## Answers
Table: 0,0; 4,4; 3,3; 4,4
Riddles: triangle, circle, square`,
      objectives: ['Compare all shapes', 'Solve shape riddles', 'Create with shapes']
    }
  },

  // ==========================================
  // LETTERS & ABCs
  // ==========================================
  'ec-letters-az': {
    intro: {
      title: 'Letters A-Z Recognition',
      description: 'Learn to recognize all 26 letters',
      content: `# The Alphabet

## 26 Letters!
A B C D E F G
H I J K L M N O P
Q R S T U V
W X Y Z

## Uppercase and Lowercase
Big letters: A B C D E
Little letters: a b c d e

## The Alphabet Song
🎵 A-B-C-D-E-F-G
H-I-J-K-L-M-N-O-P
Q-R-S-T-U-V
W-X-Y and Z
Now I know my ABCs
Next time won't you sing with me! 🎵

## Special Letters
- First letter: A
- Last letter: Z
- Letters in YOUR name: ___

## Letter Hunt
Look for letters everywhere!
- On books 📚
- On signs 🛑
- On shirts 👕`,
      objectives: ['Recognize letters A-Z', 'Sing the alphabet', 'Find letters around you']
    },
    practice: {
      title: 'Letter Recognition Practice',
      description: 'Practice finding letters',
      content: `# Letter Practice

## Point to the Letter
Find the letter A: B A C D A
Find the letter M: N M P M Q
Find the letter S: S Z S R S

## What Letter?
🍎 Apple starts with ___
🐱 Cat starts with ___
🐕 Dog starts with ___

## Match!
A → a
B → b
C → c

## Your Name
Write your name: ___
Circle the first letter: ___

## Alphabet Order
What comes after:
A → ___
D → ___
L → ___

## Answers
After: B, E, M`,
      objectives: ['Find letters', 'Match upper and lowercase', 'Know letter order']
    },
    mastery: {
      title: 'Alphabet Champion',
      description: 'Master the alphabet',
      content: `# Alphabet Champion! 🌟

## Sing It!
Sing the ABC song by yourself!

## Letter Game
I spy with my little eye...
Something that starts with B: ___
Something that starts with T: ___
Something that starts with S: ___

## What's Missing?
A B ___ D E
H I J ___ L
W X ___ Z

## Write the Alphabet
Can you write A to Z?

## First and Last
First letter of the alphabet: ___
Last letter of the alphabet: ___

## Answers
Missing: C, K, Y
First: A, Last: Z`,
      objectives: ['Recite alphabet', 'Find missing letters', 'Write letters']
    }
  },

  'ec-letter-sounds': {
    intro: {
      title: 'Letter Sounds',
      description: 'Learn the sound each letter makes',
      content: `# Letter Sounds

## Letters Make Sounds!
Every letter has a SOUND.

## Some Letter Sounds
A - /a/ like "apple" 🍎
B - /b/ like "ball" ⚽
C - /c/ like "cat" 🐱
D - /d/ like "dog" 🐕
E - /e/ like "egg" 🥚
F - /f/ like "fish" 🐟
G - /g/ like "goat" 🐐
H - /h/ like "hat" 🎩

## More Sounds
M - /m/ like "mom"
S - /s/ like "snake" 🐍
T - /t/ like "top"
P - /p/ like "pig" 🐷

## Practice!
Say the sound:
B says /b/ - buh
C says /c/ - cuh
D says /d/ - duh

## Sound Out Words
C - A - T = cat!
D - O - G = dog!`,
      objectives: ['Know letter sounds', 'Connect sounds to letters', 'Begin to sound out words']
    },
    practice: {
      title: 'Letter Sounds Practice',
      description: 'Practice letter sounds',
      content: `# Sound Practice

## What Sound?
B makes the sound ___
S makes the sound ___
M makes the sound ___

## What Letter?
/c/ like cat = letter ___
/d/ like dog = letter ___
/f/ like fish = letter ___

## Beginning Sound
Ball starts with /___/
Sun starts with /___/
Mom starts with /___/

## Match Sound to Picture
B → 🐟 fish
F → ⚽ ball
M → 👩 mom

## Answers
Sounds: /b/, /s/, /m/
Letters: C, D, F
Beginning: /b/, /s/, /m/
Match: B-ball, F-fish, M-mom`,
      objectives: ['Say letter sounds', 'Match sounds to letters']
    },
    mastery: {
      title: 'Letter Sounds Expert',
      description: 'Master letter sounds',
      content: `# Sound Expert! 🔤

## Sound Chain
What sound does each letter make?
C → A → T
/c/ → /a/ → /t/ = CAT!

Try these:
D → O → G = ___
S → U → N = ___
H → A → T = ___

## Beginning Sound Game
What starts with /b/?
ball, cat, book, dog, bus

## Same Sound
Which words start with the same sound?
cat, car, dog, cup
___

## I Spy Sounds
I spy something that starts with /t/
(Look around!)

## Answers
Words: dog, sun, hat
/b/ words: ball, book, bus
Same sound: cat, car, cup (all start with /c/)`,
      objectives: ['Sound out simple words', 'Group words by sound']
    }
  },

  'ec-writing-letters': {
    intro: {
      title: 'Writing Letters',
      description: 'Learn to write letters',
      content: `# Writing Letters

## Getting Ready
- Hold your pencil correctly ✏️
- Sit up straight
- Paper in front of you

## Letter Lines
Letters are made of:
- Straight lines |
- Curved lines )
- Slanted lines /

## Easy Letters to Start
**L** - down, across
**T** - down, across at top
**I** - down, lines at top and bottom
**O** - round and round
**C** - curved like a moon

## Writing Steps
1. Start at the top
2. Follow the arrows
3. Don't lift your pencil (usually!)
4. Practice, practice!

## Trace First
Before writing, TRACE the letter!
L → L → L → now YOU try!`,
      objectives: ['Hold pencil correctly', 'Understand letter strokes', 'Trace and write letters']
    },
    practice: {
      title: 'Writing Practice',
      description: 'Practice writing letters',
      content: `# Writing Practice

## Trace These Letters
L L L L L
T T T T T
O O O O O
C C C C C
I I I I I

## Now Write!
Write the letter L: _____
Write the letter O: _____
Write the letter T: _____

## Write Your Name
Trace your name: _____
Write your name: _____

## Straight or Curved?
L has ___ lines
O has ___ lines
S has ___ lines

## Practice Page
Write each letter 5 times:
A: _____
B: _____
C: _____

## Answers
L: straight lines
O: curved line
S: curved lines`,
      objectives: ['Trace letters', 'Write letters', 'Identify line types']
    },
    mastery: {
      title: 'Writing Champion',
      description: 'Write letters confidently',
      content: `# Writing Champion! ✏️

## Write the Alphabet
Write A to Z:
_______________________
_______________________
_______________________

## Uppercase and Lowercase
Write both:
A a
B b
C c
D d
E e

## Write Words
CAT: ___
DOG: ___
MOM: ___

## Letter Art
Turn letters into pictures!
O → 😊 (add a face!)
V → 🐦 (add a beak - it's a bird!)

## My Best Writing
Write your full name in your best writing:
_______________________`,
      objectives: ['Write all letters', 'Write both cases', 'Write simple words']
    }
  },

  // ==========================================
  // NUMBERS & COUNTING
  // ==========================================
  'ec-numbers-1-5': {
    intro: {
      title: 'Numbers 1-5',
      description: 'Learn numbers one through five',
      content: `# Numbers 1 to 5

## Meet the Numbers!
1️⃣ ONE - 1 - one finger up!
2️⃣ TWO - 2 - peace sign! ✌️
3️⃣ THREE - 3 - three fingers!
4️⃣ FOUR - 4 - four fingers (no thumb!)
5️⃣ FIVE - 5 - whole hand! 🖐️

## Let's Count!
🍎 - One apple
🍎🍎 - Two apples
🍎🍎🍎 - Three apples
🍎🍎🍎🍎 - Four apples
🍎🍎🍎🍎🍎 - Five apples

## Number Song
🎵 1, 2, 3, 4, 5
Once I caught a fish alive!
6, 7, 8, 9, 10
Then I let it go again! 🎵

## Show Me!
Show 1 finger
Show 3 fingers
Show 5 fingers`,
      objectives: ['Recognize numbers 1-5', 'Count to 5', 'Show numbers with fingers']
    },
    practice: {
      title: 'Numbers 1-5 Practice',
      description: 'Practice counting to 5',
      content: `# Counting Practice

## Count and Write
🌟 = ___
🌟🌟🌟 = ___
🌟🌟🌟🌟🌟 = ___
🌟🌟 = ___
🌟🌟🌟🌟 = ___

## Match
1 → 🍎🍎🍎
2 → 🍎
3 → 🍎🍎🍎🍎🍎
4 → 🍎🍎
5 → 🍎🍎🍎🍎

## What Comes Next?
1, 2, ___
2, 3, 4, ___
1, ___, 3, 4, 5

## Draw
Draw 3 circles: ___
Draw 5 stars: ___
Draw 2 hearts: ___

## Answers
Count: 1, 3, 5, 2, 4
Next: 3, 5, 2`,
      objectives: ['Count objects to 5', 'Match numbers to quantities', 'Know number order']
    },
    mastery: {
      title: 'Numbers 1-5 Expert',
      description: 'Master numbers to 5',
      content: `# Number Expert! 🔢

## Count Backwards
5, 4, 3, 2, 1, BLAST OFF! 🚀

## More or Less?
🍪🍪🍪 or 🍪🍪🍪🍪🍪
Which has MORE? ___

🐱🐱🐱🐱 or 🐱🐱
Which has LESS? ___

## Number Hunt
Find the number 3 around you!
Find 5 of something in your room!

## Word Problems
Tom has 2 toys.
He gets 1 more.
How many toys? ___

Sara has 4 crayons.
She gives away 1.
How many left? ___

## Answers
More: 5 cookies
Less: 2 cats
Tom: 3 toys
Sara: 3 crayons`,
      objectives: ['Count backwards', 'Compare quantities', 'Solve simple problems']
    }
  },

  'ec-numbers-6-10': {
    intro: {
      title: 'Numbers 6-10',
      description: 'Learn numbers six through ten',
      content: `# Numbers 6 to 10

## More Numbers!
6️⃣ SIX - 6 - one hand plus one finger
7️⃣ SEVEN - 7 - one hand plus two
8️⃣ EIGHT - 8 - one hand plus three
9️⃣ NINE - 9 - one hand plus four
🔟 TEN - 10 - both hands! 🙌

## Count to 10!
1, 2, 3, 4, 5, 6, 7, 8, 9, 10!

## Let's See Them
🔵🔵🔵🔵🔵🔵 = 6
🔵🔵🔵🔵🔵🔵🔵 = 7
🔵🔵🔵🔵🔵🔵🔵🔵 = 8
🔵🔵🔵🔵🔵🔵🔵🔵🔵 = 9
🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵 = 10

## Ten Frame
A ten frame holds 10:
[⚫⚫⚫⚫⚫]
[⚫⚫⚫⚫⚫]

This shows 10!`,
      objectives: ['Recognize numbers 6-10', 'Count to 10', 'Use ten frames']
    },
    practice: {
      title: 'Numbers 6-10 Practice',
      description: 'Practice counting to 10',
      content: `# Practice 6-10

## Count and Write
🌟🌟🌟🌟🌟🌟 = ___
🌟🌟🌟🌟🌟🌟🌟🌟 = ___
🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟 = ___
🌟🌟🌟🌟🌟🌟🌟 = ___
🌟🌟🌟🌟🌟🌟🌟🌟🌟 = ___

## What Comes Next?
6, 7, ___
8, 9, ___
5, 6, 7, ___

## Ten Frame
[⚫⚫⚫⚫⚫]
[⚫⚫⚫○○]
How many filled? ___

## Show on Fingers
Show 7 fingers
Show 9 fingers
Show 10 fingers

## Answers
Count: 6, 8, 10, 7, 9
Next: 8, 10, 8
Ten frame: 8`,
      objectives: ['Count objects 6-10', 'Use ten frames', 'Know number sequence']
    },
    mastery: {
      title: 'Numbers 1-10 Champion',
      description: 'Master all numbers to 10',
      content: `# Number Champion! 🏆

## Count to 10
1, 2, 3, 4, 5, 6, 7, 8, 9, 10!

## Count Backwards
10, 9, 8, 7, 6, 5, 4, 3, 2, 1!

## Compare
Which is more: 7 or 9? ___
Which is less: 6 or 8? ___

## Missing Numbers
4, 5, ___, 7, 8
6, ___, 8, 9, ___

## Word Problem
There are 8 birds.
2 fly away.
How many are left? ___

## Answers
More: 9, Less: 6
Missing: 6; 7, 10
Birds: 6`,
      objectives: ['Count 1-10 fluently', 'Compare numbers', 'Solve problems']
    }
  },

  'ec-counting-objects': {
    intro: {
      title: 'Counting Objects',
      description: 'Learn to count real things',
      content: `# Counting Objects

## One-to-One Counting
Touch each object as you count:
Point and say the number!

🍎 "One"
🍎 "Two"
🍎 "Three"

## Counting Rules
1. Start at ONE
2. Say one number for each thing
3. Touch it as you count
4. The LAST number is "how many"

## Practice Together
Let's count the stars:
⭐⭐⭐⭐
Touch: 1, 2, 3, 4
There are 4 stars!

## Count Anything!
- Fingers
- Toes
- Toys
- Books
- Steps you take`,
      objectives: ['Count objects one by one', 'Touch and count', 'Tell how many']
    },
    practice: {
      title: 'Counting Objects Practice',
      description: 'Practice counting things',
      content: `# Counting Practice

## Count Each Group
Touch and count!
🐱🐱🐱 = ___
🎈🎈🎈🎈🎈 = ___
🌺🌺 = ___
🚗🚗🚗🚗 = ___

## Circle the Right Number
🍪🍪🍪🍪🍪🍪
Circle: 4  6  8

🐟🐟🐟
Circle: 2  3  5

## Count Around You!
Count your fingers: ___
Count your crayons: ___
Count your shoes: ___

## Answers
Count: 3, 5, 2, 4
Circle: 6, 3
Fingers: 10, Shoes: 2`,
      objectives: ['Count groups accurately', 'Match count to number']
    },
    mastery: {
      title: 'Counting Champion',
      description: 'Master counting objects',
      content: `# Counting Champion! 🌟

## Big Counts
Count the dots:
●●●●●●●● = ___

## Find and Count
Find 5 books.
Count them: 1, 2, 3, 4, 5 ✓

Find 8 blocks.
Can you count them?

## How Many More?
🍎🍎🍎 apples
🍎🍎🍎🍎🍎 more apples
Total: ___

## Counting Game
Count by touching:
- Your nose (just 1!)
- Your ears (how many?)
- Your fingers (how many?)

## Answers
Dots: 8
Total apples: 8
Ears: 2, Fingers: 10`,
      objectives: ['Count larger groups', 'Add groups together']
    }
  },

  // ==========================================
  // SOCIAL SKILLS
  // ==========================================
  'ec-sharing': {
    intro: {
      title: 'Sharing with Others',
      description: 'Learn why and how to share',
      content: `# Sharing with Others

## What is Sharing?
Sharing means letting others use something you have.

## Why Share?
- It makes friends happy 😊
- Friends will share with YOU
- It's kind and caring ❤️
- Playing together is more fun!

## How to Share
1. Ask "Would you like to play too?"
2. Take turns with toys
3. Give half if you have enough
4. Say "Here, you can use this!"

## Sharing Words
- "Want to share?"
- "You can have some"
- "Let's play together"
- "Your turn!"

## Not Easy to Share
Sometimes sharing is hard!
That's okay. Take a deep breath.
Remember: sharing feels good!`,
      objectives: ['Understand why we share', 'Learn sharing words', 'Practice sharing']
    },
    practice: {
      title: 'Sharing Practice',
      description: 'Practice sharing skills',
      content: `# Sharing Practice

## What Would You Do?
Your friend wants to play with your toy.
What do you say?
___

You have 4 cookies and your friend has 0.
What do you do?
___

## Sharing or Not Sharing?
Taking all the crayons: ___
Giving your friend a turn: ___
Letting others play: ___
Keeping everything for yourself: ___

## Sharing Words
Practice saying:
"Would you like some?"
"Let's share!"
"Here, you can use this!"

## Role Play
Pretend you have blocks.
Your friend asks to play.
What do you do?

## Answers
Not Sharing: Taking all, Keeping everything
Sharing: Giving turn, Letting others play`,
      objectives: ['Identify sharing behaviors', 'Practice sharing language']
    },
    mastery: {
      title: 'Sharing Star',
      description: 'Be a sharing superstar',
      content: `# Sharing Star! ⭐

## Sharing Stories
Think of a time you shared.
How did it feel? ___
How did your friend feel? ___

## Hard Sharing
What if you only have ONE toy?
Ideas:
- Take turns!
- Play together!
- Play with something else

## Sharing Pledge
I will try to share because...
___

## Sharing Chart
Draw a star each time you share today!
⭐ ⭐ ⭐ ⭐ ⭐

## You're a Sharing Star!
Sharing makes everyone happy!
Great job learning to share! 🌟`,
      objectives: ['Reflect on sharing', 'Handle difficult sharing', 'Commit to sharing']
    }
  },

  'ec-taking-turns': {
    intro: {
      title: 'Taking Turns',
      description: 'Learn to wait and take turns',
      content: `# Taking Turns

## What are Turns?
Taking turns means:
- You go, then I go
- We switch back and forth
- Everyone gets a chance!

## Why Take Turns?
- It's FAIR
- Everyone gets to play
- No one feels left out
- Games are more fun!

## When to Take Turns
- Playing games 🎮
- Using swings
- Talking in class
- Using toys
- Going down the slide

## How to Wait
While waiting for your turn:
- Watch others play
- Cheer for your friends
- Count to 10
- Take deep breaths

## Turn-Taking Words
- "Your turn!"
- "My turn now"
- "I'll wait"
- "You go first"`,
      objectives: ['Understand taking turns', 'Learn to wait patiently', 'Use turn-taking words']
    },
    practice: {
      title: 'Taking Turns Practice',
      description: 'Practice turn-taking',
      content: `# Turn Practice

## Whose Turn?
Ana just had a turn.
Whose turn is next?
___

## Good or Not Good?
Pushing to go first: ___
Saying "Your turn!": ___
Waiting patiently: ___
Grabbing the toy: ___

## Practice Waiting
Count to 10 slowly:
1... 2... 3... 4... 5...
6... 7... 8... 9... 10!
Good job waiting!

## Turn-Taking Game
Play a game where you take turns:
- Rolling a ball
- Building with blocks
- Drawing a picture

## Answers
Next: The next person in line
Good: Saying "Your turn!", Waiting
Not Good: Pushing, Grabbing`,
      objectives: ['Identify good turn-taking', 'Practice waiting']
    },
    mastery: {
      title: 'Turn-Taking Pro',
      description: 'Master taking turns',
      content: `# Turn-Taking Pro! 🎯

## Difficult Situations
What if someone cuts in front of you?
What could you say?
___

What if you really want another turn?
What should you do?
___

## Turn-Taking in Games
Play a simple game:
1. Roll a ball to a friend
2. They roll it back
3. Take turns!

## Waiting Challenge
Can you wait without complaining?
Practice waiting for:
- 10 seconds
- 30 seconds
- 1 minute!

## Turn-Taking Pledge
I will take turns because...
___

## You're a Pro!
Taking turns makes playing fair and fun!`,
      objectives: ['Handle turn-taking problems', 'Practice extended waiting']
    }
  },

  'ec-making-friends': {
    intro: {
      title: 'Making Friends',
      description: 'Learn how to make new friends',
      content: `# Making Friends

## What is a Friend?
A friend is someone who:
- Plays with you
- Is kind to you
- Shares with you
- Makes you smile! 😊

## How to Make Friends
1. **Smile** and say "Hi!"
2. **Ask** "Want to play?"
3. **Share** toys and snacks
4. **Listen** to them
5. **Be kind** and helpful

## Friendly Words
- "Hi! I'm [your name]!"
- "Want to play with me?"
- "That looks fun! Can I join?"
- "Let's be friends!"

## Being a Good Friend
- Use kind words
- Share and take turns
- Help when they need it
- Play fair

## Making Friends Takes Time
Some friends you make right away.
Some friendships grow slowly.
Both are okay!`,
      objectives: ['Know what makes a friend', 'Learn to introduce yourself', 'Practice friendly behaviors']
    },
    practice: {
      title: 'Making Friends Practice',
      description: 'Practice friendship skills',
      content: `# Friendship Practice

## Introduce Yourself
Practice saying:
"Hi! My name is ___."
"What's your name?"
"Want to play?"

## Good Friend or Not?
Sharing toys: ___
Saying mean things: ___
Helping someone: ___
Pushing: ___
Smiling and saying hi: ___

## Making Friends Steps
Put in order:
___ Play together
___ Smile and say hi
___ Ask "Want to play?"

## Draw a Friend
Draw a picture of you and a friend playing:

## Answers
Good Friend: Sharing, Helping, Smiling
Not Good: Mean things, Pushing
Order: 3, 1, 2`,
      objectives: ['Practice introducing yourself', 'Identify friendly behaviors']
    },
    mastery: {
      title: 'Friendship Champion',
      description: 'Be a great friend',
      content: `# Friendship Champion! 👫

## My Friends
Draw or write about a friend:
Name: ___
Something we do together: ___
Why I like them: ___

## What If?
A new kid is alone at recess.
What could you do?
___

Your friend is sad.
What could you say?
___

## Friendship Promise
I will be a good friend by:
1. ___
2. ___
3. ___

## Friendship Song
🎵 Make new friends,
But keep the old.
One is silver,
The other is gold! 🎵

## You're a Great Friend!
Keep being kind and friendly! 💛`,
      objectives: ['Reflect on friendships', 'Help others make friends', 'Commit to being a good friend']
    }
  },

  // ==========================================
  // MOTOR SKILLS
  // ==========================================
  'ec-holding-pencil': {
    intro: {
      title: 'Holding a Pencil',
      description: 'Learn the correct pencil grip',
      content: `# Holding a Pencil

## The Right Way to Hold a Pencil
The "tripod grip":
- Thumb on one side
- Pointer finger on top
- Middle finger supports below
- Ring and pinky tucked in

## Step by Step
1. Make a "pinch" with thumb and pointer
2. Rest pencil on middle finger
3. Hold gently - not too tight!
4. Pencil points to your shoulder

## Tips
- Start with short pencils or crayons
- Rest your hand on the paper
- Keep your wrist still
- Move your fingers, not your whole arm

## Practice Items
Try holding:
- Crayons
- Markers
- Chalk
- Pencils

## Why It Matters
Good grip = easier writing!
Good grip = less tired hand!`,
      objectives: ['Learn tripod grip', 'Hold pencil correctly', 'Practice with different tools']
    },
    practice: {
      title: 'Pencil Grip Practice',
      description: 'Practice holding pencils',
      content: `# Grip Practice

## Check Your Grip
Thumb on one side? ✓ or ✗
Pointer on top? ✓ or ✗
Middle finger below? ✓ or ✗
Not too tight? ✓ or ✗

## Scribble Practice
Hold your pencil correctly.
Make scribbles all over this space:
[Practice space]

## Draw Lines
Draw a line down: |
Draw a line across: —
Draw a circle: O

## Color a Picture
Hold your crayon correctly.
Color inside the circle:
⭕

## Take a Break
If your hand gets tired:
- Put the pencil down
- Shake your hand
- Try again!`,
      objectives: ['Check grip', 'Practice drawing with correct grip']
    },
    mastery: {
      title: 'Pencil Grip Pro',
      description: 'Master pencil holding',
      content: `# Grip Pro! ✏️

## Perfect Grip Check
Take a picture or have someone check:
- Tripod grip? ___
- Relaxed hand? ___
- Good control? ___

## Writing Challenge
Write your name with good grip:
___

Draw a happy face:
😊

## Different Tools
Practice good grip with:
- A crayon ✓
- A marker ✓
- A pencil ✓
- A paintbrush ✓

## Grip Games
Pick up small things with your "pinch":
- Beads
- Cereal
- Small blocks

This strengthens your fingers!

## Great Job!
You're a pencil grip pro! ✏️`,
      objectives: ['Maintain correct grip', 'Use grip with various tools']
    }
  },

  'ec-cutting-scissors': {
    intro: {
      title: 'Using Scissors',
      description: 'Learn to cut safely with scissors',
      content: `# Using Scissors

## Scissors Safety First!
- Walk with scissors pointing DOWN
- Only cut paper (not hair, clothes, etc.)
- Sit down when cutting
- Keep fingers away from blades

## How to Hold Scissors
- Thumb in small hole
- Two fingers in big hole
- Other fingers curled under
- Thumb points UP

## How to Cut
1. Open scissors (like a mouth!)
2. Put paper in the "mouth"
3. Close scissors to cut
4. Open again, move paper

## Helping Hand
Your other hand holds the paper.
Turn the paper, not the scissors!

## Practice Cuts
- Snip, snip, snip (small cuts)
- One long cut
- Cut on a line`,
      objectives: ['Learn scissor safety', 'Hold scissors correctly', 'Make basic cuts']
    },
    practice: {
      title: 'Scissors Practice',
      description: 'Practice cutting skills',
      content: `# Cutting Practice

## Safety Check
Walk with scissors pointing: ___
Sit down when: ___
Only cut: ___

## Snip Practice
Make small snips along the edge:
[~~~~~~~~]

## Cut the Line
Cut on the straight line:
—————————————

## Cut the Shapes
Cut out the square:
⬜

Cut out the circle:
⭕

## Good or Not Good?
Running with scissors: ___
Sitting down to cut: ___
Cutting your hair: ___
Cutting paper: ___

## Answers
Safety: down, cutting, paper
Good: Sitting down, Cutting paper
Not Good: Running, Cutting hair`,
      objectives: ['Follow safety rules', 'Practice cutting lines and shapes']
    },
    mastery: {
      title: 'Scissors Champion',
      description: 'Master scissor skills',
      content: `# Scissors Champion! ✂️

## Advanced Cutting
Cut on the wavy line:
〰️〰️〰️〰️〰️

Cut on the zigzag:
⚡⚡⚡⚡⚡

## Cut and Paste Project
1. Cut out shapes
2. Glue them to make a picture!

Ideas:
- Cut circles for a caterpillar
- Cut squares for a robot
- Cut triangles for a house

## Cutting Challenge
Cut out a star: ⭐
(This is hard! Do your best!)

## Safety Pledge
I promise to:
- Walk carefully with scissors
- Only cut paper
- Sit while cutting

## You're a Cutting Star! ⭐`,
      objectives: ['Cut complex lines', 'Complete cutting projects', 'Maintain safety']
    }
  },

  'ec-tracing-lines': {
    intro: {
      title: 'Tracing Lines',
      description: 'Learn to trace different lines',
      content: `# Tracing Lines

## Why Trace?
Tracing helps us:
- Control our pencil
- Get ready to write letters
- Make smooth lines

## Types of Lines
| (straight down)
— (straight across)
/ (slanted)
( (curved)
~ (wavy)

## How to Trace
1. Start at the dot ●
2. Follow the line
3. Try not to lift your pencil
4. Stop at the end

## Tracing Tips
- Go slowly
- Stay on the line
- Keep trying!

## Practice Order
1. Straight lines (easiest!)
2. Curved lines
3. Zigzag lines
4. Shapes`,
      objectives: ['Understand tracing purpose', 'Trace different line types', 'Develop pencil control']
    },
    practice: {
      title: 'Tracing Practice',
      description: 'Practice tracing lines',
      content: `# Tracing Practice

## Trace Straight Lines
● ———————————— ●
● ———————————— ●
● ———————————— ●

## Trace Down Lines
●        ●        ●
|        |        |
|        |        |
●        ●        ●

## Trace Curves
●        ●
 )        (
  )        (
   )        (

## Trace Zigzags
● /\\ /\\ /\\ /\\ ●

## Trace Waves
● ∿∿∿∿∿∿∿∿ ●

## How Did You Do?
Stayed on the line? ✓ or ✗
Didn't lift pencil? ✓ or ✗`,
      objectives: ['Trace various lines', 'Improve control']
    },
    mastery: {
      title: 'Tracing Pro',
      description: 'Master tracing skills',
      content: `# Tracing Pro! ✨

## Trace Shapes
Trace the circle:
    ●
   / \\
  |   |
   \\ /
    ●

Trace the square:
  ● — ●
  |   |
  ● — ●

Trace the triangle:
    ●
   / \\
  ● — ●

## Trace Letters
Trace: L L L L L
Trace: O O O O O
Trace: T T T T T

## Maze Tracing
Trace through the maze:
[Simple maze design]
Start → ~~~ → End

## Free Drawing
Use your tracing skills!
Draw a picture using:
- Straight lines
- Curved lines
- Zigzags

## Awesome Tracing! 🌟`,
      objectives: ['Trace shapes', 'Trace letters', 'Apply tracing to drawing']
    }
  }
};

export default earlyChildhoodContent;

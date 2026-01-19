// Computer Science Lesson Content
// Comprehensive educational content for CS topics

import { LessonContent } from '../lessonContentTypes';

export const computerScienceContent: Record<string, LessonContent> = {
  // ==========================================
  // INTRODUCTION TO CS
  // ==========================================
  'intro-programming': {
    intro: {
      title: 'Introduction to Programming',
      description: 'Learn what programming is and why it matters',
      content: `# Introduction to Programming

## What is Programming?
Programming is giving **instructions** to a computer.
Computers only do exactly what we tell them!

## Why Learn to Program?
- Create websites and apps
- Build games
- Solve problems
- Automate boring tasks
- High-demand career skills

## Programming Languages
Languages computers understand:
- **Python** - great for beginners!
- **JavaScript** - runs in web browsers
- **Java** - used for Android apps
- **Scratch** - visual block-based coding

## Your First "Program"
Think of a program like a recipe:
\`\`\`
1. Get bread
2. Get peanut butter
3. Spread peanut butter on bread
4. Eat sandwich
\`\`\`
Computers need step-by-step instructions!

## Key Terms
- **Code** - the instructions you write
- **Algorithm** - a step-by-step solution
- **Bug** - an error in code
- **Debug** - fixing errors`,
      objectives: ['Define programming', 'Understand why programming matters', 'Know basic programming terms']
    },
    practice: {
      title: 'Programming Concepts Practice',
      description: 'Practice thinking like a programmer',
      content: `# Programming Practice

## Activity 1: Write an Algorithm
Write steps to make a sandwich:
1. ___
2. ___
3. ___
4. ___
5. ___

## Activity 2: Find the Bug
What's wrong with this "program"?
\`\`\`
1. Pour cereal in bowl
2. Eat cereal
3. Add milk
\`\`\`
Bug: ___

## Activity 3: Match Terms
Code → The instructions you write
Algorithm → Finding errors
Bug → Step-by-step solution
Debug → An error in code

## Activity 4: True or False
1. Computers think for themselves. ___
2. Programming is writing instructions. ___
3. Bugs are errors in code. ___

## Answers
Activity 2 Bug: Add milk BEFORE eating!
True/False: False, True, True`,
      objectives: ['Write simple algorithms', 'Identify bugs in logic', 'Use programming vocabulary']
    },
    mastery: {
      title: 'Programming Concepts Master',
      description: 'Apply programming thinking',
      content: `# Programming Master! 💻

## Challenge 1: Robot Navigation
Give directions to move a robot from A to B:
\`\`\`
[A][ ][ ]
[ ][X][ ]
[ ][ ][B]
\`\`\`
(X is a wall)
Directions: ___

## Challenge 2: Fix the Algorithm
\`\`\`
1. Wake up
2. Go to school
3. Get dressed
4. Eat breakfast
\`\`\`
Correct order: ___

## Challenge 3: Why Programming?
List 3 things you could create with programming:
1. ___
2. ___
3. ___

## Challenge 4: Career Match
Match jobs that use programming:
- Web Developer
- Game Designer
- Data Scientist
All of these use: ___

## Answers
Robot: Down, Down, Right, Right (or similar)
Order: 1, 3, 4, 2
Career: programming/code`,
      objectives: ['Create navigation algorithms', 'Debug sequences', 'Connect programming to careers']
    }
  },

  'variables-data-types': {
    intro: {
      title: 'Variables & Data Types',
      description: 'Learn how computers store information',
      content: `# Variables & Data Types

## What is a Variable?
A variable is like a **box** that stores information.
It has a **name** and a **value**.

\`\`\`python
name = "Alex"      # stores text
age = 15           # stores a number
is_student = True  # stores true/false
\`\`\`

## Data Types
Different kinds of data:

### String (Text)
\`\`\`python
greeting = "Hello!"
name = "Maria"
\`\`\`

### Integer (Whole Numbers)
\`\`\`python
age = 16
score = 100
\`\`\`

### Float (Decimals)
\`\`\`python
price = 19.99
temperature = 72.5
\`\`\`

### Boolean (True/False)
\`\`\`python
is_raining = False
logged_in = True
\`\`\`

## Naming Rules
- Start with a letter
- No spaces (use _ instead)
- Make names meaningful!
- \`student_name\` ✓
- \`x\` ✗ (not clear)`,
      objectives: ['Define variables', 'Identify data types', 'Name variables correctly']
    },
    practice: {
      title: 'Variables Practice',
      description: 'Practice with variables and data types',
      content: `# Variables Practice

## Activity 1: Identify Data Types
What type is each value?
- "Hello World" → ___
- 42 → ___
- 3.14 → ___
- True → ___
- "123" → ___

## Activity 2: Create Variables
Write a variable for:
- Your name: ___
- Your age: ___
- Your favorite color: ___
- Are you a student? ___

## Activity 3: Fix the Names
Which are good variable names?
- \`myAge\` → Good / Bad
- \`1stPlace\` → Good / Bad
- \`student name\` → Good / Bad
- \`total_score\` → Good / Bad

## Activity 4: What's the Output?
\`\`\`python
x = 5
y = 3
print(x + y)
\`\`\`
Output: ___

## Answers
Types: String, Integer, Float, Boolean, String
Names: Good, Bad (starts with number), Bad (has space), Good
Output: 8`,
      objectives: ['Classify data types', 'Create valid variables', 'Trace variable values']
    },
    mastery: {
      title: 'Variables Expert',
      description: 'Master variables and data types',
      content: `# Variables Expert! 📦

## Challenge 1: Type Conversion
\`\`\`python
age = "18"
age_number = int(age)
\`\`\`
What is age_number? ___
What type is it? ___

## Challenge 2: Variable Swap
\`\`\`python
a = 5
b = 10
# How to swap a and b?
\`\`\`
Write the code: ___

## Challenge 3: Real Application
Create variables for a game player:
- Player name
- Current score
- Lives remaining
- Is alive?

\`\`\`python
player_name = ___
score = ___
lives = ___
is_alive = ___
\`\`\`

## Challenge 4: Debug
\`\`\`python
user age = 25  # Error!
\`\`\`
What's wrong? ___
Fix it: ___

## Answers
Type conversion: 18, integer
Debug: Space in variable name
Fix: user_age = 25`,
      objectives: ['Convert between types', 'Solve variable problems', 'Debug variable errors']
    }
  },

  'conditionals': {
    intro: {
      title: 'Conditionals',
      description: 'Learn to make decisions in code',
      content: `# Conditionals (If Statements)

## What are Conditionals?
Conditionals let programs **make decisions**.
"IF something is true, THEN do something."

## If Statement
\`\`\`python
age = 16

if age >= 16:
    print("You can drive!")
\`\`\`

## If-Else
\`\`\`python
temperature = 80

if temperature > 75:
    print("It's hot!")
else:
    print("It's cool.")
\`\`\`

## If-Elif-Else
\`\`\`python
score = 85

if score >= 90:
    print("A")
elif score >= 80:
    print("B")
elif score >= 70:
    print("C")
else:
    print("Keep trying!")
\`\`\`

## Comparison Operators
| Operator | Meaning |
|----------|---------|
| == | equals |
| != | not equals |
| > | greater than |
| < | less than |
| >= | greater or equal |
| <= | less or equal |`,
      objectives: ['Understand conditionals', 'Write if/else statements', 'Use comparison operators']
    },
    practice: {
      title: 'Conditionals Practice',
      description: 'Practice decision-making in code',
      content: `# Conditionals Practice

## Activity 1: Trace the Code
\`\`\`python
x = 10
if x > 5:
    print("Big")
else:
    print("Small")
\`\`\`
Output: ___

## Activity 2: Complete the Code
\`\`\`python
age = 13

if age ___ 13:
    print("You're a teenager!")
\`\`\`
Fill in: ___

## Activity 3: Write the Condition
Password check:
\`\`\`python
password = "secret123"
user_input = "secret123"

if ___:
    print("Access granted")
else:
    print("Access denied")
\`\`\`

## Activity 4: Grade Calculator
What grade for score = 75?
\`\`\`python
if score >= 90: "A"
elif score >= 80: "B"
elif score >= 70: "C"
else: "F"
\`\`\`
Answer: ___

## Answers
Trace: "Big"
Complete: >= or ==
Condition: password == user_input
Grade: C`,
      objectives: ['Trace conditional logic', 'Write conditions', 'Understand elif chains']
    },
    mastery: {
      title: 'Conditionals Master',
      description: 'Master decision-making logic',
      content: `# Conditionals Master! 🎯

## Challenge 1: Nested Conditionals
\`\`\`python
age = 20
has_license = True

if age >= 16:
    if has_license:
        print("Can drive")
    else:
        print("Need license")
else:
    print("Too young")
\`\`\`
Output: ___

## Challenge 2: Logical Operators
\`\`\`python
temp = 72
is_sunny = True

if temp > 70 and is_sunny:
    print("Perfect day!")
\`\`\`
Output: ___

## Challenge 3: Write a Program
Create a movie rating checker:
- If age >= 17: "You can see R movies"
- If age >= 13: "You can see PG-13"
- Else: "PG and G only"

Write it: ___

## Challenge 4: FizzBuzz
If number divisible by 3: "Fizz"
If divisible by 5: "Buzz"
If both: "FizzBuzz"
Else: the number

What's output for 15? ___

## Answers
Nested: "Can drive"
Logical: "Perfect day!"
FizzBuzz: "FizzBuzz"`,
      objectives: ['Use nested conditionals', 'Apply logical operators', 'Solve complex conditional problems']
    }
  },

  'loops': {
    intro: {
      title: 'Loops',
      description: 'Learn to repeat code efficiently',
      content: `# Loops

## Why Use Loops?
Loops repeat code without writing it multiple times!

Instead of:
\`\`\`python
print("Hello")
print("Hello")
print("Hello")
\`\`\`

Use a loop:
\`\`\`python
for i in range(3):
    print("Hello")
\`\`\`

## For Loop
Repeat a specific number of times:
\`\`\`python
for i in range(5):
    print(i)  # Prints 0, 1, 2, 3, 4
\`\`\`

## While Loop
Repeat while a condition is true:
\`\`\`python
count = 0
while count < 5:
    print(count)
    count += 1
\`\`\`

## Loop Through a List
\`\`\`python
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)
\`\`\`

## Break and Continue
- **break** - exit the loop early
- **continue** - skip to next iteration`,
      objectives: ['Understand loops', 'Write for and while loops', 'Know when to use each type']
    },
    practice: {
      title: 'Loops Practice',
      description: 'Practice writing loops',
      content: `# Loops Practice

## Activity 1: Trace the Loop
\`\`\`python
for i in range(4):
    print(i)
\`\`\`
Output: ___

## Activity 2: Complete the Loop
Print "Hi" 5 times:
\`\`\`python
for i in range(___):
    print("Hi")
\`\`\`

## Activity 3: While Loop
\`\`\`python
x = 10
while x > 0:
    print(x)
    x -= 2
\`\`\`
Output: ___

## Activity 4: List Loop
\`\`\`python
colors = ["red", "green", "blue"]
for color in colors:
    print(color)
\`\`\`
Output: ___

## Activity 5: Fix the Bug
\`\`\`python
# Infinite loop! Fix it:
x = 5
while x > 0:
    print(x)
\`\`\`
Fix: Add ___

## Answers
Activity 1: 0, 1, 2, 3
Activity 2: 5
Activity 3: 10, 8, 6, 4, 2
Activity 4: red, green, blue
Activity 5: x -= 1 (or x = x - 1)`,
      objectives: ['Trace loops', 'Write loops', 'Fix infinite loops']
    },
    mastery: {
      title: 'Loops Master',
      description: 'Master loop patterns',
      content: `# Loops Master! 🔄

## Challenge 1: Nested Loops
\`\`\`python
for i in range(3):
    for j in range(2):
        print(f"{i},{j}")
\`\`\`
How many times does print run? ___

## Challenge 2: Sum Numbers
Write a loop to sum 1 to 10:
\`\`\`python
total = 0
for i in range(1, ___):
    total += i
print(total)  # Should be 55
\`\`\`

## Challenge 3: Break Statement
\`\`\`python
for i in range(10):
    if i == 5:
        break
    print(i)
\`\`\`
Output: ___

## Challenge 4: Pattern
Print this pattern using loops:
\`\`\`
*
**
***
****
\`\`\`
Write the code: ___

## Answers
Nested: 6 times (3 × 2)
Sum: 11 (range goes to n-1)
Break: 0, 1, 2, 3, 4`,
      objectives: ['Use nested loops', 'Sum with loops', 'Use break and continue']
    }
  },

  'functions-cs': {
    intro: {
      title: 'Functions',
      description: 'Learn to organize code into reusable blocks',
      content: `# Functions

## What is a Function?
A function is a **reusable block of code** with a name.
Like a recipe you can use over and over!

## Defining a Function
\`\`\`python
def greet():
    print("Hello!")

# Call the function
greet()  # Output: Hello!
\`\`\`

## Functions with Parameters
\`\`\`python
def greet(name):
    print(f"Hello, {name}!")

greet("Alex")  # Output: Hello, Alex!
greet("Sam")   # Output: Hello, Sam!
\`\`\`

## Return Values
\`\`\`python
def add(a, b):
    return a + b

result = add(3, 5)  # result = 8
\`\`\`

## Why Use Functions?
- **Reuse** code instead of copying
- **Organize** code into logical chunks
- **Debug** more easily
- **Name** what code does`,
      objectives: ['Define functions', 'Use parameters', 'Return values from functions']
    },
    practice: {
      title: 'Functions Practice',
      description: 'Practice writing functions',
      content: `# Functions Practice

## Activity 1: Call the Function
\`\`\`python
def say_hi():
    print("Hi there!")

___  # Write the call
\`\`\`

## Activity 2: Add Parameter
\`\`\`python
def square(number):
    return ___ * ___

result = square(4)  # Should be 16
\`\`\`

## Activity 3: Trace the Code
\`\`\`python
def double(x):
    return x * 2

print(double(5))
print(double(3))
\`\`\`
Output: ___

## Activity 4: Write a Function
Write a function that takes two numbers and returns their sum:
\`\`\`python
def add(a, b):
    ___
\`\`\`

## Activity 5: Multiple Parameters
\`\`\`python
def introduce(name, age):
    print(f"{name} is {age} years old")

introduce("Maya", 15)
\`\`\`
Output: ___

## Answers
Activity 1: say_hi()
Activity 2: number * number
Activity 3: 10, 6
Activity 4: return a + b
Activity 5: Maya is 15 years old`,
      objectives: ['Call functions', 'Write functions with parameters', 'Use return statements']
    },
    mastery: {
      title: 'Functions Master',
      description: 'Master function concepts',
      content: `# Functions Master! ⚡

## Challenge 1: Default Parameters
\`\`\`python
def greet(name="World"):
    print(f"Hello, {name}!")

greet()
greet("Python")
\`\`\`
Output: ___

## Challenge 2: Multiple Returns
\`\`\`python
def min_max(numbers):
    return min(numbers), max(numbers)

low, high = min_max([3, 1, 4, 1, 5])
\`\`\`
low = ___, high = ___

## Challenge 3: Recursive Function
\`\`\`python
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(factorial(5))
\`\`\`
Output: ___

## Challenge 4: Write a Calculator
Write functions for add, subtract, multiply, divide:
\`\`\`python
def calculator(a, b, operation):
    if operation == "+":
        return ___
    # Add more...
\`\`\`

## Answers
Default: "Hello, World!" then "Hello, Python!"
Min/Max: 1, 5
Factorial: 120`,
      objectives: ['Use default parameters', 'Return multiple values', 'Understand recursion basics']
    }
  },

  'arrays': {
    intro: {
      title: 'Arrays & Lists',
      description: 'Learn to store collections of data',
      content: `# Arrays & Lists

## What is a List?
A list stores **multiple values** in one variable.
Like a box with compartments!

## Creating Lists
\`\`\`python
# List of numbers
scores = [85, 92, 78, 95]

# List of strings
colors = ["red", "blue", "green"]

# Empty list
empty = []
\`\`\`

## Accessing Elements
Lists are **indexed** starting at 0:
\`\`\`python
fruits = ["apple", "banana", "cherry"]
#          [0]       [1]       [2]

print(fruits[0])  # apple
print(fruits[1])  # banana
print(fruits[2])  # cherry
\`\`\`

## List Operations
\`\`\`python
# Add item
fruits.append("orange")

# Remove item
fruits.remove("banana")

# Length
len(fruits)

# Check if item exists
"apple" in fruits  # True
\`\`\``,
      objectives: ['Create lists', 'Access elements by index', 'Modify lists']
    },
    practice: {
      title: 'Arrays Practice',
      description: 'Practice with lists',
      content: `# Lists Practice

## Activity 1: Access Elements
\`\`\`python
pets = ["dog", "cat", "fish", "bird"]
print(pets[2])
\`\`\`
Output: ___

## Activity 2: Modify List
\`\`\`python
numbers = [1, 2, 3]
numbers.append(4)
print(numbers)
\`\`\`
Output: ___

## Activity 3: Loop Through List
\`\`\`python
colors = ["red", "green", "blue"]
for color in colors:
    print(color)
\`\`\`
Output: ___

## Activity 4: List Length
\`\`\`python
items = ["a", "b", "c", "d", "e"]
print(len(items))
\`\`\`
Output: ___

## Activity 5: Find the Bug
\`\`\`python
fruits = ["apple", "banana"]
print(fruits[2])  # Error!
\`\`\`
Why? ___

## Answers
Activity 1: fish
Activity 2: [1, 2, 3, 4]
Activity 3: red, green, blue
Activity 4: 5
Activity 5: Index out of range (only 0 and 1 exist)`,
      objectives: ['Access list elements', 'Modify lists', 'Understand indexing']
    },
    mastery: {
      title: 'Arrays Master',
      description: 'Master list operations',
      content: `# Lists Master! 📝

## Challenge 1: Negative Indexing
\`\`\`python
letters = ["a", "b", "c", "d", "e"]
print(letters[-1])
print(letters[-2])
\`\`\`
Output: ___

## Challenge 2: Slicing
\`\`\`python
nums = [0, 1, 2, 3, 4, 5]
print(nums[1:4])
print(nums[:3])
print(nums[3:])
\`\`\`
Output: ___

## Challenge 3: 2D Lists
\`\`\`python
grid = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]
print(grid[1][2])
\`\`\`
Output: ___

## Challenge 4: List Methods
Use lists to:
- Find the sum of [10, 20, 30]
- Find the max of [5, 2, 8, 1]
- Sort [3, 1, 4, 1, 5]

## Answers
Negative: e, d
Slicing: [1,2,3], [0,1,2], [3,4,5]
2D: 6
Sum: 60, Max: 8, Sorted: [1,1,3,4,5]`,
      objectives: ['Use negative indexing', 'Slice lists', 'Work with 2D lists']
    }
  },

  'algorithms': {
    intro: {
      title: 'Basic Algorithms',
      description: 'Learn common problem-solving patterns',
      content: `# Basic Algorithms

## What is an Algorithm?
A step-by-step solution to a problem.
Like a recipe for solving something!

## Common Algorithm Patterns

### Linear Search
Find an item by checking each element:
\`\`\`python
def linear_search(list, target):
    for i, item in enumerate(list):
        if item == target:
            return i
    return -1
\`\`\`

### Find Maximum
\`\`\`python
def find_max(numbers):
    max_val = numbers[0]
    for num in numbers:
        if num > max_val:
            max_val = num
    return max_val
\`\`\`

### Counting
\`\`\`python
def count_occurrences(list, target):
    count = 0
    for item in list:
        if item == target:
            count += 1
    return count
\`\`\`

## Algorithm Efficiency
- **Time** - how long it takes
- **Space** - how much memory it uses
- We prefer faster algorithms!`,
      objectives: ['Understand algorithms', 'Implement common patterns', 'Think about efficiency']
    },
    practice: {
      title: 'Algorithms Practice',
      description: 'Practice algorithm thinking',
      content: `# Algorithms Practice

## Activity 1: Trace Linear Search
\`\`\`python
def search(list, target):
    for i, item in enumerate(list):
        if item == target:
            return i
    return -1

result = search([5, 3, 8, 2], 8)
\`\`\`
result = ___

## Activity 2: Find Minimum
Complete the function:
\`\`\`python
def find_min(numbers):
    min_val = numbers[0]
    for num in numbers:
        if num ___ min_val:
            min_val = num
    return min_val
\`\`\`

## Activity 3: Sum All
\`\`\`python
def sum_all(numbers):
    total = ___
    for num in numbers:
        total += num
    return total
\`\`\`

## Activity 4: Count Evens
How many even numbers in [1, 2, 3, 4, 5, 6]?
\`\`\`python
def count_evens(numbers):
    count = 0
    for num in numbers:
        if num % 2 == 0:
            ___
    return count
\`\`\`

## Answers
Activity 1: 2
Activity 2: < (less than)
Activity 3: 0
Activity 4: count += 1`,
      objectives: ['Trace algorithms', 'Complete algorithm code', 'Count and sum patterns']
    },
    mastery: {
      title: 'Algorithms Master',
      description: 'Master algorithm design',
      content: `# Algorithms Master! 🧠

## Challenge 1: Two Pointers
Check if a word is a palindrome:
\`\`\`python
def is_palindrome(word):
    left = 0
    right = len(word) - 1
    while left < right:
        if word[left] != word[right]:
            return False
        left += 1
        right -= 1
    return True
\`\`\`
is_palindrome("radar") = ___

## Challenge 2: Frequency Counter
Find the most common element:
\`\`\`python
def most_common(items):
    counts = {}
    for item in items:
        if item in counts:
            counts[item] += 1
        else:
            counts[item] = 1
    # Find max...
\`\`\`

## Challenge 3: Efficiency
Which is faster for finding an item?
A) Check every element
B) If sorted, check middle first

Answer: ___

## Challenge 4: Design an Algorithm
How would you find duplicates in a list?
Steps:
1. ___
2. ___
3. ___

## Answers
Palindrome: True
Efficiency: B (binary search)`,
      objectives: ['Implement advanced patterns', 'Analyze efficiency', 'Design algorithms']
    }
  },

  'oop': {
    intro: {
      title: 'Object-Oriented Programming',
      description: 'Learn to organize code with classes and objects',
      content: `# Object-Oriented Programming (OOP)

## What is OOP?
OOP organizes code around "objects" that have:
- **Properties** (data)
- **Methods** (actions)

## Classes and Objects
A **class** is a blueprint.
An **object** is an instance of a class.

\`\`\`python
class Dog:
    def __init__(self, name):
        self.name = name  # property

    def bark(self):       # method
        print(f"{self.name} says woof!")

# Create objects
my_dog = Dog("Buddy")
your_dog = Dog("Max")

my_dog.bark()  # Buddy says woof!
\`\`\`

## Key OOP Concepts
- **Encapsulation** - bundling data and methods
- **Inheritance** - classes can inherit from others
- **Polymorphism** - same method, different behaviors

## The __init__ Method
Called when creating a new object.
Sets up initial values.`,
      objectives: ['Understand classes and objects', 'Create basic classes', 'Know OOP principles']
    },
    practice: {
      title: 'OOP Practice',
      description: 'Practice creating classes',
      content: `# OOP Practice

## Activity 1: Create an Object
\`\`\`python
class Cat:
    def __init__(self, name):
        self.name = name

my_cat = Cat("Whiskers")
print(my_cat.___)
\`\`\`
Output: ___

## Activity 2: Add a Method
\`\`\`python
class Car:
    def __init__(self, brand):
        self.brand = brand

    def honk(self):
        print(f"{self.brand} goes beep!")

my_car = Car("Toyota")
my_car.___
\`\`\`

## Activity 3: Complete the Class
\`\`\`python
class Student:
    def __init__(self, name, grade):
        self.___ = name
        self.___ = grade

    def introduce(self):
        print(f"I'm {self.name} in grade {self.grade}")
\`\`\`

## Activity 4: Multiple Objects
\`\`\`python
class Pet:
    def __init__(self, name, species):
        self.name = name
        self.species = species

pet1 = Pet("Fluffy", "cat")
pet2 = Pet("Rex", "dog")
\`\`\`
pet1.species = ___
pet2.name = ___

## Answers
Activity 1: name, Whiskers
Activity 2: honk()
Activity 3: self.name, self.grade
Activity 4: cat, Rex`,
      objectives: ['Create objects', 'Add methods', 'Work with properties']
    },
    mastery: {
      title: 'OOP Master',
      description: 'Master object-oriented design',
      content: `# OOP Master! 🏗️

## Challenge 1: Inheritance
\`\`\`python
class Animal:
    def speak(self):
        pass

class Dog(Animal):
    def speak(self):
        return "Woof!"

class Cat(Animal):
    def speak(self):
        return "Meow!"

dog = Dog()
cat = Cat()
print(dog.speak())
print(cat.speak())
\`\`\`
Output: ___

## Challenge 2: Bank Account Class
Design a BankAccount with:
- Properties: balance, owner
- Methods: deposit, withdraw

\`\`\`python
class BankAccount:
    def __init__(self, owner):
        self.owner = ___
        self.balance = ___

    def deposit(self, amount):
        ___
\`\`\`

## Challenge 3: Class Relationships
A Library has many Books.
A Book has an Author.
How would you design this?

## Answers
Inheritance: Woof!, Meow!
Bank: owner, 0, self.balance += amount`,
      objectives: ['Use inheritance', 'Design classes', 'Model relationships']
    }
  },

  'recursion': {
    intro: {
      title: 'Recursion',
      description: 'Learn about functions that call themselves',
      content: `# Recursion

## What is Recursion?
A function that **calls itself**!
Solves problems by breaking them into smaller versions.

## Anatomy of Recursion
Every recursive function needs:
1. **Base case** - when to stop
2. **Recursive case** - calls itself with smaller input

## Example: Countdown
\`\`\`python
def countdown(n):
    if n <= 0:          # Base case
        print("Blast off!")
    else:
        print(n)
        countdown(n - 1)  # Recursive case

countdown(3)  # 3, 2, 1, Blast off!
\`\`\`

## Example: Factorial
5! = 5 × 4 × 3 × 2 × 1 = 120

\`\`\`python
def factorial(n):
    if n <= 1:           # Base case
        return 1
    return n * factorial(n - 1)  # Recursive

factorial(5)  # 120
\`\`\`

## How It Works
\`\`\`
factorial(3)
= 3 * factorial(2)
= 3 * 2 * factorial(1)
= 3 * 2 * 1
= 6
\`\`\``,
      objectives: ['Understand recursion', 'Identify base and recursive cases', 'Trace recursive calls']
    },
    practice: {
      title: 'Recursion Practice',
      description: 'Practice recursive thinking',
      content: `# Recursion Practice

## Activity 1: Trace the Recursion
\`\`\`python
def sum_to(n):
    if n <= 0:
        return 0
    return n + sum_to(n - 1)

result = sum_to(4)
\`\`\`
Show the steps:
sum_to(4) = 4 + sum_to(3)
sum_to(3) = ___
sum_to(2) = ___
sum_to(1) = ___
sum_to(0) = ___
result = ___

## Activity 2: Find the Bug
\`\`\`python
def count_down(n):
    print(n)
    count_down(n - 1)  # Missing base case!
\`\`\`
What's missing? ___

## Activity 3: Complete the Base Case
\`\`\`python
def power(base, exp):
    if ___:  # Base case when exp is 0
        return 1
    return base * power(base, exp - 1)
\`\`\`

## Activity 4: Trace Factorial
factorial(4) = ?
4 × 3 × 2 × 1 = ___

## Answers
Activity 1: 3+sum_to(2), 2+sum_to(1), 1+sum_to(0), 0, 10
Activity 2: Base case (if n <= 0: return)
Activity 3: exp == 0
Activity 4: 24`,
      objectives: ['Trace recursive calls', 'Identify missing base cases', 'Calculate recursive results']
    },
    mastery: {
      title: 'Recursion Master',
      description: 'Master recursive problem solving',
      content: `# Recursion Master! 🔄

## Challenge 1: Fibonacci
\`\`\`python
def fib(n):
    if n <= 1:
        return n
    return fib(n-1) + fib(n-2)
\`\`\`
fib(6) = ___
(Sequence: 0, 1, 1, 2, 3, 5, 8...)

## Challenge 2: String Reversal
\`\`\`python
def reverse(s):
    if len(s) <= 1:
        return s
    return reverse(s[1:]) + s[0]

reverse("hello") = ___
\`\`\`

## Challenge 3: Sum of List
Write recursive sum:
\`\`\`python
def sum_list(lst):
    if len(lst) == 0:
        return ___
    return lst[0] + sum_list(___)
\`\`\`

## Challenge 4: When to Use Recursion?
Good for:
- Tree structures
- Divide and conquer
- Mathematical sequences

Bad when: ___

## Answers
Fibonacci: 8
Reverse: "olleh"
Sum: 0, lst[1:]
Bad when: Simple loops work, or too many recursive calls (stack overflow)`,
      objectives: ['Implement Fibonacci', 'Reverse strings recursively', 'Know when to use recursion']
    }
  },

  'sorting-searching': {
    intro: {
      title: 'Sorting & Searching',
      description: 'Learn fundamental sorting and searching algorithms',
      content: `# Sorting & Searching Algorithms

## Why Sort?
Sorted data is easier to:
- Search through
- Find min/max
- Remove duplicates

## Bubble Sort
Compare adjacent elements, swap if needed:
\`\`\`python
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(n - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr
\`\`\`

## Selection Sort
Find minimum, put it first, repeat:
\`\`\`python
def selection_sort(arr):
    for i in range(len(arr)):
        min_idx = i
        for j in range(i + 1, len(arr)):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr
\`\`\`

## Binary Search
For sorted arrays - check middle, eliminate half:
\`\`\`python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1
\`\`\``,
      objectives: ['Understand sorting algorithms', 'Implement binary search', 'Compare algorithm efficiency']
    },
    practice: {
      title: 'Sorting & Searching Practice',
      description: 'Practice sorting and searching',
      content: `# Sorting & Searching Practice

## Activity 1: Trace Bubble Sort
Sort [3, 1, 4, 2]:
Pass 1: [1, 3, 2, 4]
Pass 2: [1, 2, 3, 4]
Pass 3: ___

## Activity 2: Binary Search Steps
Find 7 in [1, 3, 5, 7, 9, 11, 13]:
- Middle = 7, found!
Steps: ___

Find 9:
- Middle = 7, too small, go right
- Middle = ___
Steps: ___

## Activity 3: Sort These
Use any method to sort:
[64, 34, 25, 12, 22, 11, 90]
Sorted: ___

## Activity 4: Linear vs Binary
Array has 1000 elements.
Linear search worst case: ___ comparisons
Binary search worst case: ___ comparisons

## Activity 5: Which Algorithm?
Unsorted list, find one item: ___
Sorted list, find one item: ___

## Answers
Bubble Pass 3: [1, 2, 3, 4] (already sorted)
Binary 9: 11, then 9, found in 2-3 steps
Sorted: [11, 12, 22, 25, 34, 64, 90]
Linear: 1000, Binary: ~10
Unsorted: Linear, Sorted: Binary`,
      objectives: ['Trace sorting', 'Perform binary search', 'Choose appropriate algorithm']
    },
    mastery: {
      title: 'Sorting & Searching Master',
      description: 'Master sorting and searching',
      content: `# Sorting & Searching Master! 🔍

## Challenge 1: Big O Notation
Match algorithm to complexity:
- Bubble Sort: O(___)
- Binary Search: O(___)
- Linear Search: O(___)

## Challenge 2: Merge Sort Concept
Merge these sorted halves:
[1, 4, 7] and [2, 5, 8]
Result: ___

## Challenge 3: Search Comparison
Array: [2, 4, 6, 8, 10, 12, 14, 16]
Find 14:
- Linear search steps: ___
- Binary search steps: ___

## Challenge 4: Optimize
You need to search the same sorted array many times.
Best approach: ___

You need to sort data once, then access by index.
Best approach: ___

## Challenge 5: Real World
Which uses sorting/searching?
- Phone contacts: ___
- Google search: ___
- Spell check: ___

## Answers
Big O: n², log n, n
Merge: [1, 2, 4, 5, 7, 8]
Linear: 7, Binary: 3
Phone: sorted alphabetically + binary search`,
      objectives: ['Understand Big O', 'Merge sorted arrays', 'Apply to real problems']
    }
  }
};

export default computerScienceContent;

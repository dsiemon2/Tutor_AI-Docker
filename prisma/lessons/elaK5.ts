// ELA K-5 Lesson Content
// Comprehensive educational content for elementary English Language Arts

import { LessonContent } from '../lessonContentTypes';

export const elaK5Content: Record<string, LessonContent> = {
  // ==========================================
  // KINDERGARTEN ELA
  // ==========================================
  'letter-sounds': {
    intro: {
      title: 'Letter Sounds',
      description: 'Learn the sounds each letter makes',
      content: `# Letter Sounds

## Every Letter Has a Sound!
A - /a/ as in apple 🍎
B - /b/ as in ball ⚽
C - /c/ as in cat 🐱
D - /d/ as in dog 🐕
E - /e/ as in egg 🥚

## More Letter Sounds
F - /f/ as in fish 🐟
G - /g/ as in goat 🐐
H - /h/ as in hat 🎩
I - /i/ as in igloo 🏠
J - /j/ as in jam

## Consonants and Vowels
**Vowels**: A, E, I, O, U (and sometimes Y)
**Consonants**: All the other letters!

## Practice the Sounds
Say each sound:
- /b/ /b/ /b/ - ball
- /c/ /c/ /c/ - cat
- /d/ /d/ /d/ - dog

## Beginning Sounds
What sound does "sun" start with? /s/
What sound does "mom" start with? /m/`,
      objectives: ['Know letter sounds', 'Identify beginning sounds', 'Distinguish vowels and consonants']
    },
    practice: {
      title: 'Letter Sounds Practice',
      description: 'Practice letter sounds',
      content: `# Sound Practice

## What Sound?
B makes /___/
M makes /___/
S makes /___/
T makes /___/

## Beginning Sound Match
🍎 apple starts with /___/
🐕 dog starts with /___/
🐱 cat starts with /___/
🐟 fish starts with /___/

## Which Letter?
/b/ sound = letter ___
/s/ sound = letter ___
/m/ sound = letter ___

## Same Beginning Sound?
ball - bat (yes / no)
cat - dog (yes / no)
sun - sit (yes / no)

## Answers
Sounds: /b/, /m/, /s/, /t/
Beginning: /a/, /d/, /c/, /f/
Letters: B, S, M
Same: yes, no, yes`,
      objectives: ['Say letter sounds', 'Match sounds to letters', 'Identify same beginning sounds']
    },
    mastery: {
      title: 'Letter Sounds Expert',
      description: 'Master letter sounds',
      content: `# Sound Expert! 🔤

## Sound Detective
What word starts with /p/?
pig, cat, dog → ___

What word starts with /t/?
ball, sun, top → ___

## Ending Sounds
What sound does "cat" END with? /___/
What sound does "dog" END with? /___/

## Make Words
/c/ + /a/ + /t/ = ___
/d/ + /o/ + /g/ = ___
/s/ + /u/ + /n/ = ___

## Sound Sort
Put words in groups:
ball, bat, sun, sit, cat, cup

/b/ words: ___
/s/ words: ___
/c/ words: ___

## Answers
Detective: pig, top
Ending: /t/, /g/
Words: cat, dog, sun
Sort: ball/bat, sun/sit, cat/cup`,
      objectives: ['Identify all position sounds', 'Blend sounds into words', 'Sort by sound']
    }
  },

  'sight-words-k': {
    intro: {
      title: 'Sight Words',
      description: 'Learn common words by sight',
      content: `# Sight Words

## What are Sight Words?
Words we see SO often, we know them instantly!
We don't sound them out - we just KNOW them.

## First Sight Words
**the** - THE cat
**a** - A dog
**I** - I see
**is** - It IS big
**it** - IT is red

## More Sight Words
**and** - cat AND dog
**to** - go TO school
**we** - WE play
**see** - I SEE you
**go** - let's GO

## Even More!
**like** - I LIKE it
**my** - MY toy
**you** - I see YOU
**can** - I CAN do it
**have** - I HAVE one

## Practice Reading
- I see the cat.
- We can go.
- I like my dog.`,
      objectives: ['Recognize basic sight words', 'Read sight words quickly', 'Use sight words in sentences']
    },
    practice: {
      title: 'Sight Words Practice',
      description: 'Practice reading sight words',
      content: `# Sight Words Practice

## Read Fast!
Read each word quickly:
the - a - I - is - it
and - to - we - see - go
like - my - you - can - have

## Fill in the Blank
I ___ a cat. (see/the)
___ like it. (I/a)
We can ___. (go/is)

## Match the Word
Circle "the" in each:
- The cat is big.
- I see the dog.
- Look at the sun.

## Read the Sentences
1. I see a cat.
2. We can go.
3. I like my dog.
4. It is big.
5. You and I can see it.

## Answers
Fill in: see, I, go`,
      objectives: ['Read sight words fluently', 'Use sight words correctly']
    },
    mastery: {
      title: 'Sight Words Champion',
      description: 'Master kindergarten sight words',
      content: `# Sight Words Champion! ⭐

## Speed Read
How fast can you read?
I see the cat.
We can go to my house.
You and I like it.

## Write the Word
_ _ _ (the)
_ _ _ (see)
_ _ (go)
_ _ _ _ (like)

## Sentence Building
Use sight words to make sentences:
Words: I, see, a, the, and, can, go, like

Make 3 sentences:
1. ___
2. ___
3. ___

## Missing Words
I ___ a dog.
___ cat is big.
We ___ go.

## Answers
Missing: see, The, can`,
      objectives: ['Read sight words quickly', 'Write sight words', 'Create sentences']
    }
  },

  'rhyming-words': {
    intro: {
      title: 'Rhyming Words',
      description: 'Learn about words that sound alike',
      content: `# Rhyming Words

## What is Rhyming?
Words RHYME when they sound the same at the END.
cat - hat - bat (all end in -at!)

## Rhyming Examples
**-at family**: cat, hat, bat, rat, sat, mat
**-an family**: can, man, ran, fan, pan, van
**-op family**: hop, top, mop, pop, stop
**-ig family**: big, pig, dig, wig, fig

## Do They Rhyme?
cat and hat → YES! ✓
cat and dog → NO ✗
sun and fun → YES! ✓

## Rhyming is Fun!
🎵 Twinkle, twinkle, little star
How I wonder what you are! 🎵

Star and are RHYME!

## Make Rhymes
dog → fog, log, hog
sun → fun, run, bun`,
      objectives: ['Understand rhyming', 'Identify rhyming words', 'Generate rhymes']
    },
    practice: {
      title: 'Rhyming Practice',
      description: 'Practice rhyming words',
      content: `# Rhyming Practice

## Do They Rhyme?
cat - bat (yes / no)
dog - cat (yes / no)
sun - fun (yes / no)
big - pig (yes / no)

## Match the Rhymes
Draw lines:
cat → mop
hop → hat
sun → fan
can → run

## Find the Rhyme
What rhymes with "man"?
dog, can, big → ___

What rhymes with "hop"?
cat, top, run → ___

## Odd One Out
Circle the word that doesn't rhyme:
cat, hat, dog, bat
sun, fun, top, run

## Make a Rhyme
hat → ___
pig → ___
sun → ___

## Answers
Rhyme: yes, no, yes, yes
Match: cat-hat, hop-mop, sun-run, can-fan
Find: can, top
Odd: dog, top`,
      objectives: ['Identify rhymes', 'Match rhyming pairs', 'Create rhymes']
    },
    mastery: {
      title: 'Rhyming Expert',
      description: 'Master rhyming skills',
      content: `# Rhyming Expert! 🎵

## Rhyme Chain
Start with "cat":
cat → hat → ___ → ___ → ___

## Complete the Rhyme
Roses are red,
Violets are ___,
Sugar is sweet,
And so are ___!

## Make Rhyming Sentences
The cat sat on a ___.
I can see a bee in a ___.

## Create a Poem
Use these rhyming words: dog, log, frog
Write 2 lines that rhyme:
___
___

## Rhyme Challenge
How many words rhyme with "at"?
List them: ___

## Answers
Chain: bat, mat, sat, rat
Poem: blue, you
Sentences: mat/hat, tree
-at words: cat, hat, bat, mat, sat, rat, fat, pat`,
      objectives: ['Create rhyme chains', 'Write rhyming sentences', 'Compose simple rhymes']
    }
  },

  // ==========================================
  // FIRST GRADE ELA
  // ==========================================
  'phonics-blends': {
    intro: {
      title: 'Phonics and Blends',
      description: 'Learn consonant blends and digraphs',
      content: `# Phonics and Blends

## What are Blends?
Two consonants that work TOGETHER!
You hear BOTH sounds.

## Beginning Blends
**bl**: blue, black, block
**br**: brown, bring, brush
**cl**: clap, cloud, clock
**cr**: cry, crab, crown
**dr**: drink, drum, dress
**fl**: fly, flag, floor
**fr**: frog, free, friend
**gl**: glad, glass, glue
**gr**: green, grow, grape
**pl**: play, plant, plate
**pr**: pretty, prince, prize
**sl**: slide, slow, sleep
**sm**: small, smile, smell
**sn**: snow, snake, snack
**sp**: spin, spot, spider
**st**: stop, star, stay
**tr**: tree, train, truck

## Digraphs
Two letters, ONE sound!
**ch**: cheese, chair, chocolate
**sh**: ship, shoe, shark
**th**: this, that, think
**wh**: what, when, where`,
      objectives: ['Identify consonant blends', 'Read words with blends', 'Know common digraphs']
    },
    practice: {
      title: 'Blends Practice',
      description: 'Practice reading blends',
      content: `# Blends Practice

## What's the Blend?
blue → ___
frog → ___
stop → ___
train → ___

## Read the Words
bl: black, blue, block
fr: frog, free, friend
st: stop, star, stay
tr: tree, train, truck

## Fill in the Blend
___op (st)
___ue (bl)
___ee (tr)
___og (fr)

## Digraph Practice
ch, sh, th, or wh?
___ip (ship)
___at (that)
___eese (cheese)
___en (when)

## Blend Sort
Sort: frog, blue, stop, tree, black, train

bl words: ___
st words: ___
fr words: ___
tr words: ___

## Answers
Blends: bl, fr, st, tr
Fill in: stop, blue, tree, frog
Digraphs: sh, th, ch, wh`,
      objectives: ['Identify blends in words', 'Read blend words', 'Sort by blends']
    },
    mastery: {
      title: 'Blends Master',
      description: 'Master phonics blends',
      content: `# Blends Master! 🔤

## Blend Challenge
Read these quickly:
splash, street, spring, shrink

## Ending Blends
Words can END with blends too!
-nk: think, drink, pink
-nd: hand, sand, find
-st: best, fast, list
-mp: jump, camp, bump

## Find All Blends
"The frog jumped into the stream."
Blends: ___, ___

## Write Words
Write a word with:
bl: ___
gr: ___
ch: ___
st: ___

## Sentence Reading
The green frog sat by the stream.
The black truck stopped fast.

## Answers
Find blends: fr (frog), str (stream), mp (jumped)`,
      objectives: ['Read complex blends', 'Identify ending blends', 'Use blends in context']
    }
  },

  'reading-simple': {
    intro: {
      title: 'Reading Simple Sentences',
      description: 'Learn to read complete sentences',
      content: `# Reading Simple Sentences

## What is a Sentence?
A sentence is a complete thought.
It starts with a CAPITAL letter.
It ends with a PERIOD (.) or question mark (?).

## Simple Sentences
The cat sat.
I see a dog.
We can run.
She is happy.

## Parts of a Sentence
WHO or WHAT + DOES WHAT
The cat + sat.
I + see a dog.

## Finger Reading
Point to each word as you read:
The - cat - is - big.
Touch each word. Say it. Move on!

## Reading Tips
1. Look at the picture
2. Look at the first letter
3. Sound it out
4. Does it make sense?`,
      objectives: ['Read simple sentences', 'Understand sentence structure', 'Use reading strategies']
    },
    practice: {
      title: 'Reading Practice',
      description: 'Practice reading sentences',
      content: `# Reading Practice

## Read Each Sentence
1. The dog ran fast.
2. I can see the sun.
3. We like to play.
4. The cat is on the mat.
5. She has a red ball.

## Match Picture to Sentence
🐱 → The cat sat.
🐕 → The dog ran.
☀️ → I see the sun.

## Yes or No?
Read and answer:
"The cat is big." Does this sentence make sense? ___
"The sun is blue." Is this true? ___
"Dogs can bark." Is this true? ___

## Find the Sentence
Which is a complete sentence?
A) The big dog
B) The big dog ran.
C) Ran fast

Answer: ___

## Answers
Yes/No: yes, no, yes
Sentence: B`,
      objectives: ['Read sentences fluently', 'Match meaning to pictures', 'Identify complete sentences']
    },
    mastery: {
      title: 'Reading Champion',
      description: 'Master sentence reading',
      content: `# Reading Champion! 📚

## Read the Story
Sam has a cat.
The cat is gray.
The cat can run.
Sam likes his cat.

Questions:
1. Who has a cat? ___
2. What color is the cat? ___
3. What can the cat do? ___

## Fix the Sentence
Add the missing period:
The dog is big___
We can play___
I see a bird___

## Make a Sentence
Put words in order:
cat / The / sat / mat / on / the
___

## Read and Draw
Read: "The sun is yellow."
Draw what you read!

## Answers
Story: Sam, gray, run
Sentence: The cat sat on the mat.`,
      objectives: ['Read short stories', 'Answer comprehension questions', 'Build sentences']
    }
  },

  'writing-sentences': {
    intro: {
      title: 'Writing Sentences',
      description: 'Learn to write complete sentences',
      content: `# Writing Sentences

## Sentence Rules
Every sentence needs:
1. Start with a CAPITAL letter
2. End with a . or ? or !
3. A complete thought (who + does what)

## Examples
✓ The cat sat.
✗ the cat sat (no capital, no period)
✗ The cat (not complete - what did it do?)

## Types of Sentences
**Telling**: The dog is brown.
**Asking**: Is the dog brown?
**Excited**: The dog is so cute!

## Sentence Starters
I can...
I see...
I like...
The ___ is...
We can...

## Building Sentences
WHO + DOES WHAT
The cat + sleeps.
I + run fast.
Mom + cooks dinner.`,
      objectives: ['Use capitals and periods', 'Write complete sentences', 'Know sentence types']
    },
    practice: {
      title: 'Writing Practice',
      description: 'Practice writing sentences',
      content: `# Writing Practice

## Fix These Sentences
Add capitals and periods:
the cat ran ___
i see a bird ___
we like to play ___

## Complete the Sentence
The dog ___. (is big / big)
I can ___. (run / running)
We ___ to school. (go / going)

## Write Your Own
Finish these:
I see ___.
The cat is ___.
We can ___.

## What's Wrong?
Find the mistake:
1. the sun is yellow
2. I like Dogs.
3. We can play

Mistakes: ___

## Picture Writing
Look at 🐕
Write a sentence about the dog:
___

## Answers
Fix: The cat ran. / I see a bird. / We like to play.
Complete: is big, run, go
Mistakes: 1-no capital/period, 2-Dogs shouldn't be capital, 3-needs period`,
      objectives: ['Apply sentence rules', 'Write complete sentences', 'Fix sentence errors']
    },
    mastery: {
      title: 'Writing Expert',
      description: 'Master sentence writing',
      content: `# Writing Expert! ✏️

## Write 3 Sentences About...
🐱 A cat:
1. ___
2. ___
3. ___

## Asking Questions
Turn into questions:
The dog is big. → ___?
You can run. → ___?

## Exciting Sentences
Add excitement!
The cake is good. → ___!
We won the game. → ___!

## Story Writing
Write 3 sentences to tell a story:
Beginning: ___
Middle: ___
End: ___

## Edit This
"me and mom went to the stor we got food"
Fix it: ___

## Answers
Questions: Is the dog big? Can you run?
Edit: Mom and I went to the store. We got food.`,
      objectives: ['Write multiple sentences', 'Use different sentence types', 'Edit writing']
    }
  },

  // ==========================================
  // SECOND GRADE ELA
  // ==========================================
  'reading-fluency': {
    intro: {
      title: 'Reading Fluency',
      description: 'Learn to read smoothly and with expression',
      content: `# Reading Fluency

## What is Fluency?
Reading that sounds SMOOTH, like talking!
- Not too fast
- Not too slow
- With expression!

## Three Parts of Fluency
1. **Accuracy** - Reading words correctly
2. **Rate** - Reading at a good speed
3. **Expression** - Making it sound interesting

## Punctuation Helps!
. Period = Stop, take a breath
, Comma = Short pause
? Question = Voice goes UP
! Exclamation = Show excitement!
" " Quotation = Someone is talking

## Practice Reading
Read this with expression:
"Look!" said Mom. "A rainbow!"
"Wow!" said Sam. "It's so pretty!"

## Tips for Fluency
- Read the same text many times
- Listen to good readers
- Practice, practice, practice!`,
      objectives: ['Understand fluency', 'Read with expression', 'Use punctuation to guide reading']
    },
    practice: {
      title: 'Fluency Practice',
      description: 'Practice reading fluently',
      content: `# Fluency Practice

## Read with Punctuation
Pause at the commas:
After school, I went home, ate a snack, and played.

Stop at the periods:
I have a dog. His name is Max. He is brown.

## Read with Expression
"Help!" cried the boy. "I'm stuck!"
"Don't worry," said Mom. "I'll help you."

## Question or Statement?
Read each correctly:
Is it time to go?
It is time to go.
Can you help me?
You can help me.

## Timed Reading
Read this 3 times. Get faster each time!
"The sun was hot. The kids ran to the pool. They jumped in and splashed around. What a fun day!"

## Rate Yourself
Smooth? ☆☆☆
Expression? ☆☆☆
Accuracy? ☆☆☆`,
      objectives: ['Use punctuation while reading', 'Vary expression', 'Build reading speed']
    },
    mastery: {
      title: 'Fluency Master',
      description: 'Master reading fluency',
      content: `# Fluency Master! 🎭

## Character Voices
Read with different voices:
"I want that toy!" said the little girl.
"No way!" said her brother.
"Please?" she asked sweetly.

## Fluency Passage
Read smoothly:
"One sunny day, a little frog sat by the pond. He was bored. 'I want to go on an adventure!' he said. So he hopped away to find one."

## Echo Reading
Have someone read, then YOU read the same part.
Match their expression!

## Poetry Reading
"Twinkle, twinkle, little star,
How I wonder what you are!
Up above the world so high,
Like a diamond in the sky."

## Self-Check
Did I read every word? ___
Did I use expression? ___
Did it sound smooth? ___`,
      objectives: ['Use character voices', 'Read poetry fluently', 'Self-assess fluency']
    }
  },

  'spelling-patterns': {
    intro: {
      title: 'Spelling Patterns',
      description: 'Learn common spelling patterns',
      content: `# Spelling Patterns

## Word Families
Words that share an ending:
**-ake**: cake, make, take, lake, bake
**-ight**: light, night, right, might, fight
**-tion**: action, station, nation

## Silent E Rule
When a word ends in silent e, the vowel says its name!
cap → cape (a says its name)
hop → hope (o says its name)
kit → kite (i says its name)

## Double Letters
Sometimes letters are doubled:
- ball, bell, hill, doll
- happy, funny, puppy
- running, sitting, getting

## Vowel Teams
Two vowels together:
**ea**: read, eat, bead
**ai**: rain, train, paint
**oa**: boat, coat, road
**oo**: moon, food, cool

## Tricky Spellings
- **ck**: duck, truck, black
- **tch**: catch, watch, match
- **dge**: bridge, fridge, badge`,
      objectives: ['Recognize spelling patterns', 'Apply silent e rule', 'Spell words with vowel teams']
    },
    practice: {
      title: 'Spelling Practice',
      description: 'Practice spelling patterns',
      content: `# Spelling Practice

## Word Family Sort
-ake or -ight?
cake → ___
night → ___
make → ___
light → ___

## Add Silent E
Change the word:
cap → c___ (cape)
hop → h___ (hope)
bit → b___ (bite)
cut → c___ (cute)

## Vowel Teams
Fill in ea, ai, or oa:
r___n (rain)
b___t (boat)
r___d (read)

## Double or Not?
sitting or siting? ___
running or runing? ___
hoping or hopping? ___

## Spell Check
Which is correct?
truk or truck? ___
nite or night? ___
thay or they? ___

## Answers
Families: ake, ight, ake, ight
Vowels: ai, oa, ea
Double: sitting, running, hopping
Correct: truck, night, they`,
      objectives: ['Sort by word families', 'Apply spelling rules', 'Identify correct spellings']
    },
    mastery: {
      title: 'Spelling Champion',
      description: 'Master spelling patterns',
      content: `# Spelling Champion! ✨

## Pattern Detective
Find the pattern:
train, rain, main, brain
Pattern: ___

## Rule Application
Add -ing:
run → ___ (double the n!)
hope → ___ (drop the e!)
play → ___ (just add ing!)

## Tricky Words
Write correctly:
catsh → ___
brige → ___
knok → ___

## Word Building
Make words with -tion:
ac + tion = ___
sta + tion = ___
na + tion = ___

## Spell the Sentence
"The bote sailed across the see."
Correct: ___

## Answers
Pattern: -ain
-ing: running, hoping, playing
Tricky: catch, bridge, knock
Words: action, station, nation
Sentence: boat, sea`,
      objectives: ['Identify patterns', 'Apply multiple rules', 'Correct misspellings']
    }
  },

  'complete-sentences': {
    intro: {
      title: 'Complete Sentences',
      description: 'Write complete sentences with subjects and predicates',
      content: `# Complete Sentences

## Parts of a Sentence
Every sentence has TWO parts:
1. **Subject** - WHO or WHAT the sentence is about
2. **Predicate** - What the subject DOES or IS

## Examples
| Subject | Predicate |
|---------|-----------|
| The dog | runs fast. |
| My mom | cooks dinner. |
| The red car | is shiny. |

## Subjects
The subject tells WHO or WHAT:
- The cat (who?)
- My friend (who?)
- The big house (what?)

## Predicates
The predicate tells what happens:
- runs fast (does what?)
- is happy (is what?)
- ate lunch (did what?)

## Fragment vs. Sentence
**Fragment** (not complete): The big dog
**Sentence** (complete): The big dog barks loudly.

Add the missing part to make it complete!`,
      objectives: ['Identify subjects and predicates', 'Distinguish fragments from sentences', 'Write complete sentences']
    },
    practice: {
      title: 'Sentences Practice',
      description: 'Practice with subjects and predicates',
      content: `# Sentence Practice

## Find the Subject
Underline the subject:
1. The boy ran home.
2. My cat sleeps all day.
3. The tall tree fell down.

## Find the Predicate
Underline the predicate:
1. The girl reads books.
2. My dog barks loudly.
3. The sun shines brightly.

## Complete or Fragment?
1. Ran to the store. ___
2. The happy puppy. ___
3. We play soccer. ___
4. The old house on the hill. ___

## Add a Predicate
The bird ___.
My teacher ___.
The loud thunder ___.

## Add a Subject
___ plays basketball.
___ is very tall.
___ flew away.

## Answers
Complete: 3
Fragments: 1, 2, 4`,
      objectives: ['Identify sentence parts', 'Recognize fragments', 'Complete sentences']
    },
    mastery: {
      title: 'Sentence Expert',
      description: 'Master complete sentences',
      content: `# Sentence Expert! 📝

## Fix the Fragments
Turn into complete sentences:
1. The funny clown → ___
2. Jumped over the fence → ___
3. Under the big tree → ___

## Combine Parts
Match subjects and predicates:
The children | is very hot.
The sun | play in the park.
My breakfast | was delicious.

## Expand Sentences
Make longer:
The dog barks. →
The ___ dog barks ___.

## Writing Challenge
Write 3 sentences with:
- A person as subject
- An animal as subject
- A thing as subject

1. ___
2. ___
3. ___

## Answers
Combine: children-play, sun-hot, breakfast-delicious`,
      objectives: ['Fix fragments', 'Match parts', 'Expand sentences']
    }
  }
};

export default elaK5Content;

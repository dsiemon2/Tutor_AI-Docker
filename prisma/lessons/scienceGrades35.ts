// Science Grades 3-5 Lesson Content
// Comprehensive educational content for elementary science grades 3-5

import { LessonContent } from '../lessonContentTypes';

export const scienceGrades35Content: Record<string, LessonContent> = {
  // ==========================================
  // GRADE 3 SCIENCE
  // ==========================================
  'forces-motion-simple': {
    intro: {
      title: 'Forces and Motion',
      description: 'Learn about push, pull, and how things move',
      content: `# Forces and Motion

## What is a Force?
A **force** is a push or a pull that makes things move, stop, or change direction.

## Types of Forces
- **Push:** Moving something away from you
- **Pull:** Moving something toward you

## Gravity
**Gravity** is a force that pulls everything toward Earth.
- It keeps us on the ground
- It makes things fall down
- The Moon has less gravity (that's why astronauts bounce!)

## Friction
**Friction** is a force that slows things down.
- Rough surfaces have more friction
- Smooth surfaces have less friction
- Examples: Brakes on a bike, shoes on the floor

## Motion
**Motion** is when something changes position.
- Speed: How fast something moves
- Direction: Which way it's going

## Newton's First Law (Simple)
Objects stay still unless a force moves them.
Objects keep moving until a force stops them!`,
      objectives: ['Define force as push or pull', 'Understand gravity and friction', 'Describe how forces affect motion']
    },
    practice: {
      title: 'Forces and Motion Practice',
      description: 'Practice identifying forces',
      content: `# Forces Practice

## Push or Pull?
1. Opening a door: ___
2. Kicking a ball: ___
3. Pulling a wagon: ___
4. Throwing a baseball: ___

## What Force?
Match the situation to the force:
1. An apple falls from a tree: ___
2. A car slows down on a rough road: ___
3. You slide farther on ice than carpet: ___

A) Friction  B) Gravity  C) Less friction

## True or False
1. Friction speeds things up: ___
2. Gravity pulls things toward Earth: ___
3. A ball will roll forever without any force: ___

## Predict
What happens if you:
1. Push a toy car on carpet vs. tile? ___
2. Roll a ball up a hill? ___

## Answers
Push/Pull: Pull, Push, Pull, Push
Forces: B, A, C
T/F: False, True, False (friction stops it)
Predict: Slower on carpet (more friction); Slows down (gravity)`,
      objectives: ['Classify push and pull forces', 'Identify forces in everyday situations', 'Predict motion outcomes']
    },
    mastery: {
      title: 'Forces and Motion Expert',
      description: 'Master forces and motion concepts',
      content: `# Forces Expert

## Balanced vs Unbalanced Forces
**Balanced:** Forces are equal - no movement
Example: Tug of war with equal teams

**Unbalanced:** One force is stronger - movement!
Example: Winning team in tug of war

## Speed and Direction
Speed = Distance ÷ Time
A car travels 100 miles in 2 hours.
Speed = 100 ÷ 2 = 50 mph

## Experiment Design
Design an experiment:
**Question:** Does the surface affect how far a car rolls?
**Materials:** ___
**Procedure:** ___
**Prediction:** ___

## Real-World Applications
1. Why do basketball shoes have treads?
2. Why do skydivers use parachutes?
3. How do brakes work?

## Challenge
A soccer ball sits still. You kick it.
- What force did you apply? ___
- What force eventually stops it? ___
- How could you make it go farther? ___

## Answers
Challenge: Push force, Friction, Kick harder or smoother surface`,
      objectives: ['Understand balanced/unbalanced forces', 'Calculate simple speed', 'Apply concepts to real situations']
    }
  },

  'simple-machines': {
    intro: {
      title: 'Simple Machines',
      description: 'Learn how simple machines make work easier',
      content: `# Simple Machines

## What is a Simple Machine?
A simple machine makes work easier by:
- Using less force
- Changing direction of force

## The 6 Simple Machines

### 1. Lever
A bar that pivots on a point (fulcrum)
Examples: Seesaw, crowbar, scissors

### 2. Wheel and Axle
A wheel attached to a rod
Examples: Doorknob, steering wheel, screwdriver

### 3. Pulley
A wheel with a rope
Examples: Flagpole, blinds, elevator

### 4. Inclined Plane
A flat surface at an angle (ramp)
Examples: Wheelchair ramp, slide, loading dock

### 5. Wedge
Two inclined planes put together
Examples: Knife, axe, doorstop

### 6. Screw
An inclined plane wrapped around a cylinder
Examples: Jar lid, bolt, spiral staircase

## How They Help
They don't reduce work - they make it easier by:
- Spreading force over longer distance
- Changing direction of push/pull`,
      objectives: ['Name the 6 simple machines', 'Give examples of each', 'Understand how they help']
    },
    practice: {
      title: 'Simple Machines Practice',
      description: 'Practice identifying simple machines',
      content: `# Simple Machines Practice

## Identify the Machine
1. Seesaw: ___
2. Doorknob: ___
3. Flagpole rope: ___
4. Wheelchair ramp: ___
5. Knife blade: ___
6. Screw in wood: ___

## Match the Example
Draw lines:
Hammer (pulling nail) → Lever / Pulley
Scissors → Lever / Wedge
Spiral staircase → Screw / Inclined Plane
Faucet handle → Wheel and Axle / Lever

## Real Life
Find simple machines in your classroom:
1. Lever: ___
2. Inclined Plane: ___
3. Wedge: ___

## Why Use Them?
1. Why use a ramp instead of lifting?
2. Why use a pulley to raise a flag?

## Answers
Identify: Lever, Wheel/Axle, Pulley, Inclined Plane, Wedge, Screw
Match: Lever, Both!, Screw, Wheel and Axle
Why: Less force needed; Changes direction`,
      objectives: ['Identify simple machines in objects', 'Classify machines correctly', 'Explain advantages']
    },
    mastery: {
      title: 'Simple Machines Expert',
      description: 'Master simple machine concepts',
      content: `# Simple Machines Expert

## Compound Machines
Machines made of 2+ simple machines!

**Scissors:** Lever + Wedge
**Wheelbarrow:** Lever + Wheel and Axle
**Bicycle:** Many machines together!

## Mechanical Advantage
How much a machine multiplies your force.
- Longer lever arm = more advantage
- More pulleys = more advantage

## Design Challenge
Design a compound machine to:
1. Lift a heavy box to a shelf
2. Move a wagon uphill

What simple machines would you use?

## Classify These
1. Pizza cutter: ___
2. Bike chain/gears: ___
3. Can opener: ___
4. Escalator: ___

## Critical Thinking
Why don't simple machines reduce the amount of work?
(Hint: Think about distance)

## Answer
They spread the same work over longer distance or different direction - but total work stays the same!

Classify: Wheel/Axle + Wedge, Wheel/Axle + Pulley, Lever + Wedge + Wheel/Axle, Inclined Plane + Pulley`,
      objectives: ['Identify compound machines', 'Understand mechanical advantage', 'Design simple machine solutions']
    }
  },

  'food-chains': {
    intro: {
      title: 'Food Chains',
      description: 'Learn how energy flows through ecosystems',
      content: `# Food Chains

## What is a Food Chain?
A **food chain** shows how energy passes from one living thing to another.

## Parts of a Food Chain

### Producers
- Make their own food using sunlight
- Plants, algae, some bacteria
- Start every food chain!

### Consumers
**Primary (1st):** Eat producers (herbivores)
Examples: Rabbits, deer, caterpillars

**Secondary (2nd):** Eat primary consumers
Examples: Frogs, small birds, snakes

**Tertiary (3rd):** Eat secondary consumers
Examples: Hawks, foxes, sharks

### Decomposers
- Break down dead organisms
- Return nutrients to soil
- Fungi, bacteria, worms

## Example Food Chain
Sun → Grass → Rabbit → Fox → Decomposer
↓
(Energy flows this direction)

## Energy Transfer
Only about 10% of energy passes to the next level!
That's why there are fewer predators than prey.`,
      objectives: ['Define food chain', 'Identify producers, consumers, decomposers', 'Trace energy flow']
    },
    practice: {
      title: 'Food Chains Practice',
      description: 'Practice with food chains',
      content: `# Food Chains Practice

## Classify Each Organism
1. Grass: Producer / Consumer
2. Rabbit: Producer / Consumer
3. Mushroom: Consumer / Decomposer
4. Hawk: Primary / Secondary / Tertiary

## Build a Food Chain
Put in order (use arrows):
Hawk, Grass, Snake, Grasshopper
___ → ___ → ___ → ___

## Missing Link
Algae → ??? → Big Fish → Shark
What could the ??? be?

## True or False
1. Producers make their own food: ___
2. Energy increases at each level: ___
3. Decomposers are at the end of all food chains: ___
4. The sun is the original energy source: ___

## Food Chain vs Food Web
A food web shows many connected food chains.
Why is a web more realistic than a chain?

## Answers
Classify: Producer, Consumer, Decomposer, Tertiary
Chain: Grass → Grasshopper → Snake → Hawk
Missing: Small fish
T/F: T, F, T, T
Web: Animals eat many different things!`,
      objectives: ['Classify organisms by role', 'Construct food chains', 'Understand energy flow']
    },
    mastery: {
      title: 'Food Chains Expert',
      description: 'Master food chain concepts',
      content: `# Food Chains Expert

## Food Webs
Real ecosystems have many overlapping food chains.

Ocean Food Web Example:
- Phytoplankton → Zooplankton → Small fish → Tuna → Shark
- Phytoplankton → Zooplankton → Jellyfish → Sea turtle
- Seaweed → Sea urchin → Sea otter

## Energy Pyramid
Shows energy at each level:
- Bottom (widest): Producers - Most energy
- Middle: Herbivores
- Top (smallest): Top predators - Least energy

Why the pyramid shape?
Energy is lost as heat at each level!

## What If...?
Predict what happens:
1. All the rabbits disappear: ___
2. A new predator is introduced: ___
3. A disease kills the grass: ___

## Decomposer Importance
Without decomposers:
- Dead things would pile up
- Nutrients wouldn't return to soil
- Plants couldn't grow

## Real-World Application
Why should we protect ALL parts of a food web, not just the "cute" animals?

## Answers
What If: Foxes starve/grass overgrows; Competition/prey decrease; Whole chain collapses
Why protect all: Every organism plays a role; removing one affects all others`,
      objectives: ['Analyze food webs', 'Understand energy pyramids', 'Predict ecosystem changes']
    }
  },

  // ==========================================
  // GRADE 4 SCIENCE
  // ==========================================
  'energy-forms': {
    intro: {
      title: 'Forms of Energy',
      description: 'Learn about different types of energy',
      content: `# Forms of Energy

## What is Energy?
**Energy** is the ability to do work or cause change.
Energy cannot be created or destroyed - only transformed!

## Types of Energy

### Kinetic Energy
Energy of MOTION
- A rolling ball
- Running water
- Wind blowing

### Potential Energy
STORED energy
- A ball held high
- Stretched rubber band
- Food (chemical potential)

## Forms of Energy

### Light Energy
- From the sun, bulbs, fire
- Travels in waves
- Lets us see

### Heat Energy (Thermal)
- Moves from hot to cold
- Makes things warm
- From friction, fire, sun

### Sound Energy
- Vibrations we can hear
- Travels through air, water, solids
- Louder = more energy

### Electrical Energy
- Moving electrons
- Powers our devices
- From batteries, outlets

### Chemical Energy
- Stored in bonds (food, fuel)
- Released in reactions`,
      objectives: ['Define energy', 'Distinguish kinetic and potential', 'Name forms of energy']
    },
    practice: {
      title: 'Energy Forms Practice',
      description: 'Practice identifying energy types',
      content: `# Energy Practice

## Kinetic or Potential?
1. A book on a shelf: ___
2. A flying bird: ___
3. A compressed spring: ___
4. A moving car: ___
5. Food before eating: ___

## Name the Energy Form
1. A flashlight beam: ___
2. A guitar playing: ___
3. A heater warming a room: ___
4. A battery: ___
5. Lightning: ___

## Energy Transformations
What changes happen?
1. Lamp: Electrical → ___ + ___
2. Car engine: Chemical → ___ + ___
3. Solar panel: Light → ___

## Match
Toaster → Sound / Heat
Radio → Sound / Light
Candle → Light + Heat / Electrical

## Answers
K/P: P, K, P, K, P
Forms: Light, Sound, Heat, Chemical, Electrical
Transform: Light + Heat, Kinetic + Heat, Electrical
Match: Heat, Sound, Light + Heat`,
      objectives: ['Classify kinetic vs potential', 'Identify energy forms', 'Trace energy transformations']
    },
    mastery: {
      title: 'Energy Forms Expert',
      description: 'Master energy concepts',
      content: `# Energy Expert

## Law of Conservation of Energy
Energy cannot be created or destroyed!
It only changes form.

Total energy stays the same.

## Energy Chains
Trace energy through systems:
**Power Plant:**
Chemical (coal) → Heat → Kinetic (turbine) → Electrical

**You eating breakfast:**
Light (sun) → Chemical (plant) → Chemical (you) → Kinetic (running)

## Create an Energy Chain
Trace energy from sun to you reading this:
Sun → ___ → ___ → ___ → ___

## Efficiency
Not all energy goes where we want!
Light bulbs: Most energy becomes heat, not light
LED bulbs are more efficient!

## Challenge Questions
1. Where does "lost" energy usually go?
2. Why do we get hungry after exercise?
3. How is a battery like food?

## Renewable vs Non-renewable
**Renewable:** Solar, wind, water (won't run out)
**Non-renewable:** Coal, oil, gas (limited supply)

## Answers
Chain example: Sun → Plants (chemical) → Food → You (chemical) → Movement/thinking
Lost energy: Heat
Hungry: Used chemical energy
Battery/food: Both store chemical energy`,
      objectives: ['Apply conservation of energy', 'Trace energy chains', 'Compare energy sources']
    }
  },

  'earth-layers': {
    intro: {
      title: "Earth's Layers",
      description: 'Explore the structure of our planet',
      content: `# Earth's Layers

## Earth is Like an Egg!
Just like an egg has a shell, white, and yolk, Earth has layers.

## The Four Main Layers

### 1. Crust (Outer Shell)
- Thinnest layer (5-70 km)
- Where we live!
- Made of rock
- Two types: Continental (land) and Oceanic (under ocean)

### 2. Mantle (Middle)
- Thickest layer (2,900 km)
- Hot, semi-solid rock
- Slowly flows like thick honey
- Convection currents move plates!

### 3. Outer Core
- Liquid iron and nickel
- Very hot (4,000-5,000°C)
- Creates Earth's magnetic field

### 4. Inner Core
- Solid ball of iron and nickel
- Hottest part (5,000°C+)
- Solid because of extreme pressure

## How Do We Know?
Scientists study earthquake waves!
Waves travel differently through liquids and solids.`,
      objectives: ['Name Earth\'s four layers', 'Describe each layer\'s properties', 'Understand Earth\'s interior']
    },
    practice: {
      title: "Earth's Layers Practice",
      description: 'Practice with Earth layers',
      content: `# Earth Layers Practice

## Label the Layers
From outside to inside:
1. ___ (we live here)
2. ___ (thickest, flows slowly)
3. ___ (liquid metal)
4. ___ (solid metal ball)

## Properties Match
Match layer to property:
A. Crust    1. Liquid iron
B. Mantle   2. Thinnest layer
C. Outer Core 3. Solid iron
D. Inner Core 4. Flows like honey

## True or False
1. The inner core is liquid: ___
2. The mantle is the thickest layer: ___
3. We have traveled to Earth's core: ___
4. The outer core creates magnetic field: ___

## Temperature
Put in order from coolest to hottest:
Inner Core, Crust, Mantle, Outer Core

## Why Important?
How do Earth's layers affect:
1. Volcanoes? ___
2. Earthquakes? ___

## Answers
Layers: Crust, Mantle, Outer Core, Inner Core
Match: A-2, B-4, C-1, D-3
T/F: F, T, F, T
Temp order: Crust, Mantle, Outer Core, Inner Core`,
      objectives: ['Identify and order layers', 'Match properties to layers', 'Connect to Earth processes']
    },
    mastery: {
      title: "Earth's Layers Expert",
      description: 'Master Earth structure concepts',
      content: `# Earth Layers Expert

## Plate Tectonics
The crust is broken into plates that float on the mantle.
These plates move slowly (a few cm/year).

When plates:
- **Collide:** Mountains form
- **Pull apart:** Valleys/rifts form
- **Slide past:** Earthquakes!

## The Rock Cycle
Rocks change form over millions of years:
Ignite → Sedimentary → Metamorphic → (melts) → Igneous

## Scale Model
If Earth were an apple:
- Skin = Crust
- Flesh = Mantle
- Core = Seeds

## Seismic Waves
**P-waves:** Travel through solids AND liquids
**S-waves:** Only through solids

How scientists discovered liquid outer core:
S-waves don't pass through it!

## Challenge
1. Why is the inner core solid even though it's hotter than the liquid outer core?
2. What would happen if Earth's core cooled down?

## Answers
1. Extreme pressure keeps it solid
2. No magnetic field = dangerous radiation from sun`,
      objectives: ['Understand plate tectonics basics', 'Connect layers to geological events', 'Interpret seismic wave data']
    }
  },

  'human-body-intro': {
    intro: {
      title: 'Human Body Systems Introduction',
      description: 'Learn about the amazing systems in your body',
      content: `# Human Body Systems

## Your Body is Amazing!
Your body has systems that work together to keep you alive and healthy.

## Major Body Systems

### Skeletal System
- 206 bones
- Provides structure and support
- Protects organs (skull protects brain!)
- Works with muscles to move

### Muscular System
- Over 600 muscles
- Allows movement
- Three types: skeletal, smooth, cardiac

### Circulatory System
- Heart pumps blood
- Blood vessels carry blood
- Delivers oxygen and nutrients
- Removes waste

### Respiratory System
- Lungs breathe in oxygen
- Breathe out carbon dioxide
- Works with circulatory system

### Digestive System
- Breaks down food
- Absorbs nutrients
- Removes waste

### Nervous System
- Brain is the control center
- Nerves send messages
- Controls everything you do and feel`,
      objectives: ['Name major body systems', 'Describe function of each', 'Understand systems work together']
    },
    practice: {
      title: 'Body Systems Practice',
      description: 'Practice with body systems',
      content: `# Body Systems Practice

## Match System to Function
1. Skeletal: ___
2. Muscular: ___
3. Circulatory: ___
4. Respiratory: ___
5. Digestive: ___
6. Nervous: ___

A. Breaks down food
B. Provides support
C. Pumps blood
D. Breathing
E. Controls body
F. Allows movement

## Which System?
1. You run across the playground: ___
2. You digest your lunch: ___
3. Your heart beats faster: ___
4. You feel pain when stubbing toe: ___

## True or False
1. The brain is part of the nervous system: ___
2. The heart is a muscle: ___
3. Adults have more bones than babies: ___
4. Lungs are part of the digestive system: ___

## Systems Working Together
Running requires which systems? (List 3+)

## Answers
Match: B, F, C, D, A, E
Which: Muscular/Skeletal, Digestive, Circulatory, Nervous
T/F: T, T, F (babies have more, they fuse), F
Running: Muscular, Skeletal, Respiratory, Circulatory, Nervous`,
      objectives: ['Match systems to functions', 'Identify which system is used', 'Recognize system interactions']
    },
    mastery: {
      title: 'Body Systems Expert',
      description: 'Master body systems knowledge',
      content: `# Body Systems Expert

## How Systems Connect
**Eating and Running:**
1. Digestive: Breaks down food for energy
2. Circulatory: Delivers nutrients to muscles
3. Respiratory: Provides oxygen for energy
4. Muscular/Skeletal: Moves your body
5. Nervous: Coordinates everything!

## System Deep Dive
**Circulatory System Path:**
Heart → Arteries → Capillaries → Veins → Heart
(Blood picks up O₂ in lungs, drops off CO₂)

## Keeping Systems Healthy
- **Skeletal:** Calcium, exercise
- **Muscular:** Protein, exercise
- **Circulatory:** Low fat, cardio exercise
- **Respiratory:** No smoking, cardio
- **Digestive:** Fiber, water
- **Nervous:** Sleep, no drugs

## Challenge Scenario
You eat an apple. Trace its journey and all systems involved.

## Critical Thinking
1. What happens if one system fails?
2. Why do doctors check many systems?
3. How does exercise help multiple systems?

## Answers
Apple journey: Digestive breaks it down → Circulatory delivers nutrients → All cells use energy
Systems are interconnected - one failure affects others`,
      objectives: ['Trace pathways through systems', 'Understand system dependencies', 'Apply knowledge to health choices']
    }
  },

  // ==========================================
  // GRADE 5 SCIENCE
  // ==========================================
  'matter-properties': {
    intro: {
      title: 'Properties of Matter',
      description: 'Learn about matter and its properties',
      content: `# Properties of Matter

## What is Matter?
**Matter** is anything that has mass and takes up space.
Everything you can touch is matter!

## Physical Properties
Properties you can observe without changing the substance:
- **Color, shape, size**
- **Texture** (smooth, rough)
- **Mass** (amount of matter)
- **Volume** (space it takes up)
- **Density** (mass ÷ volume)
- **State** (solid, liquid, gas)
- **Melting/boiling point**

## Chemical Properties
How a substance reacts with other substances:
- **Flammability** (can it burn?)
- **Reactivity** (does it react with other chemicals?)
- **Oxidation** (does it rust?)

## Physical vs Chemical Changes
**Physical change:** Appearance changes, same substance
- Cutting paper, melting ice, dissolving sugar

**Chemical change:** New substance forms
- Burning wood, rusting iron, baking a cake
- Signs: color change, gas, heat, new smell`,
      objectives: ['Define matter and its properties', 'Distinguish physical and chemical properties', 'Identify types of changes']
    },
    practice: {
      title: 'Properties of Matter Practice',
      description: 'Practice with matter properties',
      content: `# Matter Properties Practice

## Physical or Chemical Property?
1. Water boils at 100°C: ___
2. Iron can rust: ___
3. Gold is shiny: ___
4. Paper can burn: ___
5. Ice is cold: ___

## Physical or Chemical Change?
1. Cutting wood: ___
2. Burning wood: ___
3. Dissolving salt in water: ___
4. Baking a cake: ___
5. Breaking glass: ___

## Identify the Sign
What sign shows chemical change occurred?
1. Fireworks exploding: ___
2. Bread turning to toast: ___
3. Milk going sour: ___

## Density
Density = Mass ÷ Volume
Object A: Mass 20g, Volume 10mL
Density = ___

Will it float in water (density 1 g/mL)?

## Answers
Property: Physical, Chemical, Physical, Chemical, Physical
Change: Physical, Chemical, Physical, Chemical, Physical
Signs: Light/heat, Color change, New smell
Density: 2 g/mL, No (sinks - denser than water)`,
      objectives: ['Classify properties', 'Identify change types', 'Calculate density']
    },
    mastery: {
      title: 'Matter Properties Expert',
      description: 'Master matter concepts',
      content: `# Matter Properties Expert

## States of Matter
**Solid:** Fixed shape, fixed volume
**Liquid:** Takes container shape, fixed volume
**Gas:** Fills container, can be compressed

**Plasma:** Superheated gas (stars, lightning)

## Particle Model
- Solids: Particles packed tight, vibrate in place
- Liquids: Particles close but can slide past
- Gases: Particles far apart, move freely

## Phase Changes
- Melting: Solid → Liquid
- Freezing: Liquid → Solid
- Evaporation: Liquid → Gas
- Condensation: Gas → Liquid
- Sublimation: Solid → Gas (dry ice!)

## Conservation of Mass
In physical AND chemical changes:
Mass before = Mass after

## Mixture vs Compound
**Mixture:** Combined but not chemically bonded
- Trail mix, salt water
- Can be separated physically

**Compound:** Chemically bonded
- Water (H₂O), salt (NaCl)
- Can only be separated chemically

## Challenge
Design an experiment to determine if dissolving is physical or chemical change.`,
      objectives: ['Understand particle model', 'Identify phase changes', 'Distinguish mixtures and compounds']
    }
  },

  'solar-system': {
    intro: {
      title: 'The Solar System',
      description: 'Explore our cosmic neighborhood',
      content: `# The Solar System

## What is the Solar System?
Our **solar system** includes the Sun and everything that orbits it.

## The Sun
- A star (ball of hot gas)
- Center of our solar system
- Provides light and heat
- 99.8% of solar system's mass!

## The Planets (in order)
**My Very Educated Mother Just Served Us Nachos**

1. **Mercury** - Smallest, closest to Sun
2. **Venus** - Hottest, rotates backward
3. **Earth** - Our home! Has liquid water
4. **Mars** - Red planet, has seasons
5. **Jupiter** - Largest, Great Red Spot
6. **Saturn** - Beautiful rings
7. **Uranus** - Tilted on its side
8. **Neptune** - Windiest planet

## Terrestrial vs Gas Giants
**Terrestrial (Rocky):** Mercury, Venus, Earth, Mars
**Gas Giants:** Jupiter, Saturn, Uranus, Neptune

## Other Objects
- **Moons:** Orbit planets
- **Asteroids:** Rocky objects (asteroid belt)
- **Comets:** Ice and dust, have tails
- **Dwarf planets:** Pluto, Ceres`,
      objectives: ['Name planets in order', 'Describe the Sun', 'Classify planets by type']
    },
    practice: {
      title: 'Solar System Practice',
      description: 'Practice solar system knowledge',
      content: `# Solar System Practice

## Planet Order
Fill in the blanks:
Mercury, ___, Earth, ___, Jupiter, ___, Uranus, ___

## Which Planet?
1. Has beautiful rings: ___
2. Is the Red Planet: ___
3. Is closest to the Sun: ___
4. Is the largest: ___
5. Is the hottest: ___
6. Has the Great Red Spot: ___

## Terrestrial or Gas Giant?
1. Earth: ___
2. Saturn: ___
3. Mars: ___
4. Neptune: ___

## True or False
1. The Sun is a planet: ___
2. Earth is the only planet with a moon: ___
3. Jupiter is bigger than Earth: ___
4. Pluto is a planet: ___

## Compare
Earth vs Mars:
Size: Earth is ___
Moons: Earth has ___, Mars has ___
Atmosphere: Earth has ___, Mars has thin ___

## Answers
Order: Venus, Mars, Saturn, Neptune
Which: Saturn, Mars, Mercury, Jupiter, Venus, Jupiter
Type: T, G, T, G
T/F: F, F, T, F (dwarf planet)`,
      objectives: ['Order planets correctly', 'Match facts to planets', 'Compare planetary features']
    },
    mastery: {
      title: 'Solar System Expert',
      description: 'Master solar system concepts',
      content: `# Solar System Expert

## Scale and Distance
If Sun were a basketball:
- Earth would be a peppercorn
- 26 meters away!

Light takes 8 minutes to reach Earth from Sun.

## Orbits and Rotation
**Revolution:** One trip around the Sun (Earth's year)
**Rotation:** One spin on axis (Earth's day)

| Planet | Day Length | Year Length |
|--------|------------|-------------|
| Mercury | 59 Earth days | 88 days |
| Earth | 24 hours | 365 days |
| Jupiter | 10 hours | 12 years |

## Gravity
- More mass = more gravity
- You weigh more on Jupiter!
- You weigh less on the Moon

## Why Planets Orbit
- Sun's gravity pulls planets in
- Planet's motion keeps it from falling into Sun
- Balance = orbit!

## Space Exploration
- Mars rovers (Curiosity, Perseverance)
- Voyager spacecraft (left solar system!)
- James Webb Space Telescope

## Research Question
Could humans live on Mars? What challenges?`,
      objectives: ['Understand scale of solar system', 'Explain orbit mechanics', 'Discuss space exploration']
    }
  },

  'ecosystems-advanced': {
    intro: {
      title: 'Ecosystems',
      description: 'Learn about ecosystem interactions',
      content: `# Ecosystems

## What is an Ecosystem?
An **ecosystem** includes all living and nonliving things in an area interacting together.

## Biotic vs Abiotic Factors
**Biotic (Living):**
- Plants, animals, fungi, bacteria
- Anything alive or once alive

**Abiotic (Nonliving):**
- Water, sunlight, temperature
- Soil, air, rocks

## Ecosystem Types

### Terrestrial (Land)
- Forest, desert, grassland, tundra

### Aquatic (Water)
- Freshwater: lakes, rivers, ponds
- Saltwater: oceans, coral reefs

## Ecological Roles
**Producers:** Make food (plants)
**Consumers:** Eat other organisms
**Decomposers:** Break down dead matter

## Interactions
- **Competition:** Same resources
- **Predation:** Predator eats prey
- **Symbiosis:** Close relationship
  - Mutualism: Both benefit
  - Parasitism: One benefits, one harmed
  - Commensalism: One benefits, other unaffected`,
      objectives: ['Define ecosystem', 'Distinguish biotic and abiotic', 'Identify ecological relationships']
    },
    practice: {
      title: 'Ecosystems Practice',
      description: 'Practice with ecosystem concepts',
      content: `# Ecosystems Practice

## Biotic or Abiotic?
1. Tree: ___
2. Sunlight: ___
3. Mushroom: ___
4. Temperature: ___
5. Dead leaves: ___
6. River water: ___

## Ecosystem Type
1. Sahara: ___
2. Amazon: ___
3. Coral reef: ___
4. Your backyard: ___

## Identify the Interaction
1. Bee pollinates flower, gets nectar: ___
2. Lion hunts zebra: ___
3. Tick feeds on dog: ___
4. Barnacles on whale (whale unaffected): ___
5. Two birds want same nesting spot: ___

## Food Web Analysis
In a pond ecosystem:
Producers: ___
Primary consumers: ___
Secondary consumers: ___

## Answers
B/A: B, A, B, A, B (was alive), A
Type: Desert, Rainforest, Marine, Terrestrial
Interactions: Mutualism, Predation, Parasitism, Commensalism, Competition`,
      objectives: ['Classify biotic and abiotic', 'Identify ecosystem types', 'Recognize ecological interactions']
    },
    mastery: {
      title: 'Ecosystems Expert',
      description: 'Master ecosystem concepts',
      content: `# Ecosystems Expert

## Energy Flow
Sun → Producers → Consumers → Decomposers
Only 10% energy transfers each level!

## Nutrient Cycles
Matter recycles through ecosystems:
- **Carbon cycle:** CO₂ ↔ Living things
- **Water cycle:** Evaporation → Condensation → Precipitation
- **Nitrogen cycle:** Air ↔ Soil ↔ Plants ↔ Animals

## Succession
How ecosystems change over time:

**Primary succession:** Starting from bare rock
Rock → Lichens → Moss → Grass → Shrubs → Trees

**Secondary succession:** After disturbance (fire)
Faster because soil exists!

## Human Impact
**Negative:**
- Pollution, deforestation, overfishing
- Habitat destruction, invasive species

**Positive:**
- Conservation, restoration
- Protected areas, sustainable practices

## Biodiversity
Variety of life in an ecosystem.
More biodiversity = healthier ecosystem

## Design Challenge
Create a balanced ecosystem for a fish tank.
What do you need? Why?

## Answer
Fish tank needs: Producers (plants), consumers (fish, snails), decomposers (bacteria), proper abiotic factors (light, temperature, clean water)`,
      objectives: ['Trace energy and nutrient cycles', 'Understand succession', 'Evaluate human impact']
    }
  }
};

export default scienceGrades35Content;

// Physics Lesson Content
// Comprehensive educational content for Physics (grades 11-12)

import { LessonContent } from '../lessonContentTypes';

export const physicsContent: Record<string, LessonContent> = {
  'motion-1d': {
    intro: {
      title: 'Motion in One Dimension',
      description: 'Learn about displacement, velocity, and acceleration',
      content: `# Motion in One Dimension

## Position and Displacement
- **Position (x):** Where an object is located
- **Displacement (Δx):** Change in position (x₂ - x₁)
- Displacement can be positive or negative!

## Speed vs Velocity
- **Speed:** How fast (magnitude only)
- **Velocity:** Speed + direction (vector)

$$v = \\frac{\\Delta x}{\\Delta t}$$

## Acceleration
Rate of change of velocity.
$$a = \\frac{\\Delta v}{\\Delta t}$$

## Kinematic Equations
| Equation | Missing Variable |
|----------|-----------------|
| v = v₀ + at | Δx |
| Δx = v₀t + ½at² | v |
| v² = v₀² + 2aΔx | t |
| Δx = ½(v₀ + v)t | a |

## Free Fall
Objects accelerate at g = 9.8 m/s² downward.
Air resistance ignored.`,
      objectives: ['Define motion quantities', 'Apply kinematic equations', 'Solve free fall problems']
    },
    practice: {
      title: 'Motion Practice',
      description: 'Practice 1D motion problems',
      content: `# Motion Practice

## Calculate Velocity
1. Δx = 100m, t = 20s, v = ___
2. Δx = -50m, t = 10s, v = ___

## Calculate Acceleration
1. v₀ = 0, v = 20 m/s, t = 4s, a = ___
2. v₀ = 30 m/s, v = 0, t = 6s, a = ___

## Kinematic Equations
A car accelerates from rest at 3 m/s² for 5 seconds.
1. Final velocity: ___
2. Distance traveled: ___

## Free Fall
A ball dropped from rest falls for 3 seconds.
1. Final velocity: ___
2. Distance fallen: ___

## Direction
Positive = right/up, Negative = left/down
Describe motion: v₀ = +5 m/s, a = -2 m/s²

## Answers
Velocity: 5 m/s, -5 m/s
Acceleration: 5 m/s², -5 m/s²
Car: 15 m/s, 37.5 m
Free fall: 29.4 m/s, 44.1 m
Direction: Moving right, slowing down`,
      objectives: ['Calculate velocity', 'Find acceleration', 'Solve kinematic problems']
    },
    mastery: {
      title: 'Motion Mastery',
      description: 'Master 1D kinematics',
      content: `# Motion Mastery

## Position-Time Graphs
- Slope = velocity
- Straight line = constant velocity
- Curved = changing velocity

## Velocity-Time Graphs
- Slope = acceleration
- Area under curve = displacement

## Multi-Step Problems
Ball thrown upward at 20 m/s:
1. Time to max height: v = v₀ + at
   0 = 20 + (-10)t → t = 2s
2. Max height: Δx = v₀t + ½at²
   Δx = 20(2) + ½(-10)(4) = 20m

## Practice
Car travels 30 m/s, then brakes at -6 m/s².
1. Time to stop: ___
2. Stopping distance: ___
3. If reaction time is 0.5s, total stopping distance?

## Relative Motion
If car A moves at 60 km/h and car B at 80 km/h (same direction):
Velocity of B relative to A = ___

## Answers
1. t = 5s
2. d = 75m
3. 75 + 15 = 90m
Relative: 20 km/h`,
      objectives: ['Interpret motion graphs', 'Solve multi-step problems', 'Apply relative motion']
    }
  },

  'motion-2d': {
    intro: {
      title: 'Motion in Two Dimensions',
      description: 'Understand projectile motion and vectors',
      content: `# Motion in Two Dimensions

## Vectors
Quantities with magnitude AND direction.
Can be broken into components:
$$v_x = v\\cos\\theta$$
$$v_y = v\\sin\\theta$$

## Vector Addition
$$R = \\sqrt{A_x^2 + A_y^2}$$
$$\\theta = \\tan^{-1}(\\frac{A_y}{A_x})$$

## Projectile Motion
Horizontal and vertical motion are INDEPENDENT!

### Horizontal
- No acceleration: $a_x = 0$
- $x = v_x t$

### Vertical
- Acceleration: $a_y = -g$
- Use kinematic equations

## Key Equations
$$Range = \\frac{v_0^2 \\sin 2\\theta}{g}$$
$$Max\\ Height = \\frac{v_0^2 \\sin^2\\theta}{2g}$$
$$Time\\ of\\ Flight = \\frac{2v_0 \\sin\\theta}{g}$$

Maximum range at θ = 45°`,
      objectives: ['Decompose vectors', 'Solve projectile problems', 'Understand independence of motion']
    },
    practice: {
      title: '2D Motion Practice',
      description: 'Practice with projectiles',
      content: `# 2D Motion Practice

## Vector Components
v = 50 m/s at 30° above horizontal
1. vₓ = ___
2. vᵧ = ___

## Vector Addition
A = 3 m east, B = 4 m north
Resultant magnitude: ___
Direction: ___

## Projectile Problems
Ball kicked at 20 m/s at 45°:
1. Time of flight: ___
2. Maximum height: ___
3. Range: ___

## Horizontal Launch
Ball rolled off a 20m cliff at 10 m/s horizontally:
1. Time to hit ground: ___
2. Horizontal distance: ___

## Answers
Components: 43.3 m/s, 25 m/s
Vector: 5 m at 53° N of E
Projectile: 2.9s, 10.2m, 40.8m
Cliff: 2s, 20m`,
      objectives: ['Find components', 'Add vectors', 'Solve projectile motion']
    },
    mastery: {
      title: '2D Motion Mastery',
      description: 'Master 2D kinematics',
      content: `# 2D Motion Mastery

## Projectile from Height
Combine horizontal launch with vertical fall.
Find time from vertical motion, then find horizontal distance.

## Angled Launch from Height
1. Find time to highest point
2. Find max height above launch
3. Find time to fall from max to ground
4. Total time = up + down

## Relative Velocity in 2D
$$\\vec{v}_{AB} = \\vec{v}_A - \\vec{v}_B$$

## Practice
Football kicked at 25 m/s at 60° from a 1.5m height:
1. Time to max height: ___
2. Max height above ground: ___
3. Total time in air: ___
4. Horizontal distance: ___

## Challenge
A boat crosses a river (100m wide) at 4 m/s. Current flows at 3 m/s.
1. If boat points straight across, where does it land?
2. What angle should it point to land directly across?

## Answers
Football: 2.2s, 24.6m, 4.5s, 56.3m
Boat: 75m downstream, point 37° upstream`,
      objectives: ['Solve complex projectiles', 'Handle relative velocity', 'Apply to real scenarios']
    }
  },

  'newtons-laws': {
    intro: {
      title: "Newton's Laws of Motion",
      description: 'Understand the fundamental laws of mechanics',
      content: `# Newton's Laws of Motion

## First Law (Inertia)
An object at rest stays at rest, and an object in motion stays in motion, unless acted upon by a net force.

**Inertia:** Resistance to change in motion (related to mass)

## Second Law
$$F = ma$$
$$\\Sigma F = ma$$

Force is measured in Newtons (N).
1 N = 1 kg·m/s²

## Third Law
For every action, there is an equal and opposite reaction.
$$F_{AB} = -F_{BA}$$

## Types of Forces
- **Weight:** $W = mg$
- **Normal force:** Perpendicular to surface
- **Friction:** $f = \\mu N$
- **Tension:** Force through rope/string
- **Applied force:** External push/pull

## Free Body Diagrams
Draw all forces acting ON the object.
Sum forces in each direction.`,
      objectives: ['State Newton\'s laws', 'Draw free body diagrams', 'Apply F=ma']
    },
    practice: {
      title: 'Forces Practice',
      description: 'Practice applying Newton\'s laws',
      content: `# Forces Practice

## Weight
Calculate weight (g = 10 m/s²):
1. m = 5 kg, W = ___
2. m = 70 kg, W = ___

## Newton's Second Law
Find acceleration:
1. F = 20 N, m = 4 kg, a = ___
2. F = 100 N, m = 50 kg, a = ___

## Free Body Diagrams
A book on a table:
Forces acting: ___

A falling ball:
Forces acting: ___

## Friction
μ = 0.3, N = 100 N
Friction force = ___

## Third Law Pairs
Name the reaction force:
1. Earth pulls you down: ___
2. You push wall: ___

## Answers
Weight: 50 N, 700 N
Acceleration: 5 m/s², 2 m/s²
Book: Weight down, Normal up
Ball: Weight down (if no air resistance)
Friction: 30 N
Pairs: You pull Earth up, Wall pushes you`,
      objectives: ['Calculate weight', 'Find acceleration', 'Identify force pairs']
    },
    mastery: {
      title: 'Forces Mastery',
      description: 'Master force analysis',
      content: `# Forces Mastery

## Inclined Planes
Weight components:
- Parallel: $W\\sin\\theta$
- Perpendicular: $W\\cos\\theta$

## Connected Objects
Same acceleration for all connected objects.
Sum external forces = (total mass)(acceleration)

## Atwood Machine
Two masses on pulley:
$$a = \\frac{(m_1 - m_2)g}{m_1 + m_2}$$

## Practice
5 kg block on 30° incline (μ = 0.2):
1. Weight parallel to incline: ___
2. Normal force: ___
3. Friction force: ___
4. Acceleration: ___

## Elevator Problems
Person (60 kg) in elevator:
1. At rest: Scale reads ___
2. Accelerating up at 2 m/s²: Scale reads ___
3. In free fall: Scale reads ___

## Answers
Incline: 25N, 43.3N, 8.7N, 3.3 m/s² down
Elevator: 600N, 720N, 0N`,
      objectives: ['Analyze inclined planes', 'Solve connected systems', 'Handle apparent weight']
    }
  },

  'work-energy': {
    intro: {
      title: 'Work and Energy',
      description: 'Understand work, energy, and power',
      content: `# Work and Energy

## Work
$$W = Fd\\cos\\theta$$
- F = force
- d = displacement
- θ = angle between F and d

Work is measured in Joules (J).

## Kinetic Energy
Energy of motion:
$$KE = \\frac{1}{2}mv^2$$

## Potential Energy
**Gravitational:**
$$PE_g = mgh$$

**Elastic:**
$$PE_s = \\frac{1}{2}kx^2$$

## Work-Energy Theorem
$$W_{net} = \\Delta KE = KE_f - KE_i$$

## Conservation of Energy
$$KE_i + PE_i = KE_f + PE_f$$
(In absence of non-conservative forces)

## Power
Rate of doing work:
$$P = \\frac{W}{t} = Fv$$
Measured in Watts (W).`,
      objectives: ['Calculate work', 'Apply energy conservation', 'Find power']
    },
    practice: {
      title: 'Energy Practice',
      description: 'Practice energy problems',
      content: `# Energy Practice

## Work Calculations
1. F = 50 N, d = 10 m, θ = 0°, W = ___
2. F = 100 N, d = 5 m, θ = 60°, W = ___
3. F = 20 N, d = 8 m, θ = 90°, W = ___

## Kinetic Energy
1. m = 2 kg, v = 5 m/s, KE = ___
2. m = 1000 kg, v = 20 m/s, KE = ___

## Potential Energy
1. m = 3 kg, h = 10 m, PE = ___
2. k = 200 N/m, x = 0.5 m, PE = ___

## Conservation
Ball dropped from 20m height. Find speed just before hitting ground.

## Power
1. W = 500 J, t = 10 s, P = ___
2. F = 100 N, v = 5 m/s, P = ___

## Answers
Work: 500 J, 250 J, 0 J
KE: 25 J, 200,000 J
PE: 300 J, 25 J
Conservation: v = 20 m/s
Power: 50 W, 500 W`,
      objectives: ['Calculate work', 'Find energies', 'Apply conservation']
    },
    mastery: {
      title: 'Energy Mastery',
      description: 'Master energy concepts',
      content: `# Energy Mastery

## Non-conservative Forces
Friction does negative work, removing energy.
$$KE_i + PE_i + W_{nc} = KE_f + PE_f$$

## Springs
Hooke's Law: $F = -kx$
Energy stored: $PE = \\frac{1}{2}kx^2$

## Problem Solving Strategy
1. Define system
2. Identify initial and final states
3. Write energy equation
4. Solve for unknown

## Practice
Roller coaster starts at 50m height.
At bottom, track has friction (μ = 0.1) for 20m.
Find final height if it goes up another hill.

## Challenge
Spring (k = 500 N/m) compressed 0.2m launches 0.5 kg ball.
1. Energy stored in spring: ___
2. Initial speed of ball: ___
3. Max height reached: ___

## Answers
Roller coaster: h = 50 - 2 = 48m
Spring: 10J, 6.3 m/s, 2m`,
      objectives: ['Include non-conservative work', 'Solve spring problems', 'Handle complex scenarios']
    }
  },

  'momentum': {
    intro: {
      title: 'Momentum and Collisions',
      description: 'Understand momentum and collision types',
      content: `# Momentum and Collisions

## Momentum
$$p = mv$$
Vector quantity (has direction).
Units: kg·m/s

## Impulse
Change in momentum:
$$J = \\Delta p = F\\Delta t$$

## Conservation of Momentum
In an isolated system:
$$p_i = p_f$$
$$m_1v_1 + m_2v_2 = m_1v_1' + m_2v_2'$$

## Types of Collisions

### Elastic
- Momentum conserved
- Kinetic energy conserved

### Inelastic
- Momentum conserved
- KE NOT conserved

### Perfectly Inelastic
- Objects stick together
- Maximum KE lost
$$m_1v_1 + m_2v_2 = (m_1 + m_2)v_f$$

## Explosions
Reverse of perfectly inelastic.
Total momentum = 0 before and after.`,
      objectives: ['Calculate momentum and impulse', 'Apply conservation', 'Distinguish collision types']
    },
    practice: {
      title: 'Momentum Practice',
      description: 'Practice collision problems',
      content: `# Momentum Practice

## Momentum Calculations
1. m = 5 kg, v = 10 m/s, p = ___
2. m = 2000 kg, v = 25 m/s, p = ___

## Impulse
Ball (0.5 kg) changes velocity from 10 m/s to -10 m/s.
Impulse = ___

If contact time = 0.01 s, average force = ___

## Conservation (1D)
3 kg cart at 4 m/s collides with 2 kg cart at rest.
After: 3 kg moves at 2 m/s.
Find velocity of 2 kg cart: ___

## Perfectly Inelastic
5 kg at 6 m/s collides with 3 kg at rest, stick together.
Final velocity: ___

## Energy Loss
For above collision:
Initial KE: ___
Final KE: ___
Energy lost: ___

## Answers
Momentum: 50 kg·m/s, 50,000 kg·m/s
Impulse: -10 kg·m/s, 1000 N
Conservation: 3 m/s
Inelastic: 3.75 m/s
Energy: 90 J, 56.25 J, 33.75 J`,
      objectives: ['Find momentum', 'Calculate impulse', 'Solve collisions']
    },
    mastery: {
      title: 'Momentum Mastery',
      description: 'Master collision analysis',
      content: `# Momentum Mastery

## 2D Collisions
Conserve momentum in x AND y separately.
$$p_{ix} = p_{fx}$$
$$p_{iy} = p_{fy}$$

## Elastic Collision Formulas
For 1D elastic collision:
$$v_1' = \\frac{(m_1-m_2)v_1 + 2m_2v_2}{m_1+m_2}$$

Special case (m₁ = m₂):
Objects exchange velocities!

## Center of Mass
$$x_{cm} = \\frac{m_1x_1 + m_2x_2}{m_1 + m_2}$$

Momentum of system = total mass × velocity of COM

## Practice
Ball 1 (2 kg, 5 m/s east) collides with Ball 2 (3 kg, 2 m/s north).
After perfectly inelastic collision:
1. Final velocity magnitude: ___
2. Direction: ___

## Ballistic Pendulum
Bullet (0.01 kg) embeds in block (2 kg) hanging on string.
Combined mass rises 0.05m. Find bullet's initial speed.

## Answers
2D collision: 2.3 m/s, 31° N of E
Ballistic: 200 m/s`,
      objectives: ['Handle 2D collisions', 'Apply elastic formulas', 'Solve ballistic pendulum']
    }
  },

  'circular-motion': {
    intro: {
      title: 'Circular Motion',
      description: 'Understand motion in circles',
      content: `# Circular Motion

## Uniform Circular Motion
Constant speed, changing direction.

## Centripetal Acceleration
Always points toward center.
$$a_c = \\frac{v^2}{r} = \\omega^2 r$$

## Centripetal Force
$$F_c = \\frac{mv^2}{r} = m\\omega^2 r$$

Not a new force - it's the NET force toward center!

## Period and Frequency
- **Period (T):** Time for one revolution
- **Frequency (f):** Revolutions per second
$$f = \\frac{1}{T}$$

## Angular Quantities
- Angular velocity: $\\omega = \\frac{2\\pi}{T}$
- Linear velocity: $v = \\omega r$

## Examples
- Ball on string: Tension provides $F_c$
- Car on curve: Friction provides $F_c$
- Satellite: Gravity provides $F_c$`,
      objectives: ['Calculate centripetal quantities', 'Identify centripetal force sources', 'Relate linear and angular']
    },
    practice: {
      title: 'Circular Motion Practice',
      description: 'Practice circular motion',
      content: `# Circular Motion Practice

## Centripetal Acceleration
1. v = 10 m/s, r = 5 m, ac = ___
2. v = 20 m/s, r = 100 m, ac = ___

## Centripetal Force
Car (1000 kg) turns at 20 m/s on curve (r = 80m).
Fc = ___

## Period and Frequency
Earth orbits Sun in 365 days.
1. Period in seconds: ___
2. Frequency: ___

## Ball on String
0.5 kg ball swung in horizontal circle (r = 1m).
If string can withstand 20N, max speed = ___

## Car on Banked Curve
Why are curves banked?
Which force provides centripetal force without banking?

## Answers
Acceleration: 20 m/s², 4 m/s²
Car: 5000 N
Earth: 3.15×10⁷ s, 3.17×10⁻⁸ Hz
Ball: 6.3 m/s
Banking: Normal force component; Friction`,
      objectives: ['Find centripetal acceleration', 'Calculate centripetal force', 'Solve practical problems']
    },
    mastery: {
      title: 'Circular Motion Mastery',
      description: 'Master circular motion',
      content: `# Circular Motion Mastery

## Vertical Circles
At top: $F_c = F_g + F_N$
At bottom: $F_c = F_N - F_g$

Minimum speed at top (N = 0):
$$v_{min} = \\sqrt{gr}$$

## Banked Curves
Without friction:
$$\\tan\\theta = \\frac{v^2}{rg}$$

With friction:
Normal force + friction combine for $F_c$

## Satellite Motion
$$v = \\sqrt{\\frac{GM}{r}}$$
$$T = 2\\pi\\sqrt{\\frac{r^3}{GM}}$$

## Practice
Roller coaster loop (r = 10m):
1. Minimum speed at top: ___
2. Normal force at bottom if v = 20 m/s, m = 50 kg: ___

## Challenge
Design a curve: v = 25 m/s, r = 60m
What banking angle eliminates need for friction?

## Answers
Loop: 10 m/s, 2500 N
Banking: tan⁻¹(25²/60×10) = 46°`,
      objectives: ['Analyze vertical circles', 'Design banked curves', 'Apply to satellites']
    }
  },

  'gravitation': {
    intro: {
      title: 'Gravitation',
      description: 'Understand universal gravitation',
      content: `# Gravitation

## Newton's Law of Universal Gravitation
$$F = G\\frac{m_1 m_2}{r^2}$$

G = 6.67 × 10⁻¹¹ N·m²/kg²

## Weight and g
$$g = \\frac{GM}{r^2}$$

At Earth's surface: g ≈ 9.8 m/s²

## Gravitational Field
$$\\vec{g} = \\frac{\\vec{F}}{m} = \\frac{GM}{r^2}$$
Points toward mass.

## Orbital Motion
Gravity provides centripetal force.
$$\\frac{mv^2}{r} = \\frac{GMm}{r^2}$$

## Kepler's Laws
1. **Elliptical orbits** (Sun at one focus)
2. **Equal areas** in equal times
3. $$T^2 \\propto r^3$$ or $$\\frac{T^2}{r^3} = constant$$

## Gravitational PE
$$PE = -\\frac{GMm}{r}$$
Negative because bound!`,
      objectives: ['Apply gravitational law', 'Calculate orbital quantities', 'Use Kepler\'s laws']
    },
    practice: {
      title: 'Gravitation Practice',
      description: 'Practice gravitation problems',
      content: `# Gravitation Practice

## Gravitational Force
Earth mass: 6×10²⁴ kg, Moon mass: 7×10²² kg
Distance: 4×10⁸ m
Force = ___

## Surface Gravity
Planet mass = 2 × Earth mass
Planet radius = 2 × Earth radius
Surface gravity = ___ × Earth's g

## Orbital Velocity
Satellite at height h above Earth (radius R).
Orbital radius = R + h
v = ___

## Kepler's Third Law
Planet A: T = 1 year, r = 1 AU
Planet B: r = 4 AU, T = ___

## Escape Velocity
$$v_{escape} = \\sqrt{\\frac{2GM}{r}}$$
For Earth: ___

## Answers
Force: 1.75×10²⁰ N
Gravity: 0.5g
Orbital: √(GM/(R+h))
Kepler: 8 years
Escape: 11.2 km/s`,
      objectives: ['Calculate gravitational force', 'Find surface gravity', 'Apply Kepler\'s laws']
    },
    mastery: {
      title: 'Gravitation Mastery',
      description: 'Master gravitational physics',
      content: `# Gravitation Mastery

## Satellite Orbits

### Geosynchronous
T = 24 hours (stays above same point)
r ≈ 42,000 km from Earth center

### Low Earth Orbit
r ≈ 6,600 km, T ≈ 90 minutes

## Energy in Orbits
Total energy: $E = -\\frac{GMm}{2r}$

More negative = more tightly bound

## Escape Velocity
$$v_e = \\sqrt{\\frac{2GM}{r}} = \\sqrt{2}v_{orbital}$$

## Practice
1. Find orbital period at 2 Earth radii from center.
2. Energy needed to move satellite from r to 2r.
3. Black hole: What radius gives escape velocity = c?

## Gravitational Slingshot
Spacecraft uses planet's gravity to accelerate.
Planet's reference frame vs Sun's reference frame.

## Answers
1. T = √8 × 84 min ≈ 4 hours
2. ΔE = GMm/4r (loses half binding energy)
3. Schwarzschild radius: r = 2GM/c²`,
      objectives: ['Analyze satellite orbits', 'Calculate orbital energy', 'Understand advanced concepts']
    }
  },

  'waves': {
    intro: {
      title: 'Waves and Sound',
      description: 'Understand wave behavior and sound',
      content: `# Waves and Sound

## Wave Types
- **Mechanical:** Need medium (sound, water)
- **Electromagnetic:** No medium needed (light)

- **Transverse:** Oscillation ⊥ to direction (light)
- **Longitudinal:** Oscillation ∥ to direction (sound)

## Wave Properties
- **Amplitude (A):** Maximum displacement
- **Wavelength (λ):** Length of one cycle
- **Frequency (f):** Cycles per second (Hz)
- **Period (T):** Time for one cycle

## Wave Equation
$$v = f\\lambda$$

## Sound
Longitudinal wave through medium.
Speed in air ≈ 343 m/s

## Sound Properties
- **Pitch:** Frequency (high f = high pitch)
- **Loudness:** Amplitude
- **Timbre:** Wave shape (harmonics)

## Doppler Effect
Moving source/observer changes observed frequency.`,
      objectives: ['Classify waves', 'Calculate wave properties', 'Understand sound characteristics']
    },
    practice: {
      title: 'Waves Practice',
      description: 'Practice wave concepts',
      content: `# Waves Practice

## Wave Equation
1. f = 500 Hz, λ = 0.68 m, v = ___
2. v = 340 m/s, f = 440 Hz, λ = ___

## Period and Frequency
1. T = 0.02 s, f = ___
2. f = 1000 Hz, T = ___

## Wave Types
Classify:
1. Sound: Transverse / Longitudinal
2. Light: Transverse / Longitudinal
3. Wave on string: Transverse / Longitudinal

## Sound Speed
Sound travels 1km in ___s (v = 340 m/s)
Lightning seen, thunder 3s later. Distance = ___

## Doppler
Ambulance approaches at 30 m/s, siren at 500 Hz.
Frequency heard (higher/lower)?

## Answers
Wave equation: 340 m/s, 0.77 m
Period: 50 Hz, 0.001 s
Types: Long, Trans, Trans
Sound: 2.94 s, 1020 m
Doppler: Higher`,
      objectives: ['Apply wave equation', 'Convert period/frequency', 'Predict Doppler shifts']
    },
    mastery: {
      title: 'Waves Mastery',
      description: 'Master wave physics',
      content: `# Waves Mastery

## Superposition
Waves add algebraically.
- Constructive: Same phase, amplitudes add
- Destructive: Opposite phase, amplitudes subtract

## Standing Waves
$$f_n = \\frac{nv}{2L}$$ (both ends fixed)

Harmonics: n = 1, 2, 3, ...

## Beats
Two slightly different frequencies:
$$f_{beat} = |f_1 - f_2|$$

## Doppler Equation
$$f' = f\\frac{v \\pm v_o}{v \\mp v_s}$$
Upper signs: approaching
Lower signs: receding

## Practice
1. Standing wave: L = 2m, v = 400 m/s. First three frequencies?
2. Two tuning forks: 440 Hz and 444 Hz. Beat frequency?
3. Source moves toward you at 40 m/s, f = 600 Hz. f' = ?

## Resonance
System oscillates at natural frequency when driven at that frequency.

## Answers
1. 100, 200, 300 Hz
2. 4 Hz
3. f' = 600 × 340/(340-40) = 680 Hz`,
      objectives: ['Analyze interference', 'Calculate standing waves', 'Apply Doppler equation']
    }
  },

  'electricity': {
    intro: {
      title: 'Electricity and Circuits',
      description: 'Understand electric charge and circuits',
      content: `# Electricity and Circuits

## Electric Charge
- Positive and negative
- Like charges repel, opposites attract
- Unit: Coulomb (C)
- Electron charge: e = 1.6 × 10⁻¹⁹ C

## Coulomb's Law
$$F = k\\frac{q_1 q_2}{r^2}$$
k = 9 × 10⁹ N·m²/C²

## Electric Field
$$E = \\frac{F}{q} = k\\frac{Q}{r^2}$$

## Current, Voltage, Resistance
- **Current (I):** Charge flow rate (Amperes)
- **Voltage (V):** Electric potential difference (Volts)
- **Resistance (R):** Opposition to flow (Ohms)

## Ohm's Law
$$V = IR$$

## Power
$$P = IV = I^2R = \\frac{V^2}{R}$$

## Series and Parallel
**Series:** Same current, voltages add
**Parallel:** Same voltage, currents add`,
      objectives: ['Apply Coulomb\'s law', 'Use Ohm\'s law', 'Analyze circuits']
    },
    practice: {
      title: 'Circuits Practice',
      description: 'Practice circuit analysis',
      content: `# Circuits Practice

## Coulomb's Law
q₁ = 2μC, q₂ = 3μC, r = 0.1m
Force = ___

## Ohm's Law
1. V = 12V, R = 4Ω, I = ___
2. I = 2A, R = 6Ω, V = ___
3. V = 9V, I = 0.5A, R = ___

## Series Circuit
R₁ = 4Ω, R₂ = 6Ω in series with 20V.
1. Total R = ___
2. Current = ___
3. V across R₁ = ___

## Parallel Circuit
R₁ = 4Ω, R₂ = 12Ω in parallel with 12V.
1. Total R = ___
2. Total I = ___
3. I through R₁ = ___

## Power
100W bulb at 120V:
Current = ___
Resistance = ___

## Answers
Coulomb: 5.4 N
Ohm's: 3A, 12V, 18Ω
Series: 10Ω, 2A, 8V
Parallel: 3Ω, 4A, 3A
Power: 0.83A, 144Ω`,
      objectives: ['Calculate electric force', 'Apply Ohm\'s law', 'Solve circuit problems']
    },
    mastery: {
      title: 'Circuits Mastery',
      description: 'Master circuit analysis',
      content: `# Circuits Mastery

## Kirchhoff's Laws

### Junction Rule
Currents in = Currents out

### Loop Rule
Sum of voltages around loop = 0

## Capacitors
$$C = \\frac{Q}{V}$$
Energy: $U = \\frac{1}{2}CV^2$

Series: $\\frac{1}{C_T} = \\frac{1}{C_1} + \\frac{1}{C_2}$
Parallel: $C_T = C_1 + C_2$

## RC Circuits
Time constant: τ = RC
Charging: $Q(t) = Q_{max}(1-e^{-t/τ})$

## Practice
Complex circuit with 3 resistors:
R₁ = 2Ω, R₂ = 4Ω in parallel, then in series with R₃ = 5Ω. V = 21V.
1. Total resistance: ___
2. Current from battery: ___
3. Voltage across parallel section: ___

## Challenge
Two capacitors (4μF, 6μF) charged to 12V, then connected.
Final voltage = ___

## Answers
1. 6.33Ω
2. 3.32A
3. 4.4V
Capacitors: 7.2V`,
      objectives: ['Apply Kirchhoff\'s laws', 'Analyze capacitor circuits', 'Solve complex circuits']
    }
  },

  'magnetism': {
    intro: {
      title: 'Magnetism',
      description: 'Understand magnetic fields and forces',
      content: `# Magnetism

## Magnetic Fields
- Created by moving charges or magnets
- Field lines: North to South (outside magnet)
- Unit: Tesla (T)

## Magnetic Force on Moving Charge
$$F = qvB\\sin\\theta$$
Direction: Right-hand rule

## Magnetic Force on Current
$$F = BIL\\sin\\theta$$
L = length of wire

## Right-Hand Rules
1. **Force on charge:** Fingers = v, curl to B, thumb = F
2. **Field around wire:** Thumb = I, fingers curl = B

## Sources of Magnetic Fields
**Long wire:**
$$B = \\frac{\\mu_0 I}{2\\pi r}$$

**Solenoid:**
$$B = \\mu_0 nI$$
n = turns per length

μ₀ = 4π × 10⁻⁷ T·m/A

## Electromagnetic Induction
Changing magnetic flux induces EMF.
$$\\varepsilon = -N\\frac{d\\Phi}{dt}$$`,
      objectives: ['Calculate magnetic forces', 'Apply right-hand rules', 'Understand induction']
    },
    practice: {
      title: 'Magnetism Practice',
      description: 'Practice magnetic concepts',
      content: `# Magnetism Practice

## Force on Charge
Proton (q = 1.6×10⁻¹⁹ C) moves at 10⁶ m/s perpendicular to B = 0.5 T.
Force = ___

## Force on Wire
Wire (L = 0.2m, I = 5A) perpendicular to B = 0.3T.
Force = ___

## Direction
Positive charge moves right in upward B field.
Force direction = ___

## Field from Wire
I = 10A, r = 0.05m from wire.
B = ___

## Solenoid
500 turns, length 0.25m, I = 2A.
B inside = ___

## Induction
Magnetic flux changes from 0.1 Wb to 0 in 0.01s through 100-turn coil.
Induced EMF = ___

## Answers
Charge: 8×10⁻¹⁴ N
Wire: 0.3 N
Direction: Out of page
Wire field: 4×10⁻⁵ T
Solenoid: 5×10⁻³ T
EMF: 1000 V`,
      objectives: ['Calculate magnetic forces', 'Find magnetic fields', 'Apply Faraday\'s law']
    },
    mastery: {
      title: 'Magnetism Mastery',
      description: 'Master electromagnetic concepts',
      content: `# Magnetism Mastery

## Charged Particle in B Field
Circular path: $r = \\frac{mv}{qB}$
Period: $T = \\frac{2\\pi m}{qB}$ (independent of v!)

## Mass Spectrometer
Separates ions by mass using magnetic deflection.

## Motors and Generators
**Motor:** Current in B field → rotation
**Generator:** Rotation in B field → current

## Transformers
$$\\frac{V_s}{V_p} = \\frac{N_s}{N_p}$$
Step-up: Ns > Np (increases voltage)

## Lenz's Law
Induced current opposes the change that caused it.

## Practice
1. Electron (m = 9.1×10⁻³¹ kg) at 2×10⁶ m/s in B = 0.01T. Radius of path?
2. Transformer: 120V primary, 1000 turns. For 12V secondary, turns needed?
3. Bar magnet pushed into coil. Induced current direction (CW/CCW) to oppose?

## Answers
1. r = 1.1 mm
2. 100 turns
3. Creates opposing field, so CW (if magnet's N enters)`,
      objectives: ['Analyze particle motion', 'Apply transformer equations', 'Use Lenz\'s law']
    }
  }
};

export default physicsContent;

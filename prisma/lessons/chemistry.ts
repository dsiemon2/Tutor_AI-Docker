// Chemistry Lesson Content
// Comprehensive educational content for Chemistry (grades 10-11)

import { LessonContent } from '../lessonContentTypes';

export const chemistryContent: Record<string, LessonContent> = {
  'atomic-structure': {
    intro: {
      title: 'Atomic Structure',
      description: 'Explore the building blocks of matter',
      content: `# Atomic Structure

## The Atom
The smallest unit of an element that retains its properties.

## Subatomic Particles
| Particle | Charge | Location | Mass |
|----------|--------|----------|------|
| Proton | +1 | Nucleus | 1 amu |
| Neutron | 0 | Nucleus | 1 amu |
| Electron | -1 | Orbitals | ~0 amu |

## Atomic Number & Mass
- **Atomic Number (Z):** Number of protons (defines element)
- **Mass Number (A):** Protons + Neutrons
- **Isotopes:** Same protons, different neutrons

## Notation
$$^{A}_{Z}X$$ Example: $$^{12}_{6}C$$

## Electron Configuration
Electrons fill orbitals in order:
1s² 2s² 2p⁶ 3s² 3p⁶ 4s² 3d¹⁰ 4p⁶...

**Aufbau Principle:** Fill lowest energy first
**Pauli Exclusion:** Max 2 electrons per orbital
**Hund's Rule:** One electron per orbital before pairing`,
      objectives: ['Identify subatomic particles', 'Write isotope notation', 'Determine electron configurations']
    },
    practice: {
      title: 'Atomic Structure Practice',
      description: 'Practice atomic concepts',
      content: `# Atomic Structure Practice

## Subatomic Particles
Carbon-12 (Z=6):
1. Protons: ___
2. Neutrons: ___
3. Electrons: ___

## Isotope Notation
Write notation for:
1. Oxygen with 8 protons, 8 neutrons: ___
2. Uranium-235 (Z=92): ___

## Electron Configuration
Write configurations for:
1. Hydrogen (Z=1): ___
2. Carbon (Z=6): ___
3. Chlorine (Z=17): ___

## Identify Element
1. 1s² 2s² 2p⁶ 3s² 3p³: ___
2. 1s² 2s² 2p⁶: ___

## Valence Electrons
How many valence electrons?
1. Oxygen: ___
2. Sodium: ___

## Answers
C-12: 6, 6, 6
Notation: ¹⁶₈O, ²³⁵₉₂U
Config: 1s¹, 1s²2s²2p², 1s²2s²2p⁶3s²3p⁵
Elements: Phosphorus (P), Neon (Ne)
Valence: 6, 1`,
      objectives: ['Calculate particles', 'Write notation', 'Determine configurations']
    },
    mastery: {
      title: 'Atomic Structure Mastery',
      description: 'Master atomic concepts',
      content: `# Atomic Structure Mastery

## Quantum Numbers
- **n:** Principal (energy level)
- **l:** Angular momentum (orbital shape)
- **mₗ:** Magnetic (orbital orientation)
- **mₛ:** Spin (+½ or -½)

## Orbital Shapes
- s: Spherical (1 orbital)
- p: Dumbbell (3 orbitals)
- d: Cloverleaf (5 orbitals)
- f: Complex (7 orbitals)

## Exceptions
Chromium: [Ar] 4s¹3d⁵ (not 4s²3d⁴)
Copper: [Ar] 4s¹3d¹⁰ (not 4s²3d⁹)

## Ions
Na → Na⁺ + e⁻ (loses 1 electron)
Cl + e⁻ → Cl⁻ (gains 1 electron)

## Practice
1. Quantum numbers for 3p electron: ___
2. Why is [Ar]3d⁵4s¹ more stable than [Ar]3d⁴4s²?
3. Write ion configuration for Ca²⁺.

## Answers
1. n=3, l=1, mₗ=-1,0,+1, mₛ=±½
2. Half-filled d orbitals are stable
3. 1s²2s²2p⁶3s²3p⁶ (like Ar)`,
      objectives: ['Apply quantum numbers', 'Explain stability exceptions', 'Write ion configurations']
    }
  },

  'periodic-table': {
    intro: {
      title: 'The Periodic Table',
      description: 'Organize elements by their properties',
      content: `# The Periodic Table

## Organization
- **Periods:** Horizontal rows (7 total)
- **Groups:** Vertical columns (18 total)

## Important Groups
| Group | Name | Properties |
|-------|------|------------|
| 1 | Alkali metals | Very reactive, +1 ions |
| 2 | Alkaline earth | Reactive, +2 ions |
| 17 | Halogens | Very reactive nonmetals |
| 18 | Noble gases | Unreactive, full shells |

## Metals, Nonmetals, Metalloids
- **Metals:** Left side, conductors, malleable
- **Nonmetals:** Right side, insulators, brittle
- **Metalloids:** Along staircase, mixed properties

## Periodic Trends

### Atomic Radius
- Decreases across period (more protons pull electrons)
- Increases down group (more shells)

### Ionization Energy
Energy to remove an electron.
- Increases across period
- Decreases down group

### Electronegativity
Ability to attract electrons.
- Increases across period
- Decreases down group`,
      objectives: ['Navigate periodic table', 'Identify element groups', 'Predict using trends']
    },
    practice: {
      title: 'Periodic Table Practice',
      description: 'Practice periodic trends',
      content: `# Periodic Table Practice

## Identify Groups
1. Li, Na, K belong to: ___
2. F, Cl, Br belong to: ___
3. He, Ne, Ar belong to: ___

## Predict Properties
Which has larger atomic radius?
1. Na or Cl: ___
2. Li or K: ___
3. O or S: ___

## Ionization Energy
Which has higher ionization energy?
1. Na or Mg: ___
2. Li or Cs: ___

## Metal, Nonmetal, or Metalloid?
1. Silicon: ___
2. Iron: ___
3. Sulfur: ___

## Valence Electrons
From group number:
1. Group 1: ___ valence e⁻
2. Group 17: ___ valence e⁻

## Answers
Groups: Alkali metals, Halogens, Noble gases
Radius: Na, K, S
IE: Mg, Li
Type: Metalloid, Metal, Nonmetal
Valence: 1, 7`,
      objectives: ['Identify element groups', 'Compare using trends', 'Predict properties']
    },
    mastery: {
      title: 'Periodic Table Mastery',
      description: 'Master periodic trends',
      content: `# Periodic Table Mastery

## Electron Affinity
Energy released when gaining an electron.
- Generally increases across period
- Halogens have highest (want 1 more e⁻)

## Metallic Character
- Decreases across period
- Increases down group

## Effective Nuclear Charge
Zeff = Z - shielding
More Zeff = smaller radius, higher IE

## Exceptions to Trends
- IE: N > O (half-filled 2p stability)
- EA: Cl > F (small F has more e⁻-e⁻ repulsion)

## Isoelectronic Series
Same number of electrons:
O²⁻, F⁻, Ne, Na⁺, Mg²⁺ (all 10 e⁻)
Radius: O²⁻ > F⁻ > Ne > Na⁺ > Mg²⁺

## Practice
1. Rank by radius: P³⁻, S²⁻, Cl⁻
2. Which is more metallic: Ba or Ra?
3. Explain why Na⁺ is smaller than Na.

## Answers
1. P³⁻ > S²⁻ > Cl⁻
2. Ra (further down)
3. Lost e⁻, same protons pull remaining e⁻ closer`,
      objectives: ['Apply advanced trends', 'Compare isoelectronic species', 'Explain exceptions']
    }
  },

  'chemical-bonding': {
    intro: {
      title: 'Chemical Bonding',
      description: 'Understand how atoms combine',
      content: `# Chemical Bonding

## Why Atoms Bond
To achieve stable electron configuration (octet rule).

## Types of Bonds

### Ionic Bonds
- Metal + Nonmetal
- Transfer of electrons
- Forms crystal lattice
- Example: NaCl

### Covalent Bonds
- Nonmetal + Nonmetal
- Sharing electrons
- Forms molecules
- Example: H₂O

### Metallic Bonds
- Metal + Metal
- "Sea of electrons"
- Explains conductivity

## Lewis Structures
Show valence electrons as dots.
1. Count total valence electrons
2. Draw single bonds
3. Complete octets with lone pairs
4. Form multiple bonds if needed

## Bond Polarity
**Electronegativity difference:**
- 0-0.4: Nonpolar covalent
- 0.5-1.7: Polar covalent
- >1.7: Ionic`,
      objectives: ['Distinguish bond types', 'Draw Lewis structures', 'Predict bond polarity']
    },
    practice: {
      title: 'Chemical Bonding Practice',
      description: 'Practice bonding concepts',
      content: `# Chemical Bonding Practice

## Bond Type
Predict ionic or covalent:
1. NaBr: ___
2. CO₂: ___
3. MgO: ___
4. CH₄: ___

## Lewis Structures
Draw Lewis structures for:
1. H₂O (total 8 valence e⁻)
2. NH₃ (total 8 valence e⁻)
3. CO₂ (total 16 valence e⁻)

## Polar or Nonpolar?
1. O-H bond: ___
2. C-C bond: ___
3. N-H bond: ___

## Electron Geometry
Determine shape:
1. 4 electron pairs, 0 lone pairs: ___
2. 4 electron pairs, 1 lone pair: ___
3. 4 electron pairs, 2 lone pairs: ___

## Answers
Type: Ionic, Covalent, Ionic, Covalent
Polar: Polar, Nonpolar, Polar
Geometry: Tetrahedral, Trigonal pyramidal, Bent`,
      objectives: ['Predict bond types', 'Draw structures', 'Determine polarity']
    },
    mastery: {
      title: 'Chemical Bonding Mastery',
      description: 'Master bonding concepts',
      content: `# Chemical Bonding Mastery

## VSEPR Theory
**V**alence **S**hell **E**lectron **P**air **R**epulsion

Electron pairs repel → molecular shape

## Molecular Geometries
| Pairs | Lone | Shape | Example |
|-------|------|-------|---------|
| 2 | 0 | Linear | CO₂ |
| 3 | 0 | Trigonal planar | BF₃ |
| 3 | 1 | Bent | SO₂ |
| 4 | 0 | Tetrahedral | CH₄ |
| 4 | 1 | Trigonal pyramidal | NH₃ |
| 4 | 2 | Bent | H₂O |

## Hybridization
- 2 regions: sp (linear)
- 3 regions: sp² (planar)
- 4 regions: sp³ (tetrahedral)

## Intermolecular Forces
1. London dispersion (all molecules)
2. Dipole-dipole (polar molecules)
3. Hydrogen bonding (H with N, O, F)

## Practice
1. Hybridization of C in CH₄: ___
2. Shape of PCl₅: ___
3. Strongest IMF in H₂O: ___

## Answers
1. sp³
2. Trigonal bipyramidal
3. Hydrogen bonding`,
      objectives: ['Apply VSEPR', 'Determine hybridization', 'Rank intermolecular forces']
    }
  },

  'chemical-reactions': {
    intro: {
      title: 'Chemical Reactions',
      description: 'Learn about chemical changes',
      content: `# Chemical Reactions

## Signs of Chemical Reaction
- Color change
- Gas production
- Precipitate forms
- Energy change (heat, light)
- Odor change

## Reaction Types

### Synthesis
A + B → AB
Example: 2H₂ + O₂ → 2H₂O

### Decomposition
AB → A + B
Example: 2H₂O → 2H₂ + O₂

### Single Replacement
A + BC → AC + B
Example: Zn + CuSO₄ → ZnSO₄ + Cu

### Double Replacement
AB + CD → AD + CB
Example: NaCl + AgNO₃ → NaNO₃ + AgCl

### Combustion
Fuel + O₂ → CO₂ + H₂O
Example: CH₄ + 2O₂ → CO₂ + 2H₂O

## Balancing Equations
**Law of Conservation of Mass:** Atoms in = Atoms out
Balance by adjusting coefficients.`,
      objectives: ['Identify reaction types', 'Balance equations', 'Predict products']
    },
    practice: {
      title: 'Chemical Reactions Practice',
      description: 'Practice reaction types',
      content: `# Reactions Practice

## Identify Reaction Type
1. 2Na + Cl₂ → 2NaCl: ___
2. CaCO₃ → CaO + CO₂: ___
3. Fe + CuSO₄ → FeSO₄ + Cu: ___
4. C₃H₈ + 5O₂ → 3CO₂ + 4H₂O: ___

## Balance These Equations
1. ___ H₂ + ___ O₂ → ___ H₂O
2. ___ Fe + ___ O₂ → ___ Fe₂O₃
3. ___ Al + ___ HCl → ___ AlCl₃ + ___ H₂

## Predict Products
1. Mg + O₂ → ___
2. NaOH + HCl → ___
3. Zn + H₂SO₄ → ___

## Evidence
What evidence shows a reaction occurred?
1. Baking soda + vinegar: ___
2. Iron rusting: ___

## Answers
Types: Synthesis, Decomposition, Single replacement, Combustion
Balance: 2,1,2; 4,3,2; 2,6,2,3
Products: MgO, NaCl+H₂O, ZnSO₄+H₂
Evidence: Gas bubbles, Color change`,
      objectives: ['Classify reactions', 'Balance equations', 'Identify evidence']
    },
    mastery: {
      title: 'Reactions Mastery',
      description: 'Master chemical reactions',
      content: `# Reactions Mastery

## Activity Series
Predicts single replacement reactions.
More active metals replace less active:
Li > K > Na > Mg > Al > Zn > Fe > Cu > Ag > Au

## Solubility Rules
Predicts precipitate in double replacement:
- Most Na⁺, K⁺, NH₄⁺ salts are soluble
- Most NO₃⁻, C₂H₃O₂⁻ salts are soluble
- Most Cl⁻, Br⁻ soluble (except Ag⁺, Pb²⁺)
- Most SO₄²⁻ soluble (except Ba²⁺, Pb²⁺)

## Net Ionic Equations
1. Write complete ionic equation
2. Cancel spectator ions
3. Write net ionic equation

## Oxidation-Reduction (Redox)
- Oxidation: Loss of electrons
- Reduction: Gain of electrons
- OIL RIG: Oxidation Is Loss, Reduction Is Gain

## Practice
1. Will Cu replace Ag⁺ in solution? ___
2. Is AgCl soluble? ___
3. In 2Na + Cl₂ → 2NaCl, what's oxidized?

## Answers
1. Yes (Cu more active)
2. No (precipitate)
3. Na (0 → +1, lost electrons)`,
      objectives: ['Use activity series', 'Apply solubility rules', 'Identify redox']
    }
  },

  'stoichiometry': {
    intro: {
      title: 'Stoichiometry',
      description: 'Calculate quantities in chemical reactions',
      content: `# Stoichiometry

## The Mole Concept
**Mole:** 6.022 × 10²³ particles (Avogadro's number)

## Molar Mass
Mass of one mole of a substance.
Equals atomic/molecular weight in g/mol.

H₂O: 2(1) + 16 = 18 g/mol

## Conversions
**Grams ↔ Moles ↔ Particles**

$$moles = \\frac{grams}{molar\\ mass}$$

$$particles = moles \\times 6.022 \\times 10^{23}$$

## Stoichiometry Steps
1. Balance the equation
2. Convert given to moles
3. Use mole ratio from equation
4. Convert to desired unit

## Example
How many moles of H₂O form from 4 mol H₂?
$$2H_2 + O_2 → 2H_2O$$
4 mol H₂ × (2 mol H₂O / 2 mol H₂) = 4 mol H₂O`,
      objectives: ['Define the mole', 'Convert between units', 'Perform stoichiometry calculations']
    },
    practice: {
      title: 'Stoichiometry Practice',
      description: 'Practice calculations',
      content: `# Stoichiometry Practice

## Molar Mass
Calculate molar mass:
1. NaCl: ___
2. H₂SO₄: ___
3. Ca(OH)₂: ___

## Conversions
1. 36 g H₂O = ___ mol
2. 2 mol CO₂ = ___ g
3. 0.5 mol = ___ molecules

## Mole Ratios
2H₂ + O₂ → 2H₂O
1. Ratio H₂:O₂ = ___
2. Ratio H₂:H₂O = ___

## Stoichiometry Problems
N₂ + 3H₂ → 2NH₃
1. 6 mol H₂ produces ___ mol NH₃
2. 28 g N₂ produces ___ mol NH₃

## Answers
Molar mass: 58.5 g/mol, 98 g/mol, 74 g/mol
Convert: 2 mol, 88 g, 3.01×10²³
Ratios: 2:1, 1:1
Problems: 4 mol, 2 mol`,
      objectives: ['Calculate molar mass', 'Convert units', 'Use mole ratios']
    },
    mastery: {
      title: 'Stoichiometry Mastery',
      description: 'Master stoichiometry',
      content: `# Stoichiometry Mastery

## Limiting Reagent
The reactant that runs out first.
Determines maximum product.

**Steps:**
1. Convert each reactant to moles of product
2. Smaller amount = limiting reagent
3. Other reactant = excess

## Percent Yield
$$\\% yield = \\frac{actual}{theoretical} \\times 100$$

## Example Problem
2H₂ + O₂ → 2H₂O
Given: 4g H₂ and 32g O₂
1. Limiting reagent?
2. Theoretical yield of H₂O?

Solution:
4g H₂ ÷ 2 = 2 mol H₂ → 2 mol H₂O
32g O₂ ÷ 32 = 1 mol O₂ → 2 mol H₂O

Both give same, but check which runs out!
2 mol H₂ needs 1 mol O₂ ✓ Exactly right

## Practice
1. 10g CH₄ + 50g O₂. Which is limiting?
2. Theoretical yield is 40g, actual is 32g. % yield?

## Answers
1. CH₄ (0.625 mol needs 1.25 mol O₂, have 1.56 mol)
2. 80%`,
      objectives: ['Identify limiting reagent', 'Calculate percent yield', 'Solve complex problems']
    }
  },

  'states-of-matter': {
    intro: {
      title: 'States of Matter',
      description: 'Understand the phases of matter',
      content: `# States of Matter

## Three Main States
| State | Shape | Volume | Particle Motion |
|-------|-------|--------|-----------------|
| Solid | Fixed | Fixed | Vibrate in place |
| Liquid | Container | Fixed | Slide past each other |
| Gas | Container | Container | Move freely |

## Phase Changes
- **Melting:** Solid → Liquid
- **Freezing:** Liquid → Solid
- **Vaporization:** Liquid → Gas
- **Condensation:** Gas → Liquid
- **Sublimation:** Solid → Gas
- **Deposition:** Gas → Solid

## Energy and Phase Changes
- Endothermic: Absorb heat (melting, vaporization)
- Exothermic: Release heat (freezing, condensation)

## Heating Curves
Flat regions = phase change (temperature constant)
Sloped regions = heating single phase

## Kinetic Molecular Theory
- Particles in constant motion
- Higher temp = faster motion
- Gas particles have negligible volume
- No intermolecular forces in ideal gas`,
      objectives: ['Describe states of matter', 'Identify phase changes', 'Interpret heating curves']
    },
    practice: {
      title: 'States of Matter Practice',
      description: 'Practice with phases',
      content: `# States Practice

## Phase Changes
Name the change:
1. Ice to water: ___
2. Water to steam: ___
3. Dry ice to CO₂ gas: ___
4. Frost forming: ___

## Particle Motion
Rank by particle motion (least to most):
Solid, Gas, Liquid

## Heating Curve
During flat region of heating curve:
1. Temperature: Increases / Stays same
2. Energy used for: ___

## Endo or Exothermic?
1. Boiling water: ___
2. Snow forming: ___
3. Melting ice: ___

## Gas Laws Preview
If temperature increases, what happens to gas:
1. Volume (constant pressure): ___
2. Pressure (constant volume): ___

## Answers
Changes: Melting, Vaporization, Sublimation, Deposition
Motion: Solid, Liquid, Gas
Heating: Stays same, Breaking bonds (phase change)
Energy: Endo, Exo, Endo
Gas: Increases, Increases`,
      objectives: ['Name phase changes', 'Understand energy flow', 'Predict particle behavior']
    },
    mastery: {
      title: 'States of Matter Mastery',
      description: 'Master phase concepts',
      content: `# States Mastery

## Phase Diagrams
Show phases at different P and T.
- **Triple point:** All three phases coexist
- **Critical point:** Beyond this, supercritical fluid

## Vapor Pressure
Pressure of gas above liquid at equilibrium.
- Increases with temperature
- Boiling: Vapor pressure = atmospheric pressure

## Colligative Properties
Depend on number of particles, not identity:
- Boiling point elevation
- Freezing point depression
- Vapor pressure lowering
- Osmotic pressure

## Calculations
$$\\Delta T_b = K_b \\cdot m$$
$$\\Delta T_f = K_f \\cdot m$$
(m = molality)

## Practice
1. At triple point, how many phases exist?
2. Adding salt to ice lowers/raises freezing point?
3. Why does boiling water in mountains happen at lower temp?

## Answers
1. Three
2. Lowers (freezing point depression)
3. Lower atmospheric pressure`,
      objectives: ['Read phase diagrams', 'Calculate colligative effects', 'Apply vapor pressure']
    }
  },

  'solutions': {
    intro: {
      title: 'Solutions & Concentration',
      description: 'Learn about mixtures and concentration',
      content: `# Solutions

## Definitions
- **Solution:** Homogeneous mixture
- **Solute:** Substance dissolved (smaller amount)
- **Solvent:** Does the dissolving (larger amount)

## Types of Solutions
| Solute | Solvent | Example |
|--------|---------|---------|
| Gas | Liquid | Soda |
| Solid | Liquid | Salt water |
| Liquid | Liquid | Alcohol in water |

## Concentration Units

### Molarity (M)
$$M = \\frac{moles\\ solute}{liters\\ solution}$$

### Molality (m)
$$m = \\frac{moles\\ solute}{kg\\ solvent}$$

### Percent
$$\\% = \\frac{part}{whole} \\times 100$$

## Factors Affecting Solubility
- Temperature (↑T = ↑solubility for solids)
- Pressure (↑P = ↑solubility for gases)
- "Like dissolves like" (polar in polar)`,
      objectives: ['Define solution terms', 'Calculate concentrations', 'Predict solubility']
    },
    practice: {
      title: 'Solutions Practice',
      description: 'Practice with solutions',
      content: `# Solutions Practice

## Identify Parts
In saltwater:
1. Solute: ___
2. Solvent: ___

## Molarity
1. 2 mol NaCl in 500 mL solution. M = ___
2. 0.5M solution, 2L needed. Moles NaOH = ___

## Dilution
M₁V₁ = M₂V₂
Dilute 100 mL of 6M HCl to 2M. Final volume?

## Solubility
Predict if soluble:
1. NaCl in water: ___
2. Oil in water: ___
3. CO₂ at high pressure: ___

## Percent Concentration
30g sugar in 120g solution. % = ___

## Answers
Parts: Salt, Water
Molarity: 4M, 1 mol
Dilution: 300 mL
Solubility: Yes (polar), No (nonpolar), Yes (gas)
Percent: 25%`,
      objectives: ['Identify solution parts', 'Calculate molarity', 'Use dilution formula']
    },
    mastery: {
      title: 'Solutions Mastery',
      description: 'Master solution concepts',
      content: `# Solutions Mastery

## Saturated vs Unsaturated
- **Unsaturated:** Can dissolve more
- **Saturated:** Maximum dissolved
- **Supersaturated:** More than maximum (unstable)

## Colligative Properties
Add solute to solvent:
- ↑ Boiling point
- ↓ Freezing point
- ↓ Vapor pressure

For electrolytes, multiply by van't Hoff factor (i).
NaCl: i = 2 (Na⁺ + Cl⁻)

## Raoult's Law
$$P_{solution} = X_{solvent} \\cdot P°_{solvent}$$

## Practice
1. 0.5m glucose vs 0.5m NaCl: Which lowers freezing point more?
2. Calculate boiling point elevation for 1m NaCl (Kb = 0.52°C/m)
3. Vapor pressure of pure water is 25 torr. What's vapor pressure when Xwater = 0.9?

## Answers
1. NaCl (i = 2, more particles)
2. ΔT = 0.52 × 1 × 2 = 1.04°C
3. P = 0.9 × 25 = 22.5 torr`,
      objectives: ['Compare saturation states', 'Apply van\'t Hoff factor', 'Calculate colligative properties']
    }
  },

  'acids-bases': {
    intro: {
      title: 'Acids and Bases',
      description: 'Understand acid-base chemistry',
      content: `# Acids and Bases

## Definitions

### Arrhenius
- **Acid:** Produces H⁺ in water
- **Base:** Produces OH⁻ in water

### Brønsted-Lowry
- **Acid:** Proton (H⁺) donor
- **Base:** Proton acceptor

## Properties
| Acids | Bases |
|-------|-------|
| Sour taste | Bitter taste |
| pH < 7 | pH > 7 |
| React with metals | Feel slippery |

## pH Scale
$$pH = -\\log[H^+]$$
- pH 7: Neutral
- pH < 7: Acidic
- pH > 7: Basic

## Strong vs Weak
**Strong acids:** Completely dissociate (HCl, HNO₃, H₂SO₄)
**Weak acids:** Partially dissociate (CH₃COOH)

## Neutralization
Acid + Base → Salt + Water
HCl + NaOH → NaCl + H₂O`,
      objectives: ['Define acids and bases', 'Calculate pH', 'Write neutralization reactions']
    },
    practice: {
      title: 'Acids and Bases Practice',
      description: 'Practice acid-base concepts',
      content: `# Acids and Bases Practice

## Identify
Acid or Base?
1. HNO₃: ___
2. KOH: ___
3. H₂SO₄: ___
4. NH₃: ___

## Calculate pH
1. [H⁺] = 0.001 M, pH = ___
2. [H⁺] = 10⁻⁵ M, pH = ___
3. pH = 4, [H⁺] = ___

## Strong or Weak?
1. HCl: ___
2. CH₃COOH: ___
3. NaOH: ___

## Neutralization
Complete:
1. HCl + NaOH → ___
2. H₂SO₄ + 2KOH → ___

## pH and pOH
If pH = 3:
1. Acidic or basic? ___
2. pOH = ___

## Answers
Identity: Acid, Base, Acid, Base
pH: 3, 5, 10⁻⁴ M
Strength: Strong, Weak, Strong
Neutralization: NaCl + H₂O, K₂SO₄ + 2H₂O
pH/pOH: Acidic, 11`,
      objectives: ['Classify acids and bases', 'Calculate pH', 'Balance neutralization']
    },
    mastery: {
      title: 'Acids and Bases Mastery',
      description: 'Master acid-base chemistry',
      content: `# Acids and Bases Mastery

## Conjugate Pairs
Acid loses H⁺ → conjugate base
Base gains H⁺ → conjugate acid

HCl + H₂O → Cl⁻ + H₃O⁺
Conjugate pair: HCl/Cl⁻

## Ka and Kb
$$K_a = \\frac{[H^+][A^-]}{[HA]}$$

Stronger acid = larger Ka

## Buffer Solutions
Resist pH change.
Made of: Weak acid + conjugate base

Henderson-Hasselbalch:
$$pH = pK_a + \\log\\frac{[A^-]}{[HA]}$$

## Titration
Adding known concentration to unknown.
**Equivalence point:** Moles acid = moles base

## Practice
1. Conjugate base of H₂CO₃: ___
2. pH of buffer with [HA] = [A⁻] and pKa = 4.7: ___
3. 50 mL of 0.1M HCl titrated with 0.1M NaOH. Volume at equivalence?

## Answers
1. HCO₃⁻
2. pH = 4.7
3. 50 mL`,
      objectives: ['Identify conjugate pairs', 'Calculate using Ka', 'Understand buffers and titrations']
    }
  },

  'thermochemistry': {
    intro: {
      title: 'Thermochemistry',
      description: 'Study energy changes in reactions',
      content: `# Thermochemistry

## Energy Terms
- **Heat (q):** Energy transfer due to temperature difference
- **Temperature:** Average kinetic energy
- **Enthalpy (H):** Heat content at constant pressure

## Enthalpy Change (ΔH)
$$\\Delta H = H_{products} - H_{reactants}$$

- **Exothermic:** ΔH < 0 (releases heat)
- **Endothermic:** ΔH > 0 (absorbs heat)

## Calorimetry
$$q = mc\\Delta T$$
- m = mass
- c = specific heat
- ΔT = temperature change

## Hess's Law
ΔH for a reaction equals sum of ΔH for steps.
Can add reactions to find overall ΔH.

## Standard Enthalpy
$$\\Delta H°_f$$ = enthalpy of formation from elements

$$\\Delta H°_{rxn} = \\Sigma \\Delta H°_f(products) - \\Sigma \\Delta H°_f(reactants)$$`,
      objectives: ['Define thermochemistry terms', 'Calculate heat changes', 'Apply Hess\'s Law']
    },
    practice: {
      title: 'Thermochemistry Practice',
      description: 'Practice energy calculations',
      content: `# Thermochemistry Practice

## Exo or Endo?
1. Combustion: ___
2. Melting ice: ___
3. ΔH = -285 kJ: ___
4. ΔH = +44 kJ: ___

## Calorimetry
Heat 100g water from 25°C to 75°C.
(c = 4.18 J/g°C)
q = ___

## Enthalpy Diagram
Exothermic reaction:
Products are (higher/lower) than reactants?

## Hess's Law
Given:
C + O₂ → CO₂  ΔH = -393 kJ
C + ½O₂ → CO  ΔH = -110 kJ

Find ΔH for: CO + ½O₂ → CO₂

## Answers
Type: Exo, Endo, Exo, Endo
Calorimetry: q = 100 × 4.18 × 50 = 20,900 J
Diagram: Lower
Hess: -283 kJ`,
      objectives: ['Classify reactions', 'Use calorimetry equation', 'Apply Hess\'s Law']
    },
    mastery: {
      title: 'Thermochemistry Mastery',
      description: 'Master thermochemistry',
      content: `# Thermochemistry Mastery

## Bond Energies
Energy to break a bond.
$$\\Delta H = \\Sigma BE_{broken} - \\Sigma BE_{formed}$$

Breaking bonds = endothermic (+)
Forming bonds = exothermic (-)

## Standard Conditions
25°C (298 K), 1 atm, 1 M solutions

## Entropy (S)
Measure of disorder.
- ΔS > 0: More disorder
- ΔS < 0: More order

## Gibbs Free Energy
$$\\Delta G = \\Delta H - T\\Delta S$$

- ΔG < 0: Spontaneous
- ΔG > 0: Non-spontaneous
- ΔG = 0: Equilibrium

## Practice
1. Breaking O-H bond is (endo/exo)thermic?
2. Gas → Liquid: ΔS is (+/-)?
3. Predict spontaneity: ΔH = -100 kJ, ΔS = +200 J/K

## Answers
1. Endothermic
2. Negative (less disorder)
3. ΔG < 0, spontaneous (both terms favor)`,
      objectives: ['Use bond energies', 'Predict entropy changes', 'Calculate Gibbs free energy']
    }
  },

  'equilibrium': {
    intro: {
      title: 'Chemical Equilibrium',
      description: 'Understand reversible reactions',
      content: `# Chemical Equilibrium

## Reversible Reactions
Both forward and reverse reactions occur.
$$aA + bB \\rightleftharpoons cC + dD$$

## Equilibrium
When forward rate = reverse rate.
Concentrations stay constant (not equal!).

## Equilibrium Constant (K)
$$K = \\frac{[C]^c[D]^d}{[A]^a[B]^b}$$

- K > 1: Products favored
- K < 1: Reactants favored
- K = 1: Neither favored

## Le Chatelier's Principle
If stress is applied, equilibrium shifts to relieve stress.

**Stresses:**
- Add/remove reactant or product
- Change pressure (gases)
- Change temperature

## Effect of Temperature
- Exothermic: Heat is product
- Endothermic: Heat is reactant

↑T shifts toward endothermic direction.`,
      objectives: ['Write equilibrium expressions', 'Interpret K values', 'Apply Le Chatelier\'s principle']
    },
    practice: {
      title: 'Equilibrium Practice',
      description: 'Practice equilibrium concepts',
      content: `# Equilibrium Practice

## Write K Expression
1. N₂ + 3H₂ ⇌ 2NH₃
K = ___

2. 2SO₂ + O₂ ⇌ 2SO₃
K = ___

## Interpret K
1. K = 4.2 × 10⁸: Favors ___
2. K = 1.8 × 10⁻⁵: Favors ___

## Le Chatelier's Principle
N₂ + 3H₂ ⇌ 2NH₃ + heat

Predict shift (→ or ←):
1. Add N₂: ___
2. Remove NH₃: ___
3. Increase temperature: ___
4. Increase pressure: ___

## Calculate K
At equilibrium: [A] = 0.5M, [B] = 0.2M, [C] = 1.0M
A + B ⇌ 2C
K = ___

## Answers
K expressions: [NH₃]²/[N₂][H₂]³, [SO₃]²/[SO₂]²[O₂]
Interpret: Products, Reactants
Shifts: →, →, ←, → (fewer moles)
K = (1.0)²/(0.5)(0.2) = 10`,
      objectives: ['Write K expressions', 'Predict shifts', 'Calculate K']
    },
    mastery: {
      title: 'Equilibrium Mastery',
      description: 'Master equilibrium calculations',
      content: `# Equilibrium Mastery

## Kp vs Kc
$$K_p = K_c(RT)^{\\Delta n}$$
Δn = moles gas products - moles gas reactants

## ICE Tables
**I**nitial, **C**hange, **E**quilibrium

Used to solve for unknown concentrations.

## Reaction Quotient (Q)
Same form as K, but not at equilibrium.
- Q < K: Shifts right (→)
- Q > K: Shifts left (←)
- Q = K: At equilibrium

## Practice
2NO₂ ⇌ 2NO + O₂  K = 4.0 × 10⁻³

Initial: [NO₂] = 0.1M, [NO] = 0, [O₂] = 0

1. Set up ICE table
2. Will Q shift right or left initially?
3. If x mol/L of O₂ forms, what's [NO]?

## Solubility Equilibrium
AgCl(s) ⇌ Ag⁺(aq) + Cl⁻(aq)
$$K_{sp} = [Ag^+][Cl^-]$$

## Answers
1. Change: -2x, +2x, +x
2. Right (Q = 0 < K)
3. [NO] = 2x`,
      objectives: ['Use ICE tables', 'Compare Q and K', 'Apply Ksp']
    }
  }
};

export default chemistryContent;

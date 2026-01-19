// Biology Lesson Content
// Comprehensive educational content for Biology (grades 9-10)

import { LessonContent } from '../lessonContentTypes';

export const biologyContent: Record<string, LessonContent> = {
  'scientific-method': {
    intro: {
      title: 'The Scientific Method',
      description: 'Learn the systematic approach to scientific inquiry',
      content: `# The Scientific Method

## What is Science?
Science is a systematic way of learning about the natural world through observation and experimentation.

## Steps of the Scientific Method

### 1. Observation
Notice something interesting in the world.
"Plants on the windowsill grow toward the light."

### 2. Question
Ask a testable question.
"Do plants grow toward light sources?"

### 3. Hypothesis
Make an educated guess (prediction).
"If plants are placed near a light, then they will grow toward it."

### 4. Experiment
Test your hypothesis with a controlled experiment.
- **Independent variable:** What you change
- **Dependent variable:** What you measure
- **Control group:** No changes applied
- **Constants:** Everything kept the same

### 5. Analyze Data
Collect and interpret results.
Use tables, graphs, and statistics.

### 6. Conclusion
Does data support your hypothesis?
Communicate results!`,
      objectives: ['List steps of scientific method', 'Identify variables in experiments', 'Distinguish hypothesis from theory']
    },
    practice: {
      title: 'Scientific Method Practice',
      description: 'Apply the scientific method',
      content: `# Scientific Method Practice

## Identify the Step
1. "I wonder why leaves change color": ___
2. "Measure plant height daily for 30 days": ___
3. "If temperature increases, ice will melt faster": ___
4. "The data shows my hypothesis was correct": ___

## Variables
Experiment: Testing how fertilizer affects plant growth.
1. Independent variable: ___
2. Dependent variable: ___
3. Name two constants: ___

## Write a Hypothesis
Question: Does music affect plant growth?
Hypothesis: If ___, then ___.

## Good vs Bad Hypothesis
Which is testable?
A) Plants are happy when watered.
B) Plants given more water will grow taller.
C) Water is good for plants.

## Design an Experiment
Question: Does caffeine affect heart rate?
What would be your:
- Control group: ___
- Experimental group: ___

## Answers
Steps: Question, Experiment, Hypothesis, Conclusion
Variables: Fertilizer, Plant growth/height, Water amount, sunlight, soil
Hypothesis: B is testable`,
      objectives: ['Identify method steps', 'Recognize variables', 'Design simple experiments']
    },
    mastery: {
      title: 'Scientific Method Mastery',
      description: 'Master experimental design',
      content: `# Scientific Method Mastery

## Theory vs Law
**Hypothesis:** Testable prediction
**Theory:** Well-supported explanation
**Law:** Describes what happens (not why)

Example:
- Theory of Evolution (explains HOW)
- Law of Gravity (describes WHAT)

## Sources of Error
- **Systematic error:** Consistent bias
- **Random error:** Unpredictable variation
- **Human error:** Mistakes in procedure

## Sample Size
Larger samples = more reliable results
Why? Reduces effect of outliers.

## Peer Review
Scientists check each other's work.
Ensures quality and catches errors.

## Analyze This Experiment
"Students tested if music helps memorization.
Group A studied with music, Group B without.
Group A scored higher on the test."

Problems:
1. What wasn't controlled? ___
2. Is sample size mentioned? ___
3. Was it repeated? ___

## Design Challenge
Design an experiment to test if exercise improves test scores.
Include all variables and controls.`,
      objectives: ['Distinguish theory from law', 'Identify sources of error', 'Evaluate experimental design']
    }
  },

  'cell-structure': {
    intro: {
      title: 'Cell Structure',
      description: 'Explore the building blocks of life',
      content: `# Cell Structure

## Cell Theory
1. All living things are made of cells
2. Cells are the basic unit of life
3. All cells come from existing cells

## Types of Cells

### Prokaryotic Cells
- No nucleus (DNA floats freely)
- Smaller and simpler
- Bacteria and archaea

### Eukaryotic Cells
- Have a nucleus
- Larger and more complex
- Animals, plants, fungi, protists

## Key Organelles

| Organelle | Function |
|-----------|----------|
| Nucleus | Contains DNA, control center |
| Mitochondria | Produces ATP (energy) |
| Ribosome | Makes proteins |
| Endoplasmic Reticulum | Processes proteins (rough) and lipids (smooth) |
| Golgi Apparatus | Packages and ships proteins |
| Lysosome | Digests waste |
| Cell Membrane | Controls what enters/exits |

## Plant Cell Extras
- **Cell Wall:** Rigid support
- **Chloroplast:** Photosynthesis
- **Central Vacuole:** Water storage`,
      objectives: ['State cell theory', 'Compare prokaryotic and eukaryotic', 'Identify organelle functions']
    },
    practice: {
      title: 'Cell Structure Practice',
      description: 'Identify cell parts and functions',
      content: `# Cell Structure Practice

## Prokaryotic or Eukaryotic?
1. Human cell: ___
2. E. coli bacteria: ___
3. Plant cell: ___
4. Yeast: ___

## Match Organelle to Function
1. Nucleus: ___
2. Mitochondria: ___
3. Ribosome: ___
4. Chloroplast: ___
5. Cell membrane: ___

A) Makes proteins
B) Controls entry/exit
C) Contains DNA
D) Produces energy
E) Photosynthesis

## Plant vs Animal Cell
Which has:
1. Cell wall: ___
2. Chloroplasts: ___
3. Large central vacuole: ___
4. Mitochondria: ___

## Cell Analogy
Complete: "The ___ is like the brain because it controls the cell."

## Answers
Type: E, P, E, E
Match: C, D, A, E, B
Plant vs Animal: Plant, Plant, Plant, Both
Analogy: Nucleus`,
      objectives: ['Classify cell types', 'Match organelles to functions', 'Compare plant and animal cells']
    },
    mastery: {
      title: 'Cell Structure Mastery',
      description: 'Master cell biology',
      content: `# Cell Structure Mastery

## The Endomembrane System
Connected organelles that work together:
Nuclear envelope → ER → Golgi → Vesicles → Cell membrane

## Protein Production Path
1. DNA in nucleus has instructions
2. mRNA carries message to ribosome
3. Ribosome makes protein
4. Rough ER processes protein
5. Golgi packages protein
6. Vesicle transports to destination

## Cytoskeleton
Internal scaffolding:
- **Microfilaments:** Movement, shape
- **Microtubules:** Transport, cell division
- **Intermediate filaments:** Structural support

## Cell Size Limits
Why are cells small?
- Surface area to volume ratio
- Diffusion distance
- DNA can only control so much

## Challenge
A cell has: cell wall, chloroplasts, nucleus, large vacuole.
1. What type of cell? ___
2. What type of organism? ___
3. Can it do photosynthesis? ___

## Research
How do mitochondria and chloroplasts support the endosymbiotic theory?

## Answers
Challenge: Eukaryotic plant cell, Plant, Yes`,
      objectives: ['Trace protein production', 'Understand cytoskeleton', 'Apply cell concepts']
    }
  },

  'cell-membrane': {
    intro: {
      title: 'Cell Membrane & Transport',
      description: 'Understand how cells control what enters and exits',
      content: `# Cell Membrane & Transport

## Membrane Structure
**Fluid Mosaic Model:**
- Phospholipid bilayer (two layers)
- Proteins embedded throughout
- Cholesterol for stability
- Carbohydrates for recognition

## Phospholipids
- **Hydrophilic head:** Loves water (outside)
- **Hydrophobic tail:** Fears water (inside)

## Selective Permeability
The membrane controls what passes through.
- Small, nonpolar molecules pass easily
- Large, charged molecules need help

## Types of Transport

### Passive Transport (No energy needed)
- **Diffusion:** High → Low concentration
- **Osmosis:** Water diffusion through membrane
- **Facilitated diffusion:** Uses channel proteins

### Active Transport (Energy required)
- Low → High concentration (against gradient)
- Uses ATP energy
- Protein pumps

## Osmosis Terms
- **Hypertonic:** More solute outside (cell shrinks)
- **Hypotonic:** Less solute outside (cell swells)
- **Isotonic:** Equal concentration (no net change)`,
      objectives: ['Describe membrane structure', 'Compare transport types', 'Predict osmosis outcomes']
    },
    practice: {
      title: 'Cell Transport Practice',
      description: 'Practice membrane transport concepts',
      content: `# Cell Transport Practice

## Passive or Active?
1. Diffusion of oxygen: ___
2. Sodium-potassium pump: ___
3. Osmosis: ___
4. Moving glucose against gradient: ___

## Osmosis Predictions
A cell is placed in each solution. What happens?
1. Hypertonic solution (more salt outside): ___
2. Hypotonic solution (less salt outside): ___
3. Isotonic solution: ___

## Membrane Structure
Label:
1. Water-loving part of phospholipid: ___
2. Water-fearing part: ___
3. Helps molecules cross: ___

## Concentration Gradient
In diffusion, molecules move from ___ to ___ concentration.

## Real World
Why do we salt slugs? (What happens to their cells?)

## Answers
Transport: Passive, Active, Passive, Active
Osmosis: Shrinks, Swells, Stays same
Structure: Hydrophilic head, Hydrophobic tail, Proteins
Gradient: High to Low
Slugs: Water leaves cells (hypertonic), they dehydrate`,
      objectives: ['Classify transport types', 'Predict osmotic effects', 'Apply membrane concepts']
    },
    mastery: {
      title: 'Cell Transport Mastery',
      description: 'Master membrane transport',
      content: `# Cell Transport Mastery

## Endocytosis and Exocytosis
**Endocytosis:** Cell engulfs material
- Phagocytosis: "Cell eating" (solids)
- Pinocytosis: "Cell drinking" (liquids)

**Exocytosis:** Cell releases material
- Vesicle fuses with membrane
- Contents released outside

## Sodium-Potassium Pump
- Pumps 3 Na⁺ out
- Pumps 2 K⁺ in
- Uses 1 ATP
- Maintains cell's electrical gradient

## Water Potential
ψ = ψₚ + ψₛ
Water moves from high to low water potential.

## Practice Problems
1. Red blood cells in distilled water: ___
2. Plant cells in salt water: ___
3. Why don't plant cells burst in water?

## Application
How does dialysis work? What type of transport is involved?

## Lab Design
Design experiment to demonstrate osmosis using potato cores and salt solutions.

## Answers
1. Lyse (burst) - hypotonic
2. Plasmolysis (shrink) - hypertonic
3. Cell wall prevents bursting`,
      objectives: ['Explain endo/exocytosis', 'Understand ion pumps', 'Apply to medical contexts']
    }
  },

  'photosynthesis': {
    intro: {
      title: 'Photosynthesis',
      description: 'Learn how plants convert light to food',
      content: `# Photosynthesis

## Overview
Plants convert light energy into chemical energy (glucose).

## The Equation
$$6CO_2 + 6H_2O + Light \\rightarrow C_6H_{12}O_6 + 6O_2$$

**Inputs:** Carbon dioxide, Water, Light
**Outputs:** Glucose, Oxygen

## Where It Happens
**Chloroplasts** contain:
- **Thylakoids:** Light reactions (stacked into grana)
- **Stroma:** Calvin cycle (fluid around thylakoids)

## Two Stages

### Light-Dependent Reactions
Location: Thylakoid membrane
- Absorb light energy
- Split water (releases O₂)
- Produce ATP and NADPH

### Calvin Cycle (Light-Independent)
Location: Stroma
- Uses ATP and NADPH
- Fixes CO₂ into glucose
- Doesn't directly need light

## Pigments
- **Chlorophyll a:** Main pigment (absorbs red, blue)
- **Chlorophyll b:** Accessory pigment
- **Carotenoids:** Yellow, orange (absorb blue, green)

Green light is reflected - that's why plants look green!`,
      objectives: ['Write photosynthesis equation', 'Describe two stages', 'Explain role of chlorophyll']
    },
    practice: {
      title: 'Photosynthesis Practice',
      description: 'Practice photosynthesis concepts',
      content: `# Photosynthesis Practice

## Complete the Equation
___ + ___ + Light → Glucose + ___

## Inputs and Outputs
Classify each as input or output:
1. Oxygen: ___
2. Carbon dioxide: ___
3. Glucose: ___
4. Water: ___
5. Light: ___

## Location Match
1. Light reactions: ___
2. Calvin cycle: ___
A) Stroma  B) Thylakoid

## True or False
1. Photosynthesis produces CO₂: ___
2. The Calvin cycle directly uses light: ___
3. Chlorophyll absorbs green light: ___
4. Plants release oxygen: ___

## Why Green?
Plants appear green because chlorophyll ___ green light.

## Factors Affecting Rate
List 3 factors that affect photosynthesis rate:
1. ___  2. ___  3. ___

## Answers
Equation: CO₂ + H₂O → O₂
I/O: Output, Input, Output, Input, Input
Location: B, A
T/F: F, F, F, T
Green: Reflects
Factors: Light, CO₂, Temperature, Water`,
      objectives: ['Balance equation', 'Locate reactions', 'Identify affecting factors']
    },
    mastery: {
      title: 'Photosynthesis Mastery',
      description: 'Master photosynthesis details',
      content: `# Photosynthesis Mastery

## Light Reactions Detail
**Photosystem II → Photosystem I**
1. Light hits PSII, excites electrons
2. Water split: 2H₂O → 4H⁺ + 4e⁻ + O₂
3. Electrons pass through ETC
4. H⁺ gradient drives ATP synthase
5. PSI re-energizes electrons
6. NADP⁺ + H⁺ + 2e⁻ → NADPH

## Calvin Cycle Detail
1. **Carbon fixation:** CO₂ + RuBP → 2 PGA
2. **Reduction:** PGA → G3P (uses ATP, NADPH)
3. **Regeneration:** G3P → RuBP

## C3 vs C4 vs CAM Plants
| Type | Example | Adaptation |
|------|---------|------------|
| C3 | Most plants | Standard |
| C4 | Corn, sugarcane | Hot climates |
| CAM | Cacti | Desert (open stomata at night) |

## Limiting Factors
Rate limited by lowest factor available.
Graph shows plateau when one factor maxed.

## Practice
1. What enzyme fixes CO₂? ___
2. How many CO₂ needed to make 1 glucose? ___
3. Net ATP and NADPH for 1 glucose? ___

## Answers
1. RuBisCO
2. 6 CO₂
3. 18 ATP, 12 NADPH`,
      objectives: ['Explain electron transport', 'Detail Calvin cycle', 'Compare plant types']
    }
  },

  'cellular-respiration': {
    intro: {
      title: 'Cellular Respiration',
      description: 'Learn how cells extract energy from food',
      content: `# Cellular Respiration

## Overview
Cells break down glucose to release ATP energy.

## The Equation
$$C_6H_{12}O_6 + 6O_2 \\rightarrow 6CO_2 + 6H_2O + ATP$$

This is the REVERSE of photosynthesis!

## Where It Happens
- **Cytoplasm:** Glycolysis
- **Mitochondria:** Krebs cycle, ETC

## Three Stages

### 1. Glycolysis
Location: Cytoplasm
- Glucose (6C) → 2 Pyruvate (3C)
- Produces: 2 ATP, 2 NADH
- Doesn't require oxygen!

### 2. Krebs Cycle (Citric Acid Cycle)
Location: Mitochondrial matrix
- Pyruvate → CO₂
- Produces: 2 ATP, 8 NADH, 2 FADH₂

### 3. Electron Transport Chain (ETC)
Location: Inner mitochondrial membrane
- NADH and FADH₂ donate electrons
- Oxygen is final electron acceptor
- Produces: ~34 ATP

## Total ATP: ~36-38 per glucose`,
      objectives: ['Write respiration equation', 'Locate three stages', 'Summarize ATP production']
    },
    practice: {
      title: 'Cellular Respiration Practice',
      description: 'Practice respiration concepts',
      content: `# Respiration Practice

## Complete Equation
Glucose + ___ → ___ + ___ + ATP

## Stage Locations
1. Glycolysis: ___
2. Krebs Cycle: ___
3. ETC: ___

A) Cytoplasm
B) Mitochondrial matrix
C) Inner mitochondrial membrane

## ATP Production
Match stage to ATP:
1. Glycolysis: ___ ATP
2. Krebs Cycle: ___ ATP
3. ETC: ___ ATP

A) ~34  B) 2  C) 2

## Compare to Photosynthesis
1. Which produces O₂? ___
2. Which uses O₂? ___
3. Which produces glucose? ___
4. Which breaks down glucose? ___

## True or False
1. Glycolysis requires oxygen: ___
2. Most ATP comes from ETC: ___
3. CO₂ is released in glycolysis: ___

## Answers
Equation: O₂ → CO₂ + H₂O
Locations: A, B, C
ATP: B, C, A
Compare: Photo, Resp, Photo, Resp
T/F: F, T, F`,
      objectives: ['Balance equation', 'Locate stages', 'Compare to photosynthesis']
    },
    mastery: {
      title: 'Cellular Respiration Mastery',
      description: 'Master respiration details',
      content: `# Respiration Mastery

## Glycolysis Details
Glucose → 2 Pyruvate
- Uses 2 ATP
- Produces 4 ATP
- Net: 2 ATP + 2 NADH

## Krebs Cycle Details (per glucose)
2 Acetyl-CoA enter
Products: 6 NADH, 2 FADH₂, 2 ATP, 4 CO₂

## ETC and Chemiosmosis
1. NADH/FADH₂ donate electrons
2. Electrons pass through protein complexes
3. H⁺ pumped to intermembrane space
4. H⁺ flows back through ATP synthase
5. ATP produced!
6. O₂ accepts electrons → H₂O

## Fermentation
Without oxygen, cells use fermentation:
- **Lactic acid:** Muscles (glucose → lactate)
- **Alcoholic:** Yeast (glucose → ethanol + CO₂)

Only produces 2 ATP (from glycolysis)

## Practice
1. Why is oxygen called final electron acceptor?
2. How much more ATP with oxygen vs without?
3. What happens if ETC stops?

## Answers
1. Receives electrons at end of chain, forms water
2. ~36 vs 2 ATP (18x more!)
3. NADH/FADH₂ can't be recycled, respiration stops`,
      objectives: ['Detail each stage', 'Explain chemiosmosis', 'Compare aerobic and anaerobic']
    }
  },

  'cell-division': {
    intro: {
      title: 'Cell Division',
      description: 'Learn about mitosis and meiosis',
      content: `# Cell Division

## Why Cells Divide
- Growth
- Repair
- Reproduction

## The Cell Cycle
1. **Interphase:** Cell grows and copies DNA (G1, S, G2)
2. **Mitosis:** Nucleus divides
3. **Cytokinesis:** Cytoplasm divides

## Mitosis Phases
**PMAT:**
1. **Prophase:** Chromosomes condense, nuclear envelope breaks
2. **Metaphase:** Chromosomes align at middle
3. **Anaphase:** Sister chromatids separate, move apart
4. **Telophase:** Nuclear envelopes reform

Result: 2 identical diploid cells (2n)

## Meiosis
- Produces gametes (sex cells)
- TWO divisions: Meiosis I and II
- Result: 4 haploid cells (n)

## Key Differences
| Feature | Mitosis | Meiosis |
|---------|---------|---------|
| Divisions | 1 | 2 |
| Daughter cells | 2 | 4 |
| Ploidy | 2n→2n | 2n→n |
| Purpose | Growth | Reproduction |
| Genetic variation | No | Yes |`,
      objectives: ['Describe cell cycle', 'Order mitosis phases', 'Compare mitosis and meiosis']
    },
    practice: {
      title: 'Cell Division Practice',
      description: 'Practice cell division concepts',
      content: `# Cell Division Practice

## Order the Phases
Put in order: Anaphase, Prophase, Telophase, Metaphase
1. ___
2. ___
3. ___
4. ___

## Mitosis or Meiosis?
1. Produces 4 cells: ___
2. For growth and repair: ___
3. Reduces chromosome number: ___
4. Daughter cells are identical: ___

## Cell Cycle
Match phase to description:
1. DNA replication: ___
2. Nuclear division: ___
3. Cell growth: ___

A) G1  B) S phase  C) Mitosis

## Chromosome Numbers
Human somatic cells have 46 chromosomes.
1. After mitosis: ___
2. After meiosis: ___

## What Goes Wrong?
What happens if chromosomes don't separate properly?

## Answers
Order: Prophase, Metaphase, Anaphase, Telophase
Type: Meiosis, Mitosis, Meiosis, Mitosis
Cycle: B, C, A
Numbers: 46, 23
Wrong: Aneuploidy (wrong number of chromosomes)`,
      objectives: ['Sequence mitosis phases', 'Distinguish division types', 'Predict outcomes']
    },
    mastery: {
      title: 'Cell Division Mastery',
      description: 'Master cell division',
      content: `# Cell Division Mastery

## Meiosis Details

### Meiosis I (Reduction Division)
- Homologous pairs separate
- Crossing over occurs (genetic variation!)
- 2n → n

### Meiosis II (Similar to Mitosis)
- Sister chromatids separate
- n → n
- 4 haploid cells total

## Sources of Genetic Variation
1. **Crossing over:** Exchange between homologs
2. **Independent assortment:** Random alignment
3. **Random fertilization:** Any sperm + any egg

## Checkpoints
Cell cycle has checkpoints to ensure:
- DNA is replicated correctly
- Chromosomes attached properly
- Cell is ready to divide

**Cancer:** Checkpoints fail, uncontrolled division

## Practice Problems
1. A cell with 8 chromosomes undergoes meiosis. How many chromosomes in each gamete?
2. How many unique gamete combinations from an organism with n=3?
3. What structure holds sister chromatids together?

## Answers
1. 4 chromosomes
2. 2³ = 8 combinations
3. Centromere`,
      objectives: ['Detail meiosis stages', 'Explain genetic variation sources', 'Understand cell cycle regulation']
    }
  },

  'dna-structure': {
    intro: {
      title: 'DNA Structure & Replication',
      description: 'Explore the molecule of heredity',
      content: `# DNA Structure & Replication

## What is DNA?
**D**eoxyribo**N**ucleic **A**cid
The genetic material that carries instructions for life.

## DNA Structure
**Double helix** - twisted ladder shape

### Building Blocks: Nucleotides
Each nucleotide has:
1. Phosphate group
2. Deoxyribose sugar
3. Nitrogenous base

### The Four Bases
- **A**denine pairs with **T**hymine (A-T)
- **G**uanine pairs with **C**ytosine (G-C)

**Chargaff's Rules:** A=T and G=C amounts

## Base Pairing
Bases are held together by hydrogen bonds:
- A-T: 2 hydrogen bonds
- G-C: 3 hydrogen bonds

## DNA Replication
**Semi-conservative:** Each new DNA has one old strand, one new strand.

Steps:
1. Helicase unwinds DNA
2. Primase adds RNA primer
3. DNA polymerase builds new strand
4. Ligase seals fragments`,
      objectives: ['Describe DNA structure', 'Apply base pairing rules', 'Explain replication process']
    },
    practice: {
      title: 'DNA Structure Practice',
      description: 'Practice DNA concepts',
      content: `# DNA Practice

## Base Pairing
Complete the complementary strand:
A-T-G-C-C-A-T
___-___-___-___-___-___-___

## Chargaff's Rules
If a DNA sample is 20% adenine:
1. Thymine = ___%
2. Guanine = ___%
3. Cytosine = ___%

## DNA Components
Match:
1. Sugar in DNA: ___
2. Holds bases together: ___
3. Unwinds DNA: ___
4. Builds new strand: ___

A) Hydrogen bonds  B) Helicase
C) DNA polymerase  D) Deoxyribose

## True or False
1. A pairs with G: ___
2. DNA is single-stranded: ___
3. Replication is semi-conservative: ___
4. G-C has 3 hydrogen bonds: ___

## Explain
Why does the cell need to replicate DNA?

## Answers
Pairing: T-A-C-G-G-T-A
Chargaff: 20%, 30%, 30%
Match: D, A, B, C
T/F: F, F, T, T`,
      objectives: ['Apply base pairing', 'Use Chargaff\'s rules', 'Identify replication components']
    },
    mastery: {
      title: 'DNA Mastery',
      description: 'Master DNA concepts',
      content: `# DNA Mastery

## Replication Fork
- **Leading strand:** Continuous synthesis (3'→5')
- **Lagging strand:** Okazaki fragments (5'→3')

## Enzymes Summary
| Enzyme | Function |
|--------|----------|
| Helicase | Unwinds DNA |
| Primase | Adds RNA primer |
| DNA Polymerase III | Adds nucleotides |
| DNA Polymerase I | Removes primers |
| Ligase | Joins fragments |

## Proofreading
DNA polymerase checks for errors.
Error rate: ~1 in 10 billion bases!

## Telomeres
Ends of chromosomes.
Shorten with each division.
Related to aging.

## Practice Problems
1. A DNA strand is 5'-ATGCCGA-3'. Write the complementary strand with correct orientation.
2. Why is the lagging strand synthesized in fragments?
3. What would happen without ligase?

## Answers
1. 3'-TACGGCT-5'
2. DNA polymerase only works 5'→3'; one strand goes "wrong way"
3. Okazaki fragments wouldn't be joined`,
      objectives: ['Distinguish leading/lagging strands', 'Explain enzyme roles', 'Understand telomeres']
    }
  },

  'protein-synthesis': {
    intro: {
      title: 'Protein Synthesis',
      description: 'Learn how genes become proteins',
      content: `# Protein Synthesis

## Central Dogma
DNA → RNA → Protein
"DNA makes RNA makes Protein"

## Transcription
**DNA → mRNA** (in nucleus)

1. RNA polymerase binds to promoter
2. DNA unwinds
3. RNA polymerase reads template strand
4. Builds complementary mRNA (A-U, G-C)
5. mRNA leaves nucleus

**Note:** RNA uses Uracil (U) instead of Thymine (T)

## Translation
**mRNA → Protein** (at ribosome)

1. mRNA attaches to ribosome
2. tRNA brings amino acids
3. Anticodon matches codon
4. Amino acids link together
5. Protein folds into shape

## The Genetic Code
- **Codon:** 3 mRNA bases = 1 amino acid
- 64 codons total
- **Start codon:** AUG (methionine)
- **Stop codons:** UAA, UAG, UGA`,
      objectives: ['State central dogma', 'Describe transcription and translation', 'Use genetic code']
    },
    practice: {
      title: 'Protein Synthesis Practice',
      description: 'Practice gene expression',
      content: `# Protein Synthesis Practice

## Transcription
DNA template: 3'-TAC GGC ATT-5'
mRNA: ___

## Translation
mRNA: AUG-UUU-GAC-UAA
Using codon chart:
Amino acids: ___-___-___-___

## Central Dogma Order
1. Protein made at ribosome
2. mRNA leaves nucleus
3. DNA transcribed to mRNA
4. tRNA brings amino acids

Correct order: ___

## Locations
1. Transcription occurs in: ___
2. Translation occurs in: ___

## Identify
1. Reads mRNA codons: ___
2. Carries amino acids: ___
3. Sequence of 3 bases on mRNA: ___
4. Sequence of 3 bases on tRNA: ___

## Answers
mRNA: 5'-AUG CCG UAA-3'
Amino acids: Met-Phe-Asp-STOP
Order: 3, 2, 1, 4
Locations: Nucleus, Ribosome/Cytoplasm
Identify: Ribosome, tRNA, Codon, Anticodon`,
      objectives: ['Transcribe DNA to mRNA', 'Translate codons', 'Order synthesis steps']
    },
    mastery: {
      title: 'Protein Synthesis Mastery',
      description: 'Master gene expression',
      content: `# Protein Synthesis Mastery

## Types of RNA
| RNA | Function |
|-----|----------|
| mRNA | Carries genetic message |
| tRNA | Brings amino acids |
| rRNA | Makes up ribosomes |

## Mutations
**Point mutations:**
- Silent: No amino acid change
- Missense: Different amino acid
- Nonsense: Creates stop codon

**Frameshift mutations:**
- Insertion or deletion
- Shifts reading frame
- Usually severe

## Practice
DNA: 3'-TAC AAA GCT ATT-5'

1. mRNA: ___
2. Amino acid sequence: ___
3. If second T is deleted, what type of mutation? ___
4. How would the protein change? ___

## Gene Regulation
Not all genes are "on" all the time.
- **Promoters:** Where transcription starts
- **Enhancers:** Increase transcription
- **Repressors:** Decrease transcription

## Answers
1. AUG UUU CGA UAA
2. Met-Phe-Arg-STOP
3. Frameshift
4. Completely different protein after deletion point`,
      objectives: ['Distinguish RNA types', 'Identify mutation effects', 'Understand regulation']
    }
  },

  'genetics-mendel': {
    intro: {
      title: 'Mendelian Genetics',
      description: 'Learn the principles of inheritance',
      content: `# Mendelian Genetics

## Gregor Mendel
"Father of Genetics" - studied pea plants in 1860s.

## Key Terms
- **Gene:** Section of DNA coding for a trait
- **Allele:** Different versions of a gene
- **Dominant:** Expressed when present (B)
- **Recessive:** Only expressed when homozygous (b)
- **Genotype:** Genetic makeup (BB, Bb, bb)
- **Phenotype:** Physical expression (brown eyes)
- **Homozygous:** Same alleles (BB or bb)
- **Heterozygous:** Different alleles (Bb)

## Mendel's Laws

### Law of Segregation
Alleles separate during gamete formation.
Each gamete gets ONE allele.

### Law of Independent Assortment
Genes for different traits sort independently.

## Punnett Squares
Cross: Bb × Bb
|   | B | b |
|---|---|---|
| B | BB | Bb |
| b | Bb | bb |

Genotype ratio: 1:2:1
Phenotype ratio: 3:1`,
      objectives: ['Define genetic terms', 'State Mendel\'s laws', 'Use Punnett squares']
    },
    practice: {
      title: 'Genetics Practice',
      description: 'Practice inheritance problems',
      content: `# Genetics Practice

## Genotype or Phenotype?
1. Bb: ___
2. Brown fur: ___
3. Homozygous dominant: ___
4. Tall plant: ___

## Complete the Punnett Square
Cross: Tt × Tt
|   | T | t |
|---|---|---|
| T | ___ | ___ |
| t | ___ | ___ |

Phenotype ratio: ___

## Predict Offspring
1. BB × bb: All offspring genotype?
2. Bb × Bb: Chance of bb?
3. Bb × bb: Chance of dominant phenotype?

## Identify
1. TT is: homozygous / heterozygous
2. Tt is: homozygous / heterozygous
3. Two Tt parents: chance of tt offspring?

## Answers
G/P: Genotype, Phenotype, Genotype, Phenotype
Square: TT, Tt, Tt, tt (3:1)
Predict: All Bb, 25%, 50%
Identify: Homozygous, Heterozygous, 25%`,
      objectives: ['Distinguish genotype/phenotype', 'Complete Punnett squares', 'Calculate probabilities']
    },
    mastery: {
      title: 'Genetics Mastery',
      description: 'Master inheritance patterns',
      content: `# Genetics Mastery

## Beyond Simple Dominance

### Incomplete Dominance
Heterozygote is intermediate.
Red × White = Pink

### Codominance
Both alleles fully expressed.
Example: Blood type (I^A I^B = AB)

### Multiple Alleles
More than 2 alleles exist.
Example: Blood type (I^A, I^B, i)

## Dihybrid Cross
Two traits at once: AaBb × AaBb

Phenotype ratio: 9:3:3:1

## Sex-Linked Traits
Genes on X chromosome.
Males (XY) only need one copy to express.
Example: Color blindness, hemophilia

## Practice
1. Red (RR) × White (WW) with incomplete dominance: F1 phenotype?
2. Cross two pink flowers: phenotype ratio?
3. Color blind man (X^b Y) × carrier woman (X^B X^b): Chance of color blind son?

## Answers
1. All pink (RW)
2. 1 Red : 2 Pink : 1 White
3. 50%`,
      objectives: ['Apply incomplete/codominance', 'Solve dihybrid crosses', 'Analyze sex-linked traits']
    }
  },

  'evolution': {
    intro: {
      title: 'Evolution & Natural Selection',
      description: 'Understand how species change over time',
      content: `# Evolution & Natural Selection

## What is Evolution?
Change in allele frequencies in a population over time.

## Darwin's Theory
**Natural Selection:** Individuals with beneficial traits survive and reproduce more.

### Requirements for Natural Selection
1. **Variation:** Differences exist in population
2. **Heritability:** Traits can be passed on
3. **Differential reproduction:** Some reproduce more
4. **Time:** Changes accumulate over generations

## Evidence for Evolution
1. **Fossil record:** Shows change over time
2. **Comparative anatomy:**
   - Homologous structures (same origin)
   - Analogous structures (same function)
   - Vestigial structures (reduced function)
3. **Embryology:** Similar development
4. **DNA/Molecular:** Shared genetic sequences

## Types of Selection
- **Stabilizing:** Favors average
- **Directional:** Favors one extreme
- **Disruptive:** Favors both extremes`,
      objectives: ['Define evolution and natural selection', 'List evidence for evolution', 'Describe selection types']
    },
    practice: {
      title: 'Evolution Practice',
      description: 'Practice evolution concepts',
      content: `# Evolution Practice

## Natural Selection Requirements
Which is required?
1. Genetic variation: Yes / No
2. Unlimited resources: Yes / No
3. Heritability: Yes / No
4. Long lifespan: Yes / No

## Evidence Types
Match evidence to type:
1. Arm bones in humans and whales: ___
2. Ancient horse fossils: ___
3. 98% DNA match with chimps: ___
4. Human appendix: ___

A) Fossil  B) Homologous  C) Molecular  D) Vestigial

## Selection Type
1. Birth weight: extremes die more → ___
2. Beak size: only large survive drought → ___
3. Snail color: light and dark survive, medium eaten → ___

## True or False
1. Evolution is "just a theory": ___
2. Individuals evolve: ___
3. Populations evolve: ___

## Answers
Required: Yes, No, Yes, No
Evidence: B, A, C, D
Selection: Stabilizing, Directional, Disruptive
T/F: F (theory = well-supported), F, T`,
      objectives: ['Identify selection requirements', 'Classify evidence', 'Recognize selection patterns']
    },
    mastery: {
      title: 'Evolution Mastery',
      description: 'Master evolutionary concepts',
      content: `# Evolution Mastery

## Mechanisms of Evolution
1. **Natural Selection:** Adaptive change
2. **Genetic Drift:** Random change (small populations)
   - Bottleneck effect
   - Founder effect
3. **Gene Flow:** Migration between populations
4. **Mutation:** New alleles created

## Speciation
Formation of new species.

**Reproductive isolation:**
- Geographic (allopatric)
- Behavioral
- Temporal

## Hardy-Weinberg Equilibrium
No evolution if:
- No mutation
- Random mating
- No selection
- Large population
- No gene flow

Equations:
p + q = 1
p² + 2pq + q² = 1

## Practice
If 16% of population is homozygous recessive (q²):
1. What is q? ___
2. What is p? ___
3. What % are heterozygous (2pq)? ___

## Answers
1. q = 0.4
2. p = 0.6
3. 2(0.6)(0.4) = 48%`,
      objectives: ['Compare evolutionary mechanisms', 'Explain speciation', 'Apply Hardy-Weinberg']
    }
  },

  'ecology': {
    intro: {
      title: 'Ecology & Ecosystems',
      description: 'Study the interactions of organisms and their environment',
      content: `# Ecology & Ecosystems

## Levels of Organization
1. **Organism:** Individual
2. **Population:** Same species in an area
3. **Community:** Different species interacting
4. **Ecosystem:** Community + abiotic factors
5. **Biome:** Large region with similar climate
6. **Biosphere:** All life on Earth

## Biotic vs Abiotic
**Biotic:** Living factors (plants, animals)
**Abiotic:** Nonliving factors (water, temperature)

## Energy Flow
Sun → Producers → Consumers → Decomposers

**Trophic Levels:**
1. Producers (autotrophs)
2. Primary consumers (herbivores)
3. Secondary consumers (carnivores)
4. Tertiary consumers (top predators)

**10% Rule:** Only ~10% energy transfers to next level.

## Biogeochemical Cycles
- Carbon cycle
- Nitrogen cycle
- Water cycle
- Phosphorus cycle

Matter cycles, energy flows!`,
      objectives: ['Order ecological levels', 'Trace energy flow', 'Describe biogeochemical cycles']
    },
    practice: {
      title: 'Ecology Practice',
      description: 'Practice ecology concepts',
      content: `# Ecology Practice

## Order the Levels
Smallest to largest:
Population, Biosphere, Community, Organism, Ecosystem

1. ___
2. ___
3. ___
4. ___
5. ___

## Biotic or Abiotic?
1. Temperature: ___
2. Bacteria: ___
3. Sunlight: ___
4. Mushrooms: ___

## Energy Pyramid
If producers have 10,000 kcal:
1. Primary consumers: ___
2. Secondary consumers: ___
3. Tertiary consumers: ___

## Food Web
Grass → Rabbit → Fox → Decomposer
1. Producer: ___
2. Primary consumer: ___
3. Secondary consumer: ___

## Why 10% Rule?
Where does the other 90% of energy go?

## Answers
Order: Organism, Population, Community, Ecosystem, Biosphere
B/A: Abiotic, Biotic, Abiotic, Biotic
Energy: 1000, 100, 10 kcal
Food web: Grass, Rabbit, Fox
90%: Heat, metabolism, waste`,
      objectives: ['Order ecological levels', 'Calculate energy transfer', 'Analyze food webs']
    },
    mastery: {
      title: 'Ecology Mastery',
      description: 'Master ecosystem dynamics',
      content: `# Ecology Mastery

## Population Dynamics
**Exponential growth:** J-curve (unlimited resources)
**Logistic growth:** S-curve (carrying capacity)

**Carrying capacity (K):** Maximum population environment can support.

## Species Interactions
| Interaction | Species A | Species B |
|-------------|-----------|-----------|
| Mutualism | + | + |
| Commensalism | + | 0 |
| Parasitism | + | - |
| Predation | + | - |
| Competition | - | - |

## Ecological Succession
**Primary:** Starts from bare rock
**Secondary:** After disturbance (has soil)

Pioneer species → Intermediate → Climax community

## Practice
1. Carrying capacity is reached. What happens to growth rate?
2. Both species benefit from interaction. Type?
3. Volcanic island: which succession type?

## Human Impact
- Habitat destruction
- Invasive species
- Pollution
- Climate change
- Overexploitation

## Answers
1. Growth rate approaches zero
2. Mutualism
3. Primary succession`,
      objectives: ['Analyze population growth', 'Classify interactions', 'Understand succession']
    }
  },

  'human-body-systems': {
    intro: {
      title: 'Human Body Systems',
      description: 'Explore the major organ systems',
      content: `# Human Body Systems

## Overview
The body has 11 organ systems working together.

## Major Systems

### Circulatory System
- **Heart:** Pumps blood
- **Blood vessels:** Arteries, veins, capillaries
- **Blood:** Carries O₂, nutrients, waste

### Respiratory System
- **Lungs:** Gas exchange
- **Path:** Nose → Pharynx → Larynx → Trachea → Bronchi → Alveoli

### Digestive System
- **Mouth → Esophagus → Stomach → Small intestine → Large intestine**
- Breaks down food, absorbs nutrients

### Nervous System
- **Brain:** Control center
- **Spinal cord:** Information highway
- **Nerves:** Carry messages

### Immune System
- Defends against pathogens
- White blood cells, antibodies

### Endocrine System
- Glands produce hormones
- Chemical messengers

## Homeostasis
Maintaining stable internal conditions.
Example: Body temperature stays ~37°C`,
      objectives: ['Name major body systems', 'Describe organ functions', 'Explain homeostasis']
    },
    practice: {
      title: 'Body Systems Practice',
      description: 'Practice body systems knowledge',
      content: `# Body Systems Practice

## Match System to Function
1. Circulatory: ___
2. Respiratory: ___
3. Digestive: ___
4. Nervous: ___
5. Immune: ___

A) Gas exchange
B) Breaks down food
C) Fights infection
D) Transports blood
E) Sends messages

## Organ Identification
Which system?
1. Heart: ___
2. Lungs: ___
3. Brain: ___
4. Stomach: ___
5. White blood cells: ___

## Path of Air
Order: Alveoli, Nose, Bronchi, Trachea
1. ___
2. ___
3. ___
4. ___

## Homeostasis Examples
What does the body regulate?
1. Temperature: ___ °C
2. Blood glucose: ___
3. Blood pH: ___

## Answers
Match: D, A, B, E, C
Systems: Circulatory, Respiratory, Nervous, Digestive, Immune
Air path: Nose, Trachea, Bronchi, Alveoli
Homeostasis: 37, ~100 mg/dL, 7.4`,
      objectives: ['Match systems to functions', 'Identify organ locations', 'Give homeostasis examples']
    },
    mastery: {
      title: 'Body Systems Mastery',
      description: 'Master body systems',
      content: `# Body Systems Mastery

## System Connections
**Exercise example:**
1. Nervous: Brain signals muscles
2. Muscular: Muscles contract
3. Skeletal: Bones move
4. Respiratory: Breathing increases
5. Circulatory: Heart pumps faster
6. Endocrine: Adrenaline released

## Feedback Loops
**Negative feedback:** Reverses change (most common)
- Body temp rises → Sweating → Temp drops

**Positive feedback:** Amplifies change
- Labor contractions → Oxytocin → More contractions

## Disorders
| System | Disorder |
|--------|----------|
| Circulatory | Heart disease |
| Respiratory | Asthma |
| Digestive | Ulcers |
| Nervous | Parkinson's |
| Immune | Allergies, HIV |
| Endocrine | Diabetes |

## Case Study
Patient symptoms: fatigue, frequent urination, thirst.
1. Which system likely affected?
2. What hormone might be involved?
3. What condition might this indicate?

## Answers
1. Endocrine
2. Insulin
3. Diabetes`,
      objectives: ['Connect multiple systems', 'Explain feedback mechanisms', 'Apply to medical scenarios']
    }
  }
};

export default biologyContent;

// Vocational-Technical Lesson Content
import { LessonContent } from '../lessonContentTypes';

const vocationalContent: Record<string, LessonContent> = {
  // ============================================
  // AUTOMOTIVE TECHNOLOGY
  // ============================================
  'voc-auto-safety': {
    intro: {
      title: 'Shop Safety',
      description: 'Essential safety practices in automotive repair',
      content: `# Automotive Shop Safety

## Why Safety Matters
Automotive shops contain many hazards. Proper safety knowledge prevents injuries and saves lives.

## Personal Protective Equipment (PPE)

### Safety Glasses
- Always wear when working
- Protect from flying debris, chemicals
- Must meet ANSI Z87.1 standard

### Work Gloves
- Protect hands from cuts, burns, chemicals
- Use correct type for the task
- Remove when operating machinery

### Steel-Toe Boots
- Protect feet from falling objects
- Non-slip soles for oil spills
- Required in most shops

### Hearing Protection
- Use around loud equipment
- Earplugs or earmuffs
- Prevents long-term hearing damage

## Shop Hazards

### Fire Hazards
- Gasoline and flammable liquids
- Electrical sparks
- Hot exhaust components
- Keep fire extinguisher accessible

### Chemical Hazards
- Brake fluid, antifreeze, oils
- Battery acid
- Read Safety Data Sheets (SDS)
- Proper storage and disposal

### Physical Hazards
- Lifting heavy parts
- Running engines
- Hot surfaces
- Moving vehicle parts

## Safe Work Practices
1. Keep work area clean
2. Use proper tools for the job
3. Never work alone on dangerous tasks
4. Report all injuries immediately
5. Know emergency procedures`,
      objectives: ['Identify required PPE', 'Recognize shop hazards', 'Apply safe work practices']
    },
    practice: {
      title: 'Shop Safety Practice',
      description: 'Apply safety knowledge',
      content: `# Shop Safety Practice

## PPE Matching
Match the PPE to the task:
1. Grinding metal ___ a. Chemical gloves
2. Handling battery acid ___ b. Hearing protection
3. Using impact wrench ___ c. Face shield
4. Welding ___ d. Safety glasses

## Hazard Identification
List the hazards in each scenario:
1. Changing oil with engine running:
2. Using a floor jack without jack stands:
3. Spray painting without ventilation:

## Safety Checklist
Create a pre-work safety checklist:
[ ] _______________
[ ] _______________
[ ] _______________
[ ] _______________
[ ] _______________

## Scenario Analysis
What's wrong in this situation?
*A technician is grinding a brake rotor wearing safety glasses but no gloves, with rags on the floor nearby.*

Issues: _______________
Corrections: _______________

## Fire Extinguisher Practice
Match the fire class to its fuel:
Class A ___ a. Electrical
Class B ___ b. Ordinary combustibles
Class C ___ c. Flammable liquids

## Answers
PPE: 1-d, 2-a, 3-b, 4-c
Fire: A-b, B-c, C-a`,
      objectives: ['Match PPE to tasks', 'Identify hazards', 'Apply safety procedures']
    },
    mastery: {
      title: 'Safety Certification',
      description: 'Demonstrate comprehensive safety knowledge',
      content: `# Safety Mastery

## OSHA Requirements
- Right to a safe workplace
- Right to information about hazards
- Right to report unsafe conditions

## Emergency Procedures

### Fire Response
1. Alert others
2. Activate fire alarm
3. Evacuate if needed
4. Use extinguisher only if safe
5. Call 911

### Chemical Spill
1. Alert others
2. Contain if safe
3. Consult SDS
4. Use proper cleanup materials
5. Dispose properly

### Injury Response
1. Ensure scene is safe
2. Call for help
3. Apply first aid if trained
4. Do not move injured person
5. Document incident

## Lock Out / Tag Out (LOTO)
Prevents accidental equipment start:
1. Notify affected employees
2. Shut down equipment
3. Isolate energy sources
4. Apply lock and tag
5. Verify isolation
6. Perform work
7. Remove locks in reverse order

## Lifting Techniques
- Bend at knees, not waist
- Keep load close to body
- Lift with legs
- Don't twist while lifting
- Get help for heavy objects

## Safety Assessment
Evaluate this shop setup:
- Fire extinguisher by exit
- SDS binder available
- PPE station stocked
- Emergency contacts posted
- First aid kit accessible

What's missing?

## Certification Quiz
Complete 20-question safety test with 80% minimum to pass.`,
      objectives: ['Understand OSHA requirements', 'Execute emergency procedures', 'Demonstrate comprehensive safety knowledge']
    }
  },

  'voc-auto-tools': {
    intro: {
      title: 'Hand Tools and Equipment',
      description: 'Learn to identify and use automotive tools',
      content: `# Hand Tools and Equipment

## Basic Hand Tools

### Wrenches
- **Open-end wrench:** Two open jaws, different sizes each end
- **Box-end wrench:** Enclosed ends, better grip
- **Combination wrench:** One open, one box end
- **Adjustable wrench:** Fits various sizes

### Socket Sets
- Ratchet handle
- Various socket sizes
- Extensions and universal joints
- Deep sockets for long bolts

### Screwdrivers
- **Flathead:** Slotted screws
- **Phillips:** Cross-head screws
- **Torx:** Star pattern
- **Hex/Allen:** Hexagonal recesses

### Pliers
- Slip-joint pliers
- Needle-nose pliers
- Locking pliers (Vise-Grips)
- Diagonal cutters

## Measuring Tools

### Feeler Gauges
- Measure small gaps
- Set valve clearances
- Check spark plug gaps

### Micrometers
- Precision measurement
- Measure to 0.001 inch
- Inside and outside types

### Dial Indicators
- Measure runout
- Check shaft straightness
- Precision alignment

## Shop Equipment

### Floor Jack and Jack Stands
- Lift vehicle safely
- NEVER work under jack alone
- Always use jack stands

### Air Compressor
- Powers pneumatic tools
- Check pressure regularly
- Drain water from tank

### Diagnostic Equipment
- OBD-II scanner
- Multimeter
- Battery tester`,
      objectives: ['Identify common hand tools', 'Select appropriate tools', 'Use measuring instruments']
    },
    practice: {
      title: 'Tools Practice',
      description: 'Tool identification and selection',
      content: `# Tools Practice

## Tool Identification
Name each tool:
1. Has ratcheting head and accepts sockets: ___
2. Adjustable wrench with locking mechanism: ___
3. Measures small gaps in thousandths: ___
4. Star-shaped screwdriver pattern: ___

## Tool Selection
Which tool would you use?
1. Remove a stuck bolt: ___
2. Measure brake rotor thickness: ___
3. Check spark plug gap: ___
4. Remove a cotter pin: ___
5. Tighten alternator bolt: ___

## Metric vs. Standard
Identify if metric (M) or standard (S):
1. 10mm socket ___
2. 1/2 inch wrench ___
3. 8mm Allen key ___
4. 7/16 inch socket ___

## Safety Scenario
What's wrong with each situation?
1. Using a screwdriver as a pry bar
2. Using a pipe for more leverage on a wrench
3. Hitting a wrench with a hammer

## Equipment Setup
Number the steps to safely lift a vehicle:
___ Lower vehicle onto jack stands
___ Place jack stands under frame
___ Raise vehicle with floor jack
___ Position jack at lift point
___ Shake vehicle to verify stability
___ Lower and remove floor jack

## Answers
Tool ID: 1-Ratchet, 2-Vise-grip, 3-Feeler gauge, 4-Torx
Metric: 1-M, 2-S, 3-M, 4-S
Lift order: 4, 3, 2, 1, 6, 5`,
      objectives: ['Identify tools correctly', 'Select appropriate tools', 'Follow proper procedures']
    },
    mastery: {
      title: 'Tools Mastery',
      description: 'Advanced tool knowledge and care',
      content: `# Tools Mastery

## Torque Specifications

### Using a Torque Wrench
1. Set desired torque value
2. Attach correct socket
3. Apply steady pressure
4. Stop when click is heard/felt
5. Do not over-tighten

### Common Torque Values
- Lug nuts: 80-100 ft-lbs (varies)
- Spark plugs: 15-20 ft-lbs
- Oil drain plug: 25-35 ft-lbs
- Always check specifications

## Tool Care and Maintenance

### Hand Tools
- Clean after use
- Store properly
- Inspect for damage
- Replace worn tools

### Power Tools
- Check cords/hoses
- Maintain lubrication
- Follow service intervals
- Store safely

### Measuring Tools
- Calibrate regularly
- Handle carefully
- Store in cases
- Protect from damage

## Specialized Tools

### Engine Tools
- Compression tester
- Timing light
- Valve spring compressor
- Harmonic balancer puller

### Electrical Tools
- Multimeter
- Test light
- Wire crimpers
- Terminal release tools

### Brake Tools
- Caliper piston tool
- Brake line flaring kit
- Brake bleeder kit
- Drum brake tools

## Tool Organization

### Tool Box Setup
- Commonly used tools accessible
- Group similar tools together
- Label drawers
- Inventory regularly

## Assessment
List the tools needed for:
1. Brake pad replacement
2. Spark plug change
3. Oil change
4. Battery replacement`,
      objectives: ['Use torque wrenches correctly', 'Maintain tools properly', 'Select specialized tools']
    }
  },

  'voc-auto-engines': {
    intro: {
      title: 'Engine Fundamentals',
      description: 'Understanding how engines work',
      content: `# Engine Fundamentals

## Four-Stroke Engine Cycle

### 1. Intake Stroke
- Piston moves down
- Intake valve opens
- Air-fuel mixture enters cylinder
- Intake valve closes

### 2. Compression Stroke
- Piston moves up
- Both valves closed
- Mixture compressed
- Increases pressure and temperature

### 3. Power Stroke
- Spark plug fires
- Mixture ignites
- Expanding gases push piston down
- Produces power

### 4. Exhaust Stroke
- Piston moves up
- Exhaust valve opens
- Burned gases expelled
- Cycle repeats

## Engine Components

### Block and Head
- **Block:** Main structure, contains cylinders
- **Head:** Covers cylinders, contains valves
- **Head gasket:** Seals between block and head

### Pistons and Crankshaft
- **Pistons:** Move up and down in cylinders
- **Connecting rods:** Link pistons to crankshaft
- **Crankshaft:** Converts linear motion to rotational

### Valvetrain
- **Camshaft:** Opens and closes valves
- **Valves:** Control intake and exhaust flow
- **Timing chain/belt:** Synchronizes cam and crank

## Engine Configurations
- **Inline:** Cylinders in a row
- **V-type:** Cylinders in V shape
- **Flat/Boxer:** Horizontally opposed cylinders`,
      objectives: ['Explain four-stroke cycle', 'Identify engine components', 'Understand engine configurations']
    },
    practice: {
      title: 'Engine Practice',
      description: 'Apply engine knowledge',
      content: `# Engine Practice

## Four-Stroke Cycle
Label each stroke:
1. Piston moves down, intake valve open: ___
2. Both valves closed, piston moves up: ___
3. Spark plug fires, piston moves down: ___
4. Piston moves up, exhaust valve open: ___

## Component Matching
Match the component to its function:
1. Crankshaft ___ a. Opens/closes valves
2. Camshaft ___ b. Seals combustion chamber
3. Piston rings ___ c. Converts linear to rotational motion
4. Head gasket ___ d. Seals between block and head

## Problem Solving
What might cause each symptom?
1. Blue smoke from exhaust:
2. White smoke (coolant smell):
3. Engine knocking:
4. Low compression:

## Engine Math
A 4-cylinder engine fires in order 1-3-4-2.
If cylinder 1 is on power stroke, what stroke is:
- Cylinder 2: ___
- Cylinder 3: ___
- Cylinder 4: ___

## Diagram Activity
Draw and label a simple piston/cylinder assembly:
- Piston
- Piston rings
- Connecting rod
- Cylinder wall
- Combustion chamber

## Answers
Strokes: 1-Intake, 2-Compression, 3-Power, 4-Exhaust
Matching: 1-c, 2-a, 3-b, 4-d`,
      objectives: ['Sequence engine strokes', 'Match components to functions', 'Diagnose basic problems']
    },
    mastery: {
      title: 'Engine Mastery',
      description: 'Advanced engine knowledge',
      content: `# Engine Mastery

## Engine Performance Factors

### Compression Ratio
- Higher ratio = more power and efficiency
- Limited by fuel octane and detonation
- Typical: 9:1 to 12:1

### Valve Timing
- Determines when valves open/close
- Affects power band
- Variable valve timing (VVT) optimizes performance

### Air/Fuel Ratio
- Stoichiometric: 14.7:1 (gasoline)
- Rich: More fuel (cold start, power)
- Lean: More air (economy, emissions)

## Lubrication System

### Oil Functions
- Reduces friction
- Cools components
- Seals piston rings
- Cleans engine internals

### Oil Flow
Pump → Filter → Galleries → Bearings → Return

### Oil Specifications
- Viscosity: 5W-30, 0W-20, etc.
- API rating: SN, SP
- Manufacturer specifications

## Cooling System

### Components
- Radiator
- Water pump
- Thermostat
- Hoses
- Coolant

### Operation
- Coolant circulates through engine
- Absorbs heat from combustion
- Releases heat through radiator
- Thermostat regulates temperature

## Diagnostics

### Compression Test
- Tests cylinder sealing
- Low reading indicates problems
- Compare cylinders

### Leak-Down Test
- Pressurize cylinder
- Listen for leaks
- Identifies leak location

## Engine Rebuild Considerations
- Measuring wear
- Machining surfaces
- Replacing worn parts
- Proper torque sequences`,
      objectives: ['Understand performance factors', 'Explain engine systems', 'Perform basic diagnostics']
    }
  },

  'voc-auto-brakes': {
    intro: {
      title: 'Brake Systems',
      description: 'Understanding automotive brake systems',
      content: `# Brake Systems

## Brake System Basics

### How Brakes Work
- Convert kinetic energy to heat
- Friction creates stopping force
- Hydraulic system multiplies force

### Hydraulic Principles
- Fluid cannot be compressed
- Pressure applied equally throughout system
- Small force creates large stopping power

## Disc Brakes

### Components
- **Rotor:** Spinning disc attached to wheel
- **Caliper:** Holds brake pads, contains pistons
- **Brake pads:** Friction material that contacts rotor
- **Caliper mounting bracket:** Attaches caliper to knuckle

### Operation
1. Driver presses brake pedal
2. Master cylinder creates pressure
3. Fluid pushes caliper pistons
4. Pads squeeze rotor
5. Friction slows wheel

## Drum Brakes

### Components
- **Drum:** Cylinder attached to wheel
- **Wheel cylinder:** Contains pistons
- **Brake shoes:** Friction material
- **Springs and adjusters:** Keep shoes positioned

### Operation
1. Fluid pressure enters wheel cylinder
2. Pistons push shoes outward
3. Shoes contact inside of drum
4. Friction slows wheel

## Master Cylinder
- Converts pedal force to hydraulic pressure
- Dual circuit design for safety
- Reservoir stores brake fluid

## ABS (Anti-lock Braking System)
- Prevents wheel lockup
- Maintains steering control
- Uses wheel speed sensors
- Modulates brake pressure`,
      objectives: ['Explain brake system operation', 'Identify disc and drum components', 'Understand hydraulic principles']
    },
    practice: {
      title: 'Brake Systems Practice',
      description: 'Apply brake system knowledge',
      content: `# Brake Systems Practice

## Component Identification
Label each disc brake component:
1. Holds the brake pads: ___
2. Spinning disc: ___
3. Friction material: ___
4. Creates hydraulic pressure: ___

## Disc vs. Drum Comparison
| Feature | Disc | Drum |
|---------|------|------|
| Heat dissipation |  |  |
| Wet performance |  |  |
| Cost |  |  |
| Common location |  |  |

## Problem Diagnosis
What might cause each symptom?
1. Brake pedal goes to floor:
2. Squealing when braking:
3. Pulling to one side:
4. Pulsating brake pedal:

## Brake Inspection Checklist
Check each item:
[ ] Pad/shoe thickness
[ ] Rotor/drum condition
[ ] Fluid level
[ ] Brake lines
[ ] Caliper operation
[ ] ABS light status

## Hydraulic Calculation
If master cylinder bore is 1" and caliper piston is 2":
What is the force multiplication?

## Safety Questions
1. Why should you never reuse brake fluid?
2. What happens if air enters the brake system?
3. Why must both sides be serviced together?

## Answers
Components: 1-Caliper, 2-Rotor, 3-Brake pad, 4-Master cylinder
Disc vs Drum: Disc better at heat/wet, Drum cheaper, Front usually disc`,
      objectives: ['Identify components', 'Compare brake types', 'Diagnose brake problems']
    },
    mastery: {
      title: 'Brake Systems Mastery',
      description: 'Advanced brake service knowledge',
      content: `# Brake Systems Mastery

## Brake Service Procedures

### Pad Replacement
1. Safely raise and support vehicle
2. Remove wheel
3. Remove caliper bolts
4. Support caliper (don't hang by hose)
5. Remove old pads
6. Compress piston
7. Install new pads
8. Reinstall caliper
9. Pump brake pedal before driving

### Rotor Service
- Measure thickness
- Check runout
- Resurface or replace
- Clean before installation

### Brake Bleeding
Purpose: Remove air from system

**Manual Bleeding:**
1. Fill reservoir
2. Start at farthest wheel
3. Open bleeder valve
4. Have assistant pump pedal
5. Close valve
6. Repeat until no bubbles

**Pressure Bleeding:**
- Faster method
- Requires special equipment
- Consistent results

## Brake Fluid

### Types
- DOT 3: Standard, absorbs moisture
- DOT 4: Higher boiling point
- DOT 5: Silicone, not compatible with others

### Maintenance
- Check level monthly
- Flush every 2-3 years
- Never mix types

## ABS Diagnostics
- Scan for codes
- Check wheel speed sensors
- Inspect tone rings
- Verify modulator operation

## Performance Brakes
- Larger rotors
- Multi-piston calipers
- Performance pads
- Stainless steel lines

## Practical Assessment
Perform complete brake inspection and service on training vehicle:
- Measure components
- Evaluate condition
- Recommend service
- Perform pad replacement`,
      objectives: ['Perform brake service', 'Bleed brake systems', 'Diagnose ABS issues']
    }
  },

  'voc-auto-electrical': {
    intro: {
      title: 'Automotive Electrical',
      description: 'Understanding vehicle electrical systems',
      content: `# Automotive Electrical Systems

## Basic Electrical Theory

### Electricity Basics
- **Voltage (V):** Electrical pressure
- **Current (A):** Flow of electrons
- **Resistance (Ω):** Opposition to flow
- **Ohm's Law:** V = I × R

### Circuit Types
- **Series:** One path, components in line
- **Parallel:** Multiple paths
- **Series-parallel:** Combination

## Starting System

### Components
- Battery
- Starter motor
- Starter solenoid
- Ignition switch
- Neutral safety switch

### Operation
1. Key turned to start
2. Current flows to solenoid
3. Solenoid engages starter gear
4. Starter motor cranks engine

## Charging System

### Components
- Alternator
- Voltage regulator
- Battery
- Charge indicator

### Operation
1. Engine drives alternator
2. Alternator generates AC
3. Rectifier converts to DC
4. Regulator controls output
5. Charges battery, powers vehicle

## Battery

### Construction
- Lead plates and acid
- 12.6V fully charged
- Provides starting current
- Stabilizes electrical system

### Testing
- Voltage test: 12.4V+ is good
- Load test: Capacity check
- State of charge

## Wiring and Circuits
- Color-coded wires
- Fuses protect circuits
- Relays control high-current devices
- Grounds complete circuits`,
      objectives: ['Understand electrical basics', 'Explain starting and charging systems', 'Test batteries']
    },
    practice: {
      title: 'Electrical Practice',
      description: 'Apply electrical knowledge',
      content: `# Electrical Practice

## Ohm's Law Calculations
1. If V = 12V and R = 4Ω, what is I?
2. If I = 3A and R = 4Ω, what is V?
3. If V = 12V and I = 2A, what is R?

## Component Matching
1. Generates electricity ___ a. Battery
2. Stores electricity ___ b. Alternator
3. Cranks engine ___ c. Fuse
4. Protects circuits ___ d. Starter

## Diagnosis Scenarios
What would you check?
1. Click but no crank:
2. Slow cranking:
3. Battery dies overnight:
4. Dim headlights at idle:

## Circuit Analysis
Draw a simple circuit with:
- Battery
- Fuse
- Switch
- Light bulb
- Ground

## Multimeter Practice
What setting would you use to measure:
1. Battery voltage: ___
2. Fuse continuity: ___
3. Starter current draw: ___
4. Wire resistance: ___

## Wiring Diagram
Read a simple wiring diagram and trace:
- Power source to load
- Ground path
- Switch location
- Fuse protection

## Answers
Ohm's Law: 1) 3A, 2) 12V, 3) 6Ω
Matching: 1-b, 2-a, 3-d, 4-c`,
      objectives: ['Calculate using Ohm\'s Law', 'Diagnose electrical problems', 'Use multimeter correctly']
    },
    mastery: {
      title: 'Electrical Mastery',
      description: 'Advanced electrical diagnostics',
      content: `# Electrical Mastery

## Advanced Diagnostics

### Voltage Drop Testing
- Measures resistance in circuit
- Test under load
- Maximum 0.5V drop acceptable
- Find bad connections

### Parasitic Draw Testing
1. Disconnect battery negative
2. Connect ammeter in series
3. Wait for modules to sleep
4. Normal draw: 30-50mA
5. Pull fuses to isolate draw

### CAN Bus Systems
- Controller Area Network
- Modules communicate digitally
- Reduced wiring
- Requires scan tool

## Lighting Systems

### Headlight Types
- Halogen
- HID (Xenon)
- LED
- Adaptive systems

### Circuit Protection
- Fuses: Melt and open
- Fusible links: Higher current
- Circuit breakers: Resettable

## Computer Systems

### Inputs
- Sensors provide data
- Switches indicate position
- Modules share information

### Outputs
- Actuators controlled by computer
- Relays control high current
- PWM signals vary output

### Diagnostics
- OBD-II connector
- Scan tool access
- DTCs guide diagnosis
- Data stream analysis

## Project
Diagnose and repair a no-start vehicle:
1. Verify complaint
2. Check battery condition
3. Test starting circuit
4. Test charging system
5. Document findings
6. Make repairs
7. Verify repair`,
      objectives: ['Perform voltage drop tests', 'Diagnose parasitic draws', 'Understand computer systems']
    }
  },

  'voc-auto-diagnostics': {
    intro: {
      title: 'Diagnostics and Troubleshooting',
      description: 'Systematic approach to vehicle diagnosis',
      content: `# Diagnostics and Troubleshooting

## Diagnostic Process

### Step 1: Verify the Concern
- Listen to customer description
- Ask clarifying questions
- Duplicate the problem
- Document symptoms

### Step 2: Gather Information
- Service history
- Technical Service Bulletins (TSBs)
- Diagnostic Trouble Codes (DTCs)
- Vehicle data

### Step 3: Evaluate and Research
- Analyze symptoms
- Research possible causes
- Prioritize testing
- Develop a plan

### Step 4: Perform Tests
- Follow logical sequence
- Use appropriate tools
- Compare to specifications
- Document results

### Step 5: Determine Root Cause
- Evaluate test results
- Identify failed component
- Verify diagnosis
- Consider related issues

### Step 6: Repair and Verify
- Make repairs
- Clear codes
- Test drive
- Confirm fix

## OBD-II Diagnostics

### System Overview
- Standardized connector
- Common protocol
- Required since 1996
- Monitors emissions systems

### Diagnostic Trouble Codes
- Format: P0XXX
- P = Powertrain
- First digit: 0 = Generic, 1 = Manufacturer
- Categories: Fuel, ignition, emissions

### Data Stream
- Live sensor data
- Compare to specifications
- Identify abnormal readings`,
      objectives: ['Follow diagnostic process', 'Use OBD-II systems', 'Interpret trouble codes']
    },
    practice: {
      title: 'Diagnostics Practice',
      description: 'Apply diagnostic skills',
      content: `# Diagnostics Practice

## Diagnostic Process
Put steps in order:
___ Perform tests
___ Verify concern
___ Repair and verify
___ Research and plan
___ Determine root cause
___ Gather information

## Code Interpretation
What system does each code affect?
1. P0300: ___
2. P0171: ___
3. P0420: ___
4. P0442: ___

## Scenario Diagnosis
**Customer states:** "Check engine light on, runs rough at idle"

1. What would you verify?
2. What codes might be present?
3. What tests would you perform?
4. What are likely causes?

## Data Analysis
Analyze these readings:
- Short-term fuel trim: +25%
- Long-term fuel trim: +18%
- O2 sensor: Stuck lean

What does this indicate?
What would you check?

## Tool Selection
What tool for each task?
1. Read trouble codes: ___
2. Check fuel pressure: ___
3. View live data: ___
4. Check for vacuum leaks: ___

## Answers
Process order: 4, 1, 6, 3, 5, 2
Codes: 1-Misfire, 2-Fuel system, 3-Catalyst, 4-EVAP`,
      objectives: ['Sequence diagnostic steps', 'Interpret codes', 'Analyze data']
    },
    mastery: {
      title: 'Diagnostics Mastery',
      description: 'Advanced diagnostic techniques',
      content: `# Diagnostics Mastery

## Advanced Scan Tool Use

### Mode 6 Data
- Detailed test results
- Component test thresholds
- Trend analysis
- Predict failures

### Bi-Directional Controls
- Command components
- Test actuators
- Verify operation
- Isolate problems

## Oscilloscope Diagnostics

### Applications
- Sensor waveforms
- Ignition patterns
- Injector operation
- CAN bus signals

### Pattern Analysis
- Compare to known good
- Identify abnormalities
- Measure timing
- Detect noise

## System-Specific Diagnosis

### Engine Drivability
- Fuel system testing
- Ignition analysis
- Sensor verification
- Mechanical integrity

### Transmission
- Fluid condition
- Code analysis
- Line pressure
- Shift quality

### Emissions Systems
- EVAP testing
- Catalyst monitoring
- EGR operation
- Secondary air

## Case Studies

### Case 1: Misfire
Symptom: P0301 - Cylinder 1 misfire
Testing performed: ___
Root cause: ___
Repair: ___

### Case 2: No Start
Symptom: Cranks, no start
Testing performed: ___
Root cause: ___
Repair: ___

## Capstone Project
Complete a diagnosis from start to finish:
1. Document customer concern
2. Research and plan
3. Perform testing
4. Determine cause
5. Complete repair
6. Verify fix
7. Write report`,
      objectives: ['Use advanced scan features', 'Apply oscilloscope diagnostics', 'Complete complex diagnoses']
    }
  },

  // ============================================
  // WELDING
  // ============================================
  'voc-weld-safety': {
    intro: {
      title: 'Welding Safety',
      description: 'Essential safety for welding operations',
      content: `# Welding Safety

## Why Welding Safety Matters
Welding involves extreme heat, bright light, harmful fumes, and electrical hazards. Proper safety prevents serious injuries.

## Personal Protective Equipment

### Welding Helmet
- Auto-darkening or passive
- Shade 10-13 for arc welding
- Protects eyes and face
- Check for cracks

### Protective Clothing
- Leather or flame-resistant jacket
- Long pants without cuffs
- Leather boots (no tennis shoes)
- Welding gloves

### Respiratory Protection
- Welding respirator
- Proper ventilation
- Know your filler metals
- Watch for coatings

## Hazards

### Fire and Burns
- 10,000°F+ temperatures
- Sparks and spatter
- Hot metal stays hot
- Keep area clear of combustibles

### Electric Shock
- Primary shock: Can be fatal
- Secondary shock: Burns
- Check equipment condition
- Proper grounding

### Fumes and Gases
- Metal fumes
- Shielding gas displacement
- Coating decomposition
- Adequate ventilation essential

### Eye Damage
- "Arc flash" causes severe burns
- UV and infrared radiation
- Proper shade selection
- Protect bystanders

## Safe Work Practices
1. Inspect equipment before use
2. Ensure proper ventilation
3. Keep work area clean and dry
4. Use fire watch when required
5. Never weld in confined spaces without precautions`,
      objectives: ['Identify welding hazards', 'Select proper PPE', 'Apply safe work practices']
    },
    practice: {
      title: 'Welding Safety Practice',
      description: 'Apply welding safety knowledge',
      content: `# Welding Safety Practice

## PPE Selection
What PPE is needed for MIG welding mild steel?
[ ] Welding helmet
[ ] Safety glasses
[ ] Welding gloves
[ ] Leather jacket
[ ] Respirator
[ ] Steel-toe boots

## Hazard Identification
Match hazard to prevention:
1. Arc flash ___ a. Proper ventilation
2. Electrical shock ___ b. Fire watch
3. Fumes ___ c. Welding helmet
4. Fire ___ d. Insulated gloves

## Scenario Analysis
What's wrong in each situation?
1. Welding while standing in water
2. Welding galvanized steel without ventilation
3. Wearing synthetic fabric shirt

## Shade Selection
What shade for each process?
1. MIG welding (200A): ___
2. TIG welding (150A): ___
3. Stick welding (100A): ___
4. Oxy-fuel cutting: ___

## Emergency Response
What would you do if:
1. Someone gets arc flash?
2. A fire starts from sparks?
3. You smell unusual fumes?

## Workspace Setup
List 5 things to check before welding:
1. ___
2. ___
3. ___
4. ___
5. ___

## Answers
Hazard match: 1-c, 2-d, 3-a, 4-b
Shades: 1) 10-12, 2) 10-11, 3) 10-11, 4) 5-6`,
      objectives: ['Select appropriate PPE', 'Match hazards to controls', 'Respond to emergencies']
    },
    mastery: {
      title: 'Welding Safety Mastery',
      description: 'Comprehensive welding safety',
      content: `# Welding Safety Mastery

## Confined Space Welding

### Hazards
- Fume accumulation
- Oxygen displacement
- Limited escape
- Heat buildup

### Requirements
- Permit required
- Continuous ventilation
- Rescue plan
- Attendant outside
- Gas monitoring

## Hot Work Permits

### When Required
- Near combustibles
- In hazardous locations
- As required by facility

### Requirements
- Area inspection
- Fire watch
- Extinguisher ready
- Post-work monitoring

## Material Safety

### Hazardous Coatings
- Galvanized: Zinc fumes
- Painted: Lead, chemicals
- Chrome: Hexavalent chromium
- Cadmium: Extremely toxic

### Precautions
- Remove coatings when possible
- Maximum ventilation
- Appropriate respirator
- Know your materials

## Equipment Safety

### Gas Cylinders
- Secure upright
- Proper regulators
- Check for leaks
- Close valves after use

### Electrical
- Inspect cables
- Proper grounding
- Avoid wet conditions
- Disconnect when not in use

## OSHA Standards
- 29 CFR 1910.252
- Ventilation requirements
- PPE standards
- Fire prevention

## Assessment
Complete a workplace safety audit:
- PPE compliance
- Ventilation adequacy
- Fire prevention
- Equipment condition
- Training records`,
      objectives: ['Handle confined space welding', 'Understand hot work permits', 'Apply OSHA standards']
    }
  },

  'voc-weld-mig': {
    intro: {
      title: 'MIG Welding',
      description: 'Gas Metal Arc Welding fundamentals',
      content: `# MIG Welding (GMAW)

## What is MIG Welding?
MIG = Metal Inert Gas
GMAW = Gas Metal Arc Welding
- Uses continuous wire electrode
- Shielding gas protects weld
- Versatile and productive

## Equipment

### Welding Machine
- Provides welding current
- Controls wire feed speed
- Constant voltage output

### Wire Feeder
- Feeds electrode wire
- Speed controls heat input
- Drive rolls grip wire

### MIG Gun
- Carries wire, gas, current
- Trigger starts process
- Contact tip transfers current
- Nozzle directs gas

### Gas System
- Cylinder or bulk supply
- Regulator controls flow
- Common gases: CO2, Argon mixes

## Process Variables

### Wire Feed Speed
- Controls amperage
- Higher speed = more heat
- Match to material thickness

### Voltage
- Controls arc length
- Higher voltage = wider bead
- Affects penetration

### Travel Speed
- How fast you move
- Affects bead size
- Affects penetration

### Gas Flow
- 25-35 CFH typical
- Too low = porosity
- Too high = turbulence

## Basic Technique
1. Set machine parameters
2. Hold gun 15° angle
3. Keep consistent distance
4. Move at steady speed
5. Watch the puddle`,
      objectives: ['Identify MIG equipment', 'Understand process variables', 'Apply basic technique']
    },
    practice: {
      title: 'MIG Welding Practice',
      description: 'Develop MIG welding skills',
      content: `# MIG Welding Practice

## Equipment Identification
Label the parts of a MIG system:
1. Wire spool location: ___
2. Shielding gas connection: ___
3. Ground clamp purpose: ___
4. Contact tip function: ___

## Parameter Settings
For 1/8" mild steel with 0.030" wire:
- Wire feed speed: ___
- Voltage: ___
- Gas flow: ___

## Technique Practice

### Stringer Beads
- Run straight beads on flat plate
- Maintain consistent travel speed
- Watch puddle formation

### Weave Patterns
- Practice zigzag pattern
- Control width with pauses
- Maintain consistent pattern

## Troubleshooting
What causes each defect?
1. Porosity (holes in weld):
2. Lack of fusion:
3. Excessive spatter:
4. Burn-through:

## Joint Practice
Weld these joint types:
1. Butt joint
2. T-joint (fillet)
3. Lap joint
4. Corner joint

## Self-Evaluation
Rate your welds:
[ ] Uniform width
[ ] Consistent height
[ ] Good fusion
[ ] No defects

## Answers
Porosity: contamination, gas problems
Lack of fusion: too cold, wrong angle
Spatter: voltage too high, wrong polarity
Burn-through: too hot, too slow`,
      objectives: ['Set appropriate parameters', 'Practice basic beads', 'Troubleshoot defects']
    },
    mastery: {
      title: 'MIG Welding Mastery',
      description: 'Advanced MIG techniques',
      content: `# MIG Welding Mastery

## Advanced Techniques

### Position Welding
**Flat (1G/1F):** Easiest position
**Horizontal (2G/2F):** Control sag
**Vertical (3G/3F):** Up or down
**Overhead (4G/4F):** Most difficult

### Multi-Pass Welding
- Root pass
- Fill passes
- Cap pass
- Proper interpass cleaning

## Metal Transfer Modes

### Short Circuit
- Low heat input
- Good for thin material
- All positions
- More spatter

### Spray Transfer
- High heat input
- Smooth, spatter-free
- Flat and horizontal only
- Higher productivity

### Pulse Transfer
- Controlled heat
- All positions
- Less distortion
- More complex setup

## Material Considerations

### Aluminum
- Pure argon gas
- Push technique
- Higher wire speed
- Clean material thoroughly

### Stainless Steel
- Tri-mix gas
- Lower heat input
- Avoid contamination
- Proper interpass temps

## Quality Standards
- AWS D1.1 (Structural Steel)
- Visual inspection criteria
- Destructive testing
- Non-destructive testing

## Certification Preparation
Practice welds that meet:
- 3G vertical plate
- 3F vertical fillet
- Visual inspection passing
- Bend test passing`,
      objectives: ['Weld in all positions', 'Understand transfer modes', 'Meet quality standards']
    }
  },

  'voc-weld-tig': {
    intro: {
      title: 'TIG Welding',
      description: 'Gas Tungsten Arc Welding fundamentals',
      content: `# TIG Welding (GTAW)

## What is TIG Welding?
TIG = Tungsten Inert Gas
GTAW = Gas Tungsten Arc Welding
- Uses non-consumable tungsten electrode
- Filler metal added separately
- Highest quality welds
- Most control

## Equipment

### Power Source
- AC/DC capability
- Constant current output
- High-frequency start

### TIG Torch
- Holds tungsten electrode
- Carries shielding gas
- Water or air cooled

### Tungsten Electrodes
- 2% Thoriated (red): DC
- 2% Ceriated (gray): AC/DC
- Pure (green): AC aluminum

### Shielding Gas
- Pure argon most common
- Helium for deeper penetration
- No flux required

### Filler Rods
- Added by hand
- Match base metal
- Various diameters

## Process Basics

### AC vs DC
- **DCEN:** For steel, stainless
- **AC:** For aluminum, magnesium
- AC provides cleaning action

### Key Variables
- Amperage: Controls heat
- Arc length: 1/8" typical
- Travel speed: Affects bead
- Gas flow: 15-25 CFH

## Basic Technique
1. Sharp tungsten
2. Close arc length
3. Watch the puddle
4. Add filler to front edge
5. Maintain gas coverage`,
      objectives: ['Identify TIG equipment', 'Understand AC vs DC', 'Apply basic technique']
    },
    practice: {
      title: 'TIG Welding Practice',
      description: 'Develop TIG welding skills',
      content: `# TIG Welding Practice

## Equipment Setup
Prepare for TIG welding steel:
1. Select tungsten type: ___
2. Set polarity: ___
3. Set amperage range: ___
4. Set gas flow: ___

## Tungsten Preparation
Draw proper tungsten point for:
1. DC steel welding:
2. AC aluminum welding:

## Practice Exercises

### Exercise 1: Arc Control
- Strike arc and maintain 1/8" length
- Practice on scrap
- No filler yet

### Exercise 2: Puddle Control
- Create molten puddle
- Move along plate
- Maintain consistent width

### Exercise 3: Filler Addition
- Add filler to puddle
- Dip, don't drag
- Maintain rhythm

## Technique Checklist
[ ] Proper torch angle
[ ] Consistent arc length
[ ] Smooth filler addition
[ ] Good gas coverage
[ ] No tungsten contamination

## Troubleshooting
Identify the cause:
1. Gray, oxidized weld:
2. Tungsten in weld:
3. Inconsistent bead:
4. Porosity:

## Answers
Setup: 2% thoriated, DCEN, 80-120A (for 1/8"), 15-20 CFH
Causes: 1-inadequate gas, 2-dipped in puddle, 3-inconsistent travel/heat, 4-contamination`,
      objectives: ['Set up TIG equipment', 'Practice coordination', 'Troubleshoot defects']
    },
    mastery: {
      title: 'TIG Welding Mastery',
      description: 'Advanced TIG techniques',
      content: `# TIG Welding Mastery

## Aluminum Welding

### Preparation
- Clean thoroughly
- Remove oxide layer
- Use stainless brush
- Wipe with acetone

### AC Balance Control
- Adjusts cleaning vs. penetration
- More cleaning: rougher weld
- More penetration: smoother but dirtier

### Technique
- Push angle
- Keep puddle bright
- Don't pause too long
- Proper filler size

## Stainless Steel

### Considerations
- Control heat input
- Avoid sugaring (oxidation)
- Back purge critical
- Proper interpass temp

### Gas Coverage
- Argon shielding
- Back purging required
- Use trailing shield if needed

## Pipe Welding

### Positions
- 1G: Pipe rotates
- 2G: Pipe vertical, fixed
- 5G: Pipe horizontal, fixed
- 6G: 45° angle, fixed

### Technique
- Open root
- Walk the cup
- Multiple passes

## Advanced Skills

### Walking the Cup
- Rest cup on work
- Rotate torch to travel
- Consistent movement
- Used in pipe welding

### Pulse Settings
- Background current
- Peak current
- Pulse frequency
- Duty cycle

## Certification
Prepare for pipe welding certification:
- Practice 6G position
- Root, fill, cap passes
- Visual inspection
- Bend testing`,
      objectives: ['Weld aluminum with TIG', 'Perform pipe welding', 'Prepare for certification']
    }
  },

  'voc-weld-stick': {
    intro: {
      title: 'Stick Welding',
      description: 'Shielded Metal Arc Welding fundamentals',
      content: `# Stick Welding (SMAW)

## What is Stick Welding?
SMAW = Shielded Metal Arc Welding
- Uses consumable coated electrode
- Flux coating provides shielding
- Most versatile process
- Works outdoors

## Equipment

### Power Source
- AC or DC output
- Constant current
- Various amperage ranges
- Portable options available

### Electrode Holder (Stinger)
- Holds electrode
- Insulated handle
- Various sizes

### Ground Clamp
- Completes circuit
- Secure connection
- Clean contact point

## Electrode Selection

### AWS Classification
Example: E7018
- E = Electrode
- 70 = 70,000 PSI tensile strength
- 1 = All position
- 8 = Low hydrogen, AC/DC

### Common Electrodes
| Type | Use | Characteristics |
|------|-----|-----------------|
| E6010 | Root passes | Deep penetration, DC only |
| E6011 | General | DC or AC, versatile |
| E6013 | Light work | Easy arc, less penetration |
| E7018 | Structural | Low hydrogen, strong |

## Basic Technique

### Starting the Arc
- Scratch start: Like striking a match
- Tap start: Tap and lift

### Maintaining the Arc
- Arc length = electrode diameter
- Listen for consistent crackle
- Watch puddle, not arc

### Travel
- 15-20° drag angle
- Consistent speed
- Watch for proper tie-in`,
      objectives: ['Identify stick welding equipment', 'Select appropriate electrodes', 'Apply basic technique']
    },
    practice: {
      title: 'Stick Welding Practice',
      description: 'Develop stick welding skills',
      content: `# Stick Welding Practice

## Electrode Selection
Choose the best electrode:
1. Pipe root pass: ___
2. Structural steel fillet: ___
3. Sheet metal repair: ___
4. General purpose: ___

## Parameter Settings
For 1/8" E7018 on 3/8" plate:
- Amperage range: ___
- Polarity: ___

## Technique Practice

### Exercise 1: Starting Arc
- Practice scratch start
- Practice tap start
- Maintain 1" arc length initially

### Exercise 2: Stringer Beads
- Run beads across plate
- Maintain consistent arc length
- Watch for uniform width

### Exercise 3: Restarts
- Stop in middle of bead
- Clean crater
- Restart with overlap

## Troubleshooting
What causes each problem?
1. Electrode sticking:
2. Arc blow:
3. Slag inclusions:
4. Undercut:

## Position Practice
Practice welds in:
1. Flat (1G)
2. Horizontal (2G)
3. Vertical up (3G)
4. Overhead (4G)

## Checklist
[ ] Consistent arc length
[ ] Proper travel speed
[ ] Complete slag removal
[ ] Good fusion
[ ] No defects

## Answers
Electrodes: 1-E6010, 2-E7018, 3-E6013, 4-E6011
7018 settings: 90-130A, DCEP
Problems: 1-amps too low, 2-magnetic effect, 3-poor cleaning, 4-amps too high/fast travel`,
      objectives: ['Select correct electrodes', 'Set parameters', 'Weld in all positions']
    },
    mastery: {
      title: 'Stick Welding Mastery',
      description: 'Advanced stick welding',
      content: `# Stick Welding Mastery

## Position Welding Techniques

### Vertical Up (3G)
- Weave pattern essential
- Shelf the puddle
- Pause at edges
- Control heat buildup

### Overhead (4G)
- Short arc crucial
- Fast travel
- Small puddle
- Fight gravity

## Pipe Welding

### Open Root Technique
- E6010 for root
- Key hole method
- Tie-in sides
- Watch for burn-through

### Fill and Cap
- E7018 for strength
- Stringer or weave
- Clean between passes
- Proper sequence

## Special Applications

### Cast Iron
- Preheat required
- Special electrodes (ENiFe)
- Control cooling
- Peening helps

### Hardfacing
- Build up worn parts
- Various alloys available
- Consider application
- Layer technique

## Quality Control

### Visual Inspection
- Uniform appearance
- No cracks
- No porosity
- Complete fusion

### Destructive Testing
- Bend tests
- Nick-break tests
- Macro examination

## Certification

### AWS D1.1 Requirements
- 3G and 4G plates
- 6G pipe
- Visual inspection
- Bend tests
- Document qualifications

### Test Preparation
- Practice in test position
- Time your welds
- Self-inspect before submission
- Know acceptance criteria`,
      objectives: ['Master position welding', 'Weld pipe joints', 'Prepare for certification']
    }
  },

  'voc-weld-blueprint': {
    intro: {
      title: 'Blueprint Reading',
      description: 'Interpreting welding blueprints and symbols',
      content: `# Blueprint Reading for Welders

## Why Blueprints Matter
- Communicate design intent
- Ensure proper construction
- Required for certification
- Standard across industry

## Blueprint Components

### Title Block
- Drawing name
- Part number
- Scale
- Material
- Revision history

### Views
- **Front view:** Main face
- **Top view:** From above
- **Side view:** From side
- **Section view:** Cut through

## Welding Symbols

### The Reference Line
- Horizontal line
- Arrow points to joint
- Information placed on/below line
- Arrow side vs. other side

### Basic Weld Symbols
| Symbol | Weld Type |
|--------|-----------|
| △ | Fillet |
| V | V-groove |
| ▽ | Bevel |
| ─ | Square groove |

### Symbol Location
- Below line = Arrow side
- Above line = Other side
- Both = Both sides

## Dimensions and Specifications

### Weld Size
- Number before symbol
- Indicates leg or throat size
- In inches or mm

### Weld Length
- Number after symbol
- Indicates continuous or intermittent
- Pitch for intermittent

### Supplementary Symbols
- Contour: Flush, convex, concave
- Field weld: Flag symbol
- All around: Circle at arrow`,
      objectives: ['Read basic blueprints', 'Interpret welding symbols', 'Understand dimensions']
    },
    practice: {
      title: 'Blueprint Reading Practice',
      description: 'Apply blueprint reading skills',
      content: `# Blueprint Reading Practice

## Symbol Identification
Draw the symbol for:
1. 1/4" fillet weld, arrow side
2. V-groove, both sides
3. 3/8" fillet, other side
4. Square groove, arrow side

## Interpret These Symbols
What do these welding symbols indicate?
(Draw symbols for students to interpret)

1. Weld type: ___
   Size: ___
   Location: ___

2. Weld type: ___
   Size: ___
   Location: ___

## Blueprint Analysis
Given a simple welded assembly drawing:
1. How many weld joints?
2. What type of welds?
3. What are the weld sizes?
4. Any special requirements?

## Dimension Reading
From a dimensioned drawing, find:
1. Overall length: ___
2. Material thickness: ___
3. Weld length: ___
4. Spacing (if intermittent): ___

## Symbol Construction
Draw complete welding symbols for:
1. 1/4" fillet both sides, 4" long
2. 1/2" V-groove, arrow side, with backup
3. 3/16" fillet, other side, all around
4. Square groove with 1/8" root opening

## True/False
1. Symbol below line = other side ___
2. Circle at arrow means all around ___
3. Flag means field weld ___
4. Tail contains special information ___

## Answers
T/F: 1-F, 2-T, 3-T, 4-T`,
      objectives: ['Identify weld symbols', 'Interpret blueprints', 'Construct symbols']
    },
    mastery: {
      title: 'Blueprint Reading Mastery',
      description: 'Advanced blueprint interpretation',
      content: `# Blueprint Reading Mastery

## Complex Welding Symbols

### Groove Welds with Details
- Root opening
- Groove angle
- Root face
- Radius for J and U grooves

### Combined Symbols
- Multiple welds at one joint
- Stacked symbols
- Reference to specifications

### Nondestructive Testing
- RT = Radiographic
- UT = Ultrasonic
- MT = Magnetic particle
- PT = Penetrant

## Welding Procedure Specifications (WPS)

### What It Contains
- Base metal type
- Filler metal classification
- Preheat requirements
- Interpass temperature
- Heat input limits
- Position qualified

### Using a WPS
- Match to application
- Follow all parameters
- Document compliance

## Complete Blueprint Analysis

### Project: Welded Frame
Given a complete set of drawings:
1. Bill of materials
2. Assembly sequence
3. All weld specifications
4. Dimensional accuracy
5. Quality requirements

### Steps
1. Review all sheets
2. Identify materials needed
3. Determine weld sequence
4. Note all weld specifications
5. Plan quality checks

## Practical Assessment

### Task 1: Symbol Test
Complete a comprehensive symbol identification test

### Task 2: Blueprint Interpretation
Given an actual fabrication drawing:
- List all materials
- Identify all welds
- Specify sizes and types
- Note special requirements

### Task 3: Create Symbols
Draw proper symbols for given weld descriptions`,
      objectives: ['Interpret complex symbols', 'Use welding procedures', 'Analyze complete drawings']
    }
  },

  // ============================================
  // CULINARY ARTS (Sample - abbreviated)
  // ============================================
  'voc-culinary-safety': {
    intro: {
      title: 'Kitchen Safety and Sanitation',
      description: 'Safe food handling and kitchen practices',
      content: `# Kitchen Safety and Sanitation

## Food Safety Basics

### The Danger Zone
- Temperature: 41°F - 135°F
- Bacteria multiply rapidly
- Keep hot foods hot (135°F+)
- Keep cold foods cold (41°F or below)

### Time and Temperature
- Don't leave food out more than 2 hours
- Cool hot foods quickly
- Reheat to 165°F
- Use thermometers!

## Personal Hygiene

### Handwashing
When to wash:
- Before handling food
- After touching raw meat
- After using restroom
- After touching face/hair
- After handling trash

How to wash:
1. Wet hands with warm water
2. Apply soap
3. Scrub for 20 seconds
4. Rinse thoroughly
5. Dry with clean towel

### Proper Attire
- Clean uniform
- Hair restraint
- No jewelry
- Closed-toe shoes
- No nail polish

## Cross-Contamination Prevention
- Separate cutting boards
- Color-coded equipment
- Proper food storage
- Clean and sanitize surfaces

## Kitchen Safety

### Knife Safety
- Sharp knives are safer
- Cut away from body
- Proper grip and technique
- Store properly

### Fire Safety
- Know extinguisher locations
- Never leave cooking unattended
- Smother grease fires
- Keep exits clear`,
      objectives: ['Understand temperature control', 'Practice proper hygiene', 'Prevent cross-contamination']
    },
    practice: {
      title: 'Kitchen Safety Practice',
      description: 'Apply food safety knowledge',
      content: `# Kitchen Safety Practice

## Temperature Quiz
What's the minimum internal temperature?
1. Ground beef: ___°F
2. Chicken: ___°F
3. Fish: ___°F
4. Reheated food: ___°F

## Cross-Contamination Scenarios
What's wrong in each situation?
1. Cutting vegetables on board used for raw chicken
2. Storing raw meat on top shelf of cooler
3. Using same spoon to taste and stir

## Handwashing Steps
Put in order:
___ Apply soap
___ Dry with clean towel
___ Wet hands
___ Rinse thoroughly
___ Scrub 20 seconds

## Safety Identification
Match the hazard to the control:
1. Knife cuts ___ a. Proper lifting
2. Burns ___ b. Cut away from body
3. Back injury ___ c. Dry hands before handling
4. Electric shock ___ d. Use dry towels

## Practical Scenarios
What would you do?
1. You see someone sneeze near food prep
2. A coworker has a cut on their hand
3. You find food left out overnight

## Answers
Temps: 1-160°F, 2-165°F, 3-145°F, 4-165°F
Handwashing: 3, 1, 4, 5, 2
Hazards: 1-b, 2-d, 3-a, 4-c`,
      objectives: ['Know safe temperatures', 'Identify hazards', 'Apply safety procedures']
    },
    mastery: {
      title: 'Food Safety Certification',
      description: 'Comprehensive food safety knowledge',
      content: `# Food Safety Certification

## HACCP Principles

### The 7 Principles
1. Conduct hazard analysis
2. Determine Critical Control Points
3. Establish critical limits
4. Establish monitoring procedures
5. Establish corrective actions
6. Establish verification procedures
7. Establish record-keeping

### Common CCPs
- Cooking temperatures
- Cooling procedures
- Receiving inspection
- Holding temperatures

## Foodborne Illness

### Common Pathogens
- Salmonella: Poultry, eggs
- E. coli: Ground beef
- Listeria: Deli meats, soft cheese
- Norovirus: Person to person

### Symptoms
- Nausea and vomiting
- Diarrhea
- Fever
- Abdominal cramps

## Cleaning vs. Sanitizing

### Cleaning
- Removes visible dirt
- Soap and water
- Physical action

### Sanitizing
- Kills bacteria
- Chemical or heat
- Required after cleaning

### Steps
1. Scrape/remove food
2. Wash with detergent
3. Rinse
4. Sanitize
5. Air dry

## Manager Responsibilities
- Training staff
- Monitoring procedures
- Taking corrective action
- Maintaining records

## Certification Exam Prep
Complete practice exam covering:
- Temperature control
- Personal hygiene
- Cleaning and sanitizing
- HACCP principles
- Regulatory requirements`,
      objectives: ['Understand HACCP', 'Know foodborne illness', 'Prepare for certification']
    }
  },

  'voc-culinary-knife': {
    intro: {
      title: 'Knife Skills',
      description: 'Essential knife techniques for the kitchen',
      content: `# Knife Skills

## Types of Knives

### Chef's Knife
- Most versatile
- 8-10 inch blade
- Chopping, slicing, mincing

### Paring Knife
- Small, precise work
- 3-4 inch blade
- Peeling, trimming

### Bread Knife
- Serrated edge
- Cutting bread
- Soft items

### Boning Knife
- Flexible blade
- Removing bones
- Trimming meat

### Santoku
- Japanese style
- Good for vegetables
- Rocking motion

## Knife Safety

### Safe Handling
- Always cut away from body
- Keep fingers curled (claw grip)
- Pass handle first
- Never catch a falling knife

### Storage
- Knife block or magnetic strip
- Never in drawer loose
- Blade protectors

## Proper Technique

### Grip
- Pinch blade with thumb and forefinger
- Wrap other fingers around handle
- Secure but not tight

### Guiding Hand (Claw)
- Curl fingers inward
- Knuckles guide blade
- Fingertips tucked

### Cutting Motions
- **Rocking:** Chef's knife, mincing
- **Push cut:** Slicing
- **Pull cut:** Bread, tomatoes

## Basic Cuts
- **Dice:** Cubes of various sizes
- **Julienne:** Matchstick strips
- **Chiffonade:** Thin ribbons (herbs)
- **Brunoise:** Tiny cubes`,
      objectives: ['Identify knife types', 'Practice safe handling', 'Execute basic cuts']
    },
    practice: {
      title: 'Knife Skills Practice',
      description: 'Develop knife proficiency',
      content: `# Knife Skills Practice

## Knife Identification
Match knife to best use:
1. Chef's knife ___ a. Peeling
2. Paring knife ___ b. Deboning
3. Bread knife ___ c. General purpose
4. Boning knife ___ d. Crusty bread

## Safety Check
What's wrong in each scenario?
1. Putting knife in soapy water
2. Reaching for falling knife
3. Carrying knife at your side, blade up

## Cutting Exercises

### Exercise 1: Large Dice (3/4")
- Cut onion into large dice
- Practice consistent sizing

### Exercise 2: Medium Dice (1/2")
- Cut potato into medium dice
- Focus on uniformity

### Exercise 3: Julienne (1/8" x 1/8" x 2")
- Cut carrot into julienne
- Keep cuts parallel

### Exercise 4: Brunoise (1/8" cube)
- Cut julienned carrots
- Precise small cubes

## Timed Practice
Complete in 5 minutes:
- Medium dice 1 onion
- Julienne 2 carrots
- Mince 3 cloves garlic

## Self-Evaluation
[ ] Proper grip
[ ] Claw position maintained
[ ] Consistent size
[ ] Safe technique
[ ] Efficient motion

## Answers
Knife match: 1-c, 2-a, 3-d, 4-b`,
      objectives: ['Identify appropriate knives', 'Practice cut sizes', 'Develop speed with accuracy']
    },
    mastery: {
      title: 'Knife Skills Mastery',
      description: 'Advanced cutting techniques',
      content: `# Knife Skills Mastery

## Advanced Cuts

### Tournée (Turned)
- Seven-sided football shape
- For root vegetables
- Classic French technique

### Paysanne
- Thin, flat pieces
- Various shapes (rounds, squares)
- For soups and sautés

### Chiffonade
- Fine herb ribbons
- Stack leaves
- Roll tightly and slice

### Supreme
- Citrus segments
- Remove membrane
- Clean cuts

## Knife Maintenance

### Sharpening
- Use whetstone
- Maintain 15-20° angle
- Both sides equally
- Regular maintenance

### Honing
- Realigns edge
- Use before each use
- Quick strokes
- Not sharpening

### Steel Selection
- Different grades
- Japanese vs. German
- Carbon vs. stainless

## Speed and Efficiency

### Building Speed
- Practice daily
- Start slow, build up
- Consistency before speed

### Mise en Place
- Everything in its place
- Prep before cooking
- Organization is key

## Practical Assessment

### Timed Skills Test
Complete in allotted time:
1. Brunoise 1 cup carrots (10 min)
2. Julienne 1 cup celery (8 min)
3. Chiffonade 1 cup basil (3 min)
4. Tournée 6 potatoes (15 min)

### Evaluation Criteria
- Size consistency
- Shape accuracy
- Speed
- Safety technique
- Waste minimization`,
      objectives: ['Execute advanced cuts', 'Maintain knives properly', 'Work efficiently']
    }
  },

  'voc-culinary-methods': {
    intro: {
      title: 'Cooking Methods',
      description: 'Understanding heat transfer and cooking techniques',
      content: `# Cooking Methods

## Heat Transfer Methods

### Conduction
- Direct contact
- Pan to food
- Metal is good conductor

### Convection
- Through fluid motion
- Hot air or liquid circulates
- Ovens and boiling

### Radiation
- Through waves
- Broiling and grilling
- No direct contact

## Dry Heat Methods

### Sauté
- High heat, little fat
- Quick cooking
- Keep food moving
- Brown and cook through

### Pan Fry
- More fat than sauté
- Medium-high heat
- Develop crust

### Deep Fry
- Submerged in hot oil
- 350-375°F typically
- Golden and crispy

### Roast/Bake
- Oven, dry heat
- Uncovered
- Even browning

### Grill/Broil
- Direct high heat
- Char marks
- Quick cooking

## Moist Heat Methods

### Boil
- 212°F at sea level
- Rapid bubbles
- Pastas, vegetables

### Simmer
- 185-205°F
- Gentle bubbles
- Stocks, sauces, braises

### Poach
- 160-180°F
- No bubbles
- Delicate items (eggs, fish)

### Steam
- Above boiling water
- Gentle, retains nutrients
- Vegetables, dumplings

## Combination Methods
- **Braise:** Brown then cook in liquid
- **Stew:** Similar to braise, smaller pieces`,
      objectives: ['Understand heat transfer', 'Identify cooking methods', 'Select appropriate techniques']
    },
    practice: {
      title: 'Cooking Methods Practice',
      description: 'Apply cooking method knowledge',
      content: `# Cooking Methods Practice

## Method Classification
Classify as dry (D), moist (M), or combination (C):
1. Sauté ___
2. Braise ___
3. Steam ___
4. Roast ___
5. Poach ___
6. Stew ___

## Heat Transfer
Identify the primary heat transfer:
1. Grilling: ___
2. Boiling pasta: ___
3. Pan frying: ___
4. Convection oven: ___

## Method Selection
What cooking method for:
1. Tough cut of beef: ___
2. Delicate fish fillet: ___
3. Quick vegetable dish: ___
4. Whole chicken: ___

## Temperature Practice
What temperature range?
1. Deep frying: ___°F
2. Simmering: ___°F
3. Poaching: ___°F
4. Boiling: ___°F

## Cooking Exercise
Practice each method:
1. Sauté vegetables
2. Poach an egg
3. Steam broccoli
4. Pan-fry chicken breast

## Evaluation
[ ] Proper heat level
[ ] Correct technique
[ ] Proper doneness
[ ] Good appearance

## Answers
Classification: 1-D, 2-C, 3-M, 4-D, 5-M, 6-C
Heat transfer: 1-radiation, 2-convection, 3-conduction, 4-convection
Temps: 1) 350-375, 2) 185-205, 3) 160-180, 4) 212`,
      objectives: ['Classify methods', 'Match methods to foods', 'Execute techniques']
    },
    mastery: {
      title: 'Cooking Methods Mastery',
      description: 'Advanced cooking techniques',
      content: `# Cooking Methods Mastery

## Advanced Techniques

### Sous Vide
- Vacuum sealed
- Precise temperature
- Extended time
- Perfect results

### Smoking
- Low temperature
- Wood smoke flavor
- Hot vs. cold smoking
- Long cooking times

### Confit
- Cook in own fat
- Low temperature
- Preserves and tenderizes
- Classic duck confit

## Professional Applications

### High-Volume Cooking
- Batch cooking
- Holding temperatures
- Timing multiple items
- Consistent quality

### À La Minute
- Cooked to order
- Timing critical
- Mise en place essential
- High-pressure environment

## Menu Planning

### Method Variety
- Balance cooking methods
- Equipment availability
- Labor requirements
- Flavor considerations

### Mise en Place
- All preparations complete
- Ready for service
- Organization key

## Practical Assessment

### Multi-Method Dinner
Prepare a complete meal using:
- One sauté item
- One roasted item
- One braised item
- One steamed item

### Timing
- All items finished together
- Proper doneness
- Good presentation

### Evaluation
- Technique execution
- Temperature accuracy
- Flavor development
- Presentation
- Timing coordination`,
      objectives: ['Execute advanced techniques', 'Coordinate multiple methods', 'Plan efficient cooking']
    }
  },

  'voc-culinary-baking': {
    intro: {
      title: 'Baking Fundamentals',
      description: 'Essential baking science and techniques',
      content: `# Baking Fundamentals

## Baking Science

### Leavening
What makes baked goods rise:

**Chemical Leaveners**
- Baking soda: Needs acid to activate
- Baking powder: Complete leavener
- Reaction creates CO2 gas

**Biological Leaveners**
- Yeast: Living organism
- Fermentation produces CO2
- Requires time and warmth

**Mechanical Leaveners**
- Creaming: Air incorporation
- Whipping: Eggs trap air
- Folding: Preserves air

### Gluten
- Protein in flour
- Provides structure
- Developed by mixing
- Too much = tough

## Basic Ingredients

### Flour
- All-purpose: Versatile
- Bread: High protein
- Cake: Low protein
- Whole wheat: Nutty, dense

### Sugar
- Sweetness and browning
- Moisture retention
- Tenderizes

### Fat
- Butter: Flavor
- Shortening: Flaky texture
- Oil: Moisture

### Eggs
- Structure and leavening
- Binding
- Richness

## Measuring
- **Dry ingredients:** Scoop and level
- **Liquid ingredients:** Eye level in measuring cup
- **Flour:** Don't pack
- Accuracy is crucial!`,
      objectives: ['Understand leavening', 'Know ingredient functions', 'Measure accurately']
    },
    practice: {
      title: 'Baking Practice',
      description: 'Apply baking fundamentals',
      content: `# Baking Practice

## Leavening Match
Match leavener to application:
1. Baking soda ___ a. Bread
2. Yeast ___ b. Cake with buttermilk
3. Whipped eggs ___ c. Sponge cake
4. Baking powder ___ d. Pancakes

## Ingredient Functions
What role does each play?
1. Eggs in cake: ___
2. Sugar in cookies: ___
3. Fat in pie crust: ___
4. Salt in bread: ___

## Measuring Exercise
Measure these accurately:
- 1 cup flour
- 1/2 cup butter
- 1 tablespoon vanilla
- 1/4 teaspoon salt

## Troubleshooting
What went wrong?
1. Dense cake: ___
2. Tough muffins: ___
3. Flat cookies: ___
4. Bread didn't rise: ___

## Basic Recipe Practice

### Simple Cookies
1. Cream butter and sugar
2. Add eggs and vanilla
3. Mix in dry ingredients
4. Shape and bake

Evaluate your results:
[ ] Good spread
[ ] Proper texture
[ ] Even browning
[ ] Good flavor

## Answers
Leavening: 1-b, 2-a, 3-c, 4-d
Troubleshooting: 1-overmixed/wrong leavener, 2-overmixed, 3-old leavener/wrong fat, 4-dead yeast/too cold`,
      objectives: ['Match leaveners to uses', 'Understand ingredient roles', 'Troubleshoot problems']
    },
    mastery: {
      title: 'Baking Mastery',
      description: 'Advanced baking skills',
      content: `# Baking Mastery

## Bread Making

### Yeast Breads
- Mixing methods
- Fermentation
- Shaping
- Proofing
- Baking

### Steps
1. Scale ingredients
2. Mix dough
3. Bulk fermentation
4. Punch down
5. Divide and shape
6. Final proof
7. Bake

### Troubleshooting
- Dense bread: Underproofed
- Large holes: Overproofed
- Tough: Overmixed

## Pastry

### Pie Dough
- Keep fat cold
- Don't overmix
- Flaky layers

### Puff Pastry
- Laminated dough
- Many layers
- Steam creates lift

### Choux Pastry
- Cook on stovetop
- Pipe shapes
- Hollow when baked

## Cakes

### Mixing Methods
- Creaming method
- Two-stage method
- Sponge method
- Angel food method

### Decorating
- Leveling layers
- Crumb coat
- Final frosting
- Piping skills

## Assessment

### Bread Test
Make yeasted dinner rolls:
- Proper fermentation
- Good shape
- Correct bake
- Soft interior

### Pastry Test
Make pie with:
- Flaky crust
- Proper fill
- Good appearance

### Cake Test
Make layer cake:
- Level layers
- Smooth frosting
- Professional appearance`,
      objectives: ['Make yeast breads', 'Create pastry', 'Decorate cakes']
    }
  },

  'voc-culinary-menu': {
    intro: {
      title: 'Menu Planning',
      description: 'Creating effective menus for foodservice',
      content: `# Menu Planning

## Menu Types

### Static Menu
- Same items always
- Fast food, institutions
- Efficient but can be boring

### Cycle Menu
- Rotates on schedule
- Schools, hospitals
- Variety without constant change

### Market Menu
- Changes based on availability
- Uses fresh, seasonal items
- Requires flexibility

### À La Carte
- Items priced separately
- Customer choice
- Higher check average

### Prix Fixe
- Set price for meal
- Limited choices
- Predictable costs

## Menu Planning Principles

### Balance
- Variety of flavors
- Different textures
- Color variation
- Cooking methods vary

### Nutrition
- Balanced offerings
- Dietary accommodations
- Portion guidelines

### Cost Control
- Food cost percentage
- Target: 25-35%
- Balance high and low cost items

### Equipment
- Available equipment
- Cooking capacity
- Timing considerations

## Menu Layout
- Easy to read
- Logical organization
- Highlight profitable items
- Appetizing descriptions`,
      objectives: ['Identify menu types', 'Apply planning principles', 'Design effective menus']
    },
    practice: {
      title: 'Menu Planning Practice',
      description: 'Create and analyze menus',
      content: `# Menu Planning Practice

## Menu Type Identification
What menu type for each operation?
1. Hospital cafeteria: ___
2. Fine dining restaurant: ___
3. Fast food chain: ___
4. Farm-to-table bistro: ___

## Balance Analysis
Analyze this menu section:
- Grilled chicken breast
- Roasted chicken thigh
- Fried chicken strips
- Chicken pot pie

What's missing in terms of balance?

## Cost Calculation
If food cost is $3.50 and target is 30%:
Menu price should be: $___

If selling price is $15 and food cost is $5:
Food cost percentage is: ___%

## Menu Writing
Write appetizing descriptions for:
1. Caesar salad
2. Chocolate cake
3. Grilled salmon

## Menu Design
Create a lunch menu with:
- 3 appetizers
- 4 entrees
- 2 soups/salads
- 3 desserts

Consider:
[ ] Balance of proteins
[ ] Cooking method variety
[ ] Price range
[ ] Equipment needs

## Answers
Menu types: 1-cycle, 2-à la carte, 3-static, 4-market
Cost: $11.67, 33.3%`,
      objectives: ['Match menus to operations', 'Calculate costs', 'Write descriptions']
    },
    mastery: {
      title: 'Menu Planning Mastery',
      description: 'Advanced menu engineering',
      content: `# Menu Planning Mastery

## Menu Engineering

### Menu Matrix
Classify items by:
- Popularity (how many sold)
- Profitability (contribution margin)

### Categories
- **Stars:** High both - feature prominently
- **Plowhorses:** Popular, low profit - increase price
- **Puzzles:** Profitable, unpopular - promote more
- **Dogs:** Low both - consider removing

### Action Steps
- Feature stars
- Reposition puzzles
- Improve plowhorses
- Evaluate dogs

## Costing

### Food Cost Percentage
(Cost of ingredients ÷ Selling price) × 100

### Contribution Margin
Selling price - Food cost = Contribution

### Menu Pricing
- Factor method
- Prime cost method
- Competition analysis

## Seasonal Planning

### Benefits
- Lower costs
- Better quality
- Marketing appeal
- Environmental responsibility

### Planning Ahead
- Know what's coming in season
- Develop recipes in advance
- Train staff
- Market effectively

## Project: Complete Menu Development

### Restaurant Concept
- Define concept
- Identify target market
- Set price points

### Menu Creation
- Develop full menu
- Cost all items
- Price appropriately
- Design layout

### Analysis
- Run menu engineering
- Adjust as needed
- Finalize for service`,
      objectives: ['Apply menu engineering', 'Price effectively', 'Develop complete menus']
    }
  },

  'voc-culinary-management': {
    intro: {
      title: 'Kitchen Management',
      description: 'Managing kitchen operations effectively',
      content: `# Kitchen Management

## Kitchen Organization

### Brigade System
- Executive Chef: Overall management
- Sous Chef: Second in command
- Line Cooks: Station work
- Prep Cooks: Preparation
- Dishwashers: Sanitation

### Stations
- Grill/Broiler
- Sauté
- Fry
- Pantry/Cold
- Pastry

## Labor Management

### Scheduling
- Match labor to business
- Consider skill levels
- Follow labor laws
- Control overtime

### Training
- New hire orientation
- Skills development
- Cross-training
- Documentation

### Performance
- Set expectations
- Give feedback
- Address issues
- Recognize success

## Inventory Management

### Ordering
- Par levels
- Lead times
- Vendor relationships
- Quality standards

### Receiving
- Check quality
- Verify quantities
- Check prices
- Proper storage

### Storage
- FIFO: First In, First Out
- Proper temperatures
- Organization
- Security

## Cost Control
- Food cost monitoring
- Portion control
- Waste tracking
- Recipe costing`,
      objectives: ['Understand kitchen organization', 'Manage labor effectively', 'Control costs']
    },
    practice: {
      title: 'Kitchen Management Practice',
      description: 'Apply management skills',
      content: `# Kitchen Management Practice

## Brigade Positions
Match position to responsibility:
1. Executive Chef ___ a. Supervises line
2. Sous Chef ___ b. Cold preparations
3. Sauté Cook ___ c. Menu planning
4. Garde Manger ___ d. Pan cooking

## Scheduling Scenario
Create a schedule for:
- Lunch service: 11-2
- Dinner service: 5-10
- 2 line cooks needed each
- Budget: 80 labor hours/week

## Inventory Practice
Calculate:
Beginning inventory: $5,000
Purchases: $3,000
Ending inventory: $4,500
Food cost = $___

If sales were $15,000:
Food cost % = ___%

## FIFO Application
Organize these items (oldest first):
- Milk dated 12/15
- Milk dated 12/10
- Milk dated 12/20

## Problem Scenarios
How would you handle:
1. Cook calls in sick during busy service
2. Received wrong product in delivery
3. Food cost is 5% over budget
4. Two employees in conflict

## Answers
Brigade: 1-c, 2-a, 3-d, 4-b
Inventory: $3,500; 23.3%
FIFO: 12/10, 12/15, 12/20`,
      objectives: ['Understand roles', 'Calculate costs', 'Solve management problems']
    },
    mastery: {
      title: 'Kitchen Management Mastery',
      description: 'Advanced management skills',
      content: `# Kitchen Management Mastery

## Financial Management

### Profit & Loss
- Revenue
- Cost of goods sold
- Labor costs
- Operating expenses
- Net profit

### Budgeting
- Sales projections
- Expense planning
- Variance analysis
- Adjustment strategies

### Key Metrics
- Food cost percentage
- Labor cost percentage
- Prime cost (food + labor)
- Covers per labor hour

## Quality Management

### Standards
- Recipe consistency
- Plating standards
- Temperature accuracy
- Timing goals

### Monitoring
- Taste testing
- Temperature logs
- Customer feedback
- Mystery shoppers

### Improvement
- Identify issues
- Develop solutions
- Implement changes
- Measure results

## Leadership

### Communication
- Pre-shift meetings
- Clear expectations
- Open door policy
- Constructive feedback

### Team Building
- Respect all positions
- Celebrate successes
- Address conflicts
- Develop people

## Capstone Project

### Run a Service
Manage complete service:
- Staff scheduling
- Food ordering
- Production planning
- Service execution
- Post-service analysis

### Evaluation
- Sales performance
- Cost management
- Quality standards
- Team leadership`,
      objectives: ['Manage finances', 'Maintain quality', 'Lead effectively']
    }
  }
};

export default vocationalContent;

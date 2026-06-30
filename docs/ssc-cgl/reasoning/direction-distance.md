---
title: Direction and Distance
description: Deep SSC CGL Tier-I Reasoning note for direction-distance diagrams, displacement, turn logic, and 200/200 speed accuracy.
tags: [ssc-cgl, reasoning, direction-distance, deepseek-authored]
generated_by: deepseek
review_status: ai-authored-needs-agent-review
---
![Direction distance decision map](/img/ssc-cgl/direction-distance-map.svg)

## Corpus Pressure

The uploaded book-PYQ corpus marks `direction-distance` as a Reasoning coverage-gap topic with **38 promoted questions**. The source load is concentrated in **Scribd HTML Pages**, which contributes **38 promoted questions**. That means the note must train the exact SSC pattern: north/south/east/west cancellation, left/right turns from non-north facing, final direction versus final facing, shortest distance by Pythagoras, shadow direction, and relative position changes.

| Corpus Source | Promoted Load | What It Trains |
|----------------|---------------|----------------|
| Scribd HTML Pages | 38 promoted questions | Axis cancellation, turn chains, shortest-distance Pythagoras, direction-from-start, facing direction, shadow cue, and two-person relative position |

For 200/200, direction-distance is not a theory chapter; it is a zero-carelessness chapter. Most direct cancellation and facing questions should close in 12-20 seconds. A 3-leg turn question should close in 25-30 seconds. A dense relative-position or shadow wording can take up to 50 seconds only if the rest of the Reasoning section is already under control.

## Concept Ladder

1. **Absolute Directions**: North (N), South (S), East (E), West (W). These are fixed and independent of the observer's facing. The sun rises in the East and sets in the West; shadows fall opposite the sun (morning - shadow West, afternoon - shadow East). Noon: no shadow or directly underfoot.

2. **Turn Logic**: Left turn = rotate 90 degrees anticlockwise; right turn = rotate 90 degrees clockwise. The direction you face determines the direction you move when you walk. The new facing is the reference for the next turn.

3. **Movement Recording**: Every movement is a vector on a 2D plane. Use a coordinate system: assign N as +y, S as -y, E as +x, W as -x. This allows brute-force cancellation of opposite vectors.

4. **Cancellation Rule**: Vectors on the same axis with opposite signs cancel algebraically. E.g., 5 m N (+5y) + 3 m S (-3y) = net 2 m N. Do this before applying Pythagoras.

5. **Shortest Distance**: After canceling, the net displacement is a right-angled triangle with components along N-S and E-W axes. Shortest distance = sqrt( (net N-S)^2 + (net E-W)^2 ). This is the straight line from start to end.

6. **Direction of Net Displacement**: Use the signs of the net components to determine the quadrant relative to start. E.g., net East (+) and net North (+) => North-East; net West (-) and net South (-) => South-West.

7. **Final Direction vs Facing**: The question often asks "in which direction is he from the start?" or "what is the shortest distance?". Sometimes it asks "which direction is he facing?". Distinguish between facing (current orientation) and displacement direction.

8. **Shadow Variant**: Shadow is always cast opposite the sun. If time is given (morning/evening), sun direction is fixed. The man's facing affects where his shadow falls relative to him, but the absolute shadow direction depends only on sun position.

9. **Coordinate Plotting for Multi-Turn**: For complex turns, draw a small sketch. Mark each leg with a directional arrow. Beginners should always draw; experts can use cancellation for simple sequences.

10. **Exam Integration**: 36-second reasoning attempt plan: 10s read and identify type (pure cancel, Pythagoras, turn series, shadow), 15s diagram or mental cancellation, 10s compute answer, 1s mark. If after 25s no clear path, skip and return if time permits. Do not second-guess left-right reversal; always use a quick axis check.

## Type System

| Type | Recognition Cue | Method | Speed Target | Trap |
|------|----------------|--------|--------------|------|
| Pure cancellation | Multiple legs on same axes (N,S,E,W) that cancel partially/fully | Cancel opposite vectors; remaining component is the answer | 12s | Marking walked distance instead of net displacement |
| Single Pythagoras | Two perpendicular legs from start | sqrt(leg1^2 + leg2^2) | 15s | Using legs that are not net components (must cancel first) |
| Multi-turn with net displacement | Legs in sequence with turns | Cancel on each axis, then Pythagoras if needed | 20s | Confusing left/right when facing changes |
| Final direction only | "In which direction is he from start?" | Determine net N-S and E-W, find quadrant | 12s | Giving facing direction instead of displacement direction |
| Facing direction | "Which direction is he facing?" after turn(s) | Track only the last facing; ignore walked distances | 10s | Mixing movement with facing |
| Shadow direction | Time (morning/evening) and person's facing mentioned | Shadow opposite sun; if morning (sun E) => shadow W, regardless of facing | 10s | Overcomplicating with turn sequence |
| Return path / shortest distance between two points | Two points with orthogonal separation given | Direct Pythagoras on given differences | 15s | Using sum of legs instead of Pythagoras |
| Mixed axes unequal cancellation | e.g., 6 m N, 8 m E, 2 m S, 5 m W | Net N-S = 6-2=4 N; net E-W = 8-5=3 E; distance = 5 m | 18s | Forgetting to subtract cancellation |
| Rotated starting direction | Person starts facing not N but e.g., S | Map first turn relative to start facing; then proceed as usual | 20s | Assuming default north facing |

### Corpus Micro-Type Repair: Route Tracing and Shortest Distance

The corpus label **route tracing and shortest distance** means: trace the walked route only to get the final coordinates; answer the final straight-line distance or return direction from those coordinates. Under the 36-second Reasoning target, do not draw a beautiful map. Draw a two-axis scratch grid, write `E-W` and `N-S`, and update the net after every movement.

| Stem Cue | What To Track | 36-Second Method | Trap |
|----------|---------------|------------------|------|
| "walks/turns/moves" | Current facing plus x-y position | Convert every movement into signed horizontal/vertical movement | Treating right/left as absolute east/west |
| "shortest distance from start" | Net displacement only | Cancel opposite directions, then use Pythagoras | Adding total route length |
| "return by shortest route" | Direction opposite final displacement | Find final quadrant, then reverse it | Answering where he is, not where he must go |
| "total distance walked" | Sum of every leg | Add all path lengths; do not cancel | Using shortest distance formula |

Mini drill: a man faces east, turns right and walks 9 m, turns left and walks 12 m. Net position is 12 m east and 9 m south. Shortest distance from start is 15 m, and shortest return direction is north-west. This one pattern covers most route tracing and shortest distance questions in SSC CGL.

### First 5-Second Classification

Read the last sentence first, then classify the stem before drawing.

| First Cue | Frame to Use | Instant Rule |
|-----------|--------------|--------------|
| "How far from starting point" | Net displacement | Cancel N-S and E-W first; use Pythagoras only if both axes remain |
| "In which direction from start" | Quadrant answer | Do not compute distance unless needed to confirm signs |
| "Which direction is he facing" | Facing tracker | Ignore distance values; track only turns |
| "Turns left/right" | Rotating facing | Left is anticlockwise; right is clockwise from the current facing |
| "Walks north/south/east/west" | Fixed-axis movement | Add signed coordinates immediately |
| "Shortest distance" | Straight-line return | Use net components, not total walked distance |
| "Total distance walked" | Path length | Add every leg; do not cancel |
| "Morning/evening/noon shadow" | Sun-shadow cue | Morning shadow west, evening shadow east, noon no fixed shadow |
| "A is north of B; B moves..." | Relative-position frame | Fix both coordinates; only move the named moving person |
| "Point A is x north and y east of B" | Two-point separation | Use Pythagoras on x and y |
| "Starts facing south/west" | Non-north turn risk | Lock starting arrow before applying first turn |
| "Returns to start" | Net-zero check | Both x and y must become zero |

## Speed Methods

**Recall Table for Quick Reference**

| Operation | Rule |
|-----------|------|
| Left turn from N | W (Left = anticlockwise: N->W->S->E) |
| Right turn from N | E (Right = clockwise: N->E->S->W) |
| Left turn from E | N |
| Right turn from E | S |
| Left turn from S | E |
| Right turn from S | W |
| Left turn from W | S |
| Right turn from W | N |
| Net displacement direction | Use net component signs: (+,+) = NE; (+,-) = SE; (-,+) = NW; (-,-) = SW |
| Shadow in morning | West (sun East) |
| Shadow in evening | East (sun West) |
| Shadow at noon (if asked) | No definite direction; avoid trick |

**Decision Rules for 36-Second Reasoning Attempt Plan**

- Rule 1: Read the final question first (distance? direction? shortest distance?). This tells you whether you need Pythagoras or just cancellation.
- Rule 2: If multiple turns, quickly sketch the route as a zigzag. Label each leg with length and axis sign.
- Rule 3: Cancel all opposite-axis pairs before doing any Pythagoras.
- Rule 4: If the problem asks only "final direction from start", do not calculate the distance unless needed to confirm quadrant.
- Rule 5: If a shadow problem mentions a specific time, lock the sun direction immediately. The person's facing only matters if the question asks "where does his shadow fall relative to him?" (rare). Usually it's absolute.
- Rule 6: If a problem gives "walked distance" and then asks "shortest distance", you must compute net displacement, not sum of all legs.
- Rule 7: If a problem involves two separate points (A and B) and asks for distance between them, treat it as Pythagoras on the given orthogonal separation - even if one point is not the start or end of a walk.

**Step-by-Step Algorithm for Turn-Based Problems**

1. Identify starting point O.
2. Draw a cross (N-S-E-W) at O.
3. For each movement:
   - Note the current facing.
   - Apply turn (L/R) to get new facing.
   - Move the given distance in that direction from current position.
   - Update position coordinates.
4. After all movements, compute net x (E-W) and net y (N-S) by summing signed distances.
5. If shortest distance asked: d = sqrt(x^2 + y^2).
6. If only direction asked: use signs of x and y to declare quadrant.
7. If facing asked: last recorded facing is the answer.

**When to Use Diagram-Free Solving**

- Only when legs are simple cancellations (e.g., equal N and S, equal E and W) and no Pythagoras.
- For shadow problems at known time.
- For single-leg Pythagoras (e.g., 12 and 5 -> 13).
- For two-point distance when orthogonal differences given.

**When to Draw a Quick Diagram**

- Any problem with 3+ legs.
- Any problem where starting facing is not North.
- Any problem where turns are given but your left/right memory is not instant.

## Trap Table

| Trap | Trigger Wording | Wrong Move | Correct Move | Repair Drill |
|------|----------------|------------|--------------|--------------|
| Walked distance vs shortest distance | "How far did he walk?" vs "How far is he from start?" | Compute net displacement when total walked is asked, or vice versa. | Read the exact phrase: "distance walked" = sum of all legs; "shortest distance" = net displacement using Pythagoras. | Practice 5 problems with mixed phrasing; label each before solving. |
| Opposite direction error | "He walks 5 m north, then 5 m south; where is he?" | Think he is 10 m away. | Cancel: net 0 m; he is at start. | Draw a vertical line; mark +5 and -5; see they cancel. |
| Left-right reversal from non-north facing | "Faces west, turns left and walks 10 m." | Assume left from west is south (correct) but then next turn uses north as reference incorrectly. | Stick to absolute axis: left from west = south, right from west = north. Use the recall table. | Drill with 5 problems starting from each cardinal direction. |
| Ignoring net cancellation before Pythagoras | "Walks 8 m N, 6 m E, 8 m S, 4 m W. Shortest distance?" | Compute sqrt(8^2+6^2) = 10 m. | Cancel first: N-S net 0; E-W net 2 m E; distance = 2 m. | Always draw a table: vertical sum, horizontal sum, then Pythagoras. |
| Using final facing as displacement direction | "Faces north, turns right, walks 10 m, turns right, walks 6 m. In which direction is he from start?" | Answer: South (facing). | He moved east then south; net is SE. Facing after last turn is south, but displacement is SE. | Distinguish: final facing is done; displacement uses net movement. |
| Shadow direction relative to person | "In the morning, a man faces north. Where does his shadow fall?" | Answer: south (because he faces north). | Shadow is always west in morning, regardless of his facing. | Remember sun in east => shadow west. No facings matter. |
| Confusing East and West in Pythagoras result | "Net displacement: 12 m N and 5 m W. Shortest distance?" | 13 m, but direction NE (wrong). | Direction is NW (N and W). Sign convention: N positive y, W negative x. Check signs. | Memorize quadrant mapping: (N,W)=NW, (S,E)=SE, etc. |
| Adding distances instead of using Pythagoras | "Point A is 3 m N and 4 m E of B. Distance A to B?" | 7 m. | Use 3-4-5 triangle: 5 m. | Keep a mental list of common triples: 3-4-5, 5-12-13, 8-15-17, 7-24-25. |
| Not reading "from the starting point" | "After walking, he is 10 m east of point P. How far from start?" | Uses distance from P instead of re-zeroing. | Always track coordinate relative to start O. | Label start as (0,0) in every diagram. |
| Forgetting that 0 distance means same point | "A man walks 10 m N, 10 m E, 10 m S, 10 m W. Shortest distance?" | 0 m (correct) but thinking some other value. | Cancel systematically: N-S=0, E-W=0. | Trust cancellation; if both nets are zero, answer is 0. |
| Misapplying turn when facing is diametrically opposite | "Faces south, turns right. Which way?" | Thinks right from south is east. | Use mnemonic: right = clockwise. Standard turns are N right = E, E right = S, S right = W, W right = N. Therefore south right = west. | Drill turns from all four directions until instant. |
| Using sum of legs when asked for shortest distance back to start (return path) | "He walks 3 km, turns, walks 4 km. How far must he go to return to start?" | Assume 5 km (Pythagoras) but maybe he is not at a right angle. | Only use Pythagoras if legs are perpendicular. If turns are left/right, yes they are perpendicular. If turn is not specified as left/right, beware. In SSC, turns are usually left or right. | Verify turn information; if missing, check if default 90 deg assumed. |
| Double counting a leg | "Walks 5 m north, 6 m east, then 5 m south. Shortest distance?" | Computes sqrt(5^2+6^2) = 7.8 m ignoring that north and south cancel. | Cancel first: net N-S = 0; only 6 m east remains. Answer 6 m. | Develop habit: sum all y components, sum all x components, then sqrt only if both non-zero. |
| Not handling "left turn after right turn" sequence mentally | "Turns right, walks, then turns left, walks." | Confusion accumulates. | Draw each step arrow. Alternatively, use mental coordinate update: after first move, new coord; then apply turn to new facing. | Practice 3-step sequences without a diagram using only coordinate updates. |
| Ignoring starting point in relative problems | "Sita is 4 m north of Gita. Gita walks 3 m east. Where is Sita relative to Gita now?" | Tethers Sita to Gita's new position incorrectly. | Treat Sita's position fixed; after Gita moves, compute new relative coordinate. | Explicitly set origin at Gita initial, track both. |

## Flowchart

```mermaid
flowchart TD
    A[Start: Read problem] --> B{Identify what is asked}
    B --> C[Find final direction from start]
    B --> D[Find shortest distance from start]
    B --> E[Find final facing direction]
    B --> F[Find shadow direction]
    C --> G[Read all movement statements]
    D --> G
    E --> G
    F --> H[Lock sun direction based on time]
    G --> I[Decide if diagram needed?]
    I -- Yes --> J[Sketch cross axes, mark legs with arrows]
    I -- No --> K[Cancel opposite vectors mentally]
    J --> L[Compute net N-S and net E-W]
    K --> L
    L --> M[Net N-S = 0 and Net E-W = 0?]
    M -- Yes --> N[Answer: 0 / same point]
    M -- No --> O{For what?}
    O -- Direction --> P[Use signs to state quadrant]
    O -- Distance --> Q[Apply Pythagoras: sqrt(netN-S^2 + netE-W^2)]
    O -- Facing --> R[Last facing = answer]
    H --> S{Problem asks?}
    S -- Shadow absolute --> T[Answer: West (morning) / East (evening)]
    S -- Other --> C
    P --> U[Output answer]
    Q --> U
    R --> U
    T --> U
```

## Solved Examples

**Example 1: Basic Cancellation**
A man walks 8 m north, then 6 m east, then 8 m south. How far and in which direction is he from the starting point?
Options: (a) 6 m east (b) 6 m west (c) 8 m north (d) 14 m east
**Solution**: North 8 m and south 8 m cancel. Only 6 m east remains. **Answer: (a) 6 m east**

**Example 2: Pythagoras Displacement**
A person walks 9 m north and then 12 m east. What is the shortest distance from the starting point?
Options: (a) 15 m (b) 18 m (c) 21 m (d) 24 m
**Solution**: Net movement is 9 m north and 12 m east. Shortest distance = sqrt(9^2 + 12^2) = sqrt(225) = 15 m. **Answer: (a) 15 m**

**Example 3: Right Turn From North**
Ravi faces north. He turns right and walks 10 m, then turns right and walks 6 m. In which direction is he from the starting point?
Options: (a) North-east (b) South-east (c) South-west (d) North-west
**Solution**: Right from north is east, so he moves 10 m east. Right from east is south, so he moves 6 m south. He is south-east of the start. **Answer: (b) South-east**

**Example 4: Left Turn From East**
A woman faces east. She turns left and walks 7 m, then turns left again and walks 7 m. Where is she from the starting point?
Options: (a) 7 m north (b) 7 m west (c) North-west (d) Back at start
**Solution**: Left from east is north, so first movement is 7 m north. Left from north is west, so second movement is 7 m west. She is north-west from the starting point. **Answer: (c) North-west**

**Example 5: Walked Distance Trap**
A person walks 5 m east, 5 m north, 5 m west, and 5 m south. What is the shortest distance from the starting point?
Options: (a) 0 m (b) 5 m (c) 10 m (d) 20 m
**Solution**: East and west cancel; north and south cancel. The final point is the starting point. **Answer: (a) 0 m**

**Example 6: Final Direction**
A boy walks 4 km west, 3 km south, and 4 km east. What is his final direction from the starting point?
Options: (a) North (b) South (c) East (d) West
**Solution**: West 4 km and east 4 km cancel. Only 3 km south remains. **Answer: (b) South**

**Example 7: Two-Axis Net Movement**
A person walks 15 m east, 8 m north, 9 m west, and 8 m south. How far is he from the start?
Options: (a) 4 m (b) 6 m (c) 8 m (d) 12 m
**Solution**: North 8 m and south 8 m cancel. East-west net = 15 - 9 = 6 m east. **Answer: (b) 6 m**

**Example 8: Direction With Unequal Axes**
Meena walks 6 m south and then 8 m west. What is the shortest distance and direction from start?
Options: (a) 10 m south-west (b) 14 m south-west (c) 10 m north-west (d) 2 m west
**Solution**: Net movement is 6 m south and 8 m west. Shortest distance = sqrt(36 + 64) = 10 m, direction south-west. **Answer: (a) 10 m south-west**

**Example 9: Facing Direction**
A man faces south. He turns left, walks 12 m, turns right, and walks 5 m. In which direction is he from the starting point?
Options: (a) North-east (b) South-east (c) South-west (d) North-west
**Solution**: Left from south is east, so he walks 12 m east. Right from east is south, so he walks 5 m south. He is south-east of start. **Answer: (b) South-east**

**Example 10: Return Path**
A person walks 10 m north, 10 m east, 10 m south, and 4 m west. What is the shortest distance from start?
Options: (a) 4 m (b) 6 m (c) 10 m (d) 14 m
**Solution**: North and south cancel. East-west net = 10 - 4 = 6 m east. Shortest distance is 6 m. **Answer: (b) 6 m**

**Example 11: Shadow Direction**
In the morning, a man faces the sun and turns left. In which direction will his shadow fall?
Options: (a) North (b) South (c) East (d) West
**Solution**: In the morning, the sun is in the east. A shadow falls opposite the sun, so it falls west regardless of the man's final facing direction. **Answer: (d) West**

**Example 12: Distance Between Two Points**
Point A is 5 m north and 12 m east of point B. What is the shortest distance between A and B?
Options: (a) 13 m (b) 15 m (c) 17 m (d) 19 m
**Solution**: The coordinate difference is 5 m vertically and 12 m horizontally. Distance = sqrt(5^2 + 12^2) = 13 m. **Answer: (a) 13 m**

**Example 13: Total Walked Distance**
A man walks 4 m north, 3 m east, 4 m south, and 3 m west. What total distance did he walk?
Options: (a) 0 m (b) 7 m (c) 10 m (d) 14 m
**Solution**: "Total distance walked" means path length, not displacement. Add all legs: 4+3+4+3 = 14 m. **Answer: (d) 14 m**

**Example 14: Shortest Distance After Same Path**
A man walks 4 m north, 3 m east, 4 m south, and 3 m west. How far is he from the starting point?
Options: (a) 0 m (b) 3 m (c) 4 m (d) 14 m
**Solution**: North and south cancel; east and west cancel. Net position is the start. **Answer: (a) 0 m**

**Example 15: Start Facing West**
Rohan faces west. He turns right and walks 8 m, then turns left and walks 6 m. In which direction is he from the start?
Options: (a) North-west (b) North-east (c) South-west (d) South-east
**Solution**: Right from west is north, so he moves 8 m north. Left from north is west, so he moves 6 m west. He is north-west of the start. **Answer: (a) North-west**

**Example 16: Start Facing South**
A person faces south. He turns right, walks 5 m, turns right again, and walks 12 m. What is the shortest distance from start?
Options: (a) 7 m (b) 13 m (c) 17 m (d) 25 m
**Solution**: Right from south is west, so x = 5 west. Right from west is north, so y = 12 north. Distance = sqrt(5^2+12^2) = 13 m. **Answer: (b) 13 m**

**Example 17: Facing Asked, Not Position**
A man faces east. He turns left, then right, then right. Which direction is he facing?
Options: (a) North (b) South (c) East (d) West
**Solution**: Start east. Left -> north. Right -> east. Right -> south. No distance is needed. **Answer: (b) South**

**Example 18: Final Position With Final Facing Trap**
A man faces north. He walks 7 m, turns right and walks 5 m, then turns right and walks 7 m. In which direction is he from the start?
Options: (a) East (b) West (c) North (d) South
**Solution**: Movement is 7 m north, 5 m east, 7 m south. North and south cancel; net is 5 m east. **Answer: (a) East**

**Example 19: 8-15-17 Triangle**
A girl walks 15 m west and then 8 m north. What is the shortest distance from her starting point?
Options: (a) 17 m (b) 21 m (c) 23 m (d) 25 m
**Solution**: Components are 15 west and 8 north. This is the 8-15-17 triple. **Answer: (a) 17 m**

**Example 20: Multi-Leg Cancellation Before Pythagoras**
A person walks 12 m north, 10 m east, 4 m south, and 4 m west. How far is he from the start?
Options: (a) 8 m (b) 10 m (c) 12 m (d) 30 m
**Solution**: Net vertical = 12-4 = 8 m north. Net horizontal = 10-4 = 6 m east. Distance = sqrt(64+36) = 10 m. **Answer: (b) 10 m**

**Example 21: Clean Multi-Leg Pythagoras**
A person walks 10 m north, 9 m east, 2 m north, and 4 m west. How far is he from the start?
Options: (a) 13 m (b) 15 m (c) 17 m (d) 21 m
**Solution**: Net vertical = 10+2 = 12 m north. Net horizontal = 9-4 = 5 m east. Distance = sqrt(144+25) = 13 m. **Answer: (a) 13 m**

**Example 22: Evening Shadow**
In the evening, a man is walking towards north. In which direction will his shadow fall?
Options: (a) East (b) West (c) North (d) South
**Solution**: In the evening, the sun is in the west, so the shadow falls east. His walking direction does not change the absolute shadow direction. **Answer: (a) East**

**Example 23: Morning Facing Sun**
In the morning, a boy faces the sun. He turns right. Which direction is he facing now?
Options: (a) North (b) South (c) East (d) West
**Solution**: Morning sun is east, so the boy initially faces east. Right from east is south. **Answer: (b) South**

**Example 24: Relative Position**
Rita is 6 m north of Sita. Sita walks 8 m east. What is the shortest distance between Rita and Sita now?
Options: (a) 10 m (b) 12 m (c) 14 m (d) 16 m
**Solution**: Set Sita initial as (0,0) and Rita as (0,6). After Sita walks east, Sita is (8,0). Separation is 8 east and 6 south: distance = 10 m. **Answer: (a) 10 m**

**Example 25: Two Turns With Return Direction**
A man faces east. He turns right and walks 9 m, turns left and walks 12 m. In which direction should he go to return by the shortest route?
Options: (a) North-west (b) South-east (c) North-east (d) South-west
**Solution**: Right from east is south: 9 m south. Left from south is east: 12 m east. He is south-east of start, so the shortest return direction is north-west. **Answer: (a) North-west**

## PYQ Mapping

The current promoted corpus gives this topic **38 promoted questions**, all from **Scribd HTML Pages**. The entire direction-distance topic in SSC CGL Tier-I Reasoning can be classified into four practice routes. Use the target types as a guide to allocate drill time:

- **Route A - Pure Cancellation and Basic Pythagoras**: Corresponds to Examples 1,2,5,6,7,10,12. Practice 15-20 questions from past papers (2017-2023) focusing on quick axis cancellation and common Pythagorean triples. Master the 3-4-5, 5-12-13, 8-15-17 sets. Speed target: 15s per question.

- **Route B - Multi-Turn with Net Displacement**: Corresponds to Examples 3,4,8,9. These require careful turn tracking. Practice 10-15 questions where start facing is not North. Use the decision flowchart to decide when to draw a quick diagram. Speed target: 20s per question.

- **Route C - Facing Direction and Shadow**: Corresponds to Example 11. This is a low-frequency but high-accuracy type. Practice 5 questions each for morning/evening shadow and separate facing-direction problems. Note that shadow direction is independent of person's facing except when the question asks "in which direction is your shadow from you?". In that case, it's the opposite of your facing (since sun is behind). But typical SSC asks "in which direction will his shadow fall?" meaning absolute direction. Speed target: 10s.

- **Route D - Mixed Approaches (Return path, Two points, Unequal axes)**: These appear frequently in more recent CGL papers. Practice 10-12 questions that require careful reading (e.g., "how far must he go to return to start?" which equals shortest distance from end to start). Also practice cases where one leg is given as "turns right" but not explicit if 90 deg; assume 90 deg as per SSC convention.

For extensive practice, use the following local resources:
- [/exams/ssc-cgl/topics/direction-distance](/exams/ssc-cgl/topics/direction-distance)
- [/exams/ssc-cgl/tests/ssc-cgl-reasoning-speed-sprint](/exams/ssc-cgl/tests/ssc-cgl-reasoning-speed-sprint)
- [/exams/ssc-cgl/tests/ssc-cgl-reasoning-50-50-set-01](/exams/ssc-cgl/tests/ssc-cgl-reasoning-50-50-set-01)

**Study Order:** Master Route A first (90% of direct marks), then Route B (turn logic), then Route C (shadow/facing), and finally Route D (complex wordings). This order builds from core skill to edge cases.

## 200/200 Drill

To achieve a perfect score in Reasoning, you must eliminate all careless errors and hit the 36-second attempt plan consistently. The following micro-drills are designed to repair the most common failure points. Do them daily until your accuracy is 100% for 20 consecutive questions.

**Micro-Drill 1: Axis Cancellation Sprint (5 mins)**
- Write down 10 sets of vertical and horizontal movements (e.g., 12N, 5S, 8E, 3W, 4N, etc.).
- Compute net N-S and net E-W in under 3 seconds per set.
- If both nets are zero, the answer is 0; if one is zero, the other is the distance; if both non-zero, use Pythagoras.
- **Repair Rule**: If you ever mis-cancel (e.g., treat 8N and 6S as 2N instead of 2N correct), repeat the set with visual arrows.

**Micro-Drill 2: Turn-From-Any-Direction Flash (3 mins)**
- Randomly pick a starting facing (N/S/E/W) and a turn (left/right). Instantly say the new facing.
- Use the recall table or mental rotation. Do 20 such queries.
- **Repair Rule**: If you hesitate more than 1 second, write the mnemonic: "Right = clockwise, Left = anticlockwise. For N: right=E, left=W; for S: right=W, left=E; for E: right=S, left=N; for W: right=N, left=S." Recite 5 times.

**Micro-Drill 3: Diagram-Free Mental Cancellation (2 mins)**
- For 5 problems given verbally (e.g., "Walk 10m east, 5m north, 6m west, 2m south, 4m east, 3m south. Shortest distance?"), solve without drawing.
- Track coordinates mentally: start (0,0). east = +x, west = -x; north = +y, south = -y.
- Net x = 10-6+4 = 8; net y = 5-2-3 = 0 => distance 8m east.
- **Repair Rule**: If you lose track, draw a tiny number line on paper; eventually wean off.

**Micro-Drill 4: Shadow Single-Cue Response (1 min)**
- For each time (morning/evening/noon) state the sun direction and the absolute shadow direction.
- Morning: sun E, shadow W; Evening: sun W, shadow E; Noon: sun overhead, no definite shadow.
- **Repair Rule**: Memorize: "Sun rises East, sets West; shadow opposite."

**Micro-Drill 5: Full Question Mock Sprint (8 mins)**
- Take a set of 8 practice questions (mix of all types).
- Use the 36-second attempt plan: 10s to classify, 15s to solve, 10s to mark, 1s to move on.
- After each question, check if you fell into any trap from the Trap Table. Write down the trap number if so.
- **Repair Rule**: If you made a mistake on a particular trap, do 3 more questions targeting that trap.

**Timing Targets for 9-Question Set (CGL Tier-I Reasoning is 25Q in 15 min. For direction-distance, you may see 1-3 questions. But for drill, we simulate an 8-question micro section.)**

| Question Type | Target Time | Maximum Alottable |
|---------------|-------------|-------------------|
| Pure cancellation | 12s | 18s |
| Pythagoras (single/multi) | 15s | 22s |
| Multi-turn with direction | 20s | 30s |
| Shadow/facing | 10s | 15s |
| Distance between two points | 15s | 20s |

If a question exceeds the maximum time, skip it (mark for return) and move on. In the 200/200 approach, you should never spend more than 30s on any single Reasoning question because each extra second steals from other easier questions.

**Final Mastery Check**: After completing the drill set, you should be able to:
- Cancel any set of net movements in <=3s.
- Identify the Pythagorean triple (or compute via approximate squares) in <=5s.
- Decide the net displacement quadrant without hesitation.
- Avoid the "walked distance vs shortest distance" trap in all wordings.
- Solve a multi-turn problem with a diagram in <=20s.

Only when you consistently score 100% on these drills are you ready for the 200/200 target in the Reasoning section.
<!-- SSC-FINAL-PRACTICE-QUEUE:START -->
## Final Practice Queue

1. Start one-by-one practice: [Direction and Distance practice](/exams/ssc-cgl/practice/direction-distance). Finish every question in this topic bank, not just the samples in the note.
2. Move to timed sets: [SSC CGL tests](/exams/ssc-cgl/tests?topic=direction-distance). Use topic drills first, then section mocks once accuracy is stable.
3. Repair every miss immediately: record the error label, redo 20 mixed questions from the same topic, then retest after 24 hours.
4. 200/200 rule: do not mark this topic exam-ready until correct answers come within 36 seconds and wrong answers are explained without looking at the solution.

<!-- SSC-FINAL-PRACTICE-QUEUE:END -->

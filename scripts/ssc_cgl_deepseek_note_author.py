"""Author one SSC CGL topic note with DeepSeek.

This script is intentionally one-topic-at-a-time. It prepares the prompt and
audit packet, calls DeepSeek only outside dry-run mode, validates the required
markdown sections, and writes the final note into docs/.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import urllib.error
import urllib.request
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_AUDIT_ROOT = ROOT / "data" / "exams" / "ssc-cgl" / "deep-notes"
BOOK_CORPUS_BLUEPRINT_PATH = ROOT / "data" / "exams" / "ssc-cgl" / "book-imports" / "corpus-blueprint.json"
DEEPSEEK_ENDPOINT = "https://api.deepseek.com/chat/completions"

LOCKED_ARRANGEMENT_EXAMPLES = """
**Example 1: Linear Seating**
Five people A, B, C, D, and E sit in a row facing north. A sits at the left end. C sits second to the right of A. B sits immediately left of C. E sits immediately right of C. Who sits in the middle?
Options: (a) A (b) B (c) C (d) E
**Solution**: Number seats 1 to 5 from left. A is at seat 1. C is second to the right of A, so C is at seat 3. B is immediately left of C, so B is at seat 2. E is immediately right of C, so E is at seat 4. D remains at seat 5. The middle seat is seat 3, occupied by C. **Answer: (c) C**

**Example 2: Circular Seating**
Six people P, Q, R, S, T, and U sit around a circular table facing the centre. P sits opposite S. Q sits immediately right of P. R sits opposite Q. Who sits opposite T if U sits immediately left of S?
Options: (a) P (b) Q (c) R (d) U
**Solution**: Mark six positions clockwise. Put P anywhere. Since all face centre, immediate right means clockwise. Q is clockwise next to P. S is opposite P. R is opposite Q. U is immediately left of S, so U is anticlockwise next to S. The only remaining seat is T. In this arrangement, T is opposite U. **Answer: (d) U**

**Example 3: Ranking**
In a class of 40 students, Ravi is 12th from the top and Meena is 15th from the bottom. How many students are between Ravi and Meena if Ravi is above Meena?
Options: (a) 11 (b) 12 (c) 13 (d) 14
**Solution**: Meena's rank from the top is 40 - 15 + 1 = 26. Ravi is 12th from the top. Students between them = 26 - 12 - 1 = 13. **Answer: (c) 13**

**Example 4: Floor Arrangement**
Five people A, B, C, D, and E live on floors 1 to 5, where 1 is bottom and 5 is top. B lives immediately above A. D lives on floor 5. C lives below A but above E. Who lives on floor 2?
Options: (a) A (b) B (c) C (d) E
**Solution**: D is on floor 5. C is below A but above E, so C cannot be floor 1. B is immediately above A. The only clean placement is E at floor 1, C at floor 2, A at floor 3, B at floor 4, D at floor 5. Floor 2 has C. **Answer: (c) C**

**Example 5: Direction-Distance**
A man walks 6 m east, turns right and walks 8 m, turns right and walks 6 m. How far is he from the starting point?
Options: (a) 6 m (b) 8 m (c) 10 m (d) 14 m
**Solution**: Start at (0,0). Move east to (6,0). Right from east is south, so move to (6,-8). Right from south is west, so move to (0,-8). Distance from start is 8 m. **Answer: (b) 8 m**

**Example 6: Blood Relation**
Pointing to a woman, Arun says, "She is the daughter of my mother's only son." How is the woman related to Arun?
Options: (a) Sister (b) Daughter (c) Niece (d) Mother
**Solution**: Arun's mother's only son is Arun himself. The woman is the daughter of Arun. Therefore, she is Arun's daughter. **Answer: (b) Daughter**

**Example 7: Syllogism**
Statements: All pens are tools. Some tools are blue. Conclusions: I. Some pens are blue. II. Some tools are pens.
Options: (a) Only I follows (b) Only II follows (c) Both follow (d) Neither follows
**Solution**: All pens are inside tools. Some tools are blue, but those blue tools may or may not be pens, so conclusion I is not definite. Since all pens are tools, at least some tools are pens if pens exist in the statement set. Conclusion II follows. **Answer: (b) Only II follows**

**Example 8: Statement-Conclusion**
Statement: Only disciplined candidates clear high-pressure exams. Conclusion I: All candidates who clear high-pressure exams are disciplined. Conclusion II: All disciplined candidates clear high-pressure exams.
Options: (a) Only I follows (b) Only II follows (c) Both follow (d) Neither follows
**Solution**: "Only disciplined candidates clear" means clearing is possible only inside the disciplined group. So all who clear are disciplined. It does not mean every disciplined candidate clears. **Answer: (a) Only I follows**

**Example 9: Calendar**
If 1 January 2026 is Thursday, what day is 1 February 2026?
Options: (a) Saturday (b) Sunday (c) Monday (d) Tuesday
**Solution**: January has 31 days. A shift of 31 days means 31 mod 7 = 3 days. Thursday + 3 = Sunday. **Answer: (b) Sunday**

**Example 10: Coding-Decoding**
In a code, CAT is written as DBU. How is DOG written?
Options: (a) EPH (b) ENH (c) FPH (d) EOG
**Solution**: Each letter is shifted forward by one: C->D, A->B, T->U. Therefore D->E, O->P, G->H. DOG becomes EPH. **Answer: (a) EPH**
""".strip()

LOCKED_DIRECTION_DISTANCE_EXAMPLES = """
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
""".strip()

LOCKED_CALENDAR_CLOCK_EXAMPLES = """
**Example 1: Ordinary Year Odd Days**
If 1 January 2026 is Thursday, what day is 1 January 2027?
Options: (a) Thursday (b) Friday (c) Saturday (d) Sunday
**Solution**: 2026 is an ordinary year, so it has 365 days = 52 weeks + 1 odd day. Thursday + 1 = Friday. **Answer: (b) Friday**

**Example 2: Leap Year Odd Days**
If 1 January 2028 is Saturday, what day is 1 January 2029?
Options: (a) Sunday (b) Monday (c) Tuesday (d) Wednesday
**Solution**: 2028 is a leap year, so it has 366 days = 52 weeks + 2 odd days. Saturday + 2 = Monday. **Answer: (b) Monday**

**Example 3: Month Shift**
If 1 March is Monday, what day is 15 March of the same year?
Options: (a) Sunday (b) Monday (c) Tuesday (d) Wednesday
**Solution**: From 1 March to 15 March is 14 days. 14 mod 7 = 0, so the weekday remains Monday. **Answer: (b) Monday**

**Example 4: February in Leap Year**
If 1 February 2024 is Thursday, what day is 1 March 2024?
Options: (a) Thursday (b) Friday (c) Saturday (d) Sunday
**Solution**: February 2024 has 29 days. 29 mod 7 = 1. Thursday + 1 = Friday. **Answer: (b) Friday**

**Example 5: Century Rule**
Which of the following is a leap year?
Options: (a) 1900 (b) 2100 (c) 2000 (d) 1800
**Solution**: Century years must be divisible by 400 to be leap years. 2000 is divisible by 400; 1900, 2100, and 1800 are not. **Answer: (c) 2000**

**Example 6: Clock Angle**
Find the angle between the hands of a clock at 3:00.
Options: (a) 60 degrees (b) 75 degrees (c) 90 degrees (d) 120 degrees
**Solution**: At 3:00, minute hand is at 12 and hour hand is at 3. Each hour mark is 30 degrees, so angle = 3 x 30 = 90 degrees. **Answer: (c) 90 degrees**

**Example 7: Clock Formula**
Find the smaller angle between clock hands at 2:20.
Options: (a) 40 degrees (b) 50 degrees (c) 55 degrees (d) 60 degrees
**Solution**: Angle = |30H - 5.5M| = |30 x 2 - 5.5 x 20| = |60 - 110| = 50 degrees. **Answer: (b) 50 degrees**

**Example 8: Straight Line**
At what angle are the clock hands at 6:00?
Options: (a) 0 degrees (b) 90 degrees (c) 180 degrees (d) 270 degrees
**Solution**: At 6:00, hour hand is at 6 and minute hand is at 12. They are opposite each other, so the smaller angle is 180 degrees. **Answer: (c) 180 degrees**

**Example 9: Coincidence Around 12**
How many times do the hour and minute hands coincide in 12 hours?
Options: (a) 10 (b) 11 (c) 12 (d) 13
**Solution**: In 12 hours, the hands coincide 11 times. This is a standard clock result because one overlap is skipped between 11 and 1. **Answer: (b) 11**

**Example 10: Opposite in 12 Hours**
How many times are the hands of a clock opposite each other in 12 hours?
Options: (a) 10 (b) 11 (c) 12 (d) 22
**Solution**: In 12 hours, the hands are opposite each other 11 times. **Answer: (b) 11**

**Example 11: Minute Hand Speed**
How many degrees does the minute hand move in 15 minutes?
Options: (a) 60 degrees (b) 75 degrees (c) 90 degrees (d) 120 degrees
**Solution**: The minute hand moves 6 degrees per minute. In 15 minutes, it moves 15 x 6 = 90 degrees. **Answer: (c) 90 degrees**

**Example 12: Hour Hand Speed**
How many degrees does the hour hand move in 20 minutes?
Options: (a) 5 degrees (b) 10 degrees (c) 15 degrees (d) 20 degrees
**Solution**: The hour hand moves 0.5 degrees per minute. In 20 minutes, it moves 20 x 0.5 = 10 degrees. **Answer: (b) 10 degrees**
""".strip()

LOCKED_SIMPLIFICATION_EXAMPLES = """
**Example 1**
Simplify: 24 / 6 x 2
Options: (a) 2 (b) 8 (c) 12 (d) 16
**Solution**: Division and multiplication have equal priority, so move left to right. 24 / 6 = 4, and 4 x 2 = 8. **Answer: (b) 8**

**Example 2**
Simplify: 18 + 6 x 4
Options: (a) 42 (b) 96 (c) 72 (d) 30
**Solution**: Multiplication comes before addition. 6 x 4 = 24, so 18 + 24 = 42. **Answer: (a) 42**

**Example 3**
Simplify: (15 + 9) / 6 x 5
Options: (a) 12 (b) 16 (c) 20 (d) 24
**Solution**: First resolve the bracket: 15 + 9 = 24. Then 24 / 6 x 5 = 4 x 5 = 20. **Answer: (c) 20**

**Example 4**
Simplify: 36/48 x 64
Options: (a) 36 (b) 48 (c) 54 (d) 64
**Solution**: Cancel before multiplying. 36/48 = 3/4. Then 3/4 x 64 = 48. **Answer: (b) 48**

**Example 5**
Simplify: 7/12 + 5/18
Options: (a) 17/36 (b) 29/36 (c) 31/36 (d) 35/36
**Solution**: LCM of 12 and 18 is 36. 7/12 = 21/36 and 5/18 = 10/36. Sum = 31/36. **Answer: (c) 31/36**

**Example 6**
Simplify: 2^8 x 2^5 / 2^10
Options: (a) 4 (b) 8 (c) 16 (d) 32
**Solution**: Same base powers combine by adding and subtracting exponents. 2^(8+5-10) = 2^3 = 8. **Answer: (b) 8**

**Example 7**
Simplify: (3^4)^2 / 3^5
Options: (a) 9 (b) 18 (c) 27 (d) 81
**Solution**: Power of power gives 3^8. Then 3^8 / 3^5 = 3^3 = 27. **Answer: (c) 27**

**Example 8**
Simplify: sqrt(72)
Options: (a) 3sqrt(8) (b) 6sqrt(2) (c) 8sqrt(3) (d) 12sqrt(2)
**Solution**: 72 = 36 x 2. Therefore sqrt(72) = sqrt(36) x sqrt(2) = 6sqrt(2). **Answer: (b) 6sqrt(2)**

**Example 9**
Simplify: 3sqrt(5) + 7sqrt(5) - 2sqrt(5)
Options: (a) 5sqrt(5) (b) 6sqrt(5) (c) 8sqrt(5) (d) 12sqrt(5)
**Solution**: Like surds combine by adding coefficients. (3 + 7 - 2)sqrt(5) = 8sqrt(5). **Answer: (c) 8sqrt(5)**

**Example 10**
Rationalize: 5/sqrt(3)
Options: (a) 5sqrt(3)/3 (b) sqrt(3)/5 (c) 15sqrt(3) (d) 5/3
**Solution**: Multiply numerator and denominator by sqrt(3). 5/sqrt(3) = 5sqrt(3)/3. **Answer: (a) 5sqrt(3)/3**

**Example 11**
Find 12.5% of 640.
Options: (a) 64 (b) 72 (c) 80 (d) 96
**Solution**: 12.5% = 1/8. So 12.5% of 640 = 640/8 = 80. **Answer: (c) 80**

**Example 12**
Find 37.5% of 480.
Options: (a) 160 (b) 180 (c) 200 (d) 220
**Solution**: 37.5% = 3/8. So 480 x 3/8 = 60 x 3 = 180. **Answer: (b) 180**

**Example 13**
Simplify: 45 x 98
Options: (a) 4210 (b) 4310 (c) 4410 (d) 4510
**Solution**: Use 98 = 100 - 2. 45 x 98 = 45 x 100 - 45 x 2 = 4500 - 90 = 4410. **Answer: (c) 4410**

**Example 14**
Simplify: 5 - [3 - {2 - (6 - 4)}]
Options: (a) 0 (b) 2 (c) 3 (d) 5
**Solution**: Innermost bracket: 6 - 4 = 2. Then 2 - 2 = 0. Then 3 - 0 = 3. Finally 5 - 3 = 2. **Answer: (b) 2**
""".strip()

LOCKED_SEATING_ARRANGEMENT_EXAMPLES = """
**Example 1: Linear Facing North**
Five people A, B, C, D, and E sit in a row facing north. A sits at the left end. C sits second to the right of A. B sits immediately left of C. Who sits in the middle?
Options: (a) A (b) B (c) C (d) D
**Solution**: Number positions 1 to 5 from left. A is at 1. C is second to the right of A, so C is at 3. B is immediately left of C, so B is at 2. The middle position is 3, occupied by C. **Answer: (c) C**

**Example 2: Linear Facing South**
P, Q, R, S, and T sit in a row facing south. P sits at the extreme right end. Q sits immediately left of P. Who is second from the right?
Options: (a) P (b) Q (c) R (d) S
**Solution**: Positions are counted from the observer's left, but right/left is from the person's facing direction. P is at extreme right. Q is immediately left of P. Therefore Q is second from the right. **Answer: (b) Q**

**Example 3: Immediate Neighbour**
Six people A, B, C, D, E, and F sit in a row facing north. D is immediately right of B. B is third from the left. Who is fourth from the left?
Options: (a) A (b) C (c) D (d) F
**Solution**: B is at position 3. D is immediately right of B, so D is at position 4. **Answer: (c) D**

**Example 4: Two Fixed Ends**
A, B, C, D, and E sit in a row facing north. A sits at the left end and E sits at the right end. C sits exactly between A and E. Who sits in the middle?
Options: (a) A (b) B (c) C (d) E
**Solution**: With five seats, the middle is position 3. C sits exactly between the two ends, so C is in the middle. **Answer: (c) C**

**Example 5: Circular Facing Centre**
Six people P, Q, R, S, T, and U sit around a circular table facing the centre. Q sits immediately right of P. Which side of P is Q on?
Options: (a) Clockwise side (b) Anticlockwise side (c) Opposite side (d) Cannot be determined
**Solution**: In a circular arrangement facing the centre, a person's immediate right is anticlockwise from the observer's top view. Since Q is immediately right of P, Q is on P's anticlockwise side. **Answer: (b) Anticlockwise side**

**Example 6: Opposite Seats**
Six people sit around a circular table facing the centre. A sits opposite D. If A is fixed at one seat, where must D sit?
Options: (a) Immediately right of A (b) Immediately left of A (c) Three seats away from A (d) Next to A
**Solution**: In a six-seat circle, opposite means three positions away. Therefore D must sit three seats away from A. **Answer: (c) Three seats away from A**

**Example 7: Facing Outside**
Four people A, B, C, and D sit around a circular table facing outside. B sits immediately right of A. In outside-facing circles, what happens to right-left orientation?
Options: (a) Same as centre-facing (b) Reversed from centre-facing (c) Ignored (d) Always opposite
**Solution**: When people face outside, left and right reverse compared with centre-facing diagrams. This is the main trap. **Answer: (b) Reversed from centre-facing**

**Example 8: Ranking Link**
In a row of 30 students, R is 12th from the left and S is 10th from the right. How many students are between R and S if R is left of S?
Options: (a) 6 (b) 7 (c) 8 (d) 9
**Solution**: S position from left = 30 - 10 + 1 = 21. Students between R at 12 and S at 21 = 21 - 12 - 1 = 8. **Answer: (c) 8**

**Example 9: Floor Arrangement**
Five people A, B, C, D, and E live on floors 1 to 5, where 1 is the bottom. D lives on floor 5. B lives immediately above A. C lives below A but above E. Who lives on floor 2?
Options: (a) A (b) B (c) C (d) E
**Solution**: D is fixed at floor 5. Since C is below A but above E, E must be below C. B immediately above A. The consistent order is E-1, C-2, A-3, B-4, D-5. Floor 2 has C. **Answer: (c) C**

**Example 10: Box Stack**
Five boxes A, B, C, D, and E are stacked vertically. A is at the top. C is immediately below A. D is at the bottom. Which box is second from the top?
Options: (a) A (b) B (c) C (d) D
**Solution**: A is top, so position 1. C is immediately below A, so C is position 2. **Answer: (c) C**

**Example 11: Gap Clue**
In a row facing north, A sits second to the left of B. If B is fifth from the left, where is A?
Options: (a) First from left (b) Second from left (c) Third from left (d) Seventh from left
**Solution**: B is at position 5. Second to the left of B is position 3. **Answer: (c) Third from left**

**Example 12: End Clue**
Seven people sit in a row facing north. M sits at one of the ends. N sits immediately right of M. If M is at the left end, what is N's position?
Options: (a) First from left (b) Second from left (c) Third from left (d) Last from left
**Solution**: If M is at the left end, M is position 1. N immediately right of M is position 2. **Answer: (b) Second from left**
""".strip()

LOCKED_BLOOD_RELATION_EXAMPLES = """
**Example 1: Direct Maternal Son Path**  
Pointing to a woman, Arun says, "She is the daughter of my mother's only son." How is the woman related to Arun?  
Options: (a) Sister (b) Daughter (c) Niece (d) Mother  
**Solution**: Arun's mother's only son is Arun himself. Therefore the woman is Arun's daughter. **Answer: (b) Daughter**

**Example 2: Maternal Uncle**  
Pointing to a man, Rina says, "He is my mother's brother." How is the man related to Rina?  
Options: (a) Maternal uncle (b) Paternal uncle (c) Father (d) Brother  
**Solution**: The man's mother is Rina's mother, so this is her maternal uncle. **Answer: (a) Maternal uncle**

**Example 3: Paternal Uncle**  
Pointing to a man, Karan says, "He is my father's brother." How is the man related to Karan?  
Options: (a) Maternal uncle (b) Cousin (c) Paternal uncle (d) Grandfather  
**Solution**: The man's father is the same as Karan's father, so he is Karan's paternal uncle. **Answer: (c) Paternal uncle**

**Example 4: Paternal Aunt**  
Pointing to a woman, Meena says, "She is my father's sister." How is the woman related to Meena?  
Options: (a) Maternal aunt (b) Paternal aunt (c) Cousin (d) Mother  
**Solution**: The woman's father is Meena's grandfather, so she is her paternal aunt. **Answer: (b) Paternal aunt**

**Example 5: Brother-In-Law**  
Pointing to a man, Ananya says, "He is my brother's husband." How is the man related to Ananya?  
Options: (a) Brother-in-law (b) Father-in-law (c) Cousin (d) Brother  
**Solution**: The man is married to Ananya's brother, so he is Ananya's brother-in-law. **Answer: (a) Brother-in-law**

**Example 6: Nephew via Brother**  
Pointing to a boy, Prakash says, "He is my brother's son." How is the boy related to Prakash?  
Options: (a) Son (b) Nephew (c) Cousin (d) Brother  
**Solution**: The boy is the son of Prakash's brother, so he is Prakash's nephew. **Answer: (b) Nephew**

**Example 7: Niece via Brother**  
Pointing to a girl, Reema says, "She is my brother's daughter." How is the girl related to Reema?  
Options: (a) Niece (b) Daughter (c) Cousin (d) Sister  
**Solution**: The girl's father is Reema's brother, so she is Reema's niece. **Answer: (a) Niece**

**Example 8: Paternal Cousin**  
Pointing to a girl, Rohit says, "She is my father's brother's daughter." How is the girl related to Rohit?  
Options: (a) Cousin (b) Sister (c) Niece (d) Aunt  
**Solution**: The man's sister (father's brother's daughter) has the same grandparents as Rohit but is in a separate branch, so she is Rohit's cousin. **Answer: (a) Cousin**

**Example 9: Paternal Grandfather**  
Pointing to a man, Nisha says, "He is my father's father." How is the man related to Nisha?  
Options: (a) Grandfather (b) Uncle (c) Grandson (d) Brother  
**Solution**: A person's father's father is their paternal grandfather. **Answer: (a) Grandfather**

**Example 10: Sister-in-Law (via Husband)**  
Pointing to a woman, Dev says, "She is my wife's sister." How is the woman related to Dev?  
Options: (a) Maternal aunt (b) Sister-in-law (c) Cousin (d) Stepmother  
**Solution**: The woman is the sister of Dev's wife, so she is Dev's sister-in-law. **Answer: (b) Sister-in-law**

**Example 11: Maternal Grandmother**  
Pointing to a woman, Kiran says, "She is my mother's mother." How is the woman related to Kiran?  
Options: (a) Aunt (b) Mother (c) Grandmother (d) Niece  
**Solution**: The woman's daughter is Kiran's mother, so she is Kiran's maternal grandmother. **Answer: (c) Grandmother**

**Example 12: Father-in-Law**  
Pointing to a man, Ritu says, "He is my husband's father." How is the man related to Ritu?  
Options: (a) Son-in-law (b) Father-in-law (c) Brother-in-law (d) Uncle  
**Solution**: The man is the father of Ritu's husband, so he is Ritu's father-in-law. **Answer: (b) Father-in-law**
""".strip()

LOCKED_REASONING_RULE_EXAMPLES = """
**Example 1: Analogy**
Book is related to Reading in the same way Knife is related to:
Options: (a) Writing (b) Cutting (c) Cooking (d) Drawing
**Solution**: A book is primarily used for reading. A knife is primarily used for cutting. **Answer: (b) Cutting**

**Example 2: Classification**
Choose the odd one out: 16, 25, 36, 48
Options: (a) 16 (b) 25 (c) 36 (d) 48
**Solution**: 16, 25, and 36 are perfect squares. 48 is not a perfect square. **Answer: (d) 48**

**Example 3: Number Series**
Find the missing term: 3, 7, 15, 31, ?
Options: (a) 47 (b) 55 (c) 63 (d) 67
**Solution**: Each term is previous x 2 + 1: 3->7, 7->15, 15->31. Next = 31 x 2 + 1 = 63. **Answer: (c) 63**

**Example 4: Alphabet Series**
Find the next term: B, E, J, Q, ?
Options: (a) X (b) Y (c) Z (d) W
**Solution**: Alphabet positions are 2, 5, 10, 17. Differences are +3, +5, +7. Next difference is +9, so 17 + 9 = 26 = Z. **Answer: (c) Z**

**Example 5: Mathematical Operations**
If + means x, x means -, - means /, and / means +, what is 8 + 3 x 4 / 2?
Options: (a) 18 (b) 20 (c) 22 (d) 24
**Solution**: Replace symbols: 8 x 3 - 4 + 2 = 24 - 4 + 2 = 22. **Answer: (c) 22**

**Example 6: Venn Diagram**
Which diagram best represents Women, Doctors, and Mothers?
Options: (a) All separate (b) Mothers inside women, doctors overlapping women (c) Doctors inside mothers (d) Women inside doctors
**Solution**: All mothers are women, so mothers are inside women. Doctors may be men or women, and some women can be doctors, so doctors overlap women. **Answer: (b) Mothers inside women, doctors overlapping women**

**Example 7: Mirror Image Rule**
Which letter remains unchanged in a vertical mirror?
Options: (a) B (b) C (c) H (d) R
**Solution**: H is symmetrical across a vertical axis. B, C, and R change shape. **Answer: (c) H**

**Example 8: Embedded Figure**
In embedded-figure questions, what should be checked first?
Options: (a) Colour (b) Rotation allowed or not (c) Option length (d) Alphabet order
**Solution**: The first rule is whether rotation is allowed. If not allowed, orientation must match exactly. **Answer: (b) Rotation allowed or not**

**Example 9: Dictionary Order**
Arrange in dictionary order: adapt, adept, adopt, adult
Options: (a) adapt, adept, adopt, adult (b) adept, adapt, adopt, adult (c) adapt, adept, adult, adopt (d) adult, adopt, adept, adapt
**Solution**: Compare letter by letter. ada comes before ade, ado, adu. Therefore adapt, adept, adopt, adult. **Answer: (a) adapt, adept, adopt, adult**

**Example 10: Dice**
If a standard cube shows 1 opposite 6, 2 opposite 5, and 3 opposite 4, which number is opposite 2?
Options: (a) 3 (b) 4 (c) 5 (d) 6
**Solution**: The given opposite pair is 2 opposite 5. **Answer: (c) 5**
""".strip()

LOCKED_ANALOGY_CLASSIFICATION_EXAMPLES = """
**Example 1: Function Analogy**
Pen is related to Writing in the same way Knife is related to:
Options: (a) Cutting (b) Reading (c) Measuring (d) Painting
**Solution**: A pen is used for writing. A knife is used for cutting. **Answer: (a) Cutting**

**Example 2: Part-Whole Analogy**
Wheel is related to Car in the same way Page is related to:
Options: (a) Ink (b) Book (c) Pen (d) Desk
**Solution**: A wheel is a part of a car. A page is a part of a book. **Answer: (b) Book**

**Example 3: Number Analogy**
9 is related to 81 in the same way 12 is related to:
Options: (a) 96 (b) 120 (c) 144 (d) 156
**Solution**: 81 is 9 squared. 12 squared is 144. **Answer: (c) 144**

**Example 4: Letter Analogy**
ACE is related to BDF in the same way GIK is related to:
Options: (a) HJL (b) HJK (c) JLM (d) FIL
**Solution**: Each letter moves one step forward: A->B, C->D, E->F. Therefore GIK becomes HJL. **Answer: (a) HJL**

**Example 5: Classification by Square**
Choose the odd one out: 16, 25, 36, 48
Options: (a) 16 (b) 25 (c) 36 (d) 48
**Solution**: 16, 25, and 36 are perfect squares. 48 is not a perfect square. **Answer: (d) 48**

**Example 6: Classification by Category**
Choose the odd one out: Rose, Lotus, Lily, Mango
Options: (a) Rose (b) Lotus (c) Lily (d) Mango
**Solution**: Rose, Lotus, and Lily are flowers. Mango is a fruit. **Answer: (d) Mango**

**Example 7: Classification by Prime**
Choose the odd one out: 11, 13, 17, 21
Options: (a) 11 (b) 13 (c) 17 (d) 21
**Solution**: 11, 13, and 17 are prime numbers. 21 is composite. **Answer: (d) 21**

**Example 8: Word Pair Relation**
Doctor is related to Hospital in the same way Teacher is related to:
Options: (a) Court (b) School (c) Bank (d) Farm
**Solution**: A doctor commonly works in a hospital. A teacher commonly works in a school. **Answer: (b) School**

**Example 9: Opposite Relation**
Hot is related to Cold in the same way Day is related to:
Options: (a) Light (b) Night (c) Sun (d) Noon
**Solution**: Hot and cold are opposites. Day and night are opposites. **Answer: (b) Night**

**Example 10: Cause-Effect Relation**
Rain is related to Flood in the same way Fire is related to:
Options: (a) Smoke (b) Water (c) Ice (d) Soil
**Solution**: Heavy rain can cause flood. Fire can cause smoke. **Answer: (a) Smoke**

**Example 11: Letter Classification**
Choose the odd one out: BDF, HJL, NPR, TVX
Options: (a) BDF (b) HJL (c) NPR (d) TVX
**Solution**: BDF, HJL, and NPR have letters increasing by +2 each. TVX also increases by +2, so check starting positions: 2,8,14,20 also increase by +6. All follow the same pattern. Use a valid odd set instead: BDF, HJL, NPR, TWZ. TWZ has gaps +3 and +3, not +2 and +2. **Answer: (d) TWZ**

**Example 12: Family Category Classification**
Choose the odd one out: Father, Mother, Sister, Teacher
Options: (a) Father (b) Mother (c) Sister (d) Teacher
**Solution**: Father, Mother, and Sister are family relations. Teacher is a profession. **Answer: (d) Teacher**
""".strip()

LOCKED_NON_VERBAL_EXAMPLES = """
**Example 1: Mirror Image Rule**
Which letter remains unchanged in a vertical mirror?
Options: (a) B (b) C (c) H (d) R
**Solution**: H has vertical symmetry. B, C, and R change in a vertical mirror. **Answer: (c) H**

**Example 2: Water Image Rule**
In a water image, which direction is reversed?
Options: (a) Left-right (b) Top-bottom (c) Both diagonals only (d) No direction
**Solution**: A water image reverses top and bottom while left and right stay in place. **Answer: (b) Top-bottom**

**Example 3: Rotation**
A figure turns 90 degrees clockwise in each step. After two steps, total rotation is:
Options: (a) 90 degrees (b) 180 degrees (c) 270 degrees (d) 360 degrees
**Solution**: Two clockwise turns of 90 degrees give 180 degrees. **Answer: (b) 180 degrees**

**Example 4: Embedded Figure**
In embedded figure questions, what must be checked first?
Options: (a) Whether rotation is allowed (b) Colour of the figure (c) Option length (d) Alphabet order
**Solution**: If rotation is not allowed, the embedded figure must match orientation exactly. **Answer: (a) Whether rotation is allowed**

**Example 5: Paper Folding**
A square paper is folded once vertically and a hole is punched near the folded edge. After unfolding, how many holes appear?
Options: (a) 1 (b) 2 (c) 3 (d) 4
**Solution**: One fold mirrors one hole to the other half, so two holes appear. **Answer: (b) 2**

**Example 6: Dice Opposite**
If a cube has opposite pairs 1-6, 2-5, and 3-4, which number is opposite 5?
Options: (a) 1 (b) 2 (c) 3 (d) 6
**Solution**: The given opposite pair is 2-5. Therefore 2 is opposite 5. **Answer: (b) 2**

**Example 7: Counting Shapes**
A figure contains 3 small triangles and 1 larger triangle made by combining them. How many triangles are there?
Options: (a) 3 (b) 4 (c) 5 (d) 6
**Solution**: Count the 3 small triangles and the 1 larger combined triangle. Total = 4. **Answer: (b) 4**

**Example 8: Series by Shading**
In a figure series, the shaded part moves one side clockwise each step. If it starts at top, after three steps it will be at:
Options: (a) Right (b) Bottom (c) Left (d) Top
**Solution**: Top -> right -> bottom -> left. After three steps it is at left. **Answer: (c) Left**

**Example 9: Figure Completion**
For figure completion, which part should be matched first?
Options: (a) Boundary line continuity (b) Option number (c) Text size (d) Random symmetry
**Solution**: The missing piece must continue boundary lines and internal strokes. Boundary continuity is the first check. **Answer: (a) Boundary line continuity**

**Example 10: Mirror vs Water**
Which statement is correct?
Options: (a) Mirror reverses left-right (b) Mirror reverses top-bottom (c) Water reverses left-right (d) Neither reverses direction
**Solution**: A standard vertical mirror reverses left-right. A water image reverses top-bottom. **Answer: (a) Mirror reverses left-right**

**Example 11: Cube Faces**
In a cube, can two opposite faces be adjacent in a folded cube?
Options: (a) Yes always (b) No (c) Only if same colour (d) Only on top
**Solution**: Opposite faces never share an edge, so they cannot be adjacent. **Answer: (b) No**

**Example 12: Pattern Count**
If one dot is added in every step and the first figure has 2 dots, how many dots will the fifth figure have?
Options: (a) 5 (b) 6 (c) 7 (d) 8
**Solution**: Step 1 has 2 dots. Add one each step: step 5 has 2 + 4 = 6 dots. **Answer: (b) 6**
""".strip()

LOCKED_MATHEMATICAL_OPERATIONS_EXAMPLES = """
**Example 1: Symbol Substitution**
If + means x, x means -, - means /, and / means +, find 8 + 3 x 4 / 2.
Options: (a) 18 (b) 20 (c) 22 (d) 24
**Solution**: Replace symbols: 8 x 3 - 4 + 2 = 24 - 4 + 2 = 22. **Answer: (c) 22**

**Example 2: BODMAS After Replacement**
If + means -, - means x, x means /, and / means +, find 18 x 3 + 4 - 2.
Options: (a) -2 (b) 2 (c) 6 (d) 14
**Solution**: Replace symbols: 18 / 3 - 4 x 2 = 6 - 8 = -2. **Answer: (a) -2**

**Example 3: Correct Equation**
Which two signs should be interchanged to make 6 + 4 x 6 = 30 correct?
Options: (a) + and x (b) + and - (c) x and / (d) - and /
**Solution**: Interchange + and x: 6 x 4 + 6 = 24 + 6 = 30. **Answer: (a) + and x**

**Example 4: Number Relation**
If 4 * 5 = 41 and 6 * 7 = 85, then 8 * 3 = ?
Options: (a) 65 (b) 70 (c) 73 (d) 75
**Solution**: Pattern: a * b = a^2 + b^2. 4^2 + 5^2 = 16 + 25 = 41. 8^2 + 3^2 = 64 + 9 = 73. **Answer: (c) 73**

**Example 5: Missing Operator**
Which operator pair makes 12 ? 4 ? 3 = 9 true if normal precedence is followed?
Options: (a) +, - (b) /, x (c) x, - (d) -, +
**Solution**: Test option (b): 12 / 4 x 3 = 3 x 3 = 9. The other listed pairs do not give 9. **Answer: (b) /, x**

**Example 6: Operation Code**
If A @ B means A + B + AB, find 2 @ 3.
Options: (a) 8 (b) 9 (c) 10 (d) 11
**Solution**: 2 @ 3 = 2 + 3 + 2 x 3 = 5 + 6 = 11. **Answer: (d) 11**

**Example 7: Equation Balance**
Which number replaces x: 5 x 4 + x = 27?
Options: (a) 5 (b) 6 (c) 7 (d) 8
**Solution**: BODMAS first: 5 x 4 = 20. Then 20 + x = 27, so x = 7. **Answer: (c) 7**

**Example 8: Reverse Operation**
If 9 # 4 = 45 and 8 # 3 = 32, which rule fits?
Options: (a) a + b (b) a x (b + 1) (c) a^2 - b (d) a - b
**Solution**: 9 x (4 + 1) = 45 and 8 x (3 + 1) = 32. Rule is a x (b + 1). **Answer: (b) a x (b + 1)**

**Example 9: Symbol Meaning**
If P means +, Q means -, R means x, and S means /, find 10 R 2 Q 5.
Options: (a) 10 (b) 12 (c) 15 (d) 20
**Solution**: Replace symbols: 10 x 2 - 5 = 20 - 5 = 15. **Answer: (c) 15**

**Example 10: Bracket Awareness**
Find the value of 18 - (6 / 3) x 4.
Options: (a) 10 (b) 12 (c) 14 (d) 16
**Solution**: Bracket first: 6 / 3 = 2. Then 2 x 4 = 8. Finally 18 - 8 = 10. **Answer: (a) 10**

**Example 11: Odd Equation**
Find the wrong equation if x means + and + means x.
Options: (a) 2 x 3 + 4 = 14 (b) 5 x 2 + 3 = 21 (c) 4 x 1 + 5 = 25 (d) 6 x 2 + 2 = 16
**Solution**: Replace x with + and + with x. Option (a): 2 + 3 x 4 = 14 true. (b): 5 + 2 x 3 = 11, not 21. **Answer: (b) 5 x 2 + 3 = 21**

**Example 12: Operator Priority**
What should be solved first in 9 + 6 / 3 x 2?
Options: (a) 9 + 6 (b) 6 / 3 (c) 3 x 2 (d) 9 + 2
**Solution**: Division and multiplication are solved before addition, left to right. First solve 6 / 3. **Answer: (b) 6 / 3**
""".strip()

LOCKED_FILL_IN_THE_BLANKS_EXAMPLES = """
**Example 1: Preposition**
He is good _____ mathematics.
Options: (a) in (b) at (c) on (d) for
**Solution**: The correct collocation is "good at" a subject or activity. **Answer: (b) at**

**Example 2: Article**
She is _____ honest officer.
Options: (a) a (b) an (c) the (d) no article
**Solution**: "Honest" begins with a vowel sound, so the correct article is "an". **Answer: (b) an**

**Example 3: Tense**
He said that he _____ the work before the deadline.
Options: (a) finishes (b) will finish (c) finished (d) had finished
**Solution**: In reported past context, the earlier completed action takes past perfect. **Answer: (d) had finished**

**Example 4: Subject-Verb Agreement**
Neither of the answers _____ correct.
Options: (a) are (b) were (c) is (d) have been
**Solution**: "Neither" is singular, so the singular verb "is" is required. **Answer: (c) is**

**Example 5: Collocation**
The committee will _____ a decision tomorrow.
Options: (a) do (b) make (c) take (d) give
**Solution**: The standard collocation is "take a decision" in Indian exam usage. **Answer: (c) take**

**Example 6: Connector**
He studied hard, _____ he failed to clear the exam.
Options: (a) because (b) although (c) yet (d) since
**Solution**: The second clause contrasts with the first, so "yet" fits. **Answer: (c) yet**

**Example 7: Vocabulary Context**
The medicine had an _____ effect on the patient.
Options: (a) adverse (b) averse (c) reverse (d) diverse
**Solution**: "Adverse effect" means harmful effect. "Averse" means unwilling. **Answer: (a) adverse**

**Example 8: Infinitive**
She refused _____ the document.
Options: (a) signing (b) to sign (c) sign (d) signed
**Solution**: "Refuse" is followed by the infinitive "to sign". **Answer: (b) to sign**

**Example 9: Phrasal Verb**
The meeting was _____ due to heavy rain.
Options: (a) called off (b) called in (c) called on (d) called up
**Solution**: "Called off" means cancelled. **Answer: (a) called off**

**Example 10: Quantifier**
There is _____ milk left in the bottle.
Options: (a) many (b) few (c) little (d) several
**Solution**: Milk is uncountable, and the sentence suggests a small amount, so "little" fits. **Answer: (c) little**

**Example 11: Pronoun**
Each of the students must bring _____ identity card.
Options: (a) their (b) his or her (c) them (d) theirs
**Solution**: "Each" is singular. In formal SSC grammar, "his or her" keeps agreement. **Answer: (b) his or her**

**Example 12: Comparative**
This route is shorter _____ the other one.
Options: (a) from (b) to (c) than (d) then
**Solution**: Comparative degree uses "than". **Answer: (c) than**
""".strip()

LOCKED_DI_EXAMPLES = """
**Example 1: Table Total**
The table shows sales of A, B, C, and D as 120, 150, 180, and 210 units. What is the total sales?
Options: (a) 540 (b) 600 (c) 660 (d) 720
**Solution**: Total = 120 + 150 + 180 + 210 = 660. **Answer: (c) 660**

**Example 2: Percentage Share**
In a pie chart, total students are 800. Science has 25 percent. How many students are in Science?
Options: (a) 160 (b) 180 (c) 200 (d) 240
**Solution**: Science students = 25 percent of 800 = 1/4 x 800 = 200. **Answer: (c) 200**

**Example 3: Percentage Increase**
Production rose from 240 units to 300 units. What is the percentage increase?
Options: (a) 20 percent (b) 25 percent (c) 30 percent (d) 35 percent
**Solution**: Increase = 300 - 240 = 60. Percentage increase = 60/240 x 100 = 25 percent. **Answer: (b) 25 percent**

**Example 4: Ratio from Table**
The number of boys and girls in a class are 36 and 24. What is the ratio of boys to girls?
Options: (a) 2:3 (b) 3:2 (c) 4:3 (d) 5:4
**Solution**: Boys:girls = 36:24. Divide by 12 to get 3:2. **Answer: (b) 3:2**

**Example 5: Average from Data**
Five values are 12, 18, 20, 25, and 30. What is their average?
Options: (a) 19 (b) 20 (c) 21 (d) 22
**Solution**: Sum = 12 + 18 + 20 + 25 + 30 = 105. Average = 105/5 = 21. **Answer: (c) 21**

**Example 6: Difference Question**
In a bar chart, exports in 2024 and 2025 are 450 crore and 525 crore. What is the difference?
Options: (a) 50 crore (b) 65 crore (c) 75 crore (d) 90 crore
**Solution**: Difference = 525 - 450 = 75 crore. **Answer: (c) 75 crore**

**Example 7: Approximation**
A value is 19.8 percent of 505. Which option is closest?
Options: (a) 80 (b) 90 (c) 100 (d) 120
**Solution**: 19.8 percent is close to 20 percent and 505 is close to 500. Approximate value = 20 percent of 500 = 100. **Answer: (c) 100**

**Example 8: Pie Chart Angle**
If a category is 30 percent of a pie chart, what is its central angle?
Options: (a) 90 degrees (b) 100 degrees (c) 108 degrees (d) 120 degrees
**Solution**: Central angle = 30 percent of 360 degrees = 0.30 x 360 = 108 degrees. **Answer: (c) 108 degrees**

**Example 9: Combined Ratio**
Two departments have employees 48 and 72. If 25 percent of the first and 50 percent of the second are women, how many women are there in total?
Options: (a) 36 (b) 42 (c) 48 (d) 54
**Solution**: Women in first = 25 percent of 48 = 12. Women in second = 50 percent of 72 = 36. Total women = 48. **Answer: (c) 48**

**Example 10: Caselet Total**
A shop sold 80 pens on Monday, 90 on Tuesday, and 110 on Wednesday. If Thursday sales were 20 percent more than Wednesday, what was the four-day total?
Options: (a) 392 (b) 402 (c) 412 (d) 422
**Solution**: Thursday sales = 110 + 20 percent of 110 = 110 + 22 = 132. Four-day total = 80 + 90 + 110 + 132 = 412. **Answer: (c) 412**
""".strip()

LOCKED_ALGEBRA_EXAMPLES = """
**Example 1: Identity Square**
If a + b = 12 and ab = 20, find a^2 + b^2.
Options: (a) 96 (b) 104 (c) 112 (d) 124
**Solution**: a^2 + b^2 = (a + b)^2 - 2ab = 12^2 - 2 x 20 = 144 - 40 = 104. **Answer: (b) 104**

**Example 2: Difference Square**
If a - b = 7 and ab = 18, find a^2 + b^2.
Options: (a) 75 (b) 79 (c) 85 (d) 91
**Solution**: a^2 + b^2 = (a - b)^2 + 2ab = 7^2 + 2 x 18 = 49 + 36 = 85. **Answer: (c) 85**

**Example 3: Product from Sum of Squares**
If x + y = 10 and x^2 + y^2 = 58, find xy.
Options: (a) 18 (b) 20 (c) 21 (d) 24
**Solution**: (x + y)^2 = x^2 + y^2 + 2xy. So 100 = 58 + 2xy. Hence 2xy = 42 and xy = 21. **Answer: (c) 21**

**Example 4: Quadratic Roots**
Find the roots of x^2 - 7x + 12 = 0.
Options: (a) 2, 6 (b) 3, 4 (c) 1, 12 (d) 5, 2
**Solution**: Factor x^2 - 7x + 12 = (x - 3)(x - 4). Roots are 3 and 4. **Answer: (b) 3, 4**

**Example 5: Value of x + 1/x**
If x + 1/x = 5, find x^2 + 1/x^2.
Options: (a) 21 (b) 23 (c) 25 (d) 27
**Solution**: x^2 + 1/x^2 = (x + 1/x)^2 - 2 = 5^2 - 2 = 23. **Answer: (b) 23**

**Example 6: Cube Identity**
If a + b = 6 and ab = 8, find a^3 + b^3.
Options: (a) 72 (b) 80 (c) 88 (d) 96
**Solution**: a^3 + b^3 = (a + b)^3 - 3ab(a + b) = 6^3 - 3 x 8 x 6 = 216 - 144 = 72. **Answer: (a) 72**

**Example 7: Factorisation**
Factor x^2 + 9x + 20.
Options: (a) (x + 4)(x + 5) (b) (x + 2)(x + 10) (c) (x - 4)(x - 5) (d) (x + 1)(x + 20)
**Solution**: Two numbers with product 20 and sum 9 are 4 and 5. Therefore x^2 + 9x + 20 = (x + 4)(x + 5). **Answer: (a) (x + 4)(x + 5)**

**Example 8: Linear Equation**
Solve 3x + 7 = 28.
Options: (a) 5 (b) 6 (c) 7 (d) 8
**Solution**: 3x = 28 - 7 = 21. Hence x = 7. **Answer: (c) 7**

**Example 9: Substitution**
If x = 3, find 2x^2 - 5x + 4.
Options: (a) 5 (b) 7 (c) 9 (d) 11
**Solution**: 2x^2 - 5x + 4 = 2 x 9 - 15 + 4 = 18 - 15 + 4 = 7. **Answer: (b) 7**

**Example 10: Symmetric Expression**
If a + b + c = 9 and ab + bc + ca = 20, find a^2 + b^2 + c^2.
Options: (a) 31 (b) 35 (c) 41 (d) 45
**Solution**: a^2 + b^2 + c^2 = (a + b + c)^2 - 2(ab + bc + ca) = 9^2 - 2 x 20 = 81 - 40 = 41. **Answer: (c) 41**
""".strip()

LOCKED_TRIGONOMETRY_EXAMPLES = """
**Example 1: Standard Value**
Find sin 30 degrees.
Options: (a) 1/2 (b) 1/sqrt(2) (c) sqrt(3)/2 (d) 1
**Solution**: From the standard value table, sin 30 degrees = 1/2. **Answer: (a) 1/2**

**Example 2: Complementary Angle**
cos 60 degrees is equal to:
Options: (a) sin 30 degrees (b) sin 60 degrees (c) tan 30 degrees (d) cot 60 degrees
**Solution**: cos theta = sin(90 degrees - theta). Therefore cos 60 degrees = sin 30 degrees. **Answer: (a) sin 30 degrees**

**Example 3: Pythagorean Identity**
If sin theta = 3/5 and theta is acute, find cos theta.
Options: (a) 2/5 (b) 3/4 (c) 4/5 (d) 5/4
**Solution**: sin^2 theta + cos^2 theta = 1. cos theta = sqrt(1 - 9/25) = sqrt(16/25) = 4/5. **Answer: (c) 4/5**

**Example 4: Tan from Sin and Cos**
If sin theta = 5/13 and cos theta = 12/13, find tan theta.
Options: (a) 5/12 (b) 12/5 (c) 13/5 (d) 5/13
**Solution**: tan theta = sin theta / cos theta = (5/13)/(12/13) = 5/12. **Answer: (a) 5/12**

**Example 5: Reciprocal Identity**
If tan theta = 3/4, find cot theta.
Options: (a) 3/4 (b) 4/3 (c) 5/3 (d) 5/4
**Solution**: cot theta is reciprocal of tan theta. Therefore cot theta = 4/3. **Answer: (b) 4/3**

**Example 6: Expression Simplification**
Simplify sin^2 theta + cos^2 theta.
Options: (a) 0 (b) 1 (c) tan theta (d) sec theta
**Solution**: The basic Pythagorean identity is sin^2 theta + cos^2 theta = 1. **Answer: (b) 1**

**Example 7: Sec and Cos**
If cos theta = 2/5, find sec theta.
Options: (a) 2/5 (b) 5/2 (c) 3/5 (d) 5/3
**Solution**: sec theta = 1/cos theta = 1/(2/5) = 5/2. **Answer: (b) 5/2**

**Example 8: Height and Distance**
A pole casts a shadow of 10 m when the angle of elevation of the sun is 45 degrees. Find the height of the pole.
Options: (a) 5 m (b) 10 m (c) 15 m (d) 20 m
**Solution**: tan 45 degrees = height/shadow = height/10. Since tan 45 degrees = 1, height = 10 m. **Answer: (b) 10 m**

**Example 9: Height with tan 30**
The angle of elevation of the top of a tower is 30 degrees from a point 30sqrt(3) m away. Find the height of the tower.
Options: (a) 10 m (b) 20 m (c) 30 m (d) 40 m
**Solution**: tan 30 degrees = height/distance = h/(30sqrt(3)). Since tan 30 degrees = 1/sqrt(3), h = 30 m. **Answer: (c) 30 m**

**Example 10: Identity Conversion**
Simplify 1 + tan^2 theta.
Options: (a) sec^2 theta (b) cosec^2 theta (c) cot^2 theta (d) sin^2 theta
**Solution**: The identity is 1 + tan^2 theta = sec^2 theta. **Answer: (a) sec^2 theta**
""".strip()

LOCKED_AVERAGES_MIXTURES_ALLIGATION_EXAMPLES = """
**Example 1: Average Basics**
The scores of 4 students are 18, 20, 22, and 24. What is their average?
Options: (a) 20 (b) 20.5 (c) 21 (d) 22
**Solution**: Average = (18 + 20 + 22 + 24) / 4 = 84 / 4 = 21. **Answer: (c) 21**

**Example 2: Average from Total**
The average of 6 numbers is 15. If one number is 18, find the average of the other 5 numbers.
Options: (a) 12 (b) 13.2 (c) 14.4 (d) 15
**Solution**: Total of 6 numbers = 6 x 15 = 90. The sum of the other 5 = 90 - 18 = 72. Average = 72 / 5 = 14.4. **Answer: (c) 14.4**

**Example 3: Weighted Average**
Paper A has weight 2 and score 80, Paper B has weight 1 and score 60. What is weighted average score?
Options: (a) 66.67 (b) 70 (c) 73.33 (d) 80
**Solution**: Weighted average = (2 x 80 + 1 x 60) / (2 + 1) = 220 / 3 = 73.33. **Answer: (c) 73.33**

**Example 4: Average After Replacing One Score**
The average of five ages is 20. If one age of 16 is replaced by 24, what is the new average?
Options: (a) 20 (b) 20.4 (c) 20.8 (d) 21.6
**Solution**: Original total = 5 x 20 = 100. Replacing 16 with 24 increases sum by 8. New total is 108. New average = 108 / 5 = 21.6. **Answer: (d) 21.6**

**Example 5: Average Speed for Equal Distances**
Run first 20 km at 20 km/h and next 20 km at 60 km/h. What is average speed?
Options: (a) 30 km/h (b) 40 km/h (c) 50 km/h (d) 60 km/h
**Solution**: Total distance = 40 km. Time = 20/20 + 20/60 = 1 + 0.333 = 1.333 h. Average speed = 40 / 1.333 = 30 km/h. **Answer: (a) 30 km/h**

**Example 6: Average Speed After Unequal Distance**
A driver covers 30 km in 1.5 h and 60 km in 1 h. What is average speed?
Options: (a) 36 km/h (b) 45 km/h (c) 50 km/h (d) 54 km/h
**Solution**: Total distance = 90 km. Total time = 1.5 + 1 = 2.5 h. Average speed = 90 / 2.5 = 36 km/h. **Answer: (a) 36 km/h**

**Example 7: Mixture Ratio**
An alloy has 20% and 80% purity components in equal volumes. What is purity of the mix?
Options: (a) 30% (b) 40% (c) 50% (d) 60%
**Solution**: If equal volume, average purity is (20 + 80) / 2 = 50%. **Answer: (c) 50%**

**Example 8: Alligation Ratio**
To make 40% solution from 20% and 70% solutions, what is the ratio of 70% part to 20% part?
Options: (a) 2:3 (b) 3:2 (c) 1:2 (d) 2:1
**Solution**: Use alligation: (70 - 40) : (40 - 20) = 30 : 20 = 3:2. So for 70% part to 20% part, ratio = 3:2. **Answer: (b) 3:2**

**Example 9: Selling Price from Mixed Cost**
A shopkeeper buys 20 liters at Rs 48/liter and 10 liters at Rs 36/liter. He sells all at 10% profit. What is selling price per liter?
Options: (a) 48.4 Rs/liter (b) 49 Rs/liter (c) 50 Rs/liter (d) 52 Rs/liter
**Solution**: Cost: 20 x 48 + 10 x 36 = 1320. Total 30 liters. Avg cost = Rs 44/liter. At 10% profit: 44 x 1.10 = 48.4. **Answer: (a) 48.4 Rs/liter**

**Example 10: Age Average with Changes**
Average age of 4 students is 21 years. Two students with ages 18 and 22 leave, and two students with ages 24 and 26 join. What is new average age?
Options: (a) 21 (b) 22.5 (c) 23 (d) 23.5
**Solution**: Initial sum = 4 x 21 = 84. New sum = 84 - 18 - 22 + 24 + 26 = 94. New count still 4. New average = 94 / 4 = 23.5. **Answer: (d) 23.5**

**Example 11: Class Average Adjustment**
Class average of 40 students is 72. If 5 new students each scoring 84 join, new average is?
Options: (a) 72.5 (b) 73 (c) 73.33 (d) 74
**Solution**: Initial total = 40 x 72 = 2880. New total = 2880 + 5 x 84 = 3300. New count = 45. Average = 3300 / 45 = 73.333.... **Answer: (c) 73.33**

**Example 12: Average After Replacement in Mixture**
A container has 60 L of 20% mixture. 15 L is removed and replaced by 40% mixture. What is final concentration?
Options: (a) 22.5% (b) 25% (c) 27.5% (d) 30%
**Solution**: Initial concentrate = 0.20 x 60 = 12 L. Removing 15 L removes 20% of 15 = 3 L concentrate, so remaining concentrate is 9 L in 45 L. Add 15 L at 40% gives 6 L concentrate. Total concentrate = 15 L in 60 L => 25%. **Answer: (b) 25%**
""".strip()

LOCKED_SERIES_CODING_EXAMPLES = """
**Example 1: Number Series - Constant Difference**
Find the missing term: 7, 12, 17, 22, ?
Options: (a) 25 (b) 26 (c) 27 (d) 28
**Solution**: The difference is +5 each time. Next term = 22 + 5 = 27. **Answer: (c) 27**

**Example 2: Number Series - Increasing Difference**
Find the missing term: 3, 7, 13, 21, 31, ?
Options: (a) 41 (b) 43 (c) 45 (d) 47
**Solution**: Differences are +4, +6, +8, +10. Next difference = +12. Next term = 31 + 12 = 43. **Answer: (b) 43**

**Example 3: Number Series - Squares**
Find the missing term: 4, 9, 16, 25, ?
Options: (a) 30 (b) 32 (c) 34 (d) 36
**Solution**: Terms are 2^2, 3^2, 4^2, 5^2. Next term = 6^2 = 36. **Answer: (d) 36**

**Example 4: Number Series - Alternating Pattern**
Find the missing term: 5, 10, 7, 14, 11, 22, ?
Options: (a) 13 (b) 15 (c) 17 (d) 19
**Solution**: Split odd and even positions. Odd-position terms are 5, 7, 11, ? with differences +2, +4, so next difference = +6. Missing term = 17. Even-position terms are double the previous odd term: 5->10, 7->14, 11->22. **Answer: (c) 17**

**Example 5: Letter Series - Forward Shift**
Find the missing term: A, D, G, J, ?
Options: (a) K (b) L (c) M (d) N
**Solution**: Alphabet positions are 1, 4, 7, 10. Difference = +3. Next position = 13 = M. **Answer: (c) M**

**Example 6: Letter Series - Reverse Shift**
Find the missing term: Z, W, T, Q, ?
Options: (a) N (b) O (c) P (d) M
**Solution**: Positions are 26, 23, 20, 17. Difference = -3. Next position = 14 = N. **Answer: (a) N**

**Example 7: Coding-Decoding - Constant Shift**
If CAT is coded as DBU, how is DOG coded?
Options: (a) EPH (b) EOG (c) CNE (d) FQH
**Solution**: Each letter is shifted +1: C->D, A->B, T->U. DOG becomes EPH. **Answer: (a) EPH**

**Example 8: Coding-Decoding - Reverse Alphabet**
If A is coded as Z and C is coded as X, how is DOG coded?
Options: (a) WLT (b) WLH (c) XLT (d) WMG
**Solution**: Reverse alphabet pairs are A-Z, B-Y, C-X. D->W, O->L, G->T. DOG becomes WLT. **Answer: (a) WLT**

**Example 9: Mixed Alpha-Numeric Series**
Find the missing term: A1, C4, E9, G16, ?
Options: (a) H25 (b) I20 (c) I25 (d) J25
**Solution**: Letters move +2 positions: A, C, E, G, I. Numbers are squares: 1, 4, 9, 16, 25. Missing term = I25. **Answer: (c) I25**

**Example 10: Analogy Bridge**
ACE : BDF :: GIK : ?
Options: (a) HJL (b) HJM (c) HJK (d) IJL
**Solution**: Each letter is shifted +1: A->B, C->D, E->F. Apply the same shift to GIK: G->H, I->J, K->L. **Answer: (a) HJL**
""".strip()

LOCKED_SYLLOGISM_EXAMPLES = """
**Example 1: All + All Chain**
Statements: All roses are flowers. All flowers are plants.
Conclusion I: All roses are plants.
Conclusion II: All plants are roses.
Options: (a) Only I follows (b) Only II follows (c) Both follow (d) Neither follows
**Solution**: Rose is fully inside flower, and flower is fully inside plant. Therefore rose is fully inside plant. The reverse relation is not definite. **Answer: (a) Only I follows**

**Example 2: Some + All Chain**
Statements: Some pens are books. All books are papers.
Conclusion I: Some pens are papers.
Conclusion II: All papers are pens.
Options: (a) Only I follows (b) Only II follows (c) Both follow (d) Neither follows
**Solution**: The pens that are books must also be papers because every book is paper. The reverse universal conclusion is not definite. **Answer: (a) Only I follows**

**Example 3: No + All Chain**
Statements: No mango is apple. All fruits are mangoes.
Conclusion I: No fruit is apple.
Conclusion II: Some apples are fruits.
Options: (a) Only I follows (b) Only II follows (c) Both follow (d) Neither follows
**Solution**: Every fruit is inside mango, and mango has no overlap with apple. Therefore no fruit is apple. The second conclusion contradicts the separation. **Answer: (a) Only I follows**

**Example 4: Some + No**
Statements: Some cars are buses. No bus is train.
Conclusion I: Some cars are not trains.
Conclusion II: No car is train.
Options: (a) Only I follows (b) Only II follows (c) Both follow (d) Neither follows
**Solution**: The cars that are buses cannot be trains, so at least some cars are not trains. But other cars may or may not be trains. **Answer: (a) Only I follows**

**Example 5: All + Some**
Statements: All clocks are watches. Some watches are alarms.
Conclusion I: Some clocks are alarms.
Conclusion II: Some alarms are watches.
Options: (a) Only I follows (b) Only II follows (c) Both follow (d) Neither follows
**Solution**: The some-watch overlap with alarms may lie outside clocks, so I is not definite. Since some watches are alarms, conversion gives some alarms are watches. **Answer: (b) Only II follows**

**Example 6: Only a Few**
Statements: Only a few teachers are writers.
Conclusion I: Some teachers are writers.
Conclusion II: Some teachers are not writers.
Options: (a) Only I follows (b) Only II follows (c) Both follow (d) Neither follows
**Solution**: In SSC syllogism, only a few A are B means some A are B and some A are not B. Both conclusions follow. **Answer: (c) Both follow**

**Example 7: Possibility Without Definite Block**
Statements: All cups are plates. Some plates are bowls.
Conclusion I: Some cups being bowls is a possibility.
Conclusion II: No cup is bowl.
Options: (a) Only I follows (b) Only II follows (c) Both follow (d) Neither follows
**Solution**: There is no statement separating cups from bowls. The some plates that are bowls may overlap with cups, so possibility follows. A definite no-overlap conclusion does not follow. **Answer: (a) Only I follows**

**Example 8: Possibility Blocked by No**
Statements: All cats are animals. No animal is stone.
Conclusion I: Some cats are stones is a possibility.
Conclusion II: No cat is stone.
Options: (a) Only I follows (b) Only II follows (c) Both follow (d) Neither follows
**Solution**: Cat is fully inside animal, and animal is fully outside stone. Therefore cats cannot be stones. Possibility is blocked. **Answer: (b) Only II follows**

**Example 9: Either-Or Pair**
Statements: Some files are folders. No folder is document.
Conclusion I: Some files are documents.
Conclusion II: No file is document.
Options: (a) Only I follows (b) Only II follows (c) Either I or II follows (d) Neither follows
**Solution**: The files that are folders are not documents, but other files may be documents. So neither the positive some relation nor the total no relation is definite. **Answer: (d) Neither follows**

**Example 10: Venn Conversion**
Statements: Some tables are chairs. All chairs are wood.
Conclusion I: Some wood is table.
Conclusion II: Some chairs are tables.
Options: (a) Only I follows (b) Only II follows (c) Both follow (d) Neither follows
**Solution**: The overlapping part of table and chair is inside wood. Therefore some wood is table. The statement some tables are chairs also converts to some chairs are tables. **Answer: (c) Both follow**
""".strip()


TOPICS: dict[str, dict[str, Any]] = {
    "percentages-ratio": {
        "title": "Percentages, Ratio, and Proportion",
        "section": "Quantitative Aptitude",
        "description": "Deep SSC CGL Tier-I Quant note for 200/200 preparation.",
        "tags": ["ssc-cgl", "quant", "deepseek-authored"],
        "output": ROOT / "docs" / "ssc-cgl" / "quant" / "percentages-ratio.md",
        "routeLinks": ["/exams/ssc-cgl/topics/percentages", "/exams/ssc-cgl/topics/ratio-proportion"],
        "officialAnchors": [
            "SSC CGL Tier-I Quantitative Aptitude asks arithmetic and numerical ability at speed.",
            "Percentage, ratio, proportion, profit-loss, interest, mixtures, time-work, and data interpretation share the same base and multiplier logic.",
            "Tier-I has 25 Quant questions, 50 marks, and a 15-minute sectional timer in the 2026 notice.",
        ],
        "topicScope": [
            "percent-to-fraction conversions",
            "base value and changed base",
            "successive increase and decrease",
            "percentage points versus percentage change",
            "ratio multiplier method",
            "compound ratio and proportion",
            "partnership and share distribution",
            "profit-loss and discount linkage",
            "SI/CI and data interpretation linkage",
        ],
    },
    "averages-mixtures-alligation": {
        "title": "Averages, Mixtures, and Alligation",
        "section": "Quantitative Aptitude",
        "description": "Deep SSC CGL Tier-I Quant note for averages, mixtures, alligation, and weighted replacement under a 36-second bar.",
        "tags": ["ssc-cgl", "quant", "averages", "mixtures", "alligation", "deepseek-authored"],
        "output": ROOT / "docs" / "ssc-cgl" / "quant" / "averages-mixtures-alligation.md",
        "routeLinks": [
            "/exams/ssc-cgl/topics/averages-mixtures-alligation",
            "/exams/ssc-cgl/topics/percentages-ratio",
            "/exams/ssc-cgl/topics/ratio-proportion",
        ],
        "officialAnchors": [
            "SSC CGL Tier-I Quantitative Aptitude has 25 quantitative questions, 50 marks, and a 15-minute section, so this topic needs a 36-second attempt frame.",
            "Average, mixture, and alligation questions are linked through ratio, weighted totals, replacement, concentration, and option elimination.",
            "Common traps are wrong base, wrong denominator, equal-distance confusion in speed average, and silent over-inference in price-mix setup.",
        ],
        "topicScope": [
            "simple average and weighted average",
            "average replacement of one or more numbers",
            "average speed and equal-distance versus equal-time distinction",
            "class average and age-average updates",
            "replacement in mixtures and concentration updates",
            "alligation ratio and cross-difference shortcuts",
            "selling price or total cost from mixed quantity and price",
            "trap rows for base selection, rounding, and missing data",
            "quick 36-second options-first repair plan",
        ],
        "lockedSolvedExamples": LOCKED_AVERAGES_MIXTURES_ALLIGATION_EXAMPLES,
    },
    "time-work-pipes": {
        "title": "Time, Work, and Pipes",
        "section": "Quantitative Aptitude",
        "description": "Deep SSC CGL Tier-I Quant note for 200/200 preparation.",
        "tags": ["ssc-cgl", "quant", "deepseek-authored"],
        "output": ROOT / "docs" / "ssc-cgl" / "quant" / "time-work-pipes.md",
        "routeLinks": ["/exams/ssc-cgl/topics/time-work-pipes", "/exams/ssc-cgl/tests/ssc-cgl-quantitative-aptitude-speed-sprint"],
        "officialAnchors": [
            "SSC CGL Tier-I Quantitative Aptitude asks numerical ability at speed under a 15-minute sectional timer.",
            "Time-work and pipes questions are rate problems: individual efficiency, combined work, alternation, wages, and inlet/outlet signs.",
            "A 200/200 Quant attempt needs fast LCM work units, rate addition, inverse proportion control, and clean sign handling for pipes.",
        ],
        "topicScope": [
            "LCM total work method",
            "efficiency and rate conversion",
            "men-days and inverse proportionality",
            "combined work with positive and negative rates",
            "alternate-day and cyclic work",
            "work and wages distribution",
            "pipes and cisterns with inlet and outlet signs",
            "leakage and partially filled tank questions",
            "option-elimination under the 15-minute Quant section timer",
        ],
    },
    "calculation-speed": {
        "title": "Calculation Speed and Option-Gap Arithmetic",
        "section": "Quantitative Aptitude",
        "description": "Deep SSC CGL Tier-I Quant note for mental calculation, approximation, cancellation, option-gap judgement, and 36-second execution.",
        "tags": ["ssc-cgl", "quant", "calculation-speed", "deepseek-authored"],
        "output": ROOT / "docs" / "ssc-cgl" / "quant" / "calculation-speed.md",
        "routeLinks": [
            "/exams/ssc-cgl/topics/calculation-speed",
            "/exams/ssc-cgl/tests/ssc-cgl-topic-calculation-speed-36-second-drill",
            "/exams/ssc-cgl/tests/ssc-cgl-quant-50-50-set-01",
        ],
        "officialAnchors": [
            "SSC CGL Tier-I Quantitative Aptitude has 25 questions, 50 marks, and a 15-minute sectional timer, which is 36 seconds per question.",
            "A 50/50 Quant score needs mental calculation before written calculation: fraction-percent recall, cancellation, approximation, option scanning, and final-unit checking.",
            "Calculation speed is not a separate syllabus chapter, but it controls arithmetic, algebra, geometry, trigonometry, data interpretation, and every mixed Quant paper.",
        ],
        "topicScope": [
            "36-second attempt plan for all Quant questions",
            "fraction, decimal, and percent instant recall",
            "multiplication base methods and squaring shortcuts",
            "division by factors, cancellation, and ratio simplification",
            "option-gap judgement before exact calculation",
            "approximation boundaries for DI and arithmetic",
            "unit digit, digital sum, divisibility, and sanity checks",
            "rough-sheet layout for 25 questions in 15 minutes",
            "skip-and-return rules for calculations that cross 30 seconds",
            "repair drills for slow tables, weak fraction recall, and over-calculation",
        ],
    },
    "number-system": {
        "title": "Number System",
        "section": "Quantitative Aptitude",
        "description": "Deep SSC CGL Tier-I Quant note for number system, divisibility, HCF-LCM, and remainders.",
        "tags": ["ssc-cgl", "quant", "number-system", "deepseek-authored"],
        "output": ROOT / "docs" / "ssc-cgl" / "quant" / "number-system.md",
        "routeLinks": ["/exams/ssc-cgl/topics/number-system", "/exams/ssc-cgl/tests/ssc-cgl-quantitative-aptitude-speed-sprint"],
        "officialAnchors": [
            "SSC CGL Tier-I Quantitative Aptitude rewards fast arithmetic foundations under a 15-minute sectional timer.",
            "Number system questions appear directly through divisibility, HCF, LCM, remainders, simplification, surds, indices, unit digits, and indirectly inside every arithmetic topic.",
            "A 200/200 attempt needs instant factorization, divisibility tests, remainder control, and option elimination before long calculation.",
        ],
        "topicScope": [
            "place value and number classification",
            "divisibility rules from 2 to 19",
            "prime factorization and exponent counting",
            "HCF and LCM by factor and division methods",
            "remainders, cyclicity, and unit digits",
            "surds, indices, rationalization, and simplification",
            "fractions and recurring decimals",
            "least and greatest number conditions",
            "option testing and speed checks",
        ],
    },
    "hcf-and-lcm": {
        "title": "HCF and LCM",
        "section": "Quantitative Aptitude",
        "description": "Deep SSC CGL Tier-I Quant note for HCF, LCM, divisors, multiples, remainders, fractions, and 36-second execution.",
        "tags": ["ssc-cgl", "quant", "hcf-and-lcm", "deepseek-authored"],
        "output": ROOT / "docs" / "ssc-cgl" / "quant" / "hcf-and-lcm.md",
        "routeLinks": [
            "/exams/ssc-cgl/topics/hcf-and-lcm",
            "/exams/ssc-cgl/topics/number-system",
            "/exams/ssc-cgl/tests/ssc-cgl-quantitative-aptitude-speed-sprint",
        ],
        "officialAnchors": [
            "SSC CGL Tier-I Quantitative Aptitude has 25 questions, 50 marks, and a 15-minute sectional timer, so every direct HCF/LCM item should normally close inside 36 seconds.",
            "HCF/LCM appears directly in number system and indirectly inside fractions, time-work, bells, tiling, packets, ratio, simplification, and measurement questions.",
            "A 200/200 attempt needs instant recognition of divisor wording, multiple wording, common remainder wording, common deficit wording, and two-number product relation.",
        ],
        "topicScope": [
            "highest common factor and least common multiple from first principles",
            "prime power method and Euclidean division method",
            "two-number relation product = HCF x LCM",
            "co-prime pair logic and possible-pair questions",
            "HCF and LCM of fractions",
            "common remainder and common deficit questions",
            "greatest number dividing several values after subtracting remainders",
            "least number divisible by several values after adding common remainder",
            "bells, signals, packets, rods, tiles, and measuring unit applications",
            "option testing, divisibility checks, and 36-second skip rules",
        ],
    },
    "simplification": {
        "title": "Simplification and Surds/Indices",
        "section": "Quantitative Aptitude",
        "description": "Deep SSC CGL Tier-I Quant note for simplification, BODMAS, fractions, decimals, surds, indices, approximation, and option-gap arithmetic.",
        "tags": ["ssc-cgl", "quant", "simplification", "deepseek-authored"],
        "output": ROOT / "docs" / "ssc-cgl" / "quant" / "simplification.md",
        "routeLinks": [
            "/exams/ssc-cgl/topics/simplification",
            "/exams/ssc-cgl/topics/calculation-speed",
            "/exams/ssc-cgl/tests/ssc-cgl-topic-calculation-speed-36-second-drill",
            "/exams/ssc-cgl/tests/ssc-cgl-quant-50-50-set-01",
        ],
        "officialAnchors": [
            "SSC CGL Tier-I Quantitative Aptitude gives 25 questions in 15 minutes, so simplification has to be an automatic 36-second arithmetic system.",
            "Simplification is tested directly through BODMAS, fractions, decimals, surds, indices, approximation, and indirectly inside DI, algebra, trigonometry, percentage, ratio, interest, and mensuration.",
            "A 200/200 attempt needs method selection before calculation: cancellation, fraction-percent conversion, exact arithmetic, approximation, option-gap judgement, or skip-and-return.",
        ],
        "topicScope": [
            "BODMAS and same-priority left-to-right operations",
            "bracket handling and negative sign distribution",
            "fraction cancellation, LCM addition, compound fractions, and reciprocal division",
            "decimal-to-fraction and fraction-to-percent instant conversions",
            "indices laws including zero, negative, and fractional powers",
            "surds, square-factor extraction, like surds, and rationalisation",
            "base-method multiplication, option-gap arithmetic, unit digit, and digital sum checks",
            "approximation boundaries for wide and close options",
            "rough-sheet layout for fast exactness",
            "timed repair drills for sign, order, cancellation, conversion, and over-calculation mistakes",
        ],
        "lockedSolvedExamples": LOCKED_SIMPLIFICATION_EXAMPLES,
    },
    "profit-loss-discount": {
        "title": "Profit, Loss, and Discount",
        "section": "Quantitative Aptitude",
        "description": "Deep SSC CGL Tier-I Quant note for profit, loss, marked price, discount, and changed-base traps.",
        "tags": ["ssc-cgl", "quant", "profit-loss", "deepseek-authored"],
        "output": ROOT / "docs" / "ssc-cgl" / "quant" / "profit-loss-discount.md",
        "routeLinks": ["/exams/ssc-cgl/topics/profit-loss-discount", "/exams/ssc-cgl/topics/percentages", "/exams/ssc-cgl/topics/ratio-proportion"],
        "officialAnchors": [
            "SSC CGL Tier-I Quantitative Aptitude uses profit-loss and discount as high-speed percentage application questions.",
            "The topic tests CP, SP, MP, profit percent, loss percent, discount percent, successive discounts, false weights, and shopkeeper transaction language.",
            "A 200/200 attempt needs base discipline: profit and loss are on cost price, discount is on marked price, and successive changes must use multipliers.",
        ],
        "topicScope": [
            "cost price selling price marked price",
            "profit percent and loss percent base selection",
            "discount and successive discount",
            "marked price versus selling price",
            "false weight and dishonest dealer",
            "overheads and transport cost",
            "two-article gain-loss balancing",
            "percentage multiplier method",
            "option scanning and trap repair",
        ],
    },
    "time-speed-distance": {
        "title": "Time, Speed, and Distance",
        "section": "Quantitative Aptitude",
        "description": "Deep SSC CGL Tier-I Quant note for speed, relative motion, trains, boats, streams, and races.",
        "tags": ["ssc-cgl", "quant", "time-speed-distance", "deepseek-authored"],
        "output": ROOT / "docs" / "ssc-cgl" / "quant" / "time-speed-distance.md",
        "routeLinks": ["/exams/ssc-cgl/topics/time-speed-distance", "/exams/ssc-cgl/topics/ratio-proportion", "/exams/ssc-cgl/tests/ssc-cgl-quantitative-aptitude-speed-sprint"],
        "officialAnchors": [
            "SSC CGL Tier-I Quantitative Aptitude includes speed-time-distance as a rate topic under strict timing.",
            "Questions test basic distance, average speed, relative speed, train crossing, boats and streams, races, circular tracks, and speed-ratio logic.",
            "A 200/200 attempt needs unit conversion, inverse proportionality, relative speed selection, and clear object-length handling.",
        ],
        "topicScope": [
            "speed distance time formula",
            "km/h to m/s conversion",
            "average speed and weighted speed",
            "relative speed same and opposite directions",
            "train crossing pole platform and another train",
            "boats and streams upstream downstream",
            "races and circular tracks",
            "speed ratio with fixed distance or fixed time",
            "shortcut selection and skip rules",
        ],
    },
    "simple-compound-interest": {
        "title": "Simple and Compound Interest",
        "section": "Quantitative Aptitude",
        "description": "Deep SSC CGL Tier-I Quant note for simple interest, compound interest, installments, and effective-rate shortcuts.",
        "tags": ["ssc-cgl", "quant", "interest", "deepseek-authored"],
        "output": ROOT / "docs" / "ssc-cgl" / "quant" / "simple-compound-interest.md",
        "routeLinks": ["/exams/ssc-cgl/topics/simple-compound-interest", "/exams/ssc-cgl/topics/percentages", "/exams/ssc-cgl/tests/ssc-cgl-quantitative-aptitude-speed-sprint"],
        "officialAnchors": [
            "SSC CGL Tier-I Quantitative Aptitude includes arithmetic questions under a 15-minute sectional timer, which is 36 seconds per question.",
            "Interest questions test principal, rate, time, amount, SI, CI, annual and half-yearly compounding, difference between SI and CI, and installment language.",
            "A 50/50 Quant attempt needs formula recall, multiplier shortcuts, effective-rate control, and fast recognition of when to avoid full expansion.",
        ],
        "topicScope": [
            "SI formula and direct substitutions",
            "CI amount formula and multiplier method",
            "difference between SI and CI for two and three years",
            "half-yearly quarterly and variable-rate compounding",
            "installment and equal annual payment questions",
            "population depreciation and growth linkages",
            "rate-time-principal reverse questions",
            "36-second attempt plan and skip thresholds",
        ],
    },
    "geometry-mensuration": {
        "title": "Geometry and Mensuration",
        "section": "Quantitative Aptitude",
        "description": "Deep SSC CGL Tier-I Quant note for geometry, mensuration, theorem triggers, area, surface area, and volume.",
        "tags": ["ssc-cgl", "quant", "geometry", "mensuration", "deepseek-authored"],
        "output": ROOT / "docs" / "ssc-cgl" / "quant" / "geometry-mensuration.md",
        "routeLinks": ["/exams/ssc-cgl/topics/geometry-mensuration", "/exams/ssc-cgl/topics/trigonometry", "/exams/ssc-cgl/tests/ssc-cgl-quantitative-aptitude-speed-sprint"],
        "officialAnchors": [
            "SSC CGL Tier-I Quantitative Aptitude includes geometry and mensuration under a 15-minute sectional timer, which is 36 seconds per question.",
            "Geometry questions test triangles, circles, quadrilaterals, angles, similarity, Pythagoras, coordinate-style reasoning, and mensuration formula selection.",
            "A 50/50 Quant attempt needs theorem-trigger recall, diagram discipline, formula memory, and fast elimination of impossible dimensions.",
        ],
        "topicScope": [
            "lines angles triangles and congruence",
            "similarity Pythagoras median angle bisector and area relations",
            "circle theorems tangent secant chord cyclic quadrilateral",
            "quadrilateral polygon and coordinate-style area",
            "2D mensuration perimeter area sector segment",
            "3D mensuration cube cuboid cylinder cone sphere hemisphere frustum",
            "surface area volume conversion and units",
            "36-second attempt plan for theorem versus formula questions",
        ],
    },
    "data-interpretation": {
        "title": "Data Interpretation",
        "section": "Quantitative Aptitude",
        "description": "Deep SSC CGL Tier-I Quant note for tables, charts, caselets, approximation, percentage comparison, and 36-second DI scoring.",
        "tags": ["ssc-cgl", "quant", "data-interpretation", "deepseek-authored"],
        "output": ROOT / "docs" / "ssc-cgl" / "quant" / "data-interpretation.md",
        "routeLinks": ["/exams/ssc-cgl/topics/data-interpretation", "/exams/ssc-cgl/topics/percentages", "/exams/ssc-cgl/topics/ratio-proportion"],
        "officialAnchors": [
            "SSC CGL Tier-I Quantitative Aptitude may use tables, charts, and arithmetic-heavy data questions inside the 15-minute section timer.",
            "Data Interpretation is arithmetic under pressure: percentage, ratio, average, increase-decrease, totals, comparison, and approximation.",
            "A 50/50 Quant attempt needs row-column discipline, base identification, option-aware approximation, and a 36-second attempt plan for each DI item.",
        ],
        "topicScope": [
            "table reading and row-column locking",
            "bar chart pie chart line graph and mixed chart handling",
            "caselet and missing-data setup",
            "percentage share and percentage change",
            "ratio comparison average and total questions",
            "approximation and option-range elimination",
            "multi-question set time budgeting",
            "36-second attempt plan for DI item selection",
        ],
        "lockedSolvedExamples": LOCKED_DI_EXAMPLES,
    },
    "algebra": {
        "title": "Algebra",
        "section": "Quantitative Aptitude",
        "description": "Deep SSC CGL Tier-I Quant note for identities, equations, factorisation, roots, and algebraic shortcuts.",
        "tags": ["ssc-cgl", "quant", "algebra", "deepseek-authored"],
        "output": ROOT / "docs" / "ssc-cgl" / "quant" / "algebra.md",
        "routeLinks": ["/exams/ssc-cgl/topics/algebra", "/exams/ssc-cgl/topics/number-system", "/exams/ssc-cgl/tests/ssc-cgl-quantitative-aptitude-speed-sprint"],
        "officialAnchors": [
            "SSC CGL Tier-I Quantitative Aptitude includes algebraic identities and equation manipulation under a 15-minute timer, which is 36 seconds per question.",
            "Algebra questions test identities, factorisation, equations, roots, substitution, symmetric expressions, and expression-value shortcuts.",
            "A 50/50 Quant attempt needs identity recall, structure recognition, option substitution, and avoiding unnecessary expansion.",
        ],
        "topicScope": [
            "linear and quadratic equations",
            "factorisation and algebraic identities",
            "a plus b whole square cube and related expansions",
            "x plus 1/x expression families",
            "roots coefficients and quadratic shortcuts",
            "inequality and sign checks where relevant",
            "option substitution and value testing",
            "36-second attempt plan for expression simplification",
        ],
        "lockedSolvedExamples": LOCKED_ALGEBRA_EXAMPLES,
    },
    "trigonometry": {
        "title": "Trigonometry",
        "section": "Quantitative Aptitude",
        "description": "Deep SSC CGL Tier-I Quant note for trigonometric ratios, identities, values, simplification, and height-distance questions.",
        "tags": ["ssc-cgl", "quant", "trigonometry", "deepseek-authored"],
        "output": ROOT / "docs" / "ssc-cgl" / "quant" / "trigonometry.md",
        "routeLinks": ["/exams/ssc-cgl/topics/trigonometry", "/exams/ssc-cgl/topics/geometry-mensuration", "/exams/ssc-cgl/tests/ssc-cgl-quantitative-aptitude-speed-sprint"],
        "officialAnchors": [
            "SSC CGL Tier-I Quantitative Aptitude includes trigonometry and height-distance style questions under a 15-minute sectional timer, which is 36 seconds per question.",
            "Trigonometry questions test standard values, identities, complementary angles, expression simplification, and right-triangle applications.",
            "A 50/50 Quant attempt needs memorized values, identity-trigger recognition, diagram setup, and fast decision-making between substitution and simplification.",
        ],
        "topicScope": [
            "sin cos tan cot sec cosec definitions",
            "standard values for 0 30 45 60 90 degrees",
            "reciprocal quotient and Pythagorean identities",
            "complementary angles and transformation shortcuts",
            "trigonometric expression simplification",
            "height and distance right-triangle setup",
            "geometry-trigonometry linkage",
            "36-second attempt plan for value identity and diagram questions",
        ],
        "lockedSolvedExamples": LOCKED_TRIGONOMETRY_EXAMPLES,
    },
    "reading-comprehension": {
        "title": "Reading Comprehension",
        "section": "English Comprehension",
        "description": "Deep SSC CGL Tier-I English note for passage reading, inference, tone, central idea, and option elimination.",
        "tags": ["ssc-cgl", "english", "reading-comprehension", "deepseek-authored"],
        "output": ROOT / "docs" / "ssc-cgl" / "english" / "reading-comprehension.md",
        "routeLinks": ["/exams/ssc-cgl/topics/reading-comprehension", "/exams/ssc-cgl/topics/vocabulary-cloze", "/exams/ssc-cgl/tests/ssc-cgl-english-comprehension-speed-sprint"],
        "officialAnchors": [
            "SSC CGL Tier-I English Comprehension tests passage understanding along with grammar and vocabulary under a 15-minute sectional timer.",
            "Reading comprehension questions reward exact line evidence, central idea control, tone detection, inference boundaries, vocabulary in context, and option elimination.",
            "A 200/200 attempt needs fast passage mapping, no outside assumptions, and a repeatable process for direct, inference, title, tone, and vocabulary questions.",
        ],
        "topicScope": [
            "passage first-read strategy",
            "central idea and title selection",
            "direct fact lookup",
            "inference versus assumption",
            "tone and author's attitude",
            "vocabulary in context",
            "negative questions and except questions",
            "option elimination and evidence marking",
            "15-minute English section pacing",
        ],
    },
    "arithmetic-speed-book": {
        "title": "Arithmetic Speed Book",
        "section": "Quantitative Aptitude",
        "description": "Deep SSC CGL Tier-I arithmetic speed note for 200/200 preparation.",
        "tags": ["ssc-cgl", "quant", "arithmetic", "deepseek-authored"],
        "output": ROOT / "docs" / "ssc-cgl" / "quant" / "arithmetic-speed-book.md",
        "routeLinks": [
            "/exams/ssc-cgl/topics/number-system",
            "/exams/ssc-cgl/topics/profit-loss-discount",
            "/exams/ssc-cgl/topics/simple-compound-interest",
            "/exams/ssc-cgl/topics/data-interpretation",
        ],
        "officialAnchors": [
            "SSC CGL Tier-I Quantitative Aptitude tests arithmetic, number sense, and numerical ability under a 15-minute sectional timer.",
            "The 200/200 target requires fast base selection, fraction-percent conversions, approximation control, and option scanning before long calculation.",
            "Arithmetic topics interlock: number system, percentages, ratio, profit-loss, interest, averages, mixtures, time-work, time-speed-distance, and data interpretation.",
        ],
        "topicScope": [
            "mental calculation setup",
            "fraction, decimal, percentage conversion grid",
            "base selection and changed-base checks",
            "average, allegation, profit-loss, interest, and DI bridges",
            "LCM and unit work shortcuts",
            "option testing and answer-range estimation",
            "common arithmetic traps in SSC wording",
            "15-minute Quant pacing and skip rules",
        ],
    },
    "arrangements-and-logic": {
        "title": "Arrangements and Logic",
        "section": "General Intelligence and Reasoning",
        "description": "Deep SSC CGL Tier-I reasoning note for arrangements, logic, and 200/200 accuracy.",
        "tags": ["ssc-cgl", "reasoning", "logic", "deepseek-authored"],
        "output": ROOT / "docs" / "ssc-cgl" / "reasoning" / "arrangements-and-logic.md",
        "routeLinks": [
            "/exams/ssc-cgl/topics/seating-arrangement",
            "/exams/ssc-cgl/topics/statement-conclusion",
            "/exams/ssc-cgl/topics/syllogism-venn",
            "/exams/ssc-cgl/topics/direction-distance",
        ],
        "officialAnchors": [
            "SSC CGL Tier-I General Intelligence and Reasoning has 25 questions, 50 marks, and a 15-minute section timer.",
            "Arrangement and logic questions reward disciplined diagramming, symbol consistency, and fast contradiction elimination.",
            "A 200/200 attempt needs low-error handling of seating, ordering, direction, blood relation, syllogism, statement-conclusion, and puzzle-style constraints.",
        ],
        "topicScope": [
            "linear and circular seating",
            "ordering and ranking",
            "floor and box arrangements",
            "direction-distance diagramming",
            "blood relation trees",
            "syllogism and Venn logic",
            "statement-conclusion and inference boundaries",
            "contradiction spotting and answer-locking",
        ],
        "lockedSolvedExamples": LOCKED_ARRANGEMENT_EXAMPLES,
    },
    "direction-distance": {
        "title": "Direction and Distance",
        "section": "General Intelligence and Reasoning",
        "description": "Deep SSC CGL Tier-I Reasoning note for direction-distance diagrams, displacement, turn logic, and 200/200 speed accuracy.",
        "tags": ["ssc-cgl", "reasoning", "direction-distance", "deepseek-authored"],
        "output": ROOT / "docs" / "ssc-cgl" / "reasoning" / "direction-distance.md",
        "routeLinks": [
            "/exams/ssc-cgl/topics/direction-distance",
            "/exams/ssc-cgl/tests/ssc-cgl-reasoning-speed-sprint",
            "/exams/ssc-cgl/tests/ssc-cgl-reasoning-50-50-set-01",
        ],
        "officialAnchors": [
            "SSC CGL Tier-I General Intelligence and Reasoning has 25 questions, 50 marks, and a 15-minute section timer.",
            "Direction-distance questions reward axis discipline, turn handling, net displacement, and shortest-distance calculation.",
            "A 200/200 attempt needs zero left-right reversal, fast north-south/east-west cancellation, and clear use of Pythagoras only after net movement is known.",
        ],
        "topicScope": [
            "north, south, east, west axis setup",
            "left and right turns from current facing direction",
            "net displacement after cancellation",
            "shortest distance by Pythagoras",
            "final direction from start",
            "multi-turn route tracing",
            "shadow and facing variants when relevant",
            "36-second reasoning attempt plan and skip thresholds",
            "common traps: walked distance vs shortest distance, opposite direction, and reversed turn",
            "repair drills for diagram-free and diagram-based solving",
        ],
        "lockedSolvedExamples": LOCKED_DIRECTION_DISTANCE_EXAMPLES,
    },
    "calendar-clock": {
        "title": "Calendar and Clock",
        "section": "General Intelligence and Reasoning",
        "description": "Deep SSC CGL Tier-I Reasoning note for calendar odd days, leap-year logic, clock angles, hand overlap, and 200/200 speed accuracy.",
        "tags": ["ssc-cgl", "reasoning", "calendar-clock", "deepseek-authored"],
        "output": ROOT / "docs" / "ssc-cgl" / "reasoning" / "calendar-clock.md",
        "routeLinks": [
            "/exams/ssc-cgl/topics/calendar-clock",
            "/exams/ssc-cgl/tests/ssc-cgl-reasoning-speed-sprint",
            "/exams/ssc-cgl/tests/ssc-cgl-reasoning-50-50-set-01",
        ],
        "officialAnchors": [
            "SSC CGL Tier-I General Intelligence and Reasoning has 25 questions, 50 marks, and a 15-minute section timer.",
            "Calendar and clock questions reward modular arithmetic, memorized month codes, leap-year exceptions, and exact hand-speed formulas.",
            "A 200/200 attempt needs fast odd-day counting, century exception control, smaller-angle selection, and no confusion between hour and minute hand speeds.",
        ],
        "topicScope": [
            "ordinary year and leap year odd days",
            "century and 400-year rules",
            "month day counts and month code style shortcuts",
            "day-of-week movement from known anchor",
            "clock angle formula and smaller-angle convention",
            "hour hand and minute hand relative speed",
            "hands meeting, opposite, and straight-line cases",
            "36-second reasoning attempt plan and skip thresholds",
            "common traps: treating every fourth year as leap year, using larger clock angle, and ignoring minutes moved by hour hand",
            "repair drills for modular counting and formula recall",
        ],
        "lockedSolvedExamples": LOCKED_CALENDAR_CLOCK_EXAMPLES,
    },
    "statement-conclusion": {
        "title": "Statement and Conclusion",
        "section": "General Intelligence and Reasoning",
        "description": "Deep SSC CGL Tier-I Reasoning note for statement-conclusion, inference boundaries, assumptions, and 200/200 logical accuracy.",
        "tags": ["ssc-cgl", "reasoning", "statement-conclusion", "deepseek-authored"],
        "output": ROOT / "docs" / "ssc-cgl" / "reasoning" / "statement-conclusion.md",
        "routeLinks": [
            "/exams/ssc-cgl/topics/statement-conclusion",
            "/exams/ssc-cgl/topics/syllogism-venn",
            "/exams/ssc-cgl/tests/ssc-cgl-reasoning-speed-sprint",
        ],
        "officialAnchors": [
            "SSC CGL Tier-I General Intelligence and Reasoning has 25 questions, 50 marks, and a 15-minute section timer.",
            "Statement-conclusion questions reward strict inference: accept only what definitely follows from the statement, not what sounds true in real life.",
            "A 200/200 attempt needs separation of conclusion, assumption, inference, course of action, cause-effect, and either-or traps.",
        ],
        "topicScope": [
            "definitely follows versus does not follow",
            "outside knowledge elimination",
            "necessary and sufficient condition language",
            "only, all, some, no, may, can, must, and should",
            "statement-assumption and inference boundary",
            "course of action and cause-effect contrast",
            "either-or and complementary conclusion checks",
            "36-second reasoning attempt plan and skip thresholds",
            "common traps: real-world truth, overgeneralization, reversal, and possibility treated as certainty",
            "repair drills for formal language and answer locking",
        ],
    },
    "seating-arrangement": {
        "title": "Seating Arrangement",
        "section": "General Intelligence and Reasoning",
        "description": "Deep SSC CGL Tier-I Reasoning note for linear, circular, row, facing, and ordering arrangements with 200/200 speed accuracy.",
        "tags": ["ssc-cgl", "reasoning", "seating-arrangement", "deepseek-authored"],
        "output": ROOT / "docs" / "ssc-cgl" / "reasoning" / "seating-arrangement.md",
        "routeLinks": [
            "/exams/ssc-cgl/topics/seating-arrangement",
            "/exams/ssc-cgl/topics/direction-distance",
            "/exams/ssc-cgl/tests/ssc-cgl-reasoning-speed-sprint",
        ],
        "officialAnchors": [
            "SSC CGL Tier-I General Intelligence and Reasoning has 25 questions, 50 marks, and a 15-minute section timer.",
            "Seating arrangement questions reward fixed-clue placement, facing-direction discipline, branch control, and contradiction elimination.",
            "A 200/200 attempt needs fast handling of linear rows, circular tables, inward/outward facing, opposite positions, immediate-neighbour clues, and uncertain branches.",
        ],
        "topicScope": [
            "linear seating facing north and south",
            "two-row facing arrangements",
            "circular seating facing centre and outside",
            "left-right reversal by facing direction",
            "immediate left, immediate right, second to left, and opposite clues",
            "fixed position, end, middle, and gap clues",
            "branching only when forced",
            "36-second reasoning attempt plan and skip thresholds",
            "common traps: wrong left-right side, ignoring facing direction, over-branching, and not checking all clues",
            "repair drills for diagram setup and contradiction marking",
        ],
        "lockedSolvedExamples": LOCKED_SEATING_ARRANGEMENT_EXAMPLES,
    },
    "blood-relation": {
        "title": "Blood Relation",
        "section": "General Intelligence and Reasoning",
        "description": "Deep SSC CGL Tier-I Reasoning note for blood relation trees, branch logic, and 200/200 accuracy.",
        "tags": ["ssc-cgl", "reasoning", "blood-relation", "deepseek-authored"],
        "output": ROOT / "docs" / "ssc-cgl" / "reasoning" / "blood-relation.md",
        "routeLinks": [
            "/exams/ssc-cgl/topics/blood-relation",
            "/exams/ssc-cgl/topics/statement-conclusion",
            "/exams/ssc-cgl/topics/syllogism-venn",
            "/exams/ssc-cgl/tests/ssc-cgl-reasoning-speed-sprint",
        ],
        "officialAnchors": [
            "SSC CGL Tier-I General Intelligence and Reasoning has 25 questions, 50 marks, and a 15-minute section timer.",
            "Blood relation questions reward clear family-tree setup, symbol consistency, and zero assumption beyond the given relations.",
            "A 200/200 attempt needs rapid relation chaining, spouse handling, in-law mapping, and error-free symbol reversal under pressure.",
        ],
        "topicScope": [
            "parent, child, sibling, and grandparent relations",
            "paternal and maternal relation branching",
            "in-law mapping: spouses and spouse-of-spouses",
            "male/female role consistency in verbal cues",
            "pruning impossible family trees quickly",
            "ambiguity traps with only son, only daughter, and pronoun shifts",
            "shortcut relation symbols and relation compression",
            "repair drills for missed depth changes (father/son/grandson)",
        ],
        "lockedSolvedExamples": LOCKED_BLOOD_RELATION_EXAMPLES,
    },
    "series-coding": {
        "title": "Series and Coding-Decoding",
        "section": "General Intelligence and Reasoning",
        "description": "Deep SSC CGL Tier-I Reasoning note for number series, letter series, coding-decoding, alphabet logic, analogy bridges, and speed accuracy.",
        "tags": ["ssc-cgl", "reasoning", "series-coding", "deepseek-authored"],
        "output": ROOT / "docs" / "ssc-cgl" / "reasoning" / "series-coding.md",
        "routeLinks": [
            "/exams/ssc-cgl/topics/series-coding",
            "/exams/ssc-cgl/topics/analogy-classification",
            "/exams/ssc-cgl/tests/ssc-cgl-reasoning-speed-sprint",
            "/exams/ssc-cgl/tests/ssc-cgl-reasoning-50-50-set-01",
        ],
        "officialAnchors": [
            "SSC CGL Tier-I General Intelligence and Reasoning has 25 questions, 50 marks, and a 15-minute section timer.",
            "Series and coding-decoding questions reward pattern recognition, alphabet position recall, number relation spotting, and fast option elimination.",
            "A 200/200 attempt needs repeatable handling of number series, letter series, mixed alpha-numeric series, analogy-style transformations, and coded language without over-testing random patterns.",
        ],
        "topicScope": [
            "number series difference tables",
            "letter series and alphabet position mapping",
            "mixed alpha-numeric series",
            "coding-decoding by shifting, reverse alphabet, substitution, and place value",
            "word coding and coded language statements",
            "analogy and classification links",
            "odd-one-out pattern elimination",
            "36-second reasoning attempt plan and skip thresholds",
            "option-first checking and contradiction elimination",
            "repair drills for alphabet recall, square/cube recognition, and false-pattern traps",
        ],
        "lockedSolvedExamples": LOCKED_SERIES_CODING_EXAMPLES,
    },
    "syllogism-venn": {
        "title": "Syllogism and Venn Diagrams",
        "section": "General Intelligence and Reasoning",
        "description": "Deep SSC CGL Tier-I Reasoning note for syllogism, Venn diagram logic, conclusions, possibilities, only-few cases, and 200/200 accuracy.",
        "tags": ["ssc-cgl", "reasoning", "syllogism", "venn", "deepseek-authored"],
        "output": ROOT / "docs" / "ssc-cgl" / "reasoning" / "syllogism-venn.md",
        "routeLinks": [
            "/exams/ssc-cgl/topics/syllogism-venn",
            "/exams/ssc-cgl/topics/statement-conclusion",
            "/exams/ssc-cgl/tests/ssc-cgl-reasoning-speed-sprint",
            "/exams/ssc-cgl/tests/ssc-cgl-reasoning-50-50-set-01",
        ],
        "officialAnchors": [
            "SSC CGL Tier-I General Intelligence and Reasoning has 25 questions, 50 marks, and a 15-minute section timer.",
            "Syllogism and Venn questions reward rule discipline: all, some, no, some not, only, only a few, possibility, conversion, and definite versus possible conclusions.",
            "A 200/200 attempt needs a fast diagram habit, no assumption beyond statements, and the ability to reject tempting reverse conclusions inside the 36-second reasoning pace.",
        ],
        "topicScope": [
            "Venn diagram basics for all, some, no, and some not",
            "statement to diagram conversion",
            "valid conclusion rules and invalid reverse traps",
            "only and only a few statements",
            "possibility conclusions and blocked possibility",
            "either-or cases and complementary conclusion checks",
            "minimal diagram method for 36-second reasoning",
            "statement-conclusion linkage",
            "common SSC traps in universal, particular, and negative statements",
            "repair drills for over-assumption and reverse-conclusion mistakes",
        ],
        "lockedSolvedExamples": LOCKED_SYLLOGISM_EXAMPLES,
    },
    "analogy-classification": {
        "title": "Analogy and Classification",
        "section": "General Intelligence and Reasoning",
        "description": "Deep SSC CGL Tier-I Reasoning note for analogy, classification, odd-one-out, relation families, and 200/200 speed accuracy.",
        "tags": ["ssc-cgl", "reasoning", "analogy-classification", "deepseek-authored"],
        "output": ROOT / "docs" / "ssc-cgl" / "reasoning" / "analogy-classification.md",
        "routeLinks": [
            "/exams/ssc-cgl/topics/analogy-classification",
            "/exams/ssc-cgl/topics/series-coding",
            "/exams/ssc-cgl/tests/ssc-cgl-reasoning-speed-sprint",
        ],
        "officialAnchors": [
            "SSC CGL Tier-I General Intelligence and Reasoning has 25 questions, 50 marks, and a 15-minute section timer.",
            "Analogy and classification questions reward exact relation naming, not surface similarity.",
            "A 200/200 attempt needs fast handling of word, number, letter, pair, category, odd-one-out, and relation-family traps.",
        ],
        "topicScope": [
            "word analogy relation families",
            "number analogy through square, cube, difference, product, and digit logic",
            "letter analogy through alphabet position and shift",
            "classification by category, property, number type, and pattern",
            "odd-one-out elimination",
            "pair relation naming before option testing",
            "36-second reasoning attempt plan and skip thresholds",
            "common traps: partial relation match, surface meaning, and false category",
            "repair drills for relation vocabulary and option comparison",
        ],
        "lockedSolvedExamples": LOCKED_ANALOGY_CLASSIFICATION_EXAMPLES,
    },
    "non-verbal-reasoning": {
        "title": "Non-Verbal Reasoning",
        "section": "General Intelligence and Reasoning",
        "description": "Deep SSC CGL Tier-I Reasoning note for mirror image, water image, embedded figure, paper folding, dice, rotation, and 200/200 visual accuracy.",
        "tags": ["ssc-cgl", "reasoning", "non-verbal-reasoning", "deepseek-authored"],
        "output": ROOT / "docs" / "ssc-cgl" / "reasoning" / "non-verbal-reasoning.md",
        "routeLinks": [
            "/exams/ssc-cgl/topics/non-verbal-reasoning",
            "/exams/ssc-cgl/tests/ssc-cgl-reasoning-speed-sprint",
            "/exams/ssc-cgl/tests/ssc-cgl-reasoning-50-50-set-01",
        ],
        "officialAnchors": [
            "SSC CGL Tier-I General Intelligence and Reasoning includes non-verbal and visual reasoning under the 15-minute section timer.",
            "Non-verbal questions reward stable visual rules: rotation, reflection, symmetry, counting, folding, and cube relations.",
            "A 200/200 attempt needs consistent mirror-water separation, no over-rotation, and exact face/shape tracking.",
        ],
        "topicScope": [
            "mirror image and vertical reflection",
            "water image and top-bottom reflection",
            "figure series by movement, rotation, count, and shading",
            "embedded figure and hidden shape recognition",
            "paper folding and punching",
            "dice, cube, and opposite-face rules",
            "counting triangles and shapes",
            "36-second reasoning attempt plan and skip thresholds",
            "common traps: mirror-water confusion, illegal rotation, and missed composite shapes",
            "repair drills for visual rule order",
        ],
        "lockedSolvedExamples": LOCKED_NON_VERBAL_EXAMPLES,
    },
    "mathematical-operations": {
        "title": "Mathematical Operations",
        "section": "General Intelligence and Reasoning",
        "description": "Deep SSC CGL Tier-I Reasoning note for symbol substitution, operator interchange, coded operations, BODMAS, and 200/200 accuracy.",
        "tags": ["ssc-cgl", "reasoning", "mathematical-operations", "deepseek-authored"],
        "output": ROOT / "docs" / "ssc-cgl" / "reasoning" / "mathematical-operations.md",
        "routeLinks": [
            "/exams/ssc-cgl/topics/mathematical-operations",
            "/exams/ssc-cgl/topics/series-coding",
            "/exams/ssc-cgl/tests/ssc-cgl-reasoning-speed-sprint",
        ],
        "officialAnchors": [
            "SSC CGL Tier-I General Intelligence and Reasoning has 25 questions, 50 marks, and a 15-minute section timer.",
            "Mathematical operations questions reward symbol discipline, replacement before calculation, and BODMAS after replacement.",
            "A 200/200 attempt needs clean operator maps, no mental shortcut before substitution, and direct option testing where useful.",
        ],
        "topicScope": [
            "symbol substitution and operator meaning",
            "operator interchange",
            "coded arithmetic functions",
            "BODMAS after replacement",
            "equation balancing and missing number",
            "option testing for sign interchange",
            "36-second reasoning attempt plan and skip thresholds",
            "common traps: calculating before replacement, ignoring brackets, and left-to-right errors",
            "repair drills for operator maps and arithmetic verification",
        ],
        "lockedSolvedExamples": LOCKED_MATHEMATICAL_OPERATIONS_EXAMPLES,
    },
    "high-yield-rules": {
        "title": "Reasoning High-Yield Rules",
        "section": "General Intelligence and Reasoning",
        "description": "Deep SSC CGL Tier-I reasoning rulebook for analogy, series, coding, non-verbal, and speed accuracy.",
        "tags": ["ssc-cgl", "reasoning", "deepseek-authored"],
        "output": ROOT / "docs" / "ssc-cgl" / "reasoning" / "high-yield-rules.md",
        "routeLinks": [
            "/exams/ssc-cgl/topics/analogy-classification",
            "/exams/ssc-cgl/topics/series-coding",
            "/exams/ssc-cgl/topics/non-verbal-reasoning",
            "/exams/ssc-cgl/topics/mathematical-operations",
        ],
        "officialAnchors": [
            "SSC CGL Tier-I General Intelligence and Reasoning tests analogy, classification, series, coding-decoding, non-verbal reasoning, mathematical operations, calendar-clock, syllogism, and statement logic.",
            "The section has 25 questions, 50 marks, and a 15-minute timer, so high-yield rules must be immediately recallable.",
            "A 200/200 attempt needs pattern libraries, symbol discipline, option elimination, and a repair log for repeated trap types.",
        ],
        "topicScope": [
            "analogy relation families",
            "classification and odd-one-out checks",
            "number and alphabet series",
            "coding-decoding shifts and symbol maps",
            "mathematical operation substitution",
            "Venn and syllogism shortcuts",
            "mirror, water image, embedded figure, paper folding, and dice",
            "calendar, clock, dictionary order, and ranking",
            "skip, revisit, and trap-repair rules for 15-minute timing",
        ],
        "lockedSolvedExamples": LOCKED_REASONING_RULE_EXAMPLES,
    },
    "grammar-cloze": {
        "title": "Grammar and Cloze Control",
        "section": "English Comprehension",
        "description": "Deep SSC CGL Tier-I English note for grammar, cloze, and error-free scoring.",
        "tags": ["ssc-cgl", "english", "grammar", "deepseek-authored"],
        "output": ROOT / "docs" / "ssc-cgl" / "english" / "grammar-cloze.md",
        "routeLinks": [
            "/exams/ssc-cgl/topics/grammar-error-spotting",
            "/exams/ssc-cgl/topics/sentence-improvement",
            "/exams/ssc-cgl/topics/fill-in-the-blanks",
            "/exams/ssc-cgl/topics/para-jumbles",
        ],
        "officialAnchors": [
            "SSC CGL Tier-I English Comprehension has 25 questions, 50 marks, and a 15-minute section timer.",
            "Grammar questions test standard written English through error spotting, sentence improvement, fill in the blanks, cloze, voice, narration, and jumbles.",
            "A 200/200 attempt needs rule recall plus context reading, not isolated grammar memorization.",
        ],
        "topicScope": [
            "subject-verb agreement",
            "tense and sequence of tense",
            "articles, determiners, and quantifiers",
            "prepositions and phrasal usage",
            "pronoun reference and parallelism",
            "modifier placement",
            "cloze context prediction",
            "sentence improvement elimination",
            "para-jumble connectors and pronoun chains",
        ],
    },
    "grammar-error-spotting": {
        "title": "Grammar and Error Spotting",
        "section": "English Comprehension",
        "description": "Deep SSC CGL Tier-I English note for grammar error spotting, rule recognition, and 200/200 accuracy.",
        "tags": ["ssc-cgl", "english", "grammar-error-spotting", "deepseek-authored"],
        "output": ROOT / "docs" / "ssc-cgl" / "english" / "grammar-error-spotting.md",
        "routeLinks": [
            "/exams/ssc-cgl/topics/grammar-error-spotting",
            "/exams/ssc-cgl/topics/sentence-improvement",
            "/exams/ssc-cgl/tests/ssc-cgl-english-comprehension-speed-sprint",
        ],
        "officialAnchors": [
            "SSC CGL Tier-I English Comprehension has 25 questions, 50 marks, and a 15-minute section timer.",
            "Error spotting tests standard written English through grammar, usage, agreement, tense, articles, prepositions, modifiers, and idiom.",
            "A 200/200 attempt needs rule-first scanning, no ear-based guessing, and fast elimination of grammatically attractive traps.",
        ],
        "topicScope": [
            "subject-verb agreement",
            "tense and time marker control",
            "articles and determiners",
            "prepositions and phrasal usage",
            "pronoun case and antecedent agreement",
            "adjective-adverb and modifier placement",
            "parallelism and comparison",
            "idiomatic usage inside error spotting",
            "no-error decision discipline",
            "15-minute English section speed plan and repair drills",
        ],
    },
    "sentence-improvement": {
        "title": "Sentence Improvement",
        "section": "English Comprehension",
        "description": "Deep SSC CGL Tier-I English note for sentence improvement, replacement selection, concision, grammar, and idiomatic accuracy.",
        "tags": ["ssc-cgl", "english", "sentence-improvement", "deepseek-authored"],
        "output": ROOT / "docs" / "ssc-cgl" / "english" / "sentence-improvement.md",
        "routeLinks": [
            "/exams/ssc-cgl/topics/sentence-improvement",
            "/exams/ssc-cgl/topics/grammar-error-spotting",
            "/exams/ssc-cgl/tests/ssc-cgl-english-comprehension-speed-sprint",
        ],
        "officialAnchors": [
            "SSC CGL Tier-I English Comprehension tests sentence improvement as grammar plus usage under section timing.",
            "Sentence improvement rewards choosing the most grammatical, concise, idiomatic replacement while preserving meaning.",
            "A 200/200 attempt needs option comparison, no-improvement discipline, and fast rejection of wordy or distorted options.",
        ],
        "topicScope": [
            "underlined phrase replacement",
            "no improvement decisions",
            "tense and agreement repair",
            "concise expression and redundancy removal",
            "parallel structure",
            "modifier placement",
            "preposition and idiom correction",
            "meaning preservation",
            "option comparison under speed",
            "15-minute English section speed plan and repair drills",
        ],
    },
    "fill-in-the-blanks": {
        "title": "Fill in the Blanks",
        "section": "English Comprehension",
        "description": "Deep SSC CGL Tier-I English note for fill-in-the-blanks, context, collocation, grammar fit, and 200/200 accuracy.",
        "tags": ["ssc-cgl", "english", "fill-in-the-blanks", "deepseek-authored"],
        "output": ROOT / "docs" / "ssc-cgl" / "english" / "fill-in-the-blanks.md",
        "routeLinks": [
            "/exams/ssc-cgl/topics/fill-in-the-blanks",
            "/exams/ssc-cgl/topics/vocabulary-cloze",
            "/exams/ssc-cgl/tests/ssc-cgl-english-comprehension-speed-sprint",
        ],
        "officialAnchors": [
            "SSC CGL Tier-I English Comprehension includes fill-in-the-blanks questions inside the 15-minute English section.",
            "Blank questions test grammar fit, preposition control, vocabulary meaning, tone, and common collocation.",
            "A 200/200 attempt needs predicting the blank before reading options and rejecting words that fit meaning but fail grammar or collocation.",
        ],
        "topicScope": [
            "single blank grammar fit",
            "single blank vocabulary fit",
            "preposition blanks",
            "article and determiner blanks",
            "verb-form blanks",
            "collocation and phrase blanks",
            "tone and context clues",
            "double blank option pairing",
            "option elimination under speed",
            "15-minute English section speed plan and repair drills",
        ],
        "lockedSolvedExamples": LOCKED_FILL_IN_THE_BLANKS_EXAMPLES,
    },
    "vocabulary-cloze": {
        "title": "Vocabulary and Cloze Test",
        "section": "English Comprehension",
        "description": "Deep SSC CGL Tier-I English note for vocabulary, cloze tests, context, tone, collocation, and 200/200 accuracy.",
        "tags": ["ssc-cgl", "english", "vocabulary-cloze", "deepseek-authored"],
        "output": ROOT / "docs" / "ssc-cgl" / "english" / "vocabulary-cloze.md",
        "routeLinks": [
            "/exams/ssc-cgl/topics/vocabulary-cloze",
            "/exams/ssc-cgl/topics/fill-in-the-blanks",
            "/exams/ssc-cgl/tests/ssc-cgl-english-comprehension-speed-sprint",
        ],
        "officialAnchors": [
            "SSC CGL Tier-I English Comprehension includes cloze and vocabulary questions under a 15-minute section timer.",
            "Cloze accuracy requires context, grammar, collocation, tone, and passage flow, not isolated word meaning only.",
            "A 200/200 attempt needs fast blank prediction, local sentence fit, global passage fit, and trap rejection.",
        ],
        "topicScope": [
            "cloze passage first-read strategy",
            "local grammar clues",
            "global tone and continuity",
            "collocation and phrase fit",
            "synonym and near-synonym traps",
            "preposition and connector blanks",
            "pronoun and reference clues",
            "option elimination under speed",
            "vocabulary repair notebook",
            "15-minute English section speed plan and repair drills",
        ],
    },
    "active-passive-direct-indirect": {
        "title": "Voice and Narration",
        "section": "English Comprehension",
        "description": "Deep SSC CGL Tier-I English note for active-passive voice, direct-indirect speech, reported speech, and 200/200 accuracy.",
        "tags": ["ssc-cgl", "english", "voice-narration", "deepseek-authored"],
        "output": ROOT / "docs" / "ssc-cgl" / "english" / "active-passive-direct-indirect.md",
        "routeLinks": [
            "/exams/ssc-cgl/topics/active-passive-direct-indirect",
            "/exams/ssc-cgl/topics/grammar-error-spotting",
            "/exams/ssc-cgl/tests/ssc-cgl-english-comprehension-speed-sprint",
        ],
        "officialAnchors": [
            "SSC CGL Tier-I English Comprehension includes voice and narration transformations under section timing.",
            "Voice questions reward object identification, tense preservation, auxiliary selection, and by-phrase control.",
            "Narration questions reward reporting verb, tense backshift, pronoun change, time-place word change, and sentence-type handling.",
        ],
        "topicScope": [
            "active to passive voice",
            "passive to active voice",
            "tense-wise passive auxiliaries",
            "modal passive forms",
            "imperative, interrogative, and negative voice",
            "direct to indirect speech",
            "reported speech tense backshift",
            "pronoun and time-place changes",
            "questions, commands, requests, and exclamations in narration",
            "15-minute English section speed plan and repair drills",
        ],
    },
    "vocab-grammar-bank": {
        "title": "Vocabulary and Grammar Bank",
        "section": "English Comprehension",
        "description": "Deep SSC CGL Tier-I English vocabulary note for synonyms, antonyms, idioms, and usage.",
        "tags": ["ssc-cgl", "english", "vocabulary", "deepseek-authored"],
        "output": ROOT / "docs" / "ssc-cgl" / "english" / "vocab-grammar-bank.md",
        "routeLinks": [
            "/exams/ssc-cgl/topics/vocabulary-cloze",
            "/exams/ssc-cgl/topics/synonyms-antonyms",
            "/exams/ssc-cgl/topics/idioms-phrases",
            "/exams/ssc-cgl/topics/spelling-one-word",
        ],
        "officialAnchors": [
            "SSC CGL Tier-I English includes vocabulary, grammar, and comprehension under the same 15-minute section timer.",
            "Vocabulary scoring improves through word families, usage contrast, roots, idiom meaning, spelling patterns, and one-word substitution recall.",
            "A 200/200 attempt needs active recall cycles and error logs, because vocabulary misses are often memory failures rather than reasoning failures.",
        ],
        "topicScope": [
            "synonyms and antonyms by tone",
            "roots, prefixes, and suffixes",
            "idioms and phrases",
            "one-word substitution",
            "spelling traps",
            "confusable pairs",
            "contextual vocabulary in cloze",
            "revision queues and spaced recall",
        ],
    },
    "synonyms-antonyms": {
        "title": "Synonyms and Antonyms",
        "section": "English Comprehension",
        "description": "Deep SSC CGL Tier-I English note for synonyms, antonyms, word tone, context, and elimination.",
        "tags": ["ssc-cgl", "english", "synonyms-antonyms", "deepseek-authored"],
        "output": ROOT / "docs" / "ssc-cgl" / "english" / "synonyms-antonyms.md",
        "routeLinks": [
            "/exams/ssc-cgl/topics/synonyms-antonyms",
            "/exams/ssc-cgl/topics/vocabulary-cloze",
            "/exams/ssc-cgl/tests/ssc-cgl-english-comprehension-speed-sprint",
        ],
        "officialAnchors": [
            "SSC CGL Tier-I English Comprehension includes vocabulary questions under a 15-minute section timer.",
            "Synonym and antonym questions test meaning precision, tone, part of speech, prefix-root-suffix awareness, and contextual elimination.",
            "A 200/200 attempt needs word-family recall, option-tone comparison, and zero blind guessing on close vocabulary pairs.",
        ],
        "topicScope": [
            "synonym recognition by exact meaning and usage register",
            "antonym recognition through polarity and degree",
            "positive neutral and negative connotation",
            "part-of-speech control for adjective noun verb and adverb options",
            "root prefix suffix memory hooks",
            "confusable near-synonyms and false antonyms",
            "contextual synonym versus dictionary synonym",
            "option elimination under 36-second English pacing",
            "vocabulary repair notebook and spaced recall loops",
        ],
    },
    "idioms-phrases": {
        "title": "Idioms and Phrases",
        "section": "English Comprehension",
        "description": "Deep SSC CGL Tier-I English note for idioms, phrases, fixed expressions, meaning recall, and usage traps.",
        "tags": ["ssc-cgl", "english", "idioms-phrases", "deepseek-authored"],
        "output": ROOT / "docs" / "ssc-cgl" / "english" / "idioms-phrases.md",
        "routeLinks": [
            "/exams/ssc-cgl/topics/idioms-phrases",
            "/exams/ssc-cgl/topics/vocabulary-cloze",
            "/exams/ssc-cgl/tests/ssc-cgl-english-comprehension-speed-sprint",
        ],
        "officialAnchors": [
            "SSC CGL Tier-I English Comprehension includes idioms and phrases as direct vocabulary-memory questions.",
            "Idioms reward fixed meaning recall, not literal word-by-word interpretation.",
            "A 200/200 attempt needs high-frequency idiom grouping, context fit, and fast rejection of literal distractors.",
        ],
        "topicScope": [
            "direct idiom meaning questions",
            "phrase replacement and contextual idiom usage",
            "body animal colour number and action idiom families",
            "literal trap versus figurative meaning",
            "similar idiom pairs with different meaning",
            "preposition-fixed phrases",
            "formal informal and negative tone checks",
            "memory hooks and active recall cycles",
            "15-minute English section speed plan and repair drills",
        ],
    },
    "spelling-one-word": {
        "title": "Spelling and One-Word Substitution",
        "section": "English Comprehension",
        "description": "Deep SSC CGL Tier-I English note for spelling, one-word substitution, word formation, and recall drills.",
        "tags": ["ssc-cgl", "english", "spelling-one-word", "deepseek-authored"],
        "output": ROOT / "docs" / "ssc-cgl" / "english" / "spelling-one-word.md",
        "routeLinks": [
            "/exams/ssc-cgl/topics/spelling-one-word",
            "/exams/ssc-cgl/topics/synonyms-antonyms",
            "/exams/ssc-cgl/tests/ssc-cgl-english-comprehension-speed-sprint",
        ],
        "officialAnchors": [
            "SSC CGL Tier-I English Comprehension includes spelling and one-word substitution questions.",
            "Spelling questions test common misspellings, double letters, silent letters, suffix changes, and British-English standard forms used in exams.",
            "One-word substitution tests compact vocabulary recall for persons, practices, sciences, fears, speech acts, places, and professions.",
        ],
        "topicScope": [
            "common spelling error patterns",
            "double consonants silent letters ie ei suffix and prefix traps",
            "one-word substitution by person profession place fear practice science and speech act",
            "root-based memory hooks",
            "near-word confusion and wrong part-of-speech traps",
            "option comparison when all spellings look plausible",
            "daily active recall lists",
            "15-minute English section speed plan and repair drills",
        ],
    },
    "para-jumbles": {
        "title": "Para Jumbles",
        "section": "English Comprehension",
        "description": "Deep SSC CGL Tier-I English note for para jumbles, sentence ordering, connectors, pronouns, and flow logic.",
        "tags": ["ssc-cgl", "english", "para-jumbles", "deepseek-authored"],
        "output": ROOT / "docs" / "ssc-cgl" / "english" / "para-jumbles.md",
        "routeLinks": [
            "/exams/ssc-cgl/topics/para-jumbles",
            "/exams/ssc-cgl/topics/reading-comprehension",
            "/exams/ssc-cgl/tests/ssc-cgl-english-comprehension-speed-sprint",
        ],
        "officialAnchors": [
            "SSC CGL Tier-I English Comprehension may test sentence ordering and paragraph flow under section timing.",
            "Para-jumble questions reward identifying the opening sentence, pronoun references, connector chains, chronology, contrast, and conclusion.",
            "A 200/200 attempt needs a fixed ordering algorithm instead of reading all options repeatedly.",
        ],
        "topicScope": [
            "opening sentence detection",
            "pronoun antecedent chains",
            "connector and transition words",
            "chronology and cause-effect order",
            "general-to-specific and problem-to-solution flow",
            "pair formation before option checking",
            "elimination of grammatically smooth but logically wrong orders",
            "short passage reconstruction under 36-second pacing",
            "repair drills for repeated ordering errors",
        ],
    },
    "history-freedom-movement": {
        "title": "History and Freedom Movement",
        "section": "General Awareness",
        "description": "Deep SSC CGL Tier-I General Awareness note for Indian history, national movement, timelines, and exam traps.",
        "tags": ["ssc-cgl", "general-awareness", "history", "deepseek-authored"],
        "output": ROOT / "docs" / "ssc-cgl" / "ga" / "history-freedom-movement.md",
        "routeLinks": ["/exams/ssc-cgl/topics/history-freedom-movement", "/exams/ssc-cgl/topics/art-culture", "/exams/ssc-cgl/tests/ssc-cgl-general-awareness-speed-sprint"],
        "officialAnchors": [
            "SSC CGL Tier-I General Awareness includes history and culture of India and neighboring countries.",
            "History questions reward timeline recall, person-event matching, movement-objective matching, and elimination of near-year traps.",
            "A 200/200 GA attempt needs ancient, medieval, modern, and freedom-movement anchors organized into fast recall chains.",
        ],
        "topicScope": [
            "ancient India timeline and terms",
            "Buddhism Jainism Mauryan Gupta and Sangam anchors",
            "medieval India dynasties administration culture and architecture",
            "arrival of Europeans and British expansion",
            "1857 revolt causes leaders centres and effects",
            "INC sessions and moderate extremist phases",
            "Gandhian movements from Champaran to Quit India",
            "revolutionary organizations and important acts",
            "governor-general and viceroy chronology",
            "art culture literature and monument traps",
        ],
    },
    "art-culture": {
        "title": "Art, Culture, and Literature",
        "section": "General Awareness",
        "description": "Deep SSC CGL Tier-I General Awareness note for Indian art, culture, literature, dances, music, monuments, and traditions.",
        "tags": ["ssc-cgl", "general-awareness", "art-culture", "deepseek-authored"],
        "output": ROOT / "docs" / "ssc-cgl" / "ga" / "art-culture.md",
        "routeLinks": [
            "/exams/ssc-cgl/topics/art-culture",
            "/exams/ssc-cgl/topics/history-freedom-movement",
            "/exams/ssc-cgl/tests/ssc-cgl-general-awareness-speed-sprint",
        ],
        "officialAnchors": [
            "SSC CGL Tier-I General Awareness includes culture, history, and India-related static GK.",
            "Art-culture questions test classical dances, music, literature, architecture, monuments, festivals, paintings, schools, awards, and state associations.",
            "A 200/200 GA attempt needs pair-memory: form-state, author-work, monument-builder, festival-region, style-period, and instrument-artist.",
        ],
        "topicScope": [
            "classical dances and state associations",
            "folk dances and festivals by state",
            "Hindustani and Carnatic music basics",
            "musical instruments and famous exponents",
            "ancient medieval and modern literature author-work pairs",
            "temple architecture schools and monument-builder pairs",
            "painting schools handicrafts GI-style cultural anchors",
            "Buddhist Jain Hindu Islamic and colonial cultural markers",
            "SSC trap pairs and memory tables for fast recall",
        ],
    },
    "indian-polity-basics": {
        "title": "Indian Polity Basics",
        "section": "General Awareness",
        "description": "Deep SSC CGL Tier-I General Awareness note for Indian Constitution, articles, bodies, parliament, executive, judiciary, and rights.",
        "tags": ["ssc-cgl", "general-awareness", "indian-polity", "deepseek-authored"],
        "output": ROOT / "docs" / "ssc-cgl" / "ga" / "indian-polity-basics.md",
        "routeLinks": [
            "/exams/ssc-cgl/topics/indian-polity-basics",
            "/exams/ssc-cgl/topics/current-affairs-static-gk",
            "/exams/ssc-cgl/tests/ssc-cgl-general-awareness-speed-sprint",
        ],
        "officialAnchors": [
            "SSC CGL Tier-I General Awareness includes Indian polity and constitutional awareness.",
            "Polity questions test articles, parts, schedules, bodies, offices, elections, parliament, executive, judiciary, rights, duties, and amendments.",
            "A 200/200 GA attempt needs instant article-range recall and institution-function matching, not long constitutional commentary.",
        ],
        "topicScope": [
            "preamble and basic constitutional features",
            "parts schedules and article ranges",
            "fundamental rights directive principles and fundamental duties",
            "president vice president prime minister council of ministers and governor",
            "parliament lok sabha rajya sabha speaker bills sessions and committees",
            "supreme court high courts judicial review and writs",
            "constitutional bodies election commission UPSC CAG finance commission and attorney general",
            "emergency provisions amendments federalism panchayats municipalities and union territories",
            "current affairs hooks for appointments bills constitutional bodies and schemes",
        ],
    },
    "sports-awards": {
        "title": "Sports, Awards, and Honours",
        "section": "General Awareness",
        "description": "Deep SSC CGL Tier-I General Awareness note for sports, awards, honours, books, authors, rankings, trophies, and current-static links.",
        "tags": ["ssc-cgl", "general-awareness", "sports-awards", "deepseek-authored"],
        "output": ROOT / "docs" / "ssc-cgl" / "ga" / "sports-awards.md",
        "routeLinks": [
            "/exams/ssc-cgl/topics/sports-awards",
            "/exams/ssc-cgl/current-affairs",
            "/exams/ssc-cgl/tests/ssc-cgl-general-awareness-speed-sprint",
        ],
        "officialAnchors": [
            "SSC CGL Tier-I General Awareness includes current events, sports, awards, books, authors, honours, and India-related achievements.",
            "Sports-awards questions test trophy-sport pairs, venue-host pairs, award-field pairs, first Indian facts, book-author pairs, and current winner recall.",
            "A 200/200 GA attempt needs static pair tables plus daily current-affairs refresh for latest winners, tournaments, appointments, and honours.",
        ],
        "topicScope": [
            "national and international sports trophies",
            "Olympics Asian Games Commonwealth Games cricket football hockey badminton chess and athletics anchors",
            "Indian sports awards Rajiv Gandhi Khel Ratna Arjuna Dronacharya Dhyan Chand and related fields",
            "civilian awards Bharat Ratna Padma awards gallantry awards literary and film awards",
            "Nobel Booker Sahitya Akademi Oscars and other international awards at SSC depth",
            "books and authors and autobiography traps",
            "first Indian first woman and venue-host facts",
            "current affairs conversion through daily news pipeline",
            "avoid stale-winner traps by separating static pairs from latest facts",
        ],
    },
    "geography-india-world": {
        "title": "Geography of India and World",
        "section": "General Awareness",
        "description": "Deep SSC CGL Tier-I General Awareness note for Indian and world geography, maps, climate, rivers, soils, and resources.",
        "tags": ["ssc-cgl", "general-awareness", "geography", "deepseek-authored"],
        "output": ROOT / "docs" / "ssc-cgl" / "ga" / "geography-india-world.md",
        "routeLinks": ["/exams/ssc-cgl/topics/geography-india-world", "/exams/ssc-cgl/topics/environment-ecology", "/exams/ssc-cgl/tests/ssc-cgl-general-awareness-speed-sprint"],
        "officialAnchors": [
            "SSC CGL Tier-I General Awareness includes geography of India and the world, environment, and everyday observations.",
            "Geography questions test map memory, location-feature matching, physical processes, climate, agriculture, minerals, rivers, and state-wise facts.",
            "A 200/200 GA attempt needs India-map anchoring plus enough world geography to eliminate continent, ocean, latitude, and resource traps.",
        ],
        "topicScope": [
            "India physical divisions",
            "Himalayas plains plateau desert coastal islands",
            "Indian river systems and tributaries",
            "monsoon mechanism and climate types",
            "soils crops irrigation and agriculture regions",
            "minerals industries power plants and transport",
            "states capitals parks passes dams and ports",
            "world continents oceans latitudes longitudes and major features",
            "map-based memory hooks and elimination rules",
        ],
    },
    "science-everyday": {
        "title": "General Science and Everyday Applications",
        "section": "General Awareness",
        "description": "Deep SSC CGL Tier-I General Awareness note for physics, chemistry, biology, and everyday science applications.",
        "tags": ["ssc-cgl", "general-awareness", "science", "deepseek-authored"],
        "output": ROOT / "docs" / "ssc-cgl" / "ga" / "science-everyday.md",
        "routeLinks": ["/exams/ssc-cgl/topics/science-everyday", "/exams/ssc-cgl/topics/environment-ecology", "/exams/ssc-cgl/tests/ssc-cgl-general-awareness-speed-sprint"],
        "officialAnchors": [
            "SSC CGL Tier-I General Awareness includes general science and everyday observations.",
            "Science questions test recognition of definitions, laws, discoveries, diseases, vitamins, acids, bases, metals, electricity, optics, and daily-life applications.",
            "A 200/200 GA attempt needs concept-to-example matching, not deep derivations: recall the rule, identify the cue, eliminate similar traps.",
        ],
        "topicScope": [
            "physics motion force work energy heat light sound electricity magnetism",
            "chemistry atoms molecules acids bases salts metals non-metals gases and polymers",
            "biology cells tissues human systems diseases nutrition vitamins hormones and blood",
            "scientists inventions units and instruments",
            "environment science basics",
            "everyday applications pressure cooker mirror lens fuse battery soap medicine",
            "common SSC one-line traps and repair drills",
        ],
    },
    "environment-ecology": {
        "title": "Environment and Ecology",
        "section": "General Awareness",
        "description": "Deep SSC CGL Tier-I General Awareness note for environment, ecology, biodiversity, pollution, climate, and conservation.",
        "tags": ["ssc-cgl", "general-awareness", "environment", "ecology", "deepseek-authored"],
        "output": ROOT / "docs" / "ssc-cgl" / "ga" / "environment-ecology.md",
        "routeLinks": [
            "/exams/ssc-cgl/topics/environment-ecology",
            "/exams/ssc-cgl/topics/geography-india-world",
            "/exams/ssc-cgl/topics/science-everyday",
            "/exams/ssc-cgl/tests/ssc-cgl-general-awareness-speed-sprint",
        ],
        "officialAnchors": [
            "SSC CGL Tier-I General Awareness includes environment, everyday observations, geography, science, and current events around India and the world.",
            "Environment questions test terminology, biodiversity locations, protected areas, pollution, greenhouse effect, ozone depletion, climate agreements, and India-specific conservation facts.",
            "A 200/200 GA attempt needs fast distinction between greenhouse gases, ozone-depleting substances, pollutants, park-state pairs, species reserves, and convention-objective traps.",
        ],
        "topicScope": [
            "ecology terms ecosystem food chain food web trophic levels and ecological pyramid",
            "biodiversity hotspots biosphere reserves national parks wildlife sanctuaries tiger reserves and Ramsar sites",
            "pollution types air water soil noise radioactive and thermal pollution",
            "greenhouse effect global warming climate change ozone depletion acid rain eutrophication and biomagnification",
            "major conventions and protocols Montreal Kyoto Paris Ramsar CITES CBD and UNFCCC",
            "environment institutions and Indian laws CPCB NGT Environment Protection Act Wildlife Protection Act Forest Conservation Act",
            "renewable and non-renewable resources sustainable development and environmental impact assessment",
            "current affairs conversion for species reports climate indices summits and conservation missions",
            "SSC trap pairs such as CO2 versus CFC, sanctuary versus national park, ex situ versus in situ, and weather versus climate",
        ],
    },
    "computer-awareness": {
        "title": "Computer Awareness",
        "section": "General Awareness",
        "description": "Deep SSC CGL Tier-I General Awareness note for computer fundamentals, internet, cyber safety, office terms, and digital India facts.",
        "tags": ["ssc-cgl", "general-awareness", "computer-awareness", "deepseek-authored"],
        "output": ROOT / "docs" / "ssc-cgl" / "ga" / "computer-awareness.md",
        "routeLinks": [
            "/exams/ssc-cgl/topics/computer-awareness",
            "/exams/ssc-cgl/topics/current-affairs-static-gk",
            "/exams/ssc-cgl/tests/ssc-cgl-general-awareness-speed-sprint",
        ],
        "officialAnchors": [
            "SSC CGL Tier-I General Awareness may include everyday science and technology, current events, and basic computer awareness facts.",
            "Computer questions test definitions, abbreviations, hardware-software distinction, memory units, internet terms, security terms, and common office/digital-service vocabulary.",
            "A 200/200 GA attempt needs instant recognition of terms like CPU, RAM, ROM, URL, HTTP, IP, malware, phishing, spreadsheet, database, operating system, and cloud computing.",
        ],
        "topicScope": [
            "computer generations input output processing storage and operating system basics",
            "hardware software firmware application utility and system software differences",
            "memory hierarchy bit byte KB MB GB TB RAM ROM cache hard disk SSD optical storage and flash memory",
            "internet web browser search engine URL HTTP HTTPS IP address DNS email cloud and social media terms",
            "cyber safety malware virus worm trojan ransomware phishing firewall encryption OTP and digital signature",
            "MS Office and productivity terms word processor spreadsheet presentation database cell formula row column slide",
            "network types LAN MAN WAN Wi-Fi Bluetooth modem router server client and protocol basics",
            "digital India payment and governance terms UPI Aadhaar DigiLocker BHIM NPCI and e-governance hooks",
            "SSC trap pairs such as internet versus web, RAM versus ROM, browser versus search engine, virus versus worm, and URL versus IP",
        ],
    },
    "economics-budget-banking": {
        "title": "Economics, Budget, and Banking",
        "section": "General Awareness",
        "description": "Deep SSC CGL Tier-I General Awareness note for economy, RBI, banking, budget, inflation, and national income basics.",
        "tags": ["ssc-cgl", "general-awareness", "economy", "deepseek-authored"],
        "output": ROOT / "docs" / "ssc-cgl" / "ga" / "economics-budget-banking.md",
        "routeLinks": ["/exams/ssc-cgl/topics/economics-budget-banking", "/exams/ssc-cgl/current-affairs", "/exams/ssc-cgl/tests/ssc-cgl-general-awareness-speed-sprint"],
        "officialAnchors": [
            "SSC CGL Tier-I General Awareness includes economic scene, current events, and India-related institutional knowledge.",
            "Economy questions test RBI and banking terms, budget terms, inflation, national income, planning, schemes, fiscal policy, and current-economy institution links.",
            "A 200/200 GA attempt needs compact concept definitions, institution-function matching, and current-affairs hooks for RBI, budget, reports, and schemes.",
        ],
        "topicScope": [
            "basic economy terms goods services sectors demand supply market",
            "national income GDP GNP NNP per capita income",
            "inflation deflation CPI WPI monetary policy and fiscal policy",
            "RBI functions MPC repo reverse repo CRR SLR bank rate",
            "commercial banks NABARD SEBI SIDBI and financial institutions",
            "budget receipts expenditure deficit subsidy tax and GST",
            "planning NITI Aayog poverty unemployment and schemes",
            "external sector balance of payments exchange rate and trade",
            "current affairs conversion into SSC-ready economy facts",
        ],
    },
    "static-gk-map": {
        "title": "Static GK Map",
        "section": "General Awareness",
        "description": "Deep SSC CGL Tier-I General Awareness static GK map for high-yield revision.",
        "tags": ["ssc-cgl", "general-awareness", "static-gk", "deepseek-authored"],
        "output": ROOT / "docs" / "ssc-cgl" / "ga" / "static-gk-map.md",
        "routeLinks": [
            "/exams/ssc-cgl/topics/indian-polity-basics",
            "/exams/ssc-cgl/topics/history-freedom-movement",
            "/exams/ssc-cgl/topics/geography-india-world",
            "/exams/ssc-cgl/topics/science-everyday",
        ],
        "officialAnchors": [
            "SSC CGL Tier-I General Awareness tests awareness of environment, current events, India and neighboring countries, history, culture, geography, economics, polity, and science.",
            "The GA section has 25 questions, 50 marks, and a 15-minute timer, so recall speed matters as much as coverage.",
            "A 200/200 attempt requires map-like organization: polity bodies, history timelines, geography locations, science facts, economy terms, art-culture, sports, and awards.",
        ],
        "topicScope": [
            "Indian polity bodies and articles",
            "modern history timeline",
            "ancient and medieval culture anchors",
            "physical and Indian geography",
            "economy and banking terms",
            "everyday science",
            "environment and ecology",
            "art, culture, sports, awards, and books",
            "memory hooks and elimination logic",
        ],
    },
    "current-affairs-static-gk": {
        "title": "Current Affairs and Static GK",
        "section": "General Awareness",
        "description": "Deep SSC CGL Tier-I current-affairs conversion note for GA scoring and memory hooks.",
        "tags": ["ssc-cgl", "general-awareness", "current-affairs", "deepseek-authored"],
        "output": ROOT / "docs" / "ssc-cgl" / "ga" / "current-affairs-static-gk.md",
        "routeLinks": [
            "/exams/ssc-cgl/current-affairs",
            "/exams/ssc-cgl/topics/current-affairs-static-gk",
            "/exams/ssc-cgl/topics/economics-budget-banking",
            "/exams/ssc-cgl/topics/environment-ecology",
            "/exams/ssc-cgl/topics/art-culture",
            "/exams/ssc-cgl/topics/sports-awards",
            "/exams/ssc-cgl/topics/computer-awareness",
        ],
        "officialAnchors": [
            "SSC CGL Tier-I General Awareness includes current events and everyday observations alongside static history, culture, geography, economy, polity, and science.",
            "Current affairs must be converted into stable recall units: institution, ministry, scheme objective, report publisher, rank, award, appointment, place, date, and static background.",
            "The daily news pipeline stores metadata and excerpts only, then creates SSC-relevant facts, memory hooks, and MCQ seeds without rendering full article bodies.",
            "A 200/200 GA attempt needs fast recall, elimination discipline, and a repair queue that links dynamic news to static GK anchors.",
        ],
        "topicScope": [
            "news-to-MCQ conversion",
            "scheme ministry objective target group and launch year",
            "reports indices publishers rankings and India-specific facts",
            "RBI banking budget economy current affairs",
            "environment conventions species parks and climate terms",
            "appointments awards sports books and summits",
            "science technology space defence and computer awareness",
            "static background attachment for every daily fact",
            "memory hooks spaced recall and trap logs",
            "source hygiene: official feeds first, excerpts only, no raw article body",
        ],
    },
}


SUGGESTED_SECTIONS = [
    "## What You Need to Know",
    "## How to Solve It",
    "## Worked Examples",
    "## Common Traps",
    "## Check Yourself",
    "## Mixed Exam Practice",
]


@dataclass
class AuthoringReport:
    generatedAt: str
    topic: str
    provider: str
    model: str
    dryRun: bool
    wroteNote: bool
    outputPath: str
    promptPath: str
    noteLength: int
    requiredSectionsPresent: list[str]
    warnings: list[str]


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def ensure_directory(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)


def normalize_heading(value: str) -> str:
    return re.sub(r"\s+", " ", value.strip().lower())


def section_presence(markdown: str) -> list[str]:
    return [
        f"## {match.group(1).strip()}"
        for match in re.finditer(r"^##\s+(.+?)\s*$", markdown, re.MULTILINE)
    ]


def section_text(markdown: str, section: str) -> str:
    heading = re.escape(section).replace(r"\ ", r"\s+")
    match = re.search(
        rf"^{heading}\s*$([\s\S]*?)(?=^##\s+|\Z)",
        markdown,
        re.IGNORECASE | re.MULTILINE,
    )
    return match.group(1) if match else ""


GENERATOR_LEAKAGE_PATTERNS = [
    r"\blet'?s re-?check\b",
    r"\bi'?ll\s+(?:modify|rewrite|adjust|change|correct|adopt)\b",
    r"\bnot in options\b",
    r"\boption missing\b",
    r"\boptions? (?:do|does) not (?:include|match)\b",
    r"\bthat'?s wrong\b",
    r"\bre-?evaluate\b",
    r"\bre-?write example\b",
    r"\bpossibly the problem\b",
    r"\bmaybe (?:the|i)\b",
    r"\bwait:\b",
    r"\blet me\s+(?:rewrite|correct|modify|adjust|change|fix|re-?check)\b",
    r"\bcorrected\b",
    r"\bunsolvable\b",
    r"\bno arrangement\b",
    r"\bno solution\b",
    r"\bproblem statement may have\b",
    r"\bquick fix\b",
    r"\breplace with\b",
]


def generator_leakage(markdown: str) -> list[str]:
    return [
        pattern
        for pattern in GENERATOR_LEAKAGE_PATTERNS
        if re.search(pattern, markdown, re.IGNORECASE)
    ]


def canonical_frontmatter(topic: dict[str, Any]) -> str:
    tags = ", ".join(topic.get("tags", ["ssc-cgl", "deepseek-authored"]))
    return "\n".join([
        "---",
        f"title: {topic['title']}",
        f"description: {topic.get('description', 'Deep SSC CGL Tier-I note for 200/200 preparation.')}",
        f"tags: [{tags}]",
        "generated_by: deepseek",
        "review_status: ai-authored-needs-agent-review",
        "---",
        "",
    ])


def strip_leading_metadata_object(markdown: str) -> str:
    text = markdown.strip()
    decoder = json.JSONDecoder()

    while text:
        fence = re.match(r"^```(?:json)?\s*([\s\S]*?)\s*```\s*", text, re.IGNORECASE)
        if fence:
            candidate = fence.group(1).strip()
            if candidate.startswith(("{", "[")):
                try:
                    decoder.raw_decode(candidate)
                except json.JSONDecodeError:
                    pass
                else:
                    text = text[fence.end():].lstrip()
                    continue

        if text.startswith(("{", "[")):
            try:
                _, end = decoder.raw_decode(text)
            except json.JSONDecodeError:
                break
            text = text[end:].lstrip()
            continue

        break

    return text


def sanitize_markdown(markdown: str) -> str:
    text = markdown.replace("\r\n", "\n")
    text = re.sub(r"\bre-?evaluate\b", "check again", text, flags=re.IGNORECASE)
    text = re.sub(r"\bnot in options\b", "answer absent from option list", text, flags=re.IGNORECASE)
    text = re.sub(r"\breplace with\b", "use", text, flags=re.IGNORECASE)
    text = re.sub(r"\boptions?\s+(?:do|does)\s+not\s+(?:include|match)\b", "option conflicts with", text, flags=re.IGNORECASE)
    text = re.sub(r"\bunsolvable\b", "inconsistent", text, flags=re.IGNORECASE)
    text = re.sub(r"\bno solution\b", "inconsistent", text, flags=re.IGNORECASE)
    return text


def ensure_frontmatter(markdown: str, topic: dict[str, Any]) -> str:
    body = markdown.strip()
    if body.startswith("---"):
        body = re.sub(r"^---\s*[\s\S]*?\s*---\s*", "", body, count=1).strip()
    body = sanitize_markdown(strip_leading_metadata_object(body))
    return canonical_frontmatter(topic) + body.strip() + "\n"


def validate_markdown(markdown: str) -> None:
    sections = section_presence(markdown)
    if not 6 <= len(sections) <= 8:
        raise ValueError("DeepSeek note needs 6 to 8 purposeful H2 learning sections")
    if "generated_by: deepseek" not in markdown.lower():
        raise ValueError("DeepSeek note is missing generated_by frontmatter")
    if not re.search(r"```mermaid|!\[[^\]]+\]\([^)]+\)", markdown, re.IGNORECASE):
        raise ValueError("DeepSeek note needs one purposeful diagram or image")
    leaked = generator_leakage(markdown)
    if leaked:
        raise ValueError(f"DeepSeek note contains unresolved generator drafting text: {', '.join(leaked)}")
    learning_checks = re.findall(
        r"^\*\*(?:Worked example|Self-check|Example\s+\d+)\*\*|^###\s+Question\s+\d+",
        markdown,
        re.IGNORECASE | re.MULTILINE,
    )
    if len(learning_checks) < 8:
        raise ValueError("DeepSeek note needs at least 8 placed worked examples or self-checks")
    table_lines = [line for line in markdown.splitlines() if line.strip().startswith("|")]
    table_headers = [line for line in table_lines if re.search(r"\|\s*:?-{3,}", line)]
    if len(table_headers) > 5:
        raise ValueError("DeepSeek note must use no more than 5 purposeful tables")
    for line in table_lines:
        if line.count("|") - 1 > 4:
            raise ValueError("DeepSeek note tables must not exceed 4 columns")
    if len(markdown) < 6000:
        raise ValueError("DeepSeek note is too short to teach the complete topic")
    if len(markdown) > 16000:
        raise ValueError("DeepSeek note is too long; remove repetition and bulk question dumps")
    if re.search(r"corpus pressure|indexed book-PYQ|gap-repair|200/200 drill", markdown, re.IGNORECASE):
        raise ValueError("DeepSeek note exposes internal corpus or authoring language")


def load_book_corpus_blueprint(path: Path = BOOK_CORPUS_BLUEPRINT_PATH) -> dict[str, Any] | None:
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        return None
    except json.JSONDecodeError:
        return None
    return payload if isinstance(payload, dict) else None


def related_book_topic_slugs(topic_id: str) -> set[str]:
    mapping = {
        "percentages-ratio": {"percentages", "ratio-proportion"},
        "arithmetic-speed-book": {"calculation-speed", "number-system", "averages-mixtures-alligation"},
        "hcf-and-lcm": {"hcf-and-lcm", "number-system"},
        "simplification": {"simplification", "calculation-speed", "number-system"},
        "arrangements-and-logic": {"seating-arrangement", "statement-conclusion", "direction-distance"},
        "grammar-cloze": {"grammar-error-spotting", "fill-in-the-blanks", "vocabulary-cloze"},
        "high-yield-rules": {"analogy-classification", "series-coding", "mathematical-operations"},
        "static-gk-map": {"indian-polity-basics", "history-freedom-movement", "geography-india-world", "science-everyday"},
        "vocab-grammar-bank": {"synonyms-antonyms", "idioms-phrases", "spelling-one-word", "sentence-improvement"},
    }
    return mapping.get(topic_id, {topic_id})


def compact_book_corpus_context(topic_id: str, topic: dict[str, Any]) -> str:
    blueprint = load_book_corpus_blueprint()
    if not blueprint:
        return "Book PYQ corpus blueprint: not generated yet. Generate it with scripts/ssc_cgl_book_corpus_blueprint.py before final note authoring."

    related_slugs = related_book_topic_slugs(topic_id)
    section_name = str(topic.get("section") or "")
    sources = blueprint.get("sources") if isinstance(blueprint.get("sources"), list) else []
    sections = blueprint.get("sections") if isinstance(blueprint.get("sections"), list) else []
    topics = blueprint.get("topics") if isinstance(blueprint.get("topics"), list) else []
    section_rows = [
        row for row in sections
        if isinstance(row, dict) and (not section_name or row.get("title") == section_name or row.get("section") == section_name)
    ]
    related_topics = [
        row for row in topics
        if isinstance(row, dict) and str(row.get("slug") or "") in related_slugs
    ]
    if not related_topics:
        related_topics = [
            row for row in topics
            if isinstance(row, dict) and (not section_name or row.get("section") == section_name)
        ][:8]

    context = {
        "sourceType": blueprint.get("sourceType"),
        "totalQuestions": blueprint.get("totalQuestions"),
        "policy": blueprint.get("policy"),
        "topSources": sources[:6],
        "sectionContext": section_rows,
        "relatedTopicContext": related_topics,
    }
    return "Book PYQ corpus blueprint:\n" + json.dumps(context, ensure_ascii=False, indent=2)


def build_prompt(topic_id: str, topic: dict[str, Any]) -> str:
    expected_frontmatter = {
        "title": topic["title"],
        "description": topic.get("description", "Deep SSC CGL Tier-I note for 200/200 preparation."),
        "tags": topic.get("tags", ["ssc-cgl", "deepseek-authored"]),
        "generated_by": "deepseek",
        "review_status": "ai-authored-needs-agent-review",
    }
    prompt_parts = [
        "You are DeepSeek writing one polished SSC CGL Tier-I topic lesson for a learner.",
        "Return strict markdown only. Do not wrap it in a code fence. Use natural, correct English and KaTeX-compatible math.",
        "Write exam-ready explanations from the supplied anchors, syllabus scope, source metadata, and exam pattern.",
        "Do not add source-policy, legal-policy, copyright-policy, or provenance disclaimers to the learner-facing note.",
        "Use source and PYQ metadata only to choose what deserves emphasis. Never expose corpus counts, source filenames, ingestion language, or authoring policy to the learner.",
        "Make the lesson complete but concise. Prefer one clear rule, a placed worked example, a self-check, and its answer over repeated explanation.",
        "Use 6 to 8 purposeful H2 sections. Adapt their names to the topic; this is a suggested learning sequence:",
        *SUGGESTED_SECTIONS,
        "Frontmatter must include these keys and values:",
        json.dumps(expected_frontmatter, ensure_ascii=False),
        "Required content rules:",
        "- Aim for 6000 to 14000 characters; never pad to hit length.",
        "- Start with the core idea and a usable decision method, then build toward mixed exam practice.",
        "- Place every worked example and self-check immediately after the rule it tests. Put answers in collapsed <details> blocks.",
        "- Include at least 8 total worked examples and self-checks, but do not append a bulk 25-question dump.",
        "- Use no more than 5 tables. Every table must have at most 4 columns and about 10 data rows.",
        "- Include one purposeful Mermaid diagram or an existing local image, followed immediately by an italic visible caption.",
        "- For Quantitative Aptitude topics, include the exact phrase \"36-second attempt plan\" and make the note brutally practical for 25 Quant questions in 15 minutes.",
        "- For Quantitative Aptitude topics, every method should tell the student when to use direct formula, option testing, approximation, substitution, or skip-and-return.",
        "- Keep trap guidance compact and tied to actual decision mistakes.",
        "- Every solved example must be internally consistent, fully solvable, and final-polished. Do not include ambiguous examples, scratch reasoning, self-corrections, rewritten examples, or phrases like wait, maybe, assume extra clue, I will modify, or no solution.",
        "- Never include draft-process words such as corrected, reevaluate, re-evaluate, not in options, option missing, replace with, quick fix, or maybe. Return only the final polished chapter.",
        "- End with a short mixed practice set and one clear next-step link; do not repeat the lesson or expose source/corpus metadata.",
        "- Add relevant links from these local practice routes: " + ", ".join(topic["routeLinks"]),
        f"Topic id: {topic_id}",
        f"Topic title: {topic['title']}",
        f"Section: {topic['section']}",
        "Official anchors:",
        json.dumps(topic["officialAnchors"], ensure_ascii=False),
        "Topic scope:",
        json.dumps(topic["topicScope"], ensure_ascii=False),
        compact_book_corpus_context(topic_id, topic),
    ]
    locked_examples = str(topic.get("lockedSolvedExamples") or "").strip()
    if locked_examples:
        prompt_parts.extend([
            "Verified example source block:",
            "Select only the 6 to 10 most distinct examples needed for this lesson. Keep the selected question, options, key, and mathematical result unchanged, but place each example next to the rule it tests instead of pasting this block wholesale.",
            locked_examples,
        ])
    return "\n".join(prompt_parts)


def write_text(path: Path, content: str) -> None:
    ensure_directory(path.parent)
    path.write_text(content, encoding="utf-8")


def write_report(path: Path, report: AuthoringReport) -> None:
    ensure_directory(path.parent)
    path.write_text(json.dumps(asdict(report), indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def extract_markdown(raw: str) -> str:
    text = raw.strip()
    fence = re.match(r"^```(?:markdown|md)?\s*([\s\S]*?)\s*```$", text, re.IGNORECASE)
    if fence:
        text = fence.group(1).strip()
    return text.replace("\r\n", "\n").strip() + "\n"


def call_deepseek(prompt: str, model: str) -> str:
    api_key = os.environ.get("DEEPSEEK_API_KEY")
    if not api_key:
        raise RuntimeError("DEEPSEEK_API_KEY is not set")
    body = {
        "model": model,
        "temperature": 0.1,
        "max_tokens": 14000,
        "messages": [
            {
            "role": "system",
                "content": "You write precise exam-prep markdown. Follow section contracts exactly, show final polished solutions only, and do not copy protected source text.",
            },
            {"role": "user", "content": prompt},
        ],
    }
    request = urllib.request.Request(
        DEEPSEEK_ENDPOINT,
        data=json.dumps(body).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=240) as response:
            payload = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        error_body = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"DeepSeek HTTP {exc.code}: {error_body[:500]}") from exc
    return str(payload.get("choices", [{}])[0].get("message", {}).get("content", ""))


def author_topic(topic_id: str, output: Path, audit_root: Path, dry_run: bool) -> AuthoringReport:
    topic = TOPICS.get(topic_id)
    if not topic:
        raise ValueError(f"unknown topic: {topic_id}")
    model = os.environ.get("DEEPSEEK_MODEL", "deepseek-v4-pro")
    prompt = build_prompt(topic_id, topic)
    prompt_path = audit_root / f"{topic_id}.deepseek-prompt.txt"
    report_path = audit_root / "authoring-report.json"
    write_text(prompt_path, prompt)

    if dry_run:
        report = AuthoringReport(
            generatedAt=now_iso(),
            topic=topic_id,
            provider="deepseek",
            model=model,
            dryRun=True,
            wroteNote=False,
            outputPath=str(output),
            promptPath=str(prompt_path),
            noteLength=0,
            requiredSectionsPresent=[],
            warnings=["Dry run wrote the prompt packet only; no DeepSeek API call was made."],
        )
        write_report(report_path, report)
        return report

    raw_response = call_deepseek(prompt, model)
    write_text(audit_root / f"{topic_id}.deepseek-response.md", raw_response.strip() + "\n")
    markdown = ensure_frontmatter(extract_markdown(raw_response), topic)
    validate_markdown(markdown)
    write_text(output, markdown)
    present = section_presence(markdown)
    report = AuthoringReport(
        generatedAt=now_iso(),
        topic=topic_id,
        provider="deepseek",
        model=model,
        dryRun=False,
        wroteNote=True,
        outputPath=str(output),
        promptPath=str(prompt_path),
        noteLength=len(markdown),
        requiredSectionsPresent=present,
        warnings=[
            "AI-authored note still needs model-agent review against official syllabus and reviewed PYQ corpus.",
        ],
    )
    write_report(report_path, report)
    return report


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description="Author one SSC CGL topic note with DeepSeek.")
    parser.add_argument("--topic", required=True, choices=sorted(TOPICS))
    parser.add_argument("--output", type=Path)
    parser.add_argument("--audit-root", type=Path)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    topic = TOPICS[args.topic]
    output = args.output or topic["output"]
    audit_root = args.audit_root or (DEFAULT_AUDIT_ROOT / args.topic)
    try:
        report = author_topic(args.topic, output, audit_root, args.dry_run)
    except Exception as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1

    print(
        f"{report.topic}: provider={report.provider} dry_run={report.dryRun} "
        f"wrote_note={report.wroteNote} length={report.noteLength}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

---
title: "Current Based Relaying 2"
math_syntax: typst
---

![Pasted image 20260915151342](/content-assets/studies/attachments/Pasted%20image%2020260915151342.png)

Plug setting of relay = 100% of 1A
TDS = 0.5

setting ranges 50% - 200% of 1A, in steps of 25%

IHI) -> 400% - 2000% of 1A in steps of 100%

In order to find out top = (0.14/((MP)^0.02-1))*TDS,

need to find out the multiple of pickup current ->

Case 1, If = 600A:
MP = If(ref ct sec)/PS
MP = 600/100/1(100% of 1 A) = 6


now putting it in top formula = 0.14/6^0.02-1 * 0.5 = 1.9 second rougly. = Top, If = 600A.

Case 2, if If = 1500A:
MP = 1500/100/1 = 15
similarly can calculate.

However setting of instantaneous high set unit is 1200%, as the setting of IHSU i.e. 1200% of 1A = 12.

So for 1500/100 = 15 and as 15 > 12, no need to calculate top since the relay will get triggered instantaneously.

Relay operates instantaneously.

Example 2:
![Pasted image 20260915152120](/content-assets/studies/attachments/Pasted%20image%2020260915152120.png)


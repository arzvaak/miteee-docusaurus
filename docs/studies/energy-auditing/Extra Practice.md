---
title: "Extra Practice"
math_syntax: typst
---

# Extra Practice

> *Generated practice bank covering all course topics. These are newly created questions — not sourced from any exam paper.*

---

## Energy Fundamentals and Policy

**EP-1.** Convert the following: (a) 5 toe to kWh; (b) 10,000 kcal to MJ; (c) 2,000 kWh to toe.

<details>
<summary>Answer</summary>

(a) $5 times 11{,}630 = 58{,}150$ kWh; (b) $10{,}000 times 4.1868 = 41{,}868$ MJ; (c) $2{,}000/11{,}630 = 0.172$ toe.
</details>

---

**EP-2.** A thermal power plant has an overall efficiency of 35%. If the coal has a GCV of 5,000 kcal/kg, how much coal is needed to generate 1,000 MWh of electricity?

<details>
<summary>Answer</summary>

Useful energy = 1,000 MWh = $10^6$ kWh = $8.6 times 10^8$ kcal.
Input = $8.6 times 10^8 / 0.35 = 2.457 times 10^9$ kcal.
Coal = $2.457 times 10^9 / 5{,}000 = 491{,}429$ kg ≈ 491 tonnes.
</details>

---

**EP-3.** List the eight designated consumer sectors under the EC Act 2001 and state two obligations each DC must fulfil.

---

## Monitoring, Targeting, and CUSUM

**EP-4.** A plant collected 6 months of data (post-intervention). Baseline model from pre-change months: $E = 0.6P + 100$.

| Month | Actual E (kWh) | Production (tonnes) |
|---:|---:|---:|
| 1 | 340 | 400 |
| 2 | 310 | 350 |
| 3 | 360 | 450 |
| 4 | 290 | 300 |
| 5 | 320 | 370 |
| 6 | 280 | 290 |

Calculate the CUSUM table and total savings if average production = 4,000 MT/month.

<details>
<summary>Answer</summary>

| Month | Predicted | Deviation | CUSUM |
|---:|---:|---:|---:|
| 1 | 340 | 0 | 0 |
| 2 | 310 | 0 | 0 |
| 3 | 370 | −10 | −10 |
| 4 | 280 | +10 | 0 |
| 5 | 322 | −2 | −2 |
| 6 | 274 | +6 | +4 |

CUSUM = +4 kWh → net overconsumption of 4 kWh (no net saving). However, individual months show mixed performance; CUSUM of −10 at month 3 suggests early improvement.
</details>

---

## Financial Evaluation

**EP-5.** A project requires Rs. 500,000 investment. Annual savings: Rs. 150,000 for 5 years. Discount rate = 12%. Calculate NPV and simple payback.

<details>
<summary>Answer</summary>

SPP = 500,000/150,000 = 3.33 years.

NPV = $-500{,}000 + 150{,}000 times frac(1 - (1.12)^(-5), 0.12)$
$= -500{,}000 + 150{,}000 times 3.6048 = -500{,}000 + 540{,}720 = +40{,}720$ Rs.

NPV > 0 → accept the project.
</details>

---

**EP-6.** For the same project in EP-5, bracket the IRR between two percentage rates.

<details>
<summary>Answer</summary>

At 15%: PV of savings = $150{,}000 times frac(1 - (1.15)^(-5), 0.15) = 150{,}000 times 3.3522 = 502{,}823$. NPV = +2,823.
At 16%: PV = $150{,}000 times frac(1 - (1.16)^(-5), 0.16) = 150{,}000 times 3.2743 = 491{,}145$. NPV = −8,855.

IRR is between 15% and 16%.
</details>

---

## Electrical Systems

**EP-7.** A factory has connected load 800 kW, maximum demand 600 kW. Find the demand factor. If the factory operates at 600 kW for 720 hours in a month, find the load factor.

<details>
<summary>Answer</summary>

Demand factor = 600/800 = 0.75.
Average load = 600 kW (constant). Load factor = 600/600 = 1.0 (100%).
</details>

---

**EP-8.** A three-phase load draws 50 A at 415 V with a power factor of 0.8 lagging. Find (a) real power, (b) apparent power, (c) reactive power.

<details>
<summary>Answer</summary>

(a) $P = sqrt(3) times 415 times 50 times 0.8 = 28{,}633$ W ≈ 28.6 kW
(b) $S = sqrt(3) times 415 times 50 = 35{,}791$ VA ≈ 35.8 kVA
(c) $Q = sqrt(S^2 - P^2) = sqrt(35{,}791^2 - 28{,}633^2) = 21{,}475$ VAR ≈ 21.5 kVAR
</details>

---

**EP-9.** A consumer has MD = 300 kW and annual consumption = 500,000 kWh. Tariff: Rs. 80/kW/year (fixed) + Rs. 5/kWh (energy). Calculate the annual bill. If the consumer reduces MD to 250 kW by load shifting (same energy), what is the saving?

<details>
<summary>Answer</summary>

Original: Rs. $80 times 300 + 5 times 500{,}000 = 24{,}000 + 2{,}500{,}000 = 2{,}524{,}000$
New: Rs. $80 times 250 + 5 times 500{,}000 = 20{,}000 + 2{,}500{,}000 = 2{,}520{,}000$
Saving = Rs. 4,000/year.
</details>

---

## Motors, Pumps, and Fans

**EP-10.** A centrifugal pump runs at 1450 rpm consuming 20 kW. The speed is reduced to 1000 rpm using a VSD. Find the new flow, head, and power as fractions of original.

<details>
<summary>Answer</summary>

Ratio = 1000/1450 = 0.69
$Q_2 = 0.69   Q_1$
$H_2 = 0.69^2   H_1 = 0.476   H_1$
$P_2 = 0.69^3   P_1 = 0.329   P_1 = 6.57$ kW
</details>

---

**EP-11.** A motor delivers 100 kW output at 93% efficiency. Find input power, losses, and input current at 415 V, 0.88 PF.

<details>
<summary>Answer</summary>

Input = 100/0.93 = 107.53 kW. Losses = 7.53 kW.
Current $I = P/(sqrt(3) V cos(phi)) = 107{,}530/(sqrt(3) times 415 times 0.88) = 170.3$ A.
</details>

---

## Lighting

**EP-12.** An office has 60 fluorescent tube lights, each 40W with 12W ballast loss (52W total). They operate 10 hours/day, 260 days/year. Electricity cost: Rs. 8/kWh. If replaced by 18W LED tubes (no ballast loss), calculate annual savings and simple payback if LED tubes cost Rs. 500 each.

<details>
<summary>Answer</summary>

Existing: $60 times 52 = 3{,}120$ W; annual energy = $3.12 times 10 times 260 = 8{,}112$ kWh; cost = Rs. 64,896.
LED: $60 times 18 = 1{,}080$ W; annual energy = $1.08 times 10 times 260 = 2{,}808$ kWh; cost = Rs. 22,464.
Annual saving = Rs. 42,432. Investment = $60 times 500 = 30{,}000$. Payback = 30,000/42,432 = 0.71 years ≈ 8.5 months.
</details>

---

## Thermal Systems

**EP-13.** A boiler produces 15 tonnes/hr of steam at 10 bar, dryness fraction 0.97. Feed water enters at 85 °C. Coal consumption is 2,500 kg/hr with GCV = 5,200 kcal/kg. Calculate boiler efficiency.

<details>
<summary>Answer</summary>

From steam tables at 10 bar: $h_f = 182.5$ kcal/kg, $h_("fg") = 482.3$ kcal/kg.
Enthalpy of steam $= 182.5 + 0.97 times 482.3 = 650.3$ kcal/kg.
Enthalpy of feed water at 85 °C $≈ 85$ kcal/kg.
Heat in steam $= 15{,}000 times (650.3 - 85) = 15{,}000 times 565.3 = 8{,}479{,}500$ kcal/hr.
Heat in fuel $= 2{,}500 times 5{,}200 = 13{,}000{,}000$ kcal/hr.
$eta = 8{,}479{,}500/13{,}000{,}000 times 100 = 65.2\%$.
</details>

---

**EP-14.** Condensate at 8 kg/cm²g is flashed to 1.5 kg/cm²g. Flow rate = 2,000 kg/hr. Given: $h_("f1") = 172$ kcal/kg, $h_("f2") = 118$ kcal/kg, $h_("fg2") = 533$ kcal/kg. Calculate flash steam percentage and flow rate.

<details>
<summary>Answer</summary>

Flash \% $= (172 - 118)/533 = 54/533 = 10.1\%$.
Flash steam flow $= 2{,}000 times 0.101 = 202.6$ kg/hr.
</details>

---

**EP-15.** A counterflow heat exchanger: hot fluid enters at 180 °C, exits at 100 °C; cold fluid enters at 30 °C, exits at 70 °C. Calculate LMTD.

<details>
<summary>Answer</summary>

$Delta T_1 = 180 - 70 = 110$ °C (hot end)
$Delta T_2 = 100 - 30 = 70$ °C (cold end)
$Delta T_("lm") = (110 - 70)/ln(110/70) = 40/ln(1.571) = 40/0.452 = 88.5$ °C
</details>

---

## Renewables and Buildings

**EP-16.** A building has total annual energy consumption of 600,000 kWh and conditioned area of 3,000 m². Calculate the EPI. If ECBC benchmark is 150 kWh/m², is the building compliant?

<details>
<summary>Answer</summary>

EPI $= 600{,}000/3{,}000 = 200$ kWh/m². Since 200 > 150, the building is **not** ECBC-compliant and needs energy conservation measures.
</details>

---

**EP-17.** List five passive design strategies for reducing cooling load in a commercial building in a hot climate.

---

## Cogeneration

**EP-18.** A gas turbine CHP plant produces 2 MW electrical and 4 MW thermal output from a fuel input of 8 MW. Calculate (a) electrical efficiency, (b) thermal efficiency, (c) overall CHP efficiency, (d) power-to-heat ratio.

<details>
<summary>Answer</summary>

(a) $eta_e = 2/8 = 25\%$
(b) $eta_t = 4/8 = 50\%$
(c) $eta_("CHP") = (2+4)/8 = 75\%$
(d) P/H ratio = 2/4 = 0.5
</details>

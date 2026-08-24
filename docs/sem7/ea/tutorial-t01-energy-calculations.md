---
title: "Tutorial 01 - Basic Energy Calculations"
sidebar_label: "Tutorial 01 - Basic Energy Calculations"
sidebar_position: 101
description: "Source-complete worked questions for Tutorial 01 - Basic Energy Calculations, with units, checks, and common traps."
tags:
  - energy-auditing
  - ele-4446
  - tutorial
  - worked-solutions
---

# Tutorial 01 - Basic Energy Calculations

**Source:** `T01-Energy_Calculations.pptx` (21 slides) · SHA256 `f9a614de20677ed085bfaafd552e5534ff02c2e05924a80fa1694acffb94c4ef` · All 21 slides are covered below; the final table maps each source question to its slide(s).

---

## Question 1

**Source wording** (slide 2): "A process requires 120 kg of coal with a calorific value of 4800 kcal/kg for heating with a system efficiency of 82 %. The loss would be ______" — stated answer in source: *(ANS : 103680 kcal)*.

**Given and target**
- Mass of coal: $m = 120$ kg
- Calorific value: $CV = 4800$ kcal/kg
- System efficiency: $\eta = 82\% = 0.82$
- Target: energy **loss** (in kcal)

**Governing relation**

$$\text{Total energy input} = \text{mass of coal} \times \text{calorific value}$$
$$\text{Useful energy} = \text{Total input} \times \eta, \qquad \text{Loss} = \text{Total input} - \text{Useful energy}$$

**Step-by-step solution** (slide 3)
1. Total energy input $= 120\ \text{kg} \times 4800\ \text{kcal/kg} = 576{,}000\ \text{kcal}$
2. Useful energy $= 576{,}000 \times 0.82 = 472{,}320\ \text{kcal}$
3. Loss $= 576{,}000 - 472{,}320 = 103{,}680\ \text{kcal}$

**Final answer:** $\boxed{103{,}680\ \text{kcal}}$ (matches the source's stated answer).

**Unit or sanity check:** kcal throughout; equivalently Loss $= 576{,}000 \times (1-0.82) = 576{,}000 \times 0.18 = 103{,}680$ kcal — same result, so the arithmetic is consistent. The loss must be less than total input ✓.

**Common trap:** Reporting the *useful* energy (472,320 kcal) instead of the *loss*, or dividing by efficiency instead of multiplying. Efficiency applies only to the input energy; the loss is what remains after extracting useful heat.

---



## Question 2

**Source wording** (slide 2): "A conveyor delivers coal with a width of 1 m and coal bed height of 0.25 m at a speed of 0.5 m/s. Determine coal delivery in tons per hour considering coal density of 1.1 ton/m³" — stated answer in source: *(ANS : 495 ton/hr)*.

**Given and target**
- Coal bed width: $w = 1$ m
- Coal bed height: $h = 0.25$ m
- Belt speed: $v = 0.5$ m/s
- Coal density: $\rho = 1.1$ ton/m³
- Target: delivery rate in **tons per hour**

**Governing relation**

$$A = w \times h, \qquad \dot{V} = A \times v, \qquad \dot{M} = \dot{V} \times \rho, \qquad \text{Tons/hour} = \dot{M}\ (\text{tons/s}) \times 3600\ \text{s/hour}$$

**Step-by-step solution** (slide 3)
1. Cross-sectional area of coal bed $= 1\ \text{m} \times 0.25\ \text{m} = 0.25\ \text{m}^2$
2. Volume flow rate $= 0.25\ \text{m}^2 \times 0.5\ \text{m/s} = 0.125\ \text{m}^3/\text{s}$
3. Mass flow $= 0.125\ \text{m}^3/\text{s} \times 1.1\ \text{ton/m}^3 = 0.1375$ tons/s
4. Tons/hour $= 0.1375\ \text{tons/s} \times 3600\ \text{s/hour} = 495$ tons/hour

**Final answer:** $\boxed{495\ \text{ton/hr}}$ (matches the source's stated answer).

**Unit or sanity check:** Units chain correctly: $\text{m}^2 \cdot \text{m/s} = \text{m}^3/\text{s}$; $\text{m}^3/\text{s} \cdot \text{ton/m}^3 = \text{ton/s}$; $\text{ton/s} \cdot 3600 = \text{ton/h}$. Cross-check: $495/3600 = 0.1375$ ton/s ✓.

**Common trap:** Stopping at m³/s or forgetting the $\times 3600$ conversion to hourly rate; also note density is in **ton**/m³ (not kg/m³) — converting 1.1 ton/m³ to 1100 kg/m³ mid-way without converting back will give a wrong final unit.

---



## Question 3

**Source wording** (slide 4): "Which of the following statements are true?
i) reactive current is necessary to build up the flux for the magnetic field of inductive devices
ii) some portion of reactive current is converted into work
iii) the cosine of angle between kVA and kVAr vector is called power factor
iv) the cosine of angle between kW and kVA vector is called power factor"

Stated answer in source: **ANS : 1 and 4** (i.e., statements i and iv are true).

**Given and target**
- Four statements about reactive current and power factor
- Target: identify which statements are true (per the source: i and iv)

**Governing relation (power-triangle definitions)**

$$\text{kW} = \text{kVA} \cos\varphi, \qquad \text{kVAr} = \text{kVA} \sin\varphi, \qquad \text{Power factor} = \cos\varphi = \frac{\text{kW}}{\text{kVA}}$$

where $\varphi$ is the angle between the **kW and kVA** vectors in the power triangle.

**Step-by-step solution**
- **(i) True** — inductive devices (motors, transformers) need magnetising current to establish the magnetic flux; reactive current serves exactly this purpose.
- **(ii) False** — reactive current oscillates between source and load and performs **no net work**; only the active (in-phase) component converts into work. If any portion of reactive current were converted to work, it would not be "reactive."
- **(iii) False** — the cosine of the angle between the **kVA and kVAr** vectors is $\sin\varphi$, not the power factor.
- **(iv) True** — power factor is defined as the cosine of the angle between the **kW and kVA** vectors, i.e., $PF = \text{kW}/\text{kVA} = \cos\varphi$.

**Final answer:** Statements **i and iv** are true (as stated in the source: "1 and 4").

**Unit or sanity check:** Consistency check via the power triangle: if (iii) were the definition, then $PF$ would equal $\text{kVAr}/\text{kVA} = \sin\varphi$, which contradicts $PF = \cos\varphi$; hence (iii) must be false whenever (iv) is true.

**Common trap:** Confusing the two angles — power factor uses the **kW–kVA** angle ($\cos\varphi$), not the **kVA–kVAr** angle ($\sin\varphi$). Also avoid assuming that because reactive current is "necessary," it does work — necessity for flux ≠ conversion into work.

---

## Question 4

**Source wording:** "Assume CO₂ equivalent emissions using a 60 W incandescent lamp are of the order of 60 g/hr. If it is replaced by a 5 W LED lamp then the equivalent CO₂ emissions will be __________." (Printed answer on slide: "ANS 5 g/hr")

**Given and target:**
- Incandescent lamp: $60\ \text{W}$, emissions $\approx 60\ \text{g/hr}$
- Replacement LED: $5\ \text{W}$
- Target: equivalent CO₂ emission rate of the LED lamp

**Governing relation:** Emissions scale proportionally with lamp power (the slide's stated basis of "of the order of 60 g/hr" for 60 W implies a linear emission factor):

$$\dot{m}_{CO_2,\text{LED}} = \dot{m}_{CO_2,\text{inc}} \times \frac{P_{\text{LED}}}{P_{\text{inc}}}$$

**Step-by-step solution:**
1. Emission factor implied by the assumption: $60\ \text{g/hr} \div 60\ \text{W} = 1\ \text{g/hr per watt}$.
2. Apply to the 5 W LED:

$$\dot{m}_{CO_2,\text{LED}} = 60 \times \frac{5}{60} = 5\ \text{g/hr}$$

**Final answer:** $5\ \text{g/hr}$ (matches the printed slide answer).

**Unit or sanity check:** Units are g/hr of CO₂-equivalent; the LED draws $\tfrac{1}{12}$ of the incandescent power, so $\tfrac{1}{12}$ of the emissions ($60/12 = 5$) — consistent.

**Common trap:** Assuming the LED has zero emissions because it consumes little power, or scaling by luminous output rather than electrical power. The question asks for equivalent emissions under the same per-watt assumption.



## Question 5

**Source wording:** "If feed of 100 tonnes per hour at 5% concentration is fed to a crystallizer, the product obtained at 25% concentration is equal to ____ tonnes per hour." (Printed answer on slide: "ANS 20"; printed working: "$100 \times 0.05 = \text{Product} \times 0.25$")

**Given and target:**
- Feed: $F = 100$ tonnes/hr at $5\%$ concentration
- Product concentration: $25\%$
- Target: product mass flow rate $P$ in tonnes/hr

**Governing relation:** Solute (solids) mass balance across the crystallizer, as written on the slide:

$$F \cdot x_F = P \cdot x_P$$

**Step-by-step solution:** Following the slide's own working:
1. Solute in feed: $100 \times 0.05 = 5$ tonnes/hr.
2. Set equal to solute in product: $\text{Product} \times 0.25 = 5$.
3. Solve:

$$P = \frac{100 \times 0.05}{0.25} = \frac{5}{0.25} = 20\ \text{tonnes/hr}$$

**Final answer:** $20$ tonnes/hr (matches the printed slide answer).

**Unit or sanity check:** Tonnes/hr; concentrating from 5% to 25% must reduce total mass flow fivefold ($100 \to 20$), which checks out. The removed $80$ tonnes/hr is evaporated water (implied, not stated on the slide).

**Common trap:** Balancing total mass instead of solute mass, or forgetting that concentration fractions must be used as decimals ($0.05$, $0.25$), not percentages. Note the balance implicitly assumes all solute reports to the product (no solids lost to mother liquor/overflow is discussed on the slide).



## Question 6

**Source wording:** "What percentage of the sun's energy can silicon solar panels convert into electricity? a) 30% b) 15% c) 75% d) 50%"

**Given and target:** Multiple-choice conceptual question; target is the typical conversion efficiency of silicon solar panels.

**Governing relation:** Conversion efficiency concept: $\eta = \dfrac{\text{electrical output}}{\text{solar energy input}} \times 100\%$. No formula or derivation appears on the slide.

**Step-by-step solution:** The option **b) 15%** is marked as the selected/correct choice on the slide (emphasized — italicized — in the OCR layer; this formatting mark is not a printed "ANS" label like other questions carry). No supporting calculation is provided on the slide itself.

**Final answer:** b) 15% (as emphasized in the source's OCR layer; the slide does not print an "ANS" label here, nor any explanatory justification).

**Unit or sanity check:** Percentage; the slide prints only the MCQ options (30%, 15%, 75%, 50%) and the emphasis on b) 15%. No supporting efficiency figures appear in the source, so no further numerical cross-check is possible from the slides alone.

**Common trap:** Choosing a), c), or d) instead of the emphasized option b) 15%. The slide gives no derivation or supporting data, so the answer rests solely on the OCR-layer emphasis; any broader efficiency context (theoretical limits, lab records, commercial ranges) is outside this source.



## Question 7

**Source wording:** "How much theoretical power you would expect to generate from a river-based mini hydropower with flow of 20 litres/second and head of 12 metres." (Printed answer on slide: "ANS : 2.35 KW"). Slide formula: "Hydraulic Power = Head (meters) x Flow (lps) x 9.81" and "Hydraulic Power = Watts".

**Given and target:**
- Flow: $Q = 20$ litres/s (lps)
- Head: $H = 12$ m
- Target: theoretical hydraulic power in watts/kilowatts

**Governing relation (as printed on the slide):**

$$\text{Hydraulic Power (W)} = \text{Head (m)} \times \text{Flow (lps)} \times 9.81$$

This is $P = \rho g Q H$ with $\rho = 1\ \text{kg/L}$, i.e., flow in litres per second multiplied directly.

**Step-by-step solution:**

$$P = 12 \times 20 \times 9.81 = 2354.4\ \text{W}$$

$$P \approx 2.35\ \text{kW}$$

**Final answer:** $\approx 2.35$ kW ($2354.4$ W), matching the printed slide answer.

**Unit or sanity check:** W = m × lps × m/s², dimensionally consistent since 1 lps = 1 kg/s for water; result is *theoretical/hydraulic* power only.

**Common trap:** Treating this as actual generator output — no turbine/generator efficiency is applied here ("theoretical" power). Also avoid unit slips: if flow were in m³/s instead of lps, the factor 9.81 would need $\rho = 1000\ \text{kg/m}^3$ explicitly; mixing conventions silently changes the answer by $10^3$.



## Question 8

**Source wording:** "An induction motor with 11 kW rating and efficiency of 90% in its name plate means it will draw 9.9 kW at full load. TRUE / FALSE" (Printed answer on slide: "FALSE", with note "(it will draw 12.22 kW at full load)")

**Given and target:**
- Nameplate (output/shaft) rating: $P_{\text{out}} = 11$ kW
- Nameplate efficiency: $\eta = 90\%$
- Claim to evaluate: input power draw $= 9.9$ kW at full load

**Governing relation:**

$$\eta = \frac{P_{\text{out}}}{P_{\text{in}}} \implies P_{\text{in}} = \frac{P_{\text{out}}}{\eta}$$

**Step-by-step solution:**
1. The 11 kW nameplate rating is the motor's *output* (shaft) power.
2. Input power at full load:

$$P_{\text{in}} = \frac{11}{0.90} = 12.\overline{2}\ \text{kW} \approx 12.22\ \text{kW}$$

3. Since $12.22\ \text{kW} \neq 9.9\ \text{kW}$, the statement is false. (The figure 9.9 kW arises from mistakenly multiplying $11 \times 0.90$ instead of dividing; the actual losses are $P_{\text{in}} - P_{\text{out}} = 12.22 - 11 \approx 1.22$ kW.)

**Final answer:** FALSE — it will draw approximately 12.22 kW at full load (matches the printed slide answer).

**Unit or sanity check:** Input must exceed output whenever efficiency < 100%; $12.22 > 11 > 9.9$ confirms the direction. Losses $\approx 1.22$ kW ≈ 10% of input, consistent with $\eta = 0.9$.

**Common trap:** Computing $11 \times 0.90 = 9.9$ kW — multiplying by efficiency instead of dividing. Efficiency relates input to *output*, and nameplate ratings for motors are output power, so you divide to get input.



## Question 9 - (heating water by resistance heating)

**Source wording (slide 7):** "The amount of electricity (kwh) required to heat 100 litres of water from 30 °C to 70 °C through resistance heating is. The specific heat of water is 1 calorie/gram ∘C = 4.186 joule/gram ∘C. 1 KCAL = 0.00116222 KWH. (ANS : 4.65 kWh)" Slide 8 provides the full worked "Solution:" reproduced in the steps below.

**Given and target:**
- Mass/volume of water: $100$ litres (density $\approx 1$ kg/L $\Rightarrow m = 100$ kg)
- Initial temperature: $30\ ^\circ\text{C}$; final temperature: $70\ ^\circ\text{C}$
- Specific heat of water: $c = 4.186\ \text{kJ/kg·°C}$ (given equivalently as $1$ cal/g·°C $= 4.186$ J/g·°C)
- Target: electrical energy in kWh for resistance heating

**Governing relation (printed on slide 8):**

$$Q = m \cdot c \cdot \Delta T$$

with $Q$ as heat energy (in kilocalories or joules), then converted to kWh.

**Step-by-step solution (following slide 8 exactly):**
1. Mass of water: $100\ \text{litres} = 100\ \text{kg}$ (density of water $\approx 1$ kg/L).
2. Specific heat: $c = 4.186\ \text{kJ/kg·°C}$.
3. Temperature change: $\Delta T = 70 - 30 = 40\ ^\circ\text{C}$.
4. Heat energy:

$$Q = 100 \times 4.186 \times 40 = 16{,}744\ \text{kJ}$$

5. Convert to kWh ($1\ \text{kWh} = 3600\ \text{kJ}$):

$$Q = \frac{16744}{3600} = 4.65\ \text{kWh}$$

Cross-check via the slide-7 constants (using $c = 1\ \text{kcal/kg·°C}$): $100\ \text{kg} \times 1\ \text{kcal/kg·°C} \times 40\ ^\circ\text{C} = 4{,}000$ kcal; then $4{,}000 \times 0.00116222\ \text{kWh/kcal} = 4.65$ kWh — same result.

**Final answer:** $4.65$ kWh (matches the printed slide answer).

**Unit or sanity check:** kJ ÷ 3600 s/kWh gives kWh correctly; heating 100 L by 40 °C needing roughly 4.65 units of electricity is plausible for a domestic water heater. For resistance heating the conversion is taken as 100% efficient (all electrical energy becomes heat in the water); no heater loss allowance appears on the slides.

**Common trap:** Forgetting to convert litres to kilograms (or misusing gram-based specific heat with kilogram masses, a $10^3$ error); using $\Delta T = 70\ ^\circ\text{C}$ (final temperature) instead of $40\ ^\circ\text{C}$ (rise); or converting kJ to kWh with the wrong divisor ($3600$, not $360$ or $1000$).

---

## Question 10 - Unburnt carbon remaining in boiler refuse (Slides 9–10)

**Source wording** *(slide 9, statement; slide 10, worked solution)*:

> "A sample of coal being used in a boiler is found to contain 60% carbon and 23% ash. The refuse obtained after combustion is analyzed and found to contain 7% carbon & the rest is ash. Compute the percentage of the original carbon in coal which remains as unburnt in the refuse."
> (ANS: **2.89%**)

**Given and target**
- Coal composition (by analysis): 60% carbon, 23% ash.
- Refuse composition (by analysis): 7% carbon, rest ash ($93\%$ ash).
- Target: percentage of the **original** carbon in the coal that ends up unburnt in the refuse.

**Governing relation**

All ash in the coal passes into the refuse (ash is inert). Therefore the ash balance links the refuse quantity back to the quantity of raw coal fired:

$$m_{\text{ash, refuse}} = (\text{ash fraction in coal}) \times m_{\text{raw coal}}$$

and

$$\%\,\text{original C unburnt} = \frac{m_{\text{C unburnt in refuse}}}{m_{\text{C originally in coal}}} \times 100$$

**Step-by-step solution** *(as worked on slide 10)*
1. Basis: quantity of refuse sample = 100 kg.
2. Unburnt carbon in refuse = $7\%$ of 100 kg = **7 kg**.
3. Ash in refuse = $100 - 7$ = **93 kg**.
4. Total ash in the coal has come into the refuse = 23% of coal, so 93 kg of ash corresponds to the 23% ash in the raw coal.
5. Quantity of total raw coal:

$$m_{\text{coal}} = \frac{93}{0.23} = 404.35\ \text{kg}$$

6. Quantity of original carbon in the coal:

$$m_{\text{C, original}} = 0.60 \times 404.35 = 242.61\ \text{kg}$$

7. Percentage of original carbon unburnt in refuse:

$$\frac{7}{242.61} \times 100 = 2.89\%$$

**Final answer**: $\boxed{2.89\%}$ of the original carbon remains unburnt in the refuse (matches the printed ANS).

**Unit or sanity check**: Percent by mass; dimensionless ratio check $\frac{7\ \text{kg}}{242.61\ \text{kg}} \approx 0.0289$. Sanity: most carbon burns, so a small residual (~3%) is plausible; also the refuse (100 kg) is far smaller than the coal charged (404.35 kg), consistent with combustion loss of volatiles and carbon.

**Common trap**: Taking 100 kg of *coal* as the basis instead of 100 kg of *refuse*, or comparing 7 kg directly with 60% of some assumed coal mass. The chain must run: refuse → (via ash balance) → raw coal → original carbon. Another trap is reporting 7% (carbon content of refuse) instead of the fraction of the original carbon.

---



## Question 11 - Mini hydropower output (Slide 11)

**Source wording** *(slide 11)*:

> "How much power you would expect to generate from a river-based mini hydropower with flow of 40 litres/second, head of 12 metres and system efficiency of 55%."
>
> ANS: **2.59 KW** = (density of water × 9.81 × flow rate in m³/s × head in metre × overall efficiency)
>
> (litres/second) / 1000 = m³/s

**Given and target**
- Flow rate: $Q = 40\ \text{litres/s}$
- Head: $H = 12\ \text{m}$
- System (overall) efficiency: $\eta = 55\%$
- Target: expected electrical power output.

**Governing relation** *(as given on the slide)*

$$P = \rho_{\text{water}} \times 9.81 \times Q\,(\text{m}^3/\text{s}) \times H\,(\text{m}) \times \eta_{\text{overall}}$$

with conversion $(\text{litres/s}) / 1000 = \text{m}^3/\text{s}$ and $\rho_{\text{water}} = 1000\ \text{kg/m}^3$.

**Step-by-step solution**
1. Convert flow: $Q = 40/1000 = 0.04\ \text{m}^3/\text{s}$.
2. Hydraulic power: $P_h = \rho g Q H = 1000 \times 9.81 \times 0.04 \times 12 = 4708.8\ \text{W}$.
3. Apply overall efficiency: $P = 4708.8 \times 0.55 = 2589.84\ \text{W}$.

**Final answer**: $P \approx 2590\ \text{W} = \boxed{2.59\ \text{kW}}$ (matches the printed ANS: 2.59 KW).

**Unit or sanity check**: $\text{kg/m}^3 \cdot \text{m/s}^2 \cdot \text{m}^3/\text{s} \cdot \text{m} = \text{kg}\cdot\text{m}^2/\text{s}^3 = \text{W}$. A few-kW output is typical for a small river-based mini-hydro at these flows and heads.

**Common trap**: Forgetting to divide litres/s by 1000 (using 40 instead of 0.04 m³/s inflates the answer 1000×), omitting the 55% efficiency, or using $g = 9.81$ with a density other than water's.

---



## Question 12 - Electricity to heat brine by resistance heating (Slide 11)

**Source wording** *(slide 11)*:

> "The theoretical amount of electricity required to heat 500 litres of brine solution with a specific gravity of 1.2 and specific heat of 1 kcal/kg°K from 30°C to 70°C through resistance heating is _________"
>
> ANS: **27.9 KWH**
>
> Given relations on slide: $Q$ in kCal $= m \cdot c \cdot \Delta T$, $m = V \times$ density, $1\ \text{kWh} = 860\ \text{kcal}$

**Given and target**
- Volume of brine: $V = 500\ \text{litres}$
- Specific gravity: $SG = 1.2$ (so density $= 1.2\ \text{kg/litre}$)
- Specific heat: $c = 1\ \text{kcal/(kg·K)}$
- Temperature rise: $30\,^\circ\text{C} \to 70\,^\circ\text{C}$
- Target: theoretical electrical energy required (kWh).

**Governing relations** *(as given)*

$$Q = m\,c\,\Delta T \quad [\text{kcal}], \qquad m = V \times \rho, \qquad E\,[\text{kWh}] = \frac{Q\,[\text{kcal}]}{860}$$

**Step-by-step solution**
1. Mass of brine: $m = V \times \rho = 500\ \text{litres} \times 1.2\ \text{kg/litre} = 600\ \text{kg}$.
2. Heat required: $Q = m\,c\,\Delta T = 600 \times 1 \times (70 - 30) = 24{,}000\ \text{kcal}$.
3. Convert to electricity ("theoretical"): $E = \dfrac{24{,}000}{860} = 27.91\ \text{kWh}$.

**Final answer**: $\boxed{27.9\ \text{kWh}}$ (matches the printed ANS: 27.9 KWH).

**Unit or sanity check**: Since $\Delta T = 40\ \text{K}$ whether measured in °C or K, $c = 1\ \text{kcal/(kg·K)}$ applies directly. Cross-check: $24{,}000/860 \approx 27.9$. Resistance heating converts essentially all input electricity to heat, so equating kWh to kcal via 860 kcal/kWh is the intended theoretical treatment.

**Common trap**: Using 500 kg (ignoring the specific gravity 1.2), which would give $500 \times 40 / 860 \approx 23.3$ kWh — wrong. Also do not divide by a heater efficiency here; the slide asks for the **theoretical** amount, and no efficiency is given.

---



## Question 13 - Steam saving from feed-water preheating (Slide 12)

**Source wording** *(slide 12)*:

> "In a process industry, 12,000 kg/hr water is currently being heated from 18°C to 80°C by indirect heating of steam. An opportunity has been identified which would preheat the inlet water to 45°C to reduce the steam required.
> Estimate the reduction in steam in kg/hr considering latent heat of steam as 520 kcal/kg in both the cases.
> The specific heat of water is 1 calorie/gram ∘C = 4.186 joule/gram ∘C"

**Given and target**
- Water flow: $\dot{m}_w = 12{,}000\ \text{kg/hr}$
- Current duty: heat water from $18\,^\circ\text{C}$ to $80\,^\circ\text{C}$
- Proposed: preheat inlet to $45\,^\circ\text{C}$, then steam heats to $80\,^\circ\text{C}$
- Latent heat of steam: $\lambda = 520\ \text{kcal/kg}$ (both cases)
- Specific heat of water: $c = 1\ \text{cal/(g·°C)} = 1\ \text{kcal/(kg·°C)}$
- Target: reduction in steam consumption in kg/hr.
- Note: the slide states the question only; **no source-stated answer appears in the source**, so the value below is computed from the given data.

**Governing relation**

Indirect heating means steam gives up only its latent heat:

$$\dot{Q} = \dot{m}_w \cdot c_w \cdot \Delta T, \qquad \dot{m}_{steam} = \frac{\dot{Q}}{\lambda}$$

**Step-by-step solution**
1. Current case temperature rise: $\Delta T_1 = 80 - 18 = 62\,^\circ\text{C}$.
   $$\dot{Q}_1 = 12{,}000 \times 1 \times 62 = 744{,}000\ \text{kcal/hr}$$
   $$\dot{m}_{s1} = \frac{744{,}000}{520} \approx 1430.8\ \text{kg/hr}$$
2. With preheat, steam only raises water from 45°C to 80°C: $\Delta T_2 = 80 - 45 = 35\,^\circ\text{C}$.
   $$\dot{Q}_2 = 12{,}000 \times 1 \times 35 = 420{,}000\ \text{kcal/hr}$$
   $$\dot{m}_{s2} = \frac{420{,}000}{520} \approx 807.7\ \text{kg/hr}$$
3. Reduction:
   $$\Delta\dot{m}_{s} = 1430.8 - 807.7 \approx 623.1\ \text{kg/hr} \quad (\approx 43.5\% \text{ less steam})$$

**Final answer**: Steam requirement falls from about $1430.8$ to $807.7\ \text{kg/hr}$, a **reduction of approximately 623 kg/hr**. *(Computed from the slide's data; the slide itself prints no answer.)*

**Unit or sanity check**: $c = 1\ \text{cal/(g·°C)}$ equals exactly $1\ \text{kcal/(kg·°C)}$, so kg of water × ΔT(°C) gives kcal directly; the $4.186\ \text{J/(g·°C)}$ equivalence is consistent and not otherwise needed. Check: $12{,}000 \times 27 / 520 = 623.1$, same as the difference of the two cases.

**Common trap**: Reporting only the new steam demand (807.7 kg/hr) instead of the *reduction*; or applying sensible-heat logic to the steam side (only latent heat, 520 kcal/kg, condenses in indirect heating per the problem statement).

---

## Question 14 - Heat-recovery steam saving (Answer slide; question stem is NOT in this excerpt)

**Source wording.** Slide 13 is headed only *"Answer"* and presents the solution below. The question statement itself sits on an earlier slide outside this excerpt, so its exact wording is unavailable here. From the working shown, the situation is clearly: a process water stream heated to $80\,°C$, in which waste-heat recovery preheats the incoming water from $18\,°C$ to $45\,°C$, reducing steam demand. All figures below are transcribed exactly from the answer slide.

**Given and target.** Values legible in the answer: mass flow of water $m = 12{,}000$ kg/hr; $C_p = 1$ kcal/kg·°C; final temperature $80\,°C$; feed temperature $18\,°C$ without recovery and $45\,°C$ after recovery; steam-side heat taken as $520$ kcal/kg (implied divisor). Target: heating duty and steam requirement before vs after heat recovery, and the reduction in steam required.

**Governing relation.**

$$Q = m\,C_p\,\Delta T \qquad \text{Steam required} = \frac{Q}{520}$$

**Step-by-step solution.**

*Without heat recovery:*
1. Heating required $Q_1 = m C_p \Delta T = 12{,}000 \times 1 \times (80 - 18) = 744{,}000$ kcal/hr
2. Steam required $= 744{,}000 / 520 = 1431$ kg/hr

*After heat recovery:*
3. Heating required $Q_2 = 12{,}000 \times 1 \times (80 - 45) = 420{,}000$ kcal/hr
4. Steam required $= 420{,}000 / 520 = 808$ kg/hr

*Reduction:*
5. $1431 - 808 = 623$ kg/hr

**Final answer.** Steam demand drops from **1431 kg/hr** to **808 kg/hr**, i.e. a reduction of **623 kg/hr** (≈ 43.5% less steam).

**Unit or sanity check.** kcal/hr ÷ (kcal/kg) = kg/hr ✔. Duties scale with $\Delta T$: $420{,}000/744{,}000 \approx 35/62 \approx 0.56$, and indeed $808/1431 \approx 0.56$ ✔.

**Common trap.** Re-using $(80 - 18)$ after recovery — once the feed is preheated to $45\,°C$, only the rise to $80\,°C$ counts. Also, the $520$ kcal/kg figure comes straight from the slide; substituting a different steam latent heat will change the result.

---



## Question 15 - Dust collected in a bag-filter bin

**Source wording.** "During an air pollution monitoring study, the inlet gas stream to a bag filter was 200,000 m3 per hour. The outlet gas stream from the bag filter was little bit higher at 220,000m3 per hour. The dust load at the inlet was 5 g/m3 and at the outlet 0.2 g/m3. How much dust in kg/hour was collected in the bag filter bin?"

**Given and target.** Inlet gas flow $= 200{,}000$ m³/hr; outlet gas flow $= 220{,}000$ m³/hr; inlet dust load $= 5$ g/m³; outlet dust load $= 0.2$ g/m³. Target: dust collected in the bin, in **kg/hour**.

**Governing relation.** Steady-state mass balance on dust across the filter:

$$\text{Dust (gas in)} = \text{dust (in gas out)} + \text{dust (in bin)}$$

**Step-by-step solution.**
1. Dust entering: $200{,}000 \times 5 = 1{,}000{,}000$ g/hr
2. Dust leaving in gas: $220{,}000 \times 0.2 = 44{,}000$ g/hr
3. Balance: $200{,}000 \times 5 = 220{,}000 \times 0.2 + X$
4. $X = 1{,}000{,}000 - 44{,}000 = 956{,}000$ gm/hr
5. $X = 956$ kg/hr

**Final answer.** **$X = 956$ kg/hr** of dust is collected in the bag-filter bin.

**Unit or sanity check.** Implied overall capture efficiency $\approx 956 / 1000 = 95.6\%$, a realistic figure for a bag filter. The two gas volumes legitimately differ (outlet is higher), so each side uses its own flow × concentration.

**Common trap.** Setting inlet and outlet gas flows equal (the slide deliberately gives 200,000 vs 220,000 m³/hr), and forgetting the g → kg conversion: the balance yields grams per hour, and the requested answer is in kg/hr.

---



## Question 16 - Replace existing standard motor with an energy-efficient motor vs rewinding it

**Source wording.** "Calculate the annual energy savings from replacing standard existing motor with energy efficient motor versus rewinding the existing motor." Data given (slide 15):

| Parameter | Value |
|---|---|
| Efficiency after rewind of standard motor | 87% |
| Efficiency of energy-efficient motor | 94% |
| Operating hours | 7200 hrs |
| % loading of motor | 82% |
| Power cost | Rs 5.2 / kWh |
| Name plate rating of motor | 20 kW |

**Given and target.** As tabulated above; target is the **annual energy cost savings in Rs/year** of the energy-efficient motor relative to the rewound standard motor, for the same delivered shaft power.

**Governing relation.** Both motors deliver the same shaft output $=$ nameplate kW $\times$ %loading; electrical input $=$ output $\div (\eta/100)$, so the saving lies in the difference of the reciprocal efficiencies:

$$\text{Energy cost savings (Rs/year)} = (\text{kW}) \times (\%\,\text{loading}) \times \left\{\frac{100}{\text{eff. of rewound standard motor}} - \frac{100}{\text{eff. of energy-efficient motor}}\right\} \times \left(\frac{\text{Hrs}}{\text{annum}}\right) \times \left(\frac{\text{Rs}}{\text{kWh}}\right)$$

**Step-by-step solution** (slide 16).
1. Substitute: $20 \times 0.82 \times 7200 \times \left[(100/87) - (100/94)\right] \times 5.2$
2. Output-energy term: $20 \times 0.82 \times 7200 = 118{,}080$
3. Reciprocal efficiencies: $100/87 = 1.1494$ and $100/94 = 1.0638$, difference $= 0.0856$
4. $118{,}080 \times [1.1494 - 1.0638] \times 5.2 = 52{,}560$

**Final answer.** Annual energy cost savings $\approx$ **Rs 52,560/- per year** (as printed on the slide).

**Unit or sanity check.** Shaft output $= 20 \times 0.82 = 16.4$ kW; inputs $\approx 16.4 \times 1.1494 = 18.85$ kW vs $16.4 \times 1.0638 = 17.45$ kW, difference $\approx 1.40$ kW. Over 7200 h: $\approx 10{,}100$ kWh/yr; at Rs 5.2/kWh $\approx$ Rs 52,500–52,600 — consistent with the slide's Rs 52,560 (small differences arise only from rounding inside the bracket).

**Common trap.** Comparing raw efficiency points ($94 - 87 = 7\%$) instead of input-power reciprocals; omitting the 82% loading factor (using 20 kW directly overstates the saving by ~22%); or treating the nameplate rating as electrical input rather than shaft output.

---

## Question 17 - Fixed electricity consumption of an industry (Slide 17, "Example")

- **Source wording:** *"In an industry the average electricity consumption is 5.8 lakh kwh for a given period. The average production is 50000 tons with a specific electricity of 11 kwh/ton for the same period. The fixed electricity consumption for the plant is"* — followed on the slide by **ANS : 30000kWh** (fill-in-the-blank style).
- **Given and target:**
  - Total electricity consumption $E_{tot} = 5.8$ lakh kWh $= 580{,}000$ kWh
  - Production $= 50{,}000$ tons; specific electricity $= 11$ kWh/ton (variable part)
  - Target: fixed (production-independent) electricity consumption.
- **Governing relation:** Total consumption = fixed consumption + (specific electricity × production):
$$E_{tot} = E_{fix} + e \cdot P \quad\Rightarrow\quad E_{fix} = E_{tot} - e \cdot P$$
- **Step-by-step solution:**
  1. Variable consumption: $e \cdot P = 11 \,\text{kWh/ton} \times 50{,}000\,\text{tons} = 550{,}000\,\text{kWh} = 5.5$ lakh kWh.
  2. Fixed consumption: $E_{fix} = 5.8 - 5.5 = 0.3$ lakh kWh.
  3. Convert: $0.3$ lakh $= 30{,}000$ kWh.
- **Final answer:** $E_{fix} = 30{,}000$ kWh (matches slide answer **30000kWh**).
- **Unit or sanity check:** Units: kWh/ton × ton = kWh ✓. Fixed share ($30{,}000/580{,}000 \approx 5\%$) is small, typical of a production-dominated plant.
- **Common trap:** Treating the entire 5.8 lakh kWh as variable, or forgetting that "lakh" $= 10^5$ and reporting 0.3 instead of 30,000 kWh.

---



## Question 18 - Water evaporated during combustion of moist wood (Slide 17, "Example")

- **Source wording:** *"1 kg of wood contains 15% moisture and 5% hydrogen by weight. How much water is evaporated during complete combustion of 1kg of wood? ANS : 600 gm"* with slide hint: *"Water formed due to presence of Hydrogen in fuel is 9\*%H/gm"*.
- **Given and target:**
  - Wood mass $= 1$ kg $= 1000$ g; moisture $= 15\%$ by weight; hydrogen $= 5\%$ by weight.
  - Target: total water released (moisture evaporated + water formed from hydrogen combustion).
- **Governing relations:**
  - Free moisture evaporates as-is: $m_{moisture} = 0.15 \times m_{fuel}$.
  - Combustion of hydrogen, $2H_2 + O_2 \to 2H_2O$, yields 9 parts water per 1 part hydrogen; slide form: water from H $= 9 \times \%H$ (in g per 100 g of fuel).
- **Step-by-step solution:**
  1. Water from moisture: $0.15 \times 1000\,\text{g} = 150\,\text{g}$.
  2. Hydrogen present: $0.05 \times 1000\,\text{g} = 50\,\text{g}$.
  3. Water formed from hydrogen: $9 \times 50\,\text{g} = 450\,\text{g}$ (equivalently, $9 \times 5 = 45$ g per 100 g fuel $\Rightarrow 450$ g per kg).
  4. Total: $150 + 450 = 600\,\text{g}$.
- **Final answer:** $600$ g of water (matches slide answer **600 gm**).
- **Unit or sanity check:** Mass fractions sum sensibly: 150 g moisture + 50 g H are well within the 1000 g charge; $9{:}1$ water-to-hydrogen mass ratio follows directly from molar masses ($2\times18 / (2\times2)$).
- **Common trap:** Counting only the hydrogen-derived water (450 g) and forgetting the free moisture, or misreading "9×%H" as 9 × 0.05 = 0.45 g instead of working on a per-100-g (or per-kg) basis.

---



## Question 19 - Drying: weight of product (Slide 18)

- **Source wording:** *"In a drying process, moisture is reduced from 60% to 30%. Initial weight of the material is 200 kg. Calculate the weight of the product ?"* **ANS : 114.3**
- **Given and target:**
  - Initial mass $W_1 = 200$ kg at $60\%$ moisture (wet basis); final moisture $= 30\%$ (wet basis).
  - Target: final (product) weight $W_2$.
- **Governing relation:** Bone-dry solids are conserved: $W_1(1 - M_1) = W_2(1 - M_2)$.
- **Step-by-step solution:**
  1. Dry solids initially: $200 \times (1 - 0.60) = 80$ kg.
  2. Final material is $30\%$ moisture, i.e. $70\%$ solids: $W_2 = \dfrac{80}{0.70}$.
  3. $W_2 = 114.29 \approx 114.3$ kg.
- **Final answer:** $W_2 \approx 114.3$ kg (matches slide answer **114.3**).
- **Unit or sanity check:** Water removed $= 200 - 114.3 = 85.7$ kg, which is less than the initial 120 kg of water — consistent with residual 30% moisture in the product ✓.
- **Common trap:** Subtracting moisture percentages linearly (removing "60% − 30%" of something) or computing 30% of 200 kg; moisture percentages are wet-basis, so track dry solids instead.

---



## Question 20 - DG set kVA loading from specific fuel consumption (Slide 18)

- **Source wording:** *"In a DG set, the generator is consuming 400 litres per hour diesel oil. If the specific fuel consumption of this DG set in 0.30 litres/kWh at that load, then what is the kVA loading of the set at 0.6 power factor ."* **ANS : 2222 KVA**
- **Given and target:**
  - Fuel rate $= 400$ L/h; specific fuel consumption (SFC) $= 0.30$ L/kWh; power factor $= 0.6$.
  - Target: apparent power loading in kVA.
- **Governing relations:**
$$\text{Output power (kW)} = \frac{\text{fuel rate (L/h)}}{\text{SFC (L/kWh)}}, \qquad \text{kVA} = \frac{\text{kW}}{\text{PF}}$$
- **Step-by-step solution:**
  1. Active power output: $400 \div 0.30 = 1333.3$ kW.
  2. Apparent power: $\dfrac{1333.3}{0.6} = 2222.2$ kVA.
- **Final answer:** $\approx 2222$ kVA (matches slide answer **2222 KVA**).
- **Unit or sanity check:** (L/h) ÷ (L/kWh) = kWh per hour = kW ✓; dividing kW by PF (< 1) must increase the number, and 2222 > 1333 ✓.
- **Common trap:** Multiplying by the power factor instead of dividing (which would give 800 kVA), or reading SFC backwards (treating 0.30 as kWh/L).

---



## Question 21 - Run-of-river mini hydropower potential (Slide 18)

- **Source wording:** *"How much power generation potential is available in a run of river mini hydropower plant for a flow of 40 liters/second with a head of 24 metres . Assume system efficiency of 60%"* **ANS : 5.6 kW**
- **Given and target:**
  - Flow $Q = 40$ L/s $= 0.04$ m³/s; head $H = 24$ m; system efficiency $\eta = 60\%$.
  - Target: power generation potential.
- **Governing relation:** Hydraulic power with efficiency:
$$P = \eta \, \rho \, g \, Q \, H$$
- **Step-by-step solution:**
  1. Convert flow: $40\,\text{L/s} = 0.04\,\text{m}^3/\text{s}$.
  2. Substitute ($\rho = 1000\,\text{kg/m}^3$, $g = 9.81\,\text{m/s}^2$):
$$P = 0.6 \times 1000 \times 9.81 \times 0.04 \times 24 = 5650.6\,\text{W}$$
  3. Round: $P \approx 5.65$ kW $\approx 5.6$ kW.
- **Final answer:** $\approx 5.6$ kW (matches slide answer **5.6 kW**).
- **Unit or sanity check:** $\rho g Q H$ gives kg/(m·s²)·m³/s = W ✓. Gross hydraulic power $\approx 9.42$ kW; after 60% efficiency, $\approx 5.6$ kW is coherent.
- **Common trap:** Forgetting the efficiency factor (would give 9.4 kW) or failing to convert L/s to m³/s (a factor of 1000 error).

---



## Question 22 - Energy consumed by a 400 W lamp (Slide 19)

- **Source wording:** *"A 400W lamp was switched on for 10 hours per day. The supply volt is 230V (current= 2 amps & PF= 0.8). What is the energy consumption per day"*
- **Given (from slide solution):** Supply $V = 230$ V, measured current $I = 2$ A, power factor $\cos\Phi = 0.8$, operating time $= 10$ h/day; lamp nameplate 400 W.
- **Target:** Daily energy consumption in kWh.
- **Governing relation (as printed on the slide):**
$$\text{Electricity consumption (kWh)} = V \times I \times \cos\Phi \times \text{No. of Hours}$$
- **Step-by-step solution (source's own working):**
$$= 0.230 \times 2 \times 0.8 \times 10 = 3.7 \text{ kWh or Units}$$
(Voltages enter in kV so the result is directly in kWh.)
- **Final answer:** $3.7$ kWh (units) per day (as printed on the slide; exact product is 3.68 kWh).
- **Unit or sanity check:** Real power drawn $= 230 \times 2 \times 0.8 = 368$ W, slightly below the 400 W nameplate rating — plausible for measured (not ideal) operating conditions.
- **Common trap:** Using the 400 W nameplate figure instead of the measured $V \times I \times \cos\Phi$, or omitting the power factor entirely (230 × 2 × 10 = 4.6 kWh). The source deliberately works from the measured electrical quantities; note the slide rounds 3.68 up to 3.7 kWh.

---



## Question 23 - Electric heater consumption at rated and reduced voltage (Slide 19)

- **Source wording:** *"An electric heater of 230 V, 5 kW rating is used for hot water generation in an industry. Find electricity consumption per hour (a) at the rated voltage (b) at 200 V"*
- **Given and target:**
  - Heater rating: 230 V, 5 kW (resistive element, so resistance is fixed).
  - Target: hourly consumption (a) at 230 V, (b) at 200 V.
- **Governing relations:** For constant resistance, $P = V^2/R$, hence $P_2 = P_1 \left(\dfrac{V_2}{V_1}\right)^2$; energy = power × time.
- **Step-by-step solution (as printed on the slide):**
  1. (a) At rated voltage: $\text{consumption} = 5\,\text{kW} \times 1\,\text{hour} = 5\,\text{kWh}$.
  2. (b) At 200 V:
$$\left(\frac{200}{230}\right)^2 \times 5\,\text{kW} \times 1\,\text{hour} = 0.756 \times 5 = 3.78\,\text{kWh}$$
- **Final answer:** (a) $5$ kWh; (b) $3.78$ kWh (both match the slide).
- **Unit or sanity check:** $(200/230)^2 \approx 0.756$, so the reduced-voltage draw must be about three-quarters of rated — 3.78 < 5 ✓.
- **Common trap:** Applying a linear voltage scaling ($200/230 \times 5 = 4.35$ kWh) instead of the square law; the square law holds only because the heater resistance stays constant.

---



## Question 24 - Pumping energy for a reservoir filling duty (Slide 20)

- **Source wording:** *"A water pumping station fills a reservoir at a fixed rate. The head and flow rate are constant and hence the power drawn by the pump is always same. The pump operates at 100 m head and delivers 250 litres per second. The power consumption was measured as 300 kW. Calculate energy consumption to pump 13,500 kL of water to the reservoir."* **ANS :** *(worked on slide)*
- **Given and target:**
  - Constant flow $= 250$ L/s; measured input power $= 300$ kW; volume to pump $= 13{,}500$ kL. (Head 100 m is context — the power is already measured.)
  - Target: total energy consumption.
- **Governing relations:**
$$t\,(\text{h}) = \frac{\text{Volume (L)}}{\text{flow (L/s)} \times 3600\,\text{s/h}}, \qquad E\,(\text{kWh}) = P \times t$$
- **Step-by-step solution (as printed on the slide):**
  1. Time taken:
$$\frac{13{,}500 \times 10^{3}\,\text{L}}{250\,\text{L/s} \times 3600\,\text{s/hr}} = \frac{13{,}500{,}000}{900{,}000} = 15\ \text{hours}$$
  2. Power required to pump water $= 300$ kW.
  3. Energy consumption $= 300 \times 15 = 4500$ kWh.
- **Final answer:** $4500$ kWh (matches slide working).
- **Unit or sanity check:** 250 L/s = 900 kL/h; 13,500 kL ÷ 900 kL/h = 15 h ✓. The 100 m head is not needed once power is measured.
- **Common trap:** Mis-handling the kL→L conversion ($13{,}500\,\text{kL} = 13.5 \times 10^6$ L, not 13,500 L), or redundantly attempting a hydraulic power calculation from head and an assumed efficiency although measured power is given.

---



## Question 25 - Mixer mass balance (Homework, Slide 21)

- **Source wording:** *"A solution which contains 10% solids is mixed with 25% solid solution. A single output which is 20% solid is removed. If the 10% solution enters at 5.0 kg/s, what are the other rates? (Assume no accumulation)"* **ANS: 10KG/S , 15 KG/S**
- **Given and target:**
  - Feed A: 10% solids at $5.0$ kg/s; Feed B: 25% solids at unknown rate $x$; single output at 20% solids; steady state (no accumulation).
  - Target: the other rates — feed B flow and output flow.
- **Governing relations:** Steady-state balances:
$$\text{Overall mass: } O = 5.0 + x \qquad \text{Solids: } 0.10(5.0) + 0.25x = 0.20\,O$$
- **Step-by-step solution:**
  1. Substitute $O = 5.0 + x$ into the solids balance:
$$0.5 + 0.25x = 0.20(5.0 + x) = 1.0 + 0.20x$$
  2. Solve: $0.05x = 0.5 \Rightarrow x = 10\,\text{kg/s}$.
  3. Output: $O = 5.0 + 10 = 15\,\text{kg/s}$.
  4. Check solids: in $= 0.5 + 2.5 = 3.0$ kg/s; out $= 0.20 \times 15 = 3.0$ kg/s ✓.
- **Final answer:** 25%-solids feed $= 10$ kg/s; mixed output $= 15$ kg/s (matches slide answer **10 KG/S, 15 KG/S**).
- **Unit or sanity check:** Both balances close in kg/s: total inlet $= 5 + 10 = 15$ kg/s, while solids inlet $= 0.10(5) + 0.25(10) = 3$ kg/s equals solids outlet $= 0.20(15) = 3$ kg/s.
- **Common trap:** Writing only one independent equation and guessing the rest, or setting the output equal to the known input (ignoring the second feed). Both overall and component (solids) balances are required.

---



## Question 26 - Motor loading and actual input power (Homework, Slide 21)

- **Source wording:** *"A 3-phase 10 kW motor has the name plate details as 415 V, 18.2 amps and 0.9 PF Actual input measurement shows 415 V, 12 A and 0.7 PF which was measured with power analyzer during motor running. Find out the motor loading and actual input power of the motor."* **ANS: 51.2% (Book1- Example 3.9 Pg69)**

- **Given and target:**
  - Nameplate: 10 kW shaft rating, 415 V, 18.2 A, 0.9 PF. Measured running values: 415 V, 12 A, 0.7 PF.
  - Target: actual input power and motor loading (%). The slide gives only the final loading (51.2%) and cites *Book 1, Example 3.9, page 69*; the working below follows that textbook method, which expresses loading as actual input power ÷ rated input power.

- **Governing relation (3-phase AC power):**
$$P_{in} = \sqrt{3}\,V\,I\,\cos\Phi, \qquad \%\,\text{loading} = \frac{P_{in,\,measured}}{P_{in,\,rated}} \times 100$$

- **Step-by-step solution (consistent with the cited example and its printed answer):**
  1. Actual input power:
$$P_{in} = \sqrt{3} \times 415 \times 12 \times 0.7 \approx 6.04\,\text{kW}$$
  2. Rated input power from nameplate:
$$P_{rated,in} = \sqrt{3} \times 415 \times 18.2 \times 0.9 \approx 11.8\,\text{kW}$$
  3. Motor loading:
$$\frac{6.04}{11.8} \times 100 \approx 51.2\%$$

- **Final answer:** Actual input power $\approx 6.04$ kW; motor loading $\approx 51.2\%$ (matches slide answer **51.2%**, Book 1 – Example 3.9, p. 69).

- **Unit or sanity check:** $\sqrt{3}\,V\,I$ yields volt-amperes; multiply by PF for watts ✓. Loading well below 100% is normal for a motor sized with margin; the measured PF (0.7) being lower than nameplate PF (0.9) at partial load is physically consistent.

- **Common trap:** Comparing input power against the 10 kW *shaft* rating (giving ≈ 60%) or comparing currents alone ($12/18.2 = 65.9\%$); neither reproduces the book's 51.2%, which is on the rated *input*-power basis. Also remember the factor $\sqrt{3}$ for 3-phase power.

---

---

## Source-question / slide coverage

| Question(s) | Source slide(s) | Source item(s) / coverage |
|---|---|---|
| 1 | 2–3 | Coal heating loss; worked energy-input/useful/loss calculation |
| 2 | 2–3 | Conveyor coal delivery; worked volumetric and mass-flow calculation |
| 3 | 4 | Reactive-current and power-factor statements |
| 4–5 | 5 | CO₂-equivalent lamp replacement; crystallizer concentration balance |
| 6–7 | 6 | Silicon-panel conversion MCQ; mini-hydropower theoretical power |
| 8–9 | 7–8 | Motor efficiency true/false; resistance-heating water calculation |
| 10 | 9–10 | Unburnt carbon in boiler refuse |
| 11–12 | 11 | Mini-hydropower output; brine-heating electricity |
| 13 | 12–13 | Steam reduction by feed-water preheating; answer-slide working |
| 14 | 13 | Heat-recovery steam saving; question stem unavailable in this excerpt, answer data retained |
| 15 | 14 | Bag-filter dust mass balance |
| 16 | 15–16 | Energy-cost saving: efficient motor versus rewinding |
| 17–18 | 17 | Fixed electricity; water evaporated from moist wood |
| 19–21 | 18 | Drying product weight; DG-set loading; run-of-river hydropower |
| 22–23 | 19 | Lamp daily energy; electric-heater energy at rated/reduced voltage |
| 24 | 20 | Pumping energy for 13,500 kL reservoir duty |
| 25–26 | 21 | Mixer mass balance; three-phase motor loading and measured input power |

All 21 source slides are represented in the question sections or the provenance/coverage records above. Source-stated answers remain identified as source material; derived calculations are worked solutions.

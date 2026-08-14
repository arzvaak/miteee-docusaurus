---
title: "CAT Quant — Profit, Loss and Discount"
exam: "CAT"
section: "quantitative-aptitude"
chapter: 6
topic: "profit-loss-discount"
source: "Quantitative Aptitude Quantum CAT by Sarvesh K. Verma"
---

# Chapter 6: Profit, Loss and Discount — Complete Study Notes

---

## 1. Concept Map

```
                        PROFIT, LOSS & DISCOUNT
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
   BASIC TERMS                 MARKUP & DISCOUNT           ADVANCED FACTORS
        │                           │                           │
  CP, SP, Profit, Loss        MP = CP + Markup            Material Factor
  Overhead Expenses           Discount on MP              Measuring Factor
  Profit% = f(CP)             Successive Discounts        Pricing Factor
        │                           │                           │
        └───────────────────────────┼───────────────────────────┘
                                    │
                        MARGIN FACTOR FRAMEWORK
                        MF = Material × Measuring × Pricing
                        Profit if MF > 1; Loss if MF < 1
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
   SPECIAL CASES               DISHONEST DEALINGS          CAT-LEVEL
        │                           │                           │
  Equal SP, equal %           False balance                Range problems
  CP of m = SP of n           Buying/selling cheat         Chain transactions
  Goods left profit           Mixing impurities            Product constancy
```

---

## 2. Foundations — Terminology and Basic Formulae

### 2.1 Supply Chain Flow

**Manufacturer → Wholesaler (Dealer) → Retailer (Shopkeeper) → Customer**

Each intermediary buys at one price and sells at a higher price to earn profit.

### 2.2 Core Definitions

| Term | Meaning |
|---|---|
| **Cost Price (CP)** | Money paid by the shopkeeper to buy goods |
| **Overhead Expenses** | Additional costs: transportation, labour, commission — **added to CP** |
| **Selling Price (SP)** | Price at which the shopkeeper sells goods |
| **Profit** | SP > CP → Profit = SP − CP |
| **Loss** | CP > SP → Loss = CP − SP |
| **Marked Price (MP)** | CP + Markup (also called printed/list price) |
| **Discount** | Calculated on MP; SP = MP − Discount |

### 2.3 Important Formulae (Source: PDF p. 329)

Let $P$ = Profit, $L$ = Loss, $p\%$ = Profit percentage, $l\%$ = Loss percentage.

1. **Profit** = SP − CP
2. **Loss** = CP − SP
3. **Profit %** = $\dfrac{\text{Profit}}{\text{CP}} \times 100$
4. **Loss %** = $\dfrac{\text{Loss}}{\text{CP}} \times 100$
5. **SP** = $\dfrac{100 + p\%}{100} \times \text{CP}$ = $\dfrac{100 - l\%}{100} \times \text{CP}$
6. **CP** = $\dfrac{100}{100 + p\%} \times \text{SP}$ = $\dfrac{100}{100 - l\%} \times \text{SP}$
7. **SP** = $(100 + k)\%$ of CP, when profit = $k\%$ of CP
8. **SP** = $(100 - k)\%$ of CP, when loss = $k\%$ of CP

> **CRITICAL NOTE:** Profit or loss is **always calculated on CP** unless otherwise stated.

---

## 3. Worked Examples — Basic Level

### Example 1 (PDF p. 329)
A fruit seller buys 300 oranges at 5 for ₹8 and sells them at 2 for ₹5. Find total profit.

**Solution:**
- CP per orange = $\dfrac{8}{5}$ = ₹1.60
- SP per orange = $\dfrac{5}{2}$ = ₹2.50
- Profit per orange = 2.50 − 1.60 = ₹0.90
- **Total profit** = 0.90 × 300 = **₹270**

### Example 2 (PDF p. 329)
A shopkeeper buys 100 eggs at ₹1.20/piece; 4 are spoiled. He sells the remaining at ₹15/dozen. Find profit/loss.

**Solution:**
- CP = 100 × 1.2 = ₹120
- SP per egg = $\dfrac{15}{12}$ = ₹1.25
- SP of 96 eggs = 96 × 1.25 = ₹120
- **Result: No profit, no loss** (SP = CP)

### Example 3 (PDF p. 329)
A computer purchased for ₹47,000 is sold for ₹45,800. Find loss %.

**Solution:**
$$\text{Loss \%} = \frac{47000 - 45800}{47000} \times 100 = \frac{1200}{47000} \times 100 = 2\frac{26}{47}\%$$

### Example 4 (PDF p. 329)
600 quintals of sugar at ₹1600/quintal, sold at 7% profit. Find SP.

**Solution:**
- CP = 1600 × 600 = ₹9,60,000
- Profit = 9,60,000 × $\dfrac{7}{100}$ = ₹67,200
- **SP** = 9,60,000 + 67,200 = **₹10,27,200**

### Example 5 (PDF p. 329)
200 quintals wheat at ₹1200/quintal; ₹10,000 transport; sold at ₹13/kg. Find profit %.

**Solution:**
- CP = 2,40,000 + 10,000 = ₹2,50,000 (including overheads)
- SP = 13 × 200 × 100 = ₹2,60,000
- Profit = ₹10,000
- **Profit %** = $\dfrac{10,000}{2,50,000} \times 100$ = **4%**

### Example 6 (PDF p. 329)
Sold at ₹220 at 12% loss. Find CP.

**Solution:**
- 220 = 88% of CP
- **CP** = $\dfrac{220}{0.88}$ = **₹250**

### Example 7 (PDF p. 329)
TV sold at ₹23,520 at 4% loss. What price for 8% gain?

**Solution:**
- CP = $23520 \times \dfrac{100}{96}$ = ₹24,500
- For 8% gain: SP = $\dfrac{108}{100} \times 24500$ = **₹26,460**

---

## 4. Markup and Discount

### 4.1 Key Relationships

- **Markup** is calculated on **CP**
- **Discount** is calculated on **MP**
- **SP = MP − Discount**

**Price relationships:**
- CP < SP < MP → profit
- CP = SP < MP → no profit, no loss
- SP < CP < MP → loss

### 4.2 Worked Examples

**Example 8 (PDF p. 330):** CP = ₹300, markup 20% → MP = 300 × 1.2 = **₹360**

**Example 9 (PDF p. 330):** MP = ₹450, markup 12.5% → CP = ?

**Smart approach:** 12.5% = $\dfrac{1}{8}$; CP is $\dfrac{1}{9}$ less than MP
$$\text{CP} = 450 \times \frac{8}{9} = \textbf{₹400}$$

**Example 10 (PDF p. 330):** MP = ₹660, discount 10% → SP = 660 × 0.9 = **₹594**

**Example 11 (PDF p. 330):** Markup 50%, discount 20% → Profit = ?
- MP = 150% of CP
- SP = 80% of MP = 0.8 × 1.5 × CP = 1.2 × CP
- **Profit = 20%**

**Example 12 (PDF p. 330):** Markup 10%, discount 10% → ?
- 100 → 110 → 99
- **Loss of 1%**

**Example 13 (PDF p. 330):** Successive discounts 10% and 5% → Equivalent single discount?
- 100 × 0.9 × 0.95 = 85.5
- **Discount = 14.5%**
- **Note:** Order of successive discounts doesn't matter

### 4.3 Successive Discount Formula

For successive discounts $d_1\%$ and $d_2\%$:
$$\text{Net Discount} = d_1 + d_2 - \frac{d_1 \times d_2}{100}$$

For three successive discounts $d_1, d_2, d_3$:
$$\text{SP} = \text{MP} \times \left(1 - \frac{d_1}{100}\right)\left(1 - \frac{d_2}{100}\right)\left(1 - \frac{d_3}{100}\right)$$

---

## 5. Common Gain or Loss Concept

### 5.1 The Rule

> **When two articles are sold at the same SP, one at profit $p\%$ and the other at loss $p\%$:**
> - **Always a loss**
> - **Loss % = $\left(\dfrac{p}{10}\right)^2$**

### 5.2 Worked Examples

**Example 14 (PDF p. 331):** Two watches sold at ₹200 each; one at 10% profit, one at 10% loss.

**Solution:**
- Loss % = $\left(\dfrac{10}{10}\right)^2$ = 1%
- Total SP = ₹400; 400 = 99% of CP → CP = ₹404.04
- **Loss = ₹4.04**

**Example 15 (PDF p. 331):** Sum of CPs = ₹500; one sold at 20% profit, other at 20% loss; SPs equal.

**Solution:**
- $x \times \dfrac{120}{100} = (500 - x) \times \dfrac{80}{100}$ → $x = 200$
- CP of profit article = ₹200; CP of loss article = ₹300
- Common SP = ₹240 each
- **Loss = 500 − 480 = ₹20**

---

## 6. Selling Price and Cost Price Equality

### 6.1 Case 1: CP of m articles = SP of n articles

**Example 16 (PDF p. 332):** CP of 15 apples = SP of 20 apples.
- $\dfrac{\text{CP}}{\text{SP}} = \dfrac{4}{3}$ → CP > SP → Loss
- **Loss %** = $\dfrac{4-3}{4} \times 100$ = **25%**

**Example 17 (PDF p. 332):** SP of 10 CDs = CP of 12 CDs.
- $\dfrac{\text{SP}}{\text{CP}} = \dfrac{12}{10} = \dfrac{6}{5}$ → Profit
- **Profit %** = $\dfrac{6-5}{5} \times 100$ = **20%**

### 6.2 Case 2: Articles sold at CP but quantity differs

**Formula:**
$$\text{Profit \%} = \frac{\text{Goods left}}{\text{Goods sold}} \times 100 = \frac{m - n}{n} \times 100$$

**Example 18 (PDF p. 332):** Selling 12 oranges gets CP of 15 oranges.
- **Profit %** = $\dfrac{15-12}{12} \times 100$ = **25%**

**Example 19 (PDF p. 332):** By selling 8 bananas, gains SP of 1 banana.
- SP of 8 = ₹8; Profit = ₹1; CP = 7
- **Profit %** = $\dfrac{1}{7} \times 100$ = **$14\frac{2}{7}\%$**

**Example 20 (PDF p. 332):** By selling 18 chocolates, loses SP of 2 chocolates.
- SP of 18 = ₹18; Loss = ₹2; CP = 20
- **Loss %** = $\dfrac{2}{20} \times 100$ = **10%**

**Example 21 (PDF p. 332):** Trader sells at CP but gives 10% less quantity.
- **Profit %** = $\dfrac{10}{90} \times 100$ = **$11\frac{1}{9}\%$**

**Example 22 (PDF p. 332):** False balance — defrauds 10% in buying and 10% in selling.
- Effective CP = $\dfrac{100}{110} = \dfrac{10}{11}$
- Effective SP = $\dfrac{100}{90} = \dfrac{10}{9}$
- **Gain %** = $\dfrac{\frac{10}{9} - \frac{10}{11}}{\frac{10}{11}} \times 100$ = **$22\frac{2}{9}\%$**

---

## 7. The Margin Factor Framework (PDF p. 334–343)

This is the **most powerful framework** for solving complex profit-loss problems.

### 7.1 Core Framework

$$\text{Margin Factor (MF)} = \frac{\text{SP}}{\text{CP}} = \frac{\text{Value received from buyer}}{\text{Value given to seller}}$$

$$\text{CP} \times \text{Material Factor} \times \text{Measuring Factor} \times \text{Pricing Factor} = \text{SP}$$

$$\text{MF} = \text{Material Factor} \times \text{Measuring Factor} \times \text{Pricing Factor}$$

**Decision Rules:**
- **Profit** if MF > 1
- **Loss** if MF < 1
- **No profit/loss** if MF = 1
- **Profit Factor** = MF − 1
- **Loss Factor** = 1 − MF
- Profit % = Profit Factor × 100; Loss % = Loss Factor × 100

### 7.2 Factor Definitions

**Pricing Factor:**
- Markup Factor = $\dfrac{\text{MP}}{\text{CP}} = 1 + \dfrac{\text{markup\%}}{100}$
- Discounting Factor = $\dfrac{\text{SP}}{\text{MP}} = 1 - \dfrac{\text{discount\%}}{100}$
- Margin Factor = Markup Factor × Discounting Factor

**Measuring Factor (Seller's):**
$$\text{Measuring Factor} = \frac{\text{Display Quantity}}{\text{Actual Quantity}} = \frac{\text{Value received from buyer}}{\text{Value given to seller}}$$

**Measuring Factor (Buyer's):**
$$\text{Measuring Factor} = \frac{\text{Actual Quantity}}{\text{Display Quantity}}$$

**Material Factor:**
$$\text{Material Factor} = \frac{\text{Value received from buyer}}{\text{Value given to seller}}$$

> **Note:** Impurity added by the supplier doesn't affect the trader's profit (Examples 55–56).

---

## 8. Worked Examples — Factor Framework

### 8.1 Pricing Manipulation

**Example 23 (PDF p. 335):** Markup 20%, no discount → Profit = ?
- MF = 1.2; PF = 0.2 → **Profit = 20%**

**Example 24 (PDF p. 335):** Markup 20%, discount 10% → Profit = ?
- MF = 1.2 × 0.9 = 1.08; PF = 0.08 → **Profit = 8%**

### 8.2 Measurement Manipulation

**Example 25 (PDF p. 336):** Balance displays 25% more weight; sells at CP → Profit = ?
- MF = $\dfrac{125}{100}$ = 1.25 → **Profit = 25%**

**Example 26 (PDF p. 336):** Balance weighs 25% less; sells at CP → Profit = ?
- MF = $\dfrac{100}{75}$ = 1.3333 → **Profit = 33.33%**

**Example 27 (PDF p. 336):** Balance weighs 20% less; markup 60% → Profit = ?
- MF = $\dfrac{100}{80} \times 1.6$ = 2 → **Profit = 100%**

**Example 28 (PDF p. 336):** Balance weighs 20% less; discount 10% → Profit = ?
- MF = $\dfrac{100}{80} \times 0.9$ = 1.125 → **Profit = 12.5%**

**Example 29 (PDF p. 336):** Balance weighs 30% less; markup 16.67%; discount 10% → Profit = ?
- MF = $\dfrac{100}{70} \times \dfrac{7}{6} \times 0.9$ = 1.5 → **Profit = 50%**

### 8.3 Reverse Problems

**Example 30 (PDF p. 337):** 25% profit with faulty balance at CP → Balance weighs how much less?
- MF = 1.25 = $\dfrac{\text{Display}}{\text{Actual}}$
- Required % = $\dfrac{125-100}{125} \times 100$ = **20% less**

**Example 31 (PDF p. 337):** Balance weighs 20% less; wants 50% profit → Markup = ?
- 1.5 = $\dfrac{100}{80} \times \text{Markup Factor}$
- Markup Factor = 1.2 → **Markup = 20%**

**Example 32 (PDF p. 337):** 40% profit with 20% markup → Balance weighs how much less?
- 1.4 = MF × 1.2 → MF = $\dfrac{7}{6}$
- Required % = $\dfrac{7-6}{7} \times 100$ = **14.28% less**

**Example 33 (PDF p. 337):** Balance weighs 20% less; wants 10% profit → Max discount = ?
- 1.1 = $\dfrac{100}{80} \times \text{DF}$ → DF = 0.88 → **Discount = 12%**

**Example 34 (PDF p. 337):** 20% profit with 30% discount → Balance weighs how much less?
- 1.2 = MF × 0.7 → MF = $\dfrac{12}{7}$
- Required % = $\dfrac{12-7}{12} \times 100$ = **41.67% less**

**Example 35 (PDF p. 337):** Balance weighs 20% less; wants 30% profit with 20% markup → Max discount = ?
- 1.3 = $\dfrac{100}{80} \times 1.2 \times \text{DF}$ → DF = $\dfrac{13}{15}$ → **Discount = 13.33%**

**Example 36 (PDF p. 337):** Balance weighs 20% less; wants 25% profit with 50% discount → Markup = ?
- 1.25 = $\dfrac{100}{80} \times \text{MF} \times 0.5$ → MF = 2 → **Markup = 100%**

**Example 37 (PDF p. 337):** Markup 40%, discount 26.67%, wants 120% profit → Balance displays how much more?
- 2.2 = MF × 1.4 × $\dfrac{73.33}{100}$ → MF = $\dfrac{15}{7}$
- Required % = $\dfrac{15-7}{7} \times 100$ = **114.28% more**

### 8.4 Combined Buying & Selling Manipulation

**Example 38 (PDF p. 338):** Gets 20% more while buying; gives 20% less while selling; sells at CP → Profit = ?
- MF = $\dfrac{120}{100} \times \dfrac{100}{80}$ = 1.5 → **Profit = 50%**

**Example 39 (PDF p. 338):** Gets $x\%$ more while buying; gives 40% less while selling; sells at CP; 100% profit → $x$ = ?
- 2 = $\dfrac{100+x}{100} \times \dfrac{100}{60}$ → $x$ = **20**

**Example 40 (PDF p. 338):** Gets 20% more while buying; gives $x\%$ less while selling; sells at CP; 33.33% profit → $x$ = ?
- 1.3333 = $\dfrac{120}{100} \times \dfrac{100}{100-x}$ → $x$ = **10**

**Example 41 (PDF p. 338):** Gets 20% more buying; gives 20% less selling; markup 33.33% → Profit = ?
- MF = $\dfrac{120}{100} \times \dfrac{100}{80} \times \dfrac{133.33}{100}$ = 2 → **Profit = 100%**

**Example 42 (PDF p. 338):** Gets 20% more buying; gives 10% less selling; 60% profit → Markup = ?
- 1.6 = $\dfrac{120}{100} \times \dfrac{100}{90} \times \text{MF}$ → MF = 1.2 → **Markup = 20%**

**Example 43 (PDF p. 338):** Gets $x\%$ more buying; gives 20% less selling; markup 20%; 50% profit → $x$ = ?
- 1.5 = $\dfrac{100+x}{100} \times \dfrac{100}{80} \times 1.2$ → $x$ = **0**

**Example 44 (PDF p. 338):** Gets 5% more buying; gives $x\%$ less selling; markup 14.28%; 100% profit → $x$ = ?
- 2 = $\dfrac{105}{100} \times \dfrac{100}{100-x} \times \dfrac{114.28}{100}$ → $x$ = **40**

**Example 45 (PDF p. 338):** Gets 4% more buying; gives 13.33% less selling; discount 16.67% → Profit = ?
- MF = $\dfrac{104}{100} \times \dfrac{100}{86.67} \times \dfrac{83.33}{100}$ = 1 → **Profit = 0%**

**Example 46 (PDF p. 338):** Gets 8% more buying; gives 10% less selling; 28.56% profit → Min markup = ?
- MF × DF = $\dfrac{15}{14}$ > 1 → markup needed
- Min markup = $\dfrac{1}{14}$ = **7.14%**

**Example 47 (PDF p. 338):** Gets 25% more buying; gives 25% less selling; 16.67% profit → Min discount = ?
- MF × DF = $\dfrac{7}{10}$ < 1 → discount needed
- Min discount = $\dfrac{3}{10}$ = **30%**

**Example 48 (PDF p. 338):** Gets 15% more buying; gives 8% less selling; markup 20%; discount 42.84% → Loss = ?
- MF = $\dfrac{115}{100} \times \dfrac{100}{92} \times \dfrac{6}{5} \times \dfrac{4}{7}$ = $\dfrac{6}{7}$ < 1 → **Loss = 14.28%**

**Example 49 (PDF p. 338):** Trader steals 4/dozen from farmer; customers steal 2/dozen from trader; sells at farmer's price → Profit = ?
- MF = $\dfrac{16}{12} \times \dfrac{12}{14}$ = $\dfrac{8}{7}$ → **Profit = 14.28%**

---

## 9. Quality Manipulation (Mixing Impurities)

**Example 52 (PDF p. 341):** Water = 20% of milk; sells at 20% discount → Loss = ?
- MF = $\dfrac{120}{100} \times \dfrac{80}{100}$ = $\dfrac{96}{100}$ → **Loss = 4%**

**Example 53 (PDF p. 341):** 2L water + 8L milk; gives 10% less; markup 20% → Profit = ?
- MF = $\dfrac{10}{8} \times \dfrac{100}{90} \times \dfrac{120}{100}$ = $\dfrac{5}{3}$ → **Profit = 66.67%**

**Example 54 (PDF p. 341):** 2L kerosene + 8L petrol; kerosene 25% cheaper; gives 10% less; markup 71% → Profit = ?
- MF = $\dfrac{10 \times 100}{8 \times 100 + 2 \times 75} \times \dfrac{100}{90} \times \dfrac{171}{100}$ = 2 → **Profit = 100%**

**Example 55 (PDF p. 341):** Farmer adds 1L water/9L milk; milkman adds 2L water/10L; sells at CP → Profit = ?
- MF = $\dfrac{12}{10}$ = 1.2 → **Profit = 20%**
- **Note:** Supplier's impurity doesn't affect trader's profit

**Example 56 (PDF p. 341):** Farmer adds 3L water/7L milk; milkman adds 5L water/15L; sells at CP → Profit = ?
- MF = $\dfrac{20}{15}$ = 1.33 → **Profit = 33.33%**

**Example 57 (PDF p. 341):** Farmer adds 3L water/7L milk; milkman pays 40% less; adds 3L water/15L; sells at usual price → Profit = ?
- MF = $\dfrac{18}{15} \times \dfrac{100}{60}$ = 2 → **Profit = 100%**

**Example 58 (PDF p. 341):** Same as 57 but sells at 50% higher → Profit = ?
- MF = $\dfrac{18}{15} \times \dfrac{150}{60}$ = 3 → **Profit = 200%**

**Example 59 (PDF p. 341):** Farmer gives 25% extra at same price; milkman adds 3L water/15L; sells at 50% higher → Profit = ?
- MF = $\dfrac{125}{100} \times \dfrac{18}{15} \times \dfrac{150}{100}$ = 2.25 → **Profit = 125%**

**Example 60 (PDF p. 341):** Company adds 1L kerosene/9L petrol; gives 10% less; dealer adds 2L kerosene/8L; gives 10% extra; markup 10%; kerosene 50% cheaper → Profit = ?
- MF = $\dfrac{10 \times 100}{8 \times 100 + 2 \times 50} \times \dfrac{90}{100} \times \dfrac{100}{110} \times \dfrac{110}{100}$ = 1 → **Profit = 0%**

**Example 61 (PDF p. 341):** Company adds 3L kerosene/7L petrol; gives 10% less; charges 20% less; dealer adds 2L kerosene/10L; gives 10% extra; markup 10%; kerosene 50% cheaper → Profit = ?
- MF = $\dfrac{10 \times 100}{8 \times 100 + 2 \times 50} \times \dfrac{90}{100} \times \dfrac{100}{110} \times \dfrac{100}{80} \times \dfrac{110}{100}$ = $\dfrac{5}{4}$ → **Profit = 25%**

---

## 10. Advanced Pricing Problems — Range Problems

**Example 50 (PDF p. 340):** Watch CP ₹2000, MP ₹3120; three successive discounts $x\%, y\%, z\%$ with $x+y+z = 37.5$. Find range of profit.

**Solution:**
- CP = 100 → MP = 156
- **Case I:** $x=0, y=0, z=37.5$ → SP = $156 \times \dfrac{62.5}{100}$ = 97.5 → Loss
- **Case II:** $x=y=z=12.5$ → SP = $156 \times \left(\dfrac{87.5}{100}\right)^3$ = 104.5 → Profit 4.5%
- **Range: −2.5 < p < 4.5**

**Example 51 (PDF p. 340):** Bicycle CP ₹40,000, MP ₹100,000; two discounts $x\%, y\%$ with $xy = 25$, $x,y \geq 1$. Find range of profit.

**Solution:**
- CP = 100 → MP = 250
- **Case I:** $x=1, y=25$ → SP = $250 \times 0.99 \times 0.75$ = 185.625 → Profit 85.625%
- **Case II:** $x=y=5$ → SP = $250 \times 0.95 \times 0.95$ = 225.625 → Profit 125.625%
- **Range: 85.625 ≤ p ≤ 125.625**

---

## 11. CAT-Level Worked Examples

### 11.1 Profit on SP vs CP

**Q54 (Level 01):** Same SP ₹1800, same profit 20%, but A calculates profit on SP while B calculates on CP. Find difference.

**Solution:**
- Profit of A = $1800 \times \dfrac{20}{100}$ = ₹360
- CP of B = $\dfrac{1800}{1.2}$ = ₹1500
- Profit of B = 1800 − 1500 = ₹300
- **Difference = ₹60**

> **Trap:** When profit is calculated on SP, the profit amount is larger than when calculated on CP for the same percentage.

### 11.2 Loss to Gain Conversion

**Q56 (Level 01):** Sold at 5% loss; increasing SP by ₹65 gives 3.33% gain. Find new profit % if sold at ₹936.

**Solution:**
- 103.33% of CP − 95% of CP = 65
- 8.33% of CP = 65 → CP = ₹780
- New profit % = $\dfrac{936 - 780}{780} \times 100$ = **20%**

### 11.3 Successive Water Additions

**Q58 (Level 01):** Milkman adds 10% water twice successively. Find profit %.

**Solution:**
- Start: 100L milk
- After 1st addition: 110L mixture
- After 2nd addition: 121L mixture
- **Profit %** = $\dfrac{21}{100} \times 100$ = **21%**

> **Trap:** Successive additions are NOT additive (10% + 10% ≠ 20%).

### 11.4 Faulty Balance — Wholesaler

**Q62 (Level 01):** Balance reads 1200g for 1000g; trader marks up 20%. Find profit.

**Solution:**
- CP = ₹1/g: pays ₹1200 for 1000g
- Sells at 20% profit: obtains ₹1200 for 1000g
- **No profit, no loss**

> **Key insight:** The 20% markup exactly compensates for the 20% extra weight received.

### 11.5 Product Constancy

**Q68 (Level 01):** 25% price reduction allows 4 more oranges for ₹16. Find original price.

**Solution (Product Constancy):**
- 25% ↓ = $\dfrac{1}{4}$ decrease → $\dfrac{1}{3}$ = 33.33% increase in quantity
- 33.33% = 4 oranges → Original = 12 oranges
- Original price = $\dfrac{16}{12}$ = **₹1.33**

**Q69 (Level 01):** 20% price reduction allows 6 kg more for ₹240. Find original price.

**Solution:**
- 20% ↓ = $\dfrac{1}{5}$ decrease → $\dfrac{1}{4}$ = 25% increase in quantity
- 25% = 6 kg → Original = 24 kg
- Original price = $\dfrac{240}{24}$ = **₹10 per kg**

### 11.6 Chain of Transactions

**Q7 (Level 02):** Anna→Boney (20% profit), Boney→Chakori (10% profit), Chakori→Mechanic (9.09% loss), Mechanic→Anna (8.33% profit after 10% repair cost). Find Anna's loss %.

**Solution:**
- CP → 100 → 120 → 132 → 120 → 143
- Loss of Anna = 143 − 120 = 23
- **Loss % = 23%**

### 11.7 Comprehensive Cheating

**Q38 (Level 02):** 20% discount purchase, 20% extra weight, 80% markup, 25% discount, 10% less weight. Find profit %.

**Solution:**
- CP = $\dfrac{80}{120} = \dfrac{2}{3}$
- SP = $\dfrac{135}{90} = \dfrac{3}{2}$
- **Profit %** = $\dfrac{\frac{3}{2} - \frac{2}{3}}{\frac{2}{3}} \times 100$ = **125%**

### 11.8 Milk-Water Replacement

**Q43 (Level 02):** 16.66% water initially, replaced to 2:1 milk:water ratio. Find profit %.

**Solution:**
- 100L milk + 20L water = 120L mixture
- Replacement: $\dfrac{80}{120} = \dfrac{100}{120}\left(1 - \dfrac{K}{120}\right)$ → K = 24L
- Total SP = 120×1 + 24×2 = 168
- CP = 100
- **Profit = 68%**

---

## 12. Decision Rules and Fast CAT Methods

### 12.1 Quick Decision Framework

| Situation | Action |
|---|---|
| Profit/loss % asked | Always on CP unless stated otherwise |
| Markup % asked | Always on CP |
| Discount % asked | Always on MP |
| Equal SP, equal profit/loss % | **Always loss** = $\left(\dfrac{p}{10}\right)^2$ |
| CP of m = SP of n | Compare CP/SP ratio directly |
| Successive discounts | Order doesn't matter; multiply factors |
| Supplier's impurity | Doesn't affect trader's profit |
| MF > 1 | Profit |
| MF < 1 | Loss |
| MF = 1 | No profit, no loss |

### 12.2 Fast CAT Methods

**Method 1: Assume CP = 100**
For most percentage problems, set CP = 100 and work with integers.

**Method 2: Fraction Equivalents**
- 12.5% = $\dfrac{1}{8}$
- 16.67% = $\dfrac{1}{6}$
- 14.28% = $\dfrac{1}{7}$
- 33.33% = $\dfrac{1}{3}$
- 66.67% = $\dfrac{2}{3}$

**Method 3: Margin Factor Chain**
For complex problems, multiply all factors:
$$\text{MF} = \text{Material} \times \text{Measuring} \times \text{Pricing}$$

**Method 4: Product Constancy**
When price changes and total expenditure is constant:
$$\text{New Quantity} = \text{Old Quantity} \times \frac{100}{100 \pm \text{price change \%}}$$

**Method 5: Equate Money or Weight**
In cheating problems, always equate either money or weight for simple solution.

**Method 6: Percentage Change Graphic**
For increase/decrease chains, use the visual: CP → +32% → SP → +12% → MP

---

## 13. Common Traps

1. **Profit/loss always on CP** unless stated otherwise
2. **Markup on CP; discount on MP**
3. **Equal SP with equal profit/loss % → always loss** = $\left(\dfrac{p}{10}\right)^2$
4. **Successive discounts:** order doesn't matter
5. **Supplier's impurity doesn't affect trader's profit** (Examples 55–56)
6. **Successive additions are NOT additive** (10% + 10% ≠ 20%)
7. **Profit on SP ≠ Profit on CP** for same percentage
8. **15% single discount ≠ 10% + 5% successive** (14.5% vs 15%)
9. **Always equate money or weight** in cheating problems
10. **Overhead expenses must be added to CP**

---

## 14. Timed Strategy for CAT

### 14.1 Time Allocation

| Problem Type | Time Budget |
|---|---|
| Basic CP/SP/profit/loss | 30–45 seconds |
| Markup/discount | 45–60 seconds |
| Successive discounts | 45–60 seconds |
| Equal SP problems | 60–90 seconds |
| Factor framework problems | 60–90 seconds |
| Range problems | 90–120 seconds |
| Chain transactions | 90–120 seconds |

### 14.2 Strategy by Difficulty

**Easy (1 mark):** Direct formula application
- Identify CP, SP, profit/loss %
- Apply formula directly

**Medium (2 marks):** One manipulation
- Identify the manipulation (markup, discount, false weight)
- Apply factor framework

**Hard (3 marks):** Multiple manipulations
- Break into factors
- Multiply all factors
- Convert to profit/loss %

### 14.3 Elimination Strategy

- If answer involves a loss when two equal SPs with equal % → always loss
- If MF > 1 → profit; MF < 1 → loss
- Check extreme cases for range problems
- Verify with CP = 100 assumption

---

## 15. Final Revision Sheet

### 15.1 Core Formulae

| Formula | Expression |
|---|---|
| Profit | SP − CP |
| Loss | CP − SP |
| Profit % | $\dfrac{\text{Profit}}{\text{CP}} \times 100$ |
| Loss % | $\dfrac{\text{Loss}}{\text{CP}} \times 100$ |
| SP (profit) | $\dfrac{100 + p\%}{100} \times \text{CP}$ |
| SP (loss) | $\dfrac{100 - l\%}{100} \times \text{CP}$ |
| CP (profit) | $\dfrac{100}{100 + p\%} \times \text{SP}$ |
| CP (loss) | $\dfrac{100}{100 - l\%} \times \text{SP}$ |
| Equal SP, equal % | Loss % = $\left(\dfrac{p}{10}\right)^2$ |
| Goods left profit | $\dfrac{\text{Goods left}}{\text{Goods sold}} \times 100$ |

### 15.2 Factor Framework Summary

$$\text{MF} = \text{Material Factor} \times \text{Measuring Factor} \times \text{Pricing Factor}$$

- **Material Factor** = $\dfrac{\text{Value received}}{\text{Value given}}$ (for impurities)
- **Measuring Factor** = $\dfrac{\text{Display Quantity}}{\text{Actual Quantity}}$ (for false weights)
- **Pricing Factor** = Markup Factor × Discounting Factor

### 15.3 Key Percentages to Memorize

| Fraction | Percentage |
|---|---|
| $\dfrac{1}{3}$ | 33.33% |
| $\dfrac{1}{6}$ | 16.67% |
| $\dfrac{1}{7}$ | 14.28% |
| $\dfrac{1}{8}$ | 12.5% |
| $\dfrac{1}{9}$ | 11.11% |
| $\dfrac{1}{12}$ | 8.33% |

### 15.4 Quick Reference — Common Scenarios

| Scenario | Result |
|---|---|
| Markup 20%, discount 20% | Loss 4% |
| Markup 25%, discount 20% | No profit, no loss |
| Markup 50%, discount 20% | Profit 20% |
| Markup 10%, discount 10% | Loss 1% |
| Two articles same SP, both at $p\%$ | Loss $\left(\dfrac{p}{10}\right)^2$ |
| Sells at CP, gives $x\%$ less | Profit $\dfrac{x}{100-x} \times 100$ |
| Buys $x\%$ more, sells $y\%$ less | Profit $\dfrac{x+y}{100-y} \times 100$ |

---

## 16. Practice Bank Reference

For extensive practice, refer to:
- **Introductory Exercise 6.1** (PDF p. 330) — Basic CP/SP problems
- **Introductory Exercise 6.2** (PDF p. 333) — Markup/discount problems
- **CAT-Test Level 01** (PDF p. 344–347) — Q1–53
- **CAT-Test Level 01** (PDF p. 348) — Q54–70
- **CAT-Test Level 02** (PDF p. 348–351) — Q1–45

**Answer Keys:**
- Level 01 (Q1–53): 1(a), 2(a), 3(b), 4(c), 5(c), 6(d), 7(d), 8(b), 9(a), 10(c), 11(a), 12(d), 13(d), 14(d), 15(c), 16(d), 17(d), 18(b), 19(d), 20(a), 21(d), 22(c), 23(c), 24(b), 25(c), 26(a), 27(b), 28(b), 29(d), 30(d), 31(b), 32(b), 33(a), 34(a), 35(c), 36(d), 37(c), 38(c), 39(c), 40(b), 41(c), 42(b), 43(a), 44(c), 45(b), 46(b), 47(c), 48(c), 49(b), 50(d), 51(b), 52(a), 53(c)
- Level 01 (Q54–70): 54(b), 55(a), 56(c), 57(c), 58(c), 59(a), 60(a), 61(b), 62(c), 63(b), 64(c), 65(a), 66(b), 67(c), 68(b), 69(a), 70(d)
- Level 02: 1(b), 2(c), 3(c), 4(a), 5(d), 6(d), 7(a), 8(a), 9(c), 10(a), 11(c), 12(c), 13(b), 14(c), 15(c), 16(d), 17(a), 18(b), 19(b), 20(b), 21(d), 22(a), 23(b), 24(b), 25(a), 26(b), 27(a), 28(c), 29(b), 30(b), 31(c), 32(b), 33(c), 34(b), 35(c), 36(a), 37(a), 38(a), 39(a), 40(b), 41(c), 42(c), 43(a), 44(b), 45(a)

---

*End of Chapter 6 Study Notes*

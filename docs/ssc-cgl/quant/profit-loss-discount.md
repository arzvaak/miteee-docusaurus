---
title: Profit, Loss, and Discount
description: Deep SSC CGL Tier-I Quant note for profit, loss, marked price, discount, and changed-base traps.
tags: [ssc-cgl, quant, profit-loss, deepseek-authored]
generated_by: deepseek
review_status: ai-authored-needs-agent-review
---
## Concept Ladder

**36-second Quant scoring bar**  
Profit, loss, and discount must be handled as 36-second multiplier questions. Use 5 seconds to identify CP, SP, MP, and discount base; 20-25 seconds for the multiplier chain; and the final seconds to verify whether the question asks profit percent, loss percent, marked price, selling price, or equivalent discount.

![Profit loss discount multiplier map](/img/ssc-cgl/profit-loss-discount-map.svg)

### Corpus Pressure

The uploaded book-PYQ corpus marks `profit-loss-discount` as a 200/200 dominant-repeat Quant topic with 664 promoted questions. The largest subtopic is direct Profit and Loss with 223 questions, followed by dense Maths book page clusters: 202 questions from p0521-p0540, 113 from p0481-p0500, 70 from p0321-p0340, and 33 direct Discount questions. This is a daily-practice chapter for a 50/50 Maths target.

| Corpus signal | What it demands | 36-second implication |
|---:|---|---|
| 664 promoted questions | Basic P/L, discount, markup, false weight, overheads, and two-article variants | Every standard pattern needs a fixed multiplier response |
| 223 direct Profit and Loss rows | CP/SP base recognition is repeatedly tested | CP must be identified before touching percentages |
| 33 direct Discount rows plus mixed markup rows | MP and discount base traps are frequent | Discount is on MP unless a different base is explicitly stated |
| False-weight and trader wording | Dealer questions hide base changes | Claim/given weight must become automatic |
| Heavy arithmetic overlap | This chapter uses percentage, ratio, and unit conversion | Weakness here leaks into percentage and DI accuracy |

### First 5-Second Classification

| Wording seen | Bucket | First move |
|---|---|---|
| "bought for", "sold for" | Basic CP/SP | Difference over CP |
| "sold at x% profit/loss" | Multiplier | Profit: 1+x/100, loss: 1-x/100 |
| "marked price/list price" | MP/discount | Discount applies to MP |
| "successive discounts" | Product chain | Multiply discount multipliers |
| "marked x% above CP, discount y%" | Markup-discount chain | Let CP=100 |
| "uses 800 g instead of 1 kg" | False weight | Profit from claim/given weight |
| "transport, repair, overhead, packing" | Effective CP | Add all extra costs before profit |
| "same selling price, one profit one loss" | Two-article trap | Compute total CP, not average percent |

**Step 1: First Principles (Cost, Selling, Marked Price)**
- **Cost Price (CP)**: Amount paid to acquire the article (includes purchase price, transport, overheads).
- **Selling Price (SP)**: Amount received from the customer.
- **Marked Price (MP)**: Label price / list price. Discount is always given on MP.
- **Profit** = SP - CP (when SP > CP)
- **Loss** = CP - SP (when SP < CP)
- **Profit Percent** = (Profit / CP) * 100%   (Base = CP always)
- **Loss Percent** = (Loss / CP) * 100%
- **Discount** = MP - SP
- **Discount Percent** = (Discount / MP) * 100%   (Base = MP)

**Step 2: Base Invariance Rule**
- Profit and loss percentages are always with reference to CP.  
- Discount percentage is always with reference to MP.  
- Mixing bases is the single most common trap.

**Step 3: Multiplier Method (Unified Approach)**
Every percent change (profit, loss, discount) can be expressed as a multiplier.
- Profit of r% => SP = CP * (1 + r/100)   [Multiplier = 1 + r/100]
- Loss of r% => SP = CP * (1 - r/100)    [Multiplier = 1 - r/100]
- Discount of d% on MP => SP = MP * (1 - d/100) [Multiplier = 1 - d/100]
- Overall effect of multiple changes = product of all multipliers.

**Step 4: Successive Discounts**
- Two discounts d1% and d2%: Single equivalent discount = (d1 + d2 - d1*d2/100)%.  
- Use multipliers: SP = MP * (1-d1/100)*(1-d2/100). Overall discount = 1 - (product of (1-d/100)) * 100%.

**Step 5: Dishonest Dealer / False Weight**
- When a seller uses a false weight (e.g., claims 1000 g but gives 900 g), the gain is on the difference.
- Two interpretations:
  1. **Profit on CP of the weight given**: If cost of 1000 g is CP, and he sells 900 g as 1000 g, his effective CP = 900g cost, SP = price of 1000g. Profit% = (SP - CP_effective)/CP_effective * 100.
  2. **Using multipliers**: If he gives x g but charges for y g (y > x), profit% = ((y - x)/x) * 100 assuming selling price per gram equals cost per gram.
- Most SSC questions: "A shopkeeper sells goods at cost price but uses 800 g instead of 1 kg." Profit% = (200/800)*100 = 25%.

**Step 6: Overheads & Transport**
- Add all additional costs (freight, labor, packaging) to the purchase price to get effective CP.
- Protection: Always read if "overheads included" or "additional expenses".

**Step 7: Two-Article Gain & Loss Balancing**
- Sell one article at overall profit, other at loss such that overall net is zero, or a given percent.
- Use the concept of weighted average or individual profit/loss multipliers.

**Step 8: CP and MP Relationship via Discount & Profit**
- If an article is sold at a discount of d% and still makes a profit of p%, then:
  MP * (1-d/100) = CP * (1+p/100)
  => MP/CP = (1+p/100) / (1-d/100)

**Step 9: Ratio and Proportion in Profit-Loss**
- Often the CP and SP are given in ratio. Use ratio methodology with percentage base.

**Step 10: Exam-Level Integration**
- In a 200/200 attempt, you must instantly choose the correct base, convert statements to multipliers, and scan options using elimination (e.g., if profit is asked, and options are >100%, suspect CP base).  
- Speed: For common percentages (10%, 20%, 25%, 50%), memorize fraction equivalents.  
- Trap awareness: "Loss of 20%" means CP:SP = 5:4; "Profit of 20%" means CP:SP = 5:6.  
- False weight profit% is independent of price if sold at CP.

## Type System

| Type | Recognition Cue | Method | Speed Target | Trap |
|------|-----------------|--------|--------------|------|
| Basic Profit/Loss | "cost price", "selling price" given directly | SP - CP or CP - SP; divide by CP; multiply by 100 | 15 sec | Using SP as base for percent |
| Profit/Loss % given, find CP or SP | "sold at 20% profit", find CP if SP is given | SP = CP * (1.20) => CP = SP/1.20 | 20 sec | Sign error: divide or multiply? |
| Discount from MP | "list price Rs X, discount Y%" | SP = MP * (1 - Y/100) | 10 sec | Taking discount off SP instead of MP |
| Successive Discounts | "two successive discounts of a% and b%" | Use multiplier product: (1-a/100)*(1-b/100) OR formula | 20 sec | Adding discounts (a+b) directly |
| Marked Price with profit | "marked 30% above CP, then sold at 10% discount, find profit%" | Let CP=100; MP=130; SP=130*0.9=117; profit=17% | 30 sec | Taking discount on CP |
| False Weight / Dishonest | "uses 800g instead of 1kg", "sells at cost price" | Profit% = (error)/(true - error)*100 OR (false - true)/true*100 | 30 sec | Using wrong base (1000 vs 800) |
| Overheads | "purchased for Rs X, spent Rs Y on transport" | Add overheads to get effective CP; then profit% = (SP - effective CP)/effective CP | 20 sec | Forgetting to add overheads |
| Two-article balancing | "sold one at 20% profit, other at 15% loss, overall gain 5%" | Let CP of each = 100; compute total SP and total CP; find overall % | 40 sec | Averaging profit/loss directly |
| CP:SP ratio | "ratio of CP to SP is 5:6" | Profit% = (SP - CP)/CP = (6-5)/5 = 20% | 10 sec | Taking ratio of SP to CP incorrectly |
| Profit when CP and SP have different units | "cost per dozen, sell per piece" | Convert to same unit (e.g., buy 12, sell 1) | 30 sec | Forgetting to convert units |

## Speed Methods

**Recall Table - Common Multipliers**

| Percent (P%) | Multiplier (1+P/100) for Profit | Multiplier (1-P/100) for Loss/Discount |
|--------------|--------------------------------|----------------------------------------|
| 10% | 1.1 | 0.9 |
| 20% | 1.2 | 0.8 |
| 25% | 1.25 | 0.75 |
| 33.33% | 1.3333 (4/3) | 0.6667 (2/3) |
| 50% | 1.5 | 0.5 |
| 12.5% | 1.125 | 0.875 |
| 100% | 2 | 0 |
| 6.25% | 1.0625 | 0.9375 |

**Decision Rules**

1. **Given CP and profit/loss%** -> SP = CP * multiplier (profit: 1 + r/100; loss: 1 - r/100)
2. **Given SP and profit/loss%** -> CP = SP / multiplier
3. **Given MP and discount%** -> SP = MP * (1 - d/100)
4. **Given MP and profit% on CP** -> Use: MP * (1-d/100) = CP * (1+p/100)  find MP/CP ratio
5. **Successive changes** -> Multiply all multipliers (including negative for discount/loss; positive for profit)
6. **False weight at CP** -> If sells x g as y g (claim y, give x), then profit% = (y - x)/x * 100
7. **Overheads** -> CP_effective = Purchase price + all extra costs; then use basic formulas
8. **When multiple articles** -> Take LCM of number of articles to assume total CP for ease

**Step-by-Step Algorithm for Successive Discounts**

Step 1: Write each discount as multiplier (1 - d/100).  
Step 2: Multiply all multipliers.  
Step 3: Single equivalent discount = (1 - product of multipliers) * 100.  
Step 4: SP = MP * product of multipliers.  
*Example:* Discounts 20% and 10%: multipliers 0.8 and 0.9 product 0.72; equivalent discount 28%. SP = MP * 0.72.

**Algorithm for Two-Article Gain/Loss Problem**

Step 1: Assume CP of each article = 100 (or any convenient number).  
Step 2: Compute SP1 = 100 * (1 + profit%/100), SP2 = 100 * (1 - loss%/100).  
Step 3: Total SP = SP1+SP2, Total CP = 200.  
Step 4: Overall profit% = (Total SP - Total CP)/200 * 100.  
*Trap:* Never average percentages directly (e.g., 20% profit and 10% loss is not 5% profit average).

## Trap Table

| Trap | Trigger Wording | Wrong Move | Correct Move | Repair Drill |
|------|-----------------|------------|--------------|--------------|
| Base confusion: profit% on SP | "sold at 20% profit on selling price" | Treat profit% on CP | Convert: profit% on SP means profit = 20% of SP. Let SP=100, profit=20, CP=80. Then actual profit% on CP = 25%. | Always identify base word: "on cost", "on selling price". "On price" means base is that price. |
| Discount base confusion | "discount of 10%" | Apply discount on CP | Discount is on MP unless the question explicitly gives a different base. | Write MP -> discount -> SP before doing profit/loss work. |
| Adding successive discounts | "two discounts a% and b%" | a+b% | Use product: (1-a/100)*(1-b/100) | Memorize: successive discounts multiply, they do not add. |
| False weight profit% double counting | "uses 900 g instead of 1 kg, sells at 10% profit" | Add 10% and 11.11% directly. | Use multiplier chain: overall profit% = ((100+p) x true weight / false weight) - 100. For 10% profit and 900 g instead of 1 kg: 110 x 1000/900 - 100 = 22.22%. | Drill five false-weight questions using the multiplier chain only. |
| Discount after markup | "marked 40% above CP then gives 10% discount" | Direct profit% = 40 - 10 = 30% | Use multipliers: CP=100, MP=140, SP=140*0.9=126 => profit 26% | Never subtract percentages directly across different bases. |
| Overheads ignored | "bought for Rs 500, spent Rs 50 on transport, sold at Rs 660" | Profit% = (660-500)/500 = 32% | Effective CP = 550; profit% = (660-550)/550 = 20% | Always check for additional expenses in cost. |
| Two items net % average | "sold two articles each at same SP, one 20% profit other 20% loss" | Conclude no overall gain/loss | Compute CP1 = SP/1.2, CP2 = SP/0.8, total CP > total SP => overall loss | Use numeric examples; same-SP equal-percent profit/loss gives net loss |
| Profit/Loss on total cost vs per unit | "bought 100 pens for Rs 1000, sold all at Rs 12 each" | Profit = (12-10)*100 = 200, percent = 200/1000=20% correct | But careful: if some unsold? Not here. Trap: mixing per unit profit% with total. Always compute total SP vs total CP. | Consistently find total CP and total SP. |
| Discount percent from SP | "find discount% given MP and SP" | Discount% = (MP-SP)/SP *100 | Discount% = (MP-SP)/MP *100 | Base is MP. |
| Markup percent confusion | "SP is Rs 120, profit is 20%, find MP if discount is 10%" | Mix markup base with SP | SP = 120, profit 20% => CP = 100. MP = SP/(1-0.1)=120/0.9=133.33. Markup% = (133.33-100)/100=33.33%. | Know: markup base is usually CP unless stated otherwise. |
| Interpreting "loss of 25%" equivalently | "selling price is Rs 75, find cost price" | CP = 75*1.25 = 93.75 | CP = 75/(0.75) = 100 | Loss of 25% means SP = 0.75*CP, so CP = SP/0.75. |
| Using fraction incorrectly | "20% profit means CP:SP = 5:4" | Reverse the ratio | 20% profit means SP = 1.2 CP, so CP:SP = 5:6 and Profit:CP = 1:5 | Practice ratio conversion |
| Marked price vs list price ambiguity | "list price Rs 200, sold at a discount of 15% still gains 20%" | Ignore list price and try to set up equation directly | Use: MP=200, SP=200*0.85=170. CP = SP/1.2 = 170/1.2 = 141.67. Markup% from CP to MP = (200-141.67)/141.67=41.18%. | Ensure to use list price as MP. |
| Successive changes in opposite direction | "increase by 20% then decrease by 20%" | Net change 0% | Multiplier: 1.2*0.8 = 0.96 => 4% decrease | Always multiply, don't add. |

## Flowchart

```mermaid
flowchart TD
    A[Start: Given problem] --> B{Identify what is given?}
    B -->|CP and SP| C[Compute profit/loss directly]
    C --> D[Profit = SP-CP, Loss = CP-SP]
    D --> E{Percent asked?}
    E -->|Yes| F[Divide difference by CP, multiply 100]
    E -->|No| G[Output value]
    B -->|MP and Discount%| H[SP = MP * (1-d/100)]
    H --> I[Compare with CP if needed]
    B -->|Profit/Loss% and one value| J[Use multiplier: CP = SP/multiplier or SP = CP*multiplier]
    B -->|Successive discounts| K[Product of multipliers]
    K --> L[SP = MP * product]
    B -->|False weight| M[Determine effective CP per gram]
    M --> N[If also profit%, multiply multipliers]
    N --> O[Overall profit% = (product multiplier * claim/given - 1)*100]
    B -->|Two articles| P[Assume CP each = 100, compute SP1, SP2]
    P --> Q[Total CP=200, Total SP = sum]
    Q --> R[Overall% = (Total SP - Total CP)/200*100]
    B -->|Overheads| S[Add extra costs to CP]
    S --> T[Use basic formulas with effective CP]
    B -->|No direct, need to find MP or CP| U[Set CP=100, build equation]
    U --> V[Solve for unknown]
    V --> W[Output answer]
```

## Solved Examples

**Example 1 (Basic Profit)**  
A man buys a mobile for Rs 8000 and sells it for Rs 9200. Find his profit percentage.  
Options: a) 10% b) 12% c) 15% d) 18%  
**Explanation:** Profit = 9200 - 8000 = 1200. Profit% = (1200/8000)*100 = 15%. Answer: c.

**Example 2 (Basic Loss)**  
A shopkeeper bought a TV for Rs 12000 and sold it at a loss of 8%. Find the selling price.  
Options: a) 11040 b) 11200 c) 10800 d) 11520  
**Explanation:** Loss 8% => SP = CP * (1 - 0.08) = 12000 * 0.92 = 11040. Answer: a.

**Example 3 (Discount)**  
The marked price of a shirt is Rs 600. It is sold at a discount of 15%. What is the selling price?  
Options: a) 500 b) 510 c) 520 d) 490  
**Explanation:** Discount = 15% of 600 = 90. SP = 600 - 90 = 510. Using multiplier: 600 * 0.85 = 510. Answer: b.

**Example 4 (Successive Discount)**  
A shopkeeper offers two successive discounts of 20% and 10%. What is the single equivalent discount?  
Options: a) 28% b) 30% c) 25% d) 32%  
**Explanation:** Multipliers: 0.8 and 0.9, product = 0.72. Equivalent discount = 1 - 0.72 = 0.28 = 28%. Answer: a.

**Example 5 (Marked Price and Profit)**  
A dealer marks his goods 30% above cost price and then sells them at a discount of 10%. Find his profit percent.  
Options: a) 17% b) 20% c) 23% d) 18%  
**Explanation:** Let CP = 100. MP = 130. Discount 10% => SP = 130 * 0.9 = 117. Profit = 17%. Answer: a.

**Example 6 (False Weight Only)**  
A dishonest shopkeeper uses a weight of 800 g instead of 1 kg and sells at cost price. What is his profit percentage?  
Options: a) 20% b) 25% c) 30% d) 22.5%  
**Explanation:** He claims 1000 g but gives 800 g. Profit = (1000-800)/800 * 100 = 200/800 *100 = 25%. Answer: b.

**Example 7 (False Weight with Profit%)**  
A dishonest dealer sells goods at 10% profit on his cost price but uses 900 g instead of 1 kg. His actual profit percent is:  
Options: a) 22.22% b) 21% c) 20% d) 25%  
**Explanation:** Using formula: Overall profit% = ((100+10) * (1000/900) - 100)% = (110 * 1.1111... - 100) = 122.22 - 100 = 22.22%. Answer: a.

**Example 8 (Overheads)**  
A merchant bought an article for Rs 1200. He spent Rs 200 on transport and Rs 50 on packaging. He sold it for Rs 1620. Find his profit percent.  
Options: a) 10% b) 11.7% c) 12% d) 13%  
**Explanation:** Effective CP = 1200+200+50 = 1450. Profit = 1620-1450 = 170. Profit% = (170/1450)*100 ~= 11.724% ~11.7%. Answer: b.

**Example 9 (Two Articles)**  
A man sold two watches for Rs 2400 each. On one he made a profit of 20% and on the other a loss of 20%. Find his overall gain or loss percent.  
Options: a) 4% loss b) 4% gain c) No gain no loss d) 5% loss  
**Explanation:** Let CP1 = 2400/1.2 = 2000, CP2 = 2400/0.8 = 3000. Total CP = 5000, total SP = 4800. Loss = 200. Loss% = (200/5000)*100 = 4%. Answer: a.

**Example 10 (CP-SP Ratio)**  
The ratio of cost price to selling price is 8:9. What is the profit percent?  
Options: a) 10% b) 12.5% c) 15% d) 11.11%  
**Explanation:** CP:SP = 8:9 => SP = (9/8)CP => profit = (1/8)CP = 0.125CP => 12.5%. Answer: b.

**Example 11 (Finding MP when profit and discount given)**  
A shopkeeper sells an article at a discount of 15% on the marked price and still makes a profit of 20%. If the cost price is Rs 600, what is the marked price?  
Options: a) 800 b) 847 c) 900 d) 850  
**Explanation:** SP = CP * 1.2 = 600*1.2=720. SP = MP*(1-0.15)=0.85 MP => MP = 720/0.85 = 847.058 ~= 847. Answer: b.

**Example 12 (Profit on SP trap)**  
If an article is sold at a profit of 25% on the selling price, then the cost price is what percent of selling price?  
Options: a) 75% b) 80% c) 125% d) 120%  
**Explanation:** Profit% on SP means profit = 25% of SP. Let SP = 100. Profit = 25, CP = 75. CP as % of SP = (75/100)*100 = 75%. Answer: a. Trap: if incorrectly taken on CP, would get 80%.

**Example 13 (Loss Percent From Ratio)**  
If CP:SP = 5:4, find the loss percent.  
Options: a) 10% b) 20% c) 25% d) 30%  
**Explanation:** CP=5 units, SP=4 units, loss=1 unit. Loss% = 1/5 x 100 = 20%. **Answer: b.**

**Example 14 (Profit Percent From Ratio)**  
If CP:SP = 7:9, find the profit percent.  
Options: a) 18.18% b) 22.22% c) 25% d) 28.57%  
**Explanation:** Profit = 9-7 = 2 units on CP=7 units. Profit% = 2/7 x 100 = 28.57%. **Answer: d.**

**Example 15 (Marked Price From Discount and SP)**  
An article is sold for Rs 720 after a discount of 20%. Find the marked price.  
Options: a) Rs 800 b) Rs 850 c) Rs 900 d) Rs 960  
**Explanation:** SP = 80% of MP. MP = 720/0.8 = 900. **Answer: c.**

**Example 16 (Markup Needed for Profit After Discount)**  
A shopkeeper wants 20% profit after giving 25% discount. By what percent should he mark the article above CP?  
Options: a) 40% b) 50% c) 60% d) 75%  
**Explanation:** Let CP=100. Required SP=120. Since SP = 75% of MP, MP = 120/0.75 = 160. Markup = 60%. **Answer: c.**

**Example 17 (Successive Discounts Three Steps)**  
Find the equivalent discount of 10%, 20%, and 25%.  
Options: a) 45% b) 46% c) 47% d) 50%  
**Explanation:** Multipliers: 0.9 x 0.8 x 0.75 = 0.54. Equivalent discount = 46%. **Answer: b.**

**Example 18 (Successive Increase and Decrease)**  
The price of an item is increased by 25% and then decreased by 20%. What is the net change?  
Options: a) 0% b) 2% gain c) 4% loss d) 5% gain  
**Explanation:** Multiplier = 1.25 x 0.8 = 1. Net change is 0%. **Answer: a.**

**Example 19 (Overhead With Markup)**  
A trader buys an article for Rs 500 and spends Rs 50 on repairs. He marks it 40% above effective CP and gives 10% discount. Find profit percent.  
Options: a) 20% b) 24% c) 26% d) 30%  
**Explanation:** Effective CP=550. MP=550 x 1.4 = 770. SP=770 x 0.9 = 693. Profit=143. Profit%=143/550 x 100 = 26%. **Answer: c.**

**Example 20 (False Weight With Discount Wording)**  
A dealer gives 900 g instead of 1 kg and sells at the marked cost price. Find gain percent.  
Options: a) 10% b) 11.11% c) 12.5% d) 9%  
**Explanation:** He charges for 1000 g but gives 900 g. Gain% = (1000-900)/900 x 100 = 11.11%. **Answer: b.**

**Example 21 (Profit And Discount Combined)**  
An article marked at Rs 1500 is sold after 12% discount. If CP is Rs 1100, find profit percent.  
Options: a) 15% b) 18% c) 20% d) 22%  
**Explanation:** SP = 1500 x 0.88 = 1320. Profit = 1320-1100 = 220. Profit% = 220/1100 x 100 = 20%. **Answer: c.**

**Example 22 (Find CP From Loss)**  
An item is sold for Rs 765 at a loss of 15%. Find CP.  
Options: a) Rs 850 b) Rs 875 c) Rs 900 d) Rs 925  
**Explanation:** SP = 85% of CP. CP = 765/0.85 = 900. **Answer: c.**

**Example 23 (Same CP, Different Outcomes)**  
Two articles have the same CP. One is sold at 30% profit and the other at 10% loss. Find overall profit percent.  
Options: a) 8% b) 10% c) 12% d) 15%  
**Explanation:** Let each CP=100. Total CP=200. SPs are 130 and 90, total SP=220. Profit=20 on 200 = 10%. **Answer: b.**

**Example 24 (Same SP, Equal Profit Loss)**  
Two articles are sold at the same SP. One gives 25% profit and the other gives 25% loss. Find overall loss percent.  
Options: a) 4.25% b) 5.25% c) 6.25% d) 7.25%  
**Explanation:** For same SP with equal x% profit and loss, overall loss = x^2/100 = 25^2/100 = 6.25%. **Answer: c.**

**Example 25 (Unit Conversion Profit)**  
A trader buys 3 dozen pens for Rs 360 and sells each pen for Rs 12. Find profit percent.  
Options: a) 15% b) 18% c) 20% d) 25%  
**Explanation:** 3 dozen = 36 pens. Total SP = 36 x 12 = 432. Profit = 432-360=72. Profit% = 72/360 x 100 = 20%. **Answer: c.**

## PYQ Mapping

- **Type: Basic Profit/Loss Percent** - Practice directly from previous year sets (2015-2024). Focus on quick CP/SP conversion using multipliers.  
  *Route*: /exams/ssc-cgl/topics/profit-loss-discount (basic level)  
- **Type: Discount and Successive Discount** - Solve at least 30 problems on single and successive discounts. Use multiplier chain.  
  *Route*: /exams/ssc-cgl/topics/profit-loss-discount (discount sub-topic)  
- **Type: Dishonest Dealer / False Weight** - This appears in 1-2 questions per shift. Master both forms: only false weight, and false weight with profit%.  
  *Route*: /exams/ssc-cgl/topics/percentages (percentage applications)  
- **Type: Two-Article Gain-Loss Balancing** - Often tricky. Practice problems where overall profit/loss given and individual unknown.  
  *Route*: /exams/ssc-cgl/topics/ratio-proportion (as it often involves ratios)  
- **Type: CP, MP, Discount and Profit Relationships** - These are common in mains-level but appear in Tier-I as well. Use assume CP=100 method.  
  *Route*: combined practice on the main profit-loss page.  

*Practice route for all types*:  
- /exams/ssc-cgl/topics/profit-loss-discount (complete set)  
- /exams/ssc-cgl/topics/percentages (to strengthen base)  
- /exams/ssc-cgl/topics/ratio-proportion (for ratio-based variants)

## 200/200 Drill

**Timed Micro-Drills (5 minutes each)**  

1. **Base Drill (10 questions)** - Given CP and profit/loss%, find SP; given SP and profit/loss%, find CP. Use multipliers. Target: 2 min.  
2. **Discount Drill** - 10 questions: find discount%, SP from MP, MP from SP, single equivalent discount. Target: 3 min.  
3. **False Weight Drill** - 10 mixed: only false weight, and false weight with profit%. Target: 4 min.  
4. **Equation Drill** - 5 questions on MP/CP relationship from discount and profit%. Target: 3 min.  
5. **Trap Recognition Drill** - 10 statements; identify base trap and compute correct result. Target: 2 min.  

**Repair Rules**  
- If you take profit% on SP by mistake, recalibrate to CP base: profit percentage on SP = (SP-CP)/SP *100; change base by dividing by (1+/- profit fraction).  
- If you add successive discounts, repeat using multiplier product: always convert each to (1-decimal).  
- If you ignore overheads, add all "incidental expenses" before computing CP.  
- If you average profit/loss percentages for two articles, instead compute total CP and total SP using example values.  
- If you get an option like "None of these", recheck base and sign (profit vs loss).  

**Speed Execution**  
- For common percentages (10,20,25,50,33.33,12.5), use fraction conversions instantly.  
- Mark the base in the question (CP, MP, SP) using a symbol: underline "cost price", circle "marked price".  
- Always keep CP = 100 for "markup and discount" problems. That gives immediate profit% in final step.  

**Checklist Before Exam**  
- [ ] Memorize all multiplier decimals for 1% to 50% increments.  
- [ ] Practice 100 mixed problems in 30 minutes (roughly 18 seconds each).  
- [ ] Review trap table the night before.  
- [ ] Solve the 200/200 Drill as timed sets.  

Final standard: Profit, loss, and discount are multiplier questions. A 50/50 Quant attempt requires instant base recognition, no direct addition of percentages across different bases, and clean total CP versus total SP checks in every mixed problem.
<!-- SSC-FINAL-PRACTICE-QUEUE:START -->
## Final Practice Queue

1. Start one-by-one practice: [Profit, Loss, and Discount practice](/exams/ssc-cgl/practice/profit-loss-discount). Finish every question in this topic bank, not just the samples in the note.
2. Move to timed sets: [SSC CGL tests](/exams/ssc-cgl/tests?topic=profit-loss-discount). Use topic drills first, then section mocks once accuracy is stable.
3. Repair every miss immediately: record the error label, redo 20 mixed questions from the same topic, then retest after 24 hours.
4. 200/200 rule: do not mark this topic exam-ready until correct answers come within 36 seconds and wrong answers are explained without looking at the solution.

<!-- SSC-FINAL-PRACTICE-QUEUE:END -->

---
title: "Formula and Recognition Sheet"
math_syntax: typst
---

# Formula and Recognition Sheet

[Course index](/notes/studies-power-system-protection-and-switchgear-exam-preparation-00-start-here) · [Final review](/notes/studies-power-system-protection-and-switchgear-exam-preparation-final-review)

This sheet is for recognition and checking. Worked substitutions in the weekly notes use only supplied assignments or identified lecture examples.

## Instrument-transformer scaling

- CT ratio: $K_("CT") = I_P/I_S$ and $I_S = I_P/K_("CT")$.
- PT ratio: $K_("PT") = V_P/V_S$ and $V_S = V_P slash K_("PT")$.
- Relay-side impedance:
  $$
  Z_("relay") = frac(V_S, I_S) = Z_("primary") frac(K_("CT"), K_("PT")).
  $$
- CT burden at the specified secondary current:
  $$
  "VA"=I_S^2|Z_"burden"|.
  $$
  Add relay, lead and connection impedance on the same secondary basis. Use impedance magnitude unless the source explicitly assumes a resistance.
- Star/delta transformer differential protection requires both phase-shift compensation and the $sqrt(3)$ line/phase effect. State whether a ratio refers to an individual CT winding or a relay lead.

## Overcurrent relays and coordination

- Plug-setting multiplier: $"PSM" = I_("relay") / I_("pickup")$.
- IEC standard inverse form used in the course:
  $$
  t = frac(0.14 "TMS", "PSM"^(0.02) - 1).
  $$
- Coordinate from the farthest downstream relay toward the source. Upstream time must include downstream operation, breaker time, overtravel and the stated safety/error interval.
- Definite-time: fixed intentional delay after pickup. Inverse: time falls as current multiple rises. Instantaneous high-set: no intentional grading delay.
- Settings are discrete. A thermal limit can require the lower safe step; starting-current restraint must remain above legitimate starting current.

## Distance protection

- Basic apparent impedance: $Z_("app") = V/I$ using the correct phase or sequence loop.
- Convert a primary reach to relay ohms with $K_("CT")/K_("PT")$.
- Reactance: comparatively insensitive to arc resistance. Impedance: circle centered at origin. Mho: inherently directional. Quadrilateral: independently adjustable resistive reach.
- Infeed/outfeed changes apparent reach. For the supplied three-terminal form:
  $$
  Z_("app") = Z_("AT") + frac(I_("remote"), I_A) Z_("remote").
  $$
- Directional elements require the correct polarizing quantity and connection angle. The course uses a $90 degree$ connection for useful phase-fault torque.

## Carrier and pilot logic

- Blocking: a remote carrier signal restrains overreaching trip logic for an external fault.
- Permissive: received permission and a local directional condition are both required.
- Direct transfer trip: receipt initiates tripping, so channel security is critical.
- Phase comparison depends on current-reference direction. Zero and $180 degree$ statements are not meaningful without the arrow convention.
- A wave trap is low impedance at power frequency and high impedance at carrier frequency; the coupling capacitor passes carrier while isolating communication equipment from power-frequency voltage.

## Auto-reclosing

- Dead time: breaker-open interval before the close command.
- Reclaim time: reset interval after a successful sequence.
- Single-pole reclosing retains transfer on healthy phases and suits single-phase transient EHV faults.
- Three-pole reclosing opens all poles and creates a larger system disturbance.
- Reclosing suits transient overhead-line faults; it does not cure permanent cable faults.

## Equipment protection

- Transformer: percentage differential, harmonic restraint for inrush, Buchholz protection for incipient faults in oil-filled conservator units, and restricted earth fault for sensitive zone-limited earth faults.
- Generator: stator differential, neutral/earth-fault coverage, reverse power for motoring, and negative sequence for unbalance.
- Motor: thermal overload protection must retain thermal memory; electronic reset does not cool the machine. Negative sequence produces double-frequency rotor heating.
- Busbar: high-impedance differential depends on stability for external faults and CT saturation; low-impedance numerical schemes use biased differential logic and supervision.

## Grounding, interruption and TRV

- Petersen-coil tuning in the ideal course model: $X_L = 1 / (3 omega C)$ when $C$ is total per-phase capacitance to ground. Check per-kilometre versus total units.
- In an ideal LC recovery, first peak occurs at $t_p = pi sqrt("LC")$. Average RRRV is first-peak voltage divided by $t_p$, not maximum instantaneous slope.
- Current chopping transfers inductive energy into capacitance and can create overvoltage.
- Trapped charge on an unloaded line can make contact voltage approach twice the phase-voltage peak.
- Resistance switching damps recovery oscillation. Do not apply a series-RLC inequality to a shunt-resistor interruption circuit.

## Breaker ratings and tests

- Breaking capacity uses rated voltage and symmetrical breaking current. Making current includes the specified asymmetric peak factor.
- Short-time current rating is thermal/mechanical withstand for a stated duration.
- Type tests establish design capability; routine tests check each unit; commissioning tests verify installed wiring, settings and end-to-end operation.
- Contact resistance, insulation withstand, timing and trip-circuit tests address different failure modes.

## Exam-key rule

For every supplied assignment item, the prominent exam answer is the supplied key. Read [Source Cautions](/notes/studies-power-system-protection-and-switchgear-exam-preparation-source-cautions) where wording, units or a conventional derivation need a separate note.

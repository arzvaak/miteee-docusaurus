---
title: "Final Review"
math_syntax: typst
---

# Final Review

[Course index](/notes/studies-power-system-protection-and-switchgear-exam-preparation-00-start-here) · [Formula sheet](/notes/studies-power-system-protection-and-switchgear-exam-preparation-formula-and-recognition-sheet) · [Practice on Switch](https://switch.arzvak.com)

## Recognition pass

1. Identify the protected object: line, transformer, generator, motor, busbar or breaker.
2. Decide unit versus non-unit protection. Differential/pilot schemes compare boundaries; overcurrent and stepped-distance schemes depend on reach/time coordination.
3. Identify what the relay receives. Apply CT/PT ratios and CT connection before comparing quantities.
4. Name the operating quantity: magnitude, time-current multiple, impedance, direction, phase comparison, differential current, negative sequence or thermal state.
5. Expose the convention: current arrows, line/phase quantity, RMS/peak, total/per-kilometre capacitance, or average/instantaneous RRRV.
6. For an original assignment, use the supplied key. A source caution explains rather than replaces it.

## High-yield distinctions

- Absolute selectivity is inherent zone selectivity; relative selectivity is grading with neighbouring devices.
- Dependability means operate when required; security means avoid unwanted operation.
- Sensitivity in the course can mean minimum operating VA; CT burden is the VA drawn by the secondary circuit.
- Inverse overcurrent time changes with current multiple; definite time does not; instantaneous has no intentional delay.
- Distance underreach/overreach concerns apparent impedance relative to reach. Fault resistance, remote infeed and decaying DC can move the apparent point.
- Reactance gives strong fault-resistance tolerance; mho is directional; quadrilateral permits extended resistive reach.
- Blocking sends restraint; permissive schemes require permission plus local detection; transfer trip sends a direct command.
- Dead time is the open interval; reclaim time is the post-sequence reset interval.
- Differential protection must be stable for external faults/CT saturation and sensitive to internal faults.
- Transformer inrush is treated with second-harmonic restraint in this course.
- Negative-sequence motor protection addresses unbalance heating. Thermal memory must survive electronics reset.
- Trapped charge, current chopping and short-line faults are distinct interruption problems.
- Average RRRV is voltage rise divided by time to first peak, not maximum derivative.
- Type, routine and commissioning tests concern design, production and installed-system proof.

## Assignment cautions

- **T1-W6-Q01:** exam answer is key B, $250 : 5 sqrt(3)$ A. Keep the individual-CT $5/sqrt(3)$ derivation as a separate convention observation.
- **T2-W6-Q08:** 81 Ω uses the lecture-specific one-third adjustment after the approximately 243 Ω stabilizer calculation.
- **T2-W6-Q09:** 70% follows downward thermal-step selection after the unity-efficiency calculation gives about 73.4%.
- **T2-W6-Q10:** the course illustration uses $Z_2/Z_1$; practical settings require motor thermal limits too.
- **T2-W7-Q07:** keep 1.2 mF/km and key D. Literal calculation does not match A–C; do not repair mF to μF silently.
- **T2-W7-Q10:** the keyed value is average RRRV to the first peak.
- **T2-W8-Q01:** trapped-charge maximum is twice phase-voltage peak, giving keyed 653.19 kV.
- **T2-W8-Q03:** opening resistance switching damps TRV; do not substitute a series-RLC criterion.
- **T1-W3-Q08:** $12 angle 75 degree$ is impedance. Use $Z_("app") = Z_("AT") + (I_("TC")/I_A) Z_("TC")$ with the shown phasors.
- **T2-W3-Q01/Q02:** the feeder has three relays and CT ratios 1000/1, 800/1 and 800/1; coordinate from downstream.

## Last pass

- Rework every supplied numerical from the exact source values; do not create changed-number drills.
- For each mistake, name the method before reading the explanation.
- Use exact-assignment mode for original wording/order and mixed mode for due reviews and weak methods.
- Finish with the eight quick-revision sheets and [Source Cautions](/notes/studies-power-system-protection-and-switchgear-exam-preparation-source-cautions).

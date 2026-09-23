---
title: "Quick Revision"
math_syntax: typst
---

# Week 5 — Quick Revision

## Week 5 Revision: Auto-Reclosing & Carrier-Aided Schemes

### Key Formulas & Values
*   **Dead Time (IEC):** $t_("dead") = 10.5 + frac("kV", 34.5)$ cycles. Convert to seconds: $t_("dead")("s") = t_("dead")("cycles") times frac(1, f)$. For 50 Hz, multiply cycles by 0.02.
*   **Fault Statistics:** ~80% transient, ~20% permanent on overhead lines. Cable faults are usually permanent.
*   **IEC Breaker Duty Cycle:** O + 0.3 s + CO + 3 min + CO.
*   **Typical Zone Settings:** Zone-1 = 80% (underreach), 120-150% (overreach/blocking). Zone-2 = 120% + 50% of next line.

### Critical Concepts & Traps
1.  **Auto-Reclosing Justification:** High transient fault percentage. **Trap:** Assuming it's for permanent faults or cables.
2.  **Dead Time vs. Reclaim Time:** Dead time = de-ionization period before first reclose. Reclaim time = interval between reclosing attempts (e.g., 25s). **Trap:** Confusing the two or setting dead time shorter than breaker de-ionization time.
3.  **ARR Zone Selection:** For EHV/UHV with distance relays, ARR is for **Zone-1 only**. **Trap:** Applying ARR to Zone-2/3 faults, risking instability and breaker stress.
4.  **Single-Pole vs. Three-Pole Reclosing:** Single-pole improves stability but needs longer dead time (capacitive coupling) and phase selection logic. **Trap:** Thinking it's cheaper or eliminates breakers.
5.  **Recloser-Fuse Coordination:** Recloser fast curve operates first (fuse saving). For permanent faults, recloser locks out, fuse blows. **Trap:** Assuming fuse always blows first.
6.  **Carrier Blocking Scheme:** Uses reverse-looking relays; carrier signal **blocks** tripping. Requires coordination time delay. **Trap:** Maloperation if signal fails/delayed.
7.  **Carrier Unblocking Scheme:** Continuous guard signal; frequency shift to trip. **Advantage:** No coordination delay. **Trap:** Confusing guard vs. trip frequencies.
8.  **Direct vs. Permissive Underreach:** Permissive adds local fault detector contact for security against noise. **Trap:** Thinking permissive is faster (it's slightly slower but more secure).
9.  **Overreach Scheme:** Zone-1 > 100% of line. Provides redundant tripping. **Disadvantage:** Maloperation risk if channel fails. **Trap:** Assuming it's immune to channel failure.
10. **Synchro-Check Relay:** Checks voltage magnitude/angle **before closing**. **Trap:** Confusing it with a current check or thinking it operates during opening.

### Common Mistakes in Numericals
*   **Dead Time Calculation:** Forgetting to convert cycles to seconds using system frequency ($1 / f$). Using wrong kV (line-to-line vs. phase).
*   **Zone Settings:** Misapplying the 80% rule for underreach vs. 120-150% for overreach/blocking schemes.

### Source Sections
*   **Auto-Reclosing:** Lectures 23-25 (Principles, Sequence, Factors, Synchro-Check).
*   **Carrier Schemes:** Lectures 21-22 (Blocking, Unblocking, Transfer Tripping - Underreach/Overreach).
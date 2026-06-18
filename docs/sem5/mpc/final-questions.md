# Final Questions — Weeks 1–5

> **Design of Modern Power Converters** | NPTEL | Prof. Shabari Nath, IIT Guwahati
> All assignment questions + GATE-style questions | Weeks 1–5
> *Click any option for MCQ, select options + "Check Answers" for MSQ*

---

## Week 1 — Converter Analysis

### Assignment Questions

<div class="quiz-block mcq arithmatex" data-answer="b">
<div class="quiz-meta"><span class="quiz-num">W1-A1</span><span class="quiz-tag">Assignment</span><span class="quiz-type">MCQ</span></div>
<p class="quiz-q">A buck converter: $V_{in}=200\,V$, $V_o=140\,V$, $P_{max}=560\,W$, $P_{min}=420\,W$, $\Delta i_L \leq 1\,A$, $f_s=40\,kHz$.<br>Switch voltage rating must exceed:</p>
<div class="quiz-options">
<label data-opt="a"><span class="opt-key">A</span> 140 V</label>
<label data-opt="b"><span class="opt-key">B</span> 200 V</label>
<label data-opt="c"><span class="opt-key">C</span> 340 V</label>
<label data-opt="d"><span class="opt-key">D</span> 100 V</label>
</div>
<details class="quiz-exp"><summary>Show Answer</summary><div class="quiz-exp-body"><strong>Answer: B — 200 V.</strong> In a buck converter, the switch sees $V_{in}$ when it is OFF $diode is ON$. Voltage rating must exceed $V_{in} = 200\,V$.</div></details>
</div>

<div class="quiz-block mcq arithmatex" data-answer="b">
<div class="quiz-meta"><span class="quiz-num">W1-A2</span><span class="quiz-tag">Assignment</span><span class="quiz-type">MCQ</span></div>
<p class="quiz-q">Same converter. Switch current rating must exceed:</p>
<div class="quiz-options">
<label data-opt="a"><span class="opt-key">A</span> 3.0 A</label>
<label data-opt="b"><span class="opt-key">B</span> ≈4.5 A</label>
<label data-opt="c"><span class="opt-key">C</span> 6.0 A</label>
<label data-opt="d"><span class="opt-key">D</span> 2.0 A</label>
</div>
<details class="quiz-exp"><summary>Show Answer</summary><div class="quiz-exp-body"><strong>Answer: B ≈ 4.5 A.</strong> $I_{peak} = I_{o,max} + \Delta i_L/2 = 4\,A + 0.5\,A = 4.5\,A$. Accepted range: 4.2–4.8 A.</div></details>
</div>

<div class="quiz-block mcq arithmatex" data-answer="c">
<div class="quiz-meta"><span class="quiz-num">W1-A3</span><span class="quiz-tag">Assignment</span><span class="quiz-type">MCQ</span></div>
<p class="quiz-q">Same converter. $L_{critical}$ μH to maintain CCM down to 420 W:</p>
<div class="quiz-options">
<label data-opt="a"><span class="opt-key">A</span> 100 μH</label>
<label data-opt="b"><span class="opt-key">B</span> 150 μH</label>
<label data-opt="c"><span class="opt-key">C</span> 175 μH</label>
<label data-opt="d"><span class="opt-key">D</span> 250 μH</label>
</div>
<details class="quiz-exp"><summary>Show Answer</summary><div class="quiz-exp-body"><strong>Answer: C — 175 μH.</strong> $D=0.7$, $I_{min}=3\,A$. $L_{crit} = \frac{V_o(1-D)}{2I_{min}f_s} = \frac{140\times0.3}{2\times3\times40000} = 175\,\mu H$.</div></details>
</div>

<div class="quiz-block mcq arithmatex" data-answer="d">
<div class="quiz-meta"><span class="quiz-num">W1-A4</span><span class="quiz-tag">Assignment</span><span class="quiz-type">MCQ</span></div>
<p class="quiz-q">Same converter. $L_{ripple}$ mH for $\Delta i_L \leq 1\,A$:</p>
<div class="quiz-options">
<label data-opt="a"><span class="opt-key">A</span> 0.175 mH</label>
<label data-opt="b"><span class="opt-key">B</span> 0.5 mH</label>
<label data-opt="c"><span class="opt-key">C</span> 0.8 mH</label>
<label data-opt="d"><span class="opt-key">D</span> ≈1.05 mH</label>
</div>
<details class="quiz-exp"><summary>Show Answer</summary><div class="quiz-exp-body"><strong>Answer: D ≈ 1.05 mH.</strong> $L_{ripple} = V_o(1-D)/(\Delta i_L \cdot f_s) = 1.05\,mH$. Accepted range: 0.99–1.2 mH.</div></details>
</div>

<div class="quiz-block mcq arithmatex" data-answer="d">
<div class="quiz-meta"><span class="quiz-num">W1-A5</span><span class="quiz-tag">Assignment</span><span class="quiz-type">MCQ</span></div>
<p class="quiz-q">Which L value to select? (Select the standard value ≥ $L_{ripple}$)</p>
<div class="quiz-options">
<label data-opt="a"><span class="opt-key">A</span> 150 μH</label>
<label data-opt="b"><span class="opt-key">B</span> 250 μH</label>
<label data-opt="c"><span class="opt-key">C</span> 800 μH</label>
<label data-opt="d"><span class="opt-key">D</span> 1200 μH</label>
</div>
<details class="quiz-exp"><summary>Show Answer</summary><div class="quiz-exp-body"><strong>Answer: D — 1200 μH.</strong> $L_{ripple}$ ≈ 1050 μH. Must select standard value ≥ 1050 μH → 1200 μH.</div></details>
</div>

<div class="quiz-block mcq arithmatex" data-answer="d">
<div class="quiz-meta"><span class="quiz-num">W1-A6</span><span class="quiz-tag">Assignment</span><span class="quiz-type">MCQ</span></div>
<p class="quiz-q">With L = 1200 μH selected, inductor current rating must exceed:</p>
<div class="quiz-options">
<label data-opt="a"><span class="opt-key">A</span> 3.0 A</label>
<label data-opt="b"><span class="opt-key">B</span> 4.0 A</label>
<label data-opt="c"><span class="opt-key">C</span> 4.2 A</label>
<label data-opt="d"><span class="opt-key">D</span> ≈4.5 A $peak current$</label>
</div>
<details class="quiz-exp"><summary>Show Answer</summary><div class="quiz-exp-body"><strong>Answer: D ≈ 4.44 A.</strong> $I_{peak} = I_{o,max} + \Delta i_L/2$. With 1200 μH: $\Delta i_L = 140\times0.3/(40000\times1.2\times10^{-3}) = 42/48 = 0.875\,A$. $I_{peak} = 4 + 0.4375 = 4.44\,A$. Range: 4.2–4.8 A.</div></details>
</div>

<div class="quiz-block mcq arithmatex" data-answer="d">
<div class="quiz-meta"><span class="quiz-num">W1-A7</span><span class="quiz-tag">Assignment</span><span class="quiz-type">MCQ</span></div>
<p class="quiz-q">With L=1200 μH, C value μF for 0.5% voltage ripple:</p>
<div class="quiz-options">
<label data-opt="a"><span class="opt-key">A</span> 0.1 μF</label>
<label data-opt="b"><span class="opt-key">B</span> 1.5 μF</label>
<label data-opt="c"><span class="opt-key">C</span> 3 μF</label>
<label data-opt="d"><span class="opt-key">D</span> 6 μF $select standard value ≥ required$</label>
</div>
<details class="quiz-exp"><summary>Show Answer</summary><div class="quiz-exp-body"><strong>Answer: D — 6 μF.</strong> Required C ≈ 3.7–4.2 μF $calculated from ripple formula$. Standard value ≥ required → 6 μF. Note: 4.46 μF was the exact calculation in assignment $incorrect answer by student — actual ≈ 3.9 μF$.</div></details>
</div>

<div class="quiz-block mcq arithmatex" data-answer="c">
<div class="quiz-meta"><span class="quiz-num">W1-A8</span><span class="quiz-tag">Assignment</span><span class="quiz-type">MCQ</span></div>
<p class="quiz-q">Which capacitor type is best for the buck converter output at 40 kHz with several μF requirement?</p>
<div class="quiz-options">
<label data-opt="a"><span class="opt-key">A</span> Plastic</label>
<label data-opt="b"><span class="opt-key">B</span> Ceramic</label>
<label data-opt="c"><span class="opt-key">C</span> Electrolytic</label>
<label data-opt="d"><span class="opt-key">D</span> Film</label>
</div>
<details class="quiz-exp"><summary>Show Answer</summary><div class="quiz-exp-body"><strong>Answer: C — Electrolytic.</strong> Electrolytic capacitors provide high capacitance $μF–mF$ at low cost with adequate ripple current ratings. Ceramics are for small-value decoupling; film for AC filtering.</div></details>
</div>

---

### Additional W1 Practice

<div class="quiz-block mcq arithmatex" data-answer="d">
<div class="quiz-meta"><span class="quiz-num">W1-P1</span><span class="quiz-tag">W1</span><span class="quiz-type">MCQ</span></div>
<p class="quiz-q">Doubling the switching frequency in a buck converter $all else same$ reduces output voltage ripple by a factor of:</p>
<div class="quiz-options">
<label data-opt="a"><span class="opt-key">A</span> 2</label>
<label data-opt="b"><span class="opt-key">B</span> 1 $no change$</label>
<label data-opt="c"><span class="opt-key">C</span> 8</label>
<label data-opt="d"><span class="opt-key">D</span> 4</label>
</div>
<details class="quiz-exp"><summary>Show Answer</summary><div class="quiz-exp-body"><strong>Answer: D — factor 4.</strong> $\Delta v_C \propto 1/f_s^2$. Doubling $f_s$ → 4× reduction in ripple. This is why high switching frequency allows much smaller passive components.</div></details>
</div>

<div class="quiz-block mcq arithmatex" data-answer="b">
<div class="quiz-meta"><span class="quiz-num">W1-P2</span><span class="quiz-tag">W1</span><span class="quiz-type">MCQ</span></div>
<p class="quiz-q">Average output voltage in bipolar PWM with $V_{dc}=300\,V$ and $d=0.6$ is:</p>
<div class="quiz-options">
<label data-opt="a"><span class="opt-key">A</span> 180 V</label>
<label data-opt="b"><span class="opt-key">B</span> 60 V</label>
<label data-opt="c"><span class="opt-key">C</span> 300 V</label>
<label data-opt="d"><span class="opt-key">D</span> 120 V</label>
</div>
<details class="quiz-exp"><summary>Show Answer</summary><div class="quiz-exp-body"><strong>Answer: B — 60 V.</strong> $\bar{v}_o = V_{dc}(2d-1) = 300(2\times0.6-1) = 300\times0.2 = 60\,V$.</div></details>
</div>

<div class="quiz-block msq arithmatex" data-answers="a,b,d">
<div class="quiz-meta"><span class="quiz-num">W1-P3</span><span class="quiz-tag">W1·GATE</span><span class="quiz-type">MSQ</span></div>
<p class="quiz-q">In CCM buck converter, which are TRUE? $Select ALL that apply$</p>
<div class="quiz-options">
<label data-opt="a"><span class="opt-key">A</span> Switch voltage stress equals $V_{in}$</label>
<label data-opt="b"><span class="opt-key">B</span> Freewheeling diode carries inductor current during switch OFF interval</label>
<label data-opt="c"><span class="opt-key">C</span> Output voltage can exceed input voltage</label>
<label data-opt="d"><span class="opt-key">D</span> Average inductor current equals output current by charge balance</label>
</div>
<button class="quiz-check">Check Answers</button>
<details class="quiz-exp"><summary>Show Answer</summary><div class="quiz-exp-body"><strong>Answers: A, B, D.</strong> C is false — buck $V_o \leq V_{in}$ always. A: switch sees $V_{in}$ when OFF $diode clamps$. B: diode provides path for inductor current. D: from capacitor charge balance, avg $I_C = 0$ → avg $I_L = I_o$.</div></details>
</div>

---

## Week 2 — Power Semiconductor Devices

### Assignment Questions

<div class="quiz-block mcq arithmatex" data-answer="a">
<div class="quiz-meta"><span class="quiz-num">W2-A1</span><span class="quiz-tag">Assignment</span><span class="quiz-type">MCQ</span></div>
<p class="quiz-q">IRFB7545PbF datasheet — voltage rating $V$:</p>
<div class="quiz-options">
<label data-opt="a"><span class="opt-key">A</span> 60 V</label>
<label data-opt="b"><span class="opt-key">B</span> 75 V</label>
<label data-opt="c"><span class="opt-key">C</span> 100 V</label>
<label data-opt="d"><span class="opt-key">D</span> 45 V</label>
</div>
<details class="quiz-exp"><summary>Show Answer</summary><div class="quiz-exp-body"><strong>Answer: A — 60 V.</strong> $V_{DS} = 60\,V$ from IRFB7545PbF datasheet.</div></details>
</div>

<div class="quiz-block mcq arithmatex" data-answer="b">
<div class="quiz-meta"><span class="quiz-num">W2-A2</span><span class="quiz-tag">Assignment</span><span class="quiz-type">MCQ</span></div>
<p class="quiz-q">IRFB7545PbF — continuous current at 100°C $A$:</p>
<div class="quiz-options">
<label data-opt="a"><span class="opt-key">A</span> 45 A</label>
<label data-opt="b"><span class="opt-key">B</span> 67 A</label>
<label data-opt="c"><span class="opt-key">C</span> 80 A</label>
<label data-opt="d"><span class="opt-key">D</span> 100 A</label>
</div>
<details class="quiz-exp"><summary>Show Answer</summary><div class="quiz-exp-body"><strong>Answer: B — 67 A.</strong></div></details>
</div>

<div class="quiz-block mcq arithmatex" data-answer="b">
<div class="quiz-meta"><span class="quiz-num">W2-A3</span><span class="quiz-tag">Assignment</span><span class="quiz-type">MCQ</span></div>
<p class="quiz-q">IRFB7545PbF — max gate-source threshold voltage $V$:</p>
<div class="quiz-options">
<label data-opt="a"><span class="opt-key">A</span> 2.5 V</label>
<label data-opt="b"><span class="opt-key">B</span> 3.7 V</label>
<label data-opt="c"><span class="opt-key">C</span> 5.0 V</label>
<label data-opt="d"><span class="opt-key">D</span> 4.5 V</label>
</div>
<details class="quiz-exp"><summary>Show Answer</summary><div class="quiz-exp-body"><strong>Answer: B — 3.7 V.</strong></div></details>
</div>

<div class="quiz-block mcq arithmatex" data-answer="b">
<div class="quiz-meta"><span class="quiz-num">W2-A4</span><span class="quiz-tag">Assignment</span><span class="quiz-type">MCQ</span></div>
<p class="quiz-q">IRFB7545PbF — reverse transfer capacitance $C_{rss}$ pF:</p>
<div class="quiz-options">
<label data-opt="a"><span class="opt-key">A</span> 4010 pF</label>
<label data-opt="b"><span class="opt-key">B</span> 230 pF</label>
<label data-opt="c"><span class="opt-key">C</span> 110 pF</label>
<label data-opt="d"><span class="opt-key">D</span> 500 pF</label>
</div>
<details class="quiz-exp"><summary>Show Answer</summary><div class="quiz-exp-body"><strong>Answer: B — 230 pF.</strong> $C_{rss}$ = Miller capacitance = $C_{gd}$.</div></details>
</div>

<div class="quiz-block mcq arithmatex" data-answer="c">
<div class="quiz-meta"><span class="quiz-num">W2-A5</span><span class="quiz-tag">Assignment</span><span class="quiz-type">MCQ</span></div>
<p class="quiz-q">IRFB7545PbF — max total gate charge $Q_g$ nC:</p>
<div class="quiz-options">
<label data-opt="a"><span class="opt-key">A</span> 50 nC</label>
<label data-opt="b"><span class="opt-key">B</span> 75 nC</label>
<label data-opt="c"><span class="opt-key">C</span> 110 nC</label>
<label data-opt="d"><span class="opt-key">D</span> 230 nC</label>
</div>
<details class="quiz-exp"><summary>Show Answer</summary><div class="quiz-exp-body"><strong>Answer: C — 110 nC.</strong></div></details>
</div>

<div class="quiz-block mcq arithmatex" data-answer="a">
<div class="quiz-meta"><span class="quiz-num">W2-A6</span><span class="quiz-tag">Assignment</span><span class="quiz-type">MCQ</span></div>
<p class="quiz-q">IRFB7545PbF — max $R_{DS(on)}$ at $V_{GS}=10\,V$ mΩ:</p>
<div class="quiz-options">
<label data-opt="a"><span class="opt-key">A</span> 5.9 mΩ</label>
<label data-opt="b"><span class="opt-key">B</span> 8.0 mΩ</label>
<label data-opt="c"><span class="opt-key">C</span> 12 mΩ</label>
<label data-opt="d"><span class="opt-key">D</span> 3.5 mΩ</label>
</div>
<details class="quiz-exp"><summary>Show Answer</summary><div class="quiz-exp-body"><strong>Answer: A — 5.9 mΩ.</strong></div></details>
</div>

<div class="quiz-block mcq arithmatex" data-answer="b">
<div class="quiz-meta"><span class="quiz-num">W2-A7</span><span class="quiz-tag">Assignment</span><span class="quiz-type">MCQ</span></div>
<p class="quiz-q">IRFB7545PbF — input capacitance $C_{iss}$ pF:</p>
<div class="quiz-options">
<label data-opt="a"><span class="opt-key">A</span> 230 pF</label>
<label data-opt="b"><span class="opt-key">B</span> 4010 pF</label>
<label data-opt="c"><span class="opt-key">C</span> 110 pF</label>
<label data-opt="d"><span class="opt-key">D</span> 1000 pF</label>
</div>
<details class="quiz-exp"><summary>Show Answer</summary><div class="quiz-exp-body"><strong>Answer: B — 4010 pF.</strong> $C_{iss}$ = $C_{gs}$ + $C_{gd}$ = input capacitance.</div></details>
</div>

<div class="quiz-block mcq arithmatex" data-answer="b">
<div class="quiz-meta"><span class="quiz-num">W2-A8</span><span class="quiz-tag">Assignment</span><span class="quiz-type">MCQ</span></div>
<p class="quiz-q">IRFB7545PbF — typical turn-OFF time ns 1057H57:</p>
<div class="quiz-options">
<label data-opt="a"><span class="opt-key">A</span> 44 ns</label>
<label data-opt="b"><span class="opt-key">B</span> 87 ns</label>
<label data-opt="c"><span class="opt-key">C</span> 12 ns</label>
<label data-opt="d"><span class="opt-key">D</span> 150 ns</label>
</div>
<details class="quiz-exp"><summary>Show Answer</summary><div class="quiz-exp-body"><strong>Answer: B — 87 ns.</strong> Note: The student entered 44 ns $incorrect$. The correct datasheet value is 87 ns for turn-OFF time. Turn-ON time is 84 ns.</div></details>
</div>

<div class="quiz-block mcq arithmatex" data-answer="a">
<div class="quiz-meta"><span class="quiz-num">W2-A9</span><span class="quiz-tag">Assignment</span><span class="quiz-type">MCQ</span></div>
<p class="quiz-q">IRFB7545PbF — max junction temperature °C:</p>
<div class="quiz-options">
<label data-opt="a"><span class="opt-key">A</span> 175°C</label>
<label data-opt="b"><span class="opt-key">B</span> 150°C</label>
<label data-opt="c"><span class="opt-key">C</span> 200°C</label>
<label data-opt="d"><span class="opt-key">D</span> 125°C</label>
</div>
<details class="quiz-exp"><summary>Show Answer</summary><div class="quiz-exp-body"><strong>Answer: A — 175°C.</strong></div></details>
</div>

<div class="quiz-block mcq arithmatex" data-answer="b">
<div class="quiz-meta"><span class="quiz-num">W2-A10</span><span class="quiz-tag">Assignment</span><span class="quiz-type">MCQ</span></div>
<p class="quiz-q">IRFB7545PbF — typical body diode $t_{rr}$ at 125°C ns:</p>
<div class="quiz-options">
<label data-opt="a"><span class="opt-key">A</span> 25 ns</label>
<label data-opt="b"><span class="opt-key">B</span> 37 ns</label>
<label data-opt="c"><span class="opt-key">C</span> 75 ns</label>
<label data-opt="d"><span class="opt-key">D</span> 100 ns</label>
</div>
<details class="quiz-exp"><summary>Show Answer</summary><div class="quiz-exp-body"><strong>Answer: B — 37 ns.</strong></div></details>
</div>

<div class="quiz-block mcq arithmatex" data-answer="a">
<div class="quiz-meta"><span class="quiz-num">W2-A11</span><span class="quiz-tag">Assignment</span><span class="quiz-type">MCQ</span></div>
<p class="quiz-q">IRFB7545PbF — dV/dt limit for body diode V/ns:</p>
<div class="quiz-options">
<label data-opt="a"><span class="opt-key">A</span> 12 V/ns</label>
<label data-opt="b"><span class="opt-key">B</span> 6 V/ns</label>
<label data-opt="c"><span class="opt-key">C</span> 20 V/ns</label>
<label data-opt="d"><span class="opt-key">D</span> 4 V/ns</label>
</div>
<details class="quiz-exp"><summary>Show Answer</summary><div class="quiz-exp-body"><strong>Answer: A — 12 V/ns.</strong></div></details>
</div>

<div class="quiz-block mcq arithmatex" data-answer="a">
<div class="quiz-meta"><span class="quiz-num">W2-A12</span><span class="quiz-tag">Assignment</span><span class="quiz-type">MCQ</span></div>
<p class="quiz-q">IRFB7545PbF — typical $R_{\theta cs}$ °C/W:</p>
<div class="quiz-options">
<label data-opt="a"><span class="opt-key">A</span> 0.5°C/W</label>
<label data-opt="b"><span class="opt-key">B</span> 1.0°C/W</label>
<label data-opt="c"><span class="opt-key">C</span> 1.21°C/W</label>
<label data-opt="d"><span class="opt-key">D</span> 0.1°C/W</label>
</div>
<details class="quiz-exp"><summary>Show Answer</summary><div class="quiz-exp-body"><strong>Answer: A — 0.5°C/W.</strong></div></details>
</div>

<div class="quiz-block mcq arithmatex" data-answer="a">
<div class="quiz-meta"><span class="quiz-num">W2-A13</span><span class="quiz-tag">Assignment</span><span class="quiz-type">MCQ</span></div>
<p class="quiz-q">IRFB7545PbF — typical turn-ON time $t_{on}$ ns 1057H57:</p>
<div class="quiz-options">
<label data-opt="a"><span class="opt-key">A</span> 84 ns</label>
<label data-opt="b"><span class="opt-key">B</span> 12 ns</label>
<label data-opt="c"><span class="opt-key">C</span> 44 ns</label>
<label data-opt="d"><span class="opt-key">D</span> 150 ns</label>
</div>
<details class="quiz-exp"><summary>Show Answer</summary><div class="quiz-exp-body"><strong>Answer: A — 84 ns.</strong> Student entered 12 ns $incorrect$. Correct: 84 ns.</div></details>
</div>

<div class="quiz-block mcq arithmatex" data-answer="a">
<div class="quiz-meta"><span class="quiz-num">W2-A14</span><span class="quiz-tag">Assignment</span><span class="quiz-type">MCQ</span></div>
<p class="quiz-q">IRFB7545PbF — $R_{\theta jc}$ °C/W:</p>
<div class="quiz-options">
<label data-opt="a"><span class="opt-key">A</span> 1.21°C/W</label>
<label data-opt="b"><span class="opt-key">B</span> 0.5°C/W</label>
<label data-opt="c"><span class="opt-key">C</span> 2.0°C/W</label>
<label data-opt="d"><span class="opt-key">D</span> 0.8°C/W</label>
</div>
<details class="quiz-exp"><summary>Show Answer</summary><div class="quiz-exp-body"><strong>Answer: A — 1.21°C/W.</strong></div></details>
</div>

<div class="quiz-block mcq arithmatex" data-answer="b">
<div class="quiz-meta"><span class="quiz-num">W2-A15</span><span class="quiz-tag">Assignment</span><span class="quiz-type">MCQ</span></div>
<p class="quiz-q">Typical $I_{rr}$ at 125°C for IRFB7545PbF $(Q_{rr}=97\,nC$, $t_{rr}=75\,ns$) is:</p>
<div class="quiz-options">
<label data-opt="a"><span class="opt-key">A</span> 1.3 A</label>
<label data-opt="b"><span class="opt-key">B</span> 2.6 A</label>
<label data-opt="c"><span class="opt-key">C</span> 5.0 A</label>
<label data-opt="d"><span class="opt-key">D</span> 0.65 A</label>
</div>
<details class="quiz-exp"><summary>Show Answer</summary><div class="quiz-exp-body"><strong>Answer: B — 2.6 A.</strong> $I_{rr} = 2Q_{rr}/t_{rr} = 2\times97/75 = 2.59 \approx 2.6\,A$.</div></details>
</div>

<div class="quiz-block mcq arithmatex" data-answer="c">
<div class="quiz-meta"><span class="quiz-num">W2-A16</span><span class="quiz-tag">Assignment</span><span class="quiz-type">MCQ</span></div>
<p class="quiz-q">Devices in ascending order of switching speed:</p>
<div class="quiz-options">
<label data-opt="a"><span class="opt-key">A</span> Schottky &lt; Fast Recovery &lt; Rectifier</label>
<label data-opt="b"><span class="opt-key">B</span> Fast Recovery &lt; Schottky &lt; Rectifier</label>
<label data-opt="c"><span class="opt-key">C</span> Rectifier &lt; Fast Recovery &lt; Schottky</label>
<label data-opt="d"><span class="opt-key">D</span> All equal speed</label>
</div>
<details class="quiz-exp"><summary>Show Answer</summary><div class="quiz-exp-body"><strong>Answer: C.</strong> Slowest to fastest: Rectifier → Fast Recovery → Schottky.</div></details>
</div>

<div class="quiz-block mcq arithmatex" data-answer="b">
<div class="quiz-meta"><span class="quiz-num">W2-A17</span><span class="quiz-tag">Assignment</span><span class="quiz-type">MCQ</span></div>
<p class="quiz-q">IGBT and MOSFET are:</p>
<div class="quiz-options">
<label data-opt="a"><span class="opt-key">A</span> Unidirectional current, bipolar voltage</label>
<label data-opt="b"><span class="opt-key">B</span> Bidirectional current, unipolar voltage</label>
<label data-opt="c"><span class="opt-key">C</span> Bidirectional current, bipolar voltage</label>
<label data-opt="d"><span class="opt-key">D</span> Unidirectional current, unipolar voltage</label>
</div>
<details class="quiz-exp"><summary>Show Answer</summary><div class="quiz-exp-body"><strong>Answer: B.</strong> Bidirectional current (MOSFET body diode; IGBT anti-parallel diode) but unipolar voltage (only block one polarity of $V_{DS}/V_{CE}$).</div></details>
</div>

<div class="quiz-block msq arithmatex" data-answers="b,d">
<div class="quiz-meta"><span class="quiz-num">W2-A18</span><span class="quiz-tag">Assignment</span><span class="quiz-type">MSQ</span></div>
<p class="quiz-q">Which are TRUE about MOSFET vs BJT? $Select ALL that apply$</p>
<div class="quiz-options">
<label data-opt="a"><span class="opt-key">A</span> On-state voltage drop of MOSFET is lower than BJT</label>
<label data-opt="b"><span class="opt-key">B</span> On-state voltage drop of MOSFET is higher than BJT</label>
<label data-opt="c"><span class="opt-key">C</span> MOSFET has higher switching loss and lower conduction loss than BJT</label>
<label data-opt="d"><span class="opt-key">D</span> MOSFET has lower switching loss and higher conduction loss than BJT</label>
</div>
<button class="quiz-check">Check Answers</button>
<details class="quiz-exp"><summary>Show Answer</summary><div class="quiz-exp-body"><strong>Answers: B, D.</strong> MOSFET majority carrier → higher $R_{DS(on)}$ → higher conduction loss than BJT $V_{CE(sat)}$. But MOSFET faster → lower switching loss.</div></details>
</div>

<div class="quiz-block msq arithmatex" data-answers="b,d">
<div class="quiz-meta"><span class="quiz-num">W2-A19</span><span class="quiz-tag">Assignment</span><span class="quiz-type">MSQ</span></div>
<p class="quiz-q">Which are TRUE about device control? $Select ALL that apply$</p>
<div class="quiz-options">
<label data-opt="a"><span class="opt-key">A</span> IGBT is current-controlled</label>
<label data-opt="b"><span class="opt-key">B</span> BJT is current-controlled</label>
<label data-opt="c"><span class="opt-key">C</span> IGBT and MOSFET are current-controlled</label>
<label data-opt="d"><span class="opt-key">D</span> IGBT and MOSFET are voltage-controlled</label>
</div>
<button class="quiz-check">Check Answers</button>
<details class="quiz-exp"><summary>Show Answer</summary><div class="quiz-exp-body"><strong>Answers: B, D.</strong> BJT: current-controlled $base current$. IGBT and MOSFET: voltage-controlled $MOS gate$.</div></details>
</div>

<div class="quiz-block mcq arithmatex" data-answer="b">
<div class="quiz-meta"><span class="quiz-num">W2-A20</span><span class="quiz-tag">Assignment</span><span class="quiz-type">MCQ</span></div>
<p class="quiz-q">The softness factor S for a fast recovery diode is:</p>
<div class="quiz-options">
<label data-opt="a"><span class="opt-key">A</span> Equal to zero</label>
<label data-opt="b"><span class="opt-key">B</span> Less than one</label>
<label data-opt="c"><span class="opt-key">C</span> Equal to one</label>
<label data-opt="d"><span class="opt-key">D</span> Greater than one</label>
</div>
<details class="quiz-exp"><summary>Show Answer</summary><div class="quiz-exp-body"><strong>Answer: B — less than one.</strong> Fast recovery = "snappy" = S &lt; 1. Hard abrupt current cutoff.</div></details>
</div>

---

## Week 3 — Gate Drivers

### Assignment Questions

<div class="quiz-block mcq arithmatex" data-answer="a">
<div class="quiz-meta"><span class="quiz-num">W3-A1</span><span class="quiz-tag">Assignment</span><span class="quiz-type">MCQ</span></div>
<p class="quiz-q">HCPL-3180 — high peak output current $A$:</p>
<div class="quiz-options">
<label data-opt="a"><span class="opt-key">A</span> 2.5 A</label>
<label data-opt="b"><span class="opt-key">B</span> 1.5 A</label>
<label data-opt="c"><span class="opt-key">C</span> 5.0 A</label>
<label data-opt="d"><span class="opt-key">D</span> 0.5 A</label>
</div>
<details class="quiz-exp"><summary>Show Answer</summary><div class="quiz-exp-body"><strong>Answer: A — 2.5 A.</strong></div></details>
</div>

<div class="quiz-block mcq arithmatex" data-answer="b">
<div class="quiz-meta"><span class="quiz-num">W3-A2</span><span class="quiz-tag">Assignment</span><span class="quiz-type">MCQ</span></div>
<p class="quiz-q">HCPL-3180 — absolute maximum supply voltage $V$:</p>
<div class="quiz-options">
<label data-opt="a"><span class="opt-key">A</span> 15 V</label>
<label data-opt="b"><span class="opt-key">B</span> 25 V</label>
<label data-opt="c"><span class="opt-key">C</span> 30 V</label>
<label data-opt="d"><span class="opt-key">D</span> 20 V</label>
</div>
<details class="quiz-exp"><summary>Show Answer</summary><div class="quiz-exp-body"><strong>Answer: B — 25 V.</strong></div></details>
</div>

<div class="quiz-block mcq arithmatex" data-answer="c">
<div class="quiz-meta"><span class="quiz-num">W3-A3</span><span class="quiz-tag">Assignment</span><span class="quiz-type">MCQ</span></div>
<p class="quiz-q">HCPL-3180 — maximum output power dissipation $mW$:</p>
<div class="quiz-options">
<label data-opt="a"><span class="opt-key">A</span> 100 mW</label>
<label data-opt="b"><span class="opt-key">B</span> 500 mW</label>
<label data-opt="c"><span class="opt-key">C</span> 250 mW</label>
<label data-opt="d"><span class="opt-key">D</span> 1000 mW</label>
</div>
<details class="quiz-exp"><summary>Show Answer</summary><div class="quiz-exp-body"><strong>Answer: C — 250 mW.</strong></div></details>
</div>

<div class="quiz-block mcq arithmatex" data-answer="b">
<div class="quiz-meta"><span class="quiz-num">W3-A4</span><span class="quiz-tag">Assignment</span><span class="quiz-type">MCQ</span></div>
<p class="quiz-q">HCPL-3180 — average input current $mA$:</p>
<div class="quiz-options">
<label data-opt="a"><span class="opt-key">A</span> 10 mA</label>
<label data-opt="b"><span class="opt-key">B</span> 25 mA</label>
<label data-opt="c"><span class="opt-key">C</span> 50 mA</label>
<label data-opt="d"><span class="opt-key">D</span> 5 mA</label>
</div>
<details class="quiz-exp"><summary>Show Answer</summary><div class="quiz-exp-body"><strong>Answer: B — 25 mA.</strong></div></details>
</div>

<div class="quiz-block mcq arithmatex" data-answer="b">
<div class="quiz-meta"><span class="quiz-num">W3-A5</span><span class="quiz-tag">Assignment</span><span class="quiz-type">MCQ</span></div>
<p class="quiz-q">HCPL-3180 — maximum input forward voltage $V_F$ $V$:</p>
<div class="quiz-options">
<label data-opt="a"><span class="opt-key">A</span> 1.2 V</label>
<label data-opt="b"><span class="opt-key">B</span> 1.8 V</label>
<label data-opt="c"><span class="opt-key">C</span> 2.5 V</label>
<label data-opt="d"><span class="opt-key">D</span> 0.7 V</label>
</div>
<details class="quiz-exp"><summary>Show Answer</summary><div class="quiz-exp-body"><strong>Answer: B — 1.8 V.</strong></div></details>
</div>

<div class="quiz-block mcq arithmatex" data-answer="a">
<div class="quiz-meta"><span class="quiz-num">W3-A6</span><span class="quiz-tag">Assignment</span><span class="quiz-type">MCQ</span></div>
<p class="quiz-q">HCPL-3180 — threshold input voltage $V_{FHL}$ $V$:</p>
<div class="quiz-options">
<label data-opt="a"><span class="opt-key">A</span> 0.8 V</label>
<label data-opt="b"><span class="opt-key">B</span> 1.2 V</label>
<label data-opt="c"><span class="opt-key">C</span> 1.8 V</label>
<label data-opt="d"><span class="opt-key">D</span> 0.5 V</label>
</div>
<details class="quiz-exp"><summary>Show Answer</summary><div class="quiz-exp-body"><strong>Answer: A — 0.8 V.</strong></div></details>
</div>

<div class="quiz-block mcq arithmatex" data-answer="b">
<div class="quiz-meta"><span class="quiz-num">W3-A7</span><span class="quiz-tag">Assignment</span><span class="quiz-type">MCQ</span></div>
<p class="quiz-q">HCPL-3180 — typical propagation delays $t_{PLH}$ and $t_{PHL}$ ns:</p>
<div class="quiz-options">
<label data-opt="a"><span class="opt-key">A</span> 100 ns each</label>
<label data-opt="b"><span class="opt-key">B</span> 150 ns each</label>
<label data-opt="c"><span class="opt-key">C</span> 200 ns each</label>
<label data-opt="d"><span class="opt-key">D</span> 50 ns each</label>
</div>
<details class="quiz-exp"><summary>Show Answer</summary><div class="quiz-exp-body"><strong>Answer: B — 150 ns each.</strong></div></details>
</div>

<div class="quiz-block mcq arithmatex" data-answer="b">
<div class="quiz-meta"><span class="quiz-num">W3-A8</span><span class="quiz-tag">Assignment</span><span class="quiz-type">MCQ</span></div>
<p class="quiz-q">HCPL-3180 — maximum low-level output voltage $V_{OL}$:</p>
<div class="quiz-options">
<label data-opt="a"><span class="opt-key">A</span> 500 V</label>
<label data-opt="b"><span class="opt-key">B</span> 0.5 V</label>
<label data-opt="c"><span class="opt-key">C</span> 5 V</label>
<label data-opt="d"><span class="opt-key">D</span> 50 mV</label>
</div>
<details class="quiz-exp"><summary>Show Answer</summary><div class="quiz-exp-body"><strong>Answer: B — 0.5 V.</strong> Common trap: assignment listed "500" with unit "mV" — correct answer is 0.5 V.</div></details>
</div>

<div class="quiz-block mcq arithmatex" data-answer="b">
<div class="quiz-meta"><span class="quiz-num">W3-A9</span><span class="quiz-tag">Assignment</span><span class="quiz-type">MCQ</span></div>
<p class="quiz-q">Minimum R to limit HCPL-3180 input current to 25 mA, with $V_p=5\,V$, $V_{F,max}=1.8\,V$:</p>
<div class="quiz-options">
<label data-opt="a"><span class="opt-key">A</span> 72 Ω</label>
<label data-opt="b"><span class="opt-key">B</span> 128 Ω</label>
<label data-opt="c"><span class="opt-key">C</span> 200 Ω</label>
<label data-opt="d"><span class="opt-key">D</span> 32 Ω</label>
</div>
<details class="quiz-exp"><summary>Show Answer</summary><div class="quiz-exp-body"><strong>Answer: B — 128 Ω.</strong> $R = (V_p - V_{F,max})/I_F = (5-1.8)/0.025 = 128\,\Omega$.</div></details>
</div>

<div class="quiz-block msq arithmatex" data-answers="a,b,c,d">
<div class="quiz-meta"><span class="quiz-num">W3-A10</span><span class="quiz-tag">Assignment</span><span class="quiz-type">MSQ</span></div>
<p class="quiz-q">Requirements of a gate driver $Select ALL that apply$:</p>
<div class="quiz-options">
<label data-opt="a"><span class="opt-key">A</span> Meet voltage and current requirement of gate-emitter/source region</label>
<label data-opt="b"><span class="opt-key">B</span> Provide isolation</label>
<label data-opt="c"><span class="opt-key">C</span> Able to work with floating supply</label>
<label data-opt="d"><span class="opt-key">D</span> Level shifting</label>
</div>
<button class="quiz-check">Check Answers</button>
<details class="quiz-exp"><summary>Show Answer</summary><div class="quiz-exp-body"><strong>Answers: A, B, C, D — ALL.</strong> Exact Q11 assignment answer. All four are gate driver requirements.</div></details>
</div>

---

## Week 4 — Gate Drivers & Snubbers

### Assignment Questions

<div class="quiz-block mcq arithmatex" data-answer="a">
<div class="quiz-meta"><span class="quiz-num">W4-A1</span><span class="quiz-tag">Assignment</span><span class="quiz-type">MCQ</span></div>
<p class="quiz-q">A floating supply is required for which switch in one H-bridge leg?</p>
<div class="quiz-options">
<label data-opt="a"><span class="opt-key">A</span> High side</label>
<label data-opt="b"><span class="opt-key">B</span> Low side</label>
<label data-opt="c"><span class="opt-key">C</span> Both</label>
<label data-opt="d"><span class="opt-key">D</span> Neither</label>
</div>
<details class="quiz-exp"><summary>Show Answer</summary><div class="quiz-exp-body"><strong>Answer: A — High side.</strong></div></details>
</div>

<div class="quiz-block msq arithmatex" data-answers="a,b,c">
<div class="quiz-meta"><span class="quiz-num">W4-A2</span><span class="quiz-tag">Assignment</span><span class="quiz-type">MSQ</span></div>
<p class="quiz-q">Bootstrap method can be used in: $Select ALL that apply$</p>
<div class="quiz-options">
<label data-opt="a"><span class="opt-key">A</span> Buck converters</label>
<label data-opt="b"><span class="opt-key">B</span> H-Bridge converters</label>
<label data-opt="c"><span class="opt-key">C</span> Any converter with leg-type arrangement</label>
<label data-opt="d"><span class="opt-key">D</span> None of the above</label>
</div>
<button class="quiz-check">Check Answers</button>
<details class="quiz-exp"><summary>Show Answer</summary><div class="quiz-exp-body"><strong>Answers: A, B, C.</strong> Bootstrap works in any leg-type topology where lower switch toggles.</div></details>
</div>

<div class="quiz-block mcq arithmatex" data-answer="a">
<div class="quiz-meta"><span class="quiz-num">W4-A3</span><span class="quiz-tag">Assignment</span><span class="quiz-type">MCQ</span></div>
<p class="quiz-q">Main role of a snubber:</p>
<div class="quiz-options">
<label data-opt="a"><span class="opt-key">A</span> Reduce voltage spikes during turn-ON and turn-OFF</label>
<label data-opt="b"><span class="opt-key">B</span> Reduce conduction losses</label>
<label data-opt="c"><span class="opt-key">C</span> Reduce inductor size</label>
<label data-opt="d"><span class="opt-key">D</span> Change converter voltage gain</label>
</div>
<details class="quiz-exp"><summary>Show Answer</summary><div class="quiz-exp-body"><strong>Answer: A.</strong></div></details>
</div>

<div class="quiz-block mcq arithmatex" data-answer="a">
<div class="quiz-meta"><span class="quiz-num">W4-A4</span><span class="quiz-tag">Assignment</span><span class="quiz-type">MCQ</span></div>
<p class="quiz-q">In an RCD snubber, the capacitor charges during device turn:</p>
<div class="quiz-options">
<label data-opt="a"><span class="opt-key">A</span> OFF</label>
<label data-opt="b"><span class="opt-key">B</span> ON</label>
</div>
<details class="quiz-exp"><summary>Show Answer</summary><div class="quiz-exp-body"><strong>Answer: A — OFF.</strong></div></details>
</div>

<div class="quiz-block mcq arithmatex" data-answer="b">
<div class="quiz-meta"><span class="quiz-num">W4-A5</span><span class="quiz-tag">Assignment</span><span class="quiz-type">MCQ</span></div>
<p class="quiz-q">In an RCD snubber, the capacitor discharges during device turn:</p>
<div class="quiz-options">
<label data-opt="a"><span class="opt-key">A</span> OFF</label>
<label data-opt="b"><span class="opt-key">B</span> ON</label>
</div>
<details class="quiz-exp"><summary>Show Answer</summary><div class="quiz-exp-body"><strong>Answer: B — ON.</strong></div></details>
</div>

<div class="quiz-block msq arithmatex" data-answers="a,b,c,d">
<div class="quiz-meta"><span class="quiz-num">W4-A6</span><span class="quiz-tag">Assignment</span><span class="quiz-type">MSQ</span></div>
<p class="quiz-q">Additional benefits of snubbers apart from spike reduction: $Select ALL that apply$</p>
<div class="quiz-options">
<label data-opt="a"><span class="opt-key">A</span> Limit dV/dt and dI/dt during transitions</label>
<label data-opt="b"><span class="opt-key">B</span> Shape switching trajectory within SOA</label>
<label data-opt="c"><span class="opt-key">C</span> Reduce device stress</label>
<label data-opt="d"><span class="opt-key">D</span> Reduce ringing during switching</label>
</div>
<button class="quiz-check">Check Answers</button>
<details class="quiz-exp"><summary>Show Answer</summary><div class="quiz-exp-body"><strong>Answers: A, B, C, D — ALL.</strong></div></details>
</div>

<div class="quiz-block mcq arithmatex" data-answer="a">
<div class="quiz-meta"><span class="quiz-num">W4-A7</span><span class="quiz-tag">Assignment</span><span class="quiz-type">MCQ</span></div>
<p class="quiz-q">Which snubber has the lowest switching loss?</p>
<div class="quiz-options">
<label data-opt="a"><span class="opt-key">A</span> Small snubber (smaller $C_s$)</label>
<label data-opt="b"><span class="opt-key">B</span> Normal snubber (larger $C_s$)</label>
<label data-opt="c"><span class="opt-key">C</span> Both equal</label>
<label data-opt="d"><span class="opt-key">D</span> Neither</label>
</div>
<details class="quiz-exp"><summary>Show Answer</summary><div class="quiz-exp-body"><strong>Answer: A — small.</strong> Exact fill-in-blank answer from assignment. Smaller $C_s$ → less energy $\frac{1}{2}C_s V^2$) dissipated per cycle.</div></details>
</div>

---

## Week 5 — Thermal Design

### Assignment Questions

<div class="quiz-block mcq arithmatex" data-answer="c">
<div class="quiz-meta"><span class="quiz-num">W5-A1</span><span class="quiz-tag">Assignment</span><span class="quiz-type">MCQ</span></div>
<p class="quiz-q">How does forced air cooling enhance heat sink performance?</p>
<div class="quiz-options">
<label data-opt="a"><span class="opt-key">A</span> Lowers thermal conductivity</label>
<label data-opt="b"><span class="opt-key">B</span> Reduces air circulation</label>
<label data-opt="c"><span class="opt-key">C</span> Makes heat sink more capable of dissipating heat</label>
<label data-opt="d"><span class="opt-key">D</span> Increases heat sink weight</label>
</div>
<details class="quiz-exp"><summary>Show Answer</summary><div class="quiz-exp-body"><strong>Answer: C.</strong> Forced air increases convective coefficient → lower $R_{\theta sa}$ → higher power dissipation at same temperature rise.</div></details>
</div>

<div class="quiz-block mcq arithmatex" data-answer="c">
<div class="quiz-meta"><span class="quiz-num">W5-A2</span><span class="quiz-tag">Assignment</span><span class="quiz-type">MCQ</span></div>
<p class="quiz-q">Primary factor impacting heat sink effectiveness:</p>
<div class="quiz-options">
<label data-opt="a"><span class="opt-key">A</span> Weight</label>
<label data-opt="b"><span class="opt-key">B</span> Size alone</label>
<label data-opt="c"><span class="opt-key">C</span> Thermal conductivity and surface area</label>
<label data-opt="d"><span class="opt-key">D</span> Color</label>
</div>
<details class="quiz-exp"><summary>Show Answer</summary><div class="quiz-exp-body"><strong>Answer: C.</strong></div></details>
</div>

---

### Additional W5 Practice

<div class="quiz-block mcq arithmatex" data-answer="a">
<div class="quiz-meta"><span class="quiz-num">W5-P1</span><span class="quiz-tag">W5·GATE</span><span class="quiz-type">MCQ</span></div>
<p class="quiz-q">MOSFET switching loss — when switching frequency doubles $all else same$:</p>
<div class="quiz-options">
<label data-opt="a"><span class="opt-key">A</span> Doubles</label>
<label data-opt="b"><span class="opt-key">B</span> Quadruples</label>
<label data-opt="c"><span class="opt-key">C</span> Stays same</label>
<label data-opt="d"><span class="opt-key">D</span> Halves</label>
</div>
<details class="quiz-exp"><summary>Show Answer</summary><div class="quiz-exp-body"><strong>Answer: A — doubles.</strong> $P_{sw} \propto f_s$. Linear relationship. $Compare: voltage ripple $\propto 1/f_s^2$ — reduces by 4×.)</div></details>
</div>

<div class="quiz-block mcq arithmatex" data-answer="b">
<div class="quiz-meta"><span class="quiz-num">W5-P2</span><span class="quiz-tag">W5·GATE</span><span class="quiz-type">MCQ</span></div>
<p class="quiz-q">A device dissipates 8 W. $R_{\theta jc}=1.5°C/W$, $R_{\theta cs}=0.5°C/W$, $R_{\theta sa}=8°C/W$, $T_a=30°C$. Junction temperature is:</p>
<div class="quiz-options">
<label data-opt="a"><span class="opt-key">A</span> 110°C</label>
<label data-opt="b"><span class="opt-key">B</span> 110°C</label>
<label data-opt="c"><span class="opt-key">C</span> 80°C</label>
<label data-opt="d"><span class="opt-key">D</span> 140°C</label>
</div>
<details class="quiz-exp"><summary>Show Answer</summary><div class="quiz-exp-body"><strong>Answer: B — 110°C.</strong> $T_j = 30 + 8\times(1.5+0.5+8) = 30 + 8\times10 = 30 + 80 = 110°C$.</div></details>
</div>

<div class="quiz-block msq arithmatex" data-answers="a,b,c">
<div class="quiz-meta"><span class="quiz-num">W5-P3</span><span class="quiz-tag">W5·GATE</span><span class="quiz-type">MSQ</span></div>
<p class="quiz-q">Which increase MOSFET conduction loss? $Select ALL that apply$</p>
<div class="quiz-options">
<label data-opt="a"><span class="opt-key">A</span> Higher junction temperature $positive temp coefficient of $R_{DS(on)}$)</label>
<label data-opt="b"><span class="opt-key">B</span> Higher load current</label>
<label data-opt="c"><span class="opt-key">C</span> Higher duty cycle D</label>
<label data-opt="d"><span class="opt-key">D</span> Higher switching frequency</label>
</div>
<button class="quiz-check">Check Answers</button>
<details class="quiz-exp"><summary>Show Answer</summary><div class="quiz-exp-body"><strong>Answers: A, B, C.</strong> $P_{cond} = D \cdot I^2 \cdot R_{DS(on)}$. Frequency does not affect conduction loss — only switching loss.</div></details>
</div>

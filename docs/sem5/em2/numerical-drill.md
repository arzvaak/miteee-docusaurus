---
title: EM-2 Numerical Drill
description: Compact Electrical Machines II numerical practice by problem type.
---

# EM-2 Numerical Drill

Use this as a fast exam-day numerical reset. Each problem is one method type, followed immediately by the solution and a short checkpoint for similar questions.

## 1. Alternator Winding Factor and Generated EMF

**Concept type:** Slots, poles, pitch factor, distribution factor, turns per phase, phase EMF, line EMF.

**What this trains:** Converting machine data into $K_d$, $K_p$, $K_w$, $T_{ph}$ and $E = 4.44 f \phi T K_w$.

**Practice problem:** A 3-phase, 50 Hz, 1000 rpm, star-connected alternator has 72 armature slots, 6 conductors per slot and coil span of 10 slots. The flux per pole is $0.26\ \text{Wb}$. Find $K_d$, $K_p$, turns per phase, phase EMF and line EMF.

**Solution steps:**

$$
P = \frac{120f}{N} = \frac{120 \times 50}{1000} = 6
$$

Slots per pole $=72/6=12$, so slot angle

$$
\beta = \frac{180^\circ}{12} = 15^\circ
$$

Slots per pole per phase:

$$
q = \frac{72}{3 \times 6} = 4
$$

Distribution factor:

$$
K_d = \frac{\sin(q\beta/2)}{q\sin(\beta/2)}
    = \frac{\sin 30^\circ}{4\sin 7.5^\circ}
    = 0.958
$$

Full pitch is 12 slots, actual span is 10 slots, so short pitch is 2 slots:

$$
\alpha = 2 \times 15^\circ = 30^\circ,\qquad K_p = \cos(\alpha/2)=\cos 15^\circ=0.966
$$

$$
K_w = K_dK_p = 0.958 \times 0.966 = 0.925
$$

Total conductors $Z = 72 \times 6 = 432$. For a 3-phase double-layer winding:

$$
T_{ph} = \frac{Z}{2 \times 3} = 72
$$

$$
E_{ph} = 4.44 f\phi T_{ph}K_w
       = 4.44 \times 50 \times 0.26 \times 72 \times 0.925
       \approx 3844\ \text{V}
$$

$$
E_L = \sqrt{3}E_{ph} = 1.732 \times 3844 \approx 6659\ \text{V}
$$

**Final answer:** $K_d=0.958$, $K_p=0.966$, $T_{ph}=72$, $E_{ph}\approx 3.84\ \text{kV}$, $E_L\approx 6.66\ \text{kV}$.

**Method checkpoint:**
- Always find poles first from $N_s=120f/P$.
- Use slot angle in electrical degrees: $\beta=180^\circ/(\text{slots per pole})$.
- For star connection, $E_L=\sqrt{3}E_{ph}$.

## 2. Harmonic EMF and Harmonic Suppression

**Concept type:** Harmonic winding factors, short-pitch angle and resultant phase voltage.

**What this trains:** Applying $K_{dn}$ and $K_{pn}$ separately for the $n$th harmonic.

**Practice problem:** A 3-phase alternator has $q=2$ slots per pole per phase and a coil span of 5 slot pitches. The flux density wave has a fundamental and a third harmonic equal to 25% of the fundamental. Find the percentage increase in phase voltage due to the third harmonic.

**Solution steps:**

Slots per pole:

$$
3q = 3 \times 2 = 6
$$

$$
\beta = \frac{180^\circ}{6} = 30^\circ
$$

Full pitch is 6 slots, actual span is 5 slots, so the short-pitch angle is

$$
\alpha = 30^\circ
$$

Fundamental factors:

$$
K_{d1}=\frac{\sin(2 \times 15^\circ)}{2\sin 15^\circ}=0.9659,\qquad
K_{p1}=\cos 15^\circ=0.9659
$$

$$
K_{w1}=0.9659 \times 0.9659=0.933
$$

Third-harmonic factors:

$$
K_{d3}=\frac{\sin(2 \times 45^\circ)}{2\sin45^\circ}=0.7071,\qquad
K_{p3}=\cos45^\circ=0.7071
$$

$$
K_{w3}=0.7071 \times 0.7071=0.5
$$

The third-harmonic EMF ratio is

$$
\frac{E_3}{E_1}=0.25\frac{K_{w3}}{K_{w1}}
               =0.25\frac{0.5}{0.933}
               =0.134
$$

Resultant phase voltage:

$$
\frac{E}{E_1}=\sqrt{1+(0.134)^2}=1.00894
$$

Percentage increase:

$$
(1.00894-1)\times 100 = 0.894\%
$$

**Final answer:** Phase voltage increases by about $0.89\%$.

**Method checkpoint:**
- Use $n\beta$ inside $K_{dn}$ and $n\alpha$ inside $K_{pn}$.
- Harmonic EMFs add by RMS square root, not direct arithmetic.
- For suppression, set $K_{pn}=\cos(n\alpha/2)=0$.

## 3. Three-Phase Induction Motor Approximate Equivalent Circuit

**Concept type:** Approximate equivalent circuit, stator current, power factor, air-gap power, torque and gross efficiency.

**What this trains:** Separating exciting current from rotor-load current.

**Practice problem:** A 3-phase, 400 V, 50 Hz, 4-pole, star-connected induction motor has $Z_1=0.07+j0.3\ \Omega$, $Z_2'=0.08+j0.3\ \Omega$, $X_m=10\ \Omega$, $R_c=50\ \Omega$ per phase. At slip $s=0.04$, find stator current, power factor, developed torque and gross efficiency.

**Solution steps:**

$$
V_{ph}=\frac{400}{\sqrt{3}}=230.94\ \text{V}
$$

Rotor branch at slip:

$$
\frac{R_2'}{s}+jX_2'=\frac{0.08}{0.04}+j0.3=2+j0.3
$$

Series branch:

$$
Z_{ser}=Z_1+\frac{Z_2'}{s}=2.07+j0.6=2.156\angle16.2^\circ\ \Omega
$$

$$
I_2'=\frac{230.94}{2.156\angle16.2^\circ}
     =107.1\angle -16.2^\circ
     \approx 102.9-j29.8\ \text{A}
$$

Exciting current:

$$
Y_0=\frac{1}{50}-j\frac{1}{10}=0.02-j0.1
$$

$$
I_0=230.94(0.02-j0.1)=4.62-j23.09\ \text{A}
$$

Total stator current:

$$
I_1=I_0+I_2'=107.52-j52.89
$$

$$
|I_1|=119.8\ \text{A},\qquad \text{pf}=\frac{107.52}{119.8}=0.897\ \text{lagging}
$$

Synchronous speed and angular speed:

$$
N_s=\frac{120 \times 50}{4}=1500\ \text{rpm},\qquad
\omega_s=\frac{2\pi N_s}{60}=157.08\ \text{rad/s}
$$

Air-gap power:

$$
P_{ag}=3|I_2'|^2\frac{R_2'}{s}
      =3(107.1)^2(2)
      =68.82\ \text{kW}
$$

Developed torque:

$$
T=\frac{P_{ag}}{\omega_s}=\frac{68820}{157.08}=438\ \text{N m}
$$

Mechanical power developed:

$$
P_m=P_{ag}(1-s)=68.82(0.96)=66.07\ \text{kW}
$$

Input power:

$$
P_{in}=3V_{ph}|I_1|\text{pf}
      =3(230.94)(119.8)(0.897)
      =74.5\ \text{kW}
$$

$$
\eta_g=\frac{66.07}{74.5}=88.8\%
$$

**Final answer:** $I_1\approx119.8\ \text{A}$, pf $=0.897$ lagging, $T\approx438\ \text{N m}$, gross efficiency $\approx88.8\%$.

**Method checkpoint:**
- In the approximate circuit, the shunt branch is directly across $V_{ph}$.
- Use $R_2'/s$, not $R_2'$, for rotor input branch calculations.
- Developed torque uses $P_{ag}/\omega_s$, not shaft power over rotor speed.

## 4. Induction Motor Power Flow

**Concept type:** Slip, mechanical power developed, rotor copper loss, input and efficiency.

**What this trains:** Moving through $P_{ag}$, rotor copper loss, mechanical developed power and shaft output.

**Practice problem:** A 3-phase, 400 V, 50 Hz, 4-pole induction motor gives 15 HP shaft output at 1440 rpm. Stator losses are $800\ \text{W}$, and friction/windage torque is $5\ \text{N m}$. Find slip, rotor copper loss, input power and efficiency.

**Solution steps:**

$$
N_s=\frac{120f}{P}=\frac{120 \times 50}{4}=1500\ \text{rpm}
$$

$$
s=\frac{1500-1440}{1500}=0.04
$$

Shaft output:

$$
P_{out}=15 \times 746=11190\ \text{W}
$$

Friction and windage power:

$$
\omega_r=\frac{2\pi \times 1440}{60}=150.8\ \text{rad/s}
$$

$$
P_{fw}=T_{fw}\omega_r=5(150.8)=754\ \text{W}
$$

Mechanical power developed:

$$
P_m=P_{out}+P_{fw}=11190+754=11944\ \text{W}
$$

Since $P_m=(1-s)P_{ag}$:

$$
P_{ag}=\frac{11944}{0.96}=12442\ \text{W}
$$

Rotor copper loss:

$$
P_{rcl}=sP_{ag}=0.04(12442)=498\ \text{W}
$$

Input power:

$$
P_{in}=P_{ag}+\text{stator losses}=12442+800=13242\ \text{W}
$$

Efficiency:

$$
\eta=\frac{11190}{13242}=84.5\%
$$

**Final answer:** Slip $=4\%$, rotor copper loss $\approx498\ \text{W}$, input $\approx13.24\ \text{kW}$, efficiency $\approx84.5\%$.

**Method checkpoint:**
- Rotor copper loss is $sP_{ag}$.
- Mechanical power developed is $(1-s)P_{ag}$.
- Shaft output is after subtracting friction and windage losses.

## 5. Torque-Slip and Rotor Resistance Control

**Concept type:** Slip-ring motor speed control by external rotor resistance.

**What this trains:** Keeping full-load torque constant while changing speed.

**Practice problem:** A 10-pole, 50 Hz slip-ring induction motor runs at 580 rpm on full load. Rotor resistance is $0.3\ \Omega$ per phase. Find the external resistance per phase needed to reduce speed to 500 rpm at the same full-load torque.

**Solution steps:**

$$
N_s=\frac{120 \times 50}{10}=600\ \text{rpm}
$$

Initial slip:

$$
s_1=\frac{600-580}{600}=\frac{1}{30}
$$

Required slip:

$$
s_2=\frac{600-500}{600}=\frac{1}{6}
$$

For the same torque in the normal operating region:

$$
\frac{R_2}{s_1}=\frac{R_2+R_{ext}}{s_2}
$$

$$
R_{ext}=R_2\left(\frac{s_2}{s_1}-1\right)
       =0.3\left(\frac{1/6}{1/30}-1\right)
       =0.3(5-1)
       =1.2\ \Omega
$$

**Final answer:** Add $1.2\ \Omega$ per rotor phase.

**Method checkpoint:**
- At constant torque, slip is approximately proportional to total rotor resistance.
- This method is for slip-ring motors, not squirrel-cage motors.
- More rotor resistance gives lower speed and higher rotor copper loss.

## 6. Starter Current and Starting Torque

**Concept type:** DOL, star-delta and autotransformer starting torque/current ratios.

**What this trains:** Using starting current ratio and full-load slip to estimate starting torque.

**Practice problem:** A 3-phase induction motor takes 6 times full-load current when started DOL. Full-load slip is 4%. Find starting torque as a percentage of full-load torque for DOL and star-delta starting. If an autotransformer limits supply line current to 2 times full-load current, find tap setting and starting torque.

**Solution steps:**

For DOL:

$$
\frac{T_{st,DOL}}{T_{FL}}=\left(\frac{I_{st}}{I_{FL}}\right)^2s_{FL}
                         =6^2(0.04)=1.44
$$

So DOL starting torque is $144\%$ of full-load torque.

For star-delta starting, phase voltage is reduced by $1/\sqrt{3}$, so torque becomes one-third of DOL:

$$
T_{st,Y\Delta}=\frac{1}{3}(144\%)=48\%
$$

For autotransformer starting, if tap is $x$:

$$
I_{line,start}=x^2 I_{DOL}
$$

Given $I_{line,start}=2I_{FL}$ and $I_{DOL}=6I_{FL}$:

$$
x^2(6)=2,\qquad x=\sqrt{\frac{2}{6}}=0.577
$$

Starting torque is proportional to applied voltage squared:

$$
T_{st,auto}=x^2T_{st,DOL}=\frac{2}{6}(144\%)=48\%
$$

Motor current during autotransformer starting:

$$
I_{motor}=xI_{DOL}=0.577(6I_{FL})=3.46I_{FL}
$$

**Final answer:** DOL torque $=144\%$, star-delta torque $=48\%$, autotransformer tap $=57.7\%$, autotransformer starting torque $=48\%$, motor current $=3.46I_{FL}$ and supply line current $=2I_{FL}$.

**Method checkpoint:**
- Starting torque varies as voltage squared.
- Star-delta starting gives one-third DOL torque.
- In an autotransformer, supply line current is $x^2I_{DOL}$, but motor current is $xI_{DOL}$.

## 7. No-Load and Blocked-Rotor Test Interpretation

**Concept type:** Test-data reduction for induction-motor equivalent circuit and circle-diagram preparation.

**What this trains:** Converting line test readings into per-phase branch parameters.

**Practice problem:** A 3-phase, 400 V, delta-connected induction motor has $R_1=5\ \Omega$ per phase. No-load test: $400\ \text{V}$, $3.25\ \text{A}$, $232\ \text{W}$. Blocked-rotor test: $92\ \text{V}$, $7.5\ \text{A}$, $650\ \text{W}$. Determine $R_c$, $X_m$, $R_2'$, and leakage reactances assuming $X_1=X_2'$.

**Solution steps:**

For delta connection, $V_{ph}=V_L$ and $I_{ph}=I_L/\sqrt{3}$.

No-load test:

$$
V_{0ph}=400\ \text{V},\qquad I_{0ph}=\frac{3.25}{\sqrt{3}}=1.876\ \text{A}
$$

$$
P_{0ph}=\frac{232}{3}=77.33\ \text{W}
$$

Core-loss resistance:

$$
R_c=\frac{V_{0ph}^2}{P_{0ph}}=\frac{400^2}{77.33}=2069\ \Omega
$$

Working current:

$$
I_w=\frac{400}{2069}=0.193\ \text{A}
$$

Magnetising current:

$$
I_m=\sqrt{1.876^2-0.193^2}=1.865\ \text{A}
$$

$$
X_m=\frac{400}{1.865}=214.4\ \Omega
$$

Blocked-rotor test:

$$
V_{br,ph}=92\ \text{V},\qquad I_{br,ph}=\frac{7.5}{\sqrt{3}}=4.330\ \text{A}
$$

$$
P_{br,ph}=\frac{650}{3}=216.67\ \text{W}
$$

$$
R_{01}=\frac{P_{br,ph}}{I_{br,ph}^2}
      =\frac{216.67}{4.330^2}=11.56\ \Omega
$$

$$
Z_{01}=\frac{92}{4.330}=21.25\ \Omega
$$

$$
X_{01}=\sqrt{21.25^2-11.56^2}=17.82\ \Omega
$$

$$
R_2'=R_{01}-R_1=11.56-5=6.56\ \Omega
$$

Assuming equal leakage reactances:

$$
X_1=X_2'=\frac{17.82}{2}=8.91\ \Omega
$$

**Final answer:** $R_c\approx2069\ \Omega$, $X_m\approx214.4\ \Omega$, $R_2'\approx6.56\ \Omega$, $X_1=X_2'\approx8.91\ \Omega$.

**Method checkpoint:**
- Convert line values to phase values before using per-phase circuits.
- In blocked-rotor tests, neglect the magnetising branch.
- If no split is specified, take $X_1=X_2'=X_{01}/2$.

## 8. Single-Phase Induction Motor Equivalent Circuit

**Concept type:** Double revolving field circuit, forward/backward slips, input current, output power and efficiency.

**What this trains:** Treating a single-phase motor as forward and backward field branches.

**Practice problem:** A 240 V, 50 Hz, 2-pole single-phase induction motor has $r_1=2.2\ \Omega$, $x_1=3\ \Omega$, $r_2'=3.8\ \Omega$, $x_2'=2.1\ \Omega$, $x_m=86\ \Omega$. Friction, windage and core losses are $50\ \text{W}$. At full-load speed 2820 rpm, find input current, power factor, output power and efficiency.

**Solution steps:**

$$
N_s=\frac{120f}{P}=\frac{120 \times 50}{2}=3000\ \text{rpm}
$$

Forward slip:

$$
s_f=\frac{3000-2820}{3000}=0.06
$$

Backward slip:

$$
s_b=2-s_f=1.94
$$

Using the standard double-field approximate circuit:

$$
Z_f=\left(j\frac{x_m}{2}\right)\parallel\left(\frac{r_2'}{2s_f}+j\frac{x_2'}{2}\right)
    \approx 19.89+j15.33\ \Omega
$$

$$
Z_b=\left(j\frac{x_m}{2}\right)\parallel\left(\frac{r_2'}{2s_b}+j\frac{x_2'}{2}\right)
    \approx 0.933+j1.046\ \Omega
$$

Total input impedance:

$$
Z_{in}=r_1+jx_1+Z_f+Z_b
      =23.03+j19.37\ \Omega
$$

Input current:

$$
I=\frac{240}{|Z_{in}|}=\frac{240}{30.10}=7.98\ \text{A}
$$

Power factor:

$$
\cos\phi=\frac{23.03}{30.10}=0.765\ \text{lagging}
$$

Input power:

$$
P_{in}=VI\cos\phi=240(7.98)(0.765)=1465\ \text{W}
$$

The branch calculation gives approximately

$$
P_{ag,f}=1265.5\ \text{W},\qquad P_{ag,b}=59.3\ \text{W}
$$

Mechanical power developed:

$$
P_m=(1-s_f)(P_{ag,f}-P_{ag,b})
    =0.94(1265.5-59.3)=1134\ \text{W}
$$

Output power:

$$
P_{out}=P_m-50=1084\ \text{W}
$$

Efficiency:

$$
\eta=\frac{1084}{1465}=74.0\%
$$

**Final answer:** Input current $\approx7.98\ \text{A}$, pf $\approx0.765$ lagging, output power $\approx1.08\ \text{kW}$, efficiency $\approx74.0\%$.

**Method checkpoint:**
- Forward slip is $s$; backward slip is $2-s$.
- Each field branch uses half the magnetising reactance and half the rotor leakage values.
- Net mechanical power comes from forward field power minus backward field power.

## 9. Alternator Voltage Regulation by Synchronous Impedance

**Concept type:** Rated current, per-phase voltage, excitation EMF and voltage regulation.

**What this trains:** Building the generator phasor $E=V+I(R_a+jX_s)$.

**Practice problem:** A 3-phase, star-connected alternator is rated $1600\ \text{kVA}$, $13.5\ \text{kV}$. Its per-phase armature resistance is $1\ \Omega$ and synchronous reactance is $40\ \Omega$. Find voltage regulation at $1250\ \text{kW}$, 0.8 pf lagging.

**Solution steps:**

Load apparent power:

$$
S=\frac{1250}{0.8}=1562.5\ \text{kVA}
$$

Line current:

$$
I=\frac{1562.5\times10^3}{\sqrt{3}\times13500}=66.82\ \text{A}
$$

Phase voltage:

$$
V_{ph}=\frac{13500}{\sqrt{3}}=7794.23\ \text{V}
$$

For 0.8 lagging pf:

$$
\phi=\cos^{-1}(0.8)=36.87^\circ
$$

Take $V$ as reference and $I=66.82\angle -36.87^\circ$. Then

$$
E=V+I(1+j40)
$$

Resolving:

$$
E \approx 9451.4+j2098.2\ \text{V}
$$

$$
|E|=9681.5\ \text{V}
$$

Voltage regulation:

$$
\%\text{Reg}=\frac{|E|-V_{ph}}{V_{ph}}\times100
             =\frac{9681.5-7794.2}{7794.2}\times100
             =24.2\%
$$

**Final answer:** Voltage regulation $\approx24.2\%$.

**Method checkpoint:**
- Use phase voltage for star-connected alternators.
- Lagging current has negative angle when $V$ is reference.
- For leading pf, the sign of the reactive component changes and regulation can fall or become negative.

## 10. Infinite-Bus Excitation Change

**Concept type:** Constant real power, increased excitation, new current/power factor and maximum power.

**What this trains:** Holding $EV\sin\delta/X_s$ constant when prime mover input is constant.

**Practice problem:** A turbo alternator with $X_s=10\ \Omega$ delivers $200\ \text{A}$ at unity pf to an 11 kV infinite bus. Armature resistance is neglected. If excitation is increased by 20% while prime mover input is constant, find new current and pf. Then find maximum power at the increased excitation.

**Solution steps:**

$$
V_{ph}=\frac{11000}{\sqrt{3}}=6350.85\ \text{V}
$$

Initial condition at UPF:

$$
E_1=V+jX_sI=6350.85+j(10)(200)
$$

$$
|E_1|=6658.3\ \text{V},\qquad \delta_1=\tan^{-1}\frac{2000}{6350.85}=17.48^\circ
$$

Increased excitation:

$$
E_2=1.2E_1=7989.99\ \text{V}
$$

Prime mover power is constant, so

$$
E_1\sin\delta_1=E_2\sin\delta_2
$$

$$
\sin\delta_2=\frac{6658.3\sin17.48^\circ}{7989.99}=0.2504
$$

$$
\delta_2=14.50^\circ
$$

New current:

$$
I_2=\frac{E_2\angle\delta_2-V}{jX_s}
$$

Numerically,

$$
I_2\approx 200-j138.5\ \text{A}
$$

$$
|I_2|=243.3\ \text{A},\qquad \text{pf}=\frac{200}{243.3}=0.822\ \text{lagging}
$$

Maximum power at increased excitation:

$$
P_{max}=\frac{3V_{ph}E_2}{X_s}
       =\frac{3(6350.85)(7989.99)}{10}
       =15.22\ \text{MW}
$$

At maximum power, $\delta=90^\circ$:

$$
I_{max}=\frac{jE_2-V}{jX_s}\approx799+j635\ \text{A}
$$

$$
|I_{max}|=1021\ \text{A},\qquad \text{pf}=0.783\ \text{leading}
$$

**Final answer:** After 20% excitation increase, $I\approx243\ \text{A}$ at $0.822$ lagging pf. Maximum power is $\approx15.22\ \text{MW}$, with current $\approx1021\ \text{A}$ at $0.783$ leading pf.

**Method checkpoint:**
- Infinite bus means $V$ and frequency stay fixed.
- Constant prime mover input means real power stays fixed.
- Increasing excitation changes reactive power and power factor first; it does not automatically change real power.

## 11. Salient-Pole Two-Reaction Numerical

**Concept type:** $I_d$, $I_q$, excitation EMF, voltage regulation, electromagnetic power and reluctance power.

**What this trains:** Using $X_d$ and $X_q$ instead of one synchronous reactance.

**Practice problem:** A 3-phase, 20 MVA, 11 kV, star-connected salient-pole alternator has $X_d=4\ \Omega$, $X_q=3\ \Omega$ and negligible armature resistance. At full load, 0.8 pf lagging, find $I_d$, $I_q$, excitation EMF, regulation, electromagnetic power and reluctance power.

**Solution steps:**

$$
V_{ph}=\frac{11000}{\sqrt{3}}=6350.85\ \text{V}
$$

$$
I_a=\frac{20\times10^6}{\sqrt{3}\times11000}=1049.73\ \text{A}
$$

$$
\phi=\cos^{-1}(0.8)=36.87^\circ
$$

For lagging load:

$$
\tan\delta=\frac{X_qI_a\cos\phi}{V_{ph}+X_qI_a\sin\phi}
$$

$$
\tan\delta=\frac{3(1049.73)(0.8)}{6350.85+3(1049.73)(0.6)}
           =0.3057
$$

$$
\delta=17.0^\circ
$$

Current components:

$$
I_d=I_a\sin(\phi+\delta)=1049.73\sin53.87^\circ=847.9\ \text{A}
$$

$$
I_q=I_a\cos(\phi+\delta)=1049.73\cos53.87^\circ=618.9\ \text{A}
$$

Excitation EMF:

$$
E_f=V_{ph}\cos\delta+X_dI_d
   =6350.85\cos17^\circ+4(847.9)
   =9466\ \text{V/phase}
$$

Line value:

$$
E_L=\sqrt{3}E_f=16.39\ \text{kV}
$$

Regulation:

$$
\%\text{Reg}=\frac{9466-6350.85}{6350.85}\times100=49.0\%
$$

Since $R_a=0$:

$$
P_{em}=P_{out}=20(0.8)=16\ \text{MW}
$$

Reluctance power:

$$
P_{rel}=\frac{3V_{ph}^2}{2}\left(\frac{1}{X_q}-\frac{1}{X_d}\right)\sin2\delta
$$

$$
P_{rel}=1.5(6350.85)^2\left(\frac{1}{3}-\frac{1}{4}\right)\sin34^\circ
       =2.82\ \text{MW}
$$

**Final answer:** $I_d\approx847.9\ \text{A}$, $I_q\approx618.9\ \text{A}$, $E_f\approx9.466\ \text{kV/phase}$ or $16.39\ \text{kV line}$, regulation $\approx49.0\%$, $P_{em}=16\ \text{MW}$, $P_{rel}\approx2.82\ \text{MW}$.

**Method checkpoint:**
- Locate $\delta$ using $X_q$, not $X_d$.
- Use $I_d=I\sin(\phi+\delta)$ and $I_q=I\cos(\phi+\delta)$ for lagging generator load.
- Reluctance power exists only because $X_d\neq X_q$.

## 12. Synchronous Motor Power-Factor Correction

**Concept type:** kW/kVAR bookkeeping, target power factor, motor kVA and motor power factor.

**What this trains:** Treating an over-excited synchronous motor as a leading kVAR supplier.

**Practice problem:** An industrial load of $500\ \text{kW}$ at 0.707 pf lagging is to be improved to a total load of $600\ \text{kW}$ at 0.95 pf lagging by adding a synchronous motor in parallel. Find the motor kVA rating and operating pf.

**Solution steps:**

Original load:

$$
\phi_1=\cos^{-1}(0.707)=45^\circ
$$

$$
Q_1=P_1\tan\phi_1=500\tan45^\circ=500\ \text{kVAR lagging}
$$

Desired total:

$$
\phi_2=\cos^{-1}(0.95)=18.19^\circ
$$

$$
Q_2=P_2\tan\phi_2=600\tan18.19^\circ=197.2\ \text{kVAR lagging}
$$

Motor active power:

$$
P_m=600-500=100\ \text{kW}
$$

Motor reactive power:

$$
Q_m=Q_2-Q_1=197.2-500=-302.8\ \text{kVAR}
$$

The negative sign means the motor supplies leading kVAR.

Motor kVA:

$$
S_m=\sqrt{P_m^2+Q_m^2}
    =\sqrt{100^2+302.8^2}
    =318.9\ \text{kVA}
$$

Motor pf:

$$
\text{pf}_m=\frac{P_m}{S_m}=\frac{100}{318.9}=0.314
$$

**Final answer:** Motor rating $\approx319\ \text{kVA}$, operating at $0.314$ leading pf.

**Method checkpoint:**
- Lagging kVAR is positive; leading kVAR is negative.
- Find old $Q$, target total $Q$, then motor $Q$ by subtraction.
- Over-excited synchronous motors improve lagging plant pf by supplying leading kVAR.

---
title: "Pre-match outcome prediction in professional VALORANT"
sidebar_label: "VALORANT preliminary findings"
description: "An undergraduate progress report on whether team composition helps predict professional VALORANT maps before play begins."
tags:
  - research
  - valorant
  - esports
  - predictive modelling
  - preliminary findings
---

## Abstract

People often describe a VALORANT composition as strong or weak just from its agents or role balance. I wanted to see how much that actually helps once the teams, map and patch are also taken into account.

For this first study, I used 1,684 professional maps from 2025–2026: 1,371 from the Americas, EMEA and Pacific leagues, and 313 from global events. The prediction is made after both teams lock their agents but before the first round. I trained on earlier tournaments and checked the models on later ones.

The early results were mixed. Elo team rating was the best simple starting point. Adding the exact agents helped in EMEA, but it did not clearly help in Americas or Pacific. Role counts, patch features and team-adaptation features were also inconsistent. Team compositions did change between patches, although that did not turn into a simple way to predict the winner. These are still preliminary results because I have not yet tested the final model on a completely untouched future tournament.

---

## 1. Why I chose this topic

VALORANT broadcasts and discussions often use labels such as double-Controller or double-Sentinel to explain why a team might have an advantage. I was curious about whether those labels hold up when the same idea is tested over many matches. A composition that looks successful may simply be used by a stronger team, on a favourable map, or during one particular patch.

The main question I used was:

> **After accounting for team strength and earlier map history, does knowing both team compositions improve the prediction?**

The current study looks at the point after agent selection but before round one. A harder version would make the prediction after the map veto but before agents are selected. I have left that for later because the veto data still needs more checking.

I mainly wanted to answer three things:

1. Does composition add anything beyond a basic team-strength model?
2. Are exact agents more useful than simpler role descriptions?
3. Do the same results appear across regions and patches?

---

## 2. What I found in previous work

VALORANT prediction has already been attempted, but earlier studies do not all predict at the same point. Some use economy, round history, player performance or video events after play has started (Wang 2025; Hayakawa et al. 2025; Park, Kang and Lee 2026). Others study pre-match outcomes but use different datasets and evaluation methods (Pratama 2024; Pawar 2024; Martins et al. 2026). Their accuracy numbers cannot be compared directly with mine.

Research on other esports also suggested that composition could matter. Cheng et al. (2019) studied team composition in *Honor of Kings*, while Kim et al. (2016) looked at player proficiency and team fit. Zhou (2025) found useful agent groupings from VALORANT co-picks, and Pedrassoli Chitayat et al. (2023) explored patch-aware character representations in *Dota 2*. These papers gave me ideas for features, but they do not answer the same pre-match VALORANT question.

I also looked at comments from professional players and coaches. They often describe a patch as changing how a map or whole team system is played, rather than only changing one agent (Strazd 2026; Fnatic 2026; VALORANT News Japan 2025; Choudhury 2025). I treated those comments as motivation, not proof.

The gap I focused on was fairly simple: test several ways of describing both compositions, keep the events in chronological order, and judge the probabilities rather than only counting correct winners. This matters because VALORANT changes quickly and a model that works on one period may not work on the next (Yao et al. 2022; Park et al. 2020; Zollo et al. 2024).

---

## 3. Data and approach

### 3.1 Building the dataset

I started with version 47 of Ryan Luong's Kaggle VCT dataset (Luong 2026). It was useful for reconstructing lineups, but it did not contain reliable timestamps and patch information for the full analysis. So I used a separate, resumable VLR archive to collect stable match, event, patch, team and player IDs.

After matching and filtering the sources, the current study contains:

| Group | Maps |
|---|---:|
| Americas | 448 |
| EMEA | 463 |
| Pacific | 460 |
| Global Masters and Champions events | 313 |
| **Total** | **1,684** |

Older years were not included because their timing coverage was too weak. China was also left out of this version because most of its enriched maps were missing competition-patch values.

The 1,684 maps are unique maps in the pilot dataset. Of these, 1,505 are later-event predictions. The first 179 regional maps are only used to build up initial team history.

![Outcome-free audit of map, composition, and roster feature coverage](./assets/composition-map-feature-audit.png)

*Figure 1. Coverage of the main fields before modelling. This shows what data were available, not who won.*

**Source:** My analysis of the current pilot dataset.

### 3.2 Keeping the prediction genuinely pre-match

I reduced the data to one row per map. Team A and Team B were assigned from stable team IDs, not from the winner or betting favourite. I excluded the current score, rounds, economy, kills, ACS and other information that would only be known after the map started.

Historical values such as Elo, map record, roster familiarity and earlier agent use were calculated from older maps only. Maps from the same match stayed together, and earlier events were used to predict later ones.

~~~mermaid
flowchart LR
    A["Stored VLR pages"] --> B["Checked match and map IDs"]
    B --> C["One row per map"]
    C --> D["Earlier events for training"]
    D --> E["Pre-match features"]
    E --> F["Later-event predictions"]
    F -. "future work" .-> G["Untouched final event"]
~~~

**Source:** A simplified view of my data and evaluation process.

### 3.3 Models and scoring

I first tried chance prediction, a training-period average, Elo team rating and same-map history. I then added exact agents, official role counts, map-specific role patterns, patch information, roster familiarity and team-adaptation features.

The main score is the Brier score, where lower is better and a constant 50% prediction scores 0.25. I also checked log loss, ranking and calibration. When the 95% interval for a model difference crosses zero, I treat the result as uncertain.

---

## 4. Preliminary results

### 4.1 Team strength was the best simple starting point

Elo produced the best simple baseline in all three regions.

| Region | Chance Brier | Elo Brier | Elo ROC-AUC |
|---|---:|---:|---:|
| Americas | 0.2500 | 0.2425 | 0.580 |
| EMEA | 0.2500 | 0.2469 | 0.582 |
| Pacific | 0.2500 | 0.2369 | 0.628 |

Pacific had the strongest baseline result. Same-map history did not beat Elo, either by itself or when combined with it.

![Baseline probability scores and uncertainty](./assets/first-baseline-primary-scores.png)

*Figure 2. Scores for the simple models. Lower Brier score and log loss are better.*

**Source:** My analysis of the current pilot dataset.

### 4.2 Exact composition helped only in EMEA

I compared an exact-composition model with a reference based on team strength and map history. A negative difference means the composition model was better.

| Region | Composition minus reference Brier | 95% interval |
|---|---:|---:|
| Americas | +0.0036 | [-0.0069, +0.0143] |
| EMEA | **-0.0098** | **[-0.0189, -0.0010]** |
| Pacific | +0.0071 | [-0.0025, +0.0167] |

The EMEA result was the only clear improvement. Americas was uncertain, and Pacific had a worse point estimate. This was interesting, but it is not enough to say that composition helps everywhere.

![Exact-composition model compared with the Elo-plus-map reference](./assets/exact-composition-primary-comparisons.png)

*Figure 3. Values to the left of zero favour the composition model. EMEA is the only region with a clear improvement.*

**Source:** My analysis of the current pilot dataset.

The simpler role-count model showed a weaker version of the EMEA pattern. Allowing roles to change their effect by map also gave mixed results. Some map and role combinations looked strong, but the smaller groups were unstable and most of the intervals crossed zero.

![Map-by-role interaction coefficient atlas](./assets/map-role-interaction-atlas.png)

*Figure 4. Map-specific role associations from the model. These are associations, not proof that a role choice caused a win.*

**Source:** My analysis of the current pilot dataset.

I also checked complete role recipes such as double-Controller or double-Sentinel lineups. Many patterns looked convincing at first, but nearly all disappeared after correcting for the large number of comparisons. I do not think the remaining small exception is strong enough to recommend a particular composition.

### 4.3 The meta changed, but it did not become an easy predictor

The role structures used by professional teams clearly changed between some patches. The largest shift was from patch 10.08 to 10.10, with a Jensen–Shannon divergence of 0.225.

![Patch-to-patch change in the professional role-recipe distribution](./assets/patch-meta-shift-timeline.png)

*Figure 5. Larger values mean teams changed what they played more sharply. The graph does not measure an effect on winning.*

**Source:** My analysis of the pilot dataset, with patch context checked against Riot Games (n.d.).

However, adding the simple patch features did not clearly improve the winner predictions in any region. Every interval crossed zero.

![Corrected patch-aware predictive comparison](./assets/patch-aware-predictive-forest.png)

*Figure 6. Patch-aware model minus its reference model. Every interval crosses zero, so there is no clear improvement.*

**Source:** My analysis of the corrected patch experiment.

The more detailed mechanical-change model did not show a clear result in Americas or EMEA, and it made the Pacific result worse. My current view is that counting buffs and nerfs is too simple to describe how a team changes its playbook.

### 4.4 Team-adaptation features were also uncertain

I tested earlier composition rehearsal, lineup stability, similarity to the regional meta, patch experience and opponent exposure. None produced a clear improvement in any region.

![Corrected regional team-adaptation comparison](./assets/team-adaptation-predictive-forest.png)

*Figure 7. The estimated changes from the adaptation model are small and uncertain in every region.*

**Source:** My analysis of the corrected adaptation experiment.

I also removed one event at a time to see whether a single tournament was driving the results. EMEA remained favourable, Pacific remained unfavourable, and Americas changed more depending on the events included. The composition model was also sensitive to regularisation and to how Team A and Team B were represented. These are weaknesses I need to address before the final test.

---

## 5. A correction I made during the project

While checking the later experiments, I found problems in three patch and adaptation runs. Part of the tuning process could split maps from the same match, and two history features were being built from the wrong training scope. The final evaluation outcomes had not been used to update the model, but the experiments still needed to be rerun.

I rebuilt those experiments using complete event or timestamp groups, training-only scaling and fold-specific histories. The corrected results are the ones shown above. I also withdrew the earlier claims that the patch features clearly hurt Pacific and that the adaptation features clearly hurt EMEA. I have kept this correction in the report because it changed how I interpreted the results.

---

## 6. Limitations and next steps

There are four main limitations at this stage:

- The current maps have already been used while developing the models, so they cannot be the final unbiased test.
- Coverage is strongest for 2025–2026 and does not yet include China.
- Teams choose their own compositions, so these results show prediction and association, not cause and effect.
- Some agents, maps and role structures are rare, and I have now tried many model variations on the same development data.

Both the Kaggle data and my archive ultimately use VLR records, so agreement between them checks my extraction rather than providing an independent source.

My next steps are to finish and check a larger archive, add a small number of planned features such as vetoes and prior player form, and test a side-symmetric version of the composition model. After that, I will fix the final model choices before looking at a future tournament and report the result even if it is negative or mixed.

---

## 7. Conclusion

The main thing I found was that Elo team rating is a useful starting point for predicting professional VALORANT maps before round one. Exact composition improved the EMEA development result, but the same pattern did not appear in Americas or Pacific.

Professional compositions did change between patches, but the role, patch and adaptation features did not give a reliable improvement across all three regions. This makes me less confident in broad claims such as one role structure being generally stronger than another.

For now, the result is promising in one region rather than conclusive overall. I still need to improve the model and test it once on a tournament that has not been used during development.

---

## References

Arrieta-Ibarra, I., Gujral, P., Tannen, J., Tygert, M. and Xu, C. (2022) ‘Metrics of calibration for probabilistic predictions’, *Journal of Machine Learning Research*, 23(351), pp. 1–54. Available at: [JMLR](https://www.jmlr.org/papers/v23/22-0658.html).

Benjamini, Y. and Hochberg, Y. (1995) ‘Controlling the false discovery rate: a practical and powerful approach to multiple testing’, *Journal of the Royal Statistical Society: Series B*, 57(1), pp. 289–300. Available at: [https://doi.org/10.1111/j.2517-6161.1995.tb02031.x](https://doi.org/10.1111/j.2517-6161.1995.tb02031.x).

Brier, G.W. (1950) ‘Verification of forecasts expressed in terms of probability’, *Monthly Weather Review*, 78(1), pp. 1–3. Available at: [https://doi.org/10.1175/1520-0493(1950)078%3C0001:VOFEIT%3E2.0.CO;2](https://doi.org/10.1175/1520-0493%281950%29078%3C0001%3AVOFEIT%3E2.0.CO%3B2).

Cheng, Z., Yang, Y., Tan, C., Cheng, D., Zhuang, Y. and Cheng, A. (2019) ‘What makes a good team? A large-scale study on the effect of team composition in Honor of Kings’, *The Web Conference 2019*, pp. 2666–2672. Available at: [https://doi.org/10.1145/3308558.3313530](https://doi.org/10.1145/3308558.3313530).

Choudhury, K. (2025) ‘Tejo’s rise and fall: analyzing the agent’s pick rate from Bangkok to Toronto’, *THESPIKE.GG*. Available at: [THESPIKE.GG](https://www.thespike.gg/valorant/news/tejo-s-rise-and-fall-analyzing-the-agent-s-pick-rate-from-bangkok-to-toronto/6364) (Accessed: 13 July 2026).

Fnatic (2026) ‘Ask the VALORANT team anything ahead of VCT EMEA Stage 1’, team AMA. Available at: [Fnatic](https://fnatic.com/community/6497-ama-ask-the-valorant-team-anything-ahead-of-vct-emea-stage-1) (Accessed: 13 July 2026).

Guo, C., Pleiss, G., Sun, Y. and Weinberger, K.Q. (2017) ‘On calibration of modern neural networks’, *Proceedings of the 34th International Conference on Machine Learning*, 70, pp. 1321–1330. Available at: [PMLR](https://proceedings.mlr.press/v70/guo17a.html).

Hayakawa, N., Shimari, K., Yamasaki, K., Hoshikawa, H., Tsuchida, R. and Matsumoto, K. (2025) ‘Round outcome prediction in VALORANT using tactical features from video analysis’, *2025 IEEE Conference on Games*. Available at: [https://doi.org/10.1109/CoG64752.2025.11114177](https://doi.org/10.1109/CoG64752.2025.11114177).

Hodge, V.J., Devlin, S.M., Sephton, N.J., Block, F.O., Cowling, P.I. and Drachen, A. (2021) ‘Win prediction in multi-player esports: live professional match prediction’, *IEEE Transactions on Games*, 13(4), pp. 368–379. Available at: [https://doi.org/10.1109/TG.2019.2948469](https://doi.org/10.1109/TG.2019.2948469).

Kim, J., Keegan, B.C., Park, S. and Oh, A. (2016) ‘The proficiency-congruency dilemma: virtual team design and performance in multiplayer online games’, *CHI 2016*, pp. 4351–4365. Available at: [https://doi.org/10.1145/2858036.2858464](https://doi.org/10.1145/2858036.2858464).

Luong, R. (2026) ‘Valorant Champion Tour 2021–2026 Data’, Kaggle dataset, version 47. Available at: [Kaggle](https://www.kaggle.com/datasets/ryanluong1/valorant-champion-tour-2021-2023-data) (Accessed: 11 July 2026).

Martins, R., Watanuki, A., Soares, V., Onorio, G. and Macedo, V. dos S. (2026) ‘VWPI (Valorant Win Probability Index): um contraponto analítico às odds das casas de apostas’, *Revista Processando o Saber*, 18(1), pp. 458–480. Available at: [https://doi.org/10.5281/zenodo.20076441](https://doi.org/10.5281/zenodo.20076441).

Park, H., Kang, G. and Lee, T. (2026) ‘Match outcome prediction in FPS games reflecting sequential match flow: focusing on Valorant and the Seq2Seq LSTM model’, *International Journal of Computer Science and Mobile Computing*, 15(2), pp. 72–79. Available at: [https://doi.org/10.47760/ijcsmc.2026.v15i02.008](https://doi.org/10.47760/ijcsmc.2026.v15i02.008).

Park, S., Bastani, O., Weimer, J. and Lee, I. (2020) ‘Calibrated prediction with covariate shift via unsupervised domain adaptation’, *AISTATS*, PMLR 108, pp. 3219–3229. Available at: [PMLR](https://proceedings.mlr.press/v108/park20b.html).

Pawar, A.M. (2024) ‘Valorant Esports Pre-Match Betting Advisory System uses Machine Learning to Predict Winning Probability and Simulate Odds and Earning Projections’, Master's thesis, National College of Ireland. Available at: [NCI repository](https://norma.ncirl.ie/8770/) (Accessed: 13 July 2026).

Pedrassoli Chitayat, A., Block, F., Walker, J. and Drachen, A. (2023) ‘Beyond the meta: leveraging game design parameters for patch-agnostic esport analytics’, *Proceedings of the AAAI Conference on Artificial Intelligence and Interactive Digital Entertainment*, 19(1), pp. 116–125. Available at: [https://doi.org/10.1609/aiide.v19i1.27507](https://doi.org/10.1609/aiide.v19i1.27507).

Petri, G., Stanley, M.H., Hon, A.B., Dong, A., Xenopoulos, P. and Silva, C.T. (2021) ‘Bandit modeling of map selection in Counter-Strike: Global Offensive’, arXiv:2106.08888. Available at: [arXiv](https://arxiv.org/abs/2106.08888).

Pratama, H.K. (2024) ‘Prediction Valorant Match Outcome Using Supervised Learning Algorithm’, Bachelor's thesis, Universitas Gadjah Mada. Available at: [UGM repository](https://etd.repository.ugm.ac.id/penelitian/detail/242904) (Accessed: 13 July 2026).

Reitman, J.G., Anderson-Coto, M.J., Wu, M., Lee, J.S. and Steinkuehler, C. (2020) ‘Esports research: a literature review’, *Games and Culture*, 15(1), pp. 32–50. Available at: [https://doi.org/10.1177/1555412019840892](https://doi.org/10.1177/1555412019840892).

Riot Games (n.d.) ‘Patch notes’. Available at: [VALORANT](https://playvalorant.com/en-us/news/tags/patch-notes/) (Accessed: 13 July 2026).

Strazd, E. (2026) ‘“Phoenix might rise through the ranks”: FNC Boaster on possible VALORANT meta shift’, *Dot Esports*. Available at: [Dot Esports](https://dotesports.com/valorant/news/vct-2026-stage-1-boaster-interview) (Accessed: 13 July 2026).

VALORANT News Japan (2025) ‘DRX free1ng: “I want to be remembered as one of the best Initiators in the world”; discusses the IGL change and using Tejo on every map’ [in Japanese]. Available at: [VALORANT News Japan](https://valorantnews.jp/archives/97255) (Accessed: 13 July 2026).

VLR.gg (n.d.) ‘Results’. Available at: [VLR.gg](https://www.vlr.gg/matches/results) (Accessed: 13 July 2026).

Wang, D. (2025) ‘A predictive analysis of Valorant esports: win probability through economy and ultimate ability’, *TechRxiv*. Available at: [https://doi.org/10.36227/techrxiv.174742078.82022650/v1](https://doi.org/10.36227/techrxiv.174742078.82022650/v1).

Xenopoulos, P., Coelho, B.G. and Silva, C.T. (2021) ‘Optimal team economic decisions in Counter-Strike’, arXiv:2109.12990. Available at: [arXiv](https://arxiv.org/abs/2109.12990).

Yao, H., Choi, C., Cao, B., Lee, Y., Koh, P.W. and Finn, C. (2022) ‘Wild-Time: a benchmark of in-the-wild distribution shift over time’, *Advances in Neural Information Processing Systems*, 35. Available at: [NeurIPS](https://proceedings.neurips.cc/paper_files/paper/2022/hash/43119db5d59f07cc08fca7ba6820179a-Abstract-Datasets_and_Benchmarks.html).

Zhou, H. (2025) ‘Beyond win rates: a clustering-based approach to character balance analysis in team-based games’, arXiv:2502.01250, version 2. Available at: [arXiv](https://arxiv.org/abs/2502.01250).

Zollo, T.P., Deng, Z., Snell, J.C., Pitassi, T. and Zemel, R. (2024) ‘Improving predictor reliability with selective recalibration’, arXiv:2410.05407. Available at: [arXiv](https://arxiv.org/abs/2410.05407).

---

## Technical note

I kept the full manifests, configurations and run records in the project repository rather than putting all of them into this progress report. The points most relevant to reading the results are:

- 1,684 is the number of unique maps, while 1,505 is the number used as later-event predictions.
- Repeated training use produced 7,954 assignments across 17 temporal blocks; these are not extra maps.
- The exact-composition model used 100 planned predictors.
- Uncertainty intervals used 2,000 paired resamples of complete Match IDs, and calibration was checked with 5, 10 and 15 bins.
- The one small Bind recipe result was 5 wins in 27 maps after correction. I did not treat it as a strategy recommendation.
- The detailed mechanical-change model was clearly worse in Pacific: +0.00317 Brier, with a 95% interval of [+0.00123, +0.00521].
- The frozen temporal split version is 7ba1a80798aea274bc3930b37929dc1266052136e8473d0628583380a8c40d75.

The analysis and figures were produced through Docker and recorded runs. The research release passed its formatting, linting, type checking, Docker validation and 181 automated tests. No separate final-event outcomes were read.

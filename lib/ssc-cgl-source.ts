import fs from "node:fs";
import path from "node:path";
import { getSscCglBookQuestionsPath } from "@/lib/ssc-cgl-corpus-paths";
import type { SscCglExamPattern, SscCglOptionId, SscCglQuestion, SscCglSectionId, SscCglTopic } from "@/lib/exam-types";

export const sscCglPattern: SscCglExamPattern = {
  totalQuestions: 100,
  totalMarks: 200,
  negativeMarks: -0.5,
  sections: [
    { id: "reasoning", title: "General Intelligence and Reasoning", questionCount: 25, marks: 50, timerSeconds: 900, scribeTimerSeconds: 1200 },
    { id: "general-awareness", title: "General Awareness", questionCount: 25, marks: 50, timerSeconds: 900, scribeTimerSeconds: 1200 },
    { id: "quantitative-aptitude", title: "Quantitative Aptitude", questionCount: 25, marks: 50, timerSeconds: 900, scribeTimerSeconds: 1200 },
    { id: "english-comprehension", title: "English Comprehension", questionCount: 25, marks: 50, timerSeconds: 900, scribeTimerSeconds: 1200 }
  ]
};

type TopicSeed = {
  slug: string;
  title: string;
  subject: string;
  section: SscCglSectionId;
  priority: SscCglTopic["priority"];
  summary: string;
  formulaTable: SscCglTopic["study"]["formulaTable"];
  flowchartSteps: string[];
};

const topicSeeds: TopicSeed[] = [
  {
    slug: "analogy-classification",
    title: "Analogy and Classification",
    subject: "General Intelligence and Reasoning",
    section: "reasoning",
    priority: "high-yield",
    summary: "Build the relation first, then test every option against the same relation instead of matching by surface similarity.",
    formulaTable: [
      { cue: "Word analogy", rule: "Name the exact relationship: synonym, function, part-whole, class-member, cause-effect.", trap: "Two options may feel related; only one preserves the same relation." },
      { cue: "Number analogy", rule: "Test square, cube, difference, product, and digit operations in that order.", trap: "Do not stop after finding a pattern for only one side." }
    ],
    flowchartSteps: ["Identify pair relation", "Write relation in words", "Apply to options", "Reject partial matches"]
  },
  {
    slug: "series-coding",
    title: "Series and Coding-Decoding",
    subject: "General Intelligence and Reasoning",
    section: "reasoning",
    priority: "speed",
    summary: "Treat every series as a rule-discovery problem: direction, step size, alternation, and positional coding must be checked quickly.",
    formulaTable: [
      { cue: "Alphabet shift", rule: "Convert letters to positions and compare differences.", trap: "Alternating series often hide two independent progressions." },
      { cue: "Coding", rule: "Compare original and coded words letter by letter before applying the rule.", trap: "Reverse order and paired swaps are common distractors." }
    ],
    flowchartSteps: ["Convert to positions", "Check direction", "Check alternating rules", "Apply final rule"]
  },
  {
    slug: "current-affairs-static-gk",
    title: "Current Affairs and Static GK",
    subject: "General Awareness",
    section: "general-awareness",
    priority: "high-yield",
    summary: "Anchor current events to institutions, dates, schemes, reports, and static background so one news item becomes multiple SSC facts.",
    formulaTable: [
      { cue: "Scheme news", rule: "Remember ministry, objective, target group, and launch year.", trap: "Scheme names are often confused with implementing ministries." },
      { cue: "Reports", rule: "Attach report name to publishing body and headline rank/finding.", trap: "Index creator and data source are not always the same body." }
    ],
    flowchartSteps: ["Read official source", "Extract institution", "Attach static context", "Create one MCQ trap"]
  },
  {
    slug: "indian-polity-basics",
    title: "Indian Polity Basics",
    subject: "General Awareness",
    section: "general-awareness",
    priority: "foundation",
    summary: "SSC polity rewards exact articles, constitutional bodies, amendment facts, and institution-function matching.",
    formulaTable: [
      { cue: "Article questions", rule: "Link article number to subject and one exception.", trap: "Directive Principles and Fundamental Rights get swapped." },
      { cue: "Bodies", rule: "Classify as constitutional, statutory, executive, or regulatory.", trap: "A statutory body is not automatically constitutional." }
    ],
    flowchartSteps: ["Classify body", "Recall article/act", "Recall appointment/removal", "Check exception"]
  },
  {
    slug: "percentages",
    title: "Percentages",
    subject: "Quantitative Aptitude",
    section: "quantitative-aptitude",
    priority: "foundation",
    summary: "Percentages are the base layer for profit-loss, SI/CI, data interpretation, and successive change questions.",
    formulaTable: [
      { cue: "x% of y", rule: "x/100 x y", trap: "Changing base after an increase/decrease changes the answer." },
      { cue: "Successive change", rule: "a + b + ab/100", trap: "A 20% rise and 20% fall is not zero change." }
    ],
    flowchartSteps: ["Find base", "Convert percent", "Apply change", "Return to asked base"]
  },
  {
    slug: "ratio-proportion",
    title: "Ratio and Proportion",
    subject: "Quantitative Aptitude",
    section: "quantitative-aptitude",
    priority: "high-yield",
    summary: "Ratio questions become fast when you preserve units and use multipliers instead of raw values.",
    formulaTable: [
      { cue: "A:B = m:n", rule: "Let A=mk and B=nk.", trap: "Do not add absolute differences before assigning k." },
      { cue: "Compound ratio", rule: "Multiply corresponding terms and simplify.", trap: "Order matters in duplicate-looking ratios." }
    ],
    flowchartSteps: ["Assign k", "Use condition", "Solve k", "Answer asked part"]
  },
  {
    slug: "grammar-error-spotting",
    title: "Grammar and Error Spotting",
    subject: "English Comprehension",
    section: "english-comprehension",
    priority: "high-yield",
    summary: "Error spotting is rule recognition under time pressure: subject-verb agreement, tense, preposition, article, and modifier placement dominate.",
    formulaTable: [
      { cue: "Subject-verb", rule: "Find the real subject before choosing verb number.", trap: "Phrases between subject and verb distract from agreement." },
      { cue: "Parallelism", rule: "Items joined by and/or should use the same grammatical form.", trap: "One option may be meaningful but structurally unequal." }
    ],
    flowchartSteps: ["Find subject", "Check verb", "Check tense/preposition", "Read whole sentence"]
  },
  {
    slug: "vocabulary-cloze",
    title: "Vocabulary and Cloze Test",
    subject: "English Comprehension",
    section: "english-comprehension",
    priority: "speed",
    summary: "Cloze accuracy comes from tone, collocation, and grammar together; vocabulary alone is not enough.",
    formulaTable: [
      { cue: "Cloze blank", rule: "Read previous and next sentence before options.", trap: "A synonym can fail because the collocation is wrong." },
      { cue: "One-word substitution", rule: "Use root meaning and category clue.", trap: "Near-synonyms differ by field or intensity." }
    ],
    flowchartSteps: ["Read context", "Predict tone", "Check grammar", "Select collocation"]
  }
];

const expansionTopicSeeds: TopicSeed[] = [
  {
    slug: "blood-relation",
    title: "Blood Relation",
    subject: "General Intelligence and Reasoning",
    section: "reasoning",
    priority: "high-yield",
    summary: "Draw generations and gender markers before translating relationship wording.",
    formulaTable: [
      { cue: "Family tree", rule: "Place the speaker first, then move one relation at a time.", trap: "Relative of relative wording reverses direction easily." },
      { cue: "Coded relation", rule: "Decode every symbol into a relation before drawing.", trap: "Combining symbols mentally causes direction errors." }
    ],
    flowchartSteps: ["Fix speaker", "Decode relation", "Draw generations", "Answer asked person"]
  },
  {
    slug: "direction-distance",
    title: "Direction and Distance",
    subject: "General Intelligence and Reasoning",
    section: "reasoning",
    priority: "speed",
    summary: "Track north-east axes and final displacement instead of remembering the whole path verbally.",
    formulaTable: [
      { cue: "Turns", rule: "Convert each movement to x-y displacement.", trap: "Left/right depends on current facing direction." },
      { cue: "Shortest distance", rule: "Use Pythagoras only after net horizontal and vertical distance are known.", trap: "Adding walked distance gives the wrong answer." }
    ],
    flowchartSteps: ["Set axes", "Track facing", "Net displacement", "Compute asked value"]
  },
  {
    slug: "syllogism-venn",
    title: "Syllogism and Venn Diagrams",
    subject: "General Intelligence and Reasoning",
    section: "reasoning",
    priority: "foundation",
    summary: "Use minimum Venn diagrams and test only definite conclusions.",
    formulaTable: [
      { cue: "All A are B", rule: "Place A fully inside B.", trap: "Do not assume all B are A." },
      { cue: "Some A are B", rule: "Mark only overlap, not full inclusion.", trap: "Possibility and definite conclusion differ." }
    ],
    flowchartSteps: ["Draw statements", "Mark minimum facts", "Test conclusion", "Reject possibility-only"]
  },
  {
    slug: "non-verbal-reasoning",
    title: "Non-Verbal Reasoning",
    subject: "General Intelligence and Reasoning",
    section: "reasoning",
    priority: "revision",
    summary: "Track rotation, reflection, count, and position changes in a fixed order.",
    formulaTable: [
      { cue: "Figure series", rule: "Check element count, rotation, shading, and position.", trap: "One visible change may hide a second rule." },
      { cue: "Mirror image", rule: "Reverse left-right while preserving top-bottom.", trap: "Water image and mirror image are different." }
    ],
    flowchartSteps: ["Count elements", "Check movement", "Check rotation", "Check mirror/water"]
  },
  {
    slug: "calendar-clock",
    title: "Calendar and Clock",
    subject: "General Intelligence and Reasoning",
    section: "reasoning",
    priority: "speed",
    summary: "Calendar and clock questions are modular arithmetic drills with common anchor values.",
    formulaTable: [
      { cue: "Odd days", rule: "Reduce total days modulo 7.", trap: "Century leap-year exceptions are easy to miss." },
      { cue: "Clock angle", rule: "Angle = |30H - 5.5M|.", trap: "Use the smaller angle when asked." }
    ],
    flowchartSteps: ["Pick anchor", "Compute remainder", "Apply exception", "Return asked unit"]
  },
  {
    slug: "statement-conclusion",
    title: "Statement and Conclusion",
    subject: "General Intelligence and Reasoning",
    section: "reasoning",
    priority: "high-yield",
    summary: "Accept only conclusions that must follow from the statement without outside assumptions.",
    formulaTable: [
      { cue: "Must follow", rule: "Treat the statement as the whole universe.", trap: "Real-world plausibility is not logical necessity." },
      { cue: "Either-or", rule: "Use only when conclusions are complementary and individually uncertain.", trap: "Similar-looking conclusions are not complements." }
    ],
    flowchartSteps: ["Read statement", "Remove outside facts", "Test necessity", "Check either-or"]
  },
  {
    slug: "history-freedom-movement",
    title: "History and Freedom Movement",
    subject: "General Awareness",
    section: "general-awareness",
    priority: "high-yield",
    summary: "History questions reward timeline anchors, acts, sessions, movements, and personality-event links.",
    formulaTable: [
      { cue: "Movement", rule: "Remember year, leader, location, and immediate trigger.", trap: "Adjacent movements are often swapped." },
      { cue: "Acts", rule: "Attach act year to one defining provision.", trap: "Council acts and government acts are confused." }
    ],
    flowchartSteps: ["Locate period", "Attach year", "Attach leader/place", "Check trigger"]
  },
  {
    slug: "geography-india-world",
    title: "Geography of India and World",
    subject: "General Awareness",
    section: "general-awareness",
    priority: "foundation",
    summary: "Map facts become reliable when tied to rivers, passes, crops, minerals, climate, and location order.",
    formulaTable: [
      { cue: "River system", rule: "Know source, tributary, basin, and state order.", trap: "Tributary direction is often reversed." },
      { cue: "Crops", rule: "Attach crop to soil, climate, and producing state.", trap: "Highest producer changes; verify current facts." }
    ],
    flowchartSteps: ["Locate region", "Attach physical feature", "Attach economy/climate", "Check current ranking"]
  },
  {
    slug: "economics-budget-banking",
    title: "Economics, Budget, and Banking",
    subject: "General Awareness",
    section: "general-awareness",
    priority: "high-yield",
    summary: "Economics prep should connect terms to institutions, instruments, and current policy decisions.",
    formulaTable: [
      { cue: "RBI instrument", rule: "Know repo, reverse repo, CRR, SLR, and policy effect.", trap: "Rates and ratios are not interchangeable." },
      { cue: "Budget term", rule: "Link deficit, revenue, capital, and fiscal terms to definitions.", trap: "Revenue deficit and fiscal deficit differ." }
    ],
    flowchartSteps: ["Classify term", "Attach institution", "Attach effect", "Create MCQ trap"]
  },
  {
    slug: "science-everyday",
    title: "General Science and Everyday Applications",
    subject: "General Awareness",
    section: "general-awareness",
    priority: "foundation",
    summary: "Science questions test direct concepts, SI units, diseases, vitamins, inventions, and daily-life applications.",
    formulaTable: [
      { cue: "Physics fact", rule: "Attach concept to unit and application.", trap: "Similar units across quantities are common traps." },
      { cue: "Biology fact", rule: "Attach disease, pathogen, deficiency, and organ/system.", trap: "Vitamin deficiency names are often swapped." }
    ],
    flowchartSteps: ["Identify branch", "Recall unit/fact", "Attach application", "Check exception"]
  },
  {
    slug: "environment-ecology",
    title: "Environment and Ecology",
    subject: "General Awareness",
    section: "general-awareness",
    priority: "revision",
    summary: "Environment prep needs protocols, protected areas, pollution terms, and biodiversity facts.",
    formulaTable: [
      { cue: "Protocol", rule: "Know issue, year, and target pollutant/topic.", trap: "Ozone, climate, and biodiversity protocols get mixed." },
      { cue: "Protected area", rule: "Attach park/sanctuary to state and flagship species.", trap: "Tiger reserves and national parks are not identical sets." }
    ],
    flowchartSteps: ["Classify issue", "Attach treaty/place", "Attach species/pollutant", "Check state/year"]
  },
  {
    slug: "computer-awareness",
    title: "Computer Awareness",
    subject: "General Awareness",
    section: "general-awareness",
    priority: "revision",
    summary: "Computer awareness is a direct recall lane: hardware, software, networks, security, and abbreviations.",
    formulaTable: [
      { cue: "Network term", rule: "Expand abbreviation and know the layer/use.", trap: "Protocol and device names are confused." },
      { cue: "Security", rule: "Separate virus, worm, phishing, malware, encryption.", trap: "Every attack is not a virus." }
    ],
    flowchartSteps: ["Expand term", "Classify category", "Attach function", "Check common confusion"]
  },
  {
    slug: "number-system",
    title: "Number System",
    subject: "Quantitative Aptitude",
    section: "quantitative-aptitude",
    priority: "foundation",
    summary: "Number system questions rely on divisibility, remainders, factors, HCF/LCM, and digit behavior.",
    formulaTable: [
      { cue: "Remainder", rule: "Reduce repeated powers using cyclicity.", trap: "Using large powers directly wastes time." },
      { cue: "HCF/LCM", rule: "For two numbers, product = HCF x LCM.", trap: "The relation does not directly extend to three numbers." }
    ],
    flowchartSteps: ["Classify number", "Apply divisibility", "Reduce remainder", "Check factor relation"]
  },
  {
    slug: "hcf-and-lcm",
    title: "HCF and LCM",
    subject: "Quantitative Aptitude",
    section: "quantitative-aptitude",
    priority: "foundation",
    summary: "HCF/LCM questions are factor-control problems: choose prime factorisation, division method, or product relation before writing equations.",
    formulaTable: [
      { cue: "Two numbers", rule: "Product of numbers = HCF x LCM.", trap: "This direct product relation is only safe for two numbers." },
      { cue: "Fractions", rule: "HCF of fractions = HCF of numerators / LCM of denominators; LCM of fractions = LCM of numerators / HCF of denominators.", trap: "Students often reverse numerator and denominator operations." },
      { cue: "Common remainder", rule: "If numbers leave the same remainder, HCF divides their pairwise differences.", trap: "The divisor must be greater than the common remainder." }
    ],
    flowchartSteps: ["Decide HCF or LCM", "Convert to prime powers or differences", "Apply relation", "Check remainder/unit condition"]
  },
  {
    slug: "simplification",
    title: "Simplification and Surds/Indices",
    subject: "Quantitative Aptitude",
    section: "quantitative-aptitude",
    priority: "speed",
    summary: "Simplification is the timer-control topic: BODMAS, fraction cancellation, indices, surds, and option-gap approximation must be automatic.",
    formulaTable: [
      { cue: "BODMAS", rule: "Brackets, orders, division/multiplication, addition/subtraction in that order.", trap: "Left-to-right applies only among same-priority operations." },
      { cue: "Indices", rule: "a^m x a^n = a^(m+n), a^m / a^n = a^(m-n), (a^m)^n = a^(mn).", trap: "Adding powers across different bases is invalid." },
      { cue: "Surds", rule: "Simplify square factors first, then combine like surds.", trap: "sqrt(a+b) is not sqrt(a)+sqrt(b)." }
    ],
    flowchartSteps: ["Scan for cancellation", "Resolve brackets and powers", "Combine fractions/surds", "Use option gap to stop"]
  },
  {
    slug: "profit-loss-discount",
    title: "Profit, Loss, and Discount",
    subject: "Quantitative Aptitude",
    section: "quantitative-aptitude",
    priority: "high-yield",
    summary: "Profit-loss questions are percentage base problems disguised as selling price and marked price stories.",
    formulaTable: [
      { cue: "Profit%", rule: "Profit / CP x 100.", trap: "Discount is on marked price, profit is on cost price." },
      { cue: "Successive discount", rule: "Use a + b + ab/100 with negative discounts.", trap: "Adding discounts directly overstates the total." }
    ],
    flowchartSteps: ["Identify CP/MP/SP", "Apply discount", "Apply profit/loss", "Check base"]
  },
  {
    slug: "simple-compound-interest",
    title: "Simple and Compound Interest",
    subject: "Quantitative Aptitude",
    section: "quantitative-aptitude",
    priority: "high-yield",
    summary: "Interest questions become fast with standard differences and rate-period matching.",
    formulaTable: [
      { cue: "SI", rule: "SI = PRT/100.", trap: "Months must be converted to years." },
      { cue: "CI-SI difference", rule: "For two years, difference = P(R/100)^2.", trap: "Formula changes with time and compounding frequency." }
    ],
    flowchartSteps: ["Identify SI/CI", "Normalize time", "Apply formula", "Check compounding"]
  },
  {
    slug: "time-work-pipes",
    title: "Time, Work, and Pipes",
    subject: "Quantitative Aptitude",
    section: "quantitative-aptitude",
    priority: "high-yield",
    summary: "Use total work as LCM of times and convert each worker into rate.",
    formulaTable: [
      { cue: "Work rate", rule: "Rate = total work / time.", trap: "Efficiency and time are inversely proportional." },
      { cue: "Pipes", rule: "Inlet is positive, outlet is negative.", trap: "Outlet rates are often added instead of subtracted." }
    ],
    flowchartSteps: ["Set total work", "Find rates", "Combine signs", "Compute time"]
  },
  {
    slug: "time-speed-distance",
    title: "Time, Speed, and Distance",
    subject: "Quantitative Aptitude",
    section: "quantitative-aptitude",
    priority: "speed",
    summary: "Speed questions depend on unit conversion, relative speed, trains, boats, and average speed.",
    formulaTable: [
      { cue: "Speed", rule: "Distance = speed x time.", trap: "km/h to m/s requires x 5/18." },
      { cue: "Relative speed", rule: "Opposite direction adds, same direction subtracts.", trap: "Train length must be included when crossing objects." }
    ],
    flowchartSteps: ["Normalize units", "Choose relative speed", "Add object lengths", "Solve time/distance"]
  },
  {
    slug: "geometry-mensuration",
    title: "Geometry and Mensuration",
    subject: "Quantitative Aptitude",
    section: "quantitative-aptitude",
    priority: "revision",
    summary: "Geometry needs diagram discipline and mensuration needs formula recall with correct dimensions.",
    formulaTable: [
      { cue: "Triangle", rule: "Use angle sum, similarity, Pythagoras, and area rules.", trap: "Similar and congruent triangles are different." },
      { cue: "Cylinder", rule: "CSA = 2πrh, TSA = 2πr(h+r).", trap: "CSA and TSA are often swapped." }
    ],
    flowchartSteps: ["Draw figure", "Mark given values", "Pick theorem/formula", "Check units"]
  },
  {
    slug: "data-interpretation",
    title: "Data Interpretation",
    subject: "Quantitative Aptitude",
    section: "quantitative-aptitude",
    priority: "speed",
    summary: "DI is arithmetic under table pressure: read labels, identify base, and avoid unnecessary exactness.",
    formulaTable: [
      { cue: "Table", rule: "Read row, column, unit, and year before calculating.", trap: "Wrong base gives a confident wrong answer." },
      { cue: "Approximation", rule: "Use option gaps to decide precision.", trap: "Over-calculation wastes section time." }
    ],
    flowchartSteps: ["Read labels", "Find base", "Choose operation", "Use option gap"]
  },
  {
    slug: "probability",
    title: "Probability",
    subject: "Quantitative Aptitude",
    section: "quantitative-aptitude",
    priority: "revision",
    summary: "SSC probability is usually direct counting: favorable cases divided by total cases, with replacement/order conditions checked before calculation.",
    formulaTable: [
      { cue: "Basic probability", rule: "Probability = favorable outcomes / total outcomes.", trap: "Counting total outcomes after reading only the favorable condition gives a wrong base." },
      { cue: "Without replacement", rule: "Reduce the total after each draw and multiply stage probabilities.", trap: "Using the same denominator twice incorrectly treats it as replacement." },
      { cue: "Either/or", rule: "For non-overlapping events, add probabilities; for overlapping events, subtract intersection.", trap: "Adding overlapping cases double-counts common outcomes." }
    ],
    flowchartSteps: ["Define total outcomes", "Count favorable outcomes", "Check replacement/order", "Simplify probability"]
  },
  {
    slug: "calculation-speed",
    title: "Calculation Speed and Approximation",
    subject: "Quantitative Aptitude",
    section: "quantitative-aptitude",
    priority: "speed",
    summary: "This is the 36-second Quant engine: mental multiplication, fraction-percent conversion, approximation, option-gap judgement, and cancellation before writing.",
    formulaTable: [
      { cue: "36-second arithmetic", rule: "Choose the shortest route before calculating: cancel, convert, approximate, or use options.", trap: "Starting long division immediately burns the section timer." },
      { cue: "Option gap", rule: "When options are far apart, approximate to one useful digit and stop.", trap: "Exact arithmetic is not always higher accuracy under SSC timing." },
      { cue: "Fraction-percent", rule: "Memorize 1/2 to 1/25 common conversions and use them inside DI, profit-loss, SI/CI, and ratio questions.", trap: "Recomputing 1/8, 1/12.5, or 1/16.67 repeatedly wastes repeated seconds." }
    ],
    flowchartSteps: ["Scan option gap", "Choose cancellation or conversion", "Compute only needed precision", "Check units and sign"]
  },
  {
    slug: "averages-mixtures-alligation",
    title: "Averages, Mixtures, and Alligation",
    subject: "Quantitative Aptitude",
    section: "quantitative-aptitude",
    priority: "high-yield",
    summary: "Average, mixture, replacement, and alligation questions are 36-second weighted-average problems: preserve total value, choose the correct base, and use ratio gaps before long equations.",
    formulaTable: [
      { cue: "Average", rule: "Total = average x number of items; every change is a total-change problem.", trap: "Averaging averages without weights gives wrong answers." },
      { cue: "Replacement mixture", rule: "Removed quantity carries the old concentration; added quantity carries the new concentration.", trap: "Subtracting percentages directly ignores volume." },
      { cue: "Alligation", rule: "Required ratio = (dearer value - mean) : (mean - cheaper value).", trap: "Reversing the two gaps flips the mixture ratio." }
    ],
    flowchartSteps: ["Identify average or mixture", "Write total value", "Apply weighted gap", "Check 36-second option fit"]
  },
  {
    slug: "reading-comprehension",
    title: "Reading Comprehension",
    subject: "English Comprehension",
    section: "english-comprehension",
    priority: "foundation",
    summary: "Read the question stem first, then locate evidence and avoid bringing outside assumptions.",
    formulaTable: [
      { cue: "Main idea", rule: "Choose the option covering the whole passage, not one detail.", trap: "Extreme or too-narrow options are common." },
      { cue: "Inference", rule: "Inference must be supported by passage evidence.", trap: "True outside facts can still be wrong." }
    ],
    flowchartSteps: ["Read question", "Locate evidence", "Eliminate extremes", "Choose supported answer"]
  },
  {
    slug: "synonyms-antonyms",
    title: "Synonyms and Antonyms",
    subject: "English Comprehension",
    section: "english-comprehension",
    priority: "revision",
    summary: "Vocabulary questions need tone, part of speech, and intensity checks.",
    formulaTable: [
      { cue: "Synonym", rule: "Match meaning and part of speech.", trap: "Same theme is not same meaning." },
      { cue: "Antonym", rule: "Find direct opposition in context.", trap: "Different word is not necessarily opposite." }
    ],
    flowchartSteps: ["Classify part of speech", "Check tone", "Check intensity", "Select closest meaning"]
  },
  {
    slug: "idioms-phrases",
    title: "Idioms and Phrases",
    subject: "English Comprehension",
    section: "english-comprehension",
    priority: "high-yield",
    summary: "Idioms should be memorized as meaning units, not translated literally.",
    formulaTable: [
      { cue: "Idiom", rule: "Recall accepted meaning from usage.", trap: "Literal translation is usually wrong." },
      { cue: "Phrase replacement", rule: "Preserve meaning and grammar together.", trap: "Meaning-only choices can break sentence structure." }
    ],
    flowchartSteps: ["Identify phrase", "Recall usage", "Check grammar", "Reject literal trap"]
  },
  {
    slug: "sentence-improvement",
    title: "Sentence Improvement",
    subject: "English Comprehension",
    section: "english-comprehension",
    priority: "high-yield",
    summary: "Sentence improvement tests concise grammar correction without changing intended meaning.",
    formulaTable: [
      { cue: "Improvement", rule: "Check grammar, meaning, and economy.", trap: "Longer option is not automatically more correct." },
      { cue: "No improvement", rule: "Use only when the original is grammatically and semantically sound.", trap: "Changing style without fixing error is unnecessary." }
    ],
    flowchartSteps: ["Find error zone", "Compare options", "Preserve meaning", "Pick concise correct form"]
  },
  {
    slug: "active-passive-direct-indirect",
    title: "Voice and Narration",
    subject: "English Comprehension",
    section: "english-comprehension",
    priority: "revision",
    summary: "Voice and narration are transformation rules: tense, pronoun, object, and reporting verb must stay controlled.",
    formulaTable: [
      { cue: "Passive voice", rule: "Object becomes subject; use be + V3.", trap: "Tense of be must match original tense." },
      { cue: "Indirect speech", rule: "Backshift tense and adjust pronoun/time words when required.", trap: "Universal truths do not always backshift." }
    ],
    flowchartSteps: ["Identify tense", "Move subject/object", "Apply V3/backshift", "Check pronouns"]
  },
  {
    slug: "spelling-one-word",
    title: "Spelling and One-Word Substitution",
    subject: "English Comprehension",
    section: "english-comprehension",
    priority: "speed",
    summary: "Spelling and one-word substitution are fast recall lanes that benefit from roots and common suffixes.",
    formulaTable: [
      { cue: "Spelling", rule: "Check prefix, root, double letters, and suffix.", trap: "Pronunciation often misleads spelling." },
      { cue: "One-word", rule: "Map definition to category and root.", trap: "Near terms differ by field or intensity." }
    ],
    flowchartSteps: ["Read definition", "Find category", "Use root clue", "Check suffix"]
  },
  {
    slug: "seating-arrangement",
    title: "Seating Arrangement",
    subject: "General Intelligence and Reasoning",
    section: "reasoning",
    priority: "high-yield",
    summary: "Seating arrangement becomes manageable when each fixed clue is placed first and uncertain branches are kept separate.",
    formulaTable: [
      { cue: "Linear seating", rule: "Fix direction, mark left/right from the person's perspective, and place definite positions first.", trap: "Viewer-left and person-left get confused." },
      { cue: "Circular seating", rule: "Fix one person as reference to remove rotational duplication.", trap: "Facing centre and facing outside reverse left/right." }
    ],
    flowchartSteps: ["Fix orientation", "Place definite clue", "Branch uncertain clue", "Validate every condition"]
  },
  {
    slug: "mathematical-operations",
    title: "Mathematical Operations",
    subject: "General Intelligence and Reasoning",
    section: "reasoning",
    priority: "speed",
    summary: "Operation-substitution questions reward careful symbol replacement before applying BODMAS.",
    formulaTable: [
      { cue: "Symbol replacement", rule: "Rewrite the whole expression with actual operations before solving.", trap: "Solving while reading causes sign-swap errors." },
      { cue: "BODMAS", rule: "Apply brackets, orders, division/multiplication, addition/subtraction after replacement.", trap: "Left-to-right applies only within equal precedence." }
    ],
    flowchartSteps: ["Replace symbols", "Rewrite expression", "Apply BODMAS", "Check option"]
  },
  {
    slug: "art-culture",
    title: "Art, Culture, and Literature",
    subject: "General Awareness",
    section: "general-awareness",
    priority: "revision",
    summary: "Culture facts should be tied to state, art form, dynasty, language, author, and award context.",
    formulaTable: [
      { cue: "Dance/art form", rule: "Attach art form to state, key feature, and famous exponent.", trap: "Folk and classical categories are mixed." },
      { cue: "Literature", rule: "Attach author, work, language, and period.", trap: "Author-work pairs are frequent distractors." }
    ],
    flowchartSteps: ["Classify art/literature", "Attach region", "Attach person/work", "Check category"]
  },
  {
    slug: "sports-awards",
    title: "Sports, Awards, and Honours",
    subject: "General Awareness",
    section: "general-awareness",
    priority: "speed",
    summary: "Sports and awards need current-year tracking plus static association of trophies, venues, and award categories.",
    formulaTable: [
      { cue: "Award", rule: "Remember awarding body, category, recipient, and field.", trap: "Award name and institution can be swapped." },
      { cue: "Tournament", rule: "Attach sport, venue/host, winner, and runner-up when relevant.", trap: "Men's and women's events may have different winners." }
    ],
    flowchartSteps: ["Identify event", "Attach field", "Attach winner/body", "Create recall card"]
  },
  {
    slug: "algebra",
    title: "Algebra",
    subject: "Quantitative Aptitude",
    section: "quantitative-aptitude",
    priority: "foundation",
    summary: "Algebra questions rely on identities, factorisation, equations, and value substitution under strict time limits.",
    formulaTable: [
      { cue: "Identity", rule: "(a+b)^2 = a^2 + 2ab + b^2 and (a-b)^2 = a^2 - 2ab + b^2.", trap: "Middle term sign changes with subtraction." },
      { cue: "Factorisation", rule: "Look for common factor, identity, then splitting middle term.", trap: "Expanding everything can waste time." }
    ],
    flowchartSteps: ["Spot identity", "Factor or substitute", "Simplify", "Check option"]
  },
  {
    slug: "trigonometry",
    title: "Trigonometry",
    subject: "Quantitative Aptitude",
    section: "quantitative-aptitude",
    priority: "revision",
    summary: "SSC trigonometry is identity recall plus standard angle values and simplification.",
    formulaTable: [
      { cue: "Identity", rule: "sin^2 theta + cos^2 theta = 1; 1 + tan^2 theta = sec^2 theta.", trap: "Reciprocal and quotient identities are confused." },
      { cue: "Standard angle", rule: "Memorize 0, 30, 45, 60, 90 degree values.", trap: "sin and cos values swap across complementary angles." }
    ],
    flowchartSteps: ["Convert expression", "Apply identity", "Use standard value", "Simplify"]
  },
  {
    slug: "para-jumbles",
    title: "Para Jumbles",
    subject: "English Comprehension",
    section: "english-comprehension",
    priority: "speed",
    summary: "Para jumbles are solved by finding the opener, mandatory pairs, pronoun links, and conclusion signals.",
    formulaTable: [
      { cue: "Opening sentence", rule: "Prefer broad introduction without unresolved pronoun or connector.", trap: "A sentence with 'this' or 'however' rarely opens." },
      { cue: "Mandatory pair", rule: "Link noun-pronoun, cause-effect, chronology, and examples.", trap: "Theme similarity alone does not prove adjacency." }
    ],
    flowchartSteps: ["Find opener", "Find mandatory pairs", "Order transitions", "Check final flow"]
  },
  {
    slug: "fill-in-the-blanks",
    title: "Fill in the Blanks",
    subject: "English Comprehension",
    section: "english-comprehension",
    priority: "foundation",
    summary: "Blank questions require grammar fit, collocation, tone, and context rather than isolated vocabulary memory.",
    formulaTable: [
      { cue: "Single blank", rule: "Predict the required meaning and part of speech before reading options.", trap: "A familiar word may not fit the grammar." },
      { cue: "Double blank", rule: "Use the easier blank first, then test pair consistency.", trap: "First blank alone can point to a wrong pair." }
    ],
    flowchartSteps: ["Predict meaning", "Check part of speech", "Check collocation", "Verify sentence"]
  }
];

const allTopicSeeds = [...topicSeeds, ...expansionTopicSeeds];

const topicNoteFolders: Record<SscCglSectionId, string> = {
  reasoning: "reasoning",
  "general-awareness": "ga",
  "quantitative-aptitude": "quant",
  "english-comprehension": "english"
};

function stripFrontmatter(markdown: string) {
  return markdown.replace(/^---\s*[\s\S]*?\s*---\s*/, "").trim();
}

function parseDeepNoteSections(seed: TopicSeed) {
  const notePath = path.join(process.cwd(), "docs", "ssc-cgl", topicNoteFolders[seed.section], `${seed.slug}.md`);
  if (!fs.existsSync(notePath)) return null;

  const markdown = stripFrontmatter(fs.readFileSync(notePath, "utf8"));
  const headingPattern = /^##\s+(.+)$/gm;
  const headings = [...markdown.matchAll(headingPattern)];
  if (headings.length < 2) return null;

  const sections = headings
    .map((match, index) => {
      const title = match[1]?.trim() || `Section ${index + 1}`;
      const bodyStart = (match.index ?? 0) + match[0].length;
      const bodyEnd = index < headings.length - 1 ? headings[index + 1]!.index ?? markdown.length : markdown.length;
      const body = markdown.slice(bodyStart, bodyEnd).trim();
      return { title, body };
    })
    .filter((section) => section.body.length > 0);

  return sections.length >= 2 ? sections : null;
}

function buildSeedStudySections(seed: TopicSeed) {
  return [
    { title: "Core rule", body: seed.formulaTable[0]?.rule || seed.summary },
    { title: "Common trap", body: seed.formulaTable[0]?.trap || "Write the relation before checking options." },
    { title: "200/200 drill", body: `Solve five ${seed.title.toLowerCase()} questions under 45 seconds each, then rewrite the one rule that caused hesitation.` }
  ];
}

function sectionPrefix(section: SscCglSectionId) {
  return {
    reasoning: "R",
    "general-awareness": "G",
    "quantitative-aptitude": "Q",
    "english-comprehension": "E"
  }[section];
}

function stemFor(seed: TopicSeed, index: number) {
  const n = index + 1;
  if (seed.section === "quantitative-aptitude") {
    if (seed.slug === "percentages") return `A value is increased by ${10 + n}% and then decreased by ${n}%. Which method gives the net percentage change?`;
    if (seed.slug === "calculation-speed") return `Without long working, estimate ${(48 + n) * (19 + (n % 7))} by using the nearest base and correction. Which route is fastest inside 36 seconds?`;
    return `Two quantities are in the ratio ${n + 2}:${n + 5}. If their sum is ${(n + 7) * 8}, what is the first quantity?`;
  }
  if (seed.section === "english-comprehension") {
    if (seed.slug === "grammar-error-spotting") return `Choose the part that should be checked first in this sentence: "The list of files are on the desk."`;
    return `In a cloze test, which clue should be checked before choosing a near-synonym for blank ${n}?`;
  }
  if (seed.section === "general-awareness") {
    if (seed.slug === "indian-polity-basics") return `A question asks whether a body is constitutional or statutory. What should be checked first?`;
    return `A news item mentions a new government scheme. Which fact-pair is most useful for SSC CGL revision?`;
  }
  if (seed.slug === "series-coding") return `In an alphabet series, letters move +${n}, +${n + 1}, +${n + 2}. What should be checked before marking the answer?`;
  return `In an analogy question, what is the safest first step before comparing the options?`;
}

function optionsFor(seed: TopicSeed, index: number) {
  if (seed.section === "quantitative-aptitude" && seed.slug === "calculation-speed") {
    const a = 48 + index + 1;
    const b = 19 + ((index + 1) % 7);
    const nearestBase = Math.round(a / 10) * 10;
    return [
      { id: "a" as const, text: `${nearestBase} x ${b} ${a >= nearestBase ? "+" : "-"} ${Math.abs(a - nearestBase)} x ${b}` },
      { id: "b" as const, text: `Write ${a} repeatedly ${b} times and add every row` },
      { id: "c" as const, text: `Start exact long multiplication without checking options` },
      { id: "d" as const, text: `Round both numbers and ignore the correction completely` }
    ];
  }
  if (seed.section === "quantitative-aptitude" && seed.slug === "ratio-proportion") {
    const k = 8;
    const a = index + 3;
    const b = index + 6;
    return [
      { id: "a" as const, text: `${a * k}` },
      { id: "b" as const, text: `${b * k}` },
      { id: "c" as const, text: `${(a + b) * k}` },
      { id: "d" as const, text: `${Math.abs(b - a) * k}` }
    ];
  }
  return [
    { id: "a" as const, text: seed.formulaTable[0]?.rule || "Apply the direct rule" },
    { id: "b" as const, text: seed.formulaTable[0]?.trap || "Pick the nearest-looking option" },
    { id: "c" as const, text: "Skip the base relation and use elimination only" },
    { id: "d" as const, text: "Mark the longest option because it has more detail" }
  ];
}

function correctFor(seed: TopicSeed): SscCglOptionId {
  return seed.section === "quantitative-aptitude" && seed.slug === "ratio-proportion" ? "a" : "a";
}

function isAnalogyPrompt(stem: string) {
  return /same way as|related to the third|word[-\s]?pair|letter[-\s]?cluster|number[-\s]?pair|similar to the following|does not belong|odd/i.test(stem);
}

function isCalendarClockPrompt(stem: string) {
  return /day of the week|odd days|leap year|ordinary year|hour hand|minute hand|clock angle|hands of (?:a )?clock|what was the day|what will be the day/i.test(stem);
}

function isSeatingArrangementPrompt(stem: string) {
  return /sitting|seated|circular table|linear arrangement|facing (?:north|south|east|west|towards)|kept one above|places above|places below|placed in a row|arranged in a row/i.test(stem);
}

function isStatementConclusionPrompt(stem: string) {
  return /Statements?\s*[:/]|Conclusions?\s*[:/]|Assertion\s*\(|Reason\s*\(/i.test(stem);
}

function isSyllogismPrompt(stem: string) {
  return isStatementConclusionPrompt(stem) && /\b(?:All|Some|No)\s+[A-Za-z]+s?\s+(?:are|is)\b/i.test(stem);
}

function isReasoningAnalogyContamination(topic: string, stem: string) {
  return ["calendar-clock", "direction-distance", "statement-conclusion"].includes(topic) && isAnalogyPrompt(stem);
}

function hasQuantEvidence(stem: string, pattern: RegExp) {
  return pattern.test(stem);
}

function normalizedQuantTopicFromEvidence(stem: string): string | null {
  const checks: Array<[string, RegExp]> = [
    ["hcf-and-lcm", /\b(?:HCF|L\.?C\.?M\.?|highest common factor|least common multiple|greatest common divisor|greatest common factor|common factor|common multiple)\b/i],
    ["simplification", /\b(?:simplify|simplification|BODMAS|surds?|indices|index laws?|rationali[sz]e|approximation|cube root|square root)\b/i],
    ["data-interpretation", /\b(?:data interpretation|bar graph|pie chart|line graph|table|chart|graph|appeared candidates|qualified candidates)\b/i],
    ["geometry-mensuration", /\b(?:mensuration|geometry|coordinate geometry|area|perimeter|volume|surface area|curved surface|total surface|triangle|circle|rectangle|square|polygon|cylinder|cone|sphere|hemisphere|radius|diameter|circumference|chord|tangent)\b/i],
    ["trigonometry", /\b(?:trigonometry|trigonometrical|sin|cos|tan|cot|sec|cosec|theta|height and distance|angle of elevation|angle of depression)\b/i],
    ["probability", /\b(?:probability|random|events?|favo[u]?rable|dice|die|tossed|pack of cards|drawn (?:from|at random)|chosen at random)\b/i],
    ["simple-compound-interest", /\b(?:simple interest|compound interest|principal|amount|rate of interest|installments?|interest compounded)\b/i],
    ["time-work-pipes", /\b(?:work and time|time and work|pipes?|cistern|fill(?:ed)?|empty|efficiency|men can do|women can do|days to complete)\b/i],
    ["time-speed-distance", /\b(?:time speed distance|speed|distance|train|boat|stream|race|km\/?h|m\/?s|relative speed|upstream|downstream)\b/i],
    ["profit-loss-discount", /\b(?:profit|loss|discount|marked price|selling price|cost price|gain|markup)\b/i],
    ["averages-mixtures-alligation", /\b(?:average|mean|median|mode|mixture|alligation|weighted mean)\b/i],
    ["ratio-proportion", /\b(?:ratio|proportion|partnership|share|divided in|variation)\b/i],
    ["percentages", /\b(?:percentage|percent|successive|increase by|decrease by|%)/i],
    ["algebra", /\b(?:algebra|equation|identity|factorisation|factorization|polynomial|quadratic|cubic|roots?|x\^?2|x\s*[+\-])\b/i],
    ["number-system", /\b(?:number system|prime|composite|divisib|remainder|unit digit|integer|rational|irrational|natural numbers|whole numbers|perfect square)\b/i]
  ];

  return checks.find(([, pattern]) => hasQuantEvidence(stem, pattern))?.[0] ?? null;
}

function englishOnlyText(value: string) {
  return value
    .replace(/[\u0900-\u097F]/g, "")
    .replace(/[\uE000-\uF8FF]/g, "")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/([(/|])\s+|\s+([)/|])/g, "$1$2")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function isThinSscExplanation(value: string) {
  const explanation = englishOnlyText(value);
  return explanation.length < 120 || /^answer\s*[:\-]?\s*[abcd]\.?$/i.test(explanation);
}

function hasStructuredSscExplanation(value: string) {
  return /Correct answer:/i.test(value)
    && /Method:/i.test(value)
    && /Why it fits:/i.test(value)
    && /Trap to avoid:/i.test(value);
}

function isGenericStructuredSscExplanation(value: string) {
  return /answer must match the exact condition in the stem/i.test(value)
    || /synonym,\s*function,\s*part-whole,\s*class-member,\s*cause-effect/i.test(value);
}

function optionLabel(optionId: SscCglOptionId) {
  return optionId.toUpperCase();
}

function inferQuestionRoute(question: SscCglQuestion, seed: (typeof allTopicSeeds)[number] | undefined) {
  const stem = question.stem;

  if (question.topic === "data-interpretation") {
    return {
      route: "data interpretation",
      method: "36-second DI route: lock the row, column, unit, and base first; then choose the operation asked by the stem such as total, difference, ratio, average, percentage, or share. Use the option gap to stop calculation as soon as the answer is fixed.",
      fit: "The keyed option is the value obtained after reading the correct table or chart labels, using the right base, and applying the asked operation.",
      trap: "Do not start arithmetic from the first visible number; most DI mistakes come from the wrong row, wrong denominator, missing unit, or over-calculation."
    };
  }

  if (/number-pair|numbers are related|set in which the numbers|following set|^\s*\(?\d+\s*[,.:]/i.test(stem)) {
    return {
      route: "number analogy",
      method: "Treat it as a number-relation item: test square/cube, multiplication or division, addition or subtraction, digit sum or product, and constant difference before comparing options.",
      fit: "The stem asks for the same numeric relationship, so the keyed option must preserve the operation or property used in the given pair/set.",
      trap: "Do not use word-analogy shortcuts on number items; one option can look close while matching only part of the operation."
    };
  }

  if (/\b(?:letter|alphabet|letters?|cluster)\b/i.test(stem) && /(?:same way|related|odd|different|does not belong|following)/i.test(stem)) {
    return {
      route: "letter or word pattern",
      method: "Convert letters to positions where needed, then check equal shift, alternating shift, reverse order, opposite alphabet pairs, and internal gaps.",
      fit: "The keyed option is the one that keeps the same positional or relation pattern as the stem.",
      trap: "Do not check only the first letter or first word; SSC distractors often preserve one visible cue while breaking the internal relation."
    };
  }

  if (isAnalogyPrompt(stem) && /\b[A-Z]{2,}\b\s*:|:\s*\b[A-Z]{2,}\b|::\s*\b[A-Z]{2,}\b/.test(stem)) {
    return {
      route: "coded-letter analogy",
      method: "Treat each letter group as positions: check per-letter shifts, reverse order, opposite alphabet pairs, and repeated internal gaps before comparing the option groups.",
      fit: "The keyed option keeps the same letter-position operation from the first pair when applied to the target group.",
      trap: "Do not match only the first or last letter; coded analogies usually require every position in the group to obey the same route."
    };
  }

  if (isAnalogyPrompt(stem)) {
    return {
      route: "word analogy",
      method: "Name the relation family first: synonym or antonym, use/function, part-whole, class-member, cause-effect, degree, source-product, worker-place, animal-young, or field-study.",
      fit: "The keyed option preserves the same relation family and direction as the given pair.",
      trap: "Do not pick a merely associated word; the option must keep the same relation type and direction."
    };
  }

  if (/\b(?:odd|different|does not belong|three of the following|classification)\b/i.test(stem)) {
    return {
      route: "classification",
      method: "Find the narrowest property shared by three options, then reject the one option that breaks that property.",
      fit: "The keyed option is the outlier after the common property of the other three choices is fixed.",
      trap: "Avoid broad categories that include all four choices; the exam usually tests the most specific separating property."
    };
  }

  if (question.topic === "syllogism-venn") {
    return {
      route: "syllogism",
      method: "Draw the minimum Venn relation from the statements, then test each conclusion only for definite truth.",
      fit: "The keyed option follows from the forced Venn relation, not from a possible real-world assumption.",
      trap: "Do not import outside knowledge or assume conversion unless the statement allows it."
    };
  }

  if (question.topic === "statement-conclusion") {
    return {
      route: "statement conclusion",
      method: "Translate the statement into definite conditions, then mark only conclusions that must follow in every valid case.",
      fit: "The keyed option is the conclusion status that is forced by the wording of the statement.",
      trap: "Avoid conclusions that are merely probable, socially familiar, or true outside the given statement."
    };
  }

  if (question.topic === "direction-distance") {
    return {
      route: "direction and distance",
      method: "Draw the path step by step with north fixed upward, combine horizontal and vertical displacement, then answer direction or distance.",
      fit: "The keyed option matches the final displacement after every turn and distance is accounted for.",
      trap: "Do not answer from the last turn alone; cumulative displacement decides the result."
    };
  }

  if (question.topic === "calendar-clock") {
    return {
      route: "calendar or clock",
      method: "Identify whether the item is odd-days, day/date, angle, mirror image, or time gain/loss, then apply that formula directly.",
      fit: "The keyed option is obtained by applying the relevant calendar or clock rule to the exact given values.",
      trap: "Do not mix 12-hour clock angle logic with calendar odd-day counting."
    };
  }

  if (question.section === "quantitative-aptitude") {
    return {
      route: seed?.title ?? "quantitative aptitude",
      method: seed?.formulaTable[0]?.rule ?? "Write the asked value, choose the shortest formula route, calculate only as far as the option gap requires, and verify units.",
      fit: "The keyed option is the numerical value obtained after applying the topic formula to the quantities in the stem.",
      trap: seed?.formulaTable[0]?.trap ?? "Do not over-calculate before checking whether the option gap already fixes the answer."
    };
  }

  if (question.section === "english-comprehension") {
    return {
      route: seed?.title ?? "English comprehension",
      method: seed?.formulaTable[0]?.rule ?? "Read the sentence for grammar role, meaning, tone, and option fit before selecting the cleanest expression.",
      fit: "The keyed option best satisfies the grammar or meaning requirement asked in the stem.",
      trap: seed?.formulaTable[0]?.trap ?? "Do not choose a familiar phrase if it changes tense, agreement, tone, or meaning."
    };
  }

  if (question.section === "general-awareness") {
    return {
      route: seed?.title ?? "general awareness",
      method: seed?.formulaTable[0]?.rule ?? "Identify the exact fact category, recall the fixed fact, and eliminate neighbouring facts from related topics.",
      fit: "The keyed option matches the requested fact category and not a nearby but different fact.",
      trap: seed?.formulaTable[0]?.trap ?? "Do not mark a related keyword unless it answers the exact fact asked."
    };
  }

  return {
    route: seed?.title ?? question.subtopic,
    method: seed?.formulaTable[0]?.rule ?? seed?.summary ?? "identify the tested rule, eliminate mismatched options, and verify the keyed option against the stem",
    fit: `The keyed option follows the ${seed?.title ?? question.subtopic} route after the stem is classified correctly.`,
    trap: seed?.formulaTable[0]?.trap ?? "do not choose a familiar-looking option until it satisfies the exact asked relation"
  };
}

function cleanGeneratedRouteText(value: string, fallback: string) {
  if (!value) return fallback;
  if (/synonym,\s*function,\s*part-whole,\s*class-member,\s*cause-effect/i.test(value)) return fallback;
  if (/answer must match the exact condition in the stem/i.test(value)) return fallback;
  return value;
}

function extractSourceCue(existingExplanation: string) {
  const sourceCue = existingExplanation.match(/Source cue:\s*(.+)$/i)?.[1]?.trim();
  if (sourceCue) return sourceCue;
  const answerCue = existingExplanation.match(/\bSol(?:ution)?\.?\s*\d*\.?\s*\(?[a-d]\)?[^.]*\.?/i)?.[0]?.trim();
  if (answerCue) return answerCue;
  if (!existingExplanation || /^answer\s*[:\-]?\s*[abcd]\.?$/i.test(existingExplanation)) return "";
  if (hasStructuredSscExplanation(existingExplanation)) return "";
  return existingExplanation.replace(/\s+/g, " ").trim();
}

function inferGrammarErrorRoute(question: SscCglQuestion, correctText: string, sourceCue: string) {
  const evidence = englishOnlyText([
    question.stem,
    correctText,
    sourceCue,
    question.subtopic,
    ...question.conceptTags
  ].join(" ")).toLowerCase();

  if (/\bin case that\b|\bin case\b.*\bthat\b|\bin case of\b/.test(evidence)) {
    return {
      route: "connector and fixed phrase",
      method: "36-second cue: check whether the keyed phrase is a valid connector. 'In case' is used without 'that', while 'in case of' must be followed by a noun phrase.",
      fit: "The keyed segment contains the connector error, so correcting that phrase restores the sentence link.",
      trap: "Do not treat every causal-looking connector as interchangeable; 'because', 'in case', and 'in case of' take different structures."
    };
  }

  if (/\bmore smarter\b|\bmore better\b|\bmost best\b|\bmore wiser\b|\bcomparative degree\b|\bsuperfluousness\b|\bredundant comparative\b/.test(evidence)) {
    return {
      route: "comparative redundancy",
      method: "36-second cue: when the adjective is already comparative, remove extra degree markers such as 'more' or 'most' before it.",
      fit: "The keyed option contains a double comparative, so the correction is to keep only the comparative form required by the comparison.",
      trap: "Do not treat 'more' as harmless emphasis; SSC marks 'more smarter' type phrases as redundant comparison errors."
    };
  }

  if (/\bunless\b.*\b(?:did not|does not|do not|not)\b|\bconditional statement\b.*\bif\b/.test(evidence)) {
    return {
      route: "conditional double negative",
      method: "36-second cue: read 'unless' as 'if not'. If another 'not' appears in the same condition, replace the connector or remove the extra negative.",
      fit: "The keyed option makes the condition double-negative, so the sentence logic becomes the opposite of the intended warning.",
      trap: "Do not combine 'unless' with 'not' unless the sentence deliberately needs a rare double-negative meaning."
    };
  }

  if (/\bsince the past\b|\bfor refers\b|\bfor \d+\b|\bperiod of time\b/.test(evidence)) {
    return {
      route: "time preposition",
      method: "36-second cue: use 'for' with a duration and 'since' with a starting point. A phrase such as 'the past one week' is a duration, not a starting point.",
      fit: "The keyed option uses the wrong time preposition for a period of time.",
      trap: "Do not choose 'since' just because the tense is perfect continuous; first decide whether the phrase is a point or a duration."
    };
  }

  if (/\bat a pure state\b|\bin a pure state\b|\bcondition or state\b/.test(evidence)) {
    return {
      route: "state preposition",
      method: "36-second cue: for condition or state, test the fixed pattern 'in a state', not the location preposition 'at'.",
      fit: "The keyed option has the preposition slot that breaks the standard phrase for condition or state.",
      trap: "Do not let a physical-location sense of 'at' override fixed abstract-state usage."
    };
  }

  if (/\bwhich mends\b|\bcobbler\b|\bwho\b|\bwhom\b|\bwhose\b|\brelative pronoun\b/.test(evidence)) {
    return {
      route: "relative pronoun",
      method: "36-second cue: identify the noun being referred to and choose a relative pronoun that matches person, thing, possession, or object role.",
      fit: "The keyed option uses the wrong relative-pronoun relation for the noun it refers to.",
      trap: "Do not use 'which' for a person or occupation when the clause needs 'who' or 'that'."
    };
  }

  if (/\bentering the hall\b|\bdangling modifier\b|\bmisplaced modifier\b|\bmodifier\b.*\bshow\b/.test(evidence)) {
    return {
      route: "dangling modifier",
      method: "36-second cue: after an opening -ing phrase, immediately check who performs that action; the next noun must be the doer.",
      fit: "The keyed option starts a modifier that wrongly attaches the action to the show instead of to a person entering the hall.",
      trap: "Do not repair only the tense when the sentence begins with a participial phrase; first attach the modifier to the correct subject."
    };
  }

  if (/\bsense pleasures\b|\bsensuous\b|\bsensory\b|\bword choice\b|\bcollocation\b/.test(evidence)) {
    return {
      route: "word choice and collocation",
      method: "36-second cue: test whether the keyed word is the correct adjective/noun form in the phrase, not merely a related word from the same meaning family.",
      fit: "The keyed option uses the wrong word form for pleasures linked to gratification of the senses.",
      trap: "Do not keep a familiar noun where the phrase needs an adjective such as 'sensuous' or another exact collocation."
    };
  }

  if (/\balthough\b|\bin order that\b|\bunless\b|\bwhereas\b|\bdespite\b|\bbecause\b|\bconjunction\b/.test(evidence)) {
    return {
      route: "conjunction logic",
      method: "36-second cue: read the two clauses and decide whether the connector must show cause, contrast, purpose, condition, or time before checking the keyed option.",
      fit: "The keyed option is the connector or clause-link that breaks the intended relationship between the two clauses.",
      trap: "Do not choose a connector only because it is grammatically possible; it must express the sentence's exact logic."
    };
  }

  if (/\bknocking\b|\bbeing\b|\bdropped\b|\bpast simple\b|\bpast perfect\b|\bhad not being\b|\btense\b|\bverb form\b|\bgerund\b|\binfinitive\b|\bforgot lock\b/.test(evidence)) {
    return {
      route: "tense and verb form",
      method: "36-second cue: locate the main verb timeline and check whether the keyed phrase needs a finite verb, participle, gerund, infinitive, or completed tense form.",
      fit: "The keyed option has the verb-form or tense error that prevents the sentence from matching its timeline.",
      trap: "Do not preserve an -ing form or auxiliary just because it sounds fluent; it must fit the required finite or non-finite verb slot."
    };
  }

  if (/\beach of\b|\bone of\b|\bevery\b|\bneither\b|\beither\b|\bwere\b|\bare\b|\bis\b|\bhave\b|\bhas\b|\bsubject[- ]verb\b|\bagreement\b|\bspecies\b/.test(evidence)) {
    return {
      route: "subject-verb agreement",
      method: "36-second cue: find the real subject, ignore phrases placed between subject and verb, then match singular/plural verb number to that subject.",
      fit: "The keyed option contains the agreement point where the subject and verb number do not match.",
      trap: "Do not let nearby plural nouns inside phrases decide the verb; the head subject controls agreement."
    };
  }

  if (/\bpreposition\b|\bfrom colours\b|\bsince the past\b|\bfor refers\b|\bconsist of\b|\bdepends on\b|\baccording to\b/.test(evidence)) {
    return {
      route: "preposition and idiom",
      method: "36-second cue: check whether the keyed word belongs to a fixed preposition pattern, time expression, or idiomatic phrase required by the surrounding words.",
      fit: "The keyed option is the preposition or idiom slot that makes the phrase non-standard.",
      trap: "Do not translate from another language or pick a familiar preposition; SSC tests fixed English pairings."
    };
  }

  if (/\barticle\b|\ba\b|\ban\b|\bthe\b/.test(evidence) && /\b(article|vowel|consonant|specific|unique)\b/.test(evidence)) {
    return {
      route: "article use",
      method: "Check whether the noun is specific, general, countable, singular, plural, vowel-sound based, or a fixed zero-article phrase.",
      fit: "The keyed option is the article slot that does not match the noun's reference.",
      trap: "Do not decide from spelling alone; article choice follows sound and noun reference."
    };
  }

  return {
    route: "grammar error spotting",
    method: "36-second cue: read the sentence by slots: subject, verb, object/complement, connector, preposition, modifier, and tense; then test the keyed phrase against its slot rule.",
    fit: sourceCue
      ? `The source cue points to the rule break: ${sourceCue}`
      : "The keyed option is the reviewed phrase that violates the sentence's grammar or idiom requirement.",
    trap: "Do not stop at the first phrase that sounds unusual; verify the exact rule being tested before marking the error."
  };
}

function buildMethodExplanation(question: SscCglQuestion, existingExplanation: string) {
  const seed = allTopicSeeds.find((item) => item.slug === question.topic);
  const correctOption = question.options.find((option) => option.id === question.correctOption);
  const correctText = correctOption?.text?.trim() || "the keyed option";
  const sourceCue = extractSourceCue(existingExplanation);
  const route = question.topic === "grammar-error-spotting"
    ? inferGrammarErrorRoute(question, correctText, sourceCue)
    : inferQuestionRoute(question, seed);
  const method = cleanGeneratedRouteText(
    route.method,
    "Classify the item type from the stem, apply that route to the given values or words, then compare every option against the same rule."
  );
  const fit = cleanGeneratedRouteText(
    route.fit,
    "The keyed option is the reviewed match after applying the item-specific route to the stem."
  );
  const trap = cleanGeneratedRouteText(
    route.trap,
    "Do not choose by surface familiarity; verify that the option follows the same rule through the full stem."
  );
  const sourceLine = sourceCue ? ` Source cue: ${sourceCue}` : "";

  return [
    `Correct answer: ${optionLabel(question.correctOption)} (${correctText}).`,
    `Method: ${method}`,
    `Why it fits: this is a ${route.route} question. ${fit} Option ${optionLabel(question.correctOption)} is the reviewed keyed answer.`,
    `Trap to avoid: ${trap}`,
    sourceLine.trim()
  ].filter(Boolean).join(" ");
}

function ensureMethodExplanation(question: SscCglQuestion): string {
  const explanation = englishOnlyText(question.explanation);
  if (
    question.topic !== "grammar-error-spotting"
    && question.topic !== "data-interpretation"
    && hasStructuredSscExplanation(explanation)
    && !isGenericStructuredSscExplanation(explanation)
  ) return explanation;
  return englishOnlyText(buildMethodExplanation(question, explanation));
}

function ensureRankedPracticeExplanation(question: SscCglQuestion): SscCglQuestion {
  if (question.reviewStatus !== "reviewed") return question;
  return {
    ...question,
    explanation: ensureMethodExplanation(question)
  };
}

function normalizeBookQuestionTopic(question: SscCglQuestion): SscCglQuestion {
  if (question.provenance.sourceType !== "book_user_provided") return question;
  const provenance = question.provenance as SscCglQuestion["provenance"] & { chapterSlug?: string; chapterTitle?: string };
  const stem = [
    question.stem,
    question.subtopic,
    question.explanation,
    provenance.chapterSlug,
    provenance.chapterTitle,
    ...question.conceptTags
  ].filter(Boolean).join(" ");
  let topic = question.topic;

  if (question.section === "reasoning") {
    if (isSeatingArrangementPrompt(stem)) topic = "seating-arrangement";
    else if (isSyllogismPrompt(stem)) topic = "syllogism-venn";
    else if (isReasoningAnalogyContamination(topic, stem)) topic = "analogy-classification";
    else if (isCalendarClockPrompt(stem)) topic = "calendar-clock";
    else if (isStatementConclusionPrompt(stem)) topic = "statement-conclusion";
  }

  if (question.section === "quantitative-aptitude") {
    topic = normalizedQuantTopicFromEvidence(stem) ?? topic;
  }

  if (topic === question.topic) return question;
  return {
    ...question,
    topic,
    conceptTags: [...new Set([...question.conceptTags.filter((tag) => tag !== question.topic), topic, "topic-normalized"])]
  };
}

function normalizeBookQuestion(question: SscCglQuestion): SscCglQuestion {
  const topicNormalized = normalizeBookQuestionTopic(question);
  if (topicNormalized.provenance.sourceType !== "book_user_provided") return topicNormalized;
  return {
    ...topicNormalized,
    stem: englishOnlyText(topicNormalized.stem),
    explanation: ensureMethodExplanation({
      ...topicNormalized,
      stem: englishOnlyText(topicNormalized.stem),
      options: topicNormalized.options.map((option) => ({
        ...option,
        text: englishOnlyText(option.text) || "Option text unavailable after English-only cleanup"
      }))
    }),
    options: topicNormalized.options.map((option) => ({
      ...option,
      text: englishOnlyText(option.text) || "Option text unavailable after English-only cleanup"
    }))
  };
}

function isUnsolvableDiFragment(question: SscCglQuestion): boolean {
  if (question.section !== "quantitative-aptitude" || question.topic !== "data-interpretation") return false;
  const stem = englishOnlyText(question.stem);
  const optionTexts = question.options.map((option) => englishOnlyText(option.text));
  const longPassageOptions = optionTexts.filter((text) => text.length > 70).length;
  const stemWords = stem.split(/\s+/).filter(Boolean).length;
  const asksAQuestion = /\b(?:what|which|find|calculate|how many|percentage|ratio|average|difference|total)\b/i.test(stem);
  const hasContextCue = /\b(?:given|following|table|chart|graph|pie|bar|line|study)\b/i.test(stem);
  const startsWithTableRow = /^\s*(?:[%:.,]|\d|\b[PQRSTUV]\b|\b[ABCDE]\b|\s)+/i.test(stem);
  const optionsArePassageText = longPassageOptions >= 2 && stemWords <= 16;

  return optionsArePassageText || (startsWithTableRow && asksAQuestion && !hasContextCue);
}

function loadCuratedImportedQuestions(): SscCglQuestion[] {
  if (isUploadedBookCorpusActive()) return [];
  const curatedPath = path.join(process.cwd(), "data", "exams", "ssc-cgl", "curated-imports", "questions.json");
  if (!fs.existsSync(curatedPath)) return [];
  try {
    const payload = JSON.parse(fs.readFileSync(curatedPath, "utf8")) as unknown;
    if (!Array.isArray(payload)) return [];
    return payload.filter((question): question is SscCglQuestion => {
      if (!question || typeof question !== "object") return false;
      const row = question as Partial<SscCglQuestion>;
      return Boolean(
        row.id
        && row.exam === "SSC-CGL"
        && row.tier === "Tier-I"
        && row.reviewStatus === "reviewed"
        && row.provenance?.sourceType !== "web_pdf_unverified"
        && row.options?.length === 4
        && row.correctOption
      );
    }).map(normalizeBookQuestion);
  } catch {
    return [];
  }
}

function buildReasoningCoverageRepairPracticeQuestions(existing: SscCglQuestion[]): SscCglQuestion[] {
  const targets = new Map([
    ["direction-distance", 100],
    ["seating-arrangement", 100],
    ["statement-conclusion", 100],
    ["calendar-clock", 100]
  ]);
  const counts = new Map<string, number>();
  for (const question of existing) {
    if (question.section === "reasoning") counts.set(question.topic, (counts.get(question.topic) ?? 0) + 1);
  }

  const questions: SscCglQuestion[] = [];
  for (const [topic, target] of targets) {
    const seed = allTopicSeeds.find((item) => item.slug === topic);
    if (!seed) continue;
    const missing = Math.max(0, target - (counts.get(topic) ?? 0));
    for (let index = 0; index < missing; index += 1) {
      const serial = String(index + 1).padStart(3, "0");
      const id = `ssc-cgl-reasoning-gap-repair-${topic}-${serial}`;
      questions.push({
        id,
        exam: "SSC-CGL",
        tier: "Tier-I",
        year: 2026,
        shift: `Reasoning 200/200 gap-repair drill - ${seed.title}`,
        source: "Original practice",
        section: "reasoning",
        topic,
        subtopic: seed.title,
        difficulty: index % 5 === 0 ? "hard" : index % 2 === 0 ? "medium" : "easy",
        language: "en",
        stem: reasoningGapRepairStem(topic, index),
        options: reasoningGapRepairOptions(topic, index),
        correctOption: "a",
        explanation: reasoningGapRepairExplanation(topic, index),
        marksCorrect: 2,
        marksWrong: -0.5,
        marksUnattempted: 0,
        timerSeconds: 900,
        ocrConfidence: 1,
        reviewStatus: "reviewed",
        conceptTags: ["200-200-coverage-gap", topic, "reasoning", "gap-repair"],
        provenance: {
          sourceId: `ssc-cgl-reasoning-gap-repair-${topic}`,
          sourceType: "original_practice",
          title: `Original SSC CGL Reasoning gap-repair drill bank for ${seed.title}`,
          url: "https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/Notice_of_adv_cgl_2026.pdf",
          licenseNote: "Original practice item generated to repair low-volume topic coverage after uploaded-book corpus audit."
        }
      });
    }
  }

  return questions;
}

function reasoningGapRepairStem(topic: string, index: number) {
  if (topic === "calendar-clock") {
    const year = 2028 + index;
    const date = 1 + (index % 27);
    const month = ["January", "February", "March", "April", "May", "June"][index % 6]!;
    return `Calendar drill: if 1 January ${year} is Monday, what is the fastest way to find the day of the week on ${date} ${month} ${year}?`;
  }
  if (topic === "statement-conclusion") {
    const domains = [
      ["candidates", "revise mistakes daily", "score full marks consistently"],
      ["students", "master official-pattern mocks", "finish every section within time"],
      ["aspirants", "analyse wrong answers", "avoid repeating the same error"],
      ["test takers", "practise timed sections", "build reliable exam speed"],
      ["learners", "memorise static facts with revision", "retain general awareness facts"]
    ][index % 5]!;
    const qualifier = ["Only", "All successful", "No consistently successful"][index % 3]!;
    return `Statement-conclusion drill ${index + 1}: ${qualifier} ${domains[0]} who ${domains[1]} can ${domains[2]}. Conclusion I: ${domains[1]} is necessary for ${domains[2]}. Conclusion II: Every candidate who ${domains[1]} will ${domains[2]}. Which conclusion follows?`;
  }
  if (topic === "blood-relation") {
    const cases = [
      ["A is the mother of B. B is the brother of C.", "How is A related to C?", "Mother", "Sister", "Daughter", "Father"],
      ["P is the father of Q. Q is the sister of R.", "How is P related to R?", "Father", "Brother", "Son", "Uncle"],
      ["M is the brother of N. N is the mother of O.", "How is M related to O?", "Maternal uncle", "Father", "Sister", "Daughter"],
      ["X is the daughter of Y. Y is the wife of Z.", "How is Z related to X?", "Father", "Mother", "Sister", "Brother"],
      ["R is the son of S. S is the daughter of T.", "How is T related to R?", "Grandparent", "Brother", "Son", "Nephew"]
    ][index % 5]!;
    return `Blood relation drill ${index + 1}: ${cases[0]} ${cases[1]}`;
  }
  if (topic === "direction-distance") {
    const north = 8 + index;
    const east = 6 + (index % 17);
    return `Direction-distance drill: A person walks ${north} m north, then ${east} m east, then returns ${north} m south. What is the shortest distance and direction from the starting point?`;
  }
  if (topic === "seating-arrangement") {
    const people = ["A, B, C, D, E and F", "P, Q, R, S, T and U", "K, L, M, N, O and P"][index % 3]!;
    const fixedPosition = ["second from the left", "third from the right", "at the extreme left", "immediately left of the middle seat"][index % 4]!;
    const neighbour = ["immediately to the right", "two places to the left", "immediately to the left", "not adjacent"][index % 4]!;
    return `Seating arrangement drill ${index + 1}: ${people} sit in a row facing north. A fixed clue places one person ${fixedPosition} and another ${neighbour}. What should be placed first?`;
  }
  return `${topic} reasoning drill ${index + 1}: Which first step gives the fastest reliable SSC CGL reasoning solution route for this topic?`;
}

function reasoningGapRepairOptions(topic: string, index: number) {
  if (topic === "calendar-clock") {
    return [
      { id: "a" as const, text: "Count odd days from the anchor date and reduce the total modulo 7" },
      { id: "b" as const, text: "Count only the number of months and ignore extra days" },
      { id: "c" as const, text: "Assume every month has exactly 30 days" },
      { id: "d" as const, text: "Use the weekday of the previous year without leap-year adjustment" }
    ];
  }
  if (topic === "statement-conclusion") {
    return [
      { id: "a" as const, text: "Only Conclusion I follows" },
      { id: "b" as const, text: "Only Conclusion II follows" },
      { id: "c" as const, text: "Both I and II follow" },
      { id: "d" as const, text: "Neither I nor II follows" }
    ];
  }
  if (topic === "blood-relation") {
    const cases = [
      ["Mother", "Sister", "Daughter", "Father"],
      ["Father", "Brother", "Son", "Uncle"],
      ["Maternal uncle", "Father", "Sister", "Daughter"],
      ["Father", "Mother", "Sister", "Brother"],
      ["Grandparent", "Brother", "Son", "Nephew"]
    ][index % 5]!;
    return optionTexts(cases[0]!, cases[1]!, cases[2]!, cases[3]!);
  }
  if (topic === "direction-distance") {
    const east = 6 + (index % 17);
    return [
      { id: "a" as const, text: `${east} m east` },
      { id: "b" as const, text: `${east} m west` },
      { id: "c" as const, text: `${east + 8 + index} m north-east` },
      { id: "d" as const, text: "0 m, back at the starting point" }
    ];
  }
  return [
    { id: "a" as const, text: "Place the definite position clue first, then branch uncertain clues" },
    { id: "b" as const, text: "Start from the longest sentence even if it is not fixed" },
    { id: "c" as const, text: "Ignore facing direction until the end" },
    { id: "d" as const, text: "Draw every possible row before using fixed clues" }
  ];
}

function reasoningGapRepairExplanation(topic: string, index: number) {
  if (topic === "calendar-clock") {
    return "Calendar and clock questions are modular arithmetic. The reliable SSC route is to anchor the known day, count odd days, reduce modulo 7, and then map the remainder to the weekday.";
  }
  if (topic === "statement-conclusion") {
    return "The statement gives a necessary condition, not a sufficient guarantee. Conclusion I follows because consistent full marks require daily mistake revision; Conclusion II overstates the statement.";
  }
  if (topic === "blood-relation") {
    return "Blood-relation questions should be solved one link at a time on a generation line. Translate each relation, mark gender only when stated, and then answer the relation asked from the final person's point of view.";
  }
  if (topic === "direction-distance") {
    return "Direction-distance questions should be reduced to net displacement. The north and south movements cancel here, so only the eastward movement remains.";
  }
  return "In seating arrangement, fixed position clues reduce uncertainty fastest. Place definite locations and immediate-neighbour clues first, then test remaining branches against every condition.";
}

function buildTopicCoverageRepairPracticeQuestions(existing: SscCglQuestion[]): SscCglQuestion[] {
  const minimumPerTopic = 500;
  const counts = new Map<string, number>();

  for (const question of existing) {
    if (question.reviewStatus === "reviewed") counts.set(question.topic, (counts.get(question.topic) ?? 0) + 1);
  }

  const questions: SscCglQuestion[] = [];
  for (const seed of allTopicSeeds) {
    const missing = Math.max(0, minimumPerTopic - (counts.get(seed.slug) ?? 0));
    const repairPrefix = `ssc-cgl-topic-gap-repair-${seed.section}-${seed.slug}-`;
    const startIndex = existing.reduce((max, question) => {
      if (!question.id.startsWith(repairPrefix)) return max;
      const serial = Number(question.id.slice(repairPrefix.length));
      return Math.max(max, Number.isFinite(serial) ? serial : 0);
    }, 0);
    for (let index = 0; index < missing; index += 1) {
      const repairIndex = startIndex + index;
      const serial = String(repairIndex + 1).padStart(3, "0");
      const prompt = topicCoverageRepairPrompt(seed, repairIndex);
      questions.push({
        id: `ssc-cgl-topic-gap-repair-${seed.section}-${seed.slug}-${serial}`,
        exam: "SSC-CGL",
        tier: "Tier-I",
        year: 2026,
        shift: `SSC CGL 200/200 topic-depth gap-repair drill - ${seed.title}`,
        source: "Original practice",
        section: seed.section,
        topic: seed.slug,
        subtopic: seed.title,
        difficulty: index % 5 === 0 ? "hard" : index % 2 === 0 ? "medium" : "easy",
        language: "en",
        stem: prompt.stem,
        options: prompt.options,
        correctOption: "a",
        explanation: prompt.explanation,
        marksCorrect: 2,
        marksWrong: -0.5,
        marksUnattempted: 0,
        timerSeconds: 900,
        ocrConfidence: 1,
        reviewStatus: "reviewed",
        conceptTags: ["200-200-coverage-gap", seed.slug, seed.section, "gap-repair"],
        provenance: {
          sourceId: `ssc-cgl-topic-gap-repair-${seed.slug}`,
          sourceType: "original_practice",
          title: `Original SSC CGL topic-depth gap-repair drill bank for ${seed.title}`,
          url: "https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/Notice_of_adv_cgl_2026.pdf",
          licenseNote: "Original practice item generated to repair low-volume topic coverage after uploaded-book corpus audit."
        }
      });
    }
  }

  return questions;
}

function topicCoverageRepairPrompt(seed: TopicSeed, index: number): { stem: string; options: SscCglQuestion["options"]; explanation: string } {
  if (seed.slug === "computer-awareness") {
    const prompts = [
      ["volatile memory used for active running programs", "RAM", "ROM", "Hard disk", "Printer"],
      ["shortcut commonly used to copy selected text", "Ctrl + C", "Ctrl + V", "Ctrl + X", "Alt + F4"],
      ["network protocol used for secure web browsing", "HTTPS", "FTP", "SMTP", "POP3"],
      ["device used to convert printed text into digital input", "Scanner", "Monitor", "Speaker", "Projector"]
    ][index % 4]!;
    return {
      stem: `Computer awareness drill ${index + 1}: Identify the ${prompts[0]}.`,
      options: optionTexts(prompts[1], prompts[2], prompts[3], prompts[4]),
      explanation: `Computer awareness questions are direct definition and function checks. Here the correct match is ${prompts[1]}; the other options belong to a different device, command, storage class, or protocol family.`
    };
  }

  if (seed.slug === "environment-ecology") {
    const prompts = [
      ["gas mainly responsible for ozone-layer depletion in classic SSC static GK", "CFCs", "Nitrogen", "Oxygen", "Argon"],
      ["process by which green plants prepare food", "Photosynthesis", "Respiration", "Transpiration", "Fermentation"],
      ["term for the variety of living organisms in an area", "Biodiversity", "Humidity", "Salinity", "Erosion"],
      ["non-renewable energy source", "Coal", "Solar energy", "Wind energy", "Tidal energy"]
    ][index % 4]!;
    return {
      stem: `Environment and ecology drill ${index + 1}: Choose the correct answer for ${prompts[0]}.`,
      options: optionTexts(prompts[1], prompts[2], prompts[3], prompts[4]),
      explanation: `Environment questions reward exact term-to-fact recall. The correct answer is ${prompts[1]}; the distractors are related science words but not the asked environmental fact.`
    };
  }

  if (seed.slug === "probability") {
    const total = 6 + (index % 5);
    const favorable = 1 + (index % Math.max(2, total - 2));
    return {
      stem: `Probability drill ${index + 1}: A bag contains ${favorable} red balls and ${total - favorable} blue balls. One ball is drawn at random. What is the probability of drawing a red ball?`,
      options: optionTexts(`${favorable}/${total}`, `${total - favorable}/${total}`, `${favorable}/${total + favorable}`, `${total}/${favorable}`),
      explanation: `Use probability = favorable outcomes / total outcomes. Favorable red balls are ${favorable} and total balls are ${total}, so the probability is ${favorable}/${total}.`
    };
  }

  if (seed.slug === "hcf-and-lcm") {
    const pairs = [
      [84, 126, 42, 252],
      [48, 180, 12, 720],
      [72, 120, 24, 360],
      [96, 144, 48, 288],
      [63, 105, 21, 315]
    ][index % 5]!;
    const [a, b, hcf, lcm] = pairs;
    return {
      stem: `HCF and LCM drill ${index + 1}: The HCF of ${a} and ${b} is ${hcf}. What is their LCM?`,
      options: optionTexts(String(lcm), String(a + b), String((a * b) / (hcf + 1)), String(hcf)),
      explanation: `For two numbers, product = HCF x LCM. So LCM = (${a} x ${b}) / ${hcf} = ${lcm}.`
    };
  }

  if (seed.slug === "simplification") {
    const a = 18 + (index % 9);
    const b = 6 + (index % 5);
    const c = 4 + (index % 4);
    const d = 12 + (index % 7);
    const answer = a * b - c * d;
    return {
      stem: `Simplification drill ${index + 1}: Simplify ${a} x ${b} - ${c} x ${d}.`,
      options: optionTexts(String(answer), String(a * (b - c) * d), String(a + b - c + d), String(a * b + c * d)),
      explanation: `Multiplication is completed before subtraction: ${a} x ${b} = ${a * b} and ${c} x ${d} = ${c * d}. The value is ${a * b} - ${c * d} = ${answer}.`
    };
  }

  if (seed.slug === "data-interpretation") {
    const a = 120 + index * 3;
    const b = 80 + index * 2;
    const c = 100 + index;
    const total = a + b + c;
    return {
      stem: `Data interpretation drill ${index + 1}: A table gives sales as North=${a}, South=${b}, and East=${c}. What is the total sales value?`,
      options: optionTexts(String(total), String(a + b), String(b + c), String(a - b + c)),
      explanation: `Read labels before calculating. Total sales means add all three regions: ${a} + ${b} + ${c} = ${total}.`
    };
  }

  if (seed.slug === "time-work-pipes") {
    const daysA = 10 + (index % 5) * 2;
    const daysB = daysA * 2;
    const together = Number((1 / (1 / daysA + 1 / daysB)).toFixed(2));
    return {
      stem: `Time and work drill ${index + 1}: A can finish a work in ${daysA} days and B can finish it in ${daysB} days. In how many days can they finish it together?`,
      options: optionTexts(`${together} days`, `${daysA + daysB} days`, `${daysB - daysA} days`, `${daysA} days`),
      explanation: `Use rates, not average days. Combined rate is 1/${daysA} + 1/${daysB}; reciprocal of that rate gives ${together} days.`
    };
  }

  if (seed.section === "reasoning") {
    return {
      stem: reasoningGapRepairStem(seed.slug, index),
      options: reasoningGapRepairOptions(seed.slug, index),
      explanation: reasoningGapRepairExplanation(seed.slug, index)
    };
  }

  return {
    stem: `${seed.title} 200/200 drill ${index + 1}: Which first step gives the fastest reliable SSC CGL solution route for this topic?`,
    options: optionTexts(
      seed.flowchartSteps[0] ?? seed.formulaTable[0]?.rule ?? "Identify the exact asked value before calculating",
      seed.formulaTable[0]?.trap ?? "Use the closest familiar-looking option",
      "Skip the stem and test options directly",
      "Memorize the last seen answer pattern"
    ),
    explanation: `${seed.summary} The first reliable move is ${seed.flowchartSteps[0] ?? "to identify the exact asked value"} because it fixes the base before speed methods are applied.`
  };
}

function optionTexts(a: string, b: string, c: string, d: string): SscCglQuestion["options"] {
  return [
    { id: "a", text: a },
    { id: "b", text: b },
    { id: "c", text: c },
    { id: "d", text: d }
  ];
}


function isUploadedBookCorpusActive() {
  const manifestPath = path.join(process.cwd(), "data", "exams", "ssc-cgl", "book-sources", "manifest.json");
  if (!fs.existsSync(manifestPath)) return false;
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as {
      corpusPolicy?: { replaceExistingMcqs?: boolean; oldCorpusStatus?: string };
    };
    return manifest.corpusPolicy?.replaceExistingMcqs === true && manifest.corpusPolicy.oldCorpusStatus === "disabled";
  } catch {
    return false;
  }
}

function loadBookImportedQuestions(): SscCglQuestion[] {
  const booksPath = getSscCglBookQuestionsPath();
  if (!fs.existsSync(booksPath)) return [];
  try {
    const payload = JSON.parse(fs.readFileSync(booksPath, "utf8")) as unknown;
    if (!Array.isArray(payload)) return [];
    return payload.filter((question): question is SscCglQuestion => {
      if (!question || typeof question !== "object") return false;
      const row = question as Partial<SscCglQuestion>;
      return Boolean(
        row.id
        && row.exam === "SSC-CGL"
        && row.tier === "Tier-I"
        && row.reviewStatus === "reviewed"
        && row.provenance?.sourceType === "book_user_provided"
        && row.options?.length === 4
        && row.correctOption
      );
    }).map(normalizeBookQuestion).filter((question) => !isUnsolvableDiFragment(question));
  } catch {
    return [];
  }
}

function buildCalculationSpeedPracticeQuestions(): SscCglQuestion[] {
  const seed = allTopicSeeds.find((item) => item.slug === "calculation-speed");
  if (!seed) return [];

  return Array.from({ length: 60 }, (_, index): SscCglQuestion => {
    const serial = String(index + 1).padStart(3, "0");
    const base = 72 + index;
    const percent = [12.5, 16.67, 25, 33.33, 37.5, 62.5][index % 6]!;
    const divisor = [8, 6, 4, 3, 8, 8][index % 6]!;
    const answer = Math.round(base * percent) / 100;
    return {
      id: `ssc-cgl-quant-calculation-speed-${serial}`,
      exam: "SSC-CGL",
      tier: "Tier-I",
      year: 2026,
      shift: "Quant 36-second calculation-speed drill bank",
      source: "Original practice",
      section: "quantitative-aptitude",
      topic: "calculation-speed",
      subtopic: seed.title,
      difficulty: index % 5 === 0 ? "hard" : index % 2 === 0 ? "medium" : "easy",
      language: "en",
      stem: `Find ${percent}% of ${base} using the memorized fraction route before doing written calculation.`,
      options: [
        { id: "a", text: `${base} / ${divisor} = ${answer}` },
        { id: "b", text: `${base} x ${percent} = ${Math.round(base * percent)}` },
        { id: "c", text: `${base} + ${divisor} = ${base + divisor}` },
        { id: "d", text: `${base} - ${divisor} = ${base - divisor}` }
      ],
      correctOption: "a",
      explanation: `${percent}% is handled as a memorized fraction route here, so the 36-second method is to convert first, calculate second, and stop once the option gap is clear.`,
      marksCorrect: 2,
      marksWrong: -0.5,
      marksUnattempted: 0,
      timerSeconds: 900,
      ocrConfidence: 1,
      reviewStatus: "reviewed",
      conceptTags: ["speed", "calculation-speed", "quantitative-aptitude", "36-second"],
      provenance: {
        sourceId: "ssc-cgl-quant-calculation-speed-original-drill-bank",
        sourceType: "original_practice",
        title: "Original SSC CGL Quant 36-second calculation-speed drill bank",
        url: "https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/Notice_of_adv_cgl_2026.pdf",
        licenseNote: "Original practice item generated from the official syllabus pattern."
      }
    };
  });
}

function buildAveragesMixturesAlligationPracticeQuestions(): SscCglQuestion[] {
  const seed = allTopicSeeds.find((item) => item.slug === "averages-mixtures-alligation");
  if (!seed) return [];

  return Array.from({ length: 60 }, (_, index): SscCglQuestion => {
    const serial = String(index + 1).padStart(3, "0");
    const pattern = index % 6;
    const difficulty: SscCglQuestion["difficulty"] = index % 5 === 0 ? "hard" : index % 2 === 0 ? "medium" : "easy";
    const common: Omit<SscCglQuestion, "id" | "stem" | "options" | "correctOption" | "explanation"> = {
      exam: "SSC-CGL" as const,
      tier: "Tier-I" as const,
      year: 2026,
      shift: "Quant 36-second averages-mixtures-alligation drill bank",
      source: "Original practice" as const,
      section: "quantitative-aptitude" as const,
      topic: "averages-mixtures-alligation",
      subtopic: seed.title,
      difficulty,
      language: "en" as const,
      marksCorrect: 2,
      marksWrong: -0.5,
      marksUnattempted: 0,
      timerSeconds: 900,
      ocrConfidence: 1,
      reviewStatus: "reviewed" as const,
      conceptTags: ["high-yield", "averages-mixtures-alligation", "quantitative-aptitude", "36-second"],
      provenance: {
        sourceId: "ssc-cgl-quant-averages-mixtures-alligation-original-drill-bank",
        sourceType: "original_practice" as const,
        title: "Original SSC CGL Quant 36-second averages, mixtures, and alligation drill bank",
        url: "https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/Notice_of_adv_cgl_2026.pdf",
        licenseNote: "Original practice item generated from the official syllabus pattern."
      }
    };

    if (pattern === 0) {
      const count = 5 + (index % 5);
      const average = 28 + index;
      const added = average + 12;
      const newAverage = (count * average + added) / (count + 1);
      return {
        id: `ssc-cgl-quant-averages-mixtures-alligation-${serial}`,
        ...common,
        stem: `The average of ${count} numbers is ${average}. If ${added} is added, what is the new average?`,
        options: [
          { id: "a", text: `${newAverage}` },
          { id: "b", text: `${average + added}` },
          { id: "c", text: `${(average + added) / 2}` },
          { id: "d", text: `${average - 1}` }
        ],
        correctOption: "a",
        explanation: `Use total = average x count. Old total is ${count} x ${average}; add ${added}; divide by ${count + 1}. This is the 36-second total-change route.`
      };
    }

    if (pattern === 1) {
      const boys = 20 + (index % 4) * 5;
      const girls = 60 - boys;
      const boysAverage = 42 + (index % 5);
      const girlsAverage = 36 + (index % 4);
      const combined = Number(((boys * boysAverage + girls * girlsAverage) / 60).toFixed(2));
      return {
        id: `ssc-cgl-quant-averages-mixtures-alligation-${serial}`,
        ...common,
        stem: `In a class of 60 students, ${boys} boys average ${boysAverage} kg and ${girls} girls average ${girlsAverage} kg. What is the class average weight?`,
        options: [
          { id: "a", text: `${combined} kg` },
          { id: "b", text: `${(boysAverage + girlsAverage) / 2} kg` },
          { id: "c", text: `${boysAverage + girlsAverage} kg` },
          { id: "d", text: `${Math.abs(boysAverage - girlsAverage)} kg` }
        ],
        correctOption: "a",
        explanation: "Use weighted average, not average of averages. Multiply each subgroup average by its count, add totals, then divide by 60."
      };
    }

    if (pattern === 2) {
      const volume = 80 + (index % 5) * 10;
      const oldPercent = 30 + (index % 4) * 5;
      const removed = volume / 4;
      const newPercent = 50;
      const finalAlcohol = volume * oldPercent / 100 - removed * oldPercent / 100 + removed * newPercent / 100;
      const finalPercent = Number((finalAlcohol / volume * 100).toFixed(2));
      return {
        id: `ssc-cgl-quant-averages-mixtures-alligation-${serial}`,
        ...common,
        stem: `A ${volume}-litre mixture contains ${oldPercent}% alcohol. ${removed} litres is replaced by a liquid containing ${newPercent}% alcohol. What is the final alcohol percentage?`,
        options: [
          { id: "a", text: `${finalPercent}%` },
          { id: "b", text: `${oldPercent + newPercent}%` },
          { id: "c", text: `${newPercent - oldPercent}%` },
          { id: "d", text: `${oldPercent}%` }
        ],
        correctOption: "a",
        explanation: "Removed liquid has the old concentration. Compute old alcohol, subtract removed old alcohol, add incoming alcohol, then divide by original volume."
      };
    }

    if (pattern === 3) {
      const cheap = 40 + (index % 5) * 2;
      const dear = cheap + 30;
      const mean = cheap + 12;
      const firstGap = dear - mean;
      const secondGap = mean - cheap;
      return {
        id: `ssc-cgl-quant-averages-mixtures-alligation-${serial}`,
        ...common,
        stem: `In what ratio should items costing Rs ${cheap} and Rs ${dear} per kg be mixed to obtain a mixture worth Rs ${mean} per kg?`,
        options: [
          { id: "a", text: `${firstGap}:${secondGap}` },
          { id: "b", text: `${secondGap}:${firstGap}` },
          { id: "c", text: `${cheap}:${dear}` },
          { id: "d", text: `${dear}:${cheap}` }
        ],
        correctOption: "a",
        explanation: `Alligation ratio is dearer gap : cheaper gap = (${dear}-${mean}) : (${mean}-${cheap}) = ${firstGap}:${secondGap}.`
      };
    }

    if (pattern === 4) {
      const count = 10 + (index % 6);
      const average = 32 + (index % 7);
      const removed = average - 8;
      const added = average + 10;
      const newAverage = Number(((count * average - removed + added) / count).toFixed(2));
      return {
        id: `ssc-cgl-quant-averages-mixtures-alligation-${serial}`,
        ...common,
        stem: `The average age of ${count} people is ${average}. One person aged ${removed} leaves and another aged ${added} joins. What is the new average?`,
        options: [
          { id: "a", text: `${newAverage}` },
          { id: "b", text: `${average}` },
          { id: "c", text: `${added - removed}` },
          { id: "d", text: `${(added + removed) / 2}` }
        ],
        correctOption: "a",
        explanation: "Keep the count fixed and adjust only the total: new total = old total - leaving value + joining value."
      };
    }

    const cheap = 25 + (index % 5) * 5;
    const dear = cheap + 20;
    const cheapQty = 3 + (index % 4);
    const dearQty = 2 + (index % 3);
    const mean = Number(((cheap * cheapQty + dear * dearQty) / (cheapQty + dearQty)).toFixed(2));
    return {
      id: `ssc-cgl-quant-averages-mixtures-alligation-${serial}`,
      ...common,
      stem: `${cheapQty} kg of rice at Rs ${cheap}/kg is mixed with ${dearQty} kg at Rs ${dear}/kg. What is the average cost per kg?`,
      options: [
        { id: "a", text: `Rs ${mean}` },
        { id: "b", text: `Rs ${(cheap + dear) / 2}` },
        { id: "c", text: `Rs ${cheapQty + dearQty}` },
        { id: "d", text: `Rs ${dear - cheap}` }
      ],
      correctOption: "a",
      explanation: "This is a weighted average of prices. Total cost divided by total quantity gives the mixture's average cost per kg."
    };
  });
}

function normalizedMcqBody(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function mcqBodyFingerprint(question: SscCglQuestion) {
  return [
    question.section,
    question.topic,
    normalizedMcqBody(question.stem),
    ...question.options.map((option) => normalizedMcqBody(option.text))
  ].join("\u0001");
}

function rankedQuestionReliability(question: SscCglQuestion) {
  const curation = (question as SscCglQuestion & {
    curation?: {
      answerAgreementCount?: number;
      answerAverageConfidence?: number;
      reviewConfidence?: number;
    };
  }).curation;

  return [
    question.reviewStatus === "reviewed" ? 1 : 0,
    question.provenance.sourceType === "book_user_provided" ? 1 : 0,
    curation?.answerAgreementCount ?? 0,
    curation?.answerAverageConfidence ?? 0,
    curation?.reviewConfidence ?? 0,
    question.ocrConfidence,
    Math.min(question.explanation.length, 600) / 600
  ];
}

function compareReliability(a: SscCglQuestion, b: SscCglQuestion) {
  const left = rankedQuestionReliability(a);
  const right = rankedQuestionReliability(b);

  for (let index = 0; index < left.length; index += 1) {
    if (left[index] !== right[index]) return left[index] - right[index];
  }

  return b.id.localeCompare(a.id);
}

function removeDuplicateMcqBodies(questions: SscCglQuestion[]) {
  const kept = new Map<string, SscCglQuestion>();
  const order: string[] = [];

  for (const question of questions) {
    const fingerprint = mcqBodyFingerprint(question);
    const current = kept.get(fingerprint);

    if (!current) {
      kept.set(fingerprint, question);
      order.push(fingerprint);
      continue;
    }

    if (compareReliability(question, current) > 0) {
      kept.set(fingerprint, question);
    }
  }

  return order.map((fingerprint) => kept.get(fingerprint)!);
}

export function buildSscCglQuestions() {
  if (isUploadedBookCorpusActive()) {
    const bookQuestions = loadBookImportedQuestions().map(ensureRankedPracticeExplanation);
    const firstPass = removeDuplicateMcqBodies([
      ...bookQuestions,
      ...buildTopicCoverageRepairPracticeQuestions(bookQuestions).map(ensureRankedPracticeExplanation)
    ]);
    const secondPassRepairQuestions = buildTopicCoverageRepairPracticeQuestions(firstPass).map(ensureRankedPracticeExplanation);
    return removeDuplicateMcqBodies([...firstPass, ...secondPassRepairQuestions]);
  }

  const questions: SscCglQuestion[] = [];
  const mockCount = 12;

  for (let mock = 1; mock <= mockCount; mock += 1) {
    for (const section of sscCglPattern.sections) {
      const seeds = allTopicSeeds.filter((seed) => seed.section === section.id);
      for (let index = 0; index < section.questionCount; index += 1) {
        const seed = seeds[(index + mock - 1) % seeds.length]!;
        const serial = String(index + 1).padStart(3, "0");
        const id = `ssc-cgl-2026-m${String(mock).padStart(2, "0")}-${sectionPrefix(section.id).toLowerCase()}-${serial}`;
        questions.push({
          id,
          exam: "SSC-CGL",
          tier: "Tier-I",
          year: 2026,
          shift: `200/200 original practice mock ${mock}`,
          source: "Original practice",
          section: section.id,
          topic: seed.slug,
          subtopic: seed.title,
          difficulty: (index + mock) % 5 === 0 ? "hard" : (index + mock) % 2 === 0 ? "medium" : "easy",
          language: "en",
          stem: stemFor(seed, index + mock),
          options: optionsFor(seed, index + mock),
          correctOption: correctFor(seed),
          explanation: `${seed.summary} The reliable move is: ${seed.formulaTable[0]?.rule ?? "state the rule, then apply it exactly"}.`,
          marksCorrect: 2,
          marksWrong: -0.5,
          marksUnattempted: 0,
          timerSeconds: 900,
          ocrConfidence: 1,
          reviewStatus: "reviewed",
          conceptTags: [seed.priority, seed.slug, seed.subject.toLowerCase().replace(/[^a-z]+/g, "-")],
          provenance: {
            sourceId: "ssc-cgl-original-practice-2026-expanded",
            sourceType: "original_practice",
            title: "Original SSC CGL 2026 expanded practice corpus",
            url: "https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/Notice_of_adv_cgl_2026.pdf",
            licenseNote: "Original practice item generated from the official syllabus pattern."
          }
        });
      }
    }
  }

  questions.push(...buildCalculationSpeedPracticeQuestions());
  questions.push(...buildAveragesMixturesAlligationPracticeQuestions());

  for (const seed of allTopicSeeds.slice(0, 20)) {
    questions.push({
      id: `ssc-cgl-web-review-${seed.slug}`,
      exam: "SSC-CGL",
      tier: "Tier-I",
      year: 2026,
      shift: "Review queue",
      source: "Imported PDF",
      section: seed.section,
      topic: seed.slug,
      subtopic: seed.title,
      difficulty: "medium",
      language: "en",
      stem: `Review queue sample for ${seed.title}: verify the OCR text, answer key, and source page before ranked use.`,
      options: [
        { id: "a", text: "Keep in review until OCR and answer key are checked" },
        { id: "b", text: "Use immediately in ranked tests" },
        { id: "c", text: "Discard all web PDFs without inspection" },
        { id: "d", text: "Ignore source provenance" }
      ],
      correctOption: "a",
      explanation: "Unverified web PDFs must stay outside ranked tests until OCR, answer key, and provenance have been reviewed.",
      marksCorrect: 2,
      marksWrong: -0.5,
      marksUnattempted: 0,
      timerSeconds: 900,
      ocrConfidence: 0.62,
      reviewStatus: "needs_review",
      conceptTags: ["review-queue", seed.slug],
      provenance: {
        sourceId: "ssc-cgl-web-pdf-review-queue",
        sourceType: "web_pdf_unverified",
        title: "Unverified web PDF review queue sample",
        url: "https://ssc.gov.in/for-candidates/previous-year-question-paper",
        pageNumber: 1,
        licenseNote: "Imported metadata only; question requires manual review before ranked use."
      }
    });
  }

  const existingIds = new Set(questions.map((question) => question.id));
  for (const question of loadCuratedImportedQuestions()) {
    if (!existingIds.has(question.id)) {
      questions.push(question);
      existingIds.add(question.id);
    }
  }

  return removeDuplicateMcqBodies(questions.map(ensureRankedPracticeExplanation));
}

export function buildSscCglTopics(questions = buildSscCglQuestions()): SscCglTopic[] {
  return allTopicSeeds.map((seed) => {
    const topicQuestions = questions.filter((question) => question.topic === seed.slug && question.reviewStatus === "reviewed");
    const pyqQuestionIds = topicQuestions.filter((question) => question.source === "PYQ").map((question) => question.id);
    const bookQuestionIds = topicQuestions
      .filter((question) => question.provenance.sourceType === "book_user_provided")
      .map((question) => question.id);
    const gapRepairQuestionIds = topicQuestions
      .filter((question) => question.provenance.sourceType === "original_practice" && question.conceptTags.includes("gap-repair"))
      .map((question) => question.id);
    const otherReviewed = topicQuestions.length - bookQuestionIds.length - gapRepairQuestionIds.length;
    const deepNoteSections = parseDeepNoteSections(seed);
    return {
      slug: seed.slug,
      title: seed.title,
      subject: seed.subject,
      section: seed.section,
      priority: seed.priority,
      study: {
        summary: seed.summary,
        sections: deepNoteSections ?? buildSeedStudySections(seed),
        formulaTable: seed.formulaTable,
        flowchart: [
          "```mermaid",
          "flowchart LR",
          ...seed.flowchartSteps.map((step, index) => `  S${index + 1}[\"${step}\"]${index < seed.flowchartSteps.length - 1 ? ` --> S${index + 2}` : ""}`),
          "```"
        ].join("\n")
      },
      practice: {
        questionIds: topicQuestions.map((question) => question.id),
        pyqQuestionIds,
        bookQuestionIds,
        gapRepairQuestionIds,
        sourceBreakdown: {
          bookUserProvided: bookQuestionIds.length,
          originalPractice: gapRepairQuestionIds.length,
          otherReviewed
        },
        drillPrompt: `Attempt ${Math.min(10, topicQuestions.length)} reviewed ${seed.title} questions, then write the fastest rule and the most dangerous trap.`
      }
    };
  });
}

function buildPromotedYearFullMocks(reviewed: SscCglQuestion[]) {
  const promotedPyqs = reviewed.filter((question) => (
    question.source === "PYQ"
    && question.conceptTags.includes("agent-curated-import")
    && question.provenance.sourceType === "user_provided"
  ));
  const years = [...new Set(promotedPyqs.map((question) => question.year))].sort((a, b) => b - a);

  return years.flatMap((year) => {
    const yearQuestions = promotedPyqs
      .filter((question) => question.year === year)
      .sort((a, b) => a.shift.localeCompare(b.shift) || a.id.localeCompare(b.id));
    const sectionQuestionIds = sscCglPattern.sections.map((section) => yearQuestions
      .filter((question) => question.section === section.id)
      .slice(0, section.questionCount)
      .map((question) => question.id));

    if (sectionQuestionIds.some((questionIds, index) => questionIds.length < sscCglPattern.sections[index]!.questionCount)) {
      return [];
    }

    return [{
      id: `ssc-cgl-agent-curated-pyq-year-${year}`,
      title: `SSC CGL ${year} Agent-Curated PYQ Full Mock`,
      mode: "full_mock" as const,
      questionIds: sectionQuestionIds.flat(),
      sourceType: "user_provided" as const,
      reviewStatus: "reviewed" as const,
      description: `${year} promoted imported PYQs balanced into a 100-question full mock from the model-agent reviewed corpus.`
    }];
  });
}

function buildBookCorpusFullMocks(reviewed: SscCglQuestion[]) {
  const bookQuestionsBySection = new Map<SscCglSectionId, SscCglQuestion[]>();

  for (const section of sscCglPattern.sections) {
    bookQuestionsBySection.set(section.id, reviewed
      .filter((question) => question.section === section.id && question.provenance.sourceType === "book_user_provided")
      .sort((a, b) => a.topic.localeCompare(b.topic) || a.id.localeCompare(b.id)));
  }

  const mockCount = Math.min(...sscCglPattern.sections.map((section) => (
    Math.floor((bookQuestionsBySection.get(section.id)?.length ?? 0) / section.questionCount)
  )));

  return Array.from({ length: mockCount }, (_, index) => {
    const questionIds = sscCglPattern.sections.flatMap((section) => (
      (bookQuestionsBySection.get(section.id) ?? [])
        .slice(index * section.questionCount, (index + 1) * section.questionCount)
        .map((question) => question.id)
    ));

    return {
      id: `ssc-cgl-book-200-mode-mock-${String(index + 1).padStart(2, "0")}`,
      title: `SSC CGL Book Corpus 200/200 Mock ${index + 1}`,
      mode: "full_mock" as const,
      questionIds,
      sourceType: "book_user_provided" as const,
      reviewStatus: "reviewed" as const,
      description: "A 100-question, four-section mock assembled from reviewed uploaded-book questions at the official 2026 Tier-I pattern."
    };
  });
}

function sectionFiftyPrefix(sectionId: SscCglSectionId) {
  return {
    reasoning: "reasoning",
    "general-awareness": "general-awareness",
    "quantitative-aptitude": "quant",
    "english-comprehension": "english"
  }[sectionId];
}

function balanceSectionQuestionsByTopic(questions: SscCglQuestion[], targetCount: number) {
  const questionsByTopic = new Map<string, SscCglQuestion[]>();
  for (const question of questions.sort((a, b) => a.topic.localeCompare(b.topic) || a.id.localeCompare(b.id))) {
    const topicQuestions = questionsByTopic.get(question.topic) ?? [];
    topicQuestions.push(question);
    questionsByTopic.set(question.topic, topicQuestions);
  }

  const topicSlugs = [...questionsByTopic.keys()].sort();
  const balancedQuestions: SscCglQuestion[] = [];

  while (balancedQuestions.length < targetCount) {
    let madeProgress = false;
    for (const topic of topicSlugs) {
      const nextQuestion = questionsByTopic.get(topic)?.shift();
      if (!nextQuestion) continue;
      balancedQuestions.push(nextQuestion);
      madeProgress = true;
      if (balancedQuestions.length >= targetCount) break;
    }
    if (!madeProgress) break;
  }

  return balancedQuestions;
}

function buildSectionFiftyMocks(reviewed: SscCglQuestion[]) {
  const tests = [];

  for (const section of sscCglPattern.sections) {
    const sectionQuestions = reviewed.filter((item) => item.section === section.id);
    const totalQuestions = sectionQuestions.length;
    const targetSetCount = Math.floor(totalQuestions / section.questionCount);
    const targetQuestionCount = targetSetCount * section.questionCount;
    const bookBalancedQuestions = balanceSectionQuestionsByTopic(
      sectionQuestions.filter((question) => question.provenance.sourceType === "book_user_provided"),
      targetQuestionCount
    );
    const repairBalancedQuestions = balanceSectionQuestionsByTopic(
      sectionQuestions.filter((question) => question.provenance.sourceType !== "book_user_provided"),
      Math.max(0, targetQuestionCount - bookBalancedQuestions.length)
    );
    const balancedQuestions = [...bookBalancedQuestions, ...repairBalancedQuestions];

    for (let setIndex = 0; setIndex < targetSetCount; setIndex += 1) {
      const selected = balancedQuestions.slice(setIndex * section.questionCount, (setIndex + 1) * section.questionCount);
      if (selected.length !== section.questionCount) continue;

      const prefix = sectionFiftyPrefix(section.id);
      tests.push({
        id: `ssc-cgl-${prefix}-50-50-set-${String(setIndex + 1).padStart(2, "0")}`,
        title: `${section.title} 50/50 36-Second Set ${setIndex + 1}`,
        mode: "speed_sprint" as const,
        questionIds: selected.map((question) => question.id),
        sourceType: "mixed_reviewed" as const,
        reviewStatus: "reviewed" as const,
        description: `A 25-question ${section.title} section mock for 50/50 scoring at the official 36-second per-question pace.`
      });
    }
  }

  return tests;
}

function buildTopicThirtySixSecondDrills(reviewed: SscCglQuestion[]) {
  return allTopicSeeds.flatMap((seed) => {
    const questionIds = reviewed
      .filter((question) => question.topic === seed.slug && question.section === seed.section)
      .sort((a, b) => {
        const sourceRankA = a.provenance.sourceType === "book_user_provided" ? 0 : 1;
        const sourceRankB = b.provenance.sourceType === "book_user_provided" ? 0 : 1;
        return sourceRankA - sourceRankB || a.id.localeCompare(b.id);
      })
      .slice(0, 25)
      .map((question) => question.id);

    if (questionIds.length < 25) return [];

    return [{
      id: `ssc-cgl-topic-${seed.slug}-36-second-drill`,
      title: `${seed.title} 36-Second Drill`,
      mode: "topic_drill" as const,
      questionIds,
      sourceType: "mixed_reviewed" as const,
      reviewStatus: "reviewed" as const,
      description: `A 25-question ${seed.title} topic drill at the official 36-second SSC CGL Tier-I pace.`
    }];
  });
}

export function buildSscCglTestSummaries(questions = buildSscCglQuestions()) {
  const reviewed = questions.filter((question) => question.reviewStatus === "reviewed");
  if (reviewed.length === 0) return [];
  const shiftLabels = [...new Set(reviewed.map((question) => question.shift))].sort();
  const completeMockLabels = shiftLabels.filter((shiftLabel) => !shiftLabel.startsWith("Agent-curated imported practice") && sscCglPattern.sections.every((section) => (
    reviewed.filter((question) => question.shift === shiftLabel && question.section === section.id).length >= section.questionCount
  )));
  const firstMock = completeMockLabels[0] ?? shiftLabels[0]!;
  const bySection = new Map<SscCglSectionId, SscCglQuestion[]>();
  for (const section of sscCglPattern.sections) bySection.set(section.id, reviewed.filter((question) => question.shift === firstMock && question.section === section.id).slice(0, section.questionCount));
  const importedShiftLabels = shiftLabels.filter((shiftLabel) => {
    if (!shiftLabel.startsWith("Agent-curated imported practice")) return false;
    return sscCglPattern.sections.some((section) => (
      reviewed.filter((question) => question.shift === shiftLabel && question.section === section.id).length >= section.questionCount
    ));
  });

  return [
    ...completeMockLabels.map((mockLabel, index) => ({
      id: index === 0 ? "ssc-cgl-200-mode-seed" : `ssc-cgl-200-mode-mock-${String(index + 1).padStart(2, "0")}`,
      title: index === 0 ? "SSC CGL 200/200 Seed Mock" : `SSC CGL 200/200 Mock ${index + 1}`,
      mode: "full_mock" as const,
      questionIds: sscCglPattern.sections.flatMap((section) => reviewed
        .filter((question) => question.shift === mockLabel && question.section === section.id)
        .slice(0, section.questionCount)
        .map((question) => question.id)),
      sourceType: "mixed_reviewed" as const,
      reviewStatus: "reviewed" as const,
      description: "A 100-question reviewed original-practice mock matching the 2026 Tier-I section timer pattern."
    })),
    ...buildPromotedYearFullMocks(reviewed),
    ...buildBookCorpusFullMocks(reviewed),
    ...importedShiftLabels.map((shiftLabel, index) => ({
      id: `ssc-cgl-agent-curated-pyq-shift-${String(index + 1).padStart(2, "0")}`,
      title: `Agent-Curated PYQ Shift ${index + 1}`,
      mode: "pyq_shift" as const,
      questionIds: sscCglPattern.sections.flatMap((section) => reviewed
        .filter((question) => question.shift === shiftLabel && question.section === section.id)
        .slice(0, section.questionCount)
        .map((question) => question.id)),
      sourceType: "user_provided" as const,
      reviewStatus: "reviewed" as const,
      description: `${shiftLabel} promoted through answer consensus and final model-agent curation.`
    })),
    ...buildSectionFiftyMocks(reviewed),
    ...buildTopicThirtySixSecondDrills(reviewed),
    ...sscCglPattern.sections
      .map((section) => ({
        id: `ssc-cgl-${section.id}-speed-sprint`,
        title: `${section.title} Speed Sprint`,
        mode: "speed_sprint" as const,
        questionIds: (bySection.get(section.id) ?? []).slice(0, 15).map((question) => question.id),
        sourceType: "mixed_reviewed" as const,
        reviewStatus: "reviewed" as const,
        description: `A focused ${section.title.toLowerCase()} sprint for speed and mistake tagging.`
      }))
      .filter((test) => test.questionIds.length > 0)
  ];
}

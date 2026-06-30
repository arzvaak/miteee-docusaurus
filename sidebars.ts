import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  sem5Sidebar: [
    {
      type: 'category',
      label: 'EM-II — Electrical Machines II',
      link: { type: 'doc', id: 'sem5/em2/overview' },
      items: [
        'sem5/em2/pyq-answer-bank',
        'sem5/em2/pyq-distinct-question-bank',
        'sem5/em2/pyq-unique-question-bank',
        'sem5/em2/numerical-drill',
        'sem5/em2/theory-question-bank',
        {
          type: 'category',
          label: 'Week 1 — Transformers & Coupled Circuits',
          items: [
            'sem5/em2/week-01-transformers-coupled-circuits/index',
            'sem5/em2/week-01-transformers-coupled-circuits/questions',
          ],
        },
        {
          type: 'category',
          label: 'Week 2 — Energy Conversion Principles',
          items: [
            'sem5/em2/week-02-energy-conversion-principles/index',
            'sem5/em2/week-02-energy-conversion-principles/questions',
          ],
        },
        {
          type: 'category',
          label: 'Week 3 — Magnetic Fields & Windings',
          items: [
            'sem5/em2/week-03-magnetic-fields-windings/index',
            'sem5/em2/week-03-magnetic-fields-windings/questions',
          ],
        },
        {
          type: 'category',
          label: 'Week 4 — Distributed Windings & RMF',
          items: [
            'sem5/em2/week-04-distributed-windings-rmf/index',
            'sem5/em2/week-04-distributed-windings-rmf/questions',
          ],
        },
        {
          type: 'category',
          label: 'Week 5 — Rotating Magnetic Field',
          items: [
            'sem5/em2/week-05-rotating-magnetic-field/index',
            'sem5/em2/week-05-rotating-magnetic-field/questions',
          ],
        },
        {
          type: 'category',
          label: 'Week 6 — Induction Motor Fundamentals',
          items: [
            'sem5/em2/week-06-induction-motor-fundamentals/index',
            'sem5/em2/week-06-induction-motor-fundamentals/questions',
          ],
        },
        {
          type: 'category',
          label: 'Week 7 — Equivalent Circuit & Torque-Slip',
          items: [
            'sem5/em2/week-07-equivalent-circuit-torque-slip/index',
            'sem5/em2/week-07-equivalent-circuit-torque-slip/questions',
          ],
        },
        {
          type: 'category',
          label: 'Week 8 — Losses & Circle Diagram',
          items: [
            'sem5/em2/week-08-losses-circle-diagram/index',
            'sem5/em2/week-08-losses-circle-diagram/questions',
          ],
        },
        {
          type: 'category',
          label: 'Week 9 — Starting, Speed Control & Braking',
          items: [
            'sem5/em2/week-09-starting-speed-control-braking/index',
            'sem5/em2/week-09-starting-speed-control-braking/questions',
          ],
        },
        {
          type: 'category',
          label: 'Week 10 — Single-Phase Induction Motors',
          items: [
            'sem5/em2/week-10-single-phase-induction-motors/index',
            'sem5/em2/week-10-single-phase-induction-motors/questions',
          ],
        },
        {
          type: 'category',
          label: 'Week 11 — Synchronous Machines Intro',
          items: [
            'sem5/em2/week-11-synchronous-machines-intro/index',
            'sem5/em2/week-11-synchronous-machines-intro/questions',
          ],
        },
        {
          type: 'category',
          label: 'Week 12 — Synchronous Machines Advanced',
          items: [
            'sem5/em2/week-12-synchronous-machines-advanced/index',
            'sem5/em2/week-12-synchronous-machines-advanced/questions',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'EOM — Essentials of Management',
      items: [
        'sem5/eom/notes-l1-15',
        'sem5/eom/notes-l16-26',
        'sem5/eom/cramsheet',
        {
          type: 'category',
          label: 'Exam Preparation',
          items: [
            'sem5/eom/exam-prep/study-guide',
            'sem5/eom/exam-prep/question-bank',
            'sem5/eom/exam-prep/leading',
            'sem5/eom/exam-prep/module-01',
            'sem5/eom/exam-prep/module-02',
            'sem5/eom/exam-prep/module-03',
            'sem5/eom/exam-prep/module-04',
            'sem5/eom/exam-prep/module-05',
            'sem5/eom/exam-prep/module-06',
            'sem5/eom/exam-prep/module-07',
            'sem5/eom/exam-prep/module-08',
            'sem5/eom/exam-prep/module-08-ref',
            'sem5/eom/exam-prep/module-09a',
            'sem5/eom/exam-prep/module-09b',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'MPC — Design of Modern Power Converters',
      items: [
        'sem5/mpc/week-1',
        'sem5/mpc/week-2',
        'sem5/mpc/week-3',
        'sem5/mpc/week-4',
        'sem5/mpc/week-5',
        'sem5/mpc/final-questions',
      ],
    },
    {
      type: 'category',
      label: 'DSP — Digital Signal Processing (NPTEL)',
      items: [
        'sem5/dsp/overview',
        'sem5/dsp/master-summary',
        'sem5/dsp/sampling',
        'sem5/dsp/dt-signals',
        'sem5/dsp/z-transform',
        'sem5/dsp/dft',
        'sem5/dsp/fft',
        'sem5/dsp/fir',
        'sem5/dsp/iir',
        'sem5/dsp/lpc',
        'sem5/dsp/multirate',
      ],
    },
  ],

  sem6Sidebar: [
    {
      type: 'category',
      label: 'CRA 4409 — Data Science',
      items: [
        'sem6/cra4409/toolbox',
        'sem6/cra4409/r-programming',
      ],
    },
    {
      type: 'category',
      label: 'EEFM — EE Financial Management',
      items: [
        'sem6/eefm/question-bank',
        'sem6/eefm/pyq',
      ],
    },
    {
      type: 'category',
      label: 'M&I — Measurements & Instrumentation',
      items: [
        'sem6/mi/question-bank',
        'sem6/mi/tutorial-1',
        'sem6/mi/tutorial-2',
        'sem6/mi/tutorial-3',
        'sem6/mi/tutorial-4',
        'sem6/mi/tutorial-5',
        'sem6/mi/tutorial-6',
        'sem6/mi/tutorial-7',
        'sem6/mi/tutorial-8',
      ],
    },
    {
      type: 'category',
      label: 'SGT — Smart Grid Technologies',
      items: [
        'sem6/sgt/question-bank',
      ],
    },
    {
      type: 'category',
      label: 'Sejarah Pemikiran Modern',
      link: { type: 'doc', id: 'sem6/spm/overview' },
      items: [
        'sem6/spm/overview',
        'sem6/spm/kartu-kilat-3-hari',
        'sem6/spm/tokoh-kata-kunci',
        'sem6/spm/perbandingan-rawan-tertukar',
        'sem6/spm/rubrik-simulasi-esai',
        'sem6/spm/malam-terakhir',
        'sem6/spm/minggu-01-akar-modernitas',
        'sem6/spm/minggu-02-rasionalisme',
        'sem6/spm/minggu-03-empirisme',
        'sem6/spm/minggu-04-pencerahan',
        'sem6/spm/minggu-05-idealisme',
        'sem6/spm/minggu-06-objektivisme-modern',
        'sem6/spm/minggu-07-subjektivisme-modern',
        'sem6/spm/minggu-08-kontemporer',
        'sem6/spm/latihan-ujian',
      ],
    },
  ],

  upscSidebar: [
    {
      type: 'category',
      label: 'UPSC CSE - Political Science NCERT',
      link: { type: 'doc', id: 'upsc-cse/political-science/overview' },
      items: [
        'upsc-cse/political-science/overview',
        {
          type: 'category',
          label: 'Class 9 - Democratic Politics-I',
          link: { type: 'doc', id: 'upsc-cse/political-science/class-9/democratic-politics-i/index' },
          items: [
            'upsc-cse/political-science/class-9/democratic-politics-i/index',
            'upsc-cse/political-science/class-9/democratic-politics-i/what-is-democracy-why-democracy',
            'upsc-cse/political-science/class-9/democratic-politics-i/constitutional-design',
            'upsc-cse/political-science/class-9/democratic-politics-i/electoral-politics',
            'upsc-cse/political-science/class-9/democratic-politics-i/working-of-institutions',
            'upsc-cse/political-science/class-9/democratic-politics-i/democratic-rights',
          ],
        },
        {
          type: 'category',
          label: 'Class 10 - Democratic Politics-II',
          link: { type: 'doc', id: 'upsc-cse/political-science/class-10/democratic-politics-ii/index' },
          items: [
            'upsc-cse/political-science/class-10/democratic-politics-ii/index',
            'upsc-cse/political-science/class-10/democratic-politics-ii/power-sharing',
            'upsc-cse/political-science/class-10/democratic-politics-ii/federalism',
            'upsc-cse/political-science/class-10/democratic-politics-ii/democracy-and-diversity',
            'upsc-cse/political-science/class-10/democratic-politics-ii/gender-religion-and-caste',
            'upsc-cse/political-science/class-10/democratic-politics-ii/popular-struggles-and-movements',
            'upsc-cse/political-science/class-10/democratic-politics-ii/political-parties',
            'upsc-cse/political-science/class-10/democratic-politics-ii/outcomes-of-democracy',
            'upsc-cse/political-science/class-10/democratic-politics-ii/challenges-to-democracy',
          ],
        },
        {
          type: 'category',
          label: 'Class 11 - Indian Constitution at Work',
          link: { type: 'doc', id: 'upsc-cse/political-science/class-11/indian-constitution-at-work/index' },
          items: [
            'upsc-cse/political-science/class-11/indian-constitution-at-work/index',
            'upsc-cse/political-science/class-11/indian-constitution-at-work/constitution-why-and-how',
            'upsc-cse/political-science/class-11/indian-constitution-at-work/rights-in-the-indian-constitution',
            'upsc-cse/political-science/class-11/indian-constitution-at-work/election-and-representation',
            'upsc-cse/political-science/class-11/indian-constitution-at-work/executive',
            'upsc-cse/political-science/class-11/indian-constitution-at-work/legislature',
            'upsc-cse/political-science/class-11/indian-constitution-at-work/judiciary',
            'upsc-cse/political-science/class-11/indian-constitution-at-work/federalism',
            'upsc-cse/political-science/class-11/indian-constitution-at-work/local-governments',
            'upsc-cse/political-science/class-11/indian-constitution-at-work/constitution-as-a-living-document',
            'upsc-cse/political-science/class-11/indian-constitution-at-work/the-philosophy-of-the-constitution',
          ],
        },
        {
          type: 'category',
          label: 'Class 11 - Political Theory',
          link: { type: 'doc', id: 'upsc-cse/political-science/class-11/political-theory/index' },
          items: [
            'upsc-cse/political-science/class-11/political-theory/index',
            'upsc-cse/political-science/class-11/political-theory/political-theory-an-introduction',
            'upsc-cse/political-science/class-11/political-theory/freedom',
            'upsc-cse/political-science/class-11/political-theory/equality',
            'upsc-cse/political-science/class-11/political-theory/social-justice',
            'upsc-cse/political-science/class-11/political-theory/rights',
            'upsc-cse/political-science/class-11/political-theory/citizenship',
            'upsc-cse/political-science/class-11/political-theory/nationalism',
            'upsc-cse/political-science/class-11/political-theory/secularism',
            'upsc-cse/political-science/class-11/political-theory/peace',
            'upsc-cse/political-science/class-11/political-theory/development',
          ],
        },
        {
          type: 'category',
          label: 'Class 12 - Contemporary World Politics',
          link: { type: 'doc', id: 'upsc-cse/political-science/class-12/contemporary-world-politics/index' },
          items: [
            'upsc-cse/political-science/class-12/contemporary-world-politics/index',
            'upsc-cse/political-science/class-12/contemporary-world-politics/the-cold-war-era',
            'upsc-cse/political-science/class-12/contemporary-world-politics/the-end-of-bipolarity',
            'upsc-cse/political-science/class-12/contemporary-world-politics/us-hegemony-in-world-politics',
            'upsc-cse/political-science/class-12/contemporary-world-politics/alternative-centres-of-power',
            'upsc-cse/political-science/class-12/contemporary-world-politics/contemporary-south-asia',
            'upsc-cse/political-science/class-12/contemporary-world-politics/international-organisations',
            'upsc-cse/political-science/class-12/contemporary-world-politics/security-in-the-contemporary-world',
            'upsc-cse/political-science/class-12/contemporary-world-politics/environment-and-natural-resources',
            'upsc-cse/political-science/class-12/contemporary-world-politics/globalisation',
          ],
        },
        {
          type: 'category',
          label: 'Class 12 - Politics in India since Independence',
          link: { type: 'doc', id: 'upsc-cse/political-science/class-12/politics-in-india-since-independence/index' },
          items: [
            'upsc-cse/political-science/class-12/politics-in-india-since-independence/index',
            'upsc-cse/political-science/class-12/politics-in-india-since-independence/challenges-of-nation-building',
            'upsc-cse/political-science/class-12/politics-in-india-since-independence/era-of-one-party-dominance',
            'upsc-cse/political-science/class-12/politics-in-india-since-independence/politics-of-planned-development',
            'upsc-cse/political-science/class-12/politics-in-india-since-independence/india-s-external-relations',
            'upsc-cse/political-science/class-12/politics-in-india-since-independence/challenges-to-and-restoration-of-the-congress-system',
            'upsc-cse/political-science/class-12/politics-in-india-since-independence/the-crisis-of-democratic-order',
            'upsc-cse/political-science/class-12/politics-in-india-since-independence/rise-of-popular-movements',
            'upsc-cse/political-science/class-12/politics-in-india-since-independence/regional-aspirations',
            'upsc-cse/political-science/class-12/politics-in-india-since-independence/recent-developments-in-indian-politics',
          ],
        },
      ],
    },
  ],
};

export default sidebars;

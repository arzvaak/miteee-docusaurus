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
  ],
};

export default sidebars;

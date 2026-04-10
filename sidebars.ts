import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  sem5Sidebar: [
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
      label: 'MPC — Motor Power Converters',
      items: [
        'sem5/mpc/week-1',
        'sem5/mpc/week-2',
        'sem5/mpc/week-3',
        'sem5/mpc/week-4',
        'sem5/mpc/week-5',
        'sem5/mpc/week-6',
        'sem5/mpc/week-7',
        'sem5/mpc/week-8',
        'sem5/mpc/final-questions',
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
        'sem6/mi/tutorial-2',
        'sem6/mi/tutorial-3',
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

/* quiz.js — Interactive MCQ/MSQ quiz blocks for note.arzvak.com (Docusaurus) */

function initQuiz() {
  document.querySelectorAll('.quiz-block.mcq:not([data-qi])').forEach(block => {
    block.dataset.qi = '1';
    const correct = block.dataset.answer;
    block.querySelectorAll('.quiz-options label').forEach(label => {
      label.addEventListener('click', () => {
        if (block.classList.contains('answered')) return;
        block.classList.add('answered');
        const chosen = label.dataset.opt;
        block.querySelectorAll('.quiz-options label').forEach(l => {
          if (l.dataset.opt === correct)       l.classList.add('q-correct');
          else if (l.dataset.opt === chosen)   l.classList.add('q-wrong');
        });
        const exp = block.querySelector('.quiz-exp');
        if (exp) exp.open = true;
      });
    });
  });

  document.querySelectorAll('.quiz-block.msq:not([data-qi])').forEach(block => {
    block.dataset.qi = '1';
    const corrects = block.dataset.answers.split(',').map(s => s.trim());
    const labels   = block.querySelectorAll('.quiz-options label');
    labels.forEach(label => {
      label.addEventListener('click', () => {
        if (block.classList.contains('answered')) return;
        label.classList.toggle('q-selected');
      });
    });
    const btn = block.querySelector('.quiz-check');
    if (btn) {
      btn.addEventListener('click', () => {
        if (block.classList.contains('answered')) return;
        block.classList.add('answered');
        btn.disabled = true;
        labels.forEach(l => {
          const isCorrect  = corrects.includes(l.dataset.opt);
          const isSelected = l.classList.contains('q-selected');
          l.classList.remove('q-selected');
          if (isCorrect && isSelected)        l.classList.add('q-correct');
          else if (!isCorrect && isSelected)  l.classList.add('q-wrong');
          else if (isCorrect && !isSelected)  l.classList.add('q-missed');
        });
        const exp = block.querySelector('.quiz-exp');
        if (exp) exp.open = true;
      });
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initQuiz();
  const target = document.querySelector('#__docusaurus') || document.body;
  new MutationObserver(() => initQuiz()).observe(target, { childList: true, subtree: true });
});

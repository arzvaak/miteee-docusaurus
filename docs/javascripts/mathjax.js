window.MathJax = {
  tex: {
    inlineMath: [["\\(", "\\)"]],
    displayMath: [["\\[", "\\]"]],
    processEscapes: true,
    processEnvironments: true,
    tags: 'ams'
  },
  startup: {
    typeset: false,
    ready() {
      MathJax.startup.defaultReady();
      // Typeset whatever is in the DOM right now (initial page load)
      MathJax.typesetPromise([document.body]).catch(console.error);
      // Re-typeset on every subsequent navigation
      document$.subscribe(({ body }) => {
        MathJax.typesetPromise([body]).catch(console.error);
      });
    }
  }
};

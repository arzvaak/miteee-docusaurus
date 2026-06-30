(function () {
  if (!window.location.pathname.includes('/sem6/spm/')) return;

  const captions = {
    'Peta besar Sejarah Pemikiran Modern': 'Peta pembuka: gunakan ini untuk mengingat urutan besar dari Yunani sampai kontemporer.',
    'Rencana sprint 3 hari Sejarah Pemikiran Modern': 'Strategi belajar darurat: hari pertama fondasi, hari kedua sintesis, hari ketiga latihan jawaban.',
    'Sistem kartu kilat tiga hari SPM': 'Kartu kilat 3 hari: pakai sebagai ritme belajar aktif menjelang ujian, bukan sebagai bacaan pasif.',
    'Tangga recall kronologis Sejarah Pemikiran Modern': 'Tangga recall: naik dari akar klasik sampai kontemporer agar jawaban esai tetap kronologis.',
    'Peta tokoh kronologis Sejarah Pemikiran Modern': 'Peta tokoh: hafalkan tokoh sebagai urutan reaksi, bukan daftar nama yang berdiri sendiri.',
    'Matriks kata kunci dan gerak jawaban SPM': 'Matriks kata kunci: ubah istilah dalam soal menjadi gerak jawaban yang langsung terstruktur.',
    'Perbandingan rawan tertukar Sejarah Pemikiran Modern': 'Perbandingan rawan tertukar: pakai ini untuk memisahkan konsep yang sering bercampur dalam esai.',
    'Decision tree memilih jawaban esai SPM': 'Pohon keputusan jawaban: pilih struktur esai berdasarkan kata kerja soal sebelum mulai menulis.',
    'Rubrik 10 poin jawaban esai Sejarah Pemikiran Modern': 'Rubrik 10 poin: nilai jawaban sendiri dengan tesis, kronologi, konsep, perbandingan, dan penutup.',
    'Dashboard simulasi tiga hari sebelum ujian SPM': 'Dashboard 3 hari: bergerak dari fondasi kronologis menuju simulasi jawaban penuh.',
    'Detektor kesalahan jawaban esai Sejarah Pemikiran Modern': 'Detektor kesalahan: cek jebakan umum sebelum jawaban dianggap selesai.',
    'Rute malam terakhir Sejarah Pemikiran Modern': 'Rute malam terakhir: ikuti urutan ini agar sesi terakhir tetap aktif, terukur, dan tidak melebar.',
    'Peta akhir 20 menit Sejarah Pemikiran Modern': 'Peta akhir 20 menit: pakai pagi ujian untuk mengunci urutan besar dan rumus pembeda.',
    'Jebakan supercepat Sejarah Pemikiran Modern': 'Jebakan supercepat: lima kesalahan umum yang bisa diperbaiki sebelum nilai hilang.',
    'Peta kronologis Sejarah Pemikiran Modern': 'Kronologi utama: baca dari kiri ke kanan sebagai tulang punggung semua jawaban esai.',
    'Peta kronologis dari Yunani Kuno ke modernitas': 'Kronologi awal: Plato, Aristoteles, Abad Tengah, dan Renaissance sebagai akar modernitas.',
    'Akar modernitas dari Yunani sampai Renaissance': 'Akar modernitas: rasio Yunani, disiplin Abad Tengah, dan humanisme Renaissance.',
    'Perbandingan rasionalisme, empirisme, dan Kant': 'Poros epistemologi: rasio, pengalaman, dan sintesis Kant.',
    'Rasionalisme, empirisme, dan sintesis Kant': 'Peta cepat untuk melihat posisi rasionalisme sebelum dibandingkan dengan empirisme dan Kant.',
    'Perbandingan rasio dan pengalaman': 'Peta cepat empirisme: pengalaman sebagai sumber pengetahuan yang tetap perlu metode.',
    'Tiga rasionalis modern': 'Rumus hafalan rasionalisme: Descartes dua substansi, Spinoza satu substansi, Leibniz banyak monade.',
    'Empirisme dan pembersihan pengalaman': 'Empirisme versi ujian: pengalaman penting, tetapi bias harus dibersihkan dengan metode.',
    'Jembatan rasionalisme empirisme dan Kant': 'Jembatan menuju Kant: rasio dan pengalaman sama-sama diperlukan.',
    'Peta Pencerahan dan sintesis Kant': 'Pencerahan: Inggris epistemologis, Perancis politis, Jerman kritis melalui Kant.',
    'Peta Pencerahan Inggris Perancis Jerman dan Kant': 'Peta wilayah Pencerahan: bedakan Inggris, Perancis, dan Jerman sebelum menjelaskan Kant.',
    'Hegel dan reaksi filsafat sesudahnya': 'Hegel sebagai simpul: hampir semua aliran sesudahnya menerima, membalik, atau menolak sistemnya.',
    'Reaksi objektif dan subjektif terhadap Hegel': 'Peta reaksi terhadap Hegel: objektif bergerak ke fakta dan materi, subjektif bergerak ke kehendak dan pengalaman.',
    'Hegel sebagai titik simpul reaksi modern': 'Gunakan peta ini untuk menjelaskan mengapa Hegel menjadi pusat reaksi modern.',
    'Hegel dan reaksi subjektif modern': 'Peta penghubung: dari sistem Hegel menuju reaksi subjektif modern.',
    'Idealisme Jerman dan dialektika': 'Idealisme Jerman: Fichte, Schelling, Hegel, lalu rumus dialektika untuk esai.',
    'Peta objektivisme modern': 'Objektivisme: manusia dijelaskan melalui fakta, materi, evolusi, dan psike.',
    'Peta objektivisme modern setelah Hegel': 'Reaksi objektif setelah Hegel: Comte, Marx, Darwin, dan Freud.',
    'Peta subjektivisme modern': 'Subjektivisme: kehendak, kesadaran, pilihan, dan tanggung jawab.',
    'Peta pemikiran kontemporer': 'Kontemporer: makna tidak netral karena bahasa, struktur, wacana, dan identitas membentuk subjek.',
    'Metode membaca pemikiran kontemporer': 'Cara cepat membaca kontemporer: bahasa, interpretasi, wacana, identitas.',
    'Template jawaban esai': 'Template jawaban: tesis, konteks, konsep, perbandingan, kesimpulan.',
    'Template jawaban esai Sejarah Pemikiran Modern': 'Template jawaban: pakai pola ini untuk menulis esai dengan cepat dan rapi.',
    'Strategi latihan esai Sejarah Pemikiran Modern': 'Latihan esai: ubah ingatan menjadi struktur jawaban yang siap ditulis.',
    'Peta tipe soal ujian Sejarah Pemikiran Modern': 'Peta tipe soal: pilih struktur jawaban sesuai kata kerja soal agar esai tidak melebar.',
    'Siklus recall 72 jam sebelum ujian SPM': 'Siklus 72 jam: baca aktif, tutup catatan, tulis ulang, cek kesalahan, lalu ulangi.',
    'Lensa ujian Minggu 1 akar modernitas': 'Lensa ujian Minggu 1: empat tahap pembuka yang harus muncul berurutan dalam jawaban.',
    'Lensa ujian Minggu 2 rasionalisme': 'Lensa ujian Minggu 2: masalah indera, metode rasio, lalu perbedaan Descartes, Spinoza, dan Leibniz.',
    'Lensa ujian Minggu 3 empirisme': 'Lensa ujian Minggu 3: pengalaman harus menjadi data yang dibersihkan dari bias sebelum menjadi ilmu.',
    'Lensa ujian Minggu 4 pencerahan dan Kant': 'Lensa ujian Minggu 4: peta wilayah Pencerahan dan posisi Kant sebagai sintesis rasio-pengalaman.',
    'Lensa ujian Minggu 5 idealisme': 'Lensa ujian Minggu 5: bandingkan Fichte, Schelling, Hegel, lalu jelaskan reaksi sesudah Hegel.',
    'Lensa ujian Minggu 6 pemikiran objektif': 'Lensa ujian Minggu 6: bedakan fakta ilmiah, materi sosial, evolusi alam, dan ketidaksadaran.',
    'Lensa ujian Minggu 7 pemikiran subjektif': 'Lensa ujian Minggu 7: kehendak, pengalaman sadar, kebebasan, dan tanggung jawab individu.',
    'Lensa ujian Minggu 8 pemikiran kontemporer': 'Lensa ujian Minggu 8: bahasa, struktur, tafsir, wacana, identitas, dan kritik narasi besar.'
  };
  const diagramKey = 'spm-mermaid-scale';
  const diagramSteps = [0.9, 1, 1.18, 1.38, 1.62];

  function clamp(index) {
    return Math.max(0, Math.min(diagramSteps.length - 1, index));
  }

  function getDiagramIndex() {
    const raw = window.localStorage.getItem(diagramKey);
    const saved = raw === null ? NaN : Number(raw);
    if (Number.isInteger(saved)) return clamp(saved);
    return 1;
  }

  function applyDiagramScale(index) {
    const safeIndex = clamp(index);
    document.documentElement.style.setProperty('--spm-mermaid-scale', String(diagramSteps[safeIndex]));
    window.localStorage.setItem(diagramKey, String(safeIndex));
    document.querySelectorAll('.spm-diagram-toolbar button').forEach((button) => {
      button.setAttribute('aria-pressed', button.dataset.diagramReset === 'true' && safeIndex === 1 ? 'true' : 'false');
    });
  }

  function polishImages() {
    document.querySelectorAll('.theme-doc-markdown img').forEach((img) => {
      if (img.closest('table')) return;
      const caption = captions[img.alt];
      if (!caption) return;

      const parent = img.parentElement;
      if (!parent || parent.dataset.spmCaptioned === 'true') return;

      parent.classList.add('spm-figure');
      parent.dataset.spmCaptioned = 'true';

      const cap = document.createElement('span');
      cap.className = 'spm-figcaption';
      cap.textContent = caption;
      parent.appendChild(cap);
    });

    const visualHeading = [...document.querySelectorAll('.theme-doc-markdown h2')]
      .find((heading) => heading.textContent.trim().startsWith('Paket Visual Revisi'));

    if (!visualHeading) return;

    let node = visualHeading.nextElementSibling;
    let index = 1;
    while (node && node.tagName !== 'H2') {
      if (node.classList.contains('spm-figure')) {
        node.classList.add('spm-visual-pack-item');
        node.style.setProperty('--spm-visual-index', '"' + String(index).padStart(2, '0') + '"');
        index += 1;
      }
      node = node.nextElementSibling;
    }
  }

  function polishMermaids() {
    document.querySelectorAll('.docusaurus-mermaid-container').forEach((container) => {
      if (container.dataset.spmDiagramToolbar === 'true') return;

      const toolbar = document.createElement('div');
      toolbar.className = 'spm-diagram-toolbar';
      toolbar.setAttribute('aria-label', 'Ukuran diagram');

      [
        ['D-', 'Perkecil diagram', -1, false],
        ['D', 'Ukuran diagram normal', 0, true],
        ['D+', 'Perbesar diagram', 1, false],
      ].forEach(([label, title, delta, reset]) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = label;
        button.title = title;
        button.setAttribute('aria-label', title);
        button.dataset.diagramReset = String(reset);
        button.addEventListener('click', () => {
          const current = getDiagramIndex();
          applyDiagramScale(delta === 0 ? 1 : current + Number(delta));
        });
        toolbar.appendChild(button);
      });

      container.prepend(toolbar);
      container.dataset.spmDiagramToolbar = 'true';
    });

    applyDiagramScale(getDiagramIndex());
  }

  function buildStudyActions() {
    if (document.querySelector('.spm-study-actions')) return;

    const actions = document.createElement('div');
    actions.className = 'spm-study-actions';
    actions.setAttribute('aria-label', 'Aksi belajar SPM');

    const printButton = document.createElement('button');
    printButton.type = 'button';
    printButton.textContent = 'Cetak';
    printButton.title = 'Cetak atau simpan sebagai PDF';
    printButton.setAttribute('aria-label', 'Cetak atau simpan sebagai PDF');
    printButton.addEventListener('click', () => window.print());

    const topButton = document.createElement('button');
    topButton.type = 'button';
    topButton.textContent = 'Atas';
    topButton.title = 'Kembali ke atas';
    topButton.setAttribute('aria-label', 'Kembali ke atas');
    topButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    actions.appendChild(printButton);
    actions.appendChild(topButton);
    document.body.appendChild(actions);
  }

  function schedulePolish() {
    buildStudyActions();
    polishImages();
    polishMermaids();
    window.setTimeout(() => {
      polishImages();
      polishMermaids();
    }, 500);
    window.setTimeout(() => {
      polishImages();
      polishMermaids();
    }, 1200);
    window.setTimeout(() => {
      polishImages();
      polishMermaids();
    }, 2500);
    window.setTimeout(() => {
      polishImages();
      polishMermaids();
    }, 5000);
    window.setTimeout(() => {
      polishImages();
      polishMermaids();
    }, 8000);
  }

  function start() {
    window.setTimeout(() => {
      schedulePolish();

      const observer = new MutationObserver(() => {
        window.clearTimeout(observer._spmTimer);
        observer._spmTimer = window.setTimeout(() => {
          polishImages();
          polishMermaids();
        }, 120);
      });

      observer.observe(document.body, { childList: true, subtree: true });
    }, 650);
  }

  if (document.readyState === 'complete') {
    start();
  } else {
    window.addEventListener('load', start, { once: true });
  }
})();

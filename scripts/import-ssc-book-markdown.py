"""Import the supplied OCR export without separating explanations from examples.
Usage: python scripts/import-ssc-book-markdown.py export.zip
The original practice corpus is retained. Reading content is independently versioned.
"""
import hashlib, json, re, sys, zipfile
from pathlib import Path
root = Path(__file__).resolve().parents[1]
index = root / 'data/exams/ssc-cgl/quant-book/index.json'
book = json.loads(index.read_text())
archive = Path(sys.argv[1])
assets = index.parent / 'assets'
assets.mkdir(exist_ok=True)
manifest = {'archiveSha256': hashlib.sha256(archive.read_bytes()).hexdigest(), 'chapters': []}
with zipfile.ZipFile(archive) as z:
 for chapter in book['chapters']:
  units = []
  current = None
  counts = {'example': 0, 'concept': 0}
  exercise = False
  def new(title, kind, page):
   global current
   current = {'id': f'reading-{len(units)+1}', 'title': title, 'kind': kind, 'content': '', 'pdfPageStart': page, 'pdfPageEnd': page}
   units.append(current)
  for page in range(chapter['pdfPageStart'], chapter['pdfPageEnd']+1):
   source = f'pw-notes.pdf/pages/page-{page}/'
   text = z.read(source+'markdown.md').decode()
   text = re.sub(r'(\$\$)\[\{\"box_2d\"[^\n]*', r'\1', text)
   text = re.sub(r'^Quantitative Aptitude\s*$', '', text, flags=re.M)
   text = re.sub(r'^.*(?:SSC CGL, CHSL, CPO-SI, Railways and Other Competitive Exams|\d+\s*\|\s*Quantitative Aptitude).*$','',text,flags=re.M)
   text = re.sub(r'^\s*#{0,4}\s*\*{0,2}STUDENT[’\']S NOTES\*{0,2}\s*$','',text,flags=re.M|re.I)
   def img(m):
    name=m.group(1)
    data=z.read(source+name)
    dest=f'ocr-p{page}-{name}'
    (assets/dest).write_bytes(data)
    return f'![Book diagram, page {page}](/content-assets/ssc-cgl/quant-book/{dest})'
   text=re.sub(r'!\[[^\]]*\]\((img-[^ )]+)\)',img,text)
   if page==chapter['pdfPageStart']:
    text=re.sub(r'^\s*#{0,4}\s*Chapter\s*\n+\s*#{0,4}\s*\d+\s*\n+', '',text,flags=re.I)
   for paragraph in re.split(r'\n\s*\n',text.strip()):
    clean=re.sub(r'^[#\s]+','',paragraph).replace('**','').strip().rstrip(':').strip()
    isheading=bool(re.match(r'^#{1,6}\s',paragraph)) or bool(re.fullmatch(r'\*\*[^\n]+\*\*:?',paragraph)) or clean.lower() in ['example','solution','concept','method 1','method 2']
    titlekey=re.sub('[^a-z0-9]','',clean.lower())
    chapterkey=re.sub('[^a-z0-9]','',chapter['title'].lower())
    if isheading and (titlekey==chapterkey or (page==chapter['pdfPageStart'] and titlekey in ['mixturealligation','ratioproportion','pipeandcistern'])):
     if current is None:new('Introduction','concept',page)
     continue
    if isheading and re.match(r'^exercises?\b',clean,re.I):
     exercise=True;new('Chapter exercises','exercise',page);continue
    if isheading and re.match(r'^answer key',clean,re.I):
     new('Answer key','answers',page);continue
    if not exercise and isheading:
     if re.match(r'^(?:for )?example\b',clean,re.I):
      counts['example']+=1;new(f"Example {counts['example']}",'example',page);continue
     if re.match(r'^concept\s*\d*$',clean,re.I):
      counts['concept']+=1;new(f"Concept {counts['concept']}",'concept',page);continue
     if re.match(r'^(solution|method|sol\.)',clean,re.I):
      paragraph='### '+clean
     elif len(clean)<130 and '\n' not in clean and '$' not in clean and not re.match(r'^\d+[.)]?$',clean):
      new(clean,'concept',page);continue
    if current is None:new('Introduction','concept',page)
    current['content']+=paragraph+'\n\n'
    current['pdfPageEnd']=page
  # Editorial labels and explicitly documented corrections for the reviewed chapter.
  if chapter['slug'] == 'mixture-and-alligation':
   labels = {'Introduction': 'The alligation rule', 'Concept 1': 'Mixing containers of different volumes', 'Concept 2': 'Mixing equal volumes', 'Concept 3': 'Adding one liquid to a mixture', 'Concept 4': 'Mixing three ingredients', 'Concept 5': 'Head-and-leg problems', 'Concept 6': 'Repeated replacement'}
   example_labels = ['Wheat prices', 'Population growth', 'Coffee and profit', 'Combining two vessels', 'Equal-capacity containers', 'Profit by adding water', 'Adding water to juice', 'Three varieties of rice', 'Cows and hens', 'Replacing juice four times', 'Finding the original volume']
   for u in units:
    old = u['title']
    u['title'] = labels.get(old, old)
    if u['kind'] == 'example':
     n = int(old.split()[-1]); u['title'] = f"Example {n} · {example_labels[n-1]}"
    if old == 'Concept 5':
     u['content'] = u['content'].replace(r"\frac{(H \times b) - L}{a - b}", r"\frac{L - (H \times b)}{a - b}")
     u['content'] += "\n\n> **Correction:** The source reverses the numerator for animal A. From A + B = H and aA + bB = L, A = (L − bH)/(a − b). The corrected formula is shown above.\n"
    if old == 'Example 10':
     u['content'] = u['content'].replace(r"\frac{x}{1}", r"\frac{x}{I}")
     u['content'] += "\n\n> **Transcription correction:** The denominator in the replacement formula is I (initial volume), not the digit 1. The numerical substitution and result are unchanged.\n"
  chapter['readingSections']=[dict(u,content=u['content'].strip()) for u in units if u['content'].strip()]
  manifest['chapters'].append({'slug':chapter['slug'],'pages':list(range(chapter['pdfPageStart'],chapter['pdfPageEnd']+1)), 'sections':len(chapter['readingSections'])})
book['readingSource']={'format':'ocr-markdown-v1','archiveSha256':manifest['archiveSha256']}
index.write_text(json.dumps(book,ensure_ascii=False,indent=2)+'\n')
(index.parent/'reading-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
print(f"Imported {len(manifest['chapters'])} chapters; {sum(c['sections'] for c in manifest['chapters'])} reading sections")

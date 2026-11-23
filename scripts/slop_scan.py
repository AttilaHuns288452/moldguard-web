import re
from pathlib import Path

s = Path('src/content.ts').read_text()
strings = re.findall(r"'((?:[^'\\]|\\.)*)'", s)
plain = [x for x in strings if len(x) > 3 and not x.startswith('/') and not re.match(r'^[a-z-]+$', x)]
text = '\n'.join(plain)

checks = {
    'em dash': r'[\u2014\u2013]',
    'not just but': r'\bnot (only |just )[^.]{0,40}\bbut\b',
    'tailing negation': r',\s*no [a-z]+ing\b',
    'significance': r'\b(testament|pivotal|underscore|vital role|evolving landscape|indelible)\b',
    'promo words': r'\b(seamless|effortless|revolutionary|cutting-edge|game-chang|unlock|empower|elevate|holistic|synerg)\w*',
    'copula avoid': r'\b(serves as|stands as|functions as)\b',
    'delving': r'\b(delve|delving|dive into)\b',
    'filler': r'\b(in order to|due to the fact|at this point in time|it is important to note)\b',
    'hyphen pairs': r'\b(end-to-end|real-time|data-driven|cross-functional|high-quality|long-term|decision-making)\b',
    'hedging': r'\b(could potentially|might possibly|it may be argued)\b',
    'announcement': r'\b(lets dive|lets explore|lets break|here is what you need)\b',
}
print('=== COPY METRICS ===')
print('strings:', len(plain), 'words:', len(text.split()))
for name, pat in checks.items():
    hits = re.findall(pat, text, re.I)
    if hits:
        print(f'{name:20} {len(hits):3}  {sorted(set(hits))[:8]}')

print('\n=== POSSIBLE AI-TELL SENTENCES ===')
for x in plain:
    if re.search(r'\b(testament|pivotal|underscore|seamless|effortless|revolutionary|unlock|empower|elevate|holistic)\b', x, re.I):
        print(' -', x[:160])

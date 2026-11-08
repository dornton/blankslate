import fs from 'node:fs';
import path from 'node:path';

const raw = fs.readFileSync('files/React Bits.txt', 'utf8');
const outDir = 'src/components';
fs.mkdirSync(outDir, { recursive: true });

const between = (text, startMarker, endMarker) => {
  const start = text.indexOf(startMarker);
  if (start === -1) throw new Error(`missing start marker: ${startMarker}`);
  const end = endMarker ? text.indexOf(endMarker, start + startMarker.length) : text.length;
  return text.slice(start, end === -1 ? text.length : end);
};

const fenced = (text, lang) => {
  const open = text.indexOf('```' + lang);
  if (open === -1) throw new Error(`missing ${lang} fence`);
  const bodyStart = text.indexOf('\n', open) + 1;
  const close = text.indexOf('\n```', bodyStart);
  return text.slice(bodyStart, close === -1 ? text.length : close + 1);
};

const sections = [
  {
    name: 'ScrollVelocity',
    start: '### Component: ScrollVelocity',
    end: '### More from React Bits'
  }
];

for (const section of sections) {
  const body = between(raw, section.start, section.end);
  const sourceBody = body.includes('### Full Component Source')
    ? body.slice(body.indexOf('### Full Component Source'))
    : body;
  const jsx = fenced(sourceBody, 'jsx');
  fs.writeFileSync(path.join(outDir, `${section.name}.jsx`), jsx.trimStart());
  let css = '';
  try {
    const cssBody = sourceBody.includes('### Component CSS')
      ? sourceBody.slice(sourceBody.indexOf('### Component CSS'))
      : sourceBody;
    css = fenced(cssBody, 'css');
  } catch {
    css = '';
  }
  fs.writeFileSync(path.join(outDir, `${section.name}.css`), css);
  console.log(section.name, 'jsx', jsx.length, 'css', css.length);
}

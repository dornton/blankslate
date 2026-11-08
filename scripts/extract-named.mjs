import fs from 'node:fs';
import path from 'node:path';

const raw = fs.readFileSync('files/React Bits.txt', 'utf8').replace(/\r\n/g, '\n');
const outDir = 'src/components';
fs.mkdirSync(outDir, { recursive: true });

const names = process.argv.slice(2);

const fenced = (text, lang) => {
  const open = text.indexOf('```' + lang);
  if (open === -1) throw new Error(`missing ${lang} fence`);
  const bodyStart = text.indexOf('\n', open) + 1;
  const close = text.indexOf('\n```', bodyStart);
  return text.slice(bodyStart, close === -1 ? text.length : close + 1);
};

for (const name of names) {
  const start = raw.indexOf(`### Component: ${name}`);
  if (start === -1) throw new Error(`missing component: ${name}`);
  const nextHeading = raw.indexOf('\n## ', start + 10);
  const body = raw.slice(start, nextHeading === -1 ? raw.length : nextHeading);
  const source = body.includes('### Full Component Source')
    ? body.slice(body.indexOf('### Full Component Source'))
    : body;
  const jsx = fenced(source, 'jsx');
  fs.writeFileSync(path.join(outDir, `${name}.jsx`), jsx.trimStart());
  let css = '';
  try {
    const cssBody = source.includes('### Component CSS')
      ? source.slice(source.indexOf('### Component CSS'))
      : source;
    css = fenced(cssBody, 'css');
  } catch {
    css = '';
  }
  fs.writeFileSync(path.join(outDir, `${name}.css`), css);
  console.log(name, 'jsx', jsx.length, 'css', css.length);
}

import fs from 'node:fs';

const SRC = 'files/Free React Bits.txt';
const OUT = 'src/components';
const wanted = process.argv.slice(2);
const raw = fs.readFileSync(SRC, 'utf8').replace(/\r\n/g, '\n');
const parts = raw.split(/^## Integrate the <(\w+) \/>.*$/m);

function slice(body, startMarker, fence, endMarker) {
  const start = body.indexOf(startMarker);
  const end = body.indexOf(endMarker);
  if (start < 0 || end < 0) throw new Error(`markers missing: ${startMarker} / ${endMarker}`);
  const chunk = body.slice(start, end);
  const from = chunk.indexOf(fence) + fence.length;
  const to = chunk.lastIndexOf('```');
  return `${chunk.slice(from, to).replace(/^\n/, '').trimEnd()}\n`;
}

for (let i = 1; i < parts.length; i += 2) {
  const name = parts[i];
  if (!wanted.includes(name)) continue;
  const body = parts[i + 1];
  const source = slice(body, '### Full Component Source', '```jsx', '### Component CSS');
  const css = slice(body, '### Component CSS', '```css', '### Integration Instructions');
  fs.writeFileSync(`${OUT}/${name}.jsx`, source);
  fs.writeFileSync(`${OUT}/${name}.css`, css);
  console.log(`${name}: ${source.split('\n').length} lines js, ${css.split('\n').length} lines css`);
}

import {mkdirSync, readFileSync, renameSync, writeFileSync} from 'node:fs';
import {stripTypeScriptTypes} from 'node:module';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

export const root = fileURLToPath(new URL('../', import.meta.url));
const read = path => readFileSync(resolve(root, path), 'utf8');
const png = name => 'data:image/png;base64,' + readFileSync(resolve(root, 'assets', name + '.png')).toString('base64');

function inlineModule(path) {
  return stripTypeScriptTypes(read(path)).replace(/^import .*?;$/gm, '').replace(/^export /gm, '');
}
export function build() {
  const parts = {
    avatar:png('avatar'), favicon:png('favicon'), contours:read('assets/contours.svg'),
    city:read('assets/city.svg'), tou:read('assets/tou.svg'), art:read('assets/recorda.svg'),
    fonts:read('assets/fonts.css'), sprites:read('assets/stickers.svg'),
    styles:read('src/styles.css'), licenses:read('assets/FONT-LICENSES.txt'),
    script:[inlineModule('src/config/builderData.ts'), inlineModule('src/lib/ask-ai.ts'), read('src/app.js')].join('\n')
  };
  const html = read('src/index.html').replace(/<!--@(\w+)-->/g, (_,key) => {
    if (!(key in parts)) throw Error('Missing template part ' + key);
    return parts[key];
  });
  mkdirSync(resolve(root, 'dist'), {recursive:true});
  for (const name of ['index.html', 'dist/index.html']) {
    writeFileSync(resolve(root, name + '.tmp'), html);
    renameSync(resolve(root, name + '.tmp'), resolve(root, name));
  }
  return html;
}
if (process.argv[1] === fileURLToPath(import.meta.url)) build();

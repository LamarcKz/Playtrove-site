import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
const source=process.argv[2];
if(!source) throw new Error('Pass the path to the Playtrove application checkout');
for(const item of [
 ['docs/logo.svg','static/img/logo.svg'],
 ['docs/screenshots/pt-BR/library-details.png','static/img/screenshots/pt-BR/library-details.png'],
 ['docs/screenshots/en/library-details.png','static/img/screenshots/en/library-details.png']
]) {
  const target=path.resolve(item[1]);
  await fs.mkdir(path.dirname(target),{recursive:true});
  const bytes=execFileSync('git',['-C',source,'show','v0.7.0:'+item[0]],{maxBuffer:20*1024*1024,windowsHide:true});
  await fs.writeFile(target,bytes);
}
console.log('Copied public demo assets from stable tag v0.7.0.');

import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {buildReleaseData,fetchGitHubReleases,writeGeneratedSite} from './releases.mjs';
const root=path.resolve(fileURLToPath(new URL('..',import.meta.url)));
const fixtureIndex=process.argv.indexOf('--fixture');
try {
  const input=fixtureIndex>=0
    ? JSON.parse(await fs.readFile(path.resolve(root,process.argv[fixtureIndex+1]),'utf8'))
    : await fetchGitHubReleases(process.env.GITHUB_TOKEN || process.env.GH_TOKEN);
  const versions=JSON.parse(await fs.readFile(path.join(root,'versions.json'),'utf8'));
  const data=buildReleaseData(input.releases,versions,input.latestTag);
  for(const locale of ['pt-BR','en']) {
    const docs=locale==='pt-BR' ? path.join(root,'versioned_docs','version-'+data.docsVersion) : path.join(root,'i18n/en/docusaurus-plugin-content-docs','version-'+data.docsVersion);
    if(!(await fs.stat(docs)).isDirectory()) throw new Error('Missing reviewed documentation for '+locale);
  }
  await writeGeneratedSite(root,data);
  console.log('Generated '+data.releases.length+' stable releases in Portuguese and English. Latest: '+data.latest.version+'; docs: '+data.docsVersion+'.');
} catch(error) {
  console.error(error.message);
  process.exitCode=1;
}

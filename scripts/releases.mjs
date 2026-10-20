import fs from 'node:fs/promises';
import path from 'node:path';
import {marked} from 'marked';
import sanitizeHtml from 'sanitize-html';

export const APP_REPOSITORY = 'LamarcKz/Playtrove';
const VERSION = /^(?:v)?(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
export function versionOf(value) {
  if (typeof value !== 'string' || !VERSION.test(value)) throw new Error('Expected a stable semantic version: ' + value);
  return value.replace(/^v/, '');
}
export function compareVersions(a,b) {
  const aa=versionOf(a).split('.').map(Number), bb=versionOf(b).split('.').map(Number);
  for(let i=0;i<3;i++) if(aa[i]!==bb[i]) return aa[i]-bb[i];
  return 0;
}
export function selectDocsVersion(versions, latest) {
  const eligible=versions.map(versionOf).filter(v=>compareVersions(v,latest)<=0).sort(compareVersions);
  if (!eligible.length) throw new Error('No reviewed documentation snapshot is compatible with release ' + latest);
  return eligible.at(-1);
}
export function splitLanguages(body) {
  if(typeof body !== 'string') throw new Error('Release notes are missing');
  const divider=/^##\s+Portugu[eê]s\s*$/im.exec(body);
  if(!divider) throw new Error('Release notes must include English and a ## Português section');
  const en=body.slice(0,divider.index).replace(/^\*\*English\*\*[^\n]*\n*/i,'').replace(/\n---\s*$/,'').trim();
  const pt=body.slice(divider.index+divider[0].length).trim();
  if(!en || !pt) throw new Error('Both release-note languages must contain reviewed content');
  return {'pt-BR':pt,en};
}
export function safeMarkdown(markdown) {
  return sanitizeHtml(marked.parse(markdown,{async:false}),{
    allowedTags:['h1','h2','h3','h4','h5','h6','p','br','hr','strong','em','del','ul','ol','li','blockquote','pre','code','a','table','thead','tbody','tr','th','td'],
    allowedAttributes:{a:['href','title','rel'],code:['class'],th:['align'],td:['align']},
    allowedSchemes:['https','http','mailto'],
    allowProtocolRelative:false,
    transformTags:{a:(name,attrs)=>({tagName:name,attribs:{...attrs,rel:'noopener noreferrer'}})},
    disallowedTagsMode:'discard',
    nonTextTags:['script','style','textarea','option']
  });
}
function summary(markdown) {
  const section=/^#{2,3}\s+(?:What's new|Novidades(?: desta versão)?|New in this version)\s*$/im.exec(markdown);
  const text=section ? markdown.slice(section.index+section[0].length).split(/\n#{1,6}\s/)[0] : markdown;
  return sanitizeHtml(safeMarkdown(text),{allowedTags:[],allowedAttributes:{}})
    .replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&#39;/g,"'").replace(/&quot;/g,'"')
    .replace(/\s+/g,' ').trim().slice(0,240);
}
function publicUrl(value, prefix) {
  if(typeof value !== 'string' || !value.startsWith(prefix)) throw new Error('Unexpected GitHub release URL');
  const url=new URL(value);
  if(url.protocol!=='https:' || url.hostname!=='github.com' || url.username || url.password) throw new Error('Invalid release URL');
  return url.href;
}
export function normalizeRelease(raw) {
  const version=versionOf(raw.tag_name);
  if(raw.draft!==false || raw.prerelease!==false || !raw.published_at || !Number.isFinite(Date.parse(raw.published_at))) throw new Error('Release is not published and stable');
  const notes=splitLanguages(raw.body);
  const assetPrefix='https://github.com/'+APP_REPOSITORY+'/releases/download/'+raw.tag_name+'/';
  const assets=raw.assets ?? [];
  const installer=assets.find(a=>a.name==='Playtrove-Setup-'+version+'.exe');
  const portable=assets.find(a=>a.name==='Playtrove-'+version+'-portable.zip');
  if(!installer || !portable) throw new Error('Release '+version+' is missing its installer or portable download');
  if(raw.html_url !== 'https://github.com/'+APP_REPOSITORY+'/releases/tag/'+raw.tag_name) throw new Error('Release URL must match its tag');
  for(const asset of [installer,portable]) if(asset.browser_download_url !== assetPrefix+asset.name) throw new Error('Download URL must match its asset name');
  return {
    version, tagName:raw.tag_name, publishedAt:raw.published_at,
    htmlUrl:publicUrl(raw.html_url,'https://github.com/'+APP_REPOSITORY+'/releases/tag/'),
    downloads:{installer:publicUrl(installer.browser_download_url,assetPrefix),portable:publicUrl(portable.browser_download_url,assetPrefix)},
    summary:Object.fromEntries(Object.entries(notes).map(([lang,note])=>[lang,summary(note)])),
    bodyHtml:Object.fromEntries(Object.entries(notes).map(([lang,note])=>[lang,safeMarkdown(note)]))
  };
}
export function buildReleaseData(rawReleases, docVersions, latestTag) {
  const stable=rawReleases.filter(r=>r.draft===false && r.prerelease===false && r.published_at && VERSION.test(r.tag_name) && compareVersions(r.tag_name,'0.5.0')>=0);
  const releases=stable.map(normalizeRelease).sort((a,b)=>compareVersions(b.version,a.version));
  if(!releases.length) throw new Error('No stable published Playtrove releases found');
  if(new Set(releases.map(r=>r.version)).size!==releases.length) throw new Error('Duplicate release versions');
  const latest=latestTag ? releases.find(r=>r.tagName===latestTag) : releases[0];
  if(!latest) throw new Error('The latest stable release is absent from the release list');
  return {latest,releases,docsVersion:selectDocsVersion(docVersions,latest.version)};
}
export async function writeGeneratedSite(root,data) {
  const destinations=[['pt-BR','blog'],['en','i18n/en/docusaurus-plugin-content-blog']];
  for(const [locale,relative] of destinations) {
    const dir=path.resolve(root,relative);
    if(!dir.startsWith(path.resolve(root)+path.sep)) throw new Error('Generated output must stay inside site root');
    await fs.mkdir(dir,{recursive:true});
    const expected=new Set(data.releases.map(r=>'release-'+r.version+'.mdx'));
    for(const entry of await fs.readdir(dir,{withFileTypes:true})) {
      if(entry.isFile() && /^release-\d+\.\d+\.\d+\.mdx$/.test(entry.name) && !expected.has(entry.name)) await fs.unlink(path.join(dir,entry.name));
    }
    for(const release of data.releases) {
      // Docusaurus 3.10.2 appends Z to string dates; emit UTC without the suffix.
      const frontmatter=['---','title: '+JSON.stringify('Playtrove '+release.version),'slug: '+JSON.stringify('/releases/'+release.version+'/'),'date: '+JSON.stringify(new Date(release.publishedAt).toISOString().replace(/Z$/,'')),'description: '+JSON.stringify(release.summary[locale]),'---'].join('\n');
      const content=frontmatter+'\n\nimport ReleaseContent from "@site/src/components/ReleaseContent";\n\n<ReleaseContent version="'+release.version+'" locale="'+locale+'" />\n';
      await fs.writeFile(path.join(dir,'release-'+release.version+'.mdx'),content);
    }
  }
  await fs.mkdir(path.join(root,'src/data'),{recursive:true});
  await fs.writeFile(path.join(root,'src/data/releases.json'),JSON.stringify(data,null,2)+'\n');
}
export async function fetchGitHubReleases(token) {
  const headers={Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','User-Agent':'Playtrove-site'};
  if(token) headers.Authorization='Bearer '+token;
  async function get(suffix) {
    const response=await fetch('https://api.github.com/repos/'+APP_REPOSITORY+suffix,{headers,signal:AbortSignal.timeout(30000)});
    if(!response.ok) throw new Error('GitHub Releases request failed: HTTP '+response.status);
    return response.json();
  }
  const latest=await get('/releases/latest');
  const releases=[];
  for(let page=1;page<=100;page++) {
    const batch=await get('/releases?per_page=100&page='+page);
    releases.push(...batch);
    if(batch.length<100) return {releases,latestTag:latest.tag_name};
  }
  throw new Error('Release pagination limit exceeded');
}

import React from 'react';
import data from '@site/src/data/releases.json';
type Locale = 'pt-BR' | 'en';
export default function ReleaseContent({version,locale}:{version:string;locale:Locale}) {
  const release=data.releases.find(item=>item.version===version);
  if(!release) throw new Error('Generated release not found: '+version);
  const pt=locale==='pt-BR';
  return <div className="release-content">
    <p><a href={release.downloads.installer}>{pt?'Baixar instalador':'Download installer'}</a>{' · '}
    <a href={release.downloads.portable}>{pt?'Baixar portátil':'Download portable'}</a>{' · '}
    <a href={release.htmlUrl}>{pt?'Release no GitHub':'Release on GitHub'}</a></p>
    <div dangerouslySetInnerHTML={{__html:release.bodyHtml[locale]}} />
  </div>;
}

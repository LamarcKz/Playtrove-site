import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {test} from 'node:test';
import {
  APP_REPOSITORY,
  buildReleaseData,
  compareVersions,
  normalizeRelease,
  safeMarkdown,
  selectDocsVersion,
  splitLanguages,
  versionOf,
  writeGeneratedSite,
} from '../scripts/releases.mjs';

const fixture = JSON.parse(await fs.readFile(new URL('./fixtures/releases.json', import.meta.url), 'utf8'));
const repository = 'https://github.com/' + APP_REPOSITORY;
const scriptPath = fileURLToPath(new URL('../scripts/sync-releases.mjs', import.meta.url));
const releasesModule = new URL('../scripts/releases.mjs', import.meta.url).href;
const TEMP_PREFIX = 'playtrove-site-release-test-';
const stable = () => fixture.releases.filter(release => release.assets.length > 0);
const clone = value => structuredClone(value);

function releaseFor(version, overrides = {}) {
  const tag = overrides.tag_name ?? 'v' + version;
  const names = [
    'Playtrove-Setup-' + version + '.exe',
    'Playtrove-Setup-' + version + '.exe.blockmap',
    'latest.yml',
    'Playtrove-' + version + '-portable.zip',
  ];
  return {
    ...clone(stable()[0]),
    tag_name: tag,
    html_url: repository + '/releases/tag/' + tag,
    assets: names.map(name => ({name, browser_download_url: repository + '/releases/download/' + tag + '/' + name})),
    ...overrides,
  };
}

/** Cada limpeza confere o caminho absoluto criado por mkdtemp, sem alcançar outras pastas. */
async function temporaryRoot(t) {
  const parent = path.resolve(os.tmpdir());
  const root = await fs.mkdtemp(path.join(parent, TEMP_PREFIX));
  t.after(async () => {
    const absolute = path.resolve(root);
    assert.equal(path.dirname(absolute), parent);
    assert.ok(path.basename(absolute).startsWith(TEMP_PREFIX));
    assert.equal((await fs.lstat(absolute)).isSymbolicLink(), false);
    await fs.rm(absolute, {recursive: true, force: true, maxRetries: 3, retryDelay: 100});
  });
  return root;
}

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}

async function filesUnder(root) {
  const result = {};
  async function visit(folder) {
    for (const entry of await fs.readdir(folder, {withFileTypes: true})) {
      const file = path.join(folder, entry.name);
      if (entry.isDirectory()) await visit(file);
      else result[path.relative(root, file)] = await fs.readFile(file, 'utf8');
    }
  }
  await visit(root);
  return result;
}

test('a fixture contém três releases públicas completas e latest v0.7.0', () => {
  assert.equal(fixture.latestTag, 'v0.7.0');
  assert.deepEqual(stable().map(release => release.tag_name).sort(), ['v0.5.0', 'v0.6.0', 'v0.7.0']);
  for (const release of stable()) {
    const version = versionOf(release.tag_name);
    assert.equal(release.draft, false);
    assert.equal(release.prerelease, false);
    assert.ok(Number.isFinite(Date.parse(release.published_at)));
    assert.equal(release.html_url, repository + '/releases/tag/' + release.tag_name);
    assert.deepEqual(release.assets.map(asset => asset.name).sort(), [
      'Playtrove-' + version + '-portable.zip',
      'Playtrove-Setup-' + version + '.exe',
      'Playtrove-Setup-' + version + '.exe.blockmap',
      'latest.yml',
    ].sort());
    for (const asset of release.assets) {
      assert.equal(asset.browser_download_url, repository + '/releases/download/' + release.tag_name + '/' + asset.name);
    }
  }
});

test('separa as notas revisadas e preserva o conteúdo de cada idioma', () => {
  const body = "**English** · [Português](#português)\n\n## What's new\n\n- Reviewed English text.\n\n---\n\n## Português\n\n## Novidades\n\n- Texto revisado em português.";
  assert.deepEqual(splitLanguages(body), {
    en: "## What's new\n\n- Reviewed English text.",
    'pt-BR': '## Novidades\n\n- Texto revisado em português.',
  });
  assert.deepEqual(splitLanguages('English content.\n\n## Portugues\n\nConteúdo em português.'), {
    en: 'English content.',
    'pt-BR': 'Conteúdo em português.',
  });
  for (const invalid of [undefined, null, '', 'Only English.', '## Português\n\nSó português.', 'English.\n\n## Português\n']) {
    assert.throws(() => splitLanguages(invalid), /notes|languages/i);
  }
});

test('aceita semver estável e compara números, não strings ou datas', () => {
  for (const [input, expected] of [['v0.7.0', '0.7.0'], ['0.7.0', '0.7.0'], ['1.0.0', '1.0.0']]) {
    assert.equal(versionOf(input), expected);
  }
  for (const invalid of [undefined, null, 7, 'v0.7', 'v00.7.0', 'v0.07.0', 'v0.7.00', 'v0.7.0-preview', 'v0.7.0+build', ' 0.7.0', '0.7.0 ']) {
    assert.throws(() => versionOf(invalid), /stable semantic version/);
  }
  assert.ok(compareVersions('0.10.0', '0.9.0') > 0);
  assert.ok(compareVersions('1.0.0', '0.99.99') > 0);
  assert.equal(compareVersions('v0.7.0', '0.7.0'), 0);
  const data = buildReleaseData([
    releaseFor('0.9.0', {published_at: '2026-10-20T12:00:00Z'}),
    releaseFor('0.10.0', {published_at: '2026-10-01T12:00:00Z'}),
  ], ['0.7.0']);
  assert.deepEqual(data.releases.map(release => release.version), ['0.10.0', '0.9.0']);
});

test('preserva a publicação original e escolhe os downloads da versão correta', () => {
  const raw = releaseFor('0.7.0', {published_at: '2026-10-15T23:45:00-03:00'});
  const normalized = normalizeRelease(raw);
  assert.equal(normalized.publishedAt, raw.published_at);
  assert.equal(normalized.version, '0.7.0');
  assert.equal(normalized.tagName, 'v0.7.0');
  assert.equal(normalized.htmlUrl, repository + '/releases/tag/v0.7.0');
  assert.deepEqual(normalized.downloads, {
    installer: repository + '/releases/download/v0.7.0/Playtrove-Setup-0.7.0.exe',
    portable: repository + '/releases/download/v0.7.0/Playtrove-0.7.0-portable.zip',
  });
  assert.ok(normalized.summary.en.includes('demonstration'));
  assert.ok(normalized.summary['pt-BR'].includes('demonstração'));
  assert.ok(normalized.bodyHtml.en.includes('<li>'));
  assert.ok(normalized.bodyHtml['pt-BR'].includes('Novidades'));
  assert.throws(() => normalizeRelease(releaseFor('0.7.0', {published_at: 'not-a-date'})), /published and stable/);
  assert.throws(() => normalizeRelease(releaseFor('0.7.0', {published_at: null})), /published and stable/);
});

test('ignora drafts, prereleases, tags não estáveis, versões anteriores e publicações ausentes', () => {
  const data = buildReleaseData(fixture.releases, ['0.7.0'], fixture.latestTag);
  assert.deepEqual(data.releases.map(release => release.version), ['0.7.0', '0.6.0', '0.5.0']);
  assert.equal(data.latest.tagName, fixture.latestTag);
  assert.equal(data.docsVersion, '0.7.0');
  const explicitlySelected = buildReleaseData(stable(), ['0.5.0'], 'v0.5.0');
  assert.equal(explicitlySelected.latest.version, '0.5.0');
  assert.throws(() => buildReleaseData([], ['0.7.0']), /No stable published/);
  assert.throws(() => buildReleaseData(stable(), ['0.7.0'], 'v0.8.0'), /latest stable release is absent/);
  assert.throws(() => buildReleaseData([
    releaseFor('0.7.0'), releaseFor('0.7.0', {tag_name: '0.7.0'}),
  ], ['0.7.0']), /Duplicate release versions/);
});

test('falha com idiomas ausentes ou downloads incompletos em uma release estável', () => {
  assert.throws(() => normalizeRelease(releaseFor('0.7.0', {body: 'English only.'})), /Portugu/);
  for (const name of ['Playtrove-Setup-0.7.0.exe', 'Playtrove-0.7.0-portable.zip']) {
    const raw = releaseFor('0.7.0');
    raw.assets = raw.assets.filter(asset => asset.name !== name);
    assert.throws(() => normalizeRelease(raw), /missing its installer or portable/);
  }
  assert.throws(() => normalizeRelease(releaseFor('0.7.0', {draft: true})), /published and stable/);
  assert.throws(() => normalizeRelease(releaseFor('0.7.0', {prerelease: true})), /published and stable/);
});

test('URLs precisam pertencer à tag e ao arquivo exatos, sem troca de origem', () => {
  for (const html_url of [
    'http://github.com/LamarcKz/Playtrove/releases/tag/v0.7.0',
    'https://example.test/releases/tag/v0.7.0',
    repository + '/releases/tag/v0.6.0',
    repository + '/releases/tag/v0.7.0/extra',
  ]) {
    assert.throws(() => normalizeRelease(releaseFor('0.7.0', {html_url})), /URL/i);
  }
  for (const url of [
    'https://example.test/Playtrove-Setup-0.7.0.exe',
    repository + '/releases/download/v0.6.0/Playtrove-Setup-0.7.0.exe',
    repository + '/releases/download/v0.7.0/another-file.exe',
    repository + '/releases/download/v0.7.0/Playtrove-0.7.0-portable.zip',
  ]) {
    const raw = releaseFor('0.7.0');
    raw.assets.find(asset => asset.name === 'Playtrove-Setup-0.7.0.exe').browser_download_url = url;
    assert.throws(() => normalizeRelease(raw), /URL/i);
  }
});

test('seleciona apenas o snapshot revisado que não está adiante da última estável', () => {
  assert.equal(selectDocsVersion(['0.8.0', '0.6.0', '0.7.0'], '0.7.0'), '0.7.0');
  assert.equal(selectDocsVersion(['0.6.0', '0.5.0'], '0.7.0'), '0.6.0');
  assert.equal(selectDocsVersion(['0.9.0', '0.10.0', '0.11.0'], '0.10.0'), '0.10.0');
  assert.throws(() => selectDocsVersion(['0.8.0'], '0.7.0'), /No reviewed documentation snapshot/);
  assert.throws(() => selectDocsVersion([], '0.7.0'), /No reviewed documentation snapshot/);
});

test('HTML externo perde scripts, eventos, embeds e links executáveis, mantendo o Markdown útil', () => {
  const html = safeMarkdown([
    '# A heading',
    '',
    '**Bold** and [safe link](https://example.test/guide "Guide").',
    '',
    '| Column | Value |',
    '| --- | --- |',
    '| Entry | 1 |',
    '',
    '<script>REMOTE_SCRIPT_SENTINEL</script>',
    '<style>REMOTE_STYLE_SENTINEL</style>',
    '<img src="x" onerror="REMOTE_EVENT_SENTINEL">',
    '<iframe src="https://example.test/embed"></iframe>',
    '<svg onload="REMOTE_EVENT_SENTINEL"></svg>',
    '<a href="javascript:alert(1)" onclick="REMOTE_EVENT_SENTINEL">Unsafe URL</a>',
    '<a href="//example.test/path">Protocol relative URL</a>',
    '<a href="https://example.test/ok" style="color:red" onmouseover="REMOTE_EVENT_SENTINEL">Allowed URL</a>',
    '',
    '    const value = 1;',
  ].join('\n'));
  assert.match(html, /<h1>A heading<\/h1>/);
  assert.match(html, /<strong>Bold<\/strong>/);
  assert.match(html, /<table>/);
  assert.match(html, /href="https:\/\/example\.test\/guide"/);
  assert.match(html, /rel="noopener noreferrer"/);
  assert.doesNotMatch(html, /<(script|style|img|iframe|svg)\b/i);
  assert.doesNotMatch(html, /\bon(error|load|click|mouseover)\s*=/i);
  assert.doesNotMatch(html, /href="(?:javascript:|\/\/)/i);
  assert.doesNotMatch(html, /REMOTE_SCRIPT_SENTINEL|REMOTE_STYLE_SENTINEL/);
});

test('notas remotas ficam nos dados sanitizados e nunca são código-fonte dos posts MDX', async t => {
  const root = await temporaryRoot(t);
  const remoteBody = [
    '**English**',
    "## What's new",
    '- A safe reviewed summary.',
    '',
    '## Additional details',
    '{(() => { throw new Error("REMOTE_MDX_SENTINEL"); })()}',
    'import Remote from "./REMOTE_IMPORT_SENTINEL.mjs";',
    '<script>REMOTE_SCRIPT_SENTINEL</script>',
    '<ReleaseContent version="1.2.3" />',
    '',
    '## Português',
    '## Novidades',
    '- Um resumo seguro e revisado.',
    '',
    '## Mais detalhes',
    '{(() => { throw new Error("REMOTE_PT_MDX_SENTINEL"); })()}',
    'export const REMOTE_EXPORT_SENTINEL = true;',
  ].join('\n');
  const publishedAt = '2026-10-15T23:45:00-03:00';
  const data = buildReleaseData([releaseFor('0.7.0', {body: remoteBody, published_at: publishedAt})], ['0.7.0'], 'v0.7.0');
  await writeGeneratedSite(root, data);
  const saved = JSON.parse(await fs.readFile(path.join(root, 'src/data/releases.json'), 'utf8'));
  assert.equal(saved.latest.publishedAt, publishedAt);
  assert.equal(saved.releases[0].publishedAt, publishedAt);
  assert.match(saved.releases[0].bodyHtml.en, /REMOTE_MDX_SENTINEL/);
  assert.match(saved.releases[0].bodyHtml['pt-BR'], /REMOTE_PT_MDX_SENTINEL/);
  assert.doesNotMatch(saved.releases[0].bodyHtml.en, /<script|REMOTE_SCRIPT_SENTINEL/);
  for (const [locale, relative] of [['pt-BR', 'blog'], ['en', 'i18n/en/docusaurus-plugin-content-blog']]) {
    const post = await fs.readFile(path.join(root, relative, 'release-0.7.0.mdx'), 'utf8');
    assert.ok(post.includes('<ReleaseContent version="0.7.0" locale="' + locale + '" />'));
    assert.doesNotMatch(post, /REMOTE_|import Remote|export const|\{\(\(\)/);
    const dateField = /^date: (.+)$/m.exec(post);
    assert.ok(dateField);
    const frontMatterDate = JSON.parse(dateField[1]);
    assert.doesNotMatch(frontMatterDate, /Z$/);
    assert.equal(new Date(frontMatterDate + 'Z').toISOString(), new Date(publishedAt).toISOString());
    assert.ok(post.includes('slug: "/releases/0.7.0/"'));
  }
});

test('reprocessar produz os mesmos arquivos e reflete notas corrigidas sem duplicar posts', async t => {
  const root = await temporaryRoot(t);
  const data = buildReleaseData(fixture.releases, ['0.7.0'], fixture.latestTag);
  await writeGeneratedSite(root, data);
  const first = await filesUnder(root);
  await writeGeneratedSite(root, data);
  assert.deepEqual(await filesUnder(root), first);
  assert.equal(Object.keys(first).length, 7);

  const corrected = clone(fixture.releases);
  const release = corrected.find(item => item.tag_name === 'v0.7.0');
  release.body = release.body.replace('A demonstration window improvement.', 'Corrected English release text.')
    .replace('Uma melhoria de demonstração na janela.', 'Texto corrigido da release em português.');
  const updated = buildReleaseData(corrected, ['0.7.0'], fixture.latestTag);
  await writeGeneratedSite(root, updated);
  const written = JSON.parse(await fs.readFile(path.join(root, 'src/data/releases.json'), 'utf8'));
  assert.match(written.latest.bodyHtml.en, /Corrected English release text/);
  assert.match(written.latest.bodyHtml['pt-BR'], /Texto corrigido da release/);
  assert.equal(written.latest.publishedAt, data.latest.publishedAt);
  for (const relative of ['blog', 'i18n/en/docusaurus-plugin-content-blog']) {
    assert.deepEqual((await fs.readdir(path.join(root, relative))).sort(), [
      'release-0.5.0.mdx', 'release-0.6.0.mdx', 'release-0.7.0.mdx',
    ]);
  }
});

test('remove somente posts gerados obsoletos e preserva conteúdo editorial ou diretórios', async t => {
  const root = await temporaryRoot(t);
  const data = buildReleaseData(fixture.releases, ['0.7.0'], fixture.latestTag);
  await writeGeneratedSite(root, data);
  for (const relative of ['blog', 'i18n/en/docusaurus-plugin-content-blog']) {
    const folder = path.join(root, relative);
    await fs.writeFile(path.join(folder, 'release-9.9.9.mdx'), 'stale generated post');
    await fs.writeFile(path.join(folder, 'editorial.md'), 'manual editorial content');
    await fs.writeFile(path.join(folder, 'release-announcement.mdx'), 'manual announcement');
    await fs.mkdir(path.join(folder, 'release-8.8.8.mdx'));
    await fs.writeFile(path.join(folder, 'release-8.8.8.mdx', 'keep.txt'), 'nested content');
  }
  await writeGeneratedSite(root, {...data, releases: data.releases.filter(release => release.version !== '0.5.0')});
  for (const relative of ['blog', 'i18n/en/docusaurus-plugin-content-blog']) {
    const folder = path.join(root, relative);
    assert.equal(await exists(path.join(folder, 'release-0.5.0.mdx')), false);
    assert.equal(await exists(path.join(folder, 'release-9.9.9.mdx')), false);
    assert.equal(await fs.readFile(path.join(folder, 'editorial.md'), 'utf8'), 'manual editorial content');
    assert.equal(await fs.readFile(path.join(folder, 'release-announcement.mdx'), 'utf8'), 'manual announcement');
    assert.equal(await fs.readFile(path.join(folder, 'release-8.8.8.mdx', 'keep.txt'), 'utf8'), 'nested content');
    assert.equal(await exists(path.join(folder, 'release-0.7.0.mdx')), true);
  }
});

/** Roda o CLI real numa cópia temporária, apontando o import ao módulo original do repositório. */
async function cliRoot(t, versions, locales) {
  const root = await temporaryRoot(t);
  const scripts = path.join(root, 'scripts');
  await fs.mkdir(scripts);
  const source = await fs.readFile(scriptPath, 'utf8');
  const importPattern = /from\s+(['"])\.\/releases\.mjs\1/;
  assert.match(source, importPattern);
  await fs.writeFile(path.join(scripts, 'sync-releases.mjs'), source.replace(importPattern, 'from ' + JSON.stringify(releasesModule)));
  await fs.writeFile(path.join(scripts, 'offline.mjs'), [
    'globalThis.fetch = () => { throw new Error("Network disabled in release fixture tests"); };',
    'await import("./sync-releases.mjs");',
    '',
  ].join('\n'));
  await fs.writeFile(path.join(root, 'versions.json'), JSON.stringify(versions));
  await fs.writeFile(path.join(root, 'fixture.json'), JSON.stringify(fixture));
  for (const locale of locales) {
    const relative = locale === 'pt-BR' ? 'versioned_docs' : 'i18n/en/docusaurus-plugin-content-docs';
    await fs.mkdir(path.join(root, relative, 'version-0.7.0'), {recursive: true});
  }
  return root;
}

function runOfflineCli(root) {
  const result = spawnSync(process.execPath, [
    path.join(root, 'scripts/offline.mjs'), '--fixture', path.join(root, 'fixture.json'),
  ], {
    cwd: root,
    env: {...process.env, GITHUB_TOKEN: '', GH_TOKEN: ''},
    encoding: 'utf8',
    timeout: 10000,
    windowsHide: true,
  });
  assert.equal(result.error, undefined);
  return result;
}

test('CLI offline ignora snapshots futuros e gera a estável com os dois idiomas disponíveis', async t => {
  const root = await cliRoot(t, ['0.8.0', '0.7.0'], ['pt-BR', 'en']);
  const result = runOfflineCli(root);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /3 stable releases.*Latest: 0.7.0; docs: 0.7.0/);
  const data = JSON.parse(await fs.readFile(path.join(root, 'src/data/releases.json'), 'utf8'));
  assert.equal(data.docsVersion, '0.7.0');
  assert.equal(data.latest.tagName, fixture.latestTag);
  assert.equal(await exists(path.join(root, 'blog/release-0.7.0.mdx')), true);
  assert.equal(await exists(path.join(root, 'i18n/en/docusaurus-plugin-content-blog/release-0.7.0.mdx')), true);
});

for (const missing of ['pt-BR', 'en']) {
  test('CLI não publica arquivos se faltar o snapshot revisado de ' + missing, async t => {
    const root = await cliRoot(t, ['0.7.0'], ['pt-BR', 'en'].filter(locale => locale !== missing));
    const result = runOfflineCli(root);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /ENOENT|Missing reviewed documentation/);
    assert.equal(await exists(path.join(root, 'src/data/releases.json')), false);
    assert.equal(await exists(path.join(root, 'blog/release-0.7.0.mdx')), false);
  });
}

test('CLI recusa um conjunto que contém somente documentação futura', async t => {
  const root = await cliRoot(t, ['0.8.0'], ['pt-BR', 'en']);
  const result = runOfflineCli(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /No reviewed documentation snapshot/);
  assert.equal(await exists(path.join(root, 'src/data/releases.json')), false);
});

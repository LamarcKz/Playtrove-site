import { expect, test, type Locator, type Page } from '@playwright/test';
import releaseData from '../src/data/releases.json';
import demo from '../src/data/demo.json';

// DOM, geometria, teclado e reprodução de mídia. Capturas, gravação e trace ficam desligados.
const ORIGIN = 'http://127.0.0.1:4173';
const BASE_PATH = '/Playtrove-site/';
const LATEST = releaseData.latest.version;
const VERSIONS = releaseData.releases.map((release) => release.version);
// A versão das novidades escritas à mão na página inicial (HIGHLIGHTS_VERSION, em src/pages/index.tsx).
const HIGHLIGHTS_VERSION = '1.0.0';
const LOCALES = ['pt-BR', 'en'] as const;
type Locale = typeof LOCALES[number];
const VIEWPORTS = [
  { width: 360, height: 800 },
  { width: 960, height: 600 },
  { width: 1280, height: 800 },
  { width: 1920, height: 1080 },
];
const ALL_DOCUMENTS: { slug: string; pt: string; en: string; since?: string }[] = [
  { slug: 'installation', pt: 'Instalação', en: 'Installation' },
  { slug: 'getting-started', pt: 'Primeiros passos', en: 'Getting started' },
  { slug: 'emulators', pt: 'Emuladores e pastas de ROMs', en: 'Emulators and ROM folders' },
  { slug: 'library', pt: 'Organizar a biblioteca', en: 'Organize your library' },
  { slug: 'fullscreen', pt: 'Tela cheia', en: 'Fullscreen', since: '1.0.0' },
  { slug: 'metadata', pt: 'Metadados e imagens', en: 'Metadata and images' },
  { slug: 'achievements', pt: 'Conquistas e troféus', en: 'Achievements and trophies' },
  { slug: 'statistics', pt: 'Tempo jogado e estatísticas', en: 'Playtime and statistics' },
  { slug: 'data-updates', pt: 'Dados, privacidade e atualizações', en: 'Data, privacy and updates' },
  { slug: 'troubleshooting', pt: 'Solução de problemas', en: 'Troubleshooting' },
  { slug: 'contributing', pt: 'Contribuir com o projeto', en: 'Contribute to the project' },
  { slug: 'architecture', pt: 'Arquitetura do aplicativo', en: 'Application architecture' },
];
// Um guia que surgiu numa versão só existe nos snapshots a partir dela (a fixture dos testes usa guias antigos).
const versionParts = (version: string) => version.split('.').map(Number);
const atLeast = (version: string, minimum: string) => {
  const [a, b] = [versionParts(version), versionParts(minimum)];
  for (let index = 0; index < 3; index++) if (a[index] !== b[index]) return a[index] > b[index];
  return true;
};
const DOCUMENTS = ALL_DOCUMENTS.filter((document) => !document.since || atLeast(releaseData.docsVersion, document.since));

const paths = (locale: Locale, suffix = '') => `${BASE_PATH}${locale === 'en' ? 'en/' : ''}${suffix}`;
const heading = (locale: Locale) => locale === 'en' ? 'Your games, well organized.' : 'Seus jogos, bem organizados.';
const installer = releaseData.latest.downloads.installer;
const portable = releaseData.latest.downloads.portable;

let externalResources: string[];
let runtimeErrors: string[];
let dialogs: string[];

test.beforeEach(async ({ page }) => {
  externalResources = [];
  runtimeErrors = [];
  dialogs = [];
  page.on('pageerror', (error) => runtimeErrors.push(error.message));
  page.on('dialog', async (dialog) => {
    dialogs.push(dialog.message());
    await dialog.dismiss();
  });
  // Nenhum teste depende de internet. Um recurso externo inesperado falha sem fazer o pedido.
  await page.route('**/*', async (route) => {
    const resource = route.request().url();
    if (new URL(resource).origin === ORIGIN) {
      await route.continue();
    } else {
      externalResources.push(resource);
      await route.abort('blockedbyclient');
    }
  });
});

test.afterEach(async () => {
  expect(externalResources, 'scripts, fontes, imagens e outros recursos devem ser locais').toEqual([]);
  expect(runtimeErrors, 'a página não deve lançar erros no navegador').toEqual([]);
  expect(dialogs, 'as notas publicadas não devem executar código').toEqual([]);
});

async function openPage(page: Page, locale: Locale, suffix = '') {
  const response = await page.goto(paths(locale, suffix));
  expect(response?.status(), 'a rota deve existir no build estático').toBe(200);
  await expect(page.locator('html')).toHaveAttribute('lang', locale);
  await expect(page.locator('main')).toBeVisible();
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
}

async function expectNoHorizontalScroll(page: Page) {
  const overflow = await page.evaluate(() => ({
    root: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    body: document.body.scrollWidth - document.documentElement.clientWidth,
  }));
  expect(overflow.root, 'o documento não deve rolar horizontalmente').toBeLessThanOrEqual(1);
  expect(overflow.body, 'o corpo não deve transbordar horizontalmente').toBeLessThanOrEqual(1);
}

async function expectReachable(link: Locator, page: Page) {
  await link.scrollIntoViewIfNeeded();
  await expect(link).toBeVisible();
  const box = await link.boundingBox();
  expect(box).not.toBeNull();
  if (!box) return;
  const width = page.viewportSize()!.width;
  expect(box.width).toBeGreaterThan(0);
  expect(box.x).toBeGreaterThanOrEqual(-1);
  expect(box.x + box.width).toBeLessThanOrEqual(width + 1);
  // Trial verifica alvo, recortes e sobreposição sem abrir downloads ou serviços externos.
  await link.click({ trial: true });
}

async function expectMainActionsReachable(page: Page) {
  for (const link of await page.locator('main a[href]').all()) {
    if (await link.isVisible()) await expectReachable(link, page);
  }
}

async function expectPublishedDate(time: Locator, publishedAt: string, locale: Locale) {
  await expect(time).toHaveAttribute('datetime', /\S/);
  const machineDate = await time.getAttribute('datetime');
  expect(new Date(machineDate!).getTime()).toBe(new Date(publishedAt).getTime());
  const formattedDate = new Intl.DateTimeFormat(locale, {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  }).format(new Date(publishedAt));
  await expect(time).toHaveText(formattedDate);
}

for (const locale of LOCALES) {
  test(`${locale}: página inicial, downloads e última versão dos dados gerados`, async ({ page }) => {
    await openPage(page, locale);
    await expect(page.locator('main h1')).toHaveText(heading(locale));
    const installerName = locale === 'en' ? 'Download for Windows' : 'Baixar para Windows';
    const portableName = locale === 'en' ? 'Portable version' : 'Versão portátil';
    const guideName = locale === 'en' ? 'Read the guide' : 'Ler o guia';
    const installers = page.getByRole('link', { name: installerName, exact: true });
    const portables = page.getByRole('link', { name: portableName, exact: true });
    const guides = page.getByRole('link', { name: guideName, exact: true });
    await expect(installers).toHaveCount(2);
    await expect(portables).toHaveCount(2);
    await expect(guides).toHaveCount(2);
    for (const link of await installers.all()) await expect(link).toHaveAttribute('href', installer);
    for (const link of await portables.all()) await expect(link).toHaveAttribute('href', portable);
    for (const link of await guides.all()) await expect(link).toHaveAttribute('href', paths(locale, 'docs/installation/'));
    await expect(page.locator('.pt-download-meta a')).toHaveText(`v${LATEST}`);
    await expect(page.locator('.pt-download-meta a')).toHaveAttribute('href', paths(locale, `blog/releases/${LATEST}/`));
    // A versão das novidades em destaque fica no cartão; a lista mostra as anteriores.
    const listed = releaseData.releases.filter((release) => release.version !== HIGHLIGHTS_VERSION).slice(0, 3);
    await expect(page.locator('.pt-release-row')).toHaveCount(listed.length);
    await expect(page.locator('.pt-release-version')).toHaveText(listed.map((release) => release.version));
    await expect(page.locator('.pt-release-copy p')).toHaveText(listed.map((release) => release.summary[locale]));
    for (const [index, release] of listed.entries()) {
      await expectPublishedDate(page.locator('.pt-release-meta time').nth(index), release.publishedAt, locale);
    }
    const video = page.locator('.pt-product video');
    await expect(video).toHaveAttribute('src', paths(locale, `media/demo/en/playtrove-${demo.version}.webm`));
    await expect(video).toHaveAttribute('poster', paths(locale, 'img/demo/en/poster.png'));
    await expect(video).toHaveJSProperty('muted', true);
    await expect(video).toHaveJSProperty('loop', true);
    await expect(video).toHaveJSProperty('playsInline', true);
    await expect(video).toHaveJSProperty('controls', true);
    await expect(page.locator('.pt-demo-toggle')).toHaveAccessibleName(locale === 'en' ? 'Play demo' : 'Reproduzir demonstração');
    for (const image of await page.locator('.pt-home img').all()) {
      await image.scrollIntoViewIfNeeded();
      await expect(image).toHaveAttribute('alt', /\S/);
      await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
    }
    await expectNoHorizontalScroll(page);
  });

  for (const document of DOCUMENTS) {
    test(`${locale}: acesso direto e recarga de docs/${document.slug}`, async ({ page }) => {
      await openPage(page, locale, `docs/${document.slug}/`);
      const expected = locale === 'en' ? document.en : document.pt;
      await expect(page.locator('main h1').first()).toHaveText(expected);
      const response = await page.reload();
      expect(response?.status()).toBe(200);
      await expect(page.locator('main h1').first()).toHaveText(expected);
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expectNoHorizontalScroll(page);
    });
  }

  for (const version of VERSIONS) {
    const release = releaseData.releases.find((item) => item.version === version)!;
    test(`${locale}: acesso direto e recarga da release ${version}`, async ({ page }) => {
      await openPage(page, locale, `blog/releases/${version}/`);
      await expect(page.locator('main h1').first()).toHaveText(`Playtrove ${version}`);
      const releaseLink = page.locator('.release-content').getByRole('link', {
        name: locale === 'en' ? 'Release on GitHub' : 'Release no GitHub', exact: true,
      });
      await expect(releaseLink).toHaveAttribute('href', release.htmlUrl);
      await expectPublishedDate(page.locator('main article time').first(), release.publishedAt, locale);
      await expect(page.locator('.release-content')).not.toBeEmpty();
      const response = await page.reload();
      expect(response?.status()).toBe(200);
      await expect(page.locator('main h1').first()).toHaveText(`Playtrove ${version}`);
      await expectNoHorizontalScroll(page);
    });
  }

  test(`${locale}: pular navegação e abrir o guia pelo teclado`, async ({ page }) => {
    await openPage(page, locale);
    await page.keyboard.press('Tab');
    const skip = page.locator('a[href="#__docusaurus_skipToContent_fallback"]');
    await expect(skip).toBeFocused();
    await expect(skip).toBeVisible();
    await page.keyboard.press('Enter');
    await expect(page.locator('main')).toBeFocused();
    const guide = page.locator('.navbar__inner').getByRole('link', {
      name: locale === 'en' ? 'Guide' : 'Guia', exact: true,
    });
    await guide.focus();
    await expect(guide).toBeFocused();
    await page.keyboard.press('Enter');
    await expect.poll(() => new URL(page.url()).pathname).toBe(paths(locale, 'docs/installation/'));
    await expect(page.locator('main h1').first()).toHaveText(locale === 'en' ? 'Installation' : 'Instalação');
  });

  for (const size of VIEWPORTS) {
    test(`${locale}: ${size.width}x${size.height} sem transbordamento e com ações acessíveis`, async ({ page }) => {
      await page.setViewportSize(size);
      await openPage(page, locale);
      await expectMainActionsReachable(page);
      await expectNoHorizontalScroll(page);
      const video = page.locator('.pt-product video');
      await video.scrollIntoViewIfNeeded();
      await expectReachable(page.locator('.pt-demo-toggle'), page);
      const geometry = await video.evaluate((element: HTMLVideoElement) => ({
        width: element.getBoundingClientRect().width,
        height: element.getBoundingClientRect().height,
      }));
      expect(geometry.width).toBeGreaterThan(0);
      expect(Math.abs(geometry.height - geometry.width / (1280 / 800))).toBeLessThanOrEqual(1);
      // Tabelas largas e notas publicadas também precisam caber no documento em telas pequenas.
      for (const suffix of ['docs/installation/', 'docs/emulators/', `blog/releases/${LATEST}/`, 'blog/', 'blog/archive/']) {
        await openPage(page, locale, suffix);
        await expectNoHorizontalScroll(page);
        await expectMainActionsReachable(page);
      }
    });
  }

  test(`${locale}: conteúdo publicado não adiciona scripts ou atributos executáveis`, async ({ page }) => {
    for (const version of VERSIONS) {
      await openPage(page, locale, `blog/releases/${version}/`);
      const executable = await page.locator('.release-content').evaluate((container) => {
        const forbidden = container.querySelectorAll('script, iframe, object, embed, form, style').length;
        const attributes = [...container.querySelectorAll('*')].flatMap((element) => [...element.attributes]
          .filter((attribute) => /^on/i.test(attribute.name) || attribute.name === 'srcdoc')
          .map((attribute) => attribute.name));
        const unsafeLinks = [...container.querySelectorAll('a[href]')]
          .map((link) => link.getAttribute('href') ?? '')
          .filter((href) => /^\s*(?:javascript|data|vbscript):/i.test(href));
        return { forbidden, attributes, unsafeLinks };
      });
      expect(executable).toEqual({ forbidden: 0, attributes: [], unsafeLinks: [] });
    }
  });
}

for (const locale of LOCALES) {
  test(`${locale}: índice de novidades, navegação traduzida e arquivo`, async ({ page }) => {
    await openPage(page, locale, 'blog/');
    await expect(page).toHaveTitle(locale === 'en' ? /Playtrove news/ : /Novidades do Playtrove/);
    const expectedNavigation = locale === 'en'
      ? ['Home', 'Guide', 'Contribute', 'News', 'GitHub']
      : ['Início', 'Guia', 'Colaborar', 'Novidades', 'GitHub'];
    for (const label of expectedNavigation) {
      const link = label === 'GitHub'
        ? page.locator('.navbar__inner').getByRole('link', { name: /^GitHub/ })
        : page.locator('.navbar__inner').getByRole('link', { name: label, exact: true });
      await expect(link).toBeVisible();
      if (label === 'GitHub') await expect(link).toHaveAttribute('href', 'https://github.com/LamarcKz/Playtrove');
    }
    const sidebar = page.locator('aside nav').first();
    await expect(sidebar.getByText(locale === 'en' ? 'Releases' : 'Versões', { exact: true })).toBeVisible();
    await expect(page.locator('main article').first()).toBeVisible();
    await expect(page.locator('main').getByRole('heading', { level: 2, name: `Playtrove ${LATEST}`, exact: true })).toBeVisible();
    await expectNoHorizontalScroll(page);
    const indexResponse = await page.reload();
    expect(indexResponse?.status()).toBe(200);
    await expect(sidebar.getByText(locale === 'en' ? 'Releases' : 'Versões', { exact: true })).toBeVisible();
    await openPage(page, locale, 'blog/archive/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(locale === 'en' ? 'Archive' : 'Arquivo');
    for (const release of releaseData.releases) {
      const link = page.locator(`main a[href="${paths(locale, `blog/releases/${release.version}/`)}"]`);
      await expect(link).toContainText(`Playtrove ${release.version}`);
    }
    const archiveResponse = await page.reload();
    expect(archiveResponse?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(locale === 'en' ? 'Archive' : 'Arquivo');
    await expectNoHorizontalScroll(page);
  });
}

for (const width of [360, 1280]) {
  test(`${width}px: trocar o idioma pelo teclado preserva a página`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await openPage(page, 'pt-BR');
    if (width < 997) {
      const toggle = page.locator('.navbar__toggle');
      await toggle.focus();
      await page.keyboard.press('Enter');
      await expect(toggle).toHaveAttribute('aria-expanded', 'true');
      const languages = page.locator('.navbar-sidebar [role="button"].menu__link--sublist');
      await languages.focus();
      await page.keyboard.press('Enter');
      const english = page.locator('.navbar-sidebar a[lang="en"]');
      await expect(english).toBeVisible();
      await english.focus();
      await page.keyboard.press('Enter');
    } else {
      const languages = page.locator('.navbar__inner .dropdown [aria-haspopup="true"]');
      await languages.focus();
      await page.keyboard.press('Enter');
      await expect(languages).toHaveAttribute('aria-expanded', 'true');
      const english = page.locator('.navbar__inner .dropdown__menu a[lang="en"]');
      await expect(english).toBeVisible();
      await english.focus();
      await page.keyboard.press('Enter');
    }
    await expect.poll(() => new URL(page.url()).pathname).toBe(paths('en'));
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('main h1')).toHaveText(heading('en'));
    await page.reload();
    await expect(page.locator('main h1')).toHaveText(heading('en'));
    await expectNoHorizontalScroll(page);
  });
}

for (const locale of LOCALES) {
  const playName = locale === 'en' ? 'Play demo' : 'Reproduzir demonstração';
  const pauseName = locale === 'en' ? 'Pause demo' : 'Pausar demonstração';

  test(`${locale}: movimento reduzido mantém o pôster até reproduzir pelo teclado`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await openPage(page, locale);
    const primary = page.locator('.pt-hero .pt-button-primary');
    await primary.hover();
    await expect(primary).toHaveCSS('transform', 'none');
    const video = page.locator('.pt-product video');
    const toggle = page.locator('.pt-demo-toggle');
    await video.scrollIntoViewIfNeeded();
    await expect(toggle).toHaveAccessibleName(playName);
    await expect(video).toHaveJSProperty('paused', true);
    await expect(video).toHaveJSProperty('currentTime', 0);
    await expect(page.locator('.pt-reveal.is-pending')).toHaveCount(0);
    const sections = page.locator('.pt-reveal');
    expect(await sections.count()).toBeGreaterThan(0);
    for (const section of await sections.all()) {
      await expect(section).toHaveCSS('opacity', '1');
    }
    await toggle.focus();
    await page.keyboard.press('Enter');
    await expect(toggle).toHaveAccessibleName(pauseName);
    await expect(video).toHaveJSProperty('paused', false);
    await expect.poll(() => video.evaluate((element: HTMLVideoElement) => ({
      width: element.videoWidth,
      height: element.videoHeight,
      duration: Number.isFinite(element.duration) && element.duration > 0,
      frames: element.getVideoPlaybackQuality().totalVideoFrames > 1,
    }))).toEqual({ width: 1280, height: 800, duration: true, frames: true });
    const start = await video.evaluate((element: HTMLVideoElement) => element.currentTime);
    await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.currentTime)).toBeGreaterThan(start + 0.15);
    // O arquivo deve permitir navegação temporal real, além de reproduzir quadros.
    const seekTo = await video.evaluate((element: HTMLVideoElement) => element.duration / 2);
    expect(seekTo).toBeGreaterThan(0);
    const afterSeek = await video.evaluate(async (element: HTMLVideoElement, target: number) => {
      await new Promise<void>((resolve) => {
        element.addEventListener('seeked', () => resolve(), {once: true});
        element.currentTime = target;
      });
      return element.currentTime;
    }, seekTo);
    expect(afterSeek).toBeGreaterThan(0);
    expect(Math.abs(afterSeek - seekTo)).toBeLessThanOrEqual(0.2);
    await toggle.focus();
    await page.keyboard.press('Enter');
    await expect(video).toHaveJSProperty('paused', true);
    await expect(toggle).toHaveAccessibleName(playName);
  });

  test(`${locale}: autoplay pausa fora da tela e respeita a pausa escolhida`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await openPage(page, locale);
    const video = page.locator('.pt-product video');
    const toggle = page.locator('.pt-demo-toggle');
    await video.scrollIntoViewIfNeeded();
    await expect(video).toHaveJSProperty('paused', false);
    await expect(toggle).toHaveAccessibleName(pauseName);
    await page.locator('footer').scrollIntoViewIfNeeded();
    await expect(video).toHaveJSProperty('paused', true);
    await video.scrollIntoViewIfNeeded();
    await expect(video).toHaveJSProperty('paused', false);
    await toggle.click();
    await expect(toggle).toHaveAccessibleName(playName);
    await expect(video).toHaveJSProperty('paused', true);
    await page.locator('footer').scrollIntoViewIfNeeded();
    await video.scrollIntoViewIfNeeded();
    await expect(toggle).toHaveAccessibleName(playName);
    await expect(video).toHaveJSProperty('paused', true);
  });

  test(`${locale}: falha no vídeo mantém a imagem de demonstração acessível`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.route('**/media/demo/**/*.webm', (route) => route.abort('failed'));
    await openPage(page, locale);
    // A moldura permanece montada quando um erro troca o vídeo pelo pôster.
    await page.locator('.pt-product').scrollIntoViewIfNeeded();
    const poster = page.locator('.pt-product img.pt-demo-poster');
    await expect(poster).toBeVisible();
    await expect(poster).toHaveAttribute('src', paths(locale, 'img/demo/en/poster.png'));
    await expect(poster).toHaveAttribute('alt', /\S/);
    await expect.poll(() => poster.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
    await expectNoHorizontalScroll(page);
  });
}

for (const locale of LOCALES) {
  test(`${locale}: opções de apresentação trocam imagens e texto alternativo pelo teclado`, async ({ page }) => {
    await openPage(page, locale);
    const showcases = page.locator('.pt-overview .pt-showcase');
    await expect(showcases).toHaveCount(3);
    const views = [
      {first: locale === 'en' ? 'Grid' : 'Grade', second: 'Kanban', firstFile: 'library-grid.png', secondFile: 'library-kanban.png'},
      {first: locale === 'en' ? 'Achievements' : 'Conquistas', second: locale === 'en' ? 'Statistics' : 'Estatísticas', firstFile: 'achievements.png', secondFile: 'statistics.png'},
    ];
    for (const [index, view] of views.entries()) {
      const section = showcases.nth(index);
      const group = section.getByRole('group');
      await expect(group).toHaveAccessibleName(/\S/);
      const first = group.getByRole('button', {name: view.first, exact: true});
      const second = group.getByRole('button', {name: view.second, exact: true});
      const image = section.locator('img');
      await expect(first).toHaveAttribute('aria-pressed', 'true');
      await expect(second).toHaveAttribute('aria-pressed', 'false');
      await expect(image).toHaveAttribute('src', paths(locale, `img/demo/${locale}/${view.firstFile}`));
      const originalAlt = await image.getAttribute('alt');
      await second.focus();
      await page.keyboard.press('Enter');
      await expect(second).toHaveAttribute('aria-pressed', 'true');
      await expect(first).toHaveAttribute('aria-pressed', 'false');
      await expect(image).toHaveAttribute('src', paths(locale, `img/demo/${locale}/${view.secondFile}`));
      await expect(image).toHaveAttribute('alt', /\S/);
      expect(await image.getAttribute('alt')).not.toBe(originalAlt);
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
      await first.focus();
      await page.keyboard.press('Enter');
      await expect(first).toHaveAttribute('aria-pressed', 'true');
      await expect(image).toHaveAttribute('src', paths(locale, `img/demo/${locale}/${view.firstFile}`));
    }
    await expectNoHorizontalScroll(page);
  });
}

for (const locale of LOCALES) {
  test(`${locale}: a tela cheia mostra os quatro temas e as novidades da versão têm três destaques`, async ({ page }) => {
    await openPage(page, locale);
    const feature = page.locator('.pt-overview .pt-showcase').nth(2);
    const group = feature.getByRole('group', {name: locale === 'en' ? 'Fullscreen themes' : 'Temas da tela cheia'});
    const buttons = group.getByRole('button');
    await expect(buttons).toHaveText(locale === 'en' ? ['Playtrove', 'Horizon', 'Mosaic', 'Panel'] : ['Playtrove', 'Horizonte', 'Mosaico', 'Painel']);
    const image = feature.locator('img');
    for (const [index, file] of ['fullscreen-library', 'fullscreen-horizonte', 'fullscreen-mosaico', 'fullscreen-painel'].entries()) {
      await buttons.nth(index).focus();
      await page.keyboard.press('Enter');
      await expect(buttons.nth(index)).toHaveAttribute('aria-pressed', 'true');
      await expect(image).toHaveAttribute('src', paths(locale, `img/highlights/${locale}/${file}.webp`));
      await expect(image).toHaveAttribute('alt', /\S/);
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
    }
    const section = page.locator('.pt-news .pt-highlights');
    await expect(section.getByRole('heading', {level: 3, name: locale === 'en' ? 'New in 1.0.0' : 'Novidades da 1.0.0'})).toBeVisible();
    const cards = section.locator('.pt-highlight-card');
    await expect(cards).toHaveCount(3);
    for (const card of await cards.all()) {
      await expect(card.getByRole('heading', {level: 4})).toHaveText(/\S/);
      const picture = card.locator('img');
      await expect(picture).toHaveAttribute('alt', /\S/);
      await picture.scrollIntoViewIfNeeded();
      await expect.poll(() => picture.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
    }
    await expectNoHorizontalScroll(page);
  });
}

test('a demonstração pausa com a página oculta sem perder a intenção do visitante', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await openPage(page, 'pt-BR');
  const video = page.locator('.pt-product video');
  const toggle = page.locator('.pt-demo-toggle');
  await video.scrollIntoViewIfNeeded();
  await expect(video).toHaveJSProperty('paused', false);
  const setHidden = async (hidden: boolean) => page.evaluate((value) => {
    Object.defineProperty(document, 'hidden', {configurable: true, get: () => value});
    document.dispatchEvent(new Event('visibilitychange'));
  }, hidden);
  await setHidden(true);
  await expect(video).toHaveJSProperty('paused', true);
  await setHidden(false);
  await expect(video).toHaveJSProperty('paused', false);
  await toggle.click();
  await expect(video).toHaveJSProperty('paused', true);
  await setHidden(true);
  await setHidden(false);
  await expect(video).toHaveJSProperty('paused', true);
  await expect(toggle).toHaveAccessibleName('Reproduzir demonstração');
});

test('pausar e retomar durante o início da reprodução respeita a última escolha', async ({ page }) => {
  // Simula uma confirmação de reprodução lenta sem substituir a mídia real.
  await page.addInitScript(() => {
    const play = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      return play.call(this).then(() => new Promise<void>((resolve) => setTimeout(resolve, 1200)));
    };
  });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await openPage(page, 'pt-BR');
  const video = page.locator('.pt-product video');
  const toggle = page.locator('.pt-demo-toggle');
  await video.scrollIntoViewIfNeeded();
  await expect(toggle).toHaveAccessibleName('Pausar demonstração');
  await toggle.click();
  await expect(toggle).toHaveAccessibleName('Reproduzir demonstração');
  await toggle.click();
  await expect(video).toHaveJSProperty('paused', false);
  await expect(toggle).toHaveAccessibleName('Pausar demonstração');
});

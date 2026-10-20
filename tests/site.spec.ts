import { expect, test, type Locator, type Page } from '@playwright/test';
import releaseData from '../src/data/releases.json';

// DOM, geometria e teclado somente. A configuração desliga capturas, vídeo e trace.
const ORIGIN = 'http://127.0.0.1:4173';
const BASE_PATH = '/Playtrove-site/';
const LATEST = releaseData.latest.version;
const VERSIONS = releaseData.releases.map((release) => release.version);
const LOCALES = ['pt-BR', 'en'] as const;
type Locale = typeof LOCALES[number];
const VIEWPORTS = [
  { width: 360, height: 800 },
  { width: 960, height: 600 },
  { width: 1280, height: 800 },
  { width: 1920, height: 1080 },
];
const DOCUMENTS = [
  { slug: 'installation', pt: 'Instalação', en: 'Installation' },
  { slug: 'getting-started', pt: 'Primeiros passos', en: 'Getting started' },
  { slug: 'emulators', pt: 'Emuladores e pastas de ROMs', en: 'Emulators and ROM folders' },
  { slug: 'library', pt: 'Organizar a biblioteca', en: 'Organize your library' },
  { slug: 'metadata', pt: 'Metadados e imagens', en: 'Metadata and images' },
  { slug: 'achievements', pt: 'Conquistas e troféus', en: 'Achievements and trophies' },
  { slug: 'statistics', pt: 'Tempo jogado e estatísticas', en: 'Playtime and statistics' },
  { slug: 'data-updates', pt: 'Dados, privacidade e atualizações', en: 'Data, privacy and updates' },
  { slug: 'troubleshooting', pt: 'Solução de problemas', en: 'Troubleshooting' },
  { slug: 'contributing', pt: 'Contribuir com o projeto', en: 'Contribute to the project' },
  { slug: 'architecture', pt: 'Arquitetura do aplicativo', en: 'Application architecture' },
];

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
    await expect(page.locator('.pt-release-row')).toHaveCount(Math.min(3, VERSIONS.length));
    await expect(page.locator('.pt-release-version')).toHaveText(VERSIONS.slice(0, 3));
    await expect(page.locator('.pt-release-copy p')).toHaveText(releaseData.releases.slice(0, 3).map((release) => release.summary[locale]));
    for (const [index, release] of releaseData.releases.slice(0, 3).entries()) {
      await expectPublishedDate(page.locator('.pt-release-meta time').nth(index), release.publishedAt, locale);
    }
    const image = page.locator('.pt-product img');
    await expect(image).toHaveAttribute('src', paths(locale, `img/screenshots/${locale}/library-details.png`));
    await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
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
      const image = page.locator('.pt-product img');
      const geometry = await image.evaluate((element: HTMLImageElement) => ({
        width: element.getBoundingClientRect().width,
        height: element.getBoundingClientRect().height,
        ratio: element.naturalWidth / element.naturalHeight,
      }));
      expect(geometry.width).toBeGreaterThan(0);
      expect(Math.abs(geometry.height - geometry.width / geometry.ratio)).toBeLessThanOrEqual(1);
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

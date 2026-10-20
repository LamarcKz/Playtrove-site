/**
 * Produz imagens localizadas e uma apresentação sempre em inglês, sem ponteiro.
 * Uso: node scripts/capture-demo.mjs --app-dir <checkout-do-aplicativo>
 * Requer o build do app e: npx playwright install ffmpeg
 * Não é executado no build, nos testes ou no CI.
 */
import { createRequire } from 'node:module';
import { readFile, writeFile, mkdir, mkdtemp, rm, stat, copyFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve, relative, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const siteRequire = createRequire(join(SITE, 'package.json'));
const { _electron: electron, expect } = siteRequire('@playwright/test');
const args = process.argv.slice(2);
const valueOf = (name) => {
  const index = args.indexOf(name);
  return index < 0 ? null : args[index + 1];
};
const appArgument = valueOf('--app-dir');
if (!appArgument) throw new Error('Informe --app-dir <checkout-do-aplicativo>.');
const APP = resolve(appArgument);
const appPackage = JSON.parse(await readFile(join(APP, 'package.json'), 'utf8'));
if (appPackage.name !== 'playtrove') throw new Error('--app-dir precisa apontar ao checkout do Playtrove.');
const version = appPackage.version;
if (!/^\d+\.\d+\.\d+$/.test(version)) throw new Error('Versão estável inválida.');
await stat(join(APP, 'out', 'main', 'index.js'));
const appRequire = createRequire(join(APP, 'package.json'));
const Database = appRequire('better-sqlite3');
const ts = siteRequire('typescript');
const WIDTH = 1280;
const HEIGHT = 800;
const FPS = 30;
const MAX_VIDEO_BYTES = 8 * 1024 * 1024;
const DAY = 86400000;
const now = new Date();
const at = (daysAgo, hour = 18) => {
  const date = new Date(now.getTime() - daysAgo * DAY);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
};
const LOCALES = {
  'pt-BR': {
    library: 'Biblioteca', grid: 'Grade', details: 'Detalhes', list: 'Lista',
    kanban: 'Kanban', achievements: 'Conquistas', stats: 'Estatísticas',
    filters: 'Filtros', search: 'Buscar jogos',
    description: 'Biblioteca de demonstração: dados ilustrativos para apresentar o Playtrove.',
    review: 'Uma aventura para revisitar. Biblioteca e progresso desta demonstração são fictícios.',
    achievementTitles: ['Primeiros passos', 'Uma nova aventura', 'Explorador', 'Sem perder o ritmo', 'Desafio concluído', 'Coleção completa'],
  },
  en: {
    library: 'Library', grid: 'Grid', details: 'Details', list: 'List',
    kanban: 'Kanban', achievements: 'Achievements', stats: 'Statistics',
    filters: 'Filters', search: 'Search games',
    description: 'Demonstration library: illustrative data used to present Playtrove.',
    review: 'An adventure worth revisiting. This demonstration library and its progress are fictional.',
    achievementTitles: ['First steps', 'A new adventure', 'Explorer', 'Keep it going', 'Challenge complete', 'Complete collection'],
  },
};
const GAMES = [
  ['Advance Wars', 'Nintendo - Game Boy Advance', 'Advance Wars (USA)', 'Game Boy Advance', 'RetroArch', 360, 7],
  ['Burnout 3 - Takedown', 'Sony - PlayStation 2', 'Burnout 3 - Takedown (USA)', 'PlayStation 2', 'PCSX2', 435, 4],
  ['Castlevania - Aria of Sorrow', 'Nintendo - Game Boy Advance', 'Castlevania - Aria of Sorrow (USA)', 'Game Boy Advance', 'RetroArch', 1170, 9],
  ['Castlevania - Symphony of the Night', 'Sony - PlayStation', 'Castlevania - Symphony of the Night (USA)', 'PlayStation', 'DuckStation', 980, 7],
  ['Chrono Trigger', 'Nintendo - Super Nintendo Entertainment System', 'Chrono Trigger (USA)', 'Super Nintendo', 'RetroArch', 2580, 1],
  ['Crash Bandicoot', 'Sony - PlayStation', 'Crash Bandicoot (USA)', 'PlayStation', 'DuckStation', 465, 4],
  ['New Super Mario Bros.', 'Nintendo - Nintendo DS', 'New Super Mario Bros. (USA)', 'Nintendo DS', 'RetroArch', 735, 7],
  ['Pokémon Emerald', 'Nintendo - Game Boy Advance', 'Pokemon - Emerald Version (USA, Europe)', 'Game Boy Advance', 'RetroArch', 3960, 5],
  ['Pokémon Platinum', 'Nintendo - Nintendo DS', 'Pokemon - Platinum Version (USA)', 'Nintendo DS', 'RetroArch', 0, 1],
  ['Shadow of the Colossus', 'Sony - PlayStation 2', 'Shadow of the Colossus (USA)', 'PlayStation 2', 'PCSX2', 610, 2],
  ['Tekken 3', 'Sony - PlayStation', 'Tekken 3 (USA)', 'PlayStation', 'DuckStation', 1335, 7],
  ['Tekken 5', 'Sony - PlayStation 2', 'Tekken 5 (USA)', 'PlayStation 2', 'PCSX2', 1980, 6],
];

// Somente estes dois módulos puros são carregados. Importações arbitrárias são recusadas.
function loadMigrationModule(name) {
  if (!['migrations', 'settings'].includes(name)) throw new Error('Módulo de migração não permitido.');
  const source = readFileSync(join(APP, 'src', 'main', name + '.ts'), 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const module = { exports: {} };
  const safeRequire = (specifier) => {
    if (name === 'migrations' && specifier === './settings') return loadMigrationModule('settings');
    throw new Error('Importação inesperada na ferramenta de mídia: ' + specifier);
  };
  new Function('require', 'module', 'exports', compiled)(safeRequire, module, module.exports);
  return module.exports;
}

async function fetchPublicImage(system, category, name) {
  const url = 'https://thumbnails.libretro.com/' + encodeURIComponent(system) + '/' + category + '/' + encodeURIComponent(name) + '.png';
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error('Imagem pública indisponível: ' + category + '/' + name + ' (' + response.status + ').');
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.length < 100 || bytes.length > 8 * 1024 * 1024) throw new Error('Tamanho de imagem inválido.');
  return bytes;
}

async function prepareAssets(root) {
  const assets = [];
  for (let index = 0; index < GAMES.length; index++) {
    const [, system, name] = GAMES[index];
    const folder = join(root, 'images', String(index + 1));
    await mkdir(folder, { recursive: true });
    const cover = await fetchPublicImage(system, 'Named_Boxarts', name);
    await writeFile(join(folder, 'cover.png'), cover);
    // A arte de fundo é uma captura pública do próprio jogo, nunca da biblioteca do usuário.
    const background = await fetchPublicImage(system, 'Named_Snaps', name);
    await writeFile(join(folder, 'background.png'), background);
    assets.push(folder);
  }
  return assets;
}

function seedDatabase(dataDir, locale) {
  const db = new Database(join(dataDir, 'playtrove.db'));
  try {
    loadMigrationModule('migrations').runMigrations(db);
    const words = LOCALES[locale];
    const set = db.prepare('INSERT OR REPLACE INTO settings (key,value) VALUES (?,?)');
    set.run('language', locale === 'en' ? 'en' : 'pt-BR');
    // Nome fictício, sem API key: nenhuma requisição de conta é possível.
    set.run('raUsername', 'DemoPlayer');
    set.run('raLastSyncAt', now.toISOString());
    const insert = db.prepare('INSERT INTO games (id,title,status_id,favorite,playtime_seconds,last_played_at,added_at,platform,library,description,genres,developer,publisher,release_date,cover_image,background_image,metadata_updated_at,rating,difficulty,review,ra_game_id,ra_matched_at) VALUES (@id,@title,@statusId,@favorite,@seconds,@lastPlayed,@addedAt,@platform,@library,@description,@genres,@developer,@publisher,@releaseDate,@cover,@background,@metadataAt,@rating,@difficulty,@review,@raId,@metadataAt)');
    const gameProgress = db.prepare('INSERT INTO ra_games (id,title,num_distinct_players,synced_at) VALUES (?,?,?,?)');
    const achievement = db.prepare('INSERT INTO achievements (id,ra_game_id,title,description,points,display_order,num_awarded,earned_at) VALUES (?,?,?,?,?,?,?,?)');
    const session = db.prepare('INSERT INTO play_sessions (game_id,started_at,ended_at,seconds,source) VALUES (?,?,?,?,?)');
    db.transaction(() => {
      GAMES.forEach(([title, , , platform, library, minutes, statusId], index) => {
        const id = index + 1;
        const raId = 90000 + id;
        insert.run({
          id, title, statusId, favorite: [2, 5, 8, 12].includes(id) ? 1 : 0,
          seconds: minutes * 60, lastPlayed: minutes ? at(index % 13) : null,
          addedAt: at(80 + index), platform, library, description: words.description,
          genres: JSON.stringify(index % 3 === 0 ? ['Adventure'] : index % 3 === 1 ? ['Racing'] : ['Platform']),
          developer: null, publisher: null, releaseDate: null, cover: 'cover.png',
          background: 'background.png', metadataAt: now.toISOString(),
          rating: minutes ? 8 + (index % 3) : null, difficulty: minutes ? 3 + (index % 5) : null,
          review: id === 2 ? words.review : null, raId,
        });
        gameProgress.run(raId, title, 2500 + index * 90, now.toISOString());
        const earnedCount = statusId === 9 ? 6 : Math.max(1, (index * 3 + 2) % 6);
        for (let n = 0; n < 6; n++) {
          const earnedAt = n < earnedCount ? at((index * 2 + n * 3) % 29, 15 + n % 4) : null;
          achievement.run(id * 100 + n, raId, words.achievementTitles[n], words.description, [5, 5, 10, 10, 25, 25][n], n, 1500 - n * 180, earnedAt);
        }
        for (let n = 0; n < 5 && minutes > 0; n++) {
          const ended = new Date(at((index * 3 + n * 5) % 30, 16 + n));
          const seconds = (25 + (index * 7 + n * 9) % 85) * 60;
          session.run(id, new Date(ended.getTime() - seconds * 1000).toISOString(), ended.toISOString(), seconds, 'app');
        }
      });
    })();
  } finally {
    db.close();
  }
}

async function waitForImages(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map((image) => image.complete ? undefined : new Promise((done) => {
      image.addEventListener('load', done, { once: true });
      image.addEventListener('error', done, { once: true });
    })));
  });
}

const recordedDurations = {};
const selectedLocale = valueOf('--locale');
const videoOnly = args.includes('--video-only');
if (selectedLocale && !LOCALES[selectedLocale]) throw new Error('--locale precisa ser pt-BR ou en.');
if (videoOnly && selectedLocale === 'pt-BR') throw new Error('O vídeo é sempre em inglês. Use --video-only sem pt-BR.');
const locales = videoOnly ? ['en'] : selectedLocale ? [selectedLocale] : Object.keys(LOCALES);
const manifestPath = join(SITE, 'src', 'data', 'demo.json');
let previousManifest = null;
try {
  previousManifest = JSON.parse(await readFile(manifestPath, 'utf8'));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
if (!locales.includes('en') && !previousManifest) throw new Error('Gere a apresentação em inglês antes de atualizar somente as imagens em português.');
const workspace = await mkdtemp(join(tmpdir(), 'playtrove-site-demo-'));
let activeApp;
try {
  console.log('Baixando somente imagens públicas para a biblioteca de demonstração.');
  const assetRoot = join(workspace, 'assets');
  await prepareAssets(assetRoot);
  for (const locale of locales) {
    const words = LOCALES[locale];
    const dataDir = join(workspace, locale);
    await mkdir(dataDir, { recursive: true });
    seedDatabase(dataDir, locale);
    for (let id = 1; id <= GAMES.length; id++) {
      const target = join(dataDir, 'images', String(id));
      await mkdir(target, { recursive: true });
      for (const file of ['cover.png', 'background.png']) await copyFile(join(assetRoot, 'images', String(id), file), join(target, file));
    }
    const imageDir = join(SITE, 'static', 'img', 'demo', locale);
    const mediaDir = join(SITE, 'static', 'media', 'demo', locale);
    await mkdir(imageDir, { recursive: true });
    await mkdir(mediaDir, { recursive: true });
    console.log('Abrindo a instância temporária de demonstração (' + locale + ').');
    activeApp = await electron.launch({
      executablePath: appRequire('electron'), args: [APP], cwd: APP,
      env: {
        ...process.env,
        PLAYTROVE_DATA_DIR: dataDir, PLAYTROVE_SAMPLE_GAMES: '0',
        PLAYTROVE_SKIP_EMULATOR_DETECTION: '1', PLAYTROVE_SYSTEM_LANGUAGE: locale === 'en' ? 'en-US' : 'pt-BR',
        PLAYTROVE_HIDE_DEV_MARK: '1',
        // Não herdar endpoints, atualização falsa nem endereço do Vite da sessão do mantenedor.
        PLAYTROVE_METADATA_TEST_SERVER: '', PLAYTROVE_FAKE_UPDATE: '', ELECTRON_RENDERER_URL: '',
      },
    });
    const page = await activeApp.firstWindow();
    await page.locator('nav button').first().waitFor();
    await expect.poll(() => activeApp.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0]?.isVisible() ?? false)).toBe(true);
    await activeApp.evaluate(({ BrowserWindow }) => {
      const window = BrowserWindow.getAllWindows()[0];
      window.unmaximize();
      window.setContentSize(1280, 800);
      window.setPosition(80, 40);
    });
    await waitForImages(page);
    await expect.poll(() => page.evaluate(() => [innerWidth, innerHeight])).toEqual([WIDTH, HEIGHT]);
    await expect(page.locator('main button[aria-pressed]')).toHaveCount(GAMES.length);
    const navigate = (name) => page.locator('nav').getByRole('button', { name, exact: true }).click();
    const mode = (name) => page.getByRole('radio', { name, exact: true }).click();
    const shot = async (name) => {
      await waitForImages(page);
      await expect.poll(() => page.evaluate(() => [innerWidth, innerHeight])).toEqual([WIDTH, HEIGHT]);
      await page.mouse.move(1240, 775);
      await page.screenshot({ path: join(imageDir, name + '.png'), animations: 'disabled' });
    };
    // Imagens localizadas continuam disponíveis para manutenção; --video-only as preserva.
    await page.locator('main button[aria-pressed]').filter({ hasText: 'Burnout 3 - Takedown' }).click();
    await mode(words.grid);
    await waitForImages(page);
    if (!videoOnly) await shot('library-grid');
    await mode(words.kanban);
    await expect(page.locator('main section[aria-label]')).toHaveCount(9);
    if (!videoOnly) await shot('library-kanban');
    await navigate(words.achievements);
    await expect(page.locator('main dl').first()).toBeVisible();
    if (!videoOnly) await shot('achievements');
    await navigate(words.stats);
    await expect(page.locator('main dl').first()).toBeVisible();
    if (!videoOnly) await shot('statistics');
    if (locale !== 'en') {
      await activeApp.close();
      activeApp = null;
      continue;
    }
    // O vídeo e o poster de apresentação são sempre em inglês, em ambos os idiomas do site.
    await navigate(words.library);
    await mode(words.details);
    await page.locator('main button[aria-pressed]').filter({ hasText: 'Burnout 3 - Takedown' }).click();
    await waitForImages(page);
    await expect(page.locator('main').getByRole('heading', { name: /Burnout 3 - Takedown/ })).toBeVisible();
    await mode(words.grid);
    await waitForImages(page);
    await page.screencast.hideActions();
    await page.screencast.hideOverlays();
    await shot('poster');

    const videoPath = join(mediaDir, 'playtrove-' + version + '.webm');
    const candidatePath = join(workspace, locale + '.webm');
    const pause = (milliseconds) => page.waitForTimeout(milliseconds);
    const sourceFrames = [];
    await page.screencast.start({
      path: candidatePath, size: { width: WIDTH, height: HEIGHT }, quality: 90, fps: FPS,
      onFrame: ({ timestamp }) => { sourceFrames.push(timestamp); },
    });
    const started = Date.now();
    // Pausas relativas preservam a leitura sem depender de um cursor ou recuperar atrasos.
    await pause(1200);
    await mode(words.details);
    await pause(3000);
    await page.locator('header').getByRole('button', { name: words.filters, exact: true }).click();
    await pause(2000);
    await page.locator('header').getByRole('button', { name: words.filters, exact: true }).click();
    await pause(1200);
    await mode(words.grid);
    await pause(1800);
    const search = page.getByRole('searchbox');
    await search.click();
    await pause(800);
    await search.pressSequentially('Tekken', { delay: 190 });
    await pause(2000);
    for (let character = 0; character < 6; character++) {
      await search.press('Backspace');
      await pause(120);
    }
    await pause(1300);
    await mode(words.kanban);
    await pause(3000);
    // A volta à Grade é uma ação legível própria; Biblioteca já retorna assim no fim.
    await mode(words.grid);
    await pause(1500);
    await navigate(words.achievements);
    await pause(3000);
    await navigate(words.stats);
    await pause(3100);
    await navigate(words.library);
    await pause(2000);
    const elapsedSeconds = (Date.now() - started) / 1000;
    await page.screencast.stop();
    await page.screencast.hideActions();
    await activeApp.close();
    activeApp = null;
    const video = await stat(candidatePath);
    if (video.size > MAX_VIDEO_BYTES) throw new Error('O vídeo excedeu o limite de 8 MiB: ' + locale);
    if (elapsedSeconds > 35) throw new Error('A gravação excedeu o limite de 35 s: ' + locale);
    await copyFile(candidatePath, videoPath);
    const intervals = sourceFrames.slice(1).map((timestamp, index) => (timestamp - sourceFrames[index])).filter((interval) => interval > 0 && interval < 100).sort((a, b) => a - b);
    console.log('Mídia finalizada: ' + locale + ' (' + (video.size / 1048576).toFixed(2) + ' MiB; ' + elapsedSeconds.toFixed(2) + ' s; ' + FPS + ' fps).');
    console.log('Quadros originais: ' + sourceFrames.length + '; mediana dos intervalos ativos: ' + (intervals[Math.floor(intervals.length / 2)] ?? 0).toFixed(2) + ' ms.');
    recordedDurations[locale] = Number(elapsedSeconds.toFixed(2));

  }
  // Uma atualização só de imagens não muda a versão nem os caminhos da mídia já gravada.
  const presentation = recordedDurations.en === undefined ? {
    version: previousManifest.version,
    width: previousManifest.width,
    height: previousManifest.height,
    fps: previousManifest.fps,
    durationSeconds: previousManifest.durationSeconds,
    video: previousManifest.locales.en.video,
    poster: previousManifest.locales.en.poster,
  } : {
    version, width: WIDTH, height: HEIGHT, fps: FPS,
    durationSeconds: Math.round(recordedDurations.en),
    video: '/media/demo/en/playtrove-' + version + '.webm',
    poster: '/img/demo/en/poster.png',
  };
  const manifest = {
    version: presentation.version,
    width: presentation.width,
    height: presentation.height,
    fps: presentation.fps,
    durationSeconds: presentation.durationSeconds,
    locales: Object.fromEntries(Object.keys(LOCALES).map((locale) => [locale, {
      video: presentation.video,
      poster: presentation.poster,
      images: Object.fromEntries(['library-grid', 'library-kanban', 'achievements', 'statistics'].map((name) => [name, '/img/demo/' + locale + '/' + name + '.png'])),
    }])),
  };
  await mkdir(dirname(manifestPath), { recursive: true });
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  await rm(join(SITE, 'static', 'media', 'demo', 'pt-BR', 'playtrove-' + version + '.webm'), { force: true });
  await rm(join(SITE, 'static', 'img', 'demo', 'pt-BR', 'poster.png'), { force: true });
} finally {
  if (activeApp) await activeApp.close().catch(() => {});
  // A pasta foi criada nesta execução e deve continuar dentro do temporário do sistema.
  const child = relative(resolve(tmpdir()), resolve(workspace));
  if (!child || child.startsWith('..') || isAbsolute(child) || !workspace.includes('playtrove-site-demo-')) {
    throw new Error('Recusa de limpeza fora da pasta temporária de demonstração.');
  }
  await rm(workspace, { recursive: true, force: true });
}

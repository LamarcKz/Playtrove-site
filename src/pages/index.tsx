import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import releaseData from '../data/releases.json';
import DemoVideo from '../components/DemoVideo';
import FeatureShowcase from '../components/FeatureShowcase';
import Reveal from '../components/Reveal';
import demo from '../data/demo.json';

type Locale = 'pt-BR' | 'en';

type Release = {
  version: string;
  tagName: string;
  publishedAt: string;
  htmlUrl: string;
  downloads: { installer: string; portable: string };
  summary: Record<Locale, string>;
  bodyHtml: Record<Locale, string>;
};

type ReleaseData = {
  latest: Release;
  releases: Release[];
  docsVersion: string;
};

const releases = releaseData as ReleaseData;

const content = {
  'pt-BR': {
    pageTitle: 'Sua biblioteca de jogos, organizada',
    description: 'Uma biblioteca para seus jogos de emulador no Windows. Organize a coleção, acompanhe suas conquistas e volte à próxima aventura com o Playtrove.',
    heading: 'Seus jogos, bem organizados.',
    lead: 'Uma biblioteca para seus jogos de emulador no Windows. Organize a coleção, acompanhe suas conquistas e volte à próxima aventura.',
    installer: 'Baixar para Windows',
    portable: 'Versão portátil',
    guide: 'Ler o guia',
    requirements: 'Windows 10 e 11 · 64 bits',
    releaseNotes: 'O que mudou nesta versão',
    demoLabel: 'Demonstração do aplicativo Playtrove com uma biblioteca de exemplo.',
    demoCaption: 'Demonstração do Playtrove',
    demoLibrary: 'Biblioteca de exemplo',
    playDemo: 'Reproduzir demonstração',
    pauseDemo: 'Pausar demonstração',
    demoFailure: 'O vídeo não pôde ser carregado. A imagem mostra a biblioteca de demonstração.',
    collectionViews: 'Modos da biblioteca',
    progressViews: 'Conquistas e estatísticas',
    grid: 'Grade',
    kanban: 'Kanban',
    achievements: 'Conquistas',
    statistics: 'Estatísticas',
    gridAlt: 'Biblioteca de demonstração no modo Grade, com capas inteiras e status de cada jogo.',
    kanbanAlt: 'Biblioteca de demonstração no modo Kanban, organizada em colunas por status.',
    achievementsAlt: 'Conquistas da biblioteca de demonstração, com troféus e progresso dos jogos.',
    statisticsAlt: 'Estatísticas da biblioteca de demonstração, com tempo jogado e atividade.',
    overviewTitle: 'Mais tempo jogando. Menos procurando.',
    overviewLead: 'Da próxima partida à última conquista, um lugar para acompanhar a sua coleção.',
    features: [
      {
        title: 'Uma coleção do seu jeito',
        description: 'Escolha entre Detalhes, Grade, Lista e Kanban. Use favoritos, filtros e status personalizáveis para encontrar o que quer jogar.',
      },
      {
        title: 'Seu progresso, à vista',
        description: 'Veja seu tempo jogado, avaliações e estatísticas. Acompanhe conquistas do RetroAchievements e troféus do RPCS3 na mesma biblioteca.',
      },
      {
        title: 'Seus dados ficam com você',
        description: 'A biblioteca, as notas e as análises ficam no seu computador. Não é preciso criar uma conta do Playtrove para organizar seus jogos.',
      },
    ],
    emulatorsTitle: 'Os emuladores que você já usa.',
    emulatorsLead: 'Adicione suas pastas de ROMs, encontre seus jogos e abra a próxima partida pela biblioteca. O Playtrove usa os emuladores instalados no seu computador.',
    emulatorListLabel: 'Emuladores compatíveis',
    emulatorsNote: 'O Playtrove não inclui emuladores nem jogos.',
    emulatorGuide: 'Como começar',
    newsTitle: 'Novidades do Playtrove',
    newsLead: 'Acompanhe o que chegou em cada versão.',
    allNews: 'Ver todas as novidades',
    readRelease: 'Ler as novidades da versão',
    getStartedTitle: 'Pronto para organizar a próxima aventura?',
    getStartedLead: 'Escolha o instalador ou a versão portátil. O guia acompanha seus primeiros passos.',
    highlights: {
      title: 'Novidades da 1.0.0',
      lead: 'A tela cheia chegou, com quatro temas para jogar do sofá, e todas as capas ficaram iguais.',
      previous: 'Versões anteriores',
      notes: 'Ler as notas completas',
      themesTitle: 'Tela cheia para a TV',
      themesDescription: 'Navegue pela biblioteca com o DualSense, o teclado ou o mouse. Escolha entre quatro temas, cada um com a própria tela inicial, os próprios detalhes do jogo e os próprios sons.',
      themesLabel: 'Temas da tela cheia',
      themes: [
        {label: 'Playtrove', file: 'fullscreen-library', alt: 'Tema Playtrove da tela cheia, com o jogo em destaque e uma fileira de capas.'},
        {label: 'Horizonte', file: 'fullscreen-horizonte', alt: 'Tema Horizonte da tela cheia, com a fileira de jogos no topo, a arte enchendo a tela e cartões de troféus, tempo jogado e nota.'},
        {label: 'Mosaico', file: 'fullscreen-mosaico', alt: 'Tema Mosaico da tela cheia, com capas grandes e atalhos redondos em cinza-escuro e vermelho.'},
        {label: 'Painel', file: 'fullscreen-painel', alt: 'Tema Painel da tela cheia, com a arte no fundo e blocos de continuar jogando, coleções, conquistas e estatísticas.'},
      ],
      cards: [
        {file: 'fullscreen-horizonte', title: 'Tela cheia com quatro temas', description: 'Jogue do sofá com o DualSense, o teclado ou o mouse, nos temas Playtrove, Horizonte, Mosaico e Painel.', alt: 'Tema Horizonte da tela cheia, com a fileira de jogos no topo e a arte enchendo a tela.'},
        {file: 'library-grid', title: 'Capas iguais em todo lugar', description: 'Todas as capas ficam no mesmo quadro em pé, como no Playnite, e vêm primeiro do SteamGridDB.', alt: 'Biblioteca no modo Grade, com todas as capas no mesmo quadro em pé.'},
        {file: 'library-details', title: 'Música tema e trailers', description: 'Cada jogo pode ter a própria trilha, tocada sem internet, e um trailer sem som atrás dos detalhes.', alt: 'Detalhes de um jogo com a arte de fundo, a nota e as conquistas.'},
      ],
    },
  },
  en: {
    pageTitle: 'Your game library, organized',
    description: 'A home for your emulated games on Windows. Organize your collection, follow your achievements, and get back to your next adventure with Playtrove.',
    heading: 'Your games, well organized.',
    lead: 'A home for your emulated games on Windows. Organize your collection, follow your achievements, and get back to your next adventure.',
    installer: 'Download for Windows',
    portable: 'Portable version',
    guide: 'Read the guide',
    requirements: 'Windows 10 and 11 · 64-bit',
    releaseNotes: 'What changed in this version',
    demoLabel: 'Playtrove application demo with a sample library.',
    demoCaption: 'Playtrove demo',
    demoLibrary: 'Sample library',
    playDemo: 'Play demo',
    pauseDemo: 'Pause demo',
    demoFailure: 'The video could not load. The image shows the demo library.',
    collectionViews: 'Library views',
    progressViews: 'Achievements and statistics',
    grid: 'Grid',
    kanban: 'Kanban',
    achievements: 'Achievements',
    statistics: 'Statistics',
    gridAlt: 'Demo library in Grid view, with complete cover art and each game’s status.',
    kanbanAlt: 'Demo library in Kanban view, organized into status columns.',
    achievementsAlt: 'Demo library achievements, with trophies and game progress.',
    statisticsAlt: 'Demo library statistics, with playtime and activity.',
    overviewTitle: 'More time playing. Less time searching.',
    overviewLead: 'From your next session to your latest achievement, one place to follow your collection.',
    features: [
      {
        title: 'A collection your way',
        description: 'Choose Details, Grid, List, or Kanban. Use favorites, filters, and custom statuses to find what you want to play.',
      },
      {
        title: 'Your progress, in view',
        description: 'See your playtime, ratings, and statistics. Follow RetroAchievements achievements and RPCS3 trophies in the same library.',
      },
      {
        title: 'Your data stays with you',
        description: 'Your library, ratings, and reviews stay on your computer. There is no Playtrove account to create before organizing your games.',
      },
    ],
    emulatorsTitle: 'The emulators you already use.',
    emulatorsLead: 'Add your ROM folders, find your games, and launch your next session from the library. Playtrove uses the emulators installed on your computer.',
    emulatorListLabel: 'Supported emulators',
    emulatorsNote: 'Playtrove does not include emulators or games.',
    emulatorGuide: 'Get started',
    newsTitle: 'What’s new in Playtrove',
    newsLead: 'See what arrived in each release.',
    allNews: 'See all updates',
    readRelease: 'Read the release notes for version',
    getStartedTitle: 'Ready to organize your next adventure?',
    getStartedLead: 'Choose the installer or the portable version. The guide will walk you through your first steps.',
    highlights: {
      title: 'New in 1.0.0',
      lead: 'Fullscreen is here, with four themes for playing from the couch, and every cover now looks the same.',
      previous: 'Earlier versions',
      notes: 'Read the full release notes',
      themesTitle: 'Fullscreen for the TV',
      themesDescription: 'Browse your library with a DualSense, a keyboard or a mouse. Pick one of four themes, each with its own home screen, game details and sounds.',
      themesLabel: 'Fullscreen themes',
      themes: [
        {label: 'Playtrove', file: 'fullscreen-library', alt: 'Playtrove fullscreen theme, with the featured game and a row of covers.'},
        {label: 'Horizon', file: 'fullscreen-horizonte', alt: 'Horizon fullscreen theme, with a row of games on top, the art filling the screen and cards for trophies, playtime and rating.'},
        {label: 'Mosaic', file: 'fullscreen-mosaico', alt: 'Mosaic fullscreen theme, with big covers and round shortcuts in dark gray and red.'},
        {label: 'Panel', file: 'fullscreen-painel', alt: 'Panel fullscreen theme, with art in the background and tiles for continue playing, collections, achievements and statistics.'},
      ],
      cards: [
        {file: 'fullscreen-horizonte', title: 'Fullscreen with four themes', description: 'Play from the couch with a DualSense, a keyboard or a mouse, in the Playtrove, Horizon, Mosaic and Panel themes.', alt: 'Horizon fullscreen theme, with a row of games on top and the art filling the screen.'},
        {file: 'library-grid', title: 'Matching covers everywhere', description: 'Every cover uses the same upright frame, as in Playnite, and comes first from SteamGridDB.', alt: 'Library in Grid view, with every cover in the same upright frame.'},
        {file: 'library-details', title: 'Theme music and trailers', description: 'Each game can have its own soundtrack, played offline, and a silent trailer behind its details.', alt: 'Game details with background art, rating and achievements.'},
      ],
    },
  },
} as const;

const emulators = ['PCSX2', 'DuckStation', 'RetroArch', 'RPCS3', 'PPSSPP', 'Dolphin', 'Azahar'];

function Arrow({ download = false }: { download?: boolean }): ReactNode {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {download ? <><path d="M12 3v12m-5-5 5 5 5-5" /><path d="M5 16v4h14v-4" /></> : <path d="M5 12h14m-6-6 6 6-6 6" />}
    </svg>
  );
}

function DownloadActions({ locale }: { locale: Locale }): ReactNode {
  const copy = content[locale];
  const guideUrl = useBaseUrl('/docs/installation/');
  return (
    <div className="pt-actions">
      <a className="pt-button pt-button-primary" href={releases.latest.downloads.installer}>
        <Arrow download />{copy.installer}
      </a>
      <a className="pt-button pt-button-secondary" href={releases.latest.downloads.portable}>{copy.portable}</a>
      <Link className="pt-text-link" to={guideUrl}>{copy.guide}<Arrow /></Link>
    </div>
  );
}

/** As novidades da versão em destaque, escritas à mão a cada lançamento, com as capturas da biblioteca de demonstração. */
const HIGHLIGHTS_VERSION = '1.0.0';

/** A tela cheia com os quatro temas, como terceiro recurso da apresentação. */
function FullscreenFeature({ locale }: { locale: Locale }): ReactNode {
  const copy = content[locale].highlights;
  const base = useBaseUrl(`/img/highlights/${locale}/`);
  return (
    <FeatureShowcase id="fullscreen-heading" title={copy.themesTitle} description={copy.themesDescription}
      groupLabel={copy.themesLabel}
      views={copy.themes.map((theme) => ({label: theme.label, src: `${base}${theme.file}.webp`, alt: theme.alt}))} />
  );
}

/** O cartão da versão em destaque, com as novidades escritas à mão e as capturas da biblioteca de demonstração. */
function LatestRelease({ locale }: { locale: Locale }): ReactNode {
  const copy = content[locale].highlights;
  const base = useBaseUrl(`/img/highlights/${locale}/`);
  const notesUrl = useBaseUrl(`/blog/releases/${HIGHLIGHTS_VERSION}/`);
  // O link só aparece com a release publicada (nos testes, a fixture tem releases mais antigas).
  const published = releases.releases.some((release) => release.version === HIGHLIGHTS_VERSION);
  return (
    <article className="pt-highlights" aria-labelledby="highlights-heading">
      <div className="pt-highlights-head">
        <h3 id="highlights-heading">{copy.title}</h3>
        <p>{copy.lead}</p>
        {published && <Link className="pt-text-link" to={notesUrl}>{copy.notes}<Arrow /></Link>}
      </div>
      <div className="pt-highlight-cards">
        {copy.cards.map((card) => (
          <div className="pt-highlight-card" key={card.file}>
            <img src={`${base}${card.file}.webp`} width="1280" height="800" alt={card.alt} loading="lazy" decoding="async" />
            <h4>{card.title}</h4>
            <p>{card.description}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

function ReleaseRow({ release, locale }: { release: Release; locale: Locale }): ReactNode {
  const releaseUrl = useBaseUrl(`/blog/releases/${release.version}/`);
  const formattedDate = new Intl.DateTimeFormat(locale, {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  }).format(new Date(release.publishedAt));

  return (
    <li className="pt-release-row">
      <div className="pt-release-meta">
        <span className="pt-release-version">{release.version}</span>
        <time dateTime={release.publishedAt}>{formattedDate}</time>
      </div>
      <div className="pt-release-copy">
        <h3><Link to={releaseUrl}>Playtrove {release.version}<Arrow /></Link></h3>
        <p>{release.summary[locale]}</p>
      </div>
      <Link className="pt-release-open" to={releaseUrl} aria-label={`${content[locale].readRelease} ${release.version}`}><Arrow /></Link>
    </li>
  );
}

export default function Home(): ReactNode {
  const { i18n } = useDocusaurusContext();
  const locale: Locale = i18n.currentLocale === 'en' ? 'en' : 'pt-BR';
  const copy = content[locale];
  const media = useBaseUrl(demo.locales[locale].video);
  const poster = useBaseUrl(demo.locales[locale].poster);
  const grid = useBaseUrl(demo.locales[locale].images['library-grid']);
  const kanban = useBaseUrl(demo.locales[locale].images['library-kanban']);
  const achievements = useBaseUrl(demo.locales[locale].images.achievements);
  const statistics = useBaseUrl(demo.locales[locale].images.statistics);
  const [headingStart, headingEnd] = copy.heading.split(', ');
  const guideUrl = useBaseUrl('/docs/installation/');
  const newsUrl = useBaseUrl('/blog/');
  const latestUrl = useBaseUrl(`/blog/releases/${releases.latest.version}/`);

  return (
    <Layout title={copy.pageTitle} description={copy.description}>
      <main className="pt-home">
        <header className="pt-hero pt-container">
          <h1>{headingStart}, <span>{headingEnd}</span></h1>
          <p className="pt-hero-lead">{copy.lead}</p>
          <DownloadActions locale={locale} />
          <p className="pt-download-meta">
            <span>{copy.requirements}</span>
            <span aria-hidden="true">·</span>
            <Link to={latestUrl} title={copy.releaseNotes}>v{releases.latest.version}</Link>
          </p>
        </header>

        <DemoVideo key={media} src={media} poster={poster} label={copy.demoLabel}
          playLabel={copy.playDemo} pauseLabel={copy.pauseDemo} failureText={copy.demoFailure}
          caption={`${copy.demoCaption} ${demo.version} · ${copy.demoLibrary}`} />

        <section className="pt-overview" aria-labelledby="overview-heading">
          <Reveal className="pt-container pt-section-intro">
            <h2 id="overview-heading">{copy.overviewTitle}</h2>
            <p>{copy.overviewLead}</p>
          </Reveal>
          <FeatureShowcase id="collection-heading" title={copy.features[0].title}
            description={copy.features[0].description} groupLabel={copy.collectionViews}
            views={[
              {label: copy.grid, src: grid, alt: copy.gridAlt},
              {label: copy.kanban, src: kanban, alt: copy.kanbanAlt},
            ]} />
          <FeatureShowcase id="progress-heading" title={copy.features[1].title}
            description={copy.features[1].description} groupLabel={copy.progressViews} reverse
            views={[
              {label: copy.achievements, src: achievements, alt: copy.achievementsAlt},
              {label: copy.statistics, src: statistics, alt: copy.statisticsAlt},
            ]} />
          <FullscreenFeature locale={locale} />
          <Reveal className="pt-container pt-privacy">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <path d="M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6z" /><path d="m8.5 12 2.5 2.5 4.5-5" />
            </svg>
            <h3>{copy.features[2].title}</h3>
            <p>{copy.features[2].description}</p>
          </Reveal>
        </section>

        <section className="pt-emulators" aria-labelledby="emulators-heading">
          <Reveal className="pt-container pt-emulators-inner">
            <div className="pt-emulators-copy">
              <h2 id="emulators-heading">{copy.emulatorsTitle}</h2>
              <p>{copy.emulatorsLead}</p>
              <Link className="pt-text-link" to={guideUrl}>{copy.emulatorGuide}<Arrow /></Link>
            </div>
            <div>
              <ul className="pt-emulator-list" aria-label={copy.emulatorListLabel}>
                {emulators.map((emulator) => <li key={emulator}>{emulator}</li>)}
              </ul>
              <p className="pt-emulators-note">{copy.emulatorsNote}</p>
            </div>
          </Reveal>
        </section>

        <section className="pt-news pt-container" aria-labelledby="news-heading">
          <div className="pt-news-heading">
            <div>
              <h2 id="news-heading">{copy.newsTitle}</h2>
              <p>{copy.newsLead}</p>
            </div>
            <Link className="pt-text-link" to={newsUrl}>{copy.allNews}<Arrow /></Link>
          </div>
          <LatestRelease locale={locale} />
          <h3 className="pt-release-previous">{copy.highlights.previous}</h3>
          <ol className="pt-release-list">
            {releases.releases.filter((release) => release.version !== HIGHLIGHTS_VERSION).slice(0, 3).map((release) => <ReleaseRow release={release} locale={locale} key={release.tagName} />)}
          </ol>
        </section>

        <section className="pt-get-started pt-container" aria-labelledby="get-started-heading">
          <h2 id="get-started-heading">{copy.getStartedTitle}</h2>
          <p>{copy.getStartedLead}</p>
          <DownloadActions locale={locale} />
        </section>
      </main>
    </Layout>
  );
}

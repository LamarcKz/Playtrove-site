import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import releaseData from '../data/releases.json';

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
    screenshotAlt: 'Biblioteca de demonstração do Playtrove no modo Detalhes, com a lista de jogos, capa, informações e conquistas.',
    screenshotCaption: 'Uma biblioteca de demonstração. A sua começa com os seus jogos.',
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
    screenshotAlt: 'Playtrove demo library in Details view, showing the game list, cover art, information, and achievements.',
    screenshotCaption: 'A demo library. Yours starts with your own games.',
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
  const screenshot = useBaseUrl(`/img/screenshots/${locale}/library-details.png`);
  const guideUrl = useBaseUrl('/docs/installation/');
  const newsUrl = useBaseUrl('/blog/');
  const latestUrl = useBaseUrl(`/blog/releases/${releases.latest.version}/`);

  return (
    <Layout title={copy.pageTitle} description={copy.description}>
      <main className="pt-home">
        <header className="pt-hero pt-container">
          <h1>{copy.heading}</h1>
          <p className="pt-hero-lead">{copy.lead}</p>
          <DownloadActions locale={locale} />
          <p className="pt-download-meta">
            <span>{copy.requirements}</span>
            <span aria-hidden="true">·</span>
            <Link to={latestUrl} title={copy.releaseNotes}>v{releases.latest.version}</Link>
          </p>
        </header>

        <figure className="pt-product pt-container">
          <div className="pt-product-frame">
            <img src={screenshot} width="1280" height="800" alt={copy.screenshotAlt} fetchPriority="high" decoding="async" />
          </div>
          <figcaption>{copy.screenshotCaption}</figcaption>
        </figure>

        <section className="pt-overview pt-container" aria-labelledby="overview-heading">
          <div className="pt-section-intro">
            <h2 id="overview-heading">{copy.overviewTitle}</h2>
            <p>{copy.overviewLead}</p>
          </div>
          <div className="pt-features">
            {copy.features.map((feature) => (
              <div className="pt-feature" key={feature.title}>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="pt-emulators" aria-labelledby="emulators-heading">
          <div className="pt-container pt-emulators-inner">
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
          </div>
        </section>

        <section className="pt-news pt-container" aria-labelledby="news-heading">
          <div className="pt-news-heading">
            <div>
              <h2 id="news-heading">{copy.newsTitle}</h2>
              <p>{copy.newsLead}</p>
            </div>
            <Link className="pt-text-link" to={newsUrl}>{copy.allNews}<Arrow /></Link>
          </div>
          <ol className="pt-release-list">
            {releases.releases.slice(0, 3).map((release) => <ReleaseRow release={release} locale={locale} key={release.tagName} />)}
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

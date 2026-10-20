import { readFileSync } from "node:fs"

const data = JSON.parse(readFileSync(new URL("./src/data/releases.json", import.meta.url), "utf8"))

/** @type {import("@docusaurus/types").Config} */
const config = {
  title: "Playtrove",
  tagline: "Seus jogos de emulador, em uma biblioteca só.",
  url: "https://lamarckz.github.io",
  baseUrl: "/Playtrove-site/",
  trailingSlash: true,
  favicon: "img/logo.svg",
  organizationName: "LamarcKz",
  projectName: "Playtrove-site",
  onBrokenLinks: "throw",
  i18n: { defaultLocale: "pt-BR", locales: ["pt-BR", "en"] },
  markdown: { format: "detect", hooks: { onBrokenMarkdownLinks: "throw" } },
  clientModules: ["./src/brand-font.ts"],
  presets: [
    ["classic", {
      docs: {
        routeBasePath: "docs",
        sidebarPath: "./sidebars.js",
        includeCurrentVersion: false,
        onlyIncludeVersions: [data.docsVersion],
        lastVersion: data.docsVersion,
        versions: { [data.docsVersion]: { label: data.docsVersion, path: "" } },
      },
      blog: {
        routeBasePath: "blog",
        blogTitle: "Novidades do Playtrove",
        blogDescription: "As novidades de cada versão publicada do Playtrove.",
        showReadingTime: false,
        blogSidebarTitle: "Versões",
        blogSidebarCount: "ALL",
        onInlineTags: "ignore",
        onUntruncatedBlogPosts: "ignore",
        feedOptions: { type: ["rss", "atom"], copyright: "Playtrove" },
      },
      theme: { customCss: "./src/css/custom.css" },
    }],
  ],
  themeConfig: {
    colorMode: { defaultMode: "dark", disableSwitch: true, respectPrefersColorScheme: false },
    image: "img/screenshots/pt-BR/library-details.png",
    navbar: {
      title: "Playtrove",
      logo: { alt: "Playtrove", src: "img/logo.svg", width: 32, height: 32 },
      items: [
        { to: "/", label: "Início", position: "left", activeBaseRegex: "^/$" },
        { type: "docSidebar", sidebarId: "guideSidebar", label: "Guia", position: "left" },
        { type: "docSidebar", sidebarId: "contributingSidebar", label: "Colaborar", position: "left" },
        { to: "/blog", label: "Novidades", position: "left" },
        { href: "https://github.com/LamarcKz/Playtrove", label: "GitHub", position: "right" },
        { type: "localeDropdown", position: "right" },
      ],
    },
    footer: {
      style: "dark",
      links: [{ title: "Playtrove", items: [
        { label: "GitHub", href: "https://github.com/LamarcKz/Playtrove" },
        { label: "MIT", href: "https://github.com/LamarcKz/Playtrove/blob/main/LICENSE" },
      ] }],
      copyright: "© 2026 Playtrove",
    },
    metadata: [
      { name: "description", content: "Playtrove: biblioteca de jogos para Windows. Instalação, guias e novidades." },
    ],
  },
}
export default config

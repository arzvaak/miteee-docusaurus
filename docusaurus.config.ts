import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';

const config: Config = {
  title: 'MIT EEE Study Vault',
  tagline: 'Manipal Institute of Technology — EEE',
  favicon: 'img/logo.svg',

  url: 'https://note.arzvak.com',
  baseUrl: '/',

  organizationName: 'arzvaak',
  projectName: 'miteee-docusaurus',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  future: {
    faster: {
      swcJsLoader: true,
      swcJsMinimizer: true,
      swcHtmlMinimizer: true,
      lightningCssMinimizer: true,
      mdxCrossCompilerCache: true,
      rspackBundler: true,
      rspackPersistentCache: true,
      gitEagerVcs: true,
    },
  },

  markdown: {
    format: "md",
    mermaid: true,
  },

  themes: [
    '@docusaurus/theme-mermaid',
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        indexDocs: true,
        indexBlog: false,
        docsRouteBasePath: '/',
        searchBarPosition: 'right',
        searchResultLimits: 8,
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
      },
    ],
  ],

  plugins: [
    'docusaurus-plugin-image-zoom',
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          remarkPlugins: [remarkMath],
          rehypePlugins: [
            rehypeKatex,
            [rehypeRaw, { passThrough: ['mdxJsxFlowElement', 'mdxJsxTextElement', 'mdxFlowExpression', 'mdxTextExpression', 'mdxEsm', 'mdxjsEsm', 'mdxJsxAttribute', 'mdxJsxExpressionAttribute'] }],
          ],
          admonitions: {
            keywords: [
              'note', 'tip', 'info', 'warning', 'danger',
              'concept', 'definition', 'question', 'success',
              'formula', 'exam', 'goal', 'summary', 'example',
            ],
          },
          sidebarCollapsible: true,
          sidebarCollapsed: true,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css',
      type: 'text/css',
      crossorigin: 'anonymous',
    },
    {
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap',
      type: 'text/css',
    },
  ],

  scripts: [
    { src: '/js/quiz.js', defer: true },
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'MIT EEE',
      logo: {
        alt: 'MIT EEE Logo',
        src: 'img/logo.svg',
      },
      hideOnScroll: true,
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'sem5Sidebar',
          position: 'left',
          label: 'Sem 5',
        },
        {
          type: 'docSidebar',
          sidebarId: 'sem6Sidebar',
          position: 'left',
          label: 'Sem 6',
        },
      ],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['python', 'bash', 'matlab'],
    },
    mermaid: {
      theme: { light: 'neutral', dark: 'dark' },
    },
    imageZoom: {
      selector: '.markdown img',
      options: {
        margin: 24,
        background: '#1e1e2e',
        scrollOffset: 0,
      },
    },
  } satisfies Preset.ThemeConfig,
};

export default config;

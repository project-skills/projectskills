import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4.0 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "ProjectSkills",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: null,
    locale: "ru-RU",
    baseUrl: "project-skills.github.io/projectskills",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Schibsted Grotesk",
        body: "Source Sans Pro",
        code: "IBM Plex Mono",
      },
      colors: {
        lightMode: {
          light: "#faf8f8",
          lightgray: "#e5e5e5",
          gray: "#b8b8b8",
          darkgray: "#4e4e4e",
          dark: "#2b2b2b",
          secondary: "#284b63",
          tertiary: "#84a59d",
          highlight: "rgba(143, 159, 169, 0.15)",
          textHighlight: "#fff23688",
        },
        darkMode: {
          light: "#161618",
          lightgray: "#393639",
          gray: "#646464",
          darkgray: "#d4d4d4",
          dark: "#ebebec",
          secondary: "#7b97aa",
          tertiary: "#84a59d",
          highlight: "rgba(143, 159, 169, 0.15)",
          textHighlight: "#b3aa0288",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents({
        maxDepth: 3,
        minEntries: 2,
        showByDefault: true,
        collapseByDefault: false,
      }),
      Plugin.CrawlLinks({
        markdownLinkResolution: "shortest",
        prettyLinks: true,
        openLinksInNewTab: false,
      }),
      Plugin.Description({
        descriptionLength: 150,
      }),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage({
        folderDefaultName: "index",
        showFolderCount: true,
      }),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
        rss: {
          rssLimit: 20,
          rssFullHtml: false,
        },
        includeEmptyFiles: false,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.NotFoundPage(),
    ],
  },
}

// Добавляем конфигурацию компонентов с кастомной сортировкой
config.plugins.emitters.push(
  Plugin.ComponentResources({
    explorer: Plugin.Explorer({
      title: "Проводник",
      folderClickBehavior: "link",
      folderDefaultState: "collapsed",
      useSavedState: true,
      
      // Кастомная функция сортировки для папок
      sortFn: (a, b) => {
        // Определяем желаемый порядок папок верхнего уровня
        const topLevelOrder = [
          "Представление проекта",
          "Суть проекта",
          "Система понятий",
          "Методы и подходы",
          "Нормативная база и стандарты",
          "Нормативная база",
          "Юмор и мемы"
        ];
        
        // Функция для определения приоритета элемента
        const getPriority = (name) => {
          if (!name) return 999;
          
          // Ищем точное совпадение
          const exactIndex = topLevelOrder.indexOf(name);
          if (exactIndex !== -1) return exactIndex;
          
          // Ищем частичное совпадение (нормализуем строки)
          const normalized = name.toLowerCase().replace(/[:\s-]/g, '');
          const partialIndex = topLevelOrder.findIndex(item => {
            const itemNormalized = item.toLowerCase().replace(/[:\s-]/g, '');
            return normalized.includes(itemNormalized) || 
                   itemNormalized.includes(normalized);
          });
          
          return partialIndex !== -1 ? partialIndex : 999;
        };
        
        const aPriority = getPriority(a.name);
        const bPriority = getPriority(b.name);
        
        // Если приоритеты разные — сортируем по ним
        if (aPriority !== bPriority) {
          return aPriority - bPriority;
        }
        
        // Для подпапок и файлов внутри — сортировка по алфавиту (с поддержкой русского)
        return a.name.localeCompare(b.name, 'ru', { 
          numeric: true, 
          sensitivity: 'base' 
        });
      }
    }),
  })
);

export default config

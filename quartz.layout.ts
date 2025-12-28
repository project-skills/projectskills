import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/jackyzha0/quartz",
      "Discord Community": "https://discord.gg/cRFFHYye7t",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer({
      title: "Проводник",
      folderDefaultState: "collapsed",
      folderClickBehavior: "link",
      useSavedState: true,
      sortFn: (a, b) => {
        // Желаемый порядок папок верхнего уровня
        const topLevelOrder = [
          "Представление проекта",
          "Суть проекта",
          "Система понятий",
          "Методы и подходы",
          "Нормативная база и стандарты",
          "Нормативная база",
          "Юмор и мемы"
        ];
        
        const nameA = a.displayName || a.name;
        const nameB = b.displayName || b.name;
        
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
        
        const aPriority = getPriority(nameA);
        const bPriority = getPriority(nameB);
        
        // Если приоритеты разные — сортируем по ним
        if (aPriority !== bPriority) {
          return aPriority - bPriority;
        }
        
        // Для элементов без приоритета или внутри папок — алфавитная сортировка
        return nameA.localeCompare(nameB, "ru", { 
          numeric: true,
          sensitivity: 'base'
        });
      },
      // filterFn: (node) => {
        // // Не показывать index.md файлы в навигации
        // return node.name !== "index"
      // },
      mapFn: (node) => {
        // Убираем числовые префиксы из отображения
        if (node.displayName) {
          node.displayName = node.displayName.replace(/^\d+_/, "")
        }
        return node
      },
    }),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer({
      title: "Проводник",
      folderDefaultState: "collapsed",
      folderClickBehavior: "link",
      useSavedState: true,
      sortFn: (a, b) => {
        // Тот же порядок для страниц списков
        const topLevelOrder = [
          "Представление проекта",
          "Суть проекта",
          "Система понятий",
          "Методы и подходы",
          "Нормативная база и стандарты",
          "Нормативная база",
          "Юмор и мемы"
        ];
        
        const nameA = a.displayName || a.name;
        const nameB = b.displayName || b.name;
        
        const getPriority = (name) => {
          if (!name) return 999;
          const exactIndex = topLevelOrder.indexOf(name);
          if (exactIndex !== -1) return exactIndex;
          
          const normalized = name.toLowerCase().replace(/[:\s-]/g, '');
          const partialIndex = topLevelOrder.findIndex(item => {
            const itemNormalized = item.toLowerCase().replace(/[:\s-]/g, '');
            return normalized.includes(itemNormalized) || 
                   itemNormalized.includes(normalized);
          });
          
          return partialIndex !== -1 ? partialIndex : 999;
        };
        
        const aPriority = getPriority(nameA);
        const bPriority = getPriority(nameB);
        
        if (aPriority !== bPriority) {
          return aPriority - bPriority;
        }
        
        return nameA.localeCompare(nameB, "ru", { numeric: true, sensitivity: 'base' });
      },
      mapFn: (node) => {
              if (node.displayName) {
          node.displayName = node.displayName.replace(/^\d+_/, "")
                      }
        return node
      },
    }),
  ],
  right: [],
}

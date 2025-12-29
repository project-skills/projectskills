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

// Общая функция сортировки для Explorer
const explorerSortFn = (a, b) => {
  // Желаемый порядок папок верхнего уровня
  const topLevelOrder = [
    "Представление проекта",
    "Суть проекта: оглавление раздела",
    "Суть проекта",
    "Система понятий",
    "Методы и подходы",
    "Нормативная база и стандарты",
    "Нормативная база",
    "Юмор и мемы"
  ];
  
  const nameA = a.displayName || a.name || "";
  const nameB = b.displayName || b.name || "";
  
  // Проверяем, есть ли элементы в списке приоритетов
  const indexA = topLevelOrder.indexOf(nameA);
  const indexB = topLevelOrder.indexOf(nameB);
  
  // Если оба элемента в списке приоритетов - сортируем по индексу
  if (indexA !== -1 && indexB !== -1) {
    return indexA - indexB;
  }
  
  // Если только A в списке - он идет первым
  if (indexA !== -1) return -1;
  
  // Если только B в списке - он идет первым
  if (indexB !== -1) return 1;
  
  // Для остальных - алфавитная сортировка
  // Сначала папки, потом файлы
  if (a.isFolder && !b.isFolder) return -1;
  if (!a.isFolder && b.isFolder) return 1;
  
  return nameA.localeCompare(nameB, "ru", { 
    numeric: true,
    sensitivity: 'base'
  });
};

// Общая функция мапинга для Explorer
const explorerMapFn = (node) => {
  // Убираем числовые префиксы из отображения
  if (node.displayName) {
    node.displayName = node.displayName.replace(/^\d+_/, "");
  }
  return node;
};

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
      sortFn: explorerSortFn,
      mapFn: explorerMapFn,
    }),
  ],
  right: [
    Component.Graph(),
    Component.TableOfContents(),
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
      sortFn: explorerSortFn,
      mapFn: explorerMapFn,
    }),
  ],
  right: [],
}

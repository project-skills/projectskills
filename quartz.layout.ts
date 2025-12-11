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
        // Сортировка по имени с учетом числовых префиксов
        const nameA = a.displayName || a.name
        const nameB = b.displayName || b.name
        return nameA.localeCompare(nameB, "ru", { numeric: true })
      },
      filterFn: (node) => {
        // Не показывать index.md файлы в навигации
        return node.name !== "index"
      },
      mapFn: (node) => {
        // Убираем числовые префиксы из отображения
        if (node.displayName) {
          node.displayName = node.displayName.replace(/^\d+_/, "")
              // Обработка обзорных страниц (index.md и _Обзор)
    if (node.displayName && node.displayName.startsWith("index")) {
      // Скрываем index.md файлы
      node.displayName = ""
    } else if (node.displayName && node.displayName.match(/^_[Оо]бзор/)) {
      // Добавляем иконку к обзорным страницам и убираем префикс
      node.displayName = "📋 " + node.displayName.replace(/^_[Оо]бзор - /, "")
    }
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
        const nameA = a.displayName || a.name
        const nameB = b.displayName || b.name
        return nameA.localeCompare(nameB, "ru", { numeric: true })
      },
      filterFn: (node) => {
        return node.name !== "index"
      },
      mapFn: (node) => {
        if (node.displayName) {
          node.displayName = node.displayName.replace(/^\d+_/, "")
                // Обработка обзорных страниц
      if (node.displayName && node.displayName.startsWith("index")) {
        node.displayName = ""
      } else if (node.displayName && node.displayName.match(/^_[Оо]бзор/)) {
        node.displayName = "📋 " + node.displayName.replace(/^_[Оо]бзор - /, "")
      }
        }
        return node
      },
    }),
  ],
  right: [],
}

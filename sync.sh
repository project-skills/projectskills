#!/bin/bash
# Синхронизация контента Project Skills

SOURCE="/Users/alex/Documents/_OBSIDIAN/projectskills/"
DEST="$HOME/Projects/quartz-projectskills/content/"

echo "🔄 Синхронизация контента..."
rsync -av --delete "$SOURCE" "$DEST"

echo "📦 Добавление в Git..."
cd ~/Projects/quartz-projectskills
git add .

echo "💬 Коммит..."
git commit -m "Обновление контента $(date '+%Y-%m-%d %H:%M')"

echo "🚀 Публикация..."
git push

echo "✅ Готово! Сайт обновится через ~1 минуту."

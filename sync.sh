#!/bin/bash
SOURCE="/Users/alex/Documents/_OBSIDIAN/projectskills/"
DEST="$HOME/Projects/quartz-projectskills/content/"

rsync -av --delete "$SOURCE" "$DEST"

cd ~/Projects/quartz-projectskills
git add .
git commit -m "Обновление $(date '+%Y-%m-%d %H:%M')"

if git push; then
    osascript -e 'display notification "Сайт обновлён! Проверьте Actions." with title "✅ Project Skills" sound name "Бриз"'
    open "https://github.com/project-skills/projectskills/actions"
else
    osascript -e 'display notification "Ошибка git push!" with title "❌ Project Skills" sound name "Basso"'
fi

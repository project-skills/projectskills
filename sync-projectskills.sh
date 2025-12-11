#!/bin/bash
# sync.sh - Двусторонняя синхронизация Obsidian ↔ GitHub

# Пути из вашего скрипта
SOURCE="/Users/alex/Documents/OBSIDIAN/projectskills"
QUARTZ_REPO="$HOME/Projects/quartz-projectskills"
CONTENT="$QUARTZ_REPO/content"

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🔄 Двусторонняя синхронизация ProjectSkills${NC}"
echo ""

# 1. Получаем изменения из GitHub
echo -e "${YELLOW}⬇️  Получение изменений из GitHub...${NC}"
cd "$QUARTZ_REPO" || exit 1

# Проверяем, есть ли новые коммиты
git fetch origin

LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse @{u})

if [ "$LOCAL" != "$REMOTE" ]; then
    echo -e "${YELLOW}📥 Найдены изменения в GitHub, загружаем...${NC}"
    git pull origin main
    
    # 2. Синхронизируем изменения из GitHub в Obsidian
    echo -e "${YELLOW}📋 Синхронизация GitHub → Obsidian...${NC}"
    rsync -av --delete "$CONTENT/" "$SOURCE/"
    echo -e "${GREEN}✅ Obsidian vault обновлен${NC}"
else
    echo -e "${GREEN}✅ GitHub актуален${NC}"
fi

# 3. Синхронизируем изменения из Obsidian в Quartz
echo ""
echo -e "${YELLOW}📤 Синхронизация Obsidian → Quartz...${NC}"
rsync -av --delete "$SOURCE/" "$CONTENT/"

# 4. Проверяем, есть ли локальные изменения для отправки
cd "$QUARTZ_REPO"
if [[ -n $(git status --porcelain) ]]; then
    echo -e "${YELLOW}📝 Найдены изменения для отправки:${NC}"
    git status --short
    
    git add .
    COMMIT_MSG="Auto-sync: $(date '+%Y-%m-%d %H:%M')"
    git commit -m "$COMMIT_MSG"
    
    echo ""
    echo -e "${YELLOW}⬆️  Отправка в GitHub...${NC}"
    if git push; then
        osascript -e 'display notification "✅ Синхронизация завершена! Actions." with title "Project Skills" sound name "Glass"'
        open "https://github.com/project-skills/projectskills/actions"
    else
        osascript -e 'display notification "❌ Ошибка git push!" with title "Project Skills" sound name "Basso"'
        exit 1
    fi
else
    echo -e "${GREEN}✅ Нет изменений для отправки${NC}"
fi

echo ""
echo -e "${GREEN}✅ Синхронизация завершена!${NC}"

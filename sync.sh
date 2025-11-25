#!/bin/bash

# Пути
VAULT_PATH="$HOME/Documents/_OBSIDIAN/projectskills"
CONTENT_PATH="$HOME/Projects/quartz-projectskills/content"

# Проверка существования вольта
if [ ! -d "$VAULT_PATH" ]; then
  echo "❌ Вольт не найден: $VAULT_PATH"
  echo "📍 Проверьте путь командой: ls -la $VAULT_PATH"
  exit 1
fi

echo "📦 Синхронизация контента из Obsidian..."
echo "🔗 Источник: $VAULT_PATH"
echo "📂 Назначение: $CONTENT_PATH"

# Копирование с исключением служебных папок Obsidian
rsync -av --delete \
  --exclude='.obsidian/' \
  --exclude='.trash/' \
  --exclude='.DS_Store' \
  "$VAULT_PATH/" "$CONTENT_PATH/"

echo "✅ Синхронизация завершена"
echo "📊 Файлов в content/: $(find "$CONTENT_PATH" -type f -name "*.md" | wc -l)"
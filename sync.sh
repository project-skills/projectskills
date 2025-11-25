#!/bin/bash

VAULT_PATH="$HOME/Documents/_OBSIDIAN/projectskills"
CONTENT_PATH="$HOME/Projects/quartz-projectskills/content"

if [ ! -d "$VAULT_PATH" ]; then
  echo "❌ Вольт не найден: $VAULT_PATH"
  exit 1
fi

echo "📦 Копируем заметки..."
rsync -av --delete \
  --exclude='.obsidian/' \
  --exclude='.trash/' \
  --exclude='.DS_Store' \
  "$VAULT_PATH/" "$CONTENT_PATH/"

echo "✅ Готово"
echo "📊 MD-файлов: $(find "$CONTENT_PATH" -type f -name '*.md' | wc -l)"



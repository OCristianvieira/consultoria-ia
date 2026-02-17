#!/bin/bash

# Script para sincronizar com GitHub automaticamente

git add .
git commit -m "$1" 2>/dev/null || git commit -m "Update: $(date '+%Y-%m-%d %H:%M')"
git push

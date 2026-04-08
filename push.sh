#!/bin/bash
# TokenHub 项目推送脚本

cd "$(dirname "$0")"

# 设置远程仓库（如果还没有）
git remote add origin https://github.com/Koreyo/aineural.git 2>/dev/null

# 推送到 GitHub
echo "正在推送到 GitHub..."
git push -u origin aineural

echo "完成！"
#!/bin/bash
# 寻道·文字冒险 - TapTap H5 打包脚本
# 注意：workspace 文件系统不支持 Python zipfile 直接写入，
#       故先在 /tmp 创建 zip，再复制到目标位置。

PROJECT_DIR="/root/.openclaw/workspace/xundao-novel"
OUTPUT_DIR="$PROJECT_DIR/dist"
ZIP_TMP="/tmp/xundao-novel.zip"
ZIP_FINAL="$PROJECT_DIR/xundao-novel.zip"

cd "$PROJECT_DIR"

# 清理旧构建和旧 zip
rm -rf "$OUTPUT_DIR"
rm -f "$ZIP_TMP"
rm -f "$ZIP_FINAL"
mkdir -p "$OUTPUT_DIR"

# 复制所有文件到 dist/
cp index.html "$OUTPUT_DIR/"
cp -r css "$OUTPUT_DIR/"
cp -r js "$OUTPUT_DIR/"
cp -r src/assets "$OUTPUT_DIR/"
cp -r data "$OUTPUT_DIR/"

# 使用 Python 在 /tmp 创建 zip（workspace 文件系统不支持直接写入）
python3 -c "
import zipfile, os, shutil

src = '$OUTPUT_DIR'
dst = '$ZIP_TMP'

with zipfile.ZipFile(dst, 'w', zipfile.ZIP_DEFLATED) as zf:
    for root, dirs, files in os.walk(src):
        for file in files:
            full = os.path.join(root, file)
            arcname = os.path.relpath(full, src)
            zf.write(full, arcname)

size = os.path.getsize(dst)
print(f'ZIP created: {dst} ({size/1024/1024:.2f}MB, {len(zipfile.ZipFile(dst).namelist())} files)')
"

# 复制到目标位置
cp "$ZIP_TMP" "$ZIP_FINAL"

# 输出结果
SIZE=$(du -h "$ZIP_FINAL" | cut -f1)
echo "包体大小：$SIZE"
echo "包体位置：$ZIP_FINAL"

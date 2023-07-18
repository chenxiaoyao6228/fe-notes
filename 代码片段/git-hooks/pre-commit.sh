#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# 脚本用于检测 package.json 文件的更改，如果版本发生变化，则执行 npm run build 命令，
# 如果构建命令返回错误，则拒绝提交

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' 

# 检查版本键是否发生变化的函数
function hasVersionChanged() {
  local old_version=$(git show HEAD:package.json | grep -Eo '"version": "[^"]+"' | cut -d'"' -f4)
  local new_version=$(grep -Eo '"version": "[^"]+"' package.json | cut -d'"' -f4)

  if [[ "$old_version" != "$new_version" ]]; then
    return 0
  fi

  return 1
}


# 获取暂存的文件列表
staged_files=$(git diff --name-only --cached)

# 检查 package.json 是否在暂存的文件列表中
if [[ $staged_files =~ "package.json" ]]; then
  # 检查版本键是否发生变化
  if hasVersionChanged; then
    echo -e "${RED} ========== 检测到 package.json中有版本更新, 执行本地构建，避免推送后构建失败 =========${NC}"
    
    # 执行构建命令的函数
    sh local-build.sh

    build_exit_code=$?

    if [[ $build_exit_code -ne 0 ]]; then
      echo -e "${RED}构建命令执行失败，拒绝提交。${NC}"
      exit 1
    fi

    commit_message=$(cat .git/COMMIT_EDITMSG)

    new_commit_message="$commit_message"

    echo -e "${GREEN}构建成功并自动提交更改。${NC}"
  fi
fi

exit 0  # 退出状态为 0，允许提交

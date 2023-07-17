## 前言

收集平时常用的 git 操作。 
## 使用alias配置别名

配置git别名，其实最常用的也就前三个😂
```sh
alias.pm pull origin master
alias.aa add .
alias.cm commit -m
alias.cb checkout -b
alias.lo log --pretty=oneline
alias.gl config --global -l
alias.p pull
alias.ps push
alias.alias config --get-regexp ^alias\.
```

## 代码回滚

`git reset --soft HEAD~n`: 开发的时候改动的文件比较多，但是暂时还不构成一个完成的功能，可以使用`git commit -m 'stash'`暂存，后面再使用该命令撤销stash，恢复后的文件会保留在暂存区

`git reset --hard HEAD~n`: 与`--soft`类似，只不过reset之后记录不保留

`git reflog`: 如果不小心使用了`--hard`, 可以使用reflog命令尝试把对应的文件改动捞回来

## 临时存储

有时代码还没提交，但远程进行了比较大的更新，需要团队内的成员立即`git pull`更新代码库， 这时候推荐使用`git stash`, 拉取之后再进行`git pop`操作。

另外一种情况是: 开发某个功能的时候，想尝试一下某个新的解法，需要临时暂存修改中的某些文件， 这时候可以使用`git stash --staged`.

## 删除文件

`git rm --cached xxx`用于将 xxx 文件/目录从 git 仓库中删除，但并不删除本地文件/目录。这经常用于 xxx 虽然被写入 .gitignore 但依然被提交了的情况。

与之相反，`git add -f xxx`可以在 xxx 被 ignore 的情况下强行把 xxx 加入 git 仓库。

## commit 整理

`git commit . --amend`: 把当前代码提交到上一次提交里

`git rebase -i HEAD~n`: 对最近的 n 次 commit 进行合并、修改等操作

`git cherry-pick`: 用于筛选 commit。比如你在开发`feature-x`分支，只想保留其中的部分 commit, 就可以这样操作： 新建临时分支`temp`， 然后回到`feature-x`分支，使用`git reset --hard xxx`回滚到某个历史版本, 然后从`temp`分支中 cherry-pick 需要的 commit 记录

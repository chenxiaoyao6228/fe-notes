---
permalink: 2020-01-08-iterms2-antigen-to-improve-your-work-experience
title: 使用iterms2与zsh来改善工作体验
date: 2020-4-31
categories:
  - tech
tags:
  - iterms
  - zsh
  - shell
---

## 前言

终端作为程序员工作中打交道比较多一块, 进行改造以改进工作效率是很有必要的

## 概念理清

### shell 与 terminal emulator

shell: shell 是一个命令行界面，可以读取和解释命令。 比如 bash，zsh, windows 下有 powershell

iterms: iterms 不是 shell，而是终端模拟器，在 shell 套了一个壳子

oh-my-zsh: shell 插件管理工具

antigen: shell 插件管理工具

### .bashrc 与.zshrc

对应的 shell 脚本, 每次终端启动的时候就会运行, 可以将任何命令提示符下键入的命令放入该文件中, 参考下面的`antigen`章节

## iterms2

一款可以配置的终端, 功能比较多

### 快捷键

只记录一些自己用的上的

#### 标签

新建标签：command + t

关闭标签：command + w

切换标签：command + 数字 / command + 左右方向键

切换全屏：command + enter

查找：command + f

#### 分屏

垂直分屏：command + d

水平分屏：command + shift + d

查看历史命令：command + ;

查看剪贴板历史：command + shift + h

#### 其他

清除当前行：ctrl + u

清屏：ctrl + l

到行首：ctrl + a

到行尾：ctrl + e

### vscode 集成

#### iterms 作为集成终端

不可以, vscode 使用 shell 而不是终端模拟器作为集成终端

#### 如何快速打开项目

`command + ,`打开设置, 点击右上角的`open setting json`, 添加以下字段

```json
"terminal.external.osxExec": "iTerm.app",
"terminal.integrated.fontFamily": "Meslo LG S DZ for Powerline",
"terminal.explorerKind": "external",
```

vscode 中,在项目文件夹右键打开 -> Open in external terminal

## oh-my-zsh

一款终端管理工具,集成了很多插件: 见[此处](https://github.com/ohmyzsh/ohmyzsh/wiki)

## antigen

使用[antigen](https://github.com/zsh-users/antigen)来管理你的包: , 这点可以类比 npm

[安装](https://github.com/zsh-users/antigen/wiki/Installation)

```bash
curl -L git.io/antigen > antigen.zsh
```

修改你的`~/.zshrc`文件, 把其中的内容替换成下面

```bash
# source也是shell命令, 引入文件并执行
source  ~/antigen.zsh
# 这里antigen.zsh的保存路径就是 ~/zsh 所以第一行应该是source ~/antigen.zsh

# 加载oh-my-zsh库
antigen use oh-my-zsh

# 加载原版oh-my-zsh中的功能(robbyrussell's oh-my-zsh).
antigen bundle git
antigen bundle heroku
antigen bundle pip
antigen bundle lein
antigen bundle command-not-found
antigen bundle z
antigen bundle paulirish/git-open

# 语法高亮功能
antigen bundle zsh-users/zsh-syntax-highlighting

# 代码提示功能
antigen bundle zsh-users/zsh-autosuggestions

# 自动补全功能
antigen bundle zsh-users/zsh-completions

# 加载主题
antigen theme robbyrussell

# 保存更改
antigen apply

# for ls colors
#LS_COLORS="di=34:ln=35:so=32:pi=33:ex=31:bd=34:cd=34:su=36:sg=36:tw=34:ow=34"
export LS_COLORS
```

打开一个新的终端, 会自动加载我们的`.zshrc`文件, 就可以看到生效了

### 插件

### git

常用命令

```bash
gaa -> git add -all
gcmsg -> git commit -m
ggpull  -> git pull origin "$(git_current_branch)"
gpsup -> git push --set-upstream origin $(git_current_branch)
ghh -> git help

```

更多请见[此处](https://github.com/ohmyzsh/ohmyzsh/tree/master/plugins/git)

### git-open

在浏览器中打开在当前项目文件夹下的远程仓库

### 其他

- autojump
- zsh-syntax-highlighting
- zsh-autosuggestions
- zsh-completions

更多见[此处](https://github.com/ohmyzsh/ohmyzsh/tree/master/plugins/git)

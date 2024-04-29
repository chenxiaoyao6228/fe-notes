## 前端 windows 环境配置指南

## WSL

抛弃`powershell`, 拥抱`WSL2`, 具体看:

官方传送门: https://learn.microsoft.com/zh-cn/windows/wsl/install-manual

或者参考: https://dowww.spencerwoo.com/1-preparations/1-1-installation.html#wsl-2-%E7%9A%84%E5%AE%89%E8%A3%85

> 安装完成后需要重启电脑

注意事项:

- 确定当前已经开启了`wsl2`, 不要装到`wsl1`上了
- buntu 的版本: wsl --install -d Ubuntu-20.04 #建议版本比这个高，因为后续高版本的 nodejs 会依赖某些部件
- 两套系统的文件类型并不一致，跨系统访问和传输文件的话效率会下降很多，最好各存各的, 见 https://learn.microsoft.com/zh-cn/windows/wsl/filesystems
- [开始通过适用于 Linux 的 Windows 子系统使用 Visual Studio Code](https://learn.microsoft.com/zh-cn/windows/wsl/tutorials/wsl-vscode)

## windows 包管理工具(scoop)

替代 mac 上的`brew`,

```bash
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression

# 加bucket, 可以理解为镜像源, 默认源可能没有一些包
 scoop bucket add extras
scoop bucket list
```

```code
PS C:\Windows\system32> scoop bucket list

Name   Source                                   Updated            Manifests
----   ------                                   -------            ---------
main   https://github.com/ScoopInstaller/Main   2024/4/28 12:25:59      1317
extras https://github.com/ScoopInstaller/Extras 2024/4/28 12:28:43      2013

```

常用命令

```bash
scoop search [软件包名]
scoop install [软件包名]
scoop list
```

更多见: https://scoop.sh/

## terminal

### windows terminal

```bash
scoop install windows-terminal
```

打开并设置`WSL`

![https://github.com/chenxiaoyao6228/cloudimg/2024/windows-terminal-config.png](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2024/windows-terminal-config.png)

### oh-my-zsh

## npm 包管理工具

放弃使用`nvm`, 目前用的是 tj 大神的`n`， https://github.com/tj/n

```bash
# make cache folder (if missing) and take ownership
sudo mkdir -p /usr/local/n
sudo chown -R $(whoami) /usr/local/n
# make sure the required folders exist (safe to execute even if they already exist)
sudo mkdir -p /usr/local/bin /usr/local/lib /usr/local/include /usr/local/share
# take ownership of Node.js install destination folders
sudo chown -R $(whoami) /usr/local/bin /usr/local/lib /usr/local/include /usr/local/share

```

```bash
curl -fsSL https://raw.githubusercontent.com/tj/n/master/bin/n | bash -s lts
# If you want n installed, you can use npm now.
npm install -g n

```

注意`lts`安装的是最新的 nodejs, 可能会出现以下报错, 取决你安装的 WSL 版本(建议 Ubuntu-20.04 以上)

```bash
node: /lib/x86_64-linux-gnu/libc.so.6: version `GLIBC_2.28' not found (required by node)
```

常用命令

```bash
# 包安装
n v18.20.0

# 切换
n

# 移除
n rm
```

## 改键

1. 安装 auto-hotkey 1.x

Alt + 'ijkl'实现光标移动

```bash
!i::
Send {Up}
Return

!k::
Send {Down}
Return

!j::
Send {Left}
Return

!l::
Send {Right}
Return
```

使用 caplock 切换输入法

```bash
SetStoreCapslockMode, off
CapsLock::
If StartTime
    return
StartTime := A_TickCount
return

CapsLock up::
TimeLength := A_TickCount - StartTime
if (TimeLength >= 1 and TimeLength < 200)
{
    Send, ^{Space}
}
else if (TimeLength >= 200)
{
    Send, {CapsLock}
}
StartTime := ""
return

```

找到对应的文件夹: AppData/Roaming/Microsoft/Windows/Start Menu/Programs/Startup
将脚本 copy 添加到开启启动目录, 开机的时候即可自启

## utools

用来替换 alfred

## git

```bash
#  启用大小写敏感
git config --global core.ignorecase false
```

## more

- https://dowww.spencerwoo.com/
- https://learn.microsoft.com/zh-cn/windows/wsl/
- https://www.cnblogs.com/dmego/p/12082013.html
- https://juejin.cn/post/7037893084998270990

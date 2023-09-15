## 前言

收集常用的shell命令，方便查阅。

### 查看内网ip

```sh
ifconfig | grep "inet 1"
```

### 查看端口所在的进程

如查看 3000 端口所在的进程
```sh
lsof -i tcp:3000
```
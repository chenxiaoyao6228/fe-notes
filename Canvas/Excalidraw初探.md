## 前言

最近团队在做教授课的共享白板工具， 为此预研了下Excalidraw。

## Excalidraw的发展历程

作为比较有名的一款手绘风格的共享白板工具， Excalidraw的发展不可谓不迅猛。

2020.1.1 作者发了一个demo, 两周就1.5k+star,  经过短短两年，截至目前(2023-05-27)，已经有48.2Kstar.

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/excalidraw-intro-1.png)

2021年，Excalidraw 成立了一家公司.
![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/excalidraw-intro-2.png)


## Excalidraw资料

- [官方网站](https://github.com/excalidraw/excalidraw)
- [Excalidraw and Fugu: Improving core user journeys | Session](https://www.youtube.com/watch?v=EK1AkxgQwro),[对应这个官方的post](https://blog.excalidraw.com/excalidraw-and-fugu/)
- [Excalidraw: Under the hood of the virtual whiteboard](https://www.youtube.com/watch?v=gvEoTVjVjB8)
- [Excalidraw: Cool JS Tricks Behind the Scenes by Excalidraw Creator Christopher Chedeau aka @vjeux](https://www.youtube.com/watch?v=fix2-SynPGE)


## 源码阅读

拉取代码，新建.vscode/setting.json进行debug配置。

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "whiteboard debug",
            "request": "launch",
            "type": "chrome",
            "runtimeExecutable": "stable",
            "runtimeArgs": [
                "--auto-open-devtools-for-tabs"
            ],
            "userDataDir": true,
            "url": "http://localhost:3000",
            // 过滤三方文件
            "skipFiles": [
                "<node_internals>/**/*.js",
                "**/node_modules/**"
            ]
        }
    ]
}
```
下面以 Q&A 的形式带着问题进行阅读
## 前言

vscode作为前端开发人员的一大利器，充分利用其进行调试有助于提高效率.

## 项目打开的时候执行任务

我们在打开项目的时候一般都要在命令行中执行对应的操作，而vscode提供了这样的功能，当你打开项目的时候，能够自动打开terminal并执行对
应的任务。
```json
{
    // See https://go.microsoft.com/fwlink/?LinkId=733558
    // for the documentation about the tasks.json format
    "version": "2.0.0",
    "tasks": [
        {
            "label": "teacher start",
            "dependsOn": [
                "teacher server start",
                "teacher client start",
            ],
            "runOptions": {
                "runOn": "folderOpen" // 打开项目的时候执行启动命令
            }
        },
        {
            "label": "teacher server start",
            "type": "npm",
            "script": "dev",
            "group": "none",
            "presentation": {
                "group": "teacher start",
            }
        },
        {
            "label": "teacher client start",
            "type": "npm",
            "script": "start",
            "group": "none",
            "presentation": {
                "group": "teacher start",
            },
            "options": {
                "cwd": "${workspaceRoot}/client"
            },
        }
    ]
}
```

## 调试

在`vscode/launch.json`中添加react+egg代码配置.

```json
"version": "0.2.0",
"configurations": [
    {
        "name": "umi client",
        "type": "pwa-chrome",
        "request": "launch",
        "runtimeExecutable": "stable",
        "runtimeArgs": [
            "--auto-open-devtools-for-tabs"
        ],
        "userDataDir": true, // 保存默认的登录状态
        "url": "localhost:9000",
        "webRoot": "${workspaceFolder}/client"
    },
    {
        "name": "egg debug", // 需要在命令行中启动对应的debug命令
        "port": 6050,
        "request": "attach",
        "type": "node"
    }
]
```


## Jest 当前文件

```json
{
  "type": "node",
  "name": "test:currentFile",
  "request": "launch",
  "runtimeArgs": ["--experimental-vm-modules"],
  "args": ["--env", "jsdom", "${file}", "--runInBand"],
  "resolveSourceMapLocations": ["${workspaceFolder}/**"],
  "cwd": "${workspaceFolder}",
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen",
  "disableOptimisticBPs": true,
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "windows": {
    "program": "${workspaceFolder}/node_modules/jest/bin/jest"
  }
}
```

## 前言

之前白嫖 cursor 频繁切换账号, 导致机器 ID 被锁定了

![https://github.com/chenxiaoyao6228/cloudimg/2024/cursor-id-lock.png](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2024/cursor-id-lock.png)


## hack方案

研究了下发现只需要修改对应的配置文件即可(windows演示, mac 类似)

1. 关闭所有的 cursor 窗口

2. 需要注销账号或者换一个账号(本方案只解决机器锁的问题)

3. 装一个 everything(或者其他的替代), 方便搜索文件夹, 搜索`storage.json`, 找到cursor的配置文件

![https://github.com/chenxiaoyao6228/cloudimg/2024/cursor-id-lock-1.png](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2024/cursor-id-lock-1.png)

4. 用编辑器打开

![https://github.com/chenxiaoyao6228/cloudimg/2024/cursor-id-lock-2.png](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2024/cursor-id-lock-2.png)

5. 修改下列字段(**改1-2位就行**)

```json
{
    "telemetry.sqmId": "{xxxxx}",
    "telemetry.machineId": "{xxxxx}",
    "telemetry.devDeviceId": "{xxxxx}",
    "telemetry.macMachineId": "{xxxxx}", // 估计是mac的机器ID
}
```

![https://github.com/chenxiaoyao6228/cloudimg/2024/cursor-id-lock-3.png](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2024/cursor-id-lock-3.png)


1. 保存文件, 重启cursor, 可以正常使用了

![https://github.com/chenxiaoyao6228/cloudimg/2024/cursor-id-lock-4.png](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2024/cursor-id-lock-4.png)

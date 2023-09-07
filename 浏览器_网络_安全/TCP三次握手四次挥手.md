
## 前言

本节主要介绍 TCP 的三次握手和四次挥手的过程，以及为什么需要三次握手和四次挥手。
## wireshark配置

我们使用了wireshark来抓包，首先需要去[官网](https://www.wireshark.org/download.html)下载安装包，然后安装，安装过程中会提示安装winpcap，这个是用来抓包的，


之后需要先配置一下，打开wireshark，点击菜单栏的Edit->Preferences，然后在Protocols->TCP中勾选Relative Sequence Numbers，这样可以显示相对序列号，这样更加直观。

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/wireshark-setting.png)

## 数据包的基础知识

信息传输的过程就是不断组装数据包的过程，有点类似一级级的快递点，收快递的时候由乡级->县级->市级->省级一级级的转发，最后到达目的地。

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/data-pack.png)


## 三次握手(three-way handshaking)

握手过程中使用了 TCP 的标志(flag) —— SYN(synchronize) 和ACK(acknowledgement)。


### 为什么需要三次？


### 具体过程

浏览器向服务器发送了一个 SYN 的 TCP 请求，表示希望建立连接，序列号 Seq 是 0

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/tcp-handshake-1.png)
![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/tcp-handshake-2.png)
![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/tcp-handshake-3.png)





## 四次挥手




## 参考

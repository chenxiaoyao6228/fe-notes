## 前言

痛点：

1）原生的H5，并不能方便地提供类似扫一扫的功能

2）原生H5的扫一扫也需要部署到https

ps：本文基于mac系统，windows用户可以根据思路来进行调整

## 现有方案评估

### 花生壳等内网穿透工具

*   需要频繁实名验证
*   花生壳服务商等域名在手机微信内会显示被举报，无法访问

### 目前的方案

修改host+charles正向代理+nginx方向代理的模式

原理图如下：
![image](../../cloudimg/2019/debug-wechat-through-nginx.png)

### 基本步骤

我们可信域名为:
家长端：mobile-parent.adacampus.com
教师端：mobile-teacher.adacampus.com

1.  在微信公众号或者企业微信应用主页填写可信域名（已开启）
2.  本地开启服务
3.  修改本地host，把域名解析为本地的服务
4.  安装并配置nginx, 可以成功通过http访问
5.  为nginx配置ssl证书，包括建立CA，CA签名
6.  电脑端安装Charles抓包软件，手机端开启代理并安装Charles证书

## 本地服务开启

分别开启家长端和教师端在localhost:8080和localhost:8081端口

## 修改host指向

```bash
sudo vi /etc/hosts
```

host文件中添加以下几行

```bash
127.0.0.1	localhost
127.0.0.1	mobile-teacher.adacampus.com
127.0.0.1	mobile-parent.adacampus.com
```

尝试访问: `http://www.example.com:8080`，**(注意尚未开启https)**, 应该能看到页面了,

如果不成，ping一下

```bash
ping www.example.com
```

```bash
64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=0.051 ms
64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.158 ms
```

## nginx反向代理

使用nginx来做反向代理，实现`https://www.mobile-parent.adacampus.com`的访问

### 安装nginx

官网：[nginx安装](https://www.nginx.com/resources/wiki/start/topics/tutorials/install/)

取决于系统以及安装过程，配置文件大概在以下几个位置

> /usr/local/nginx/conf, /etc/nginx或者 /usr/local/etc/nginx

### 生成ssl证书

[安装mkcert](https://github.com/FiloSottile/mkcert/blob/master/README.md#supported-root-stores)

cd到`nginx`安装目录的的`ssl`文件夹目录下

分别运行

```bash
mkcert -key-file key.pem -cert-file cert.pem mobile-parent.adacampus.com mobile-parent.adacampus.com
```

```bash
mkcert -key-file key.pem -cert-file cert.pem mobile-teacher.adacampus.com mobile-teacher.adacampus.com
```

出现下列信息就ok了

> Created a new certificate valid for the following names 📜

*   "mobile-parent.adacampus.com"
*   "mobile-parent.adacampus.com"

The certificate is at "cert.pem" and the key at "key.pem" ✅

### nginx配置

配置文件示例，家长端和教师端分别对应`8080`和`8081`

```nginx.conf

worker_processes  1;

events {
    worker_connections  1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;

    #gzip  on;
    
    # HTTPS server
    
    server {
       listen       443 ssl;
       server_name  mobile-parent.adacampus.com;
       proxy_buffering off;

       ssl_certificate      /usr/local/etc/nginx/ssl/mobile-parent.adacampus.com.pem;
       ssl_certificate_key  /usr/local/etc/nginx/ssl/mobile-parent.adacampus.com-key.pem;

       ssl_session_cache    shared:SSL:1m;
       ssl_session_timeout  5m;

       ssl_ciphers  HIGH:!aNULL:!MD5;
       ssl_prefer_server_ciphers  on;

       location / {
           root   html;
           index  index.html index.htm;
           proxy_pass          http://localhost:8080;
       }
    }

    server {
       listen       443 ssl;
       server_name  mobile-teacher.adacampus.com;
       proxy_buffering off;

       ssl_certificate      /usr/local/etc/nginx/ssl/mobile-teacher.adacampus.com.pem;
       ssl_certificate_key  /usr/local/etc/nginx/ssl/mobile-teacher.adacampus.com-key.pem;

       ssl_session_cache    shared:SSL:1m;
       ssl_session_timeout  5m;

       ssl_ciphers  HIGH:!aNULL:!MD5;
       ssl_prefer_server_ciphers  on;

       location / {
           root   html;
           index  index.html index.htm;
           proxy_pass          http://localhost:8081;
       }
    }
}

```

在浏览器中输入`https://www.mobile-parent.adacampus.com`，如果浏览器没有提示安全警告⚠️的话，就ok了

## 配置charles

需要分别在电脑和手机端安装charles证书， 具体可以参考[这里](https://juejin.cn/post/6844904106255974413)

完成之后，在手机微信上访问，`https://www.mobile-parent.adacampus.com`，如果能够抓包，那就证明可以成功访问电脑上开启的本地服务了

### 踩坑汇总

把server文件夹下的东西作为配置文件了，所以无法识别
![image.png](../../cloudimg/2019/debug-wechat-with-nginx-2.png)

<https://stackoverflow.com/questions/46127025/nginx-https-server-barfing-on-crt-and-key-files>

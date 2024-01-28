## 前言

本文总结 Nginx 的基本概念.

## 背景

Nginx（发音为"engine-x"）是一款由俄罗斯开发者 Igor Sysoev 创建的高性能、开源的 Web 服务器和反向代理服务器。它首次亮相于 2004 年，目的是解决 Apache 服务器在高并发和大规模负载下性能表现不佳的问题。Nginx 的设计理念注重轻量级、高并发和低内存消耗，使其成为处理静态资源和作为反向代理的理想选择。

## Nginx 的优势

- 高性能： Nginx 采用事件驱动的架构，能够轻松处理大量并发连接，适用于高负载的 Web 环境。
- 低内存消耗： 相比于其他 Web 服务器，Nginx 在高负载下表现出色，同时占用较少的内存。
- 模块化设计： Nginx 采用模块化的结构，允许用户根据需求选择性地添加功能，使其适应不同的应用场景。
- 反向代理和负载均衡： Nginx 的反向代理功能和负载均衡能力使其成为构建可靠、高可用性架构的理想选择。
- 灵活配置： Nginx 的配置简单直观，支持灵活的定制和调整，使管理员能够更好地控制服务器行为。
- 开源许可证： Nginx 以 2-clause BSD-like 许可证发布，可以免费使用，也可以作为商业软件发布。

## Nginx 主要应用场景

- 静态资源服务，通过本地文件系统提供服务
- 反向代理服务、负载均衡
- API 服务、权限控制，减少应用服务器压力

## 安装与使用

这里以 macOS 为例

```bash
# 安装
brew install nginx
# 启动
 brew services start nginx
# 停止
 brew services stop nginx
# 查看配置
nginx -t
# 检查Nginx是否运行
brew services list
```

下面从 Nginx 的功能以及实际场景触发看一看各个场景下 Nginx 可以提供给我们哪些配置项。

## 静态资源服务

### 静态资源服务的配置

```nginx

server {
    listen       80;
    server_name  localhost;

    #charset koi8-r;
    #access_log  /var/log/nginx/host.access.log  main;

    # 静态资源的路径
    location /static/ {
        root   /Users/chenxiaoyao6228/Downloads;
        index  index.html index.htm;
    }
}
```

## 正向代理与反向代理

两者的区别在于代理的对象不同：

1.  正向代理的对象时客户端，服务端看不到真正的客户端。
2.  反向代理的对象是服务端，客户端看不到真正的服务端

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2024/forward-proxy-vs-reverse-proxy.jpeg)

```nginx
server {
    listen       80;
    server_name  localhost;

    location / {
        proxy_pass http://localhost:8080;
    }
}
```

## 解决跨域

跨域是前端工程师都会面临的场景，跨域的解决方案有很多。不过要知道在生产中，要么使用 CORS，要么使用 Nginx 反向代理来解决跨域。

```nginx

server {
    listen 80;
    server_name your_domain.com;

    location / {
         # 允许的域。在这里，使用通配符\*表示允许任何域，你也可以指定具体的域名。
        add_header 'Access-Control-Allow-Origin' '*';
        # 允许的 HTTP 方法，如 GET、POST 等。
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
        # 允许的自定义请求头。
        add_header 'Access-Control-Allow-Headers' 'DNT,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type';
        # 表示是否允许发送 Cookie。如果前端请求中包含 Cookie，这个字段必须设置为 true。
        add_header 'Access-Control-Allow-Credentials' 'true';

        # 对预检请求（OPTIONS 请求）的处理，确保正常处理跨域时的预检请求
        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Max-Age' 1728000;
            add_header 'Content-Type' 'text/plain; charset=utf-8';
            add_header 'Content-Length' 0;
            return 204;
        }
    }
}

```

## Gzip

Gzip 是一种文件压缩格式，它可以将文件压缩后再传输，以减少传输的数据量,从而大大提高页面的加载速度和用户体验。

```nginx
location ~ .*\. (jpg|png|gif)$ {    
  gzip off; #关闭压缩    
  root /data/www/images;
}
location ~ .*\. (html|js|css)$ {    
  gzip on; #启用压缩    
  gzip_min_length 1k; # 超过1K的文件才压缩    
  gzip_http_version 1.1; # 启用gzip压缩所需的HTTP最低版本    
  gzip_comp_level 9; # 压缩级别，压缩比率越高，文件被压缩的体积越小    
  gzip_types text/css application/javascript; # 进行压缩的文件类型    
  root /data/www/html;
}
```

## 请求限制

Nginx 提供了一些模块和配置选项，可以用来实现对请求的限制，包括请求频率、连接数等。

### 限制请求频率

```nginx
http {

    limit_req_zone $binary_remote_addr zone=mylimit:10m rate=1r/s;

    server {

        location / {
            limit_req zone=mylimit burst=5;
            # 处理请求的配置
        }
    }
}
```

- limit_req_zone： 定义请求限制的区域和大小。上例中，使用客户端 IP 地址作为键，限制在 10MB 内存范围内，速率为每秒 1 个请求。

- limit_req： 设置请求限制，其中 zone 参数指定使用的限制区域。

- burst： 允许在超过速率限制时的短时间内接受的请求数。在上例中，允许每秒接受最多 5 个请求。

### 限制连接数

```nginx
http {
    limit_conn_zone $binary_remote_addr zone=myconn:10m;
    server {
        location / {
            limit_conn myconn 5;
            # 处理请求的配置
        }
    }
}

```

- limit_conn_zone： 定义连接数限制的区域和大小。上例中，使用客户端 IP 地址作为键，限制在 10MB 内存范围内。

- limit_conn： 设置连接数限制，其中 zone 参数指定使用的限制区域。在上例中，允许每个客户端 IP 最多 5 个并发连接。

## 访问控制

Nginx 提供了多种方式来进行访问控制，包括 IP 黑白名单、HTTP 基本认证、以及反向代理的一些配置。

### IP 黑白名单

在 Nginx 配置文件的 server 或 location 块中使用 allow 和 deny 指令，来设置 IP 黑白名单：

```nginx
http {
    server {
            location / {
            allow 192.168.1.1;   # 允许的IP地址
            deny all;            # 拒绝其它IP地址
            # 处理请求的配置
        }
    }
}
```

### HTTP 基本认证

通过 HTTP 基本认证，你可以设置用户名和密码，只有提供正确的凭证的用户才能访问

```nginx

http {
    server {
        location / {
            auth_basic "Restricted"; # 提示信息
            auth_basic_user_file /etc/nginx/.htpasswd; # 用户名和密码文件
            # 处理请求的配置
        }
    }
}
```

在这个例子中，auth_basic 设置了认证提示信息，而 auth_basic_user_file 指定了存储用户名和加密密码的文件，通常使用 htpasswd 工具生成。

### 反向代理中的访问控制

在反向代理中，你可以通过设置 proxy_set_header 指令，来控制客户端的访问权限。

```nginx
http {
    server {
        location / {
            proxy_pass http://backend_server;
            allow 192.168.1.1;
            deny all;
        }
    }
}
```

在这个例子中，只有 IP 地址为 192.168.1.1 的客户端被允许访问后端服务器，其它所有 IP 地址将被拒绝。

## 防盗链

防盗链是一种保护你的静态资源（如图片、视频等）免受未经授权的网站引用（盗链）的措施。Nginx 提供了一些配置选项，可以用来实现简单的防盗链机制。

```nginx
http {
    server {
        location ~* \.(gif|jpg|png)$ {
            valid_referers none blocked server_names *.example.com;
            if ($invalid_referer) {
                return 403;
            }
        }
    }
}
```

## 负载均衡 Load Balance

当我们的网站需要解决高并发、海量数据问题时，就需要使用负载均衡来调度服务器。将请求合理的分发到应用服务器集群中的一台台服务器上。

### 配置后端服务器

首先，配置多个后端服务器。在 Nginx 配置文件中，使用 upstream 块定义后端服务器的组：

```nginx
http {
    upstream backend {
        server backend1.example.com;
        server backend2.example.com;
        server backend3.example.com;
    }

    server {
        location / {
            proxy_pass http://backend;
            # 处理请求的配置
        }
    }
}
```

### 负载均衡算法

Nginx 默认使用轮询（Round Robin）算法进行负载均衡。如果需要使用其他负载均衡算法，可以在 upstream 块中添加 least_conn（最小连接数）等算法：

```nginx
upstream backend {
    least_conn;
    server backend1.example.com;
    server backend2.example.com;
    server backend3.example.com;
}
```

### 健康检查

如果希望 Nginx 定期检查后端服务器的健康状态，并自动将不健康的服务器从负载均衡中剔除，可以使用 nginx_http_healthcheck_module 模块或其他健康检查工具。

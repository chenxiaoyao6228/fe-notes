## 前言

SSL 价格并不便宜, 本节介绍如何使用 acme.sh 生成免费的 SSL 证书

## 证书生成原理

### CA && Let's Encrypt

证书颁发机构（CA，Certificate Authority）是一个负责颁发数字证书的实体。数字证书用于在互联网上验证实体的身份，确保通信的安全和可信性。

Let's Encrypt 是一个免费、自动化和开放的证书颁发机构 ，由互联网安全研究组（ISRG）运营。它的目标是通过提供免费的 SSL/TLS 证书，让 HTTPS 加密在互联网上变得更加普及和易于部署。以下是一些关于 Let's Encrypt 的关键点：

- 免费：Let's Encrypt 提供免费的 SSL/TLS 证书，不需要支付传统证书的费用。
- 自动化：通过 ACME 协议（Automatic Certificate Management Environment），可以自动申请、验证、安装和更新证书。
- 安全：帮助网站实现 HTTPS，加密用户与网站之间的通信，提高安全性。
- 开放：任何人都可以使用 Let's Encrypt 的服务，无需特殊权限或繁琐的申请流程。
- 社区支持：由许多大公司和组织支持，如 Mozilla、思科、Akamai 和 EFF（电子前沿基金会）。

### ACME 协议

ACME（Automatic Certificate Management Environment）协议是一种自动化方式，用于与证书颁发机构（CA，如 Let's Encrypt）进行交互，自动颁发、续订和管理证书。ACME 协议通过域名验证来证明你对域名的控制权。

### 域名验证

为了颁发证书，CA 需要验证你对请求证书的域名的控制权。ACME 支持多种验证方法，常见的有 HTTP-01、DNS-01 和 TLS-ALPN-01。

- HTTP-01: CA 会请求一个特定的 URL（例如 http://yourdomain.com/.well-known/acme-challenge/unique-token），你需要在服务器上提供一个包含特定内容的文件来响应这个请求。
- DNS-01: CA 会验证特定的 DNS TXT 记录（例如 \_acme-challenge.yourdomain.com），你需要在 DNS 服务器上添加这一记录来进行验证。

### 证书签发

通过验证后，CA 会生成并签发 SSL 证书，并将证书发送回给请求者。这个证书包含了域名的公钥信息，CA 对其进行签名，确保其真实性。

## 为 idea.chenxiaoyao.cn 添加证书

>🚧: update:  由于部份操作需要sudo, 建议切换到root用户

```bash
sudo su - root
```

下面用真实项目解释流程, 项目基本信息如下:

> idea.chenxiaoyao.cn # 项目域名, docker 部署, 3000 端口
> assets.chenxiaoyao.cn # cdn 域名, 用于主项目地资源存储

服务器为 aws 免费使用版(一年), 操作系统为 Ubuntu

域名在腾讯云上申请并使用, OSS 服务使用了阿里云


#### 服务器本地访问

首先启动服务, 确保可以访问

```bash
docker run -d --name idea -p 3000:3000 idea.chenxiaoyao.cn
```
`服务器`中使用curl测试

```bash
curl -I localhost:3000
```

> 确保你的安全组组允许3000端口, 否则需要添加

如果服务器配置了防火墙, 需要开放3000端口

 查看防火墙状态: `sudo ufw status`

 如果需要开放端口: `sudo ufw allow 3000/tcp`

#### 公网ip+端口访问

```bash
curl -I 13.57.xxx.xx:3000
```

#### 公网域名+端口访问

通过公网 ip+端口访问项目, 确保可以可以通过`域名+端口`访问

在腾讯云添加 A 记录值, 地址: https://console.cloud.tencent.com/cns

![https://github.com/chenxiaoyao6228/cloudimg/2024/acme-domain-a-record.png](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2024/acme-domain-a-record.png)

添加完之后尝试使用域名+端口访问项目, 比如

> http://idea.chenxiaoyao.cn:3000


### 服务器 acme.sh 安装

登录云服务器控制台, 可以通过控制台网页或者本地命令行登录

我这里使用了是本地命令行

```sh
ssh -i "xxxx.pem" ubuntu@xxxx.us-west-1.compute.amazonaws.com
```

安装 acme.sh, github 地址: https://github.com/acmesh-official/acme.sh

```sh
curl https://get.acme.sh | sh -s email=yorkchan6228@gmail.com
```

安装完成根目录会出现.acme.sh 文件夹，里面有一个文件，用于配置证书
![https://github.com/chenxiaoyao6228/cloudimg/2024/acme-install.png](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2024/acme-install.png)

### 获取密钥

腾讯云获取密钥: https://console.cloud.tencent.com/cam/capi, 点击新建, 复制到安全的地方

登录云服务器控制台

```sh
vi  .bashrc
```

添加下面两行

```sh
export Tencent_SecretId="<Your SecretId>"
export Tencent_SecretKey="<Your SecretKey>"
```

按`Esc`, `:wq`保存退出, 使用下面的命令重载

```sh
source .bashrc
```

### 生成证书

```sh
~/.acme.sh/acme.sh --issue --dns dns_tencent -d idea.chenxiaoyao.cn
```

对应的执行效果大概是这样
![https://github.com/chenxiaoyao6228/cloudimg/2024/acme-execute-cert-gen.png](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2024/acme-execute-cert-gen.png)

生成的证书会放在对应的文件夹下

![https://github.com/chenxiaoyao6228/cloudimg/2024/acme-cert.png](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2024/acme-cert.png)

也可以通过

```sh
nslookup -q=txt _acme-challenge.idea.chenxiaoyao.cn
```

结果类似下图
![https://github.com/chenxiaoyao6228/cloudimg/2024/acme-cert-text-record.png](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2024/acme-cert-text-record.png)


### nginx 部署证书

安装 nginx

```sh
sudo apt update
sudo apt install nginx
```

`nginx -t`获取 nginx 配置地址

> /etc/nginx/nginx.conf

使用`vi /etc/nginx/nginx.conf`编辑配置, 或者使用`vscode ssh`, 更加方便

```bash
mkdir -p /etc/nginx/ssl

~/.acme.sh/acme.sh --install-cert -d idea.chenxiaoyao.cn \
--key-file       /etc/nginx/ssl/idea.chenxiaoyao.cn.key  \
--fullchain-file /etc/nginx/ssl/idea.chenxiaoyao.cn.cer
```


在`http{}`中添加以下配置, server1 是保证可以通过 http 访问, server2 是保证可以通过 https 访问

```nginx.conf
http {

# 省略其他配置

server {
    listen 80;
    server_name idea.chenxiaoyao.cn;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name idea.chenxiaoyao.cn;

    ssl_certificate /etc/nginx/ssl/idea.chenxiaoyao.cn.cer;
    ssl_certificate_key /etc/nginx/ssl/idea.chenxiaoyao.cn.key;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

}

```
配置完成后重启 nginx

```sh
nginx -t # 看配置是否生效
sudo systemctl restart nginx # 重启nginx
```

至此, 你就可以访问 `https://idea.chenxiaoyao.cn` 了

## 为 assets.chenxiaoyao.cn 添加证书

### 关闭 nginx

acme.sh 会启动一个 服务，用于验证域名的控制权, 因此要避免端口占用

![https://github.com/chenxiaoyao6228/cloudimg/2024/acme-nginx.png](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2024/acme-nginx.png)

```sh
sudo systemctl stop nginx
```

### 生成证书

注意我们域名解析用的还是腾讯云

```sh
acme.sh --issue --dns dns_tencent -d assets.chenxiaoyao.cn
```

证书生成之后可以到对应的文件夹查看

### 阿里云添加证书

地址在: https://cdn.console.aliyun.com/safety/https

但是 web 端已经不支持自签了, 只能通过 cli

![https://github.com/chenxiaoyao6228/cloudimg/2024/aliyun-https-cdn.png](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2024/aliyun-https-cdn.png)

#### 获取 aliyun access key

登录 https://ram.console.aliyun.com/manage/ak

生成 access key 保存到安全的地方

我这里用的是 acess key, 安全起见你可以尝试`子用户AcessKey`的方式

#### 下载 aliyun cli

具体可以参考: https://github.com/aliyun/aliyun-cli?tab=readme-ov-file

```sh
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/aliyun/aliyun-cli/HEAD/install.sh)"
```

安装完成之后可以使用 `aliyun` 命令测试下

#### aliyun configure

![https://github.com/chenxiaoyao6228/cloudimg/2024/aliyun-cli-config.png](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2024/aliyun-cli-config.png)

#### 上传证书

服务器新建`upload_cert_to_aliyun.sh`

```bash
#!/usr/bin/env bash

# 域名变量
DOMAIN="assets.chenxiaoyao.cn"

# 替换为您的证书文件路径
CERT_FULLCHAIN_PATH="$HOME/.acme.sh/${DOMAIN}_ecc/fullchain.cer"
CERT_KEY_PATH="$HOME/.acme.sh/${DOMAIN}_ecc/${DOMAIN}.key"

# 获取证书内容的自定义函数
get_cert() {
    # 使用 sed 删除掉证书文件的空行
    sed -e "/^$/d" "$CERT_FULLCHAIN_PATH"
}

# 获取密钥内容的自定义函数
get_key() {
    cat "$CERT_KEY_PATH"
}

# 证书名称 (替换域名的 . 为 _，以符合阿里云证书名称规范)
CERT_NAME="${DOMAIN//./_}-$(date +%s)"

# 需要更新证书的 CDN 域名列表
DOMAIN_LIST=(
    "$DOMAIN"
)

# 设置 CDN 域名列表使用新的证书
for _domain in "${DOMAIN_LIST[@]}"; do
    aliyun cdn SetCdnDomainSSLCertificate --DomainName "$_domain" --SSLPub="$(get_cert)" --SSLPri="$(get_key)" --CertType upload --SSLProtocol on || exit 103
done

echo "证书已成功上传并配置到 CDN 域名。"
```

执行

```bash
chmod +x upload_cert_to_aliyun.sh
./upload_cert_to_aliyun.sh
```

上传完成, 到控制台去看, 发现已经有了

![https://github.com/chenxiaoyao6228/cloudimg/2024/aliyun-https-cdn-success.png](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2024/aliyun-https-cdn-success.png)
 
上传图片测试, 可以看到 https 已经启用了

![https://github.com/chenxiaoyao6228/cloudimg/2024/aliyun-https-cdn-success-cat-test.png](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2024/aliyun-https-cdn-success-cat-test.png)

#### nginx 服务恢复

证书生成之后记得恢复 nginx 服务, 不然`idea.chenxiaoyao.cn`等其他服务挂了

```bash
sudo systemctl restart nginx
```

## 参考

[acme.sh](https://github.com/acmesh-official/acme.sh)

[aliyun cli](https://github.com/aliyun/aliyun-cli?tab=readme-ov-file)

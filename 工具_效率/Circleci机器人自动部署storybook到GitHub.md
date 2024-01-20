## 前言

本文主要介绍如何使用 circleci 机器人自动部署 storybook 到 github pages

## 工作流

- 每次开发都开新分支，开发完之后 git pull -r origin master, git push
- create pr
- ci 跑测试
- 测试之后等待 mr, 合并之后 ci 跑 build_and_deploy 命令

## 需求

- 每次提交都会触发 ci 的 test
- 在 pr 进行 merge 之后与在 master 的提交进行自动部署, 其他情况下不部署

## yml 语法与 circleCI 配置：

- yml 语法： http://www.ruanyifeng.com/blog/2016/07/yaml.html
- circleci 配置文档： https://circleci.com/docs/2.0/concepts/#configuration

## 本地校验你的 circleci 配置文件

安装 cli, 参见： https://circleci.com/docs/2.0/local-cli/

```bash
# mac
brew install circleci
```

确保你的配置 文件在 .circleci/config.yml， 之后项目的根路径下跑

```bash
circleci config validate
```

https://support.circleci.com/hc/en-us/articles/360006735753-Validating-your-CircleCI-Configuration

## github 授权

生成 ssh key， 将邮箱换成自己的

```bash
ssh-keygen -m PEM -t rsa -b 4096 -C "chenxiaoyao6228@163.com"
```

circleci 的要求 passphrase 不填，因此直接回车

![](../../cloudimg/2023/mac-ssh-key.jpg)

进入到 ssh 对应的文件夹，

```bash
cd ~/.ssh
```

打印公钥并复制

```bash
cat id_ed25591_circleci.pub
```

在 github 项目的配置中

![](../../cloudimg/2023/github-deploy-key.jpg)

添加示例

![](../../cloudimg/2023/github-deploy-key-demo.jpg)

打印私钥并复制

```bash
cat id_ed25591_circleci
```

在 circleci 中找到对应的项目，添加你的私钥配置

![](../../cloudimg/2023/circel-ci-private-key.jpg)

填完完成之后如图

![](../../cloudimg/2023/circel-ci-private-key-finish.jpg)

合并 pull request 之后就可以在 circleci 中看到了

![](../../cloudimg/2023/circel-ci-pr.jpg)

build:storybook 部署到 github page 没有使用官方的工具，而是自己写了个 sh 脚本， 需要在 circleci 上建立这样一个环境变量 GITHUB_TOKEN, 用的就是刚刚的私钥

```bash
#!/usr/bin/env sh

# throw error
set -e

# build static

cd ./dist

git config --global user.email "chenxiaoyao6228@163.com"
git config --global user.name "chenxiaoyao6228"

git init
git add -A
git commit -m 'deploy-to-github'

git push -f https://${GITHUB_TOKEN}@github.com/chenxiaoyao6228/graceful-ui.git master:gh-pages

cd -

rm -rf ./dist
```

## 参考

- https://www.learnstorybook.com/intro-to-storybook/react/en/deploy/
- https://kasper.io/host-storybook-with-circleci-and-github-deployments/
- https://github.com/storybookjs/storybook-deployer/issues/59

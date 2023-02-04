---
permalink: 2023-01-20-git-submodule
title: git-submodule
date: 2023-01-20
categories:
  - tech
tags:
  - git
---

## Preface

I have two repositories, the `fe-notes` and `blog`, I want the former to be a pure git repo to store my articles, and the latter as my website build-kit, which is using Vuepress as the site generator currently but might change to other tools someday.

If you happen to come across a situation like this, the _Git submodule_ comes in handy.

## Add Submodule

```sh
git submodule add git@github.com:chenxiaoyao6228/fe-notes.git blog
```

### Check Submodule

```sh
git submodule
```

> 1811e0f3eb3098a683228fc9461eb4bb1e05d5f1 blogs (heads/main)

### Update Submodule

### commit to submodule

cd to submodules and make commit as usual

### update submodule from remote

solutions1:

```
cd submodulePath
git fetch
git merge origin/master
```

solutions2:

```sh
# git will checkout to child submodule and update
 git submodule update --remote
```

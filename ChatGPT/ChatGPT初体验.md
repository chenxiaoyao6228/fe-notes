---
date: 2023-03-26
permalink: 2023-03-26-chatgpt-first-glance
title: ChatGPT初体验
categories:
  - tech
tags:
  - ChatGPT
---

## 序言

各种技术群的大佬们都在积极安利 ChatGPT, 后知后觉的我终于开始上手了。用过之后确实很香！

## 注册&&使用

因为某些广为人知原因，很重要的一点，在登录 chatGPT 官网前，记得先开梯子选择非中国大陆以及港台地区，不然就会报'Service unavailable in your country'的错误，如果你已经遇到了，解决方法也简单： 清除 localStrage， 然后重新登录即可。

接下来的注册步骤可以参考这个[帖子](https://cloud.tencent.com/developer/article/2187653), 唯一的区别现在已经最低起充**2 美刀**了。

使用的过程中也要时刻注意自己的所在的 IP，我在使用 OpenAI translator 的时候就被警告过了一次。

## 使用场景

### 生成学习计划

这里主要总结了这个[视频](https://www.youtube.com/watch?v=VznoKyh6AXs)里面的内容，感兴趣的朋友可以看看原视频。

为了让 chatGPT 生成的计划更加符合个人需求， 建议输入需求的时候遵循**5W 法则**

- 谁(Who)：你想让聊天 GPT 扮演什么角色
- 什么(What)：你究竟想要学什么
- 何时(When)：你的时间安排是什么样的
- 在哪里(Where)：你在哪里学习这些东西？你有什么偏好吗？偏好在线课程，还是免费课程？
- 为什么(Why)：你的目标是什么

作者举了一个这样的例子：

> Act as a coding tutor that creates study plans to help people learn to code.You will be
> provided with the goal of the student,their time commitment,and resource preferences.
> You will create a study plan with timelines and links to resources.Only include relevant
> resources because time is limited.My first request-"I want to become a data scientist
> but I do not know how to code.I can study 10 hours per week and only want video
> resources.I want to learn to code in python.Create a study plan for me."

### Prompt engineering

让 chatGPT 生成代码，我这里让 chatGPT 生成了一段 vdom 转 fiber 的代码

我的提问：

> how to convert a virtual dom tree to a linked-list with its parent as the return node and next child node as sibling

ChatGPT 回答(有代码实现有 testCase 有注释有思路分析，简直了！):

> Here is a sample code in JavaScript to convert a virtual DOM tree into a linked list with parent and children relationships:

```js
function createLinkedList(node, parent) {
  let head = null;
  let curr = null;

  if (!node) {
    return;
  }

  // create a new ListNode for the current node
  // and assign the parent node as its parent
  const listNode = new ListNode(node, parent);

  // if head is null, then the current node is
  // the first node in the linked list
  if (!head) {
    head = listNode;
    curr = listNode;
  } else {
    // otherwise, set the next sibling of the current node
    curr.next = listNode;
    // set the current node to the new node
    curr = curr.next;
  }

  // recursively process the current node's children
  if (Array.isArray(node.children) && node.children.length > 0) {
    for (let child of node.children) {
      createLinkedList(child, listNode);
    }
  }

  // return the head of the linked list
  return head;
}

// Sample usage
const node = {
  tagName: "div",
  attributes: { class: "container" },
  children: [
    {
      tagName: "ul",
      children: [
        { tagName: "li", children: [{ text: "List item 1" }] },
        { tagName: "li", children: [{ text: "List item 2" }] },
      ],
    },
    { tagName: "p", children: [{ text: "Paragraph text" }] },
  ],
};

const listHead = createLinkedList(node, null);
console.log(listHead);
```

> The output will be a linked list with nodes representing each element in the virtual DOM tree, with each node having a reference to its parent and child nodes (if any). You can customize the `ListNode` class as per your requirement.

有一点就是同一个问题 chatGPT 每次的返回可能还不一样。

这方面看到[Phodal 大佬]一直在发这方面的[文章](https://mp.weixin.qq.com/mp/appmsgalbum?__biz=MjM5Mjg4NDMwMA==&action=getalbum&album_id=2816917797762154499&scene=173&from_msgid=2652978497&from_itemidx=1&count=3&nolastread=1#wechat_redirect)，后续会继续研究下。

### 让 chatGPT 解释概念

这个在学习新概念的时候很有用，可以一步步提问直到你懂为止。

## 应用&插件

### [Code GPT](https://marketplace.visualstudio.com/items?itemName=DanielSanMedium.dscodegpt)

chatGPT的vscode集成， 添加API key就能够使用，程序员效率提升的利器

### [Voice Control for ChatGPT](https://chrome.google.com/webstore/detail/voice-control-for-chatgpt/eollffkcakegifhacjnlnegohfdlidhn/related)

这是我用的第一个插件， 主要目的是为了看看用 chatGPT 练习口语的效果如果， 从实验的结果来看，还是很牛皮的. 相当于有了一个家庭教师。但是前提是**你的发音要相对标准，能够让语音转文字软件准确识别**，才能有相对好的效果.

<video width="320" height="240" controls>
  <source src="https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/chatGTP-voice-conversation.mp4" type="video/mp4">
</video>

### [OpenAI translator](https://github.com/yetone/openai-translator)

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/open-ai-translator-usage-1.png)

### [ChatGPT for Google](https://chrome.google.com/webstore/detail/chatgpt-for-google/jgjaeacdkonaoafenlfkkkmbaopkbilf)

集成谷歌搜索

## 总结

总的来说，ChatGPT 还是能提升一定的工作效率的，随着 ChatGPT 开放插件市场，相信在不久的将来我们会遇见更多的可能。

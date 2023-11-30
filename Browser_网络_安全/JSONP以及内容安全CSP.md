

##### 跨域是前端开发中比较常遇到的问题了,跨域根源来自于浏览器的同源限制,要了解同源策略,首先要搞清楚的就是:**什么是同源?**

##### 同源简单来说就是: **同协议,同域名,同端口**


下表给出了相对**http://store.company.com/dir/page.html**同源检测的示例:
![在这里插入图片描述](https://img-blog.csdnimg.cn/20181216173245271.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3podWFueWVtYW5vbmc=,size_16,color_FFFFFF,t_70)

#### 同源策略:
> 一个源内的脚本仅仅具有本源内资源的权限，而无法访问其它域的资源。


#### 为什么要有同源策略?
**一言以蔽之: 安全**.我们知道,**http是无状态协议,**,服务端对客户端的识别是通过储存在浏览器端的**SessionKey**。假设你在许多网站登录了你的个人账号而又不小心打开了一个恶意链接,此时如果没有浏览器的同源策略,那么这个恶意网站就能通过js访问document.cookie得到你各个网站的SessionKey,并且通过已经建立好的session连接进行攻击,盗取个人信息,资金等,这就是俗称的CSRF攻击.
#### 安全性与可用性的取舍
按照上述**源内的脚本仅有访问本源内资源**的说法,我们的页面使用了jquery等第三方脚本,使用的是百度cdn等源,为什么我们的页面可以加载这些的文件呢?同源策略说不通啊?原因在于浏览器在**安全性**和**可用性**之间做了取舍,众所周知,对于小项目而言,我们可以把所有资源都放在自有服务器上面,但是对于中等乃至大型项目而言,由于服务器的价格昂贵,我们项目的静态资源文件如图片和视频等是需要托管在第三方来削减运营成本的.因此浏览器在遵循安全性的基础上,放宽了限制,允许img,script,style标签进行跨域引用资源.
#### jsonp
jsonp(json with padding, 忽略这个不知所谓的全称),是一种利用script等标签没有跨域限制进行第三方通讯的技术。

#### jsonp基本实现思路
每一个JSONP请求就是动态的创建script元素，拼接传入的参数生成url字符串,然后通过src属性去加载数据，通过callback这个回调方法来返回服务器数据，然后再把script标签移除。换成代码就是
```
function JSONP({  
  url,
  params,
  callbackKey,
  callback
}) {
  // 在参数里制定 callback 的名字
  params = params || {}
  params[callbackKey] = 'jsonpCallback'
  // 预留 callback
  window.jsonpCallback = callback
  // 拼接参数字符串
  const paramKeys = Object.keys(params)
  const paramString = paramKeys
    .map(key => `${key}=${params[key]}`)
    .join('&')
  // 插入 DOM 元素
  const script = document.createElement('script')
  script.setAttribute('src', `${url}?${paramString}`)
  document.body.appendChild(script)
}
//调用示例:
JSONP({  
  url: 'http://s.weibo.com/ajax/jsonp/suggestion',
  params: {
    key: 'test',
  },
  callbackKey: '_cb',
  callback(result) {
    console.log(result.data)
  }
})
```
参考资料:
- https://www.zhihu.com/question/28890257
- https://developer.mozilla.org/zh-CN/docs/Web/Security/Same-origin_policy
- https://www.zhihu.com/search?type=content&q=jsonp%E5%AE%9E%E7%8E%B0%20
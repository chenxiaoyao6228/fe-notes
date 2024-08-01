








# fe-notes(前端开发笔记)

> I'm a slow walker, but I never walk backwards. — Abragam Lincoln.

本仓库旨在收集整理前端基础知识以及开发实践。包括前端八股，最佳实践，踩坑汇总等，既有完整的系列，也有零碎的思考。










## 目录
- Browser_网络_安全
  - [0-从输入 URL 到浏览器渲染发生了什么](Browser_%E7%BD%91%E7%BB%9C_%E5%AE%89%E5%85%A8%2F0-%E4%BB%8E%E8%BE%93%E5%85%A5%20URL%20%E5%88%B0%E6%B5%8F%E8%A7%88%E5%99%A8%E6%B8%B2%E6%9F%93%E5%8F%91%E7%94%9F%E4%BA%86%E4%BB%80%E4%B9%88.md)
  - [Cookie](Browser_%E7%BD%91%E7%BB%9C_%E5%AE%89%E5%85%A8%2FCookie.md)
  - [DNS解析](Browser_%E7%BD%91%E7%BB%9C_%E5%AE%89%E5%85%A8%2FDNS%E8%A7%A3%E6%9E%90.md)
  - [HTTP1](Browser_%E7%BD%91%E7%BB%9C_%E5%AE%89%E5%85%A8%2FHTTP1.md)
  - [HTTP2](Browser_%E7%BD%91%E7%BB%9C_%E5%AE%89%E5%85%A8%2FHTTP2.md)
  - [HTTP3](Browser_%E7%BD%91%E7%BB%9C_%E5%AE%89%E5%85%A8%2FHTTP3.md)
  - [HTTPS](Browser_%E7%BD%91%E7%BB%9C_%E5%AE%89%E5%85%A8%2FHTTPS.md)
  - [JS中的执行原理-变量提升、调用栈、作用域以及闭包](Browser_%E7%BD%91%E7%BB%9C_%E5%AE%89%E5%85%A8%2FJS%E4%B8%AD%E7%9A%84%E6%89%A7%E8%A1%8C%E5%8E%9F%E7%90%86-%E5%8F%98%E9%87%8F%E6%8F%90%E5%8D%87%E3%80%81%E8%B0%83%E7%94%A8%E6%A0%88%E3%80%81%E4%BD%9C%E7%94%A8%E5%9F%9F%E4%BB%A5%E5%8F%8A%E9%97%AD%E5%8C%85.md)
  - [Nginx必知必会](Browser_%E7%BD%91%E7%BB%9C_%E5%AE%89%E5%85%A8%2FNginx%E5%BF%85%E7%9F%A5%E5%BF%85%E4%BC%9A.md)
  - [SSE(server-send-event)](Browser_%E7%BD%91%E7%BB%9C_%E5%AE%89%E5%85%A8%2FSSE(server-send-event).md)
  - [TCP三次握手四次挥手](Browser_%E7%BD%91%E7%BB%9C_%E5%AE%89%E5%85%A8%2FTCP%E4%B8%89%E6%AC%A1%E6%8F%A1%E6%89%8B%E5%9B%9B%E6%AC%A1%E6%8C%A5%E6%89%8B.md)
  - [webRTC](Browser_%E7%BD%91%E7%BB%9C_%E5%AE%89%E5%85%A8%2FwebRTC.md)
  - [web安全-内容安全策略CSP](Browser_%E7%BD%91%E7%BB%9C_%E5%AE%89%E5%85%A8%2Fweb%E5%AE%89%E5%85%A8-%E5%86%85%E5%AE%B9%E5%AE%89%E5%85%A8%E7%AD%96%E7%95%A5CSP.md)
  - [web安全-同源策略与跨域解决](Browser_%E7%BD%91%E7%BB%9C_%E5%AE%89%E5%85%A8%2Fweb%E5%AE%89%E5%85%A8-%E5%90%8C%E6%BA%90%E7%AD%96%E7%95%A5%E4%B8%8E%E8%B7%A8%E5%9F%9F%E8%A7%A3%E5%86%B3.md)
  - [web安全-点击劫持](Browser_%E7%BD%91%E7%BB%9C_%E5%AE%89%E5%85%A8%2Fweb%E5%AE%89%E5%85%A8-%E7%82%B9%E5%87%BB%E5%8A%AB%E6%8C%81.md)
  - [web安全渗透之CSRF](Browser_%E7%BD%91%E7%BB%9C_%E5%AE%89%E5%85%A8%2Fweb%E5%AE%89%E5%85%A8%E6%B8%97%E9%80%8F%E4%B9%8BCSRF.md)
  - [web安全渗透之XSS](Browser_%E7%BD%91%E7%BB%9C_%E5%AE%89%E5%85%A8%2Fweb%E5%AE%89%E5%85%A8%E6%B8%97%E9%80%8F%E4%B9%8BXSS.md)
  - [web缓存-CDN缓存以及回源机制](Browser_%E7%BD%91%E7%BB%9C_%E5%AE%89%E5%85%A8%2Fweb%E7%BC%93%E5%AD%98-CDN%E7%BC%93%E5%AD%98%E4%BB%A5%E5%8F%8A%E5%9B%9E%E6%BA%90%E6%9C%BA%E5%88%B6.md)
  - [web缓存](Browser_%E7%BD%91%E7%BB%9C_%E5%AE%89%E5%85%A8%2Fweb%E7%BC%93%E5%AD%98.md)
  - [加密算法](Browser_%E7%BD%91%E7%BB%9C_%E5%AE%89%E5%85%A8%2F%E5%8A%A0%E5%AF%86%E7%AE%97%E6%B3%95.md)
  - [响应头状态码](Browser_%E7%BD%91%E7%BB%9C_%E5%AE%89%E5%85%A8%2F%E5%93%8D%E5%BA%94%E5%A4%B4%E7%8A%B6%E6%80%81%E7%A0%81.md)
  - [浏览器的多进程架构](Browser_%E7%BD%91%E7%BB%9C_%E5%AE%89%E5%85%A8%2F%E6%B5%8F%E8%A7%88%E5%99%A8%E7%9A%84%E5%A4%9A%E8%BF%9B%E7%A8%8B%E6%9E%B6%E6%9E%84.md)
  - [理解HTTP中的Content-type](Browser_%E7%BD%91%E7%BB%9C_%E5%AE%89%E5%85%A8%2F%E7%90%86%E8%A7%A3HTTP%E4%B8%AD%E7%9A%84Content-type.md)
  - [理解get和post](Browser_%E7%BD%91%E7%BB%9C_%E5%AE%89%E5%85%A8%2F%E7%90%86%E8%A7%A3get%E5%92%8Cpost.md)
  - [跨域验证的方案](Browser_%E7%BD%91%E7%BB%9C_%E5%AE%89%E5%85%A8%2F%E8%B7%A8%E5%9F%9F%E9%AA%8C%E8%AF%81%E7%9A%84%E6%96%B9%E6%A1%88.md)
  - [长轮询(Long polling)](Browser_%E7%BD%91%E7%BB%9C_%E5%AE%89%E5%85%A8%2F%E9%95%BF%E8%BD%AE%E8%AF%A2(Long%20polling).md)
- Webpack
  - [1-实现mini-webpack](Webpack%2F1-%E5%AE%9E%E7%8E%B0mini-webpack.md)
  - [2-webpack中loader的运行机制](Webpack%2F2-webpack%E4%B8%ADloader%E7%9A%84%E8%BF%90%E8%A1%8C%E6%9C%BA%E5%88%B6.md)
  - [3-webpack中的tabpable](Webpack%2F3-webpack%E4%B8%AD%E7%9A%84tabpable.md)
  - [AMD与RequireJS](Webpack%2FAMD%E4%B8%8ERequireJS.md)
  - [CMD与SeaJS](Webpack%2FCMD%E4%B8%8ESeaJS.md)
  - [CommonJS与Node](Webpack%2FCommonJS%E4%B8%8ENode.md)
  - [ES6-module](Webpack%2FES6-module.md)
  - [Tree-shaking工作原理](Webpack%2FTree-shaking%E5%B7%A5%E4%BD%9C%E5%8E%9F%E7%90%86.md)
  - [UMD](Webpack%2FUMD.md)
  - [package.json中模块化相关的字段](Webpack%2Fpackage.json%E4%B8%AD%E6%A8%A1%E5%9D%97%E5%8C%96%E7%9B%B8%E5%85%B3%E7%9A%84%E5%AD%97%E6%AE%B5.md)
  - [vite的工作原理](Webpack%2Fvite%E7%9A%84%E5%B7%A5%E4%BD%9C%E5%8E%9F%E7%90%86.md)
  - [webpack动态加载](Webpack%2Fwebpack%E5%8A%A8%E6%80%81%E5%8A%A0%E8%BD%BD.md)
  - [webpack模块联邦原理](Webpack%2Fwebpack%E6%A8%A1%E5%9D%97%E8%81%94%E9%82%A6%E5%8E%9F%E7%90%86.md)
  - [重新梳理前端模块化](Webpack%2F%E9%87%8D%E6%96%B0%E6%A2%B3%E7%90%86%E5%89%8D%E7%AB%AF%E6%A8%A1%E5%9D%97%E5%8C%96.md)
- Canvas
  - [Excalidraw初探](Canvas%2FExcalidraw%E5%88%9D%E6%8E%A2.md)
  - [canvas中的图片处理](Canvas%2Fcanvas%E4%B8%AD%E7%9A%84%E5%9B%BE%E7%89%87%E5%A4%84%E7%90%86.md)
  - [canvas使用贝塞尔曲线优化自由画笔并探究其原理](Canvas%2Fcanvas%E4%BD%BF%E7%94%A8%E8%B4%9D%E5%A1%9E%E5%B0%94%E6%9B%B2%E7%BA%BF%E4%BC%98%E5%8C%96%E8%87%AA%E7%94%B1%E7%94%BB%E7%AC%94%E5%B9%B6%E6%8E%A2%E7%A9%B6%E5%85%B6%E5%8E%9F%E7%90%86.md)
  - [canvas元素选中与碰撞检测算法](Canvas%2Fcanvas%E5%85%83%E7%B4%A0%E9%80%89%E4%B8%AD%E4%B8%8E%E7%A2%B0%E6%92%9E%E6%A3%80%E6%B5%8B%E7%AE%97%E6%B3%95.md)
  - [canvas入门指北](Canvas%2Fcanvas%E5%85%A5%E9%97%A8%E6%8C%87%E5%8C%97.md)
  - [canvas坐标及无限画布的原理](Canvas%2Fcanvas%E5%9D%90%E6%A0%87%E5%8F%8A%E6%97%A0%E9%99%90%E7%94%BB%E5%B8%83%E7%9A%84%E5%8E%9F%E7%90%86.md)
  - [canvas实现撤销重做](Canvas%2Fcanvas%E5%AE%9E%E7%8E%B0%E6%92%A4%E9%94%80%E9%87%8D%E5%81%9A.md)
  - [canvas尺寸](Canvas%2Fcanvas%E5%B0%BA%E5%AF%B8.md)
  - [canvas性能优化](Canvas%2Fcanvas%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96.md)
  - [canvas性能分析的手段](Canvas%2Fcanvas%E6%80%A7%E8%83%BD%E5%88%86%E6%9E%90%E7%9A%84%E6%89%8B%E6%AE%B5.md)
  - [canvas文本渲染](Canvas%2Fcanvas%E6%96%87%E6%9C%AC%E6%B8%B2%E6%9F%93.md)
  - [canvas画布擦除功能](Canvas%2Fcanvas%E7%94%BB%E5%B8%83%E6%93%A6%E9%99%A4%E5%8A%9F%E8%83%BD.md)
- 性能优化
  - [0-README](%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%2F0-README.md)
  - [CSS优化](%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%2FCSS%E4%BC%98%E5%8C%96.md)
  - [GPU加速](%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%2FGPU%E5%8A%A0%E9%80%9F.md)
  - [Gzip工作原理](%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%2FGzip%E5%B7%A5%E4%BD%9C%E5%8E%9F%E7%90%86.md)
  - [React profile优化React应用](%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%2FReact%20profile%E4%BC%98%E5%8C%96React%E5%BA%94%E7%94%A8.md)
  - [React代码优化](%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%2FReact%E4%BB%A3%E7%A0%81%E4%BC%98%E5%8C%96.md)
  - [css优化](%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%2Fcss%E4%BC%98%E5%8C%96.md)
  - [react-ssr原理分析](%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%2Freact-ssr%E5%8E%9F%E7%90%86%E5%88%86%E6%9E%90.md)
  - [script标签中的async与defer](%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%2Fscript%E6%A0%87%E7%AD%BE%E4%B8%AD%E7%9A%84async%E4%B8%8Edefer.md)
  - [webpack构建优化](%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%2Fwebpack%E6%9E%84%E5%BB%BA%E4%BC%98%E5%8C%96.md)
  - [web资源加载优先级](%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%2Fweb%E8%B5%84%E6%BA%90%E5%8A%A0%E8%BD%BD%E4%BC%98%E5%85%88%E7%BA%A7.md)
  - [回流与重绘](%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%2F%E5%9B%9E%E6%B5%81%E4%B8%8E%E9%87%8D%E7%BB%98.md)
  - [图片优化](%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%2F%E5%9B%BE%E7%89%87%E4%BC%98%E5%8C%96.md)
  - [性能优化的指标](%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%2F%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%E7%9A%84%E6%8C%87%E6%A0%87.md)
  - [性能检测指标与工具](%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%2F%E6%80%A7%E8%83%BD%E6%A3%80%E6%B5%8B%E6%8C%87%E6%A0%87%E4%B8%8E%E5%B7%A5%E5%85%B7.md)
  - [用户交互体验优化](%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96%2F%E7%94%A8%E6%88%B7%E4%BA%A4%E4%BA%92%E4%BD%93%E9%AA%8C%E4%BC%98%E5%8C%96.md)
- Javascript
  - [ES-Next 新特性](Javascript%2FES-Next%20%E6%96%B0%E7%89%B9%E6%80%A7.md)
  - [HTML中的焦点管理](Javascript%2FHTML%E4%B8%AD%E7%9A%84%E7%84%A6%E7%82%B9%E7%AE%A1%E7%90%86.md)
  - [JS 中的事件捕获与冒泡](Javascript%2FJS%20%E4%B8%AD%E7%9A%84%E4%BA%8B%E4%BB%B6%E6%8D%95%E8%8E%B7%E4%B8%8E%E5%86%92%E6%B3%A1.md)
  - [JS中使用IndexDB](Javascript%2FJS%E4%B8%AD%E4%BD%BF%E7%94%A8IndexDB.md)
  - [JS中的BigInt](Javascript%2FJS%E4%B8%AD%E7%9A%84BigInt.md)
  - [JS中的proxy和defineProperty](Javascript%2FJS%E4%B8%AD%E7%9A%84proxy%E5%92%8CdefineProperty.md)
  - [JS中的二进制](Javascript%2FJS%E4%B8%AD%E7%9A%84%E4%BA%8C%E8%BF%9B%E5%88%B6.md)
  - [JS中的位运算](Javascript%2FJS%E4%B8%AD%E7%9A%84%E4%BD%8D%E8%BF%90%E7%AE%97.md)
  - [JS中的类型转换](Javascript%2FJS%E4%B8%AD%E7%9A%84%E7%B1%BB%E5%9E%8B%E8%BD%AC%E6%8D%A2.md)
  - [JS中的精度问题](Javascript%2FJS%E4%B8%AD%E7%9A%84%E7%B2%BE%E5%BA%A6%E9%97%AE%E9%A2%98.md)
  - [JS实现多条件排序](Javascript%2FJS%E5%AE%9E%E7%8E%B0%E5%A4%9A%E6%9D%A1%E4%BB%B6%E6%8E%92%E5%BA%8F.md)
  - [JS正则表达式速查笔记](Javascript%2FJS%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F%E9%80%9F%E6%9F%A5%E7%AC%94%E8%AE%B0.md)
  - [Set和Map](Javascript%2FSet%E5%92%8CMap.md)
    - UnderScore源码
      - [underscore源码学习笔记(一)如何读underscore源码](Javascript%2FUnderScore%E6%BA%90%E7%A0%81%2Funderscore%E6%BA%90%E7%A0%81%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0(%E4%B8%80)%E5%A6%82%E4%BD%95%E8%AF%BBunderscore%E6%BA%90%E7%A0%81.md)
      - [underscore源码学习笔记(三)初始化以及两种调用方式](Javascript%2FUnderScore%E6%BA%90%E7%A0%81%2Funderscore%E6%BA%90%E7%A0%81%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0(%E4%B8%89)%E5%88%9D%E5%A7%8B%E5%8C%96%E4%BB%A5%E5%8F%8A%E4%B8%A4%E7%A7%8D%E8%B0%83%E7%94%A8%E6%96%B9%E5%BC%8F.md)
      - [underscore源码学习笔记(二)几个helper函数](Javascript%2FUnderScore%E6%BA%90%E7%A0%81%2Funderscore%E6%BA%90%E7%A0%81%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0(%E4%BA%8C)%E5%87%A0%E4%B8%AAhelper%E5%87%BD%E6%95%B0.md)
      - [underscore源码学习笔记(五)Array相关的方法](Javascript%2FUnderScore%E6%BA%90%E7%A0%81%2Funderscore%E6%BA%90%E7%A0%81%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0(%E4%BA%94)Array%E7%9B%B8%E5%85%B3%E7%9A%84%E6%96%B9%E6%B3%95.md)
      - [underscore源码学习笔记(六)实现bind,call, apply](Javascript%2FUnderScore%E6%BA%90%E7%A0%81%2Funderscore%E6%BA%90%E7%A0%81%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0(%E5%85%AD)%E5%AE%9E%E7%8E%B0bind%2Ccall%2C%20apply.md)
      - [underscore源码学习笔记(四)collction相关方法](Javascript%2FUnderScore%E6%BA%90%E7%A0%81%2Funderscore%E6%BA%90%E7%A0%81%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0(%E5%9B%9B)collction%E7%9B%B8%E5%85%B3%E6%96%B9%E6%B3%95.md)
  - [keydown, input,change,compsition事件的区别](Javascript%2Fkeydown%2C%20input%2Cchange%2Ccompsition%E4%BA%8B%E4%BB%B6%E7%9A%84%E5%8C%BA%E5%88%AB.md)
  - [selection与range](Javascript%2Fselection%E4%B8%8Erange.md)
  - [一文理解JS中的继承](Javascript%2F%E4%B8%80%E6%96%87%E7%90%86%E8%A7%A3JS%E4%B8%AD%E7%9A%84%E7%BB%A7%E6%89%BF.md)
  - [前端埋点](Javascript%2F%E5%89%8D%E7%AB%AF%E5%9F%8B%E7%82%B9.md)
  - [前端异常处理](Javascript%2F%E5%89%8D%E7%AB%AF%E5%BC%82%E5%B8%B8%E5%A4%84%E7%90%86.md)
  - [前端截图](Javascript%2F%E5%89%8D%E7%AB%AF%E6%88%AA%E5%9B%BE.md)
  - [剪贴板操作](Javascript%2F%E5%89%AA%E8%B4%B4%E6%9D%BF%E6%93%8D%E4%BD%9C.md)
  - [理解base64](Javascript%2F%E7%90%86%E8%A7%A3base64.md)
- HTML_CSS
  - [0-css面试题汇总](HTML_CSS%2F0-css%E9%9D%A2%E8%AF%95%E9%A2%98%E6%B1%87%E6%80%BB.md)
  - [css中有关用户行为的user-xx](HTML_CSS%2Fcss%E4%B8%AD%E6%9C%89%E5%85%B3%E7%94%A8%E6%88%B7%E8%A1%8C%E4%B8%BA%E7%9A%84user-xx.md)
  - [css中的层叠,权重与继承](HTML_CSS%2Fcss%E4%B8%AD%E7%9A%84%E5%B1%82%E5%8F%A0%2C%E6%9D%83%E9%87%8D%E4%B8%8E%E7%BB%A7%E6%89%BF.md)
  - [css中的方位与顺序](HTML_CSS%2Fcss%E4%B8%AD%E7%9A%84%E6%96%B9%E4%BD%8D%E4%B8%8E%E9%A1%BA%E5%BA%8F.md)
  - [css中的线性渐变](HTML_CSS%2Fcss%E4%B8%AD%E7%9A%84%E7%BA%BF%E6%80%A7%E6%B8%90%E5%8F%98.md)
  - [css实现元素尺寸比例保持不变](HTML_CSS%2Fcss%E5%AE%9E%E7%8E%B0%E5%85%83%E7%B4%A0%E5%B0%BA%E5%AF%B8%E6%AF%94%E4%BE%8B%E4%BF%9D%E6%8C%81%E4%B8%8D%E5%8F%98.md)
  - [css实现半椭圆效果](HTML_CSS%2Fcss%E5%AE%9E%E7%8E%B0%E5%8D%8A%E6%A4%AD%E5%9C%86%E6%95%88%E6%9E%9C.md)
  - [css实现平行四边形效果](HTML_CSS%2Fcss%E5%AE%9E%E7%8E%B0%E5%B9%B3%E8%A1%8C%E5%9B%9B%E8%BE%B9%E5%BD%A2%E6%95%88%E6%9E%9C.md)
  - [css实现灵活的footer效果](HTML_CSS%2Fcss%E5%AE%9E%E7%8E%B0%E7%81%B5%E6%B4%BB%E7%9A%84footer%E6%95%88%E6%9E%9C.md)
  - [css实现等高布局](HTML_CSS%2Fcss%E5%AE%9E%E7%8E%B0%E7%AD%89%E9%AB%98%E5%B8%83%E5%B1%80.md)
  - [css实现遮罩效果的几种方式](HTML_CSS%2Fcss%E5%AE%9E%E7%8E%B0%E9%81%AE%E7%BD%A9%E6%95%88%E6%9E%9C%E7%9A%84%E5%87%A0%E7%A7%8D%E6%96%B9%E5%BC%8F.md)
  - [css实现饼图效果](HTML_CSS%2Fcss%E5%AE%9E%E7%8E%B0%E9%A5%BC%E5%9B%BE%E6%95%88%E6%9E%9C.md)
  - [css径向渐变](HTML_CSS%2Fcss%E5%BE%84%E5%90%91%E6%B8%90%E5%8F%98.md)
  - [flex与margin auto为何能实现水平居中效果](HTML_CSS%2Fflex%E4%B8%8Emargin%20auto%E4%B8%BA%E4%BD%95%E8%83%BD%E5%AE%9E%E7%8E%B0%E6%B0%B4%E5%B9%B3%E5%B1%85%E4%B8%AD%E6%95%88%E6%9E%9C.md)
  - [line-height和vertical-align实现多行文字水平垂直居中效果](HTML_CSS%2Fline-height%E5%92%8Cvertical-align%E5%AE%9E%E7%8E%B0%E5%A4%9A%E8%A1%8C%E6%96%87%E5%AD%97%E6%B0%B4%E5%B9%B3%E5%9E%82%E7%9B%B4%E5%B1%85%E4%B8%AD%E6%95%88%E6%9E%9C.md)
  - [zIndex管理](HTML_CSS%2FzIndex%E7%AE%A1%E7%90%86.md)
  - [你不知道的margin](HTML_CSS%2F%E4%BD%A0%E4%B8%8D%E7%9F%A5%E9%81%93%E7%9A%84margin.md)
  - [关于设备自适应需要知道知识(DPI,PPI,分辨率,屏幕尺寸)](HTML_CSS%2F%E5%85%B3%E4%BA%8E%E8%AE%BE%E5%A4%87%E8%87%AA%E9%80%82%E5%BA%94%E9%9C%80%E8%A6%81%E7%9F%A5%E9%81%93%E7%9F%A5%E8%AF%86(DPI%2CPPI%2C%E5%88%86%E8%BE%A8%E7%8E%87%2C%E5%B1%8F%E5%B9%95%E5%B0%BA%E5%AF%B8).md)
  - [实现一个按钮相关的单行布局效果](HTML_CSS%2F%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E6%8C%89%E9%92%AE%E7%9B%B8%E5%85%B3%E7%9A%84%E5%8D%95%E8%A1%8C%E5%B8%83%E5%B1%80%E6%95%88%E6%9E%9C.md)
  - [文字布局基础](HTML_CSS%2F%E6%96%87%E5%AD%97%E5%B8%83%E5%B1%80%E5%9F%BA%E7%A1%80.md)
- React源码
  - [React和Vue对比](React%E6%BA%90%E7%A0%81%2FReact%E5%92%8CVue%E5%AF%B9%E6%AF%94.md)
  - [diff算法](React%E6%BA%90%E7%A0%81%2Fdiff%E7%AE%97%E6%B3%95.md)
    - fiber
      - [react中的fiber架构](React%E6%BA%90%E7%A0%81%2Ffiber%2Freact%E4%B8%AD%E7%9A%84fiber%E6%9E%B6%E6%9E%84.md)
    - scheduler
      - [任务调度的基本原理](React%E6%BA%90%E7%A0%81%2Fscheduler%2F%E4%BB%BB%E5%8A%A1%E8%B0%83%E5%BA%A6%E7%9A%84%E5%9F%BA%E6%9C%AC%E5%8E%9F%E7%90%86.md)
    - 合成事件
      - [React合成事件](React%E6%BA%90%E7%A0%81%2F%E5%90%88%E6%88%90%E4%BA%8B%E4%BB%B6%2FReact%E5%90%88%E6%88%90%E4%BA%8B%E4%BB%B6.md)
      - [实现React合成事件](React%E6%BA%90%E7%A0%81%2F%E5%90%88%E6%88%90%E4%BA%8B%E4%BB%B6%2F%E5%AE%9E%E7%8E%B0React%E5%90%88%E6%88%90%E4%BA%8B%E4%BB%B6.md)
- React相关
  - [React Hook实战-封装Audio](React%E7%9B%B8%E5%85%B3%2FReact%20Hook%E5%AE%9E%E6%88%98-%E5%B0%81%E8%A3%85Audio.md)
  - [React-dev-inspector的工作原理](React%E7%9B%B8%E5%85%B3%2FReact-dev-inspector%E7%9A%84%E5%B7%A5%E4%BD%9C%E5%8E%9F%E7%90%86.md)
  - [React为Modal添加国际化文案](React%E7%9B%B8%E5%85%B3%2FReact%E4%B8%BAModal%E6%B7%BB%E5%8A%A0%E5%9B%BD%E9%99%85%E5%8C%96%E6%96%87%E6%A1%88.md)
  - [i18n-automation-with-react-intl](React%E7%9B%B8%E5%85%B3%2Fi18n-automation-with-react-intl.md)
  - [如何实现文字超出隐藏hover出现tooltip的效果](React%E7%9B%B8%E5%85%B3%2F%E5%A6%82%E4%BD%95%E5%AE%9E%E7%8E%B0%E6%96%87%E5%AD%97%E8%B6%85%E5%87%BA%E9%9A%90%E8%97%8Fhover%E5%87%BA%E7%8E%B0tooltip%E7%9A%84%E6%95%88%E6%9E%9C.md)
  - [如何实现路由中间件](React%E7%9B%B8%E5%85%B3%2F%E5%A6%82%E4%BD%95%E5%AE%9E%E7%8E%B0%E8%B7%AF%E7%94%B1%E4%B8%AD%E9%97%B4%E4%BB%B6.md)
  - [实现react-router](React%E7%9B%B8%E5%85%B3%2F%E5%AE%9E%E7%8E%B0react-router.md)
  - [实现一个简易的redux](React%E7%9B%B8%E5%85%B3%2F%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E7%AE%80%E6%98%93%E7%9A%84redux.md)
  - [组件设计](React%E7%9B%B8%E5%85%B3%2F%E7%BB%84%E4%BB%B6%E8%AE%BE%E8%AE%A1.md)
  - [通过CDN使用React](React%E7%9B%B8%E5%85%B3%2F%E9%80%9A%E8%BF%87CDN%E4%BD%BF%E7%94%A8React.md)
- Vue
  - [Vue Compiler的运行机制](Vue%2FVue%20Compiler%E7%9A%84%E8%BF%90%E8%A1%8C%E6%9C%BA%E5%88%B6.md)
  - [实现Vue-tiny-diff算法](Vue%2F%E5%AE%9E%E7%8E%B0Vue-tiny-diff%E7%AE%97%E6%B3%95.md)
  - [实现Vue-tiny-数据响应式](Vue%2F%E5%AE%9E%E7%8E%B0Vue-tiny-%E6%95%B0%E6%8D%AE%E5%93%8D%E5%BA%94%E5%BC%8F.md)
- Typescript
  - [any-never-unknown](Typescript%2Fany-never-unknown.md)
  - [conditional-type](Typescript%2Fconditional-type.md)
  - [extends](Typescript%2Fextends.md)
  - [indexed-type](Typescript%2Findexed-type.md)
  - [infer](Typescript%2Finfer.md)
  - [map-type](Typescript%2Fmap-type.md)
  - [ts-declaration](Typescript%2Fts-declaration.md)
- 工具_效率
  - [ChatGPT初体验](%E5%B7%A5%E5%85%B7_%E6%95%88%E7%8E%87%2FChatGPT%E5%88%9D%E4%BD%93%E9%AA%8C.md)
  - [Circleci机器人自动部署storybook到GitHub](%E5%B7%A5%E5%85%B7_%E6%95%88%E7%8E%87%2FCircleci%E6%9C%BA%E5%99%A8%E4%BA%BA%E8%87%AA%E5%8A%A8%E9%83%A8%E7%BD%B2storybook%E5%88%B0GitHub.md)
    - Git
      - [git-submodule](%E5%B7%A5%E5%85%B7_%E6%95%88%E7%8E%87%2FGit%2Fgit-submodule.md)
      - [常用git命令](%E5%B7%A5%E5%85%B7_%E6%95%88%E7%8E%87%2FGit%2F%E5%B8%B8%E7%94%A8git%E5%91%BD%E4%BB%A4.md)
  - [Github](%E5%B7%A5%E5%85%B7_%E6%95%88%E7%8E%87%2FGithub.md)
  - [acme.sh生成https证书](%E5%B7%A5%E5%85%B7_%E6%95%88%E7%8E%87%2Facme.sh%E7%94%9F%E6%88%90https%E8%AF%81%E4%B9%A6.md)
  - [clash配置指南](%E5%B7%A5%E5%85%B7_%E6%95%88%E7%8E%87%2Fclash%E9%85%8D%E7%BD%AE%E6%8C%87%E5%8D%97.md)
  - [iterms2-antigen-to-improve-your-work-experience](%E5%B7%A5%E5%85%B7_%E6%95%88%E7%8E%87%2Fiterms2-antigen-to-improve-your-work-experience.md)
  - [plantUML入门](%E5%B7%A5%E5%85%B7_%E6%95%88%E7%8E%87%2FplantUML%E5%85%A5%E9%97%A8.md)
  - [prettier-eslint-vscode-实现前端代码格式化](%E5%B7%A5%E5%85%B7_%E6%95%88%E7%8E%87%2Fprettier-eslint-vscode-%E5%AE%9E%E7%8E%B0%E5%89%8D%E7%AB%AF%E4%BB%A3%E7%A0%81%E6%A0%BC%E5%BC%8F%E5%8C%96.md)
  - [windows配置](%E5%B7%A5%E5%85%B7_%E6%95%88%E7%8E%87%2Fwindows%E9%85%8D%E7%BD%AE.md)
  - [在vscode上进行markdown写作](%E5%B7%A5%E5%85%B7_%E6%95%88%E7%8E%87%2F%E5%9C%A8vscode%E4%B8%8A%E8%BF%9B%E8%A1%8Cmarkdown%E5%86%99%E4%BD%9C.md)
  - [在vscode中快速调试你的前端项目](%E5%B7%A5%E5%85%B7_%E6%95%88%E7%8E%87%2F%E5%9C%A8vscode%E4%B8%AD%E5%BF%AB%E9%80%9F%E8%B0%83%E8%AF%95%E4%BD%A0%E7%9A%84%E5%89%8D%E7%AB%AF%E9%A1%B9%E7%9B%AE.md)
  - [如何在线预览github的html页面](%E5%B7%A5%E5%85%B7_%E6%95%88%E7%8E%87%2F%E5%A6%82%E4%BD%95%E5%9C%A8%E7%BA%BF%E9%A2%84%E8%A7%88github%E7%9A%84html%E9%A1%B5%E9%9D%A2.md)
  - [常用的shell命令](%E5%B7%A5%E5%85%B7_%E6%95%88%E7%8E%87%2F%E5%B8%B8%E7%94%A8%E7%9A%84shell%E5%91%BD%E4%BB%A4.md)
  - [开发常用的效率工具(Mac)](%E5%B7%A5%E5%85%B7_%E6%95%88%E7%8E%87%2F%E5%BC%80%E5%8F%91%E5%B8%B8%E7%94%A8%E7%9A%84%E6%95%88%E7%8E%87%E5%B7%A5%E5%85%B7(Mac).md)
  - [环境变量](%E5%B7%A5%E5%85%B7_%E6%95%88%E7%8E%87%2F%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F.md)
- 跨端开发
  - [chrome插件开发踩坑汇总](%E8%B7%A8%E7%AB%AF%E5%BC%80%E5%8F%91%2Fchrome%E6%8F%92%E4%BB%B6%E5%BC%80%E5%8F%91%E8%B8%A9%E5%9D%91%E6%B1%87%E6%80%BB.md)
  - [uniapp微信H5开发本地调试方案](%E8%B7%A8%E7%AB%AF%E5%BC%80%E5%8F%91%2Funiapp%E5%BE%AE%E4%BF%A1H5%E5%BC%80%E5%8F%91%E6%9C%AC%E5%9C%B0%E8%B0%83%E8%AF%95%E6%96%B9%E6%A1%88.md)
  - [web唤起app](%E8%B7%A8%E7%AB%AF%E5%BC%80%E5%8F%91%2Fweb%E5%94%A4%E8%B5%B7app.md)
- 代码手写题
  - [JS实现AOP](%E4%BB%A3%E7%A0%81%E6%89%8B%E5%86%99%E9%A2%98%2FJS%E5%AE%9E%E7%8E%B0AOP.md)
  - [实现Promise](%E4%BB%A3%E7%A0%81%E6%89%8B%E5%86%99%E9%A2%98%2F%E5%AE%9E%E7%8E%B0Promise.md)
  - [实现call,apply,bind](%E4%BB%A3%E7%A0%81%E6%89%8B%E5%86%99%E9%A2%98%2F%E5%AE%9E%E7%8E%B0call%2Capply%2Cbind.md)
  - [实现eventBus](%E4%BB%A3%E7%A0%81%E6%89%8B%E5%86%99%E9%A2%98%2F%E5%AE%9E%E7%8E%B0eventBus.md)
  - [实现resolvablePromise](%E4%BB%A3%E7%A0%81%E6%89%8B%E5%86%99%E9%A2%98%2F%E5%AE%9E%E7%8E%B0resolvablePromise.md)
  - [实现几个 fp 相关的方法(partial,curry, pipe)](%E4%BB%A3%E7%A0%81%E6%89%8B%E5%86%99%E9%A2%98%2F%E5%AE%9E%E7%8E%B0%E5%87%A0%E4%B8%AA%20fp%20%E7%9B%B8%E5%85%B3%E7%9A%84%E6%96%B9%E6%B3%95(partial%2Ccurry%2C%20pipe).md)
  - [实现深拷贝](%E4%BB%A3%E7%A0%81%E6%89%8B%E5%86%99%E9%A2%98%2F%E5%AE%9E%E7%8E%B0%E6%B7%B1%E6%8B%B7%E8%B4%9D.md)
  - [异步串行钩子](%E4%BB%A3%E7%A0%81%E6%89%8B%E5%86%99%E9%A2%98%2F%E5%BC%82%E6%AD%A5%E4%B8%B2%E8%A1%8C%E9%92%A9%E5%AD%90.md)
  - [批量请求函数](%E4%BB%A3%E7%A0%81%E6%89%8B%E5%86%99%E9%A2%98%2F%E6%89%B9%E9%87%8F%E8%AF%B7%E6%B1%82%E5%87%BD%E6%95%B0.md)
  - [红绿灯](%E4%BB%A3%E7%A0%81%E6%89%8B%E5%86%99%E9%A2%98%2F%E7%BA%A2%E7%BB%BF%E7%81%AF.md)
  - [防抖节流](%E4%BB%A3%E7%A0%81%E6%89%8B%E5%86%99%E9%A2%98%2F%E9%98%B2%E6%8A%96%E8%8A%82%E6%B5%81.md)
- 业务相关
    - 国际化
      - [前端国际化中的RTL适配](%E4%B8%9A%E5%8A%A1%E7%9B%B8%E5%85%B3%2F%E5%9B%BD%E9%99%85%E5%8C%96%2F%E5%89%8D%E7%AB%AF%E5%9B%BD%E9%99%85%E5%8C%96%E4%B8%AD%E7%9A%84RTL%E9%80%82%E9%85%8D.md)
    - 统一登录
      - [单点登录](%E4%B8%9A%E5%8A%A1%E7%9B%B8%E5%85%B3%2F%E7%BB%9F%E4%B8%80%E7%99%BB%E5%BD%95%2F%E5%8D%95%E7%82%B9%E7%99%BB%E5%BD%95.md)
- 踩坑汇总
  - [egg获取不到cookie的值](%E8%B8%A9%E5%9D%91%E6%B1%87%E6%80%BB%2Fegg%E8%8E%B7%E5%8F%96%E4%B8%8D%E5%88%B0cookie%E7%9A%84%E5%80%BC.md)
  - [如何在页面卸载前发送请求](%E8%B8%A9%E5%9D%91%E6%B1%87%E6%80%BB%2F%E5%A6%82%E4%BD%95%E5%9C%A8%E9%A1%B5%E9%9D%A2%E5%8D%B8%E8%BD%BD%E5%89%8D%E5%8F%91%E9%80%81%E8%AF%B7%E6%B1%82.md)
  - [如何处理翻译软件翻译掉占位符](%E8%B8%A9%E5%9D%91%E6%B1%87%E6%80%BB%2F%E5%A6%82%E4%BD%95%E5%A4%84%E7%90%86%E7%BF%BB%E8%AF%91%E8%BD%AF%E4%BB%B6%E7%BF%BB%E8%AF%91%E6%8E%89%E5%8D%A0%E4%BD%8D%E7%AC%A6.md)
  - [子元素transform后父元素依然占据空间](%E8%B8%A9%E5%9D%91%E6%B1%87%E6%80%BB%2F%E5%AD%90%E5%85%83%E7%B4%A0transform%E5%90%8E%E7%88%B6%E5%85%83%E7%B4%A0%E4%BE%9D%E7%84%B6%E5%8D%A0%E6%8D%AE%E7%A9%BA%E9%97%B4.md)
  - [桌面web踩坑记录](%E8%B8%A9%E5%9D%91%E6%B1%87%E6%80%BB%2F%E6%A1%8C%E9%9D%A2web%E8%B8%A9%E5%9D%91%E8%AE%B0%E5%BD%95.md)
  - [移动web踩坑](%E8%B8%A9%E5%9D%91%E6%B1%87%E6%80%BB%2F%E7%A7%BB%E5%8A%A8web%E8%B8%A9%E5%9D%91.md)
- 模式_架构
  - [控制反转与依赖注入](%E6%A8%A1%E5%BC%8F_%E6%9E%B6%E6%9E%84%2F%E6%8E%A7%E5%88%B6%E5%8F%8D%E8%BD%AC%E4%B8%8E%E4%BE%9D%E8%B5%96%E6%B3%A8%E5%85%A5.md)
  - [策略模式](%E6%A8%A1%E5%BC%8F_%E6%9E%B6%E6%9E%84%2F%E7%AD%96%E7%95%A5%E6%A8%A1%E5%BC%8F.md)
- Node
  - [ Node中事件循环](Node%2F%20Node%E4%B8%AD%E4%BA%8B%E4%BB%B6%E5%BE%AA%E7%8E%AF.md)
  - [koa源码学习笔记](Node%2Fkoa%E6%BA%90%E7%A0%81%E5%AD%A6%E4%B9%A0%E7%AC%94%E8%AE%B0.md)
- SVG
- Editor
- 程序人生
  - [(译)提升你的逆向工程技能](%E7%A8%8B%E5%BA%8F%E4%BA%BA%E7%94%9F%2F(%E8%AF%91)%E6%8F%90%E5%8D%87%E4%BD%A0%E7%9A%84%E9%80%86%E5%90%91%E5%B7%A5%E7%A8%8B%E6%8A%80%E8%83%BD.md)
  - [西班牙ISE2024之行](%E7%A8%8B%E5%BA%8F%E4%BA%BA%E7%94%9F%2F%E8%A5%BF%E7%8F%AD%E7%89%99ISE2024%E4%B9%8B%E8%A1%8C.md)
  - AngularJS
    - [build-your-own-angular-2-scope-inheritance](AngularJS%2Fbuild-your-own-angular-2-scope-inheritance.md)
    - [build-your-own-angular-3-watch-collections](AngularJS%2Fbuild-your-own-angular-3-watch-collections.md)
    - [build-your-own-angular-4-events](AngularJS%2Fbuild-your-own-angular-4-events.md)
    - [build-your-own-angular-cp10-module-injection](AngularJS%2Fbuild-your-own-angular-cp10-module-injection.md)
    - [build-your-own-angular-cp11-provider](AngularJS%2Fbuild-your-own-angular-cp11-provider.md)
    - [build-your-own-angular-cp8-filters](AngularJS%2Fbuild-your-own-angular-cp8-filters.md)
    - [build-your-own-angular-literal-expressions](AngularJS%2Fbuild-your-own-angular-literal-expressions.md)
    - [build-your-own-angular-property-lookup](AngularJS%2Fbuild-your-own-angular-property-lookup.md)


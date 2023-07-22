## 前言

![parallelograms](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2019/2019-06-15-css-secrets-parallelograms/Parallelograms.png)

说到实现平行四边形， 我们可能第一反应是使用 css3 的 skewX 来进行偏移，但是内容也会跟着偏移， 这也就意味着，我们需要对内容进行反向偏移， 因此实现代码是下面这个样子

```css
// html
<a href="#yolo" class="button">
    <div>Click me</div>
</a>

// css
.button {
  transform: skewX(-45deg);
}
.button > div {
  transform: skewX(45deg);
}
```

效果是实现了，但是问题也显而易见，添加了额外的标签，那么，有没有不需要额外的标签就能够实现的方式呢？答案是肯定的
**具体的思路是： 使用伪元素作为承担样式的部分，对其进行变换**

```css
// html
<a href="#yolo" class="button">
    Click me
</a>

// css
.button {
  display: block;
  position: relative;
  width: 100px;
  line-height: 20px;
  text-align: center;
}

.button::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
  background: #58a;
  transform: skew(45deg);
}
```

## 实现福到效果

这种使用**背景颜色来承载样式**的思路还可以用来实现其他的效果， 比如我们要实现一个**福到**效果
![fudao](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2019/2019-06-15-css-secrets-parallelograms/fudao.png)

```css
//
<div href="#" class="diamond">
    福
</div>

// css
.diamond {
  display: block;
  position: relative;
  width: 200px;
  height: 200px;
  margin-top: 50px;
  margin-left: 50px;
  text-align: center;
  line-height: 200px;
  font-size: 50px;
  transform: rotate(180deg);
}
.diamond::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: red;
  z-index: -1;
  transform: rotate(45deg);
}
```
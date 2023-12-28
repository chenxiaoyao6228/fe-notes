import sum from "./sum";
import "./index.less";

function component() {
  // ES10字符串语法, 验证babel-loader
  let str = "    school";
  console.log(str.trimStart().length); // 6

  const wrapper = document.createElement("div");

  // less-loader, style-loader, css-loader
  function createButton() {
    const element = document.createElement("button");
    element.classList.add("btn");
    element.innerHTML = "Hello webpack, please click me!";
    element.addEventListener("click", () => {
      alert(`sum(1, 2) is: ${sum(1, 2)}`);
    });
    wrapper.appendChild(element);
    return element;
  }

  // 外联图片
  function createLargeImage() {
    const element = document.createElement("img");
    element.classList.add("large-img");
    element.src = require("./2.jpg");
    element.classList.add("img");
    wrapper.appendChild(element);
    return element;
  }
  
  // 内联base64图片
  function createSmallImage() {
    const element = document.createElement("img");
    element.classList.add("small-img");
    element.src = require("./1.png");
    element.classList.add("img");
    wrapper.appendChild(element);
    return element;
  }

  
  createButton();
  createSmallImage()
  createLargeImage();

  return wrapper;
}

document.body.appendChild(component());

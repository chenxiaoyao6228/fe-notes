import libA from "./lib-a.js";

function logMsg() {
  var a = libA.foo; // "foo"
  alert(a + "-" + libA.bar);
}

var button = document.createElement("button");
button.innerHTML = "Click me and look at the console!";
button.onclick = logMsg;
document.body.appendChild(button);

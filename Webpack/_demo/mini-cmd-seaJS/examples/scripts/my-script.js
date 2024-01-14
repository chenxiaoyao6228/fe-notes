define(function(require, exports, module) {

  console.log("1111", 1111);
  
  var libA = require('lib-a');
  
  function logMsg(){
    var a = libA.foo; // "foo"
    alert(a + '-' + libA.bar);
  }

  var button = document.createElement('button');
  button.innerHTML = 'Click me and look at the console!';
  button.onclick = logMsg
  document.body.appendChild(button);  
});
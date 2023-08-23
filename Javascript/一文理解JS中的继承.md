
## 前言

ES6 中带来了 class 支持，方便了调用，实际上只是基于原型继承的语法糖，要了解 ES6 的 class 就要深入理解 JS 的原型继承机制

本文目标：了解 Javascript 中的原型继承机制， 并模拟实现 class 继承

## JS 中的类支持

### 类的基本用法

```js
class Person {
  static TYPE = "PERSON"; // 静态属性
  #privateMsg; // 私有属性, ES2020 实验草案
  constructor(name, age) {
    this.#privateMsg = "private variable";
    this.name = name;
    this.age = age;
  }
  say() {
    console.log(privateMsg); // 函数内部可以访问私有变量
  }
  introduce() {
    return "name: " + this.name + " age: " + this.age;
  }
}
var person = new Person("allen", 12); //对象创建
person.say(); // private variable
person.#privateMsg; // 访问私有属性,报SyntaxErroE

class Employee extends Person {
  constructor(name, age, salary) {
    super(name, age);
    this.salary = salary;
  }
}
let employee = new Employee("allen", 12, 2000);
employee.salary; // 2000
```

类的特点主要有以下

- 对象构建
- 静态属性/方法(如 Math.random())
- 私有属性
- 可以通过 extends 实现继承

### ES6 前类的定义

在 ES6 之前是没有类的，只有函数，按照用法可以分为普通函数和构造函数

普通函数没什么好说的

```js
function person() {
  console.log("I am a person");
}
```

构造函数(一般用大写开头)，与普通函数的区别是内部有**this**定义，同时使用**new**方法进行实例化，我们来看下如何满足类的几个要素

```js
function Person(name, age) {
  var privateMsg = "private variable"; // 私有属性
  this.name = name;
  this.age = age;
  this.say = function () {
    console.log(privateMsg);
  };
  this.introduce = function () {
    return "name: " + this.name + " age: " + this.age;
  };
}
var person = new Person("allen", 12); //对象创建
Person.TYPE = "PERSON"; // 静态属性
person.say(); // private variable
person.privateMsg; // undefined
```

有时候我们希望"类"的方法能被重用, 比如上面的 introduce 方法, 每次创建对象的时候都会重新定义一遍, 在 JS 中,每个构造函数都有一个对应的 Prototype 对象,可以用来保存共用的方法和属性,还是上面的例子

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
}
Person.prototype.introduce = function () {
  return "name: " + this.name + ", age: " + this.age;
};
var p1 = new Person("allen", 12); //对象创建
p1.introduce(); // name: allen, age: 12
var p2 = new Person("bob", 12); //对象创建
p2.introduce(); // name: bob, age: 12
```

对于实例 p(p1 和 p2), 找不到 introduce 方法,因此会到根据\_\_proto\_\_属性 Person 的 prototype 对象里面去寻找. 用图表示是这样的

![](https://note.youdao.com/yws/public/resource/a859c7ffd63e9f5c905a9d71d446d2e0/xmlnote/C31298E69652450BAF2A0516C5F63132/67723.png)

这个\_\_proto\_\_是什么? new 的时候发生了什么?

## new 的时候发生了什么

new Person()的时候做了以下几件事：
  1. 创建一个新的对象 instance
  2. instance.\_\_proto\_\_ = instanceClass.prototype
  3. 将 this 关键字指向新创建的对象，this = instance 4. 使用新创建的对象执行构造器函数, 获得返回值 res 5. 判断 res 的返回值，如果为 Object，Array 等复合数据类型，则返回 res，否则返回这个 instance

用代码表示如下

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
}
function isCompoundData(target) {
  return target !== null && typeof target === "object";
}

function New(f) {
  return function () {
    var o = { __proto__: f.prototype }; // 1,2
    var res = f.apply(o, arguments); // 3, 4
    return isCompoundData(res) ? res : o; //5
  };
}
var p = New(Person)("allen", "21");
p.name; //"allen"
p.age; //"21"
```

由于查找是根据\_\_proto**, 而\_\_proto**在 new 的时候确定,因此在对象实例化之后, 再更改构造 no 函数的 prototype 的指向是不会影响原来的

```js
function Person() {}
Person.prototype.xxx = "xxx";
var p = new Person();
Person.prototype = {
  // 对prototype对象进行更改
  xxx: "yyy",
};
p.xxx; // 'xxx'
```

这种原型链查找的方式正式 JS 中的继承机制, 假设我们有这个一个类结构

```
p <- Parent <- GrandParent
```

当我们从 p 中查找某个属性 y 时, 会沿着\_\_proto\_\_逐级向上查找, 和下文提到的 instanceOf 一致

## instanceOf 与原型链查找

在 JS 中，判断数据主要依赖下面两种方式：

1、如果值应为一个基本类型，使用 typeof 检查其类型

2、如果值应为一个引用类型，使用 instanceof 操作符检查其构造函数；

一个例子

```
let d = new Date()
d instanceof Date // true
d instanceof Object // true
```

我们知道, 在 JavaScript 中, Date, Array 等都**继承**于 Object, 因此 d 也是 Object 的实例.

### instanceOf 的基本原理

instanceOf 的实现原理是: 判断 L 内部的**\_\_proto\_\_**属性（如果 L.**\_\_proto\_\_**.**\_\_proto\_\_**不为空，则沿着原型链一直使用**\_\_proto\_\_**进行查找比较）是否和构造函数 R 的 prototype 相等, 代码表示如下:

```js
function instance_of(L, R) {
  //L 表示左表达式，R 表示右表达式
  var O = R.prototype; // 取 R 的显示原型
  L = L.__proto__; // 取 L 的隐式原型
  while (true) {
    if (L === null)
      //L是Object.prototype
      return false;
    if (O === L)
      // 这里重点：当 O 严格等于 L 时，返回 true
      return true;
    L = L.__proto__;
  }
}
```

### instanceOf 理解一切皆对象

你可能听过 JS 中一切皆对象,我们可以通过原型链来解释.

![](https://note.youdao.com/yws/public/resource/a859c7ffd63e9f5c905a9d71d446d2e0/xmlnote/WEBRESOURCE122f4b50402cbcd652ddafcebacb4b10/67727.png)

注意两点：

一、从对象的层面：所有对象（包括函数）使用 instance of 会查找到 Object.prototype 返回 true

二、从函数层面所有的函数都是由 Function 创建出来的（包括 Object），从构造器的层面而言，Function 是最顶级的。

用图来解释就是：所有函数的*proto*指向的都是 Function.prototype（包括 Function._proto_）,而 Function.prototype.*proto*指向的是 Object 的 prototype。

通过图来解释上面几种情况：

```js
Number instanceof Number; //（用图中的Foo函数代替）
Number.__proto__; // Function.prototype
Number.prototype; // Number.prototype,两者不等

Number instanceof Function;
Number.__proto__; // Function.prototype
Function.prototype; // Function.prototype,两者等

Function instanceof Object; //(函数也是对象)
Function.__proto__; //Function.prototype
Object.prototype; //Function.prototype

Object instanceof Object;
Object.__proto__.__proto__; //Object.prototype,这里向上查找了
Object.prototype; //Object.prototype

Function instanceof Function;
Function.__proto__; //Function.prototype
Function.prototype; // Function.prototype,两者等
```

三、理解原型链继承：

```js
function SuperType(){
    this.colors = ["red", "blue", "green"];
}
SuperType.prototype.Fun = function(){

};
function SubType(){
}
//继承了SuperType
SubType.prototype = new SuperType();
var instance1 = new SubType();
instance1.colors.push("black");
alert(instance1.colors); //"red,blue,green,black"
var instance2 = new SubType();
alert(instance2.colors); //"red,blue,green,black"
还是用图来解释：
```

![原型链继承](https://note.youdao.com/yws/public/resource/a859c7ffd63e9f5c905a9d71d446d2e0/xmlnote/WEBRESOURCE8d9477940196a5a63545a709863a624b/67729.png)

最后顺便谈一下 constructor 属性：constructor 属性不影响 JS 的内部属性，instance of 方法不需要用到它，基本而言，没什么用。但是从编程习惯上，在修改了构造函数的 prototype 之后，把 constructor 属性修正回来。

来自高程的例子：

```js
var Person = function () {};
Person.prototype = {
  name: "Nicholas",
  age: 29,
  job: "Software Engineer",
  sayName: function () {
    alert(this.name);
  },
};

var friend = new Person();

alert(friend instanceof Object); //true

alert(friend instanceof Person); //true

alert(friend.constructor == Person); //false

alert(friend.constructor == Object); //true
```

每次创建一个函数的时候，就会同时创建它的 prototype 对象，这个对象也会自动获得 constructor 属性。这里使用字面量的形式将 Person.prototype 指向一个新创建的对象字面量，因而其构造器变成 了 Object.但是为什么 friend.constructor 也变成了 Object 呢。貌似 friend 对象和 Person.prototype 是"同生共死"的关系，只要 friend.prototype 的 constructor 发生了变化，构建出来的 friend 的 constructor 也会跟着变化。

//重设构造函数，只适用于 ECMAScript 5 兼容的浏览器

```js
Object.defineProperty(Person.prototype, "constructor", {
  enumerable: false,
  value: Person,
});
```

## 继承

讲完了 new 和 instanceOf, 让我们回到类的一个最重要的一个部分上: **继承**, JS 的 new 关键字让刚上手 JavaScript 的熟悉传统类继承的程序员直接蒙了, Javascript 并没有提供相应的继承机制, 因此广大 JS 程序员各显神通,发明了各种模拟继承的方法, 主要分为拷贝继承和基于原型链的继承.

### 基于原型链的继承

#### 一、原型链继承

```js
function SuperType() {
  this.colors = ["red", "blue", "green"];
}
SuperType.prototype.Fun = function () {};
function SubType() {}
//继承了SuperType
SubType.prototype = new SuperType();
var instance1 = new SubType();
instance1.colors.push("black");
alert(instance1.colors); //"red,blue,green,black"
var instance2 = new SubType();
alert(instance2.colors); //"red,blue,green,black"
```

优点：能通过 instanceOf 和 isPrototypeOf 的检测

注意：给原型添加方法的语句一定要放在原型替换 SubType.prototype = new SuperType();之后

缺点:(1)SuperType 中的属性(不是方法)也变成了 SubType 的 prototype 中的公用属性，
      如上面例子中的 color 属性，可以同时被 instance1 和 instance2 修改
     (2)创建子类型的时候，不能像父类型的构造函数中传递参数。

#### 二、借用构造函数

```js
function SuperType() {
  this.colors = ["red", "blue", "green"];
}
function SubType() {
  //继承了SuperType
  SuperType.call(this);
}
var instance1 = new SubType();
instance1.colors.push("black");
alert(instance1.colors); //"red,blue,green,black"
var instance2 = new SubType();
alert(instance2.colors); //"red,blue,green"

function SuperType(name) {
  this.name = name;
}
function SubType() {
  //继承了SuperType，同时还传递了参数
  SuperType.call(this, "Nicholas");
  //实例属性
  this.age = 29;
}
var instance = new SubType();
alert(instance.name); //"Nicholas";
alert(instance.age); //29
```

原理：在子类型构造函数的内部调用超类型构造函数
优点：解决了 superType 中的私有属性变公有的问题，可以传递参数
缺点：方法在函数中定义，无法得到复用

#### 三、组合继承

```js
function SuperType(name) {
  this.name = name;
  this.colors = ["red", "blue", "green"];
}
SuperType.prototype.sayName = function () {
  alert(this.name);
};
function SubType(name, age) {
  SuperType.call(this, name); //借用构造函数继承属性，二次调用
  this.age = age;
}
SubType.prototype = new SuperType(); //借用原型链继承方法，一次调用
SubType.prototype.constructor = SubType;
SubType.prototype.sayAge = function () {
  alert(this.age);
};
var instance1 = new SubType("Nicholas", 29);
instance1.colors.push("black");
alert(instance1.colors); //"red,blue,green,black"
instance1.sayName(); //"Nicholas";
instance1.sayAge(); //29
var instance2 = new SubType("Greg", 27);
alert(instance2.colors); //"red,blue,green"
instance2.sayName(); //"Greg";
instance2.sayAge(); //27
```

优点：继承前两者的优点，能通过 instanceOf 和 isPrototypeOf 的检测
缺点：两次调用父构造器函数，浪费内存。

#### 四、原型式继承

ES5 中内置的 Object.create 就是基于此

```js
function object(o) {
  function F() {}
  F.prototype = o;
  return new F();
}
```

使用场合：没必要构建构造函数，仅仅是想模拟一个对象的时候

#### 五、寄生继承

```js
function createAnother(original) {
  var clone = object(original); //通过调用函数创建一个新对象
  clone.sayHi = function () {
    //以某种方式来增强这个对象
    alert("hi");
  };
  return clone; //返回这个对象
}
var person = {
  name: "Nicholas",
  friends: ["Shelby", "Court", "Van"],
};
var anotherPerson = createAnother(person);
anotherPerson.sayHi(); //"hi"
```

缺点：方法在函数中定义，无法得到复用

#### 六：寄生组合继承(最理想)

```js
function inheritPrototype(subType, superType) {
  var prototype = object(superType.prototype); //创建对象
  prototype.constructor = subType; //增强对象
  subType.prototype = prototype; //指定对象
}
function SuperType(name) {
  this.name = name;
  this.colors = ["red", "blue", "green"];
}
SuperType.prototype.sayName = function () {
  alert(this.name);
};
function SubType(name, age) {
  SuperType.call(this, name);
  this.age = age;
}
inheritPrototype(SubType, SuperType); //实现继承
SubType.prototype.sayAge = function () {
  alert(this.age);
};
```

### 拷贝实现继承

通过复制对象的方式是实现继承的一种方式，在 Jquery 和其他的库中都能看到这种实现。下面简单讲下原理，具体的完整实现可参考 Jquery 源码
一、浅拷贝：

```js
function extend(parent, child) {
  var child = child || {};
  for (var prop in parent) {
    child[prop] = parent[prop];
  }
}

var person = {
  name: "allen",
  address: {
    home: "home address",
    school: "school address",
  },
};

var student = {
  age: 21,
};

extend(person, student);
student.name; //allen
student.address; //{home:"home address",school:"school address"}
student.address.home = "new home address";
student.address.home; //new home address
person.address.home; //new home address
```

注意上面的 person.address.home 也变成了 "new home address",原因在于在拷贝的时候，由于 person.address 是一个对象，因此在 child 在复制的时候仅仅是保存了一个引用，而不是将 address 对象复制过来，这就是浅拷贝的一个缺点。

二、深拷贝：
1、for 在数组之中的运用，新建 arr = [1, 2, 3]，由下面可以得知，for 循环之中的 p,实际上是数组的序列号。
2、typeof 的使用，对于数组和对象返回的都是 object，区别对象和数组的话有几种方法：

> (1)Object.prototype.toString.call(arg) ==="[object Array]"//"[object Object]"
> (2)Array.isArray(arg)//ES5
> (3)typeof arg === "object" && arg instanceof Array
> (4)typeof arg === "object" && arg.constructor === Array

简单的实现:

```js
function extendDeeply(parent, child) {
  var child = child || {};
  for (var prop in parent) {
    if (typeof parent[prop] === "object") {
      child[prop] = parent[prop].constructor === Array ? [] : {};
      extendDeeply(parent[prop], child[prop]);
    } else {
      child[prop] = parent[prop];
    }
  }
}
var person = {
  name: "allen",
  address: {
    home: "home address",
    school: "school address",
  },
};

var student = {
  age: 21,
};

extendDeeply(person, student);
student.name; //allen
student.address; //{home:"home address",school:"school address"}
student.address.home = "new home address";
student.address.home; //new home address
person.address.home; //home address
```

可以看到 extendDeep 操作之后，修改 student 中的 address 属性不会为 person 带来影响。

## 类工厂的实现

上面介绍了几种常见的继承模型各有优点，但如果我们需要将这些类方法封装一下，供别人使用的时候，就要考虑更多的功能了, 社区的实现有很多, 这里挑了个人认为最简单的一种实现

### JS.Class

```js
Class = function (classDefinition) {
  //返回目标类的真正构造器
  function getClassBase() {
    return function () {
      //它在里面执行用户传入的构造器construct
      //preventJSBaseConstructorCall是为了防止在createClassDefinition辅助方法中执行父类的construct
      if (
        typeof this["construct"] === "function" &&
        preventJSBaseConstructorCall === false
      ) {
        this.construct.apply(this, arguments);
      }
    };
  }
  //为目标类添加类成员与原型成员
  function createClassDefinition(classDefinition) {
    //此对象用于保存父类的同名方法
    var parent = this.prototype["parent"] || (this.prototype["parent"] = {});
    for (var prop in classDefinition) {
      if (prop === "statics") {
        for (var sprop in classDefinition.statics) {
          this[sprop] = classDefinition.statics[sprop];
        }
      } else {
        //为目标类添加原型成员，如果是函数，那么检测它还没有同名的超类方法，如果有
        if (typeof this.prototype[prop] === "function") {
          var parentMethod = this.prototype[prop];
          parent[prop] = parentMethod;
        }
        this.prototype[prop] = classDefinition[prop];
      }
    }
  }

  var preventJSBaseConstructorCall = true;
  var Base = getClassBase();
  preventJSBaseConstructorCall = false;

  createClassDefinition.call(Base, classDefinition);

  //用于创建当前类的子类
  Base.extend = function (classDefinition) {
    preventJSBaseConstructorCall = true;
    var SonClass = getClassBase();
    SonClass.prototype = new this(); //将一个父类的实例当作子类的原型
    preventJSBaseConstructorCall = false;

    createClassDefinition.call(SonClass, classDefinition);
    SonClass.extend = this.extend;

    return SonClass;
  };
  return Base;
};
```

使用

```js
Class({
  construct: function (name) {
    this.name = name;
  },
  say: function (s) {
    console.log(s);
  },
});

var animal = new Animal();
animal.say("animal"); // animal

var Dog = Animal.extend({
  construct: function (name, age) {
    //调用父类构造器
    this.parent.construct.apply(this, arguments);
    this.age = age;
  },
  run: function (s) {
    console.log(s);
  },
});
var dog = new Dog("dog", 4);
console.log(dog.name);
dog.say("dog"); // dog
dog.run("run"); // run
console.log(dog.constructor + "");
var Shepherd = Dog.extend({
  statics: {
    //静态成员
    TYPE: "Shepherd",
  },
  run: function () {
    //方法链,调用超类同名方法
    this.parent.run.call(this, "fast");
  },
});
console.log(Shepherd.TYPE); //Shepherd
var shepherd = new Shepherd("shepherd", 5);
shepherd.run(); //fast

var a = new Animal("xx");
console.log(a.run);
```

### 其他的实现

- [def.js](https://github.com/RubyLouvre/def.js)

- [Simple-inheritance](https://johnresig.com/blog/simple-javascript-inheritance/)

## ES6 中的类

有了前面的基础,我们就能理解为什么说 ES6 的 class 是语法糖了, 以最开始的 Person 的例子, 我们可以借 Babel 来一窥究竟

### 类的定义

```js
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}
```

### 继承实现

```js
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: { value: subClass, writable: true, configurable: true },
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
```

### 类的特点

1. class 的本质还是函数
2. 基于 Object.defineProperty
3. 类中所有的函数定义在 Prototype 上面
4. 类中定义的方法,都是不可遍历的(enumerable 为 false)
5. 变量不可提升
6. 和 ES5 一样, Class 内部可以使用 get 和 set 关键字
7. ES6 的静态方法可以被子类继承

## 附录

### Babel 转译完整代码

```js
"use strict";

function _typeof(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj &&
        typeof Symbol === "function" &&
        obj.constructor === Symbol &&
        obj !== Symbol.prototype
        ? "symbol"
        : typeof obj;
    };
  }
  return _typeof(obj);
}

function _instanceof(left, right) {
  if (
    right != null &&
    typeof Symbol !== "undefined" &&
    right[Symbol.hasInstance]
  ) {
    return !!right[Symbol.hasInstance](left);
  } else {
    return left instanceof right;
  }
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: { value: subClass, writable: true, configurable: true },
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf =
    Object.setPrototypeOf ||
    function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };
  return _setPrototypeOf(o, p);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();
  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
      result;
    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;
      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }
    return _possibleConstructorReturn(this, result);
  };
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }
  return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  }
  return self;
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;
  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf
    ? Object.getPrototypeOf
    : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
      };
  return _getPrototypeOf(o);
}

function _classCallCheck(instance, Constructor) {
  if (!_instanceof(instance, Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var Person = /*#__PURE__*/ (function () {
  function Person(name, age) {
    _classCallCheck(this, Person);

    this.name = name;
    this.age = age;
  }

  _createClass(Person, [
    {
      key: "say",
      value: function say() {
        console.log(privateMsg); // 函数内部可以访问私有变量
      },
    },
    {
      key: "introduce",
      value: function introduce() {
        return "name: " + this.name + " age: " + this.age;
      },
    },
  ]);

  return Person;
})();

var Employee = /*#__PURE__*/ (function (_Person) {
  _inherits(Employee, _Person);

  var _super = _createSuper(Employee);

  function Employee(name, age, salary) {
    var _this;

    _classCallCheck(this, Employee);

    _this = _super.call(this, name, age);
    _this.salary = salary;
    return _this;
  }

  return Employee;
})(Person);
```

## 参考

- JavaScript 高级程序设计 4
- JavaScript 框架设计
- [where-can-i-find-a-complete-description-of-javascript-dom-class-hierarchy](https://stackoverflow.com/questions/55924114/where-can-i-find-a-complete-description-of-javascript-dom-class-hierarchy)
- [Details_of_the_Object_Model](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Details_of_the_Object_Model)
- [Details_of_the_Object_Model](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/constructing-the-object-model)
- [Classes](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes)

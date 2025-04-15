# TypeScript 学习笔记

## TypeScript 类型声明

TypeScript是一种在编译时为JavaScript添加类型信息并进行类型检查的工具。

除了在变量声明时定义类型之外，TypeScript还支持使用`declare`关键字单独声明类型。专门包含类型声明的文件以".d.ts"为后缀。

### 三种类型来源

TypeScript提供了三种主要存放类型声明的地方：

1. **lib**: 这些是内置的类型声明，包括DOM和ECMAScript标准的类型声明，因为它们都有已确定的规范。
2. **@types/xx**: 这些是不同环境下的API类型声明，比如Node.js，还有npm包的类型声明。
3. **开发者编写的代码**: 类型可以通过使用`include`、`exclude`和`files`选项来指定。

### 三种声明模块的方法

1. **namespace**: 这是最早实现模块的方式之一，它编译为JavaScript代码，声明对象并设置其属性。
2. **module**: 这与namespace方法在AST方面几乎没有区别。通常用于声明CommonJS模块。
3. **ES模块**: 这遵循ECMAScript模块语法标准。TypeScript通过引入"import type"扩展了这一功能。

## 基础类型：any, never, unknown

TypeScript中的类型是值的集合，除了常用类型外，还有any(全集)与never(空集)。

### any (全集)

相当于取消了类型检查，尽量少用，不然容易变成`any script`。

### never (空集)

表示永远没有返回值的函数类型：

```ts
function fail(msg: string): never {
  throw new Error(msg);
}
```

### unknown

和`any`相似，可以代表任何值，区别在于你无法对 unknown 类型做任何操作：

```ts
function f1(a: any) {
  a.b(); // 不会报错
}

function f2(a: unknown) {
  a.b(); // Object is type of unknown
}
```

## 条件类型（Conditional Types）

### 基本语法

条件类型使用extends关键字，类似于JavaScript的三元操作符：

```ts
type A<T> = T extends XX ? B : C;
```

示例：

```ts
type MessageOf<T> = T extends { message: unknown } ? T["message"] : never;

interface Email {
  message: string;
}
interface Dog {
  bark(): void;
}

type EmailMessageContents = MessageOf<Email>; // string
type DogMessageContents = MessageOf<Dog>;    // never
```

### 数组类型推断示例

```ts
type Flattern<T> = T extends Array<infer Item> ? Item : T;
type Str = Flatten<string[]>; // string
type Num = Flatten<number>;   // number
```

## infer 关键字

infer用于在条件类型中推断类型。

### 基本用法

```ts
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;
```

简单示例：

```ts
type MyType<T> = T extends infer R ? R : never;
type T1 = MyType<{ b: string }>; // T1 is { b: string; }
```

### 常见用例

1. 解包数组类型：
```ts
type UnpackArrayType<T> = T extends (infer R)[] ? R : T;
type t1 = UnpackArrayType<number[]>; // number
type t2 = UnpackArrayType<string>;   // string
```

2. 推断对象属性：
```ts
type ObjectInfer<O> = O extends {a: infer A} ? A : never;
```

3. 推断函数参数和返回值：
```ts
type FunctionInfer<F> = F extends (...args: infer A) => infer R ? [A, R] : never;
```

## 映射类型（Mapped Types）

映射类型允许你从一个现有类型创建新的类型。

### 基本使用

```ts
type OptionsFlags<Type> = {
  [Property in keyof Type]: boolean;
};

type FeatureFlags = {
  darkMode: () => void;
  newUserProfile: () => void;
};

type FeatureOptions = OptionsFlags<FeatureFlags>;
/* 结果：
{
  darkMode: boolean;
  newUserProfile: boolean;
}
*/
```

### 修改符

可以使用修改符来改变属性的特性：

```ts
// 移除readonly
type CreateMutable<Type> = {
  -readonly [Property in keyof Type]: Type[Property];
};

// 移除可选标记
type Concrete<Type> = {
  [Property in keyof Type]-?: Type[Property];
};
```

### 键重映射

使用as子句重新映射键：

```ts
type Getters<Type> = {
  [Property in keyof Type as `get${Capitalize<string & Property>}`]: () => Type[Property];
};

interface Person {
  name: string;
  age: number;
}

type LazyPerson = Getters<Person>;
/* 结果：
{
  getName: () => string;
  getAge: () => number;
}
*/
```

## 索引访问类型（Indexed Access Types）

### 访问对象属性类型

```ts
type Person = {
  age: number;
  name: string;
  alive: boolean;
};

type Age = Person["age"];        // number
type I1 = Person["age" | "name"]; // string | number
type I2 = Person[keyof Person];   // string | number | boolean
```

### 访问数组元素类型

```ts
const MyArray = [
  { name: "Alice", age: 15 },
  { name: "Bob", age: 23 },
];

type Person2 = typeof MyArray[number];
/* 结果：
{
  name: string;
  age: number;
}
*/

type Age2 = typeof MyArray[number]["age"]; // number
```

## extends 关键字

`extends`关键字在TypeScript中有两个主要用途：

1. 类型判断：`A extends B ? C : D` 判断A类型是否为B类型的子集
2. 类型约束：在泛型中限制类型范围

```ts
type Func<T> = T extends string ? (
    T extends 'foo' ? 'is string foo'
    : T extends 'bar' ? 'is string bar'
    : 'unexpected string value'
) : T extends number ? (
    T extends 0 ? 'is number 0'
    : T extends 1 ? 'is number 1'
    : 'unexpected number value'
) : 'unexpected value type';
```

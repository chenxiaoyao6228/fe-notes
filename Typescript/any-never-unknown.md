## any, never, unknown

ts中的类型是值的集合, 除了我们常用的, 还有any(全集)与never(空集)
## any (全集)

相当于取消了类型检查, 尽量少用, 不然容易变成`any script`


## never(空集)

一些函数永远没有返回值

```ts
function fail(msg: string): never {
  throw new Error(msg);
}
```

## unknown

和`any`相似, 可以代表任何值,区别在于你无法对 unknown 类型做任何操作

```ts
function f1(a: any) {
  a.b();
}
a.b(); // 不会报错

function f2(a: unknown) {
  a.b(); // Object is type of unknown
}
```

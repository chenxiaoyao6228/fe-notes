## extends关键字

`A extends B ? C : D` 的意义是判断 A集合是否为 B的子集, 如果是返回 C 否则返回D

- 一个集合是它本身的子集
- 

`extends` 在做运算的时候主要是两个用途


`<值> extends <值> ? :` 判断两个值是否相等，可以类比 javascript 的 `<值> === <值> ? :` 
`<值> extends <类型> ? :`判断一个值是否属于某个类型，可以类比成 typeof` <值> === <类型> ? :` 


```ts
type Func<T> =
    T /*值*/ extends string /*类型*/? (
        T /*值*/ extends 'foo' /*值*/ ? 'is string foo'
        : T /*值*/ extends 'bar' /*值*/ ? 'is string bar'
        : 'unexpected string value'
    )
    : T /*值*/ extends number /*类型*/? (
        T /*值*/ extends 0 /*值*/? 'is number 0'
        : T /*值*/ extends 1 /*值*/? 'is number 1'
        : 'unexpected number value'
    )
    : 'unexpected value type';
```


参考:

https://zhuanlan.zhihu.com/p/427309936
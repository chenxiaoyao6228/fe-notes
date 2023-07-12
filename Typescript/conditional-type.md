## conditional-type

根据不同的条件返回对应的类型

## 基本语法extends

```ts
type A<T> = T extends XX ? B : C;
```

可以类比 js 的三元操作符

```js
const A = perdicate ? B : C;
```

报错, 因为不确定 T 中是否存在 message

```ts
type MessageOf<T> = T["message"];
```

可以入参的时候做约束

例子: 
```ts
type MessageOf<T extends { message: unknown }> = T["message"];
interface Email {
  message: string;
}
interface Dog {
  bark(): void;
}
type EmailMessageContents = MessageOf<Email>;
```

如果希望 MessageOf 接受任何参数, 在 T 没有 message 的情况下做返回默认的值 never, 又该如何处理呢?

在**入参**的时候不做限制, 把判断移动到**条件类型**语句中

```ts
type MessageOf<T> = T extends { message: unknown } ? T["message"] : never;
interface Email {
  message: string;
}
interface Dog {
  bark(): void;
}
type EmailMessageContents = MessageOf<Email>;
type EmailMessageContents = string;
type DogMessageContents = MessageOf<Dog>;
```

另外一个数组拍平(flattern)的例子

```ts
type Flattern<T> = T extends any[] ? T[number] : T;
type Str = Flatten<string[]>;
type Num = Flatten<number>;
```

## infer 与条件类型

在约束条件内声明临时的变量, 然后再结果中使用

```ts
type Flattern<T> = T extends Array<infer Item> ? Item : T;
```

另一个 GetReturnType 的例子

```ts
type GetReturnType<Type> = T extends (..args: never[])=> infer Result ? Result : never
```

## 条件类型的分配率

```ts
type ToArray<Type> = Type extends any ? Type[] : never;
type StrArrOrNumArr = ToArray<string | number>; // type StrArrOrNumArr = string[] | number[]
```

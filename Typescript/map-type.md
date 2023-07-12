## map-type

和 js 中的 map 函数一样, 可以利用该函数对集合中的元素进行操作, 生成新的元素

## 基本使用

```ts
type OnlyBoolsAndHorses = {
  [key: string]: boolean | Horse;
};
const conforms: OnlyBoolsAndHorses = {
  del: true,
  rodney: false,
};
```

## 在泛型中使用

### 基本使用

OptionsFlags 方法将 type 中的所有类型转化为布尔值

```ts
type OptionsFlags<Type> = {
  [Property in keyof Type]: boolean;
};

type FeatureFlags = {
  darkMode: () => void;
  newUserProfile: () => void;
};

type FeatureOptions = OptionsFlags<FeatureFlags>;

/*
type FeatureOptions = {     
  darkMode: boolean;  
  newUserProfile: boolean; 
}
*/
```

### 修改符

可以在 key 中添加`readonly`和`?`改变类型中属性的状态, `-`和`+`号用来对其中的值进行取反

将所有的 key 变成非`readonly`

```ts
type createMutable<Type> = {
  -readonly [Property in keyof Type]: Type[Property];
};

type LockedAccount = {
  readonly id: string;
  readonly name: string;
};

type UnlockedAccount = createMutable<LockedAccount>;
```

移除 key 中的 optional`?`操作符

```ts
type Concrete<Type> = {
  [Property in keyof Type]-?: Type[Property];
};
type MaybeUser = {
  id: string;
  name?: string;
  age?: number;
};
type User = Concrete<MaybeUser>;
```

### key remap

使用`as`
```ts
type MappedTypeWithNewProperties<Type> = {
  [Properties in keyof Type as NewKeyType]: Type[Properties];
};
```

在字符串中使用
```ts
type Getters<Type> = {
  [Property in keyof Type as `get${Capitalize<
    string & Property
  >}`]: () => Type[Property];
};

interface Person {
  name: string;
  age: number;
  location: string;
}

type LazyPerson = Getters<Person>;
```
移除`kind`属性, **注意操作是在左边进行的**
```ts
type RemoveKindField<Type> = {
  [Property in keyof Type as Exclude<Property, "kind">]: Type[Property];
};

interface Circle {
  kind: "circle";
  radius: number;
}

type KindlessCircle = RemoveKindField<Circle>;
```

更多例子

`Omit`
```ts
type MyOmit<T, U> = {
  [P in Exclude<keyof U, T>]: T[P]
}
```
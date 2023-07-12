## Indexed Access Type

## 获取类型的key
```ts
type Person = {
  age: number;
  name: string;
  alive: boolean;
};
// 获取type中的key
type Age = Person["age"];

// 获取多个类型
type I1 = Person["age" | "name"];

// 获取所有类型
type I2 = Person[keyof Person]; // type I2 = string | number | boolean

type AliveOrName = "alive" | "name";
type I3 = Person[AliveOrName]; // type I3 = string | boolean

```

## 获取数组的类型
```ts
const MyArray = [
  { name: "Alice", age: 15 },
  { name: "Bob", age: 23 },
  { name: "Eve", age: 18 },
];

type Person2 = typeof MyArray[number];

/**
 type Person2 = {
    name: string;
    age: number;
}
*/

type Age2 = typeof MyArray[number]["age"];


```
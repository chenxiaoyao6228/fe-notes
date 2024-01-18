## 代码实现

```ts
type Comparator<T> = (a: T, b: T) => number;

/*

  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort

  Array.sort(compareFn)

  compareFn(a, b) return value	sort order
  
  > 0	sort a after b, e.g. [b, a]
  
  < 0	sort a before b, e.g. [a, b]

  === 0	keep original order of a and b


  更多： https://www.npmjs.com/package/thenby
*/

function createSortingFunction<T>(...comparators: Comparator<T>[]) {
  return function (dataToSort: T[]): T[] {
    return dataToSort.sort((a, b) => {
      for (const comparator of comparators) {
        const result = comparator(a, b);
        if (result !== 0) {
          return result;
        }
      }
      return 0;
    });
  };
}

// 使用案例
interface Person {
  firstName: string;
  lastName: string;
  age: number;
  online: boolean;
}

// ❗ 自定义排序的时候要确保结果返回 0, -1, 1
function sortByOnlineStatus(a: Person, b: Person) {
  return a.online === b.online ? 0 : a.online ? -1 : 1;
}

function sortByAge(a: Person, b: Person) {
  return a.age - b.age;
}

function sortByLastName(a: Person, b: Person) {
  return a.lastName.localeCompare(b.lastName);
}

const data: Person[] = [
  { firstName: "John", lastName: "Doe", age: 25, online: false },
  { firstName: "Jane", lastName: "Smith", age: 35, online: false },
  { firstName: "Allen", lastName: "Walker", age: 45, online: true },
  { firstName: "Alice", lastName: "Johnson", age: 55, online: false },
];

const customSort = createSortingFunction<Person>(
  sortByOnlineStatus,
  sortByAge,
  sortByLastName
);
const sortedData = customSort(data);

console.log(sortedData);
```

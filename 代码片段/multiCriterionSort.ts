type Comparator<T> = (a: T, b: T) => number;

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
}

function sortByAge(a: Person, b: Person) {
  return a.age - b.age;
}

function sortByLastName(a: Person, b: Person) {
  return a.lastName.localeCompare(b.lastName);
}

const data: Person[] = [
  { firstName: "John", lastName: "Doe", age: 30 },
  { firstName: "Jane", lastName: "Smith", age: 25 },
  { firstName: "Alice", lastName: "Johnson", age: 35 },
];

const customSort = createSortingFunction<Person>(sortByAge, sortByLastName);
const sortedData = customSort(data);

console.log(sortedData);

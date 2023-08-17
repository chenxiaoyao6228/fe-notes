## 前言

一般情况下，Promise 的 resolve 和 reject 方法是内部使用的，但有时候我们可能需要在外部的代码中触发 Promise 的状态改变

例子一：延迟操作

有时你可能需要在一定时间后执行一些操作。你可以使用定时器，然后通过 resolvablePromise 来表示操作的完成。

```ts
export const delayedAction = (delay: number): ResolvablePromise<void> => {
  const resolvablePromise = createResolvablePromise<void>();

  setTimeout(() => {
    resolvablePromise.resolve();
  }, delay);

  return resolvablePromise;
};
```

例子二：多个并行操作

```ts
export const fetchData = (): ResolvablePromise<string[]> => {
  const resolvablePromise = createResolvablePromise<string[]>();

  const requests = [
    fetch("api/data1").then((response) => response.text()),
    fetch("api/data2").then((response) => response.text()),
    fetch("api/data3").then((response) => response.text())
  ];

  Promise.all(requests)
    .then((data) => {
      resolvablePromise.resolve(data);
    })
    .catch((error) => {
      resolvablePromise.reject(new Error(`Error fetching data: ${error}`));
    });

  return resolvablePromise;
};

```

createResolvablePromise的实现如下：

```ts
export type ResolvablePromise<T> = Promise<T> & {
  resolve: (value: T) => void;
  reject: (error: Error) => void;
};

export const createResolvablePromise = <T>() => {
  let resolve!: (value: T) => void;
  let reject!: (error: Error) => void;

  const promise = new Promise<T>((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });

  (promise as any).resolve = resolve;
  (promise as any).reject = reject;

  return promise as ResolvablePromise<T>;
};
```

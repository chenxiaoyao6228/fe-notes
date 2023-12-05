import { Suspense } from 'react';
import { IRouteObject } from './types';

export function wrapperHandler(route: IRouteObject): IRouteObject {
  const { wrapper = [], element, children, ...restParams } = route;
  // 处理自身的wrapper
  const WrapperElement = wrapper.reduce(
    (reactNode, hoc) => {
      const node = () => {
        return <Suspense fallback={<></>}>{reactNode({})}</Suspense>;
      };
      return hoc(node, { ...restParams, children });
    },
    (() => {
      return element;
    }) as React.FC,
  );

  const wrapperChildren = children?.map(wrapperHandler);

  return { ...route, element: <WrapperElement />, children: wrapperChildren } as any;
}

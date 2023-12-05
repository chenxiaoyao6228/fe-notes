import { Route } from './route';
import { IRouteHandler, IRouteObject } from './types';

type IRouteOptions = { route: IRouteObject; handler?: IRouteHandler };

let router: Router;

class Router {
  router: IRouteObject[] = [];

  constructor(...rest: Route[]) {
    this.push(...rest);
  }

  push(...rest: Route[]) {
    // 没有参数不执行后续操作
    if (!rest.length) {
      return;
    }

    // 得到handler处理后的routeList，如果不存在handler，则直接返回routeObject
    const handleRouteList = rest.map(route => {
      const { route: routeObject } = route;
      // 得到handler处理route后route，没有handler返回undefined
      const handleRouteObject = this._getHandledRoute(route);

      return handleRouteObject || routeObject;
    });

    this.router = this.router.concat(...handleRouteList);
  }

  private _getHandledRoute(route: Route) {
    const { handlerList, route: routeObject } = route;
    let handleRouteObject: IRouteObject | undefined;

    if (handlerList.length === 0) {
      return;
    }

    for (const handler of handlerList) {
      // 不支持promise
      if (handler instanceof Promise) {
        console.warn('router类的_getHandledRoute警告: route处理函数handler不能是异步函数');
        continue;
      }

      handleRouteObject = handler(routeObject);
    }

    return handleRouteObject;
  }
}

/** 注册route到router */
export function registerRoute(...rest: Route[] | IRouteOptions[]) {
  if (rest.length === 0) {
    return;
  }
  if (!router) {
    router = new Router();
  }

  const routeList = rest.map(options => {
    if (options instanceof Route) {
      return options;
    } else {
      return new Route(options.route, options.handler);
    }
  });

  router.push(...routeList);
}

// 获取router
export function getOrCreateRouter() {
  if (!router) {
    router = new Router();
  }
  return router;
}

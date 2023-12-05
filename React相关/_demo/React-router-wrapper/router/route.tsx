import { IRouteHandler, IRouteObject } from './types';

export class Route {
  private readonly _route: IRouteObject;
  private readonly _handlerList: IRouteHandler[] = [];

  constructor(route: IRouteObject, handler?: IRouteHandler[] | IRouteHandler) {
    /** routeObject -> route的配置项 */
    this._route = route;
    /** route处理器 */
    handler && (this._handlerList = this._handlerList.concat(handler));
  }

  get route() {
    return this._route;
  }

  get handlerList() {
    return this._handlerList;
  }
}

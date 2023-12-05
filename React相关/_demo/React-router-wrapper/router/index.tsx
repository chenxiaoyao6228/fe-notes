import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { Route } from "./route";
import { IRouteObject } from "./types";
import { wrapperHandler } from "./wrapperHandler";
import { getOrCreateRouter, registerRoute } from "./router";
import WithAuth from "@/HOC/WithAuth";
import WithEvent from "@/HOC/WithEvent";

const App = React.lazy(
  () => import(/* webpackChunkName: "App" */ "@/pages/App")
);
const HelloWorld = React.lazy(
  () => import(/* webpackChunkName: "HelloWorld" */ "@/pages/HelloWorld")
);

const config: IRouteObject = {
  path: "/",
  element: <App />,
  wrapper: [WithAuth],
  children: [
    {
      path: "/HelloWorld",
      element: <HelloWorld />,
      wrapper: [WithEvent],
      children: [],
    },
  ],
};

const route = new Route(config, wrapperHandler);

registerRoute(route);

const routerObject: any = getOrCreateRouter().router;

const router = createBrowserRouter(routerObject);

export default router;

## 路由守卫

```ts
// 添加对应的守卫函数
export const yourGuardFunction: CanActivateFn = (
    next: ActivatedRouteSnapshot,
    state: (RouterStateSnapshot) => {
      // your  logic goes here
  })
// 路由中配置
{
  path: '/your-path',
  component: YourComponent,
  canActivate: [yourGuardFunction],
}
```

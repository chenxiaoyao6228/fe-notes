// code-editor.service.ts
import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { AsyncSubject, Subject } from 'rxjs';

// 根据使用时部署情况可能会需要更改资源路径
export const APP_MONACO_BASE_HREF = new InjectionToken<string>(
  'appMonacoBaseHref'
);

@Injectable({
  providedIn: 'root'
})
export class CodeEditorService {
  private afterScriptLoad$: AsyncSubject<boolean> = new AsyncSubject<boolean>();
  private isScriptLoaded = false;

  constructor(@Optional() @Inject(APP_MONACO_BASE_HREF) private base: string) {
    this.loadMonacoScript();
  }

  public getScriptLoadSubject(): AsyncSubject<boolean> {
    return this.afterScriptLoad$;
  }

  public loadMonacoScript(): void {
    // 通过 AMD 的方式加载 monaco 脚本
    const onGotAmdLoader: any = () => {
      // load monaco here
      (<any>window).require.config({
        paths: { vs: `${this.base || 'assets/vs'}` }
      });
      (<any>window).require(['vs/editor/editor.main'], () => {
        this.isScriptLoaded = true;
        this.afterScriptLoad$.next(true);
        this.afterScriptLoad$.complete();
      });
    };

    // 在这里会需要加载到 monaco 的 loader.js
    if (!(<any>window).require) {
      const loaderScript = document.createElement('script');
      loaderScript.type = 'text/javascript';
      loaderScript.src = `${this.base || 'assets/vs'}/loader.js`;
      loaderScript.addEventListener('load', onGotAmdLoader);
      document.body.appendChild(loaderScript);
    } else {
      onGotAmdLoader();
    }
  }
}

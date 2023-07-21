## 前言

由于Modal等组件脱离了<App>的Context上下文，所以在使用国际化语言的时候会不生效，因此需要对这些组件做单独的处理

```tsx
// MountIntl HOC
import { getLocale, IntlProvider } from 'react-intl';

// webpack的动态加载方法，此方法可以用来处理页面中有比较多的图片加载的情况
function loadLocales(context: any) {
  const localesMap = {};
  context.keys().forEach((key) => {
    const lang = key.match(/\.\/([a-zA-Z-]+)\.json$/)[1];
    localesMap[lang] = context(key);
  });
  return localesMap;
}
const context = require.context('../locales/', false, /\.json$/);
const localesMap = loadLocales(context);


const MountIntl: <T>(Component: React.FC<T>, locale?: string) => React.FC<T> = (
  Component,
  locale = getLocale(),
) => {
  return (props) => {
    const cacheLocale = getCacheLocale();
    return (
      <IntlProvider
        locale={locale}
        // 如果为缓存为空，则拿本地语言
        messages={isEmpty(cacheLocale) ? localesMap[locale] : cacheLocale}
      >
        <Component {...props}></Component>
      </IntlProvider>
    );
  };
};

export default MountIntl;
```
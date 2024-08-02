## web 唤起 app 的原理

Web 唤起 App 的基本原理通常有使用定制的 URL schemes 或者 Universal Links（iOS）和 Deep Links（Android）

### URL Schemes（URL 方案）

对于 iOS 和 Android 都适用。每个应用程序都可以注册一个特定的 URL 方案，类似于"myapp://"。 当用户点击 Web 页面上的链接，链接中包含了注册应用的 URL 方案，操作系统会尝试打开相应的应用程序。

例如，一个链接可能是 myapp://openPage?id=123，点击后系统会尝试打开注册了“myapp”方案的应用，并传递相应的参数。

### Universal Links（iOS）

这是苹果引入的一种机制，它允许开发者在应用和网站之间建立智能链接。对应用进行配置后，点击链接时，系统会检查是否有相应的应用，如果有，就会直接打开应用而不是在浏览器中打开。

这种方式更智能，因为系统会决定是在浏览器中打开还是直接调用应用。

### Deep Links（Android）

Android 上的深度链接类似于 URL 方案，但更强大。它可以通过 URI 打开应用的特定页面，而不仅仅是启动应用。例如，链接可能是 myapp://openPage?id=123，而不仅仅是启动应用。

## 前端实现

使用 iframe 打开 app 的方式，如果打开成功，会触发 window.blur 事件，如果打开失败，不会触发 blur 事件。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>唤起ZOOM或者TEAMS app</title>
  </head>
  <body>
    <button id="btn1">唤起zoom(msteams://)</button>
    <button id="btn2">唤起teams(zoommtg://zoom.us)</button>
    <script>
      document.querySelector("#btn1").addEventListener("click", () => {
        const urlSchemaOfTeams = "msteams://";
        appLauncher(urlSchemaOfTeams);
      });

      document.querySelector("#btn2").addEventListener("click", () => {
        const urlSchemaOfZoom = "zoommtg://zoom.us";
        appLauncher(urlSchemaOfZoom);
      });

      function appLauncher(protocalUrl) {
        openUriWithHiddenFrame(
          protocalUrl,
          () => {
            // 浏览器弹窗提示
            alert("检测到已安装了客户端");
          },
          () => {
            alert("检测到未安装客户端");
          }
        );

        function _registerEvent(target, eventType, cb) {
          if (target.addEventListener) {
            target.addEventListener(eventType, cb);
            return {
              remove: function () {
                target.removeEventListener(eventType, cb);
              },
            };
          } else {
            target.attachEvent(eventType, cb);
            return {
              remove: function () {
                target.detachEvent(eventType, cb);
              },
            };
          }
        }

        function _createHiddenIframe(target, uri) {
          var iframe = document.createElement("iframe");
          iframe.src = uri;
          iframe.id = "hiddenIframe";
          iframe.style.display = "none";
          target.appendChild(iframe);
          return iframe;
        }

        function openUriWithHiddenFrame(uri, successCb, failCb) {
          var timeout = setTimeout(function () {
            failCb();
            handler.remove();
          }, 1000);

          var iframe = document.querySelector("#hiddenIframe");
          if (!iframe) {
            iframe = _createHiddenIframe(document.body, "about:blank");
          }

          var handler = _registerEvent(window, "blur", onBlur);

          function onBlur() {
            clearTimeout(timeout);
            handler.remove();
            successCb();
          }

          iframe.contentWindow.location.href = uri;
        }
      }
    </script>
  </body>
</html>
```

完整的 demo 请看 👉 [在线效果预览](https://chenxiaoyao6228.github.io/html-preview/?https://github.com/chenxiaoyao6228/fe-notes/blob/main/跨端开发/_demo/appLauncher/index.html), 查看示例代码请点击[此处](https://github.com/chenxiaoyao6228/fe-notes/blob/main/跨端开发/_demo/appLauncher/index.html)

/**
 * uri 打开客户端的uri
 * failCb 打开客户端失败回调
 * successCb 打开客户端成功回调
 */
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

export default function appLauncher(protocalUrl) {
  openUriWithHiddenFrame(
    protocalUrl,
    () => {
      // 浏览器弹窗提示
      console.log("检测到：已安装了客户端");
    },
    () => {
      console.log("检测到，未安装客户端");
    }
  );
}

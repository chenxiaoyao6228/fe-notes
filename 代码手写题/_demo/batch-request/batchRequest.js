function request(url) {
  return new Promise((r) => {
    const time = Math.random() * 1000 ;
    setTimeout(() => r(url), time);
  });
}

function multiRequest(urls, maxNum) {
  const results = [];
  let currentIndex = 0;
  let currentRequests = 0;

  function doRequest(url) {
    currentRequests++;
    const i = currentIndex;
    return request(url).then((result) => {
      results[i] = result;
      currentRequests--;
      tryNextRequest();
    });
  }

  function tryNextRequest() {
    while (currentRequests < maxNum && currentIndex < urls.length) {
      doRequest(urls[currentIndex]);
      currentIndex++;
    }

    if (currentIndex === urls.length && currentRequests === 0) {
      // All requests are completed
      console.log(results);
    }
  }

  tryNextRequest();
}



// 使用示例
const urls = ['url1', 'url2', 'url3', 'url4', 'url5'];
const maxNum = 2; // 最大并发数为2

multiRequest(urls, maxNum);

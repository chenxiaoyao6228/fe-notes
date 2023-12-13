## 前言

本文总结下 base64 的由来、 原理和实现，以及在前端中的应用。

## 字符编码/解码

**文本通常使用字符编码标准转换为数字，然后再表示为二进制**。

字符编码是一种将字符映射到数字的规则，它定义了字符与数字之间的对应关系。

常见的字符编码方式包括:ASCII、Unicode、UTF-8、UTF-16、UTF-32 等。

ASCII 的字符表包含 128 个字符，其中包括英文大小写字母、数字、标点符号和一些控制字符。ASCII 编码使用 7 位二进制数（128 = 2^7）表示一个字符，因此每个字符占用一个字节（8 位）的存储空间。
![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/ascii-table.png)

以 "ABC" 的 ASCII 编码为例，其二进制表示为:

|     | ASCII 编码 | 二进制表示 |
| --- | ---------- | ---------- |
| A   | 65         | 01000001   |
| B   | 66         | 01000010   |
| C   | 67         | 01000011   |

## base64 的由来

Base64 编码源自 MIME 标准，最初设计为解决电子邮件系统中只允许文本数据的问题。它将二进制数据转换为 ASCII 字符，以在**文本环境中**传输。随着时间推移，Base64 广泛应用于网络通信、数据存储和前端开发等领域，成为解决多种应用场景下数据传输和存储问题的通用方法。

## base64 的编码/解码过程

Base64 编码的基本思想是将二进制数据转换为 64 个可打印字符（英文大小写 52 个字母、数字 0-9、+、/），从而简化二进制数据的传输和存储。

![](https://cdn.jsdelivr.net/gh/chenxiaoyao6228/cloudimg@main/2023/base64-table.png)

### 编码过程:

- 将二进制数据划分为 6 位组: 将输入的二进制数据按照 6 位一组进行划分。

- 添加填充（Padding）: 如果最后一组的位数不足 6 位，会使用零来进行填充，直到达到 6 位。

- 转换为十进制: 将每个 6 位组转换为对应的十进制数。

- 映射到 Base64 字符集: 将每个十进制数映射到 Base64 字符集中的相应字符。

- 生成 Base64 编码: 将映射后的字符连接起来，形成最终的 Base64 编码字符串。

### 解码过程:

- 将 Base64 字符转换为十进制: 将 Base64 编码字符串中的每个字符反映射回 Base64 字符集对应的十进制数。

- 将十进制数转换为 6 位二进制: 将每个十进制数转换为 6 位的二进制数。

- 去除填充: 如果有填充，将其去除。

- 连接二进制数据: 将所有的二进制数据连接起来。

- 得到原始二进制数据: 得到最终的原始二进制数据。

### 案例“ABC”

下面我们以字符串 "ABC" 为例，演示 Base64 编码的过程。

#### 编码过程

1. 将字符串转换为二进制数据(根据 ASCII 码)

> A: 01000001
> B: 01000010
> C: 01000011

2. 将二进制数据划分为 6 位组

> 010000 010100 001001 000011

3. 添加填充

在这个例子中，没有需要填充的位数。

4. 转换为十进制

> 16 20 9 3

5. 映射到 Base64 字符集:

使用 Base64 字符集映射到相应的字符:

> Q U J D

6. 生成 Base64 编码

将映射后的字符连接起来即可

> QUJD

**如你所见，从二进制的角度来看，Base64 编码导致的大小增加是显而易见的.原来只需要存储”ABC", 现在需要存储"QUJD"， "ABC" 的二进制表示总长度为 3 _ 8 = 24 位。"QUJD" 的二进制表示总长度为 4 _ 8 = 32 位。所以我们会说 Base64 编码后的数据大小会比原来增加 1/3。**

#### 解码过程

1. 将 Base64 字符转换为十进制

> Q: 16
> U: 20
> J: 9
> D: 3

2. 将十进制数转换为 6 位二进制

> 10000 10100 01001 00011

3. 去除填充

这里没有填充需要去除

4. 连接二进制数据

> 100001010001000100011

5. 得到原始二进制数据

> 01000001 01000010 01000011

6. 将二进制数据转换为字符串

> A B C

## btoa 与 atob

### btoa

js 中提供了 btoa 方法, 可以将字符串转换为 base64 编码的字符串。

比如 btoa('ABC'), 得到的结果就是上面的'QUJD'

我们也可以实现自定义的 btoa 方法，如下:

```js
function customBtoa(str) {
  // 定义 Base64 字符集
  const base64Chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

  // 将字符串转换为 UTF-8 编码的字节数组
  const bytes = Array.from(str).map((char) => char.charCodeAt(0));

  let binaryString = "";

  // 将字节数组转换为二进制字符串
  bytes.forEach((byte) => {
    binaryString += byte.toString(2).padStart(8, "0");
  });

  // 对二进制字符串进行补零，使其长度为 24 的倍数
  while (binaryString.length % 24 !== 0) {
    binaryString += "00000000";
  }

  // 将二进制字符串划分为 6 位一组，并转换为对应的 Base64 字符
  let base64Result = "";
  for (let i = 0; i < binaryString.length; i += 6) {
    const sixBits = binaryString.slice(i, i + 6);
    base64Result += base64Chars[parseInt(sixBits, 2)];
  }

  // 添加 Base64 填充
  while (base64Result.length % 4 !== 0) {
    base64Result += "=";
  }

  return base64Result;
}

// 测试
const originalData = "ABC";
const base64Encoded = customBtoa(originalData);
console.log("Custom Base64 Encoded:", base64Encoded);
```

### atob

js 中提供了 atob 方法, 可以将 base64 编码的字符串转换为原始字符串。

比如 atob('QUJD'), 得到的结果就是上面的'ABC'

下面我们尝试自己实现一个

```js
function customAtob(base64String) {
  // 定义 Base64 字符集
  const base64Chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

  // 移除 Base64 填充字符
  const base64WithoutPadding = base64String.replace(/=+$/, "");

  let binaryString = "";

  // 将 Base64 字符转换为对应的 6 位二进制字符串
  for (let i = 0; i < base64WithoutPadding.length; i++) {
    const char = base64WithoutPadding[i];
    const charIndex = base64Chars.indexOf(char);
    binaryString += charIndex.toString(2).padStart(6, "0");
  }

  // 对二进制字符串进行补零，使其长度为 8 的倍数
  while (binaryString.length % 8 !== 0) {
    binaryString = binaryString.slice(0, -1);
  }

  // 将二进制字符串划分为 8 位一组，并转换为对应的字符
  let result = "";
  for (let i = 0; i < binaryString.length; i += 8) {
    const eightBits = binaryString.slice(i, i + 8);
    result += String.fromCharCode(parseInt(eightBits, 2));
  }

  return result;
}

// 测试
const base64Encoded = "QUJD";
const originalData = customAtob(base64Encoded);
console.log("Custom Base64 Decoded:", originalData);
```

## base64 与 dataURL

DataURL（数据URL）是一种特殊的URI方案，用于在网页中嵌入小文件，通常是图像或其他媒体文件。DataURL包含了文件的基本信息以及经过Base64编码的文件内容。

DataURL的格式如下：

> data:[<mediatype>][;base64],<data>

其中，<mediatype>表示媒体类型（如image/png、image/jpeg等），;base64表示数据使用Base64编码，而<data>则是经过Base64编码的文件内容。


### base64转DataURL

```js
function base64ToDataURL(base64String, mimeType) {
  const dataURL = `data:${mimeType || "application/octet-stream"};base64,${base64String}`;
  return dataURL;
}
```

### DataURL转base64

```js
function dataURLToBase64(dataURL) {
  const base64String = dataURL.split(",")[1];
  return base64String;
}
```

## 参考

- https://en.wikipedia.org/wiki/Base64

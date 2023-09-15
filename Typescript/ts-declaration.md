## ts的三种类型来源与三种类型声明

TypeScript是一种在编译时为JavaScript添加类型信息并进行类型检查的工具。

除了在变量声明时定义类型之外，TypeScript还支持使用`declare`关键字单独声明类型。专门包含类型声明的文件以".d.ts"为后缀。

TypeScript提供了三种主要存放类型声明的地方：

1. **lib**: 这些是内置的类型声明，包括DOM和ECMAScript标准的类型声明，因为它们都有已确定的规范。

2. **@types/xx**: 这些是不同环境下的API类型声明，比如Node.js，还有npm包的类型声明。

3. **开发者编写的代码**: 类型可以通过使用`include`、`exclude`和`files`选项来指定。

此外，npm包也可以包含TypeScript类型声明，可以在package.json文件中使用`types`字段指定。

通常情况下，像Vue这样的库的类型声明存放在npm包中，而React的类型声明则位于"@types/react"包中。这一区别是因为Vue的源代码是用TypeScript编写的，而React的源代码则不是。

有趣的是，TypeScript提供了三种声明模块的方法：

1. **namespace**: 这是最早实现模块的方式之一，它编译为JavaScript代码，声明对象并设置其属性，非常容易理解。

2. **module**: 这与namespace方法在AST方面几乎没有区别。然而，它通常用于声明CommonJS模块，@types/node下有许多这样的声明。

3. **ES模块**: 这遵循ECMAScript模块语法标准。TypeScript通过引入"import type"扩展了这一功能。

默认情况下，".d.ts"文件中的类型声明是全局的，除非有"import"和"export"声明将它们转换为ES模块。在这种情况下，必须手动添加"declare global"。为了避免这种情况，可以使用"reference"等编译器指令。

学习类型定义有助于为JavaScript添加类型，而学习类型编程涉及到动态生成和修改类型。这些类型可以通过模块或全局方式组织，因此理解模块语法非常重要。此外，这些类型可能存放在"lib"、"@types/xxx"、用户目录等位置，因此理解不同来源的类型查找机制也很重要。
## @ -1,77 +0,0 @@

title: '实现 angluar 手记[七]操作符表达式'
date: 2019-07-20T08:12:46.000Z
categories:

- tech
  tags:
- angular
  permalink: 2019-07-20-build-your-own-angular-operator-expression

---

## 前言

难点有两个:

- 如何正确地对这些操作进行分类
- 如何保证各个操作符的优先级 ? 我们使用的是 fallback 的方法, 使用函数的优先执行来提升优先级

![operator-precedence]()

1. Primary expressions: Lookups, function calls, method calls.
2. Unary expressions: +a, -a, !a.
3. Multiplicative arithmetic expressions: a \* b, a / b, and a % b.
4. Additive arithmetic expressions: a + b and a - b.
5. Relationalexpressions:a<b,a>b,a<=b,anda>=b.
6. Equality testing expressions: a == b, a != b, a === b, and a !== b. 7. Logical AND expressions: a && b.
7. Logical OR expressions: a || b.
8. Ternary expressions: a ? b : c.
9. Assignments: a = b.

具体实现:

```

```

操作符的数据类型格式

```javascript
{
    type: AST.BinaryExpression,
        left: left,
        operator: token.text,
        right: this.unary()
    };
```

## 一元表达式(UnaryExpression)

## 二元表达式(BinaryExpression)

## 乘除

## 加减

## 逻辑运算符

## 括号

因为括号贯穿了整个优先级属性表， 因此需要优先被处理

```js
primary() {
    let primary
    if (this.expect('(')) {
      primary = this.assignment()
      this.consume(')')
    } else if (this.expect('[')) {
      primary = this.arrayDeclaration()
    }else{
      // ...
    }
}
```

## 语句(statement)

## 总结

本章实现了简单的表达式解析器，和一个完整的 Javascript 解析器相比虽然简陋了些，但是足以应对大部分使用场景，表达式存在的意义仅仅是数据绑定， 更加复杂的逻辑不应该放到表达式里面去写。

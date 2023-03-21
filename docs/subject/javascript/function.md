# 函数相关

函数是将复用的代码块封装起来的模块，在JS中函数

## 函数声明

### Function声明
在JS中，函数也是对象，是Function类的创建实例，下面的例子可以方便理解函数是对象。

```javascript
let fn = new Function("title", "console.log(title)");

fn("标题");
```

### 标准语法声明

是同 `function` 声明

```javascript
function fn(title) {
  console.log(title);
}

fn("标题");
```
### 匿名函数赋值声明

```javascript
const fn = function(title) {
  console.log(title);
}

fn('标题');
```

### 对象中声明函数

```javascript
let user = {
  name: null,
  getName: function() {
    // this 指向当前调用者，即user对象
    return this.name
  },
  // 简写
  setName(value) {
    this.name = value
  }
}

user.setName("张三");
console.log(user.getName());
```

### 函数声明中需要注意的点！

- 🧠 `var`、`function` 式声明函数都会将函数压入window对象中，所以在声明时需要避免污染window对象中的api。使用 `let`、`const` 则不会， 这是语言的前期缺陷造成的。

```javascript
function a() {
  console.log("函数A");
}

var b = function() {
  console.log("函数B");
}

let c = function() {
  console.log("函数C");
}

const d = function() {
  console.log("函数D");
}

console.log(window.a()); // 函数A
console.log(window.b()); // 函数B
console.log(window.c()); // window.c is not a function
console.log(window.d()); // window.d is not a function
```

- 🧠 标准声明 `function` 会变量提升，js解析器会优先提取函数并放在代码树顶端，所以标准函数的声明可以不限位置。当然，不建议这样做，这也是前端js语言的缺陷造成的。

例子1：🌰
```javascript
console.log(a()); // 函数A
function a() {
  console.log("函数A");
}
```

例子2：🌰 `var` 声明的函数不会提升到顶端，所以运行优先级低于`function`
```javascript
console.log(a()); // 函数A

// function a() {} 在解析时直接提升到最顶端
function a() {
  console.log("函数A- function");
}

// var 变量提升
// 运行到这里在 将function() {} 赋值给变量a
var a = function() {
  console.log("函数A- var ");
}
```

- 🧠 匿名函数自执行。在es6之前，常使用匿名函数自执行，形成单独的作用域，避免污染全局。

基本语法
```javascript
(function() {
  console.log("匿名函数自执行");
})(); // 匿名函数自执行
```

避免污染全局

```javascript
(function(window) {
  var a = "这是变量a的值";

  // 手动挂载到window
  window.globalA = { a };
})(window);
```

## 函数参数

### 形参和实参

形参是在函数声明时设置的参数；实参是指在调用函数时传递的值。

```javascript
// 此时 a 和 b 为形参
function sum(a, b) {
  return a + b;
}

// 1 和 2 为 实参
sum(1,2);

// 1. 形参数量大于实参时，没有传值的形参值为undefined
// 2. 实参数量大于形参时，多余的实参将会被忽略且不会报错
```

### 默认参数赋值

```javascript
// 方式一：
function sum(a, b) {
  a = a || 1;
  b = b || 1;
  return a + b;
}

// 简化方式二：
function sum(a = 1, b = 2) {
  return a + b;
}
```

### 回调函数

函数可以作为另一个函数的参数传入。常见的如 `.map`、`.foreach`、`addEventListener` 等等。

作为入参的函数被称为 `回调函数`
调用入参函数的函数被称为 `高阶函数`

```javascript
// .filter这类的函数就被称为高阶函数
let newArr = [1, 2, 3, 4, 5].filter(v=> {
  return v <= 3;
});

console.log(newArr); // [1, 2, 3]
```

### arguments

arguments是函数获得所有参数的集合

```javascript
// ... 聚合参数
function sum(...arguments) {
  return arguments.reduce((a, b) => a + b);
};

sum(1,2,3,4);
```

### 展开语法作为入参的应用

展开语法 ` ... ` 做值时是放，作为接收变量时是收。

```javascript
let arr = [1, 2, 3];

// 解构赋值
let [a, b, c] = [...arr];  // 左侧赋值； 右侧浅拷贝
console.log(`a:${a};b:${b};c:${c}`); // a:1;b:2;c:3

// 作为变量接收
[...arr] = [1,2,3,4,5]; // 收值
console.log(arr); // [1,2,3,4,5]
```

使用展开语法可以替代 `arguments` 来接收任务数量的参数, 并将其合并为数组
```javascript
function fn(...args) {
  console.log(args);
}

fn(1,2,3, '测试展开语法'); // [1, 2, 3, '测试展开语法']
```

当多个参数时， 必须将展开语法放在最后一位, 不然后置位入参则为 `undeined`,原因是会将当前位置之后的所有实参都会收集起来。

```javascript
function sum(discount = 0, ...prices) {
  let total = prices.reduce((pre, cur) => pre + cur);
  return total * (1 - discount);
}

console.log(sum(0.1, 100, 300, 299)); //
```

## 递归调用

递归指函数内部调用自身的方式。

 - 主要用于数量不确定的循环操作
 - 必须要有退出判断否则会陷入死循环


例1🌰：阶乘递归调用
```javascript
function factorial(num = 3) {
  return num <= 1 ? num : num * factorial(--num);
}

console.log(factorial(5)); // 120
```

例2🌰： 累加算法
```javascript
function sum(...num) {
  return num.length == 0 ? 0 : num.pop() + sum(...num)
}

console.log(sum(1, 5,  6, 5, 9))
```

例3🌰： 递归输出倒三角

``` javascript
/**
 * 输出

******
*****
****
***
**
*

*/

function star(row = 5) {
  if (row === 0) return '';
  document.write('*'.repeat(row) + '<br />');
  star(--row);
}
```

## 标签函数

使用函数来解析标签字符串，第一个参数是字符串值得数组，其余得参数作为标签变量

```javascript
function returnAbout(strs, ...values) {
  console.log(strs); // ['三国著名人物：', '-', raw: Array(3)]
  console.log(values); // ['卧龙诸葛', '诸葛亮']
}

let nickName = '卧龙诸葛',name = '诸葛亮';

returnAbout `三国著名人物：${nickName}-${name}`
```

## this指向

调用函数时 `this` 会隐式传递给函数，指向函数调用时得关联对象，也称之为函数得上下文。

全局环境下 `this` 就是window对象的引用
```javascript
console.log(this === window);  // true
```

使用严格模式时，在全局函数内 `this` 为 `undefined`

```javascript
var grilFired = '玛丽亚'

function get() {
  "use strict"
  return this.grilFired;
}

console.log(get()); // Cannot read property 'name' of undefined
```


方法调用时的this指向：函数为对象的方法时 `this` 指向该对象。可以使用多种方式创建对象

- 构造函数

```javascript
function User() {
  this.name = "张三";
  this.getName = function() {
    console.log(this); // User {name: "张三"， getName: f}
    return this.name;
  }
}

let personal = new User()
console.log(personal.getName()); // 张三
```

- 对象字面量

```javascript
let personal = {
  name: "张三",
  getName() {
    console.log(this); // personal {}
    function getFistrName() {
      console.log(this); // window
    }

    // 不属于对象方法所以指向 `window`
    getFistrName()
  }
}

personal.getName()
```

可以在父作用域中定义引用this的变量

```javascript
let personal = {
  name: "张三",
  getName() {
    console.log(this); // personal {}
    const _self = this
    function getFistrName() {
      console.log(_self); // personal {}
    }
    getFistrName()
  }
}

personal.getName()
```

在使用某些函数时，可以直接传this进去

```javascript
let Lesson = {
  site: '叮当网',
  lists: ['js', 'css', 'html'],
  show() {
    return this.lists.map(function(title) {
      return `${this.state}-${title};`
    }, this);
  }
}
```


## 箭头函数

箭头函数是ES6推出的新的函数声明的简写形式。

```javascript
// 标准格式
const sum = () => {
  console.log('sum函数执行');
}

// 只有一个参数时，可以省略括号
const printA = word => {
  console.log(`输出的是：${word}`);
}

// return 的函数体只有一句时， 可以省略 {}
const sun = (a, b) => a + b
```

箭头函数没有this，也可以理解为箭头函数中的 `this` 会继承定义函数时的上下文，可以理解为和外层函数指向同一个this。

```javascript
let personal = {
  name: "张三",
  getName() {
    console.log(this); // personal {}
    const getFistrName = () => {
      console.log(this); // personal {}
    }
    getFistrName()
  }
}

personal.getName()
```

## apply/call/bind 







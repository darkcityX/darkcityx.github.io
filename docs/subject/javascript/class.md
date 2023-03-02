# class类

## 类初识

- 1. class是ES6中新的语法糖，表面上可以支持正式的面向对象编程，但实际上仍就使用的是原型和构造函数的概念

- 2. 类的首字母大写，区别其创造的实例：通过class Student{}创建student

- 3. 类实质上就是一个函数。类自身指向的就是构造函数。所以可以认为ES6中的类其实就是构造函数的另外一种写法。


## 创建类 class

通过`constructor`属性接收传递的参数进行赋值

```javascript
class User {
  // 定义了专门声明构造函数的关键词 constructor
  constructor(name) {
    this.name = name
  }
}

const user = new User('张三')
console.log(user) // User {name: '张三'}
```

可以直接在类中赋值，进行属性的添加

```javascript
class User {
  age = 18
  constructor(name) {
    this.name = name
  }
}

const user = new User('张三')
console.log(user) // User {age: 38, name: '张三'}
```

可以通过内部方法定义，获取/修改类内部数据

```javascript
class User {
  age = 18
  constructor(name) {
    this.name = name
  }
  getName() {
    return this.name
  }
  changeName(newName) {
    this.name = newName
  }
}

const user = new User('张三')
user.changeName('李四')
console.log (user.getName())
```

## 静态属性和方法 static

如果一个属性是为了所有对象所共用的，不是为了某一个具体对象使用，这时候就可以将其定义为静态属性或静态方法。

```javascript
class User {
  static company = '好迪有限公司'
  constructor(name) {
    this.name = name
  }
  static getCompany() {
    return User.company
  }
}

User.getCompany() // 好迪有限公司
```

被静态static标识的属性或方法只能被类调用，不能被实例调用，也不属于子类`继承`,换句话说，它只属于当前类。

```javascript
class User {
  static company = '好迪有限公司'
  constructor(name) {
    this.name = name
  }
  static getCompany() {
    return User.company
  }
}

const user = new User()
user.getCompany() // Uncaught TypeError: user.getCompany is not a function
```

应用：静态方法非常适合作为实例工厂

```javascript
class User {
  constructor(name, age) {
    this.name = name,
    this.age = age
  }
  static create(...args) {
    // 这里是 this 指向的就是当前对象
    // 所以可以 new this 创建构造函数
    return new this(agrs)
  }
}

// 通过调用静态方法创建出构造函数
const user = User.create('张三', 19)
console.log(user)
```

## 访问器 get、set








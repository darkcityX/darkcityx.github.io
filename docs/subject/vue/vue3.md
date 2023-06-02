# vue3相关

## API 风格
 Vue3 的组件可以按两种不同的风格书写：选项式 API 和组合式 API。

- 选项式API (Options API)

 即vue2式用包含多个选项的对象来描述组件的逻辑。例如data、methods、mounted等，选项所定义的属性都会暴露在函数内部的 this 上，它会指向当前的组件实例。
 ```javascript
 <script>
export default {
  data() {
    return {}
  },
  methods: {},
  mounted() {}
}
</script>
```

- 组合式API (Composition API)

通过组合式 API，我们可以使用导入的 API 函数来描述组件逻辑。在单文件组件中，组合式 API 通常会与 `<script setup>` 搭配使用。

```javascript
<script>
import { ref, onMounted } from 'vue';

const count = ref(0);
const handleClick = () => {
  count.value++;
}

onMounted(() => {})
</script>
```


## 初识setup

#### setup 是一个专门用于组合式 API 的特殊钩子函数

```javascript
<script>
import { reative } from 'vue'

setup() {
  const state = reative({ count: 0 })

  // 在setup钩子函数中, 必须将声明的变量暴露出去，模板才能接收的到。
  return {
    state
  }
}
</script>

<template>
  <p>{{ state.count }}</p>
</template>
```

在 setup() 函数中手动暴露大量的状态和方法非常繁琐。幸运的是，我们可以通过使用构建工具来简化该操作。

#### setup script

```javascript
<script setup>
import { reative } from 'vue';

const state = reative({ count: 0 });
</script>

<template>
  <p>{{ state.count }}</p>
</template>
```
这个 setup attribute 是一个标识，告诉 Vue 需要在编译时进行一些处理，让我们可以更简洁地使用组合式 API。比如，`<script setup> `中的导入和顶层变量/函数都能够在模板中直接使用。

`<script setup>` 中的顶层的导入和变量声明可在同一组件的模板中直接使用。你可以理解为模板中的表达式和` <script setup>` 中的代码处在同一个作用域中。


## 响应式基础 - reactive 

在Vue中，状态都是默认深层响应式的。这意味着即使在更改深层次的对象或数组，你的改动也能被检测到。

```javascript
<script setup>
import { reactive } from 'vue';

const state = reactive({
  info : { code: 0 },
  colors: ['red', 'green']
});

const handleEditState = () => {
  state.info.code++;
  state.colors.push('yellow');
}
</script>

<template>
  <!-- {info: {code:1},colors: ['red', 'green', 'yellow']} -->
  <p>{{ state }}</p>
  <hr />
  <button @click="handleEditState">修改信息</button>
</template>
```

:::warning
reactive() API 有两条限制:
 - 仅对对象类型有效（对象、数组和 Map、Set 这样的集合类型），而对 `string`、`number` 和 `boolean` 这样的 原始类型 无效。
 - 因为 Vue 的响应式系统是通过属性访问进行追踪的，因此我们必须始终保持对该响应式对象的相同引用。这意味着我们不可以随意地“替换”一个响应式对象，因为这将导致对初始引用的响应性连接丢失：
:::

 ```javascript
 let state = reactive({ count: 0 })

// 上面的引用 ({ count: 0 }) 将不再被追踪（响应性连接已丢失！）
state = reactive({ count: 1 })
 ```

 同时这也意味着当我们将响应式对象的属性赋值或解构至本地变量时，或是将该属性传入一个函数时，我们会失去响应性：

 ```javascript
 const state = reactive({ count: 0 })

// n 是一个局部变量，同 state.count
// 失去响应性连接
let n = state.count
// 不影响原始的 state
n++

// count 也和 state.count 失去了响应性连接
let { count } = state
// 不会影响原始的 state
count++

// 该函数接收一个普通数字，并且
// 将无法跟踪 state.count 的变化
callSomeFunction(state.count)
 ```

 ### ts为reactive()标注类型

reactive()会隐式的从它的参数中推导类型：
```javascript
import { reactive } from 'vue'

// 推导得到的类型：{ title: string }
const book = reactive({ title: 'Vue 3 指引' })
```

要显式地标注一个 reactive 变量的类型，我们可以使用ts接口：

```ts
import { reactive } from 'vue'

interface Book {
  title: string
  year?: number
}

const book: Book = reactive({ title: 'Vue 3 指引' })
```

## 响应式变量 ref()

由于`reactive()`只能用于引用类型的数据，所有Vue提供了一个`ref()`方法来允许我们创建可以使用任何值类型的响应式 ref。

```javascript
<script>
import { ref } from 'vue'

const count = ref(0)
</script>
```

`ref()` 将传入参数的值包装为一个带 .value 属性的 ref 对象, 所以访问和修改时，需要`.value`:

```javascript
<script>
import { ref } from 'vue'

const count = ref(0)

console.log(count) // {value: 0}
console.log(count.value) // 0

count.value++
console.log(count.value)
</script>
```

在 `template` 模板中，Vue会自动解包，所以不需要使用 `.value`

```javascript
<script>
import { ref } from 'vue'

const count = ref(0)
console.log(count.value)
</script>

<template>
  <p>{{ count }}</p>
</template>
```

要注意，仅当 ref 是模板渲染上下文的顶层属性时才适用自动“解包”。 例如， `object` 是顶层属性，但 `object.foo` 不是。

```javascript
<script>
import { ref } from 'vue'

const obeject = { foo: ref(1) }
console.log(count.value)
</script>
```

当一个 `ref` 被嵌套在了响应式对象中，作为属性被访问或更改时，它会自动解包，因此会表现得和一般的属性一样：

```javascript
<script>
import { ref } from 'vue'

const count = ref(0)
const state = reactive({
  count
})

// 自动解包
state.count++
console.log(state.count) // 1
</script>
```

和响应式对象不同，当 ref 作为响应式数组或像 Map 这种原生集合类型的元素被访问时，不会进行解包。

```javascript
<script>
import { ref, reactive } from 'vue'

const books = reactive(ref('vue3'))
// 这里需要 .value
console.log(books[0].value)

const map = reactive(new Map([['count', ref(0)]]))
// 这里需要 .value
console.log(map.get('count').value)
</script>
```

### 为 `ref()` 标注类型

ref 会根据初始化时的值推导其类型。
```javascript
<script>
import { ref } from 'vue'

// 推导出的类型：Ref<number>
const year = ref(2020)

// => TS Error: Type 'string' is not assignable to type 'number'.
year.value = '2020'
</script>
```

有时我们可能想为 ref 内的值指定一个更复杂的类型，可以通过使用 `Ref` 这个类型:
```javascript
import { ref } from 'vue'
import type { Ref } from 'vue'

const year: Ref<string | number> = ref('2020')

year.value = 2020 // 成功！
```

或者，在调用 ref() 时传入一个泛型参数，来覆盖默认的推导行为
```javascript
import { ref } from 'vue'

const year = ref<string | number>('2020')

year.value = 2020 // 成功！
```

如果你指定了一个泛型参数但没有给出初始值，那么最后得到的就将是一个包含 undefined 的联合类型：
```javascript
import { ref } from 'vue'

// 推导得到的类型：Ref<number | undefined>
const year = ref<number>()
```

## 计算属性computed()

模板中的表达式虽然方便，但也只能用来做简单的操作。如果在模板中写太多逻辑，会让模板变得臃肿，难以维护。比如说，我们有这样一个包含嵌套数组的对象：

```javascript
<script setup lang='ts'>
import { reactive } from 'reactive'

const author = reactive({
  name: 'John Doe',
  books: [
    'Vue 2 - Advanced Guide',
    'Vue 3 - Basic Guide',
    'Vue 4 - The Mystery'
  ]
})
</script>

<template>
  <p>Has published books:</p>
  <span>{{ author.books.length > 0 ? 'Yes' : 'No' }}</span>
</template>
```

如果在模板中需要不止一次这样的计算，我们可不想将这样的代码在模板里重复好多遍。因此我们推荐使用计算属性来描述依赖响应式状态的复杂逻辑.

```javascript
<script setup lang='ts'>
const author = reactive({
  name: 'John Doe',
  books: [
    'Vue 2 - Advanced Guide',
    'Vue 3 - Basic Guide',
    'Vue 4 - The Mystery'
  ]
})

const publicksheBooksMessage = computed(() => {
  return author.books.length > 0 ? 'Yes' : 'No'
})
</script>

<template>
  <p>Has published books:</p>
  <span>{{ publicksheBooksMessage }}</span>
</template>
```

`computed() `方法期望接收一个 `getter` 函数，返回值为一个计算属性 ref。和其他一般的 ref 类似，你可以通过 `publishedBooksMessage.value` 访问计算结果。

Vue 的计算属性会自动追踪响应式依赖。它会检测到 publishedBooksMessage 依赖于 author.books，所以当 author.books 改变时，任何依赖于 publishedBooksMessage 的绑定都会同时更新。

### 计算属性缓存 vs 方法

将同样的函数定义为一个方法而不是计算属性，两种方式在结果上确实是完全相同的，然而，不同之处在于计算属性值会基于其响应式依赖被缓存。一个计算属性仅会在其响应式依赖更新时才重新计算。这意味着只要 author.books 不改变，无论多少次访问 `publishedBooksMessage` 都会立即返回先前的计算结果，而不用重复执行 `getter` 函数。

为什么需要缓存呢？想象一下我们有一个非常耗性能的计算属性 list，需要循环一个巨大的数组并做许多计算逻辑，并且可能也有其他计算属性依赖于 list。没有缓存的话，我们会重复执行非常多次 list 的 `getter`，然而这实际上没有必要！如果你确定不需要缓存，那么也可以使用方法调用。

### 可写计算属性

计算属性默认是只读的。当你尝试修改一个计算属性时，你会收到一个运行时警告。只在某些特殊场景中你可能才需要用到“可写”的属性，你可以通过同时提供 getter 和 setter 来创建。

```vue
<script setup lang='ts'>
import { ref, computed } from 'vue'

const firstName = ref('东方')
const lastName = ref('不败')

const fullName = computed({
  get() {
    return `${firstName.value}·${lastName.value}`
  },
  set(newVal) {
    [firstName.value, lastName.value] = fullName.split('·')
  }
})
</script>

<template>
  <p>Has published books:</p>
  <span>{{ publicksheBooksMessage }}</span>
</template>
```

:::warning
import1： 计算属性的 getter 应只做计算而没有任何其他的副作用。不要在 getter 中做异步请求或者更改 DOM！一个计算属性的声明中描述的是如何根据其他值派生一个值。因此 getter 的职责应该仅为计算和返回该值。

import2：避免直接修改计算属性值。从计算属性返回的值是派生状态。可以把它看作是一个“临时快照”，每当源状态发生变化时，就会创建一个新的快照。更改快照是没有意义的，因此计算属性的返回值应该被视为只读的，并且永远不应该被更改——应该更新它所依赖的源状态以触发新的计算。
:::

### 为`computed()` 标注类型

computed() 会自动从其计算函数的返回值上推导出类型：

```vue
<script setup lang='ts'>
import { ref, computed } from 'vue'

const count = ref(0)

// 推到得到的类型： ComputedRef<number>
const double = computed(() => count.value*2)

// => TS Error: Property 'split' does not exist on type 'number'
const result = double.value.split('')
</script>
```

可以通过泛型参数显示指定类型

```vue
<script setup lang='ts'>
import { ref, computed } from 'vue'

const count = ref(0)

// 推到得到的类型： ComputedRef<number>
const double = computed<number>(() => count.value*2)
</script>
```

## `watch`、`watchEffect` 侦听器

在某些情况，我们需要在状态变化时执行一些副作用，如更改DOM或这时根据异步操作的结果去修改另一个状态。在组合API中，就可以使用 `watch` 在每次响应式状态发生变化时触发回调函数：

```vue
<script setup>
import { ref, watch } from 'vue';

const question = ref('');
const answer = ref('这是答案')；

watch(question, async (newQuestion, oldQuestion) => {
  if (newQuestion.indexof('?' > -1)) {
    answer.value = 'Thing...';
    try {
      const res = await fetch('https://yesno.wtf/api');
      answer.value = (await res.json()).answer;
    } catch(err) {
      answer.value = `Error:${err}`
    }
  }
})
</script>

<template>
  <p>
    请输入你的问题：<input v-model="question" />
  </p>
  <p>
    答案：{{ answer }}
  </p>
</template>
```

### 侦听数据源类型

`watch` 的第一个参数可以时不同形式的 数据源 ：它可以是一个ref（包括计算属性）、一个响应式对象、一个getter函数、或者多个数据源组成的数组：

```vue
<script setup>
const x = ref(0);
const y = ref(0);

// 单个ref
watch(x, newX => {
  console.log(`new x is ${newX}`);
});

// getter 函数
watch(
  () => x.value + y.value,
  (sum) => {
    console.log(`x y计算的总和是：${sum}`)
  }
)

// 多个数据源组成的数组
watch(
  [x, () => y.value],
  ([newX, newY]) => {
    console.log(`x is ${newX} and y is ${newY}`)
  }
)
</script>
```

注意，在侦听响应式对象的属性值时，不能直接侦听，需要用各个返回该属性的getter函数：

```vue
<script setup>
const obj = reactive({ count: 0 });

// 错误！
watch(obj.count, (count) => {
  console.log(`count is: ${count}`);
});

// 正确： 提供了一个 getter 函数
watch(
  () => obj.count,
  (count) => {
    console.log(`count is: ${count}`);
  }
)
</script>
```

### 深层监听

直接给watch() 传入一个响应式对象，会隐式地创建一个深层侦听器-该回调函数在所有嵌套的变更时都会被触发

```vue
<script setup>
import { reactive, watch } from 'vue'
const obj = reactive({ count: 0 });

watch(
  obj,
  (newVal, oldVal) => {
    // 在嵌套的属性变更时触发
    // 注意： `newVal` 和 `oldVal` 是相等的, 因为他们是同一个对象
  }
)

obj.count++
</script>
```

一个返回响应式对象的getter函数，只有在返回不同的对象时，才会触发回调：
```vue
<script setup>
import { ref, reactive, watch } from 'vue';
const state = reactive({
  someObject: {
    count: 0
  }
});
const showP = ref('');

watch(
  () => state.someObject,
  (newVal) => {
    // 仅当state.someObject 被替换时触发
    console.log(`newVal::`, newVal);
    showP.value = newVal;
  }
);

// 该种是不会触发watch监听
state.someObject.count++;

// 该种会触发watch监听
state.someObject = {
  a: 1
}
</script>

<template>
  <p>
    watch:::
  	{{ showP }}
  </p>
</template>
```

若想强制转成深层侦听，需要显示的增加上deep选项
```vue
<script setup>
import { ref, reactive, watch } from 'vue';
const state = reactive({
  someObject: {
    count: 0
  }
});
const showP = ref('');

watch(
  () => state.someObject,
  (newVal) => {
    console.log(`newVal::`, newVal);
    showP.value = newVal;
  },
  // 显式强制转换为深层监听
  {
    deep: true
  }
);

state.someObject.count++;
</script>

<template>
  <p>
    watch:::
  	{{ showP }}
  </p>
</template>
```
:::warning 谨慎使用
深度侦听需要遍历被侦听对象中的所有嵌套的属性，当用于大型数据结构时，开销很大。因此请只在必要时才使用它，并且要留意性能。
:::

### 即时回调的侦听器

`watch` 默认是懒执行：仅当数据源变化时，才会执行回调。

在某些场景下，我们希望在创建侦听器时，就要立即执行一遍回调。这时，我们可以通过 `immediate: true` 来强制侦听器的回调立即执行。

```vue
<script setup>
import { ref, reactive, watch } from 'vue';
const state = reactive({
  count: 10
});
const showP = ref(0);

watch(
  () => state.count,
  (newVal) => {
    console.log(`newVal::`, newVal);
    showP.value = newVal;
  },
  {
    immediate: true
  }
);
</script>
```

### `watchEffect()`

侦听器的回调使用与源完全相同的响应式状态是很常见的。需要注意的是监听的数据一次是作为源，另一次是在回调中

```vue
<script setup>
import { ref, watch } from 'vue'

const todoId = ref(1)
const data = ref(null)

watch(
  todoId,
  async () => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId.value}`)
    data.value = await reponse.json()
  },
  {
    immediate: true
  }
)
</script>
```

以上示例可以使用 `watchEffect 函数` 来简化上面的代码。 `waatchEffect()` 允许我们自动跟踪毁掉的响应式依赖。

```vue
<script setup>
import { ref, watchEffect } from 'vue'

const todoId = ref(1)
const data = ref(null)

watchEffect(
  async () => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId.value}`)
    data.value = await reponse.json()
  },
  {
    immediate: true
  }
)
</script>
```

在该示例中，回调会立即执行，不需要指定 `immediate: true`。 在执行期间，它会自动追踪 `todoId.value` 作为依赖。每当 `todoId.value` 变化时，回调会再次执行。有了`watchEffect()` 就不在需要 明确传递 `todoId` 作为源值。

对于只有一个依赖项的示例来说， `watchEffect()` 的好处相对较小。 但是对于有多个依赖项的侦听器来说，使用 `wacthEffect()` 可以消除手动维护依赖列表的负担。此外，如果你需要侦听一个嵌套数据结构中的几个属性，`watchEffect()` 可能回避深度侦听器更有效，因为它将只跟踪回调中被使用到的属性，而不是递归跟踪所有的属性。

:::warning 注意
`watchEffect` 仅会在其 `同步` 执行期间，才追踪依赖。 在使用异步回调时，只有在第一个 `await` 正常工作前访问到的属性才会被追踪。
:::

### `watch` vs `watchEffect`

`watch` 和 `watchEffect` 都能响应式地执行有副作用的回调。它们之间的区别是追踪响应式依赖的方式：

- `watch` 只追踪明确声明侦听的数据源。它不会追踪任何在回调中访问的东西。另外，仅在数据源确实改变时才会触发回调。`watch` 会避免在发生副作用时追踪依赖，因此，我们能更加精确的控制回调函数的触发时机。

- `watchEffect` 则会在副作用发生期间追踪依赖。它会在同步执行过程中，自动追踪所有能访问到的响应式属性。这更方便，而且代码往往更简介，但是响应式依赖关系就不会那么明确

### 回调的触发时机

当你更改了响应式状态，他可能会同时触发Vue组件更新和侦听器回调。

默认情况下，用户创建的侦听器回调，都会在Vue组件更新之前被调用。这意味着你在侦听器回调中访问的DOM将是被Vue更新之前的状态。

如果想在侦听器回调中能访问被vue更新之后的DOM, 你需要指明 `flush: 'post'` 选项：

```vue
<script setup>
// watch
watch(
  source,
  callBack,
  { flush: 'post' }
)

// watchEffect
watchEffect(
  callBack,
  { flush: 'post' }
)

// wacthEffect post 简化api
import { wacthPostEffect } from 'vue'

watchPostEffect(() => {
  /* 在vue更新后执行 */
})
</script>
```

### 停止侦听器

在 `setip()` 或 `<script setup>` 中用同步语句创建的侦听器，会自动绑定到宿主实例上，并且会在宿主组件卸载时自动停止。

侦听器必须用同步语句创建：如果用异步回调创建一个侦听器，那么它不会绑定到当前组件上，你必须手动停止它，以防内存泄漏。

```vue
<script setup>
import { wactEffect } from 'vue'

// 它会自动停止
wactEffect(() => {})

// 这个则不会
setTimeout(() => {
  wacthEffect(() => {})
}, 100)

</script>
```



## 生命周期钩子

每个 Vue 组件实例在创建时都需要经历一系列的初始化步骤，比如设置好数据侦听，编译模板，挂载实例到 DOM，以及在数据改变时更新 DOM。在此过程中，它也会运行被称为生命周期钩子的函数，让开发者有机会在特定阶段运行自己的代码。

![生命周期](/images/vue3/lifecycle.png)

### `onMounted()` 在组件挂载完成后执行

:::warning
 这个钩子在服务器端渲染期间不会被调用
:::

#### 类型：
```vue
function onMouned(callback: () => voide): void
```

#### 详细信息：
组件在一下情况下被视为已挂载：
  1. 其所有同步子组件都已经被挂载 (不包含异步组件或 `<Suspense>` 树内的组件)
  
  2. 其自身的 DOM 树已经创建完成并插入了父容器中。注意仅当根容器在文档中时，才可以保证组件 DOM 树也在文档中。

这个钩子通常用于执行需要访问组件所渲染的 DOM 树相关的副作用，或是在服务端渲染应用中用于确保 DOM 相关代码仅在客户端执行。

#### 示例：
```vue
<script setup>
import { ref, onMounted } from 'vue'

const el = ref()

onMounted(() => {
  el.value // <div>
})
</script>

<template>
  <div ref="el"></div>
</template>
```

### `onUpdated()` 在组件因为响应式状态变更而更新其Dom树后调用

:::warning
 - 这个钩子在服务器端渲染期间不会被调用
 - 不要在 updated 钩子中更改组件的状态，这可能会导致无限的更新循环！
:::

#### 类型：
```vue
function onUpdated(callback: () => voide): void
```

#### 详细信息：
父组件的更新钩子将在其子组件的更新钩子之后调用。

这个钩子会在组件的任意 DOM 更新后被调用，这些更新可能是由不同的状态变更导致的。如果你需要在某个特定的状态更改后访问更新后的 DOM，请使用 nextTick() 作为替代。

#### 示例：
```vue
<script setup>
import { ref, onUpdated } from 'vue'

const count = ref(0)

onUpdated(() => {
  const targeDom = document.getElementById('count')
  console.log(targeDom.textContent)
})
</script>

<template>
  <button id="count" @click="count++">{{count}}</button>
</template>
```


### `onUnmounted()` 在组件实例被卸载之后调用

:::warning
 这个钩子在服务器端渲染期间不会被调用
:::

#### 类型：
```ts
function onUnmounted(callback: () => void): void
```

#### 详细信息：
组件在一下情况被视为已卸载：
 1. 其所有子组件都已经被卸载
 2. 所有相关的响应式作用（渲染作用以及setup()时创建的计算属性和侦听器）都已经停止。

可以在该钩子中手动清理一些副作用，如定时器、Dom监听或者与服务器的连接等。

#### 示例：
```vue
<script>
import { onMounted, onUnmounted } from 'vue'

let timer
onMounted(() => {
  timer = setInterval(() => {
    // 定时器任务
  })
})

onUnmounted(() => clearInterval(timer))
</script>
```

### `onBeforeMount() `在组件被挂载前被调用

:::warning
  这个钩子在服务器端渲染期间不会被调用
:::

#### 类型：
```ts
function onBeforeMount(callback: () => void): viod
```
#### 详细信息：
当这个钩子被调用时，组件已经完成了其响应式状态的设置，但还没有创建 DOM 节点。它即将首次执行 DOM 渲染过程。

### `onBeforeUpdate()` 在组件即将因为响应式状态变更而更新其DOM树之前调用

### onBeforeUnmount() // 在组件实例被卸载之前调用

### onErrorCaptured() // 在捕获了后代组件传递的错误时调用

### onRenderTracked() // 开发模式下可用，注册一个调试钩子，当组件渲染过程中追踪到响应式依赖时调用

### onRenderTriggered() // 开发模式下可用，注册一个调试钩子，当响应式依赖的变更触发了组件渲染时调用。

### onActivared() // 若组件实例是`<KeepAlive>`缓存树的一部分，当组件被插入到DOM中时调用

### onDeactivated() // 若组件实例是 `<KeepAlive>` 缓存树的一部分，当组件从 DOM 中被移除时调用。

### onServerPrefeatch() // 在组件实例在服务器上被渲染之前调用


## 模板引用 ref

在某些情况下，我们需要直接访问底层Dom元素。要实现这一点，我们可以使用特殊的 `ref` 标签属性。它允许我们在一个特定的Dom元素或子组件实例被挂载后，获得对它的直接引用。

### 访问模板引用

为了通过组合式API获取该模板引用，我们需要声明一个同名的ref:

```vue
<template>
  <imput ref="inputRef" />
</template>

<script setup>
import { ref, onMounted } from 'vue'

const inputRef = ref(null)

onMounted(() => {
  inputRef.value.focus()
})
</script>
```

注意，你只可以在**在组件挂载后**才能访问模板引用。如果你想在模板中的表达式上访问input，在初次渲染时会是 `null`。

如果你需要侦听一个模板引用ref的变化，确保考虑到其值为 `null` 的情况。

### 为模板引用标注类型

模板引用需要通过一个显式指定的泛型参数和一个初始值 `null` 来创建：


```vue
<template>
  <input ref="el" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const el = ref<HTMLInputElement | null>(null)

onMounted(() => {
  el.value?.focus()
})
</script>
```


### v-for 中的模板引用

:::warning 版本要求
需要 v3.2.25 及以上版本
:::

当 `v-for` 中使用模板引用时，对应的ref中包含的值是一个数组，它将在元素被挂载后包含对应整个列表的所有元素

应当注意的是， ref数组并不保证与原数组相同的顺序。

```vue
<template>
  <ul>
    <li v-for="item in list" ref="itemRefs">
      {{ item }}
    </li>
  </ul>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const inputRef = ref([])

onMounted(() => {
  inputRef.value.focus()
})
</script>
```

### 函数模板引用

除了使用字符串作名字， `ref` 标签属性还可以绑定为一个函数，会在每次组件更新时被调用，该函数会接收到元素引用作为第一个参数：

```vue
<template>
  <input :ref="(el) => { /* 将 el 赋值给一个数据属性或 ref 变量 */ }">
</template>
```

注意我们这里需要使用动态的 `:ref` 绑定才能够传入一个函数。当绑定的元素被卸载时，函数也会被调用一次，此时的 `el` 参数会时null。你当然也可以绑定一个组件的方法而不是内联函数

### 组件上的ref

模板引用可以用在一个子组件上，这种情况下引用中获得的值是组件实例。

如果一个子组件使用的是选项是API或没有使用 `<script setup>` , 被引用的组件实例和该子组件的 `this` 完全一致，这意味着父组件对子组件的每一个属性和方法都有完全的访问权。这使得父组件和子组件之间创建紧密耦合的实现细节变得很容易，当然也因此，应该旨在绝对需要时才使用组件引用。 绝大数情况下，你应该首先使用标准的props和 emit接口来实现父子组件交互

```vue
<template>
  <Child ref="childRef"/>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Child from './Child.vue'

const childrenRef = ref(null)

onMounted(() => {
  console.log(childrenRef)
})
</script>
```

在使用了 `<script setup>` 的组件中，该组件内的属性和方法时默认私有的： 一个父组件无法访问到一个使用了 `<script setup>`  的子组件中的任何东西，除非子组件在其中通过 `defineExpose` 宏显示暴露：

```vue
<script setup>
import { ref, onMounted } from 'vue'

const a = 1
const b = ref(2)


// 像 defineExpose 这样的编译宏无须导入
defineExpose({
  a,
  b
})
</script>
```
### 为组件的模板引用标注类型

有时，需要为一个子组件添加一个模板引用，以便调用它公开的方法。举例，有一个 `Modal` 子组件，它有一个打开模态框的方法

```vue
// Modal.vue
<script setup lang="ts">
import { ref } from 'vue'

const visibe = ref(false)
const open = () => (visibe.value = true)

defineExpose({
  open
})
</script>
```

为了获取 `modal` 的类型，我们首先需要通过 `typeof` 得到其类型， 再使用 `TypeScript` 内置的 `InstanceType` 工具类型来获取其实例类型：

```vue
// App.vue
<script setup lang="ts">
import Modal from './Modal.vue'

const modalRef = ref<InstanceType<typeof Modal> | null>(null)

const openMoal = () => {
  modal.value?.open()
}
</script>
```

如果想在 `TypeScript` 文件而不是 Vue SFC 中使用这种技巧， 需要开启 Volar的 `Takeover模式`

如果组件的具体类型无法获取，或者你并不关心组件的具体类型，那么可以使用 `ComponenyPublicInstance`。这智慧包含所有组件都共享的属性， 比如 `$el`。

```ts
import { ref } from 'vue'
import  type { ComponentPublicInstance } from 'vue'

const child = ref<ComponentPublickInstance | null>(null)
```




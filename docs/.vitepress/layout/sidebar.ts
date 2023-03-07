export default {
  '/subject/': [
    {
      text: 'Hello Word',
      items: [
        { text: 'Hello', link: '/subject/hello' },
        { text: '快速上手', link: '/subject/quotation' },
      ]
    },
    {
      text: 'JavaScript',
      items: [
        { text: 'class类', link: '/subject/javascript/class' },
      ]
    },
    {
      text: 'Css',
      items: [
        { text: 'css基础', link: '/subject/css/cssbase' },
        { text: 'css特效', link: '/subject/css/css3' },
      ]
    },
    {
      text: 'Vue',
      items: [
        { text: 'Vue2', link: '/subject/vue/vue2' },
        { text: 'Vue3', link: '/subject/vue/vue3' },
      ]
    },
    {
      text: 'typeScript',
      items: [
        { text: '基础', link: '/subject/typeScript/base' },
      ]
    }
  ],
  '/article/': [
    {
      text: '日记',
      items: [
        { text: '日记2023', link: '/article/diary/2023' },
      ]
    },
    {
      text: '前端面试题',
      items: [
        { text: 'Web', link: '/article/offer/web' },
        { text: 'Html', link: '/article/offer/html' },
        { text: 'Css', link: '/article/offer/css' },
        { text: 'Javascript', link: '/article/offer/javascript' },
        { text: 'Vue2', link: '/article/offer/vue2' }
      ]
    },
  ]
}
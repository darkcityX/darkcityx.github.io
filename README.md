# darkcityx-blog

## 项目搭建及建设

### 项目搭建

1. 创建项目目录文件并引入vitepress
```
npm install -D vitepress vue
```

2. 根目录下创建docs/index.md，index.md(即首页)

3. 根目录下创建docs/.vitepress/config.ts
```ts
/**
 * nav  头部导航
 * silder 侧边栏导航
 * 因为是大量数据文件，所以提出到./layout/相对的文件中
 * */ 
import nav from './layout/nav';
import sidebar from './layout/sidebar';

const base = '/';

const config = {
  base,
  title: 'darkcityX',
  description: 'darkcityX vitepress blog',
  lastUpdated: true,
  themeConfig: {
    nav,
    sidebar,
  },
  markdown: {},
  outDir: '../dist/darkcityx-blog'
};
export default config;
```

### 依赖导入及使用

1. sass导入
```
npm i -D sass sass-loader 
```

为了更友好及高效的编写样式


### 基础配置
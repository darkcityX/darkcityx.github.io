import nav from './layout/nav';
import sidebar from './layout/sidebar';

const base = '/';

const config = {
  base,
  title: 'darkcityX',
  head: [
    ['link', {
      rel: 'icon', href: '/images/favicon.ico'
    }]
  ],
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
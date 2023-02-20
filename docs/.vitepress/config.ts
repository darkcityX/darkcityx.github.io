import nav from './layout/nav'
import sidebar from './layout/sidebar'

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
  markdown: {}
}
export default config
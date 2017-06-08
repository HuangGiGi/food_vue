import Vue from 'vue'
import Router from 'vue-router'
// import Hello from '@/components/Hello'
// import Login from '@/components/Login'
import goods from '@/components/goods/goods'
import ratings from '@/components/ratings/ratings'
import seller from '@/components/seller/seller'

Vue.use(Router)

export default new Router({
  linkActiveClass: 'active',
  routes: [
    // {
    //   path: 'hello',
    //   name: 'Hello',
    //   component: Hello
    // },
    // {
    //   path: '/login',
    //   name: 'Login',
    //   component: Login
    // },
    {
      path: '/',
      name: 'goods',
      component: goods
    },
    {
      path: '/ratings',
      name: 'ratings',
      component: ratings
    },
    {
      path: '/seller',
      name: 'seller',
      component: seller
    }
  ]
})

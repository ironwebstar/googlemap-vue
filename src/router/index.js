import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/SpatialSearchGoogle.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'SpatialSearchGoogle',
      component: HelloWorld
    }
  ]
})

import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
// import Help from '../views/Help.vue'
// import User from '../views/User.vue'
import Login from '../components/Login.vue'
import Signup from '../components/Signup.vue'
import Forgot from '../components/Forgot.vue'
import Reset from '../components/Reset.vue'
import UpdatePass from '../components/UpdatePass'
import UpdateProfil from '../components/UpdateProfil'
import User from '../views/User'
import Admin from '../components/Admin'



const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/help',
    name: 'Help',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "help" */ '../views/Help.vue')
  },
  {
    path: '/user',
    name: 'User',
    component: User
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup
    
  },
  {
    path: '/login',
    name: 'Login',
    component: Login

  },
  {
    path: '/forgot',
    name: 'Forgot',
    component: Forgot
  },
  {
    path: '/reset/:token',
    name: 'Reset',
    component: Reset
  },
  {
    path: '/updatePass',
    name: 'UpdatePass',
    component: UpdatePass
  },
  {
    path: '/updateProfil',
    name: 'UpdateProfil',
    component: UpdateProfil
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// router.beforeEach((to, from, next) => {
//   if (to.matched.some(record => record.meta.requiresAuth)) {
//     // this route requires auth, check if logged in
//     // if not, redirect to login page.
//     if (!localStorage.getItem('token')) {
//       next({
//         path: '/login',
//         query: { redirect: to.fullPath }
//       })
//     } else {
//       next()
//     }
//   } else {
//      next() // make sure to always call next()!
//   }
// })

export default router

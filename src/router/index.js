import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Registro from '../views/auth/Registro.vue'
import Login from '../views/auth/Login.vue'
import Perfil from '../views/admin/Perfil.vue'
import LayoutPagina from '../views/layout/LayoutPagina.vue'
import LayoutAdmin from '../views/layout/LayoutAdmin.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: LayoutPagina,
      children: [
        {
          path: '/',
          name: 'home',
          component: HomeView
        },
        {
          path: '/about',
          name: 'about',
          // route level code-splitting
          // this generates a separate chunk (About.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import('../views/AboutView.vue')
        },
        {
          path: '/registro',
          name: 'Registro',
          component: Registro
        },
        {
          path: '/login',
          name: 'Login',
          component: Login,
          meta: {redirectIfAuth: true}
        },
      ]
    },
    {
      path: '/admin',
      component: LayoutAdmin,
      children: [
        {
          path: 'perfil',
          name: 'Perfil',
          component: Perfil,
          meta: {requireAuth: true}
        },
        {
          path: 'categoria',
          name: 'Categoria',
          component: () => import('../views/admin/Categoria.vue'),
          meta: {requireAuth: true}
        }
      ]
    }
    
  ]
})

router.beforeEach((to, from, next) => {
  console.log("****: TO: ", to)
  let token = localStorage.getItem("access_token")

  if(to.meta.requireAuth){
    if(!token)
      return next({name: 'Login'})
    return next()
  }

  if(to.meta.redirectIfAuth && token){
    next({name: 'Perfil'})
  }

  return next();

})

export default router

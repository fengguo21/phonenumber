import Vue from 'vue'
import Router from 'vue-router'

Vue.use( Router )

/* Layout */


/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    name: 'login',
    component: () => import( '@/components/login/index' ),
  },
  {
    path: '/',
    name: 'index',
    component: () => import( '@/components/index.vue' ),
  },

  {
    path: '/admin',
    name: 'admin',
    component: () => import( '@/components/admin.vue' ),
  },


]

const createRouter = () => new Router( {
  // mode: 'history', // require service support
  scrollBehavior: () => ( { y: 0 } ),
  routes: constantRoutes
} )

const router = createRouter()

router.beforeEach( ( to, from, next ) => {
  // ...
  // 返回 false 以取消导航
  if ( to.name === 'admin' && !sessionStorage.getItem( 'hasLogin' ) ) {
    next( { name: 'login' } )
  } else {
    next()
  }
  console.log( to, from, 'tourter' )
  return true
} )

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

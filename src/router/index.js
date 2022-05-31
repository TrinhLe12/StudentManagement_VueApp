import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ManageClassesView from "@/views/ManageClassesView.vue"
import ManageStudentsView from "@/views/ManageStudentsView.vue"
import ManageSubjectRegistersView from "@/views/ManageSubjectRegistersView.vue"
import UserLoginView from "@/views/UserLoginView.vue"
import UserRegisterView from "@/views/UserRegisterView.vue"
import { Role } from "@/utility/role"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { authorize: [] }
  },
  {
    path: "/manage_classes",
    name: "manage_classes",
    component: ManageClassesView,
    meta: { authorize: [Role.Admin] }
  },
  {
    path: "/manage_students",
    name: "manage_students",
    component: ManageStudentsView,
    meta: { authorize: [Role.Admin] }
  },
  {
    path: "/manage_subject_registers",
    name: "manage_subject_registers",
    component: ManageSubjectRegistersView,
    meta: { authorize: [] }
  },
  {
    path: '/login',
    name: 'login',
    component: UserLoginView
  },
  {
    path: '/register',
    name: 'register',
    component: UserRegisterView
  },
  {
    path: '/update_info',
    name: 'update_info',
    component: ManageStudentsView,
    meta: { authorize: [Role.Student] }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const { authorize } = to.meta;
  const currentUser = JSON.parse(localStorage.getItem('currentUser'))

  if (authorize != null && authorize != undefined) {
    if (currentUser == null || currentUser == undefined) {
      console.log("Not Login")
      // not logged in so redirect to login page with the return url to comeback later
      return next({ path: '/login', query: { returnUrl: to.path } });
    }

      // check if route is restricted by role
    if (authorize.length > 0 && !checkAuthorizedRole(authorize, currentUser.userRole)) {
      // role not authorised so redirect to home page
      console.log("Role not authorized")
      return next({ path: '/' });
    }
  }

  next();
})

function checkAuthorizedRole (authorize, userRole) {
  var isRoleAuthorized = false
  userRole.forEach(r => {
    if (authorize.includes(r)) {
      isRoleAuthorized = true
    }
  })
  return isRoleAuthorized
}

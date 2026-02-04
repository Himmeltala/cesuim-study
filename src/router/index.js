import { createRouter, createWebHistory } from 'vue-router'

// 固定路由
const fixedRoutes = [
  { path: '/' },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('../views/NotFound.vue'),
    name: 'NotFound',
  },
]

function generateName(value) {
  const upperCase = v => v.charAt(0).toUpperCase() + v.slice(1)
  return value.split('/').filter(Boolean).map(upperCase).join('')
}

function replacePath(source, target, replace) {
  return source.replace(target, '').replace(replace, '').replace(/\/$/, '')
}

function getParentPath(source) {
  const lastSlashIndex = source.lastIndexOf('/')
  return lastSlashIndex <= 0 ? '' : source.substring(0, lastSlashIndex)
}

function getChildPath(currPath, parentPath) {
  return parentPath === '' ? currPath : currPath.replace(parentPath + '/', '')
}

function getRedirectPath(routes) {
  if (!Array.isArray(routes) || routes.length === 0) return null
  const firstValid = routes.find(r => r.path && typeof r.path === 'string')
  return firstValid ? firstValid.path.replace(/\/$/, '') : null
}

function replaceSuffix(source, target, replace) {
  return source.replace(target, replace)
}

// 根路由重定向路径
let rootRedirectPath = ''

function generateDynamicRoutes() {
  const topLevelRoutes = []
  const routeMap = {}

  const indexJsFiles = import.meta.glob('../views/**/index.js', {
    eager: true,
  })
  const indexVueFiles = import.meta.glob('../views/**/index.vue')

  const routeList = []
  for (const jsPath in indexJsFiles) {
    const vuePath = replaceSuffix(jsPath, /index\.js$/, 'index.vue')
    const hasVue = !!indexVueFiles[vuePath]
    const routeConfig = indexJsFiles[jsPath]?.default || {}
    const fullPath = replacePath(jsPath, '../views', /index\.js$/)
    const parentPath = getParentPath(fullPath)
    const depth = fullPath.split('/').filter(Boolean).length

    routeList.push({
      fullPath,
      parentPath,
      hasVue,
      routeConfig,
      depth,
      vuePath: hasVue ? vuePath : null,
    })
  }

  routeList.sort((a, b) => a.depth - b.depth)

  for (const item of routeList) {
    const { fullPath, parentPath, hasVue, routeConfig, vuePath } = item
    const routeName = generateName(fullPath)
    const childPath = getChildPath(fullPath, parentPath)

    if (!hasVue) {
      const currentRoute = {
        path: childPath,
        name: routeName,
        meta: routeConfig.meta || {},
        children: [],
      }
      if (routeConfig.layout) {
        currentRoute['component'] = routeConfig.layout
      }

      routeMap[fullPath] = currentRoute

      if (parentPath === '') {
        topLevelRoutes.push(currentRoute)
      } else {
        const parentRoute = routeMap[parentPath]
        if (parentRoute) parentRoute.children.push(currentRoute)
      }
    }

    if (hasVue) {
      const parentRoute = routeMap[parentPath]
      if (!parentRoute) continue

      const childRoute = {
        path: childPath,
        name: routeName,
        component: indexVueFiles[vuePath],
        meta: routeConfig.meta || {},
        children: [],
      }

      parentRoute.children.push(childRoute)
    }
  }

  function setRedirect(route) {
    if (route.children && route.children.length > 0) {
      const redirectPath = getRedirectPath(route.children)
      if (redirectPath) {
        route.redirect =
          route.path === '' ? redirectPath : `${route.path}/${redirectPath}`
        if (!rootRedirectPath && route.path !== '')
          rootRedirectPath = route.redirect
      }
      route.children.forEach(child => setRedirect(child))
    }
  }

  topLevelRoutes.forEach(route => setRedirect(route))

  return topLevelRoutes
}

const dynamicRoutes = generateDynamicRoutes()
fixedRoutes[0].redirect = rootRedirectPath

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...fixedRoutes, ...dynamicRoutes],
  scrollBehavior: () => ({ top: 0 }),
})

export default router

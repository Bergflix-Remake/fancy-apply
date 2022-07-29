import { createRouter, createWebHistory, RouteLocationNormalized, Router } from 'vue-router'
import AuthMiddleware from './middleware/auth'


import 'vue-router'
import middlewarePipeline from './middlewarePipeline'
import { Error, Session } from '../models/custom'
import { ApplicationSession } from '../models/types'
import { Query } from 'react-query/types/core'
import { UseQueryReturnType } from 'vue-query'

declare module 'vue-router' {
  interface RouteMeta {
    middleware?: Function[],
    session?: UseQueryReturnType<ApplicationSession, Error> 
  }
}

export interface MiddlewareContext {
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: Function,
    router: Router
}

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/:identifier?',
            name: 'home',
            component: () => import('../pages/Home.vue')
        },
        {
            path: '/:identifier/tasks',
            name: 'task',
            component: () => import('../pages/Task.vue'),

        },
        {
            path: '/:identifier/done',
            name: 'done',
            component: () => import('../pages/Finished.vue'),
        }
    ]
})

router.beforeEach((to, from, next) => {
    if (!to.meta.middleware) {
        return next()
    }
    const middleware = to.meta.middleware

    const context = {
        to,
        from,
        next,
        router
    }


    return middleware[0]({
        ...context,
        next: middlewarePipeline(context, middleware, 1)
    })

})

export default router;

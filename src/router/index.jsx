import { createBrowserRouter } from 'react-router-dom'

import { routes } from './routes'

// 浏览器路由实例统一在应用根组件通过 RouterProvider 注入。
export const router = createBrowserRouter(routes)

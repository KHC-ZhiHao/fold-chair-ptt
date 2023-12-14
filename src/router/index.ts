import { createWebHashHistory, createRouter } from 'vue-router'
import Home from '@/views/Home.vue'
import View from '@/views/View.vue'
import Articles from '@/views/Articles.vue'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home
        },
        {
            path: '/view',
            name: 'View',
            component: View
        },
        {
            path: '/articles',
            name: 'Articles',
            component: Articles
        }
    ]
})

export default router

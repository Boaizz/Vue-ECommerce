import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import UserPage from '../views/UserPage.vue'
// import LoginPage from '../views/LoginPage.vue'
import AboutPage from '../views/AboutPage.vue'
import ChatPage from '../views/ChatPage.vue'
const routes = [{
        path: '/',
        name: 'home',
        component: HomePage
    },
    {
        path: '/user',
        name: 'user',
        component: UserPage
    },
    {
        path: '/about',
        name: '/about',
        component: AboutPage
    },
    {
        path: '/chat',
        name: '/chat',
        component: ChatPage
    },
    
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
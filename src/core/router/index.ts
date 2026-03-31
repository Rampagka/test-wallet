import { appRoutes } from '@/core/router/app-routes'

import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: appRoutes,
    scrollBehavior() {
        return { top: 0 }
    },
})

// Navigation guard — redirect to Welcome if no wallet, redirect to Dashboard if wallet exists
router.beforeEach((to) => {
    const hasWallet = Boolean(localStorage.getItem('wallet'))

    // If no wallet and trying to access protected route → redirect to Welcome
    if (!hasWallet && !to.meta.isPublic) {
        return { name: 'Welcome' }
    }

    // If has wallet and on onboarding pages → redirect to Dashboard
    if (hasWallet && to.meta.isPublic) {
        return { name: 'Dashboard' }
    }
})

export default router

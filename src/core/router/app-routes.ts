import type { RouteRecordRaw } from 'vue-router'

export const appRoutes: RouteRecordRaw[] = [
    // --- Onboarding ---
    {
        path: '/',
        name: 'Welcome',
        component: () => import('@/pages/WalletPage.vue'),
        meta: { isPublic: true },
    },
    {
        path: '/create',
        name: 'CreateWallet',
        component: () => import('@/pages/CreateWalletPage.vue'),
        meta: { isPublic: true },
    },
    {
        path: '/import',
        name: 'ImportWallet',
        component: () => import('@/pages/ImportWalletPage.vue'),
        meta: { isPublic: true },
    },

    // --- Main screens ---
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/pages/DashboardPage.vue'),
    },
    {
        path: '/send',
        name: 'Send',
        component: () => import('@/pages/SendPage.vue'),
    },
    {
        path: '/receive',
        name: 'Receive',
        component: () => import('@/pages/ReceivePage.vue'),
    },
]

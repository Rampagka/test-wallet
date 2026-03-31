<script setup lang="ts">
import type { NavTab } from '@/modules/nav-bar/models/types/nav-tab'

import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const tabs: NavTab[] = [
    { name: 'Dashboard', route: '/dashboard', icon: 'mdi-home', label: 'Главная' },
    { name: 'Send', route: '/send', icon: 'mdi-arrow-up', label: 'Отправить' },
    { name: 'Receive', route: '/receive', icon: 'mdi-arrow-down', label: 'Получить' },
    { name: 'Contacts', route: '/contacts', icon: 'mdi-account-group', label: 'Контакты' },
]

const activeTab = computed(() => {
    const found = tabs.find((tab) => tab.route === route.path)
    return found?.name ?? null
})

function onTabClick(name: string | null) {
    if (!name) return
    const tab = tabs.find((t) => t.name === name)
    if (tab) {
        router.push(tab.route)
    }
}

function isActive(tabName: string) {
    return activeTab.value === tabName
}
</script>

<template>
    <v-bottom-navigation
        :model-value="activeTab"
        grow
        class="nav-bar"
        @update:model-value="onTabClick"
    >
        <v-btn
            v-for="tab in tabs"
            :key="tab.name"
            :value="tab.name"
            class="nav-btn"
            :class="{ 'nav-btn--active': isActive(tab.name) }"
        >
            <v-icon>{{ tab.icon }}</v-icon>
            <span class="nav-btn__label">{{ tab.label }}</span>
        </v-btn>
    </v-bottom-navigation>
</template>

<style scoped>
.nav-bar {
    border-top: 1px solid var(--color-border);
}

.nav-btn :deep(.v-btn__overlay) {
    display: none;
}

.nav-btn:hover {
    opacity: 0.8;
    transition: 0.2s all ease;
}

.nav-btn--active :deep(.v-icon),
.nav-btn--active .nav-btn__label {
    color: var(--color-accent);
}
</style>

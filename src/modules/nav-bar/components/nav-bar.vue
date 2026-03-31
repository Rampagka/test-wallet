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

const activeTab = computed(() => tabs.findIndex((tab) => tab.route === route.path))

function onTabClick(index: number) {
    const tab = tabs[index]
    if (tab) {
        router.push(tab.route)
    }
}
</script>

<template>
    <v-bottom-navigation
        :model-value="activeTab"
        grow
        class="nav-bar"
        @update:model-value="onTabClick"
    >
        <v-btn v-for="tab in tabs" :key="tab.name" :value="tab.name" class="nav-btn">
            <v-icon>{{ tab.icon }}</v-icon>
            <span>{{ tab.label }}</span>
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
</style>

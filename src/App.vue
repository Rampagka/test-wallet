<script setup lang="ts">
import { NavBar } from '@/modules/nav-bar'

import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const showNavBar = computed(() => !route.meta.isPublic)
</script>

<template>
    <v-app>
        <v-main>
            <div class="app-container" :class="{ 'app-container--with-nav': showNavBar }">
                <router-view />
            </div>
        </v-main>

        <NavBar v-if="showNavBar" />
    </v-app>
</template>

<style scoped>
.app-container {
    max-width: 428px;
    margin: 0 auto;
    min-height: 100dvh;
}

.app-container--with-nav {
    min-height: calc(100dvh - 56px);
    padding-bottom: 72px;
}
</style>

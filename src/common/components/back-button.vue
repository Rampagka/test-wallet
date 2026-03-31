<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
    <v-btn icon variant="text" size="small" class="back-btn" @click="router.push('/')">
        <v-icon>mdi-arrow-left</v-icon>
    </v-btn>
</template>

<style scoped>
.back-btn :deep(.v-btn__overlay) {
    display: none;
}

.back-btn:hover {
    opacity: 0.8;
}
</style>

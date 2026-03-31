<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
    <div class="flex w-full max-w-xs flex-col gap-3">
        <v-btn color="primary" size="large" block rounded="lg" @click="router.push('/create')">
            Создать кошелёк
        </v-btn>

        <v-btn
            class="import-btn"
            variant="outlined"
            size="large"
            block
            rounded="lg"
            @click="router.push('/import')"
        >
            Импортировать кошелёк
        </v-btn>
    </div>
</template>

<style scoped>
.import-btn {
    border: 1px solid rgb(var(--v-theme-primary));
    color: #fff !important;
}

.import-btn :deep(.v-btn__overlay) {
    display: none;
}

.import-btn:hover {
    background-color: rgb(var(--v-theme-primary));
}
</style>

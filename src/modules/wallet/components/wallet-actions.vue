<script setup lang="ts">
import { ButtonAccent } from '@/common/ui'

import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
    <div class="flex w-full max-w-xs flex-col gap-3">
        <ButtonAccent
            text="Создать кошелёк"
            block
            @click="router.push('/create')"
        />

        <ButtonAccent
            text="Импортировать кошелёк"
            outlined
            block
            @click="router.push('/import')"
        />
    </div>
</template>

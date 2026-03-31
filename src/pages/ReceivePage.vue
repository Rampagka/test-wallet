<script setup lang="ts">
import BackButton from '@/common/components/back-button.vue'

import { AddressDisplay, QrCodeCard, useReceive } from '@/modules/receive'

const { address, copyAddress, isCopied } = useReceive()
</script>

<template>
    <div class="min-h-screen pb-20">
        <v-container class="pa-4">
            <div class="mb-6 flex items-center">
                <BackButton />
                <h1 class="ml-2 text-xl font-bold">Получить ТОН</h1>
            </div>

            <div class="mx-auto max-w-[480px]">
                <QrCodeCard :address="address" class="mb-4" />

                <AddressDisplay :address="address" :is-copied="isCopied" @copy="copyAddress" />
            </div>
        </v-container>
        <v-snackbar v-model="isCopied" :timeout="2000" color="success" class="copy-snackbar">
            Адрес скопирован
        </v-snackbar>
    </div>
</template>

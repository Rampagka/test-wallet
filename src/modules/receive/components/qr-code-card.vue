<script setup lang="ts">
import QrcodeVue from 'qrcode.vue'

interface Props {
    address: string
}

defineProps<Props>()
</script>

<template>
    <v-card class="p-4 rounded-xl">
        <v-card-title class="text-center text-subtitle-1 mb-2">QR Code</v-card-title>

        <v-card-text class="flex justify-center">
            <div class="inline-block rounded-lg bg-[#1e1e1e] p-4">
                <QrcodeVue
                    :value="address"
                    :size="240"
                    level="H"
                    render-as="svg"
                    foreground="#FFFFFF"
                    background="#1E1E1E"
                />
            </div>
        </v-card-text>
    </v-card>
</template>

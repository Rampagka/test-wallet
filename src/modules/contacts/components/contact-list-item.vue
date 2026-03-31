<script setup lang="ts">
import type { Contact } from '@/modules/contacts/models/types'

import { computed } from 'vue'

const props = defineProps<{
    contact: Contact
}>()

const emit = defineEmits<{
    edit: []
    delete: []
}>()

const shortAddress = computed(() => {
    const addr = props.contact.address
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
})
</script>

<template>
    <div class="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-bg-tertiary/50">
        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15">
            <v-icon icon="mdi-account" color="primary" size="20" />
        </div>

        <div class="min-w-0 flex-1">
            <div class="truncate text-sm font-medium text-text-primary">
                {{ contact.name }}
            </div>
            <div class="truncate text-xs text-text-muted">
                {{ shortAddress }}
            </div>
        </div>

        <div class="flex shrink-0 gap-1">
            <v-btn
                icon
                variant="text"
                size="small"
                density="comfortable"
                @click.stop="emit('edit')"
            >
                <v-icon icon="mdi-pencil" size="18" />
            </v-btn>
            <v-btn
                icon
                variant="text"
                size="small"
                density="comfortable"
                color="error"
                @click.stop="emit('delete')"
            >
                <v-icon icon="mdi-delete" size="18" />
            </v-btn>
        </div>
    </div>
</template>

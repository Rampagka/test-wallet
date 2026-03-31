<script setup lang="ts">
import ContactListItem from '@/modules/contacts/components/contact-list-item.vue'

import type { Contact } from '@/modules/contacts/models/types'

import { computed } from 'vue'

const props = defineProps<{
    contacts: Contact[]
}>()

const emit = defineEmits<{
    edit: [contact: Contact]
    delete: [id: string]
    select: [contact: Contact]
}>()

// Сортировка: новые первыми
const sortedContacts = computed(() => {
    return [...props.contacts].sort((a, b) => b.addedAt - a.addedAt)
})
</script>

<template>
    <div class="flex flex-col gap-3">
        <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-text-primary">Контакты</h2>
            <span v-if="contacts.length > 0" class="text-sm text-text-muted">
                {{ contacts.length }}
            </span>
        </div>

        <div v-if="contacts.length === 0" class="py-12 text-center">
            <v-icon icon="mdi-account-multiple-outline" size="64" color="text-muted" class="mb-4" />
            <p class="text-sm text-text-muted">Нет контактов</p>
            <p class="mt-1 text-xs text-text-muted">Добавьте первый контакт</p>
        </div>

        <div v-else class="flex flex-col gap-1">
            <ContactListItem
                v-for="contact in sortedContacts"
                :key="contact.id"
                :contact="contact"
                @edit="emit('edit', contact)"
                @delete="emit('delete', contact.id)"
            />
        </div>
    </div>
</template>

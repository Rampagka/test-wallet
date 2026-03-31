<script setup lang="ts">
import { ButtonAccent, ButtonError } from '@/common/ui'

import { ContactFormModal, ContactList, useContactsStore } from '@/modules/contacts'
import type { Contact } from '@/modules/contacts'

import { computed, ref } from 'vue'

const contactsStore = useContactsStore()

const isModalOpen = ref(false)
const selectedContact = ref<Contact | null>(null)
const isDeleteDialogOpen = ref(false)
const contactToDelete = ref<string | null>(null)
const successMessage = ref('')
const errorMessage = ref('')

const contacts = computed(() => contactsStore.contacts)

function handleAdd() {
    selectedContact.value = null
    isModalOpen.value = true
}

function handleEdit(contact: Contact) {
    selectedContact.value = contact
    isModalOpen.value = true
}

function handleDelete(id: string) {
    contactToDelete.value = id
    isDeleteDialogOpen.value = true
}

function confirmDelete() {
    if (!contactToDelete.value) return

    try {
        contactsStore.deleteContact(contactToDelete.value)
        successMessage.value = 'Контакт удален'
        isDeleteDialogOpen.value = false
        contactToDelete.value = null
    } catch (error) {
        errorMessage.value = error instanceof Error ? error.message : 'Ошибка при удалении контакта'
    }
}

function cancelDelete() {
    isDeleteDialogOpen.value = false
    contactToDelete.value = null
}

function handleSave(data: { name: string; address: string }) {
    try {
        if (selectedContact.value) {
            contactsStore.updateContact(selectedContact.value.id, data)
            successMessage.value = 'Контакт обновлен'
        } else {
            contactsStore.addContact(data.name, data.address)
            successMessage.value = 'Контакт добавлен'
        }
    } catch (error) {
        errorMessage.value =
            error instanceof Error ? error.message : 'Ошибка при сохранении контакта'
    }
}
</script>

<template>
    <div class="pb-2">
        <v-container class="pa-4">
            <div class="mb-6 flex items-center justify-between">
                <h1 class="text-xl font-bold">Контакты</h1>
                <v-btn icon variant="text" color="primary" size="default" @click="handleAdd">
                    <v-icon>mdi-plus</v-icon>
                </v-btn>
            </div>

            <ContactList :contacts="contacts" @edit="handleEdit" @delete="handleDelete" />

            <ContactFormModal v-model="isModalOpen" :contact="selectedContact" @save="handleSave" />

            <!-- Диалог подтверждения удаления -->
            <v-dialog
                v-model="isDeleteDialogOpen"
                max-width="400"
                content-class="dialog-bottom"
                scrim="black"
            >
                <v-card class="dialog-card">
                    <v-card-title class="px-6 py-4 text-lg font-bold">
                        Удалить контакт?
                    </v-card-title>

                    <v-card-text class="px-6 py-4 text-text-muted">
                        Это действие нельзя отменить.
                    </v-card-text>

                    <div class="flex flex-row gap-3 px-6 pb-6">
                        <ButtonAccent
                            text="Отмена"
                            outlined
                            class="min-w-0 flex-1"
                            @click="cancelDelete"
                        />

                        <ButtonError text="Удалить" class="min-w-0 flex-1" @click="confirmDelete" />
                    </div>
                </v-card>
            </v-dialog>

            <v-snackbar :model-value="!!successMessage" :timeout="2000" color="success">
                {{ successMessage }}
            </v-snackbar>

            <v-snackbar :model-value="!!errorMessage" :timeout="5000" color="error">
                {{ errorMessage }}
            </v-snackbar>
        </v-container>
    </div>
</template>

<style scoped>
.dialog-card {
    border-radius: 16px;
}

@media (max-width: 600px) {
    .dialog-card {
        border-radius: 16px 16px 0 0;
    }
}
</style>

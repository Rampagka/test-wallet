import type { Contact } from '@/modules/contacts/models/types'

import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useContactsStore = defineStore(
    'contacts',
    () => {
        const contacts = ref<Contact[]>([])

        // Getters
        const contactsCount = computed(() => contacts.value.length)

        const getContactById = (id: string): Contact | undefined => {
            return contacts.value.find((contact) => contact.id === id)
        }

        const getContactByAddress = (address: string): Contact | undefined => {
            return contacts.value.find((contact) => contact.address === address)
        }

        // Actions
        function addContact(name: string, address: string): void {
            // Валидация на пустое имя
            if (!name.trim()) {
                throw new Error('Имя контакта не может быть пустым')
            }

            // Проверка на дубликаты адресов
            if (getContactByAddress(address)) {
                throw new Error('Контакт с таким адресом уже существует')
            }

            const newContact: Contact = {
                id: crypto.randomUUID(),
                name: name.trim(),
                address,
                addedAt: Date.now(),
            }

            contacts.value.push(newContact)
        }

        function updateContact(
            id: string,
            updates: Partial<Pick<Contact, 'name' | 'address'>>,
        ): void {
            const contact = getContactById(id)
            if (!contact) {
                throw new Error('Контакт не найден')
            }

            // Валидация имени
            if (updates.name !== undefined && !updates.name.trim()) {
                throw new Error('Имя контакта не может быть пустым')
            }

            // Проверка на дубликаты адресов (если адрес меняется)
            if (updates.address && updates.address !== contact.address) {
                const existingContact = getContactByAddress(updates.address)
                if (existingContact && existingContact.id !== id) {
                    throw new Error('Контакт с таким адресом уже существует')
                }
            }

            // Обновляем контакт
            if (updates.name !== undefined) {
                contact.name = updates.name.trim()
            }
            if (updates.address !== undefined) {
                contact.address = updates.address
            }
        }

        function deleteContact(id: string): void {
            const index = contacts.value.findIndex((contact) => contact.id === id)
            if (index === -1) {
                throw new Error('Контакт не найден')
            }

            contacts.value.splice(index, 1)
        }

        function clearAllContacts(): void {
            contacts.value = []
        }

        return {
            contacts,
            contactsCount,
            getContactById,
            getContactByAddress,
            addContact,
            updateContact,
            deleteContact,
            clearAllContacts,
        }
    },
    { persist: true },
)

export const WARNING_MESSAGES = {
    ADDRESS_POISONING:
        'Этот адрес похож на адрес из вашей истории транзакций. Проверьте внимательно!',
    NEW_ADDRESS: 'Вы впервые отправляете на этот адрес. Убедитесь, что он верный.',
    BOUNCEABLE_ADDRESS:
        'Вы отправляете на bounceable адрес. Если контракт не инициализирован, средства вернутся.',
    OWN_ADDRESS: 'Вы отправляете средства самому себе.',
    ENTIRE_BALANCE:
        'Вы отправляете весь баланс. Не останется средств на комиссию за следующие транзакции.',
} as const

export const WARNING_TITLES = {
    ADDRESS_POISONING: 'Предупреждение о похожем адресе',
    NEW_ADDRESS: 'Новый адрес',
    BOUNCEABLE_ADDRESS: 'Bounceable адрес',
    OWN_ADDRESS: 'Отправка себе',
    ENTIRE_BALANCE: 'Отправка всего баланса',
} as const

export function formatTransactionTime(timestampSeconds: number): string {
    const date = new Date(timestampSeconds * 1000)
    const now = new Date()

    const isToday =
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()

    if (isToday) {
        return date.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    if (date.getFullYear() === now.getFullYear()) {
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'short',
        })
    }

    return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })
}

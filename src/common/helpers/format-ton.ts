export function formatTonAmount(tonAmount: string): string {
    const num = parseFloat(tonAmount)
    if (isNaN(num)) return '0'
    return num
        .toFixed(4)
        .replace(/0+$/, '')
        .replace(/\.$/, '')
}

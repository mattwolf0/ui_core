export function formatIsoDate(value) {
    if (typeof value !== 'string') {
        return '-'
    }

    const dt = new Date(value)
    if (Number.isNaN(dt.getTime())) {
        return '-'
    }

    return dt.toLocaleString(undefined, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    })
}

export function formatNumber(value) {
    const num = Number(value)
    if (!Number.isFinite(num)) {
        return '0'
    }

    return new Intl.NumberFormat('en-US').format(Math.round(num))
}

export function formatDecimal(value) {
    const num = Number(value)
    if (!Number.isFinite(num)) {
        return '0.0'
    }

    return num.toFixed(1)
}

export function formatClock(unixSeconds) {
    const secs = Number(unixSeconds)
    if (!Number.isFinite(secs) || secs <= 0) {
        return 'Nothing yet'
    }

    return new Date(secs * 1000).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    })
}

export function formatLevelLabel(level) {
    const num = Number(level)
    if (!Number.isFinite(num) || num <= 0) {
        return 'Unset'
    }

    return `Lv ${Math.round(num)}`
}

export function progressWidth(value) {
    const num = Number(value)
    if (!Number.isFinite(num)) {
        return 0
    }

    return Math.max(0, Math.min(100, num))
}

export function formatKg(value) {
    const grams = Number(value)
    if (!Number.isFinite(grams)) {
        return '0.0'
    }

    return (grams / 1000).toFixed(1)
}

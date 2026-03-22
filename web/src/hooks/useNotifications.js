import { UI_CONFIG } from '../config/uiConfig.js'

function toastId() {
    return `${Date.now()}_${Math.floor(Math.random() * 1000000)}`
}

function toastDuration(ms) {
    return Math.max(
        UI_CONFIG.toast.minDurationMs,
        Math.min(UI_CONFIG.toast.maxDurationMs, Number(ms) || UI_CONFIG.toast.defaultDurationMs)
    )
}

export function useNotifications(setAppState) {
    function pushToast(type, message, ms = UI_CONFIG.toast.defaultDurationMs) {
        const toast = {
            id: toastId(),
            type: String(type || 'info').slice(0, 12),
            message: String(message || '').slice(0, UI_CONFIG.text.maxLength)
        }

        setAppState((prev) => ({
            ...prev,
            toasts: [...prev.toasts, toast].slice(-UI_CONFIG.toast.maxVisible)
        }))

        window.setTimeout(() => {
            setAppState((prev) => ({
                ...prev,
                toasts: prev.toasts.filter((entry) => entry.id !== toast.id)
            }))
        }, toastDuration(ms))
    }

    return { pushToast }
}

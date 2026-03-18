import { UI_CONFIG } from './config/uiConfig.js'

const CB_ALLOWLIST = new Set([
    'ui_core:ready',
    'ui_core:close',
    'ui_core:action'
])

const bus = new Map()

export function onMessage(type, handler) {
    if (!bus.has(type)) {
        bus.set(type, new Set())
    }

    const bucket = bus.get(type)
    bucket.add(handler)

    return () => {
        bucket.delete(handler)
    }
}

export async function fetchNui(callback, body = {}, timeoutMs = UI_CONFIG.callbackTimeoutMs) {
    if (!CB_ALLOWLIST.has(callback)) {
        throw new Error(`ui_core callback is not allowed: ${callback}`)
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), timeoutMs)

    try {
        const resName = typeof GetParentResourceName === 'function'
            ? GetParentResourceName()
            : 'ui_core'

        if (UI_CONFIG.debug) console.log('[ui_core] nui post', callback, body)
        // CEF fetch must target the parent resource name; the fallback keeps local Vite usable.
        const response = await fetch(`https://${resName}/${callback}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
            signal: controller.signal
        })

        if (!response.ok) {
            throw new Error(`NUI callback failed: ${response.status}`)
        }

        return await response.json().catch(() => ({}))
    } finally {
        clearTimeout(timeout)
    }
}

function normalizeActionName(action) {
    if (typeof action !== 'string') {
        return ''
    }

    return action.replace(/[^a-zA-Z0-9:_\-.]/g, '').slice(0, UI_CONFIG.text.maxActionLength)
}

function buildSafeClientPayload(value, depth = 0) {
    if (depth > UI_CONFIG.payload.maxDepth) {
        return null
    }

    if (typeof value === 'string') {
        return value.slice(0, UI_CONFIG.text.maxLength)
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
        return value
    }

    if (!value || typeof value !== 'object') {
        return null
    }

    const out = Array.isArray(value) ? [] : {}
    let count = 0

    for (const [key, nested] of Object.entries(value)) {
        count += 1
        if (count > UI_CONFIG.payload.maxEntries) {
            break
        }

        const clean = buildSafeClientPayload(nested, depth + 1)
        if (clean !== null) {
            out[key] = clean
        }
    }

    return out
}

export async function emitAction(action, payload = {}) {
    const act = normalizeActionName(action)
    if (!act) {
        return { ok: false, reason: 'invalid_action' }
    }

    const data = buildSafeClientPayload(payload) ?? {}
    return fetchNui('ui_core:action', {
        action: act,
        payload: data
    })
}

// NUI messages cross the game/browser boundary, so only known messages are dispatched.
window.addEventListener('message', (event) => {
    const data = event?.data
    if (!data || typeof data !== 'object') {
        return
    }

    const { type, payload } = data
    if (typeof type !== 'string' || !type.startsWith('ui_core:')) {
        return
    }

    const handlers = bus.get(type)
    if (!handlers || handlers.size === 0) {
        return
    }

    for (const handler of handlers) {
        handler(payload ?? {})
    }
})

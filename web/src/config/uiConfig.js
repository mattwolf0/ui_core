export const UI_CONFIG = {
    defaultTheme: 'black-red',
    debug: false, // Keep this off unless you are tracing NUI messages.
    themeOrder: ['black-red', 'black-gold', 'slate-cyan', 'graphite-ember'],
    callbackTimeoutMs: 2500,
    toast: {
        defaultDurationMs: 3200,
        minDurationMs: 900,
        maxDurationMs: 12000,
        maxVisible: 4
    },
    text: {
        maxLength: 256,
        maxActionLength: 64,
        modalInputMaxLength: 128,
        characterIdMaxLength: 16
    },
    payload: {
        maxDepth: 5,
        maxEntries: 1024
    },
    table: {
        pageSizes: [5, 10, 20, 50],
        maxPageSize: 50,
        defaultPageSize: 10
    },
    crafting: {
        minQuantity: 1,
        maxQuantity: 25
    }
}

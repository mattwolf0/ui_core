UI_CORE_CONFIG = {
    debug = false,
    previewCommand = 'uicore',
    defaultTheme = 'black-red',
    themes = {
        ['black-red'] = true,
        ['black-gold'] = true,
        ['slate-cyan'] = true,
        ['graphite-ember'] = true
    },
    limits = {
        maxStringLength = 256,
        maxActionLength = 64,
        maxPayloadDepth = 5,
        maxPayloadEntries = 1024,
        actionCooldownMs = 120
    },
    ui = {
        screenBlurFadeMs = 150,
        defaultToastDurationMs = 3200,
        startupSyncDelayMs = 200
    }
}

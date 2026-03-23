local RESOURCE_NAME = GetCurrentResourceName()
local CONFIG = UI_CORE_CONFIG or {}
local LIMITS = CONFIG.limits or {}
local UI = CONFIG.ui or {}

local state = {
    visible = false,
    theme = CONFIG.defaultTheme or 'black-red',
    panel = {
        view = 'default',
        title = '',
        subtitle = '',
        showThemeSwitch = true,
        closeLabel = 'Close',
        activeTab = 'overview',
        tabs = {
            { id = 'overview', label = 'Overview' }
        },
        overview = {
            stats = {},
            highlights = {}
        },
        members = {},
        ranks = {},
        storage = {},
        logs = {},
        localActions = {}
    }
}

local lastActionAt = 0

local function nowMs()
    return GetGameTimer()
end

local function debugPrint(...)
    if CONFIG.debug then
        print(('[ui_core] %s'):format(table.concat({ ... }, ' ')))
    end
end

local function limitNuiText(value, maxLength)
    if type(value) ~= 'string' then
        return ''
    end

    local output = value:gsub('[\r\n\t]', ' ')
    if #output > maxLength then
        output = output:sub(1, maxLength)
    end

    return output
end

-- Bound nested payloads before they reach the browser.
local function readNuiPayload(value, depth)
    depth = depth or 0
    local maxDepth = LIMITS.maxPayloadDepth or 5
    local maxEntries = LIMITS.maxPayloadEntries or 128
    local maxStringLength = LIMITS.maxStringLength or 256

    if depth > maxDepth then
        return nil
    end

    local valueType = type(value)

    if valueType == 'string' then
        return limitNuiText(value, maxStringLength)
    end

    if valueType == 'number' or valueType == 'boolean' then
        return value
    end

    if valueType ~= 'table' then
        return nil
    end

    local result = {}
    local count = 0

    for key, nested in pairs(value) do
        count = count + 1
        if count > maxEntries then
            break
        end

        local keyType = type(key)
        if keyType == 'string' or keyType == 'number' then
            local sanitizedValue = readNuiPayload(nested, depth + 1)
            if sanitizedValue ~= nil then
                result[key] = sanitizedValue
            end
        end
    end

    return result
end

local function isLuaArray(tbl)
    if type(tbl) ~= 'table' then
        return false
    end

    local count = 0
    local maxIndex = 0

    for key in pairs(tbl) do
        if type(key) ~= 'number' then
            return false
        end

        if key > maxIndex then
            maxIndex = key
        end

        count = count + 1
    end

    return count == 0 or maxIndex == count
end

local function mergePanelPatch(base, patch)
    if type(patch) ~= 'table' then
        return patch
    end

    if isLuaArray(patch) then
        return patch
    end

    local result = {}

    if type(base) == 'table' then
        for key, value in pairs(base) do
            result[key] = value
        end
    end

    for key, value in pairs(patch) do
        if type(value) == 'table' and type(result[key]) == 'table' and not isLuaArray(value) then
            result[key] = mergePanelPatch(result[key], value)
        else
            result[key] = value
        end
    end

    return result
end

local function send(typeName, payload)
    SendNUIMessage({
        type = typeName,
        payload = payload
    })
end

local function setFocus(enabled)
    SetNuiFocus(enabled, enabled)
    -- Leaving keep-input enabled can trap movement after the panel closes.
    SetNuiFocusKeepInput(false)
end

local function setScreenBlur(enabled)
    if enabled then
        TriggerScreenblurFadeIn(UI.screenBlurFadeMs or 150)
    else
        TriggerScreenblurFadeOut(UI.screenBlurFadeMs or 150)
    end
end

local function setVisible(enabled)
    local wasVisible = state.visible
    state.visible = enabled
    send('ui_core:setVisible', { visible = enabled })
    setFocus(enabled)
    setScreenBlur(enabled)

    if wasVisible ~= enabled then
        TriggerEvent('ui_core:visibilityChanged', enabled, state.panel)

        if enabled then
            TriggerEvent('ui_core:opened', state.panel)
        else
            TriggerEvent('ui_core:closed', state.panel)
        end
    end
end

local function setTheme(themeName)
    local fallbackTheme = CONFIG.defaultTheme or 'black-red'
    if type(themeName) ~= 'string' or not CONFIG.themes or not CONFIG.themes[themeName] then
        themeName = fallbackTheme
    end

    state.theme = themeName
    send('ui_core:setTheme', { theme = themeName })
end

local function setPanel(panel)
    if type(panel) ~= 'table' then
        return
    end

    local clean = readNuiPayload(panel, 0)
    if not clean then
        return
    end

    state.panel = mergePanelPatch(state.panel, clean)
    send('ui_core:setPanel', clean)
end

local function open(options)
    if type(options) == 'table' then
        if options.theme then
            setTheme(options.theme)
        end

        if options.panel then
            setPanel(options.panel)
        end
    end

    send('ui_core:setTheme', { theme = state.theme })
    send('ui_core:setPanel', state.panel)
    setVisible(true)
end

local function close()
    if not state.visible then
        return
    end

    setVisible(false)
end

local function notify(toastType, message, duration)
    send('ui_core:toast', {
        toastType = limitNuiText(toastType or 'info', 16),
        message = limitNuiText(message or '', LIMITS.maxStringLength or 256),
        duration = tonumber(duration) or UI.defaultToastDurationMs or 3200
    })
end

local function onUiAction(data)
    local cooldownMs = LIMITS.actionCooldownMs or 120
    local currentMs = nowMs()

    if currentMs - lastActionAt < cooldownMs then
        return false, 'rate_limited'
    end

    lastActionAt = currentMs

    if type(data) ~= 'table' then
        return false, 'invalid_data'
    end

    local action = limitNuiText(data.action or '', LIMITS.maxActionLength or 64)
    if action == '' then
        return false, 'invalid_action'
    end

    local payload = readNuiPayload(data.payload or {}, 0) or {}
    local localActions = state.panel and state.panel.localActions
    local isLocalAction = type(localActions) == 'table' and localActions[action] == true

    debugPrint('action', action)

    if action == 'theme:changed' then
        setTheme(payload.theme)
    end

    TriggerEvent('ui_core:action', action, payload)

    if not isLocalAction then
        TriggerServerEvent('ui_core:action', action, payload)
    end

    return true
end

RegisterNUICallback('ui_core:ready', function(_, cb)
    send('ui_core:setTheme', { theme = state.theme })
    send('ui_core:setPanel', state.panel)
    send('ui_core:setVisible', { visible = state.visible })
    -- RegisterNUICallback must always answer, otherwise the browser fetch waits and focus feels stuck.
    cb({ ok = true })
end)

RegisterNUICallback('ui_core:close', function(_, cb)
    close()
    cb({ ok = true })
end)

RegisterNUICallback('ui_core:action', function(data, cb)
    local ok, reason = onUiAction(data)
    cb({ ok = ok, reason = reason })
end)

RegisterNetEvent('ui_core:remoteOpen', function(options)
    open(options)
end)

RegisterNetEvent('ui_core:remoteClose', function()
    close()
end)

RegisterNetEvent('ui_core:remoteTheme', function(theme)
    setTheme(theme)
end)

RegisterNetEvent('ui_core:remoteUpdate', function(panel)
    setPanel(panel)
end)

RegisterNetEvent('ui_core:notify', function(toastType, message, duration)
    notify(toastType, message, duration)
end)

RegisterCommand(CONFIG.previewCommand or 'uicore', function()
    if state.visible then
        close()
    else
        open()
    end
end, false)

exports('Open', open)
exports('Close', close)
exports('Toggle', function(options)
    if state.visible then
        close()
    else
        open(options)
    end
end)
exports('SetTheme', setTheme)
exports('UpdatePanel', setPanel)
exports('Notify', notify)

CreateThread(function()
    Wait(UI.startupSyncDelayMs or 200)
    setTheme(state.theme)
    send('ui_core:setPanel', state.panel)
    send('ui_core:setVisible', { visible = false })
    debugPrint('Client initialized for resource', RESOURCE_NAME)
end)

AddEventHandler('onResourceStop', function(resourceName)
    if resourceName ~= RESOURCE_NAME then
        return
    end

    setFocus(false)
    setScreenBlur(false)
end)

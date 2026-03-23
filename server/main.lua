local CONFIG = UI_CORE_CONFIG or {}
local LIMITS = CONFIG.limits or {}
local UI = CONFIG.ui or {}
local SERVER_ACTION_EVENT = 'ui_core:action'

local function readActionText(value, maxLength)
    if type(value) ~= 'string' then
        return ''
    end

    local out = value:gsub('[\r\n\t]', ' ')
    if #out > maxLength then
        out = out:sub(1, maxLength)
    end

    return out
end

-- Keep client payloads small and plain before other server handlers see them.
local function readServerActionPayload(value, depth)
    depth = depth or 0

    local maxDepth = LIMITS.maxPayloadDepth or 5
    local maxEntries = LIMITS.maxPayloadEntries or 128
    local maxStringLength = LIMITS.maxStringLength or 256

    if depth > maxDepth then
        return nil
    end

    local valueType = type(value)
    if valueType == 'string' then
        return readActionText(value, maxStringLength)
    end

    if valueType == 'number' or valueType == 'boolean' then
        return value
    end

    if valueType ~= 'table' then
        return nil
    end

    local out = {}
    local entries = 0

    for key, nested in pairs(value) do
        entries = entries + 1
        if entries > maxEntries then
            break
        end

        local keyType = type(key)
        if keyType == 'string' or keyType == 'number' then
            local sanitized = readServerActionPayload(nested, depth + 1)
            if sanitized ~= nil then
                out[key] = sanitized
            end
        end
    end

    return out
end

RegisterNetEvent(SERVER_ACTION_EVENT, function(action, payload)
    local src = source
    action = readActionText(action or '', LIMITS.maxActionLength or 64)

    if action == '' then
        return
    end

    payload = readServerActionPayload(payload or {}, 0) or {}
    if CONFIG.debug then
        print(('[ui_core:server] %s -> %s'):format(src, action))
    end
    TriggerEvent('ui_core:server:action', src, action, payload)
end)

exports('OpenFor', function(target, options)
    TriggerClientEvent('ui_core:remoteOpen', target, options or {})
end)

exports('CloseFor', function(target)
    TriggerClientEvent('ui_core:remoteClose', target)
end)

exports('SetThemeFor', function(target, theme)
    TriggerClientEvent('ui_core:remoteTheme', target, theme)
end)

exports('UpdatePanelFor', function(target, panel)
    TriggerClientEvent('ui_core:remoteUpdate', target, panel or {})
end)

exports('NotifyFor', function(target, toastType, message, duration)
    TriggerClientEvent('ui_core:notify', target, toastType or 'info', message or '', duration or UI.defaultToastDurationMs or 3200)
end)

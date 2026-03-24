local department = {
    members = {
        { name = 'Ricsi', serverId = 12, charId = 2101, rank = 'Lead', status = 'online' },
        { name = 'K. Novak', serverId = 17, charId = 2102, rank = 'Mechanic', status = 'online' },
        { name = 'Milo', serverId = nil, charId = 2110, rank = 'Helper', status = 'offline' }
    },
    ranks = {
        { id = 'lead', name = 'Lead', weight = 55, permissions = { manage_members = true, manage_ranks = false, storage_access = true, log_access = true } },
        { id = 'mechanic', name = 'Mechanic', weight = 30, permissions = { manage_members = false, manage_ranks = false, storage_access = true, log_access = false } },
        { id = 'helper', name = 'Helper', weight = 5, permissions = { manage_members = false, manage_ranks = false, storage_access = false, log_access = false } }
    },
    storage = {
        { item = 'repairkit', amount = 11, weight = 16.5 },
        { item = 'cleaning_cloth', amount = 4, weight = 0.8 },
        { item = 'engine_oil', amount = 0, weight = 0.0 }
    },
    logs = {
        { id = 1, actor = 'Ricsi', action = 'Took repair kits', target = 'repairkit x2', time = '2026-06-16T18:10:00Z', category = 'storage' },
        { id = 2, actor = 'K. Novak', action = 'Changed role', target = 'Milo -> Helper', time = '2026-06-16T17:44:00Z', category = 'rank' }
    }
}

local function canManageMembers(src)
    return IsPlayerAceAllowed(src, 'department.manage')
end

local function snapshot()
    return {
        overview = {
            stats = {
                { label = 'Crew', value = #department.members },
                { label = 'In shop', value = 2 },
                { label = 'Roles', value = #department.ranks },
                { label = 'Stock weight', value = '17.3 / 120.0 kg' }
            },
            highlights = {
                'Oil is empty again.',
                'One helper is off shift.',
                'Role changes still need ACE.'
            }
        },
        members = department.members,
        ranks = department.ranks,
        storage = department.storage,
        logs = department.logs
    }
end

RegisterNetEvent('department:server:requestPanel', function()
    local src = source
    TriggerClientEvent('department:client:openPanel', src, snapshot())
end)

AddEventHandler('ui_core:server:action', function(src, action, payload)
    if action == 'members:refresh' or action == 'logs:refresh' then
        TriggerClientEvent('department:client:refreshPanel', src, snapshot())
        exports.ui_core:NotifyFor(src, 'info', 'Panel refreshed.')
        return
    end

    if action ~= 'member:promote' then
        return
    end

    local charId = tonumber(payload.charId)
    if not charId then
        exports.ui_core:NotifyFor(src, 'error', 'Missing character ID.')
        return
    end

    if not canManageMembers(src) then
        exports.ui_core:NotifyFor(src, 'error', 'You cannot promote crew members.')
        return
    end

    for _, member in ipairs(department.members) do
        if member.charId == charId then
            member.rank = 'Mechanic'
            exports.ui_core:NotifyFor(src, 'success', ('Promoted %s.'):format(member.name))
            TriggerClientEvent('department:client:refreshPanel', src, snapshot())
            return
        end
    end

    exports.ui_core:NotifyFor(src, 'error', 'Crew member was not found.')
end)

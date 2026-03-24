local function buildDepartmentPanel(snapshot)
    return {
        view = 'default',
        title = 'North Rockford Garage',
        subtitle = 'Crew, roles, shelf stock, notes',
        activeTab = 'overview',
        tabs = {
            { id = 'overview', label = 'Overview' },
            { id = 'members', label = 'Members' },
            { id = 'ranks', label = 'Ranks' },
            { id = 'storage', label = 'Storage' },
            { id = 'logs', label = 'Logs' }
        },
        overview = snapshot.overview,
        members = snapshot.members,
        ranks = snapshot.ranks,
        storage = snapshot.storage,
        logs = snapshot.logs
    }
end

RegisterNetEvent('department:client:openPanel', function(snapshot)
    exports.ui_core:Open({
        theme = 'black-red',
        panel = buildDepartmentPanel(snapshot)
    })
end)

RegisterNetEvent('department:client:refreshPanel', function(snapshot)
    exports.ui_core:UpdatePanel(buildDepartmentPanel(snapshot))
end)

RegisterCommand('department_panel', function()
    TriggerServerEvent('department:server:requestPanel')
end, false)

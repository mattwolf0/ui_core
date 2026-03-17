fx_version 'cerulean'
game 'gta5'
lua54 'yes'

author 'mattwolf0'
description 'Shared NUI panels and UI action transport for FiveM resources.'
version '1.0.0'

shared_script 'shared/config.lua'

client_scripts {
    'client/main.lua'
}

server_scripts {
    'server/main.lua'
}

ui_page 'web/build/index.html'

files {
    'web/build/index.html',
    'web/build/assets/*.js',
    'web/build/assets/*.css'
}

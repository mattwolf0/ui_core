# ui_core

ui_core is a shared UI resource for FiveM servers. I started it because I did not want to copy the same NUI panel code into every job or department script.

It has a Lua bridge and a React panel. Other resources can open the UI, send data to it, and get actions back from the player.

The built web files are already included, so the resource can be added to a server without running the web build first.

## What is inside

- FiveM resource manifest
- Lua client and server files
- React source and built NUI files
- Views for members, ranks, storage, logs, crafting, and skills
- Basic department example

## Start it

Put the folder in your resources and add it to your server config:

```cfg
ensure ui_core
```

After that, another resource can call the exports when it needs to open or update the panel.

# Cnode Proxy

## About this app

This is a proxy app built up by using [Cnode](https://cnodejs.org/) public API, and this app are built totlly from scratch without any CLI and project generation tool. Everything is configurable based on your own idea.

Modern technologies are included in this app, including React16, NodeJS, Webpack4, Mobx etc.

## Development

For development, You can samply run "npm run dev:client" and "npm run dev:server" at the same time. Webpack dev server of front end will be running on loaclhost:8888 and node proxy and SSR will be running on localhost:3333.

## Build

For delopyment purpose, Please run "npm run build", then the front-end bundle and SSR bundle will be shown up in dist folder.

## One more thing

Not all Cnode APIs has been built into this app. There are still some interesting apis in [Cnode](https://cnodejs.org/). You can feel free to clone this project and build them up.

Considering this is a public api for learning purpose, sometime api will not work or request will be denied. Don't worry about this, just waiting a little while, I belive author of Cnode will fix it quickly.

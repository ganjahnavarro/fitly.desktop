const { Menu } = require('electron');
const electron = require('electron');
const app = electron.app;

const template = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Reload',
                accelerator: 'CmdOrCtrl+R',
                click (item, focusedWindow) {
                    if (focusedWindow) focusedWindow.reload()
                }
            }, {
              role: 'close'
            }, {
              type: 'separator'
            }, {
              role: 'togglefullscreen'
            }, {
              type: 'separator'
            }, {
                label: 'Toggle Developer Tools',
                accelerator: 'F12',
                click (item, focusedWindow) {
                    if (focusedWindow) focusedWindow.webContents.toggleDevTools()
                }
            }
        ]
    }, {
        label: 'Valiant'
    }
]

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

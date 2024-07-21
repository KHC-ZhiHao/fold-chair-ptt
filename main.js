/* eslint-disable */

const { join } = require('path')
const { app, BrowserWindow } = require('electron')

const isDev = process.env.npm_lifecycle_event === "dev" ? true : false

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 360,
        height: 480,
        alwaysOnTop: true,
        transparent: true,
        frame: false,
        webPreferences: {
            webviewTag: true,
            webSecurity: false,
            nodeIntegration: true,
            contextIsolation: false
        }
    })
    if (isDev) {
        mainWindow.loadURL('http://localhost:3000')
        mainWindow.webContents.openDevTools()
    } else {
        mainWindow.loadFile(join(__dirname, './index.html'))
    }
}

app.whenReady().then(async() => {
    createWindow()
    app.on('activate', async function () {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

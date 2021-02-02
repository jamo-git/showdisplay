const { app, BrowserWindow } = require("electron")
const { document } = require("globalthis/implementation")

function createWindow() {
    // Create the browser window.
    let win = new BrowserWindow({
        width: 480,
        height: 320,
        webPreferences: {
            nodeIntegration: true
        },
        fullscreen: true
    })

    win.loadFile("index.html")
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})
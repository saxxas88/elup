const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const { dialog } = require('electron')

autoUpdater.logger = require("electron-log")
autoUpdater.logger.transports.file.level = "debug"

let mainWindow;
let updater;

autoUpdater.autoDownload = false
autoUpdater.autoInstallOnAppQuit = false

autoUpdater.on('error', (error) => {
  dialog.showErrorBox('Error: ', error == null ? "unknown" : (error.stack || error).toString())
})

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
    }
  });

  mainWindow.webContents.openDevTools()
  mainWindow.loadFile('index.html');
  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  mainWindow.once('ready-to-show', () => {
    autoUpdater.checkForUpdates();
  });

  
}

autoUpdater.on('update-available', async(info) => {
 mainWindow.webContents.send('update_available',info);
  });

  autoUpdater.on('update-not-available', () => {
    mainWindow.webContents.send('update_notAvailable');
    updater.enabled = true
  })

  autoUpdater.on('download-progress',(progress)=>{
    mainWindow.webContents.send('progress_available',progress);
  })

  autoUpdater.on('update-downloaded', () => {
    mainWindow.webContents.send('update_downloaded');
  });

  ipcMain.on('restart_app', () => {
    //autoUpdater.quitAndInstall();
    app.quit();
  });
  
  ipcMain.on('download_app', () => {
    let aud = autoUpdater.downloadUpdate();
    mainWindow.webContents.send('download_update');
  });

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});
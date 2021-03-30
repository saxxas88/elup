const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const { dialog } = require('electron')

autoUpdater.logger = require("electron-log")
autoUpdater.logger.transports.file.level = "debug"

let mainWindow;
let updater;

autoUpdater.autoDownload = true

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
    autoUpdater.checkForUpdatesAndNotify();
  });

  
}

autoUpdater.on('update-available', async(info) => {
    dialog.showMessageBox({
        type: 'info',
        title: 'Found Updates',
        message: 'Found updates, do you want update now?',
        buttons: ['Yes', 'No']
      }, (buttonIndex) => {
        if (buttonIndex === 0) {
          autoUpdater.downloadUpdate()
        }
        else {
          mainWindow.webContents.send('update_available','Not Try to download file')
          updater.enabled = true
          
        }
      });
 mainWindow.webContents.send('update_available',info);
  
  });

  autoUpdater.on('update-not-available', () => {
    dialog.showMessageBox({
      title: 'No Updates',
      message: 'Current version is up-to-date.'
    })
    updater.enabled = true
  })

  autoUpdater.on('download-progress',(down)=>{
    mainWindow.webContents.send('update_available',[down.progress]);
  })

  autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox({
        title: 'Install Updates',
        message: 'Updates downloaded, application will be quit for update...'
      }, () => {
          console.log('Downloaded')
        //setImmediate(() => autoUpdater.quitAndInstall())
      })

    mainWindow.webContents.send('update_downloaded');
  });

  ipcMain.on('restart_app', () => {
    //autoUpdater.quitAndInstall();
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
const {
  app,
  BrowserWindow,
  Menu,
  dialog
} = require('electron')
const {
  autoUpdater
} = require('electron-updater')
const log = require('electron-log')
const path = require('path')
const isDev = require('electron-is-dev')
const {
  showUpdateMenuItem,
  template
} = require('./menu')

// autoUpdater.autoDownload = false

let win
// Logging
autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'
log.info('应用启动中...')

function createWindow() {
  win = new BrowserWindow({
    width: 1000,
    height: 1000,
    webPreferences: {
      nodeIntegration: true,
      preload: path.resolve(__dirname, './renderer.js'),
    },
  })
  win.loadURL(`file://${__dirname}/index.html#v${app.getVersion()}`)
  win.webContents.openDevTools()
  win.on('close', () => {
    win = null
  })
  return win
}


function sendStatusToWindow(text) {
  log.info(text)
  win.webContents.send('message', text)
}

app.on('ready', function() {
  // Define the menu
  menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

app.on('ready', function() {
  if (isDev) {
    autoUpdater.checkForUpdates() // dev
  } else {
    autoUpdater.checkForUpdatesAndNotify() // prod
  }
})

// update life-cycles

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('检测更新中...')
  showUpdateMenuItem('checking')
})
autoUpdater.on('update-available', (ev, info) => {
  sendStatusToWindow('有更新内容')
  sendStatusToWindow(JSON.stringify({
    ev,
    info
  }, 4))
  dialog.showMessageBox({
    type: 'info',
    title: '更新提示',
    message: ev.releaseNotes,
    buttons: ['下载更新', '跳过'],
  }).then(({
    response: index
  }) => {
    if (index === 0) {
      autoUpdater.downloadUpdate()
      showUpdateMenuItem('downloading')
    } else {
      showUpdateMenuItem('check')
    }
  })
})
autoUpdater.on('update-not-available', (ev, info) => {
  sendStatusToWindow('无可用更新')
  showUpdateMenuItem('no-update-available')
})
autoUpdater.on('error', (ev, err) => {
  sendStatusToWindow('auto-updater 检测更新发生异常')
  showUpdateMenuItem('error')
  dialog.showMessageBox({
    type: 'warning',
    buttons: ['确定'],
    message: '检测更新发生异常',
    title: '更新异常',
    detail: err,
  })
})
autoUpdater.on('download-progress', (ev, progressObj) => {
  sendStatusToWindow('下载进度')
  sendStatusToWindow(JSON.stringify({
    ev,
    progressObj
  }, 4))
  showUpdateMenuItem('downloading')
})
autoUpdater.on('update-downloaded', (ev, info) => {
  sendStatusToWindow('更新下载完成')
  showUpdateMenuItem('update-available')
  dialog.showMessageBox({
    type: 'info',
    title: '更新下载完成',
    message: '更新下载完成, 立即更新?',
    buttons: ['立即更新', '稍等']
  }).then(({
    response: index
  }) => {
    if (index === 0) {
      autoUpdater.quitAndInstall()
    }
  })
})
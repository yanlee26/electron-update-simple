const {
  app,
  dialog
} = require('electron')
const {
  autoUpdater
} = require('electron-updater')

let menu
let hasRegistListner = false


// Define the menu
let template = []
if (process.platform === 'darwin') {
  const name = app.name
  template.unshift({
    label: name,
    submenu: [{
        key: 'about',
        label: '关于' + name,
        role: 'about'
      },
      {
        key: 'check',
        label: '检查更新',
        click() {
          // 应用启动检测更新，无更新时不注册此事件
          if (!hasRegistListner) {
            autoUpdater.on('update-not-available', (ev, info) => {
              dialog.showMessageBox({
                type: 'warning',
                buttons: ['确定'],
                message: '无可用更新',
                title: '无可用更新',
                detail: `Version ${app.getVersion()} 已是最新版本`
              })
            })
            hasRegistListner = true
          }
          autoUpdater.checkForUpdates()
        }
      },
      {
        key: 'checking',
        label: '检查更新中',
        visible: false,
        enabled: false,
      },
      {
        key: 'downloading',
        label: '下载更新中',
        enabled: false,
        visible: false,
      },
      {
        key: 'install',
        label: '重启安装更新',
        visible: false,
        click() {
          autoUpdater.quitAndInstall()
        }
      },
      {
        label: '退出',
        accelerator: "Command+Q",
        click() {
          app.quit()
        }
      }
    ]
  })
}


function flattenMenuItems(menu) {
  if(!menu) return []
  const object = menu.items || {}
  let items = []
  for (let index in object) {
    const item = object[index]
    items.push(item)
    if (item.submenu) items = items.concat(flattenMenuItems(item.submenu))
  }
  return items
}

function showUpdateMenuItem(state) {
  const items = flattenMenuItems(menu)
  const checkForUpdateItem = items.find(({
    key
  }) => key === 'check')
  const checkingForUpdateItem = items.find(({
    key
  }) => key === 'checking')
  const downloadingUpdateItem = items.find(({
    key
  }) => key === 'downloading')
  const installUpdateItem = items.find(({
    key
  }) => key === 'install')

  if (!checkForUpdateItem || !checkingForUpdateItem ||
    !downloadingUpdateItem || !installUpdateItem) return

  checkForUpdateItem.visible = false
  checkingForUpdateItem.visible = false
  downloadingUpdateItem.visible = false
  installUpdateItem.visible = false

  switch (state) {
    case 'idle':
    case 'error':
    case 'no-update-available':
      checkForUpdateItem.visible = true
      break
    case 'checking':
      checkingForUpdateItem.visible = true
      break
    case 'downloading':
      downloadingUpdateItem.visible = true
      break
    case 'update-available':
      // installUpdateItem.visible = true
      checkForUpdateItem.visible = true
      break
    default:
      checkForUpdateItem.visible = true
  }
}

module.exports={
  template:template,
  flattenMenuItems,
  showUpdateMenuItem
}
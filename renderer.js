window.addEventListener('DOMContentLoaded', () => {
  let version = window.location.hash.substring(1);
  document.getElementById('version').innerText = version;

  const { ipcRenderer } = require('electron');
  ipcRenderer.on('message', function(event, text) {
      var container = document.getElementById('message');
      var message = document.createElement('div')
      message.innerHTML = text
      container.appendChild(message)
  })
});
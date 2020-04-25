
## F&Q

1. 苹果证书签名

开发环境会遇到这样的错误， 正确的做法是安装好之后再测试，不要开发并测试。或者申请苹果开发者账号
> https://github.com/electron/electron/issues/19666

```bash
14:59:20.299 › {
  constructor: 'Error',
  stack: 'Error: Could not get code signature for running application\n' +
    '    at Server.<anonymous> (/Users/elliotyan/Documents/me/electron-update-demo/node_modules/electron-updater/out/MacUpdater.js:170:32)\n' +
    '    at Object.onceWrapper (events.js:299:28)\n' +
    '    at Server.emit (events.js:210:5)\n' +
    '    at emitListeningNT (net.js:1334:10)\n' +
    '    at processTicksAndRejections (internal/process/task_queues.js:79:21)'
}
```
参考：
- https://blog.csdn.net/u014599371/article/details/103472038
- [Electron 相关 Mac 证书配置](https://www.jianshu.com/p/0d89a18308b2)
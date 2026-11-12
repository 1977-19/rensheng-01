# 我的一生模拟器 · My Life Simulator

一款中国式（也可以是全世界）人生模拟游戏。支持简体中文、繁體中文、English。

## 安装到手机

1. 每次推送到 `main`，GitHub Actions 会自动打包一个未签名的 `MyLife.ipa`（约 10–20 分钟）。
2. 打开仓库的 **Releases** 页面，下载最新版本里的 `MyLife.ipa`。
3. 用万能签（或其他签名工具）签名安装。

存档同时保存在 App 自己的文件里，重新签名覆盖安装一般不会丢档（删除 App 会丢）。

## 目录

- `web/` 游戏本体（HTML/JS，离线运行）
  - `js/data/` 国家、名字、学校、职业、出身、天赋、物品、历史事件
  - `js/engine/` 人生系统：上学、工作、明星、军队、警察、从政、帮派、监狱、理财、健康、恋爱婚姻、子女、聊天、结局
  - `js/events/` 随机事件
  - `js/games/` 小游戏
  - `js/ui/` 界面
- `MyLife/` iOS 外壳（WKWebView + 存档/震动/AI 请求桥接）
- `tools/` 构建与测试脚本

## 开发

```
node tools/build.js            # 重新生成 web/index.html
node tools/sim.js 300 1 -s     # 无界面模拟 300 段人生，检查报错与数值
node tools/ui_test.js out zh   # 用 Playwright 自动点一遍界面并截图
```

VIP 兑换码只以 SHA-256 哈希的形式存在 `web/js/data/codes.js` 里，明文码不在仓库中。

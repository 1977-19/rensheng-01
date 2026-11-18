// Writes web/index.html with all scripts in order
const fs = require('fs'), path = require('path');
const FILES = require('./files.js');
const ROOT = path.join(__dirname, '..', 'web');
const scripts = FILES.engine.concat(FILES.ui).map(f => `<script src="${f}"></script>`).join('\n');
const html = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">
<meta name="theme-color" content="#f6f9f3" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#1d3a2e" media="(prefers-color-scheme: dark)">
<meta name="format-detection" content="telephone=no">
<title>我的一生 · My Life</title>
<link rel="stylesheet" href="css/style.css">
<link rel="stylesheet" href="css/v3.css">
</head>
<body>
<div id="app"></div>
${scripts}
</body>
</html>
`;
fs.writeFileSync(path.join(ROOT, 'index.html'), html);
console.log('index.html written with', FILES.engine.length + FILES.ui.length, 'scripts');

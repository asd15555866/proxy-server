const http = require('http');
const https = require('https');
const axios = require('axios');

// 创建HTTP服务器
const server = http.createServer((req, res) => {
  // 检查请求的URL是否包含特定的路径（例如：/translate 或 /github）
  if (req.url.startsWith('/translate')) {
    // 转发请求到谷歌翻译
    forwardToGoogleTranslate(req, res);
  } else if (req.url.startsWith('/github')) {
    // 转发请求到GitHub
    forwardToGitHub(req, res);
  } else {
    // 其他请求返回404
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

// 监听80端口
const PORT = 80;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// 转发请求到谷歌翻译
function forwardToGoogleTranslate(req, res) {
  // ... 省略之前的代码 ...
}

// 转发请求到GitHub
function forwardToGitHub(req, res) {
  // ... 省略之前的代码 ...
}

const http = require('http');
const https = require('https');
const axios = require('axios');
const cors = require('cors');

// 创建HTTP服务器
const server = http.createServer((req, res) => {
  // 应用CORS中间件
  const corsOptions = {
    origin: '*', // 允许所有域访问
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // 允许的HTTP方法
    allowedHeaders: 'Content-Type,Authorization', // 允许的HTTP头
    preflightContinue: false,
    optionsSuccessStatus: 204
  };
  cors(corsOptions)(req, res, () => { // 应用CORS中间件
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
});

// 监听80端口
const PORT = 80;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// 转发请求到谷歌翻译
function forwardToGoogleTranslate(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const { q, target, source } = url.searchParams;

  if (!q || !target) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Missing required parameters');
    return;
  }

  const translateUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${encodeURIComponent(q)}`;

  axios({
    method: req.method,
    url: translateUrl,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    },
    httpsAgent: new https.Agent({
      rejectUnauthorized: false // 注意：这会跳过SSL证书验证，实际部署时应确保证书有效
    })
  }).then(response => {
    res.writeHead(response.status, response.headers);
    res.end(response.data);
  }).catch(error => {
    console.error(error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Error communicating with Google Translate');
  });
}

// 转发请求到GitHub
function forwardToGitHub(req, res) {
  const githubUrl = req.url.replace('/github', '') || 'https://github.com';

  axios({
    method: req.method,
    url: githubUrl,
    headers: req.headers,
    httpsAgent: new https.Agent({
      rejectUnauthorized: false // 注意：这会跳过SSL证书验证，实际部署时应确保证书有效
    })
  }).then(response => {
    res.writeHead(response.status, response.headers);
    res.end(response.data);
  }).catch(error => {
    console.error(error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Error communicating with GitHub');
  });
}

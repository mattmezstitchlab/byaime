// Lightweight Local Preview & API Server for BYAIME
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const aimeIntentHandler = require('./api/aime-intent.js');

const PORT = process.env.PORT || 3000;
const ROOT = path.resolve(__dirname);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let pathname = parsedUrl.pathname;

  // Handle Serverless API endpoint
  if (pathname === '/api/aime-intent') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        req.body = body ? JSON.parse(body) : {};
      } catch (e) {
        req.body = {};
      }

      // Mock response helpers for Vercel handler compatibility
      res.status = (code) => { res.statusCode = code; return res; };
      res.json = (data) => {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify(data));
      };

      await aimeIntentHandler(req, res);
    });
    return;
  }

  // Handle Static Files & Clean URLs
  let filePath = path.join(ROOT, pathname);

  // If path ends with /, look for index.html
  if (pathname.endsWith('/')) {
    filePath = path.join(filePath, 'index.html');
  }

  // Check if direct file exists
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    // Try clean URL (.html)
    if (fs.existsSync(filePath + '.html')) {
      filePath = filePath + '.html';
    } else if (fs.existsSync(path.join(filePath, 'index.html'))) {
      filePath = path.join(filePath, 'index.html');
    } else {
      // 404 fallback
      filePath = path.join(ROOT, '404.html');
      res.statusCode = 404;
    }
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.end('Server Error');
      return;
    }
    res.setHeader('Content-Type', contentType);
    res.end(data);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`BYAIME Server listening on http://0.0.0.0:${PORT}`);
});

const express = require("express");
let cors = require('cors');
const app = express();
app.use(cors());
const { createProxyMiddleware } = require('http-proxy-middleware');

app.use('/Wallets', createProxyMiddleware({ 
    target: 'http://localhost:50666/',
    onProxyRes: function (proxyRes, req, res) {
       proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    }
}));

app.use('/Users', createProxyMiddleware({ 
    target: 'http://localhost:50666/',
    onProxyRes: function (proxyRes, req, res) {
       proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    }
}));

app.use('/Transactions', createProxyMiddleware({ 
    target: 'http://localhost:50666/',
    onProxyRes: function (proxyRes, req, res) {
       proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    }
}));

app.use('/Currencies', createProxyMiddleware({ 
    target: 'http://localhost:50866/',
    onProxyRes: function (proxyRes, req, res) {
       proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    }
}));

app.use('/Values', createProxyMiddleware({ 
    target: 'http://localhost:50866/',
    onProxyRes: function (proxyRes, req, res) {
       proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    }
}));

app.listen(5000);
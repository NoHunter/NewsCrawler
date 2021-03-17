var HttpsProxyAgent = require('https-proxy-agent');
var proxyConfig = [{
  context: '/news-releases',
  target: 'https://www.prnewswire.com',
  secure: false,
  changeOrigin: true
},
{
  context: '/en',
  target: 'https://www.globenewswire.com',
  secure: false,
  changeOrigin: true
},
{
  context: '/portal/site/home/news',
  target: 'https://www.businesswire.com',
  secure: false,
  changeOrigin: true
},
{
  context: '/newsroom',
  target: 'https://www.accesswire.com',
  secure: false,
  changeOrigin: true
},
{
  context: '/in-the-corporate-news',
  target: 'https://www.mtnewswires.com',
  secure: false,
  changeOrigin: true
},
{
  context: '/business',
  target: 'https://www.reuters.com',
  secure: false,
  changeOrigin: true
}];

function setupForCorporateProxy(proxyConfig) {
  var proxyServer = process.env.http_proxy || process.env.HTTP_PROXY;
  if (proxyServer) {
    var agent = new HttpsProxyAgent(proxyServer);
    console.log('Using corporate proxy server: ' + proxyServer);
    proxyConfig.forEach(function(entry) {
      entry.agent = agent;
    });
  }
  return proxyConfig;
}

module.exports = setupForCorporateProxy(proxyConfig);
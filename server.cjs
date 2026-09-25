const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.md':'text/plain; charset=utf-8','.json':'application/json','.txt':'text/plain; charset=utf-8'};
http.createServer((req,res)=>{
 let name;try{name=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{res.writeHead(400);return res.end()}
 const file=path.resolve(__dirname,'.'+(name==='/'?'/index.html':name));
 if(!file.startsWith(__dirname+path.sep)||!types[path.extname(file)]||!fs.existsSync(file)){res.writeHead(404);return res.end('Not found')}
 res.writeHead(200,{'Content-Type':types[path.extname(file)],'Cache-Control':'no-store'});fs.createReadStream(file).pipe(res);
}).listen(4183,'127.0.0.1',()=>console.log('Find a Cruise v3: http://127.0.0.1:4183'));

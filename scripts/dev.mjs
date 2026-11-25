import {createServer} from 'node:http';
import {watch} from 'node:fs';
import {resolve} from 'node:path';
import {build, root} from './build.mjs';
let html=build(),version=Date.now(), timer;
for(const folder of ['src','assets'])watch(resolve(root,folder),{recursive:true},()=>{
 clearTimeout(timer);timer=setTimeout(()=>{try{html=build();version=Date.now()}catch(error){console.error(error.message)}},75);
});
const port=Number(process.env.PORT||process.argv[process.argv.indexOf('--port')+1])||5173;
createServer((req,res)=>{
 const requestUrl=new URL(req.url,'http://localhost');
 const path=requestUrl.pathname;
 res.setHeader('Cache-Control','no-store');
 if(path==='/__version'){res.end(String(version));return}
 if(path!=='/'&&path!=='/index.html'){res.writeHead(404);res.end();return}
 res.setHeader('Content-Type','text/html; charset=utf-8');
 const sizes={desktop:[1920,1080],mobile:[390,844]};
 const size=sizes[requestUrl.searchParams.get('viewport')];
 if(Array.isArray(size)){
  const [width,height]=size;
  res.end(`<!doctype html><html lang="en"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Builder Deck · ${width} × ${height}</title><style>*{box-sizing:border-box}body{margin:0;background:#121211;display:grid;place-items:center;min-height:100dvh}iframe{display:block;border:0;width:${width}px;height:${height}px;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) scale(var(--scale,1))}</style><iframe src="/" title="${width} × ${height} preview"></iframe><script>function fit(){document.documentElement.style.setProperty('--scale',Math.min(1,innerWidth/${width},innerHeight/${height}))}fit();addEventListener('resize',fit)</script></html>`);return
 }
 res.end(html.replace('</body>',`<script>setInterval(async()=>{try{if(!document.hidden&&(await (await fetch('/__version')).text())!=='${version}')location.reload()}catch{}},900)</script></body>`));
}).listen(port, process.env.SITES_MANAGED_LINUX_CONTAINER==='1'?'0.0.0.0':'127.0.0.1',()=>console.log('Local preview on port',port));

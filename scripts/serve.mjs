import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import config from '../docusaurus.config.js';
const root=path.resolve(fileURLToPath(new URL('../build/',import.meta.url)));
const portIndex=process.argv.indexOf('--port');
const port=portIndex<0 ? 4173 : Number(process.argv[portIndex+1]);
if(!Number.isInteger(port) || port<1 || port>65535) throw new Error('Invalid preview port');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.webm':'video/webm','.jpg':'image/jpeg','.ico':'image/x-icon','.woff2':'font/woff2','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8'};

function byteRange(value,size) {
  const match=/^bytes=(\d*)-(\d*)$/i.exec(value.trim());
  if(!match || (!match[1] && !match[2]) || size===0) return null;
  let start,end;
  if(!match[1]) {
    const suffix=Number(match[2]);
    if(!Number.isSafeInteger(suffix) || suffix<=0) return null;
    start=Math.max(0,size-suffix);
    end=size-1;
  } else {
    start=Number(match[1]);
    end=match[2]?Number(match[2]):size-1;
    if(!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start>=size || end<start) return null;
    end=Math.min(end,size-1);
  }
  return {start,end};
}
const server=http.createServer(async(req,res)=>{
  if(req.method!=='GET' && req.method!=='HEAD') {res.writeHead(405).end();return;}
  try {
    const requestUrl=new URL(req.url,'http://127.0.0.1');
    if(!requestUrl.pathname.startsWith(config.baseUrl)) {res.writeHead(404).end();return;}
    const decoded=decodeURIComponent(requestUrl.pathname.slice(config.baseUrl.length));
    let file=path.resolve(root,decoded);
    if(file!==root && !file.startsWith(root+path.sep)) {res.writeHead(400).end();return;}
    const stat=await fs.stat(file);
    if(stat.isDirectory()) {
      if(!requestUrl.pathname.endsWith('/')) {res.writeHead(301,{Location:requestUrl.pathname+'/'+requestUrl.search}).end();return;}
      file=path.join(file,'index.html');
    }
    const bytes=await fs.readFile(file);
    const headers={'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store','Accept-Ranges':'bytes'};
    if(req.headers.range!==undefined) {
      const range=byteRange(req.headers.range,bytes.length);
      if(!range) {
        res.writeHead(416,{...headers,'Content-Range':'bytes */'+bytes.length,'Content-Length':0}).end();
        return;
      }
      const {start,end}=range;
      res.writeHead(206,{...headers,'Content-Range':'bytes '+start+'-'+end+'/'+bytes.length,'Content-Length':end-start+1});
      res.end(req.method==='HEAD'?undefined:bytes.subarray(start,end+1));
      return;
    }
    res.writeHead(200,{...headers,'Content-Length':bytes.length});
    res.end(req.method==='HEAD'?undefined:bytes);
  } catch {
    res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});
    res.end(req.method==='HEAD'?undefined:await fs.readFile(path.join(root,'404.html')).catch(()=>'Not found'));
  }
});
server.listen(port,'127.0.0.1',()=>console.log('Static Pages preview: http://127.0.0.1:'+port+config.baseUrl));
process.on('SIGINT',()=>server.close(()=>process.exit(0)));

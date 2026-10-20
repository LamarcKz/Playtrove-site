// Assisted one-time setup. No key is written to disk or printed.
import http from 'node:http';
import {randomBytes,timingSafeEqual} from 'node:crypto';
import {spawn} from 'node:child_process';
const state=randomBytes(32).toString('hex');
const callbackPath='/callback/'+randomBytes(16).toString('hex');
let finished=false;
const htmlEscape=value=>value.replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
async function gh(args,input) {
  await new Promise((resolve,reject)=>{
    const child=spawn('gh',args,{stdio:['pipe','ignore','ignore'],windowsHide:true});
    child.on('error',()=>reject(new Error('GitHub CLI could not start')));
    child.on('exit',code=>code===0?resolve():reject(new Error('GitHub CLI could not save the Actions configuration')));
    child.stdin.on('error',()=>{});
    child.stdin.end(input);
  });
}
const server=http.createServer(async(req,res)=>{
  const requestUrl=new URL(req.url,'http://127.0.0.1');
  res.setHeader('Cache-Control','no-store');
  res.setHeader('Content-Type','text/html; charset=utf-8');
  res.setHeader('Referrer-Policy','no-referrer');
  if(requestUrl.pathname==='/') {
    const port=server.address().port;
    const manifest={
      name:'Playtrove Site Publisher',
      url:'https://github.com/LamarcKz/Playtrove-site',
      description:'Rebuild the public Playtrove website when a stable app release changes.',
      public:false,
      hook_attributes:{url:'https://github.com/LamarcKz/Playtrove-site',active:false},
      redirect_url:'http://127.0.0.1:'+port+callbackPath,
      default_permissions:{actions:'write'},
      default_events:[],
      request_oauth_on_install:false
    };
    res.end('<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>Configurar publicação do Playtrove</title><body><main><h1>GitHub App do site Playtrove</h1><p>O App pede apenas Actions: leitura e escrita. Instale-o somente no repositório Playtrove-site.</p><p>A chave criada pelo GitHub será enviada diretamente ao Actions Secret PLAYTROVE_SITE_APP_PRIVATE_KEY do repositório LamarcKz/Playtrove. Ela não será gravada em arquivo nem exibida.</p><p>O Client ID será salvo na variável PLAYTROVE_SITE_APP_CLIENT_ID do mesmo repositório.</p><form method="post" action="https://github.com/settings/apps/new?state='+state+'"><input type="hidden" name="manifest" value="'+htmlEscape(JSON.stringify(manifest))+'"><button type="submit">Revisar o cadastro no GitHub</button></form></main></body></html>');
    return;
  }
  if(requestUrl.pathname!==callbackPath || finished) {res.statusCode=404;res.end('Not found');return;}
  const supplied=requestUrl.searchParams.get('state')||'';
  const code=requestUrl.searchParams.get('code');
  if(!/^[a-f0-9]{64}$/.test(supplied) || !timingSafeEqual(Buffer.from(supplied),Buffer.from(state)) || !code || !/^[a-zA-Z0-9_-]+$/.test(code)) {res.statusCode=400;res.end('Invalid setup callback');return;}
  finished=true;
  try {
    const response=await fetch('https://api.github.com/app-manifests/'+encodeURIComponent(code)+'/conversions',{
      method:'POST',headers:{Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','User-Agent':'Playtrove-site-setup'},signal:AbortSignal.timeout(30000)
    });
    if(!response.ok) throw new Error('GitHub manifest conversion failed: HTTP '+response.status);
    const app=await response.json();
    if(!app.pem || !app.client_id || !/^[a-z0-9-]+$/.test(app.slug)) throw new Error('Incomplete GitHub App response');
    await gh(['secret','set','PLAYTROVE_SITE_APP_PRIVATE_KEY','--repo','LamarcKz/Playtrove'],app.pem);
    await gh(['variable','set','PLAYTROVE_SITE_APP_CLIENT_ID','--repo','LamarcKz/Playtrove','--body',app.client_id]);
    const install='https://github.com/apps/'+app.slug+'/installations/new';
    console.log('Actions secret and Client ID saved. Install the App only on Playtrove-site: '+install);
    res.end('<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>Configuração salva</title><main><h1>Secret e Client ID salvos no aplicativo</h1><p>Agora selecione Only select repositories e marque somente Playtrove-site.</p><a href="'+install+'">Instalar o App no repositório do site</a></main></html>');
  } catch(error) {
    console.error(error.message);
    res.statusCode=500;res.end('Setup failed. See the terminal status; no key is displayed.');
  }
});
server.listen(0,'127.0.0.1',()=>console.log('Open the one-time setup: http://127.0.0.1:'+server.address().port+'/'));
setTimeout(()=>server.close(()=>process.exit(0)),45*60*1000).unref();
process.on('SIGINT',()=>server.close(()=>process.exit(0)));

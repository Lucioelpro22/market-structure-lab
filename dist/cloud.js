(() => {
  const URL = 'https://vjcaxpzcbznvgsycirhw.supabase.co';
  const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqY2F4cHpjYnpudmdzeWNpcmh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM3NzkyMjcsImV4cCI6MjEwOTM1NTIyN30.mw_CJXQJj2Nat3vb83CNF4Qj7jtXVtdPyL6AdXmZGLk';
  const client = window.supabase?.createClient(URL, KEY, {auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
  let session = null, timer = null, pullApplied = false;
  const status = (text, mode='') => { const el=document.querySelector('#saveState'); if(!el)return; el.className=`save-state ${mode}`; el.innerHTML=`<i></i> ${text}`; };
  const accountLabel = () => { const button=document.querySelector('#accountButton'); if(button)button.textContent=session?.user?.email?.split('@')[0] || 'Sincronizar'; };
  async function push(payload){
    if(!client || !session) return;
    status('Sincronizando…','syncing');
    const {error}=await client.from('user_data').upsert({user_id:session.user.id,payload,updated_at:new Date().toISOString()});
    status(error?'Guardado local':'Sincronizado',error?'offline':'cloud');
    if(error) console.warn('Cloud sync:',error.message);
  }
  async function pull(){
    if(!client || !session || pullApplied)return;
    const {data,error}=await client.from('user_data').select('payload').eq('user_id',session.user.id).maybeSingle();
    if(error){status('Guardado local','offline');return}
    pullApplied=true;
    if(data?.payload && typeof window.applyCloudStore==='function') window.applyCloudStore(data.payload);
    else if(typeof window.getLocalStore==='function') await push(window.getLocalStore());
  }
  function schedule(payload){ clearTimeout(timer); if(session)timer=setTimeout(()=>push(payload),700); }
  async function init(){
    if(!client)return;
    const {data}=await client.auth.getSession(); session=data.session; accountLabel(); if(session)await pull();
    client.auth.onAuthStateChange(async(_event,next)=>{session=next;pullApplied=false;accountLabel();if(session){status('Conectado','cloud');setTimeout(pull,0)}else status('Guardado local');});
    const dialog=document.querySelector('#authDialog'),button=document.querySelector('#accountButton'),submit=document.querySelector('#authSubmit'),signout=document.querySelector('#authSignOut');
    button?.addEventListener('click',()=>{const signed=!!session;document.querySelector('#authEmailLabel').hidden=signed;submit.hidden=signed;signout.hidden=!signed;document.querySelector('#authTitle').textContent=signed?'Tu diario está sincronizado.':'Guardá tu diario en todos tus dispositivos.';document.querySelector('#authCopy').textContent=signed?`Sesión activa como ${session.user.email}. Los cambios se sincronizan automáticamente.`:'Ingresá tu email y te enviaremos un enlace seguro. Tus datos siguen siendo privados.';dialog.showModal()});
    submit?.addEventListener('click',async()=>{const email=document.querySelector('#authEmail').value.trim(),out=document.querySelector('#authStatus');if(!email){out.textContent='Ingresá un email válido.';return}submit.disabled=true;out.textContent='Enviando enlace…';const {error}=await client.auth.signInWithOtp({email,options:{emailRedirectTo:location.origin+location.pathname}});out.textContent=error?error.message:'Revisá tu email y abrí el enlace seguro.';submit.disabled=false});
    signout?.addEventListener('click',async()=>{await client.auth.signOut();dialog.close()});
  }
  window.cloudSync={init,schedule};
})();

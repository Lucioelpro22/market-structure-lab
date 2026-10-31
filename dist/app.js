const KEY = 'market-structure-lab:v1';
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const defaults = { instrument:'', timeframe:'1H', session:'Nueva York', bias:'Neutral', hypothesis:'', confidence:50, setupName:'', result:'Pendiente', notes:'', image:'', annotations:[], checks:[] };
let state = {...defaults};
let activeTool = 'select';
let toastTimer;

function toast(message){ const el=$('#toast'); el.textContent=message; el.classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.classList.remove('show'),2200); }
function save(){ localStorage.setItem(KEY,JSON.stringify(state)); $('#saveState').innerHTML='<i></i> Guardado local'; }
function update(){
  $('#instrument').value=state.instrument; $('#timeframe').value=state.timeframe; $('#session').value=state.session;
  $('#hypothesis').value=state.hypothesis; $('#confidence').value=state.confidence; $('#confidenceOutput').value=state.confidence+'%';
  $('#setupName').value=state.setupName; $('#result').value=state.result; $('#notes').value=state.notes;
  $$('[data-bias]').forEach(b=>b.classList.toggle('active',b.dataset.bias===state.bias));
  $$('#checklist input').forEach(c=>c.checked=state.checks.includes(c.value));
  $('#confirmationCount').textContent=state.checks.length; $('#checkProgress').textContent=`${state.checks.length} / 5`;
  $('#annotationCount').textContent=state.annotations.length;
  $('#chartTitle').textContent=state.image ? `${state.instrument||'Instrumento'} · ${state.timeframe}` : 'Gráfico sin cargar';
  const img=$('#chartImage'), zone=$('#uploadZone'); img.style.display=state.image?'block':'none'; zone.style.display=state.image?'none':'flex'; if(state.image) img.src=state.image;
  renderAnnotations();
}
function load(){ try{ state={...defaults,...JSON.parse(localStorage.getItem(KEY)||'{}')}; }catch{} update(); }
function bind(id,key,event='input'){ $(id).addEventListener(event,e=>{state[key]=e.target.value;if(key==='confidence')$('#confidenceOutput').value=e.target.value+'%';if(key==='instrument'||key==='timeframe')$('#chartTitle').textContent=state.image?`${state.instrument||'Instrumento'} · ${state.timeframe}`:'Gráfico sin cargar';save();}); }
['#instrument','#hypothesis','#confidence','#setupName','#notes'].forEach((id,i)=>bind(id,['instrument','hypothesis','confidence','setupName','notes'][i]));
['#timeframe','#session','#result'].forEach((id,i)=>bind(id,['timeframe','session','result'][i],'change'));
$$('[data-bias]').forEach(btn=>btn.addEventListener('click',()=>{state.bias=btn.dataset.bias;update();save();}));
$$('#checklist input').forEach(c=>c.addEventListener('change',()=>{state.checks=$$('#checklist input:checked').map(x=>x.value);update();save();}));

function processImage(file){ if(!file||!file.type.startsWith('image/'))return toast('Elegí una imagen válida'); if(file.size>4_000_000)return toast('La imagen debe pesar menos de 4 MB'); const reader=new FileReader();reader.onload=()=>{state.image=reader.result;state.annotations=[];update();save();toast('Gráfico cargado');};reader.readAsDataURL(file); }
$('#chartUpload').addEventListener('change',e=>processImage(e.target.files[0]));
const zone=$('#uploadZone'); ['dragenter','dragover'].forEach(ev=>zone.addEventListener(ev,e=>{e.preventDefault();zone.classList.add('dragging')})); ['dragleave','drop'].forEach(ev=>zone.addEventListener(ev,e=>{e.preventDefault();zone.classList.remove('dragging')})); zone.addEventListener('drop',e=>processImage(e.dataTransfer.files[0]));
document.addEventListener('paste',e=>{const file=[...e.clipboardData.files].find(f=>f.type.startsWith('image/'));if(file)processImage(file)});

$$('[data-tool]').forEach(btn=>btn.addEventListener('click',()=>{activeTool=btn.dataset.tool;$$('[data-tool]').forEach(b=>b.classList.toggle('active',b===btn));$('#canvasHint').textContent=activeTool==='select'?'Hacé clic en una marca para eliminarla.':'Hacé clic sobre el gráfico para agregar la marca.';}));
$('#canvasWrap').addEventListener('click',e=>{if(!state.image||activeTool==='select'||e.target.classList.contains('annotation'))return;const rect=e.currentTarget.getBoundingClientRect();const x=((e.clientX-rect.left)/rect.width)*100,y=((e.clientY-rect.top)/rect.height)*100;let label={bos:'BOS',choch:'CHOCH',liquidity:'LIQUIDEZ',poi:'POI',note:'NOTA'}[activeTool];if(activeTool==='note'){const text=prompt('Texto de la nota:');if(!text)return;label=text.slice(0,36)}state.annotations.push({id:crypto.randomUUID(),type:activeTool,label,x,y});update();save();});
function renderAnnotations(){const root=$('#annotations');root.innerHTML='';state.annotations.forEach(a=>{const el=document.createElement('button');el.className='annotation';el.dataset.type=a.type;el.style.left=a.x+'%';el.style.top=a.y+'%';el.textContent=a.label;el.title='Clic para eliminar';el.addEventListener('click',e=>{e.stopPropagation();if(activeTool==='select'){state.annotations=state.annotations.filter(x=>x.id!==a.id);update();save();}});root.appendChild(el);});}
$('#clearAnnotations').addEventListener('click',()=>{if(!state.annotations.length)return;state.annotations=[];update();save();toast('Anotaciones eliminadas');});

$('#exportButton').addEventListener('click',()=>{const payload={...state,image:state.image||''};const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`${state.instrument||'analisis'}-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(a.href);toast('Análisis exportado');});
$('#importButton').addEventListener('click',()=>$('#importInput').click());
$('#importInput').addEventListener('change',e=>{const reader=new FileReader();reader.onload=()=>{try{state={...defaults,...JSON.parse(reader.result)};update();save();toast('Análisis importado');}catch{toast('El archivo no es válido')}};if(e.target.files[0])reader.readAsText(e.target.files[0]);});
$('#newAnalysis').addEventListener('click',()=>{if(!confirm('¿Crear un análisis nuevo? El actual seguirá disponible si lo exportás primero.'))return;state={...defaults,annotations:[],checks:[]};update();save();toast('Nuevo análisis listo');});
load();

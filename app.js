AcaciaLogin.init({app:'meet',name:'Acacia Meet',color:'#6d28d9',price:800,landing:'landing.html'});
/* Dark mode: follows the device setting until the toggle is used; choice is remembered. */
(function(){var K='acacia_theme',r=document.documentElement,b=document.createElement('button');
function cur(){var s;try{s=localStorage.getItem(K)}catch(e){}return s||(window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')}
function set(t){r.setAttribute('data-theme',t);b.textContent=t=='dark'?'\u2600\uFE0F':'\uD83C\uDF19';b.title=t=='dark'?'Switch to light mode':'Switch to dark mode';b.setAttribute('aria-label',b.title)}
b.id='themeBtn';b.type='button';b.onclick=function(){var t=cur()=='dark'?'light':'dark';try{localStorage.setItem(K,t)}catch(e){}set(t)};
set(cur());document.body.appendChild(b)})();
const R='Team Member,Guest Participant,Meeting Host,Meeting Co-host,Organization Administrator,Super Administrator';
const Y='Daily,Weekly,Monthly';
const MODS=[['Dashboard',null],
['Meetings',{StartJoin:'*',Schedule:'Title|Date|date|Time|time|Access|s:Private,Public|Password|Waiting room|s:On,Off|Repeat|s:None,'+Y+'|Code|code',History:'ro:Title|Code|Started|Minutes|number|Attendees'}],
['Calendar',{Schedules:'ro@Meetings/Schedule',Reminders:'Reminder|Date|date|Time|time|Remind before|s:5 minutes,15 minutes,1 hour,1 day'}],
['Team',{Members:'Name|Email|Department|Role|s:'+R,Departments:'Department|Lead',Invitations:'Email|Role|s:'+R+'|Status|s:Sent,Accepted,Declined'}],
['Contacts',{Directory:'Name|Email|Phone|Company'}],
['Chat',{DirectMessages:'To|Message|Sent|now',GroupConversations:'Group|Message|Sent|now'}],
['Notes',{PersonalNotes:'Title|Note|Date|now',MeetingNotes:'ro:Meeting|Notes|Date'}],
['Recordings',{Library:'ro:Title|Date|Size|Ref'}],
['Screen Sharing',{Share:'*'}],
['Polls',{Polls:'Question|Option 1|Option 2|Option 3|Option 4'}],
['Files',{Documents:'*'}],
['Inventory',{Stock:'Item|SKU|Warehouse|Quantity|number|Buying price|number|Selling price|number',Movement:'Item|Type|s:In,Out,Transfer,Adjustment|Quantity|number|Date|date|Reference',PriceList:'Item|SKU|Buying price|number|Selling price|number',Amendments:'Item|Field changed|Old value|New value|Date|date',BundleItems:'Bundle|Components|Selling price|number',BulkAdjustments:'Item|Adjustment|s:Increase,Decrease|Quantity|number|Reason|Date|date',Packages:'Order|Item|Quantity|number|Status|s:Packed,Ready,Dispatched',Shipments:'Package|Carrier|Date|date|Status|s:Pending,In transit,Delivered'}],
['Settings',{Profile:'#Name|Role|s:'+R,Audio:'#Noise suppression|s:On,Off|Microphone on at join|s:On,Off',Video:'#Camera on at join|s:On,Off|Mirror my video|s:On,Off',Security:'#Waiting room by default|s:On,Off|Password for new meetings|s:No,Yes',Appearance:'*'}],
['Help Center',{Guides:'*'}]];
const parse=s=>{s=s.replace(/^(ro:|#|ro@.*$)/,'');const p=s.split('|'),f=[];for(let i=0;i<p.length;i++){const l=p[i],t=p[i+1]||'text';if(/^(date|time|number|now|code)$/.test(t)||t.startsWith('s:')){f.push({l,t,o:t.startsWith('s:')?t.slice(2).split(','):0});i++}else f.push({l,t:'text'})}return f};
const E=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const lab=s=>s.replace(/([a-z])([A-Z])/g,'$1 $2');
let DB;try{DB=JSON.parse(localStorage.getItem('acacia_meet_'+AcaciaLogin.companyId()))}catch(e){}if(!DB)DB={};
const save=()=>{try{localStorage.setItem('acacia_meet_'+AcaciaLogin.companyId(),JSON.stringify(DB))}catch(e){}};
const D=k=>DB[k]||(DB[k]=[]);const cfg=(s,i,d)=>(DB['cfg'+s]||[])[i]||d;
const today=new Date().toISOString().slice(0,10);const blobs={};
let mod='Dashboard',sub=null,q='';
function nav(){document.getElementById('nav').innerHTML='<div class="brand"><img src="logo.png" alt="Acacia logo" class="logo">Acacia Meet</div>'+MODS.map(m=>'<button class="'+(m[0]==mod?'on active':'')+'" onclick="go(\''+m[0]+'\')">'+m[0]+'</button>').join('')}
function go(m){mod=m;sub=null;q='';document.getElementById('nav').classList.remove('open');render()}
function formHTML(f,vals){return f.filter(x=>x.t!='now'&&x.t!='code').map((x,i)=>'<div><label>'+x.l+'</label>'+(x.o?'<select name="'+x.l+'">'+x.o.map(o=>'<option'+(vals&&vals[f.indexOf(x)]==o?' selected':'')+'>'+o+'</option>').join('')+'</select>':'<input name="'+x.l+'" type="'+x.t+'" value="'+(vals?E(vals[f.indexOf(x)]||''):'')+'"'+(x.l=='Password'?'':' required')+'>')+'</div>').join('')}
function render(){nav();const el=document.getElementById('main'),M=MODS.find(m=>m[0]==mod);let h='<h1>'+mod+'</h1>';
if(!M[1]){const hist=D('Meetings/History'),up=D('Meetings/Schedule').filter(r=>r[1]>=today);
h+='<div class="grid">'+[['Meetings held',hist.length],['Upcoming meetings',up.length],['Minutes in meetings',hist.reduce((a,r)=>a+r[3],0)],['Recordings',D('Recordings/Library').length],['Team members',D('Team/Members').length],['Polls',D('Polls/Polls').length]].map(s=>'<div class="st"><b>'+s[1]+'</b><span>'+s[0]+'</span></div>').join('')+'</div><div class="box"><h3>Attendance report</h3>'+(hist.length?'<div class="wrap"><table><tr><th>Meeting</th><th>Started</th><th>Minutes</th><th>Attended</th><th>Names</th></tr>'+hist.map(r=>'<tr><td>'+E(r[0])+'</td><td>'+E(r[2])+'</td><td>'+r[3]+'</td><td>'+r[4].split(', ').length+'</td><td>'+E(r[4])+'</td></tr>').join('')+'</table></div>':'<div class="empty">No meetings held yet. Open Meetings to start or schedule one.</div>')+'</div>';el.innerHTML=h;return}
const subs=Object.keys(M[1]);if(!sub||!subs.includes(sub))sub=subs[0];
h+='<div class="tabs">'+subs.map(s=>'<button class="'+(s==sub?'on':'')+'" onclick="sub=\''+s+'\';q=\'\';render()">'+lab(s)+'</button>').join('')+'</div>';
const def=M[1][sub];
if(def=='*')h+=special();
else if(def[0]=='#'){const f=parse(def);h+='<div class="box"><form onsubmit="setSave(event)">'+formHTML(f,DB['cfg'+sub])+'<button class="btn">Save '+lab(sub).toLowerCase()+' settings</button></form></div>'}
else{const ro=/^ro/.test(def);if(!ro)h+='<div class="box"><form onsubmit="add(event)">'+formHTML(parse(def))+'<button class="btn">Add</button></form></div>';
h+='<div class="box"><div style="max-width:280px;margin-bottom:10px"><input placeholder="Search" value="'+E(q)+'" oninput="q=this.value;list()"></div><div class="wrap" id="list"></div></div>'}
el.innerHTML=h;if(document.getElementById('list'))list()}
const keyOf=()=>{const d=MODS.find(m=>m[0]==mod)[1][sub],a=d.match(/^ro@(.*)$/);return a?a[1]:mod+'/'+sub}
function list(){const d=MODS.find(m=>m[0]==mod)[1][sub],key=keyOf();let f=parse(/^ro@/.test(d)?MODS[1][1].Schedule:d);const L=document.getElementById('list');
if(key=='Polls/Polls'){const rows=D(key);L.innerHTML=rows.length?rows.map((r,i)=>{const v=r.slice(5).map(Number),t=v.reduce((a,b)=>a+b,0)||1;return '<div class="box"><b>'+E(r[0])+'</b> <button class="del" onclick="rm('+i+')">Delete</button>'+[1,2,3,4].filter(j=>r[j]).map(j=>'<div style="margin:6px 0"><button class="lnk" onclick="vote('+i+','+j+')">Vote</button> '+E(r[j])+' – '+v[j-1]+' vote(s)<div class="bar" style="width:'+Math.round(100*v[j-1]/t)+'%"></div></div>').join('')+'</div>'}).join(''):'<div class="empty">No polls yet. Add a question above.</div>';return}
const rows=D(key).map((r,i)=>[r,i]).filter(([r])=>r.join(' ').toLowerCase().includes(q.toLowerCase())),ro=/^ro@/.test(d);
const isMeet=key=='Meetings/Schedule',isRec=key=='Recordings/Library';
L.innerHTML=rows.length?'<table><tr>'+f.map(x=>'<th>'+x.l+'</th>').join('')+(isMeet?'<th>Link</th><th></th>':isRec?'<th></th>':'')+'<th></th></tr>'+rows.map(([r,i])=>'<tr>'+f.map((x,j)=>'<td>'+E(r[j]??'')+'</td>').join('')+(isMeet?'<td>'+(r[3]=='Public'?'Public':'Private')+' link: #'+r[7]+'</td><td><button class="lnk" onclick="startM('+i+')">Start</button></td>':isRec?'<td>'+(blobs[r[3]]?'<a class="lnk" download="'+E(r[0])+'.webm" href="'+blobs[r[3]]+'">Download</a>':'Saved on your device')+'</td>':'')+(ro?'<td></td>':'<td><button class="del" onclick="rm('+i+')">Delete</button></td>')+'</tr>').join('')+'</table>':'<div class="empty">Nothing here yet.</div>'}
function add(e){e.preventDefault();const M=MODS.find(m=>m[0]==mod),f=parse(M[1][sub]),fd=new FormData(e.target),key=mod+'/'+sub;
const row=f.map(x=>x.t=='now'?new Date().toLocaleString():x.t=='code'?[0,1,2].map(()=>Math.random().toString(36).slice(2,5)).join('-'):x.t=='number'?Number(fd.get(x.l)):fd.get(x.l));
if(key=='Polls/Polls')row.push(0,0,0,0);D(key).unshift(row);save();render()}
function rm(i){if(confirm('Delete this record?')){D(keyOf()).splice(i,1);save();render()}}
function vote(i,j){D('Polls/Polls')[i][4+j]++;save();list()}
function setSave(e){e.preventDefault();const f=parse(MODS.find(m=>m[0]==mod)[1][sub]),fd=new FormData(e.target);DB['cfg'+sub]=f.map(x=>fd.get(x.l));save();alert('Settings saved.')}
function special(){
if(sub=='Appearance')return '<div data-acacia-appearance></div>';
if(mod=='Meetings')return '<div class="two"><div class="box"><h3>Start a meeting now</h3><div class="row"><div><label>Meeting title</label><input id="it" placeholder="Team catch-up"></div><button class="btn" onclick="startNow()">Start meeting</button></div></div><div class="box"><h3>Join a meeting</h3><div class="row"><div><label>Meeting code</label><input id="jc"></div><div><label>Password (if required)</label><input id="jp"></div><div><label>Your name</label><input id="jn" value="'+E(cfg('Profile',0,''))+'"></div><button class="btn" onclick="joinM()">Join meeting</button></div></div></div>';
if(mod=='Screen Sharing')return '<div class="box"><p>Share your screen or a presentation window. Use the Share screen button inside a meeting to present to participants.</p><button class="btn" onclick="prev()">Start screen share preview</button> <button class="btn o" onclick="stopPrev()">Stop</button><video id="pv" autoplay muted playsinline style="width:100%;max-height:360px;margin-top:10px;background:#000;border-radius:10px;display:none"></video></div>';
if(mod=='Files')return '<div class="box"><input type="file" id="fi" multiple style="max-width:320px"> <button class="btn" onclick="upl()">Add files</button><p style="color:var(--mute);font-size:13px">File names and sizes are listed here; the files stay on your device.</p><div class="wrap">'+(D('Files/Documents').length?'<table><tr><th>File</th><th>Size</th><th>Added</th><th></th></tr>'+D('Files/Documents').map((r,i)=>'<tr><td>'+E(r[0])+'</td><td>'+r[1]+'</td><td>'+r[2]+'</td><td><button class="del" onclick="D(\'Files/Documents\').splice('+i+',1);save();render()">Remove</button></td></tr>').join('')+'</table>':'<div class="empty">No files yet.</div>')+'</div></div>';
return '<div class="box"><h3>Start a meeting</h3><p>Open Meetings → Start & Join, enter a title and select Start meeting. Allow camera and microphone when your browser asks.</p><h3>Schedule and invite</h3><p>Use Meetings → Schedule to set a date, access type, password, waiting room and repeat. Share the meeting code with guests.</p><h3>Recording</h3><p>Select Record in the meeting. When you stop, the recording downloads to your device and appears in Recordings.</p><h3>Roles</h3><p>Only hosts, co-hosts and administrators can mute, remove or admit participants. Set your role in Settings → Profile.</p></div>'}
let pvs;async function prev(){try{pvs=await navigator.mediaDevices.getDisplayMedia({video:true});const v=document.getElementById('pv');v.style.display='block';v.srcObject=pvs}catch(e){alert('Screen sharing was not started: '+e.message)}}
function stopPrev(){pvs&&pvs.getTracks().forEach(t=>t.stop());const v=document.getElementById('pv');if(v){v.srcObject=null;v.style.display='none'}}
function upl(){const fs=document.getElementById('fi').files;[...fs].forEach(f=>D('Files/Documents').unshift([f.name,(f.size/1024).toFixed(1)+' KB',new Date().toLocaleString()]));save();render()}
function startNow(){const t=document.getElementById('it').value.trim()||'Instant meeting';room({title:t,code:[0,1,2].map(()=>Math.random().toString(36).slice(2,5)).join('-'),wait:cfg('Security',0,'Off')})}
function startM(i){const r=D('Meetings/Schedule')[i];room({title:r[0],code:r[7],wait:r[5]})}
function joinM(){const c=document.getElementById('jc').value.trim(),m=D('Meetings/Schedule').find(r=>r[7]==c);if(!m){alert('No meeting found with that code. Check the code and try again.');return}
if(m[4]&&m[4]!=document.getElementById('jp').value){alert('Incorrect password.');return}room({title:m[0],code:c,wait:m[5],guest:document.getElementById('jn').value||'Guest'})}
let S;
async function room(m){const me=m.guest||cfg('Profile',0,'')||(AcaciaLogin.session()||{}).name||'You',role=cfg('Profile',1,'Meeting Host'),mgr=!/Team Member|Guest/.test(role)&&!m.guest;
S={m,me,mgr,parts:[],wait:[],t0:Date.now(),notes:'',chat:[],rec:null,chunks:[],sharing:0,ch:window.BroadcastChannel?new BroadcastChannel('acacia-meet-'+m.code):null};
try{S.cam=await navigator.mediaDevices.getUserMedia({video:true,audio:true})}catch(e){try{S.cam=await navigator.mediaDevices.getUserMedia({audio:true});S.err='Camera unavailable'}catch(e2){S.err='Camera and microphone unavailable'}}
if(S.cam){S.cam.getAudioTracks().forEach(t=>t.enabled=cfg('Audio',1,'On')=='On');S.cam.getVideoTracks().forEach(t=>t.enabled=cfg('Video',0,'On')=='On')}
if(S.ch)S.ch.onmessage=e=>{S.chat.push(e.data);if(S.tab=='Chat')pane()};
S.parts.push(me);S.tab='People';const r=document.getElementById('room');r.className='on';
r.innerHTML='<div class="rt"><span>'+E(m.title)+' · code '+m.code+(m.wait=='On'?' · waiting room on':'')+'</span><span id="clk"></span></div><div class="rb"><div class="gal" id="gal"></div><div class="side"><div class="tabs">'+['People','Chat','Notes','Polls'].map(t=>'<button onclick="S.tab=\''+t+'\';pane()" id="t'+t+'">'+t+'</button>').join('')+'</div><div class="pane" id="pane"></div></div></div><div class="ctl"><button id="bm" onclick="tg(\'a\')">Mute</button><button id="bc" onclick="tg(\'v\')">Camera off</button><button onclick="share()" id="bs">Share screen</button><button onclick="recT()" id="br">Record</button><button onclick="react(\'👍\')">👍</button><button onclick="react(\'👏\')">👏</button><button onclick="react(\'❤️\')">❤️</button><button onclick="react(\'😂\')">😂</button><button class="leave" onclick="leave()">Leave meeting</button></div>';
S.iv=setInterval(()=>{const c=document.getElementById('clk');if(c)c.textContent=Math.floor((Date.now()-S.t0)/60000)+' min'},5000);gal();pane()}
function gal(){const g=document.getElementById('gal');g.innerHTML='';S.parts.forEach((p,i)=>{const t=document.createElement('div');t.className='tile';if(i==0&&S.cam&&S.cam.getVideoTracks().length){const v=document.createElement('video');v.autoplay=v.muted=v.playsInline=true;v.srcObject=S.sharing?S.scr:S.cam;if(cfg('Video',1,'On')=='On'&&!S.sharing)v.style.transform='scaleX(-1)';t.appendChild(v)}else t.innerHTML='<div class="av">'+E(p[0]||'?').toUpperCase()+'</div>';t.insertAdjacentHTML('beforeend','<div class="nm">'+E(p)+(i==0?' (you)':'')+'</div>');g.appendChild(t)});if(S.err)g.insertAdjacentHTML('afterbegin','<div class="nm" style="position:static">'+S.err+'. Check browser permissions.</div>')}
function pane(){['People','Chat','Notes','Polls'].forEach(t=>{const b=document.getElementById('t'+t);if(b)b.className=t==S.tab?'on':''});const p=document.getElementById('pane');if(!p)return;
if(S.tab=='People'){p.innerHTML='<div class="row" style="margin-bottom:8px"><input id="np" placeholder="Participant name"><button class="btn" onclick="addP()">Add participant</button></div>'+(S.wait.length?'<b>Waiting room</b>'+S.wait.map((w,i)=>'<div>'+E(w)+' <button class="lnk" onclick="admit('+i+')">Admit</button> <button class="del" onclick="S.wait.splice('+i+',1);pane()">Deny</button></div>').join(''):'')+'<b>In meeting ('+S.parts.length+')</b>'+S.parts.map((n,i)=>'<div>'+E(n)+(i&&S.mgr?' <button class="del" onclick="S.parts.splice('+i+',1);gal();pane()">Remove</button>':'')+'</div>').join('')+(S.mgr?'':'<p style="color:#5b5470;font-size:13px">Only hosts, co-hosts and administrators can manage participants.</p>')}
if(S.tab=='Chat'){p.innerHTML=S.chat.map(c=>'<div class="msg"><b>'+E(c.n)+'</b>: '+E(c.t)+'</div>').join('')+'<div class="row"><input id="cm" placeholder="Type a message" onkeydown="if(event.key==\'Enter\')sendC()"><button class="btn" onclick="sendC()">Send</button></div>'}
if(S.tab=='Notes'){p.innerHTML='<textarea id="nt" rows="12" placeholder="Meeting notes. Saved to Notes when you leave." oninput="S.notes=this.value">'+E(S.notes)+'</textarea>'}
if(S.tab=='Polls'){const ps=D('Polls/Polls');p.innerHTML=ps.length?ps.map((r,i)=>'<div class="box"><b>'+E(r[0])+'</b>'+[1,2,3,4].filter(j=>r[j]).map(j=>'<div><button class="lnk" onclick="vote('+i+','+j+');pane()">Vote</button> '+E(r[j])+' – '+r[4+j]+'</div>').join('')+'</div>').join(''):'<div class="empty">No polls. Create one in Polls.</div>'}}
function addP(){const n=document.getElementById('np').value.trim();if(!n)return;if(S.m.wait=='On')S.wait.push(n);else{S.parts.push(n);gal()}pane()}
function admit(i){S.parts.push(S.wait.splice(i,1)[0]);gal();pane()}
function sendC(){const i=document.getElementById('cm'),t=i.value.trim();if(!t)return;const m={n:S.me,t};S.chat.push(m);if(S.ch)S.ch.postMessage(m);pane()}
function tg(k){if(!S.cam)return;const ts=k=='a'?S.cam.getAudioTracks():S.cam.getVideoTracks();ts.forEach(t=>t.enabled=!t.enabled);const on=ts[0]&&ts[0].enabled,b=document.getElementById(k=='a'?'bm':'bc');b.textContent=k=='a'?(on?'Mute':'Unmute'):(on?'Camera off':'Camera on');b.className=on?'':'off'}
async function share(){if(S.sharing){S.scr.getTracks().forEach(t=>t.stop());return}try{S.scr=await navigator.mediaDevices.getDisplayMedia({video:true});S.sharing=1;document.getElementById('bs').textContent='Stop sharing';S.scr.getVideoTracks()[0].onended=()=>{S.sharing=0;document.getElementById('bs').textContent='Share screen';gal()};gal()}catch(e){}}
function recT(){const b=document.getElementById('br');if(S.rec){S.rec.stop();return}const st=S.sharing?S.scr:S.cam;if(!st||!window.MediaRecorder){alert('Recording is not available: no camera or microphone stream.');return}
S.chunks=[];S.rec=new MediaRecorder(st);S.rec.ondataavailable=e=>e.data.size&&S.chunks.push(e.data);
S.rec.onstop=()=>{const bl=new Blob(S.chunks,{type:'video/webm'}),u=URL.createObjectURL(bl),id='r'+Date.now();blobs[id]=u;D('Recordings/Library').unshift([S.m.title,new Date().toLocaleString(),(bl.size/1048576).toFixed(1)+' MB',id]);save();const a=document.createElement('a');a.href=u;a.download=S.m.title+'.webm';a.click();S.rec=null;b.textContent='Record';b.className=''};
S.rec.start();b.textContent='Stop recording';b.className='off'}
function react(e){const s=document.createElement('div');s.className='fl';s.textContent=e;s.style.left=(30+Math.random()*40)+'%';document.body.appendChild(s);setTimeout(()=>s.remove(),2000)}
function leave(){if(!confirm('Leave this meeting?'))return;if(S.rec)S.rec.stop();[S.cam,S.scr].forEach(s=>s&&s.getTracks().forEach(t=>t.stop()));clearInterval(S.iv);
D('Meetings/History').unshift([S.m.title,S.m.code,new Date(S.t0).toLocaleString(),Math.max(1,Math.round((Date.now()-S.t0)/60000)),S.parts.join(', ')]);
if(S.notes.trim())D('Notes/MeetingNotes').unshift([S.m.title,S.notes,new Date().toLocaleString()]);save();if(S.ch)S.ch.close();document.getElementById('room').className='';document.getElementById('room').innerHTML='';render()}
render();

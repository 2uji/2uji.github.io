const firebaseConfig = {
  apiKey: "AIzaSyCGqLdJPckct5b2tmnMw07dxzwKvravKKI",
  authDomain: "reze-f1dcf.firebaseapp.com",
  databaseURL: "https://reze-f1dcf-default-rtdb.firebaseio.com",
  projectId: "reze-f1dcf",
  storageBucket: "reze-f1dcf.firebasestorage.app",
  messagingSenderId: "682614546253",
  appId: "1:682614546253:web:64733cbe77ac13cae9a104"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const messagesRef = db.ref('reze_chat');

const poster=document.getElementById('poster'),
      posterWrap=document.querySelector('.poster-wrap'),
      video=document.getElementById('bgVideo'),
      unmuteBtn=document.getElementById('unmute'),
      consoleOverlay=document.getElementById('consoleOverlay'),
      cloudPanel=document.getElementById('cloudPanel'),
      closeCloud=document.getElementById('closeCloud');

const chatPanel=document.getElementById('chatPanel'),
      chatMessages=document.getElementById('chatMessages'),
      chatInput=document.getElementById('chatInput'),
      chatSend=document.getElementById('chatSend'),
      closeChatBtn=document.getElementById('closeChatBtn'),
      clearChatBtn=document.getElementById('clearChatBtn'),
      nickBtn=document.getElementById('nickBtn');

const nickModal=document.getElementById('nickModal'),
      nickInput=document.getElementById('nickInput'),
      nickSave=document.getElementById('nickSave'),
      nickCancel=document.getElementById('nickCancel');

let consoleStarted=false;
let myNick=localStorage.getItem('reze_chat_nick')||('User-'+Math.floor(Math.random()*9000+1000));

poster.onclick=async()=>{
  poster.classList.add('fade-out');
  posterWrap.style.pointerEvents='none';
  setTimeout(async()=>{
    posterWrap.style.opacity='0';
    video.style.opacity='1'; video.style.display='block'; video.currentTime=0; video.muted=false;
    try{await video.play();}catch{video.controls=true;}
    unmuteBtn.style.display='none'; document.body.style.cursor='none';
    startConsole();
  },500);
};
unmuteBtn.onclick=async()=>{try{video.muted=false;if(video.paused)await video.play();unmuteBtn.style.display='none';}catch{}};

function startConsole(){
  if(consoleStarted) return; consoleStarted=true;
  consoleOverlay.style.display='block'; document.body.style.cursor='auto';
  let text='',input='',idx=0;
  const prompt='>',
        bootLines=['[SYS] Boot sequence initiated...','[OK] Loading environment variables...','[OK] Establishing neural link...','[INFO] Ready for input.'];

  const render=()=>{consoleOverlay.innerHTML=text+prompt+input+'<span class="cursor">█</span>'; consoleOverlay.scrollTop=consoleOverlay.scrollHeight;};
  const append=line=>{ if(line!==undefined && line!==null && line!==false) text+=line+'\n'; render(); };

  async function loadCloud(){
    append('[ACCESS] Connecting to cloud repository...');
    try{
      const res=await fetch('https://api.github.com/repos/2uji/cloud/contents/');
      const data=await res.json();
      const fileList=cloudPanel.querySelector('.file-list');
      fileList.innerHTML='';
      data.forEach(f=>{
        if(f.type==='file'){
          const div=document.createElement('div');
          div.className='file-item';
          div.innerHTML=`<span>${f.name}</span><a href="${f.download_url}" download>Download</a>`;
          fileList.appendChild(div);
        }
      });
      append('[OK] Cloud data synced successfully.');
    }catch{append('[ERROR] Failed to connect to cloud.');}
  }

  function escapeHtml(s){ return String(s).replace(/[&<>"']/g,(c)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  function renderChat(msg){
    const div=document.createElement('div');
    const cls=(msg.nick===myNick)?'msg me':'msg they';
    const time=new Date(msg.t).toLocaleTimeString();
    div.className=cls;
    div.innerHTML=`<div class="meta">${escapeHtml(msg.nick)} · ${time}</div><div class="text">${escapeHtml(msg.text)}</div>`;
    chatMessages.appendChild(div);
    chatMessages.scrollTop=chatMessages.scrollHeight;
  }

  function sendMessage(text){
    if(!text||!text.trim())return;
    messagesRef.push({nick:myNick,text:text.trim(),t:Date.now()});
  }

  chatSend.addEventListener('click',()=>{ sendMessage(chatInput.value); chatInput.value=''; chatInput.focus(); });
  chatInput.addEventListener('keydown',e=>{ if(e.key==='Enter'){ e.preventDefault(); sendMessage(chatInput.value); chatInput.value=''; } });

  function openChat(){ chatPanel.style.display='block'; chatPanel.setAttribute('aria-hidden','false'); chatInput.focus(); }
  function closeChat(){ chatPanel.style.display='none'; chatPanel.setAttribute('aria-hidden','true'); }
  closeChatBtn.addEventListener('click',()=>{ closeChat(); });
  clearChatBtn.addEventListener('click',()=>{
    if(!confirm('Clear chat history?')) return;
    messagesRef.remove();
    chatMessages.innerHTML='';
  });
  nickBtn.addEventListener('click',()=>{
    nickInput.value=myNick;
    nickModal.style.display='block';
    nickInput.focus();
  });
  nickSave.addEventListener('click',()=>{
    const newNick=nickInput.value.trim();
    if(newNick){ myNick=newNick; localStorage.setItem('reze_chat_nick', myNick); }
    nickModal.style.display='none';
  });
  nickCancel.addEventListener('click',()=>{ nickModal.style.display='none'; });
  nickInput.addEventListener('keydown',e=>{
    if(e.key==='Enter'){ e.preventDefault(); nickSave.click(); }
    if(e.key==='Escape'){ e.preventDefault(); nickCancel.click(); }
  });

  messagesRef.on('child_added', snapshot => { renderChat(snapshot.val()); });

  document.addEventListener('keydown',e=>{
    if(consoleOverlay.style.display!=='block')return;
    const activeEl=document.activeElement;
    if(activeEl && (activeEl.tagName==='INPUT'||activeEl.id==='chatInput'))return;
    if(e.key==='Backspace') input=input.slice(0,-1);
    else if(e.key.length===1) input+=e.key;
    else if(e.key==='Enter'){
      append(prompt+input);
      const cmd=input.toLowerCase().trim();
      if(cmd==='mute'){video.muted=!video.muted; append(`[INFO] Video is now ${video.muted?'muted':'unmuted'}.`);}
      else if(cmd==='cloud'){cloudPanel.style.display='block'; append('[ACCESS] Cloud panel opened.'); loadCloud();}
      else if(cmd==='chat'){openChat(); append('[CHAT] Chat panel opened.');}
      else if(cmd==='clear'){text=''; render();}
      else if(cmd==='help'){append('[HELP] Commands: mute, cloud, chat, clear, help, sysinfo');}
      else if(cmd==='sysinfo'){
        append('[SYSINFO]');
        append('  User Agent: '+navigator.userAgent);
        append('  Screen: '+screen.width+'x'+screen.height);
        append('  Language: '+navigator.language);
        append('  Platform: '+(navigator.platform||'unknown'));
      }
      else if(cmd.length>0) append('[ERROR] Unknown command: '+cmd);
      input='';
    }
    render();
  });

  const boot=setInterval(()=>{ append(bootLines[idx]); if(++idx>=bootLines.length){ clearInterval(boot); append(); }},800);
  closeCloud.onclick=()=>{ cloudPanel.style.display='none'; };
  render();
}

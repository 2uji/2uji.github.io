const el = id => document.getElementById(id)
const zero = el('zero')
const pwdBox = el('passwordToggle')
const pwdInput = el('passwordInput')
const submitBtn = el('submitPassword')
const errMsg = el('errorMsg')
const container = el('container')
const cutScene = el('cutScene')
const reze1 = el('reze1')
const reze2 = el('reze2')
const vid = el('video-bg')
const gom = el('gom')

async function sha256(str){
  const buf=new TextEncoder().encode(str)
  const hash=await crypto.subtle.digest('SHA-256',buf)
  return Array.from(new Uint8Array(hash)).map(b=>b.toString(16).padStart(2,'0')).join('')
}
const correct='e65f0dea598d37fd645ffca389c0846c431cfed03b919388e03c70a6ce8627a2'

zero.onclick=()=>{
  pwdBox.style.display='flex'
  pwdBox.style.opacity='1'
  pwdInput.value=''
  errMsg.style.display='none'
  pwdInput.focus()
}
pwdInput.addEventListener('keydown',e=>{
  if(e.key==='Enter')submitBtn.click()
})
submitBtn.onclick=async()=>{
  const val=pwdInput.value.trim()
  const hash=await sha256(val)
  if(hash===correct)startCut()
  else{
    errMsg.style.display='block'
    pwdInput.value=''
    pwdInput.focus()
  }
}

function startCut(){
  container.style.transition='opacity .6s'
  pwdBox.style.transition='opacity .6s'
  container.style.opacity=0
  pwdBox.style.opacity=0
  document.body.style.background='#0d0d0d'
  document.body.style.color='#eee'

  const fade=document.createElement('div')
  fade.style.position='fixed'
  fade.style.inset='0'
  fade.style.background='#000'
  fade.style.opacity='0'
  fade.style.transition='opacity .8s'
  fade.style.zIndex='15'
  document.body.appendChild(fade)
  setTimeout(()=>fade.style.opacity='1',200)

  setTimeout(()=>{
    container.style.display='none'
    pwdBox.style.display='none'
    cutScene.style.display='flex'
    cutScene.style.opacity='1'
    document.body.removeChild(fade)
    showReze1()
  },1100)
}

function showReze1(){
  setTimeout(()=>reze1.style.opacity=1,200)
  reze1.addEventListener('click',()=>{
    vid.muted=false
    vid.style.display='block'
    vid.style.opacity='0'
    vid.style.transition='opacity 1.8s ease'
    vid.play().catch(()=>{})
    setTimeout(()=>vid.style.opacity='1',100)
  },{once:true})
  cutScene.addEventListener('click',showReze2,{once:true})
}

function showReze2(){
  reze2.style.transition='opacity 1.2s ease-out'
  reze2.style.opacity=1
  setTimeout(()=>{
    new Audio('assets/Bomb!.mp3').play()
    fadeOutImgs()
  },1300)
}

function fadeOutImgs(){
  reze1.style.transition='opacity 2.5s ease-in'
  reze2.style.transition='opacity 2.5s ease-in'
  reze1.style.opacity=0
  reze2.style.opacity=0
  setTimeout(()=>{
    cutScene.style.display='none'
    launchRezeScene()
  },2700)
}

function launchRezeScene(){
  vid.style.display='block'
  vid.style.opacity='0'
  vid.style.transition='opacity 2s ease'
  vid.play().catch(()=>{})
  setTimeout(()=>vid.style.opacity='1',100)
  gom.style.display='block'
  moveGom()
}

function rand(min,max){return Math.random()*(max-min)+min}
function randSign(){return Math.random()<0.5?-1:1}

let vw=window.innerWidth,vh=window.innerHeight
let x=rand(0.2*vw,0.7*vw)
let y=rand(0.2*vh,0.7*vh)
let vx=rand(0.4,1.0)*randSign()
let vy=rand(0.4,1.0)*randSign()
let rot=rand(0,360)
let rotSpeed=rand(-2,2)

function moveGom(){
  vw=window.innerWidth;vh=window.innerHeight
  x+=vx;y+=vy
  const w=gom.offsetWidth,h=gom.offsetHeight
  if(x<0||x>vw-w){vx*=-1;vx+=rand(-0.3,0.3)}
  if(y<0||y>vh-h){vy*=-1;vy+=rand(-0.3,0.3)}
  rot+=rotSpeed
  gom.style.left=`${x}px`
  gom.style.top=`${y}px`
  gom.style.transform=`rotate(${rot}deg)`
  requestAnimationFrame(moveGom)
}

gom.addEventListener('click',()=>{
  window.open("https://discord.com/oauth2/authorize?client_id=1426139711507923057&permissions=274878221440&scope=bot%20applications.commands","_blank")
})

const el = id => document.getElementById(id)
const zero = el('zero')
const pwdBox = el('passwordToggle')
const pwdInput = el('passwordInput')
const submitBtn = el('submitPassword')
const errMsg = el('errorMsg')
const container = el('container')
const cutScene = el('cutScene')
const yunyun = el('yunyun')
const vid = el('video-bg')
const discord = el('discord')
const muteBtn = el('muteBtn')

async function sha256(str) {
  const buf = new TextEncoder().encode(str)
  const hash = await crypto.subtle.digest('SHA-256', buf)
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
}

const correct = '621cddf6391aeff30ae73abc836da66074688774e1d72a5a2445e4ec9fbfc2f0'

zero.onclick = () => {
  pwdBox.style.display = 'flex'
  pwdBox.style.opacity = '1'
  pwdInput.value = ''
  errMsg.style.display = 'none'
  pwdInput.focus()
}

pwdInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') submitBtn.click()
})

submitBtn.onclick = async () => {
  const val = pwdInput.value.trim()
  const hash = await sha256(val)
  if (hash === correct) startCut()
  else {
    errMsg.style.display = 'block'
    pwdInput.value = ''
    pwdInput.focus()
  }
}

function setCursor() {
  document.body.classList.add('custom-cursor')
}

function startCut() {
  // 이미지 씬 진입 시 커스텀 커서 적용
  setCursor('cursor.cur')

  // 먼저 컨테이너/비번창 페이드아웃
  container.style.transition = 'opacity .6s'
  pwdBox.style.transition = 'opacity .6s'
  container.style.opacity = 0
  pwdBox.style.opacity = 0
  document.body.style.background = '#0d0d0d'
  document.body.style.color = '#eee'

  // 블랙 오버레이로 완전히 가린 뒤 씬 전환
  const fade = document.createElement('div')
  fade.style.cssText = 'position:fixed;inset:0;background:#000;opacity:0;transition:opacity .8s;z-index:15;'
  document.body.appendChild(fade)

  setTimeout(() => fade.style.opacity = '1', 200)

  setTimeout(() => {
    container.style.display = 'none'
    pwdBox.style.display = 'none'
    // 비디오는 아직 숨김 상태 유지, preload="none"이라 재생도 안 됨
    document.body.removeChild(fade)
    cutScene.style.display = 'flex'
    cutScene.style.opacity = '1'
    showYunyun()
  }, 1100)
}

function showYunyun() {
  setTimeout(() => (yunyun.style.opacity = 1), 200)

  yunyun.addEventListener('click', () => {
    // yunyun.png 클릭 시 영상 + 소리 재생, 씬 전환
    vid.muted = false
    vid.preload = 'auto'
    vid.load()
    vid.play().catch(() => {})

    // 씬 페이드아웃 후 영상 표시
    cutScene.style.transition = 'opacity 1s ease'
    cutScene.style.opacity = '0'

    setTimeout(() => {
      cutScene.style.display = 'none'
      launchMainScene()
    }, 1000)
  }, { once: true })
}

function launchMainScene() {
  vid.style.display = 'block'
  vid.style.opacity = '0'
  vid.style.transition = 'opacity 2s ease'
  setTimeout(() => vid.style.opacity = '1', 50)

  // 영상 페이드인과 동일한 타이밍에 UI 요소 등장
  muteBtn.style.display = 'block'
  setTimeout(() => muteBtn.style.opacity = '1', 50)

  const marketPanel = document.getElementById('marketPanel')
  marketPanel.style.display = 'block'
  setTimeout(() => marketPanel.style.opacity = '1', 50)

  const charaWidget = document.getElementById('charaWidget')
  charaWidget.style.display = 'flex'
  setTimeout(() => charaWidget.style.opacity = '1', 50)

  discord.style.display = 'block'
  moveGom()
}

muteBtn.addEventListener('click', () => {
  vid.muted = !vid.muted
  muteBtn.classList.toggle('muted', vid.muted)
})

function rand(min, max) { return Math.random() * (max - min) + min }
function randSign() { return Math.random() < 0.5 ? -1 : 1 }

let vw = window.innerWidth, vh = window.innerHeight
let x = rand(0.2 * vw, 0.7 * vw)
let y = rand(0.2 * vh, 0.7 * vh)
let vx = rand(0.4, 1.0) * randSign()
let vy = rand(0.4, 1.0) * randSign()
let rot = rand(0, 360)
let rotSpeed = rand(-2, 2)

function moveGom() {
  vw = window.innerWidth; vh = window.innerHeight
  x += vx; y += vy
  const w = discord.offsetWidth, h = discord.offsetHeight
  if (x < 0 || x > vw - w) { vx *= -1; vx += rand(-0.3, 0.3) }
  if (y < 0 || y > vh - h) { vy *= -1; vy += rand(-0.3, 0.3) }
  rot += rotSpeed
  discord.style.left = `${x}px`
  discord.style.top = `${y}px`
  discord.style.transform = `rotate(${rot}deg)`
  requestAnimationFrame(moveGom)
}

discord.addEventListener('click', () => {
  window.open("https://discord.com/oauth2/authorize?client_id=1426139711507923057&permissions=274878221440&scope=bot%20applications.commands", "_blank")
})